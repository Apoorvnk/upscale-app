import { useState, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, Check, Flame, Target, Sparkles, TrendingUp,
  PlayCircle, HelpCircle, Eye, Megaphone, Users, LayoutGrid, X,
  Lock, Gift, ChevronRight, Calendar, Ticket, ShieldCheck, IndianRupee, Handshake, Globe,
  Plus, Newspaper, BookOpen, Search, Upload, Receipt
} from "lucide-react";

const NAVY = "#0F2E7A";
const BLUE = "#2955E0";
const BLUE_BG = "#EAF0FD";
const ORANGE = "#E8672B";

// Real numbers come from the VITE_ADMIN_CONTACTS build-time env var (comma
// separated), never committed to the repo — see .env.example. Matching
// contacts log in straight to the Admin view, bypassing the normal flow.
const ADMIN_CONTACTS = (import.meta.env.VITE_ADMIN_CONTACTS || "")
  .split(",")
  .map((n) => n.trim())
  .filter(Boolean);

const CURATED = {
  "Home loan advisory": {
    trend: "Balance-transfer + top-up loans are the fastest-growing product this quarter, as existing borrowers chase lower rates.",
    update: "A local advisor reported 3 new client calls this morning after last week's rate news.",
    successStory: "An advisor in Kothrud closed 4 loans this month after switching to a written fee breakdown.",
    video: { title: "How to explain processing fees so clients don't drop off", duration: "4 min" },
    quiz: [
      { q: "What does a steady repo rate usually mean for existing borrowers?", options: ["EMI likely stays similar", "EMI always drops", "Loan gets cancelled"], correct: 0 },
      { q: "What's the biggest driver of lead drop-off mentioned today?", options: ["Distance to branch", "Unexplained processing fees", "Loan tenure"], correct: 1 },
    ],
    events: [
      { name: "Pune Real Estate & Home Finance Expo", date: "14 Sept", price: "₹499", type: "Expo", venue: "JW Marriott, Pune", stars: 5, secured: true },
      { name: "NBFC-Bank Lending Roundtable", date: "22 Sept", price: "Free", type: "Networking", venue: "Lemon Tree Premier, Pune", stars: 3, secured: true },
    ],
    bookSuggestions: [
      { title: "The Trusted Advisor", author: "David H. Maister", why: "On earning client trust fast — core to closing loans where clients are anxious about fees and terms." },
      { title: "Influence", author: "Robert Cialdini", why: "The psychology behind why clients say yes — useful for explaining terms without sounding like a pitch." },
    ],
    analytics: {
      demand: [42, 48, 55, 60, 58, 66],
      demandChangePct: 8,
      insight: "Enquiries typically rise after rate announcements — this week's steady repo rate is a good outreach moment.",
    },
    ad: {
      advertiser: "BuildRight Loan Comparison",
      headline: "Compare top lender rates before your next client call",
      body: "See live processing fees and interest rates across 12 lenders, side by side.",
      cta: "Compare rates",
    },
  },
  "Insurance advisory": {
    trend: "Term insurance with a critical-illness rider is the fastest-growing policy type this quarter.",
    update: "Renewal reminders sent this week are seeing a noticeably higher response rate.",
    successStory: "An agent in Baner grew renewals 20% after adopting a simple pre-call checklist.",
    video: { title: "A 60-second policy recap script that improves renewals", duration: "6 min" },
    quiz: [
      { q: "What was recently updated by IRDAI?", options: ["Premium GST", "Claim settlement timelines", "Agent licensing exam"], correct: 1 },
      { q: "What tends to improve renewal response?", options: ["Longer emails", "A short recap video", "Discount coupons"], correct: 1 },
    ],
    events: [
      { name: "Insurance Agents' Summit", date: "18 Sept", price: "₹799", type: "Summit", venue: "Hyatt Regency, Pune", stars: 5, secured: true },
      { name: "IRDAI Compliance Update Webinar", date: "10 Sept", price: "Free", type: "Webinar", venue: "Online", stars: null, secured: false },
    ],
    bookSuggestions: [
      { title: "Exactly What to Say", author: "Phil M. Jones", why: "Short, specific phrases for renewal calls that avoid sounding scripted." },
      { title: "The Greatest Salesman in the World", author: "Og Mandino", why: "A classic on persistence and habit-building in relationship-driven sales." },
    ],
    analytics: {
      demand: [50, 52, 49, 57, 61, 64],
      demandChangePct: 5,
      insight: "Renewal-season enquiries are trending up — claim settlement news is a good conversation opener right now.",
    },
    ad: {
      advertiser: "PolicyDesk for Agents",
      headline: "Bundle quotes from top insurers into one client-ready PDF",
      body: "Stop switching between portals — generate comparison sheets in under a minute.",
      cta: "Try free",
    },
  },
  "Sports retail": {
    trend: "Football boots and turf-training shoes are the fastest-moving category right now, ahead of school sports season.",
    update: "Weekend footfall is already ticking up ahead of the season.",
    successStory: "A store in Aundh doubled weekend sales by running a free kit-fitting session.",
    video: { title: "Running a monthly kids' coaching camp to drive repeat visits", duration: "5 min" },
    quiz: [
      { q: "When does footfall typically start rising before school sports season?", options: ["Same week", "2-3 weeks prior", "1 day before"], correct: 1 },
      { q: "What repeat-visit idea was covered today?", options: ["Monthly coaching camp", "Flash sale", "Loyalty card only"], correct: 0 },
    ],
    events: [
      { name: "Retail Sports Trade Fair", date: "20 Sept", price: "₹599", type: "Trade fair", venue: "Sheraton Grand, Pune", stars: 5, secured: true },
      { name: "Local School Sports Sponsors Meet", date: "5 Sept", price: "Free", type: "Networking", venue: "Ginger, Pune", stars: 3, secured: true },
    ],
    bookSuggestions: [
      { title: "The Retail Doctor's Guide to Growing Your Business", author: "Bob Phibbs", why: "Practical, store-floor-level advice for independent retailers, not big-box theory." },
      { title: "Delivering Happiness", author: "Tony Hsieh", why: "On building repeat customers through service — relevant to coaching-camp style loyalty plays." },
    ],
    analytics: {
      demand: [30, 35, 44, 58, 70, 68],
      demandChangePct: 15,
      insight: "Footfall is climbing ahead of school sports season — the next 2-3 weeks are your peak window.",
    },
    ad: {
      advertiser: "SportsSource Wholesale",
      headline: "Bulk pricing on jerseys, kits, and coaching gear",
      body: "Stock up ahead of season demand — minimum order discounts for independent retailers.",
      cta: "Get catalog",
    },
  },
  "General business": {
    trend: "Same-day-response service add-ons are the fastest-growing offering among local businesses right now.",
    update: "Businesses following up within a day are converting noticeably better this week.",
    successStory: "A local service business cut no-shows in half with a same-day confirmation text.",
    video: { title: "A simple weekly check-in habit that doubles repeat customers", duration: "5 min" },
    quiz: [
      { q: "What's flagged as a bigger risk than competition?", options: ["Inconsistent follow-up", "Too many products", "High rent"], correct: 0 },
      { q: "What habit was suggested today?", options: ["Weekly check-ins", "Monthly newsletter only", "Yearly review"], correct: 0 },
    ],
    events: [
      { name: "SME Owners' Networking Breakfast", date: "12 Sept", price: "₹299", type: "Networking", venue: "Lemon Tree Premier, Pune", stars: 3, secured: true },
      { name: "Small Business Growth Webinar", date: "8 Sept", price: "Free", type: "Webinar", venue: "Online", stars: null, secured: false },
    ],
    bookSuggestions: [
      { title: "The E-Myth Revisited", author: "Michael Gerber", why: "On why working IN the business isn't the same as building one that runs without you." },
      { title: "Traction", author: "Gino Wickman", why: "A simple operating system for getting a small team aligned on priorities." },
    ],
    analytics: {
      demand: [55, 54, 58, 56, 60, 63],
      demandChangePct: 5,
      insight: "Businesses responding same-day are converting noticeably better this week than those following up later.",
    },
    ad: {
      advertiser: "Zenbooks Accounting",
      headline: "Simple accounting built for small business owners",
      body: "Invoicing, GST filing, and follow-up reminders in one app — no accountant required.",
      cta: "Start free trial",
    },
  },
  "Stock broking": {
    trend: "Options trading accounts are seeing the sharpest signup growth of any product this quarter.",
    update: "Client queries about margin changes have picked up this week.",
    successStory: "A broker in Pune retained 90% of anxious clients by proactively explaining the change.",
    video: { title: "Explaining margin changes to retail clients without losing them", duration: "5 min" },
    quiz: [
      { q: "What's changing this month, per today's trend?", options: ["Demat account fees", "Intraday margin norms", "Trading hours"], correct: 1 },
      { q: "What's the risk when explaining margin changes poorly?", options: ["Losing retail clients", "Higher brokerage", "Slower settlement"], correct: 0 },
    ],
    events: [
      { name: "Share Market Investors' Summit", date: "16 Sept", price: "₹999", type: "Summit", venue: "JW Marriott, Pune", stars: 5, secured: true },
      { name: "SEBI Regulatory Update Webinar", date: "9 Sept", price: "Free", type: "Webinar", venue: "Online", stars: null, secured: false },
    ],
    bookSuggestions: [
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", why: "Understand the biases driving client panic during margin or volatility news." },
      { title: "The Psychology of Money", author: "Morgan Housel", why: "Short, client-friendly stories that reframe risk — useful talking points for anxious traders." },
    ],
    analytics: {
      demand: [40, 46, 52, 61, 59, 57],
      demandChangePct: -3,
      insight: "Client queries about margin changes have picked up — proactive explainers are outperforming reactive ones this week.",
    },
    ad: {
      advertiser: "TradeMint Terminal",
      headline: "Real-time market data and margin alerts for retail brokers",
      body: "Flag margin-call risk before clients call you — live monitoring across all their positions.",
      cta: "See pricing",
    },
  },
  "Mutual fund advisory": {
    trend: "Small-cap and flexi-cap SIPs are the fastest-growing fund category this quarter.",
    update: "Clients who get a mid-month check-in call are staying invested through dips.",
    successStory: "A distributor grew his SIP book 15% this quarter by sending monthly progress updates.",
    video: { title: "Turning a market dip into a client education moment", duration: "5 min" },
    quiz: [
      { q: "What hit a fresh high this quarter?", options: ["Lump-sum withdrawals", "SIP inflows", "Exit loads"], correct: 1 },
      { q: "What's the suggested angle during a market dip?", options: ["Stay silent", "Client education", "Push new schemes only"], correct: 1 },
    ],
    events: [
      { name: "Mutual Fund Distributors' Conclave", date: "19 Sept", price: "₹699", type: "Conclave", venue: "Hyatt Regency, Pune", stars: 5, secured: true },
      { name: "AMFI Continuing Education Webinar", date: "11 Sept", price: "Free", type: "Webinar", venue: "Online", stars: null, secured: false },
    ],
    bookSuggestions: [
      { title: "The Psychology of Money", author: "Morgan Housel", why: "Reframes market dips as behavior, not math — good material for client check-in calls." },
      { title: "Let's Talk Money", author: "Monika Halan", why: "India-specific, plain-language framing of investing basics clients actually relate to." },
    ],
    analytics: {
      demand: [48, 53, 60, 65, 70, 74],
      demandChangePct: 6,
      insight: "SIP inflows are at a fresh quarterly high — clients getting a mid-month check-in are staying invested through dips.",
    },
    ad: {
      advertiser: "Groww for Partners",
      headline: "Onboard clients to SIPs in under 5 minutes",
      body: "Paperless KYC and fund selection your clients can complete from their phone.",
      cta: "Learn more",
    },
  },
  "Jewelry retail": {
    subcategories: {
      "precious-metal": {
        label: "Precious metal jewellery (gold, silver, diamond)",
        trend: "Lightweight daily-wear gold pieces (under 10g) are the fastest-selling category right now, ahead of heavier bridal sets.",
        update: "Footfall for wedding-season bookings is picking up earlier than usual this year.",
        successStory: "A jeweler in Camp grew bridal bookings 30% by offering fixed-rate price locks.",
        video: { title: "Turning gold-rate anxiety into a booked sale", duration: "5 min" },
        quiz: [
          { q: "What's happened to gold rates this week, per today's trend?", options: ["Stabilized", "Doubled", "Fell to zero"], correct: 0 },
          { q: "What's the suggested angle today?", options: ["Fixed-rate booking", "Discount everything", "Wait and see"], correct: 0 },
        ],
      },
      "imitation-fashion": {
        label: "Imitation / fashion jewellery",
        trend: "Layered chain-and-pendant sets inspired by festive reels are the fastest-selling fashion jewellery category right now.",
        update: "Customers are increasingly walking in already knowing the exact style they saw on social media, and expect stores to have it or match it fast.",
        successStory: "A fashion jewellery store in Camp doubled Instagram-driven walk-ins by posting new arrivals daily instead of weekly.",
        video: { title: "Using Instagram reels to sell fashion jewellery faster", duration: "5 min" },
        quiz: [
          { q: "What are fashion jewellery customers mainly shopping by?", options: ["Metal price", "Look/style trend", "Certification"], correct: 1 },
          { q: "What's driving faster walk-ins in the success story?", options: ["Daily social posts", "Print ads", "Discount coupons"], correct: 0 },
        ],
      },
    },
    events: [
      { name: "Jewelry Trade & Design Expo", date: "21 Sept", price: "₹599", type: "Expo", venue: "JW Marriott, Pune", stars: 5, secured: true },
      { name: "Local Jewellers' Association Meet", date: "6 Sept", price: "Free", type: "Networking", venue: "Ginger, Pune", stars: 3, secured: true },
    ],
    collab: {
      offers: [
        { text: "Jewelry Display Furniture Co. — custom counters, 2-week turnaround, Pune based", from: "Collaborator" },
        { text: "Certified Gemologist available for in-store consultation days", from: "Collaborator" },
        { text: "Jewelry photography studio — offering catalog shoots for local stores", from: "Collaborator" },
      ],
      requests: [
        { text: "Looking for a reliable jewelry display furniture supplier nearby", from: "Proprietor request" },
        { text: "Open to a parallel-business tie-up with a bridal wear store", from: "Proprietor request" },
      ],
      external: [
        { name: "India Jewellery Show — Pune", date: "30–31 Aug 2026", venue: "Pune", url: "https://namasteindiaevents.com/india-jewellery-show" },
        { name: "Bharat Silver Show 2026", date: "5–7 Sept 2026", venue: "Auto Cluster Exhibition Center, Pune", url: "https://exhibitionglobe.com/bharat-silver-show-2026/" },
        { name: "14th Delhi Jewellery & Gem Fair", date: "26–28 Sept 2026", venue: "Pragati Maidan, New Delhi", url: "https://www.tradeindia.com/tradeshows/jewelry-gemstones/" },
      ],
    },
    bookSuggestions: [
      { title: "The Retail Doctor's Guide to Growing Your Business", author: "Bob Phibbs", why: "Floor-level retail sales tactics that apply whether you're selling gold or fashion pieces." },
      { title: "Selling the Invisible", author: "Harry Beckwith", why: "On selling trust and experience, not just the product — relevant to both jewellery segments." },
    ],
    analytics: {
      demand: [45, 50, 58, 63, 69, 72],
      demandChangePct: 4,
      insight: "Wedding-season bookings are picking up earlier than usual this year across both precious and fashion segments.",
    },
    ad: {
      advertiser: "GoldCraft Tools & Supplies",
      headline: "Professional jewellery display and tools, wholesale pricing",
      body: "Counters, lighting, and gemological tools shipped nationwide for independent stores.",
      cta: "Shop wholesale",
    },
  },
};

const INTEREST_NAMES = [
  "Home loan advisory", "Insurance advisory", "Sports retail", "General business",
  "Mutual fund advisory", "Wealth management", "Tax consultancy", "Chartered accountancy",
  "Stock broking", "Credit card / lending advisory", "Real estate brokerage", "Interior design",
  "Construction contracting", "Architecture practice", "Property management",
  "Apparel retail", "Electronics retail", "Grocery retail", "Furniture retail", "Jewelry retail",
  "Footwear retail", "Bookstore retail", "Toy retail", "Stationery retail",
  "Restaurant", "Cafe", "Cloud kitchen", "Catering services", "Bakery", "Ice cream parlour",
  "Tuition classes", "Coaching institute", "Preschool", "Skill training academy", "Music school",
  "Dance academy", "Art classes",
  "Dental clinic", "Physiotherapy clinic", "Diagnostic lab", "Pharmacy", "Optical store",
  "Ayurveda / wellness clinic", "Veterinary clinic",
  "Salon", "Spa", "Gym / fitness studio", "Yoga studio", "Nutrition consultancy",
  "Digital marketing agency", "Legal practice", "Recruitment agency", "Event management",
  "Photography studio", "Video production", "Graphic design studio", "IT services / freelancing",
  "Web development agency", "PR / communications consultancy", "HR consultancy",
  "Car dealership", "Two-wheeler dealership", "Auto repair garage", "Auto parts trading",
  "Travel agency", "Tour operator", "Logistics / transport services", "Courier services",
  "Textile manufacturing", "Garment manufacturing", "FMCG distribution", "Wholesale trading",
  "Import-export trading", "Packaging supplier",
  "Cleaning services", "Pest control services", "Security services",
  "Interior painting contractor", "Plumbing services", "Electrical contracting",
  "Wedding planning", "Florist", "Gift shop", "Pet grooming / boarding",
  "Daycare services", "Elder care services", "Co-working space operator",
  "Hotel / guesthouse management", "Homestay hosting", "Manufacturing (general SME)",
];

function slugify(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function genericContent(name) {
  const lower = name.toLowerCase();
  return {
    trend: `Fast-turnaround, same-day offerings are the fastest-growing product type among ${lower} businesses right now.`,
    update: `Businesses in ${lower} that responded fastest to inquiries this week saw better conversion.`,
    successStory: `A ${lower} business nearby grew simply by fixing one overlooked, everyday process.`,
    video: { title: `A quick habit that helps most ${lower} businesses`, duration: "5 min" },
    quiz: [
      { q: `What's a common risk called out for ${lower} businesses today?`, options: ["Pricing pressure", "Too much staff", "Excess inventory only"], correct: 0 },
      { q: "What kind of response tends to convert better?", options: ["Same-day response", "Next-week response", "No response needed"], correct: 0 },
    ],
    events: [
      { name: `${name} Owners' Networking Meet`, date: "This month", price: "₹299", type: "Networking", venue: "Lemon Tree Premier, Pune", stars: 3, secured: true },
      { name: `${name} Growth Webinar`, date: "This month", price: "Free", type: "Webinar", venue: "Online", stars: null, secured: false },
    ],
    collab: {
      offers: [
        { text: `${name} Consultant offering partnership support`, from: "Collaborator" },
        { text: `${name} Suppliers Network — Pune based`, from: "Collaborator" },
      ],
      requests: GENERIC_COLLAB_REQUESTS(name),
      external: [],
    },
    bookSuggestions: [
      { title: "The E-Myth Revisited", author: "Michael Gerber", why: "On why working IN the business isn't the same as building one that runs without you." },
      { title: "Never Split the Difference", author: "Chris Voss", why: "Negotiation tactics that apply to pricing conversations in almost any business." },
    ],
    analytics: {
      demand: [45, 48, 50, 55, 58, 60],
      demandChangePct: 5,
      insight: `Businesses in ${lower} that respond fastest to inquiries this week are seeing better conversion.`,
    },
    ad: {
      advertiser: `${name} Growth Toolkit`,
      headline: `Tools and resources built for ${lower} businesses`,
      body: `Templates, checklists, and supplier contacts curated for ${lower}.`,
      cta: "Explore",
    },
  };
}
const SUBJECTS = Object.fromEntries(
  INTEREST_NAMES.map((name) => [slugify(name), { name, ...(CURATED[name] || genericContent(name)) }])
);

// Some subjects (e.g. Jewelry retail) are too broad for one set of daily
// content — a "precious metal" jeweler and an "imitation/fashion" jeweler
// need different trend/update/story content. Where subcategories exist,
// events/collab/bookSuggestions/analytics stay shared at the parent level;
// only the daily-content fields are subcategory-specific.
function resolveSubject(interestKey, subcategoryKey) {
  const base = SUBJECTS[interestKey];
  if (!base?.subcategories) return base;
  const subKeys = Object.keys(base.subcategories);
  const sub = base.subcategories[subcategoryKey] || base.subcategories[subKeys[0]];
  const { subcategories: _subcategories, ...shared } = base;
  return { ...shared, ...sub };
}
function getOnbSteps(interestKey) {
  const base = ["interest", "name", "contact", "city", "shopName", "shopType", "investment", "facebook", "instagram"];
  if (SUBJECTS[interestKey]?.subcategories) base.splice(1, 0, "subcategory");
  return base;
}

const MOCK_FIRMS = [
  { name: "R. Deshpande", role: "proprietor", subject: "Home loan advisory", target: "Close 10 loans this quarter", daysDone: 12, streak: 6 },
  { name: "A. Kulkarni", role: "proprietor", subject: "Insurance advisory", target: "Grow renewal rate to 80%", daysDone: 4, streak: 2 },
  { name: "S. Patwardhan", role: "collaborator", subject: "Sports retail", target: "Launch a coaching camp", daysDone: 9, streak: 4, plan: "₹600/year" },
];

const COLLAB_STEPS = ["name", "businessName", "expertise", "city", "govId"];
function GENERIC_COLLAB_REQUESTS(name) {
  return [
    { text: `Looking for a reliable ${name?.toLowerCase() || "business"} partner nearby`, from: "Proprietor request" },
    { text: `Open to a parallel-business collaboration in ${name || "this field"}`, from: "Proprietor request" },
  ];
}
const PERIODS = ["Monthly", "Quarterly", "Semi-yearly", "Annually"];
const PERIOD_DAYS = { "Monthly": 30, "Quarterly": 90, "Semi-yearly": 182, "Annually": 365 };
const PERIOD_KEYS = { "Monthly": "periodMonthly", "Quarterly": "periodQuarterly", "Semi-yearly": "periodSemiYearly", "Annually": "periodAnnually" };

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const LANGUAGES = { en: "English", hi: "हिंदी", mr: "मराठी" };

// Covers the highest-traffic screens (Welcome, Onboarding, Goal, main nav,
// Loop stage headers). Deeper screens (Admin, Collaborator dashboard,
// Recommendations/Analytics/Progress tab bodies) stay English for now —
// AI-generated content (guidance/plan/marketing) is translated separately
// by instructing the model directly, not through this dictionary.
const STRINGS = {
  en: {
    tagline: "Observe. Execute. Reward. Grow.",
    welcomeSub: "Two ways in — choose the one that's you.",
    chooseLanguage: "Choose your language",
    signUpProprietor: "Sign up as Proprietor",
    proprietorDesc: "I run my own business — free to join",
    signUpCollaborator: "Sign up as Collaborator",
    collaboratorDesc: "I help/work with businesses — from ₹100/month",
    alreadyHaveAccount: "Already have an account? Log in",
    qInterestProprietor: "What's your area of interest?",
    qInterestCollaborator: "What's your area of expertise?",
    qSubcategory: "More specifically, what kind of {subject} is it?",
    qName: "What's your name?",
    qContact: "Your contact number / WhatsApp",
    qCity: "Which city are you based in?",
    qShopName: "What's your shop name?",
    qShopType: "Is it a shop, or do you work from home?",
    shopTypeShop: "Shop / storefront",
    shopTypeHome: "From home",
    qInvestment: "What's your basic investment?",
    qFacebook: "Your Facebook profile or page link (optional)",
    qInstagram: "Your Instagram link (optional)",
    optional: "Optional",
    back: "Back",
    next: "Next",
    setMyGoal: "Set my goal",
    setYourGoal: "Set your goal",
    workingToward: "What are you working toward, {name}?",
    goalHint: "A real goal, not just a number — e.g. \"start my own {subject} firm.\"",
    goalPlaceholder: "Your goal for this period",
    overWhatPeriod: "Over what period?",
    periodMonthly: "Monthly",
    periodQuarterly: "Quarterly",
    periodSemiYearly: "Semi-yearly",
    periodAnnually: "Annually",
    goalFixedNote: "Your goal is fixed for this period — it can't be edited until it ends.",
    freeCoreApp: "Upscale's core app is completely free for proprietors.",
    continueBtn: "Continue",
    freePlan: "Free plan",
    dayStreak: "day streak",
    tabLoop: "Loop",
    tabProgress: "Progress",
    tabCollaborate: "Collaborate",
    tabRecommendations: "Recommendations",
    tabAnalytics: "Analytics",
    tabMarketing: "Marketing",
    stageContent: "Today's content",
    stageObservation: "Observation",
    stageGuidance: "Guidance",
    stageCollaboration: "Collaboration",
    updateLabel: "Update",
    trendLabel: "Trend",
    videoLabel: "Video",
    successStoryLabel: "Success story",
    readMore: "Read more →",
    continueToObservation: "Continue to observation",
    yourObservation: "Your observation",
    observationPrompt: "Based on today's update, trend, video, and success story{forLabel} — what's your overall observation?",
    forLabel: " for {label}",
    obsPlaceholder: "What have you noticed in your business this week?",
    getGuidance: "Get guidance",
    yourGuidance: "Your guidance",
    guidanceThinking: "Thinking through your goal...",
    unlockCollaboration: "Unlock collaboration",
    yourPlan: "Your plan",
    towardPrefix: "Toward:",
    overTheNext: "Over the next {period}, here's how we'll get there.",
    buildingPlan: "Building your plan...",
    yearlyTier: "Yearly",
    dailyLoopNote: "Each day: content → observation → guidance → collaboration. Complete it daily to stay on track.",
    daysCompleted: "{done}/{total} days completed",
    startTodaysLoop: "Start today's loop",
    yourGoalLabel: "Your goal",
    overPeriodShort: "over {period}",
  },
  hi: {
    tagline: "देखें। करें। इनाम पाएं। बढ़ें।",
    welcomeSub: "शुरू करने के दो तरीके — जो आप पर लागू हो उसे चुनें।",
    chooseLanguage: "अपनी भाषा चुनें",
    signUpProprietor: "मालिक के रूप में साइन अप करें",
    proprietorDesc: "मैं अपना खुद का व्यवसाय चलाता/चलाती हूं — जुड़ना मुफ़्त है",
    signUpCollaborator: "सहयोगी के रूप में साइन अप करें",
    collaboratorDesc: "मैं व्यवसायों की मदद करता/करती हूं — ₹100/माह से शुरू",
    alreadyHaveAccount: "पहले से खाता है? लॉग इन करें",
    qInterestProprietor: "आपकी रुचि का क्षेत्र क्या है?",
    qInterestCollaborator: "आपकी विशेषज्ञता का क्षेत्र क्या है?",
    qSubcategory: "अधिक स्पष्ट रूप से, यह किस तरह का {subject} है?",
    qName: "आपका नाम क्या है?",
    qContact: "आपका संपर्क नंबर / व्हाट्सएप",
    qCity: "आप किस शहर में हैं?",
    qShopName: "आपकी दुकान का नाम क्या है?",
    qShopType: "क्या यह एक दुकान है, या आप घर से काम करते हैं?",
    shopTypeShop: "दुकान",
    shopTypeHome: "घर से",
    qInvestment: "आपका बुनियादी निवेश कितना है?",
    qFacebook: "आपकी फेसबुक प्रोफ़ाइल या पेज लिंक (वैकल्पिक)",
    qInstagram: "आपकी इंस्टाग्राम लिंक (वैकल्पिक)",
    optional: "वैकल्पिक",
    back: "पीछे",
    next: "आगे",
    setMyGoal: "मेरा लक्ष्य तय करें",
    setYourGoal: "अपना लक्ष्य तय करें",
    workingToward: "{name}, आप किस दिशा में काम कर रहे हैं?",
    goalHint: "एक असली लक्ष्य, सिर्फ एक संख्या नहीं — जैसे \"अपनी खुद की {subject} फर्म शुरू करना।\"",
    goalPlaceholder: "इस अवधि के लिए आपका लक्ष्य",
    overWhatPeriod: "किस अवधि में?",
    periodMonthly: "मासिक",
    periodQuarterly: "त्रैमासिक",
    periodSemiYearly: "छमाही",
    periodAnnually: "वार्षिक",
    goalFixedNote: "इस अवधि के लिए आपका लक्ष्य तय है — यह खत्म होने तक बदला नहीं जा सकता।",
    freeCoreApp: "अपस्केल का मुख्य ऐप मालिकों के लिए पूरी तरह मुफ़्त है।",
    continueBtn: "जारी रखें",
    freePlan: "मुफ़्त योजना",
    dayStreak: "दिन की लगातार गिनती",
    tabLoop: "लूप",
    tabProgress: "प्रगति",
    tabCollaborate: "सहयोग",
    tabRecommendations: "सुझाव",
    tabAnalytics: "विश्लेषण",
    tabMarketing: "मार्केटिंग",
    stageContent: "आज की सामग्री",
    stageObservation: "अवलोकन",
    stageGuidance: "मार्गदर्शन",
    stageCollaboration: "सहयोग",
    updateLabel: "अपडेट",
    trendLabel: "ट्रेंड",
    videoLabel: "वीडियो",
    successStoryLabel: "सफलता की कहानी",
    readMore: "और पढ़ें →",
    continueToObservation: "अवलोकन पर जाएं",
    yourObservation: "आपका अवलोकन",
    observationPrompt: "आज के अपडेट, ट्रेंड, वीडियो और सफलता की कहानी{forLabel} के आधार पर — आपका समग्र अवलोकन क्या है?",
    forLabel: " {label} के लिए",
    obsPlaceholder: "इस हफ्ते आपने अपने व्यवसाय में क्या देखा?",
    getGuidance: "मार्गदर्शन पाएं",
    yourGuidance: "आपका मार्गदर्शन",
    guidanceThinking: "आपके लक्ष्य पर विचार कर रहे हैं...",
    unlockCollaboration: "सहयोग अनलॉक करें",
    yourPlan: "आपकी योजना",
    towardPrefix: "लक्ष्य:",
    overTheNext: "अगले {period} में, हम इस तरह वहां पहुंचेंगे।",
    buildingPlan: "आपकी योजना बनाई जा रही है...",
    yearlyTier: "वार्षिक",
    dailyLoopNote: "हर दिन: सामग्री → अवलोकन → मार्गदर्शन → सहयोग। ट्रैक पर बने रहने के लिए इसे रोज़ पूरा करें।",
    daysCompleted: "{done}/{total} दिन पूरे हुए",
    startTodaysLoop: "आज का लूप शुरू करें",
    yourGoalLabel: "आपका लक्ष्य",
    overPeriodShort: "{period} में",
  },
  mr: {
    tagline: "निरीक्षण करा. कृती करा. बक्षीस मिळवा. वाढ करा.",
    welcomeSub: "सुरुवात करण्याचे दोन मार्ग — जो तुम्हाला लागू होतो तो निवडा.",
    chooseLanguage: "तुमची भाषा निवडा",
    signUpProprietor: "मालक म्हणून साइन अप करा",
    proprietorDesc: "मी माझा स्वतःचा व्यवसाय चालवतो/चालवते — सामील होणे मोफत आहे",
    signUpCollaborator: "सहयोगी म्हणून साइन अप करा",
    collaboratorDesc: "मी व्यवसायांना मदत करतो/करते — ₹100/महिना पासून",
    alreadyHaveAccount: "आधीच खाते आहे? लॉग इन करा",
    qInterestProprietor: "तुमच्या आवडीचे क्षेत्र कोणते आहे?",
    qInterestCollaborator: "तुमच्या तज्ज्ञतेचे क्षेत्र कोणते आहे?",
    qSubcategory: "अधिक स्पष्टपणे, हे कोणत्या प्रकारचे {subject} आहे?",
    qName: "तुमचे नाव काय आहे?",
    qContact: "तुमचा संपर्क क्रमांक / व्हॉट्सअॅप",
    qCity: "तुम्ही कोणत्या शहरात आहात?",
    qShopName: "तुमच्या दुकानाचे नाव काय आहे?",
    qShopType: "हे दुकान आहे, की तुम्ही घरून काम करता?",
    shopTypeShop: "दुकान",
    shopTypeHome: "घरून",
    qInvestment: "तुमची मूळ गुंतवणूक किती आहे?",
    qFacebook: "तुमची फेसबुक प्रोफाइल किंवा पेज लिंक (ऐच्छिक)",
    qInstagram: "तुमची इन्स्टाग्राम लिंक (ऐच्छिक)",
    optional: "ऐच्छिक",
    back: "मागे",
    next: "पुढे",
    setMyGoal: "माझे ध्येय निश्चित करा",
    setYourGoal: "तुमचे ध्येय निश्चित करा",
    workingToward: "{name}, तुम्ही कशासाठी काम करत आहात?",
    goalHint: "एक खरे ध्येय, फक्त एक आकडा नाही — उदा. \"स्वतःची {subject} फर्म सुरू करणे.\"",
    goalPlaceholder: "या कालावधीसाठी तुमचे ध्येय",
    overWhatPeriod: "कोणत्या कालावधीत?",
    periodMonthly: "मासिक",
    periodQuarterly: "त्रैमासिक",
    periodSemiYearly: "सहामाही",
    periodAnnually: "वार्षिक",
    goalFixedNote: "या कालावधीसाठी तुमचे ध्येय निश्चित आहे — ते संपेपर्यंत बदलता येणार नाही.",
    freeCoreApp: "अपस्केलचे मुख्य अ‍ॅप मालकांसाठी पूर्णपणे मोफत आहे.",
    continueBtn: "पुढे सुरू ठेवा",
    freePlan: "मोफत योजना",
    dayStreak: "दिवसांची सलगता",
    tabLoop: "लूप",
    tabProgress: "प्रगती",
    tabCollaborate: "सहयोग",
    tabRecommendations: "शिफारसी",
    tabAnalytics: "विश्लेषण",
    tabMarketing: "मार्केटिंग",
    stageContent: "आजची सामग्री",
    stageObservation: "निरीक्षण",
    stageGuidance: "मार्गदर्शन",
    stageCollaboration: "सहयोग",
    updateLabel: "अपडेट",
    trendLabel: "ट्रेंड",
    videoLabel: "व्हिडिओ",
    successStoryLabel: "यशोगाथा",
    readMore: "अधिक वाचा →",
    continueToObservation: "निरीक्षणाकडे जा",
    yourObservation: "तुमचे निरीक्षण",
    observationPrompt: "आजचे अपडेट, ट्रेंड, व्हिडिओ आणि यशोगाथा{forLabel} यावर आधारित — तुमचे एकंदर निरीक्षण काय आहे?",
    forLabel: " {label} साठी",
    obsPlaceholder: "या आठवड्यात तुम्ही तुमच्या व्यवसायात काय लक्षात घेतले?",
    getGuidance: "मार्गदर्शन मिळवा",
    yourGuidance: "तुमचे मार्गदर्शन",
    guidanceThinking: "तुमच्या ध्येयाचा विचार करत आहोत...",
    unlockCollaboration: "सहयोग अनलॉक करा",
    yourPlan: "तुमची योजना",
    towardPrefix: "ध्येय:",
    overTheNext: "पुढील {period} मध्ये, आपण असे तिथे पोहोचू.",
    buildingPlan: "तुमची योजना तयार होत आहे...",
    yearlyTier: "वार्षिक",
    dailyLoopNote: "दररोज: सामग्री → निरीक्षण → मार्गदर्शन → सहयोग. ट्रॅकवर राहण्यासाठी हे दररोज पूर्ण करा.",
    daysCompleted: "{done}/{total} दिवस पूर्ण झाले",
    startTodaysLoop: "आजचा लूप सुरू करा",
    yourGoalLabel: "तुमचे ध्येय",
    overPeriodShort: "{period} मध्ये",
  },
};

function tr(lang, key, vars) {
  let str = (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
  if (vars) for (const k in vars) str = str.replace(`{${k}}`, vars[k]);
  return str;
}

// Fire-and-forget: pilot tracking must never block the app's own flow, so
// failures are logged and swallowed rather than surfaced to the user.
function logToSheet(payload) {
  fetch("/api/sheet-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((err) => console.error("logToSheet failed:", err));
}

// Downscales a photo client-side before it ever leaves the browser, so a
// full-resolution phone camera shot doesn't blow past serverless body-size
// limits or waste vision-API tokens on pixels we don't need.
function resizeImageFile(file, maxDim = 1200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Logo({ dark }) {
  return (
    <div className="flex items-center gap-2">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M9 4h4v13a3 3 0 0 0 6 0v-2.2l-2.1 2.1-1.4-1.4L20 11l4.5 4.5-1.4 1.4L21 14.8V17a7 7 0 0 1-14 0V4z" fill={BLUE} />
        <rect x="16.5" y="15.5" width="1.8" height="4" fill="#fff" opacity="0.9" />
        <rect x="19" y="13.5" width="1.8" height="6" fill="#fff" opacity="0.9" />
      </svg>
      <span className="text-sm font-medium" style={{ color: dark ? "#fff" : NAVY }}>Upscale</span>
    </div>
  );
}
function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="text-sm font-medium px-5 py-2.5 rounded-lg text-white flex items-center justify-center gap-1.5 disabled:opacity-40 transition-transform active:scale-95"
      style={{ background: ORANGE }}>
      {children}
    </button>
  );
}
function FadeIn({ children, keyProp }) { return <div key={keyProp} className="upscale-fadein">{children}</div>; }
function PlanTier({ title, items }) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">{title}</div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="rounded-lg p-3 border border-gray-200">
            <div className="text-sm font-medium" style={{ color: NAVY }}>{it.step}</div>
            <div className="text-xs text-gray-500 mt-0.5">{it.how}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UpscaleApp() {
  const [screen, setScreen] = useState("welcome");
  const [language, setLanguage] = useState("en");
  const t = (key, vars) => tr(language, key, vars);

  const [role, setRole] = useState(null);
  const [loginContact, setLoginContact] = useState("");
  const [obStep, setObStep] = useState(0);
  const [form, setForm] = useState({ interest: "home-loan-advisory", subcategory: "", name: "", contact: "", city: "", shopName: "", shopType: "", investment: "", facebook: "", instagram: "" });

  const [goal, setGoal] = useState("");
  const [period, setPeriod] = useState("Monthly");
  const [collabPlan, setCollabPlan] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  const [collabStep, setCollabStep] = useState(0);
  const [collabForm, setCollabForm] = useState({ name: "", businessName: "", expertise: "home-loan-advisory", city: "", govId: "" });
  const [collabTab, setCollabTab] = useState("requests");
  const [offerText, setOfferText] = useState("");
  const [myOffers, setMyOffers] = useState([]);
  const [eventForm, setEventForm] = useState({ name: "", date: "", venue: "", price: "" });
  const [myEvents, setMyEvents] = useState([]);
  const [propOfferText, setPropOfferText] = useState("");
  const [propRequests, setPropRequests] = useState([]);

  const [tab, setTab] = useState("loop");
  const [stage, setStage] = useState("content");
  const [contentDone, setContentDone] = useState(false);
  const [obsText, setObsText] = useState("");
  const [guiding, setGuiding] = useState(false);
  const [guidance, setGuidance] = useState(null);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [ticketsBought, setTicketsBought] = useState([]);
  const [adElapsed, setAdElapsed] = useState(0);
  const [adDone, setAdDone] = useState(false);
  const [leadPrompt, setLeadPrompt] = useState("");
  const [leadSearching, setLeadSearching] = useState(false);
  const [leadResults, setLeadResults] = useState(null);
  const [leadNote, setLeadNote] = useState(null);

  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [uploadingCost, setUploadingCost] = useState(false);
  const [uploadingSales, setUploadingSales] = useState(false);
  const [ledgerError, setLedgerError] = useState(null);

  const [daysDone, setDaysDone] = useState(0);
  const [streak, setStreak] = useState(0);

  const subject = resolveSubject(form.interest, form.subcategory);
  const onbSteps = getOnbSteps(form.interest);
  const totalDays = PERIOD_DAYS[period];
  const totalCosts = ledgerEntries.filter((e) => e.type === "cost").reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalSales = ledgerEntries.filter((e) => e.type === "sales").reduce((s, e) => s + Number(e.amount || 0), 0);
  const netAmount = totalSales - totalCosts;
  const obsComplete = obsText.trim().length > 0;

  // Rewarded ad: minimum 30s watch time, skip unlocks at 20s.
  useEffect(() => {
    if (stage !== "reward" || adDone) return;
    const id = setInterval(() => {
      setAdElapsed((e) => {
        if (e + 1 >= 30) {
          clearInterval(id);
          setAdDone(true);
          return 30;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [stage, adDone]);

  function skipAd() {
    if (adElapsed >= 20) setAdDone(true);
  }

  async function confirmTarget() {
    setScreen("plan");
    setPlanLoading(true);
    setPlanData(null);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, subjectName: subject.name, period, language }),
      });
      if (!res.ok) throw new Error(`generate-plan returned ${res.status}`);
      const data = await res.json();
      setPlanData(data);
    } catch (err) {
      console.error("confirmTarget plan generation failed:", err);
      setPlanData({
        monthly: [{ step: goal, how: "Break this into one small, concrete action you can take this week." }],
        quarterly: [{ step: `Review progress toward: ${goal}`, how: "Set aside 30 minutes to check what's working and adjust." }],
        yearly: { step: goal, how: "Revisit this goal each quarter and keep the daily loop going." },
      });
    } finally {
      setPlanLoading(false);
    }
  }

  function nextOnb() { if (obStep < onbSteps.length - 1) setObStep(obStep + 1); else setScreen("target"); }
  function backOnb() { if (obStep > 0) setObStep(obStep - 1); }

  async function submitObservation() {
    setStage("guidance");
    setGuiding(true);
    setGuidance(null);
    logToSheet({
      name: form.name,
      subject: subject.name,
      target: goal,
      city: form.city,
      contact: form.contact,
      date: todayStr(),
      observationText: obsText,
      streak,
    });
    try {
      const res = await fetch("/api/guide-observation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observationText: obsText, goal, subjectName: subject.name }),
      });
      if (!res.ok) throw new Error(`guide-observation returned ${res.status}`);
      const data = await res.json();
      setGuidance(data.guidance || "Keep going — consistency here is what compounds.");
    } catch (err) {
      console.error("submitObservation guidance failed:", err);
      setGuidance("We couldn't reach your coach just now — take a moment to think about one concrete step this observation suggests for tomorrow.");
    } finally {
      setGuiding(false);
    }
  }

  function claimReward() {
    logToSheet({
      name: form.name,
      subject: subject.name,
      target: goal,
      city: form.city,
      contact: form.contact,
      date: todayStr(),
      observationText: obsText,
      streak: streak + 1,
    });
    setDaysDone((d) => d + 1);
    setStreak((s) => s + 1);
    setContentDone(false);
    setObsText("");
    setGuidance(null);
    setRewardClaimed(false);
    setAdElapsed(0);
    setAdDone(false);
    setLeadPrompt("");
    setLeadResults(null);
    setLeadNote(null);
    setStage("content");
  }

  async function findLeads() {
    if (!leadPrompt.trim()) return;
    setLeadSearching(true);
    setLeadResults(null);
    setLeadNote(null);
    try {
      const res = await fetch("/api/find-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: leadPrompt, city: form.city }),
      });
      if (!res.ok) throw new Error(`find-leads returned ${res.status}`);
      const data = await res.json();
      setLeadResults(data.results || []);
      setLeadNote(data.note || null);
    } catch (err) {
      console.error("findLeads failed:", err);
      setLeadResults([]);
      setLeadNote("We couldn't run that search just now — please try again in a moment.");
    } finally {
      setLeadSearching(false);
    }
  }

  async function handleReceiptUpload(file, type) {
    if (!file) return;
    setLedgerError(null);
    if (type === "cost") setUploadingCost(true); else setUploadingSales(true);
    try {
      const dataUrl = await resizeImageFile(file);
      const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
      if (!match) throw new Error("Could not read image data");
      const [, mediaType, base64] = match;
      const res = await fetch("/api/extract-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType, type, name: form.name, contact: form.contact }),
      });
      if (!res.ok) throw new Error(`extract-receipt returned ${res.status}`);
      const data = await res.json();
      setLedgerEntries((entries) => [{ type, ...data }, ...entries]);
    } catch (err) {
      console.error("handleReceiptUpload failed:", err);
      setLedgerError("Couldn't read that photo — please try again with a clearer shot.");
    } finally {
      if (type === "cost") setUploadingCost(false); else setUploadingSales(false);
    }
  }

  const style = (
    <style>{`
      @keyframes upscaleFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      .upscale-fadein { animation: upscaleFadeIn 0.25s ease-out; }
    `}</style>
  );

  // --- Welcome ---
  if (screen === "welcome") {
    return (
      <div className="w-full min-h-[600px] rounded-xl flex flex-col items-center justify-center px-6 text-center" style={{ background: NAVY }}>
        {style}
        <Logo dark />
        <div className="flex gap-1.5 mt-5">
          {Object.entries(LANGUAGES).map(([code, label]) => (
            <button key={code} onClick={() => setLanguage(code)}
              className="text-xs font-medium px-2.5 py-1 rounded-full border"
              style={{ borderColor: language === code ? "#fff" : "rgba(255,255,255,0.25)", background: language === code ? "rgba(255,255,255,0.15)" : "transparent", color: language === code ? "#fff" : "#9FB0CC" }}>
              {label}
            </button>
          ))}
        </div>
        <h1 className="text-2xl font-medium text-white mt-4 mb-2">{t("tagline")}</h1>
        <p className="text-sm mb-8 max-w-xs" style={{ color: "#9FB0CC" }}>
          {t("welcomeSub")}
        </p>
        <div className="w-full max-w-xs space-y-3">
          <button onClick={() => { setRole("proprietor"); setScreen("onboarding"); }}
            className="w-full text-left rounded-xl p-4 border transition-colors" style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}>
            <div className="text-sm font-medium text-white mb-0.5">{t("signUpProprietor")}</div>
            <div className="text-[11px]" style={{ color: "#C7D2FE" }}>{t("proprietorDesc")}</div>
          </button>
          <button onClick={() => { setRole("collaborator"); setScreen("collab-onboarding"); }}
            className="w-full text-left rounded-xl p-4 border transition-colors" style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}>
            <div className="text-sm font-medium text-white mb-0.5">{t("signUpCollaborator")}</div>
            <div className="text-[11px]" style={{ color: "#C7D2FE" }}>{t("collaboratorDesc")}</div>
          </button>
        </div>
        <button onClick={() => setScreen("login")} className="text-xs mt-6 underline" style={{ color: "#C7D2FE" }}>
          {t("alreadyHaveAccount")}
        </button>
      </div>
    );
  }

  // --- Login (existing users) ---
  if (screen === "login") {
    const isAdminContact = ADMIN_CONTACTS.includes(loginContact.trim());
    return (
      <div className="w-full min-h-[600px] rounded-xl flex items-center justify-center px-6" style={{ background: "#F7F8FA" }}>
        {style}
        <FadeIn keyProp="login">
          <div className="w-full max-w-sm bg-white rounded-xl p-8 border border-gray-200">
            <Logo />
            <h1 className="text-lg font-medium mt-6 mb-1" style={{ color: NAVY }}>Log in</h1>
            <p className="text-sm text-gray-500 mb-5">Enter the number you signed up with.</p>
            <input value={loginContact} onChange={(e) => setLoginContact(e.target.value)} placeholder="Contact number / WhatsApp"
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mb-2" />
            {isAdminContact ? (
              <div className="text-xs font-medium mb-5 flex items-center gap-1" style={{ color: "#0F6E56" }}>
                <ShieldCheck size={13} /> Recognized as admin — you'll go straight to the Admin view.
              </div>
            ) : (
              <div className="flex gap-2 mb-5">
                {[{ key: "proprietor", label: "Proprietor" }, { key: "collaborator", label: "Collaborator" }].map((r) => (
                  <button key={r.key} onClick={() => setRole(r.key)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: role === r.key ? BLUE : "#E5E7EB", color: role === r.key ? BLUE : "#374151", background: role === r.key ? BLUE_BG : "#fff" }}>
                    {r.label}
                  </button>
                ))}
              </div>
            )}
            <PrimaryButton
              onClick={() => setScreen(isAdminContact ? "admin" : role === "collaborator" ? "collab-dashboard" : "app")}
              disabled={!loginContact.trim() || (!isAdminContact && !role)}>
              Log in <ArrowRight size={15} />
            </PrimaryButton>
            <div className="text-[11px] text-gray-400 mt-3">Prototype only — this doesn't check real credentials yet.</div>
          </div>
        </FadeIn>
      </div>
    );
  }

  // --- Onboarding ---
  if (screen === "onboarding") {
    const step = onbSteps[obStep];
    const labels = {
      interest: role === "collaborator" ? t("qInterestCollaborator") : t("qInterestProprietor"),
      subcategory: t("qSubcategory", { subject: SUBJECTS[form.interest]?.name?.toLowerCase() || "business" }),
      name: t("qName"),
      contact: t("qContact"),
      city: t("qCity"),
      shopName: t("qShopName"),
      shopType: t("qShopType"),
      investment: t("qInvestment"),
      facebook: t("qFacebook"),
      instagram: t("qInstagram"),
    };
    const canProceed = step === "interest" || step === "subcategory" || step === "facebook" || step === "instagram"
      ? true
      : step === "shopType" ? !!form.shopType : form[step].trim().length > 0;
    return (
      <div className="w-full min-h-[600px] rounded-xl flex items-center justify-center px-6" style={{ background: "#F7F8FA" }}>
        {style}
        <FadeIn keyProp={obStep}>
          <div className="w-full max-w-md bg-white rounded-xl p-8 border border-gray-200">
            <Logo />
            <div className="flex gap-1.5 my-6">
              {onbSteps.map((_, i) => <div key={i} className="h-1 flex-1 rounded-full transition-colors duration-300" style={{ background: i <= obStep ? ORANGE : "#E5E7EB" }} />)}
            </div>
            <div className="text-xs font-medium mb-1.5" style={{ color: BLUE }}>{language === "en" ? `Question ${obStep + 1} of ${onbSteps.length}` : language === "hi" ? `प्रश्न ${obStep + 1} / ${onbSteps.length}` : `प्रश्न ${obStep + 1} / ${onbSteps.length}`}</div>
            <h2 className="text-lg font-medium mb-5" style={{ color: NAVY }}>{labels[step]}</h2>
            {step === "interest" ? (
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-6" value={form.interest}
                onChange={(e) => {
                  const newInterest = e.target.value;
                  const subs = SUBJECTS[newInterest]?.subcategories;
                  setForm({ ...form, interest: newInterest, subcategory: subs ? Object.keys(subs)[0] : "" });
                }}>
                {Object.entries(SUBJECTS).map(([key, s]) => <option key={key} value={key}>{s.name}</option>)}
              </select>
            ) : step === "subcategory" ? (
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-6" value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}>
                {Object.entries(SUBJECTS[form.interest]?.subcategories || {}).map(([key, sc]) => <option key={key} value={key}>{sc.label}</option>)}
              </select>
            ) : step === "shopType" ? (
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[{ key: "shop", label: t("shopTypeShop") }, { key: "home", label: t("shopTypeHome") }].map((o) => (
                  <button key={o.key} onClick={() => setForm({ ...form, shopType: o.key })} className="rounded-lg py-3 text-sm border"
                    style={{ borderColor: form.shopType === o.key ? BLUE : "#E5E7EB", background: form.shopType === o.key ? BLUE_BG : "#fff", color: form.shopType === o.key ? BLUE : "#374151" }}>
                    {o.label}
                  </button>
                ))}
              </div>
            ) : (
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-6" value={form[step]}
                onChange={(e) => setForm({ ...form, [step]: e.target.value })}
                placeholder={step === "facebook" || step === "instagram" ? t("optional") : step === "investment" ? "e.g. ₹50,000" : ""}
                onKeyDown={(e) => { if (e.key === "Enter" && canProceed) nextOnb(); }} />
            )}
            <div className="flex justify-between">
              {obStep > 0 ? (
                <button onClick={backOnb} className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-1" style={{ color: NAVY }}>
                  <ArrowLeft size={14} /> {t("back")}
                </button>
              ) : <div />}
              <PrimaryButton onClick={nextOnb} disabled={!canProceed}>
                {obStep === onbSteps.length - 1 ? t("setMyGoal") : t("next")} <ArrowRight size={14} />
              </PrimaryButton>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  // --- Collaborator onboarding (separate login) ---
  if (screen === "collab-onboarding") {
    const step = COLLAB_STEPS[collabStep];
    const labels = {
      name: "What's your name?", businessName: "What's your business name?",
      expertise: "What's your area of expertise?", city: "Which city are you based in?",
      govId: "Aadhar or PAN number, for business verification",
    };
    const canProceed = collabForm[step].trim().length > 0;
    function nextCollab() { if (collabStep < COLLAB_STEPS.length - 1) setCollabStep(collabStep + 1); else setScreen("collab-fee"); }
    function backCollab() { if (collabStep > 0) setCollabStep(collabStep - 1); }
    return (
      <div className="w-full min-h-[600px] rounded-xl flex items-center justify-center px-6" style={{ background: "#F7F8FA" }}>
        {style}
        <FadeIn keyProp={collabStep}>
          <div className="w-full max-w-md bg-white rounded-xl p-8 border border-gray-200">
            <Logo />
            <div className="flex gap-1.5 my-6">
              {COLLAB_STEPS.map((_, i) => <div key={i} className="h-1 flex-1 rounded-full transition-colors duration-300" style={{ background: i <= collabStep ? ORANGE : "#E5E7EB" }} />)}
            </div>
            <div className="text-xs font-medium mb-1.5" style={{ color: BLUE }}>Question {collabStep + 1} of {COLLAB_STEPS.length}</div>
            <h2 className="text-lg font-medium mb-2" style={{ color: NAVY }}>{labels[step]}</h2>
            {step === "govId" && <p className="text-xs text-gray-500 mb-3">Used to verify your business is real — kept confidential.</p>}
            {step === "expertise" ? (
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-6" value={collabForm.expertise} onChange={(e) => setCollabForm({ ...collabForm, expertise: e.target.value })}>
                {Object.entries(SUBJECTS).map(([key, s]) => <option key={key} value={key}>{s.name}</option>)}
              </select>
            ) : (
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-6" value={collabForm[step]}
                onChange={(e) => setCollabForm({ ...collabForm, [step]: e.target.value })}
                onKeyDown={(e) => { if (e.key === "Enter" && canProceed) nextCollab(); }} />
            )}
            <div className="flex justify-between">
              {collabStep > 0 ? (
                <button onClick={backCollab} className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-1" style={{ color: NAVY }}>
                  <ArrowLeft size={14} /> Back
                </button>
              ) : <div />}
              <PrimaryButton onClick={nextCollab} disabled={!canProceed}>
                {collabStep === COLLAB_STEPS.length - 1 ? "Register my business" : "Next"} <ArrowRight size={14} />
              </PrimaryButton>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  // --- Collaborator fee ---
  if (screen === "collab-fee") {
    return (
      <div className="w-full min-h-[600px] rounded-xl flex items-center justify-center px-6 py-10" style={{ background: "#F7F8FA" }}>
        {style}
        <FadeIn keyProp="collab-fee">
          <div className="w-full max-w-lg bg-white rounded-xl p-8 border border-gray-200">
            <Logo />
            <div className="flex items-center gap-2 mt-6 mb-1">
              <IndianRupee size={16} style={{ color: BLUE }} />
              <span className="text-xs font-medium" style={{ color: BLUE }}>Collaborator access</span>
            </div>
            <h1 className="text-lg font-medium mb-1" style={{ color: NAVY }}>Choose your plan, {collabForm.name || "there"}</h1>
            <p className="text-sm text-gray-500 mb-4">
              Pick a plan to get started.
            </p>
            <div className="rounded-lg p-3 mb-6 border border-gray-200 text-sm text-gray-700">
              <div className="mb-1"><span className="text-gray-400">Business:</span> {collabForm.businessName}</div>
              <div className="mb-1"><span className="text-gray-400">Expertise:</span> {SUBJECTS[collabForm.expertise]?.name}</div>
              <div><span className="text-gray-400">City:</span> {collabForm.city}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => setCollabPlan("monthly")} className="text-left border rounded-lg p-4"
                style={{ borderColor: collabPlan === "monthly" ? BLUE : "#E5E7EB", background: collabPlan === "monthly" ? BLUE_BG : "#fff" }}>
                <div className="text-sm font-medium mb-1" style={{ color: NAVY }}>Monthly</div>
                <div className="text-lg font-medium" style={{ color: BLUE }}>₹100<span className="text-xs text-gray-400 font-normal">/month</span></div>
              </button>
              <button onClick={() => setCollabPlan("yearly")} className="text-left border rounded-lg p-4"
                style={{ borderColor: collabPlan === "yearly" ? BLUE : "#E5E7EB", background: collabPlan === "yearly" ? BLUE_BG : "#fff" }}>
                <div className="text-sm font-medium mb-1" style={{ color: NAVY }}>Yearly</div>
                <div className="text-lg font-medium" style={{ color: BLUE }}>₹600<span className="text-xs text-gray-400 font-normal">/year</span></div>
              </button>
            </div>
            <div>
              <PrimaryButton onClick={() => setScreen("collab-dashboard")} disabled={!collabPlan}>Continue <ArrowRight size={15} /></PrimaryButton>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  // --- Collaborator dashboard ---
  if (screen === "collab-dashboard") {
    const expertise = SUBJECTS[collabForm.expertise];
    return (
      <div className="w-full min-h-[600px] rounded-xl border border-gray-200 overflow-hidden">
        {style}
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: NAVY }}>
          <div className="flex items-center gap-3">
            <Logo dark />
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white">Collaborator</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10" style={{ color: "#9FB0CC" }}>
            {collabPlan === "yearly" ? "₹600/year" : "₹100/month"}
          </span>
        </div>
        <div className="flex border-b border-gray-200 bg-white px-6">
          {[
            { key: "requests", label: "Proprietor requests" },
            { key: "post-offer", label: "Post an offer" },
            { key: "register-event", label: "Register an event" },
            { key: "listings", label: "My listings" },
          ].map((t) => (
            <button key={t.key} onClick={() => setCollabTab(t.key)}
              className="text-sm px-3 py-3 border-b-2 -mb-px"
              style={{ borderColor: collabTab === t.key ? ORANGE : "transparent", color: collabTab === t.key ? ORANGE : "#9CA3AF" }}>
              {t.label}
            </button>
          ))}
        </div>

        <FadeIn keyProp={collabTab}>
          <div className="px-6 py-6 bg-white">
            {collabTab === "requests" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-2">Proprietors in {expertise?.name} looking to collaborate:</p>
                {(expertise?.collab?.requests || GENERIC_COLLAB_REQUESTS(expertise?.name)).map((r, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm text-gray-800">{r.text}</div>
                      <div className="text-[11px] text-gray-400">{r.from}</div>
                    </div>
                    <button className="text-xs font-medium px-3 py-1.5 rounded-lg border shrink-0" style={{ borderColor: BLUE, color: BLUE }}>Respond</button>
                  </div>
                ))}
              </div>
            )}

            {collabTab === "post-offer" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-1">Describe what you offer to proprietors in {expertise?.name}.</p>
                <textarea value={offerText} onChange={(e) => setOfferText(e.target.value)}
                  placeholder="e.g. Custom jewelry display counters — Pune based, 2-week turnaround"
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[90px]" />
                <PrimaryButton onClick={() => { if (offerText.trim()) { setMyOffers([...myOffers, offerText]); setOfferText(""); } }} disabled={!offerText.trim()}>
                  Post offer
                </PrimaryButton>
              </div>
            )}

            {collabTab === "register-event" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-1">Register a seminar or event for {expertise?.name}.</p>
                <input value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} placeholder="Event name"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} placeholder="Date"
                    className="border border-gray-200 rounded-lg p-2.5 text-sm" />
                  <input value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} placeholder="Venue (e.g. JW Marriott, Pune)"
                    className="border border-gray-200 rounded-lg p-2.5 text-sm" />
                </div>
                <input value={eventForm.price} onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })} placeholder="Ticket price (or 'Free')"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" />
                <PrimaryButton onClick={() => {
                  if (eventForm.name.trim()) { setMyEvents([...myEvents, eventForm]); setEventForm({ name: "", date: "", venue: "", price: "" }); }
                }} disabled={!eventForm.name.trim()}>
                  Register event
                </PrimaryButton>
              </div>
            )}

            {collabTab === "listings" && (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">My offers</div>
                  {myOffers.length ? myOffers.map((o, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3 text-sm text-gray-700 mb-2">{o}</div>
                  )) : <div className="text-sm text-gray-400">No offers posted yet.</div>}
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">My events</div>
                  {myEvents.length ? myEvents.map((e, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3 text-sm text-gray-700 mb-2">
                      {e.name} — {e.venue} · {e.date} · {e.price}
                    </div>
                  )) : <div className="text-sm text-gray-400">No events registered yet.</div>}
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    );
  }

  // --- Target setting ---
  if (screen === "target") {
    return (
      <div className="w-full min-h-[600px] rounded-xl flex items-center justify-center px-6 py-10" style={{ background: "#F7F8FA" }}>
        {style}
        <FadeIn keyProp="target">
          <div className="w-full max-w-lg bg-white rounded-xl p-8 border border-gray-200">
            <Logo />
            <div className="flex items-center gap-2 mt-6 mb-1">
              <Target size={16} style={{ color: BLUE }} />
              <span className="text-xs font-medium" style={{ color: BLUE }}>{t("setYourGoal")}</span>
            </div>
            <h1 className="text-lg font-medium mb-1" style={{ color: NAVY }}>{t("workingToward", { name: form.name || "there" })}</h1>
            <p className="text-sm text-gray-500 mb-4">{t("goalHint", { subject: subject.name.toLowerCase() })}</p>
            <textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder={t("goalPlaceholder")}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[80px] mb-4" />
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">{t("overWhatPeriod")}</div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {PERIODS.map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className="rounded-lg py-2 text-sm border"
                  style={{ borderColor: period === p ? BLUE : "#E5E7EB", background: period === p ? BLUE_BG : "#fff", color: period === p ? BLUE : "#374151" }}>
                  {t(PERIOD_KEYS[p])}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-400 mb-4">{t("goalFixedNote")}</div>

            <div className="rounded-lg p-3 mb-6 border" style={{ borderColor: BLUE, background: BLUE_BG }}>
              <div className="flex items-start gap-2">
                <IndianRupee size={14} style={{ color: BLUE }} className="mt-0.5 shrink-0" />
                <p className="text-xs" style={{ color: NAVY }}>
                  {t("freeCoreApp")}
                </p>
              </div>
            </div>

            <PrimaryButton onClick={confirmTarget} disabled={!goal.trim()}>
              {t("continueBtn")} <ArrowRight size={15} />
            </PrimaryButton>
          </div>
        </FadeIn>
      </div>
    );
  }

  // --- Plan ---
  if (screen === "plan") {
    return (
      <div className="w-full min-h-[600px] rounded-xl flex items-center justify-center px-6 py-10" style={{ background: "#F7F8FA" }}>
        {style}
        <FadeIn keyProp="plan">
          <div className="w-full max-w-lg bg-white rounded-xl p-8 border border-gray-200">
            <Logo />
            <div className="flex items-center gap-2 mt-6 mb-1">
              <Sparkles size={16} style={{ color: BLUE }} />
              <span className="text-xs font-medium" style={{ color: BLUE }}>{t("yourPlan")}</span>
            </div>
            <h1 className="text-lg font-medium mb-1" style={{ color: NAVY }}>{t("towardPrefix")} "{goal}"</h1>
            <p className="text-sm text-gray-500 mb-6">{t("overTheNext", { period: t(PERIOD_KEYS[period]) })}</p>

            {planLoading && (
              <div className="text-sm text-gray-500 flex items-center gap-2 mb-6">
                <Sparkles size={14} className="animate-pulse" style={{ color: BLUE }} /> {t("buildingPlan")}
              </div>
            )}

            {planData && !planLoading && (
              <div className="space-y-4 mb-6">
                <PlanTier title={t("periodMonthly")} items={planData.monthly} />
                <PlanTier title={t("periodQuarterly")} items={planData.quarterly} />
                <PlanTier title={t("yearlyTier")} items={[planData.yearly]} />
              </div>
            )}

            <div className="rounded-lg p-3 mb-6 border border-gray-200">
              <p className="text-xs text-gray-500 mb-2">{t("dailyLoopNote")}</p>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1">
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, (daysDone / totalDays) * 100)}%`, background: BLUE }} />
              </div>
              <div className="text-xs text-gray-400">{t("daysCompleted", { done: daysDone, total: totalDays })}</div>
            </div>

            <PrimaryButton onClick={() => setScreen("app")}>{t("startTodaysLoop")} <ArrowRight size={15} /></PrimaryButton>
          </div>
        </FadeIn>
      </div>
    );
  }

  // --- Admin (restricted, reached only via admin login) ---
  if (screen === "admin") {
    return (
      <div className="w-full min-h-[600px] rounded-xl border border-gray-200 overflow-hidden">
        {style}
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: NAVY }}>
          <div className="flex items-center gap-3">
            <Logo dark />
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white">Admin</span>
          </div>
          <button onClick={() => { setScreen("welcome"); setLoginContact(""); }} className="text-xs px-2.5 py-1 rounded-full border border-white/25 text-white hover:bg-white/10">
            Log out
          </button>
        </div>
        <div className="px-6 py-6 bg-white">
          <h2 className="text-sm font-medium mb-4" style={{ color: NAVY }}>All firms — AKORA9 admin</h2>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Active firms</div>
              <div className="text-xl font-medium" style={{ color: NAVY }}>{MOCK_FIRMS.length}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Leads delivered today</div>
              <div className="text-xl font-medium" style={{ color: NAVY }}>{MOCK_FIRMS.length * 3}</div>
            </div>
          </div>
          <div className="space-y-2">
            {MOCK_FIRMS.map((f, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-4 py-3 border border-gray-200">
                <div>
                  <div className="text-sm text-gray-900">{f.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{f.role} · {f.role === "collaborator" ? f.plan : "free plan"} · {f.subject} · "{f.target}"</div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Flame size={12} /> {f.streak}</span>
                  <span>{f.daysDone}d done</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Main app ---
  const LOOP_STAGES = [
    { key: "content", label: t("stageContent"), icon: Newspaper, done: contentDone },
    { key: "observation", label: t("stageObservation"), icon: Eye, done: !!obsComplete },
    { key: "guidance", label: t("stageGuidance"), icon: ShieldCheck, done: !!guidance },
    { key: "reward", label: "Leads & Collaboration", icon: Gift, done: rewardClaimed },
  ];
  const canReachReward = contentDone && obsComplete && !!guidance;

  return (
    <div className="w-full min-h-[600px] rounded-xl border border-gray-200 overflow-hidden">
      {style}
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: NAVY }}>
        <div className="flex items-center gap-3">
          <Logo dark />
          {role && <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white capitalize">{role}</span>}
          {role && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10" style={{ color: "#9FB0CC" }}>
              {t("freePlan")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-white text-sm">
          <span className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium" style={{ background: BLUE }}>
            <Flame size={12} /> {streak} {t("dayStreak")}
          </span>
          <span className="rounded-full px-3 py-1 text-xs font-medium bg-white/10">{daysDone}/{totalDays} days</span>
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-white px-6">
        {[
          { key: "loop", label: t("tabLoop"), icon: Target },
          { key: "progress", label: t("tabProgress"), icon: TrendingUp },
          { key: "collaborate", label: t("tabCollaborate"), icon: Handshake },
          { key: "recommendations", label: t("tabRecommendations"), icon: BookOpen },
          { key: "analytics", label: t("tabAnalytics"), icon: Receipt },
        ].map((tabItem) => (
          <button key={tabItem.key} onClick={() => setTab(tabItem.key)}
            className="flex items-center gap-1.5 text-sm px-3 py-3 border-b-2 -mb-px"
            style={{ borderColor: tab === tabItem.key ? ORANGE : "transparent", color: tab === tabItem.key ? ORANGE : "#9CA3AF" }}>
            <tabItem.icon size={14} /> {tabItem.label}
          </button>
        ))}
      </div>

      {tab === "progress" ? (
        <div className="px-6 py-6 bg-white">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{t("yourGoalLabel")}</div>
          <div className="text-sm font-medium mb-4" style={{ color: NAVY }}>"{goal}" — {t("overPeriodShort", { period: t(PERIOD_KEYS[period]) })}</div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-2">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (daysDone / totalDays) * 100)}%`, background: BLUE }} />
          </div>
          <div className="text-xs text-gray-500 mb-6">{t("daysCompleted", { done: daysDone, total: totalDays })}</div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-1">Current streak</div>
              <div className="text-xl font-medium flex items-center gap-1" style={{ color: NAVY }}><Flame size={16} /> {streak} days</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-1">Leads received so far</div>
              <div className="text-xl font-medium" style={{ color: NAVY }}>{daysDone * 3}</div>
            </div>
          </div>

          {planData && (
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">{t("yourPlan")}</div>
              <div className="space-y-4">
                <PlanTier title={t("periodMonthly")} items={planData.monthly} />
                <PlanTier title={t("periodQuarterly")} items={planData.quarterly} />
                <PlanTier title={t("yearlyTier")} items={[planData.yearly]} />
              </div>
            </div>
          )}

          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Market analytics — {subject.name}</div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500">Demand trend, last 6 months</span>
              <span className="text-xs font-medium" style={{ color: subject.analytics.demandChangePct >= 0 ? "#0F6E56" : "#B91C1C" }}>
                {subject.analytics.demandChangePct >= 0 ? "+" : ""}{subject.analytics.demandChangePct}% vs last month
              </span>
            </div>
            <div className="flex items-end gap-2 h-16 mb-1">
              {subject.analytics.demand.map((v, i) => (
                <div key={i} className="flex-1 rounded-t" style={{ height: `${v}%`, background: BLUE_BG, borderTop: `3px solid ${BLUE}` }} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{subject.analytics.insight}</p>
          </div>
        </div>
      ) : tab === "collaborate" ? (
        <div className="px-6 py-6 bg-white">
          {daysDone < 7 ? (
            <div className="text-center py-10">
              <Lock size={28} className="mx-auto mb-3" style={{ color: "#9CA3AF" }} />
              <div className="text-sm font-medium mb-1" style={{ color: NAVY }}>Collaboration unlocks after 7 days</div>
              <p className="text-xs text-gray-500 mb-4">Keep up the daily loop to unlock collaborator offers, events, and requests.</p>
              <div className="inline-block text-xs font-medium px-3 py-1 rounded-full" style={{ background: BLUE_BG, color: BLUE }}>
                Day {daysDone}/7
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">Connect with same-minded people, or businesses parallel to yours, in {subject.name}.</p>

              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Collaborators offering to help</div>
              <div className="space-y-2 mb-6">
                {(subject.collab?.offers || []).map((o, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm text-gray-800">{o.text}</div>
                      <div className="text-[11px] text-gray-400">{o.from}</div>
                    </div>
                    <button className="text-xs font-medium px-3 py-1.5 rounded-lg border shrink-0" style={{ borderColor: BLUE, color: BLUE }}>Connect</button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <Globe size={12} className="text-gray-400" />
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">Also happening in {subject.name} — from the web</div>
              </div>
              <p className="text-[11px] text-gray-400 mb-2">Found across the web, not booked through Upscale.</p>
              <div className="space-y-2 mb-6">
                {(subject.collab?.external?.length ? subject.collab.external : null)?.map((e, i) => (
                  <a key={i} href={e.url} target="_blank" rel="noopener noreferrer"
                    className="block border border-gray-200 border-dashed rounded-lg p-3 hover:border-gray-300">
                    <div className="text-sm text-gray-800">{e.name}</div>
                    <div className="text-[11px] text-gray-400">{e.venue} · {e.date}</div>
                  </a>
                )) || <div className="text-sm text-gray-400">No web results loaded yet for this subject.</div>}
              </div>

              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Post what you're looking for</div>
              <textarea value={propOfferText} onChange={(e) => setPropOfferText(e.target.value)}
                placeholder="e.g. Looking for a reliable display furniture supplier nearby"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[70px] mb-2 bg-white" />
              <PrimaryButton onClick={() => { if (propOfferText.trim()) { setPropRequests([...propRequests, propOfferText]); setPropOfferText(""); } }} disabled={!propOfferText.trim()}>
                Post request
              </PrimaryButton>

              {propRequests.length > 0 && (
                <div className="mt-6">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Your posted requests</div>
                  {propRequests.map((r, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3 text-sm text-gray-700 mb-2">{r}</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ) : tab === "recommendations" ? (
        <div className="px-6 py-6 bg-white">
          <p className="text-sm text-gray-500 mb-4">Book suggestions and recommendations for {subject.name}.</p>
          <div className="space-y-3">
            {(subject.bookSuggestions || []).map((b, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 flex gap-3">
                <BookOpen size={18} style={{ color: BLUE }} className="mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium" style={{ color: NAVY }}>{b.title}</div>
                  <div className="text-xs text-gray-500 mb-1">{b.author}</div>
                  <div className="text-xs text-gray-600">{b.why}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : tab === "analytics" ? (
        <div className="px-6 py-6 bg-white">
          <p className="text-sm text-gray-500 mb-1">Upload a photo of a bill or sales voucher — the amount, vendor, and date are read automatically.</p>
          <p className="text-xs text-gray-400 mb-4">A simple cost/sales tracker, not full accounting software — no GST or tax filing here.</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 flex flex-col items-center gap-1.5">
              <input type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) handleReceiptUpload(f, "cost"); }} />
              <Upload size={18} style={{ color: "#B91C1C" }} />
              <span className="text-xs font-medium" style={{ color: NAVY }}>{uploadingCost ? "Reading..." : "Add cost bill"}</span>
            </label>
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 flex flex-col items-center gap-1.5">
              <input type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) handleReceiptUpload(f, "sales"); }} />
              <Upload size={18} style={{ color: "#0F6E56" }} />
              <span className="text-xs font-medium" style={{ color: NAVY }}>{uploadingSales ? "Reading..." : "Add sales voucher"}</span>
            </label>
          </div>

          {ledgerError && <div className="text-xs mb-4" style={{ color: "#B91C1C" }}>{ledgerError}</div>}

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Total costs</div>
              <div className="text-lg font-medium" style={{ color: NAVY }}>₹{totalCosts.toLocaleString("en-IN")}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Total sales</div>
              <div className="text-lg font-medium" style={{ color: NAVY }}>₹{totalSales.toLocaleString("en-IN")}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Net</div>
              <div className="text-lg font-medium" style={{ color: netAmount >= 0 ? "#0F6E56" : "#B91C1C" }}>
                {netAmount >= 0 ? "+" : ""}₹{netAmount.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">This session's entries</div>
          {ledgerEntries.length ? (
            <div className="space-y-2">
              {ledgerEntries.map((e, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm text-gray-800 truncate">{e.vendor || "Unknown vendor"}</div>
                    <div className="text-[11px] text-gray-400 truncate">{e.description}{e.date && e.date !== "unknown" ? ` · ${e.date}` : ""}</div>
                  </div>
                  <span className="text-sm font-medium shrink-0" style={{ color: e.type === "cost" ? "#B91C1C" : "#0F6E56" }}>
                    {e.type === "cost" ? "-" : "+"}₹{Number(e.amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400">No entries yet — upload a bill or voucher to get started.</div>
          )}
          <p className="text-[11px] text-gray-400 mt-4">Every entry is also saved to your team's ledger for permanent record-keeping.</p>
        </div>
      ) : (
        <div className="px-6 py-6 bg-white">
          <div className="flex items-center mb-8">
            {LOOP_STAGES.map((s, i) => {
              const isActive = s.key === stage;
              const locked = s.key === "reward" && !canReachReward;
              return (
                <div key={s.key} className="flex items-center flex-1 last:flex-none">
                  <button onClick={() => !locked && setStage(s.key)} disabled={locked}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors duration-300 disabled:opacity-40"
                    style={{ background: s.done ? NAVY : isActive ? ORANGE : "#EEF0F3", color: s.done || isActive ? "#fff" : "#9CA3AF" }}>
                    {s.done ? <Check size={15} /> : locked ? <Lock size={13} /> : i + 1}
                  </button>
                  {i < LOOP_STAGES.length - 1 && <div className="flex-1 h-0.5 mx-1 transition-colors duration-300" style={{ background: s.done ? NAVY : "#EEF0F3" }} />}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-5 gap-1 -mt-4 mb-6">
            {LOOP_STAGES.map((s) => <div key={s.key} className="text-[11px] text-center text-gray-400 leading-tight">{s.label}</div>)}
          </div>

          <FadeIn keyProp={stage}>
            <div className="rounded-xl border border-gray-200 p-6" style={{ background: "#F7F8FA" }}>
              {stage === "content" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1"><Newspaper size={16} style={{ color: BLUE }} /><h2 className="text-sm font-medium" style={{ color: NAVY }}>{t("stageContent")}</h2></div>
                  {subject.label && <p className="text-xs text-gray-400 -mt-2">{t("forLabel", { label: subject.label.toLowerCase() }).trim()}</p>}
                  <div>
                    <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">{t("updateLabel")}</div>
                    <a href={`https://www.google.com/search?q=${encodeURIComponent(subject.name + " " + subject.update)}&tbm=nws`}
                      target="_blank" rel="noopener noreferrer"
                      className="block bg-white rounded-lg p-3 border border-gray-200 text-sm text-gray-700 hover:border-gray-300">
                      {subject.update}
                      <span className="text-[11px] block mt-1" style={{ color: BLUE }}>{t("readMore")}</span>
                    </a>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">{t("trendLabel")}</div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 text-sm text-gray-700">{subject.trend}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">{t("videoLabel")}</div>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(subject.video.title + " animated explainer")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="block bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-3 hover:border-gray-300">
                      <PlayCircle size={24} style={{ color: BLUE }} />
                      <div>
                        <div className="text-sm text-gray-800">{subject.video.title}</div>
                        <div className="text-xs text-gray-400">{subject.video.duration}</div>
                      </div>
                    </a>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">{t("successStoryLabel")}</div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 text-sm text-gray-700">{subject.successStory}</div>
                  </div>
                  <PrimaryButton onClick={() => { setContentDone(true); setStage("observation"); }}>
                    {t("continueToObservation")} <ArrowRight size={14} />
                  </PrimaryButton>
                </div>
              )}

              {stage === "observation" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1"><Eye size={16} style={{ color: BLUE }} /><h2 className="text-sm font-medium" style={{ color: NAVY }}>{t("yourObservation")}</h2></div>
                  <p className="text-xs text-gray-500 mb-1">
                    {t("observationPrompt", { forLabel: subject.label ? t("forLabel", { label: subject.label.toLowerCase() }) : "" })}
                  </p>
                  <textarea value={obsText} onChange={(e) => setObsText(e.target.value)}
                    placeholder={t("obsPlaceholder")}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[110px] bg-white" />
                  <PrimaryButton onClick={submitObservation} disabled={!obsComplete}>
                    {t("getGuidance")} <ArrowRight size={14} />
                  </PrimaryButton>
                </div>
              )}

              {stage === "guidance" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1"><ShieldCheck size={16} style={{ color: BLUE }} /><h2 className="text-sm font-medium" style={{ color: NAVY }}>{t("yourGuidance")}</h2></div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 italic">"{obsText}"</div>
                  {guiding && (
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Sparkles size={14} className="animate-pulse" style={{ color: BLUE }} /> {t("guidanceThinking")}
                    </div>
                  )}
                  {guidance && !guiding && (
                    <>
                      <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                        {guidance}
                      </div>
                      <PrimaryButton onClick={() => setStage("reward")}>
                        Unlock leads & collaboration <ArrowRight size={14} />
                      </PrimaryButton>
                    </>
                  )}
                </div>
              )}

              {stage === "reward" && !adDone && (
                <div className="space-y-4 text-center py-2">
                  <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Sponsored — watch to unlock leads & collaboration</div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6 text-left">
                    <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">{subject.ad.advertiser}</div>
                    <div className="text-base font-medium mb-2" style={{ color: NAVY }}>{subject.ad.headline}</div>
                    <p className="text-sm text-gray-600 mb-4">{subject.ad.body}</p>
                    <button className="text-sm font-medium px-4 py-2 rounded-lg text-white" style={{ background: BLUE }}>{subject.ad.cta}</button>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (adElapsed / 30) * 100)}%`, background: ORANGE, transition: "width 1s linear" }} />
                  </div>
                  <div className="text-xs text-gray-500">
                    {adElapsed >= 20 ? (
                      <button onClick={skipAd} className="font-medium underline" style={{ color: BLUE }}>Skip ad</button>
                    ) : (
                      `Skip available in ${20 - adElapsed}s`
                    )}
                  </div>
                </div>
              )}

              {stage === "reward" && adDone && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1"><Gift size={16} style={{ color: BLUE }} /><h2 className="text-sm font-medium" style={{ color: NAVY }}>Leads & Collaboration</h2></div>

                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide pt-1">Find real leads</div>
                  <p className="text-xs text-gray-500">Describe who you're looking for — e.g. "jewelry wholesalers near me" or "real estate agents who recently started."</p>
                  <div className="flex gap-2">
                    <input value={leadPrompt} onChange={(e) => setLeadPrompt(e.target.value)}
                      placeholder="I want..."
                      className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm bg-white"
                      onKeyDown={(e) => { if (e.key === "Enter" && leadPrompt.trim() && !leadSearching) findLeads(); }} />
                    <button onClick={findLeads} disabled={!leadPrompt.trim() || leadSearching}
                      className="text-sm font-medium px-4 py-2.5 rounded-lg text-white disabled:opacity-40 flex items-center gap-1.5 shrink-0" style={{ background: BLUE }}>
                      <Search size={14} /> {leadSearching ? "Searching..." : "Search"}
                    </button>
                  </div>
                  {leadResults?.length > 0 && (
                    <div className="space-y-2">
                      {leadResults.map((l, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-medium text-gray-800">{l.name}</div>
                            {l.source && <span className="text-[11px] px-2 py-0.5 rounded-full shrink-0" style={{ background: BLUE_BG, color: BLUE }}>{l.source}</span>}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{l.detail}</div>
                          {l.contact && <div className="text-[11px] text-gray-700 mt-1 font-medium">{l.contact}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                  {leadNote && <div className="text-xs text-gray-500 italic">{leadNote}</div>}

                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide pt-1">Collaboration requests in {subject.name}</div>
                  {daysDone < 7 ? (
                    <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2">
                      <Lock size={13} style={{ color: "#9CA3AF" }} className="shrink-0" />
                      <span className="text-xs text-gray-500">Unlocks after 7 days — Day {daysDone}/7</span>
                    </div>
                  ) : (
                    <>
                      {(subject.collab?.offers || []).slice(0, 2).map((o, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm text-gray-800">{o.text}</div>
                            <div className="text-[11px] text-gray-400">{o.from}</div>
                          </div>
                          <Handshake size={16} style={{ color: BLUE }} className="shrink-0" />
                        </div>
                      ))}
                      <button onClick={() => { setTab("collaborate"); }} className="text-xs font-medium" style={{ color: BLUE }}>
                        See all in Collaborate tab →
                      </button>
                    </>
                  )}

                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide pt-1">Events & collaborations in {subject.name}</div>
                  {subject.events.map((ev, i) => {
                    const key = `${form.interest}-${i}`;
                    const bought = ticketsBought.includes(key);
                    return (
                      <div key={i} className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Calendar size={18} style={{ color: "#0F6E56" }} className="shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm text-gray-800">{ev.name}</div>
                            <div className="text-[11px] text-gray-400">{ev.type} · {ev.date}</div>
                            <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5 flex-wrap">
                              <span>{ev.venue}</span>
                              {ev.stars && <span className="text-amber-500">{"★".repeat(ev.stars)}</span>}
                              {ev.secured && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: BLUE_BG, color: BLUE }}>
                                  <ShieldCheck size={9} /> Secured venue
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {bought ? (
                          <span className="text-[11px] font-medium px-2 py-1 rounded-full flex items-center gap-1 shrink-0" style={{ background: "#E7F5EF", color: "#0F6E56" }}>
                            <Check size={11} /> Reserved
                          </span>
                        ) : (
                          <button onClick={() => setTicketsBought((t) => [...t, key])}
                            className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border flex items-center gap-1 shrink-0"
                            style={{ borderColor: "#0F6E56", color: "#0F6E56" }}>
                            <Ticket size={11} /> {ev.price === "Free" ? "Reserve — Free" : `Get ticket · ${ev.price}`}
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <PrimaryButton onClick={claimReward}>Claim & start tomorrow <ChevronRight size={14} /></PrimaryButton>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      )}
    </div>
  );
}
