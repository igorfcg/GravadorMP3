import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST: salva uma nova gravação
export async function POST(req: Request) {
  const body = await req.json()
  const { filename, duration } = body

  const recording = await prisma.recordings.create({
    data: {
      filename,
      duration,
    },
  })

  return new Response(JSON.stringify(recording), {
    headers: { 'Content-Type': 'application/json' },
  })
}

// GET: retorna todas as gravações
export async function GET() {
  const recordings = await prisma.recordings.findMany({
    orderBy: { created_at: 'desc' }, // ordena do mais novo pro mais antigo
  })

  return new Response(JSON.stringify(recordings), {
    headers: { 'Content-Type': 'application/json' },
  })
}
