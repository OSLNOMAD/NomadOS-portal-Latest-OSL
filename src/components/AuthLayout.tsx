import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="brand-block">
          <h1 className="brand-title">Nomad Internet</h1>
          <p className="brand-subtitle">Stay Connected Anywhere</p>
          <p className="brand-copy">
            Reliable internet service for the modern nomad. Access your account to manage your service, view usage, and more.
          </p>
          <div className="brand-stats">
            <div className="stat">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Support</div>
            </div>
            <div className="stat">
              <div className="stat-value">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat">
              <div className="stat-value">50+</div>
              <div className="stat-label">States</div>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/logo.svg" alt="Nomad Internet" />
          </div>
          {children}
          <p className="auth-legal">
            &copy; 2026 Nomad Internet. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
