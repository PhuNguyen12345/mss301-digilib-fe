import { Eye, GraduationCap, Lightbulb, Mail, MapPin, Phone, ShieldCheck, SquareLibrary } from 'lucide-react'
import heroImage from '@/assets/about-library-hero.png'
import leadersImage from '@/assets/about-leaders.png'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

const missionCards = [
  {
    icon: SquareLibrary,
    title: 'Sứ mệnh',
    description:
      'Readora cam kết thúc đẩy sự xuất sắc trong nghiên cứu và học tập bằng cách cung cấp quyền truy cập không giới hạn vào các nguồn tài liệu học thuật chất lượng cao. Chúng tôi nỗ lực bảo tồn và lan tỏa tri thức dưới định dạng kỹ thuật số bền vững cho thế hệ mai sau.',
  },
  {
    icon: Eye,
    title: 'Tầm nhìn',
    description:
      'Trở thành thư viện số hàng đầu khu vực, là trung tâm hội tụ của cộng đồng học thuật toàn cầu. Chúng tôi hướng tới việc tích hợp trí tuệ nhân tạo để cá nhân hóa hành trình khám phá kiến thức, biến Readora thành một thực thể số thông minh và không ngừng phát triển.',
  },
]

const coreValues = [
  { icon: ShieldCheck, title: 'Tin cậy', description: 'Thông tin được xác thực bởi các chuyên gia hàng đầu và các tổ chức học thuật uy tín thế giới.' },
  { icon: Lightbulb, title: 'Đổi mới', description: 'Tiên phong ứng dụng công nghệ hiện đại vào quản trị dữ liệu và trải nghiệm người dùng.' },
  { icon: GraduationCap, title: 'Học thuật', description: 'Tôn trọng sự liêm chính và các tiêu chuẩn khắt khe trong nghiên cứu khoa học.' },
]

const leaders = [
  { name: 'GS.TS. Đặng Minh Quân', role: 'Giám đốc điều hành', position: '12% center' },
  { name: 'PGS.TS. Lê Thùy Chi', role: 'Giám đốc học thuật', position: '37% center' },
  { name: 'ThS. Nguyễn Hoàng Nam', role: 'Giám đốc công nghệ', position: '63% center' },
  { name: 'Bà Trần Minh Anh', role: 'Trưởng bộ phận lưu trữ', position: '88% center' },
]

function AboutUs() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Header />

      <main>
        <section className="relative min-h-[240px] overflow-hidden px-4 text-center sm:px-6 lg:px-8">
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/75 to-white" />
          <div className="relative mx-auto flex min-h-[240px] max-w-3xl flex-col items-center justify-center pb-5">
            <h1 className="font-serif text-[30px] font-semibold tracking-tight sm:text-[34px]">Về Readora</h1>
            <p className="mt-3 max-w-2xl text-[14px] font-medium leading-7 text-slate-600">
              Kiến tạo cầu nối tri thức, nâng tầm giá trị học thuật thông qua giải pháp
              lưu trữ số hiện đại và bảo tồn di sản trí tuệ nhân loại.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-8 pt-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {missionCards.map((card) => {
            const Icon = card.icon
            return (
              <article key={card.title} className="rounded-md border border-slate-300 bg-white p-5">
                <Icon size={26} className="text-slate-950" />
                <h2 className="mt-4 font-serif text-[24px] font-semibold tracking-tight">{card.title}</h2>
                <p className="mt-3 text-[13px] leading-6 text-slate-600">{card.description}</p>
              </article>
            )
          })}
        </section>

        <section className="bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="font-serif text-[26px] font-semibold tracking-tight">Giá trị cốt lõi</h2>
              <span className="mx-auto mt-3 block h-1 w-14 bg-[#817000]" />
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {coreValues.map((value) => {
                const Icon = value.icon
                return (
                  <article key={value.title} className="rounded-sm border border-slate-300 bg-white px-5 py-5 text-center">
                    <span className="mx-auto grid h-11 w-11 place-items-center rounded-md bg-[#082b51] text-white">
                      <Icon size={18} />
                    </span>
                    <h3 className="mt-3 font-serif text-lg font-semibold">{value.title}</h3>
                    <p className="mx-auto mt-2.5 max-w-xs text-[13px] leading-6 text-slate-600">{value.description}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <h2 className="font-serif text-[26px] font-semibold tracking-tight">Đội ngũ lãnh đạo</h2>
            <p className="mt-2 text-[14px] text-slate-600">Những người dẫn dắt sứ mệnh nâng tầm tri thức tại Readora.</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((leader) => (
              <article key={leader.name}>
                <div className="h-56 overflow-hidden rounded-sm border border-slate-300 bg-slate-100">
                  <img src={leadersImage} alt={leader.name} className="h-full w-full object-cover" style={{ objectPosition: leader.position }} />
                </div>
                <h3 className="mt-3 font-serif text-lg font-semibold leading-7">{leader.name}</h3>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-[#817000]">{leader.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#082b51] px-4 py-10 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.88fr] lg:items-center">
            <div>
              <h2 className="font-serif text-[26px] font-semibold tracking-tight">Liên hệ Hỗ trợ Nghiên cứu</h2>
              <p className="mt-3 max-w-lg text-[13px] leading-6 text-blue-100/75">
                Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn trong việc tìm kiếm tài liệu và tối ưu hóa quy trình nghiên cứu.
              </p>

              <div className="mt-5 space-y-2.5 text-[13px] text-blue-50">
                <p className="flex items-center gap-2.5"><Mail size={16} />research@readora.edu.vn</p>
                <p className="flex items-center gap-2.5"><Phone size={16} />+84 (024) 1234 5678</p>
                <p className="flex items-center gap-2.5"><MapPin size={16} />Tầng 4, Tòa nhà Tri thức, 123 Đường Học Thuật, Hà Nội</p>
              </div>
            </div>

            <form className="rounded-md border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <h3 className="font-serif text-lg font-semibold">Yêu cầu hỗ trợ trực tiếp</h3>
              <div className="mt-4 space-y-3">
                <input className="h-10 w-full rounded-sm border border-white/15 bg-white/10 px-3.5 text-sm text-white outline-none placeholder:text-blue-100/50" placeholder="Họ và tên" />
                <input className="h-10 w-full rounded-sm border border-white/15 bg-white/10 px-3.5 text-sm text-white outline-none placeholder:text-blue-100/50" placeholder="Email học thuật" />
                <textarea className="min-h-24 w-full resize-none rounded-sm border border-white/15 bg-white/10 px-3.5 py-3 text-sm text-white outline-none placeholder:text-blue-100/50" placeholder="Nội dung yêu cầu nghiên cứu..." />
                <button className="h-10 w-full rounded-sm bg-[#817000] text-[13px] font-semibold text-white transition hover:bg-[#6e6000]">Gửi yêu cầu</button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AboutUs
