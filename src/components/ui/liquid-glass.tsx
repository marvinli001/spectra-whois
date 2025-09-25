'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface LiquidGlassProps {
  children: ReactNode
  className?: string
  animate?: boolean
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  opacity?: number
}

export function LiquidGlass({
  children,
  className,
  animate = true,
  blur = 'md',
  opacity = 0.1
}: LiquidGlassProps) {
  const blurClass = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }[blur]

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/20',
        blurClass,
        'bg-white/5 shadow-2xl shadow-black/20',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-white/5 before:to-transparent before:opacity-70',
        'after:absolute after:inset-0 after:rounded-3xl after:border after:border-white/10 after:pointer-events-none',
        className
      )}
      style={{
        background: `linear-gradient(135deg,
          rgba(255, 255, 255, ${opacity + 0.08}) 0%,
          rgba(255, 255, 255, ${opacity + 0.03}) 50%,
          rgba(255, 255, 255, ${opacity}) 100%)`
      }}
      initial={animate ? { opacity: 0, y: 20, scale: 0.95 } : undefined}
      animate={animate ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={animate ? {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        type: "spring",
        stiffness: 100,
        damping: 15
      } : undefined}
      whileHover={{
        scale: 1.01,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
    >
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl border border-blue-400/0 transition-all duration-1000"
        animate={{
          borderColor: [
            'rgba(59, 130, 246, 0)',
            'rgba(59, 130, 246, 0.1)',
            'rgba(147, 51, 234, 0.1)',
            'rgba(59, 130, 246, 0)'
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  )
}

interface LiquidButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  loading?: boolean
  loadingText?: string
}

export function LiquidButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  loading = false,
  loadingText = 'Loading...'
}: LiquidButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500/30 to-purple-600/30 border-white/40 text-white hover:from-blue-500/40 hover:to-purple-600/40 hover:border-white/50 shadow-lg hover:shadow-blue-500/25',
    secondary: 'bg-white/15 border-white/30 text-white/90 hover:bg-white/25 hover:border-white/40 shadow-lg',
    ghost: 'bg-transparent border-white/20 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/30'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-xl border backdrop-blur-md',
        'transition-all duration-300 font-semibold',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300',
        'hover:before:opacity-100',
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{loadingText}</span>
          </>
        ) : (
          children
        )}
      </span>

      {/* Enhanced shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        animate={{
          translateX: ['0%', '200%'],
          opacity: [0, 0.8, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut",
          repeatDelay: 4
        }}
      />
    </motion.button>
  )
}

interface LiquidCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export function LiquidCard({
  children,
  className,
  hover = true,
  padding = 'md'
}: LiquidCardProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/15',
        'bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/10',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/8 before:via-white/3 before:to-transparent before:opacity-60',
        paddings[padding],
        className
      )}
      whileHover={hover ? {
        scale: 1.02,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.1)',
        y: -2
      } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle pulse effect on hover */}
      {hover && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 rounded-2xl"
          whileHover={{
            opacity: [0, 1, 0],
            transition: { duration: 2, repeat: Infinity }
          }}
        />
      )}
    </motion.div>
  )
}

interface LiquidInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSubmit?: () => void
  disabled?: boolean
  className?: string
  icon?: ReactNode
}

export function LiquidInput({
  placeholder,
  value,
  onChange,
  onSubmit,
  disabled = false,
  className,
  icon
}: LiquidInputProps) {
  return (
    <div className={cn("relative", className)}>
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-xl border border-white/20",
          "bg-white/5 backdrop-blur-md shadow-2xl",
          "focus-within:border-white/40 focus-within:bg-white/10",
          "focus-within:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
          "transition-all duration-500 ease-out",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-white/5 before:to-white/10 before:opacity-0 before:transition-opacity before:duration-300",
          "hover:before:opacity-100"
        )}
        whileFocus={{ scale: 1.01 }}
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 z-10">
            {icon}
          </div>
        )}

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSubmit?.()}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3 bg-transparent text-white placeholder-white/50 relative z-10",
            "focus:outline-none focus:ring-0 font-medium",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            icon && "pl-12 text-left",
            !icon && "text-center",
            className
          )}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0"
          animate={{ x: [-100, 200], opacity: [0, 1, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "linear"
          }}
        />
      </motion.div>
    </div>
  )
}