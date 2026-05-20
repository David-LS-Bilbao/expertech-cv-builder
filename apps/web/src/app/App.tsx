import { createInitialCVState } from '../lib/domain/createInitialCVState'

function App() {
  const cv = createInitialCVState()

  return (
    <main>
      <h1>EXPERTECH CV</h1>
      <p className="version">V2 · React + TypeScript</p>
      <ul className="status">
        <li>✓ Vite + React + TypeScript scaffold</li>
        <li>✓ Domain models — CV schema v{cv.meta.version}</li>
        <li>✓ SafeStorage (localStorage → sessionStorage → memory)</li>
        <li>✓ Legacy MVP intacto</li>
        <li>○ Tailwind + design tokens — siguiente paso</li>
      </ul>
    </main>
  )
}

export default App
