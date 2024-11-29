import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import Page from '../models/Page';
import { validateInput } from '../middleware/inputValidation';
import { body, param } from 'express-validator';

const router = express.Router();

// Rota pública para buscar uma página pelo slug
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isPublished: true });
    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar página' });
  }
});

// Rotas administrativas
router.use(authMiddleware, adminMiddleware);

router.post('/', [
  body('title').isString().notEmpty(),
  body('slug').isString().notEmpty(),
  body('content').isString().notEmpty(),
  body('isPublished').isBoolean(),
  validateInput
], async (req, res) => {
  try {
    const { title, slug, content, isPublished } = req.body;
    const page = new Page({ title, slug, content, isPublished });
    await page.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar página' });
  }
});

router.put('/:id', [
  param('id').isMongoId(),
  body('title').isString().notEmpty(),
  body('slug').isString().notEmpty(),
  body('content').isString().notEmpty(),
  body('isPublished').isBoolean(),
  validateInput
], async (req, res) => {
  try {
    const { title, slug, content, isPublished } = req.body;
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { title, slug, content, isPublished, updatedAt: Date.now() },
      { new: true }
    );
    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar página' });
  }
});

router.delete('/:id', [
  param('id').isMongoId(),
  validateInput
], async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }
    res.json({ message: 'Página excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir página' });
  }
});

export default router;

