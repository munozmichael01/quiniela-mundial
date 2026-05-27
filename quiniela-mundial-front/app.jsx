// Main app shell

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#1D9E75",
  "font": "manrope",
  "demoPhase": "curso"
}/*EDITMODE-END*/;

const FONTS = {
  manrope: '"Manrope", system-ui, sans-serif',
  jakarta: '"Plus Jakarta Sans", system-ui, sans-serif',
  geist:   '"Geist", system-ui, sans-serif',
};

function shade(hex, mix, against) {
  return `color-mix(in srgb, ${hex} ${100 - mix}%, ${against} ${mix}%)`;
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply theme tokens
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", tweaks.primary);
    root.style.setProperty("--primary-dark", shade(tweaks.primary, 25, "black"));
    root.style.setProperty("--primary-soft", shade(tweaks.primary, 88, "white"));
    root.style.setProperty("--font", FONTS[tweaks.font] || FONTS.manrope);
  }, [tweaks.primary, tweaks.font]);

  // Apply simulated "now" for demo phases
  const [, setNowTick] = React.useState(0);
  React.useEffect(() => {
    const ph = window.DEMO_PHASES[tweaks.demoPhase];
    window.setSimNow(ph);
    setNowTick(t => t + 1); // force re-render of children that read getNow()
  }, [tweaks.demoPhase]);

  const [user, setUser] = React.useState(null);
  const [tab, setTab] = React.useState("predictions");

  // Shared app state
  const [predictions, setPredictions] = React.useState(() => buildSeedPredictions());
  const [realResults, setRealResults] = React.useState(() => buildSeedReal());
  const [bonus, setBonus] = React.useState({
    campeon: "Argentina",
    subcampeon: "",
    goleador: "",
    mvp: "",
    portero: "",
  });
  const [officialBonus, setOfficialBonus] = React.useState({
    campeon: "",
    subcampeon: "",
    goleador: "",
    mvp: "",
    portero: "",
  });
  // Bonus picks de cada participante (seed mock — el suyo se mantiene en `bonus`)
  const [participantBonus] = React.useState(() => buildParticipantBonusSeed());
  // Phase open state — admin controla cuándo se abren
  const [phaseOpen, setPhaseOpen] = React.useState(() => {
    const initial = {};
    window.QUINIELA_DATA.PHASES.forEach(p => { initial[p.id] = p.defaultOpen; });
    return initial;
  });
  const [users, setUsers] = React.useState(() =>
    window.QUINIELA_DATA.MOCK_USERS.map((u, i) => ({ ...u, paid: i % 3 !== 0 }))
  );

  // Pending predictions count (upcoming matches without a prediction)
  const pendingPreds = React.useMemo(() => {
    return window.QUINIELA_DATA.MATCHES.filter(m => {
      if (window.matchStatus(m) !== "upcoming") return false;
      const p = predictions[m.id];
      return !p || p.home === "" || p.away === "";
    }).length;
  }, [predictions, tweaks.demoPhase]); // demoPhase shifts which matches are upcoming

  if (!user) {
    return (
      <>
        <LoginScreen onLogin={setUser}/>
        <TweaksPanelUI tweaks={tweaks} setTweak={setTweak}/>
      </>
    );
  }

  return (
    <div className="app-shell" data-screen-label={user.role === "admin" ? "Admin" : tab}>
      <button
        className="topbar-logout"
        onClick={() => setUser(null)}
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
      >
        <Icon.LogOut size={15}/>
        <span className="topbar-logout-text">Salir</span>
      </button>
      <div className="app-main">
        {user.role === "admin" ? (
          <AdminScreen
            realResults={realResults} setRealResults={setRealResults}
            users={users} setUsers={setUsers}
            officialBonus={officialBonus} setOfficialBonus={setOfficialBonus}
            participantBonus={participantBonus}
            phaseOpen={phaseOpen} setPhaseOpen={setPhaseOpen}
          />
        ) : (
          <>
            {tab === "predictions" && (
              <PredictionsScreen
                predictions={predictions} setPredictions={setPredictions}
                realResults={realResults}
                phaseOpen={phaseOpen}
              />
            )}
            {tab === "aciertos" && (
              <MisAciertosScreen
                predictions={predictions}
                realResults={realResults}
              />
            )}
            {tab === "leaderboard" && <LeaderboardScreen currentUser={user} realResults={realResults}/>}
            {tab === "bonus" && <BonusScreen bonus={bonus} setBonus={setBonus}/>}
            {tab === "profile" && <ProfileScreen user={user} onLogout={() => setUser(null)}/>}
          </>
        )}
      </div>

      {user.role === "admin" ? (
        <div className="bottomnav" style={{gridTemplateColumns: "1fr 1fr"}}>
          <button className="active">
            <span className="nav-icon"><Icon.Settings size={20}/></span>
            Admin
          </button>
          <button onClick={() => setUser(null)}>
            <span className="nav-icon"><Icon.LogOut size={20}/></span>
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="bottomnav" style={{gridTemplateColumns: "repeat(5, 1fr)"}}>
          <button className={tab === "predictions" ? "active" : ""} onClick={() => setTab("predictions")}>
            <span className="nav-icon">
              <Icon.List size={20}/>
              {pendingPreds > 0 && <span className="nav-badge">{pendingPreds > 99 ? "99+" : pendingPreds}</span>}
            </span>
            Pronósticos
          </button>
          <button className={tab === "aciertos" ? "active" : ""} onClick={() => setTab("aciertos")}>
            <span className="nav-icon"><Icon.Check size={20}/></span>
            Aciertos
          </button>
          <button className={tab === "leaderboard" ? "active" : ""} onClick={() => setTab("leaderboard")}>
            <span className="nav-icon"><Icon.Rank size={20}/></span>
            Tabla
          </button>
          <button className={tab === "bonus" ? "active" : ""} onClick={() => setTab("bonus")}>
            <span className="nav-icon"><Icon.Star size={20}/></span>
            Bonus
          </button>
          <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>
            <span className="nav-icon"><Icon.Shield size={20}/></span>
            Perfil
          </button>
        </div>
      )}

      <TweaksPanelUI tweaks={tweaks} setTweak={setTweak}/>
    </div>
  );
}

function ProfileScreen({ user, onLogout }) {
  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">Perfil</div>
          <div className="topbar-sub">Tu cuenta</div>
        </div>
      </div>
      <div className="section">
        <div className="card" style={{padding: 18, display: "flex", alignItems: "center", gap: 14}}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "var(--primary)", color: "white",
            display: "grid", placeItems: "center",
            fontWeight: 800, fontSize: 18
          }}>{user.initials}</div>
          <div>
            <div style={{fontWeight: 800, fontSize: 17}}>{user.name}</div>
            <div className="muted-2" style={{marginTop: 2}}>Participante</div>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="card">
          <div className="creds-row">
            <div className="creds-text" style={{fontFamily: "var(--font)", fontSize: 13}}>
              <strong>Recibe avisos</strong><br/>
              <span style={{color: "var(--ink-3)"}}>Avisos antes de cada partido</span>
            </div>
            <div style={{width: 36, height: 22, background: "var(--primary)", borderRadius: 999, position: "relative"}}>
              <div style={{position: "absolute", right: 2, top: 2, width: 18, height: 18, background: "white", borderRadius: "50%"}}/>
            </div>
          </div>
          <div className="creds-row">
            <div className="creds-text" style={{fontFamily: "var(--font)", fontSize: 13}}>
              <strong>Reglamento</strong><br/>
              <span style={{color: "var(--ink-3)"}}>Cómo se calculan los puntos</span>
            </div>
            <Icon.Chevron size={16}/>
          </div>
        </div>
      </div>
      <div className="section">
        <button className="btn btn-secondary btn-block" onClick={onLogout}>
          <Icon.LogOut size={16}/>
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

// Tweaks panel UI
function TweaksPanelUI({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Fase del torneo (demo)"/>
      <TweakRadio
        label="Estado"
        value={tweaks.demoPhase}
        onChange={(v) => setTweak("demoPhase", v)}
        options={["pre", "curso", "post"]}
      />
      <TweakSection label="Tema"/>
      <TweakColor
        label="Color principal"
        value={tweaks.primary}
        onChange={(v) => setTweak("primary", v)}
        options={["#1D9E75", "#0E8C66", "#3F7A4F", "#2B7A3D"]}
      />
      <TweakSection label="Tipografía"/>
      <TweakRadio
        label="Fuente"
        value={tweaks.font}
        onChange={(v) => setTweak("font", v)}
        options={["manrope", "jakarta", "geist"]}
      />
    </TweaksPanel>
  );
}

function buildParticipantBonusSeed() {
  const { PARTICIPANTS, ALL_TEAMS, TOP_SCORERS, MVP_CANDIDATES, GOALKEEPERS } = window.QUINIELA_DATA;
  const seed = {};
  PARTICIPANTS.forEach((p, i) => {
    const rng = (n, off) => {
      const x = Math.sin(p.seed + off) * 10000;
      const f = x - Math.floor(x);
      return Math.floor(f * n);
    };
    seed[p.user] = {
      campeon:    ALL_TEAMS[rng(ALL_TEAMS.length, 1)],
      subcampeon: ALL_TEAMS[rng(ALL_TEAMS.length, 2)],
      goleador:   TOP_SCORERS[rng(TOP_SCORERS.length, 3)],
      mvp:        MVP_CANDIDATES[rng(MVP_CANDIDATES.length, 4)],
      portero:    GOALKEEPERS[rng(GOALKEEPERS.length, 5)],
    };
    // Some participants leave some picks empty
    if (i % 4 === 0) seed[p.user].mvp = "";
    if (i % 5 === 0) seed[p.user].portero = "";
  });
  return seed;
}

// Seeds — predictions and real results
function buildSeedPredictions() {
  const seed = {};
  const M = window.QUINIELA_DATA.MATCHES;
  M.slice(0, 48).forEach((m, i) => {
    if (i % 3 === 0) return; // leave some empty so "pendientes" count > 0
    seed[m.id] = {
      home: String(Math.floor(Math.random() * 4)),
      away: String(Math.floor(Math.random() * 3)),
    };
  });
  return seed;
}
function buildSeedReal() {
  const seed = {};
  const M = window.QUINIELA_DATA.MATCHES;
  // Real results filled for matches that have already finished (per demo phase "curso")
  M.forEach(m => {
    const now = window.DEMO_PHASES.curso;
    if (m.kickoffMs + 2 * 3600 * 1000 <= now) {
      seed[m.id] = {
        home: String(Math.floor(Math.random() * 4)),
        away: String(Math.floor(Math.random() * 3)),
      };
    }
  });
  return seed;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
