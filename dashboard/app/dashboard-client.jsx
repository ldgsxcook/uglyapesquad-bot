"use client";

import { useState } from "react";

const initialPrompt = {
  prompt: "Generate a holder prompt from the lab panel.",
  seed: "-"
};

const initialMutation = {
  name: "Mutation queue ready",
  effect: "Choose a serum profile to preview the next ape treatment.",
  rarityHint: "-",
  seed: "-"
};

export default function DashboardClient() {
  const [promptMood, setPromptMood] = useState("battle-ready");
  const [traitBias, setTraitBias] = useState("rare utility");
  const [serum, setSerum] = useState("SerumX");
  const [intensity, setIntensity] = useState("controlled");
  const [promptResult, setPromptResult] = useState(initialPrompt);
  const [mutationResult, setMutationResult] = useState(initialMutation);
  const [busy, setBusy] = useState("");

  async function generatePrompt(event) {
    event.preventDefault();
    setBusy("prompt");
    const data = await postJson("/api/generate-ape", {
      mood: promptMood,
      traitBias
    });
    setPromptResult(data.result);
    setBusy("");
  }

  async function generateMutation(event) {
    event.preventDefault();
    setBusy("mutation");
    const data = await postJson("/api/mutate", {
      serum,
      intensity
    });
    setMutationResult(data.result);
    setBusy("");
  }

  return (
    <section className="panel lab-panel" aria-label="Ape generation lab">
      <div className="panel-heading">
        <p className="eyebrow">Lab</p>
        <h2>Generator</h2>
      </div>
      <div className="lab-grid">
        <form className="lab-form" onSubmit={generatePrompt}>
          <label>
            Mood
            <input value={promptMood} onChange={(event) => setPromptMood(event.target.value)} />
          </label>
          <label>
            Trait Bias
            <input value={traitBias} onChange={(event) => setTraitBias(event.target.value)} />
          </label>
          <button className="button primary" disabled={busy === "prompt"} type="submit">
            {busy === "prompt" ? "Generating" : "Ape Prompt"}
          </button>
        </form>

        <div className="result-box" aria-live="polite">
          <strong>{promptResult.seed}</strong>
          <p>{promptResult.prompt}</p>
        </div>

        <form className="lab-form" onSubmit={generateMutation}>
          <label>
            Serum
            <input value={serum} onChange={(event) => setSerum(event.target.value)} />
          </label>
          <label>
            Intensity
            <input value={intensity} onChange={(event) => setIntensity(event.target.value)} />
          </label>
          <button className="button" disabled={busy === "mutation"} type="submit">
            {busy === "mutation" ? "Mutating" : "Mutation"}
          </button>
        </form>

        <div className="result-box" aria-live="polite">
          <strong>{mutationResult.name}</strong>
          <p>{mutationResult.effect}</p>
          <small>{mutationResult.rarityHint}</small>
        </div>
      </div>
    </section>
  );
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json();
}
