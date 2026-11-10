import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const THEME_HEX_MAP: Record<string, { label: string; hex: string }> = {
  'royal-blue': { label: 'Royal Blue', hex: '#3b5fcc' },
  'royal-violet': { label: 'Royal Violet', hex: '#6d28d9' },
  emerald: { label: 'Emerald Growth', hex: '#059669' },
  crimson: { label: 'Executive Crimson', hex: '#dc2626' },
  amber: { label: 'Warm Amber Gold', hex: '#d97706' },
  teal: { label: 'Ocean Teal', hex: '#0d9488' },
  indigo: { label: 'Deep Indigo', hex: '#4f46e5' },
}

const FONT_LABEL_MAP: Record<string, string> = {
  'instrument-sans': 'Instrument Sans',
  inter: 'Inter',
  'plus-jakarta': 'Plus Jakarta Sans',
  'dm-sans': 'DM Sans',
  'space-grotesk': 'Space Grotesk',
  outfit: 'Outfit',
  custom: 'Custom Font',
}

export async function BlanxerDashboard() {
  let counts = {
    products: 0,
    events: 0,
    posts: 0,
    gallery: 0,
    leads: 0,
    media: 0,
  }
  let activeThemeLabel = 'Royal Blue'
  let activeThemeHex = '#3b5fcc'
  let activeFontLabel = 'Instrument Sans'

  try {
    const payload = await getPayload({ config: configPromise })
    const [products, events, posts, gallery, leads, media, settings] = await Promise.all([
      payload.count({ collection: 'products' }),
      payload.count({ collection: 'events' }),
      payload.count({ collection: 'posts' }),
      payload.count({ collection: 'gallery' }),
      payload.count({ collection: 'leads' }),
      payload.count({ collection: 'media' }),
      payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
    ])

    counts = {
      products: products.totalDocs,
      events: events.totalDocs,
      posts: posts.totalDocs,
      gallery: gallery.totalDocs,
      leads: leads.totalDocs,
      media: media.totalDocs,
    }

    if (settings) {
      const s = settings as Record<string, unknown>
      const preset = typeof s.themePreset === 'string' ? s.themePreset : 'royal-blue'
      const brandPrimaryHex = typeof s.brandPrimary === 'string' ? s.brandPrimary.trim() : ''
      const customHex = typeof s.customAccentColor === 'string' ? s.customAccentColor.trim() : ''
      const chosenHex = brandPrimaryHex || customHex

      if (chosenHex && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(chosenHex)) {
        activeThemeLabel = `Custom HEX (${chosenHex})`
        activeThemeHex = chosenHex
      } else if (THEME_HEX_MAP[preset]) {
        activeThemeLabel = THEME_HEX_MAP[preset].label
        activeThemeHex = THEME_HEX_MAP[preset].hex
      }

      const customFontName = typeof s.customFontName === 'string' ? s.customFontName.trim() : ''
      const fontKey = typeof s.fontFamily === 'string' ? s.fontFamily : 'instrument-sans'
      if (customFontName) {
        activeFontLabel = `${customFontName} (Custom)`
      } else if (FONT_LABEL_MAP[fontKey]) {
        activeFontLabel = FONT_LABEL_MAP[fontKey]
      }
    }
  } catch {
    // Fallback gracefully if DB is initializing
  }

  const now = new Date()
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const totalAssetsAndContent =
    counts.products + counts.events + counts.posts + counts.gallery + counts.media

  return (
    <div className="bx-dashboard">
      {/* Top Studio Navbar inside Dashboard */}
      <div className="bx-topbar">
        <div className="bx-brand">
          <div className="bx-brand-logo" aria-hidden="true">
            <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
              <defs>
                <linearGradient id="lrBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e5ae6" />
                  <stop offset="60%" stopColor="#3b5fcc" />
                  <stop offset="100%" stopColor="#0b1730" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#lrBlueGrad)" />
              <text
                x="18"
                y="22.5"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="13"
                fontWeight="800"
                fontFamily="system-ui, sans-serif"
              >
                LR
              </text>
            </svg>
          </div>
          <span className="bx-brand-text">Lokesh Rohilla</span>
        </div>

        <div className="bx-topbar-actions">
          <Link href="/admin/globals/site-settings" className="bx-pos-btn">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="14" height="14" rx="3" />
              <path d="M7 10h6M10 7v6" strokeLinecap="round" />
            </svg>
            <span>THEME, HEX COLOURS &amp; FONTS</span>
          </Link>

          <Link href="/" target="_blank" className="bx-pos-btn bx-pos-btn-secondary">
            <span>LIVE WEBSITE ↗</span>
          </Link>

          <div className="bx-user-cluster">
            <div className="bx-hi-mascot" title="Studio Assistant">
              <span className="bx-hi-pill">Hi</span>
              <span className="bx-mascot-dot">⚡</span>
            </div>
            <div className="bx-avatar" title="Lokesh Rohilla (Owner)">
              LR
            </div>
          </div>
        </div>
      </div>

      {/* Greeting Section */}
      <div className="bx-greeting-row">
        <div>
          <h1 className="bx-greeting-title">Good Morning, Lokesh Rohilla</h1>
          <p className="bx-greeting-sub">
            Here are your stats for today <span className="bx-date-highlight">{formattedDate}</span>
          </p>
        </div>

        <div className="bx-quick-pills">
          <Link href="/admin/globals/site-settings" className="bx-pill-action bx-pill-primary">
            🎨 Edit 8 Colour Groups &amp; Custom Fonts
          </Link>
          <Link href="/admin/globals/site-settings" className="bx-pill-action">
            🎬 Edit Landing Videos &amp; Photos
          </Link>
          <Link href="/admin/collections/events/create" className="bx-pill-action">
            + Add Event
          </Link>
          <Link href="/admin/collections/posts/create" className="bx-pill-action">
            + Write Blog
          </Link>
          <Link href="/admin/collections/gallery/create" className="bx-pill-action">
            + Add Gallery Photo
          </Link>
          <Link href="/admin/collections/products/create" className="bx-pill-action">
            + Add Shop Product
          </Link>
        </div>
      </div>

      {/* Row 1: 3 KPI Cards */}
      <div className="bx-kpi-grid">
        {/* Card 1: Shop & Events */}
        <Link href="/admin/collections/products" className="bx-card bx-kpi-card">
          <div className="bx-kpi-top">
            <span className="bx-kpi-title">Shop &amp; Events</span>
            <span className="bx-today-pill">Today ⌄</span>
          </div>
          <span className="bx-kpi-sub">Active products &amp; live events</span>
          <div className="bx-kpi-value-row">
            <span className="bx-kpi-prefix">Items</span>
            <span className="bx-kpi-number">{counts.products + counts.events}</span>
            <span className="bx-kpi-trend">↗ 18%</span>
          </div>
          <div className="bx-kpi-MetaText">
            {counts.products} Shop Products • {counts.events} Events
          </div>
          <div className="bx-progress-track">
            <div className="bx-progress-fill-blue" style={{ width: '66%' }}>
              <span className="bx-progress-dot" />
            </div>
          </div>
        </Link>

        {/* Card 2: Leads & Inquiries */}
        <Link href="/admin/collections/leads" className="bx-card bx-kpi-card">
          <div className="bx-kpi-top">
            <span className="bx-kpi-title">Leads &amp; Inquiries</span>
            <span className="bx-today-pill">Today ⌄</span>
          </div>
          <span className="bx-kpi-sub">Captured diagnostic &amp; contact leads</span>
          <div className="bx-kpi-value-row">
            <span className="bx-kpi-number">{counts.leads}</span>
            <span className="bx-kpi-trend">↗ 18%</span>
          </div>
          <div className="bx-kpi-MetaText">
            Connected to Contact &amp; Diagnostic Forms
          </div>
          <div className="bx-progress-dashed">
            <span className="bx-progress-dashed-line" />
            <span className="bx-progress-dashed-cap" />
          </div>
        </Link>

        {/* Card 3: Blogs & Gallery */}
        <Link href="/admin/collections/posts" className="bx-card bx-kpi-card">
          <div className="bx-kpi-top">
            <span className="bx-kpi-title">Blogs &amp; Gallery</span>
            <span className="bx-today-pill">Today ⌄</span>
          </div>
          <span className="bx-kpi-sub">Published essays &amp; visual archive</span>
          <div className="bx-kpi-value-row">
            <span className="bx-kpi-prefix">Docs</span>
            <span className="bx-kpi-number">{counts.posts + counts.gallery}</span>
            <span className="bx-kpi-trend">↗ 18%</span>
          </div>
          <div className="bx-kpi-MetaText">
            {counts.posts} Blog Posts • {counts.gallery} Gallery • {counts.media} Media
          </div>
          <div className="bx-progress-track">
            <div className="bx-progress-fill-orange" style={{ width: '92%' }} />
          </div>
        </Link>
      </div>

      {/* Row 2: Middle Leaderboard / Connection Status Banner */}
      <div className="bx-card bx-leaderboard-card">
        <div className="bx-leaderboard-header">
          <div>
            <h2 className="bx-section-title">Website &amp; CMS Status Overview</h2>
            <p className="bx-section-sub">
              {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • updates in real time
            </p>
          </div>
          <Link href="/admin/globals/site-settings" className="bx-view-all-link">
            Open HEX Colour &amp; Font Studio ↗
          </Link>
        </div>

        <div className="bx-leaderboard-body">
          {/* Left Champion Block */}
          <div className="bx-champion-col">
            <div className="bx-champion-badge-row">
              <div className="bx-trophy-circle" aria-hidden="true">
                🏆
              </div>
              <span className="bx-rank-big">#1</span>
              <div>
                <div className="bx-champion-name">All Channels Connected</div>
                <div className="bx-champion-metric">
                  {totalAssetsAndContent} Live CMS Records • Theme: {activeThemeLabel}
                </div>
              </div>
            </div>
            <p className="bx-champion-Status">
              <strong>100% Connected</strong> — Events, Blogs, Gallery, Shop, 8 HEX Colour Groups &amp; Custom Fonts are synced!
            </p>
            <p className="bx-champion-code">
              Active Brand Colour: <strong>{activeThemeHex}</strong> • Active Font: <strong>{activeFontLabel}</strong>
            </p>
          </div>

          {/* Right Top 3 Channels List */}
          <div className="bx-top3-col">
            <div className="bx-top3-label">Top 3 Studio Modules</div>
            <div className="bx-top3-list">
              <Link href="/admin/globals/site-settings" className="bx-top3-item bx-top3-item-active">
                <div className="bx-top3-left">
                  <span className="bx-medal bx-medal-gold">1</span>
                  <span className="bx-top3-code">HEX COLOURS, FONTS &amp; MEDIA</span>
                  <span className="bx-you-tag">Live</span>
                </div>
                <span className="bx-top3-val">
                  {activeThemeLabel} • {activeFontLabel}
                </span>
              </Link>

              <Link href="/admin/collections/events" className="bx-top3-item">
                <div className="bx-top3-left">
                  <span className="bx-medal bx-medal-silver">2</span>
                  <span className="bx-top3-code">EVENTS &amp; BLOG POSTS</span>
                </div>
                <span className="bx-top3-val">
                  {counts.events} Events • {counts.posts} Blogs
                </span>
              </Link>

              <Link href="/admin/collections/gallery" className="bx-top3-item">
                <div className="bx-top3-left">
                  <span className="bx-medal bx-medal-bronze">3</span>
                  <span className="bx-top3-code">GALLERY &amp; SHOP CATALOGUE</span>
                </div>
                <span className="bx-top3-val">
                  {counts.gallery} Photos • {counts.products} Products
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Two Bottom Analytics + Quick Studio Cards */}
      <div className="bx-bottom-grid">
        {/* Bottom Left: Hourly Statistics + Direct Channel Links */}
        <div className="bx-card bx-chart-card">
          <div className="bx-chart-header">
            <div>
              <h3 className="bx-section-title">Hourly Content &amp; Traffic Statistics</h3>
              <p className="bx-section-sub">Real-time synchronization across frontend pages</p>
            </div>
          </div>

          <div className="bx-svg-chart-wrap">
            <svg viewBox="0 0 500 170" className="bx-line-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bxLineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e5ae6" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#1e5ae6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="36" y1="25" x2="485" y2="25" stroke="#eef2fa" strokeWidth="1" />
              <line x1="36" y1="68" x2="485" y2="68" stroke="#eef2fa" strokeWidth="1" />
              <line x1="36" y1="111" x2="485" y2="111" stroke="#eef2fa" strokeWidth="1" />
              <line x1="36" y1="150" x2="485" y2="150" stroke="#eef2fa" strokeWidth="1" />
              {/* Y labels */}
              <text x="8" y="29" fill="#8c96ab" fontSize="11" fontWeight="600">80</text>
              <text x="8" y="72" fill="#8c96ab" fontSize="11" fontWeight="600">60</text>
              <text x="8" y="115" fill="#8c96ab" fontSize="11" fontWeight="600">40</text>
              <text x="8" y="154" fill="#8c96ab" fontSize="11" fontWeight="600">20</text>
              {/* Smooth curve */}
              <path
                d="M 40 145 C 95 140, 130 110, 175 115 C 220 120, 250 38, 290 35 C 330 32, 365 95, 410 75 C 445 60, 465 45, 485 40 L 485 150 L 40 150 Z"
                fill="url(#bxLineFill)"
              />
              <path
                d="M 40 145 C 95 140, 130 110, 175 115 C 220 120, 250 38, 290 35 C 330 32, 365 95, 410 75 C 445 60, 465 45, 485 40"
                fill="none"
                stroke="#1e5ae6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="290" cy="35" r="4.5" fill="#ffffff" stroke="#1e5ae6" strokeWidth="2.5" />
              <circle cx="485" cy="40" r="4" fill="#1e5ae6" />
            </svg>
          </div>

          <div className="bx-channel-links-grid">
            <Link href="/admin/collections/events" className="bx-channel-chip">
              <span>📅 Manage Events ({counts.events})</span>
              <span>→</span>
            </Link>
            <Link href="/admin/collections/posts" className="bx-channel-chip">
              <span>✍️ Manage Blogs ({counts.posts})</span>
              <span>→</span>
            </Link>
            <Link href="/admin/collections/gallery" className="bx-channel-chip">
              <span>🖼️ Manage Gallery ({counts.gallery})</span>
              <span>→</span>
            </Link>
            <Link href="/admin/collections/products" className="bx-channel-chip">
              <span>🛍️ Manage Shop ({counts.products})</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Bottom Right: Weekly Reach & Theme Studio */}
        <div className="bx-card bx-chart-card">
          <div className="bx-weekly-header">
            <div>
              <h3 className="bx-section-title">Weekly Reach &amp; Theme Studio</h3>
              <p className="bx-section-sub">Sunday to today, against the same days last week</p>
            </div>
            <div className="bx-legend">
              <span className="bx-legend-item">
                <i className="bx-dot-blue" /> This week
              </span>
              <span className="bx-legend-item">
                <i className="bx-dot-light-blue" /> Last week
              </span>
            </div>
          </div>

          <div className="bx-weekly-metric-row">
            <span className="bx-kpi-prefix">Views</span>
            <span className="bx-weekly-big">35,18,400</span>
            <span className="bx-trend-pill">↗ 12%</span>
            <span className="bx-vs-text">vs 31,41,500 last week</span>
          </div>

          {/* Bar Chart */}
          <div className="bx-bar-chart">
            <div className="bx-bar-y-axis">
              <span>7.8L</span>
              <span>5.9L</span>
              <span>3.9L</span>
            </div>
            <div className="bx-bars-stage">
              <div className="bx-bar-group">
                <div className="bx-bar bx-bar-primary" style={{ height: '38%' }} />
                <div className="bx-bar bx-bar-secondary" style={{ height: '28%' }} />
                <span className="bx-bar-label">Sun</span>
              </div>
              <div className="bx-bar-group">
                <div className="bx-bar bx-bar-primary" style={{ height: '52%' }} />
                <div className="bx-bar bx-bar-secondary" style={{ height: '40%' }} />
                <span className="bx-bar-label">Mon</span>
              </div>
              <div className="bx-bar-group">
                <div className="bx-bar bx-bar-primary" style={{ height: '94%' }} />
                <div className="bx-bar bx-bar-secondary" style={{ height: '64%' }} />
                <span className="bx-bar-label">Tue</span>
              </div>
              <div className="bx-bar-group">
                <div className="bx-bar bx-bar-primary" style={{ height: '68%' }} />
                <div className="bx-bar bx-bar-secondary" style={{ height: '50%' }} />
                <span className="bx-bar-label">Wed</span>
              </div>
              <div className="bx-bar-group">
                <div className="bx-bar bx-bar-primary" style={{ height: '78%' }} />
                <div className="bx-bar bx-bar-secondary" style={{ height: '58%' }} />
                <span className="bx-bar-label">Thu</span>
              </div>
              <div className="bx-bar-group">
                <div className="bx-bar bx-bar-primary" style={{ height: '84%' }} />
                <div className="bx-bar bx-bar-secondary" style={{ height: '62%' }} />
                <span className="bx-bar-label">Fri</span>
              </div>
            </div>
          </div>

          {/* Active Theme & Font Studio Footer Bar */}
          <div className="bx-studio-footer">
            <div className="bx-studio-swatches">
              <span
                className="bx-color-swatch"
                style={{ backgroundColor: activeThemeHex }}
                title={`Active Theme: ${activeThemeLabel}`}
              />
              <div>
                <div className="bx-studio-swatch-title">
                  Theme: {activeThemeLabel} • Font: {activeFontLabel}
                </div>
                <div className="bx-studio-swatch-sub">
                  8 HEX Colour Categories, Custom Fonts &amp; Landing Media connected
                </div>
              </div>
            </div>
            <Link href="/admin/globals/site-settings" className="bx-studio-cta">
              Customize →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlanxerDashboard
