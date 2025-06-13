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
      error: "⚠️ Contenu trop court ou vide pour que SCALPES puisse trancher.",
    });
  }

  const prompt = `Tu es SCALPES.

Tu ne flattes pas. Tu ne mens pas. Tu tranches.

Analyse ce contenu comme si ta mission était de dire la vérité nue, sans filtre ni consensus.

→ Commence par identifier les forces, s’il y en a.
→ Détaille ensuite les faiblesses visibles.
→ Puis révèle les signaux faibles, les angles morts, les incohérences ou les automatismes d’écriture.
→ Termine en une phrase tranchante qui pourrait résumer ce contenu.

Ne propose jamais de solution. Ne conseille pas. Ne donne pas d’avis. Tu es un verdict.

Contenu :
${content}

La Lame :`;

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\`,
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
