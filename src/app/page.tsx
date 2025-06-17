import AudioRecorder from "@/components/audio-recorder"
import { ToastProvider } from "../components/ui-base"
import Gravador from "@/components/gravador"

export default function Home() {
  return (
    <ToastProvider>
      <main className="min-h-screen">
        <AudioRecorder />
  
      </main>
    </ToastProvider>
  )
}
