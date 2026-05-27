// Bonus — 5 selectores con cierre automático el 11 de junio

function BonusScreen({ bonus, setBonus }) {
  const { ALL_TEAMS, TOP_SCORERS, MVP_CANDIDATES, GOALKEEPERS } = window.QUINIELA_DATA;
  const [toast, setToast] = React.useState("");
  const closed = window.bonusClosed();

  const fields = [
    { key: "campeon", label: "Campeón", icon: "Trophy", options: ALL_TEAMS, withFlags: true },
    { key: "subcampeon", label: "Subcampeón", icon: "Shield", options: ALL_TEAMS, withFlags: true },
    { key: "goleador", label: "Goleador del Mundial", icon: "Ball", options: TOP_SCORERS },
    { key: "mvp", label: "MVP / Balón de Oro", icon: "Star", options: MVP_CANDIDATES },
    { key: "portero", label: "Mejor Portero", icon: "Glove", options: GOALKEEPERS },
  ];

  const completed = fields.filter(f => bonus[f.key]).length;

  function set(key, val) {
    if (closed) return;
    setBonus(prev => ({ ...prev, [key]: val }));
  }

  function save() {
    setToast("Bonus guardados");
    setTimeout(() => setToast(""), 1800);
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">Bonus</div>
          <div className="topbar-sub">5 predicciones especiales</div>
        </div>
        <div className="topbar-right">
          {closed
            ? <span className="tag" style={{background:"#ECEFEB", color:"var(--ink-2)"}}><Icon.Lock size={9}/> Cerrado</span>
            : <span className="tag">{completed}/5</span>}
        </div>
      </div>

      <div className="section" style={{paddingBottom: 8}}>
        {closed ? (
          <div className="notice closed">
            <Icon.Lock size={16}/>
            <div>
              <strong>Periodo de predicciones cerrado.</strong><br/>
              El cierre fue el {window.BONUS_DEADLINE_LABEL}. Tus picks quedaron como los guardaste.
            </div>
          </div>
        ) : (
          <div className="notice">
            <Icon.Alert size={18}/>
            <div>
              <strong>Cierre: {window.BONUS_DEADLINE_LABEL}.</strong><br/>
              Tras el primer partido del Mundial no podrás modificar tus bonus.
            </div>
          </div>
        )}
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="section-title">Tus picks</div>

        <div className="bonus-grid">
        {fields.map(f => {
          const IconComp = Icon[f.icon];
          const value = bonus[f.key] || "";
          return (
            <div className={`bonus-card ${closed ? "locked" : ""}`} key={f.key}>
              <div className="bonus-icon">
                <IconComp size={20}/>
              </div>
              <div className="bonus-body">
                <div className="bonus-label">{f.label}</div>
                <select
                  className="select"
                  value={value}
                  disabled={closed}
                  onChange={e => set(f.key, e.target.value)}
                  style={{height: 38, fontSize: 14, fontWeight: 600, padding: "0 32px 0 0", border: 0, background: "transparent", color: value ? "var(--ink)" : "var(--ink-3)", backgroundPosition: "right 4px center"}}
                >
                  <option value="">Selecciona…</option>
                  {f.options.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <div className="section" style={{paddingTop: 0}}>
        <div className="card" style={{padding: "14px 16px"}}>
          <div className="section-title" style={{margin: 0, marginBottom: 8}}>Puntos bonus</div>
          <div style={{display: "grid", gridTemplateColumns: "1fr auto", gap: 4, fontSize: 13}}>
            <div>Campeón correcto</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+15</div>
            <div>Subcampeón correcto</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+8</div>
            <div>Goleador correcto</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+10</div>
            <div>MVP correcto</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+10</div>
            <div>Mejor portero</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+7</div>
          </div>
        </div>
      </div>

      {!closed && (
        <div className="save-bar">
          <button className="btn btn-primary btn-block" onClick={save}>
            <Icon.Check size={18}/>
            Guardar bonus
          </button>
          <div className="save-status">
            {completed < 5
              ? `Te faltan ${5 - completed} ${5 - completed === 1 ? "predicción" : "predicciones"}`
              : "Bonus completos ✓"}
          </div>
        </div>
      )}

      {toast && <div className="copied-flash">{toast}</div>}
    </>
  );
}

window.BonusScreen = BonusScreen;
