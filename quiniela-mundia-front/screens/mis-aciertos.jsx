// Mis aciertos — vista personal del usuario autenticado

function MisAciertosScreen({ predictions, realResults }) {
  const { MATCHES } = window.QUINIELA_DATA;
  const [filter, setFilter] = React.useState("all"); // all | acertados | pendientes

  // Build entries for predictions the user has made
  const entries = React.useMemo(() => {
    return MATCHES
      .filter(m => {
        const p = predictions[m.id];
        return p && p.home !== "" && p.away !== "";
      })
      .map(m => {
        const p = predictions[m.id];
        const r = realResults[m.id];
        const hasReal = r && r.home !== "" && r.away !== "";
        const score = window.scorePrediction(p, r);
        return { match: m, pred: p, real: r, hasReal, score };
      })
      .sort((a, b) => b.match.kickoffMs - a.match.kickoffMs);
  }, [predictions, realResults]);

  const filtered = entries.filter(e => {
    if (filter === "acertados") return ["exacto","parcial","signo"].includes(e.score.type);
    if (filter === "pendientes") return !e.hasReal;
    return true;
  });

  const totals = entries.reduce((acc, e) => {
    if (e.score.type) acc[e.score.type] = (acc[e.score.type] || 0) + 1;
    acc.pts += e.score.pts;
    return acc;
  }, { exacto:0, parcial:0, signo:0, fallo:0, pts:0 });

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">Mis aciertos</div>
          <div className="topbar-sub">{entries.length} pronósticos registrados</div>
        </div>
      </div>

      <div className="section" style={{paddingBottom: 8}}>
        <div className="stat-row" style={{gridTemplateColumns: "1.4fr 1fr 1fr 1fr"}}>
          <div className="stat">
            <div className="stat-label">Puntos</div>
            <div className="stat-value">{totals.pts}<small>pts</small></div>
          </div>
          <div className="stat">
            <div className="stat-label">Exactos</div>
            <div className="stat-value" style={{color: "var(--primary-dark)"}}>{totals.exacto || 0}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Parciales</div>
            <div className="stat-value" style={{color: "#7A5C0A"}}>{totals.parcial || 0}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Signos</div>
            <div className="stat-value" style={{color: "#8A4A0E"}}>{totals.signo || 0}</div>
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
        <div className="pill-tabs">
          <button className={`pill-tab ${filter==="all"?"active":""}`} onClick={() => setFilter("all")}>Todos · {entries.length}</button>
          <button className={`pill-tab ${filter==="acertados"?"active":""}`} onClick={() => setFilter("acertados")}>Acertados</button>
          <button className={`pill-tab ${filter==="pendientes"?"active":""}`} onClick={() => setFilter("pendientes")}>Pendientes</button>
        </div>
      </div>

      <div className="section" style={{paddingTop: 8}}>
        {entries.length === 0 ? (
          <div className="card">
            <div className="empty">
              <div className="empty-icon"><Icon.List size={24}/></div>
              <div className="empty-title">No has registrado pronósticos</div>
              <div className="empty-hint">Ve a la pestaña Pronósticos y rellena los marcadores de los próximos partidos.</div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <div className="empty">
              <div className="empty-icon"><Icon.Search size={24}/></div>
              <div className="empty-title">No hay coincidencias</div>
              <div className="empty-hint">Cambia el filtro para ver otros pronósticos.</div>
            </div>
          </div>
        ) : (
          <div className="aciertos-list">
            {filtered.map(e => <AciertoRow key={e.match.id} entry={e}/>)}
          </div>
        )}
      </div>
    </>
  );
}

function AciertoRow({ entry }) {
  const { match: m, pred, real, hasReal, score } = entry;
  return (
    <div className="aciertos-row">
      <div style={{minWidth: 0}}>
        <div className="aciertos-meta">
          <span>G{m.group}</span>
          <span>·</span>
          <span>{m.date} · {m.time}</span>
          <span style={{marginLeft: "auto"}}>
            {hasReal
              ? <ResultPill type={score.type}/>
              : <span className="status-badge status-pending"><Icon.Clock size={9}/>Esperando resultado</span>}
          </span>
        </div>
        <div className="aciertos-teams">
          <div className="aciertos-team">
            <FlagImg team={m.home}/>
            <span className="name">{m.home}</span>
          </div>
          <div className="aciertos-scores">
            <div className="aciertos-score-row">
              <span className="score-num">{pred.home}</span>
              <span className="score-sep">:</span>
              <span className="score-num">{pred.away}</span>
              <span className="score-label">tú</span>
            </div>
            {hasReal && (
              <div className="aciertos-score-row" style={{opacity: .7, fontSize: 12}}>
                <span className="score-num">{real.home}</span>
                <span className="score-sep">:</span>
                <span className="score-num">{real.away}</span>
                <span className="score-label">real</span>
              </div>
            )}
          </div>
          <div className="aciertos-team away">
            <span className="name">{m.away}</span>
            <FlagImg team={m.away}/>
          </div>
        </div>
      </div>
      <div className="aciertos-result">
        {hasReal && (
          <div className={`cell-inner cell-${score.type}`} style={{minWidth: 36, padding: "4px 10px", margin: 0}}>
            <span style={{fontWeight: 800, fontFamily: "var(--mono)", fontSize: 13}}>+{score.pts}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultPill({ type }) {
  const labels = {
    exacto: "Exacto",
    parcial: "Parcial",
    signo: "Signo",
    fallo: "Fallaste",
  };
  return (
    <span className={`status-badge status-${type === "exacto" ? "finished" : type === "fallo" ? "live" : "soon"}`}>
      {labels[type] || "—"}
    </span>
  );
}

window.MisAciertosScreen = MisAciertosScreen;
