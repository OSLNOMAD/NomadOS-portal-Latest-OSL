import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/Input'
import Button from '../components/Button'

type SignInMethod = 'password' | 'otp'
type Step = 'credentials' | 'otp-sent'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [method, setMethod] = useState<SignInMethod>('password')
  const [step, setStep] = useState<Step>('credentials')

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed')
      }

      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('customer', JSON.stringify(data.customer))
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signin-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }

      setStep('otp-sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-signin-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('customer', JSON.stringify(data.customer))
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = method === 'password' 
    ? handlePasswordSignIn 
    : (step === 'credentials' ? handleSendOtp : handleVerifyOtp)

  return (
    <AuthLayout>
      <div className="text-center mb-10">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-extrabold mb-3"
          style={{ fontSize: '34px', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0f172a' }}
        >
          {step === 'otp-sent' ? 'Enter Verification Code' : 'Welcome Back'}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="leading-relaxed"
          style={{ color: '#64748b', lineHeight: 1.6 }}
        >
          {step === 'otp-sent' 
            ? 'We sent a code to your email' 
            : 'Sign in to access your Nomad Internet account'}
        </motion.p>
      </div>

      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid gap-8"
      >
        {step === 'credentials' && (
          <>
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              tooltip="Use the email you registered with"
            />

            {method === 'password' && (
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                tooltip="Your account password"
              />
            )}
          </>
        )}

        {step === 'otp-sent' && (
          <Input
            label="Verification Code"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            tooltip="Check your email for the code"
            maxLength={6}
          />
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl text-sm"
            style={{ 
              background: 'rgba(239, 68, 68, 0.08)', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#dc2626'
            }}
          >
            {error}
          </motion.div>
        )}

        {step === 'credentials' && method === 'password' && (
          <div className="flex items-center justify-between text-sm" style={{ marginTop: '-6px' }}>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-[18px] h-[18px] rounded cursor-pointer"
                style={{ accentColor: '#10a37f' }}
              />
              <span style={{ color: 'rgba(15, 23, 42, 0.78)' }}>
                Remember me
              </span>
            </label>
            <button 
              type="button"
              onClick={() => setMethod('otp')}
              className="font-bold hover:underline"
              style={{ color: '#0a8f6a' }}
            >
              Use OTP instead
            </button>
          </div>
        )}

        {step === 'credentials' && method === 'otp' && (
          <div className="flex justify-end" style={{ marginTop: '-6px' }}>
            <button 
              type="button"
              onClick={() => setMethod('password')}
              className="text-sm font-bold hover:underline"
              style={{ color: '#0a8f6a' }}
            >
              Use password instead
            </button>
          </div>
        )}

        <Button type="submit" isLoading={isLoading}>
          {method === 'password' ? 'Sign In' : (step === 'credentials' ? 'Send Code' : 'Verify & Sign In')}
        </Button>

        {step === 'otp-sent' && (
          <p className="text-sm text-center" style={{ color: '#64748b' }}>
            Didn't receive the code?{' '}
            <button 
              type="button"
              onClick={handleSendOtp}
              className="font-bold hover:underline"
              style={{ color: '#0a8f6a' }}
            >
              Resend
            </button>
          </p>
        )}

        <p className="text-center text-sm" style={{ color: '#64748b', lineHeight: 1.6 }}>
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="font-extrabold hover:underline"
            style={{ color: '#0a8f6a' }}
          >
            Sign up
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  )
}
