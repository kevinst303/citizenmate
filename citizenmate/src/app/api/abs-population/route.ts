import { NextResponse } from "next/server";
import { fetchPopulationByState } from "@/lib/abs-api";

export async function GET() {
  const data = await fetchPopulationByState();
  return NextResponse.json(data);
}
