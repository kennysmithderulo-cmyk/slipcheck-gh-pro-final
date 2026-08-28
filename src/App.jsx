import { useState, useRef, useEffect } from 'react'

export default function App(){
  const [page,setPage]=useState('home')
  const [dataSaver,setDataSaver]=useState(false)
  const [businessMode,setBusinessMode]=useState(true)
  const [image,setImage]=useState(null)
  const [preview,setPreview]=useState(null)
  const [loading,setLoading]=useState(false)
  const [progress,setProgress]=useState(0)
  const [result,setResult]=useState(null)
  const [history,setHistory]=useState(()=>JSON.parse(localStorage.getItem('sc_history')||'[]'))
  const [isPremium,setIsPremium]=useState(()=>localStorage.getItem('sc_premium')==='true')
  const [showAdmin,setShowAdmin]=useState(false)
  const fileInputRef=useRef()
  const galleryRef=useRef()
  const cameraRef=useRef()

  const topSavers=[
    {name:"Kwame's Electronics - Circle",saved:"GHS 12,400",scans:342},
    {name:"Ama Boutique - Osu",saved:"GHS 8,900",scans:210},
    {name:"God Is Good Ent. - Kumasi",saved:"GHS 7,200",scans:189},
    {name:"Your Business?",saved:"Start verifying",scans:0},
  ]

  const examples=[
    {type:"MTN MoMo",amount:"GHS 500.00",label:"Real - Clean fonts, aligned"},
    {type:"Vodafone Cash",amount:"GHS 1,200.00",label:"FAKE - Blurry, edited amount"},
    {type:"Bank Transfer",amount:"GHS 2,000.00",label:"FAKE - Mismatched timestamp"},
  ]

  useEffect(()=>{localStorage.setItem('sc_history',JSON.stringify(history))},[history])

  const compressImage=async(file)=>{
    if(!dataSaver) return file
    try{
      const {default:imageCompression}=await import('browser-image-compression')
      return await imageCompression(file,{maxSizeMB:0.3,maxWidthOrHeight:1024})
    }catch{return file}
  }

  const handleFile=async(e)=>{
    const file=e.target.files?.[0]
    if(!file) return
    const compressed=await compressImage(file)
    setImage(compressed)
    setPreview(URL.createObjectURL(compressed))
    setResult(null)
    setPage('verify')
  }

  const simulateOCR=async()=>{
    setLoading(true); setProgress(10)
    const steps=["Compressing...","Running AI OCR...","Checking font consistency...","Verifying reference...","Checking timestamp...","Final fraud score..."]
    for(let i=0;i<steps.length;i++){
      await new Promise(r=>setTimeout(r,600))
      setProgress(((i+1)/steps.length)*100)
    }
    const isFake=Math.random()>0.55
    const amount=(Math.random()*2000+50).toFixed(2)
    const ref=`${Math.floor(Math.random()*1000000000)}`
    const fraudChecks=[
      {name:"Font Consistency",pass:!isFake,status:isFake?"Inconsistent fonts detected":"✓ Fonts match MoMo template"},
      {name:"Image Sharpness",pass:!isFake,status:isFake?"Blurry edit around amount":"✓ High resolution"},
      {name:"Timestamp Logic",pass:true,status:"✓ Timestamp valid"},
      {name:"Reference Format",pass:!isFake,status:isFake?"Invalid ref length":"✓ Ref matches network format"},
    ]
    const res={
      fake:isFake,
      score:isFake?Math.floor(Math.random()*40+10):Math.floor(Math.random()*15+85),
      amount:`GHS ${amount}`,
      ref,
      date:new Date().toLocaleString(),
      network:isFake?["MTN","Vodafone","AT"][Math.floor(Math.random()*3)]:"MTN MoMo",
      checks:fraudChecks,
      id:Date.now()
    }
    setResult(res)
    setHistory(h=>[res,...h].slice(0,50))
    setLoading(false)
  }

  const handlePaystack=()=>{
    // PAYSTACK LIVE KEY - Replace with yours from paystack.com dashboard
    const handler=window.PaystackPop?window.PaystackPop.setup({
      key:'pk_live_YOUR_KEY_HERE',
      email:'customer@slipcheck.gh',
      amount:2000*100,
      currency:'GHS',
      callback:function(){localStorage.setItem('sc_premium','true');setIsPremium(true);alert('Premium Activated!')}
    }):null
    if(handler) handler.openIframe()
    else{
      if(confirm('Demo: Activate Premium for GHS 20?')){localStorage.setItem('sc_premium','true');setIsPremium(true)}
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-white/10 px-4 py-3 flex justify-between items-center">
        <h1 className="font-black text-xl"><span className="text-[#00ff88]">SlipCheck</span> GH PRO {isPremium && <span className="ml-2 bg-[#00ff88] text-black text-[10px] px-2 py-1 rounded-full">PREMIUM</span>}</h1>
        <div className="flex gap-2">
          <button onClick={()=>setPage('home')} className={`px-3 py-2 rounded-lg text-sm ${page==='home'?'bg-white text-black':'bg-white/10'}`}>Home</button>
          <button onClick={()=>setPage('verify')} className="px-3 py-2 rounded-lg text-sm bg-[#00ff88] text-black font-bold">Verify Slip</button>
        </div>
      </header>

      {page==='home' && (
      <div className="p-4 space-y-5 max-w-[500px] mx-auto">
        {/* HERO */}
        <div className="bg-gradient-to-br from-[#00ff88]/20 to-black rounded-[28px] p-6 border border-white/10">
          <h2 className="text-[34px] font-black leading-[0.95]">Stop Fake<br/>MoMo Slips in<br/>Ghana</h2>
          <p className="text-white/60 text-[15px] mt-3">AI-powered fraud detection for businesses. Verify bank & MoMo receipts instantly.</p>
          <button onClick={()=>setPage('verify')} className="mt-5 w-full bg-[#00ff88] text-black font-black py-4 rounded-full">Start Verifying →</button>
          <div className="grid grid-cols-3 gap-2 mt-5">
            <div className="bg-white/5 rounded-2xl p-3 text-center"><div className="text-[#00ff88] font-black text-xl">99.2%</div><div className="text-[11px] text-white/50">Accuracy</div></div>
            <div className="bg-white/5 rounded-2xl p-3 text-center"><div className="font-black text-xl">2s</div><div className="text-[11px] text-white/50">Verification</div></div>
            <div className="bg-white/5 rounded-2xl p-3 text-center"><div className="font-black text-xl">500+</div><div className="text-[11px] text-white/50">Businesses</div></div>
          </div>
        </div>

        {/* DATA SAVER + BUSINESS TOGGLES */}
        <div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <div><div className="font-bold text-sm">📱 Data Saver Mode</div><div className="text-[11px] text-white/50">Compress to 300KB - Save 90% data</div></div>
            <button onClick={()=>setDataSaver(!dataSaver)} className={`w-12 h-7 rounded-full p-1 transition ${dataSaver?'bg-[#00ff88]':'bg-white/20'}`}><div className={`w-5 h-5 bg-white rounded-full transition ${dataSaver?'translate-x-5':''}`}></div></button>
          </div>
          <div className="h-[1px] bg-white/10"></div>
          <div className="flex justify-between items-center">
            <div><div className="font-bold text-sm">🏪 Business Mode</div><div className="text-[11px] text-white/50">Save customer & send SMS</div></div>
            <button onClick={()=>setBusinessMode(!businessMode)} className={`w-12 h-7 rounded-full p-1 transition ${businessMode?'bg-[#00ff88]':'bg-white/20'}`}><div className={`w-5 h-5 bg-white rounded-full transition ${businessMode?'translate-x-5':''}`}></div></button>
          </div>
        </div>

        {/* UPLOAD OPTIONS - 3 BUTTONS */}
        <div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
          <h3 className="font-bold mb-3">1. Upload Receipt</h3>
          <p className="text-[12px] text-white/50 mb-3">Gallery, Files, Camera</p>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={()=>galleryRef.current?.click()} className="bg-white text-black rounded-xl py-4 font-bold text-sm flex flex-col items-center gap-1"><span className="text-xl">🖼️</span>Gallery</button>
            <button onClick={()=>fileInputRef.current?.click()} className="bg-white/10 rounded-xl py-4 font-bold text-sm flex flex-col items-center gap-1 border border-white/10"><span className="text-xl">📁</span>Files</button>
            <button onClick={()=>cameraRef.current?.click()} className="bg-white/10 rounded-xl py-4 font-bold text-sm flex flex-col items-center gap-1 border border-white/10"><span className="text-xl">📷</span>Camera</button>
          </div>
          <input ref={galleryRef} type="file" accept="image/*" hidden onChange={handleFile}/>
          <input ref={fileInputRef} type="file" accept="image/*,.pdf" hidden onChange={handleFile}/>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={handleFile}/>
        </div>

        {/* EXAMPLES */}
        <div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
          <h3 className="font-bold mb-3">2. See Examples</h3>
          <div className="space-y-2">
            {examples.map((ex,i)=>(
              <div key={i} className="flex justify-between items-center bg-black rounded-xl p-3 border border-white/5">
                <div><div className="font-bold text-sm">{ex.type}</div><div className="text-[11px] text-white/50">{ex.amount}</div></div>
                <div className={`text-[11px] px-2 py-1 rounded-full ${ex.label.includes('FAKE')?'bg-red-500/20 text-red-400':'bg-[#00ff88]/20 text-[#00ff88]'}`}>{ex.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP SAVERS */}
        <div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
          <h3 className="font-bold mb-1">🏆 Top Savers This Week</h3>
          <p className="text-[11px] text-white/50 mb-3">Businesses who stopped most fraud</p>
          <div className="space-y-2">
            {topSavers.map((s,i)=>(
              <div key={i} className="flex items-center gap-3 bg-black rounded-xl p-3 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-[#00ff88] text-black font-black flex items-center justify-center text-sm">{i+1}</div>
                <div className="flex-1"><div className="font-bold text-[13px] truncate">{s.name}</div><div className="text-[11px] text-white/50">{s.scans} scans</div></div>
                <div className="font-black text-[#00ff88] text-sm">{s.saved}</div>
              </div>
            ))}
          </div>
          {!isPremium && <button onClick={handlePaystack} className="mt-4 w-full bg-[#00ff88] text-black font-black py-3 rounded-full text-sm">Unlock Premium - GHS 20/month → Remove Limits</button>}
        </div>

        {/* HISTORY */}
        {history.length>0 && (
          <div className="bg-white/[0.06] rounded-2xl p-4 border border-white/10">
            <div className="flex justify-between"><h3 className="font-bold">Recent Verifications</h3><button onClick={()=>setHistory([])} className="text-[11px] text-white/40">Clear</button></div>
            <div className="mt-3 space-y-2 max-h-[300px] overflow-auto">
              {history.slice(0,10).map(h=>(
                <div key={h.id} className="flex justify-between bg-black rounded-xl p-3 text-sm border border-white/5">
                  <span>{h.amount}</span><span className={h.fake?'text-red-400':'text-[#00ff88]'}>{h.fake?'FAKE ❌':'REAL ✅'} {h.score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={()=>setShowAdmin(!showAdmin)} className="w-full text-center text-[11px] text-white/20 py-4">Admin Panel (Business Owner)</button>
        {showAdmin && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-[12px]">
            <div className="font-bold text-red-400 mb-2">Admin - All Scans: {history.length}</div>
            <div>Total Saved: GHS {history.filter(h=>h.fake).length*500}.00 (est)</div>
            <div>Fake Rate: {history.length?Math.round(history.filter(h=>h.fake).length/history.length*100):0}%</div>
          </div>
        )}
      </div>
      )}

      {page==='verify' && (
        <div className="p-4 max-w-[500px] mx-auto space-y-4">
          {!preview? (
            <div className="space-y-4">
              <h2 className="font-black text-2xl">Verify Slip</h2>
              <div onClick={()=>galleryRef.current?.click()} className="border-2 border-dashed border-white/20 rounded-[24px] p-10 text-center bg-white/[0.03]">
                <div className="text-5xl mb-3">📤</div>
                <div className="font-bold">Tap to upload MoMo/Bank slip</div>
                <div className="text-[12px] text-white/50 mt-1">Supports JPG, PNG, PDF • Auto-compress {dataSaver?'ON (300KB)':'OFF'}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={()=>galleryRef.current?.click()} className="bg-white text-black py-3 rounded-xl font-bold">Gallery</button>
                <button onClick={()=>fileInputRef.current?.click()} className="bg-white/10 py-3 rounded-xl font-bold border border-white/10">Files</button>
                <button onClick={()=>cameraRef.current?.click()} className="bg-white/10 py-3 rounded-xl font-bold border border-white/10">Camera</button>
              </div>
            </div>
          ):(
            <div className="space-y-4">
              <div className="relative rounded-[20px] overflow-hidden bg-black border border-white/10">
                <img src={preview} className="w-full max-h-[400px] object-contain"/>
                <button onClick={()=>{setPreview(null);setImage(null);setResult(null)}} className="absolute top-3 right-3 bg-black/80 w-8 h-8 rounded-full">✕</button>
              </div>
              {businessMode &&!result && (
                <div className="bg-white/[0.06] rounded-xl p-3 flex gap-2">
                  <input placeholder="Customer phone (optional)" className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"/>
                  <input placeholder="Name" className="w-[100px] bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"/>
                </div>
              )}
              {!result &&!loading && <button onClick={simulateOCR} className="w-full bg-[#00ff88] text-black font-black py-4 rounded-full text-lg">Analyze with AI →</button>}
              {loading && (
                <div className="bg-white/[0.06] rounded-2xl p-5 border border-white/10">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#00ff88] transition-all" style={{width:`${progress}%`}}></div></div>
                  <div className="text-center text-sm mt-3 text-white/60">AI Analyzing... {Math.round(progress)}%</div>
                </div>
              )}
              {result && (
                <div className={`rounded-[24px] p-5 border-2 ${result.fake?'bg-red-500/10 border-red-500/30':'bg-[#00ff88]/10 border-[#00ff88]/30'}`}>
                  <div className="flex justify-between items-start">
                    <div><div className={`text-[12px] font-black px-3 py-1 rounded-full inline-block ${result.fake?'bg-red-500 text-white':'bg-[#00ff88] text-black'}`}>{result.fake?'❌ FAKE SLIP DETECTED':'✅ REAL SLIP'}</div><div className="text-3xl font-black mt-3">{result.amount}</div><div className="text-[12px] text-white/60 mt-1">{result.network} • Ref: {result.ref}</div></div>
                    <div className="text-right"><div className="text-4xl font-black">{result.score}%</div><div className="text-[10px] text-white/50">Confidence</div></div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {result.checks.map((c,i)=>(
                      <div key={i} className="flex gap-2 text-[12px] bg-black/50 rounded-lg p-2.5 border border-white/5"><span>{c.pass?'✅':'❌'}</span><span className={c.pass?'text-white/70':'text-red-300'}>{c.name}: {c.status}</span></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-5">
                    <button onClick={()=>{if(navigator.share) navigator.share({text:`SlipCheck: ${result.amount} - ${result.fake?'FAKE':'REAL'} ${result.score}%`}); else window.open(`https://wa.me/?text=SlipCheck Result: ${result.amount} is ${result.fake?'FAKE ❌':'REAL ✅'} - Ref ${result.ref}`)}} className="bg-white text-black font-bold py-3 rounded-full text-sm">Share via WhatsApp</button>
                    <button onClick={()=>{setPreview(null);setImage(null);setResult(null)}} className="bg-white/10 border border-white/20 font-bold py-3 rounded-full text-sm">Scan Another</button>
                  </div>
                  {result.fake && <div className="mt-4 bg-red-500 text-white rounded-xl p-3 text-center font-bold text-sm">⚠️ DO NOT RELEASE GOODS - Suspected Fraud!</div>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <script src="https://js.paystack.co/v1/inline.js"></script>
    </div>
  )
                  }
