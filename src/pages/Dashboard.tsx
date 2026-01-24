import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'

interface Customer {
  id: number
  email: string
  fullName?: string
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
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="dashboard-layout flex items-center justify-center">
        <div className="text-center">
          <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4, margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--muted)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src="/logo.svg" alt="Nomad Internet" className="h-10" />
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="profile-avatar"
              aria-label="Account menu"
            >
              {getInitials(customer?.fullName)}
            </button>
            
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <p className="dropdown-name">{customer?.fullName || 'User'}</p>
                  <p className="dropdown-email">{customer?.email}</p>
                </div>
                <div className="dropdown-divider" />
                <Link to="/account" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Account Settings
                </Link>
                <Link to="/activity" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v4l3 3" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Activity Log
                </Link>
                <div className="dropdown-divider" />
                <button onClick={handleLogout} className="dropdown-item dropdown-item-danger">
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="dashboard-title mb-2">Welcome back{customer?.fullName ? `, ${customer.fullName.split(' ')[0]}` : ''}!</h1>
        <p className="dashboard-subtitle mb-10">Manage your Nomad Internet account</p>

        <div className="dashboard-card">
          <h2 className="card-title">Account Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="card-label">Name</p>
              <p className="card-value">{customer?.fullName || 'Not set'}</p>
            </div>
            <div>
              <p className="card-label">Email</p>
              <p className="card-value">{customer?.email}</p>
            </div>
            <div>
              <p className="card-label">Phone</p>
              <p className="card-value">{customer?.phone || 'Not set'}</p>
            </div>
            <div>
              <p className="card-label">Account Status</p>
              <p className="mt-1">
                <span className={`status-badge ${customer?.isVerified ? 'status-verified' : 'status-pending'}`}>
                  {customer?.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="cta-card mt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="cta-title">Need Help?</h3>
              <p className="cta-text">Our support team is available 24/7 to assist you.</p>
            </div>
            <button className="cta-button">Contact Support</button>
          </div>
        </div>
      </main>
    </div>
  )
}
