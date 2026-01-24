import { useState } from 'react'
import { motion } from 'framer-motion'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  tooltip?: string
}

export default function Input({ label, tooltip, className = '', ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {tooltip && (
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button
              type="button"
              className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
            
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: showTooltip ? 1 : 0, y: showTooltip ? 0 : 5 }}
              className={`absolute right-0 top-full mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50 ${showTooltip ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
              {tooltip}
              <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-800 rotate-45" />
            </motion.div>
          </div>
        )}
      </div>
      
      <div className="relative">
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          className={`
            w-full px-4 py-3 rounded-lg border-2 bg-gray-50 text-gray-900
            transition-all duration-200 ease-out
            placeholder:text-gray-400
            ${isFocused 
              ? 'border-nomad-primary bg-white shadow-lg shadow-nomad-primary/10' 
              : 'border-transparent hover:border-gray-200 hover:bg-white'
            }
            ${className}
          `}
        />
        
        <motion.div
          initial={false}
          animate={{
            scaleX: isFocused ? 1 : 0,
            opacity: isFocused ? 1 : 0
          }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-nomad-primary to-nomad-accent origin-left rounded-full"
        />
      </div>
    </motion.div>
  )
}
