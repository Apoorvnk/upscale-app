import { useState, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, Check, Flame, Target, Sparkles, TrendingUp,
  PlayCircle, HelpCircle, Eye, Megaphone, Users, LayoutGrid, X,
  Lock, Gift, ChevronRight, Calendar, Ticket, ShieldCheck, IndianRupee, Handshake, Globe,
  Plus, Newspaper, BookOpen, Upload, Receipt
} from "lucide-react";

const NAVY = "#0F2E7A";
const BLUE = "#2955E0";
const BLUE_BG = "#EAF0FD";
const ORANGE = "#E8672B";
const SHOW_REWARD_AD = false; // Ad removed as of now — flip back to true to restore it.

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
function isValidPhone(value) { return /^\d{10}$/.test((value || "").replace(/\D/g, "")); }
function parseCurrency(value) { const digits = (value || "").replace(/\D/g, ""); return digits ? parseInt(digits, 10) : 0; }
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
const AGE_GROUPS = ["Under 18", "18-25", "25-40", "40-60", "60+"];
const GENDERS = ["Any", "Women", "Men"];

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
    tabRecommendations: "Books",
    tabAnalytics: "Analytics",
    tabMarketing: "Marketing",
    tabDemand: "Demand",
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
    sponsoredUnlock: "Sponsored — watch to unlock collaboration",
    marketingStrategyLabel: "Marketing strategy",
    marketingPreviewHint: "Open the Marketing tab to see today's strategy.",
    seeMarketingTab: "See in Marketing tab",
    marketingIntro: "Your marketing strategy for {subject}.",
    marketingBuilding: "Building your marketing strategy...",
    marketingAngleLabel: "The angle",
    marketingTacticsLabel: "How to execute",
    marketingUnavailable: "Couldn't build your strategy just now.",
    tryAgain: "Try again",
    invalidPhone: "Enter a valid 10-digit phone number.",
    planFallbackMonthlyStep: "Take one small, concrete action this week",
    planFallbackMonthlyHow: "Break \"{goal}\" into a single task you can finish in the next 7 days.",
    planFallbackQuarterlyStep: "Check your overall direction",
    planFallbackQuarterlyHow: "Set aside 30 minutes to see whether this quarter's progress is on track toward your goal.",
    planFallbackYearlyStep: "Stay the course",
    planFallbackYearlyHow: "Revisit your goal each quarter and keep the daily loop going to compound progress.",
    tierProgress: "{pct}% through this tier's timeframe",
    marketAnalyticsBuilding: "Building your market analytics...",
    planProgressBuilding: "Assessing your progress...",
    whatToDoNext: "What to do next",
    refreshingContent: "Refreshing today's content...",
    demandLabel: "Demand",
    demandIntro: "Test real demand for this idea before committing to it.",
    demandProduct: "Product (photo)",
    demandService: "Service (describe it)",
    demandUploadPhoto: "Upload a photo",
    demandProductPlaceholder: "Optional: add a short description",
    demandServicePlaceholder: "Describe the service you're starting",
    demandPollLanguageLabel: "Poll language:",
    demandGeneratePitch: "Generate pitch",
    demandGenerating: "Generating...",
    demandPitchLabel: "Your pitch",
    demandCreatePoll: "Create poll",
    demandCreating: "Creating...",
    demandShareLabel: "Share this poll",
    demandCopyForInstagram: "Copy link (Instagram)",
    demandLinkCopied: "Link copied!",
    demandResultsLabel: "Results",
    demandRefresh: "Refresh",
    demandRefreshing: "Refreshing...",
    demandYes: "Yes",
    demandMaybe: "Maybe",
    demandNo: "No",
    demandStatusGreen: "Strong demand — go ahead",
    demandStatusOrange: "Mixed signal — minor changes needed",
    demandStatusRed: "Weak demand — reconsider the idea",
    demandNoResponsesYet: "No responses yet — share the poll to start collecting them.",
    pollLoading: "Loading...",
    pollNotFound: "This poll couldn't be found.",
    pollThanks: "Thanks for your response!",
    pollMessageWhatsApp: "Message on WhatsApp",
    pollTapToRespond: "Would you buy this / use this?",
    knowledgeBuildingLabel: "Build your knowledge",
    knowledgeBuildingNote: "Recommended: spend your first 7 days here before pitching — day {day} of 7. Watch the video, read the success story, and check the Books tab.",
    seeBooksTab: "See Books tab",
    marketingDemandCallout: "Your demand check isn't Green yet — check",
    marketingShareLabel: "Share this ad",
    demandCopyForFacebook: "Copy text (Facebook)",
    demandTargetAgeLabel: "Target age group",
    demandTargetGenderLabel: "Target gender",
    demandTargetAny: "Any",
    demandTargetLabel: "Target",
    demandSuggestQuestions: "Suggest poll questions",
    demandPickQuestions: "Pick the questions to include",
    demandReviewsLabel: "Reviews",
    pollReviewLabel: "Any feedback? (optional)",
    pollReviewPlaceholder: "What do you think?",
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
    tabRecommendations: "पुस्तकें",
    tabAnalytics: "विश्लेषण",
    tabMarketing: "मार्केटिंग",
    tabDemand: "मांग",
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
    sponsoredUnlock: "प्रायोजित — सहयोग अनलॉक करने के लिए देखें",
    marketingStrategyLabel: "मार्केटिंग रणनीति",
    marketingPreviewHint: "आज की रणनीति देखने के लिए मार्केटिंग टैब खोलें।",
    seeMarketingTab: "मार्केटिंग टैब में देखें",
    marketingIntro: "{subject} के लिए आपकी मार्केटिंग रणनीति।",
    marketingBuilding: "आपकी मार्केटिंग रणनीति बनाई जा रही है...",
    marketingAngleLabel: "एंगल",
    marketingTacticsLabel: "कैसे लागू करें",
    marketingUnavailable: "अभी आपकी रणनीति नहीं बन सकी।",
    tryAgain: "फिर कोशिश करें",
    invalidPhone: "एक मान्य 10 अंकों का फ़ोन नंबर दर्ज करें।",
    planFallbackMonthlyStep: "इस हफ्ते एक छोटा, ठोस कदम उठाएं",
    planFallbackMonthlyHow: "\"{goal}\" को अगले 7 दिनों में पूरा किए जा सकने वाले एक काम में बांटें।",
    planFallbackQuarterlyStep: "अपनी समग्र दिशा जांचें",
    planFallbackQuarterlyHow: "यह देखने के लिए 30 मिनट निकालें कि क्या इस तिमाही की प्रगति आपके लक्ष्य की दिशा में सही है।",
    planFallbackYearlyStep: "लगे रहें",
    planFallbackYearlyHow: "हर तिमाही अपने लक्ष्य को फिर से देखें और रोज़ का लूप जारी रखें।",
    tierProgress: "इस चरण की समयसीमा का {pct}% पूरा",
    marketAnalyticsBuilding: "आपका मार्केट एनालिटिक्स तैयार हो रहा है...",
    planProgressBuilding: "आपकी प्रगति का आकलन किया जा रहा है...",
    whatToDoNext: "आगे क्या करना है",
    refreshingContent: "आज की सामग्री ताज़ा की जा रही है...",
    demandLabel: "मांग",
    demandIntro: "प्रतिबद्ध होने से पहले इस विचार की असली मांग जांचें।",
    demandProduct: "उत्पाद (फोटो)",
    demandService: "सेवा (वर्णन करें)",
    demandUploadPhoto: "एक फोटो अपलोड करें",
    demandProductPlaceholder: "वैकल्पिक: एक छोटा विवरण जोड़ें",
    demandServicePlaceholder: "आप जो सेवा शुरू कर रहे हैं उसका वर्णन करें",
    demandPollLanguageLabel: "पोल की भाषा:",
    demandGeneratePitch: "पिच बनाएं",
    demandGenerating: "बनाया जा रहा है...",
    demandPitchLabel: "आपकी पिच",
    demandCreatePoll: "पोल बनाएं",
    demandCreating: "बनाया जा रहा है...",
    demandShareLabel: "यह पोल शेयर करें",
    demandCopyForInstagram: "लिंक कॉपी करें (Instagram)",
    demandLinkCopied: "लिंक कॉपी हो गया!",
    demandResultsLabel: "परिणाम",
    demandRefresh: "रिफ्रेश करें",
    demandRefreshing: "रिफ्रेश हो रहा है...",
    demandYes: "हां",
    demandMaybe: "शायद",
    demandNo: "नहीं",
    demandStatusGreen: "अच्छी मांग — आगे बढ़ें",
    demandStatusOrange: "मिश्रित संकेत — थोड़ा बदलाव करें",
    demandStatusRed: "कम मांग — विचार पर फिर से सोचें",
    demandNoResponsesYet: "अभी तक कोई जवाब नहीं — जवाब पाने के लिए पोल शेयर करें।",
    pollLoading: "लोड हो रहा है...",
    pollNotFound: "यह पोल नहीं मिला।",
    pollThanks: "आपके जवाब के लिए धन्यवाद!",
    pollMessageWhatsApp: "व्हाट्सएप पर मैसेज करें",
    pollTapToRespond: "क्या आप इसे खरीदेंगे / इस्तेमाल करेंगे?",
    knowledgeBuildingLabel: "अपना ज्ञान बढ़ाएं",
    knowledgeBuildingNote: "सुझाव: पिच करने से पहले पहले 7 दिन यहां बिताएं — दिन {day} / 7। वीडियो देखें, सफलता की कहानी पढ़ें, और पुस्तकें टैब देखें।",
    seeBooksTab: "पुस्तकें टैब देखें",
    marketingDemandCallout: "आपकी मांग जांच अभी हरी नहीं है — देखें",
    marketingShareLabel: "यह विज्ञापन शेयर करें",
    demandCopyForFacebook: "टेक्स्ट कॉपी करें (Facebook)",
    demandTargetAgeLabel: "लक्षित आयु वर्ग",
    demandTargetGenderLabel: "लक्षित लिंग",
    demandTargetAny: "कोई भी",
    demandTargetLabel: "लक्ष्य",
    demandSuggestQuestions: "पोल प्रश्न सुझाएं",
    demandPickQuestions: "शामिल करने के लिए प्रश्न चुनें",
    demandReviewsLabel: "समीक्षाएं",
    pollReviewLabel: "कोई प्रतिक्रिया? (वैकल्पिक)",
    pollReviewPlaceholder: "आप क्या सोचते हैं?",
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
    tabRecommendations: "पुस्तके",
    tabAnalytics: "विश्लेषण",
    tabMarketing: "मार्केटिंग",
    tabDemand: "मागणी",
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
    sponsoredUnlock: "प्रायोजित — सहयोग अनलॉक करण्यासाठी पहा",
    marketingStrategyLabel: "मार्केटिंग रणनीती",
    marketingPreviewHint: "आजची रणनीती पाहण्यासाठी मार्केटिंग टॅब उघडा.",
    seeMarketingTab: "मार्केटिंग टॅबमध्ये पहा",
    marketingIntro: "{subject} साठी तुमची मार्केटिंग रणनीती.",
    marketingBuilding: "तुमची मार्केटिंग रणनीती तयार होत आहे...",
    marketingAngleLabel: "एंगल",
    marketingTacticsLabel: "कसे राबवायचे",
    marketingUnavailable: "आत्ता तुमची रणनीती तयार होऊ शकली नाही.",
    tryAgain: "पुन्हा प्रयत्न करा",
    invalidPhone: "वैध 10-अंकी फोन नंबर टाका.",
    planFallbackMonthlyStep: "या आठवड्यात एक छोटी, ठोस कृती करा",
    planFallbackMonthlyHow: "\"{goal}\" पुढील 7 दिवसांत पूर्ण करता येईल अशा एका कामात विभागा.",
    planFallbackQuarterlyStep: "तुमची एकूण दिशा तपासा",
    planFallbackQuarterlyHow: "या तिमाहीची प्रगती तुमच्या ध्येयाच्या दिशेने योग्य आहे का हे पाहण्यासाठी 30 मिनिटे काढा.",
    planFallbackYearlyStep: "सातत्य ठेवा",
    planFallbackYearlyHow: "दर तिमाहीला तुमचे ध्येय पुन्हा पाहा आणि रोजचा लूप सुरू ठेवा.",
    tierProgress: "या टप्प्याच्या कालावधीपैकी {pct}% पूर्ण",
    marketAnalyticsBuilding: "तुमचे मार्केट अॅनालिटिक्स तयार होत आहे...",
    planProgressBuilding: "तुमच्या प्रगतीचे मूल्यांकन होत आहे...",
    whatToDoNext: "पुढे काय करायचे",
    refreshingContent: "आजची सामग्री रिफ्रेश होत आहे...",
    demandLabel: "मागणी",
    demandIntro: "वचनबद्ध होण्यापूर्वी या कल्पनेची खरी मागणी तपासा.",
    demandProduct: "उत्पादन (फोटो)",
    demandService: "सेवा (वर्णन करा)",
    demandUploadPhoto: "फोटो अपलोड करा",
    demandProductPlaceholder: "पर्यायी: एक छोटे वर्णन जोडा",
    demandServicePlaceholder: "तुम्ही सुरू करत असलेल्या सेवेचे वर्णन करा",
    demandPollLanguageLabel: "पोलची भाषा:",
    demandGeneratePitch: "पिच तयार करा",
    demandGenerating: "तयार होत आहे...",
    demandPitchLabel: "तुमची पिच",
    demandCreatePoll: "पोल तयार करा",
    demandCreating: "तयार होत आहे...",
    demandShareLabel: "हा पोल शेअर करा",
    demandCopyForInstagram: "लिंक कॉपी करा (Instagram)",
    demandLinkCopied: "लिंक कॉपी झाली!",
    demandResultsLabel: "निकाल",
    demandRefresh: "रिफ्रेश करा",
    demandRefreshing: "रिफ्रेश होत आहे...",
    demandYes: "होय",
    demandMaybe: "कदाचित",
    demandNo: "नाही",
    demandStatusGreen: "चांगली मागणी — पुढे जा",
    demandStatusOrange: "संमिश्र संकेत — थोडे बदल करा",
    demandStatusRed: "कमी मागणी — कल्पनेचा पुनर्विचार करा",
    demandNoResponsesYet: "अजून कोणतेही उत्तर नाही — उत्तरे मिळवण्यासाठी पोल शेअर करा.",
    pollLoading: "लोड होत आहे...",
    pollNotFound: "हा पोल सापडला नाही.",
    pollThanks: "तुमच्या उत्तरासाठी धन्यवाद!",
    pollMessageWhatsApp: "व्हॉट्सअॅपवर मेसेज करा",
    pollTapToRespond: "तुम्ही हे खरेदी कराल / वापराल का?",
    knowledgeBuildingLabel: "तुमचे ज्ञान वाढवा",
    knowledgeBuildingNote: "सुचवलेले: पिच करण्यापूर्वी पहिले 7 दिवस इथे घालवा — दिवस {day} / 7. व्हिडिओ पाहा, यशोगाथा वाचा, आणि पुस्तके टॅब पाहा.",
    seeBooksTab: "पुस्तके टॅब पाहा",
    marketingDemandCallout: "तुमची मागणी तपासणी अजून हिरवी नाही — पहा",
    marketingShareLabel: "ही जाहिरात शेअर करा",
    demandCopyForFacebook: "मजकूर कॉपी करा (Facebook)",
    demandTargetAgeLabel: "लक्ष्य वयोगट",
    demandTargetGenderLabel: "लक्ष्य लिंग",
    demandTargetAny: "कोणतेही",
    demandTargetLabel: "लक्ष्य",
    demandSuggestQuestions: "पोल प्रश्न सुचवा",
    demandPickQuestions: "समाविष्ट करण्यासाठी प्रश्न निवडा",
    demandReviewsLabel: "समीक्षा",
    pollReviewLabel: "काही अभिप्राय? (पर्यायी)",
    pollReviewPlaceholder: "तुम्हाला काय वाटते?",
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

// Fire-and-forget: saving progress must never block the loop the user is
// mid-way through, so failures are logged and swallowed. A save that's lost
// just means the next successful save (or the next loop action) catches up.
function saveUserState(phone, state) {
  const trimmedPhone = (phone || "").trim();
  if (!trimmedPhone) return;
  fetch("/api/user-state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: trimmedPhone, state }),
  }).catch((err) => console.error("saveUserState failed:", err));
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
function PlanTier({ title, items, progressPct, progressLabel }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</div>
        {progressPct != null && <div className="text-[11px] text-gray-400 shrink-0">{progressLabel}</div>}
      </div>
      {progressPct != null && (
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%`, background: BLUE }} />
        </div>
      )}
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

// Public demand-poll page: reached via a shared link (?poll=<id>), no
// account or onboarding needed. Deliberately self-contained — it doesn't
// touch any of UpscaleApp's state, just the poll id from the URL.
function PublicPollView({ id }) {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [voted, setVoted] = useState(null);
  const [voting, setVoting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState("");

  useEffect(() => {
    fetch(`/api/demand-poll?id=${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`demand-poll returned ${res.status}`);
        return res.json();
      })
      .then((data) => setPoll(data))
      .catch((err) => { console.error("PublicPollView fetch failed:", err); setFailed(true); })
      .finally(() => setLoading(false));
  }, [id]);

  function castVote(choice) {
    if (voting || voted) return;
    setVoting(true);
    fetch("/api/demand-poll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "vote", id, vote: choice, answers, review: review.trim() || null }),
    })
      .catch((err) => console.error("PublicPollView vote failed:", err))
      .finally(() => { setVoted(choice); setVoting(false); });
  }

  const lang = poll?.language || "en";
  const tt = (key, vars) => tr(lang, key, vars);
  const questions = poll?.questions || [];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10" style={{ background: NAVY }}>
      <div className="w-full max-w-sm bg-white rounded-xl p-8 border border-gray-200 text-center">
        <div className="flex justify-center mb-6"><Logo /></div>
        {loading ? (
          <p className="text-sm text-gray-500">{tt("pollLoading")}</p>
        ) : failed || !poll ? (
          <p className="text-sm text-gray-500">{tt("pollNotFound")}</p>
        ) : voted ? (
          <div className="space-y-4">
            <div className="text-2xl">✅</div>
            <p className="text-sm font-medium" style={{ color: NAVY }}>{tt("pollThanks")}</p>
            {poll.phone && (voted === "yes" || voted === "maybe") && (
              <a href={`https://wa.me/91${poll.phone}`} target="_blank" rel="noopener noreferrer"
                className="inline-block text-sm font-medium px-4 py-2.5 rounded-lg text-white" style={{ background: "#0F6E56" }}>
                {tt("pollMessageWhatsApp")}
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4 text-left">
            {poll.image_data && <img src={poll.image_data} alt="" className="w-full rounded-lg" />}
            <p className="text-base font-medium text-center" style={{ color: NAVY }}>{poll.pitch}</p>
            {poll.description && !poll.image_data && <p className="text-sm text-gray-600">{poll.description}</p>}

            {questions.map((q) => (
              <div key={q.id}>
                <div className="text-xs font-medium mb-1.5" style={{ color: NAVY }}>{q.label}</div>
                <div className="flex flex-wrap gap-1.5">
                  {q.options.map((opt) => (
                    <button key={opt} type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                      className="text-xs font-medium px-2.5 py-1.5 rounded-full border"
                      style={{ borderColor: answers[q.id] === opt ? BLUE : "#E5E7EB", background: answers[q.id] === opt ? BLUE_BG : "#fff", color: answers[q.id] === opt ? BLUE : "#374151" }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div className="text-xs font-medium mb-1.5" style={{ color: NAVY }}>{tt("pollReviewLabel")}</div>
              <textarea value={review} onChange={(e) => setReview(e.target.value)}
                placeholder={tt("pollReviewPlaceholder")}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm min-h-[60px]" />
            </div>

            <p className="text-xs text-gray-400 text-center">{tt("pollTapToRespond")}</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => castVote("yes")} disabled={voting}
                className="text-sm font-medium py-2.5 rounded-lg text-white disabled:opacity-50" style={{ background: "#0F6E56" }}>
                {tt("demandYes")}
              </button>
              <button onClick={() => castVote("maybe")} disabled={voting}
                className="text-sm font-medium py-2.5 rounded-lg text-white disabled:opacity-50" style={{ background: "#B45309" }}>
                {tt("demandMaybe")}
              </button>
              <button onClick={() => castVote("no")} disabled={voting}
                className="text-sm font-medium py-2.5 rounded-lg text-white disabled:opacity-50" style={{ background: "#B91C1C" }}>
                {tt("demandNo")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Top-level entry: a shared poll link (?poll=<id>) bypasses the whole app
// shell entirely — kept as a separate component (rather than an early
// return inside UpscaleAppInner) so there's no ambiguity about hook order
// between the two very different render paths.
export default function UpscaleApp() {
  const publicPollId = new URLSearchParams(window.location.search).get("poll");
  if (publicPollId) return <PublicPollView id={publicPollId} />;
  return <UpscaleAppInner />;
}

function UpscaleAppInner() {
  const [screen, setScreen] = useState("welcome");
  const [language, setLanguage] = useState("en");
  const t = (key, vars) => tr(language, key, vars);

  const [role, setRole] = useState(null);
  const [loginContact, setLoginContact] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
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
  const [liveContent, setLiveContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentFetchAttempted, setContentFetchAttempted] = useState(false);

  // Demand check: a standing poll the proprietor creates once (not reset
  // daily like the rest of Today's content) to validate a product/service
  // idea with real people before committing to it.
  const [demandPollId, setDemandPollId] = useState(null);
  const [demandInputType, setDemandInputType] = useState("product");
  const [demandImageDataUrl, setDemandImageDataUrl] = useState(null);
  const [demandDescription, setDemandDescription] = useState("");
  const [demandPitch, setDemandPitch] = useState("");
  const [demandPitchLoading, setDemandPitchLoading] = useState(false);
  const [demandPollLanguage, setDemandPollLanguage] = useState("en");
  const [demandCreating, setDemandCreating] = useState(false);
  const [demandError, setDemandError] = useState(null);
  const [demandPollData, setDemandPollData] = useState(null);
  const [demandPollFetchedForId, setDemandPollFetchedForId] = useState(null);
  const [demandPollLoading, setDemandPollLoading] = useState(false);
  const [demandLinkCopied, setDemandLinkCopied] = useState(false);
  const [demandTargetAgeGroup, setDemandTargetAgeGroup] = useState("");
  const [demandTargetGender, setDemandTargetGender] = useState("");
  const [demandSuggestedQuestions, setDemandSuggestedQuestions] = useState(null);
  const [demandSelectedQuestionIds, setDemandSelectedQuestionIds] = useState([]);
  const [demandQuestionsLoading, setDemandQuestionsLoading] = useState(false);

  const [obsText, setObsText] = useState("");
  const [guiding, setGuiding] = useState(false);
  const [guidance, setGuidance] = useState(null);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [ticketsBought, setTicketsBought] = useState([]);
  const [adElapsed, setAdElapsed] = useState(0);
  const [adDone, setAdDone] = useState(false);
  const [marketingData, setMarketingData] = useState(null);
  const [marketingLoading, setMarketingLoading] = useState(false);
  const [marketingFetchAttempted, setMarketingFetchAttempted] = useState(false);
  const [marketingLinkCopied, setMarketingLinkCopied] = useState(null);

  const [marketAnalyticsData, setMarketAnalyticsData] = useState(null);
  const [marketAnalyticsLoading, setMarketAnalyticsLoading] = useState(false);
  const [marketAnalyticsFetchAttempted, setMarketAnalyticsFetchAttempted] = useState(false);

  const [planProgressData, setPlanProgressData] = useState(null);
  const [planProgressLoading, setPlanProgressLoading] = useState(false);
  const [planProgressFetchAttempted, setPlanProgressFetchAttempted] = useState(false);

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
  const investmentAmount = parseCurrency(form.investment);
  const netAmount = totalSales - totalCosts - investmentAmount;
  const obsComplete = obsText.trim().length > 0;

  // Auto per-tier execution progress: derived straight from the existing
  // daily-loop counter (no separate tracking state) against each tier's
  // natural cadence, capped at 100%.
  const monthlyPct = Math.min(100, Math.round((daysDone / 30) * 100));
  const quarterlyPct = Math.min(100, Math.round((daysDone / 90) * 100));
  const yearlyPct = Math.min(100, Math.round((daysDone / 365) * 100));

  // Centralizes the shape of what gets persisted for a proprietor, so the
  // three save points below can't drift out of sync with each other. Takes
  // overrides for values just computed locally that haven't landed in state
  // yet (state setters are async, so e.g. daysDone here can be stale by one).
  function buildPersistedState(overrides = {}) {
    return { language, form, goal, period, planData, daysDone, streak, ledgerEntries, demandPollId, ...overrides };
  }

  // Live daily content: fetched at most once per loop cycle (guarded by
  // contentFetchAttempted, reset in claimReward — NOT by liveContent/
  // contentLoading, which would retry forever on every failure). Fails
  // open by leaving liveContent null so the static subject fallback keeps
  // rendering — the user is never blocked on this. Deliberately does NOT
  // gate the state updates on a "cancelled" flag tied to this effect's
  // cleanup: contentFetchAttempted already guarantees at most one fetch
  // per cycle, so if the user navigates away and back while it's still in
  // flight (re-running this effect), the original request should still be
  // allowed to land instead of leaving contentLoading stuck true forever.
  useEffect(() => {
    if (screen !== "app" || stage !== "content" || contentFetchAttempted) return;
    setContentFetchAttempted(true);
    setContentLoading(true);
    fetch("/api/daily-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectName: subject.name, subcategoryLabel: subject.label || null, language }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`daily-content returned ${res.status}`);
        return res.json();
      })
      .then((data) => setLiveContent(data))
      .catch((err) => console.error("fetchDailyContent failed:", err))
      .finally(() => setContentLoading(false));
  }, [screen, stage, subject.name, subject.label, language, contentFetchAttempted]);

  const displayVideoTitle = liveContent?.video?.title || subject.video.title;
  const displayVideoUrl = liveContent?.video?.url || `https://www.youtube.com/results?search_query=${encodeURIComponent(displayVideoTitle + " animated explainer")}`;
  const displaySuccessStory = liveContent?.successStory || subject.successStory;

  // Marketing strategy: fetched at most once per loop cycle, lazily on
  // first visit to the Marketing tab (guarded by marketingFetchAttempted,
  // reset in claimReward — same retry-safe pattern as the daily-content
  // effect above). There's no static fallback for this content, so on
  // failure the tab shows a retry affordance instead of silently degrading.
  // No "cancelled" gate on the state updates, for the same reason as the
  // daily-content effect: leaving the Marketing tab and coming back while
  // the request is still in flight must not leave marketingLoading stuck
  // true forever with no way to resolve.
  useEffect(() => {
    if (screen !== "app" || tab !== "marketing" || marketingFetchAttempted) return;
    setMarketingFetchAttempted(true);
    setMarketingLoading(true);
    fetch("/api/marketing-strategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectName: subject.name, subcategoryLabel: subject.label || null, language }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`marketing-strategy returned ${res.status}`);
        return res.json();
      })
      .then((data) => setMarketingData(data))
      .catch((err) => console.error("fetchMarketingStrategy failed:", err))
      .finally(() => setMarketingLoading(false));
  }, [screen, tab, subject.name, subject.label, language, marketingFetchAttempted]);

  // Market analytics: fetched once per app session on first visit to the
  // Analytics tab (NOT reset in claimReward like the daily content — a
  // 6-month demand trend doesn't need to regenerate every day, so this
  // deliberately fetches less often to keep API usage low). Falls back to
  // the static per-subject analytics baked into SUBJECTS when unavailable.
  useEffect(() => {
    if (screen !== "app" || tab !== "analytics" || marketAnalyticsFetchAttempted) return;
    setMarketAnalyticsFetchAttempted(true);
    setMarketAnalyticsLoading(true);
    fetch("/api/market-analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectName: subject.name, subcategoryLabel: subject.label || null, city: form.city, language }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`market-analytics returned ${res.status}`);
        return res.json();
      })
      .then((data) => setMarketAnalyticsData(data))
      .catch((err) => console.error("fetchMarketAnalytics failed:", err))
      .finally(() => setMarketAnalyticsLoading(false));
  }, [screen, tab, subject.name, subject.label, form.city, language, marketAnalyticsFetchAttempted]);

  const displayAnalytics = marketAnalyticsData || subject.analytics;

  // Demand poll results: a plain Supabase read (no AI cost), so it's safe
  // to refetch whenever the active poll changes or the proprietor asks for
  // a refresh — unlike the AI fetches above, there's no per-cycle cost
  // concern gating this one.
  function fetchDemandPollResults(id) {
    if (!id) return;
    setDemandPollLoading(true);
    fetch(`/api/demand-poll?id=${encodeURIComponent(id)}&includeResponses=1`)
      .then((res) => {
        if (!res.ok) throw new Error(`demand-poll returned ${res.status}`);
        return res.json();
      })
      .then((data) => setDemandPollData(data))
      .catch((err) => console.error("fetchDemandPollResults failed:", err))
      .finally(() => setDemandPollLoading(false));
  }

  useEffect(() => {
    if (screen !== "app" || !demandPollId || demandPollFetchedForId === demandPollId) return;
    setDemandPollFetchedForId(demandPollId);
    fetchDemandPollResults(demandPollId);
  }, [screen, demandPollId, demandPollFetchedForId]);

  const demandShareUrl = demandPollId ? `${window.location.origin}${window.location.pathname}?poll=${demandPollId}` : "";
  const demandTotalVotes = demandPollData ? demandPollData.yes_count + demandPollData.no_count + demandPollData.maybe_count : 0;
  const demandStatusColor = demandTotalVotes === 0 ? null
    : demandPollData.yes_count / demandTotalVotes >= 0.6 ? "green"
    : demandPollData.yes_count / demandTotalVotes >= 0.35 ? "orange"
    : "red";

  // Per-question option tallies, computed client-side from the raw response
  // rows — response volumes here are small (early-stage testing), so this
  // is simpler and cheaper than aggregating server-side.
  const demandQuestionTallies = (demandPollData?.questions || []).map((q) => {
    const counts = {};
    for (const opt of q.options) counts[opt] = 0;
    for (const r of demandPollData?.responses || []) {
      const answer = r.answers?.[q.id];
      if (answer && counts[answer] != null) counts[answer] += 1;
    }
    return { ...q, counts };
  });
  const demandReviews = (demandPollData?.responses || []).filter((r) => r.review && r.review.trim());

  // Plan execution progress: unlike the simple day-count bars (used as an
  // immediate 0% starting state right after the goal is set), the Progress
  // tab's version is reasoned from the real ledger numbers and the market
  // demand trend, not just days logged — two people with the same streak
  // but very different sales shouldn't show the same progress. Fetched once
  // per loop cycle (reset in claimReward, same guard pattern as the other
  // AI fetches) once a plan exists. Falls back to the day-based bars above
  // if the call hasn't returned yet or fails — never blocks the tab.
  useEffect(() => {
    if (screen !== "app" || tab !== "progress" || !planData || planProgressFetchAttempted) return;
    setPlanProgressFetchAttempted(true);
    setPlanProgressLoading(true);
    fetch("/api/plan-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal, subjectName: subject.name, planData, daysDone, totalDays,
        totalCosts, totalSales, netAmount, investmentAmount,
        demandChangePct: marketAnalyticsData?.demandChangePct ?? null,
        language,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`plan-progress returned ${res.status}`);
        return res.json();
      })
      .then((data) => setPlanProgressData(data))
      .catch((err) => console.error("fetchPlanProgress failed:", err))
      .finally(() => setPlanProgressLoading(false));
  }, [screen, tab, planData, planProgressFetchAttempted]);

  const progressMonthlyPct = planProgressData?.monthlyProgressPct ?? monthlyPct;
  const progressQuarterlyPct = planProgressData?.quarterlyProgressPct ?? quarterlyPct;
  const progressYearlyPct = planProgressData?.yearlyProgressPct ?? yearlyPct;

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
      saveUserState(form.contact, buildPersistedState({ planData: data }));
    } catch (err) {
      console.error("confirmTarget plan generation failed:", err);
      const fallbackPlan = {
        monthly: [{ step: t("planFallbackMonthlyStep"), how: t("planFallbackMonthlyHow", { goal }) }],
        quarterly: [{ step: t("planFallbackQuarterlyStep"), how: t("planFallbackQuarterlyHow") }],
        yearly: { step: t("planFallbackYearlyStep"), how: t("planFallbackYearlyHow") },
      };
      setPlanData(fallbackPlan);
      saveUserState(form.contact, buildPersistedState({ planData: fallbackPlan }));
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
    const newDaysDone = daysDone + 1;
    const newStreak = streak + 1;
    logToSheet({
      name: form.name,
      subject: subject.name,
      target: goal,
      city: form.city,
      contact: form.contact,
      date: todayStr(),
      observationText: obsText,
      streak: newStreak,
    });
    saveUserState(form.contact, buildPersistedState({ daysDone: newDaysDone, streak: newStreak }));
    setDaysDone(newDaysDone);
    setStreak(newStreak);
    setContentDone(false);
    setLiveContent(null);
    setContentFetchAttempted(false);
    setObsText("");
    setGuidance(null);
    setRewardClaimed(false);
    setAdElapsed(0);
    setAdDone(false);
    setMarketingData(null);
    setMarketingFetchAttempted(false);
    setPlanProgressData(null);
    setPlanProgressFetchAttempted(false);
    setStage("content");
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
      const newEntries = [{ type, ...data }, ...ledgerEntries];
      setLedgerEntries(newEntries);
      saveUserState(form.contact, buildPersistedState({ ledgerEntries: newEntries }));
    } catch (err) {
      console.error("handleReceiptUpload failed:", err);
      setLedgerError("Couldn't read that photo — please try again with a clearer shot.");
    } finally {
      if (type === "cost") setUploadingCost(false); else setUploadingSales(false);
    }
  }

  async function handleDemandImageSelect(file) {
    if (!file) return;
    setDemandError(null);
    try {
      const dataUrl = await resizeImageFile(file);
      setDemandImageDataUrl(dataUrl);
      setDemandPitch("");
    } catch (err) {
      console.error("handleDemandImageSelect failed:", err);
      setDemandError("Couldn't read that photo — please try again.");
    }
  }

  async function generateDemandPitch() {
    setDemandError(null);
    setDemandPitchLoading(true);
    try {
      const body = { subjectName: subject.name, inputType: demandInputType, language: demandPollLanguage };
      if (demandInputType === "product") {
        if (!demandImageDataUrl) throw new Error("no image");
        const match = demandImageDataUrl.match(/^data:(.+);base64,(.*)$/);
        if (!match) throw new Error("Could not read image data");
        body.mediaType = match[1];
        body.imageBase64 = match[2];
        body.description = demandDescription.trim() || null;
      } else {
        body.description = demandDescription.trim();
      }
      const res = await fetch("/api/demand-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`demand-pitch returned ${res.status}`);
      const data = await res.json();
      setDemandPitch(data.pitch || "");
    } catch (err) {
      console.error("generateDemandPitch failed:", err);
      setDemandError("Couldn't generate a pitch just now — please try again in a moment.");
    } finally {
      setDemandPitchLoading(false);
    }
  }

  async function generateDemandQuestions() {
    setDemandError(null);
    setDemandQuestionsLoading(true);
    try {
      const res = await fetch("/api/demand-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectName: subject.name,
          inputType: demandInputType,
          description: demandDescription.trim() || null,
          targetAgeGroup: demandTargetAgeGroup || null,
          targetGender: demandTargetGender || null,
          language: demandPollLanguage,
        }),
      });
      if (!res.ok) throw new Error(`demand-questions returned ${res.status}`);
      const data = await res.json();
      const questions = data.questions || [];
      setDemandSuggestedQuestions(questions);
      setDemandSelectedQuestionIds(questions.map((q) => q.id));
    } catch (err) {
      console.error("generateDemandQuestions failed:", err);
      setDemandError("Couldn't suggest questions just now — you can still create the poll without them.");
      setDemandSuggestedQuestions([]);
    } finally {
      setDemandQuestionsLoading(false);
    }
  }

  async function createDemandPoll() {
    setDemandError(null);
    setDemandCreating(true);
    try {
      const selectedQuestions = (demandSuggestedQuestions || []).filter((q) => demandSelectedQuestionIds.includes(q.id));
      const res = await fetch("/api/demand-poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          phone: form.contact,
          subjectName: subject.name,
          inputType: demandInputType,
          imageData: demandInputType === "product" ? demandImageDataUrl : null,
          description: demandDescription.trim() || null,
          pitch: demandPitch,
          questions: selectedQuestions,
          targetAgeGroup: demandTargetAgeGroup || null,
          targetGender: demandTargetGender || null,
          language: demandPollLanguage,
        }),
      });
      if (!res.ok) throw new Error(`demand-poll create returned ${res.status}`);
      const data = await res.json();
      setDemandPollId(data.id);
      saveUserState(form.contact, buildPersistedState({ demandPollId: data.id }));
    } catch (err) {
      console.error("createDemandPoll failed:", err);
      setDemandError("Couldn't create the poll just now — please try again in a moment.");
    } finally {
      setDemandCreating(false);
    }
  }

  async function handleLogin() {
    const trimmedContact = loginContact.trim();
    if (ADMIN_CONTACTS.includes(trimmedContact)) {
      setScreen("admin");
      return;
    }
    if (role === "collaborator") {
      setScreen("collab-dashboard");
      return;
    }
    // Proprietor login: try to restore a previously saved loop. If nothing
    // was ever saved for this number (or the lookup fails), fail open into
    // a fresh onboarding under that number rather than dumping them into a
    // blank, half-configured app screen.
    setLoggingIn(true);
    try {
      const res = await fetch(`/api/user-state?phone=${encodeURIComponent(trimmedContact)}`);
      if (!res.ok) throw new Error(`user-state returned ${res.status}`);
      const data = await res.json();
      if (data.found && data.state) {
        const s = data.state;
        setLanguage(s.language || "en");
        setForm(s.form || { ...form, contact: trimmedContact });
        setGoal(s.goal || "");
        setPeriod(s.period || "Monthly");
        setPlanData(s.planData || null);
        setDaysDone(s.daysDone || 0);
        setStreak(s.streak || 0);
        setLedgerEntries(s.ledgerEntries || []);
        setDemandPollId(s.demandPollId || null);
        setScreen("app");
        return;
      }
    } catch (err) {
      console.error("handleLogin failed:", err);
    } finally {
      setLoggingIn(false);
    }
    setForm((f) => ({ ...f, contact: trimmedContact }));
    setObStep(0);
    setScreen("onboarding");
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
              className={`w-full border rounded-lg p-2.5 text-sm ${loginContact.trim() && !isValidPhone(loginContact) ? "border-red-300 mb-1" : "border-gray-200 mb-2"}`} />
            {loginContact.trim() && !isValidPhone(loginContact) && (
              <p className="text-xs mb-3" style={{ color: "#B91C1C" }}>{t("invalidPhone")}</p>
            )}
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
              onClick={handleLogin}
              disabled={!isValidPhone(loginContact) || (!isAdminContact && !role) || loggingIn}>
              {loggingIn ? "Logging in..." : "Log in"} <ArrowRight size={15} />
            </PrimaryButton>
            <div className="text-[11px] text-gray-400 mt-3">Enter the number you used before to pick up where you left off.</div>
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
      : step === "shopType" ? !!form.shopType
      : step === "contact" ? isValidPhone(form.contact)
      : form[step].trim().length > 0;
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
              <>
                <input className={`w-full border rounded-lg px-3 py-2.5 text-sm ${step === "contact" && form.contact.trim() && !canProceed ? "border-red-300 mb-1" : "border-gray-200 mb-6"}`}
                  value={form[step]}
                  onChange={(e) => setForm({ ...form, [step]: e.target.value })}
                  placeholder={step === "facebook" || step === "instagram" ? t("optional") : step === "investment" ? "e.g. ₹50,000" : ""}
                  onKeyDown={(e) => { if (e.key === "Enter" && canProceed) nextOnb(); }} />
                {step === "contact" && form.contact.trim() && !canProceed && (
                  <p className="text-xs mb-5" style={{ color: "#B91C1C" }}>{t("invalidPhone")}</p>
                )}
              </>
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
                <PlanTier title={t("periodMonthly")} items={planData.monthly} progressPct={monthlyPct} progressLabel={t("tierProgress", { pct: monthlyPct })} />
                <PlanTier title={t("periodQuarterly")} items={planData.quarterly} progressPct={quarterlyPct} progressLabel={t("tierProgress", { pct: quarterlyPct })} />
                <PlanTier title={t("yearlyTier")} items={[planData.yearly]} progressPct={yearlyPct} progressLabel={t("tierProgress", { pct: yearlyPct })} />
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
    { key: "reward", label: t("stageCollaboration"), icon: Gift, done: rewardClaimed },
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
          { key: "demand", label: t("tabDemand"), icon: HelpCircle },
          { key: "marketing", label: t("tabMarketing"), icon: Megaphone },
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
              <div className="space-y-4 mb-3">
                <PlanTier title={t("periodMonthly")} items={planData.monthly} progressPct={progressMonthlyPct} progressLabel={t("tierProgress", { pct: progressMonthlyPct })} />
                <PlanTier title={t("periodQuarterly")} items={planData.quarterly} progressPct={progressQuarterlyPct} progressLabel={t("tierProgress", { pct: progressQuarterlyPct })} />
                <PlanTier title={t("yearlyTier")} items={[planData.yearly]} progressPct={progressYearlyPct} progressLabel={t("tierProgress", { pct: progressYearlyPct })} />
              </div>
              {planProgressLoading && !planProgressData && (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Sparkles size={14} className="animate-pulse" style={{ color: BLUE }} /> {t("planProgressBuilding")}
                </div>
              )}
              {planProgressData?.progressNote && (
                <div className="rounded-lg p-3 border" style={{ borderColor: BLUE, background: BLUE_BG }}>
                  <div className="text-[11px] font-medium uppercase tracking-wide mb-1" style={{ color: BLUE }}>{t("whatToDoNext")}</div>
                  <p className="text-sm" style={{ color: NAVY }}>{planProgressData.progressNote}</p>
                </div>
              )}
            </div>
          )}
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
      ) : tab === "demand" ? (
        <div className="px-6 py-6 bg-white">
          {!demandPollId ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">{t("demandIntro")}</p>
              <div className="flex gap-2">
                <button onClick={() => { setDemandInputType("product"); setDemandPitch(""); setDemandSuggestedQuestions(null); }}
                  className="flex-1 text-xs font-medium py-2 rounded-lg border"
                  style={{ borderColor: demandInputType === "product" ? BLUE : "#E5E7EB", background: demandInputType === "product" ? BLUE_BG : "#fff", color: demandInputType === "product" ? BLUE : "#374151" }}>
                  {t("demandProduct")}
                </button>
                <button onClick={() => { setDemandInputType("service"); setDemandPitch(""); setDemandSuggestedQuestions(null); }}
                  className="flex-1 text-xs font-medium py-2 rounded-lg border"
                  style={{ borderColor: demandInputType === "service" ? BLUE : "#E5E7EB", background: demandInputType === "service" ? BLUE_BG : "#fff", color: demandInputType === "service" ? BLUE : "#374151" }}>
                  {t("demandService")}
                </button>
              </div>

              {demandInputType === "product" && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 flex flex-col items-center gap-1.5">
                  <input type="file" accept="image/*" capture="environment" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) handleDemandImageSelect(f); }} />
                  {demandImageDataUrl ? (
                    <img src={demandImageDataUrl} alt="" className="max-h-32 rounded-lg" />
                  ) : (
                    <>
                      <Upload size={18} style={{ color: BLUE }} />
                      <span className="text-xs font-medium" style={{ color: NAVY }}>{t("demandUploadPhoto")}</span>
                    </>
                  )}
                </label>
              )}

              <textarea value={demandDescription} onChange={(e) => setDemandDescription(e.target.value)}
                placeholder={demandInputType === "service" ? t("demandServicePlaceholder") : t("demandProductPlaceholder")}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm min-h-[60px] bg-white" />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[11px] text-gray-400 mb-1">{t("demandTargetAgeLabel")}</div>
                  <select value={demandTargetAgeGroup} onChange={(e) => setDemandTargetAgeGroup(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white">
                    <option value="">{t("demandTargetAny")}</option>
                    {AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 mb-1">{t("demandTargetGenderLabel")}</div>
                  <select value={demandTargetGender} onChange={(e) => setDemandTargetGender(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white">
                    {GENDERS.map((g) => <option key={g} value={g === "Any" ? "" : g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400">{t("demandPollLanguageLabel")}</span>
                {Object.entries(LANGUAGES).map(([key, label]) => (
                  <button key={key} onClick={() => setDemandPollLanguage(key)}
                    className="text-xs font-medium px-2 py-1 rounded-full border"
                    style={{ borderColor: demandPollLanguage === key ? BLUE : "#E5E7EB", background: demandPollLanguage === key ? BLUE_BG : "#fff", color: demandPollLanguage === key ? BLUE : "#374151" }}>
                    {label}
                  </button>
                ))}
              </div>

              {demandError && <p className="text-xs" style={{ color: "#B91C1C" }}>{demandError}</p>}

              {!demandPitch ? (
                <button onClick={generateDemandPitch}
                  disabled={demandPitchLoading || (demandInputType === "product" ? !demandImageDataUrl : !demandDescription.trim())}
                  className="w-full text-sm font-medium px-4 py-2.5 rounded-lg text-white disabled:opacity-40 flex items-center justify-center gap-1.5" style={{ background: BLUE }}>
                  {demandPitchLoading ? t("demandGenerating") : t("demandGeneratePitch")}
                </button>
              ) : (
                <>
                  <div className="rounded-lg p-3 border" style={{ borderColor: BLUE, background: BLUE_BG }}>
                    <div className="text-[11px] font-medium uppercase tracking-wide mb-1" style={{ color: BLUE }}>{t("demandPitchLabel")}</div>
                    <textarea value={demandPitch} onChange={(e) => setDemandPitch(e.target.value)}
                      className="w-full bg-transparent text-sm border-0 p-0 resize-none focus:outline-none" style={{ color: NAVY }} rows={2} />
                  </div>

                  {demandSuggestedQuestions === null ? (
                    <button onClick={generateDemandQuestions} disabled={demandQuestionsLoading}
                      className="w-full text-sm font-medium px-4 py-2.5 rounded-lg border disabled:opacity-40" style={{ borderColor: BLUE, color: BLUE }}>
                      {demandQuestionsLoading ? t("demandGenerating") : t("demandSuggestQuestions")}
                    </button>
                  ) : demandSuggestedQuestions.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{t("demandPickQuestions")}</div>
                      {demandSuggestedQuestions.map((q) => (
                        <label key={q.id} className="flex items-center gap-2 bg-white rounded-lg p-2.5 border border-gray-200 cursor-pointer">
                          <input type="checkbox" checked={demandSelectedQuestionIds.includes(q.id)}
                            onChange={(e) => setDemandSelectedQuestionIds((ids) => e.target.checked ? [...ids, q.id] : ids.filter((id) => id !== q.id))} />
                          <span className="text-sm text-gray-700">{q.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  <PrimaryButton onClick={createDemandPoll} disabled={demandCreating || !demandPitch.trim()}>
                    {demandCreating ? t("demandCreating") : t("demandCreatePoll")}
                  </PrimaryButton>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-700 italic">"{demandPollData?.pitch || demandPitch}"</p>
                {(demandPollData?.target_age_group || demandPollData?.target_gender) && (
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    {t("demandTargetLabel")}: {[demandPollData.target_gender, demandPollData.target_age_group].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>

              <div>
                <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">{t("demandShareLabel")}</div>
                <div className="flex gap-2">
                  <a href={`https://wa.me/?text=${encodeURIComponent((demandPollData?.pitch || demandPitch) + " " + demandShareUrl)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-xs font-medium py-2 rounded-lg border text-center" style={{ borderColor: "#25D366", color: "#0F6E56" }}>
                    WhatsApp
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(demandShareUrl)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-xs font-medium py-2 rounded-lg border text-center" style={{ borderColor: BLUE, color: BLUE }}>
                    Facebook
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(demandShareUrl).then(() => { setDemandLinkCopied(true); setTimeout(() => setDemandLinkCopied(false), 2000); }); }}
                    className="flex-1 text-xs font-medium py-2 rounded-lg border" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
                    {demandLinkCopied ? t("demandLinkCopied") : t("demandCopyForInstagram")}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{t("demandResultsLabel")}</div>
                  <button onClick={() => fetchDemandPollResults(demandPollId)} className="text-[11px] font-medium" style={{ color: BLUE }}>
                    {demandPollLoading ? t("demandRefreshing") : t("demandRefresh")}
                  </button>
                </div>
                {demandPollData ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="text-center rounded-lg p-2" style={{ background: "#E7F5EF" }}>
                        <div className="text-lg font-medium" style={{ color: "#0F6E56" }}>{demandPollData.yes_count}</div>
                        <div className="text-[10px] text-gray-500">{t("demandYes")}</div>
                      </div>
                      <div className="text-center rounded-lg p-2" style={{ background: "#FEF3E7" }}>
                        <div className="text-lg font-medium" style={{ color: "#B45309" }}>{demandPollData.maybe_count}</div>
                        <div className="text-[10px] text-gray-500">{t("demandMaybe")}</div>
                      </div>
                      <div className="text-center rounded-lg p-2" style={{ background: "#FDECEC" }}>
                        <div className="text-lg font-medium" style={{ color: "#B91C1C" }}>{demandPollData.no_count}</div>
                        <div className="text-[10px] text-gray-500">{t("demandNo")}</div>
                      </div>
                    </div>
                    {demandStatusColor && (
                      <div className="rounded-lg p-2.5 flex items-center gap-2 mb-3" style={{ background: demandStatusColor === "green" ? "#E7F5EF" : demandStatusColor === "orange" ? "#FEF3E7" : "#FDECEC" }}>
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: demandStatusColor === "green" ? "#0F6E56" : demandStatusColor === "orange" ? "#B45309" : "#B91C1C" }} />
                        <span className="text-xs font-medium" style={{ color: demandStatusColor === "green" ? "#0F6E56" : demandStatusColor === "orange" ? "#B45309" : "#B91C1C" }}>
                          {t(demandStatusColor === "green" ? "demandStatusGreen" : demandStatusColor === "orange" ? "demandStatusOrange" : "demandStatusRed")}
                        </span>
                      </div>
                    )}

                    {demandQuestionTallies.length > 0 && (
                      <div className="space-y-3 mb-3">
                        {demandQuestionTallies.map((q) => (
                          <div key={q.id}>
                            <div className="text-xs font-medium mb-1" style={{ color: NAVY }}>{q.label}</div>
                            <div className="space-y-1">
                              {q.options.map((opt) => (
                                <div key={opt} className="flex items-center justify-between text-[11px] text-gray-500 bg-white rounded p-1.5 border border-gray-200">
                                  <span>{opt}</span>
                                  <span className="font-medium" style={{ color: NAVY }}>{q.counts[opt]}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {demandReviews.length > 0 && (
                      <div>
                        <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">{t("demandReviewsLabel")}</div>
                        <div className="space-y-2">
                          {demandReviews.map((r, i) => (
                            <div key={i} className="bg-white rounded-lg p-2.5 border border-gray-200 text-xs text-gray-700">"{r.review}"</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-gray-400">{t("demandNoResponsesYet")}</p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : tab === "marketing" ? (
        <div className="px-6 py-6 bg-white">
          <p className="text-sm text-gray-500 mb-4">{t("marketingIntro", { subject: subject.name })}</p>
          {demandPollId && demandStatusColor && demandStatusColor !== "green" && (
            <div className="rounded-lg p-3 mb-4 flex items-center gap-2" style={{ background: demandStatusColor === "orange" ? "#FEF3E7" : "#FDECEC" }}>
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: demandStatusColor === "orange" ? "#B45309" : "#B91C1C" }} />
              <span className="text-xs" style={{ color: demandStatusColor === "orange" ? "#B45309" : "#B91C1C" }}>
                {t("marketingDemandCallout")} <button onClick={() => setTab("demand")} className="font-medium underline">{t("tabDemand")} →</button>
              </span>
            </div>
          )}
          {marketingLoading && !marketingData && (
            <div className="text-sm text-gray-500 flex items-center gap-2 mb-4">
              <Sparkles size={14} className="animate-pulse" style={{ color: BLUE }} /> {t("marketingBuilding")}
            </div>
          )}
          {marketingData ? (
            <div className="space-y-4">
              <div className="rounded-lg p-4 border" style={{ borderColor: BLUE, background: BLUE_BG }}>
                <div className="text-[11px] font-medium uppercase tracking-wide mb-1" style={{ color: BLUE }}>{t("marketingAngleLabel")}</div>
                <div className="text-sm font-medium mb-2" style={{ color: NAVY }}>{marketingData.angle}</div>
                <div className="text-sm text-gray-700 italic">"{marketingData.pitch}"</div>
              </div>
              <div className="text-sm text-gray-600">{marketingData.strategy}</div>
              <div>
                <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">{t("marketingTacticsLabel")}</div>
                <div className="space-y-2">
                  {(marketingData.tactics || []).map((tc, i) => (
                    <div key={i} className="rounded-lg p-3 border border-gray-200">
                      <div className="text-sm font-medium" style={{ color: NAVY }}>{tc.tactic}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{tc.how}</div>
                    </div>
                  ))}
                </div>
              </div>
              {marketingData.video?.title && (
                <div>
                  <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">{t("videoLabel")}</div>
                  <a href={marketingData.video.url || `https://www.youtube.com/results?search_query=${encodeURIComponent(marketingData.video.title)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="block bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-3 hover:border-gray-300">
                    <PlayCircle size={24} style={{ color: BLUE }} />
                    <div className="text-sm text-gray-800">{marketingData.video.title}</div>
                  </a>
                </div>
              )}
              <div>
                <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">{t("marketingShareLabel")}</div>
                <div className="flex gap-2">
                  <a href={`https://wa.me/?text=${encodeURIComponent(marketingData.pitch)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-xs font-medium py-2 rounded-lg border text-center" style={{ borderColor: "#25D366", color: "#0F6E56" }}>
                    WhatsApp
                  </a>
                  <button onClick={() => { navigator.clipboard.writeText(marketingData.pitch).then(() => { setMarketingLinkCopied("facebook"); setTimeout(() => setMarketingLinkCopied(null), 2000); }); }}
                    className="flex-1 text-xs font-medium py-2 rounded-lg border" style={{ borderColor: BLUE, color: BLUE }}>
                    {marketingLinkCopied === "facebook" ? t("demandLinkCopied") : t("demandCopyForFacebook")}
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(marketingData.pitch).then(() => { setMarketingLinkCopied("instagram"); setTimeout(() => setMarketingLinkCopied(null), 2000); }); }}
                    className="flex-1 text-xs font-medium py-2 rounded-lg border" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
                    {marketingLinkCopied === "instagram" ? t("demandLinkCopied") : t("demandCopyForInstagram")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            !marketingLoading && marketingFetchAttempted && (
              <div className="text-sm text-gray-400 flex items-center gap-3">
                {t("marketingUnavailable")}
                <button onClick={() => setMarketingFetchAttempted(false)} className="text-xs font-medium underline" style={{ color: BLUE }}>{t("tryAgain")}</button>
              </div>
            )
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
              <div className="text-xs text-gray-400 mb-1">Net (incl. investment)</div>
              <div className="text-lg font-medium" style={{ color: netAmount >= 0 ? "#0F6E56" : "#B91C1C" }}>
                {netAmount >= 0 ? "+₹" : "-₹"}{Math.abs(netAmount).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          {investmentAmount > 0 && (
            <p className="text-[11px] text-gray-400 -mt-4 mb-6">
              Net accounts for your ₹{investmentAmount.toLocaleString("en-IN")} starting investment — it turns positive once sales have covered both costs and that investment.
            </p>
          )}

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

          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mt-8 mb-2">
            Market analytics — {subject.name}{form.city ? ` · ${form.city}` : ""}
          </div>
          {marketAnalyticsLoading && !marketAnalyticsData && (
            <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
              <Sparkles size={14} className="animate-pulse" style={{ color: BLUE }} /> {t("marketAnalyticsBuilding")}
            </div>
          )}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500">Demand trend, last 6 months</span>
              <span className="text-xs font-medium" style={{ color: displayAnalytics.demandChangePct >= 0 ? "#0F6E56" : "#B91C1C" }}>
                {displayAnalytics.demandChangePct >= 0 ? "+" : ""}{displayAnalytics.demandChangePct}% vs last month
              </span>
            </div>
            <div className="flex items-end gap-2 h-16 mb-1">
              {displayAnalytics.demand.map((v, i) => (
                <div key={i} className="flex-1 rounded-t" style={{ height: `${v}%`, background: BLUE_BG, borderTop: `3px solid ${BLUE}` }} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{displayAnalytics.insight}</p>
          </div>
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
                  {contentLoading && !liveContent && (
                    <p className="text-[11px] text-gray-400 -mt-2 flex items-center gap-1">
                      <Sparkles size={11} className="animate-pulse" /> {t("refreshingContent")}
                    </p>
                  )}
                  <div className="rounded-lg p-3 border" style={{ borderColor: BLUE, background: BLUE_BG }}>
                    <div className="text-[11px] font-medium uppercase tracking-wide mb-1" style={{ color: BLUE }}>{t("knowledgeBuildingLabel")}</div>
                    <p className="text-xs" style={{ color: NAVY }}>{t("knowledgeBuildingNote", { day: Math.min(daysDone + 1, 7) })}</p>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">{t("videoLabel")}</div>
                    <a href={displayVideoUrl}
                      target="_blank" rel="noopener noreferrer"
                      className="block bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-3 hover:border-gray-300">
                      <PlayCircle size={24} style={{ color: BLUE }} />
                      <div>
                        <div className="text-sm text-gray-800">{displayVideoTitle}</div>
                        {!liveContent?.video?.title && <div className="text-xs text-gray-400">{subject.video.duration}</div>}
                      </div>
                    </a>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">{t("successStoryLabel")}</div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 text-sm text-gray-700">{displaySuccessStory}</div>
                  </div>
                  <button onClick={() => setTab("recommendations")} className="text-xs font-medium" style={{ color: BLUE }}>
                    {t("seeBooksTab")} →
                  </button>
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
                        {t("unlockCollaboration")} <ArrowRight size={14} />
                      </PrimaryButton>
                    </>
                  )}
                </div>
              )}

              {stage === "reward" && SHOW_REWARD_AD && !adDone && (
                <div className="space-y-4 text-center py-2">
                  <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{t("sponsoredUnlock")}</div>
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

              {stage === "reward" && (!SHOW_REWARD_AD || adDone) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1"><Gift size={16} style={{ color: BLUE }} /><h2 className="text-sm font-medium" style={{ color: NAVY }}>{t("stageCollaboration")}</h2></div>

                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide pt-1">{t("marketingStrategyLabel")}</div>
                  {marketingData ? (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-sm font-medium" style={{ color: NAVY }}>{marketingData.angle}</div>
                      <div className="text-xs text-gray-500 mt-0.5 italic">"{marketingData.pitch}"</div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-3 border border-gray-200 text-xs text-gray-500">{t("marketingPreviewHint")}</div>
                  )}
                  <button onClick={() => setTab("marketing")} className="text-xs font-medium" style={{ color: BLUE }}>
                    {t("seeMarketingTab")} →
                  </button>

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
