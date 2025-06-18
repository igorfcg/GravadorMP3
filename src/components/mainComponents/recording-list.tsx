"use client"

import { useState } from "react"
import { Button, DropdownMenu, DropdownMenuItem } from "../ui-base"
import { PauseIcon, PlayIcon, DownloadIcon, MoreHorizontalIcon } from "../icons"

export interface Recording {
  id: number
  title: string
  library?: string
  duration: string
  blob: Blob
  url: string
}

interface RecordingsListProps {
  recordings: Recording[]
  currentRecordingId: number | null
  onPlayRecording: (id: number) => void
  onDownloadRecording?: (id: number) => void
}

export default function RecordingsList({
  recordings,
  currentRecordingId,
  onPlayRecording,
  onDownloadRecording,
}: RecordingsListProps) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const handleDownload = async (id: number) => {
    setDownloadingId(id)

    if (onDownloadRecording) {
      await onDownloadRecording(id)
    } else {
      // Fallback download method if not provided by parent
      const recording = recordings.find((r) => r.id === id)
      if (recording) {
        const a = document.createElement("a")
        a.href = recording.url
        a.download = `${recording.title}.webm`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    }

    setDownloadingId(null)
  }

  return (
    <div className="space-y-1">
      {recordings.map((recording) => (
        <div key={recording.id} className="flex items-center bg-gray-800 hover:bg-gray-700 p-2 group">
          <button
            className="flex items-center justify-center w-8 h-8 mr-2"
            onClick={() => onPlayRecording(recording.id)}
          >
            {currentRecordingId === recording.id ? (
              <PauseIcon size={20} className="text-red-500" />
            ) : (
              <PlayIcon size={20} className="text-red-500" />
            )}
          </button>
          <div className="flex-1">
            <div className="flex justify-between">
              <div className="text-sm">{recording.title}</div>
              <div className="text-xs text-gray-400">time: {recording.duration}</div>
            </div>
            {recording.library && <div className="text-xs text-gray-400">{recording.library}</div>}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleDownload(recording.id)}
              disabled={downloadingId === recording.id}
            >
              <DownloadIcon size={16} className={downloadingId === recording.id ? "animate-pulse" : ""} />
              <span className="sr-only">Download</span>
            </Button>

            <DropdownMenu
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontalIcon size={16} />
                  <span className="sr-only">More options</span>
                </Button>
              }
            >
              <DropdownMenuItem onClick={() => handleDownload(recording.id)}>Download</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>Rename</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>Move to folder</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={() => {}}>
                Delete
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
