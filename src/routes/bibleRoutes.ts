import { Router } from 'express';
import { searchBible, getCrossReferences, getSermonPrep, chatWithBibleAI } from '../controllers/bibleController.js';

const router = Router();

// Search Bible
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    const results = await searchBible(q);
    res.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get cross-references
router.get('/cross-references', async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference || typeof reference !== 'string') {
      return res.status(400).json({ error: 'Reference required' });
    }

    const crossReferences = await getCrossReferences(reference);
    res.json({ crossReferences });
  } catch (error) {
    console.error('Cross-reference error:', error);
    res.status(500).json({ error: 'Unable to fetch cross-references' });
  }
});

// Sermon preparation
router.post('/sermon-prep', async (req, res) => {
  try {
    const { topic, language } = req.body;
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic required' });
    }

    const result = await getSermonPrep(topic, language || 'en');
    res.json(result);
  } catch (error) {
    console.error('Sermon prep error:', error);
    res.status(500).json({ error: 'Sermon preparation failed' });
  }
});

// Chat with Bible AI
router.post('/chat', async (req, res) => {
  try {
    const { message, language } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message required' });
    }

    const response = await chatWithBibleAI(message, language || 'en');
    res.json({ content: response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat request failed' });
  }
});

export default router;
