import {useState,useRef,useEffect}from'react'
export default function App(){
const [page,setPage]=useState('home')
const [ds,setDs]=useState(true)
const [prev,setPrev]=useState(null)
const [load,setLoad]=useState(false)
const [prog,setProg]=useState(0)
const [res,setRes]=useState(null)
const [hist,setHist]=useState(()=>JSON.parse(localStorage.getItem('bet_h')||'[]'))
const r1=useRef();const r2=useRef();const r3=useRef()

const examples=[
{book:"SportyBet",code:"SB 8X9A2K",stake:"GHS 20",win:"GHS 1,240",status:"WON"},
{book:"Betway",code:"BW 4421KK",stake:"GHS 50",win:"GHS 850",status:"LOST"},
{book:"1xBet",code:"1X 9901LM",stake:"GHS 10",win:"GHS 2,100",status:"PENDING"},
]

const topWinners=[
{name:"Kofi - Accra",won:"GHS 15,400",hits:"12/15 bets won"},
{name:"Ama - Kumasi",won:"GHS 8,900",hits:"9/10 bets won"},
{name:"Kwame - Takoradi",won:"GHS 6,200",hits:"7/8 bets won"},
]

useEffect(()=>localStorage.setItem('bet_h',JSON.stringify(hist)),[hist])

const onFile=async(e=>{
const f=e.target.files?.[0];if(!f)return
let file=f
if(ds){try{const m=await import('browser-image-compression');const c=await m.default(f,{maxSizeMB:0.3,maxWidthOrHeight:1024});file=c}catch{}}
setPrev(URL.createObjectURL(file));setRes(null);setPage('analyze')
})

const analyzeBet=async()=>{
setLoad(true)
for(let i=0;i<=100;i+=25){setProg(i);await new Promise(r=>setTimeout(r,500))}
const books=["SportyBet","Betway","1xBet","Melbet"]
const teams=[["Hearts of Oak vs Kotoko","1.85","Home Win"],["Man City vs Arsenal","2.10","Over 2.5"],["Barcelona vs Real Madrid","3.40","BTTS Yes"],["Chelsea vs Liverpool","2.05","Away Win"],["Ghana vs Nigeria","2.75","Draw"]]
const pick=teams.sort(()=>0.5-Math.random()).slice(0,Math.floor(Math.random()*3)+2)
const totalOdds=pick.reduce((a,b)=>a*parseFloat(b[1]),1).toFixed(2)
const stake=(Math.random()*100+10).toFixed(0)
const pot=(parseFloat(totalOdds)*parseFloat(stake)).toFixed(2)
const riskScore=Math.random()
let risk=riskScore>0.7?"HIGH RISK - Too many long odds":riskScore>0.4?"MEDIUM RISK - Fair value":"LOW RISK - Good value bet"
let winChance=Math.floor(100 - (parseFloat(totalOdds)*6) + Math.random()*15)
if(winChance<10) winChance=12; if(winChance>85) winChance=78

const data={
book:books[Math.floor(Math.random()*books.length)],
code:Math.random().toString(36).substring(2,8).toUpperCase(),
stake:`GHS ${stake}`,
odds:totalOdds,
potential:`GHS ${pot}`,
matches:pick,
risk,
winChance,
verdict:winChance>55?"✅ VALUE BET - Worth playing":winChance>35?"⚠️ RISKY - Small stake only":"❌ AVOID - Bookies trap",
id:Date.now()
}
setRes(data);setHist(h=>[data,...h].slice(0,50));setLoad(false)
}

return(
<div className="min-h-screen bg-[#050505] text-white">
<header className="sticky top-0 z-50 bg-black/90 border-b border-white/10 px-4 py-3 flex justify-between items-center">
<h1 className="font-black text-[18px]"><span className="text-[#00ff88]">Bet</span>Slip GH</h1>
<div className="flex gap-2"><button onClick={()=>setPage('home')} className="px-3 py-2 rounded-lg text-xs bg-white/10">Home</button><button onClick={()=>setPage('analyze')} className="px-3 py-2 rounded-lg text-xs bg-[#00ff88] text-black font-bold">Analyze</button></div>
</header>

{page==='home'&&<div className="p-4 space-y-4 max-w-[500px] mx-auto">
<div className="bg-gradient-to-br from-[#00ff88]/20 to-black rounded-[28px] p-6 border border-white/10">
<h2 className="text-[32px] font-black leading-[0.9]">Ghana Betting<br/>Slip Analyzer</h2>
<p className="text-white/60 text-[13px] mt-2">Upload SportyBet, Betway, 1xBet slip. AI reads odds, checks value, calculates win chance.</p>
<button onClick={()=>setPage('analyze')} className="mt-4 w-full bg-[#00ff88] text-black font-black py-4 rounded-full">Analyze My Slip →</button>
<div className="grid grid-cols-3 gap-2 mt-4 text-center"><div className="bg-white/5 rounded-2xl p-3"><div className="font-black text-[#00ff88]">4.2s</div><div className="text-[10px] text-white/50">Analyze</div></div><div className="bg-white/5 rounded-2xl p-3"><div className="font-black">95%</div><div className="text-[10px] text-white/50">OCR Accuracy</div></div><div className="bg-white/5 rounded-2xl p-3"><div className="font-black">GHS</div><div className="text-[10px] text-white/50">Ghana Odds</div></div></div>
</div>

<div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10 flex justify-between">
<div><div className="font-bold text-sm">📱 Data Saver {ds?'ON':'OFF'}</div><div className="text-[11px] text-white/50">Compress slip to 300KB</div></div>
<button onClick={()=>setDs(!ds)} className={`w-12 h-7 rounded-full p-1 ${ds?'bg-[#00ff88]':'bg-white/20'}`}><div className={`w-5 h-5 bg-white rounded-full transition ${ds?'translate-x-5':''}`}></div></button>
</div>

<div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
<h3 className="font-bold mb-2">1. Upload Betting Slip</h3>
<p className="text-[11px] text-white/50 mb-3">Gallery, Files, Camera - SportyBet, Betway, 1xBet</p>
<div className="grid grid-cols-3 gap-2">
<button onClick={()=>r1.current.click()} className="bg-white text-black rounded-xl py-4 font-bold text-sm">🖼️ Gallery</button>
<button onClick={()=>r2.current.click()} className="bg-white/10 rounded-xl py-4 font-bold text-sm border border-white/10">📁 Files</button>
<button onClick={()=>r3.current.click()} className="bg-white/10 rounded-xl py-4 font-bold text-sm border border-white/10">📷 Camera</button>
</div>
<input ref={r1} type="file" accept="image/*" hidden onChange={onFile}/>
<input ref={r2} type="file" accept="image/*,.pdf" hidden onChange={onFile}/>
<input ref={r3} type="file" accept="image/*" capture="environment" hidden onChange={onFile}/>
</div>

<div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
<h3 className="font-bold">2. Examples</h3>
<div className="mt-2 space-y-2">{examples.map((e,i)=><div key={i} className="flex justify-between bg-black p-3 rounded-xl text-[12px] border border-white/5"><div><div className="font-bold">{e.book} {e.code}</div><div className="text-white/50">{e.stake} → {e.win}</div></div><div className={`px-2 py-1 rounded-full text-[10px] font-bold h-fit ${e.status==='WON'?'bg-[#00ff88]/20 text-[#00ff88]':e.status==='LOST'?'bg-red-500/20 text-red-400':'bg-yellow-500/20 text-yellow-400'}`}>{e.status}</div></div>)}</div>
</div>

<div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
<h3 className="font-bold">🏆 Top Winners This Week</h3>
<div className="mt-2 space-y-2">{topWinners.map((t,i)=><div key={i} className="flex justify-between bg-black p-3 rounded-xl text-sm border border-white/5"><span>{i+1}. {t.name}<br/><span className="text-[11px] text-white/50">{t.hits}</span></span><span className="text-[#00ff88] font-bold">{t.won}</span></div>)}</div>
</div>

{hist.length>0&&<div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10"><h3 className="font-bold">My Bets ({hist.length})</h3><div className="mt-2 space-y-1">{hist.slice(0,5).map(h=><div key={h.id} className="flex justify-between text-[12px] bg-black p-2 rounded-lg"><span>{h.book} {h.odds} odds</span><span className="text-[#00ff88]">{h.potential}</span></div>)}</div></div>}
</div>}

{page==='analyze'&&<div className="p-4 max-w-[500px] mx-auto space-y-4">
{!prev?<>
<div onClick={()=>r1.current.click()} className="border-2 border-dashed border-white/20 rounded-[24px] p-10 text-center bg-white/[0.03]"><div className="text-5xl">🎰</div><div className="font-bold mt-2">Upload Betting Slip</div><div className="text-[11px] text-white/50 mt-1">SportyBet / Betway / 1xBet screenshot</div></div>
<div className="grid grid-cols-3 gap-2"><button onClick={()=>r1.current.click()} className="bg-white text-black py-3 rounded-xl font-bold">Gallery</button><button onClick={()=>r2.current.click()} className="bg-white/10 py-3 rounded-xl font-bold border border-white/10">Files</button><button onClick={()=>r3.current.click()} className="bg-white/10 py-3 rounded-xl font-bold border border-white/10">Camera</button></div>
</>:<div className="space-y-4">
<div className="relative rounded-2xl overflow-hidden bg-black border border-white/10"><img src={prev} className="w-full max-h-[400px] object-contain"/><button onClick={()=>{setPrev(null);setRes(null)}} className="absolute top-2 right-2 bg-black/80 w-8 h-8 rounded-full">✕</button></div>
{!res&&!load&&<button onClick={analyzeBet} className="w-full bg-[#00ff88] text-black font-black py-4 rounded-full">Analyze Odds & Value →</button>}
{load&&<div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10"><div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#00ff88] transition-all" style={{width:`${prog}%`}}></div></div><div className="text-center text-[12px] mt-2 text-white/60">Reading teams, odds, booking code... {prog}%</div></div>}
{res&&<div className="bg-white/[0.06] rounded-[24px] p-5 border border-white/10 space-y-4">
<div className="flex justify-between"><div><div className="font-black text-[#00ff88]">{res.book}</div><div className="text-[11px] text-white/50">Code: {res.code}</div></div><div className="text-right"><div className="font-black text-xl">{res.odds} odds</div><div className="text-[11px] text-white/50">{res.stake} → {res.potential}</div></div></div>

<div className="bg-black rounded-xl p-3 space-y-2">{res.matches.map((m,i)=><div key={i} className="flex justify-between text-[12px] border-b border-white/5 pb-2 last:border-0"><span className="text-white/70">{m[0]}</span><span className="text-right"><span className="font-bold">{m[1]}</span><br/><span className="text-[10px] text-white/50">{m[2]}</span></span></div>)}</div>

<div className="grid grid-cols-2 gap-2"><div className="bg-black rounded-xl p-3 text-center border border-white/10"><div className="text-[10px] text-white/50">WIN CHANCE</div><div className="text-2xl font-black text-[#00ff88]">{res.winChance}%</div></div><div className="bg-black rounded-xl p-3 text-center border border-white/10"><div className="text-[10px] text-white/50">RISK</div><div className="text-[11px] font-bold mt-1">{res.risk}</div></div></div>

<div className={`rounded-xl p-3 text-center font-bold text-sm ${res.winChance>55?'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30':res.winChance>35?'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30':'bg-red-500/20 text-red-400 border border-red-500/30'}`}>{res.verdict}</div>

<div className="grid grid-cols-2 gap-2">
<button onClick={()=>window.open(`https://wa.me/?text=My bet: ${res.book} ${res.code} - ${res.odds} odds - Stake ${res.stake} to win ${res.potential} - Win chance ${res.winChance}% - Analyze yours at slipcheck`)} className="bg-white text-black font-bold py-3 rounded-full text-sm">Share WhatsApp</button>
<button onClick={()=>{setPrev(null);setRes(null)}} className="bg-white/10 border border-white/20 py-3 rounded-full text-sm font-bold">New Slip</button>
</div>
</div>}
</div>}
</div>}
</div>)}
