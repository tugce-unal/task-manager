import { useState } from "react"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Board from "./pages/Board"

export default function App() {
  const [page, setPage] = useState("login")
  const [token, setToken] = useState(localStorage.getItem("token"))

  if (token) return <Board token = {token} onLogout={() => {
    localStorage.removeItem("token")
    setToken(null)
  }} />

  return (
    <div>
      {page == "login"
        ? <Login onLogin = {setToken} onSwitch={() => setPage("register")} />
        : <Register onSwitch={() => setPage("login")} />
      }
    </div>
  )
}
