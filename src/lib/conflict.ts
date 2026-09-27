import type { CaseItem, Client, Party } from "./types";

export type ConflictHit = {
  nationalCode: string;
  nameA: string;
  nameB: string;
  reason: string;
  caseTitle?: string;
};

export function findConflicts(clients: Client[], parties: Party[], cases: CaseItem[]): ConflictHit[] {
  const hits: ConflictHit[] = [];
  const byCode = new Map<string, Client[]>();
  for (const c of clients) {
    if (!c.nationalCode) continue;
    const list = byCode.get(c.nationalCode) ?? [];
    list.push(c);
    byCode.set(c.nationalCode, list);
  }
  for (const [code, list] of byCode) {
    if (list.length > 1) {
      hits.push({
        nationalCode: code,
        nameA: list[0].fullName,
        nameB: list[1].fullName,
        reason: "کد ملی در دو کارت موکل تکرار شده است.",
      });
    }
  }
  for (const p of parties) {
    if (!p.nationalCode || p.role !== "opponent") continue;
    const client = clients.find((c) => c.nationalCode === p.nationalCode);
    if (client) {
      const cse = cases.find((c) => c.id === p.caseId);
      hits.push({
        nationalCode: p.nationalCode,
        nameA: client.fullName,
        nameB: p.fullName,
        reason: "موکل دفتر در پرونده دیگر طرف مقابل است.",
        caseTitle: cse?.title,
      });
    }
  }
  return hits;
}

export function lookupCode(code: string, clients: Client[], parties: Party[], cases: CaseItem[]) {
  const cHits = clients.filter((c) => c.nationalCode === code);
  const pHits = parties.filter((p) => p.nationalCode === code);
  return {
    clients: cHits,
    parties: pHits.map((p) => ({ ...p, caseTitle: cases.find((c) => c.id === p.caseId)?.title })),
  };
}
