import { useState, useEffect } from "react"
import axios from "axios"

const COLUMNS = ["todo", "in_progress", "done"]
const LABELS = { todo: "Yapılacak", in_progress: "Devam Ediyor", done: "Tamamlandı" }
const COLORS = { todo: "bg-gray-100", in_progress: "bg-blue-50", done: "bg-green-50" }

export default function Board({ token, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [newTitle, setNewTitle] = useState("")

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => { fetchTasks() }, [])

  async function fetchTasks() {
    const res = await axios.get("http://localhost:8000/tasks/", { headers })
    setTasks(res.data)
  }

  async function addTask(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    await axios.post("http://localhost:8000/tasks/", { title: newTitle }, { headers })
    setNewTitle("")
    fetchTasks()
  }

  async function updateStatus(id, status) {
    await axios.patch(`http://localhost:8000/tasks/${id}`, { status }, { headers })
    fetchTasks()
  }

  async function deleteTask(id) {
    await axios.delete(`http://localhost:8000/tasks/${id}`, { headers })
    fetchTasks()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
          <button onClick={onLogout} className="text-sm text-gray-500 hover:text-red-500 transition">
            Çıkış Yap
          </button>
        </div>

        {/* Yeni task ekle */}
        <form onSubmit={addTask} className="flex gap-2 mb-8">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Yeni task ekle..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ekle
          </button>
        </form>

        {/* Kanban board */}
        <div className="grid grid-cols-3 gap-4">
          {COLUMNS.map(col => (
            <div key={col} className={`${COLORS[col]} rounded-2xl p-4`}>
              <h2 className="font-semibold text-gray-700 mb-4">{LABELS[col]}</h2>
              <div className="space-y-2">
                {tasks.filter(t => t.status === col).map(task => (
                  <div key={task.id} className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-gray-800 text-sm font-medium mb-2">{task.title}</p>
                    <div className="flex gap-1 flex-wrap">
                      {COLUMNS.filter(c => c !== col).map(c => (
                        <button
                          key={c}
                          onClick={() => updateStatus(task.id, c)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          → {LABELS[c]}
                        </button>
                      ))}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-xs text-red-400 hover:underline ml-auto"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}