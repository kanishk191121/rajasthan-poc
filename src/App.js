import { useState, useEffect } from "react";

const API = "https://citizen-xpapi-app-v1-efpl4f.5sc6y6-4.usa-e2.cloudhub.io/api";
const CATEGORIES = ["demography", "education", "employment", "employer", "property", "health"];
const CAT_ICONS = { demography: "🏘️", education: "🎓", employment: "💼", employer: "🏢", property: "🏠", health: "🏥" };
const CAT_LABELS = { demography: "Demography", education: "Education", employment: "Employment", employer: "Employer", property: "Property", health: "Health" };

async function api(path, method = "GET", body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

const C = {
  primary: "#1a56a0", secondary: "#0d9488", accent: "#f59e0b",
  bg: "#f8fafc", white: "#ffffff", text: "#1e293b", muted: "#64748b",
  border: "#e2e8f0", success: "#16a34a", danger: "#dc2626",
};

function GovHeader({ user, onLogout }) {
  return (
    <div>
      <div style={{ background: C.primary, color: "#fff", padding: "10px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src="/emblem.svg" alt="Emblem of India" style={{ width: 54, height: 54, filter: "brightness(0) invert(1)" }} />
          <div>
            <div style={{ fontFamily: "'Noto Sans Devanagari', serif", fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>राजस्थान सरकार</div>
            <div style={{ fontSize: 13, opacity: 0.85, letterSpacing: 1 }}>GOVERNMENT OF RAJASTHAN</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Citizen Data Integration Platform</div>
          
        </div>
      </div>
      {user && (
        <div style={{ background: C.secondary, padding: "8px 28px", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#fff", fontSize: 13 }}>Welcome, <strong>{user.name || user.username}</strong></span>
            <button onClick={onLogout} style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.5)", background: "transparent", color: "#fff", cursor: "pointer", fontSize: 13 }}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 50, height: 26, borderRadius: 13, background: value ? C.secondary : "#cbd5e1", position: "relative", cursor: "pointer", transition: "background 0.3s", flexShrink: 0 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: value ? 27 : 3, transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );
}

function Inp({ label, required, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
      <input style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: "#fff", color: C.text }} {...props} />
    </div>
  );
}

function Btn({ children, variant = "primary", full, ...props }) {
  const st = {
    primary: { background: C.primary, color: "#fff", border: "none" },
    secondary: { background: C.secondary, color: "#fff", border: "none" },
    outline: { background: "#fff", color: C.primary, border: `1px solid ${C.primary}` },
    danger: { background: C.danger, color: "#fff", border: "none" },
  };
  return <button style={{ padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "inherit", width: full ? "100%" : undefined, ...st[variant] }} {...props}>{children}</button>;
}

// LOGIN
function LoginPage({ onLogin, onRegister }) {
  const [tab, setTab] = useState("citizen");
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!form.username || !form.password) { setError("Please enter username and password"); return; }
    setLoading(true); setError("");
    try {
      if (tab === "citizen") {
        const res = await api("/citizen/login", "POST", form);
        if (res.citizenId) onLogin({ ...res, role: "citizen" });
        else setError(res.message || "Invalid credentials");
      } else {
        const res = await api("/admin/login", "POST", form);
        if (res.adminId) onLogin({ ...res, role: "admin", username: form.username });
        else setError(res.message || "Invalid credentials");
      }
    } catch { setError("Unable to connect to server. Please try again."); }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 88px)",
      backgroundImage: "url('/rajasthan_bg.gif')",
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "40px 80px",
    }}>
      <div style={{ width: 420, background: "rgba(255,255,255,0.97)", borderRadius: 16, padding: 36, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={{ margin: "0 0 4px", color: C.primary, fontSize: 26 }}>Sign In</h2>
          <div style={{ fontSize: 13, color: C.muted }}>Choose your login type and enter credentials</div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["citizen", "admin"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); setForm({ username: "", password: "" }); }} style={{ flex: 1, padding: "9px", borderRadius: 8, border: `2px solid ${tab === t ? C.primary : C.border}`, background: tab === t ? C.primary : "#fff", color: tab === t ? "#fff" : C.muted, cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "inherit" }}>
              {t === "citizen" ? "👤 Citizen" : "Admin"}
            </button>
          ))}
        </div>

        <Inp label="Username" placeholder={tab === "citizen" ? "e.g. RAME26" : "e.g. admin1"} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        <Inp label="Password" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === "Enter" && handleLogin()} />

        {error && <div style={{ padding: "9px 12px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: C.danger, fontSize: 13, marginBottom: 12 }}>⚠️ {error}</div>}

        <Btn full onClick={handleLogin} disabled={loading} style={{ padding: "13px", fontSize: 15, marginBottom: 12, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Logging in..." : "LOGIN"}
        </Btn>

        {tab === "citizen" && (
          <div style={{ textAlign: "center", fontSize: 13, color: C.muted, marginBottom: 12 }}>
            Don't have an account? <span onClick={onRegister} style={{ color: C.primary, fontWeight: 600, cursor: "pointer" }}>Register here</span>
          </div>
        )}


      </div>
    </div>
  );
}

// OTP
function OtpPage({ user, onVerified }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function verify() {
    if (otp.length < 4) { setError("Please enter OTP"); return; }
    setLoading(true); setError("");
    try { await api("/citizen/verify-otp", "POST", { citizenId: user.citizenId, otp }); onVerified(); }
    catch { setError("Invalid OTP."); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "calc(100vh - 88px)", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 380, background: "#fff", borderRadius: 16, padding: 36, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>📱</div>
          <h2 style={{ margin: 0, color: C.primary }}>OTP Verification</h2>
          <p style={{ color: C.muted, fontSize: 13, margin: "8px 0 0" }}>OTP sent to: <strong>{user.mobile}</strong></p>
        </div>
        <Inp label="Enter OTP" maxLength={4} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} onKeyDown={e => e.key === "Enter" && verify()} placeholder="Enter 4-digit OTP" />
        <div style={{ padding: "8px 12px", borderRadius: 8, background: "#f0fdf4", fontSize: 12, color: "#166534", marginBottom: 12 }}>💡 Demo OTP: <strong>1234</strong></div>
        {error && <div style={{ padding: "9px", borderRadius: 8, background: "#fef2f2", color: C.danger, fontSize: 13, marginBottom: 12 }}>⚠️ {error}</div>}
        <Btn full onClick={verify} disabled={loading} style={{ padding: "12px" }}>{loading ? "Verifying..." : "✅ Verify OTP"}</Btn>
      </div>
    </div>
  );
}

// REGISTER
function RegisterPage({ onBack }) {
  const [form, setForm] = useState({ aadhaarId: "", fullName: "", gender: "", dob: "", fatherName: "", motherName: "", mobile: "", email: "", permanentAddress: "", photograph: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function calcAge(dob) {
    if (!dob) return "";
    const b = new Date(dob), t = new Date();
    let a = t.getFullYear() - b.getFullYear();
    if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
    return isNaN(a) ? "" : a;
  }

  function F(label, key, req, props = {}) {
    return <Inp label={label} required={req} value={form[key] || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} {...props} />;
  }

  async function register() {
    if (!form.aadhaarId || !form.fullName || !form.gender || !form.dob || !form.mobile) { setMsg("❌ Please fill required fields: Aadhaar ID, Full Name, Gender, DOB, Mobile"); return; }
    setLoading(true); setMsg("");
    try {
      const submitData = { ...form, photograph: form.photograph || "" };
      await api("/citizen/register", "POST", submitData);
      setMsg("✅ Registration successful! You can now login.");
      setTimeout(() => onBack(), 2500);
    } catch (e) {
      setMsg(e.message === "409" ? "❌ This Aadhaar ID is already registered!" : "❌ Registration failed. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{ background: C.bg, minHeight: "calc(100vh - 88px)", padding: 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, padding: "20px 28px", color: "#fff" }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>👤 User Registration</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Please fill in all required information to complete your registration</div>
        </div>
        <div style={{ padding: 28 }}>
          {/* Photo */}
          <div style={{ marginBottom: 24, padding: 20, border: `2px dashed ${C.border}`, borderRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: C.text, borderLeft: `3px solid ${C.primary}`, paddingLeft: 8 }}>📷 Upload Photo</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, overflow: "hidden" }}>
                {form.photograph ? <img src={form.photograph} alt="photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
              </div>
              <div>
                <label style={{ display: "inline-block", padding: "9px 16px", background: C.secondary, color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  📷 Choose Photo
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => setForm(f => ({ ...f, photograph: ev.target.result }));
                    reader.readAsDataURL(file);
                  }} />
                </label>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Upload a clear photo (JPG, PNG, max 2MB)</div>
              </div>
            </div>
          </div>

          {/* Basic */}
          <div style={{ fontWeight: 700, fontSize: 15, color: C.primary, borderLeft: `3px solid ${C.primary}`, paddingLeft: 10, marginBottom: 12 }}>🪪 Basic Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0 16px" }}>
            <Inp label="Aadhaar ID" required placeholder="Enter 12-digit Aadhaar ID" maxLength={12} value={form.aadhaarId} onChange={e => setForm(f => ({ ...f, aadhaarId: e.target.value.replace(/\D/g, "") }))} />
            {F("Full Name", "fullName", true, { placeholder: "Enter your full name" })}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>Gender <span style={{ color: C.danger }}>*</span></label>
              <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", background: "#fff" }}>
                <option value="">Select Gender</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            {F("Date of Birth", "dob", true, { type: "date" })}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>Age <span style={{ fontSize: 11, background: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: 4 }}>Auto-calculated</span></label>
              <input readOnly value={calcAge(form.dob)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, background: "#f8fafc", boxSizing: "border-box" }} placeholder="Auto-calculated from DOB" />
            </div>
          </div>

          {/* Family */}
          <div style={{ fontWeight: 700, fontSize: 15, color: C.primary, borderLeft: `3px solid ${C.primary}`, paddingLeft: 10, marginBottom: 12 }}>👨‍👩‍👧 Family Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            {F("Father's Name", "fatherName", false, { placeholder: "Enter father's name" })}
            {F("Mother's Name", "motherName", false, { placeholder: "Enter mother's name" })}
          </div>

          {/* Contact */}
          <div style={{ fontWeight: 700, fontSize: 15, color: C.primary, borderLeft: `3px solid ${C.primary}`, paddingLeft: 10, marginBottom: 12 }}>📞 Contact Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
            <Inp label="Mobile Number" required placeholder="10-digit mobile number" maxLength={10} value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, "") }))} />
            {F("Email", "email", true, { type: "email", placeholder: "Enter your email address" })}
            {F("Permanent Address", "permanentAddress", false, { placeholder: "Enter complete address" })}
          </div>

          {msg && <div style={{ padding: "12px 16px", borderRadius: 10, background: msg.startsWith("✅") ? "#f0fdf4" : "#fef2f2", border: `1px solid ${msg.startsWith("✅") ? "#bbf7d0" : "#fecaca"}`, color: msg.startsWith("✅") ? "#166534" : C.danger, fontSize: 14, marginBottom: 16 }}>{msg}</div>}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
            <Btn variant="outline" onClick={onBack}>CANCEL</Btn>
            <Btn variant="secondary" onClick={register} disabled={loading} style={{ padding: "10px 28px" }}>{loading ? "Saving..." : "✅ SAVE REGISTRATION"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// CITIZEN DASHBOARD
function CitizenDashboard({ user }) {
  const [tab, setTab] = useState("consent");
  const [consents, setConsents] = useState({});
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [willing, setWilling] = useState(false);

  useEffect(() => { loadConsent(); loadProfile(); }, []);

  async function loadConsent() {
    try { const res = await api(`/consent/${user.citizenId}`); if (res.consent) { const m = {}; res.consent.forEach(c => { m[c.category] = c.status === "Y"; }); setConsents(m); } } catch { }
    setLoading(false);
  }
  async function loadProfile() { try { setProfile(await api(`/citizenid/${user.citizenId}`)); } catch { } }

  async function saveConsent() {
    setSaving(true); setMsg("");
    try {
      await api("/consent", "POST", { citizenId: user.citizenId, consent: CATEGORIES.map(cat => ({ category: cat, status: consents[cat] ? "Y" : "N", validFrom: new Date().toISOString().split("T")[0] })) });
      setMsg("✅ Consent saved successfully!"); setWilling(false);
      setTimeout(() => setMsg(""), 4000);
    } catch { setMsg("❌ Error saving consent. Please try again."); }
    setSaving(false);
  }

  return (
    <div style={{ background: C.bg, minHeight: "calc(100vh - 88px)" }}>
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "0 24px", display: "flex" }}>
        {[["consent", "🔐 Consent Management"], ["profile", "👤 My Profile"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: "14px 20px", border: "none", background: "none", borderBottom: tab === key ? `3px solid ${C.primary}` : "3px solid transparent", color: tab === key ? C.primary : C.muted, fontWeight: tab === key ? 700 : 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
        {tab === "consent" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: C.primary }}>Data Sharing Consent</h2>
              <p style={{ color: C.muted, margin: "6px 0 0", fontSize: 14 }}>Toggle consent for each department below to allow or revoke data sharing</p>
            </div>
            {loading ? <div style={{ textAlign: "center", padding: 40, color: C.muted }}>Loading...</div> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {CATEGORIES.map(cat => (
                  <div key={cat} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${consents[cat] ? C.secondary : C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: consents[cat] ? "#ecfdf5" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{CAT_ICONS[cat]}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{CAT_LABELS[cat]}</div>
                        <div style={{ fontSize: 12, color: C.muted }}>{consents[cat] ? "✅ Consent granted" : "❌ Consent not granted"}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: consents[cat] ? "#ecfdf5" : "#fef2f2", color: consents[cat] ? C.success : C.danger }}>{consents[cat] ? "ON" : "OFF"}</span>
                      <Toggle value={!!consents[cat]} onChange={v => setConsents({ ...consents, [cat]: v })} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div onClick={() => setWilling(!willing)} style={{ padding: "14px 18px", borderRadius: 12, marginBottom: 16, background: willing ? "#ecfdf5" : "#fff", border: `1px solid ${willing ? C.success : C.border}`, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, flexShrink: 0, background: willing ? C.success : "#fff", border: `2px solid ${willing ? C.success : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>{willing ? "✓" : ""}</div>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.text, userSelect: "none" }}>I am willing to give my consent for data sharing purposes</span>
            </div>

            {msg && <div style={{ padding: "12px 16px", borderRadius: 10, background: msg.startsWith("✅") ? "#f0fdf4" : "#fef2f2", border: `1px solid ${msg.startsWith("✅") ? "#bbf7d0" : "#fecaca"}`, color: msg.startsWith("✅") ? "#166534" : C.danger, fontSize: 14, marginBottom: 16 }}>{msg}</div>}

            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="secondary" onClick={saveConsent} disabled={saving || !willing} full style={{ padding: "12px", fontSize: 15, opacity: (!willing || saving) ? 0.45 : 1, cursor: (!willing || saving) ? "not-allowed" : "pointer" }}>
                {saving ? "Saving..." : "💾 Give Consent"}
              </Btn>
              <Btn variant="outline" onClick={() => { const a = {}; CATEGORIES.forEach(c => { a[c] = true; }); setConsents(a); }}>All ON</Btn>
              <Btn variant="danger" onClick={() => { setConsents({}); setWilling(false); }} style={{ padding: "10px 16px" }}>All OFF</Btn>
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div>
            <h2 style={{ margin: "0 0 20px", color: C.primary }}>My Profile</h2>
            {!profile ? <div style={{ textAlign: "center", padding: 40, color: C.muted }}>Loading...</div> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[["👤 Basic Information", profile.basicIdentity], ["🏘️ Demography", profile.demography], ["🎓 Education", profile.education], ["💼 Employment", profile.employment], ["🏢 Employer", profile.employer], ["🏠 Property", profile.property], ["🏥 Health", profile.health]].map(([title, data]) => data && Object.keys(data).length > 0 && (
                  <div key={title} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
                    <h3 style={{ margin: "0 0 14px", fontSize: 15, color: C.primary }}>{title}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
                      {Object.entries(data).filter(([k, v]) => v && k !== "photograph").map(([k, v]) => (
                        <div key={k}>
                          <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                          <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{String(v)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ADMIN DASHBOARD
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("search");
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [catData, setCatData] = useState(null);
  const [catLoading, setCatLoading] = useState(false);
  const [catFilters, setCatFilters] = useState({});
  const [citizenLookupId, setCitizenLookupId] = useState("");
  const [citizenLookupData, setCitizenLookupData] = useState(null);
  const [citizenLookupLoading, setCitizenLookupLoading] = useState(false);
  const [citizenLookupError, setCitizenLookupError] = useState("");

  const TABS = [["search", "🔍 Citizen Search"], ["fullprofile", "👤 Full Profile"], ["basicinfo", "📋 Basic Info"], ["demography", "🏘️ Demography"], ["education", "🎓 Education"], ["employment", "💼 Employment"], ["employer", "🏢 Employer"], ["property", "🏠 Property"], ["health", "🏥 Health"]];

  const CAT_FILTERS = {
    demography: [["District", "district", "e.g. Jaipur"], ["Block", "block", ""], ["Village", "village", ""], ["Rural/Urban", "rural_urban", "Urban/Rural"], ["Gender", "gender", "Male/Female"], ["Income", "income", ">50000"], ["Age", "age", ">30"]],
    education: [["Qualification", "highest_qualification", "e.g. B.Tech"], ["Year of Passing", "year_of_passing", ">2018"], ["School/College", "school_college_name", ""], ["University", "board_university", "e.g. AKTU"]],
    employment: [["Employment Status", "employment_status", "Employed/Unemployed"], ["Job Type", "job_type", "Full-time"], ["Skill", "skill_certifications", "e.g. MuleSoft"]],
    employer: [["Sector", "sector", "Private/Government"], ["Employer Name", "employer_name", "e.g. Nagarro"], ["Income", "income", ">100000"]],
    property: [["Ownership Status", "property_ownership_status", "Owned/Rented"], ["Property Type", "property_type", "Residential"]],
    health: [["Chronic Disease", "chronic_diseases", "e.g. Diabetes"], ["Disability", "disability_status", "Yes/No"], ["Blood Group", "blood_group", "B Positive"], ["Vaccination", "vaccination_status", "Complete"], ["Insurance", "insurance_status", "Yes/No"]],
  };

  async function searchCitizens() {
    setLoading(true); setResults(null); setSelected(null);
    try { setResults(await api("/admin/data/search", "POST", filters)); } catch { setResults([]); }
    setLoading(false);
  }

  async function fetchCategory() {
    setCatLoading(true); setCatData(null);
    const params = new URLSearchParams(catFilters).toString();
    try { setCatData(await api(`/${activeTab}${params ? "?" + params : ""}`)); } catch { setCatData([]); }
    setCatLoading(false);
  }

  async function fetchCitizenLookup(endpoint) {
    if (!citizenLookupId) { setCitizenLookupError("Please enter a Citizen ID"); return; }
    setCitizenLookupLoading(true); setCitizenLookupData(null); setCitizenLookupError("");
    try { setCitizenLookupData(await api(`/${endpoint}/${citizenLookupId}`)); }
    catch (e) { setCitizenLookupError(e.message === "404" ? "Citizen not found" : "Error fetching data"); }
    setCitizenLookupLoading(false);
  }

  function SearchFilter(label, key, placeholder) {
    return (
      <div key={key}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>{label}</label>
        <input style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} placeholder={placeholder}
          value={filters[key] || ""} onChange={e => { const v = e.target.value; setFilters(p => v ? { ...p, [key]: v } : (() => { const f = { ...p }; delete f[key]; return f; })()); }} />
      </div>
    );
  }

  function CatFilter(label, key, placeholder) {
    return (
      <div key={key}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>{label}</label>
        <input style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} placeholder={placeholder}
          value={catFilters[key] || ""} onChange={e => { const v = e.target.value; setCatFilters(p => v ? { ...p, [key]: v } : (() => { const f = { ...p }; delete f[key]; return f; })()); }} />
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: "calc(100vh - 88px)" }}>
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "0 24px", display: "flex", overflowX: "auto" }}>
        {TABS.map(([key, label]) => (
          <button key={key} onClick={() => { setActiveTab(key); setCatData(null); setCatFilters({}); }} style={{ padding: "13px 16px", border: "none", background: "none", whiteSpace: "nowrap", borderBottom: activeTab === key ? `3px solid ${C.primary}` : "3px solid transparent", color: activeTab === key ? C.primary : C.muted, fontWeight: activeTab === key ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        {activeTab === "search" && (
          <div>
            <h2 style={{ margin: "0 0 16px", color: C.primary }}>🔍 Citizen Search</h2>
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12, marginBottom: 14 }}>
                {SearchFilter("District", "district", "e.g. Jaipur")}
                {SearchFilter("Block", "block", "")}
                {SearchFilter("Village", "village", "")}
                {SearchFilter("Qualification", "qualification", "e.g. B.Tech")}
                {SearchFilter("Employment Status", "employmentStatus", "Employed")}
                {SearchFilter("Property Type", "propertyType", "Residential")}
                {SearchFilter("Chronic Disease", "chronicDisease", "e.g. Diabetes")}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={searchCitizens} style={{ padding: "10px 24px" }}>{loading ? "Searching..." : "🔍 Search"}</Btn>
                <Btn variant="outline" onClick={() => { setFilters({}); setResults(null); setSelected(null); }}>Clear</Btn>
              </div>
            </div>

            {results && (
              <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 16 }}>
                <div>
                  <div style={{ marginBottom: 10, fontSize: 13, color: C.muted }}>{results.length} citizen{results.length !== 1 ? "s" : ""} found</div>
                  {results.length === 0 ? <div style={{ background: "#fff", borderRadius: 12, padding: 40, textAlign: "center", color: C.muted }}>No results found</div> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {results.map(c => (
                        <div key={c.citizenId} onClick={() => setSelected(selected?.citizenId === c.citizenId ? null : c)} style={{ background: "#fff", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${selected?.citizenId === c.citizenId ? C.primary : C.border}`, cursor: "pointer" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>{(c.fullName || "?")[0]}</div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{c.fullName}</div>
                              <div style={{ fontSize: 12, color: C.muted }}>ID: {c.citizenId} • {c.basicIdentity?.mobile}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 4 }}>{CATEGORIES.map(cat => c[cat] && <span key={cat} style={{ fontSize: 16 }}>{CAT_ICONS[cat]}</span>)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selected && (
                  <div style={{ background: "#fff", borderRadius: 12, padding: 20, alignSelf: "flex-start", position: "sticky", top: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={{ margin: 0, color: C.primary }}>{selected.fullName}</h3>
                      <button onClick={() => setSelected(null)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 18, color: C.muted }}>✕</button>
                    </div>
                    {[["👤 Basic Info", selected.basicIdentity], ...CATEGORIES.map(c => [CAT_ICONS[c] + " " + CAT_LABELS[c], selected[c]])].map(([title, data]) => data && Object.keys(data).length > 0 && (
                      <div key={title} style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{title}</div>
                        {Object.entries(data).filter(([k, v]) => v && k !== "photograph").map(([k, v]) => (
                          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
                            <span style={{ color: C.muted }}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span style={{ fontWeight: 500, textAlign: "right", maxWidth: "55%" }}>{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {(activeTab === "fullprofile" || activeTab === "basicinfo") && (
          <div>
            <h2 style={{ margin: "0 0 16px", color: C.primary }}>
              {activeTab === "fullprofile" ? "👤 Full Profile" : "📋 Basic Info"}
            </h2>
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>Enter Citizen ID</label>
                  <input style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }}
                    placeholder="e.g. 1, 26, 58..."
                    value={citizenLookupId}
                    onChange={e => { setCitizenLookupId(e.target.value.replace(/\D/g, "")); setCitizenLookupData(null); setCitizenLookupError(""); }}
                    onKeyDown={e => e.key === "Enter" && fetchCitizenLookup(activeTab === "fullprofile" ? "citizenid" : "citizeninfo")}
                  />
                </div>
                <Btn onClick={() => fetchCitizenLookup(activeTab === "fullprofile" ? "citizenid" : "citizeninfo")} style={{ padding: "10px 24px", whiteSpace: "nowrap" }}>
                  {citizenLookupLoading ? "Loading..." : "🔍 Fetch"}
                </Btn>
                <Btn variant="outline" onClick={() => { setCitizenLookupId(""); setCitizenLookupData(null); setCitizenLookupError(""); }}>Clear</Btn>
              </div>
              {citizenLookupError && <div style={{ marginTop: 10, padding: "9px 12px", borderRadius: 8, background: "#fef2f2", color: C.danger, fontSize: 13 }}>⚠️ {citizenLookupError}</div>}
            </div>

            {citizenLookupData && (
              <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: C.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22 }}>
                    {(citizenLookupData.fullName || "?")[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: C.primary }}>{citizenLookupData.fullName}</div>
                    <div style={{ fontSize: 13, color: C.muted }}>Citizen ID: {citizenLookupData.citizenId}</div>
                  </div>
                </div>
                {[
                  ["👤 Basic Identity", citizenLookupData.basicIdentity],
                  ["🏘️ Demography", citizenLookupData.demography],
                  ["🎓 Education", citizenLookupData.education],
                  ["💼 Employment", citizenLookupData.employment],
                  ["🏢 Employer", citizenLookupData.employer],
                  ["🏠 Property", citizenLookupData.property],
                  ["🏥 Health", citizenLookupData.health],
                ].map(([title, data]) => data && Object.keys(data).length > 0 && (
                  <div key={title} style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.primary, borderLeft: `3px solid ${C.primary}`, paddingLeft: 10, marginBottom: 12 }}>{title}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "8px 20px" }}>
                      {Object.entries(data).filter(([k, v]) => v && k !== "photograph").map(([k, v]) => (
                        <div key={k} style={{ padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                          <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{String(v)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab !== "search" && activeTab !== "fullprofile" && activeTab !== "basicinfo" && (
          <div>
            <h2 style={{ margin: "0 0 16px", color: C.primary }}>{CAT_ICONS[activeTab]} {CAT_LABELS[activeTab]} Data</h2>
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 14 }}>
                {(CAT_FILTERS[activeTab] || []).map(([label, key, placeholder]) => CatFilter(label, key, placeholder))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={fetchCategory} style={{ padding: "10px 24px" }}>{catLoading ? "Loading..." : `🔍 Fetch ${CAT_LABELS[activeTab]}`}</Btn>
                <Btn variant="outline" onClick={() => { setCatFilters({}); setCatData(null); }}>Clear</Btn>
              </div>
            </div>
            {catData && (
              <div>
                <div style={{ marginBottom: 10, fontSize: 13, color: C.muted }}>{catData.length} record{catData.length !== 1 ? "s" : ""} found (consented citizens only)</div>
                {catData.length === 0 ? <div style={{ background: "#fff", borderRadius: 12, padding: 40, textAlign: "center", color: C.muted }}>No records found</div> : (
                  <div style={{ background: "#fff", borderRadius: 12, overflow: "auto", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: C.primary, color: "#fff" }}>
                          {Object.keys(catData[0]).map(k => <th key={k} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}>{k.replace(/([A-Z])/g, ' $1').trim()}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {catData.map((row, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: `1px solid ${C.border}` }}>
                            {Object.values(row).map((v, j) => <td key={j} style={{ padding: "10px 14px" }}>{v != null ? String(v) : "-"}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// MAIN
export default function App() {
  const [user, setUser] = useState(null);
  const [otpDone, setOtpDone] = useState(false);
  const [page, setPage] = useState("login");

  function handleLogout() { setUser(null); setOtpDone(false); setPage("login"); }
  const showUser = user && (otpDone || user.role === "admin");

  let content;
  if (page === "register") content = <RegisterPage onBack={() => setPage("login")} />;
  else if (!user) content = <LoginPage onLogin={setUser} onRegister={() => setPage("register")} />;
  else if (user.role === "citizen" && !otpDone) content = <OtpPage user={user} onVerified={() => setOtpDone(true)} />;
  else if (user.role === "citizen") content = <CitizenDashboard user={user} />;
  else content = <AdminDashboard />;

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet" />
      <GovHeader user={showUser ? user : null} onLogout={handleLogout} />
      {content}
    </div>
  );
}
