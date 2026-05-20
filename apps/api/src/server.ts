import 'dotenv/config'
import { createApp } from './app.js'

const port = Number(process.env.PORT ?? 3002)
const app = createApp()

app.listen(port, () => {
  console.log(`[expertech-cv-api] listening on http://localhost:${port}`)
  console.log(`[expertech-cv-api] storage: in-memory (no DB until Fase 6)`)
})
