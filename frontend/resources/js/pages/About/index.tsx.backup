import { useState, useEffect } from "react";

// Swiper imports (v12 compatible)
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Autoplay } from "swiper/modules";

export default function About() {
  type Card = {
    title: string;
    description: string;
    image: string;
  };
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const achievements: Card[] = [
  {
    title: "2018 — Debut",
    description:
      "Official debut with the single Tilaluha, marking the start of their professional career.",
    image: "/images/album1.jpg",
  },
  {
    title: "2020 — Get in the Zone",
    description:
      "Released their first full-length album, expanding their sound and solidifying their fanbase.",
    image: "/images/About1.jpg",
  },
  {
    title: "2021 — International Breakthrough",
    description:
      "Their single “Bazinga” topped Billboard Hot Trending Songs and the group received a Billboard Music Awards nomination.",
    image: "/images/Artist_B.jpg",
  },
  {
    title: "2023–2025 — Recent Era",
    description:
      "The group continued releasing music, explored new sonic directions, and strengthened their global presence.",
    image: "/images/banner.jpg",
  },
  {
    title: "Billboard Recognition",
    description:
      "SB19 became the first Southeast Asian act nominated for a Billboard Music Award (Top Social Artist).",
    image: "/images/banner-1.jpg",
  },
  {
    title: "Chart Success",
    description:
      "Singles like “Bazinga” and “MAPA” charted internationally, increasing P-pop's visibility on global platforms.",
    image: "/images/About1.jpg",
  },
  {
    title: "Impact",
    description:
      "SB19 inspired a new generation of Filipino artists and helped grow P-pop's global recognition through authentic storytelling and performance.",
    image: "/images/banner-1.jpg",
  },
  {
    title: "Global Recognition",
    description:
      "From local stages to international tours, SB19 has elevated Filipino artistry across borders and into global playlists.",
    image: "/images/About1.jpg",
  },
];




  // set document title (React Router SPA)
  useEffect(() => { document.title = 'About SB19'; }, []);

  return (

      <main className="min-h-screen bg-black text-gray-200">
        {/* HERO */}
        <section className="relative h-[56vh] md:h-[62vh] flex items-center justify-center overflow-hidden">
          <img
            src="/images/Artist_B.jpg"
            alt="SB19 hero"
            className="absolute inset-0 w-full h-full object-cover [object-position:center_-350px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>

          <div className="relative z-10 text-center px-6 font-poppins">
            <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 tracking-tight drop-shadow-lg">
              About SB19
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
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
              className="max-w-6xl mx-auto"
            >
              {/* Slide 1 - Origins & Formation */}
              <SwiperSlide>
              <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4">
              Origins & Formation
            </h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                SB19 (short for Sound Break 19) was formed by ShowBT Philippines, aiming
                to blend Korean idol training with Filipino artistry. The members—Pablo,
                Josh, Stell, Ken, and Justin—underwent years of intensive preparation
                before debuting in October 2018 with their heartfelt single “Tilaluha.”
              </p>
              <p className="text-gray-300 leading-relaxed mb-3">
                Their early journey was marked by strict vocal and dance training,
                perseverance through challenges, and a shared passion for music. These
                experiences built their strong foundation and unity, shaping the identity
                that would later define SB19's rise in the P-pop scene.
              </p>
              <p className="text-gray-300 leading-relaxed">
              Over time, SB19 has become a symbol of the fusion between global pop influences 
              and Filipino creativity. Their story highlights teamwork, dedication, and the transformative
              power of music, inspiring countless fans and aspiring artists across the Philippines and beyond.
          </p>

          </div>
          <div className="flex justify-center md:justify-end">
            <div className="w-[380px] md:w-[420px] rounded-xl overflow-hidden shadow-xl border border-yellow-400/20 transform hover:scale-[1.02] transition-all duration-300">
              <img
                src="/images/About.jpg"
                alt="SB19 formation"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

              </SwiperSlide>

              {/* Slide 2 - Musical Evolution & Milestones */}
              <SwiperSlide>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-last md:order-first flex justify-center md:justify-start">
                    <div className="flex justify-center md:justify-end">
                      <div className="w-[380px] md:w-[420px] rounded-xl overflow-hidden shadow-xl border border-yellow-400/20 transform hover:scale-[1.02] transition-all duration-300">
                        <img
                          src="/images/About1.jpg"
                          alt="SB19 milestones"
                          className="w-full h-[260px] md:h-[280px] object-contain object-center"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4">
                      Musical Evolution & Milestones
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-3">
                    SB19’s journey from their debut album <em>Get in the Zone</em> to
                    <em> Pagsibol</em> showcased their evolution as artists — blending heartfelt
                    lyricism, dynamic performances, and modern pop experimentation that set new
                    standards for P-pop.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-3">
                    Their single “Bazinga” became a cultural phenomenon, dominating the Billboard
                    Hot Trending Songs chart for weeks and proving the group's global appeal.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    In 2021, SB19 became the first Southeast Asian act nominated for a Billboard
                    Music Award, marking a historic milestone and solidifying their status as
                    pioneers who continue to elevate Filipino music on the world stage.
                  </p>
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 3 - The 1Z Era */}
              <SwiperSlide>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4">
                      The 1Z Entertaimnet – A New Chapter of SB19
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-3">
                  The <em>1Z Entertainment</em> journey began when SB19 parted ways with ShowBT
                  Philippines and decided to take full control of their artistry and direction.
                  In 2023, they founded <strong>1Z</strong> (pronounced “One Zone”) as their own
                  independent company — managing their creative vision, production, styling,
                  and business under their own terms.
                </p>
                <p className="text-gray-300 leading-relaxed mb-3">
                  This new chapter highlights their authenticity and artistry — blending
                  futuristic sounds, experimental visuals, and powerful storytelling that
                  reflect their growth and individuality.
                  Through <em>1Z</em>, SB19 continues to inspire Filipinos to break limits,
                  celebrate culture, and raise the P-pop flag globally.
                </p>
                      <p className="text-yellow-400 mt-4 italic">
                        “One Zone, One Dream, One SB19.”
                      </p>
                    </div>

                  <div className="flex justify-center md:justify-end">
                    <div className="w-[380px] md:w-[420px] rounded-xl overflow-hidden shadow-xl border border-yellow-400/20 transform hover:scale-[1.03] transition-all duration-300">
                      <img
                        src="/images/1Z.jpg"
                        alt="SB19 1Z Era"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>


            {/* Custom navigation (hidden until hover) */}
            <div className="hidden group-hover:flex absolute inset-y-0 justify-between items-center w-full px-2 pointer-events-none">
              <button className="custom-prev pointer-events-auto bg-yellow-400/30 hover:bg-yellow-500/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition transform hover:scale-110">
                ‹
              </button>
              <button className="custom-next pointer-events-auto bg-yellow-400/30 hover:bg-yellow-500/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition transform hover:scale-110">
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
              }}
              loop={true}
              className="pb-10"
            >
              {achievements.map((item, i) => (
                <SwiperSlide key={i}>
                  <div
                    onClick={() => setActiveCard(item)}
                    className="cursor-pointer bg-gradient-to-br from-gray-900/70 to-black/70 p-6 rounded-xl shadow-lg border border-yellow-400/10 
                              hover:scale-[1.03] hover:border-yellow-400/40 transition relative overflow-hidden group
                              h-[180px] flex flex-col justify-between"
                  >
                    <img
                      src={item.image}
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
                className="bg-gray-900 p-6 rounded-2xl max-w-lg w-full text-center relative"
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
        <footer className="relative bg-gradient-to-t from-black via-gray-950 to-black text-gray-300 text-center py-5 px-6">
          {/* GLOW EFFECT */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent"></div>

          {/* PROFILE IMAGES */}
          <div className="flex justify-center space-x-12 mb-8">
            {/* Jay */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src="/images/Jay.jpg"
                  alt="A'tin Jay"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-lg border border-yellow-500/40 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full ring-2 ring-yellow-400/20 blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
              </div>
              <p className="mt-3 text-sm text-yellow-300 font-semibold tracking-wide">
                A'tin Jay
              </p>
            </div>

            {/* Jo */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src="/images/Jo.jpg"
                  alt="A'tin Jo"
                  className="w-10 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-lg border border-yellow-500/40 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full ring-2 ring-yellow-400/20 blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
              </div>
              <p className="mt-3 text-sm text-yellow-300 font-semibold tracking-wide">
                A'tin Jo
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="max-w-2xl mx-auto text-sm leading-relaxed text-gray-400 mb-1 px-4">
            We're two devoted A'tins who poured our hearts into designing this tribute to SB19 — a celebration
            of their artistry, growth, and impact. Built with passion, creativity, and teamwork, this website
            reflects our love for music and the fandom that unites us.
          </p>

          {/* QUOTE & COPYRIGHT */}
          <div className="pt-3">
            <p className="text-yellow-400 text-sm italic mb-2 tracking-wide">
              “We rise together, A'tin forever.”
            </p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} SB19 Fan Project • Designed with 💛 by Jay & Jo
            </p>
          </div>
        </footer>


      </main>
  );
}
