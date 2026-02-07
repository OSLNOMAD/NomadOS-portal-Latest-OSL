import { useState, useEffect } from 'react'
import { getPlanDisplayName } from '../utils/planNames'
import { getPlanDescription } from '../../shared/planChangeConfig'

interface PlanChangeOption {
  planId: string
  price: number
  type: 'upgrade' | 'downgrade'
}

interface Subscription {
  id: string
  planId: string
  planName?: string
  status: string
  planAmount: number
  billingPeriodUnit: string
  currentTermEnd: string
  nextBillingAt: string
  chargebeeCustomerId?: string
}

interface PlanChangeModalProps {
  isOpen: boolean
  onClose: () => void
  subscription: Subscription
  token: string
  onPlanChangeComplete: () => void
}

export function PlanChangeModal({ isOpen, onClose, subscription, token, onPlanChangeComplete }: PlanChangeModalProps) {
  const [step, setStep] = useState<'options' | 'confirm' | 'processing' | 'success' | 'error'>('options')
  const [availableOptions, setAvailableOptions] = useState<PlanChangeOption[]>([])
  const [selectedPlan, setSelectedPlan] = useState<PlanChangeOption | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchPlanOptions()
      setStep('options')
      setSelectedPlan(null)
      setError('')
      setHoveredPlan(null)
    }
  }, [isOpen, subscription.planId])

  const fetchPlanOptions = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/plan-change/options?planId=${encodeURIComponent(subscription.planId)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.options) {
        const sorted = [...data.options].sort((a: PlanChangeOption, b: PlanChangeOption) => {
          if (a.type === 'upgrade' && b.type === 'downgrade') return -1
          if (a.type === 'downgrade' && b.type === 'upgrade') return 1
          return b.price - a.price
        })
        setAvailableOptions(sorted)
      } else {
        setAvailableOptions([])
      }
    } catch (err) {
      setError('Failed to load plan options')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    if (!selectedPlan) return
    setStep('processing')
    setError('')

    try {
      const res = await fetch('/api/plan-change/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          newPlanId: selectedPlan.planId,
          chargebeeCustomerId: subscription.chargebeeCustomerId
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStep('success')
      } else {
        setError(data.error || 'Failed to change plan')
        setStep('error')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setStep('error')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const priceDifference = selectedPlan ? selectedPlan.price - subscription.planAmount : 0
  const currentPlanDesc = getPlanDescription(subscription.planId)
  const hasUpgrades = availableOptions.some(o => o.type === 'upgrade')
  const hasDowngrades = availableOptions.some(o => o.type === 'downgrade')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10a37f, #0d8c6d)' }}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Change Your Plan</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6 ml-[52px]">Review available options and find the right fit for your needs.</p>

          {step === 'options' && (
            <>
              <div className="mb-5 rounded-xl p-4 border" style={{ backgroundColor: 'rgba(16,163,127,0.04)', borderColor: 'rgba(16,163,127,0.2)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4" style={{ color: '#10a37f' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#10a37f' }}>Your Current Plan</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{getPlanDisplayName(subscription.planId)}</p>
                    {currentPlanDesc && (
                      <ul className="mt-2 space-y-1">
                        {currentPlanDesc.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-2xl font-bold" style={{ color: '#10a37f' }}>{formatCurrency(subscription.planAmount)}</p>
                    <p className="text-xs text-gray-500">per {subscription.billingPeriodUnit}</p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center py-10">
                  <div className="w-10 h-10 border-4 rounded-full animate-spin mb-4" style={{ borderColor: '#e5e7eb', borderTopColor: '#10a37f' }}></div>
                  <p className="text-gray-500 text-sm">Loading available plans...</p>
                </div>
              ) : availableOptions.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No plan changes available</p>
                  <p className="text-sm text-gray-400 mt-1">Your current plan has no eligible change options.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hasUpgrades && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <p className="text-sm font-bold text-emerald-700 uppercase tracking-wide">Recommended Upgrades</p>
                      </div>
                      {availableOptions.filter(o => o.type === 'upgrade').map((option) => {
                        const desc = getPlanDescription(option.planId)
                        const isSelected = selectedPlan?.planId === option.planId
                        const isHovered = hoveredPlan === option.planId
                        return (
                          <button
                            key={option.planId}
                            onClick={() => setSelectedPlan(option)}
                            onMouseEnter={() => setHoveredPlan(option.planId)}
                            onMouseLeave={() => setHoveredPlan(null)}
                            className={`w-full text-left rounded-xl border-2 transition-all duration-200 mb-3 ${
                              isSelected
                                ? 'border-emerald-500 shadow-lg shadow-emerald-100'
                                : isHovered
                                  ? 'border-emerald-300 shadow-md'
                                  : 'border-gray-200 hover:border-emerald-200'
                            }`}
                            style={isSelected ? { background: 'linear-gradient(135deg, rgba(16,163,127,0.04), rgba(16,163,127,0.08))' } : {}}
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                                    {isSelected && (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                  <p className="font-bold text-gray-900">{getPlanDisplayName(option.planId)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                                    UPGRADE
                                  </span>
                                </div>
                              </div>
                              <div className="ml-7">
                                <div className="flex items-baseline gap-2 mb-2">
                                  <span className="text-xl font-bold" style={{ color: '#10a37f' }}>{formatCurrency(option.price)}</span>
                                  <span className="text-sm text-gray-500">/{subscription.billingPeriodUnit}</span>
                                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    +{formatCurrency(option.price - subscription.planAmount)}/mo
                                  </span>
                                </div>
                                {desc && (
                                  <ul className="space-y-1.5">
                                    {desc.bullets.map((bullet, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {bullet}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {currentPlanDesc?.upgradeNudge && (
                                  <div className="mt-3 flex items-start gap-2 p-2.5 bg-emerald-50 rounded-lg">
                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p className="text-xs text-emerald-700 font-medium">{currentPlanDesc.upgradeNudge}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {hasDowngrades && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 mt-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Other Options</p>
                      </div>
                      {availableOptions.filter(o => o.type === 'downgrade').map((option) => {
                        const desc = getPlanDescription(option.planId)
                        const isSelected = selectedPlan?.planId === option.planId
                        const isHovered = hoveredPlan === option.planId
                        return (
                          <button
                            key={option.planId}
                            onClick={() => setSelectedPlan(option)}
                            onMouseEnter={() => setHoveredPlan(option.planId)}
                            onMouseLeave={() => setHoveredPlan(null)}
                            className={`w-full text-left rounded-xl border-2 transition-all duration-200 mb-3 ${
                              isSelected
                                ? 'border-amber-400 shadow-md'
                                : isHovered
                                  ? 'border-gray-300 shadow-sm'
                                  : 'border-gray-150 hover:border-gray-300'
                            }`}
                            style={{ opacity: isSelected || isHovered ? 1 : 0.85 }}
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-gray-300'}`}>
                                    {isSelected && (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                  <p className="font-semibold text-gray-700">{getPlanDisplayName(option.planId)}</p>
                                </div>
                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                                  DOWNGRADE
                                </span>
                              </div>
                              <div className="ml-7">
                                <div className="flex items-baseline gap-2 mb-2">
                                  <span className="text-lg font-bold text-gray-700">{formatCurrency(option.price)}</span>
                                  <span className="text-sm text-gray-400">/{subscription.billingPeriodUnit}</span>
                                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                    {formatCurrency(subscription.planAmount - option.price)}/mo less
                                  </span>
                                </div>
                                {desc && (
                                  <ul className="space-y-1">
                                    {desc.bullets.map((bullet, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {bullet}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {currentPlanDesc?.downgradeWarning && (
                                  <div className="mt-3 flex items-start gap-2 p-2.5 bg-amber-50 rounded-lg">
                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="text-xs text-amber-700">{currentPlanDesc.downgradeWarning}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => selectedPlan && setStep('confirm')}
                    disabled={!selectedPlan}
                    className="w-full mt-2 px-6 py-3.5 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
                    style={{
                      background: selectedPlan
                        ? selectedPlan.type === 'upgrade'
                          ? 'linear-gradient(135deg, #10a37f, #0d8c6d)'
                          : '#6b7280'
                        : '#d1d5db'
                    }}
                  >
                    {selectedPlan
                      ? selectedPlan.type === 'upgrade'
                        ? 'Continue with Upgrade'
                        : 'Continue with Downgrade'
                      : 'Select a Plan to Continue'
                    }
                  </button>
                </div>
              )}
            </>
          )}

          {step === 'confirm' && selectedPlan && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedPlan.type === 'upgrade' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                    {selectedPlan.type === 'upgrade' ? (
                      <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    ) : (
                      <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-900 text-center mb-1">
                  {selectedPlan.type === 'upgrade' ? 'Confirm Your Upgrade' : 'Confirm Plan Change'}
                </h4>
                <p className="text-sm text-gray-500 text-center mb-6">
                  {selectedPlan.type === 'upgrade'
                    ? 'Great choice! Review the details below.'
                    : 'Please review the details below before confirming.'
                  }
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Current Plan</p>
                    <p className="font-semibold text-gray-900 mt-1">{getPlanDisplayName(subscription.planId)}</p>
                    <p className="text-sm font-bold text-gray-600 mt-0.5">{formatCurrency(subscription.planAmount)}/mo</p>
                  </div>
                  <div className="mx-4 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">New Plan</p>
                    <p className="font-semibold text-gray-900 mt-1">{getPlanDisplayName(selectedPlan.planId)}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: selectedPlan.type === 'upgrade' ? '#10a37f' : '#d97706' }}>
                      {formatCurrency(selectedPlan.price)}/mo
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${priceDifference > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-center gap-2">
                    <svg className={`w-5 h-5 ${priceDifference > 0 ? 'text-emerald-600' : 'text-amber-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className={`text-sm font-semibold ${priceDifference > 0 ? 'text-emerald-800' : 'text-amber-800'}`}>
                        {priceDifference > 0 ? 'Monthly Increase' : 'Monthly Savings'}
                      </p>
                      <p className={`text-lg font-bold ${priceDifference > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {priceDifference > 0 ? '+' : '-'}{formatCurrency(Math.abs(priceDifference))}/mo
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">When does this take effect?</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Your plan change will take effect at the <strong>end of your current billing period</strong> on{' '}
                        <strong>{new Date(subscription.currentTermEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
                        You will continue to have access to your current plan until then.
                      </p>
                    </div>
                  </div>
                </div>

                {selectedPlan.type === 'downgrade' && (
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-amber-800">Before you downgrade</p>
                        <p className="text-sm text-amber-700 mt-1">
                          {getPlanDescription(subscription.planId)?.downgradeWarning || 'Downgrading may reduce your service capabilities. You can always upgrade again later.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('options')}
                  className="flex-1 px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: selectedPlan.type === 'upgrade'
                      ? 'linear-gradient(135deg, #10a37f, #0d8c6d)'
                      : '#6b7280'
                  }}
                >
                  {selectedPlan.type === 'upgrade' ? 'Confirm Upgrade' : 'Confirm Downgrade'}
                </button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4" style={{ borderColor: '#e5e7eb', borderTopColor: '#10a37f' }}></div>
              <p className="text-lg font-semibold text-gray-900">Processing Your Change...</p>
              <p className="text-sm text-gray-500 mt-1">Please wait while we update your subscription.</p>
            </div>
          )}

          {step === 'success' && selectedPlan && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(16,163,127,0.1), rgba(16,163,127,0.2))' }}>
                <svg className="w-8 h-8" style={{ color: '#10a37f' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {selectedPlan.type === 'upgrade' ? 'Upgrade Scheduled!' : 'Plan Change Scheduled'}
              </h4>
              <p className="text-sm text-gray-600 text-center mb-2 max-w-sm">
                Your plan will change to <strong>{getPlanDisplayName(selectedPlan.planId)}</strong> at{' '}
                <strong>{formatCurrency(selectedPlan.price)}/mo</strong> at the end of your current billing period.
              </p>
              <p className="text-xs text-gray-400 mb-6">You can cancel this change anytime before it takes effect.</p>
              <button
                onClick={() => {
                  onClose()
                  onPlanChangeComplete()
                }}
                className="px-8 py-3 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #10a37f, #0d8c6d)' }}
              >
                Done
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Something Went Wrong</h4>
              <p className="text-sm text-red-600 text-center mb-6 max-w-sm">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('options')}
                  className="px-5 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-white font-medium rounded-xl transition-colors"
                  style={{ background: 'linear-gradient(135deg, #10a37f, #0d8c6d)' }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
