// Mis Pronósticos — pestañas por fase, bloqueo por kickoff + por fase cerrada

function PredictionsScreen({ predictions, setPredictions, realResults, phaseOpen }) {
  const { GROUPS, MATCHES, PHASES, matchPhase } = window.QUINIELA_DATA;
  const [openGroups, setOpenGroups] = React.useState(() => ({ A: true }));
  const [phaseTab, setPhaseTab] = React.useState("groups");
  const [toast, setToast] = React.useState("");

  const totalMatches = MATCHES.length;
  const completed = MATCHES.filter(m => {
    const p = predictions[m.id];
    return p && p.home !== "" && p.away !== "" && p.home != null && p.away != null;
  }).length;

  const points = React.useMemo(() => {
    let pts = 0;
    MATCHES.forEach(m => {
      pts += window.scorePrediction(predictions[m.id], realResults[m.id]).pts;
    });
    return pts;
  }, [predictions, realResults]);

  function setScore(matchId, side, value) {
    const clean = value.replace(/[^0-9]/g, "").slice(0, 2);
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...(prev[matchId] || {home:"",away:""}), [side]: clean }
    }));
  }

  function toggleGroup(g) {
    setOpenGroups(prev => ({ ...prev, [g]: !prev[g] }));
  }

  function save() {
    setToast("Pronósticos guardados");
    setTimeout(() => setToast(""), 1800);
  }

  function groupProgress(g) {
    const inGroup = MATCHES.filter(m => m.group === g);
    const done = inGroup.filter(m => {
      const p = predictions[m.id];
      return p && p.home !== "" && p.away !== "";
    }).length;
    return { done, total: inGroup.length };
  }

  // Phase tab counts
  const phaseCounts = PHASES.map(ph => {
    const inPhase = MATCHES.filter(m => matchPhase(m) === ph.id);
    const done = inPhase.filter(m => {
      const p = predictions[m.id];
      return p && p.home !== "" && p.away !== "";
    }).length;
    return { ...ph, done, total: inPhase.length, open: phaseOpen[ph.id] };
  });

  const activePhase = PHASES.find(p => p.id === phaseTab) || PHASES[0];
  const phaseUnlocked = phaseOpen[phaseTab];

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">Mis Pronósticos</div>
          <div className="topbar-sub">{activePhase.label} · {phaseUnlocked ? "Abierta" : "Cerrada"}</div>
        </div>
        <div className="topbar-right">
          <span className="tag">{completed}/{totalMatches}</span>
        </div>
      </div>

      <div className="section" style={{paddingBottom: 8}}>
        <div className="stat-row">
          <div className="stat">
            <div className="stat-label">Completados</div>
            <div className="stat-value">
              {completed}<small>/ {totalMatches}</small>
            </div>
            <div className="progress"><div style={{width: `${(completed/totalMatches)*100}%`}}/></div>
          </div>
          <div className="stat">
            <div className="stat-label">Puntos</div>
            <div className="stat-value">
              {points}<small>pts</small>
            </div>
            <div className="muted-2" style={{marginTop: 8, fontSize: 11}}>
              Exacto +3 · Parcial +2 · Signo +1
            </div>
          </div>
        </div>
      </div>

      {/* Phase tabs */}
      <div className="section" style={{paddingTop: 4, paddingBottom: 8}}>
        <div className="phase-tabs">
          {phaseCounts.map(ph => (
            <button
              key={ph.id}
              className={`phase-tab ${phaseTab === ph.id ? "active" : ""} ${!ph.open ? "locked" : ""}`}
              onClick={() => setPhaseTab(ph.id)}
            >
              <span className="phase-tab-label">
                {!ph.open && <Icon.Lock size={10}/>}
                {ph.label}
              </span>
              <span className="phase-tab-count">{ph.done}/{ph.total}</span>
            </button>
          ))}
        </div>
      </div>

      {!phaseUnlocked && (
        <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
          <div className="notice closed">
            <Icon.Lock size={16}/>
            <div>
              <strong>Fase de {activePhase.label.toLowerCase()} aún no abierta.</strong><br/>
              Los partidos estarán disponibles para pronosticar cuando el admin la habilite.
            </div>
          </div>
        </div>
      )}

      {/* Group view */}
      {phaseTab === "groups" && (
        <div className="section" style={{paddingTop: 0}}>
          <div className="section-title">Grupos · 12 grupos · 72 partidos</div>
          {Object.keys(GROUPS).map(g => {
            const open = !!openGroups[g];
            const groupMatches = MATCHES.filter(m => m.group === g);
            const prog = groupProgress(g);
            return (
              <div className="card group-card" key={g}>
                <button className={`group-head ${open ? "open" : ""}`} onClick={() => toggleGroup(g)}>
                  <div className="group-badge">{g}</div>
                  <div>
                    <div className="group-title">Grupo {g}</div>
                    <div className="muted-2" style={{fontSize: 11, marginTop: 1}}>
                      {GROUPS[g].slice(0,2).join(" · ")} · {GROUPS[g].slice(2).join(" · ")}
                    </div>
                  </div>
                  <div className="group-progress">{prog.done}/{prog.total}</div>
                  <span className={`group-chevron ${open ? "open" : ""}`}>
                    <Icon.Chevron size={16}/>
                  </span>
                </button>

                {open && groupMatches.map(m => (
                  <MatchRow
                    key={m.id}
                    match={m}
                    prediction={predictions[m.id]}
                    real={realResults[m.id]}
                    onScore={setScore}
                    phaseOpen={phaseUnlocked}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Knockout view */}
      {phaseTab !== "groups" && (
        <div className="section" style={{paddingTop: 0}}>
          <div className="section-title">{activePhase.label} · {activePhase.count} {activePhase.count === 1 ? "partido" : "partidos"}</div>
          <div className="card">
            {MATCHES.filter(m => matchPhase(m) === phaseTab).map(m => (
              <MatchRow
                key={m.id}
                match={m}
                prediction={predictions[m.id]}
                real={realResults[m.id]}
                onScore={setScore}
                phaseOpen={phaseUnlocked}
              />
            ))}
          </div>
        </div>
      )}

      <div className="save-bar">
        <button className="btn btn-primary btn-block" onClick={save} disabled={!phaseUnlocked}>
          <Icon.Check size={18}/>
          Guardar pronósticos
        </button>
        <div className="save-status">
          {phaseUnlocked
            ? "Puedes modificar tus pronósticos hasta el inicio de cada partido"
            : "Esta fase está cerrada. Espera a que el admin la abra."}
        </div>
      </div>

      {toast && <div className="copied-flash">{toast}</div>}
    </>
  );
}

// One match row — handles its own lock state + status badge
function MatchRow({ match, prediction, real, onScore, phaseOpen = true }) {
  const status = window.matchStatus(match);
  const kickoffLocked = status !== "upcoming";
  const locked = kickoffLocked || !phaseOpen;
  const hasReal = real && real.home !== "" && real.away !== "";
  const p = prediction || { home: "", away: "" };

  const minutesUntil = (match.kickoffMs - window.getNow()) / 60000;
  const soon = status === "upcoming" && minutesUntil <= 60 * 24;

  const inputCls = (val) => {
    if (locked && val !== "") return "score-input filled-locked";
    if (val !== "") return "score-input filled";
    return "score-input";
  };

  const isPlaceholder = match.home == null || match.away == null;
  const homeLabel = isPlaceholder ? match.homePlaceholder : match.home;
  const awayLabel = isPlaceholder ? match.awayPlaceholder : match.away;

  return (
    <div className={`match-row ${hasReal ? "has-real" : ""} ${isPlaceholder ? "placeholder" : ""}`}>
      <div className="match-team home">
        {isPlaceholder
          ? <span className="placeholder-pill">{homeLabel}</span>
          : <><FlagImg team={match.home}/><span className="name">{match.home}</span></>}
      </div>
      <div className="match-score">
        <input
          className={inputCls(p.home)}
          type="number" min="0" inputMode="numeric"
          value={p.home}
          onChange={e => onScore(match.id, "home", e.target.value)}
          placeholder="–"
          disabled={locked}
        />
        <span className="score-sep">:</span>
        <input
          className={inputCls(p.away)}
          type="number" min="0" inputMode="numeric"
          value={p.away}
          onChange={e => onScore(match.id, "away", e.target.value)}
          placeholder="–"
          disabled={locked}
        />
      </div>
      <div className="match-team away">
        {isPlaceholder
          ? <span className="placeholder-pill">{awayLabel}</span>
          : <><span className="name">{match.away}</span><FlagImg team={match.away}/></>}
      </div>
      <div className="match-meta">
        {!phaseOpen
          ? <span className="status-badge status-locked"><Icon.Lock size={9}/>Fase cerrada</span>
          : <StatusBadge status={status} soon={soon} hasReal={hasReal}/>}
        <span style={{marginLeft: 6}}>{match.date} · {match.time}</span>
        <span style={{marginLeft: "auto", display: "flex", gap: 6, alignItems: "center"}}>
          {!locked && <span className="muted-2" style={{fontSize: 10.5}}>{window.formatRelative(match.kickoffISO)}</span>}
          {hasReal && (
            <span className="real-result">Real {real.home}–{real.away}</span>
          )}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status, soon, hasReal }) {
  if (status === "live") {
    return <span className="status-badge status-live"><Icon.Live size={9}/>En juego</span>;
  }
  if (status === "finished") {
    if (hasReal) return <span className="status-badge status-finished"><Icon.Check size={9}/>Finalizado</span>;
    return <span className="status-badge status-locked"><Icon.Lock size={9}/>Bloqueado</span>;
  }
  if (soon) return <span className="status-badge status-soon"><Icon.Clock size={9}/>Próximo</span>;
  return <span className="status-badge status-upcoming"><Icon.Clock size={9}/>Pendiente</span>;
}

window.PredictionsScreen = PredictionsScreen;
