import { NextResponse } from "next/server";
import { createMutation } from "../../../../shared/ape.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await readJson(request);
  return NextResponse.json({
    ok: true,
    result: createMutation(body)
  });
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
