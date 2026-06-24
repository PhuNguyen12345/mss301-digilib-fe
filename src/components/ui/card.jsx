import { cn } from '@/lib/utils'

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return <div className={cn('p-6', className)} {...props} />
}

export { Card, CardContent }
