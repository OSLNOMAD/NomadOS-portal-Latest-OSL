interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  isLoading?: boolean
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export default function Button({ 
  type = 'button',
  isLoading = false, 
  variant = 'primary',
  children, 
  className = '',
  disabled,
  onClick
}: ButtonProps) {
  const buttonClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${buttonClass} ${className}`}
      onClick={onClick}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="spinner" />
          <span>Please wait...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}
