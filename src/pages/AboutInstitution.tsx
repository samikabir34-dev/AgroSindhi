import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { User } from 'lucide-react';

const glassSection = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.09))',
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: '36px',
  boxShadow: '0 28px 90px rgba(0,0,0,0.42)',
  padding: 'clamp(22px, 4vw, 44px)',
} as React.CSSProperties;

const blueSection = {
  background: 'linear-gradient(135deg, rgba(85,230,255,0.25), rgba(141,124,255,0.18))',
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)',
  border: '1px solid rgba(85,230,255,0.30)',
  borderRadius: '36px',
  boxShadow: '0 28px 90px rgba(85,230,255,0.12)',
  padding: 'clamp(22px, 4vw, 44px)',
} as React.CSSProperties;

const AboutInstitution = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const timeline = [
    'خيال جي شروعات - 2016',
    'معزز وزير پاران اعلان - 2017',
    'عمارت جو بنياد - 2018',
    'اداري جو افتتاح - 2019',
    'منصوبن تي ڪم جي شروعات - 2020',
  ];

  const leaders = [
    {
      name: 'عبدڳلماجد ڀرڳڙي',
      title: 'لائف ٽائيم ڪو چيئرمين، سنڌي ڪمپيوٽنگ جو باني',
      image: '/abdul majid.png',
    },
    {
      name: 'سيد ذوالفقار علي شاھ',
      title: 'چيئرمين، ثقافت جو وزير، حڪومت سنڌ',
      image: '/zulfiqar alishah.jpg',
    },
    {
      name: 'خير محمد ڪلوڙ',
      title: 'ميمبر بورڊ، سيڪريٽري ڪلچر، حڪومت سنڌ',
      image: '/khair muhammad.jpg',
    },
  ];

  const functions = [
    'سنڌي ٻوليءَ لاءِ ڪمپيوٽيشنل لسانيات ۽ نيچرل لئنگئيج پروسيسنگ تي تحقيق ۽ ڊولپمينٽ.',
    'سنڌي يونيڪوڊ، فونٽس، ۽ ڪي بورڊ ليآئوٽ جي معياربندي ۽ بهتري.',
    'سنڌي اسپيل چيڪر، گرامر چيڪر ۽ ٻين لئنگئيج ٽولز جي تياري.',
    'مشين ٽرانسليشن، ٽيڪسٽ ٽو اسپيچ ۽ اسپيچ ٽو ٽيڪسٽ سسٽم تي ڪم.',
    'آپٽيڪل ڪيريڪٽر رڪگنيشن ذريعي پراڻن سنڌي ڪتابن کي ڊجيٽائيز ڪرڻ.',
    'سنڌي ڊجيٽل ڊڪشنري، ڪارپس ۽ لئنگئيج ڊيٽابيس جي تياري.',
    'آرٽيفيشل انٽيليجنس ۽ مشين لرننگ ذريعي سنڌي ٻوليءَ جي جديد ائپليڪيشنز ٺاهڻ.',
    'بين الاقوامي ٻولين سان سنڌي ٻوليءَ جي همراهي لاءِ تحقيقي ۽ تربيتي پروگرام.',
  ];

  return (
    <div
      className="min-h-screen relative overflow-x-hidden font-arabic"
      dir="rtl"
      style={{ background: 'radial-gradient(circle at 12% 14%, rgba(85,230,255,0.07) 0%, transparent 30%), linear-gradient(135deg, #071122, #0b1a3a)' }}
    >
      <Navbar hideSearchBar={true} hideActionButtons={true} />

      <main className="relative z-10 pb-16 px-3 sm:px-6" style={{ paddingTop: '100px' }}>
        <div className="max-w-[1220px] mx-auto space-y-6">

          {/* Hero */}
          <section className="text-center" style={glassSection}>
            <div
              className="inline-flex items-center gap-2 mb-5 px-5 py-2"
              style={{ border: '1px solid rgba(255,255,255,0.18)', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', color: 'rgba(185,203,224,1)' }}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              <span className="text-xs font-semibold uppercase tracking-widest">عبدالماجد ڀرڳڙي انسٽيٽيوٽ</span>
            </div>
            <h1
              className="font-black mb-4 bg-clip-text text-transparent"
              style={{
                fontSize: 'clamp(36px, 6vw, 72px)',
                backgroundImage: 'linear-gradient(90deg, #fff, #55e6ff, #fff)',
                lineHeight: 1.15,
              }}
            >
              اداري بابت
            </h1>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #55e6ff, #8d7cff)' }} />
          </section>

          {/* About card */}
          <section style={glassSection}>
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#55e6ff' }}>تعارف</span>
                <h2 className="font-black text-white mt-1" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>اداري بابت</h2>
              </div>
              <div className="w-12 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #55e6ff, #8d7cff)' }} />
            </div>
            <p className="leading-loose" style={{ fontSize: 'clamp(16px, 1.8vw, 19px)', color: 'rgba(185,203,224,1)', lineHeight: 2 }}>
              عبدالماجد ڀرڳڙي انسٽيٽيوٽ آف لئنگئيج انجنيئرنگ هڪ تاريخي ادارو آهي جيڪو
              ڪمپيوٽيشنل لسانيات ۽ نيچرل لئنگئيج پروسيسنگ ذريعي سنڌي ٻوليءَ کي جديد بنائڻ لاءِ وقف
              ٿيل آهي. هي ادارو ثقافت، سياحت، قديم آثارن ۽ آرڪائيوز کاتي، سنڌ حڪومت جي انتظامي
              اختيارن هيٺ قائم ڪيو ويو آهي.
            </p>
          </section>

          {/* Timeline */}
          <section style={blueSection}>
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">تاريخ</span>
                <h2 className="font-black text-white mt-1" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>اداري جي قيام جو سفر</h2>
              </div>
            </div>
            <ul className="space-y-3">
              {timeline.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white" style={{ fontSize: 'clamp(15px, 1.6vw, 18px)' }}>
                  <span className="w-2.5 h-2.5 rounded-full bg-white flex-shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Leadership */}
          <section style={glassSection}>
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#55e6ff' }}>ٽيم</span>
                <h2 className="font-black text-white mt-1" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>اداري جي قيادت</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {leaders.map((leader, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-6 transition-all hover:-translate-y-1"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: '26px',
                    boxShadow: '0 14px 34px rgba(0,0,0,0.15)',
                  }}
                >
                  <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-2 border-white/20 flex items-center justify-center bg-white/5">
                    {leader.image ? (
                      <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-white/30" />
                    )}
                  </div>
                  <h3 className="font-black text-white mb-2" style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}>{leader.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(185,203,224,1)' }}>{leader.title}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Building image */}
          <section style={{ borderRadius: '36px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 28px 90px rgba(0,0,0,0.42)' }}>
            <img src="/ambile-office.jpg" alt="Ambile Office" className="w-full object-cover" style={{ maxHeight: '420px' }} />
          </section>

          {/* History */}
          <section style={glassSection}>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#55e6ff' }}>پس منظر</span>
              <h2 className="font-black text-white mt-1" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>تاريخ</h2>
            </div>
            <p className="leading-loose text-justify" style={{ fontSize: 'clamp(16px, 1.8vw, 19px)', color: 'rgba(185,203,224,1)', lineHeight: 2 }}>
              عبدالماجد ڀرڳڙي انسٽيٽيوٽ آف لئنگئيج انجنيئرنگ جو بنياد 2018ع ۾ رکيو ويو ۽ 2019ع ۾
              باضابطه طور تي افتتاح ٿيو. هي ادارو سنڌ حڪومت جي ثقافت، سياحت، قديم آثار ۽ آرڪائيوز
              کاتي جي زير انتظام قائم ڪيو ويو، جنهن جو بنيادي مقصد سنڌي ٻوليءَ کي ڊجيٽل دور سان ھمڪنار ڪرڻ آھي.
            </p>
          </section>

          {/* Functions */}
          <section style={glassSection}>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#55e6ff' }}>ڪردار</span>
              <h2 className="font-black text-white mt-1" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>اداري جا ڪم</h2>
            </div>
            <ul className="space-y-4">
              {functions.map((fn, i) => (
                <li key={i} className="flex items-start gap-3" style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', color: 'rgba(185,203,224,1)' }}>
                  <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#55e6ff', boxShadow: '0 0 8px rgba(85,230,255,0.6)' }} />
                  <span className="leading-relaxed">{fn}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Mission */}
          <section style={glassSection}>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8d7cff' }}>مقصد</span>
              <h2 className="font-black text-white mt-1" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>اسان جو مشن</h2>
            </div>
            <p className="leading-loose text-justify" style={{ fontSize: 'clamp(16px, 1.8vw, 19px)', color: 'rgba(185,203,224,1)', lineHeight: 2 }}>
              اسان جو مشن آهي ته سنڌي ٻوليءَ کي ڪمپيوٽيشنل لسانيات ۽ نيچرل لئنگئيج پروسيسنگ ذريعي
              جديد دور جي تقاضائن مطابق ترقي ڏيون.
            </p>
          </section>

          {/* Vision */}
          <section style={blueSection}>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">آئيندو</span>
              <h2 className="font-black text-white mt-1" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>اسان جو وژن</h2>
            </div>
            <p className="leading-loose text-justify" style={{ fontSize: 'clamp(16px, 1.8vw, 19px)', color: 'rgba(255,255,255,0.85)', lineHeight: 2 }}>
              اسان جو وژن آهي ته سنڌي ٻولي ڊجيٽل دنيا ۾ پنهنجي پوري طاقت سان موجود رهي ۽ هر سنڌي
              ماڻهو پنهنجي مادري ٻوليءَ ۾ جديد ٽيڪنالوجي مان فائدو وٺي سگهي.
            </p>
          </section>

          {/* Accreditation */}
          <section className="text-center" style={glassSection}>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ffd166' }}>سرٽيفيڪيشن</span>
              <h2 className="font-black text-white mt-1" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>منظوري ۽ ايڪريڊيٽيشن</h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-5 mb-6">
              {['/ci_iaf_mark.png', '/ci_img_log.png', '/ci_ias_mark.png'].map((src, i) => (
                <div
                  key={i}
                  className="w-28 h-28 flex items-center justify-center p-3 transition-all hover:-translate-y-1"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '20px' }}
                >
                  <img src={src} alt="Accreditation" className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 'clamp(14px, 1.5vw, 16px)', color: 'rgba(185,203,224,1)' }}>
              عبدالماجد ڀرڳڙي انسٽيٽيوٽ آف لئنگئيج انجنيئرنگ مختلف بين الاقوامي ادارن کان منظور ٿيل آهي.
            </p>
          </section>

          {/* Video */}
          <section style={glassSection}>
            <div className="mb-6 text-center">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#55e6ff' }}>ويڊيو</span>
                <h2 className="font-black text-white mt-1" style={{ fontSize: 'clamp(20px, 2.5vw, 28px)' }}>
                اداري کي ڄاڻو | <span className="brand-name">سنڌاڳڙو</span> آرٽيفيشل انٽيليجنس پليٽ فارم
              </h2>
            </div>
            <div className="w-full aspect-video overflow-hidden relative shadow-2xl" style={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <iframe
                width="100%" height="100%"
                src="https://www.youtube.com/embed/z24CbP3SNRw?si=Fo6azoWDsxmzYoQt"
                title="Discover the Abdul Majid Bhurgri Institute"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default AboutInstitution;