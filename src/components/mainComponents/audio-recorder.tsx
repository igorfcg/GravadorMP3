"use client"
import Link from 'next/link'



import { useState } from "react"
import { Button, Input, ToastAction, useToast } from "../ui-base"
import { SearchIcon, PlusIcon, InfoIcon } from "../icons"
import Downloader from "./downloader";
import AudioControls from "./audio-controls"
import RecordingsList from "./recording-list"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"

export default function AudioRecorder() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const {
    recordings,
    isRecording,
    isPlaying,
    currentTime,
    startRecording,
    stopRecording,
    playRecording,
    pausePlayback,
    currentRecordingId,
    maxRecordingTime,
    downloadRecording,
  } = useAudioRecorder()

  const handleDownload = async (id: number) => {
    const success = await downloadRecording(id)

    if (success) {
      toast({
        title: "Download complete",
        description: "Your recording has been downloaded successfully.",
        duration: 3000,
      })
    } else {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was a problem downloading your recording.",
        action: <ToastAction onClick={() => handleDownload(id)}>Try again</ToastAction>,
      })
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex">
        <div className="bg-amber-500 text-black py-2 px-4 w-72">
          <div className="font-bold">(logo) File</div>
          <div>To Record</div>
        </div>
        <div className="bg-black py-2 px-4 flex-1">
          <div>To listen</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Left panel - Recording controls */}
        <div className="w-72 bg-black p-4 relative">
          <AudioControls
            isRecording={isRecording}
            isPlaying={isPlaying}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onPlayRecording={playRecording}
            onPausePlayback={pausePlayback}
            currentTime={currentTime}
            maxTime={maxRecordingTime}
          />
          <Link href="/login">Ir para Login</Link>
        </div>

        {/* Right panel - Recordings list */}
        <div className="flex-1 border-l border-blue-500">
          <div className="flex justify-end p-4 gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                className="pl-8 bg-black border-gray-700 text-white"
                placeholder="search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-gray-700 text-white">
              <InfoIcon size={20} />
            </Button>
          
            <div className="relative group">
              <Button variant="outline" className="border-gray-700 text-white">
                <PlusIcon size={20} />
              </Button>
              <div className="absolute right-0 mt-1 hidden group-hover:block">
                <div className="bg-white text-black py-1 px-2 rounded shadow">create folder</div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <div className="bg-blue-900 text-white p-2 border-b border-blue-500">/ recents</div>
            <RecordingsList
              recordings={recordings}
              currentRecordingId={currentRecordingId}
              onPlayRecording={playRecording}
              onDownloadRecording={handleDownload}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
