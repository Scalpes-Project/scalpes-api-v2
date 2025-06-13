export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  let content = "";

  try {
    content = req.body.content || "";
  } catch (err) {
    return res.status(400).json({ error: "Impossible de lire le contenu." });
  }

  if (!content || content.trim().length < 50) {
    return res.status(400).json({
      verdict: "⚠️ Contenu trop court ou vide pour que SCALPES puisse trancher.",
    });
  }

  const prompt = `
Tu es SCALPES. Ton rôle n'est pas d'expliquer, ni de conseiller. Tu tranches.
Tu ne protèges pas l’ego. Tu ne cherches pas la nuance. Tu révèles ce que le créateur refuse de voir.

Analyse ce contenu comme une Lame. Détaille uniquement si cela renforce le choc.
Utilise un ton sec, froid, lucide. Termine toujours par une phrase brutale, sans retour possible.

Contenu à trancher :
"""${content}"""

Donne-moi :
1. Les forces (brèves, s’il y en a).
2. Les failles principales (pas de demi-mesure).
3. Les signaux faibles (ce qui trahit malgré lui).
4. Une phrase finale qui pourrait rester gravée dans l’esprit. Tu n’as pas le droit d’être gentil.
`;
Contenu :
${content}

La Lame :`;

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await completion.json();
    const verdict = data.choices?.[0]?.message?.content?.trim() || "⚠️ Réponse vide de l’IA.";

    return res.status(200).json({ verdict });
  } catch (err) {
    console.error("Erreur analyse.js", err);
    return res.status(500).json({
      verdict: "⚠️ SCALPES n’a pas pu trancher. Contenu vide, incohérent ou corrompu.",
    });
  }
}
