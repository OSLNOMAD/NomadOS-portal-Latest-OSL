import { useState, useEffect } from 'react'
import { getPlanDisplayName } from '../utils/planNames'

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

  useEffect(() => {
    if (isOpen) {
      fetchPlanOptions()
      setStep('options')
      setSelectedPlan(null)
      setError('')
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
        setAvailableOptions(data.options)
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Change Plan</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Subscription: {subscription.id}</p>
        </div>

        <div className="p-6">
          {step === 'options' && (
            <>
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(16,163,127,0.08)', border: '1px solid rgba(16,163,127,0.2)' }}>
                <p className="text-sm font-medium text-gray-700">Current Plan</p>
                <p className="text-lg font-bold text-gray-900">{getPlanDisplayName(subscription.planId)}</p>
                <p className="text-xl font-bold" style={{ color: '#10a37f' }}>
                  {formatCurrency(subscription.planAmount)}/{subscription.billingPeriodUnit}
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#10a37f' }}></div>
                </div>
              ) : availableOptions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No plan change options available for your current plan.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 mb-3">Available Plans</p>
                  {availableOptions.map((option) => (
                    <button
                      key={option.planId}
                      onClick={() => setSelectedPlan(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedPlan?.planId === option.planId
                          ? 'border-[#10a37f] bg-[rgba(16,163,127,0.05)]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{getPlanDisplayName(option.planId)}</p>
                          <p className="text-lg font-bold" style={{ color: '#10a37f' }}>
                            {formatCurrency(option.price)}/{subscription.billingPeriodUnit}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          option.type === 'upgrade'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {option.type === 'upgrade' ? 'Upgrade' : 'Downgrade'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {option.type === 'upgrade'
                            ? `+${formatCurrency(option.price - subscription.planAmount)}/mo more`
                            : `${formatCurrency(subscription.planAmount - option.price)}/mo less`
                          }
                        </p>
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={() => selectedPlan && setStep('confirm')}
                    disabled={!selectedPlan}
                    className="w-full mt-4 px-6 py-3 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: selectedPlan ? '#10a37f' : '#9ca3af' }}
                  >
                    Continue
                  </button>
                </div>
              )}
            </>
          )}

          {step === 'confirm' && selectedPlan && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 text-center mb-2">Confirm Plan Change</h4>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Please review the details below before confirming.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Current Plan</p>
                    <p className="font-medium text-gray-900">{getPlanDisplayName(subscription.planId)}</p>
                    <p className="text-sm font-semibold text-gray-700">{formatCurrency(subscription.planAmount)}/mo</p>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 mx-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">New Plan</p>
                    <p className="font-medium text-gray-900">{getPlanDisplayName(selectedPlan.planId)}</p>
                    <p className="text-sm font-semibold" style={{ color: '#10a37f' }}>{formatCurrency(selectedPlan.price)}/mo</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Price Difference</p>
                  <p className={`font-semibold ${priceDifference > 0 ? 'text-blue-700' : 'text-amber-700'}`}>
                    {priceDifference > 0 ? '+' : ''}{formatCurrency(priceDifference)}/mo
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                  <p className="text-sm font-medium text-blue-800 mb-1">When does this take effect?</p>
                  <p className="text-sm text-blue-700">
                    Your plan change will take effect at the <strong>end of your current billing period</strong> on{' '}
                    <strong>{new Date(subscription.currentTermEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
                    You will continue to have access to your current plan until then.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('options')}
                  className="flex-1 px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 text-white font-semibold rounded-lg transition-colors"
                  style={{ backgroundColor: '#10a37f' }}
                >
                  Confirm Change
                </button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin mb-4" style={{ borderTopColor: '#10a37f' }}></div>
              <p className="text-lg font-medium text-gray-900">Processing Plan Change...</p>
              <p className="text-sm text-gray-500 mt-1">Please wait while we update your subscription.</p>
            </div>
          )}

          {step === 'success' && selectedPlan && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(16,163,127,0.1)' }}>
                <svg className="w-8 h-8" style={{ color: '#10a37f' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Plan Change Scheduled</h4>
              <p className="text-sm text-gray-600 text-center mb-4">
                Your plan will change to <strong>{getPlanDisplayName(selectedPlan.planId)}</strong> ({formatCurrency(selectedPlan.price)}/mo)
                at the end of your current billing period.
              </p>
              <button
                onClick={() => {
                  onClose()
                  onPlanChangeComplete()
                }}
                className="px-6 py-3 text-white font-semibold rounded-lg transition-colors"
                style={{ backgroundColor: '#10a37f' }}
              >
                Done
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Plan Change Failed</h4>
              <p className="text-sm text-red-600 text-center mb-4">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('options')}
                  className="px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-white font-medium rounded-lg transition-colors"
                  style={{ backgroundColor: '#10a37f' }}
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
