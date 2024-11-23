import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface HolographicButtonProps {
  children: ReactNode;
  onClick: () => void;
  icon?: React.ComponentType<any>;
  className?: string;
}

export const HolographicButton: React.FC<HolographicButtonProps> = ({ 
  children, 
  onClick, 
  icon: Icon, 
  className = '' 
}) => (
  <motion.button
    className={`px-4 py-2 bg-transparent border border-cyan-500 rounded-full text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all duration-300 flex items-center justify-center space-x-2 ${className}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span>{children}</span>
  </motion.button>
)

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({ children, className = '' }) => (
  <motion.div
    className={`bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-cyan-500 shadow-lg shadow-cyan-500/50 ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
) 