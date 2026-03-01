import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, RefreshCw } from 'lucide-react';

const inputStyle = {
  padding: '14px 16px 14px 44px',
  background: 'var(--bg-elevated)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  color: 'var(--text-base)',
  fontSize: 15,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const API = 'http://127.0.0.1:5000/api';

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleFormSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const endpoint = mode === 'login' ? `${API}/auth/login` : `${API}/auth/register`;
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { username: form.username, email: form.email, password: form.password };
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
      setInfo(data.message || 'OTP sent to your email!');
      setStep('otp'); startResendTimer();
    } catch { setError('Network error. Is the backend running?'); }
    finally { setLoading(false); }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) { setError('Please enter all 6 digits'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: otpCode, purpose: mode })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid OTP'); return; }
      localStorage.setItem('moodtune-user', JSON.stringify(data));
      window.location.reload();
      onClose();
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(t => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError(''); setInfo('');
    try {
      const res = await fetch(`${API}/auth/send-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, purpose: mode })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setInfo('New OTP sent!'); startResendTimer();
    } catch { setError('Failed to resend'); }
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[idx] = val.slice(-1); setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus();
    if (e.key === 'Enter' && otp.join('').length === 6) handleOtpSubmit();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); document.getElementById('otp-5')?.focus(); }
  };

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,backdropFilter:'blur(10px)' }}>
      <div style={{ background:'var(--bg-highlight)',borderRadius:20,padding:40,width:420,position:'relative',boxShadow:'0 32px 80px rgba(0,0,0,0.6)',border:'1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={onClose} style={{ position:'absolute',top:16,right:16,background:'rgba(255,255,255,0.1)',border:'none',color:'var(--text-subdued)',cursor:'pointer',width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center' }}>
          <X size={16}/>
        </button>

        <div style={{ textAlign:'center',marginBottom:32 }}>
          <div style={{ fontSize:48,marginBottom:12 }}>🎵</div>
          <h2 style={{ fontSize:22,fontWeight:800,color:'var(--text-base)',marginBottom:6 }}>
            {step==='form'?(mode==='login'?'Welcome back':'Create account'):'Check your email'}
          </h2>
          <p style={{ color:'var(--text-subdued)',fontSize:14 }}>
            {step==='form'?(mode==='login'?'Log in to MoodTune':'Join MoodTune today'):`We sent a 6-digit code to ${form.email}`}
          </p>
        </div>

        {step === 'form' && (
          <form onSubmit={handleFormSubmit} style={{ display:'flex',flexDirection:'column',gap:14 }}>
            {mode === 'register' && (
              <div style={{ position:'relative' }}>
                <User size={16} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-subdued)' }}/>
                <input style={inputStyle} placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required/>
              </div>
            )}
            <div style={{ position:'relative' }}>
              <Mail size={16} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-subdued)' }}/>
              <input style={inputStyle} type="email" placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
            </div>
            <div style={{ position:'relative' }}>
              <Lock size={16} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-subdued)' }}/>
              <input style={inputStyle} type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
            </div>
            {error && <p style={{ color:'#e91429',fontSize:13,textAlign:'center',margin:0 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ padding:'14px',borderRadius:30,background:'var(--essential-bright)',border:'none',color:'black',fontWeight:800,fontSize:15,cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginTop:4 }}>
              {loading?'⏳ Sending OTP...':<>{mode==='login'?'Continue':'Create Account'}<ArrowRight size={18}/></>}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:20 }}>
            {info && <div style={{ background:'rgba(29,185,84,0.15)',border:'1px solid #1db954',borderRadius:10,padding:'12px 20px',color:'#1db954',fontSize:14,textAlign:'center',width:'100%',boxSizing:'border-box' }}>✅ {info}</div>}
            <div style={{ display:'flex',gap:10 }} onPaste={handleOtpPaste}>
              {otp.map((digit,idx)=>(
                <input key={idx} id={`otp-${idx}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e=>handleOtpChange(e.target.value,idx)} onKeyDown={e=>handleOtpKeyDown(e,idx)}
                  style={{ width:48,height:56,textAlign:'center',fontSize:24,fontWeight:800,background:'var(--bg-elevated)',border:`2px solid ${digit?'var(--essential-bright)':'rgba(255,255,255,0.15)'}`,borderRadius:10,color:'var(--text-base)',outline:'none' }}
                  autoFocus={idx===0}/>
              ))}
            </div>
            {error && <p style={{ color:'#e91429',fontSize:13,margin:0 }}>{error}</p>}
            <button onClick={handleOtpSubmit} disabled={loading||otp.join('').length!==6} style={{ width:'100%',padding:'14px',borderRadius:30,background:'var(--essential-bright)',border:'none',color:'black',fontWeight:800,fontSize:15,cursor:(loading||otp.join('').length!==6)?'not-allowed':'pointer',opacity:(loading||otp.join('').length!==6)?0.6:1 }}>
              {loading?'⏳ Verifying...':'✅ Verify OTP'}
            </button>
            <div style={{ display:'flex',gap:8,alignItems:'center' }}>
              <button onClick={handleResend} disabled={resendTimer>0} style={{ background:'none',border:'none',color:resendTimer>0?'var(--text-subdued)':'var(--essential-bright)',cursor:resendTimer>0?'not-allowed':'pointer',fontSize:14,fontWeight:600,display:'flex',alignItems:'center',gap:4 }}>
                <RefreshCw size={14}/>{resendTimer>0?`Resend in ${resendTimer}s`:'Resend OTP'}
              </button>
              <span style={{ color:'var(--text-subdued)' }}>·</span>
              <button onClick={()=>{setStep('form');setOtp(['','','','','','']);setError('');setInfo('');}} style={{ background:'none',border:'none',color:'var(--text-subdued)',cursor:'pointer',fontSize:14 }}>Change email</button>
            </div>
          </div>
        )}

        {step==='form' && (
          <div style={{ textAlign:'center',marginTop:24 }}>
            <p style={{ color:'var(--text-subdued)',fontSize:14 }}>
              {mode==='login'?"Don't have an account? ":"Already have an account? "}
              <span onClick={()=>{setMode(mode==='login'?'register':'login');setError('');setInfo('');}} style={{ color:'var(--essential-bright)',cursor:'pointer',fontWeight:700 }}>
                {mode==='login'?'Sign up':'Log in'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}