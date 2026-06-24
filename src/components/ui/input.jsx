import { cn } from '@/lib/utils'

function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-sky-100',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
