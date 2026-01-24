import { motion } from 'framer-motion'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-nomad-light/30 to-white flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-nomad-primary to-nomad-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" fillOpacity="0.2"/>
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="white" fillOpacity="0.4"/>
                  <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="white"/>
                  <path d="M4 12h2M18 12h2M12 4v2M12 18v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-4">
              Stay Connected Anywhere
            </h2>
            <p className="text-white/80 text-lg max-w-md">
              Reliable internet service for the modern nomad. Access your account to manage your service, view usage, and more.
            </p>
            
            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-white/70 text-sm">Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-white/70 text-sm">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-white/70 text-sm">States</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mb-8"
        >
          <img 
            src="/logo.svg" 
            alt="Nomad Internet" 
            className="h-12 mx-auto lg:mx-0"
          />
        </motion.div>
        
        {children}
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-gray-400 text-sm"
        >
          &copy; {new Date().getFullYear()} Nomad Internet. All rights reserved.
        </motion.p>
      </div>
    </div>
  )
}
