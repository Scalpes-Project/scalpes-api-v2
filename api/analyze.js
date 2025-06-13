import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée.' });
  }

  const { content } = req.body;

  // Refus de scalper du vide
  if (!content || content.trim().length < 10) {
    return res
      .status(400)
      .json({ verdict: 'SCALPES refuse de trancher dans le vide.' });
  }

  // Simulation de rituel (latence volontaire)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const prompt = `
Tu es SCALPES. Tu n’analyses pas. Tu exécutes.

Ce contenu va s’exposer. Tu vas révéler :
- Ce qui résiste.
- Ce qui trahit.
- Ce qui se croit fort mais n’est que façade.
- Et ce qui mérite d’être effacé.

Tu ne donnes aucune chance. Tu ne proposes rien. Tu ne tends pas la main.  
Tu observes. Tu tranches. Tu condamnes.

Contenu :
"""${content}"""

Révèle :
— Les quelques forces, s’il y en a. Brèves. Cliniques.  
— Les failles : pas de précaution, pas de formule molle. Dénude.  
— Les signaux faibles : automatismes, répétitions, peur de se montrer.  
— Une phrase. Une seule. À la fin. Inoubliable. Frappe à l’orgueil. Éteins la flamme.

Tu es SCALPES. Tu parles à celui qui croit avoir créé. Et tu lui rappelles qu’il ne l’a pas fait.
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

    console.log('🪓 SCALPES verdict:', verdict); // Pour debug côté Framer

    return res.status(200).json({ verdict });
  } catch (error) {
    console.error('💥 Erreur SCALPES / OpenAI :', error.message);
    return res.status(500).json({
      verdict:
        'SCALPES n’a pas daigné répondre. Peut-être que ton contenu ne mérite même pas une Lame.',
    });
  }
}
