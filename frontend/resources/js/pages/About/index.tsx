import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Autoplay } from "swiper/modules";

// Types for database data
interface AboutOrigin {
  id: number;
  title: string;
  content: string;
  quote: string | null;
  image_url: string;
  order: number;
}

interface AboutAchievement {
  id: number;
  title: string;
  description: string;
  image_url: string;
  order: number;
}

interface AboutFooterItem {
  id: number;
  profile_name: string;
  profile_image_url: string;
  main_description: string;
  quote: string;
}

type Card = {
  title: string;
  description: string;
  image: string;
};

export default function About() {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  
  // State for dynamic data from database
  const [origins, setOrigins] = useState<AboutOrigin[]>([]);
  const [achievements, setAchievements] = useState<AboutAchievement[]>([]);
  const [footerItems, setFooterItems] = useState<AboutFooterItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from database
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [originsRes, achievementsRes, footerRes] = await Promise.all([
          fetch('/api/crud/about-origins'),
          fetch('/api/crud/about-achievements'),
          fetch('/api/crud/about-footer')
        ]);

        const [originsData, achievementsData, footerData] = await Promise.all([
          originsRes.json(),
          achievementsRes.json(),
          footerRes.json()
        ]);

        setOrigins(originsData.origins || []);
        setAchievements(achievementsData.achievements || []);
        setFooterItems(footerData.footerItems || []);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Set document title
  useEffect(() => { 
    document.title = 'About SB19'; 
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-gray-200">
      {/* HERO */}
      <section className="relative h-[56vh] md:h-[62vh] flex items-center justify-center overflow-hidden">
        <img
          src="/images/Artist_B.jpg"
          alt="SB19 hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/80"></div>

        <div className="relative z-10 text-center px-6 font-poppins">
          <h1 className="text-4xl md:text-5xl 2xl:text-3xl font-extrabold text-yellow-300 tracking-tight drop-shadow-lg">
            About SB19
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl 2xl:text-base text-gray-300 leading-relaxed">
            SB19 is a trailblazing Filipino pop group redefining music with passion,
            discipline, and purpose. Their artistry bridges cultures, blending global
            influences with deep Filipino roots, proving that talent knows no boundaries.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto px-6 md:px-8 py-12 space-y-16">
        {/* ORIGINS & EVOLUTION SLIDER */}
        <div className="relative group">
          <Swiper
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            modules={[Navigation, Keyboard]}
            keyboard={{ enabled: true }}
            spaceBetween={24}
            slidesPerView={1}
            className="max-w-6xl mx-auto 2xl:max-w-5xl"
          >
            {origins.map((origin, index) => (
              <SwiperSlide key={origin.id}>
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {index % 2 === 0 ? (
                    <>
                      <div>
                        <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-yellow-400 mb-4">
                          {origin.title}
                        </h2>
                        <p className="text-sm sm:text-base md:text-base lg:text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                          {origin.content}
                        </p>
                        {origin.quote && (
                          <p className="text-sm sm:text-base md:text-base lg:text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                            "{origin.quote}"
                          </p>
                        )}
                      </div>
                      <div className="flex justify-center md:justify-end">
                        <div className="w-full max-w-[420px] max-h-[260px] md:max-h-[300px] lg:max-h-none rounded-xl overflow-hidden shadow-xl border border-yellow-400/20 transform hover:scale-[1.02] transition-all duration-300">
                        <img
                          src={origin.image_url}
                          alt={origin.title}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="order-last md:order-first flex justify-center md:justify-start">
                        <div className="w-full max-w-[420px] rounded-xl overflow-hidden shadow-xl border border-yellow-400/20 transform hover:scale-[1.02] transition-all duration-300">
                          <img
                            src={origin.image_url}
                            alt={origin.title}
                            className="w-full h-auto object-cover object-center"
                          />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4">
                          {origin.title}
                        </h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {origin.content}
                        </p>
                        {origin.quote && (
                          <p className="text-yellow-400 mt-4 italic">
                            "{origin.quote}"
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation */}
          <div className="hidden group-hover:flex absolute inset-y-0 justify-between items-center w-full px-2">
            <button type="button" aria-label="Previous slide" className="custom-prev pointer-events-auto z-20 bg-yellow-400/30 hover:bg-yellow-500/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition transform -translate-x-2 md:-translate-x-6 hover:scale-110">
              ‹
            </button>
            <button type="button" aria-label="Next slide" className="custom-next pointer-events-auto z-20 bg-yellow-400/30 hover:bg-yellow-500/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition transform translate-x-2 md:translate-x-6 hover:scale-110">
              ›
            </button>
          </div>
        </div>

        {/* ACHIEVEMENTS SLIDER */}
        <div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            Timeline & Achievements
          </h3>

          <Swiper
            modules={[Autoplay, Keyboard]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            keyboard={{ enabled: true }}
            spaceBetween={20}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            loop={true}
            className="pb-10"
          >
            {achievements.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  onClick={() => setActiveCard({ 
                    title: item.title, 
                    description: item.description, 
                    image: item.image_url 
                  })}
                  className="cursor-pointer bg-linear-to-br from-gray-900/70 to-black/70 p-6 rounded-xl shadow-lg border border-yellow-400/10 
                            hover:scale-[1.03] hover:border-yellow-400/40 transition relative overflow-hidden group
                            h-[180px] flex flex-col justify-between"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition"
                  />
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <div className="text-yellow-400 font-bold text-lg mb-2">
                        {item.title}
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-3">{item.description}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Modal for expanded card */}
        {activeCard && (
          <div
            onClick={() => setActiveCard(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 p-6 rounded-2xl max-w-3xl w-full text-center relative"
            >
              <button
                onClick={() => setActiveCard(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-yellow-400"
              >
                ✕
              </button>
              <img
                src={activeCard.image}
                alt={activeCard.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h4 className="text-xl font-bold text-yellow-400 mb-2">
                {activeCard.title}
              </h4>
              <p className="text-gray-300">{activeCard.description}</p>
            </div>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="relative bg-linear-to-t from-black via-gray-950 to-black text-gray-300 text-center py-5 px-6">
        <div className="absolute inset-x-0 top-0 h-[px] bg-linear-to-r from-transparent via-yellow-500/40 to-transparent"></div>

        {/* PROFILE IMAGES */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {footerItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={item.profile_image_url}
                  alt={item.profile_name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-lg border border-yellow-500/40 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full ring-2 ring-yellow-400/20 blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
              </div>
              <p className="mt-3 text-sm text-yellow-300 font-semibold tracking-wide">
                {item.profile_name}
              </p>
            </div>
          ))}
        </div>
        {/* DESCRIPTION */}
        {footerItems.length > 0 && (
          <p className="max-w-2xl mx-auto text-sm leading-relaxed text-gray-400 mb-1 px-4">
            {footerItems[0].main_description}
          </p>
        )}

        {/* QUOTE & COPYRIGHT */}
        <div className="pt-3">
          {footerItems.length > 0 && (
            <p className="text-yellow-400 text-sm italic mb-2 tracking-wide">
              "{footerItems[0].quote}"
            </p>
          )}
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SB19 Fan Project • Designed with 💛 by Jay & Jo
          </p>
        </div>
      </footer>
    </main>
  );
}
