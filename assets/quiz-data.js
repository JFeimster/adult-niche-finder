/**
 * Quiz definitions: answer options mapped to archetype weights.
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

export const QUIZ_QUESTIONS = [
  {
    id: "motivation",
    type: "single",
    title: "What brought you here?",
    subtitle: "The honest reason is usually the strongest signal.",
    options: [
      {
        value: "connection",
        label: "Real connection & intimacy",
        description: "I want to build something warm with a specific audience.",
        archetypes: { "soft-gfe": 6, cam: 3, "edu-coach": 2 },
      },
      {
        value: "expression",
        label: "Creative self-expression",
        description: "I want to make art that did not exist before.",
        archetypes: { "alt-goth": 3, cosplay: 2, "soft-gfe": 2 },
      },
      {
        value: "income",
        label: "Financial independence",
        description: "I want a real business with a real income stream.",
        archetypes: { "glam-luxury-muse": 3, "fitness-fantasy": 2, "edu-coach": 2 },
      },
      {
        value: "performance",
        label: "Performance & stage energy",
        description: "I want to command a room and hold attention.",
        archetypes: { cam: 6, dominant: 4, cosplay: 2 },
      },
      {
        value: "identity",
        label: "Personal identity & self-discovery",
        description: "I want to become someone I am proud of.",
        archetypes: { "soft-gfe": 3, "edu-coach": 3, dominant: 2 },
      },
    ],
  },
  {
    id: "personality",
    type: "single",
    title: "How would your creator persona come across?",
    subtitle: "Pick the energy that feels like you, only louder.",
    options: [
      {
        value: "warm",
        label: "Warm & nurturing",
        description: "The room feels softer when I walk in.",
        archetypes: { "soft-gfe": 7, "edu-coach": 2 },
      },
      {
        value: "glamorous",
        label: "Glamorous & polished",
        description: "Elegance is the whole point.",
        archetypes: { "glam-luxury-muse": 7, "fitness-fantasy": 2 },
      },
      {
        value: "commanding",
        label: "Commanding & confident",
        description: "Presence is a tool, not an accident.",
        archetypes: { dominant: 7, cam: 2, "fitness-fantasy": 2 },
      },
      {
        value: "playful",
        label: "Playful & teasing",
        description: "I flirt through vibes, not words.",
        archetypes: { cam: 3, cosplay: 2, "soft-gfe": 2 },
      },
      {
        value: "mysterious",
        label: "Mysterious & artistic",
        description: "The allure lives in what I do not say.",
        archetypes: { "alt-goth": 5, "edu-coach": 2 },
      },
      {
        value: "calm",
        label: "Calm & centered",
        description: "I lead quietly and it makes noise.",
        archetypes: { "edu-coach": 4, "soft-gfe": 3 },
      },
    ],
  },
  {
    id: "visualIdentity",
    type: "multi",
    title: "Which aesthetics speak to you?",
    subtitle: "You can pick more than one lane.",
    allowMultiple: true,
    minSelected: 1,
    options: [
      { value: "luxury", label: "Luxury & elegance", archetypes: { "glam-luxury-muse": 6 } },
      { value: "alternative", label: "Alternative & edgy", archetypes: { "alt-goth": 6 } },
      { value: "athletic", label: "Athletic & physical", archetypes: { "fitness-fantasy": 6 } },
      { value: "colorful", label: "Colorful & playful", archetypes: { cosplay: 4, cam: 2 } },
      { value: "minimalist", label: "Minimalist & clean", archetypes: { "anonymous-faceless": 3, "glam-luxury-muse": 2 } },
      { value: "character", label: "Character-driven", archetypes: { cosplay: 6 } },
    ],
  },
  {
    id: "cameraComfort",
    type: "single",
    title: "How do you feel about being on camera?",
    subtitle: "Your answer sets the privacy floor for your persona.",
    options: [
      { value: "faceVisible", label: "Face visible", description: "My expression is part of the brand.", archetypes: { "glam-luxury-muse": 2, "fitness-fantasy": 2 } },
      { value: "partial", label: "Partially visible", description: "Body, silhouette, or angles over the face.", archetypes: { dominant: 2, "fitness-fantasy": 1, "glam-luxury-muse": 1 } },
      { value: "anonymous", label: "Completely anonymous", description: "The persona leads; I stay behind it.", archetypes: { "anonymous-faceless": 8, "soft-gfe": 2 } },
    ],
  },
  {
    id: "formats",
    type: "multi",
    title: "Which formats are you excited to explore?",
    subtitle: "Select every format that sparks something.",
    allowMultiple: true,
    minSelected: 1,
    options: [
      { value: "photography", label: "Photography", archetypes: { "glam-luxury-muse": 3, "fitness-fantasy": 2 } },
      { value: "prerecordedVideo", label: "Prerecorded video", archetypes: { "glam-luxury-muse": 2, cosplay: 3, "fitness-fantasy": 2 } },
      { value: "liveSessions", label: "Live sessions", archetypes: { cam: 7, dominant: 2 } },
      { value: "writing", label: "Writing & storytelling", archetypes: { "soft-gfe": 3, "edu-coach": 2 } },
      { value: "audio", label: "Audio & voice", archetypes: { "edu-coach": 3, "soft-gfe": 2 } },
      { value: "tutorials", label: "Tutorials & teaching", archetypes: { "edu-coach": 5, "fitness-fantasy": 2 } },
    ],
  },
  {
    id: "engagement",
    type: "single",
    title: "How do you want people to feel around you?",
    options: [
      { value: "community", label: "Community & belonging", archetypes: { "soft-gfe": 5 } },
      { value: "entertainment", label: "Entertainment & spectacle", archetypes: { cam: 5, cosplay: 2 } },
      { value: "education", label: "Learning & confidence", archetypes: { "edu-coach": 6 } },
      { value: "performance", label: "Performance & fantasy play", archetypes: { cam: 4, dominant: 4 } },
      { value: "storytelling", label: "Storytelling & lore", archetypes: { cosplay: 5, "soft-gfe": 2 } },
    ],
  },
  {
    id: "boundaries",
    type: "multi",
    title: "Which boundaries matter to you?",
    subtitle: "Your lane, your rules. Nothing here is shared.",
    allowMultiple: true,
    minSelected: 0,
    options: [
      { value: "privacy", label: "Strong privacy & anonymity", archetypes: { "anonymous-faceless": 5 } },
      { value: "liveInteraction", label: "Not open to live interaction", archetypes: { "anonymous-faceless": 2 } },
      { value: "publicMessaging", label: "No open public messaging", archetypes: { "soft-gfe": 2 } },
      { value: "roleplay", label: "Not here for roleplay", archetypes: { dominant: -2 } },
      { value: "publicVisibility", label: "Want no public visibility", archetypes: { "anonymous-faceless": 6 } },
      { value: "collaboration", label: "Open to consensual collaboration", archetypes: { couple: 5 } },
    ],
  },
  {
    id: "strengths",
    type: "single",
    title: "Where do you already shine?",
    options: [
      { value: "fitness", label: "Fitness & athletic discipline", archetypes: { "fitness-fantasy": 7 } },
      { value: "styling", label: "Styling & personal aesthetic", archetypes: { "glam-luxury-muse": 5 } },
      { value: "cosplay", label: "Cosplay & character performance", archetypes: { cosplay: 7 } },
      { value: "teaching", label: "Teaching & communication", archetypes: { "edu-coach": 5 } },
      { value: "conversation", label: "Conversation & connection", archetypes: { "soft-gfe": 5 } },
      { value: "performance", label: "Performance & stagecraft", archetypes: { dominant: 5 } },
    ],
  },
  {
    id: "collaboration",
    type: "single",
    title: "How do you want to create?",
    options: [
      { value: "solo", label: "Solo creation", archetypes: { "soft-gfe": 2, "fitness-fantasy": 2 } },
      { value: "collab", label: "Consensual adult collaboration", archetypes: { couple: 7 } },
    ],
  },
  {
    id: "capacity",
    type: "single",
    title: "Where are you starting from?",
    options: [
      { value: "launchNow", label: "Ready to launch now", archetypes: { "fitness-fantasy": 2, cam: 2 } },
      { value: "launchLow", label: "Ready, but low production energy", archetypes: { "soft-gfe": 2, "edu-coach": 2 } },
      { value: "planning", label: "Planning & refining identity", archetypes: { "glam-luxury-muse": 2, "edu-coach": 2 } },
      { value: "exploring", label: "Exploring before I commit", archetypes: { "alt-goth": 2 } },
    ],
  },
];

export const QUESTION_COUNT = QUIZ_QUESTIONS.length;
export const FOLLOW_UP_QUESTIONS = [
  {
    id: "followupIntensity",
    type: "single",
    title: "How intense should the persona energy be?",
    subtitle: "A refinement for the lane you revealed.",
    options: [
      { value: "soft", label: "Soft & gentle", archetypes: { "soft-gfe": 6, "edu-coach": 2 } },
      { value: "balanced", label: "Balanced", archetypes: { glam: 2, fitness: 2 } },
      { value: "bold", label: "Bold & commanding", archetypes: { cam: 6, dominant: 4 } },
    ],
  },
  {
    id: "followupAudience",
    type: "single",
    title: "How public should the journey be?",
    subtitle: "How much of the story you share changes the lane.",
    options: [
      { value: "private", label: "Private", archetypes: { "anonymous-faceless": 6, "soft-gfe": 2 } },
      { value: "shared", label: "Shared with close circle", archetypes: { "soft-gfe": 2, couple: 2 } },
      { value: "open", label: "Open", archetypes: { glam: 3, cam: 3 } },
    ],
  },
];

export const FOLLOW_UP_QUESTION_COUNT = FOLLOW_UP_QUESTIONS.length;
export const ESTIMATED_MINUTES = 3;
