import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'

interface Customer {
  id: number
  email: string
  fullName?: string
  phone?: string
  isVerified: boolean
}

export default function AccountSettings() {
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const [fullName, setFullName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameSaving, setNameSaving] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)
  const [nameError, setNameError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const [newPhone, setNewPhone] = useState('')
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [phoneOtpSent, setPhoneOtpSent] = useState(false)
  const [phoneOtp, setPhoneOtp] = useState('')
  const [phoneSaving, setPhoneSaving] = useState(false)
  const [phoneSuccess, setPhoneSuccess] = useState(false)
  const [phoneError, setPhoneError] = useState('')

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
        setFullName(data.customer.fullName || '')
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

  const handleUpdateName = async () => {
    if (!fullName.trim()) {
      setNameError('Name is required')
      return
    }

    setNameSaving(true)
    setNameError('')
    setNameSuccess(false)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/update-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName: fullName.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        setNameError(data.error || 'Failed to update name')
        return
      }

      setCustomer(prev => prev ? { ...prev, fullName: fullName.trim() } : null)
      setNameSuccess(true)
      setIsEditingName(false)
      setTimeout(() => setNameSuccess(false), 3000)
    } catch (error) {
      setNameError('Failed to update name')
    } finally {
      setNameSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      setPasswordError('Current password is required')
      return
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setPasswordSaving(true)
    setPasswordError('')
    setPasswordSuccess(false)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        setPasswordError(data.error || 'Failed to update password')
        return
      }

      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (error) {
      setPasswordError('Failed to update password')
    } finally {
      setPasswordSaving(false)
    }
  }

  const formatPhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value)
    setNewPhone(formatted)
  }

  const handleSendPhoneOtp = async () => {
    const digits = newPhone.replace(/\D/g, '')
    if (digits.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number')
      return
    }

    setPhoneSaving(true)
    setPhoneError('')

    try {
      const token = localStorage.getItem('auth_token')
      const formattedPhone = `+1${digits}`
      
      const response = await fetch('/api/auth/request-phone-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone: formattedPhone })
      })

      const data = await response.json()

      if (!response.ok) {
        setPhoneError(data.error || 'Failed to send verification code')
        return
      }

      setPhoneOtpSent(true)
    } catch (error) {
      setPhoneError('Failed to send verification code')
    } finally {
      setPhoneSaving(false)
    }
  }

  const handleVerifyPhoneOtp = async () => {
    if (phoneOtp.length !== 6) {
      setPhoneError('Please enter the 6-digit code')
      return
    }

    setPhoneSaving(true)
    setPhoneError('')

    try {
      const token = localStorage.getItem('auth_token')
      const digits = newPhone.replace(/\D/g, '')
      const formattedPhone = `+1${digits}`

      const response = await fetch('/api/auth/verify-phone-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone: formattedPhone, code: phoneOtp })
      })

      const data = await response.json()

      if (!response.ok) {
        setPhoneError(data.error || 'Failed to verify code')
        return
      }

      setCustomer(prev => prev ? { ...prev, phone: formattedPhone } : null)
      setPhoneSuccess(true)
      setIsEditingPhone(false)
      setPhoneOtpSent(false)
      setNewPhone('')
      setPhoneOtp('')
      setTimeout(() => setPhoneSuccess(false), 3000)
    } catch (error) {
      setPhoneError('Failed to verify code')
    } finally {
      setPhoneSaving(false)
    }
  }

  const cancelPhoneEdit = () => {
    setIsEditingPhone(false)
    setPhoneOtpSent(false)
    setNewPhone('')
    setPhoneOtp('')
    setPhoneError('')
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

      <main className="max-w-2xl mx-auto px-6 py-12">
        <Link to="/dashboard" className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <h1 className="dashboard-title mb-2">Account Settings</h1>
        <p className="dashboard-subtitle mb-8">Manage your profile and security settings</p>

        <div className="settings-section">
          <h2 className="settings-section-title">
            <svg className="settings-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email Address
          </h2>
          <div className="settings-field">
            <p className="settings-label">Email</p>
            <div className="settings-value settings-value-readonly">
              <span>{customer?.email}</span>
              <span className="settings-readonly-badge">Cannot be changed</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">
            <svg className="settings-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Full Name
          </h2>
          {!isEditingName ? (
            <div className="settings-field">
              <p className="settings-label">Name</p>
              <div className="settings-value settings-value-readonly">
                <span>{customer?.fullName || 'Not set'}</span>
                <button 
                  onClick={() => setIsEditingName(true)} 
                  className="settings-btn settings-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                  Edit
                </button>
              </div>
              {nameSuccess && (
                <p className="settings-success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  Name updated successfully
                </p>
              )}
            </div>
          ) : (
            <div className="settings-field">
              <p className="settings-label">Name</p>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="settings-input"
                placeholder="Enter your full name"
              />
              {nameError && <p className="settings-error">{nameError}</p>}
              <div className="settings-actions">
                <button 
                  onClick={handleUpdateName}
                  disabled={nameSaving}
                  className="settings-btn settings-btn-primary"
                >
                  {nameSaving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={() => {
                    setIsEditingName(false)
                    setFullName(customer?.fullName || '')
                    setNameError('')
                  }}
                  className="settings-btn settings-btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">
            <svg className="settings-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Phone Number
          </h2>
          {!isEditingPhone ? (
            <div className="settings-field">
              <p className="settings-label">Phone</p>
              <div className="settings-value settings-value-readonly">
                <span>{customer?.phone || 'Not set'}</span>
                <button 
                  onClick={() => setIsEditingPhone(true)} 
                  className="settings-btn settings-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                  {customer?.phone ? 'Change' : 'Add'}
                </button>
              </div>
              {phoneSuccess && (
                <p className="settings-success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  Phone number updated successfully
                </p>
              )}
            </div>
          ) : (
            <div className="settings-field">
              <p className="settings-label">New Phone Number</p>
              <input
                type="tel"
                value={newPhone}
                onChange={handlePhoneChange}
                className="settings-input"
                placeholder="(555) 123-4567"
                disabled={phoneOtpSent}
              />
              
              {phoneOtpSent && (
                <div className="otp-verification-section">
                  <p className="otp-verification-title">Enter the 6-digit code sent to your phone</p>
                  <div className="otp-input-group">
                    <input
                      type="text"
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="settings-input"
                      placeholder="000000"
                      maxLength={6}
                    />
                    <button
                      onClick={handleVerifyPhoneOtp}
                      disabled={phoneSaving || phoneOtp.length !== 6}
                      className="settings-btn settings-btn-primary"
                    >
                      {phoneSaving ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </div>
              )}
              
              {phoneError && <p className="settings-error">{phoneError}</p>}
              
              <div className="settings-actions">
                {!phoneOtpSent && (
                  <button 
                    onClick={handleSendPhoneOtp}
                    disabled={phoneSaving}
                    className="settings-btn settings-btn-primary"
                  >
                    {phoneSaving ? 'Sending...' : 'Send Verification Code'}
                  </button>
                )}
                <button 
                  onClick={cancelPhoneEdit}
                  className="settings-btn settings-btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">
            <svg className="settings-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Password
          </h2>
          <div className="settings-field">
            <p className="settings-label">Current Password</p>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="settings-input"
              placeholder="Enter current password"
            />
          </div>
          <div className="settings-field">
            <p className="settings-label">New Password</p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="settings-input"
              placeholder="Enter new password (min 8 characters)"
            />
          </div>
          <div className="settings-field">
            <p className="settings-label">Confirm New Password</p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="settings-input"
              placeholder="Confirm new password"
            />
          </div>
          {passwordError && <p className="settings-error">{passwordError}</p>}
          {passwordSuccess && (
            <p className="settings-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12" />
              </svg>
              Password updated successfully
            </p>
          )}
          <div className="settings-actions">
            <button 
              onClick={handleUpdatePassword}
              disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
              className="settings-btn settings-btn-primary"
            >
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
