import { NextResponse } from "next/server";
import { getMarketplaceSnapshot, readMarketplaceConfig } from "../../../../shared/marketplaces.js";
import { readProjectConfig } from "../../../../shared/project.js";

export const dynamic = "force-dynamic";

export async function GET() {
  const project = readProjectConfig();
  const marketplace = await getMarketplaceSnapshot(readMarketplaceConfig());

  return NextResponse.json(
    {
      ok: true,
      service: "uas-v2-dashboard",
      project,
      marketplace
    },
    {
      headers: {
        "cache-control": "no-store"
      }
    }
  );
}
