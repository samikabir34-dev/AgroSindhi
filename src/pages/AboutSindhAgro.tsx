import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Satellite, Sprout, Droplets, CloudSun, BarChart3, ShieldCheck } from 'lucide-react';

const glassSection: React.CSSProperties = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.09))',
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: '36px',
  boxShadow: '0 28px 90px rgba(0,0,0,0.42)',
  padding: 'clamp(22px, 4vw, 44px)',
};

const AboutSindhAgro = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    { title: 'سيٽلائيٽ نگراني', icon: Satellite, desc: 'جديد سيٽلائيٽ ٽيڪنالاجي ذريعي هر هفتي پنهنجي فصلن جي نگراني ڪريو.', color: '#55e6ff' },
    { title: 'ٻوٽن جي صحت (NDVI)', icon: Sprout, desc: 'فصل جي صحت جو جائزو وٺو ۽ اڳواٽ بيمارين جي سڃاڻپ ڪريو.', color: '#34d399' },
    { title: 'پاڻي جي ضرورت', icon: Droplets, desc: 'زمين جي گهم ۽ پاڻي جي ضرورت جو صحيح اندازو لڳايو.', color: '#22d3ee' },
    { title: 'موسم جي اڳڪٿي', icon: CloudSun, desc: 'مقامي سطح تي موسم جي صحيح صورتحال ۽ ايمرجنسي الرٽس حاصل ڪريو.', color: '#818cf8' },
    { title: 'مارڪيٽ تجزيو', icon: BarChart3, desc: 'فصلن جي قيمتن ۽ مارڪيٽ جي رجحانن بابت جديد معلومات.', color: '#fbbf24' },
    { title: 'محفوظ ڊيٽا', icon: ShieldCheck, desc: 'توهان جي زمين ۽ فصلن جو رڪارڊ مڪمل طور محفوظ ۽ خانگي.', color: '#f472b6' },
  ];

  return (
    <div
      className="min-h-screen relative overflow-x-hidden font-arabic"
      dir="rtl"
      style={{ background: 'radial-gradient(circle at 12% 14%, rgba(85,230,255,0.07) 0%, transparent 30%), linear-gradient(135deg, #071122, #0b1a3a)' }}
    >
      <Navbar hideSearchBar={true} hideActionButtons={true} />

      <main className="relative z-10 pb-20 px-3 sm:px-6" style={{ paddingTop: '100px' }}>
        <div className="max-w-[1220px] mx-auto space-y-6">

          {/* Hero */}
          <section style={glassSection} className="text-center">
            <div
              className="inline-flex items-center gap-2 mb-5 px-5 py-2"
              style={{ border: '1px solid rgba(255,255,255,0.18)', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', color: 'rgba(185,203,224,1)' }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
              <span className="text-xs font-semibold uppercase tracking-widest">سنڌ جي زراعت لاءِ جديد ڊجيٽل ساٿي</span>
            </div>
            <h1 className="font-black mb-4 bg-clip-text text-transparent" style={{ fontSize: 'clamp(48px, 7vw, 82px)', lineHeight: 1.1 }}>
              <span className="brand-name">سنڌاڳڙو</span>
            </h1>
            <p style={{ fontSize: 'clamp(16px, 2vw, 22px)', color: 'rgba(185,203,224,1)', lineHeight: 2, maxWidth: '760px', margin: '0 auto 24px' }}>
              جديد زرعي پليٽ فارم جيڪو سنڌ جي هارين کي سيٽلائيٽ ڊيٽا، آرٽيفيشل انٽيليجنس، ۽ جديد ٽيڪنالاجي ذريعي بااختيار بڻائي ٿو.
            </p>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #55e6ff, #8d7cff)' }} />
          </section>

          {/* Features Grid */}
          <section style={glassSection}>
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#55e6ff' }}>خدمتون</span>
                <h2 className="font-black text-white mt-1" style={{ fontSize: 'clamp(24px, 3vw, 38px)' }}>اسان جون سهولتون</h2>
              </div>
              <div className="hidden sm:block w-16 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #55e6ff, #8d7cff)' }} />
            </div>
            <p className="mb-8" style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', color: 'rgba(185,203,224,1)', lineHeight: 1.9 }}>
              جديد ٽيڪنالاجي سان هارين کي وڌيڪ پيداوار ۽ بهتر فيصلا ڪرڻ ۾ مدد.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="group p-6 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '26px',
                    boxShadow: '0 14px 34px rgba(0,0,0,0.10)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${feature.color}44`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${feature.color}22`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.10)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 14px 34px rgba(0,0,0,0.10)';
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110"
                    style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}33` }}
                  >
                    <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-black text-white mb-3" style={{ fontSize: 'clamp(17px, 1.8vw, 22px)' }}>{feature.title}</h3>
                  <p style={{ color: 'rgba(185,203,224,1)', fontSize: '15px', lineHeight: 1.8 }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Mission */}
          <section
            className="text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(85,230,255,0.15), rgba(141,124,255,0.12))',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              border: '1px solid rgba(85,230,255,0.25)',
              borderRadius: '36px',
              boxShadow: '0 28px 90px rgba(85,230,255,0.10)',
              padding: 'clamp(32px, 5vw, 60px)',
            }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #55e6ff, transparent)' }} />

            <div
              className="inline-flex items-center gap-2 mb-5 px-5 py-2"
              style={{ border: '1px solid rgba(255,255,255,0.20)', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', color: 'rgba(185,203,224,1)' }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: '#8d7cff', boxShadow: '0 0 8px rgba(141,124,255,0.8)' }} />
              <span className="text-xs font-semibold uppercase tracking-widest">اسان جو مقصد</span>
            </div>

            <h2 className="font-black text-white mb-6" style={{ fontSize: 'clamp(26px, 3.5vw, 44px)' }}>اسان جو مقصد</h2>
            <p style={{ fontSize: 'clamp(17px, 2vw, 22px)', color: 'rgba(255,255,255,0.82)', lineHeight: 2, maxWidth: '800px', margin: '0 auto' }}>
              "اسان جو مقصد سنڌ جي زراعت کي ڊجيٽلائيز ڪرڻ آهي ته جيئن هاري گهٽ خرچ تي وڌيڪ پيداوار حاصل ڪري سگهن، جديد ٽيڪنالاجي مان فائدو وٺي سگهن، ۽ سنڌ جي معيشت کي وڌيڪ مضبوط بڻائي سگهن."
            </p>
          </section>

        </div>
      </main>
    </div>
  );
};

export default AboutSindhAgro;