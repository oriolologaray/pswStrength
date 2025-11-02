import { Route, Routes } from 'react-router-dom'
import PasswordStrength from './components/PasswordStrength.jsx'
import About from './pages/About.jsx'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <main className="viewport">
        <Routes>
          <Route path="/" element={<PasswordStrength />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
