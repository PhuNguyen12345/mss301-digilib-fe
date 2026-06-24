import { cn } from '@/lib/utils'

const variants = {
  default:
    'bg-slate-950 text-white shadow-sm hover:bg-slate-800',
  secondary:
    'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950',
  accent:
    'bg-amber-500 text-slate-950 shadow-sm hover:bg-amber-400',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
  xl: 'h-12 px-6 text-sm',
  icon: 'h-10 w-10',
}

function Button({
  className,
  variant = 'default',
  size = 'md',
  asChild = false,
  ...props
}) {
  const Component = asChild ? 'span' : 'button'

  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export { Button }
