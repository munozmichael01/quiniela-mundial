// Admin panel: resumen, usuarios (con credenciales+pago), resultados, fases, matriz, bonus

function AdminScreen({
  realResults, setRealResults,
  users, setUsers,
  officialBonus, setOfficialBonus,
  participantBonus,
  phaseOpen, setPhaseOpen,
}) {
  const [tab, setTab] = React.useState("summary");
  const [toast, setToast] = React.useState("");

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  const tabs = [
    { id: "summary",   label: "Resumen" },
    { id: "users",     label: "Usuarios" },
    { id: "phases",    label: "Fases" },
    { id: "results",   label: "Resultados" },
    { id: "matrix",    label: "Por jugador" },
    { id: "bonus",     label: "Bonus oficiales" },
    { id: "pbonus",    label: "Bonus jugadores" },
  ];

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo" style={{background: "var(--ink)"}}>Q26</div>
        <div>
          <div className="topbar-title">Panel admin</div>
          <div className="topbar-sub">Gestión de la quiniela</div>
        </div>
        <div className="topbar-right">
          <span className="tag" style={{background: "#0F1715", color: "white"}}>ADMIN</span>
        </div>
      </div>

      <div className="section" style={{paddingBottom: 8}}>
        <div className="pill-tabs" style={{display: "flex", overflowX: "auto", maxWidth: "100%"}}>
          {tabs.map(t => (
            <button key={t.id}
              className={`pill-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "summary" && <SummaryTab users={users} realResults={realResults} phaseOpen={phaseOpen}/>}
      {tab === "users"   && <UsersTab users={users} setUsers={setUsers} flash={flash}/>}
      {tab === "phases"  && <PhasesTab phaseOpen={phaseOpen} setPhaseOpen={setPhaseOpen} flash={flash}/>}
      {tab === "results" && <ResultsTab realResults={realResults} setRealResults={setRealResults}/>}
      {tab === "matrix"  && <MatrixTab realResults={realResults}/>}
      {tab === "bonus"   && <OfficialBonusTab officialBonus={officialBonus} setOfficialBonus={setOfficialBonus} flash={flash}/>}
      {tab === "pbonus"  && <ParticipantBonusTab participantBonus={participantBonus} officialBonus={officialBonus}/>}

      {toast && <div className="copied-flash">{toast}</div>}
    </>
  );
}

// ---------- Resumen / Dashboard ----------
function SummaryTab({ users, realResults, phaseOpen }) {
  const { MATCHES, PARTICIPANTS, PHASES } = window.QUINIELA_DATA;
  const stats = React.useMemo(() => {
    const participantes = users.length;
    const pagados = users.filter(u => u.paid).length;
    const partidosJugados = MATCHES.filter(m => {
      const r = realResults[m.id];
      return r && r.home !== "" && r.away !== "";
    }).length;
    const partidosPendientes = MATCHES.length - partidosJugados;
    const pronosticosRegistrados = PARTICIPANTS.reduce((s, p) =>
      s + Object.values(p.predictions).filter(pr => pr.home !== "").length, 0);
    const allStats = PARTICIPANTS.map(p => ({ p, s: window.aggregateStats(p.predictions, realResults) }));
    const totalPts = allStats.reduce((s, x) => s + x.s.pts, 0);
    const pointsAvg = allStats.length ? Math.round(totalPts / allStats.length * 10) / 10 : 0;
    const leader = allStats.slice().sort((a,b) => b.s.pts - a.s.pts || b.s.exactos - a.s.exactos)[0];
    const upcoming = MATCHES
      .filter(m => m.kickoffMs > window.getNow() && m.home != null)
      .sort((a,b) => a.kickoffMs - b.kickoffMs)[0];
    const fasesAbiertas = PHASES.filter(p => phaseOpen[p.id]).length;
    return {
      participantes, pagados, partidosJugados, partidosPendientes,
      pronosticosRegistrados, pointsAvg, leader, upcoming, fasesAbiertas,
    };
  }, [users, realResults, phaseOpen]);

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 4}}>
        <div className="section-title">Estado del torneo</div>
        <div className="dash-grid">
          <div className="dash-card">
            <div className="dash-card-head">
              <span className="dash-icon"><Icon.Users size={14}/></span>
              Participantes
            </div>
            <div className="dash-value">{stats.participantes}</div>
            <div className="dash-sub">{stats.pagados} pagados · {stats.participantes - stats.pagados} pendientes</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-head">
              <span className="dash-icon"><Icon.Check size={14}/></span>
              Jugados
            </div>
            <div className="dash-value">{stats.partidosJugados}<small>/ {MATCHES.length}</small></div>
            <div className="dash-sub">{stats.partidosPendientes} pendientes</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-head">
              <span className="dash-icon"><Icon.List size={14}/></span>
              Pronósticos
            </div>
            <div className="dash-value">{stats.pronosticosRegistrados}</div>
            <div className="dash-sub">marcadores registrados</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-head">
              <span className="dash-icon"><Icon.Bar size={14}/></span>
              Promedio
            </div>
            <div className="dash-value">{stats.pointsAvg}<small>pts</small></div>
            <div className="dash-sub">por participante</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-head">
              <span className="dash-icon"><Icon.Lock size={14}/></span>
              Fases abiertas
            </div>
            <div className="dash-value">{stats.fasesAbiertas}<small>/ {PHASES.length}</small></div>
            <div className="dash-sub">disponibles para pronosticar</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-head">
              <span className="dash-icon"><Icon.Star size={14}/></span>
              Recaudado
            </div>
            <div className="dash-value">${stats.pagados * 10}</div>
            <div className="dash-sub">{stats.pagados}× $10 · meta ${stats.participantes * 10}</div>
          </div>
        </div>
      </div>

      {stats.leader && (
        <div className="section" style={{paddingTop: 4, paddingBottom: 4}}>
          <div className="section-title">Líder</div>
          <div className="dash-highlight">
            <div className="dash-icon-lg"><Icon.Trophy size={22}/></div>
            <div style={{flex: 1, minWidth: 0}}>
              <div className="dash-h-label">Va primero con</div>
              <div className="dash-h-title">{stats.leader.p.name}</div>
              <div className="dash-h-sub">
                {stats.leader.s.pts} pts · {stats.leader.s.exactos} exactos · {stats.leader.s.parciales} parciales · {stats.leader.s.signos} signos
              </div>
            </div>
          </div>
        </div>
      )}

      {stats.upcoming && (
        <div className="section" style={{paddingTop: 4}}>
          <div className="section-title">Próximo partido</div>
          <div className="dash-highlight">
            <div className="dash-icon-lg" style={{background: "var(--primary-soft)", color: "var(--primary-dark)"}}>
              <Icon.Clock size={22}/>
            </div>
            <div style={{flex: 1, minWidth: 0}}>
              <div className="dash-h-label">{window.formatRelative(stats.upcoming.kickoffISO)} · Grupo {stats.upcoming.group}</div>
              <div className="dash-h-title" style={{display: "flex", alignItems: "center", gap: 10}}>
                <FlagImg team={stats.upcoming.home}/>
                {stats.upcoming.home}
                <span style={{color: "var(--ink-3)", fontWeight: 600}}>vs</span>
                <FlagImg team={stats.upcoming.away}/>
                {stats.upcoming.away}
              </div>
              <div className="dash-h-sub">{stats.upcoming.date} · {stats.upcoming.time}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---------- Usuarios (fusionada con credenciales y estado de pago) ----------
function UsersTab({ users, setUsers, flash }) {
  const { initials } = window.QUINIELA_DATA;
  const [fullName, setFullName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [confirming, setConfirming] = React.useState(null);
  const [showPassFor, setShowPassFor] = React.useState({});
  const [filter, setFilter] = React.useState("all"); // all | paid | unpaid

  function genPass() {
    const adj = ["Gol", "Tiro", "Penal", "Arco", "Pase", "Tarjeta", "Falta", "Tiki", "Volea"];
    const animal = ["Halcón", "León", "Lobo", "Águila", "Tigre", "Cobra"];
    const num = Math.floor(Math.random() * 99) + 10;
    return adj[Math.floor(Math.random()*adj.length)] +
           animal[Math.floor(Math.random()*animal.length)] + num;
  }

  function validate() {
    if (!fullName.trim()) return "Introduce el nombre completo.";
    if (!username.trim()) return "Introduce el alias.";
    if (!/^[a-z]+\.[a-z]+$/.test(username.trim().toLowerCase()))
      return "El alias debe tener formato nombre.apellido.";
    if (!email.trim()) return "Introduce el email del participante.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "El email no es válido.";
    if (users.some(u => u.user === username.trim().toLowerCase())) return "Ese alias ya existe.";
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) return "Ese email ya está registrado.";
    return "";
  }

  async function submit() {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setSending(true);
    const pass = genPass();
    const newU = {
      id: Math.max(0, ...users.map(u => u.id)) + 1,
      name: fullName.trim(),
      user: username.trim().toLowerCase(),
      email: email.trim(),
      pass,
      paid: false,
      initials: initials(fullName.trim()),
    };
    try {
      // TODO backend: POST /api/users → Resend email
      await new Promise(r => setTimeout(r, 700));
      setUsers([...users, newU]);
      setFullName(""); setUsername(""); setEmail("");
      flash(`Contraseña enviada a ${newU.email}`);
    } catch {
      setError("No se pudo crear el usuario. Inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  }

  function delUser(id) {
    const u = users.find(x => x.id === id);
    setUsers(users.filter(x => x.id !== id));
    setConfirming(null);
    flash(`Usuario ${u?.user || ""} eliminado`);
  }

  function togglePaid(id) {
    setUsers(users.map(u => u.id === id ? { ...u, paid: !u.paid } : u));
  }

  function togglePass(id) {
    setShowPassFor(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function copyCreds(u) {
    const text = `Hola ${u.name || u.user}, tu acceso a la Quiniela Mundial 2026:\n\nUsuario: ${u.user}\nContraseña: ${u.pass}\n\nMucha suerte.`;
    navigator.clipboard?.writeText(text).catch(() => {});
    flash(`Credenciales de ${u.user} copiadas`);
  }

  React.useEffect(() => {
    if (!fullName.trim() || username) return;
    const parts = fullName.trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .split(/\s+/);
    if (parts.length >= 2) setUsername(`${parts[0]}.${parts[parts.length - 1]}`);
  }, [fullName]); // eslint-disable-line

  const filtered = users.filter(u => {
    if (filter === "paid") return u.paid;
    if (filter === "unpaid") return !u.paid;
    return true;
  });

  const paidCount = users.filter(u => u.paid).length;

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="section-title">Crear usuario</div>
        <div className="card" style={{padding: 14}}>
          {error && (
            <div className="error-msg" style={{marginBottom: 12}}>
              <Icon.Alert size={14}/><span>{error}</span>
            </div>
          )}
          <div className="field" style={{marginBottom: 10}}>
            <label className="label">Nombre completo</label>
            <input className="input" placeholder="Ana García"
              value={fullName} onChange={e => setFullName(e.target.value)}/>
          </div>
          <div className="field" style={{marginBottom: 10}}>
            <label className="label">Alias</label>
            <input className="input" placeholder="ana.garcia"
              value={username} onChange={e => setUsername(e.target.value.toLowerCase())}
              autoCapitalize="none" autoCorrect="off"/>
            <div className="muted-2" style={{fontSize: 10.5, marginTop: 4}}>
              Formato: <code style={{fontFamily: "var(--mono)"}}>nombre.apellido</code>
            </div>
          </div>
          <div className="field" style={{marginBottom: 14}}>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="ana.garcia@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              autoCapitalize="none" autoCorrect="off"/>
          </div>
          <button className="btn btn-primary btn-block" onClick={submit} disabled={sending}>
            <Icon.Plus size={16}/>
            {sending ? "Enviando contraseña…" : "Crear usuario y enviar contraseña"}
          </button>
          <div className="muted-2" style={{fontSize: 11, marginTop: 10, textAlign: "center", lineHeight: 1.5}}>
            La contraseña se genera automáticamente y se envía por email vía Resend.
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 8, paddingBottom: 4}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 8}}>
          <div className="section-title" style={{margin: 0}}>
            Participantes · {users.length} <span style={{color: "var(--primary-dark)"}}>· {paidCount} pagados</span>
          </div>
          <div className="pill-tabs" style={{padding: 3}}>
            <button className={`pill-tab ${filter==="all"?"active":""}`} onClick={() => setFilter("all")} style={{padding:"5px 9px",fontSize:11}}>Todos</button>
            <button className={`pill-tab ${filter==="paid"?"active":""}`} onClick={() => setFilter("paid")} style={{padding:"5px 9px",fontSize:11}}>Pagados</button>
            <button className={`pill-tab ${filter==="unpaid"?"active":""}`} onClick={() => setFilter("unpaid")} style={{padding:"5px 9px",fontSize:11}}>Pendientes</button>
          </div>
        </div>

        <div className="card">
          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><Icon.Users size={24}/></div>
              <div className="empty-title">{users.length === 0 ? "Aún no hay participantes" : "Sin resultados"}</div>
              <div className="empty-hint">{users.length === 0 ? "Crea el primer usuario para empezar." : "Cambia el filtro para ver otros usuarios."}</div>
            </div>
          ) : filtered.map(u => (
            <div className="user-card" key={u.id}>
              <div className="user-card-head">
                <div className={`user-avatar ${u.paid ? "" : ""}`}>{u.initials || u.user.slice(0,2).toUpperCase()}</div>
                <div className="user-card-info">
                  <div className="user-card-name">
                    {u.name || u.user}
                    <PaidBadge paid={u.paid}/>
                  </div>
                  <div className="user-card-meta">@{u.user} · {u.email}</div>
                </div>
                {confirming === u.id ? (
                  <div className="confirm-row">
                    <span className="confirm-text">¿Eliminar?</span>
                    <button className="btn btn-sm btn-secondary" onClick={() => setConfirming(null)}>Cancelar</button>
                    <button className="btn btn-sm btn-danger-solid" onClick={() => delUser(u.id)}>Eliminar</button>
                  </div>
                ) : (
                  <button className="icon-btn danger" onClick={() => setConfirming(u.id)} title="Eliminar usuario">
                    <Icon.Trash size={15}/>
                  </button>
                )}
              </div>
              <div className="user-card-body">
                <div className="user-pass-row">
                  <div className="user-pass-label">Contraseña</div>
                  <code className="user-pass-value">
                    {showPassFor[u.id] ? u.pass : "•".repeat(Math.max(u.pass?.length || 8, 8))}
                  </code>
                  <button className="icon-btn" onClick={() => togglePass(u.id)} title={showPassFor[u.id] ? "Ocultar" : "Mostrar"}>
                    {showPassFor[u.id] ? <Icon.EyeOff size={14}/> : <Icon.Eye size={14}/>}
                  </button>
                  <button className="icon-btn" onClick={() => copyCreds(u)} title="Copiar credenciales">
                    <Icon.Copy size={14}/>
                  </button>
                </div>
                <button
                  className={`paid-toggle ${u.paid ? "on" : "off"}`}
                  onClick={() => togglePaid(u.id)}
                  title={u.paid ? "Marcar como no pagado" : "Marcar como pagado"}
                >
                  <span className="paid-toggle-knob"/>
                  <span className="paid-toggle-label">{u.paid ? "Pagado" : "Sin pagar"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PaidBadge({ paid }) {
  return paid
    ? <span className="tag" style={{marginLeft: 6, padding: "2px 7px", fontSize: 9.5}}>Pagado</span>
    : <span className="tag" style={{marginLeft: 6, padding: "2px 7px", fontSize: 9.5, background: "#FFF1CC", color: "#7A5C0A"}}>Sin pagar</span>;
}

// ---------- Fases ----------
function PhasesTab({ phaseOpen, setPhaseOpen, flash }) {
  const { PHASES, MATCHES, matchPhase } = window.QUINIELA_DATA;

  function toggle(phaseId) {
    const next = !phaseOpen[phaseId];
    setPhaseOpen(prev => ({ ...prev, [phaseId]: next }));
    flash(`Fase ${PHASES.find(p => p.id === phaseId).label} ${next ? "abierta" : "cerrada"}`);
  }

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="notice">
          <Icon.Alert size={18}/>
          <div>
            Abre cada fase cuando quieras que los participantes puedan pronosticar sus partidos. Las fases cerradas se ven con candado y no se pueden editar.
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="section-title">Control de fases</div>
        <div className="card">
          {PHASES.map((ph, i) => {
            const open = phaseOpen[ph.id];
            const inPhase = MATCHES.filter(m => matchPhase(m) === ph.id);
            const firstKickoff = inPhase[0]?.kickoffISO;
            return (
              <div className="phase-row" key={ph.id}>
                <div className="phase-row-icon">
                  {open ? <Icon.Check size={16}/> : <Icon.Lock size={14}/>}
                </div>
                <div className="phase-row-info">
                  <div className="phase-row-title">
                    {ph.label}
                    <span className="muted-2" style={{fontSize: 11, fontWeight: 500, marginLeft: 8}}>
                      · {ph.count} {ph.count === 1 ? "partido" : "partidos"}
                    </span>
                  </div>
                  <div className="phase-row-sub">
                    {firstKickoff
                      ? <>Inicio: {window.formatRelative(firstKickoff)} · {new Date(firstKickoff).toUTCString().slice(5, 11)}</>
                      : <>Sin partidos programados</>}
                  </div>
                </div>
                <button
                  className={`paid-toggle ${open ? "on" : "off"}`}
                  onClick={() => toggle(ph.id)}
                >
                  <span className="paid-toggle-knob"/>
                  <span className="paid-toggle-label">{open ? "Abierta" : "Cerrada"}</span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="muted-2" style={{marginTop: 12, textAlign: "center", fontSize: 11.5, lineHeight: 1.5}}>
          Recuerda: una fase cerrada bloquea los pronósticos de esos partidos para todos los usuarios.
        </div>
      </div>
    </>
  );
}

// ---------- Resultados ----------
function ResultsTab({ realResults, setRealResults }) {
  const { GROUPS, MATCHES, PHASES, matchPhase } = window.QUINIELA_DATA;
  const [phaseFilter, setPhaseFilter] = React.useState("groups");
  const [resGroup, setResGroup] = React.useState("A");

  const inPhase = MATCHES.filter(m => matchPhase(m) === phaseFilter);
  const resMatches = phaseFilter === "groups"
    ? inPhase.filter(m => m.group === resGroup)
    : inPhase;
  const resDone = MATCHES.filter(m => {
    const r = realResults[m.id];
    return r && r.home !== "" && r.away !== "";
  }).length;

  function setReal(matchId, side, value) {
    const clean = value.replace(/[^0-9]/g, "").slice(0, 2);
    setRealResults(prev => ({
      ...prev,
      [matchId]: { ...(prev[matchId] || {home:"",away:""}), [side]: clean }
    }));
  }

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="stat" style={{padding: "12px 14px"}}>
          <div className="stat-label">Resultados cargados</div>
          <div className="stat-value">
            {resDone}<small>/ {MATCHES.length}</small>
          </div>
          <div className="progress"><div style={{width: `${(resDone/MATCHES.length)*100}%`}}/></div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 4, paddingBottom: 8}}>
        <label className="label" style={{marginBottom: 6, display: "block"}}>Fase</label>
        <select className="select" value={phaseFilter} onChange={e => setPhaseFilter(e.target.value)}>
          {PHASES.map(p => <option key={p.id} value={p.id}>{p.label} · {p.count} partidos</option>)}
        </select>
      </div>

      {phaseFilter === "groups" && (
        <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
          <label className="label" style={{marginBottom: 6, display: "block"}}>Grupo</label>
          <select className="select" value={resGroup} onChange={e => setResGroup(e.target.value)}>
            {Object.keys(GROUPS).map(g => <option key={g} value={g}>Grupo {g}</option>)}
          </select>
        </div>
      )}

      <div className="section" style={{paddingTop: 8}}>
        <div className="card">
          {resMatches.map(m => {
            const r = realResults[m.id] || {home:"",away:""};
            const status = window.matchStatus(m);
            const canEdit = status !== "upcoming";
            const isPlaceholder = m.home == null;
            return (
              <div className={`match-row ${isPlaceholder ? "placeholder" : ""}`} key={m.id}>
                <div className="match-team home">
                  {isPlaceholder
                    ? <span className="placeholder-pill">{m.homePlaceholder}</span>
                    : <><FlagImg team={m.home}/><span className="name">{m.home}</span></>}
                </div>
                <div className="match-score">
                  <input className={`score-input ${r.home !== "" ? "filled" : ""}`}
                    type="number" inputMode="numeric" min="0"
                    value={r.home} onChange={e => setReal(m.id, "home", e.target.value)}
                    placeholder="–" disabled={!canEdit || isPlaceholder}/>
                  <span className="score-sep">:</span>
                  <input className={`score-input ${r.away !== "" ? "filled" : ""}`}
                    type="number" inputMode="numeric" min="0"
                    value={r.away} onChange={e => setReal(m.id, "away", e.target.value)}
                    placeholder="–" disabled={!canEdit || isPlaceholder}/>
                </div>
                <div className="match-team away">
                  {isPlaceholder
                    ? <span className="placeholder-pill">{m.awayPlaceholder}</span>
                    : <><span className="name">{m.away}</span><FlagImg team={m.away}/></>}
                </div>
                <div className="match-meta">
                  {!canEdit
                    ? <span className="status-badge status-upcoming"><Icon.Clock size={9}/>Próximo</span>
                    : (r.home !== ""
                        ? <span className="status-badge status-finished"><Icon.Check size={9}/>Cargado</span>
                        : <span className="status-badge status-soon"><Icon.Clock size={9}/>Por cargar</span>)}
                  <span style={{marginLeft: 6}}>{m.date} · {m.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ---------- Matriz por jugador ----------
function MatrixTab({ realResults }) {
  const { MATCHES, PARTICIPANTS, PHASES, matchPhase } = window.QUINIELA_DATA;
  const [phaseFilter, setPhaseFilter] = React.useState("groups");
  const [groupFilter, setGroupFilter] = React.useState("ALL");

  const matches = MATCHES.filter(m => {
    if (matchPhase(m) !== phaseFilter) return false;
    if (phaseFilter === "groups" && groupFilter !== "ALL" && m.group !== groupFilter) return false;
    return true;
  });

  const rows = React.useMemo(() => {
    return PARTICIPANTS.map(p => ({
      ...p,
      stats: window.aggregateStats(p.predictions, realResults),
    })).sort((a, b) => b.stats.pts - a.stats.pts);
  }, [realResults]);

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="legend">
          <span className="legend-item"><span className="legend-dot cell-exacto"></span>Exacto · +3</span>
          <span className="legend-item"><span className="legend-dot cell-parcial"></span>Parcial · +2</span>
          <span className="legend-item"><span className="legend-dot cell-signo"></span>Signo · +1</span>
          <span className="legend-item"><span className="legend-dot cell-fallo"></span>Fallo · 0</span>
          <span className="legend-item"><span className="legend-dot cell-pending"></span>Pendiente</span>
        </div>
      </div>

      <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
        <div style={{display: "grid", gridTemplateColumns: phaseFilter === "groups" ? "1fr 1fr" : "1fr", gap: 8}}>
          <div>
            <label className="label" style={{marginBottom: 6, display: "block"}}>Fase</label>
            <select className="select" value={phaseFilter} onChange={e => setPhaseFilter(e.target.value)}>
              {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          {phaseFilter === "groups" && (
            <div>
              <label className="label" style={{marginBottom: 6, display: "block"}}>Grupo</label>
              <select className="select" value={groupFilter} onChange={e => setGroupFilter(e.target.value)}>
                <option value="ALL">Todos · 72</option>
                {Object.keys(window.QUINIELA_DATA.GROUPS).map(g =>
                  <option key={g} value={g}>Grupo {g}</option>
                )}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="matrix-wrap">
          <div className="matrix-scroll">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="head-player">Participante</th>
                  {matches.map(m => {
                    const r = realResults[m.id];
                    const hasReal = r && r.home !== "" && r.away !== "";
                    return (
                      <th key={m.id} title={`${m.home || m.homePlaceholder} vs ${m.away || m.awayPlaceholder} — ${m.date} ${m.time}`}>
                        <div className="match-pair">
                          <span className="match-grp">{m.group ? `G${m.group}` : m.phase.toUpperCase()}</span>
                          {m.home
                            ? <span style={{display: "flex", gap: 3, alignItems: "center"}}>
                                <FlagImg team={m.home} size={16}/>
                                <FlagImg team={m.away} size={16}/>
                              </span>
                            : <span style={{fontSize: 9.5, color: "var(--ink-3)", fontFamily: "var(--mono)"}}>{m.homePlaceholder}/{m.awayPlaceholder}</span>}
                          {hasReal
                            ? <span className="real-score">{r.home}–{r.away}</span>
                            : <span className="real-score" style={{color: "var(--ink-3)"}}>—</span>}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map(p => (
                  <tr key={p.user} className={p.isMe ? "me" : ""}>
                    <td className="cell-player">
                      <div className="cell-player-inner">
                        <div className="user-avatar small">{p.initials}</div>
                        <div style={{minWidth: 0}}>
                          <div className="pname">{p.name}</div>
                          <div className="ppts">
                            {p.stats.pts} pts · {p.stats.exactos}E · {p.stats.parciales}P
                          </div>
                        </div>
                      </div>
                    </td>
                    {matches.map(m => {
                      const pred = p.predictions[m.id];
                      const real = realResults[m.id];
                      const hasPred = pred && pred.home !== "" && pred.away !== "";
                      const hasReal = real && real.home !== "" && real.away !== "";
                      if (!hasPred) {
                        return <td key={m.id} className="matrix-cell"><div className="cell-inner cell-empty">—</div></td>;
                      }
                      const label = `${pred.home}-${pred.away}`;
                      if (!hasReal) {
                        return <td key={m.id} className="matrix-cell"><div className="cell-inner cell-pending">{label}</div></td>;
                      }
                      const score = window.scorePrediction(pred, real);
                      return <td key={m.id} className="matrix-cell"><div className={`cell-inner cell-${score.type}`}>{label}</div></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- Bonus oficiales ----------
function OfficialBonusTab({ officialBonus, setOfficialBonus, flash }) {
  const { ALL_TEAMS, TOP_SCORERS, MVP_CANDIDATES, GOALKEEPERS } = window.QUINIELA_DATA;
  const fields = [
    { key: "campeon", label: "Campeón oficial", icon: "Trophy", options: ALL_TEAMS },
    { key: "subcampeon", label: "Subcampeón oficial", icon: "Shield", options: ALL_TEAMS },
    { key: "goleador", label: "Goleador del Mundial", icon: "Ball", options: TOP_SCORERS },
    { key: "mvp", label: "MVP / Balón de Oro", icon: "Star", options: MVP_CANDIDATES },
    { key: "portero", label: "Mejor Portero", icon: "Glove", options: GOALKEEPERS },
  ];
  const completed = fields.filter(f => officialBonus[f.key]).length;
  function set(key, val) { setOfficialBonus(prev => ({ ...prev, [key]: val })); }
  async function save() {
    // TODO backend: PUT /api/admin/bonus-results
    flash("Bonus oficiales guardados");
  }

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="notice">
          <Icon.Alert size={18}/>
          <div>
            Confirma los resultados reales de los 5 bonus al final del torneo. Los puntos se sumarán automáticamente a los participantes que hayan acertado.
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="section-title">Resultados oficiales · {completed}/5</div>
        <div className="bonus-grid">
          {fields.map(f => {
            const IconComp = Icon[f.icon];
            const value = officialBonus[f.key] || "";
            return (
              <div className="bonus-card" key={f.key}>
                <div className="bonus-icon" style={{background: value ? "var(--primary)" : "var(--primary-soft)", color: value ? "white" : "var(--primary-dark)"}}>
                  <IconComp size={20}/>
                </div>
                <div className="bonus-body">
                  <div className="bonus-label">{f.label}</div>
                  <select
                    className="select"
                    value={value}
                    onChange={e => set(f.key, e.target.value)}
                    style={{height: 38, fontSize: 14, fontWeight: 600, padding: "0 32px 0 0", border: 0, background: "transparent", color: value ? "var(--ink)" : "var(--ink-3)", backgroundPosition: "right 4px center"}}
                  >
                    <option value="">Sin confirmar</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="save-bar">
        <button className="btn btn-primary btn-block" onClick={save}>
          <Icon.Check size={18}/>
          Confirmar bonus oficiales
        </button>
      </div>
    </>
  );
}

// ---------- Bonus por participante ----------
function ParticipantBonusTab({ participantBonus, officialBonus }) {
  const { PARTICIPANTS } = window.QUINIELA_DATA;
  const fields = [
    { key: "campeon", label: "Campeón", icon: "Trophy" },
    { key: "subcampeon", label: "Subcampeón", icon: "Shield" },
    { key: "goleador", label: "Goleador", icon: "Ball" },
    { key: "mvp", label: "MVP", icon: "Star" },
    { key: "portero", label: "Portero", icon: "Glove" },
  ];

  function match(key, value) {
    if (!officialBonus[key] || !value) return null;
    return officialBonus[key] === value;
  }

  // Aciertos totales por usuario
  const rows = PARTICIPANTS.map(p => {
    const picks = participantBonus[p.user] || {};
    const aciertos = fields.filter(f => match(f.key, picks[f.key]) === true).length;
    const completados = fields.filter(f => picks[f.key]).length;
    return { ...p, picks, aciertos, completados };
  }).sort((a,b) => b.aciertos - a.aciertos || a.name.localeCompare(b.name));

  const totalAciertos = rows.reduce((s, r) => s + r.aciertos, 0);
  const confirmadas = fields.filter(f => officialBonus[f.key]).length;

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="notice">
          <Icon.Star size={18}/>
          <div>
            Bonus elegidos por cada participante. {confirmadas > 0
              ? <>Las celdas verdes son aciertos contra los <strong>bonus oficiales</strong> ya confirmados.</>
              : <>Confirma los bonus oficiales para ver los aciertos.</>}
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="section-title">Picks de bonus · {rows.length} participantes · {totalAciertos} aciertos totales</div>
        <div className="matrix-wrap">
          <div className="matrix-scroll">
            <table className="matrix-table pbonus-table">
              <thead>
                <tr>
                  <th className="head-player">Participante</th>
                  {fields.map(f => {
                    const IconComp = Icon[f.icon];
                    return (
                      <th key={f.key} style={{minWidth: 160}}>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 4}}>
                          <span style={{color: "var(--primary-dark)"}}><IconComp size={14}/></span>
                          <span style={{fontSize: 10.5, color: "var(--ink-2)", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase"}}>{f.label}</span>
                          {officialBonus[f.key] && (
                            <span style={{fontSize: 10, color: "var(--primary-dark)", fontFamily: "var(--mono)", fontWeight: 600, marginTop: 2, maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                              {officialBonus[f.key]}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                  <th style={{minWidth: 70, fontSize: 10.5, color: "var(--ink-3)", letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 700}}>Aciertos</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(p => (
                  <tr key={p.user} className={p.isMe ? "me" : ""}>
                    <td className="cell-player">
                      <div className="cell-player-inner">
                        <div className="user-avatar small">{p.initials}</div>
                        <div style={{minWidth: 0}}>
                          <div className="pname">{p.name}</div>
                          <div className="ppts">@{p.user} · {p.completados}/5 elegidos</div>
                        </div>
                      </div>
                    </td>
                    {fields.map(f => {
                      const pick = p.picks[f.key];
                      const m = match(f.key, pick);
                      let cls = "cell-empty";
                      if (pick) cls = m === true ? "cell-exacto" : m === false ? "cell-fallo" : "cell-pending";
                      return (
                        <td key={f.key} className="matrix-cell pbonus-cell">
                          <div className={`cell-inner ${cls}`} style={{minWidth: 140, padding: "8px 10px", textAlign: "left", justifyContent: "flex-start", fontFamily: "var(--font)", fontSize: 11.5, fontWeight: 600}}>
                            {pick || <span style={{color: "var(--ink-3)", fontWeight: 500}}>—</span>}
                          </div>
                        </td>
                      );
                    })}
                    <td className="matrix-cell" style={{textAlign: "center", padding: "8px 12px", fontWeight: 800, fontSize: 15, fontVariantNumeric: "tabular-nums", color: p.aciertos > 0 ? "var(--primary-dark)" : "var(--ink-3)"}}>
                      {p.aciertos}<small style={{fontSize: 10, color: "var(--ink-3)", fontWeight: 600}}>/5</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

window.AdminScreen = AdminScreen;
