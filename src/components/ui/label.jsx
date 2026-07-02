import { cn } from '@/lib/utils'

function Label({ className, children, ...props }) {
  return (
    <div className="relative">
      <label className={cn('text-sm font-medium text-slate-700', className)} {...props}>
        {children}
      </label>
    </div>
  )
}

export { Label }
