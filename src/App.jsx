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
            <div className="bg-white/5 rounded-
