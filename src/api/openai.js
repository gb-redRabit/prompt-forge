export async function askOpenAI(prompt, apiKey, opts = {}) {
  console.log(prompt);
  const aiSource =
    opts.endpoint || localStorage.getItem("aiSource") || "openai";
  if (aiSource === "local") {
    const address =
      opts.localAddress ||
      localStorage.getItem("localAddress") ||
      "http://127.0.0.1:1234";
    const res = await fetch(
      `${address.replace(/\/$/, "")}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        `Błąd lokalnego AI: ${res.status} ${res.statusText}${
          err.error?.message ? " – " + err.error.message : ""
        }`
      );
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  } else {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 256,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        `Błąd OpenAI: ${res.status} ${res.statusText}${
          err.error?.message ? " – " + err.error.message : ""
        }`
      );
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }
}
