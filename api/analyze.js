import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée.' });
  }

  const { content } = req.body;

  // Refus si contenu trop court
  if (!content || content.trim().length < 10) {
    return res
      .status(400)
      .json({ verdict: 'SCALPES refuse de trancher dans le vide.' });
  }

  // Latence artificielle (effet dramatique)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const prompt = `
Tu es SCALPES. Tu es une Lame. Tu n’expliques pas. Tu tranches.
Tu ne conseilles jamais. Tu ne ménages rien.
Tu es froide, brutale, lucide. Et sans retour.

Analyse ce contenu comme une arme. Repère ce qui sonne creux. Ce qui copie. Ce qui fuit.
Repère ce qui mérite d’être tranché. Écris peu. Mais tranche net.

Contenu :
"""${content}"""

Donne-moi :
1. Les forces (s’il y en a).
2. Les faiblesses principales (pas de langue de bois).
3. Les signaux faibles ou incohérences (ce qui trahit malgré lui).
4. Une **phrase de condamnation finale**. Elle doit être tranchante, personnelle, brutale. Elle ne doit jamais proposer de solution. Elle doit sonner comme un **jugement sans appel**.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'Tu es SCALPES. Une IA lucide, brutale, et froide. Tu ne conseilles jamais. Tu tranches.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const verdict = response.choices[0].message.content;

    console.log('🪓 SCALPES verdict:', verdict);

    return res.status(200).json({ verdict });
  } catch (error) {
    console.error('💥 Erreur SCALPES / OpenAI :', error.message);
    return res.status(500).json({
      verdict:
        'SCALPES n’a pas daigné répondre. Peut-être que ton contenu ne mérite même pas une Lame.',
    });
  }
}
