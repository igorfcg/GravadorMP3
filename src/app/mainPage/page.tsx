import AudioRecorder from "@/components/mainComponents/audio-recorder"
import { ToastProvider } from "../../components/ui-base"


export default function Home() {
  return (
    <ToastProvider>
      <main className="min-h-screen">
        <AudioRecorder />
  
      </main>
    </ToastProvider>
  )
}
