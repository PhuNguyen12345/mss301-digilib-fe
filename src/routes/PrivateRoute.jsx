import { Navigate } from 'react-router-dom'
import useAuthStore from '@/store/authSlice'

/**
 * Route guard that checks authentication and optional role requirements.
 *
 * @param {object}   props
 * @param {React.ReactNode} props.children - The protected page content
 * @param {string[]} [props.requiredRoles] - If provided, user must have at least one of these Keycloak roles
 */
function PrivateRoute({ children, requiredRoles }) {
  const { accessToken, roles, initialized } = useAuthStore()

  // Wait for auth initialization before making access decisions
  if (!initialized) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    )
  }

  // Not authenticated → redirect to login
  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  // Role check (if required)
  if (requiredRoles && requiredRoles.length > 0) {
    const hasAccess = requiredRoles.some((r) => roles.includes(r))
    if (!hasAccess) {
      return (
        <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-red-100 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-950">Không có quyền truy cập</h1>
            <p className="mt-3 text-sm text-slate-600">
              Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
            </p>
            <a
              href="/"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Về trang chủ
            </a>
          </div>
        </div>
      )
    }
  }

  return children
}

export default PrivateRoute
