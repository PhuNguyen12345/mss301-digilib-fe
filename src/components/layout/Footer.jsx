import { AtSign, Globe2, Mail, MapPin, Medal } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-[#020b1b] text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 font-sans sm:px-6 md:grid-cols-[1.35fr_0.75fr_0.75fr_1fr] lg:px-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">Readora</h2>
          <p className="mt-4 max-w-sm text-[13px] leading-6 text-slate-400">
            Hệ thống quản lý thư viện số hiện đại, nâng tầm tri thức và thúc đẩy nghiên cứu
            khoa học trong môi trường học thuật chuyên nghiệp.
          </p>
          <div className="mt-5 space-y-2.5 text-[13px]">
            <p className="flex items-center gap-2.5">
              <Mail size={16} className="text-amber-300" />
              support@readora.edu.vn
            </p>
            <p className="flex items-center gap-2.5">
              <MapPin size={16} className="text-amber-300" />
              Thạch Thất, Hà Nội
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">Liên kết nhanh</h3>
          <ul className="mt-4 space-y-3 text-[13px] text-slate-400">
            <li><a href="/about" className="hover:text-white">Về chúng tôi</a></li>
            <li><a href="#contact" className="hover:text-white">Liên hệ</a></li>
            <li><a href="#support" className="hover:text-white">Hỗ trợ nghiên cứu</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">Pháp lý</h3>
          <ul className="mt-4 space-y-3 text-[13px] text-slate-400">
            <li><a href="#study" className="hover:text-white">Không gian học tập</a></li>
            <li><a href="#privacy" className="hover:text-white">Chính sách bảo mật</a></li>
          </ul>
        </div>

        <div className="md:text-right">
          <p className="text-[13px] text-slate-500">© 2026 Readora. Tất cả quyền được bảo lưu.</p>
          <div className="mt-5 flex gap-3 md:justify-end">
            {[Medal, AtSign, Globe2].map((Icon, index) => (
              <a
                key={index}
                href="#social"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white transition hover:border-amber-300 hover:text-amber-300"
                aria-label="Mạng xã hội"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
