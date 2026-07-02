import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

function VerifyEmail() {
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <header className="border-b border-slate-300 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link to="/" className="font-serif text-2xl font-bold text-slate-950">
            Readora
          </Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-12 sm:py-16">
        <section className="w-full max-w-[440px] border border-slate-300 bg-white px-8 py-12 sm:px-12">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold text-slate-950">Readora</h1>
            <div className="mx-auto mt-4 h-0.5 w-12 bg-slate-950" />
          </div>

          <div className="mt-10 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Mail className="h-8 w-8 text-slate-700" />
            </div>

            <h2 className="mt-6 font-serif text-2xl font-semibold text-slate-950">
              Xác minh email của bạn
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
              Chúng tôi đã gửi một liên kết xác minh đến email của bạn. Vui lòng kiểm tra hộp thư
              (bao gồm thư rác) và nhấp vào liên kết để kích hoạt tài khoản.
            </p>

            <Link
              to="/login"
              className="mt-8 flex h-12 w-full items-center justify-center bg-[#020b1b] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-slate-800"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default VerifyEmail
