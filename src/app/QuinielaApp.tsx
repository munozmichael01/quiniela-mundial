"use client";

import { Dispatch, FormEvent, SetStateAction, useEffect, useMemo, useState } from "react";

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

type AdminStats = {
  totalParticipantes: number;
  totalPronosticos: number;
  partidosJugados: number;
  partidosPendientes: number;
  puntosPromedio: number;
  lider: { nombre: string; alias: string; puntos: number } | null;
  proximoPartido: {
    id: number;
    home: string;
    away: string;
    home_flag: string | null;
    away_flag: string | null;
    date: string;
  } | null;
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
  const [tab, setTab] = useState<"summary" | "users" | "phases" | "results" | "matrix" | "bonus" | "pbonus">("summary");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [bonusResults, setBonusResults] = useState<Bonus>(emptyBonus);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ nombre: "", alias: "", email: "" });

  async function refresh() {
    setMessage("");
    try {
      const [usersData, statsData, bonusData, matchesData, leaderboardData] = await Promise.all([
        api<{ users: UserProfile[] }>("/api/admin/users"),
        api<AdminStats>("/api/admin/stats"),
        api<{ bonus_results: Bonus | null }>("/api/admin/bonus-results"),
        api<{ matches: Match[] }>("/api/matches"),
        api<{ leaderboard: LeaderboardEntry[] }>("/api/leaderboard"),
      ]);
      setUsers(usersData.users);
      setStats(statsData);
      setBonusResults(bonusData.bonus_results ?? emptyBonus);
      setMatches(matchesData.matches);
      setLeaderboard(leaderboardData.leaderboard);
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
      <Topbar title="Panel admin" subtitle="Gestión de la quiniela" badge="ADMIN" />
      <section className="section admin-tabs-section">
        <div className="pill-tabs admin-pill-tabs">
          {[
            ["summary", "Resumen"],
            ["users", "Usuarios"],
            ["phases", "Fases"],
            ["results", "Resultados"],
            ["matrix", "Por jugador"],
            ["bonus", "Bonus oficiales"],
            ["pbonus", "Bonus jugadores"],
          ].map(([id, label]) => (
            <button
              className={`pill-tab ${tab === id ? "active" : ""}`}
              key={id}
              onClick={() => setTab(id as typeof tab)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </section>
      {message && <div className="section"><div className="notice">{message}</div></div>}

      {tab === "summary" && <AdminSummary stats={stats} users={users} matches={matches} />}
      {tab === "users" && (
        <AdminUsers users={users} form={form} setForm={setForm} createUser={createUser} />
      )}
      {tab === "phases" && <AdminPhases matches={matches} />}
      {tab === "results" && <AdminResults matches={matches} />}
      {tab === "matrix" && <AdminMatrix leaderboard={leaderboard} />}
      {tab === "bonus" && (
        <AdminBonusOfficial bonusResults={bonusResults} setBonusResults={setBonusResults} saveBonusResults={saveBonusResults} />
      )}
      {tab === "pbonus" && <AdminBonusPlayers />}
    </>
  );
}

function AdminSummary({ stats, users, matches }: { stats: AdminStats | null; users: UserProfile[]; matches: Match[] }) {
  const totalMatches = (stats?.partidosJugados ?? 0) + (stats?.partidosPendientes ?? 0);
  const paidCount = users.filter((user) => user.role === "user").length;
  const nextMatch = stats?.proximoPartido ?? matches.find((match) => new Date(match.date) > new Date()) ?? null;

  return (
    <>
      <section className="section">
        <h2 className="section-title">Estado del torneo</h2>
        <div className="dash-grid">
          <DashboardCard icon="users" label="Participantes" value={String(stats?.totalParticipantes ?? 0)} sub={`${paidCount} registrados`} />
          <DashboardCard icon="check" label="Jugados" value={String(stats?.partidosJugados ?? 0)} suffix={`/ ${totalMatches || 0}`} sub={`${stats?.partidosPendientes ?? 0} pendientes`} />
          <DashboardCard icon="list" label="Pronósticos" value={String(stats?.totalPronosticos ?? 0)} sub="marcadores registrados" />
          <DashboardCard icon="bar" label="Promedio" value={String(stats?.puntosPromedio ?? 0)} suffix="pts" sub="por participante" />
          <DashboardCard icon="lock" label="Fases abiertas" value="1" suffix="/ 7" sub="disponibles para pronosticar" />
          <DashboardCard icon="star" label="Recaudado" value={`$${paidCount * 10}`} sub={`${paidCount}× $10 · meta $${Math.max(paidCount, stats?.totalParticipantes ?? 0) * 10}`} />
        </div>
      </section>

      {stats?.lider && (
        <section className="section section-tight">
          <h2 className="section-title">Líder</h2>
          <div className="dash-highlight">
            <div className="dash-icon-lg"><AdminIcon name="trophy" /></div>
            <div>
              <div className="dash-h-label">Va primero con</div>
              <div className="dash-h-title">{stats.lider.nombre}</div>
              <div className="dash-h-sub">{stats.lider.puntos} pts · @{stats.lider.alias}</div>
            </div>
          </div>
        </section>
      )}

      {nextMatch && (
        <section className="section section-tight">
          <h2 className="section-title">Próximo partido</h2>
          <div className="dash-highlight">
            <div className="dash-icon-lg soft"><AdminIcon name="clock" /></div>
            <div>
              <div className="dash-h-label">{formatDate(nextMatch.date)}</div>
              <div className="dash-h-title next-match-title">
                <Flag code={nextMatch.home_flag} label={nextMatch.home} />
                {nextMatch.home}
                <span>vs</span>
                <Flag code={nextMatch.away_flag} label={nextMatch.away} />
                {nextMatch.away}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function DashboardCard({ icon, label, value, suffix, sub }: { icon: string; label: string; value: string; suffix?: string; sub: string }) {
  return (
    <div className="dash-card">
      <div className="dash-card-head">
        <span className="dash-icon"><AdminIcon name={icon} /></span>
        {label}
      </div>
      <div className="dash-value">{value}{suffix && <small>{suffix}</small>}</div>
      <div className="dash-sub">{sub}</div>
    </div>
  );
}

function AdminUsers({
  users,
  form,
  setForm,
  createUser,
}: {
  users: UserProfile[];
  form: { nombre: string; alias: string; email: string };
  setForm: Dispatch<SetStateAction<{ nombre: string; alias: string; email: string }>>;
  createUser: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <>
      <section className="section">
        <h2 className="section-title">Crear usuario</h2>
        <form className="card admin-create-card" onSubmit={createUser}>
          <label className="field">
            <span>Nombre completo</span>
            <input className="input" placeholder="Ana García" value={form.nombre} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} />
          </label>
          <label className="field">
            <span>Alias</span>
            <input className="input" placeholder="ana_garcia" value={form.alias} onChange={(event) => setForm((current) => ({ ...current, alias: event.target.value }))} />
          </label>
          <label className="field">
            <span>Email</span>
            <input className="input" type="email" placeholder="ana@email.com" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </label>
          <button className="btn btn-primary btn-block" type="submit">Crear usuario y enviar contraseña</button>
        </form>
      </section>
      <section className="section section-tight">
        <div className="admin-list-head">
          <h2 className="section-title">Participantes · {users.length}</h2>
        </div>
        <div className="card">
          {users.map((user) => (
            <div className="user-card" key={user.id}>
              <div className="user-card-head">
                <div className="user-avatar">{initials(user.nombre)}</div>
                <div className="user-card-info">
                  <div className="user-card-name">{user.nombre}<span className="tag mini">{user.role}</span></div>
                  <div className="user-card-meta">@{user.alias} · {user.email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function AdminPhases({ matches }: { matches: Match[] }) {
  const groups = Array.from(new Set(matches.map((match) => match.group))).sort();
  return (
    <section className="section">
      <div className="notice">Las fases de eliminatoria todavía dependen de que el fixture oficial esté disponible. Grupos queda abierto para pronósticos.</div>
      <div className="card phase-card">
        {["groups", "r32", "r16", "qf", "sf", "third", "final"].map((phase, index) => (
          <div className="phase-row" key={phase}>
            <div className="phase-row-icon"><AdminIcon name={index === 0 ? "check" : "lock"} /></div>
            <div className="phase-row-info">
              <div className="phase-row-title">{["Grupos", "Dieciseisavos", "Octavos", "Cuartos", "Semifinales", "3er puesto", "Final"][index]}</div>
              <div className="phase-row-sub">{index === 0 ? `${groups.length} grupos · ${matches.length} partidos` : "Pendiente de cruces oficiales"}</div>
            </div>
            <button className={`paid-toggle ${index === 0 ? "on" : "off"}`} type="button">
              <span className="paid-toggle-knob" />
              <span className="paid-toggle-label">{index === 0 ? "Abierta" : "Cerrada"}</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminResults({ matches }: { matches: Match[] }) {
  return (
    <section className="section">
      <h2 className="section-title">Resultados</h2>
      <div className="card admin-results-list">
        {matches.map((match) => {
          const result = match.results?.[0];
          return (
            <div className="match-row" key={match.id}>
              <div className="match-team home"><Flag code={match.home_flag} label={match.home} /><span className="name">{match.home}</span></div>
              <div className="match-score readonly-score">{result ? `${result.home_score}:${result.away_score}` : "–:–"}</div>
              <div className="match-team away"><span className="name">{match.away}</span><Flag code={match.away_flag} label={match.away} /></div>
              <div className="match-meta">{formatDate(match.date)} · {result ? "Cargado" : "Pendiente"}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AdminMatrix({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  return (
    <section className="section">
      <div className="legend">
        <span className="legend-item"><span className="legend-dot cell-exacto" />Exactos</span>
        <span className="legend-item"><span className="legend-dot cell-parcial" />Puntos</span>
      </div>
      <div className="matrix-wrap">
        <div className="matrix-scroll">
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="head-player">Participante</th>
                <th>Puntos</th>
                <th>Exactos</th>
                <th>Completos</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row) => (
                <tr key={row.user_id}>
                  <td className="cell-player">
                    <div className="cell-player-inner">
                      <div className="user-avatar small">{initials(row.nombre)}</div>
                      <div>
                        <div className="pname">{row.nombre}</div>
                        <div className="ppts">@{row.alias}</div>
                      </div>
                    </div>
                  </td>
                  <td className="matrix-cell"><div className="cell-inner cell-parcial">{row.puntos}</div></td>
                  <td className="matrix-cell"><div className="cell-inner cell-exacto">{row.exactos}</div></td>
                  <td className="matrix-cell"><div className="cell-inner cell-pending">{row.completados}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function AdminBonusOfficial({
  bonusResults,
  setBonusResults,
  saveBonusResults,
}: {
  bonusResults: Bonus;
  setBonusResults: Dispatch<SetStateAction<Bonus>>;
  saveBonusResults: () => Promise<void>;
}) {
  return (
    <>
      <section className="section">
        <div className="notice">Confirma los bonus oficiales al terminar el torneo. Se sumarán automáticamente al ranking.</div>
      </section>
      <section className="section section-tight">
        <h2 className="section-title">Resultados oficiales</h2>
        <div className="bonus-grid">
          {(Object.keys(emptyBonus) as Array<keyof Bonus>).map((key) => (
            <label className="bonus-card" key={key}>
              <div className="bonus-icon"><AdminIcon name="star" /></div>
              <div className="bonus-body">
                <div className="bonus-label">{key}</div>
                <input
                  className="input ghost-input"
                  value={bonusResults[key] ?? ""}
                  onChange={(event) => setBonusResults((current) => ({ ...current, [key]: event.target.value || null }))}
                />
              </div>
            </label>
          ))}
        </div>
        <div className="save-bar static-save">
          <button className="btn btn-primary btn-block" type="button" onClick={saveBonusResults}>Confirmar bonus oficiales</button>
        </div>
      </section>
    </>
  );
}

function AdminBonusPlayers() {
  return (
    <section className="section">
      <div className="notice">La vista de bonus por jugador necesita leer todos los bonus de participantes desde un endpoint admin. La pestaña queda reservada con el diseño original.</div>
    </section>
  );
}

function AdminIcon({ name }: { name: string }) {
  const glyphs: Record<string, string> = {
    users: "U",
    check: "✓",
    list: "☷",
    bar: "▥",
    lock: "▣",
    star: "☆",
    trophy: "T",
    clock: "◷",
  };
  return <span className="admin-icon-glyph" aria-hidden>{glyphs[name] ?? "•"}</span>;
}

function Topbar({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) {
  return (
    <header className="topbar">
      <div className="topbar-logo">Q26</div>
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">{subtitle}</div>
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
