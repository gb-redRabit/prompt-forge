export async function askOpenAI(prompt, apiKey) {
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
      max_tokens: 512,
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
