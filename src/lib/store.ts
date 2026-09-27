import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  SessionUser,
  TimelineEvent,
  Transaction,
} from "./types";
import {
  seedCases,
  seedClients,
  seedDeadlines,
  seedDocuments,
  seedHearings,
  seedMembers,
  seedNotes,
  seedNotices,
  seedParties,
  seedPetitions,
  seedTimeline,
  seedTransactions,
} from "./seed";
import { nowTime, todayJalali, uid } from "./utils";

type AppState = {
  hydrated: boolean;
  user: SessionUser | null;
  pendingMobile: string;
  clients: Client[];
  cases: CaseItem[];
  parties: Party[];
  deadlines: DeadlineItem[];
  timeline: TimelineEvent[];
  documents: DocumentItem[];
  notes: NoteItem[];
  transactions: Transaction[];
  petitions: PetitionDraft[];
  hearings: Hearing[];
  members: Member[];
  notices: Notice[];
  setHydrated: () => void;
  setPendingMobile: (mobile: string) => void;
  login: (mobile: string) => void;
  logout: () => void;
  addClient: (data: Omit<Client, "id" | "createdAt">) => { ok: boolean; message: string; id?: string };
  updateClient: (id: string, data: Partial<Client>) => void;
  addCase: (data: Omit<CaseItem, "id">) => string;
  updateCase: (id: string, data: Partial<CaseItem>) => void;
  addParty: (data: Omit<Party, "id">) => void;
  addDeadline: (data: Omit<DeadlineItem, "id" | "isCompleted">) => void;
  toggleDeadline: (id: string) => void;
  addTimeline: (caseId: string, title: string, description: string, type: TimelineEvent["type"]) => void;
  addNote: (caseId: string, body: string) => void;
  addDocument: (caseId: string, title: string, kind: string) => void;
  addTransaction: (data: Omit<Transaction, "id">) => void;
  savePetition: (data: Omit<PetitionDraft, "id" | "updatedAt"> & { id?: string }) => string;
  addHearing: (data: Omit<Hearing, "id">) => void;
  addMember: (data: Omit<Member, "id">) => void;
  markNotice: (id: string) => void;
  resetDemo: () => void;
};

const demoUser = (mobile: string): SessionUser => ({
  id: "u1",
  fullName: "مهدی رضایی",
  mobile,
  role: "وکیل پایه یک",
  plan: "pro",
});

const initial = {
  clients: seedClients,
  cases: seedCases,
  parties: seedParties,
  deadlines: seedDeadlines,
  timeline: seedTimeline,
  documents: seedDocuments,
  notes: seedNotes,
  transactions: seedTransactions,
  petitions: seedPetitions,
  hearings: seedHearings,
  members: seedMembers,
  notices: seedNotices,
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      user: null,
      pendingMobile: "",
      ...initial,
      setHydrated: () => set({ hydrated: true }),
      setPendingMobile: (mobile) => set({ pendingMobile: mobile }),
      login: (mobile) => set({ user: demoUser(mobile), pendingMobile: "" }),
      logout: () => set({ user: null }),
      addClient: (data) => {
        const exists = get().clients.find(
          (c) => c.nationalCode && data.nationalCode && c.nationalCode === data.nationalCode,
        );
        if (exists) {
          return {
            ok: false,
            message: `احتمال تعارض منافع: کد ملی با موکل «${exists.fullName}» تکراری است.`,
          };
        }
        const asOpponent = get().parties.find(
          (p) => p.nationalCode && data.nationalCode && p.nationalCode === data.nationalCode && p.role === "opponent",
        );
        if (asOpponent) {
          const cse = get().cases.find((c) => c.id === asOpponent.caseId);
          return {
            ok: false,
            message: `تعارض منافع: این کد ملی طرف مقابل پرونده «${cse?.title ?? asOpponent.caseId}» است.`,
          };
        }
        const id = uid();
        set((s) => ({
          clients: [{ ...data, id, createdAt: todayJalali() }, ...s.clients],
        }));
        return { ok: true, message: "موکل ثبت شد.", id };
      },
      updateClient: (id, data) =>
        set((s) => ({
          clients: s.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      addCase: (data) => {
        const id = uid();
        const client = get().clients.find((c) => c.id === data.clientId);
        set((s) => ({
          cases: [{ ...data, id }, ...s.cases],
          timeline: [
            {
              id: uid(),
              caseId: id,
              date: todayJalali(),
              time: nowTime(),
              title: "تشکیل پرونده",
              description: data.title,
              type: "action",
            },
            ...s.timeline,
          ],
          parties: client
            ? [
                {
                  id: uid(),
                  caseId: id,
                  role: "client_side",
                  fullName: client.fullName,
                  nationalCode: client.nationalCode,
                  notes: "موکل",
                },
                ...s.parties,
              ]
            : s.parties,
        }));
        return id;
      },
      updateCase: (id, data) =>
        set((s) => ({
          cases: s.cases.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      addParty: (data) =>
        set((s) => ({
          parties: [{ ...data, id: uid() }, ...s.parties],
        })),
      addDeadline: (data) =>
        set((s) => ({
          deadlines: [{ ...data, id: uid(), isCompleted: false }, ...s.deadlines],
        })),
      toggleDeadline: (id) =>
        set((s) => ({
          deadlines: s.deadlines.map((d) => (d.id === id ? { ...d, isCompleted: !d.isCompleted } : d)),
        })),
      addTimeline: (caseId, title, description, type) =>
        set((s) => ({
          timeline: [
            {
              id: uid(),
              caseId,
              date: todayJalali(),
              time: nowTime(),
              title,
              description,
              type,
            },
            ...s.timeline,
          ],
        })),
      addNote: (caseId, body) =>
        set((s) => ({
          notes: [{ id: uid(), caseId, body, createdAt: todayJalali() }, ...s.notes],
        })),
      addDocument: (caseId, title, kind) =>
        set((s) => ({
          documents: [{ id: uid(), caseId, title, kind, createdAt: todayJalali() }, ...s.documents],
          timeline: [
            {
              id: uid(),
              caseId,
              date: todayJalali(),
              time: nowTime(),
              title: `ثبت سند: ${title}`,
              description: kind,
              type: "document",
            },
            ...s.timeline,
          ],
        })),
      addTransaction: (data) =>
        set((s) => ({
          transactions: [{ ...data, id: uid() }, ...s.transactions],
        })),
      savePetition: (data) => {
        const id = data.id ?? uid();
        set((s) => {
          const exists = s.petitions.some((p) => p.id === id);
          const next: PetitionDraft = {
            id,
            caseId: data.caseId,
            title: data.title,
            body: data.body,
            updatedAt: todayJalali(),
          };
          return {
            petitions: exists ? s.petitions.map((p) => (p.id === id ? next : p)) : [next, ...s.petitions],
          };
        });
        return id;
      },
      addHearing: (data) =>
        set((s) => ({
          hearings: [{ ...data, id: uid() }, ...s.hearings],
          timeline: [
            {
              id: uid(),
              caseId: data.caseId,
              date: data.date,
              time: data.time,
              title: `جلسه: ${data.subject}`,
              description: data.court,
              type: "hearing",
            },
            ...s.timeline,
          ],
        })),
      addMember: (data) => set((s) => ({ members: [...s.members, { ...data, id: uid() }] })),
      markNotice: (id) =>
        set((s) => ({
          notices: s.notices.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      resetDemo: () => set({ ...initial }),
    }),
    {
      name: "jurist-assistant-store-v2",
      partialize: (s) => ({
        user: s.user,
        clients: s.clients,
        cases: s.cases,
        parties: s.parties,
        deadlines: s.deadlines,
        timeline: s.timeline,
        documents: s.documents,
        notes: s.notes,
        transactions: s.transactions,
        petitions: s.petitions,
        hearings: s.hearings,
        members: s.members,
        notices: s.notices,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
