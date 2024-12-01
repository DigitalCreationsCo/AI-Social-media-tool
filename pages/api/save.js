export default async function handler(req, res) {

  if (req.method === 'POST') {
    try {
      console.log(`Saving... `, req.body);
      res.status(200).json({ message: 'Saved successfully' });
    } catch (error) {
      res.status(500).json({ error: `Failed to save` });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
