/**
 * Persona (archetype) definitions, presentation metadata,
 * and reusable recommendation templates.
 * Pure data module - safe to import from Node-based tests.
 */

export const ARCHETYPE_IDS = [
  "soft-gfe",
  "glam-luxury-muse",
  "alt-goth",
  "fitness-fantasy",
  "cosplay",
  "dominant",
  "edu-coach",
  "cam",
  "anonymous-faceless",
  "couple",
];

export const ARCHETYPES = {
  "soft-gfe": {
    id: "soft-gfe",
    name: "The Soft GFE Creator",
    tagline: "Warmth, delivered with intention.",
    description:
      "A connection-first creator identity built on warmth, attunement, and intimate storytelling. You lead with emotional presence rather than spectacle, and your audience follows because they feel seen.",
    strengths: ["Emotional attunement", "Conversation fluency", "Trust building"],
    identityStatement:
      "You are not performing for attention. You are practicing presence, and your people feel it.",
    accent: "#FF6FB5",
    liveRecommended: false,
    collabEligible: true,
    privacyLevel: "pseudonymous",
    brand: {
      names: ["Aurelia Hart", "Mira Solace", "June Calloway"],
      personality: "Warm, unhurried, attentive",
      tagline: "Softness with a signal.",
      palette: ["#FF6FB5", "#F8F5FF", "#2A1B33", "#FFEC70"],
      aesthetic: "Soft neon, silk textures, dim intimacy lighting",
      bio: "I create slow, intimate content for people who crave a softer corner of the internet.",
      audience: "Adults seeking connection, comfort, and low-pressure belonging.",
    },
    pillars: [
      {
        title: "Intimate Storytelling",
        description: "Slow, sensory stories that make people feel witnessed.",
        ideas: [
          "First-person narrative series about a memory that changed them",
          "Audio stories told over quiet, ambient soundscapes",
        ],
        format: "Writing / Audio",
      },
      {
        title: "Connection Practice",
        description: "Conversation that goes past small talk.",
        ideas: [
          "Guided reflection prompts for long-form members",
          "Conversation rituals that build familiarity",
        ],
        format: "Writing / Community",
      },
      {
        title: "Ritual & Atmosphere",
        description: "Curated rituals that turn content into feeling.",
        ideas: ["Bedtime ritual audio series", "Curated sensory playlists"],
        format: "Audio",
      },
      {
        title: "Boundaries & Trust",
        description: "Stories about safety, consent, and healthy closeness.",
        ideas: ["Boundary-setting stories", "Consent-aware community rituals"],
        format: "Writing",
      },
    ],
  },
  "glam-luxury-muse": {
    id: "glam-luxury-muse",
    name: "The Glam Luxury Muse",
    tagline: "Elegance, engineered.",
    description:
      "An aspirational, polished creator identity where luxury is the aesthetic and confidence is the product. Every visual, word, and format is tuned for elevated taste.",
    strengths: ["Aesthetic precision", "Brand discipline", "Elevated storytelling"],
    identityStatement:
      "You are the standard your audience aspires to — and you made it look inevitable.",
    accent: "#E0AAFF",
    liveRecommended: false,
    collabEligible: true,
    privacyLevel: "face-light",
    brand: {
      names: ["Vivienne Marlowe", "Celeste Aurelius", "Noor Vant"],
      personality: "Polished, poised, quietly commanding",
      tagline: "Effortless, elevated.",
      palette: ["#E0AAFF", "#F8F5FF", "#1B1026", "#FFEC70"],
      aesthetic: "Editorial photography, marble and gold palettes, soft spotlights",
      bio: "I craft elevated, intimate creator content for audiences who treat aesthetics seriously.",
      audience: "Aspirational adults who respond to refined, premium content.",
    },
    pillars: [
      {
        title: "The Signature Look",
        description: "A recognizable visual identity that feels expensive.",
        ideas: ["Editorial photo series with a single hero prop", "Behind-the-look craft stories"],
        format: "Photography / Prerecorded Video",
      },
      {
        title: "Luxury Storytelling",
        description: "Narrative content with cinematic pacing.",
        ideas: ["Slow luxury lifestyle stories", "Character-driven brand origin stories"],
        format: "Writing / Prerecorded Video",
      },
      {
        title: "Exclusive Access",
        description: "Members-only glimpses into the creative process.",
        ideas: ["Studio process diaries", "Patron-curated aesthetic experiments"],
        format: "Photography / Community",
      },
      {
        title: "Elevated Intimacy",
        description: "Intimacy framed as bespoke, private, and tasteful.",
        ideas: ["One-to-one connection rituals", "Personal narrative letters"],
        format: "Writing / Audio",
      },
    ],
  },
  "alt-goth": {
    id: "alt-goth",
    name: "The Alt / Goth Creator",
    tagline: "Counterculture, in color.",
    description:
      "An alternative creator identity rooted in counterculture, artistic individuality, and gothic-inspired aesthetics. You turn personal weirdness into a brand.",
    strengths: ["Artistic individuality", "Narrative depth", "Subcultural fluency"],
    identityStatement:
      "You did not find the subculture. You became it, and now the subculture has a face.",
    accent: "#9D8CFF",
    liveRecommended: false,
    collabEligible: true,
    privacyLevel: "pseudonymous",
    brand: {
      names: ["Raven Vey", "Mabel Graves", "Sable Night"],
      personality: "Edgy, poetic, boundary-respecting",
      tagline: "Dark, deliberate, yours.",
      palette: ["#9D8CFF", "#0B0714", "#F8F5FF", "#FFEC70"],
      aesthetic: "Dark editorial, neon-noir, moody lighting, hand-drawn textures",
      bio: "I build alternative creator content for people who dress like midnight and dream in neon.",
      audience: "Alternative-leaning adults who value artistic individuality.",
    },
    pillars: [
      {
        title: "Dark Storytelling",
        description: "Lore, folklore, and personal mythologies.",
        ideas: ["Myth-inspired character stories", "Personal folklore series"],
        format: "Writing / Prerecorded Video",
      },
      {
        title: "Alt Aesthetic",
        description: "Fashion and visual language that reads as counterculture.",
        ideas: ["Edgy fashion editorial series", "Thrift / DIY costume inspiration"],
        format: "Photography / Prerecorded Video",
      },
      {
        title: "Community & Belonging",
        description: "Safe spaces for alternative-leaning creatives.",
        ideas: ["Subculture meetups content", "Creative mutual-aid stories"],
        format: "Community / Writing",
      },
      {
        title: "Artistic Expression",
        description: "Creative work beyond persona branding.",
        ideas: ["Original art showcases", "Creative process zines"],
        format: "Photography / Writing",
      },
    ],
  },
  "fitness-fantasy": {
    id: "fitness-fantasy",
    name: "The Fitness Fantasy Creator",
    tagline: "Discipline, made glamorous.",
    description:
      "An athletic creator identity blending fitness discipline with lifestyle storytelling, confidence branding, and body-positive framing.",
    strengths: ["Discipline", "Physical confidence", "Lifestyle narrative"],
    identityStatement:
      "You turned discipline into desire — for yourself first, and for your audience second.",
    accent: "#00D9FF",
    liveRecommended: false,
    collabEligible: true,
    privacyLevel: "face-light",
    brand: {
      names: ["Alexandra Reign", "Kai Sterling", "Brenna Vale"],
      personality: "Strong, focused, motivating",
      tagline: "Earned, not given.",
      palette: ["#00D9FF", "#F8F5FF", "#101826", "#FFEC70"],
      aesthetic: "Athletic photography, high-contrast training stills, sunrise discipline",
      bio: "I help confident adults build strength, stamina, and self-belief — one honest rep at a time.",
      audience: "Athletically curious adults seeking confidence through movement.",
    },
    pillars: [
      {
        title: "Strength Journey",
        description: "Progress stories that are real, gradual, and respectful.",
        ideas: ["Milestones without transformation obsession", "Training ritual stories"],
        format: "Photography / Prerecorded Video",
      },
      {
        title: "Lifestyle & Recovery",
        description: "Rest, nutrition, and mindset as part of the story.",
        ideas: ["Recovery ritual series", "Holistic training narratives"],
        format: "Writing / Photography",
      },
      {
        title: "Confidence Building",
        description: "Confidence content that never shames bodies.",
        ideas: ["Body-neutral affirmations", "Personal confidence milestones"],
        format: "Writing / Audio",
      },
      {
        title: "Community Challenge",
        description: "Group challenges that reward consistency over intensity.",
        ideas: ["30-day private challenge", "Accountability partner stories"],
        format: "Community / Prerecorded Video",
      },
    ],
  },
  cosplay: {
    id: "cosplay",
    name: "The Cosplay Creator",
    tagline: "Characters, performed.",
    description:
      "A character-performance creator identity built on fandom, costumes, and creative storytelling. You become the character and the community becomes your cast.",
    strengths: ["Character craft", "Performance skill", "Fandom depth"],
    identityStatement:
      "You are not dressing up. You are embodying a story — and bringing the audience along.",
    accent: "#FFEC70",
    liveRecommended: false,
    collabEligible: true,
    privacyLevel: "face-light",
    brand: {
      names: ["Vesper Nightshade", "Kestrel Moon", "Tamsin Wren"],
      personality: "Theatrical, devoted, playful",
      tagline: "Roleplay, rendered beautifully.",
      palette: ["#FFEC70", "#12091F", "#F8F5FF", "#9855FF"],
      aesthetic: "Stage lighting, costume detail, cinematic character stills",
      bio: "I perform characters and build worlds for fans who love the craft behind the costume.",
      audience: "Fandom communities seeking character performance and storytelling.",
    },
    pillars: [
      {
        title: "Character Deep Dive",
        description: "Backstory, arcs, and performance notes.",
        ideas: ["Origin story dramatizations", "Costume-making process series"],
        format: "Prerecorded Video / Writing",
      },
      {
        title: "Fandom Storytelling",
        description: "Stories that honor source material and expand it.",
        ideas: ["Original side-story content", "Fan mythos explorations"],
        format: "Writing / Prerecorded Video",
      },
      {
        title: "Performance Craft",
        description: "Acting-through-character techniques.",
        ideas: ["Gesture and voice workshops", "Scene reenactments"],
        format: "Tutorials / Prerecorded Video",
      },
      {
        title: "Community Cast",
        description: "Fandom celebration and shared lore.",
        ideas: ["Cosplay meetups", "Character voice chats"],
        format: "Community / Live if allowed",
      },
    ],
  },
  dominant: {
    id: "dominant",
    name: "The Dominant Persona",
    tagline: "Confidence, theatrical.",
    description:
      "A commanding persona identity built on theatrical confidence, clear boundaries, and consensual power exchange. The persona is a character with rules, never the person.",
    strengths: ["Command presence", "Theatrical instinct", "Boundary discipline"],
    identityStatement:
      "You are the director of an experience you control completely.",
    accent: "#FF2B91",
    liveRecommended: true,
    collabEligible: true,
    privacyLevel: "face-light",
    brand: {
      names: ["Dominique Voss", "The Marquise Noir", "Ravenhurst"],
      personality: "Commanding, theatrical, composed",
      tagline: "Rules, delivered.",
      palette: ["#FF2B91", "#0A0610", "#F8F5FF", "#00D9FF"],
      aesthetic: "Stage noir, dramatic spotlight, cinematic framing",
      bio: "I lead immersive, consensual persona experiences for adults who crave theatrical control.",
      audience: "Adults seeking consensual power-exchange entertainment.",
    },
    pillars: [
      {
        title: "Persona Worldbuilding",
        description: "Lore, titles, rituals, and scene language.",
        ideas: ["Character backstory arcs", "Ritual and protocol documentation"],
        format: "Writing / Prerecorded Video",
      },
      {
        title: "Command Performance",
        description: "Presence work without explicit content.",
        ideas: ["Presence and pacing workshops", "Scene-safety storytelling"],
        format: "Tutorials / Prerecorded Video",
      },
      {
        title: "Intimacy Architecture",
        description: "Designing consensual connection frameworks.",
        ideas: ["Boundary negotiation stories", "Aftercare rituals"],
        format: "Writing / Community",
      },
      {
        title: "Live Theatre",
        description: "Real-time persona performances and shows.",
        ideas: ["Live persona events", "Interactive story sessions"],
        format: "Live Sessions",
      },
    ],
  },
  "edu-coach": {
    id: "edu-coach",
    name: "The Educational / Sensual Coach",
    tagline: "Confidence, taught.",
    description:
      "An informative, confidence-oriented creator positioning that teaches skills, self-worth, and sensuality through education and gentle guidance.",
    strengths: ["Teaching ability", "Clarity", "Empathetic authority"],
    identityStatement:
      "You turned what you know into what they feel capable of knowing.",
    accent: "#9855FF",
    liveRecommended: false,
    collabEligible: true,
    privacyLevel: "pseudonymous",
    brand: {
      names: ["Dr. Elodie Marsh", "Vivian Sage", "Iris Laurent"],
      personality: "Knowledgeable, nurturing, precise",
      tagline: "Learn it. Feel it. Own it.",
      palette: ["#9855FF", "#0E0A1A", "#F8F5FF", "#FFEC70"],
      aesthetic: "Clean editorial design, calm gradients, study-hall warmth",
      bio: "I help adults build confidence and self-knowledge through informative, shame-free creator content.",
      audience: "Adults who want growth, clarity, and embodied confidence.",
    },
    pillars: [
      {
        title: "Confidence Curriculum",
        description: "Progressive lessons on self-belief.",
        ideas: ["Confidence foundations series", "Self-worth workbooks"],
        format: "Tutorials / Writing",
      },
      {
        title: "Sensuality Education",
        description: "Body knowledge and self-acceptance, age-appropriate framing.",
        ideas: ["Body awareness practices", "Intimacy communication guides"],
        format: "Writing / Audio",
      },
      {
        title: "Skill Coaching",
        description: "Practical skill-building with patience.",
        ideas: ["Creative skill sprints", "Beginner-friendly progressions"],
        format: "Tutorials / Prerecorded Video",
      },
      {
        title: "Community Circles",
        description: "Supportive group learning spaces.",
        ideas: ["Small cohort sessions", "Peer accountability circles"],
        format: "Community / Live if allowed",
      },
    ],
  },
  cam: {
    id: "cam",
    name: "The Cam Personality",
    tagline: "Live, unrepeatable.",
    description:
      "A live-performance-oriented entertainment identity where real-time audience energy is the product. Every session is shaped by the room.",
    strengths: ["Performance stamina", "Audience instinct", "Real-time charisma"],
    identityStatement:
      "You do not perform to an audience. You perform with one, live, in the moment.",
    accent: "#FF71CE",
    liveRecommended: true,
    collabEligible: true,
    privacyLevel: "face-light",
    brand: {
      names: ["Velvet Vixen", "Lola Blaze", "Siren Charisma"],
      personality: "Magnetic, playful, immediate",
      tagline: "Tonight only.",
      palette: ["#FF71CE", "#150820", "#F8F5FF", "#00D9FF"],
      aesthetic: "Neon nightlife, stage haze, dynamic live framing",
      bio: "I bring persona-driven live performances to adults who want real-time connection and entertainment.",
      audience: "Audience-hungry adults who crave live, interactive entertainment.",
    },
    pillars: [
      {
        title: "Live Persona Shows",
        description: "Theatrical live performances built around audience energy.",
        ideas: ["Themed persona nights", "Interactive story sessions"],
        format: "Live Sessions",
      },
      {
        title: "Audience Chemistry",
        description: "Reading the room and improvising persona responses.",
        ideas: ["Member-driven scenarios", "Crowd-energy bits"],
        format: "Live Sessions",
      },
      {
        title: "Clip & Highlight Craft",
        description: "Turning live moments into shareable persona lore.",
        ideas: ["Best-of persona moments", "Mythology of the persona"],
        format: "Prerecorded Video / Photography",
      },
      {
        title: "VIP Intimacy",
        description: "Premium one-to-one or small-group experiences.",
        ideas: ["Private persona sessions", "Small-group rituals"],
        format: "Live Sessions / Community",
      },
    ],
  },
  "anonymous-faceless": {
    id: "anonymous-faceless",
    name: "The Anonymous Faceless Creator",
    tagline: "The mask writes first.",
    description:
      "A privacy-first creator identity where the persona leads and the person stays protected. Anonymity, controlled exposure, and consent are the foundation.",
    strengths: ["Privacy discipline", "Creative control", "Adaptability"],
    identityStatement:
      "Your anonymity is not a limitation. It is the brand.",
    accent: "#8A7BE0",
    liveRecommended: false,
    collabEligible: false,
    privacyLevel: "anonymous",
    brand: {
      names: ["The Hollow", "Velvet Static", "Nocturne"],
      personality: "Mysterious, precise, self-protective",
      tagline: "What you see is the lane. Who you are is yours.",
      palette: ["#8A7BE0", "#0A0612", "#F8F5FF", "#00D9FF"],
      aesthetic: "Dark minimal, geometric masks, soft neon, no face-first framing",
      bio: "I create anonymous, privacy-respecting persona content for adults who want creative freedom without exposure.",
      audience: "Privacy-conscious adults seeking anonymous creative expression.",
    },
    pillars: [
      {
        title: "Masked Persona",
        description: "The persona is fully realized while the person is protected.",
        ideas: ["Myth-style persona origins", "Mask/identity design stories"],
        format: "Writing / Prerecorded Video",
      },
      {
        title: "Controlled Exposure",
        description: "Gradual, consent-based content release.",
        ideas: ["Tiered content reveals", "Consent-first story releases"],
        format: "Photography / Writing",
      },
      {
        title: "Privacy Craft",
        description: "Technical and practical privacy practices.",
        ideas: ["Handle & metadata hygiene", "Pseudonym system design"],
        format: "Writing",
      },
      {
        title: "Anonymous Community",
        description: "Groups built on shared interests, not shared identities.",
        ideas: ["Interest-based circles", "Anonymous feedback rituals"],
        format: "Community / Writing",
      },
    ],
  },
  couple: {
    id: "couple",
    name: "The Couple / Relationship Brand",
    tagline: "Two lanes, one story.",
    description:
      "A collaborative, relationship-oriented creator brand built by consenting adults, where the relationship itself is the creative material.",
    strengths: ["Collaborative chemistry", "Shared storytelling", "Mutual trust"],
    identityStatement:
      "We did not plan this lane. We discovered it together — and we are keeping it.",
    accent: "#FF5DA2",
    liveRecommended: true,
    collabEligible: true,
    privacyLevel: "relationship",
    brand: {
      names: ["The Holloway Duo", "Morrow & Quinn", "Sable & Wren"],
      personality: "Playful, intimate, consensual",
      tagline: "Us. The story.",
      palette: ["#FF5DA2", "#150A1C", "#F8F5FF", "#9855FF"],
      aesthetic: "Couples-portrait intimacy, warm neon, candid storytelling",
      bio: "We are a consenting adult couple building a relationship-rooted creator brand.",
      audience: "Couples and partners exploring shared creative expression.",
    },
    pillars: [
      {
        title: "Relationship Storytelling",
        description: "The relationship as narrative material.",
        ideas: ["Shared origin stories", "Relationship milestone fiction"],
        format: "Writing / Prerecorded Video",
      },
      {
        title: "Intimate Experiences",
        description: "Consensual, private experiences framed as content.",
        ideas: ["Private experience storytelling", "Couple rituals worth sharing"],
        format: "Live Sessions / Community",
      },
      {
        title: "Collaborative Creation",
        description: "Joint creative projects and cross-promotion.",
        ideas: ["Co-created characters", "Joint creative projects"],
        format: "Photography / Prerecorded Video",
      },
      {
        title: "Community & Education",
        description: "Relationship education through storytelling.",
        ideas: ["Communication stories", "Trust-building narratives"],
        format: "Writing / Community",
      },
    ],
  },
};

export const PLATFORMS = [
  {
    category: "Subscription-based creator platforms",
    example: "Recurring membership sites",
    why: "Best fit for ongoing membership value, rituals, and premium intimacy.",
    adultNote:
      "Verify current eligibility, identity-verification, and adult-content policies before use.",
  },
  {
    category: "Live creator platforms",
    example: "Real-time performance venues",
    why: "Real-time audience energy and interactive persona performance.",
    adultNote:
      "Verify current eligibility, identity-verification, and adult-content policies before use.",
  },
  {
    category: "Social audience-building platforms",
    example: "Discovery-first social apps",
    why: "Good for audience discovery and organic reach before deeper monetization.",
    adultNote:
      "Distinguish audience-discovery platforms from platforms that permit adult-oriented monetization; verify policies.",
  },
  {
    category: "Community and membership platforms",
    example: "Private communities and memberships",
    why: "Retention, belonging, and deeper member relationships.",
    adultNote:
      "Verify current eligibility, identity-verification, and adult-content policies before use.",
  },
  {
    category: "Creator portfolio / personal website",
    example: "Self-hosted site",
    why: "Brand home that you control, independent of platform risk.",
    adultNote: "You remain responsible for applicable laws and consent documentation.",
  },
];
