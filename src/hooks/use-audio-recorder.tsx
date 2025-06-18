/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useRef, useEffect } from "react"
import { formatTime } from "@/lib/utils"
import type { Recording } from "../components/mainComponents/recording-list"

export function useAudioRecorder() {
  const [recordings, setRecordings] = useState<Recording[]>([
    { id: 1, title: "Sample Recording", library: "library 1", duration: "00:05", blob: new Blob(), url: "" },
    { id: 2, title: "Voice Note", duration: "00:03", blob: new Blob(), url: "" },
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioData, setAudioData] = useState<Float32Array | null>(null)
  const [currentRecordingId, setCurrentRecordingId] = useState<number | null>(null)
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [maxRecordingTime] = useState(18) // Maximum recording time in seconds

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const volumeDataRef = useRef<Float32Array | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioElementRef.current = new Audio()
    audioElementRef.current.addEventListener("ended", () => {
      setIsPlaying(false)
      setCurrentRecordingId(null)
    })

    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause()
        audioElementRef.current.removeEventListener("ended", () => {})
      }
    }
  }, [])

  // Update time during playback with more precision
  useEffect(() => {
    if (isPlaying && audioElementRef.current) {
      const updatePlaybackTime = () => {
        if (audioElementRef.current) {
          setCurrentTime(audioElementRef.current.currentTime)
          animationFrameRef.current = requestAnimationFrame(updatePlaybackTime)
        }
      }

      animationFrameRef.current = requestAnimationFrame(updatePlaybackTime)

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [isPlaying])

  // Update time during recording
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000

        // If we've reached the maximum recording time, stop recording
        if (elapsed >= maxRecordingTime) {
          stopRecording()
        } else {
          setCurrentTime(elapsed)
        }
      }, 16) // ~60fps for smoother updates

      return () => clearInterval(interval)
    }
  }, [isRecording, maxRecordingTime])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMediaTracks()
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
    }
  }, [])

  const stopMediaTracks = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop())
    }
  }



  const startRecording = async () => {
    try {
      // Reset state
      setCurrentTime(0)
      setVolumeLevel(0)
      audioChunksRef.current = []

      // Initialize audio context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 44100 })
      } else if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume()
      }

      // Request microphone access with high quality
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false, // Better for visualization
          sampleRate: 44100,
          sampleSize: 16,
        },
      })
      audioStreamRef.current = stream

      // Set up analyzer for visualizing audio
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048 // Higher for better resolution
      analyserRef.current.smoothingTimeConstant = 0.2 // Less smoothing for more responsive viz

      // Connect audio source to analyzer
      audioSourceRef.current = audioContextRef.current.createMediaStreamSource(stream)
      audioSourceRef.current.connect(analyserRef.current)

      // Set up media recorder with better audio quality
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 128000, // 128kbps for better quality
      })

      // Start recording
      mediaRecorderRef.current.start(100) // Collect data every 100ms for smoother waveform
      startTimeRef.current = Date.now()
      setIsRecording(true)

      // Set up visualization
      const bufferLength = analyserRef.current.frequencyBinCount
      const timeDataArray = new Float32Array(bufferLength)
      volumeDataRef.current = new Float32Array(bufferLength)

      const updateWaveform = () => {
        if (!isRecording || !analyserRef.current) return

        // Get time domain data for waveform
        analyserRef.current.getFloatTimeDomainData(timeDataArray)

        // Copy data for volume calculation to avoid race conditions
        if (volumeDataRef.current) {
          volumeDataRef.current.set(timeDataArray)
        }

        // Calculate volume level
        const newVolumeLevel = calculateVolumeLevel(timeDataArray)
        setVolumeLevel(newVolumeLevel)

        // Update waveform data
        setAudioData(new Float32Array(timeDataArray))

        // Continue animation loop
        animationFrameRef.current = requestAnimationFrame(updateWaveform)
      }

      updateWaveform()

      // Handle data available event
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        const duration = formatTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const audioUrl = URL.createObjectURL(audioBlob)

        // Add new recording to list
        const newRecording: Recording = {
          id: Date.now(),
          title: `Recording ${recordings.length + 1}`,
          duration,
          blob: audioBlob,
          url: audioUrl,
        }

        setRecordings((prev) => [newRecording, ...prev])
      }
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setVolumeLevel(0)

      // Stop the visualization
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      // Stop all media tracks
      stopMediaTracks()

      // Disconnect audio nodes
      if (audioSourceRef.current) {
        audioSourceRef.current.disconnect()
      }
    }
  }

  const playRecording = (id?: number) => {
    // If no id is provided, play the most recent recording
    const recordingId = id || (recordings.length > 0 ? recordings[0].id : null)

    if (!recordingId) return

    // If already playing this recording, do nothing
    if (isPlaying && currentRecordingId === recordingId) return

    // If playing something else, stop it first
    if (isPlaying) {
      pausePlayback()
    }

    const recording = recordings.find((r) => r.id === recordingId)
    if (recording) {
      if (audioElementRef.current) {
        // Set the audio source to the recording URL
        audioElementRef.current.src = recording.url
        audioElementRef.current.currentTime = 0

        // Play the audio
        audioElementRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
            setCurrentRecordingId(recordingId)

            // Set up audio visualization during playback
            setupPlaybackVisualization(recording)
          })
          .catch((error) => {
            console.error("Error playing audio:", error)
          })
      }
    }
  }

  const setupPlaybackVisualization = async (recording: Recording) => {
    try {
      // Initialize audio context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      } else if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume()
      }

      // Set up analyzer
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 2048
        analyserRef.current.smoothingTimeConstant = 0.2
      }

      // Create audio source from audio element
      if (audioElementRef.current) {
        const source = audioContextRef.current.createMediaElementSource(audioElementRef.current)
        source.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)

        // Set up visualization
        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray = new Float32Array(bufferLength)

        const updatePlaybackWaveform = () => {
          if (!isPlaying || !analyserRef.current) return

          analyserRef.current.getFloatTimeDomainData(dataArray)

          // Calculate volume level
          const newVolumeLevel = calculateVolumeLevel(dataArray)
          setVolumeLevel(newVolumeLevel)

          // Update waveform data
          setAudioData(new Float32Array(dataArray))

          animationFrameRef.current = requestAnimationFrame(updatePlaybackWaveform)
        }

        updatePlaybackWaveform()
      }
    } catch (error) {
      console.error("Error setting up playback visualization:", error)
    }
  }

  const pausePlayback = () => {
    if (audioElementRef.current && isPlaying) {
      audioElementRef.current.pause()
      setIsPlaying(false)
      setVolumeLevel(0)

      // Stop visualization
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }

  const downloadRecording = async (id: number) => {
    const recording = recordings.find((r) => r.id === id)
    if (!recording) return false

    try {
      // Convert to MP3 if browser supports MediaRecorder with MP3
      const downloadBlob = recording.blob
      const fileName = `${recording.title.replace(/\s+/g, "_")}.webm`

      // For better compatibility, we'll use the original WebM format
      // which is widely supported and has good quality with the Opus codec

      // Create a download link and trigger it
      const a = document.createElement("a")
      a.href = URL.createObjectURL(downloadBlob)
      a.download = fileName
      document.body.appendChild(a)
      a.click()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(a.href)
      }, 100)

      return true
    } catch (error) {
      console.error("Error downloading recording:", error)
      return false
    }
  }

  return {
    recordings,
    isRecording,
    isPlaying,
    currentTime,
    audioData,
    currentRecordingId,
    volumeLevel,
    maxRecordingTime,
    startRecording,
    stopRecording,
    playRecording,
    pausePlayback,
    downloadRecording,
  }
}
