'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export interface LiquidGlassProps {
  children: ReactNode
  className?: string
  animate?: boolean
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  opacity?: number
}

export function LiquidGlass({
  children,
  className,
  animate = true,
  blur = 'none',
  opacity = 0.03  // 降低默认透明度，更透明
}: LiquidGlassProps) {
  const blurClass = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }[blur]

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/8', // 极透明边框
        blurClass,
        'bg-white/0.5 shadow-2xl shadow-black/40', // 超极透明背景，强阴影
        // 真实玻璃折射效果
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/4 before:via-transparent before:to-white/1 before:opacity-50',
        className
      )}
      style={{
        background: `
          radial-gradient(circle at 25% 15%, rgba(255, 255, 255, ${opacity + 0.02}) 0%, transparent 50%),
          radial-gradient(circle at 75% 85%, rgba(255, 255, 255, ${opacity + 0.015}) 0%, transparent 50%),
          linear-gradient(135deg,
            rgba(255, 255, 255, ${opacity + 0.005}) 0%,
            rgba(255, 255, 255, ${opacity - 0.005}) 50%,
            rgba(255, 255, 255, ${opacity}) 100%)
        `,
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          inset 0 -1px 0 rgba(255, 255, 255, 0.02),
          0 0 20px rgba(255, 255, 255, 0.05)
        `
      }}
      initial={animate ? { y: 20, scale: 0.95 } : undefined}
      animate={animate ? { y: 0, scale: 1 } : undefined}
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

      {/* 增强的动画边框发光 */}
      <motion.div
        className="absolute inset-0 rounded-3xl border border-blue-400/0 transition-all duration-1000"
        animate={{
          borderColor: [
            'rgba(59, 130, 246, 0)',
            'rgba(59, 130, 246, 0.15)',
            'rgba(147, 51, 234, 0.15)',
            'rgba(16, 185, 129, 0.12)', // 加入绿色
            'rgba(59, 130, 246, 0)'
          ]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* 色散效果 - 模拟真实玻璃的彩虹边缘 */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/3 via-transparent to-blue-500/3 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/2 via-transparent to-purple-500/2 opacity-25" />
      </div>

      {/* 动态折射变形效果 */}
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 200% 100% at 30% 20%, rgba(255,255,255,0.05) 0%, transparent 40%),
            radial-gradient(ellipse 150% 80% at 70% 80%, rgba(59,130,246,0.04) 0%, transparent 50%),
            conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.03) 90deg, transparent 180deg, rgba(147,51,234,0.02) 270deg, transparent 360deg)
          `,
          filter: 'blur(0.5px)',
          backdropFilter: 'blur(1px)'
        }}
        animate={{
          transform: [
            'perspective(800px) rotateX(0deg) rotateY(0deg) skewX(0deg)',
            'perspective(800px) rotateX(3deg) rotateY(5deg) skewX(1deg)',
            'perspective(800px) rotateX(-2deg) rotateY(-3deg) skewX(-0.5deg)',
            'perspective(800px) rotateX(2deg) rotateY(-4deg) skewX(0.8deg)',
            'perspective(800px) rotateX(0deg) rotateY(0deg) skewX(0deg)'
          ],
          background: [
            'radial-gradient(ellipse 200% 100% at 30% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)',
            'radial-gradient(ellipse 180% 120% at 70% 30%, rgba(59,130,246,0.04) 0%, transparent 50%)',
            'radial-gradient(ellipse 220% 90% at 40% 70%, rgba(147,51,234,0.03) 0%, transparent 45%)',
            'radial-gradient(ellipse 160% 110% at 60% 25%, rgba(16,185,129,0.04) 0%, transparent 55%)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 微妙的内部光晕和折射 */}
      <motion.div
        className="absolute inset-1 rounded-2xl bg-gradient-to-br from-white/2 via-transparent to-cyan-400/1.5 opacity-0"
        animate={{
          opacity: [0, 0.4, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
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
        'relative overflow-hidden rounded-xl border',
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
        'bg-white/5 shadow-2xl shadow-black/10',
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
          "bg-white/5 shadow-2xl",
          "focus-within:border-white/25 focus-within:bg-white/6",
          "focus-within:shadow-[0_0_15px_rgba(59,130,246,0.08)]",
          "transition-all duration-500 ease-out",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:via-white/3 before:to-white/5 before:opacity-0 before:transition-opacity before:duration-300",
          "hover:before:opacity-50"
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
          style={{ fontSize: '16px' }}
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