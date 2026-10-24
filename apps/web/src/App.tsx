import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';

type ApiHealth = {
  status: 'ok' | 'unavailable';
  database: 'connected' | 'disconnected';
};

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true">w.</span>;
}

function ApiStatus() {
  const [health, setHealth] = useState<ApiHealth | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkHealth = () => {
      fetch('/api/health')
        .then((response) => {
          if (!response.ok) throw new Error('API unavailable');
          return response.json() as Promise<ApiHealth>;
        })
        .then((result) => {
          if (isMounted) setHealth(result);
        })
        .catch(() => {
          if (isMounted) setHealth(null);
        });
    };

    checkHealth();
    const interval = window.setInterval(checkHealth, 3000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const connected = health?.status === 'ok' && health.database === 'connected';

  return (
    <div className={`connection-pill ${connected ? 'is-connected' : 'is-offline'}`} title="API and MongoDB status">
      <span className="status-dot" />
      {connected ? 'Systems connected' : 'API disconnected'}
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <Link className="brand" to="/" aria-label="Whosthebest home">
        <BrandMark />
        <span>whosthebest</span>
      </Link>

      <div className="sidebar-label">Workspace</div>
      <nav className="main-nav" aria-label="Main navigation">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">◫</span> Overview
        </NavLink>
        <NavLink to="/games" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">⌘</span> My games
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">↗</span> Leaderboard
          <span className="nav-soon">Soon</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="profile-card">
          <div className="profile-avatar">G</div>
          <div className="profile-copy">
            <strong>Guest player</strong>
            <span>Local preview</span>
          </div>
          <span className="profile-menu">···</span>
        </div>
        <span className="version-label">FOUNDATION BUILD · 0.1</span>
      </div>
    </aside>
  );
}

function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <ApiStatus />
    </header>
  );
}

function EmptyGameCard() {
  return (
    <section className="empty-card">
      <div className="empty-art" aria-hidden="true">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="game-symbol">✳</div>
        <span className="spark spark-one">✦</span>
        <span className="spark spark-two">✧</span>
      </div>
      <div className="empty-copy">
        <span className="empty-kicker">YOUR NEXT LEVEL STARTS HERE</span>
        <h2>Your gaming story<br />starts with a game.</h2>
        <p>Link your game accounts to bring your stats, milestones, and progress together in one place.</p>
        <button type="button" className="primary-button" disabled title="Game account linking is coming in a future build">
          <span>＋</span> Connect a game <span className="button-arrow">↗</span>
        </button>
        <span className="preview-note">Account linking is coming soon</span>
      </div>
    </section>
  );
}

function OverviewPage() {
  return (
    <>
      <PageHeader eyebrow="YOUR SPACE" title="Good games. Better stories." description="Your gaming stats will find a home here." />
      <div className="welcome-strip">
        <div className="welcome-icon">✦</div>
        <div>
          <strong>A fresh start</strong>
          <span>Your dashboard is ready. Connect a game when account linking becomes available.</span>
        </div>
        <span className="strip-tag">PLAYER 001</span>
      </div>
      <div className="section-heading">
        <div>
          <span className="section-overline">THE COLLECTION</span>
          <h2>Your games <span className="count-badge">0</span></h2>
        </div>
        <span className="muted-label">UPDATED JUST NOW</span>
      </div>
      <EmptyGameCard />
      <div className="bottom-grid">
        <section className="mini-panel">
          <div className="panel-heading"><span className="panel-icon purple">◷</span><span>Recent activity</span><span className="panel-faint">01</span></div>
          <p>Your latest achievements and stat updates will show up here.</p>
          <span className="panel-status">WAITING FOR YOUR FIRST GAME</span>
        </section>
        <section className="mini-panel stat-panel">
          <div className="panel-heading"><span className="panel-icon lime">↗</span><span>Player stats</span><span className="panel-faint">02</span></div>
          <div className="stat-placeholders"><div><strong>—</strong><span>GAMES</span></div><i /><div><strong>—</strong><span>ACHIEVEMENTS</span></div><i /><div><strong>—</strong><span>HOURS PLAYED</span></div></div>
          <span className="panel-status">YOUR NUMBERS, ALL IN ONE PLACE</span>
        </section>
      </div>
      <footer className="page-footer"><span>MADE FOR THE LOVE OF THE GAME</span><span>MORE TO COME <i>↗</i></span></footer>
    </>
  );
}

function GamesPage() {
  return (
    <>
      <PageHeader eyebrow="YOUR LIBRARY" title="My games" description="Keep every game and its stats together." />
      <EmptyGameCard />
    </>
  );
}

function LeaderboardPage() {
  return (
    <>
      <PageHeader eyebrow="THE COMMUNITY" title="Leaderboard" description="See how your stats stack up with friends." />
      <section className="coming-card"><span className="coming-star">✳</span><span className="empty-kicker">IN THE WORKS</span><h2>Your next friendly rivalry<br />is on its way.</h2><p>Community rankings will arrive after player profiles and game stats are ready.</p></section>
    </>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <div className="mobile-brand"><BrandMark /><span>whosthebest</span><ApiStatus /></div>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="*" element={<OverviewPage />} />
        </Routes>
      </main>
    </div>
  );
}
