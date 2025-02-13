import { generateCaptionWithAI } from '@/lib/ai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { imageUrl } = req.body;
      const caption = await generateCaptionWithAI(imageUrl);
      res.status(200).json({ caption });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate caption' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}