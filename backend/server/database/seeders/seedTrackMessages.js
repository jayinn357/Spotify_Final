import sequelize from '../../config/database.js';
import { TrackMessage, Track } from '../../models/index.js';

const songQuotes = {
    "GENTO": "Be solid. Be gold. Stay rare. - GENTO",
    "MAPA": "Tell your parents 'thank you' while you still can - MAPA",
    "What?": "Question everything and break boundaries - What?",
    "Go Up": "Keep climbing, never look down - Go Up",
    "Bazinga": "Let your success be the loudest clapback - Bazinga",
    "SLMT": "Gratitude turns ordinary days into blessings - SLMT",
    "Mana": "Honor your roots, they are your power - Mana",
    "Moonlight": "Be gentle; even the moon shines by reflection - Moonlight",
    "WYAT": "Your dreams are worth fighting for - WYAT",
    "CRIMZONE": "Don't just play safe, make your own rules - CRIMZONE",
    "FREEDOM": "You owe no one an apology for being yourself - FREEDOM",
    "LIHAM": "Every word has power - LIHAM",
    "DUNGKA!": "Stand tall and be proud - DUNGKA!",
    "I WANT YOU": "Love transcends all boundaries - I WANT YOU",
    "Tilaluha": "Let your tears remind you that you are still capable of love - Tilaluha",
    "Hanggang sa Huli": "Some goodbyes make us stronger, not smaller - Hanggang sa Huli",
    "Alab (Burning)": "Keep your fire burning, even when the world tries to extinguish it - Alab (Burning)",
    "Wag Mong Ikunot Ang Iyong Noo": "Smile a little more, you deserve lightness too - Wag Mong Ikunot Ang Iyong Noo",
    "Love Goes": "Real love doesn't end; it just changes its form - Love Goes",
    "Ikako": "We heal together, you are not alone - Ikako",
    "ILAW": "Even the smallest light can guide someone home - ILAW",
    "DAM": "Let your emotions flow; strength comes from release - DAM",
    "Shooting for the Stars": "Dream bigger than your doubts - Shooting for the Stars",
    "Time": "Cherish the moments, it never comes back - Time",
    "Dungka": "Let your weirdness be your wonder - Dungka",
    "8TonBall": "Take risks; even failure teaches rhythm - 8TonBall",
    "Quit": "Rest if you must, but don't quit your purpose - Quit",
    "Ready": "The best time is now - Ready",
    "Win Your Heart": "Win hearts by being kind, not perfect - Win Your Heart",
    "The One": "Love will find you when you learn to love yourself - The One",
    "Sino Ka Ba - From \"The Iron Heart Season 2\"": "Know yourself before seeking to be known - Sino Ka Ba - From \"The Iron Heart Season 2\"",
    "Umaaligid": "Love quietly but sincerely - Umaaligid",
    "MAPA (Indonesian Ver.)": "Keep your loved ones close, no matter the distance - MAPA (Indonesian Ver.)",
    "Kalakal": "Never trade integrity for convenience - Kalakal",
    "MAPA - From THE FIRST TAKE": "Simplicity can move hearts - MAPA - From THE FIRST TAKE",
    "GENTO - From THE FIRST TAKE": "Authenticity outshines perfection - GENTO - From THE FIRST TAKE",
    "No Stopping You": "Keep moving forward—the world moves with those who dare - No Stopping You",
    "Kabataang Pinoy": "Take pride in your roots and Be the voice of change; you are the heartbeat of tomorrow - Kabataang Pinoy",
    "foes": "Turn enemies into lessons, not burdens - foes",
    "envy": "Your path is yours alone; envy has no place - envy",
    "greed": "Abundance comes from contentment, not more - greed",
    "pride": "Stand tall, but stay humble - pride",
    "gluttony (feat. PLAYERTWO)": "Indulge in life's joys, but know you're enough - gluttony (feat. PLAYERTWO)",
    "lust (feat. Cyra Gwynth)": "Desire can create or destroy—choose wisely - lust (feat. Cyra Gwynth)",
    "sloth": "Rest, but don't forget to move forward - sloth",
    "ache": "Pain shapes strength; let it mold you - ache",
    "ROCKSTA": "Own your stage—confidence is your spotlight - ROCKSTA",
    "SUPERIORITY": "True power is quiet, not boastful - SUPERIORITY",
    "MICTEST": "Speak truth even when it shakes the room - MICTEST",
    "DRINKSMOKE": "Don't lose yourself in the haze—stay clear - DRINKSMOKE",
    "CRIMINAL": "Be rebellious for the right cause - CRIMINAL",
    "STRAYDOGS": "Belong to no one but your purpose - STRAYDOGS",
    "Kanako": "Cherish what's real, even if it fades - Kanako",
    "Moving Closer": "Step closer to love without fear - Moving Closer",
    "Fake Faces": "Be genuine in a world of masks - Fake Faces",
    "Palayo": "Distance can bring peace and clarity - Palayo",
    "Bulan": "Shine in your own phase and timing - Bulan",
    "Pagdali": "Don't rush what's meant to unfold naturally - Pagdali",
    "FLYYY": "Soar beyond what limits you - FLYYY",
    "KAWASAKI (with Felip & thủy)": "Ride life with courage and thrill - KAWASAKI (with Felip & thủy)",
    "1999": "Nostalgia reminds us of who we once were - 1999",
    "1999 (Clean Ver.)": "Look back, but don't stay there; you've grown since then - 1999 (Clean Ver.)",
    "See Me": "Be visible by being authentic - See Me",
    "Silent Cries": "Even silence speaks when it's honest - Silent Cries",
    "Honest": "Truth heals faster than lies ever could - Honest",
    "No Control (feat. (e)motion engine)": "Let go and trust your instincts - No Control (feat. (e)motion engine)",
    "Lights Out (feat. Mo Mitchell)": "Even in darkness, you can shine within - Lights Out (feat. Mo Mitchell)",
    "Sumaya": "Sometimes happiness begins where holding on ends - Sumaya",
    "Yoko Na": "Walking away can also mean growing stronger - Yoko Na",
    "Re: Thinkin' About You": "Memories keep love alive in quiet ways - Re: Thinkin' About You",
    "GET RIGHT": "Don't rush the process—get it right - GET RIGHT",
    "Pakiusap Lang": "Speak softly; even pleas carry power - Pakiusap Lang",
    "WILD TONIGHT": "Live boldly; nights like this don't last - WILD TONIGHT",
    "Sofa (Remix)": "Comfort can be love in its simplest form - Sofa (Remix)",
    "Neumun": "Start fresh; new moons mean new beginnings - Neumun",
    "Don't Care": "Live freely; not everyone's opinion matters - Don't Care",
    "Butata": "Fight for what's right, even when it's tough - Butata",
    "Puyat": "Hard work pays off—dreams need dedication - Puyat",
    "Blessed": "Gratitude turns ordinary days into miracles - Blessed",
    "Tambol (Ibang Planeta)": "March to your own rhythm - Tambol (Ibang Planeta)",
    "Micha!": "Hold close those who understand your silence - Micha!",
    "La Luna": "Embrace your phases; even the moon changes - La Luna",
    "Presyon": "Stay calm under pressure; strength is quiet - Presyon",
    "Wala": "Let go of emptiness to make room for peace - Wala",
    "The Boy Who Cried Wolf": "Honesty keeps your voice heard - The Boy Who Cried Wolf",
    "Kumunoy": "Even when sinking, look for light above - Kumunoy",
    "Kelan": "Patience brings timing into perfection - Kelan",
    "Drowning in the Water": "Don't drown in thoughts—breathe through the chaos - Drowning in the Water",
    "Breathe (Outro)": "Take a breath; healing starts there - Breathe (Outro)",
    "Liwanag sa Dilim - from \"Incognito\"": "Be someone's light in their darkest hour - Liwanag sa Dilim - from \"Incognito\"",
    "edsa": "Stand for change; it begins with courage - edsa",
    "AKALA": "Not everything you lose is a loss - AKALA",
    "DETERMINADO": "Stay determined; persistence builds destiny - DETERMINADO",
    "sunday morning": "Find peace in slow beginnings - sunday morning",
    "surreal": "Dreams become real when you believe - surreal",
    "kaibigan": "True friends are treasures that time polishes - kaibigan",
    "Sampung mga Daliri": "Harmony grows when we work hand in hand - Sampung mga Daliri",
    "Room": "Make space for growth inside your own room - Room",
    "Anino": "Even shadows prove the presence of light - Anino",
    "'Di Ko Masabi": "Say what your heart hides before it's too late - 'Di Ko Masabi",
    "Classic": "Timelessness is built from sincerity - Classic",
    "Kapangyarihan - feat. SB19": "Use your power to uplift, not to dominate - Kapangyarihan - feat. SB19"
};

async function seedTrackMessages() {
  try {
    console.log('Seeding track inspirational messages...');

    // Delete existing messages first
    await TrackMessage.destroy({ where: {} });
    console.log('Cleared existing messages');

    let seededCount = 0;
    let notFoundCount = 0;

    for (const [trackTitle, message] of Object.entries(songQuotes)) {
      // Find track by title
      const track = await Track.findOne({
        where: {
          title: trackTitle
        }
      });

      if (track) {
        await TrackMessage.create({
          track_id: track.id,
          message: message
        });
        seededCount++;
        console.log(`Added message for: ${trackTitle}`);
      } else {
        notFoundCount++;
        console.log(`Track not found: ${trackTitle}`);
      }
    }

    console.log(`\nTrack messages seeded successfully!`);
    console.log(`   - Seeded: ${seededCount} messages`);
    console.log(`   - Not found: ${notFoundCount} tracks`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedTrackMessages();
