// "use client"

// import { useEffect, useRef } from "react"

// interface AudioWaveformProps {
//   currentTime: number
//   audioData: Float32Array | null
//   isRecording: boolean
// }

// export default function AudioWaveform({ currentTime, audioData, isRecording }: AudioWaveformProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const animationRef = useRef<number>()
//   const previousDataRef = useRef<Float32Array | null>(null)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     // Set canvas dimensions with higher resolution for sharper rendering
//     canvas.width = canvas.offsetWidth * 2
//     canvas.height = canvas.offsetHeight * 2
//     ctx.scale(2, 2) // Scale for high DPI displays

//     const drawWaveform = () => {
//       // Clear canvas
//       ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2)

//       // Set background
//       ctx.fillStyle = "#111111"
//       ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2)

//       const width = canvas.width / 2
//       const height = canvas.height / 2
//       const centerY = height / 2

//       if (audioData && audioData.length > 0) {
//         // Store current data for smoothing
//         if (!previousDataRef.current) {
//           previousDataRef.current = new Float32Array(audioData)
//         }

//         // Draw actual audio data
//         const sliceWidth = width / audioData.length

//         // Draw waveform path
//         ctx.beginPath()
//         ctx.lineWidth = 1.5
//         ctx.strokeStyle = isRecording ? "#ff4545" : "#3b82f6"

//         // Start at the left edge
//         ctx.moveTo(0, centerY)

//         // Draw the waveform with smoothing between frames
//         for (let i = 0; i < audioData.length; i++) {
//           // Apply smoothing between current and previous frame
//           const smoothingFactor = 0.3
//           let value = audioData[i]

//           if (previousDataRef.current) {
//             value = value * (1 - smoothingFactor) + previousDataRef.current[i] * smoothingFactor
//           }

//           const y = centerY + value * centerY * 0.95 // Scale to 95% of half height
//           const x = i * sliceWidth

//           if (i === 0) {
//             ctx.moveTo(x, y)
//           } else {
//             ctx.lineTo(x, y)
//           }

//           // Update previous data for next frame
//           if (previousDataRef.current) {
//             previousDataRef.current[i] = value
//           }
//         }

//         // Complete the path and stroke
//         ctx.lineTo(width, centerY)
//         ctx.stroke()

//         // Add a subtle reflection effect
//         ctx.strokeStyle = isRecording ? "rgba(255, 69, 69, 0.3)" : "rgba(59, 130, 246, 0.3)"
//         ctx.beginPath()
//         ctx.moveTo(0, centerY)

//         for (let i = 0; i < audioData.length; i++) {
//           const value = previousDataRef.current ? previousDataRef.current[i] : audioData[i]
//           const y = centerY - value * centerY * 0.5 // Reflected and smaller
//           const x = i * sliceWidth

//           if (i === 0) {
//             ctx.moveTo(x, y)
//           } else {
//             ctx.lineTo(x, y)
//           }
//         }

//         ctx.lineTo(width, centerY)
//         ctx.stroke()
//       } else {
//         // Draw placeholder waveform
//         ctx.strokeStyle = "#555555"
//         ctx.lineWidth = 1

//         const totalBars = 100
//         const barWidth = width / totalBars

//         for (let i = 0; i < totalBars; i++) {
//           // Generate random heights for the waveform
//           const height = Math.random() * (canvas.height / 2) * 0.6
//           const x = i * barWidth

//           ctx.beginPath()
//           ctx.moveTo(x, centerY - height / 2)
//           ctx.lineTo(x, centerY + height / 2)
//           ctx.stroke()
//         }
//       }

//       // Highlight the current position
//       const position = (currentTime / 18) * width
//       ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
//       ctx.lineWidth = 1
//       ctx.beginPath()
//       ctx.moveTo(position, 0)
//       ctx.lineTo(position, height)
//       ctx.stroke()

//       // Add time grid lines
//       ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
//       ctx.lineWidth = 1

//       for (let i = 0; i <= 18; i++) {
//         const x = (i / 18) * width
//         ctx.beginPath()
//         ctx.moveTo(x, 0)
//         ctx.lineTo(x, height)
//         ctx.stroke()
//       }
//     }

//     drawWaveform()

//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current)
//       }
//     }
//   }, [currentTime, audioData, isRecording])

//   return (
//     <div className="w-full h-24 mt-4 rounded-md overflow-hidden border border-gray-800">
//       <canvas ref={canvasRef} className="w-full h-full" />
//     </div>
//   )
// }
