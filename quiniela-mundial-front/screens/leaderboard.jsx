// Tabla de clasificación — accesible para todos los usuarios

function LeaderboardScreen({ currentUser, realResults }) {
  const { PARTICIPANTS, MATCHES } = window.QUINIELA_DATA;
  const [sortBy, setSortBy] = React.useState("pts");

  // Compute live stats for each participant using their seed predictions
  const enriched = React.useMemo(() => {
    return PARTICIPANTS.map(p => {
      const stats = window.aggregateStats(p.predictions, realResults);
      const isMe = currentUser && currentUser.user === p.user;
      return { ...p, ...stats, isMe };
    });
  }, [realResults, currentUser]);

  const sorted = React.useMemo(() => {
    const arr = [...enriched];
    const cmp = {
      pts:         (a,b) => b.pts - a.pts || b.exactos - a.exactos,
      exactos:     (a,b) => b.exactos - a.exactos || b.pts - a.pts,
      parciales:   (a,b) => b.parciales - a.parciales || b.pts - a.pts,
      completados: (a,b) => b.completados - a.completados || b.pts - a.pts,
    };
    arr.sort(cmp[sortBy] || cmp.pts);
    return arr;
  }, [enriched, sortBy]);

  const meIdx = sorted.findIndex(p => p.isMe);
  const me = meIdx >= 0 ? sorted[meIdx] : null;
  const leader = sorted[0];

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">Clasificación</div>
          <div className="topbar-sub">{PARTICIPANTS.length} participantes</div>
        </div>
      </div>

      <div className="section" style={{paddingBottom: 10}}>
        <div className="card" style={{padding: "14px 16px", display: "flex", alignItems: "center", gap: 12}}>
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            background: "var(--primary)", color: "white",
            display: "grid", placeItems: "center", flexShrink: 0
          }}>
            <Icon.Trophy size={20}/>
          </div>
          <div style={{flex: 1, minWidth: 0}}>
            <div className="muted-2" style={{fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700}}>
              Líder actual
            </div>
            <div style={{fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em", marginTop: 2}}>
              {leader.name}
            </div>
            <div className="muted-2" style={{marginTop: 2}}>
              {leader.pts} pts · {leader.exactos} exactos · {leader.parciales} parciales
            </div>
          </div>
          {me && (
            <div style={{textAlign: "right"}}>
              <div className="muted-2" style={{fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700}}>
                Tu pos.
              </div>
              <div style={{fontWeight: 800, fontSize: 22, color: "var(--primary-dark)", marginTop: 2, fontVariantNumeric: "tabular-nums"}}>
                #{meIdx + 1}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section" style={{paddingTop: 4, paddingBottom: 8}}>
        <div className="pill-tabs" style={{display: "flex", overflowX: "auto", maxWidth: "100%"}}>
          <button className={`pill-tab ${sortBy === "pts" ? "active" : ""}`} onClick={() => setSortBy("pts")}>Puntos</button>
          <button className={`pill-tab ${sortBy === "exactos" ? "active" : ""}`} onClick={() => setSortBy("exactos")}>Exactos</button>
          <button className={`pill-tab ${sortBy === "parciales" ? "active" : ""}`} onClick={() => setSortBy("parciales")}>Parciales</button>
          <button className={`pill-tab ${sortBy === "completados" ? "active" : ""}`} onClick={() => setSortBy("completados")}>Completos</button>
        </div>
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="lb-wide">
          <div className="lb-wide-head">
            <div className="cw-pos">Pos</div>
            <div className="cw-name">Participante</div>
            <div className="cw-pts">Pts</div>
            <div className="cw-stat">Ex</div>
            <div className="cw-stat">Pc</div>
            <div className="cw-stat">Sg</div>
            <div className="cw-comp">Comp</div>
          </div>
          {sorted.map((p, i) => (
            <div key={p.user} className={`lb-wide-row ${p.isMe ? "me" : ""}`}>
              <div className="cw-pos">
                <span className={`pos-chip ${i < 3 ? `top-${i+1}` : ""} ${p.isMe ? "me" : ""}`}>
                  {i + 1}
                </span>
              </div>
              <div className="cw-name">
                <div className="user-avatar small">{p.initials}</div>
                <div className="cw-name-text">
                  <div className={`cw-name-main ${p.isMe ? "me" : ""}`}>
                    {p.name}
                    {i === 0 && <span className="crown">👑</span>}
                  </div>
                  <div className="cw-name-sub">@{p.user}</div>
                </div>
              </div>
              <div className="cw-pts">{p.pts}</div>
              <div className="cw-stat ex">{p.exactos}</div>
              <div className="cw-stat pc">{p.parciales}</div>
              <div className="cw-stat sg">{p.signos}</div>
              <div className="cw-comp">{p.completados}/{MATCHES.length}</div>
            </div>
          ))}
        </div>

        <div className="muted-2" style={{marginTop: 14, fontSize: 11, textAlign: "center", lineHeight: 1.6}}>
          <strong>Exacto</strong> +3 pts · <strong>Parcial</strong> +2 pts · <strong>Signo</strong> +1 pt<br/>
          Los puntos bonus se suman al final del torneo
        </div>
      </div>
    </>
  );
}

window.LeaderboardScreen = LeaderboardScreen;
