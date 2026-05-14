export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ApiError";
    this.details = details;
  }
}

export async function fetchJson(url, options = {}) {
  const timeoutMs = options.timeoutMs ?? 10000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        accept: "application/json",
        ...(options.headers || {})
      }
    });

    const text = await response.text();
    let body = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = { raw: text };
      }
    }

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status} from ${new URL(url).hostname}`, {
        status: response.status,
        body
      });
    }

    return body;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ApiError(`Timed out after ${timeoutMs}ms`, { url });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
