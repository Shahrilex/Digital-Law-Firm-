import { createServerFn } from "@tanstack/react-start";

export const generateDraft = createServerFn({ method: "POST" })
  .validator((d: { kind: string; facts: string }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI is not available" };

    const kinds: Record<string, string> = {
      petition: "دادخواست",
      defense: "لایحه دفاعیه",
      appeal: "لایحه تجدیدنظرخواهی",
      expert: "اعتراض به نظریه کارشناسی",
      execution: "درخواست اجرای حکم",
      settlement: "لایحه سازش",
    };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 900,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "تو دستیار نگارش اوراق قضایی ایران هستی. فقط به فارسی رسمی بنویس. هر ادعای حقوقی باید به ماده یا رأی مشخص مستند شود. جایگزین وکیل نیستی؛ در پایان یک سطر هشدار بازبینی درج کن. ساختار دادگاه‌های ایران را رعایت کن.",
          },
          {
            role: "user",
            content: `نوع سند: ${kinds[data.kind] ?? data.kind}\nاطلاعات پرونده:\n${data.facts}\nمتن کامل را آماده کن.`,
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: `xAI API error ${res.status}` };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "empty" };
    return { ok: true as const, text };
  });
