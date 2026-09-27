import type {
  CaseItem,
  Client,
  DeadlineItem,
  DocumentItem,
  Hearing,
  Member,
  NoteItem,
  Notice,
  Party,
  PetitionDraft,
  TimelineEvent,
  Transaction,
} from "./types";

export const seedClients: Client[] = [
  {
    id: "c1",
    fullName: "علی محمدی",
    nationalCode: "0012345678",
    mobile: "09121234567",
    type: "individual",
    address: "تهران، خیابان ولیعصر، پلاک ۲۱۰",
    email: "ali.m@example.com",
    notes: "موکل قدیمی. پیگیری چک‌های برگشتی.",
    createdAt: "۱۴۰۴/۰۳/۱۲",
  },
  {
    id: "c2",
    fullName: "شرکت پارس تجارت",
    nationalCode: "14004567890",
    mobile: "02188776655",
    type: "company",
    address: "تهران، سعادت‌آباد، برج آسمان",
    email: "legal@parstejarat.ir",
    notes: "واحد حقوقی فعال. پرونده ملکی در جریان.",
    createdAt: "۱۴۰۴/۰۲/۰۱",
  },
  {
    id: "c3",
    fullName: "زهرا احمدی",
    nationalCode: "0023456789",
    mobile: "09129876543",
    type: "individual",
    address: "کرج، مهرشهر",
    email: "",
    notes: "پرونده خانواده.",
    createdAt: "۱۴۰۵/۰۶/۱۸",
  },
  {
    id: "c4",
    fullName: "حسین رضایی",
    nationalCode: "0034567890",
    mobile: "09351234567",
    type: "individual",
    address: "اصفهان، خیابان چهارباغ",
    email: "h.rezaei@example.com",
    notes: "پرونده ملکی مختومه.",
    createdAt: "۱۴۰۴/۱۱/۰۸",
  },
  {
    id: "c5",
    fullName: "مریم کریمی",
    nationalCode: "0045678901",
    mobile: "09121112233",
    type: "individual",
    address: "شیراز، بلوار زند",
    email: "",
    notes: "مشاوره اولیه؛ هنوز پرونده تشکیل نشده.",
    createdAt: "۱۴۰۵/۰۷/۰۲",
  },
];

export const seedCases: CaseItem[] = [
  {
    id: "p1",
    title: "مطالبه وجه چک",
    caseNumber: "۱۴۰۵/۱۲۳۴",
    courtNumber: "۱۴۰۵۱۲۳۴",
    status: "active",
    caseType: "civil",
    court: "مجتمع قضایی شهید بهشتی",
    branch: "شعبه ۵ حقوقی",
    clientId: "c1",
    openedAt: "۱۴۰۵/۰۶/۱۲",
    claimAmount: "250000000",
    description:
      "مطالبه وجه چک به شماره ۱۲۳۴۵۶ مورخ ۱۴۰۴/۱۱/۲۰ به انضمام خسارت تأخیر تأدیه مستند به رأی وحدت رویه ۷۳۳.",
  },
  {
    id: "p2",
    title: "خلع ید و قلع بنا",
    caseNumber: "۱۴۰۵/۵۶۷۸",
    courtNumber: "۱۴۰۵۵۶۷۸",
    status: "active",
    caseType: "civil",
    court: "مجتمع قضایی صدر",
    branch: "شعبه ۱۲ حقوقی",
    clientId: "c2",
    openedAt: "۱۴۰۵/۰۵/۲۰",
    claimAmount: "0",
    description: "خلع ید از پلاک ثبتی ۱۲/۴۵ و قلع بنای احداثی بدون مجوز. نظریه کارشناسی واصل شده.",
  },
  {
    id: "p3",
    title: "طلاق توافقی",
    caseNumber: "۱۴۰۵/۹۰۱۲",
    courtNumber: "۱۴۰۵۹۰۱۲",
    status: "active",
    caseType: "family",
    court: "مجتمع قضایی خانواده ۲",
    branch: "شعبه ۲",
    clientId: "c3",
    openedAt: "۱۴۰۵/۰۷/۰۱",
    claimAmount: "0",
    description: "درخواست صدور گواهی عدم امکان سازش به صورت توافقی.",
  },
  {
    id: "p4",
    title: "دعوای ملکی",
    caseNumber: "۱۴۰۴/۳۳۴۴",
    courtNumber: "۱۴۰۴۳۳۴۴",
    status: "closed",
    caseType: "civil",
    court: "شعبه ۸ حقوقی تهران",
    branch: "شعبه ۸",
    clientId: "c4",
    openedAt: "۱۴۰۴/۱۱/۱۵",
    claimAmount: "1800000000",
    description: "پرونده مختومه. حکم قطعی صادر شده است.",
  },
  {
    id: "p5",
    title: "مطالبه مهریه",
    caseNumber: "۱۴۰۵/۷۷۸۸",
    courtNumber: "",
    status: "draft",
    caseType: "family",
    court: "",
    branch: "",
    clientId: "c3",
    openedAt: "۱۴۰۵/۰۷/۱۰",
    claimAmount: "50000",
    description: "پیش‌نویس دادخواست مطالبه مهریه عندالمطالبه.",
  },
];

export const seedParties: Party[] = [
  { id: "pa1", caseId: "p1", role: "client_side", fullName: "علی محمدی", nationalCode: "0012345678", notes: "خواهان" },
  { id: "pa2", caseId: "p1", role: "opponent", fullName: "شرکت نگین تجارت", nationalCode: "14001112233", notes: "صادرکننده چک" },
  { id: "pa3", caseId: "p2", role: "client_side", fullName: "شرکت پارس تجارت", nationalCode: "14004567890", notes: "مالک رسمی" },
  {
    id: "pa4",
    caseId: "p2",
    role: "opponent",
    fullName: "حسین رضایی",
    nationalCode: "0034567890",
    notes: "متصرف عدوانی — با موکل دفتر هم‌کد ملی است",
  },
  { id: "pa5", caseId: "p3", role: "client_side", fullName: "زهرا احمدی", nationalCode: "0023456789", notes: "زوجه" },
  { id: "pa6", caseId: "p3", role: "opponent", fullName: "کیوان احمدی", nationalCode: "0056789012", notes: "زوج" },
];

export const seedDeadlines: DeadlineItem[] = [
  {
    id: "d1",
    title: "مهلت تجدیدنظرخواهی",
    caseId: "p1",
    dueDate: "۱۴۰۵/۰۷/۱۸",
    type: "legal",
    isUrgent: true,
    isCompleted: false,
    legalArticle: "ماده ۳۳۶ قانون آیین دادرسی مدنی",
    ruleCode: "REV-20",
  },
  {
    id: "d2",
    title: "اعتراض به نظریه کارشناسی",
    caseId: "p2",
    dueDate: "۱۴۰۵/۰۷/۱۲",
    type: "legal",
    isUrgent: true,
    isCompleted: false,
    legalArticle: "ماده ۲۶۰ قانون آیین دادرسی مدنی",
    ruleCode: "EXPERT-OBJ-7",
  },
  {
    id: "d3",
    title: "آماده‌سازی لایحه دفاعیه",
    caseId: "p1",
    dueDate: "۱۴۰۵/۰۷/۱۵",
    type: "internal",
    isUrgent: false,
    isCompleted: false,
    legalArticle: "",
    ruleCode: "INTERNAL-PREPARE",
  },
  {
    id: "d4",
    title: "جلسه رسیدگی",
    caseId: "p3",
    dueDate: "۱۴۰۵/۰۷/۲۲",
    type: "court",
    isUrgent: false,
    isCompleted: false,
    legalArticle: "",
    ruleCode: "HEARING",
  },
  {
    id: "d5",
    title: "سررسید قسط دوم حق‌الوکاله",
    caseId: "p2",
    dueDate: "۱۴۰۵/۰۸/۰۱",
    type: "financial",
    isUrgent: false,
    isCompleted: false,
    legalArticle: "",
    ruleCode: "PAYMENT-INSTALL",
  },
];

export const seedTimeline: TimelineEvent[] = [
  {
    id: "t1",
    caseId: "p1",
    date: "۱۴۰۵/۰۷/۰۱",
    time: "۱۰:۳۰",
    title: "ثبت لایحه دفاعیه تکمیلی",
    description: "لایحه با استناد به نظریه کارشناسی ارسال شد.",
    type: "document",
  },
  {
    id: "t2",
    caseId: "p1",
    date: "۱۴۰۵/۰۶/۲۵",
    time: "۱۴:۱۵",
    title: "جلسه رسیدگی",
    description: "جلسه اول برگزار شد. قرار کارشناسی صادر گردید.",
    type: "hearing",
  },
  {
    id: "t3",
    caseId: "p1",
    date: "۱۴۰۵/۰۶/۱۸",
    time: "۰۹:۰۰",
    title: "ابلاغ دادخواست به خوانده",
    description: "",
    type: "action",
  },
  {
    id: "t4",
    caseId: "p1",
    date: "۱۴۰۵/۰۶/۱۲",
    time: "۱۱:۲۰",
    title: "تشکیل پرونده و ثبت دادخواست",
    description: "",
    type: "action",
  },
  {
    id: "t5",
    caseId: "p2",
    date: "۱۴۰۵/۰۷/۰۵",
    time: "۱۶:۰۰",
    title: "دریافت نظریه کارشناسی",
    description: "مهلت اعتراض ۷ روز از ابلاغ.",
    type: "document",
  },
  {
    id: "t6",
    caseId: "p2",
    date: "۱۴۰۵/۰۵/۲۰",
    time: "۱۰:۰۰",
    title: "تشکیل پرونده",
    description: "",
    type: "action",
  },
  {
    id: "t7",
    caseId: "p3",
    date: "۱۴۰۵/۰۷/۰۱",
    time: "۱۲:۰۰",
    title: "ثبت درخواست طلاق توافقی",
    description: "",
    type: "action",
  },
];

export const seedDocuments: DocumentItem[] = [
  { id: "doc1", caseId: "p1", title: "دادخواست مطالبه وجه", kind: "دادخواست", createdAt: "۱۴۰۵/۰۶/۱۲" },
  { id: "doc2", caseId: "p1", title: "لایحه دفاعیه تکمیلی", kind: "لایحه", createdAt: "۱۴۰۵/۰۷/۰۱" },
  { id: "doc3", caseId: "p1", title: "تصویر چک", kind: "مدرک", createdAt: "۱۴۰۵/۰۶/۱۲" },
  { id: "doc4", caseId: "p2", title: "نظریه کارشناسی", kind: "کارشناسی", createdAt: "۱۴۰۵/۰۷/۰۵" },
  { id: "doc5", caseId: "p3", title: "گواهی عدم سازش (پیش‌نویس)", kind: "لایحه", createdAt: "۱۴۰۵/۰۷/۰۱" },
];

export const seedNotes: NoteItem[] = [
  {
    id: "n1",
    caseId: "p1",
    body: "قاضی نسبت به خسارت تأخیر حساس است. استناد به رأی وحدت رویه ۷۳۳ آماده شود.",
    createdAt: "۱۴۰۵/۰۶/۲۵",
  },
  { id: "n2", caseId: "p2", body: "موکل سند مالکیت رسمی را فردا می‌آورد.", createdAt: "۱۴۰۵/۰۷/۰۵" },
];

export const seedTransactions: Transaction[] = [
  { id: "f1", caseId: "p1", type: "income", amount: 80_000_000, description: "قسط اول حق‌الوکاله", date: "۱۴۰۵/۰۶/۱۲", isTrust: false },
  { id: "f2", caseId: "p1", type: "trust_in", amount: 15_000_000, description: "هزینه دادرسی امانی", date: "۱۴۰۵/۰۶/۱۲", isTrust: true },
  { id: "f3", caseId: "p1", type: "stamp", amount: 4_000_000, description: "تمبر ماده ۱۰۳", date: "۱۴۰۵/۰۶/۱۳", isTrust: false },
  { id: "f4", caseId: "p2", type: "income", amount: 120_000_000, description: "حق‌الوکاله مرحله بدوی", date: "۱۴۰۵/۰۵/۲۱", isTrust: false },
  { id: "f5", caseId: "p2", type: "trust_in", amount: 25_000_000, description: "علی‌الحساب کارشناسی", date: "۱۴۰۵/۰۶/۰۱", isTrust: true },
  { id: "f6", caseId: "p3", type: "income", amount: 40_000_000, description: "حق‌الوکاله طلاق توافقی", date: "۱۴۰۵/۰۷/۰۱", isTrust: false },
];

export const seedPetitions: PetitionDraft[] = [
  {
    id: "e1",
    caseId: "p1",
    title: "لایحه تجدیدنظرخواهی",
    body: "ریاست محترم دادگاه تجدیدنظر استان تهران\nبا سلام\nاحتراماً در خصوص دادنامه شماره ۱۴۰۵/۱۲۳۴ صادره از شعبه ۵ حقوقی مجتمع شهید بهشتی، مراتب اعتراض اینجانب به شرح ذیل به استحضار می‌رسد...",
    updatedAt: "۱۴۰۵/۰۷/۰۲",
  },
];

export const seedHearings: Hearing[] = [
  {
    id: "h1",
    caseId: "p1",
    date: "۱۴۰۵/۰۶/۲۵",
    time: "۱۴:۱۵",
    court: "مجتمع قضایی شهید بهشتی",
    branch: "شعبه ۵ حقوقی",
    subject: "رسیدگی بدوی",
    result: "قرار کارشناسی صادر شد",
  },
  {
    id: "h2",
    caseId: "p3",
    date: "۱۴۰۵/۰۷/۲۲",
    time: "۱۰:۰۰",
    court: "مجتمع قضایی خانواده ۲",
    branch: "شعبه ۲",
    subject: "جلسه سازش",
    result: "",
  },
  {
    id: "h3",
    caseId: "p2",
    date: "۱۴۰۵/۰۷/۲۸",
    time: "۱۱:۳۰",
    court: "مجتمع قضایی صدر",
    branch: "شعبه ۱۲ حقوقی",
    subject: "ادامه رسیدگی پس از کارشناسی",
    result: "",
  },
];

export const seedMembers: Member[] = [
  { id: "m1", fullName: "مهدی رضایی", role: "owner", mobile: "09121234567" },
  { id: "m2", fullName: "سارا نوری", role: "trainee", mobile: "09123334455" },
  { id: "m3", fullName: "نیما کاظمی", role: "secretary", mobile: "09124445566" },
  { id: "m4", fullName: "لیلا مرادی", role: "accountant", mobile: "09125556677" },
];

export const seedNotices: Notice[] = [
  {
    id: "nt1",
    title: "موعد فوری تجدیدنظر",
    body: "مهلت تجدیدنظر پرونده مطالبه وجه چک رو به اتمام است.",
    date: "۱۴۰۵/۰۷/۰۵",
    read: false,
    href: "/deadlines",
  },
  {
    id: "nt2",
    title: "تعارض منافع احتمالی",
    body: "حسین رضایی هم موکل دفتر است و هم خوانده پرونده خلع ید.",
    date: "۱۴۰۵/۰۷/۰۴",
    read: false,
    href: "/conflict",
  },
  {
    id: "nt3",
    title: "جلسه خانواده",
    body: "جلسه سازش زهرا احمدی در ۲۲ مهر ساعت ۱۰.",
    date: "۱۴۰۵/۰۷/۰۳",
    read: true,
    href: "/calendar",
  },
];

export const caseTypeLabel: Record<string, string> = {
  civil: "حقوقی",
  criminal: "کیفری",
  family: "خانواده",
  commercial: "تجاری",
  administrative: "اداری",
};

export const statusLabel: Record<string, string> = {
  active: "فعال",
  closed: "مختومه",
  draft: "پیش‌نویس",
};

export const deadlineTypeLabel: Record<string, string> = {
  legal: "قانونی",
  internal: "داخلی",
  court: "دادگاه",
  financial: "مالی",
};

export const txLabel: Record<string, string> = {
  income: "دریافت حق‌الوکاله",
  expense: "هزینه",
  trust_in: "واریز امانی",
  trust_out: "برداشت امانی",
  stamp: "تمبر ماده ۱۰۳",
};

export const partyRoleLabel: Record<string, string> = {
  client_side: "طرف موکل",
  opponent: "طرف مقابل",
  third: "ثالث",
  opp_counsel: "وکیل طرف مقابل",
};

export const memberRoleLabel: Record<string, string> = {
  owner: "مدیر دفتر",
  lawyer: "وکیل",
  trainee: "کارآموز",
  secretary: "منشی",
  accountant: "حسابدار",
};

export const planLabel: Record<string, string> = {
  free: "آزاد",
  pro: "حرفه‌ای",
  ultra_pro: "اولترا",
};
