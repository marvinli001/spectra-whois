export const easeOutExpo = [0.16, 1, 0.3, 1] as const

export const workbenchSpring = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.9,
} as const

export const controlSpring = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.55,
} as const

export const panelTransition = {
  duration: 0.42,
  ease: easeOutExpo,
} as const

export const panelVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(5px)" },
} as const

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.055,
    },
  },
} as const
