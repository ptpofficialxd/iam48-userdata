import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // ดึง profile + balance พร้อมกัน
    const [profileRes, balanceRes] = await Promise.all([
      fetch(`https://public.bnk48.io/user/${id}/profile`, { cache: "no-store" }),
      fetch(`https://coin-userbalance.bnk48.io/app/BNK48_101/user/${id}/balance`, { cache: "no-store" }),
    ]);

    if (!profileRes.ok) {
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: profileRes.status });
    }

    const profile = await profileRes.json();
    let spendableBalance: number | null = null;

    if (balanceRes.ok) {
      const balanceJson = await balanceRes.json();
      spendableBalance = balanceJson?.data?.spendableBalance ?? null;
    }

    return NextResponse.json({
      ...profile,
      spendableBalance,
    });
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
