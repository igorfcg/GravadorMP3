"use client"

import { formatTime } from "@/lib/utils"
import { Button } from "./ui-base"
import { MicIcon, PauseIcon, PlayIcon, SquareIcon, InfoIcon } from "./icons"

interface AudioControlsProps {
  isRecording: boolean
  isPlaying: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onPlayRecording: () => void
  onPausePlayback: () => void
  currentTime: number
  maxTime?: number
}

export default function AudioControls({
  isRecording,
  isPlaying,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onPausePlayback,
  currentTime,
  maxTime = 18,
}: AudioControlsProps) {
  // Create time markers with more precision
  const timeMarkers = []
  const markerInterval = 3 // Show a marker every 3 seconds

  for (let i = 0; i <= maxTime; i += markerInterval) {
    timeMarkers.push(i)
  }

  // Add the last marker if it's not already included
  if (timeMarkers[timeMarkers.length - 1] !== maxTime) {
    timeMarkers.push(maxTime)
  }

  const handlePlayPauseClick = () => {
    if (isPlaying) {
      onPausePlayback()
    } else {
      onPlayRecording()
    }
  }

  const handleRecordClick = () => {
    if (isRecording) {
      onStopRecording()
    } else {
      onStartRecording()
    }
  }

  // Format time with milliseconds for more precision
  const formatTimeWithMs = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    const ms = Math.floor((time % 1) * 10)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms}`
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center space-x-8 mb-8 mt-64">
        <Button
          onClick={handlePlayPauseClick}
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
          disabled={isRecording}
        >
          {isPlaying ? <PauseIcon size={32} /> : <PlayIcon size={32} />}
        </Button>

        <div className="relative">
          <Button
            onClick={handleRecordClick}
            className={`w-20 h-20 rounded-full ${
              isRecording ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
            } flex items-center justify-center`}
          >
            <MicIcon size={48} />
          </Button>
          <div className="absolute -top-2 -right-2 bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center">
            <InfoIcon size={16} />
          </div>
        </div>

        <Button
          onClick={onStopRecording}
          className="w-14 h-14 rounded-full bg-black border border-gray-600 hover:bg-gray-800 flex items-center justify-center"
          disabled={!isRecording}
        >
          <SquareIcon size={24} />
        </Button>
      </div>

      <div className="w-full mt-4">
        {/* Current time display */}
        <div className="text-center mb-2 font-mono">
          <span className={`text-lg ${isRecording ? "text-red-500" : isPlaying ? "text-blue-500" : "text-white"}`}>
            {formatTimeWithMs(currentTime)}
          </span>
          <span className="text-gray-500 text-sm ml-1">/ {formatTime(maxTime)}</span>
        </div>

        {/* Time markers */}
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          {timeMarkers.map((time) => (
            <div key={time}>{formatTime(time)}</div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="relative w-full h-2 bg-gray-800 rounded overflow-hidden">
          <div
            className={`absolute h-full rounded transition-all duration-100 ${
              isRecording ? "bg-red-500" : "bg-blue-500"
            }`}
            style={{ width: `${Math.min((currentTime / maxTime) * 100, 100)}%` }}
          ></div>

          {/* Time markers on the progress bar */}
          <div className="absolute w-full flex justify-between -mt-1">
            {timeMarkers.map((time) => (
              <div key={time} className="h-4 w-px bg-gray-600" style={{ left: `${(time / maxTime) * 100}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
