import sequelize from '../../config/database.js';
import { AboutOrigin, AboutAchievement, AboutFooter, TrackMessage } from '../../models/index.js';

async function seedCrudData() {
  try {
    console.log('🌱 Seeding CRUD data...');

    // Seed About Origins (3 slider sections)
    console.log('  ✓ Seeding about_origins...');
    await AboutOrigin.bulkCreate([
      {
        title: 'Origins & Formation',
        content_paragraph_1: `SB19 (short for Sound Break 19) was formed by ShowBT Philippines, aiming to blend Korean idol training with Filipino artistry. The members—Pablo, Josh, Stell, Ken, and Justin—underwent years of intensive preparation before debuting in October 2018 with their heartfelt single "Tilaluha."`,
        content_paragraph_2: `Their early journey was marked by strict vocal and dance training, perseverance through challenges, and a shared passion for music. These experiences built their strong foundation and unity, shaping the identity that would later define SB19's rise in the P-pop scene.`,
        content_paragraph_3: `Over time, SB19 has become a symbol of the fusion between global pop influences and Filipino creativity. Their story highlights teamwork, dedication, and the transformative power of music, inspiring countless fans and aspiring artists across the Philippines and beyond.`,
        image_url: '/images/About.jpg',
        order: 1
      },
      {
        title: 'Musical Evolution & Milestones',
        content_paragraph_1: `SB19's journey from their debut album Get in the Zone to Pagsibol showcased their evolution as artists — blending heartfelt lyricism, dynamic performances, and modern pop experimentation that set new standards for P-pop.`,
        content_paragraph_2: `Their single "Bazinga" became a cultural phenomenon, dominating the Billboard Hot Trending Songs chart for weeks and proving the group's global appeal.`,
        content_paragraph_3: `In 2021, SB19 became the first Southeast Asian act nominated for a Billboard Music Award, marking a historic milestone and solidifying their status as pioneers who continue to elevate Filipino music on the world stage.`,
        image_url: '/images/About1.jpg',
        order: 2
      },
      {
        title: 'The 1Z Entertainment – A New Chapter of SB19',
        content_paragraph_1: `The 1Z Entertainment journey began when SB19 parted ways with ShowBT Philippines and decided to take full control of their artistry and direction. In 2023, they founded 1Z (pronounced "One Zone") as their own independent company — managing their creative vision, production, styling, and business under their own terms.`,
        content_paragraph_2: `This new chapter highlights their authenticity and artistry — blending futuristic sounds, experimental visuals, and powerful storytelling that reflect their growth and individuality. Through 1Z, SB19 continues to inspire Filipinos to break limits, celebrate culture, and raise the P-pop flag globally.`,
        quote: 'One Zone, One Dream, One SB19.',
        image_url: '/images/1Z.jpg',
        order: 3
      }
    ]);

    // Seed About Achievements
    console.log('  ✓ Seeding about_achievements...');
    await AboutAchievement.bulkCreate([
      {
        title: '2018 — Debut',
        description: 'Official debut with the single Tilaluha, marking the start of their professional career.',
        image_url: '/images/album1.jpg',
        order: 1
      },
      {
        title: '2020 — Get in the Zone',
        description: 'Released their first full-length album, expanding their sound and solidifying their fanbase.',
        image_url: '/images/About1.jpg',
        order: 2
      },
      {
        title: '2021 — International Breakthrough',
        description: 'Their single "Bazinga" topped Billboard Hot Trending Songs and the group received a Billboard Music Awards nomination.',
        image_url: '/images/Artist_B.jpg',
        order: 3
      },
      {
        title: '2023–2025 — Recent Era',
        description: 'The group continued releasing music, explored new sonic directions, and strengthened their global presence.',
        image_url: '/images/banner.jpg',
        order: 4
      },
      {
        title: 'Billboard Recognition',
        description: 'SB19 became the first Southeast Asian act nominated for a Billboard Music Award (Top Social Artist).',
        image_url: '/images/banner-1.jpg',
        order: 5
      },
      {
        title: 'Chart Success',
        description: 'Singles like "Bazinga" and "MAPA" charted internationally, increasing P-pop\'s visibility on global platforms.',
        image_url: '/images/About1.jpg',
        order: 6
      },
      {
        title: 'Impact',
        description: 'SB19 inspired a new generation of Filipino artists and helped grow P-pop\'s global recognition through authentic storytelling and performance.',
        image_url: '/images/banner-1.jpg',
        order: 7
      },
      {
        title: 'Global Recognition',
        description: 'From local stages to international tours, SB19 has elevated Filipino artistry across borders and into global playlists.',
        image_url: '/images/About1.jpg',
        order: 8
      }
    ]);

    // Seed About Footer
    console.log('  ✓ Seeding about_footer...');
    await AboutFooter.bulkCreate([
      {
        profile_name: "A'tin Jay",
        profile_image_url: '/images/Jay.jpg',
        main_description: `We're two devoted A'tins who poured our hearts into designing this tribute to SB19 — a celebration of their artistry, growth, and impact. Built with passion, creativity, and teamwork, this website reflects our love for music and the fandom that unites us.`,
        quote: 'We rise together, A\'tin forever.'
      },
      {
        profile_name: "A'tin Jo",
        profile_image_url: '/images/Jo.jpg',
        main_description: `We're two devoted A'tins who poured our hearts into designing this tribute to SB19 — a celebration of their artistry, growth, and impact. Built with passion, creativity, and teamwork, this website reflects our love for music and the fandom that unites us.`,
        quote: 'We rise together, A\'tin forever.'
      }
    ]);

    console.log('✅ CRUD data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedCrudData();
