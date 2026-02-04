import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  category: 'residential' | 'travel'
}

const availablePlans: Plan[] = [
  {
    id: 'Nomad-Unlimited-Residential-Plan',
    name: 'Nomad Unlimited Residential',
    price: 99.95,
    description: 'Best for full-time home or fixed-location use',
    features: [
      'Designed for one primary location',
      'Stable performance for everyday home internet use',
      'Ideal for households and remote work'
    ],
    category: 'residential'
  },
  {
    id: 'Nomad-Unlimited-Travel-Plan',
    name: 'Nomad Unlimited Travel',
    price: 129.95,
    description: 'Best for RV, travel, or changing locations',
    features: [
      'Works at home and while traveling',
      'Designed for movement and flexible locations',
      'Pause and resume service when not in use'
    ],
    category: 'travel'
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

  const filteredPlans = availablePlans.filter(plan => plan.id !== subscription.planId)

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPlans.length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-muted">
                      You are already on the only available plan.
                    </div>
                  ) : (
                    filteredPlans.map((plan) => (
                      <motion.label
                        key={plan.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`block rounded-2xl cursor-pointer transition-all overflow-hidden ${
                          selectedPlan?.id === plan.id
                            ? 'ring-2 ring-[#10a37f] shadow-lg'
                            : 'border border-gray-200 hover:shadow-md'
                        }`}
                      >
                        <div 
                          className="p-4 text-white"
                          style={{ 
                            background: plan.category === 'residential' 
                              ? 'linear-gradient(135deg, #1a3a32 0%, #2d5a4a 100%)'
                              : 'linear-gradient(135deg, #1a3a32 0%, #2d5a4a 100%)'
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                            <span className="text-lg font-bold">nomad</span>
                          </div>
                          <p className="text-sm text-white/80 uppercase tracking-wide">
                            unlimited {plan.category}
                          </p>
                        </div>
                        
                        <div className="p-4 bg-white">
                          <div className="flex items-center gap-2 mb-3 text-muted">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span className="text-sm">{plan.description}</span>
                          </div>
                          
                          <ul className="space-y-2 mb-4">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#10a37f' }}></span>
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-3xl font-bold text-text">${plan.price.toFixed(2)}</span>
                            <span className="text-muted">/month</span>
                          </div>
                          
                          <div className={`w-full py-3 rounded-lg text-center font-medium transition-all ${
                            selectedPlan?.id === plan.id
                              ? 'text-white'
                              : 'border border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                          style={selectedPlan?.id === plan.id ? { backgroundColor: '#10a37f' } : {}}
                          >
                            {selectedPlan?.id === plan.id ? 'Selected' : `Select ${plan.category.charAt(0).toUpperCase() + plan.category.slice(1)} Plan`}
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
