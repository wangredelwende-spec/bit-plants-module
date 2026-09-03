// Nav items mirroring mockup/index.html sidebar exactly.
// Overview and Growth Calendar are functional; other sections are "coming soon" (disabled).
const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    disabled: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-8 9 8"/>
        <path d="M5 10v10h14V10"/>
      </svg>
    ),
  },
  {
    id: 'varieties',
    label: 'Varieties',
    disabled: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-8"/>
        <path d="M12 14c-4 0-7-2.5-7-6s3-6 7-6 7 2.5 7 6-3 6-7 6z"/>
        <path d="M9 22h6"/>
      </svg>
    ),
  },
  {
    id: 'calendar',
    label: 'Growth Calendar',
    disabled: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16"/>
        <path d="M8 20v-6"/>
        <path d="M12 20V8"/>
        <path d="M16 20v-4"/>
        <path d="M12 8c2-3 5-4 7-3-1 3-4 5-7 4"/>
      </svg>
    ),
  },
  {
    id: 'fertilizers',
    label: 'Fertilizer Inventory',
    disabled: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L8 8h8l-4-6z"/>
        <rect x="7" y="8" width="10" height="12" rx="1"/>
        <path d="M12 12v5M10 14h4"/>
      </svg>
    ),
  },
  {
    id: 'diseases',
    label: 'Diseases & Alerts',
    disabled: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c-3 0-6 2.5-6 6 0 2.5 1.5 4.5 4 5.5L8 22h8l-2-7.5c2.5-1 4-3 4-5.5 0-3.5-3-6-6-6z"/>
        <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none"/>
        <circle cx="14" cy="8" r="1" fill="currentColor" stroke="none"/>
        <circle cx="11" cy="12" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'harvest',
    label: 'Harvest & Maturity',
    disabled: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="13" rx="6" ry="7"/>
        <path d="M12 6c1-2 3-4 5-4"/>
        <path d="M12 6c-0.5-1.5 0-3 1-4"/>
      </svg>
    ),
  },
  {
    id: 'nursery',
    label: 'Nursery',
    disabled: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 18v-6"/>
        <path d="M12 12c-3-2-4-6-2-9 3 1 4 5 2 9z"/>
        <path d="M12 12c3-2 4-6 2-9-3 1-4 5-2 9z"/>
        <path d="M7 22c0-3 2.5-5 5-5s5 2 5 5"/>
      </svg>
    ),
  },
  {
    id: 'scenario',
    label: 'Scenario Analysis',
    disabled: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
];

export default function AppNav({ currentScreen, onNavigate }) {
  return (
    <nav className="app-nav" aria-label="Main navigation">
      <div className="app-nav__logo-box">
        <div className="logo-circle">
          <img src="/logo.png" alt="Plants Module Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.8)' }} />
        </div>
        <div className="module-name font-heading">PLANTS<br /><span className="module-sub">Banfora Mango Farm</span></div>
      </div>

      <div className="app-nav__divider" />

      <div className="app-nav__links">
        {NAV_ITEMS.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <a
              key={item.id}
              href="#"
              id={`nav-${item.id}`}
              className={`app-nav__link${isActive ? ' app-nav__link--active' : ''}${item.disabled ? ' app-nav__link--disabled' : ''}`}
              title={item.disabled ? 'Coming soon' : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (!item.disabled) {
                  onNavigate(item.id);
                }
              }}
            >
              {item.icon}
              {item.label}
            </a>
          );
        })}
      </div>

      <div className="app-nav__footer">
        <div className="app-nav__status">
          <div className="status-dot" />
          Online · Banfora, Cascades
        </div>
        <a href="#" className="app-nav__logout" onClick={(e) => e.preventDefault()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          Logout
        </a>
      </div>
    </nav>
  );
}
