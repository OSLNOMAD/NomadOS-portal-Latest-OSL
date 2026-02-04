import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Plan {
  id: string
  name: string
  price: number
  description: string
  category: 'residential' | 'travel' | 'business' | 'rural'
}

const availablePlans: Plan[] = [
  {
    id: 'Nomad-Unlimited-Residential-Plan',
    name: 'Nomad Unlimited Residential',
    price: 129,
    description: 'Perfect for home use with unlimited data and reliable speeds.',
    category: 'residential'
  },
  {
    id: 'Nomad-Unlimited-Travel-Plan',
    name: 'Nomad Unlimited Travel',
    price: 149,
    description: 'Take your internet anywhere with our travel-optimized plan.',
    category: 'travel'
  },
  {
    id: 'Nomad-Unlimited-Lite-Plan',
    name: 'Nomad Unlimited Lite',
    price: 99,
    description: 'Budget-friendly option with essential features for light users.',
    category: 'residential'
  },
  {
    id: 'Nomad-Rural-Unlimited-100-Mbps-9995',
    name: 'Nomad Rural 100 Mbps',
    price: 99.95,
    description: 'Designed for rural areas with speeds up to 100 Mbps.',
    category: 'rural'
  },
  {
    id: 'Nomad-Rural-Unlimited-Ultra-200-Mbps-14995',
    name: 'Nomad Rural Ultra 200 Mbps',
    price: 149.95,
    description: 'Premium rural service with speeds up to 200 Mbps.',
    category: 'rural'
  },
  {
    id: 'Nomad-Residential-5G',
    name: 'Nomad Residential 5G',
    price: 159,
    description: 'Next-generation 5G speeds for your home.',
    category: 'residential'
  },
  {
    id: 'Unlimited-Fixed-Wireless-Access-Business-Internet-100Mbps-Plan',
    name: 'Nomad Business 100 Mbps',
    price: 199,
    description: 'Professional-grade internet for small businesses.',
    category: 'business'
  },
  {
    id: 'Unlimited-Fixed-Wireless-Access-Business-Internet-200Mbps',
    name: 'Nomad Business 200 Mbps',
    price: 299,
    description: 'High-performance internet for demanding business needs.',
    category: 'business'
  }
]

interface PlanChangeModalProps {
  isOpen: boolean
  onClose: () => void
  subscription: {
    id: string
    planId: string
    planAmount: number
  }
  customerEmail: string
  customerName: string
  token: string
}

export function PlanChangeModal({ isOpen, onClose, subscription, customerEmail, customerName, token }: PlanChangeModalProps) {
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select')
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'residential' | 'travel' | 'business' | 'rural'>('all')

  const filteredPlans = availablePlans.filter(plan => {
    if (filter === 'all') return true
    return plan.category === filter
  }).filter(plan => plan.id !== subscription.planId)

  const handleSubmit = async () => {
    if (!selectedPlan) return
    
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/plan-change-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          currentPlanId: subscription.planId,
          currentPrice: subscription.planAmount,
          requestedPlanId: selectedPlan.id,
          requestedPlanName: selectedPlan.name,
          requestedPrice: selectedPlan.price * 100,
          customerEmail,
          customerName
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit plan change request')
      }
      
      setStep('success')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep('select')
    setSelectedPlan(null)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #10a37f 0%, #0d8a6a 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {step === 'select' && 'Change Your Plan'}
                {step === 'confirm' && 'Confirm Plan Change'}
                {step === 'success' && 'Request Submitted'}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {step === 'select' && 'Select a new plan for your subscription'}
                {step === 'confirm' && 'Review your plan change request'}
                {step === 'success' && 'Our team will process your request shortly'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {step === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-wrap gap-2 mb-6">
                  {(['all', 'residential', 'travel', 'business', 'rural'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === cat
                          ? 'text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      style={filter === cat ? { backgroundColor: '#10a37f' } : {}}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {filteredPlans.length === 0 ? (
                    <div className="text-center py-8 text-muted">
                      No other plans available in this category.
                    </div>
                  ) : (
                    filteredPlans.map((plan) => (
                      <motion.label
                        key={plan.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPlan?.id === plan.id
                            ? 'border-[#10a37f] bg-[#10a37f]/5 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              selectedPlan?.id === plan.id
                                ? 'border-[#10a37f] bg-[#10a37f]'
                                : 'border-gray-300'
                            }`}>
                              {selectedPlan?.id === plan.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-white rounded-full"
                                />
                              )}
                            </div>
                            <input
                              type="radio"
                              name="plan"
                              value={plan.id}
                              checked={selectedPlan?.id === plan.id}
                              onChange={() => setSelectedPlan(plan)}
                              className="sr-only"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4">
                              <h3 className="font-semibold text-text">{plan.name}</h3>
                              <div className="text-right flex-shrink-0">
                                <span className="text-lg font-bold" style={{ color: '#10a37f' }}>
                                  ${plan.price.toFixed(2)}
                                </span>
                                <span className="text-muted text-sm">/mo</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted mt-1">{plan.description}</p>
                            <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                              plan.category === 'residential' ? 'bg-blue-100 text-blue-700' :
                              plan.category === 'travel' ? 'bg-purple-100 text-purple-700' :
                              plan.category === 'business' ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {plan.category.charAt(0).toUpperCase() + plan.category.slice(1)}
                            </span>
                          </div>
                        </div>
                      </motion.label>
                    ))
                  )}
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </motion.div>
            )}

            {step === 'confirm' && selectedPlan && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-text mb-4">Plan Change Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wide">Current Plan</p>
                        <p className="font-medium text-text">{subscription.planId}</p>
                        <p className="text-sm" style={{ color: '#10a37f' }}>${(subscription.planAmount / 100).toFixed(2)}/mo</p>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted uppercase tracking-wide">New Plan</p>
                        <p className="font-medium text-text">{selectedPlan.name}</p>
                        <p className="text-sm" style={{ color: '#10a37f' }}>${selectedPlan.price.toFixed(2)}/mo</p>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-amber-800 font-medium">Important Notice</p>
                          <p className="text-sm text-amber-700 mt-1">
                            This is a request only. Our team will review and contact you to confirm the plan change. 
                            Your current plan will remain active until the change is processed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#10a37f20' }}
                >
                  <svg className="w-10 h-10" style={{ color: '#10a37f' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-text mb-2">Request Submitted!</h3>
                <p className="text-muted mb-6 max-w-md mx-auto">
                  Your plan change request has been sent to our team. We'll review it and get back to you within 24 hours.
                </p>
                {selectedPlan && (
                  <div className="inline-block bg-gray-50 rounded-lg px-6 py-3">
                    <p className="text-sm text-muted">Requested Plan</p>
                    <p className="font-semibold text-text">{selectedPlan.name}</p>
                    <p className="text-sm" style={{ color: '#10a37f' }}>${selectedPlan.price.toFixed(2)}/mo</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            {step === 'select' && (
              <>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  disabled={!selectedPlan}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  style={{ backgroundColor: '#10a37f' }}
                >
                  Continue
                </button>
              </>
            )}

            {step === 'confirm' && (
              <>
                <button
                  onClick={() => setStep('select')}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white rounded-xl transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#10a37f' }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </>
            )}

            {step === 'success' && (
              <button
                onClick={handleClose}
                className="w-full px-4 py-3 text-sm font-medium text-white rounded-xl transition-all hover:shadow-lg"
                style={{ backgroundColor: '#10a37f' }}
              >
                Done
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
