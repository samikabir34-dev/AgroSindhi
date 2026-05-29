import React from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Github, Twitter, Linkedin, Github as GithubIcon, Code2, Palette, Database, Globe } from 'lucide-react';
import { useEffect } from 'react';

const Team = () => {
  const { isRTL } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const team = [
    {
      name: 'عادل نظر',
      role: 'ليڊ ڊولپر ۽ آرڪيٽيڪٽ',
      image: 'Adil.png',
      links: { github: '', twitter: '#', linkedin: '#' },
      specialty: 'Lead Developer',
      icon: Code2
    },
    {
      name: 'جيئل خان',
      role: 'يو آءِ ۽ يو ايڪس ڊزائين',
      image: 'Jial.jpg',
      links: { github: '#', twitter: '#', linkedin: '#' },
      specialty: 'UI/UX Design',
      icon: Globe
    },
    {
      name: 'نويد احمد پتافي',
      role: 'يوزر ريسرچ اينڊ ٽيسٽنگ',
      image: 'naveed.jpg',
      links: { github: '#', twitter: '#', linkedin: '#' },
      specialty: 'User Research',
      icon: Database
    }
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden font-arabic" dir="rtl">
      <Navbar hideSearchBar={true} hideActionButtons={true} />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-[1220px] mx-auto">
          {/* Header Section */}
          <div className="text-center mb-24 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="brand-name">سنڌاڳڙو</span> سٿ
            </h1>
            <p className="text-xl text-white/60 max-w-[1220px] mx-auto leading-relaxed font-medium">
              ملاقات ڪريو ان باصلاحيت سٿ سان جيڪو سنڌ جي زراعت ۾ انقلابي تبديليون آڻڻ لاءِ ڪوشان آهي.
            </p>
            <div className="mt-8 w-24 h-1.5 bg-gradient-to-r from-[#55e6ff] to-[#8d7cff] mx-auto rounded-full shadow-[0_0_20px_rgba(85,230,255,0.4)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center"
              >
                {/* Member Card */}
                <div className="w-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-3xl rounded-[3rem] p-10 pt-24 text-center hover:bg-white/[0.05] hover:border-[#55e6ff]/30 transition-all duration-500 relative">

                  {/* Avatar Frame */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32">
                    <div className="absolute inset-0 bg-[#55e6ff] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative w-full h-full rounded-full border-4 border-midnight bg-midnight overflow-hidden ring-4 ring-[#55e6ff]/20 group-hover:ring-[#55e6ff]/50 transition-all duration-500">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + member.name + '&background=0D8ABC&color=fff';
                        }}
                      />
                    </div>
                  </div>

                  {/* Specialty Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#55e6ff]/10 border border-[#55e6ff]/20 text-[#55e6ff] text-xs font-black uppercase tracking-widest mb-6">
                    <member.icon className="w-3.5 h-3.5" />
                    {member.specialty}
                  </div>

                  <h3 className="text-3xl font-black text-white mb-2 group-hover:text-[#55e6ff] transition-colors">
                    {member.name
                  }</h3>
                  <p className="text-white/40 font-bold mb-8">{member.role}</p>

                  {/* Social links removed per request */}
                </div>
              </div>
            ))}
          </div>

          {/* Join Us section removed per request */}
        </div>
      </main>
    </div>
  );
};

export default Team;

