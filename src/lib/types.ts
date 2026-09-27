export type ClientType = "individual" | "company";
export type CaseStatus = "active" | "closed" | "draft";
export type CaseType =
  | "civil"
  | "criminal"
  | "family"
  | "commercial"
  | "administrative";
export type MemberRole = "owner" | "lawyer" | "trainee" | "secretary" | "accountant";
export type DeadlineKind = "legal" | "internal" | "court" | "financial";
export type TimelineKind = "action" | "hearing" | "document" | "note" | "deadline";
export type TxType = "income" | "expense" | "trust_in" | "trust_out" | "stamp";
export type PartyRole = "client_side" | "opponent" | "third" | "opp_counsel";

export type SessionUser = {
  id: string;
  fullName: string;
  mobile: string;
  role: string;
  plan: "free" | "pro" | "ultra_pro";
};

export type Client = {
  id: string;
  fullName: string;
  nationalCode: string;
  mobile: string;
  type: ClientType;
  address: string;
  email: string;
  notes: string;
  createdAt: string;
};

export type CaseItem = {
  id: string;
  title: string;
  caseNumber: string;
  courtNumber: string;
  status: CaseStatus;
  caseType: CaseType;
  court: string;
  branch: string;
  clientId: string;
  openedAt: string;
  claimAmount: string;
  description: string;
};

export type Party = {
  id: string;
  caseId: string;
  role: PartyRole;
  fullName: string;
  nationalCode: string;
  notes: string;
};

export type DeadlineItem = {
  id: string;
  title: string;
  caseId: string;
  dueDate: string;
  type: DeadlineKind;
  isUrgent: boolean;
  isCompleted: boolean;
  legalArticle: string;
  ruleCode: string;
};

export type TimelineEvent = {
  id: string;
  caseId: string;
  date: string;
  time: string;
  title: string;
  description: string;
  type: TimelineKind;
};

export type DocumentItem = {
  id: string;
  caseId: string;
  title: string;
  kind: string;
  createdAt: string;
};

export type NoteItem = {
  id: string;
  caseId: string;
  body: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
  caseId: string;
  type: TxType;
  amount: number;
  description: string;
  date: string;
  isTrust: boolean;
};

export type PetitionDraft = {
  id: string;
  caseId: string;
  title: string;
  body: string;
  updatedAt: string;
};

export type Hearing = {
  id: string;
  caseId: string;
  date: string;
  time: string;
  court: string;
  branch: string;
  subject: string;
  result: string;
};

export type Member = {
  id: string;
  fullName: string;
  role: MemberRole;
  mobile: string;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  href?: string;
};
