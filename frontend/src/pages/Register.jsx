import { useState } from "react"
import axios from "axios"

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({ email: "", username: "", password: "" })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await axios.post("http://localhost:8000/auth/register", form)
      setSuccess(true)
    } catch {
      setError("Kayıt başarısız, email zaten kullanılıyor olabilir")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Kayıt Ol</h1>
        {success
          ? <div className="text-green-600 text-center">
              Kayıt başarılı! <span onClick={onSwitch} className="text-blue-600 cursor-pointer underline">Giriş yap</span>
            </div>
          : <>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  placeholder="Kullanıcı adı"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Şifre"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Kayıt Ol
                </button>
              </form>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Zaten hesabın var mı?{" "}
                <span onClick={onSwitch} className="text-blue-600 cursor-pointer hover:underline">
                  Giriş Yap
                </span>
              </p>
            </>
        }
      </div>
    </div>
  )
}