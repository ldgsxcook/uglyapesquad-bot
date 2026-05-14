import { NextResponse } from "next/server";
import { createApePrompt } from "../../../../shared/ape.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await readJson(request);
  return NextResponse.json({
    ok: true,
    result: createApePrompt(body)
  });
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
