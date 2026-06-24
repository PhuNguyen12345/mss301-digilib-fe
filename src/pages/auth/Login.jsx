function Login() {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <header className="border-b border-slate-300 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <a href="/" className="font-serif text-2xl font-bold text-slate-950">
            Readora
          </a>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-12 sm:py-16">
        <section className="w-full max-w-[440px] border border-slate-300 bg-white px-8 py-12 sm:px-12">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold text-slate-950">Readora</h1>
            <div className="mx-auto mt-4 h-0.5 w-12 bg-slate-950" />
            <h2 className="mt-8 font-serif text-3xl font-semibold text-slate-950">
              Chào mừng trở lại
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Hệ thống lưu trữ và quản lý học thuật chuyên sâu.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="text-sm font-bold tracking-wide text-slate-900">
                Email sinh viên / giảng viên
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="example@university.edu.vn"
                className="mt-2 h-11 w-full border border-slate-400 bg-slate-50 px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-slate-950 focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="password" className="text-sm font-bold tracking-wide text-slate-900">
                  Mật khẩu
                </label>
                <a href="#" className="text-sm font-bold text-slate-950 underline-offset-4 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-2 h-11 w-full border border-slate-400 bg-slate-50 px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-slate-950 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="h-12 w-full bg-[#020b1b] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-slate-800"
            >
              Đăng nhập
            </button>
          </form>

          <div className="my-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-300" />
            <span className="text-sm text-slate-600">HOẶC</span>
            <div className="h-px flex-1 bg-slate-300" />
          </div>

          <button
            type="button"
            className="flex h-16 w-full items-center justify-center gap-4 border border-slate-300 bg-white text-sm font-bold uppercase tracking-wide text-slate-950 transition hover:bg-slate-50"
          >
            <span className="grid h-8 w-10 place-items-center bg-slate-50 text-lg font-bold text-blue-500">
              G
            </span>
            Đăng nhập với Google
          </button>

          <p className="mx-auto mt-9 max-w-xs text-center text-sm leading-6 text-slate-600">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="#" className="text-slate-950 underline">
              Quy định sử dụng
            </a>{' '}
            của thư viện.
          </p>
        </section>
      </main>
    </div>
  )
}

export default Login
