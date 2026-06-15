import { NextResponse } from "next/server";
import { getStockAnalysis } from "@/lib/free-data";

interface RouteContext {
  params: Promise<{
    ticker: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { ticker } = await params;
  const analysis = await getStockAnalysis(ticker);
  return NextResponse.json(analysis);
}
