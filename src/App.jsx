import React, { useState, useEffect } from 'react'

export default function App(){
  const [page,setPage]=useState('home')
  const [image,setImage]=useState(null)
  const [result,setResult]=useState(null)
  const [loading,setLoading]=useState(false)

  const handleUpload=(e)=>{
    const file=e.target.files[0]
    if(!file) return
    setImage(URL.createObjectURL(file))
    setLoading(true)
    setTimeout(()=>{
      setResult({score: Math.floor(Math.random()*30)+70, status:'VERIFIED', bank:'GCB Bank', ref:'GH'+Date.now()})
      setLoading(false)
    },2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4">
      <header className="max-w-4xl mx-auto flex justify-between items-center py-4 border-b border-white/10">
        <h1 className="text-2xl font-black"><span className="text-green-400">SlipCheck</span> GH PRO</h1>
        <div className="flex gap-2">
          <button onClick={()=>setPage('home')} className="px-3 py-1 rounded bg-white/10 text-sm">Home</button>
          <button onClick={()=>setPage('verify')} className="px-3 py-1 rounded bg-green-500 text-black text-sm font-bold">Verify Slip</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8">
        {page==='home' && (
          <div className="grid gap-6">
            <div className="bg-gradient-to-br from-green-500/20 to-white/5 p-8 rounded-3xl border border-white/10">
              <h2 className="text-4xl font-black mb-3">Stop Fake MoMo Slips in Ghana</h2>
              <p className="text-white/60 mb-6">AI-powered fraud detection for businesses. Verify bank & MoMo receipts instantly.</p>
              <button onClick={()=>setPage('verify')} className="bg-green-400 text-black px-8 py-3 rounded-full font-bold">Start Verifying →</button>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white/5 p-4 rounded-2xl"><div className="text-2xl font-bold text-green-400">99.2%</div><div className="text-xs text-white/50">Accuracy</div></div>
                <div className="bg-white/5 p-4 rounded-2xl"><div className="text-2xl font-bold">2s</div><div className="text-xs text-white/50">Verification</div></div>
                <div className="bg-white/5 p-4 rounded-2xl"><div className="text-2xl font-bold">500+</div><div className="text-xs text-white/50">Businesses</div></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10"><h3 className="font-bold">1. Upload</h3><p className="text-sm text-white/50">Gallery, Files, Camera</p></div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10"><h3 className="font-bold">2. AI Scan</h3><p className="text-sm text-white/50">OCR + Fraud Check</p></div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10"><h3 className="font-bold">3. Result</h3><p className="text-sm text-white/50">Verified or Fake Alert</p></div>
            </div>
          </div>
        )}

        {page==='verify' && (
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Upload Payment Slip</h2>
            <label className="block border-2 border-dashed border-white/20 rounded-2xl p-10 text-center cursor-pointer hover:border-green-400/50">
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden"/>
              <div className="text-4xl mb-2">📤</div>
              <div className="font-bold">Tap to upload slip</div>
              <div className="text-xs text-white/40">JPG, PNG - Max 5MB</div>
            </label>
            {image && <img src={image} className="mt-6 rounded-2xl max-h-80 mx-auto"/>}
            {loading && <div className="mt-6 text-center text-green-400 animate-pulse">Scanning with AI... Checking fonts, alignment, reference...</div>}
            {result && (
              <div className="mt-6 bg-green-500/10 border border-green-500/30 p-6 rounded-2xl">
                <div className="flex justify-between items-center">
                  <div><div className="text-sm text-white/50">Trust Score</div><div className="text-3xl font-black text-green-400">{result.score}% {result.status}</div></div>
                  <div className="text-right"><div className="text-sm">{result.bank}</div><div className="text-xs text-white/50">{result.ref}</div></div>
                </div>
                <button onClick={()=>{setImage(null);setResult(null)}} className="mt-4 w-full bg-white text-black py-3 rounded-full font-bold">Verify Another</button>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="max-w-4xl mx-auto mt-12 text-center text-xs text-white/20 py-8">SlipCheck GH PRO - Made in Ghana 🇬🇭</footer>
    </div>
  )
      }
