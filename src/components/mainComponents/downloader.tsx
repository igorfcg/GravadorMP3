'use client'

import { useState } from 'react'

export default function Downloader() {
  const [filename, setFilename] = useState('')
  const [duration, setDuration] = useState(0)

  async function saveRecordingMeta(filename: string, duration: number) {
    const res = await fetch('/api/recordings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, duration }),
    })

    const data = await res.json()
    return data
  }

  async function handleFinalizarGravacao() {
    // Aqui você chama essa função quando a gravação terminar
    await saveRecordingMeta('meu-audio.mp3', 120) // exemplo
  }

  return (
    <button onClick={handleFinalizarGravacao}>
      Finalizar Gravação
    </button>
  )
}
