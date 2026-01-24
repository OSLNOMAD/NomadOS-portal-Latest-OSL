import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

interface Customer {
  id: number
  email: string
  phone?: string
  isVerified: boolean
  lastLoginAt?: string
  loginCount?: number
  createdAt?: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        navigate('/signin')
        return
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('customer')
          navigate('/signin')
          return
        }

        const data = await response.json()
        setCustomer(data.customer)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        navigate('/signin')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleLogout = async () => {
    const token = localStorage.getItem('auth_token')
    
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('Logout error:', error)
    }

    localStorage.removeItem('auth_token')
    localStorage.removeItem('customer')
    navigate('/signin')
  }

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#f7faf9' }}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 rounded-full mx-auto mb-4"
            style={{ 
              borderColor: 'rgba(16, 163, 127, 0.2)',
              borderTopColor: '#10a37f'
            }}
          />
          <p style={{ color: '#64748b' }}>Loading...</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `
          radial-gradient(900px 600px at 80% 30%, rgba(16, 163, 127, 0.08), transparent 55%),
          radial-gradient(700px 500px at 20% 80%, rgba(15, 23, 42, 0.04), transparent 55%),
          #f7faf9
        `
      }}
    >
      <header 
        className="border-b"
        style={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(15, 23, 42, 0.08)'
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src="/logo.svg" alt="Nomad Internet" className="h-10" />
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors hover:bg-gray-100"
            style={{ color: '#64748b' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 
            className="font-extrabold mb-2"
            style={{ fontSize: '40px', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0f172a' }}
          >
            Welcome back!
          </h1>
          <p className="text-lg mb-10" style={{ color: '#64748b' }}>
            Manage your Nomad Internet account
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.55)',
                boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)'
              }}
            >
              <h2 
                className="font-bold text-xl mb-6"
                style={{ color: '#0f172a' }}
              >
                Account Information
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#64748b' }}>
                    Email
                  </label>
                  <p className="text-lg font-medium mt-1" style={{ color: '#0f172a' }}>
                    {customer?.email}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#64748b' }}>
                    Phone
                  </label>
                  <p className="text-lg font-medium mt-1" style={{ color: '#0f172a' }}>
                    {customer?.phone || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#64748b' }}>
                    Account Status
                  </label>
                  <p className="mt-1">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ 
                        background: customer?.isVerified ? 'rgba(16, 163, 127, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: customer?.isVerified ? '#10a37f' : '#d97706'
                      }}
                    >
                      {customer?.isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.55)',
                boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)'
              }}
            >
              <h2 
                className="font-bold text-xl mb-6"
                style={{ color: '#0f172a' }}
              >
                Activity
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#64748b' }}>
                    Last Login
                  </label>
                  <p className="text-lg font-medium mt-1" style={{ color: '#0f172a' }}>
                    {formatDate(customer?.lastLoginAt)}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#64748b' }}>
                    Total Logins
                  </label>
                  <p className="text-lg font-medium mt-1" style={{ color: '#0f172a' }}>
                    {customer?.loginCount || 0}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#64748b' }}>
                    Member Since
                  </label>
                  <p className="text-lg font-medium mt-1" style={{ color: '#0f172a' }}>
                    {formatDate(customer?.createdAt)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-8 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #10a37f, #0a8f6a)',
              boxShadow: '0 20px 60px rgba(16, 163, 127, 0.2)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Need Help?
                </h3>
                <p className="text-white/80">
                  Our support team is available 24/7 to assist you.
                </p>
              </div>
              <button
                className="px-6 py-3 rounded-xl font-bold text-sm transition-transform hover:-translate-y-0.5"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#10a37f'
                }}
              >
                Contact Support
              </button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
