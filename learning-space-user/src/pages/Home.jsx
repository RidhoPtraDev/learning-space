import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImg from '../assets/logo.png'
import heroImg from '../assets/hero.png'
import aboutImg from '../assets/about.png'
import layanan1 from '../assets/layanan1.png'
import layanan2 from '../assets/layanan2.png'
import layanan3 from '../assets/layanan3.png'

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.12 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, delay = 0, direction = 'up' }) {
  const [ref, visible] = useReveal()
  const t = { up: 'translateY(40px)', down: 'translateY(-40px)', left: 'translateX(-40px)', right: 'translateX(40px)' }
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : t[direction], transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  )
}

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const W = { width: '100%', padding: '0 40px' }

export default function Home() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [navScrolled, setNavScrolled] = useState(false)
  const [activeNav, setActiveNav] = useState('home')

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const ids = ['home','about','services','contact']
    const fn = () => {
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 100) { setActiveNav(id); break }
      }
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navLinks = [
    { label: 'Home',       id: 'home' },
    { label: 'About Us',   id: 'about' },
    { label: 'Services',   id: 'services' },
    { label: 'Contact Us', id: 'contact' },
  ]

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{ backgroundColor: '#0066FF', boxShadow: navScrolled ? '0 4px 24px rgba(0,0,50,0.25)' : 'none', position: 'sticky', top: 0, zIndex: 999, transition: 'box-shadow 0.3s' }}>
        <div style={{ ...W, display: 'flex', alignItems: 'center', height: 64 }}>
          <div style={{ cursor: 'pointer', marginRight: 'auto', display: 'flex', alignItems: 'center' }} onClick={() => scrollTo('home')}>
            <img src={logoImg} alt="LearningSpace" style={{ height: 36, objectFit: 'contain' }}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
            <span style={{ display: 'none', fontWeight: 800, fontSize: '1.3rem', color: '#fff' }}>
              Learning<span style={{ borderBottom: '3px solid #FFD93D' }}>Space</span>
            </span>
          </div>
          <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: 4 }}>
            {navLinks.map(link => (
              <li key={link.id}>
                <button onClick={() => scrollTo(link.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', padding: '8px 16px', borderRadius: 8, fontWeight: activeNav === link.id ? 700 : 400, color: '#fff', opacity: activeNav === link.id ? 1 : 0.82, position: 'relative' }}>
                  {link.label}
                  {activeNav === link.id && <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 20, height: 3, backgroundColor: '#FFD93D', borderRadius: 2 }} />}
                </button>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: 10, marginLeft: 24 }}>
            <button onClick={() => navigate('/login')} style={{ padding: '8px 22px', border: '1.5px solid #fff', borderRadius: 8, backgroundColor: 'transparent', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >Masuk</button>
            <button onClick={() => navigate('/register')} style={{ padding: '8px 22px', border: 'none', borderRadius: 8, backgroundColor: '#fff', color: '#0066FF', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', transition: 'transform 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >Daftar</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{ backgroundColor: '#ffffff', minHeight: '88vh', display: 'flex', alignItems: 'center', padding: '60px 0' }}>
        <div style={{ ...W, display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <Reveal>
              <div style={{ display: 'inline-block', backgroundColor: '#EBF2FF', color: '#0066FF', borderRadius: 20, padding: '6px 16px', fontSize: '0.8rem', fontWeight: 600, marginBottom: 16 }}>
                🎓 Platform Belajar Online Terbaik
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, color: '#111', marginBottom: 16 }}>
                Belajar Lebih Cerdas,<br />
                <span style={{ color: '#0066FF' }}>Tumbuh</span> Lebih Cepat
              </h1>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.8, marginBottom: 32, maxWidth: 440 }}>
                Akses kursus online berkualitas yang dirancang untuk membantu kamu mengembangkan skill secara efektif dan fleksibel.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/register')} style={{ padding: '13px 36px', backgroundColor: '#0066FF', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", boxShadow: '0 8px 24px rgba(0,102,255,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,102,255,0.45)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,102,255,0.35)' }}
                >Mulai</button>
                <button onClick={() => scrollTo('about')} style={{ padding: '13px 28px', backgroundColor: 'transparent', color: '#0066FF', border: '1.5px solid #0066FF', borderRadius: 12, fontWeight: 600, fontSize: '1rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f6ff'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >Pelajari Lebih →</button>
              </div>
              <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
                {[['500+','Materi'],['1k+','Pengguna'],['6','Mata Pelajaran']].map(([v,l]) => (
                  <div key={l}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0066FF', margin: 0 }}>{v}</p>
                    <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>{l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div style={{ flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' }}>
            <Reveal direction="right">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ position: 'absolute', bottom: -20, right: -20, width: 180, height: 180, borderRadius: '50%', backgroundColor: '#FFD93D', zIndex: 0, animation: 'float 5s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', top: -10, left: -10, width: 80, height: 80, borderRadius: '50%', backgroundColor: '#EBF2FF', zIndex: 0 }} />
                <img src={heroImg} alt="Hero" style={{ width: '100%', maxWidth: 420, borderRadius: '50%', objectFit: 'cover', aspectRatio: '1/1', position: 'relative', zIndex: 1, boxShadow: '0 20px 60px rgba(0,102,255,0.15)' }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── APA YANG BISA DIPELAJARI ── */}
      <section style={{ backgroundColor: '#0066FF', padding: '70px 0 90px', borderRadius: '0 0 80px 0' }}>
        <div style={{ ...W }}>
          <Reveal>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#fff', marginBottom: 48 }}>
              Apa yang Bisa Kamu <span style={{ textDecoration: 'underline', textDecorationColor: '#FFD93D' }}>Pelajari?</span>
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
            {[
              { icon: '📖', title: 'Baca Materi & Jurnal', desc: 'Akses berbagai materi dan jurnal pilihan untuk memperdalam pemahamanmu secara terstruktur.' },
              { icon: '🎬', title: 'Video Pembelajaran',   desc: 'Pelajari konsep dengan lebih mudah melalui video yang bisa diakses kapan saja.' },
              { icon: '💻', title: 'Kelas Zoom Meeting',   desc: 'Bergabung dalam pembelajaran melalui Zoom untuk mendapat pengalaman belajar yang lebih interaktif.' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 120}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: '28px 24px', height: '100%', transition: 'transform 0.25s, box-shadow 0.25s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>{item.icon}</div>
                  <h6 style={{ color: '#111', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 8 }}>{item.title}</h6>
                  <p style={{ color: '#555', fontSize: '0.9rem', margin: 0, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TENTANG KAMI ── */}
      <section id="about" style={{ backgroundColor: '#ffffff', padding: '90px 0' }}>
        <div style={{ ...W, display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
          <Reveal direction="left">
            <div style={{ flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ position: 'absolute', top: -15, left: -15, width: 160, height: 160, borderRadius: '50%', backgroundColor: '#FFD93D', zIndex: 0, animation: 'float 6s ease-in-out infinite' }} />
                <img src={aboutImg} alt="Tentang Kami" style={{ width: '100%', maxWidth: 380, borderRadius: '50%', objectFit: 'cover', aspectRatio: '1/1', position: 'relative', zIndex: 1, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }} />
              </div>
            </div>
          </Reveal>
          <div style={{ flex: 1, minWidth: 280 }}>
            <Reveal direction="right" delay={100}>
              <p style={{ color: '#0066FF', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Tentang Kami</p>
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#111', marginBottom: 20 }}>Platform Belajar Digital <span style={{ color: '#0066FF' }}>Terpercaya</span></h2>
              <p style={{ color: '#555', lineHeight: 1.8, marginBottom: 12 }}>Kami adalah platform pembelajaran digital yang berkomitmen untuk menyediakan akses pendidikan berkualitas bagi siapa saja, di mana saja.</p>
              <p style={{ color: '#555', lineHeight: 1.8, marginBottom: 28 }}>Dengan berbagai materi yang dirancang secara sistematis, kami membantu pengguna mengembangkan keterampilan yang relevan. Melalui kombinasi materi bacaan, video interaktif, serta latihan terstruktur, kami menghadirkan pengalaman belajar yang fleksibel, efektif, dan mudah diakses.</p>
              <button onClick={() => navigate('/register')} style={{ padding: '12px 28px', backgroundColor: '#0066FF', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,102,255,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >Pelajari Lebih Lanjut</button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── LAYANAN KAMI ── */}
      <section id="services" style={{ backgroundColor: '#0066FF', padding: '70px 0 80px' }}>
        <div style={{ ...W }}>
          <Reveal>
            <div style={{ textAlign: 'right', marginBottom: 40 }}>
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#fff' }}>
                <span style={{ textDecoration: 'underline', textDecorationColor: '#FFD93D' }}>Layanan Kami</span>
              </h2>
              <p style={{ color: '#cce0ff', maxWidth: 380, marginLeft: 'auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Nikmati berbagai layanan pembelajaran yang dirancang untuk membantu kamu memahami materi dengan lebih efektif, fleksibel, dan terarah.
              </p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {[
              { img: layanan1, title: 'Baca Materi & Jurnal' },
              { img: layanan2, title: 'Video Pembelajaran' },
              { img: layanan3, title: 'Zoom Meeting' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 120}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  <div style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, color: '#111', fontSize: '0.95rem', marginBottom: 10 }}>{item.title}</p>
                    <button onClick={() => navigate('/register')} style={{ border: '1.5px solid #0066FF', color: '#0066FF', backgroundColor: 'transparent', borderRadius: 20, fontSize: '0.8rem', padding: '5px 20px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontWeight: 500, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0066FF'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0066FF' }}
                    >Lihat Lebih Lanjut</button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONI ── */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 0' }}>
        <div style={{ ...W }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2rem)', color: '#111', marginBottom: 8 }}>Testimoni Kami</h2>
              <p style={{ color: '#555' }}>Apa Kata Pengguna <span style={{ color: '#0066FF', textDecoration: 'underline' }}>Kami?</span></p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, maxWidth: 860, margin: '0 auto' }}>
            {[
              { quote: 'Platform ini sangat membantu saya dalam memahami materi dengan lebih mudah. Video pembelajarannya jelas dan materinya tersusun rapi, jadi saya bisa belajar kapan saja tanpa kesulitan.', name: 'Siti Rahmawati', role: 'Mahasiswa' },
              { quote: 'Fitur latihan dan kelas interaktifnya membuat saya lebih paham dibanding belajar sendiri. Saya jadi lebih percaya diri dalam menguasai materi yang sebelumnya terasa sulit.', name: 'Andi Pratama', role: 'Pelajar' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 150}>
                <div style={{ backgroundColor: '#0066FF', borderRadius: 16, padding: '28px 24px', transition: 'transform 0.25s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ fontSize: '2.5rem', color: '#FFD93D', lineHeight: 1, marginBottom: 12 }}>"</div>
                  <p style={{ color: '#fff', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 16 }}>{item.quote}</p>
                  <p style={{ color: '#FFD93D', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{item.name}</p>
                  <p style={{ color: '#cce0ff', fontSize: '0.8rem', margin: 0 }}>{item.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" style={{ backgroundColor: '#f5f7ff', padding: '70px 0' }}>
        <div style={{ ...W, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Reveal>
            <h3 style={{ fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,1.8rem)', color: '#111', marginBottom: 12 }}>Siap untuk Mulai Belajar?</h3>
            <p style={{ color: '#555', marginBottom: 28, fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 500 }}>
              Daftarkan emailmu dan mulai akses berbagai materi pembelajaran untuk mengembangkan skill kapan saja dan di mana saja.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <input type="email" placeholder="MASUKKAN EMAIL KAMU" value={email} onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, minWidth: 220, maxWidth: 300, padding: '12px 20px', border: '1.5px solid #0066FF', borderRadius: 10, textAlign: 'center', fontSize: '0.85rem', outline: 'none', fontFamily: "'Poppins', sans-serif" }} />
              <button onClick={() => navigate('/register')} style={{ padding: '12px 28px', backgroundColor: '#0066FF', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,102,255,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
              >MULAI SEKARANG</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: '#0a1628', padding: '32px 24px' }}>
        <div style={{ ...W, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { href: 'https://instagram.com', label: '@learn.space', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
              { href: 'https://facebook.com', label: 'LearnSpace', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
              { href: 'https://x.com', label: '@LearnSpace', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#aaa', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#aaa'}
              >{s.icon}{s.label}</a>
            ))}
          </div>
          <p style={{ color: '#555', fontSize: '0.75rem', margin: 0 }}>© 2026 LearningSpace. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  )
}
