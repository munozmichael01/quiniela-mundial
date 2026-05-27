"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Role = "admin" | "user";

type UserProfile = {
  id: string;
  nombre: string;
  alias: string;
  role: Role;
  email: string;
  created_at?: string;
};

type Match = {
  id: number;
  group: string;
  home: string;
  away: string;
  home_flag: string | null;
  away_flag: string | null;
  date: string;
  status: "scheduled" | "live" | "finished";
  results?: Array<{ home_score: number; away_score: number; updated_at: string }> | null;
};

type Prediction = {
  id?: number;
  match_id: number;
  home_score: number;
  away_score: number;
};

type Bonus = {
  campeon: string | null;
  subcampeon: string | null;
  goleador: string | null;
  mvp: string | null;
  portero: string | null;
};

type LeaderboardEntry = {
  user_id: string;
  nombre: string;
  alias: string;
  puntos: number;
  exactos: number;
  completados: number;
  posicion: number;
};

const emptyBonus: Bonus = {
  campeon: null,
  subcampeon: null,
  goleador: null,
  mvp: null,
  portero: null,
};

const playerOptions = {
  goleador: [
    "Kylian Mbappé (FRA)",
    "Erling Haaland (NOR)",
    "Vinícius Jr (BRA)",
    "Lionel Messi (ARG)",
    "Harry Kane (ING)",
    "Lautaro Martínez (ARG)",
    "Cristiano Ronaldo (POR)",
    "Lamine Yamal (ESP)",
  ],
  mvp: [
    "Lionel Messi (ARG)",
    "Kylian Mbappé (FRA)",
    "Jude Bellingham (ING)",
    "Vinícius Jr (BRA)",
    "Rodri (ESP)",
    "Lamine Yamal (ESP)",
    "Florian Wirtz (ALE)",
  ],
  portero: [
    "Thibaut Courtois (BEL)",
    "Gianluigi Donnarumma (ITA)",
    "Emiliano Martínez (ARG)",
    "Mike Maignan (FRA)",
    "Alisson Becker (BRA)",
    "Unai Simón (ESP)",
    "Jordan Pickford (ING)",
  ],
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "No se pudo completar la acción");
  }
  return data as T;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function scorePrediction(pred?: Prediction, result?: { home_score: number; away_score: number }) {
  if (!pred || !result) return 0;
  if (pred.home_score === result.home_score && pred.away_score === result.away_score) return 3;
  const predSign = Math.sign(pred.home_score - pred.away_score);
  const realSign = Math.sign(result.home_score - result.away_score);
  if (predSign !== realSign) return 0;
  if (pred.home_score - pred.away_score === result.home_score - result.away_score) return 2;
  return 1;
}

function Flag({ code, label }: { code: string | null; label: string }) {
  if (!code) return <span className="flag-fallback" aria-hidden />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="flag-img"
      src={`https://flagcdn.com/32x24/${code}.png`}
      srcSet={`https://flagcdn.com/64x48/${code}.png 2x`}
      width={32}
      height={24}
      alt={label}
    />
  );
}

export default function QuinielaApp() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [tab, setTab] = useState<"predictions" | "hits" | "leaderboard" | "bonus" | "admin" | "profile">("predictions");

  useEffect(() => {
    api<{ user: UserProfile }>("/api/auth/me")
      .then(({ user }) => {
        setUser(user);
        if (user.role === "admin") setTab("admin");
      })
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" }).catch(() => null);
    setUser(null);
    setTab("predictions");
  }

  if (checkingSession) {
    return (
      <main className="login-shell centered">
        <div className="brand-mark">Q26</div>
        <p>Cargando quiniela...</p>
      </main>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={(profile) => {
      setUser(profile);
      setTab(profile.role === "admin" ? "admin" : "predictions");
    }} />;
  }

  return (
    <div className="app-shell">
      <div className="app-main">
        {user.role === "admin" ? (
          <AdminScreen />
        ) : (
          <>
            {tab === "predictions" && <PredictionsScreen />}
            {tab === "hits" && <HitsScreen />}
            {tab === "leaderboard" && <LeaderboardScreen currentUser={user} />}
            {tab === "bonus" && <BonusScreen />}
            {tab === "profile" && <ProfileScreen user={user} onLogout={logout} />}
          </>
        )}
      </div>

      {user.role === "admin" ? (
        <nav className="bottomnav two">
          <button className="active" type="button">Admin</button>
          <button type="button" onClick={logout}>Salir</button>
        </nav>
      ) : (
        <nav className="bottomnav">
          <button className={tab === "predictions" ? "active" : ""} type="button" onClick={() => setTab("predictions")}>Pronósticos</button>
          <button className={tab === "hits" ? "active" : ""} type="button" onClick={() => setTab("hits")}>Aciertos</button>
          <button className={tab === "leaderboard" ? "active" : ""} type="button" onClick={() => setTab("leaderboard")}>Tabla</button>
          <button className={tab === "bonus" ? "active" : ""} type="button" onClick={() => setTab("bonus")}>Bonus</button>
          <button className={tab === "profile" ? "active" : ""} type="button" onClick={() => setTab("profile")}>Perfil</button>
        </nav>
      )}
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (user: UserProfile) => void }) {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ alias, password }),
      });
      const { user } = await api<{ user: UserProfile }>("/api/auth/me");
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-hero-side">
        <div className="login-brand-desktop">
          <div className="brand-mark">Q26</div>
          <div>
            <strong>Quiniela</strong>
            <span>Mundial 2026</span>
          </div>
        </div>
        <div className="login-pitch">
          <h1>Acierta. Suma. Quédate arriba.</h1>
          <p>Predice los resultados del Mundial 2026 y compite con tu grupo desde una app conectada a datos reales.</p>
        </div>
      </section>

      <section className="login-form-side">
        <form className="login-card" onSubmit={submit}>
          <div className="mobile-brand">
            <div className="brand-mark">Q26</div>
            <div>
              <strong>Quiniela</strong>
              <span>Mundial 2026</span>
            </div>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <label className="field">
            <span>Alias</span>
            <input className="input" value={alias} onChange={(event) => setAlias(event.target.value)} placeholder="tu_alias" autoCapitalize="none" />
          </label>
          <label className="field">
            <span>Contraseña</span>
            <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
          </label>
          <button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <p className="login-hint">Pide al admin tu alias y contraseña de acceso.</p>
        </form>
      </section>
    </main>
  );
}

function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const [matchesData, predictionsData] = await Promise.all([
        api<{ matches: Match[] }>("/api/matches"),
        api<{ predictions: Prediction[] }>("/api/predictions"),
      ]);
      setMatches(matchesData.matches);
      setPredictions(Object.fromEntries(predictionsData.predictions.map((prediction) => [prediction.match_id, prediction])));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, []);

  return { matches, predictions, setPredictions, loading, error, refresh };
}

function PredictionsScreen() {
  const { matches, predictions, setPredictions, loading, error, refresh } = useMatches();
  const [openGroup, setOpenGroup] = useState<string>("A");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const groups = useMemo(() => Array.from(new Set(matches.map((match) => match.group))).sort(), [matches]);
  const completed = Object.values(predictions).filter((prediction) => prediction.home_score >= 0 && prediction.away_score >= 0).length;
  const points = matches.reduce((total, match) => total + scorePrediction(predictions[match.id], match.results?.[0]), 0);

  function updatePrediction(matchId: number, side: "home_score" | "away_score", rawValue: string) {
    const value = rawValue === "" ? Number.NaN : Number(rawValue.replace(/\D/g, "").slice(0, 2));
    setPredictions((current) => ({
      ...current,
      [matchId]: {
        match_id: matchId,
        home_score: side === "home_score" ? value : current[matchId]?.home_score ?? Number.NaN,
        away_score: side === "away_score" ? value : current[matchId]?.away_score ?? Number.NaN,
      },
    }));
  }

  async function save() {
    const payload = Object.values(predictions)
      .filter((prediction) => Number.isFinite(prediction.home_score) && Number.isFinite(prediction.away_score))
      .map(({ match_id, home_score, away_score }) => ({ match_id, home_score, away_score }));

    if (payload.length === 0) {
      setMessage("Completa al menos un partido antes de guardar.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await api("/api/predictions", { method: "PUT", body: JSON.stringify(payload) });
      setMessage("Pronósticos guardados.");
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "No se pudieron guardar los pronósticos");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar title="Mis Pronósticos" subtitle={`${completed}/${matches.length} completados`} badge={`${points} pts`} />
      <div className="section stat-row">
        <Stat label="Completados" value={`${completed}/${matches.length}`} />
        <Stat label="Puntos actuales" value={`${points}`} />
      </div>
      <DataState loading={loading} error={error} />
      <section className="section">
        <div className="group-tabs">
          {groups.map((group) => (
            <button key={group} className={openGroup === group ? "active" : ""} type="button" onClick={() => setOpenGroup(group)}>
              Grupo {group}
            </button>
          ))}
        </div>
        <div className="card match-list">
          {matches.filter((match) => match.group === openGroup).map((match) => (
            <MatchRow key={match.id} match={match} prediction={predictions[match.id]} onChange={updatePrediction} />
          ))}
        </div>
      </section>
      <div className="save-bar">
        {message && <div className="save-status">{message}</div>}
        <button className="btn btn-primary btn-block" type="button" onClick={save} disabled={saving}>
          {saving ? "Guardando..." : "Guardar pronósticos"}
        </button>
      </div>
    </>
  );
}

function MatchRow({
  match,
  prediction,
  onChange,
  readonly = false,
}: {
  match: Match;
  prediction?: Prediction;
  onChange?: (matchId: number, side: "home_score" | "away_score", value: string) => void;
  readonly?: boolean;
}) {
  const locked = readonly || new Date(match.date) <= new Date();
  const result = match.results?.[0];

  return (
    <div className="match-row">
      <div className="match-line">
        <div className="team home"><Flag code={match.home_flag} label={match.home} /><span>{match.home}</span></div>
        <div className="score-pair">
          <input
            className="score-input"
            type="number"
            min="0"
            inputMode="numeric"
            disabled={locked}
            value={Number.isFinite(prediction?.home_score) ? prediction?.home_score : ""}
            onChange={(event) => onChange?.(match.id, "home_score", event.target.value)}
            placeholder="-"
          />
          <span>:</span>
          <input
            className="score-input"
            type="number"
            min="0"
            inputMode="numeric"
            disabled={locked}
            value={Number.isFinite(prediction?.away_score) ? prediction?.away_score : ""}
            onChange={(event) => onChange?.(match.id, "away_score", event.target.value)}
            placeholder="-"
          />
        </div>
        <div className="team away"><span>{match.away}</span><Flag code={match.away_flag} label={match.away} /></div>
      </div>
      <div className="match-meta">
        <span>{formatDate(match.date)}</span>
        <span>{locked ? "Bloqueado" : "Abierto"}</span>
        {result && <strong>Real {result.home_score}-{result.away_score}</strong>}
      </div>
    </div>
  );
}

function HitsScreen() {
  const { matches, predictions, loading, error } = useMatches();
  const played = matches.filter((match) => match.results?.[0]);
  const total = played.reduce((sum, match) => sum + scorePrediction(predictions[match.id], match.results?.[0]), 0);

  return (
    <>
      <Topbar title="Mis Aciertos" subtitle={`${played.length} partidos con resultado`} badge={`${total} pts`} />
      <DataState loading={loading} error={error} />
      <section className="section">
        <div className="card compact-list">
          {played.length === 0 && <EmptyState text="Aún no hay resultados cargados." />}
          {played.map((match) => (
            <div className="result-row" key={match.id}>
              <div>
                <strong>{match.home} vs {match.away}</strong>
                <span>Tu pronóstico: {predictions[match.id] ? `${predictions[match.id].home_score}-${predictions[match.id].away_score}` : "sin completar"}</span>
              </div>
              <b>{scorePrediction(predictions[match.id], match.results?.[0])} pts</b>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function LeaderboardScreen({ currentUser }: { currentUser: UserProfile }) {
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ leaderboard: LeaderboardEntry[] }>("/api/leaderboard")
      .then(({ leaderboard }) => setRows(leaderboard))
      .catch((err) => setError(err instanceof Error ? err.message : "No se pudo cargar la tabla"))
      .finally(() => setLoading(false));
  }, []);

  const leader = rows[0];
  const me = rows.find((row) => row.user_id === currentUser.id);

  return (
    <>
      <Topbar title="Clasificación" subtitle={`${rows.length} participantes`} badge={me ? `#${me.posicion}` : undefined} />
      <DataState loading={loading} error={error} />
      {leader && (
        <section className="section">
          <div className="card leader-card">
            <span>Líder actual</span>
            <strong>{leader.nombre}</strong>
            <b>{leader.puntos} pts</b>
          </div>
        </section>
      )}
      <section className="section">
        <div className="card leaderboard">
          {rows.map((row) => (
            <div className={row.user_id === currentUser.id ? "lb-row me" : "lb-row"} key={row.user_id}>
              <span className="rank">#{row.posicion}</span>
              <span className="avatar">{initials(row.nombre)}</span>
              <div>
                <strong>{row.nombre}</strong>
                <small>@{row.alias}</small>
              </div>
              <b>{row.puntos}</b>
              <small>{row.exactos} exactos</small>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function BonusScreen() {
  const [bonus, setBonus] = useState<Bonus>(emptyBonus);
  const [teams, setTeams] = useState<string[]>([]);
  const [closed, setClosed] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<{ bonus: Bonus | null; closed: boolean; deadline: string }>("/api/bonus"),
      api<{ matches: Match[] }>("/api/matches"),
    ])
      .then(([bonusData, matchData]) => {
        setBonus(bonusData.bonus ?? emptyBonus);
        setClosed(bonusData.closed);
        setDeadline(bonusData.deadline);
        setTeams(Array.from(new Set(matchData.matches.flatMap((match) => [match.home, match.away]))).sort());
      })
      .catch((err) => setMessage(err instanceof Error ? err.message : "No se pudieron cargar los bonus"))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setMessage("");
    try {
      await api("/api/bonus", { method: "PUT", body: JSON.stringify(bonus) });
      setMessage("Bonus guardados.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "No se pudieron guardar los bonus");
    }
  }

  const fields: Array<{ key: keyof Bonus; label: string; options: string[] }> = [
    { key: "campeon", label: "Campeón", options: teams },
    { key: "subcampeon", label: "Subcampeón", options: teams },
    { key: "goleador", label: "Goleador", options: playerOptions.goleador },
    { key: "mvp", label: "MVP", options: playerOptions.mvp },
    { key: "portero", label: "Mejor portero", options: playerOptions.portero },
  ];

  return (
    <>
      <Topbar title="Bonus" subtitle={deadline ? `Cierre ${formatDate(deadline)}` : "Predicciones especiales"} badge={closed ? "Cerrado" : "Abierto"} />
      <DataState loading={loading} error={message && !message.includes("guardados") ? message : ""} />
      <section className="section">
        <div className="bonus-grid">
          {fields.map((field) => (
            <label className="bonus-card" key={field.key}>
              <span>{field.label}</span>
              <select
                className="select"
                disabled={closed}
                value={bonus[field.key] ?? ""}
                onChange={(event) => setBonus((current) => ({ ...current, [field.key]: event.target.value || null }))}
              >
                <option value="">Selecciona...</option>
                {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          ))}
        </div>
      </section>
      {!closed && (
        <div className="save-bar">
          {message && <div className="save-status">{message}</div>}
          <button className="btn btn-primary btn-block" type="button" onClick={save}>Guardar bonus</button>
        </div>
      )}
    </>
  );
}

function ProfileScreen({ user, onLogout }: { user: UserProfile; onLogout: () => void }) {
  return (
    <>
      <Topbar title="Perfil" subtitle={`@${user.alias}`} />
      <section className="section">
        <div className="card profile-card">
          <span className="avatar big">{initials(user.nombre)}</span>
          <div>
            <strong>{user.nombre}</strong>
            <span>{user.email}</span>
          </div>
        </div>
      </section>
      <section className="section">
        <button className="btn btn-secondary btn-block" type="button" onClick={onLogout}>Cerrar sesión</button>
      </section>
    </>
  );
}

function AdminScreen() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<Record<string, number | string | null | object>>({});
  const [bonusResults, setBonusResults] = useState<Bonus>(emptyBonus);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ nombre: "", alias: "", email: "" });

  async function refresh() {
    setMessage("");
    try {
      const [usersData, statsData, bonusData] = await Promise.all([
        api<{ users: UserProfile[] }>("/api/admin/users"),
        api<Record<string, number | string | null | object>>("/api/admin/stats"),
        api<{ bonus_results: Bonus | null }>("/api/admin/bonus-results"),
      ]);
      setUsers(usersData.users);
      setStats(statsData);
      setBonusResults(bonusData.bonus_results ?? emptyBonus);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "No se pudo cargar el panel admin");
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, []);

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      const result = await api<{ emailSent: boolean; emailError?: string }>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setMessage(result.emailSent ? "Usuario creado y email enviado." : `Usuario creado. Email no enviado: ${result.emailError ?? "revisa Resend"}`);
      setForm({ nombre: "", alias: "", email: "" });
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "No se pudo crear el usuario");
    }
  }

  async function saveBonusResults() {
    setMessage("");
    try {
      await api("/api/admin/bonus-results", { method: "PUT", body: JSON.stringify(bonusResults) });
      setMessage("Resultados bonus actualizados.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "No se pudieron guardar los resultados bonus");
    }
  }

  return (
    <>
      <Topbar title="Panel Admin" subtitle="Usuarios, stats y bonus" badge={`${users.length} usuarios`} />
      {message && <div className="section"><div className="notice">{message}</div></div>}
      <section className="section stat-row">
        <Stat label="Participantes" value={String(stats.totalParticipantes ?? 0)} />
        <Stat label="Pronósticos" value={String(stats.totalPronosticos ?? 0)} />
      </section>
      <section className="section">
        <h2 className="section-title">Crear usuario</h2>
        <form className="card admin-form" onSubmit={createUser}>
          <input className="input" placeholder="Nombre" value={form.nombre} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} />
          <input className="input" placeholder="Alias" value={form.alias} onChange={(event) => setForm((current) => ({ ...current, alias: event.target.value }))} />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <button className="btn btn-primary btn-block" type="submit">Crear y enviar acceso</button>
        </form>
      </section>
      <section className="section">
        <h2 className="section-title">Usuarios</h2>
        <div className="card compact-list">
          {users.map((user) => (
            <div className="user-row" key={user.id}>
              <span className="avatar">{initials(user.nombre)}</span>
              <div>
                <strong>{user.nombre}</strong>
                <small>@{user.alias} · {user.role}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section admin-last">
        <h2 className="section-title">Resultados bonus</h2>
        <div className="card admin-form">
          {(Object.keys(emptyBonus) as Array<keyof Bonus>).map((key) => (
            <input
              className="input"
              key={key}
              placeholder={key}
              value={bonusResults[key] ?? ""}
              onChange={(event) => setBonusResults((current) => ({ ...current, [key]: event.target.value || null }))}
            />
          ))}
          <button className="btn btn-secondary btn-block" type="button" onClick={saveBonusResults}>Guardar resultados bonus</button>
        </div>
      </section>
    </>
  );
}

function Topbar({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) {
  return (
    <header className="topbar">
      <div className="brand-mark small">Q26</div>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {badge && <span className="tag">{badge}</span>}
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DataState({ loading, error }: { loading: boolean; error: string }) {
  if (loading) return <div className="section"><div className="notice">Cargando datos...</div></div>;
  if (error) return <div className="section"><div className="error-msg">{error}</div></div>;
  return null;
}

function EmptyState({ text }: { text: string }) {
  return <div className="empty-state">{text}</div>;
}
