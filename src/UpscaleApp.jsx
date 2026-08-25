import { useState } from "react";
import {
  ArrowRight, ArrowLeft, Check, Flame, Target, Sparkles, TrendingUp,
  PlayCircle, HelpCircle, Eye, Megaphone, Users, Bot, LayoutGrid, X,
  Lock, Gift, ChevronRight, Calendar, Ticket, ShieldCheck, IndianRupee, Handshake, Globe,
  Plus, Share2, Image as ImageIcon, Newspaper
} from "lucide-react";

const NAVY = "#0F2E7A";
const BLUE = "#2955E0";
const BLUE_BG = "#EAF0FD";
const ORANGE = "#E8672B";

const CURATED = {
  "Home loan advisory": {
    trend: "RBI repo rate held steady this quarter — a useful talking point for rate-sensitive leads.",
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
  },
  "Insurance advisory": {
    trend: "IRDAI's claim settlement timeline circular was updated last week.",
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
  },
  "Sports retail": {
    trend: "Local school sports season starts next month — footfall usually rises 2-3 weeks prior.",
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
  },
  "General business": {
    trend: "Most small businesses lose more to inconsistent follow-up than to competition.",
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
  },
  "Stock broking": {
    trend: "SEBI's revised intraday margin norms take effect this month.",
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
  },
  "Mutual fund advisory": {
    trend: "SIP inflows hit a fresh high this quarter — a good moment to talk consistency with clients.",
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
  },
  "Jewelry retail": {
    trend: "Gold rates have stabilized this week after last month's volatility — a good moment to talk fixed-rate booking with customers.",
    update: "Footfall for wedding-season bookings is picking up earlier than usual this year.",
    successStory: "A jeweler in Camp grew bridal bookings 30% by offering fixed-rate price locks.",
    video: { title: "Turning gold-rate anxiety into a booked sale", duration: "5 min" },
    quiz: [
      { q: "What's happened to gold rates this week, per today's trend?", options: ["Stabilized", "Doubled", "Fell to zero"], correct: 0 },
      { q: "What's the suggested angle today?", options: ["Fixed-rate booking", "Discount everything", "Wait and see"], correct: 0 },
    ],
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
    trend: `Recent shifts worth tracking in ${lower}: changing customer expectations and pricing pressure.`,
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
  };
}
const SUBJECTS = Object.fromEntries(
  INTEREST_NAMES.map((name) => [slugify(name), { name, ...(CURATED[name] || genericContent(name)) }])
);

const MOCK_LEADS = [
  { name: "Priya Nair", detail: "Enquired about services in your area this week", source: "Google" },
  { name: "Vikram Shah", detail: "Looking for a local provider, budget-conscious", source: "Google" },
  { name: "Ritu Deshmukh", detail: "Referred by a nearby business owner", source: "Suggested" },
];

const AGENTS = [
  { key: "marketing", name: "Marketing Agent", price: "₹999/mo", desc: "Connect Facebook, Instagram, and Google — upload a post once, it goes out everywhere.", stub: false },
  { key: "advisory", name: "Advisory Agent", price: "₹1,499/mo", desc: "A more personalized, ongoing version of your daily plan and guidance.", stub: true },
];
const SHARE_DESTINATIONS = [
  { key: "whatsapp", label: "WhatsApp" },
  { key: "family", label: "Family/friends group" },
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "google", label: "Google Business Profile" },
];

const MOCK_FIRMS = [
  { name: "R. Deshpande", role: "proprietor", subject: "Home loan advisory", target: "Close 10 loans this quarter", daysDone: 12, streak: 6, agents: ["marketing"] },
  { name: "A. Kulkarni", role: "proprietor", subject: "Insurance advisory", target: "Grow renewal rate to 80%", daysDone: 4, streak: 2, agents: [] },
  { name: "S. Patwardhan", role: "collaborator", subject: "Sports retail", target: "Launch a coaching camp", daysDone: 9, streak: 4, agents: ["marketing", "advisory"] },
];

const ONB_STEPS = ["interest", "name", "contact", "facebook", "instagram", "linkedin"];
const COLLAB_STEPS = ["name", "businessName", "expertise", "city", "govId"];
function GENERIC_COLLAB_REQUESTS(name) {
  return [
    { text: `Looking for a reliable ${name?.toLowerCase() || "business"} partner nearby`, from: "Proprietor request" },
    { text: `Open to a parallel-business collaboration in ${name || "this field"}`, from: "Proprietor request" },
  ];
}
const PERIODS = ["Monthly", "Quarterly", "Semi-yearly", "Annually"];
const PERIOD_DAYS = { "Monthly": 30, "Quarterly": 90, "Semi-yearly": 182, "Annually": 365 };

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

export default function UpscaleApp() {
  const [screen, setScreen] = useState("welcome");

  const [role, setRole] = useState(null);
  const [loginContact, setLoginContact] = useState("");
  const [obStep, setObStep] = useState(0);
  const [form, setForm] = useState({ interest: "home-loan-advisory", name: "", contact: "", facebook: "", instagram: "", linkedin: "" });

  const [goal, setGoal] = useState("");
  const [period, setPeriod] = useState("Monthly");
  const [agentPicks, setAgentPicks] = useState([]);
  const [feePaid, setFeePaid] = useState(false);

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
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [ticketsBought, setTicketsBought] = useState([]);

  const [daysDone, setDaysDone] = useState(0);
  const [streak, setStreak] = useState(0);
  const [purchasedAgents, setPurchasedAgents] = useState([]);
  const [sharePlatform, setSharePlatform] = useState("whatsapp");
  const [postProduct, setPostProduct] = useState("");
  const [posts, setPosts] = useState([]);
  const [adminView, setAdminView] = useState(false);

  const subject = SUBJECTS[form.interest];
  const totalDays = PERIOD_DAYS[period];
  const obsComplete = obsText.trim().length > 0;

  function toggleAgentPick(key) {
    setAgentPicks((a) => (a.includes(key) ? a.filter((x) => x !== key) : [...a, key]));
  }
  function confirmTarget() { setScreen("plan"); }

  function nextOnb() { if (obStep < ONB_STEPS.length - 1) setObStep(obStep + 1); else setScreen("target"); }
  function backOnb() { if (obStep > 0) setObStep(obStep - 1); }

  function runValidation() {
    setValidating(true);
    setTimeout(() => { setValidating(false); setValidated(true); }, 1200);
  }

  function claimReward() {
    setPurchasedAgents((pa) => [...new Set([...pa, ...agentPicks])]);
    setDaysDone((d) => d + 1);
    setStreak((s) => s + 1);
    setContentDone(false);
    setObsText("");
    setValidated(false);
    setRewardClaimed(false);
    setStage("content");
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
        <h1 className="text-2xl font-medium text-white mt-6 mb-2">Observe. Execute. Reward. Grow.</h1>
        <p className="text-sm mb-8 max-w-xs" style={{ color: "#9FB0CC" }}>
          Two ways in — choose the one that's you.
        </p>
        <div className="w-full max-w-xs space-y-3">
          <button onClick={() => { setRole("proprietor"); setScreen("onboarding"); }}
            className="w-full text-left rounded-xl p-4 border transition-colors" style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}>
            <div className="text-sm font-medium text-white mb-0.5">Sign up as Proprietor</div>
            <div className="text-[11px]" style={{ color: "#C7D2FE" }}>I run my own business — free to join</div>
          </button>
          <button onClick={() => { setRole("collaborator"); setScreen("collab-onboarding"); }}
            className="w-full text-left rounded-xl p-4 border transition-colors" style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}>
            <div className="text-sm font-medium text-white mb-0.5">Sign up as Collaborator</div>
            <div className="text-[11px]" style={{ color: "#C7D2FE" }}>I help/work with businesses — free for Year 1</div>
          </button>
        </div>
        <button onClick={() => setScreen("login")} className="text-xs mt-6 underline" style={{ color: "#C7D2FE" }}>
          Already have an account? Log in
        </button>
      </div>
    );
  }

  // --- Login (existing users) ---
  if (screen === "login") {
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
            <div className="flex gap-2 mb-5">
              {[{ key: "proprietor", label: "Proprietor" }, { key: "collaborator", label: "Collaborator" }].map((r) => (
                <button key={r.key} onClick={() => setRole(r.key)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border"
                  style={{ borderColor: role === r.key ? BLUE : "#E5E7EB", color: role === r.key ? BLUE : "#374151", background: role === r.key ? BLUE_BG : "#fff" }}>
                  {r.label}
                </button>
              ))}
            </div>
            <PrimaryButton onClick={() => setScreen(role === "collaborator" ? "collab-dashboard" : "app")} disabled={!loginContact.trim() || !role}>
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
    const step = ONB_STEPS[obStep];
    const labels = {
      interest: role === "collaborator" ? "What's your area of expertise?" : "What's your area of interest?",
      name: "What's your name?",
      contact: "Your contact number / WhatsApp",
      facebook: "Your Facebook profile or page link (optional)",
      instagram: "Your Instagram link (optional)",
      linkedin: "Your LinkedIn link (optional)",
    };
    const canProceed = step === "interest" || step === "facebook" || step === "instagram" || step === "linkedin" ? true : form[step].trim().length > 0;
    return (
      <div className="w-full min-h-[600px] rounded-xl flex items-center justify-center px-6" style={{ background: "#F7F8FA" }}>
        {style}
        <FadeIn keyProp={obStep}>
          <div className="w-full max-w-md bg-white rounded-xl p-8 border border-gray-200">
            <Logo />
            <div className="flex gap-1.5 my-6">
              {ONB_STEPS.map((_, i) => <div key={i} className="h-1 flex-1 rounded-full transition-colors duration-300" style={{ background: i <= obStep ? ORANGE : "#E5E7EB" }} />)}
            </div>
            <div className="text-xs font-medium mb-1.5" style={{ color: BLUE }}>Question {obStep + 1} of {ONB_STEPS.length}</div>
            <h2 className="text-lg font-medium mb-5" style={{ color: NAVY }}>{labels[step]}</h2>
            {step === "interest" ? (
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-6" value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}>
                {Object.entries(SUBJECTS).map(([key, s]) => <option key={key} value={key}>{s.name}</option>)}
              </select>
            ) : (
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-6" value={form[step]}
                onChange={(e) => setForm({ ...form, [step]: e.target.value })}
                placeholder={step === "facebook" || step === "instagram" || step === "linkedin" ? "Optional" : ""}
                onKeyDown={(e) => { if (e.key === "Enter" && canProceed) nextOnb(); }} />
            )}
            <div className="flex justify-between">
              {obStep > 0 ? (
                <button onClick={backOnb} className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-1" style={{ color: NAVY }}>
                  <ArrowLeft size={14} /> Back
                </button>
              ) : <div />}
              <PrimaryButton onClick={nextOnb} disabled={!canProceed}>
                {obStep === ONB_STEPS.length - 1 ? "Set my target" : "Next"} <ArrowRight size={14} />
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
            <h1 className="text-lg font-medium mb-1" style={{ color: NAVY }}>Your first year is free, {collabForm.name || "there"}</h1>
            <p className="text-sm text-gray-500 mb-4">
              Year 1 is completely free. After that, a one-time ₹500 payment gets you lifetime access — no renewals, no subscription. A 10% commission applies on business you do or get with the help of Upscale.
            </p>
            <div className="rounded-lg p-3 mb-6 border border-gray-200 text-sm text-gray-700">
              <div className="mb-1"><span className="text-gray-400">Business:</span> {collabForm.businessName}</div>
              <div className="mb-1"><span className="text-gray-400">Expertise:</span> {SUBJECTS[collabForm.expertise]?.name}</div>
              <div><span className="text-gray-400">City:</span> {collabForm.city}</div>
            </div>
            {feePaid ? (
              <div className="text-sm font-medium flex items-center gap-1 mb-4" style={{ color: "#0F6E56" }}><Check size={14} /> Lifetime access secured — ₹500 paid</div>
            ) : (
              <button onClick={() => setFeePaid(true)} className="text-xs font-medium px-3 py-1.5 rounded-lg border mb-4" style={{ borderColor: BLUE, color: BLUE }}>
                Lock in lifetime access now for ₹500 (optional)
              </button>
            )}
            <div>
              <PrimaryButton onClick={() => setScreen("collab-dashboard")}>Start my free year <ArrowRight size={15} /></PrimaryButton>
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
            {feePaid ? "Lifetime access · " : "Free (Year 1) · "}10% commission
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
                <div className="text-[11px] text-gray-400">Upscale takes a 10% commission on paid ticket sales through the app.</div>
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
              <span className="text-xs font-medium" style={{ color: BLUE }}>Set your target</span>
            </div>
            <h1 className="text-lg font-medium mb-1" style={{ color: NAVY }}>What are you working toward, {form.name || "there"}?</h1>
            <p className="text-sm text-gray-500 mb-4">A real goal, not just a number — e.g. "start my own {subject.name.toLowerCase()} firm."</p>
            <textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Your target for this period"
              className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[80px] mb-4" />
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Over what period?</div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {PERIODS.map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className="rounded-lg py-2 text-sm border"
                  style={{ borderColor: period === p ? BLUE : "#E5E7EB", background: period === p ? BLUE_BG : "#fff", color: period === p ? BLUE : "#374151" }}>
                  {p}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-400 mb-4">Your target is fixed for this period — it can't be edited until it ends.</div>

            <div className="rounded-lg p-3 mb-6 border" style={{ borderColor: BLUE, background: BLUE_BG }}>
              <div className="flex items-start gap-2">
                <IndianRupee size={14} style={{ color: BLUE }} className="mt-0.5 shrink-0" />
                <p className="text-xs" style={{ color: NAVY }}>
                  Upscale's core app is free for proprietors. The only paid parts are the AI Agents below, if you choose to add one.
                </p>
              </div>
            </div>

            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Optional: add an AI Agent</div>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {AGENTS.map((a) => (
                <button key={a.key} onClick={() => toggleAgentPick(a.key)} className="text-left border rounded-lg p-3"
                  style={{ borderColor: agentPicks.includes(a.key) ? BLUE : "#E5E7EB", background: agentPicks.includes(a.key) ? BLUE_BG : "#fff" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Bot size={14} style={{ color: NAVY }} />
                    <span className="text-xs font-medium" style={{ color: NAVY }}>{a.name}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mb-1">{a.desc}</div>
                  <div className="text-[11px] font-medium" style={{ color: BLUE }}>{a.price}</div>
                </button>
              ))}
            </div>
            <PrimaryButton onClick={confirmTarget} disabled={!goal.trim()}>
              {agentPicks.length ? "Continue with agents" : "Skip agents — continue"} <ArrowRight size={15} />
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
              <span className="text-xs font-medium" style={{ color: BLUE }}>Your plan</span>
            </div>
            <h1 className="text-lg font-medium mb-1" style={{ color: NAVY }}>Toward: "{goal}"</h1>
            <p className="text-sm text-gray-500 mb-6">Over the next {period}, here's how we'll get there.</p>
            <div className="space-y-3 mb-6">
              {[
                { icon: Newspaper, label: "Daily content", desc: `An update, trend, short video, and success story on ${subject.name} every day.` },
                { icon: Eye, label: "Your observation", desc: "One overall observation — what you've noticed in your business." },
                { icon: ShieldCheck, label: "AI validation", desc: "Your observation is checked before it unlocks the next step." },
                { icon: Gift, label: "Daily reward", desc: "Leads, collaboration requests, and events unlocked for your business." },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-3 border border-gray-200 flex gap-3">
                  <s.icon size={16} style={{ color: BLUE }} className="mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium" style={{ color: NAVY }}>{s.label}</div>
                    <div className="text-xs text-gray-500">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <PrimaryButton onClick={() => setScreen("app")}>Start today's loop <ArrowRight size={15} /></PrimaryButton>
          </div>
        </FadeIn>
      </div>
    );
  }

  // --- Main app ---
  const LOOP_STAGES = [
    { key: "content", label: "Today's content", icon: Newspaper, done: contentDone },
    { key: "observation", label: "Observation", icon: Eye, done: !!obsComplete },
    { key: "validation", label: "AI Validation", icon: ShieldCheck, done: validated },
    { key: "reward", label: "Reward", icon: Gift, done: rewardClaimed },
  ];
  const canReachReward = contentDone && obsComplete && validated;

  return (
    <div className="w-full min-h-[600px] rounded-xl border border-gray-200 overflow-hidden">
      {style}
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: NAVY }}>
        <div className="flex items-center gap-3">
          <Logo dark />
          {role && <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white capitalize">{role}</span>}
          {role && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10" style={{ color: "#9FB0CC" }}>
              {role === "collaborator" ? "10% commission" : "Free plan"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-white text-sm">
          <span className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium" style={{ background: BLUE }}>
            <Flame size={12} /> {streak} day streak
          </span>
          <span className="rounded-full px-3 py-1 text-xs font-medium bg-white/10">{daysDone}/{totalDays} days</span>
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-white px-6">
        {[
          { key: "loop", label: "Loop", icon: Target },
          { key: "progress", label: "Progress", icon: TrendingUp },
          { key: "collaborate", label: "Collaborate", icon: Handshake },
          { key: "agents", label: "AI Agents", icon: Bot },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex items-center gap-1.5 text-sm px-3 py-3 border-b-2 -mb-px"
            style={{ borderColor: tab === t.key ? ORANGE : "transparent", color: tab === t.key ? ORANGE : "#9CA3AF" }}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
        <button onClick={() => setAdminView((v) => !v)} className="ml-auto flex items-center gap-1 text-xs px-2.5 py-1.5 my-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">
          <LayoutGrid size={13} /> {adminView ? "Close admin" : "Admin view"}
        </button>
      </div>

      {adminView ? (
        <div className="px-6 py-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium" style={{ color: NAVY }}>All firms — AKORA9 admin</h2>
            <button onClick={() => setAdminView(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Active firms</div>
              <div className="text-xl font-medium" style={{ color: NAVY }}>{MOCK_FIRMS.length + 1}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Leads delivered today</div>
              <div className="text-xl font-medium" style={{ color: NAVY }}>{(MOCK_FIRMS.length + 1) * 3}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Agent subscriptions</div>
              <div className="text-xl font-medium" style={{ color: NAVY }}>{MOCK_FIRMS.reduce((n, f) => n + f.agents.length, 0) + purchasedAgents.length}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg px-4 py-3 border" style={{ borderColor: BLUE, background: BLUE_BG }}>
              <div>
                <div className="text-sm font-medium" style={{ color: NAVY }}>{form.name || "You"}</div>
                <div className="text-xs text-gray-500 capitalize">{role} · {role === "collaborator" ? `10% commission${feePaid ? ", ₹500 paid" : ""}` : "free plan"} · {subject.name} · "{goal}"</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{purchasedAgents.length} agent(s)</span>
                <span className="flex items-center gap-1"><Flame size={12} /> {streak}</span>
                <span>{daysDone}/{totalDays}d</span>
              </div>
            </div>
            {MOCK_FIRMS.map((f, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-4 py-3 border border-gray-200">
                <div>
                  <div className="text-sm text-gray-900">{f.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{f.role} · {f.role === "collaborator" ? "10% commission, lifetime access paid" : "free plan"} · {f.subject} · "{f.target}"</div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{f.agents.length} agent(s)</span>
                  <span className="flex items-center gap-1"><Flame size={12} /> {f.streak}</span>
                  <span>{f.daysDone}d done</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : tab === "progress" ? (
        <div className="px-6 py-6 bg-white">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Your target</div>
          <div className="text-sm font-medium mb-4" style={{ color: NAVY }}>"{goal}" — over {period}</div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-2">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (daysDone / totalDays) * 100)}%`, background: BLUE }} />
          </div>
          <div className="text-xs text-gray-500 mb-6">{daysDone} of {totalDays} days completed</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-1">Current streak</div>
              <div className="text-xl font-medium flex items-center gap-1" style={{ color: NAVY }}><Flame size={16} /> {streak} days</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-1">Leads received so far</div>
              <div className="text-xl font-medium" style={{ color: NAVY }}>{daysDone * 3}</div>
            </div>
          </div>
        </div>
      ) : tab === "collaborate" ? (
        <div className="px-6 py-6 bg-white">
          <p className="text-sm text-gray-500 mb-1">Connect with same-minded people, or businesses parallel to yours, in {subject.name}.</p>
          <p className="text-xs text-gray-400 mb-4">Upscale takes a 10% commission on business done with the help of Upscale — collaborations and paid events booked here.</p>

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
          <p className="text-[11px] text-gray-400 mb-2">Found across the web, not booked through Upscale — no commission on these.</p>
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
        </div>
      ) : tab === "agents" ? (
        <div className="px-6 py-6 bg-white">
          <p className="text-sm text-gray-500 mb-4">Optional add-ons on top of your daily loop.</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {AGENTS.map((a) => {
              const owned = purchasedAgents.includes(a.key);
              return (
                <div key={a.key} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Bot size={15} style={{ color: NAVY }} />
                    <span className="text-sm font-medium" style={{ color: NAVY }}>{a.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">{a.desc}</div>
                  {a.stub && <div className="text-[11px] text-amber-700 bg-amber-50 rounded px-2 py-1 mb-3 inline-block">Coming soon — stub only</div>}
                  {owned ? (
                    <div className="text-xs font-medium flex items-center gap-1" style={{ color: "#0F6E56" }}><Check size={13} /> Active</div>
                  ) : (
                    <button onClick={() => setPurchasedAgents((pa) => [...pa, a.key])}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg text-white" style={{ background: BLUE }}>
                      Add {a.price}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {purchasedAgents.includes("marketing") && (
            <div className="border border-gray-200 rounded-xl p-5" style={{ background: "#F7F8FA" }}>
              <div className="flex items-center gap-2 mb-3">
                <Share2 size={15} style={{ color: BLUE }} />
                <h3 className="text-sm font-medium" style={{ color: NAVY }}>Marketing Agent</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">Turn a photo into a ready-to-share post — no business account needed.</p>

              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Create a post</div>
              <input value={postProduct} onChange={(e) => setPostProduct(e.target.value)} placeholder="New product or service (optional)"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mb-2 bg-white" />
              <div className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg p-3 mb-3 text-xs text-gray-400 bg-white">
                <ImageIcon size={16} /> Upload a photo
              </div>

              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Where will you share it? (optional)</div>
              <div className="flex gap-2 mb-3 flex-wrap">
                {SHARE_DESTINATIONS.map((d) => (
                  <button key={d.key} onClick={() => setSharePlatform(d.key)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: sharePlatform === d.key ? BLUE : "#E5E7EB", color: sharePlatform === d.key ? BLUE : "#374151", background: sharePlatform === d.key ? BLUE_BG : "#fff" }}>
                    {d.label}
                  </button>
                ))}
              </div>

              <PrimaryButton
                onClick={() => {
                  setPosts([{ product: postProduct, platform: sharePlatform }, ...posts]);
                  setPostProduct("");
                }}>
                Create post <Sparkles size={14} />
              </PrimaryButton>
              <div className="text-[11px] text-gray-400 mt-2">
                Download it, or share straight to WhatsApp, a family/friends group, or your own profiles — whatever's easiest for you.
              </div>

              {posts.length > 0 && (
                <div className="mt-5">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Your posts</div>
                  {posts.map((p, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 mb-2 flex items-center justify-between gap-3">
                      <div>{p.product && <div className="text-sm text-gray-800">{p.product}</div>}</div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize shrink-0">{p.platform}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
                  <div className="flex items-center gap-2 mb-1"><Newspaper size={16} style={{ color: BLUE }} /><h2 className="text-sm font-medium" style={{ color: NAVY }}>Today's content</h2></div>
                  <div>
                    <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Update</div>
                    <a href={`https://www.google.com/search?q=${encodeURIComponent(subject.name + " " + subject.update)}&tbm=nws`}
                      target="_blank" rel="noopener noreferrer"
                      className="block bg-white rounded-lg p-3 border border-gray-200 text-sm text-gray-700 hover:border-gray-300">
                      {subject.update}
                      <span className="text-[11px] block mt-1" style={{ color: BLUE }}>Read more →</span>
                    </a>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Trend</div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 text-sm text-gray-700">{subject.trend}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Video</div>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(subject.video.title)}`}
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
                    <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Success story</div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 text-sm text-gray-700">{subject.successStory}</div>
                  </div>
                  <PrimaryButton onClick={() => { setContentDone(true); setStage("observation"); }}>
                    Continue to observation <ArrowRight size={14} />
                  </PrimaryButton>
                </div>
              )}

              {stage === "observation" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1"><Eye size={16} style={{ color: BLUE }} /><h2 className="text-sm font-medium" style={{ color: NAVY }}>Your observation</h2></div>
                  <p className="text-xs text-gray-500 mb-1">Based on today's update, trend, video, and success story — what's your overall observation?</p>
                  <textarea value={obsText} onChange={(e) => setObsText(e.target.value)}
                    placeholder="What have you noticed in your business this week?"
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[110px] bg-white" />
                  <PrimaryButton onClick={() => { setStage("validation"); runValidation(); }} disabled={!obsComplete}>
                    Submit for validation <ArrowRight size={14} />
                  </PrimaryButton>
                </div>
              )}

              {stage === "validation" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1"><ShieldCheck size={16} style={{ color: BLUE }} /><h2 className="text-sm font-medium" style={{ color: NAVY }}>AI validation</h2></div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 italic">"{obsText}"</div>
                  {validating && (
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Sparkles size={14} className="animate-pulse" style={{ color: BLUE }} /> Validating your observation...
                    </div>
                  )}
                  {validated && !validating && (
                    <>
                      <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                        This looks like a real, specific observation tied to today's content — worth acting on.
                      </div>
                      <PrimaryButton onClick={() => setStage("reward")}>
                        Unlock today's reward <ArrowRight size={14} />
                      </PrimaryButton>
                    </>
                  )}
                </div>
              )}

              {stage === "reward" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1"><Gift size={16} style={{ color: BLUE }} /><h2 className="text-sm font-medium" style={{ color: NAVY }}>Today's reward</h2></div>

                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide pt-1">{MOCK_LEADS.length} leads for you today</div>
                  {MOCK_LEADS.map((l, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-800">{l.name}</div>
                        <div className="text-[11px] text-gray-400">{l.detail}</div>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: BLUE_BG, color: BLUE }}>{l.source}</span>
                    </div>
                  ))}

                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide pt-1">Collaboration requests in {subject.name}</div>
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
