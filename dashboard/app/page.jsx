import DashboardClient from "./dashboard-client.jsx";
import { formatNumber, formatPrice } from "../../shared/format.js";
import { getMarketplaceSnapshot, readMarketplaceConfig } from "../../shared/marketplaces.js";
import { readProjectConfig } from "../../shared/project.js";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const project = readProjectConfig();
  const marketplace = await getMarketplaceSnapshot(readMarketplaceConfig());
  const bestFloor = marketplace.bestFloor
    ? formatPrice(marketplace.bestFloor.price, marketplace.bestFloor.currency)
    : "n/a";
  const listed = marketplace.totalListed === null ? "n/a" : formatNumber(marketplace.totalListed);

  return (
    <main className="dashboard-shell">
      <section className="top-band" aria-label="UAS v2 command overview">
        <div className="brand-line">
          <img className="brand-mark" src="/assets/uas-logo.svg" alt="Ultimate Ape Society logo" />
          <div>
            <p className="eyebrow">UAS v2</p>
            <h1>{project.name}</h1>
          </div>
        </div>
        <div className="status-rail" aria-label="Live status">
          <Status label="Minted" value={`${formatNumber(project.mint.minted)} / ${formatNumber(project.mint.supply)}`} />
          <Status label="Floor" value={bestFloor} />
          <Status label="Listed" value={listed} />
          <Status label="Markets" value={`${marketplace.healthyProviderCount}/${marketplace.configuredProviderCount}`} />
        </div>
      </section>

      <section className="ops-grid" aria-label="Operations panels">
        <section className="panel mint-panel" aria-label="Mint status">
          <div className="panel-heading">
            <p className="eyebrow">Mint</p>
            <h2>Supply Progress</h2>
          </div>
          <div className="progress-frame" aria-label={`${project.mint.progress}% minted`}>
            <div className="progress-fill" style={{ width: `${project.mint.progress}%` }} />
          </div>
          <div className="detail-list">
            <Detail label="Remaining" value={formatNumber(project.mint.remaining)} />
            <Detail label="Price" value={project.mint.priceSol === null ? "n/a" : `${project.mint.priceSol} SOL`} />
            <Detail label="Collection" value={project.collection.address || project.collection.creatorAddress || "pending"} />
          </div>
          <div className="action-row">
            {project.publicMintUrl ? (
              <a className="button primary" href={project.publicMintUrl}>
                Mint
              </a>
            ) : null}
            {project.discordInviteUrl ? (
              <a className="button" href={project.discordInviteUrl}>
                Discord
              </a>
            ) : null}
          </div>
        </section>

        <section className="panel market-panel" aria-label="Marketplace integrations">
          <div className="panel-heading">
            <p className="eyebrow">Markets</p>
            <h2>Marketplace Feed</h2>
          </div>
          <div className="provider-table">
            {marketplace.providers.map((provider) => (
              <a
                className="provider-row"
                href={provider.marketplaceUrl || "#"}
                key={provider.id}
                aria-disabled={!provider.marketplaceUrl}
              >
                <span>
                  <strong>{provider.name}</strong>
                  <small>{provider.enabled ? (provider.ok ? "connected" : provider.error) : "not configured"}</small>
                </span>
                <span>{provider.floor ? formatPrice(provider.floor.price, provider.floor.currency) : "n/a"}</span>
              </a>
            ))}
          </div>
          {marketplace.warnings.length ? (
            <p className="warning-line">{marketplace.warnings.join(" ")}</p>
          ) : null}
        </section>

        <section className="panel utility-panel" aria-label="Holder utility">
          <div className="panel-heading">
            <p className="eyebrow">Discord</p>
            <h2>Holder Utility</h2>
          </div>
          <div className="command-list">
            <Command name="/verify" value="wallet role gate" />
            <Command name="/floor" value={bestFloor} />
            <Command name="/stake" value="XP preview" />
            <Command name="/mutate" value="SerumX concept" />
          </div>
        </section>

        <section className="visual-panel" aria-label="UAS lab artwork">
          <img src="/assets/uas-labs.svg" alt="UAS lab artwork" />
          <div className="visual-caption">
            <img src="/assets/serumx-logo.svg" alt="SerumX logo" />
            <span>SerumX Lab</span>
          </div>
        </section>

        <DashboardClient />
      </section>
    </main>
  );
}

function Status({ label, value }) {
  return (
    <div className="status-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Command({ name, value }) {
  return (
    <div className="command-row">
      <strong>{name}</strong>
      <span>{value}</span>
    </div>
  );
}
