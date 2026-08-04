import { useState } from "react"
import { Pencil, Plus, X } from "lucide-react"

const initialPreferences = ["Langa fereastra", "Zone linistite", "Aproape de Anna H."]

export default function ContPage() {
  const [editing, setEditing] = useState(false)
  const [preferences, setPreferences] = useState(initialPreferences)
  const [newPref, setNewPref] = useState("")
  const [addingPref, setAddingPref] = useState(false)

  const [form, setForm] = useState({
    name: "Bunea George ",
    email: "buneageorge29@gmail.com",
    department: "",
    domiciliu: "",
  })

  function removePreference(p: string) {
    setPreferences((prev) => prev.filter((x) => x !== p))
  }

  function addPreference() {
    const trimmed = newPref.trim()
    if (trimmed && !preferences.includes(trimmed)) {
      setPreferences((prev) => [...prev, trimmed])
    }
    setNewPref("")
    setAddingPref(false)
  }

  return (
    <div className="cont-page">
      {/* ── Profile header card ─────────────────────────── */}
      <div className="cont-card cont-card--profile">
        <div className="cont-avatar">
          <span>CC</span>
        </div>
        <div className="cont-profile-info">
          <h2 className="cont-profile-name">{form.name}</h2>
          <p className="cont-profile-meta">{form.email}</p>
          <p className="cont-profile-meta cont-profile-meta--muted">
            Prefera Etaj 1, langa fereastra
          </p>
        </div>
        <button
          className="cont-btn cont-btn--outline"
          onClick={() => setEditing((e) => !e)}
          id="cont-edit-profile-btn"
        >
          <Pencil size={14} />
          {editing ? "Salveaza" : "Editeaza profilul"}
        </button>
      </div>

      {/* ── Personal info card ──────────────────────────── */}
      <div className="cont-card">
        <h3 className="cont-section-title">Informatii personale</h3>
        <div className="cont-form-grid">
          <div className="cont-field">
            <label className="cont-label">Nume complet</label>
            <input
              id="cont-input-name"
              className="cont-input"
              value={form.name}
              disabled={!editing}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="cont-field">
            <label className="cont-label">Email</label>
            <input
              id="cont-input-email"
              className="cont-input"
              value={form.email}
              disabled={!editing}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="cont-field">
            <label className="cont-label">Departament</label>
            <input
              id="cont-input-department"
              className="cont-input"
              value={form.department}
              disabled={!editing}
              placeholder={editing ? "ex: IT" : ""}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </div>
          <div className="cont-field">
            <label className="cont-label">Domiciliu</label>
            <input
              id="cont-input-domiciliu"
              className="cont-input"
              value={form.domiciliu}
              disabled={!editing}
              placeholder={editing ? "ex: București" : ""}
              onChange={(e) => setForm({ ...form, domiciliu: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* ── Work preferences card ────────────────────────── */}
      <div className="cont-card">
        <h3 className="cont-section-title">Preferinte munca</h3>
        <div className="cont-preferences">
          <div className="cont-pref-tags">
            {preferences.map((p) => (
              <span key={p} className="cont-tag">
                {p}
                {editing && (
                  <button
                    className="cont-tag__remove"
                    onClick={() => removePreference(p)}
                    aria-label={`Sterge ${p}`}
                  >
                    <X size={12} />
                  </button>
                )}
              </span>
            ))}

            {addingPref ? (
              <div className="cont-tag-input-row">
                <input
                  autoFocus
                  className="cont-tag-input"
                  value={newPref}
                  onChange={(e) => setNewPref(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addPreference()
                    if (e.key === "Escape") { setAddingPref(false); setNewPref("") }
                  }}
                  placeholder="Adauga..."
                />
              </div>
            ) : null}
          </div>

          <button
            id="cont-add-pref-btn"
            className="cont-btn cont-btn--accent"
            onClick={() => setAddingPref(true)}
          >
            <Plus size={14} />
            Adauga preferinte
          </button>
        </div>
      </div>
    </div>
  )
}
