import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'

interface Customer {
  id: number
  email: string
  fullName?: string
  lastLoginAt?: string
  loginCount?: number
  createdAt?: string
}

export default function ActivityLog() {
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  const formatRelativeDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
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
                <Link to="/dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                  Dashboard
                </Link>
                <Link to="/account" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Account Settings
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

      <main className="max-w-2xl mx-auto px-6 py-12">
        <Link to="/dashboard" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <h1 className="dashboard-title mb-2">Activity Log</h1>
        <p className="dashboard-subtitle mb-8">Your account activity and login history</p>

        <div className="settings-section">
          <h2 className="settings-section-title">
            <svg className="settings-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Overview
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="activity-stat">
              <p className="activity-stat-value">{customer?.loginCount || 0}</p>
              <p className="activity-stat-label">Total Logins</p>
            </div>
            <div className="activity-stat">
              <p className="activity-stat-value" style={{ fontSize: '18px' }}>{formatRelativeDate(customer?.lastLoginAt)}</p>
              <p className="activity-stat-label">Last Login</p>
            </div>
            <div className="activity-stat">
              <p className="activity-stat-value" style={{ fontSize: '18px' }}>{formatRelativeDate(customer?.createdAt)}</p>
              <p className="activity-stat-label">Member Since</p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">
            <svg className="settings-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Recent Activity
          </h2>
          
          <div className="activity-item">
            <div className="activity-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10,17 15,12 10,7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <div className="activity-content">
              <p className="activity-title">Last Login</p>
              <p className="activity-time">{formatDate(customer?.lastLoginAt)}</p>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <div className="activity-content">
              <p className="activity-title">Account Created</p>
              <p className="activity-time">{formatDate(customer?.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">
            <svg className="settings-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Security Information
          </h2>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <div className="activity-content">
              <p className="activity-title">Account Verified</p>
              <p className="activity-time">Your email and phone have been verified</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
