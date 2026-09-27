export function stampTax(fee: number) {
  const rate = 0.05;
  const tax = Math.round(fee * rate);
  return {
    rate,
    tax,
    note: "تمبر مالیاتی وکالت موضوع ماده ۱۰۳ قانون مالیات‌های مستقیم؛ علی‌الحساب ۵٪ مبلغ حق‌الوکاله مندرج در وکالتنامه.",
  };
}

export function courtFee(claim: number) {
  if (claim <= 0) return { fee: 0, note: "دعوای غیرمالی یا بدون خواسته مشخص؛ هزینه دادرسی ثابت حسب تعرفه‌ی سال اعمال می‌شود." };
  const low = Math.min(claim, 200_000_000);
  const high = Math.max(claim - 200_000_000, 0);
  const fee = Math.round(low * 0.025 + high * 0.015);
  return {
    fee,
    note: "برآورد ساده هزینه دادرسی مرحله بدوی: ۲٫۵٪ تا دویست میلیون ریال و ۱٫۵٪ مازاد. تعرفه رسمی هر سال را کنترل کنید.",
  };
}
