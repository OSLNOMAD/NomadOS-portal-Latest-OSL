import { useState, useEffect } from 'react'

interface PauseSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  subscription: {
    id: string
    planId: string
    status: string
    planAmount: number
    totalDues: number
    dueInvoicesCount: number
    subscriptionItems?: Array<{
      itemPriceId: string
      itemType: string
      quantity: number
      amount: number
      unitPrice: number
    }>
  }
  token: string
  onPauseComplete: () => void
}

type FlowStep =
  | 'checking'
  | 'unpaid'
  | 'no_travel_addon'
  | 'adding_addon'
  | 'addon_added_checking'
  | 'select_duration'
  | 'confirming'
  | 'success'
  | 'error'
  | 'limit_reached'

export function PauseSubscriptionModal({ isOpen, onClose, subscription, token, onPauseComplete }: PauseSubscriptionModalProps) {
  const [step, setStep] = useState<FlowStep>('checking')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [durationMonths, setDurationMonths] = useState(1)
  const [maxDuration, setMaxDuration] = useState(3)
  const [pauseMonthsUsed, setPauseMonthsUsed] = useState(0)
  const [remainingMonths, setRemainingMonths] = useState(6)
  const [pauseResult, setPauseResult] = useState<{ pauseDate: string; resumeDate: string } | null>(null)
  const [totalDues, setTotalDues] = useState(0)
  const [addingAddonStatus, setAddingAddonStatus] = useState('')
  const [pollCount, setPollCount] = useState(0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  useEffect(() => {
    if (isOpen) {
      setStep('checking')
      setError('')
      setDurationMonths(1)
      setPauseResult(null)
      setPollCount(0)
      setAddingAddonStatus('')
      checkEligibility()
    }
  }, [isOpen])

  const checkEligibility = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/subscription/pause/check-eligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subscriptionId: subscription.id })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to check eligibility')
        setStep('error')
        return
      }

      if (!data.eligible) {
        if (data.reason === 'unpaid') {
          setTotalDues(data.totalDues)
          setStep('unpaid')
        } else if (data.reason === 'limit_reached') {
          setPauseMonthsUsed(data.pauseMonthsUsed)
          setStep('limit_reached')
        } else {
          setError(data.message || 'Subscription is not eligible for pause')
          setStep('error')
        }
        return
      }

      setPauseMonthsUsed(data.pauseMonthsUsed)
      setRemainingMonths(data.remainingMonths)
      setMaxDuration(data.maxDuration)

      if (!data.hasTravelAddon) {
        setStep('no_travel_addon')
      } else {
        setStep('select_duration')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check eligibility')
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTravelAddon = async () => {
    setLoading(true)
    setError('')
    setAddingAddonStatus('Adding travel add-on to your subscription...')
    setStep('adding_addon')

    try {
      const response = await fetch('/api/subscription/pause/add-travel-addon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subscriptionId: subscription.id })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to add travel add-on')
        setStep('error')
        return
      }

      setAddingAddonStatus('Travel add-on added! Checking payment status...')
      setStep('addon_added_checking')
      setPollCount(0)
      pollPaymentStatus()
    } catch (err: any) {
      setError(err.message || 'Failed to add travel add-on')
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const pollPaymentStatus = async () => {
    let attempts = 0
    const maxAttempts = 10

    const poll = async () => {
      attempts++
      setPollCount(attempts)

      try {
        const response = await fetch('/api/subscription/pause/check-addon-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ subscriptionId: subscription.id })
        })

        const data = await response.json()

        if (data.isPaid && data.hasTravelAddon) {
          setAddingAddonStatus('Payment confirmed! You can now pause your subscription.')
          setStep('select_duration')
          return
        }

        if (attempts >= maxAttempts) {
          setAddingAddonStatus('Payment is still processing. Please try again in a few minutes.')
          setError('Payment for the travel add-on is still processing. Please wait a few minutes and try pausing again.')
          setStep('error')
          return
        }

        setTimeout(poll, 3000)
      } catch {
        if (attempts < maxAttempts) {
          setTimeout(poll, 3000)
        } else {
          setError('Could not verify payment status. Please try again.')
          setStep('error')
        }
      }
    }

    poll()
  }

  const handleExecutePause = async () => {
    setLoading(true)
    setError('')
    setStep('confirming')

    try {
      const response = await fetch('/api/subscription/pause/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          durationMonths
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to pause subscription')
        setStep('error')
        return
      }

      setPauseResult({
        pauseDate: data.pauseDate,
        resumeDate: data.resumeDate
      })
      setStep('success')
    } catch (err: any) {
      setError(err.message || 'Failed to pause subscription')
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (step === 'success') {
      onPauseComplete()
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Pause Subscription</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {step === 'checking' && (
            <div className="flex flex-col items-center py-8">
              <div className="w-10 h-10 border-4 rounded-full animate-spin mb-4" style={{ borderColor: '#e5e7eb', borderTopColor: '#10a37f' }}></div>
              <p className="text-gray-600">Checking eligibility...</p>
            </div>
          )}

          {step === 'unpaid' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-red-800 text-lg">Outstanding Balance</h3>
                    <p className="text-red-700 mt-1">
                      You need to settle your outstanding balance of <strong>{formatCurrency(totalDues)}</strong> before you can pause your subscription.
                    </p>
                    <p className="text-red-600 text-sm mt-2">
                      Please go to your subscription and pay the outstanding amount, then try pausing again.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
                  style={{ background: 'linear-gradient(135deg, #10a37f, #0d8c6d)' }}
                >
                  Got it
                </button>
              </div>
            </div>
          )}

          {step === 'limit_reached' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-yellow-800 text-lg">Pause Limit Reached</h3>
                    <p className="text-yellow-700 mt-1">
                      You have already used <strong>{pauseMonthsUsed} month{pauseMonthsUsed !== 1 ? 's' : ''}</strong> of pause time in the past 365 days.
                    </p>
                    <p className="text-yellow-600 text-sm mt-2">
                      The maximum pause allowed is 6 months per 365-day period. Please wait until some of your pause time expires before trying again.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
                  style={{ background: 'linear-gradient(135deg, #10a37f, #0d8c6d)' }}
                >
                  Got it
                </button>
              </div>
            </div>
          )}

          {step === 'no_travel_addon' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-blue-800 text-lg">Travel Add-on Required</h3>
                    <p className="text-blue-700 mt-1">
                      To pause your subscription, you need the <strong>Nomad Travel Upgrade</strong> add-on on your account. This add-on costs <strong>$10.00/month</strong>.
                    </p>
                    <p className="text-blue-600 text-sm mt-2">
                      Would you like to add the Travel Upgrade to your subscription? You will be charged for it before the pause can proceed.
                    </p>
                  </div>
                </div>
              </div>

              {pauseMonthsUsed > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                  You have used <strong>{pauseMonthsUsed}</strong> of 6 allowed pause months in the past 365 days.
                  <strong> {remainingMonths}</strong> month{remainingMonths !== 1 ? 's' : ''} remaining.
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTravelAddon}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #10a37f, #0d8c6d)' }}
                >
                  {loading ? 'Adding...' : 'Add Travel Upgrade ($10.00/mo)'}
                </button>
              </div>
            </div>
          )}

          {step === 'adding_addon' && (
            <div className="flex flex-col items-center py-8">
              <div className="w-10 h-10 border-4 rounded-full animate-spin mb-4" style={{ borderColor: '#e5e7eb', borderTopColor: '#10a37f' }}></div>
              <p className="text-gray-600">{addingAddonStatus}</p>
            </div>
          )}

          {step === 'addon_added_checking' && (
            <div className="flex flex-col items-center py-8">
              <div className="w-10 h-10 border-4 rounded-full animate-spin mb-4" style={{ borderColor: '#e5e7eb', borderTopColor: '#10a37f' }}></div>
              <p className="text-gray-600">{addingAddonStatus}</p>
              <p className="text-gray-400 text-sm mt-2">Attempt {pollCount} of 10...</p>
            </div>
          )}

          {step === 'select_duration' && (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">How long would you like to pause?</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Select a duration between 1 and {maxDuration} month{maxDuration !== 1 ? 's' : ''}. Your subscription will automatically resume on the same day after the pause period ends.
                </p>

                <div className="flex gap-3">
                  {Array.from({ length: maxDuration }, (_, i) => i + 1).map((months) => (
                    <button
                      key={months}
                      onClick={() => setDurationMonths(months)}
                      className={`flex-1 py-3 px-4 rounded-xl text-center border-2 transition-all font-medium ${
                        durationMonths === months
                          ? 'border-transparent text-white shadow-md'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                      }`}
                      style={durationMonths === months ? { background: 'linear-gradient(135deg, #10a37f, #0d8c6d)' } : {}}
                    >
                      <div className="text-lg">{months}</div>
                      <div className="text-xs opacity-80">month{months !== 1 ? 's' : ''}</div>
                    </button>
                  ))}
                </div>
              </div>

              {pauseMonthsUsed > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  <strong>Note:</strong> You have used {pauseMonthsUsed} of 6 allowed pause months in the past 365 days.
                  You can pause for up to {remainingMonths} more month{remainingMonths !== 1 ? 's' : ''}.
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pause starts:</span>
                  <span className="font-medium text-gray-800">Tomorrow</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Resumes on:</span>
                  <span className="font-medium text-gray-800">
                    {(() => {
                      const now = new Date()
                      const pauseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                      pauseDate.setDate(pauseDate.getDate() + 1)
                      const resumeDate = new Date(pauseDate)
                      resumeDate.setMonth(resumeDate.getMonth() + durationMonths)
                      resumeDate.setDate(pauseDate.getDate())
                      return formatDate(resumeDate.toISOString())
                    })()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium text-gray-800">{durationMonths} month{durationMonths !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                <strong>Important:</strong> During the pause, your service will be suspended and you will not be billed. Your subscription will automatically resume at the end of the pause period.
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecutePause}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #10a37f, #0d8c6d)' }}
                >
                  {loading ? 'Pausing...' : `Pause for ${durationMonths} Month${durationMonths !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          )}

          {step === 'confirming' && (
            <div className="flex flex-col items-center py-8">
              <div className="w-10 h-10 border-4 rounded-full animate-spin mb-4" style={{ borderColor: '#e5e7eb', borderTopColor: '#10a37f' }}></div>
              <p className="text-gray-600">Pausing your subscription...</p>
            </div>
          )}

          {step === 'success' && pauseResult && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10a37f' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: '#0d8c6d' }}>Subscription Paused Successfully</h3>
                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Paused on:</span>
                        <span className="font-medium">{formatDate(pauseResult.pauseDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resumes on:</span>
                        <span className="font-medium">{formatDate(pauseResult.resumeDate)}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-3">
                      Your subscription will automatically resume on the date shown above. You will not be billed during the pause period.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
                  style={{ background: 'linear-gradient(135deg, #10a37f, #0d8c6d)' }}
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-red-800 text-lg">Error</h3>
                    <p className="text-red-700 mt-1">{error || 'Something went wrong. Please try again.'}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setStep('checking')
                    checkEligibility()
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
                  style={{ background: 'linear-gradient(135deg, #10a37f, #0d8c6d)' }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
