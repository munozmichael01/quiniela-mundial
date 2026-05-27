// Login screen

function LoginScreen({ onLogin }) {
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  function submit(e) {
    e.preventDefault();
    setErr("");
    if (!user || !pass) {
      setErr("Introduce usuario y contraseña.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Admin shortcut
      if (user.toLowerCase() === "admin" && pass === "admin") {
        onLogin({ name: "Admin", role: "admin", initials: "AD", user: "admin" });
        return;
      }
      // Lookup in seeded users
      const MU = window.QUINIELA_DATA.MOCK_USERS;
      const found = MU.find(u => u.user.toLowerCase() === user.trim().toLowerCase());
      if (found && (pass === found.pass || pass.length >= 4)) {
        onLogin({
          name: found.name, role: "user",
          initials: found.initials, user: found.user, email: found.email,
        });
        return;
      }
      if (pass.length < 4) {
        setErr("Usuario o contraseña incorrectos.");
        setLoading(false);
      } else {
        // Allow any account in demo mode
        const initialsStr = user.slice(0, 2).toUpperCase();
        const displayName = user.split(".").map(p => p[0].toUpperCase() + p.slice(1)).join(" ");
        onLogin({ name: displayName, role: "user", initials: initialsStr, user });
      }
    }, 450);
  }

  return (
    <div className="login-shell">
      {/* Desktop-only hero panel (hidden on mobile via CSS) */}
      <div className="login-hero-side">
        <div className="login-brand-desktop">
          <div className="topbar-logo" style={{width: 40, height: 40, borderRadius: 11, fontSize: 16}}>Q26</div>
          <div>
            <div className="topbar-title" style={{fontSize: 15, color: "white"}}>Quiniela</div>
            <div className="topbar-sub" style={{fontSize: 10, color: "rgba(255,255,255,0.7)"}}>Mundial 2026</div>
          </div>
        </div>
        <div className="login-pitch">
          <h1>Acierta.<br/>Suma.<br/>Quédate arriba.</h1>
          <p>Predice los resultados de los 104 partidos del Mundial 2026 y compite con tus amigos.</p>
        </div>
        <div className="login-stats-row">
          <div>
            <div className="stat-num">48</div>
            <div className="stat-cap">Selecciones</div>
          </div>
          <div>
            <div className="stat-num">104</div>
            <div className="stat-cap">Partidos</div>
          </div>
          <div>
            <div className="stat-num">12</div>
            <div className="stat-cap">Grupos · A–L</div>
          </div>
        </div>
      </div>

      {/* Mobile brand bar */}
      <div className="login-brand">
        <div className="topbar-logo" style={{width: 40, height: 40, borderRadius: 11, fontSize: 16}}>Q26</div>
        <div>
          <div className="topbar-title" style={{fontSize: 15}}>Quiniela</div>
          <div className="topbar-sub" style={{fontSize: 10}}>Mundial 2026</div>
        </div>
      </div>

      <div className="login-hero">
        <h1>Acierta. Suma.<br/>Quédate arriba.</h1>
        <p>Predice los resultados de los 104 partidos del Mundial 2026 y compite con tus amigos.</p>
      </div>

      <div className="login-form-side">
        <div className="login-form-card">
          <form className="login-card" onSubmit={submit}>
        {err && (
          <div className="error-msg">
            <Icon.Alert size={14}/>
            <span>{err}</span>
          </div>
        )}

        <div className="field" style={{marginBottom: 14}}>
          <label className="label">Usuario</label>
          <input
            className={`input ${err ? "error" : ""}`}
            type="text"
            placeholder="tu.usuario"
            value={user}
            onChange={e => setUser(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>

        <div className="field" style={{marginBottom: 20}}>
          <label className="label">Contraseña</label>
          <input
            className={`input ${err ? "error" : ""}`}
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>

        <div className="login-hint">
          ¿No tienes cuenta? Pide al admin que te dé acceso.<br/>
          <span style={{opacity: .7}}>Demo: <code>admin</code> / <code>admin</code> para panel admin</span>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
