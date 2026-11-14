import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity, ArrowDownUp, Award, Check, ChevronDown, ChevronRight, Clipboard,
  Crown, ExternalLink, Gamepad2, Github, LockKeyhole, LogOut, Medal, Plus,
  Search, Shield, Swords, Trash2, Trophy, Upload, UserRound, X, Zap
} from 'lucide-react'
import './style.css'

const MODES = [
  { id: 'sword', label: 'Sword', icon: '⚔', short: 'SW' },
  { id: 'axe', label: 'Axe', icon: '🪓', short: 'AX' },
  { id: 'smp', label: 'SMP', icon: '🟢', short: 'SMP' },
  { id: 'uhc', label: 'UHC', icon: '❤️', short: 'UHC' },
  { id: 'mace', label: 'Mace', icon: '🔨', short: 'MC' },
  { id: 'nethpot', label: 'NethPot', icon: '👾', short: 'NP' },
  { id: 'diapot', label: 'DiaPot', icon: '🧪', short: 'DP' },
  { id: 'spearmace', label: 'SpearMace', icon: '🗡', short: 'SP' },
  { id: 'diasmp', label: 'DiaSMP', icon: '🕸', short: 'DS' },
  { id: 'vanilla', label: 'Vanilla', icon: '🟣', short: 'VN' },
]
const TIERS = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT5', 'LT5']
const POINTS = { HT1: 60, LT1: 45, HT2: 30, LT2: 20, HT3: 10, LT3: 6, HT4: 4, LT4: 3, HT5: 2, LT5: 1 }
const TIER_COLORS = {
  HT1: 'tier-ht1', LT1: 'tier-lt1', HT2: 'tier-ht2', LT2: 'tier-lt2',
  HT3: 'tier-ht3', LT3: 'tier-lt3', HT4: 'tier-ht4', LT4: 'tier-lt4',
  HT5: 'tier-ht5', LT5: 'tier-lt5',
}
const seedPlayers = [
  { id: 'p1', ign: 'FrostByte', region: 'AS', title: 'Combat Grandmaster', tiers: { sword:'LT2', axe:'LT3', smp:'LT2', uhc:'LT3', mace:'LT3', nethpot:'LT3', diapot:'LT4', spearmace:'LT3', diasmp:'LT4', vanilla:'LT3' }, history:['Sword: promoted to LT2','Crystal: verified LT3','SMP: promoted to LT2'] },
  { id: 'p2', ign: 'Kairox', region: 'NA', title: 'Combat Master', tiers: { sword:'HT3', axe:'LT3', smp:'LT3', uhc:'LT3', mace:'LT4', nethpot:'LT3', diapot:'LT4', spearmace:'LT3', diasmp:'LT4', vanilla:'LT4' }, history:['Axe: verified LT3','UHC: promoted to LT3'] },
  { id: 'p3', ign: 'Zavlo', region: 'AS', title: 'Combat Ace', tiers: { sword:'LT4', axe:null, smp:'HT5', uhc:'LT4', mace:null, nethpot:null, diapot:null, spearmace:null, diasmp:'LT4', vanilla:null }, history:['Sword: ranked LT4','UHC: ranked LT4','DiaSMP: ranked LT4'] },
  { id: 'p4', ign: 'Mikahuru', region: 'EU', title: 'Combat Specialist', tiers: { sword:'LT4', axe:'HT4', smp:null, uhc:null, mace:null, nethpot:null, diapot:null, spearmace:null, diasmp:null, vanilla:null }, history:['Crystal: verified LT4','Axe: verified HT4'] },
  { id: 'p5', ign: 'MrLowkii1', region: 'AS', title: 'Combat Cadet', tiers: { sword:null, axe:null, smp:null, uhc:null, mace:null, nethpot:null, diapot:null, spearmace:'HT4', diasmp:null, vanilla:null }, history:['Crystal: verified LT3','SpearMace: verified HT4'] },
  { id: 'p6', ign: 'MiddleAbbout_', region: 'AS', title: 'Combat Grandmaster', tiers: { sword:'LT3', axe:'LT3', smp:'LT3', uhc:'LT3', mace:'LT3', nethpot:'LT3', diapot:'LT3', spearmace:'LT3', diasmp:'LT3', vanilla:'LT3' }, history:['Overall: confirmed top placement','All modes: tier audit completed'] },
  { id: 'p7', ign: 'Render', region: 'EU', title: 'Combat Master', tiers: { sword:'LT3', axe:'LT3', smp:'LT3', uhc:'LT3', mace:'LT3', nethpot:'LT3', diapot:'LT3', spearmace:'LT3', diasmp:'HT4', vanilla:'LT4' }, history:['DiaSMP: promoted to HT4','Sword: maintained LT3'] },
  { id: 'p8', ign: 'ThunderAru64', region: 'AS', title: 'Combat Ace', tiers: { sword:'LT3', axe:'LT3', smp:'LT3', uhc:'LT3', mace:'HT4', nethpot:'HT4', diapot:null, spearmace:'HT4', diasmp:'LT3', vanilla:'LT4' }, history:['Mace: verified HT4','SpearMace: verified HT4'] },
]
const getPoints = p => Object.values(p.tiers || {}).reduce((sum, tier) => sum + (POINTS[tier] || 0), 0)
const rankPlayers = players => [...players].map(p => ({...p, points:getPoints(p)})).sort((a,b) => b.points-a.points || a.ign.localeCompare(b.ign))
const avatar = ign => `https://mc-heads.net/avatar/${encodeURIComponent(ign)}/64`
const body = ign => `https://mc-heads.net/body/${encodeURIComponent(ign)}/128`

function TierBadge({ tier }) {
  if (!tier) return <span className="tier-badge tier-none">—</span>
  return <span className={`tier-badge ${TIER_COLORS[tier] || ''}`}>{tier}</span>
}
function ModeIcon({ mode }) {
  return <span className="mode-icon" title={mode.label}>{mode.icon}</span>
}
function Modal({ children, onClose, wide=false }) {
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])
  return <div className="overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className={`modal ${wide ? 'modal-wide' : ''}`}>
      <button className="icon-btn modal-close" onClick={onClose} aria-label="Close"><X size={18}/></button>
      {children}
    </section>
  </div>
}
function PlayerProfile({ player, rank, onClose }) {
  return <Modal onClose={onClose} wide>
    <div className="profile-head">
      <div className="profile-skin"><img src={body(player.ign)} onError={e => e.currentTarget.src=avatar(player.ign)} /></div>
      <div className="profile-info">
        <div className="eyebrow">PLAYER PROFILE / #{rank}</div>
        <h2>{player.ign}</h2>
        <div className="profile-meta"><span className="region">{player.region}</span><span className="title-pill">{player.title || 'Unranked'}</span></div>
        <div className="profile-stats">
          <div><small>OVERALL RANK</small><strong>#{rank}</strong></div>
          <div><small>TOTAL POINTS</small><strong>{player.points}</strong></div>
          <div><small>RANKED MODES</small><strong>{Object.values(player.tiers).filter(Boolean).length}<em> / 10</em></strong></div>
        </div>
      </div>
    </div>
    <div className="modal-section">
      <div className="section-title"><Swords size={16}/> GAMEMODE TIERS</div>
      <div className="profile-grid">{MODES.map(m => <div className="profile-tier" key={m.id}><div><ModeIcon mode={m}/><span>{m.label}</span></div><TierBadge tier={player.tiers[m.id]}/></div>)}</div>
    </div>
    <div className="modal-section">
      <div className="section-title"><Activity size={16}/> RECENT TEST HISTORY</div>
      <div className="history-list">{(player.history?.length ? player.history : ['No test history recorded yet.']).map((h,i)=><div className="history-item" key={i}><span className="history-dot"/>{h}<small>{i===0?'LATEST':'RECENT'}</small></div>)}</div>
    </div>
  </Modal>
}
function AdminPanel({ players, setPlayers, onClose }) {
  const [draft, setDraft] = useState({ ign:'', region:'AS', title:'Combat Cadet', tiers:Object.fromEntries(MODES.map(m=>[m.id,''])) })
  const [selected, setSelected] = useState(players[0]?.id || '')
  const [notice, setNotice] = useState('')
  const fileRef = useRef(null)
  const active = players.find(p=>p.id===selected)
  const update = (id, patch) => setPlayers(old=>old.map(p=>p.id===id?{...p,...patch}:p))
  const changeTier = (mode, value) => {
    if (!active) return
    update(active.id, { tiers:{...active.tiers,[mode]:value || null} })
  }
  const addPlayer = e => {
    e.preventDefault()
    if (!draft.ign.trim()) return setNotice('Enter a Minecraft username first.')
    if (players.some(p=>p.ign.toLowerCase()===draft.ign.trim().toLowerCase())) return setNotice('That player already exists.')
    const p = { id:crypto.randomUUID(), ign:draft.ign.trim(), region:draft.region, title:draft.title, tiers:Object.fromEntries(Object.entries(draft.tiers).map(([k,v])=>[k,v||null])), history:['Added to IceSMP leaderboard'] }
    setPlayers(old=>[...old,p]); setSelected(p.id); setDraft({ign:'',region:'AS',title:'Combat Cadet',tiers:Object.fromEntries(MODES.map(m=>[m.id,'']))}); setNotice(`${p.ign} added successfully.`)
  }
  const remove = () => {
    if (!active || !confirm(`Delete ${active.ign} from the leaderboard?`)) return
    setPlayers(old=>old.filter(p=>p.id!==active.id)); setSelected(players.find(p=>p.id!==active.id)?.id || ''); setNotice('Player deleted.')
  }
  const exportData = () => {
    const blob = new Blob([JSON.stringify(players,null,2)],{type:'application/json'})
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='icesmp-leaderboard.json'; a.click(); URL.revokeObjectURL(url)
  }
  const importData = async e => {
    const file = e.target.files?.[0]; if (!file) return
    try {
      const data = JSON.parse(await file.text())
      if (!Array.isArray(data) || data.some(p=>!p.ign || !p.tiers)) throw new Error('Invalid player data')
      setPlayers(data); setSelected(data[0]?.id || ''); setNotice(`Imported ${data.length} players.`)
    } catch { setNotice('Could not import: check that this is a valid IceSMP JSON export.') }
    e.target.value=''
  }
  return <Modal onClose={onClose} wide>
    <div className="admin-heading"><div className="eyebrow">STAFF CONTROL CENTER</div><h2><Shield size={23}/> Admin panel</h2><p>Changes save automatically in this browser.</p></div>
    <div className="admin-tools"><button className="secondary-btn" onClick={exportData}><Upload size={15}/> Export JSON</button><button className="secondary-btn" onClick={()=>fileRef.current?.click()}><Clipboard size={15}/> Import JSON</button><input ref={fileRef} type="file" accept="application/json" hidden onChange={importData}/></div>
    <div className="admin-layout">
      <div className="admin-card">
        <div className="section-title"><UserRound size={15}/> ADD PLAYER</div>
        <form onSubmit={addPlayer}>
          <label>Minecraft IGN<input value={draft.ign} onChange={e=>setDraft({...draft,ign:e.target.value})} placeholder="PlayerName"/></label>
          <div className="form-row"><label>Region<select value={draft.region} onChange={e=>setDraft({...draft,region:e.target.value})}><option>AS</option><option>NA</option><option>EU</option><option>SA</option><option>OC</option></select></label><label>Combat title<select value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}>{['Combat Cadet','Combat Specialist','Combat Ace','Combat Master','Combat Grandmaster'].map(t=><option key={t}>{t}</option>)}</select></label></div>
          <div className="section-title sub"><Swords size={14}/> INITIAL TIERS</div>
          <div className="admin-tier-grid">{MODES.map(m=><label key={m.id}>{m.label}<select value={draft.tiers[m.id]} onChange={e=>setDraft({...draft,tiers:{...draft.tiers,[m.id]:e.target.value}})}><option value="">Unranked</option>{TIERS.map(t=><option key={t}>{t}</option>)}</select></label>)}</div>
          <button className="primary-btn full" type="submit"><Plus size={15}/> Add player</button>
        </form>
      </div>
      <div className="admin-card">
        <div className="section-title"><Award size={15}/> EDIT PLAYER TIERS</div>
        <label>Select player<select value={selected} onChange={e=>setSelected(e.target.value)}>{players.map(p=><option key={p.id} value={p.id}>{p.ign}</option>)}</select></label>
        {active ? <>
          <div className="editing-player"><img src={avatar(active.ign)}/><div><strong>{active.ign}</strong><small>{getPoints(active)} points · {active.region}</small></div></div>
          <div className="admin-tier-grid edit-grid">{MODES.map(m=><label key={m.id}>{m.label}<select value={active.tiers[m.id]||''} onChange={e=>changeTier(m.id,e.target.value)}><option value="">Unranked</option>{TIERS.map(t=><option key={t}>{t}</option>)}</select></label>)}</div>
          <button className="danger-btn full" onClick={remove}><Trash2 size={15}/> Delete player</button>
        </> : <div className="empty-state">Select a player to edit their tiers.</div>}
      </div>
    </div>
    {notice && <div className="notice"><Check size={15}/>{notice}</div>}
    <p className="admin-warning"><LockKeyhole size={13}/> Demo admin panel only. LocalStorage is not secure authentication; use a backend and server-side permissions before publishing.</p>
  </Modal>
}

function App() {
  const [players,setPlayers] = useState(()=> {
    try { const saved=localStorage.getItem('icesmp-players'); return saved?JSON.parse(saved):seedPlayers } catch { return seedPlayers }
  })
  const [mode,setMode] = useState('overall')
  const [query,setQuery] = useState('')
  const [selected,setSelected] = useState(null)
  const [admin,setAdmin] = useState(false)
  const [showAdmin,setShowAdmin] = useState(false)
  const [showPodium,setShowPodium] = useState(true)
  const [sort,setSort] = useState('points')
  useEffect(()=>localStorage.setItem('icesmp-players',JSON.stringify(players)),[players])
  const ranked=useMemo(()=>rankPlayers(players),[players])
  const filtered=useMemo(()=>{
    let list=ranked.filter(p=>p.ign.toLowerCase().includes(query.toLowerCase()))
    if(mode!=='overall') list=list.filter(p=>p.tiers[mode])
    if(sort==='name') list=[...list].sort((a,b)=>a.ign.localeCompare(b.ign))
    return list
  },[ranked,query,mode,sort])
  const activePlayer=selected?ranked.find(p=>p.id===selected):null
  const stats={players:players.length,ranked:players.filter(p=>Object.values(p.tiers).some(Boolean)).length,modes:MODES.length,points:ranked.reduce((s,p)=>s+p.points,0)}
  const modeLabel=mode==='overall'?'Overall':MODES.find(m=>m.id===mode)?.label
  const copyLink=()=>{navigator.clipboard?.writeText(window.location.href); alert('Leaderboard link copied!')}
  const top3=ranked.slice(0,3)
  return <div className="app-shell">
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <header className="topbar">
      <a className="brand" href="#/top" onClick={()=>setMode('overall')}><div className="brand-mark"><span>ICE</span><i/></div><div><strong>ICE<span>SMP</span></strong><small>PVP TIER NETWORK</small></div></a>
      <nav className="main-nav">
        <button className={mode==='overall'?'active':''} onClick={()=>setMode('overall')}><Trophy size={14}/> Overall</button>
        {['vanilla','sword','axe','nethpot','uhc','crystal','mace','smp'].map(id=>{
          const m=MODES.find(x=>x.id===id) || {label:'Crystal',id:'crystal'}
          return <button key={id} className={mode===id?'active':''} onClick={()=>setMode(id)}>{m.label}</button>
        })}
      </nav>
      <div className="top-actions"><a className="discord-btn" href="https://discord.com" target="_blank" rel="noreferrer"><ExternalLink size={14}/> Discord</a><button className={`admin-btn ${admin?'admin-on':''}`} onClick={()=>{if(admin){setShowAdmin(true)}else{const pass=prompt('Staff demo password (default: iceadmin):');if(pass==='iceadmin'){setAdmin(true);setShowAdmin(true)}else if(pass!==null)alert('Incorrect password.')}}}><Shield size={14}/>{admin?'Staff panel':'Staff login'}</button></div>
    </header>
    <main className="container">
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> SEASON 02 / RANKINGS LIVE</div><h1>PROVE YOUR<br/><span>PLACE.</span></h1><p>The IceSMP competitive leaderboard. Track the best players across every gamemode, one tier at a time.</p><div className="hero-links"><button className="primary-btn" onClick={()=>document.getElementById('leaderboard')?.scrollIntoView({behavior:'smooth'})}>View leaderboard <ChevronRight size={16}/></button><button className="text-btn" onClick={()=>setShowPodium(v=>!v)}>{showPodium?'Hide':'Show'} podium <ChevronDown size={14}/></button></div></div>
        <div className="hero-art"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="hero-emblem"><div className="ice-glyph">I</div><span>ICE SMP</span><small>EST. 2024</small></div><div className="floating-stat"><Zap size={15}/><div><b>10</b><small>GAME MODES</small></div></div></div>
      </section>
      <section className="stat-strip">
        <div><span className="stat-icon"><UserRound size={17}/></span><div><strong>{stats.players}</strong><small>PLAYERS LISTED</small></div></div>
        <div><span className="stat-icon"><Medal size={17}/></span><div><strong>{stats.ranked}</strong><small>RANKED PLAYERS</small></div></div>
        <div><span className="stat-icon"><Gamepad2 size={17}/></span><div><strong>{stats.modes}</strong><small>GAME MODES</small></div></div>
        <div><span className="stat-icon"><Activity size={17}/></span><div><strong>{stats.points.toLocaleString()}</strong><small>TOTAL TIER POINTS</small></div></div>
      </section>
      {showPodium && mode==='overall' && !query && <section className="podium-section">
        <div className="section-heading"><div><div className="eyebrow">THE ELITE THREE</div><h2>TOP <span>PLAYERS</span></h2></div><span className="section-note">OVERALL LEADERS</span></div>
        <div className="podium">
          {[top3[1],top3[0],top3[2]].filter(Boolean).map((p,i)=>{
            const actual=ranked.findIndex(x=>x.id===p.id)+1
            return <button key={p.id} className={`podium-card place-${actual}`} onClick={()=>setSelected(p.id)}>
              <div className="podium-rank">{actual===1?<Crown size={17}/>:<Medal size={16}/>} <span>0{actual}</span></div>
              <img src={avatar(p.ign)} alt=""/>
              <strong>{p.ign}</strong><small>{p.title}</small><div className="podium-points">{p.points}<em> PTS</em></div>
              <div className="podium-base">{actual===1?'CHAMPION':actual===2?'RUNNER UP':'THIRD PLACE'}</div>
            </button>
          })}
        </div>
      </section>}
      <section id="leaderboard" className="leaderboard-section">
        <div className="section-heading leaderboard-title"><div><div className="eyebrow">RANKINGS / {modeLabel.toUpperCase()}</div><h2>{mode==='overall'?'OVERALL':'MODE'} <span>LEADERBOARD</span></h2></div><div className="board-tools"><button className="subtle-btn" onClick={copyLink}><Clipboard size={14}/> Copy link</button><button className="subtle-btn" onClick={()=>setSort(s=>s==='points'?'name':'points')}><ArrowDownUp size={14}/> Sort: {sort==='points'?'Points':'Name'}</button></div></div>
        <div className="mode-tabs"><button className={mode==='overall'?'selected':''} onClick={()=>setMode('overall')}>ALL</button>{MODES.map(m=><button title={m.label} key={m.id} className={mode===m.id?'selected':''} onClick={()=>setMode(m.id)}><ModeIcon mode={m}/><span>{m.label}</span></button>)}</div>
        <div className="board-bar"><div><span className="live-dot"/> {filtered.length} PLAYERS FOUND</div><label className="search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search player IGN..."/>{query&&<button onClick={()=>setQuery('')}><X size={14}/></button>}</label></div>
        <div className="table-wrap"><table><thead><tr><th className="rank-col">RANK</th><th>PLAYER</th><th>POINTS</th><th className="tiers-head">GAMEMODE TIERS <span>· HOVER ICON FOR MODE</span></th><th></th></tr></thead>
          <tbody>{filtered.map((p)=>{
            const rank=ranked.findIndex(x=>x.id===p.id)+1
            return <tr key={p.id} onClick={()=>setSelected(p.id)} className="player-row">
              <td><span className={`rank-number ${rank<=3?'top-rank rank-'+rank:''}`}>#{rank.toString().padStart(2,'0')}</span></td>
              <td><div className="player-cell"><img src={avatar(p.ign)} alt=""/><div><strong>{p.ign}</strong><div className="player-sub"><span className="region">{p.region}</span><span>{p.title}</span></div></div></div></td>
              <td><strong className="points">{p.points}<small> PTS</small></strong></td>
              <td><div className="tier-row">{MODES.map(m=><div className="tier-slot" title={`${m.label}: ${p.tiers[m.id]||'Unranked'}`} key={m.id}><ModeIcon mode={m}/><TierBadge tier={p.tiers[m.id]}/></div>)}</div></td>
              <td><ChevronRight className="row-arrow" size={17}/></td>
            </tr>
          })}</tbody></table>
          {!filtered.length&&<div className="empty-state"><Search size={22}/><strong>No players found</strong><span>Try another IGN or select a different gamemode.</span></div>}
        </div>
        <div className="board-footer"><span>ICE SMP TIER NETWORK · SEASON 02</span><span>POINTS ARE CALCULATED FROM CURRENT TIERS</span></div>
      </section>
      <section className="legend-section"><div><div className="eyebrow">RANKING SYSTEM</div><h3>HOW POINTS <span>WORK</span></h3><p>Each tier contributes to a player's overall score. Higher tiers earn more points.</p></div><div className="legend-tiers">{TIERS.map(t=><div key={t}><TierBadge tier={t}/><span>{POINTS[t]} pts</span></div>)}</div></section>
    </main>
    <footer><div className="brand mini"><div className="brand-mark"><span>ICE</span></div><div><strong>ICE<span>SMP</span></strong><small>PVP TIER NETWORK</small></div></div><span>UNOFFICIAL COMMUNITY LEADERBOARD</span><span>BUILT FOR THE GRIND <b>✦</b></span></footer>
    {activePlayer&&<PlayerProfile player={activePlayer} rank={ranked.findIndex(p=>p.id===activePlayer.id)+1} onClose={()=>setSelected(null)}/>}
    {showAdmin&&<AdminPanel players={players} setPlayers={setPlayers} onClose={()=>setShowAdmin(false)}/>}
  </div>
}

createRoot(document.getElementById('root')).render(<App/>)
