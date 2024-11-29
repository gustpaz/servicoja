import express from 'express'
import { upload } from '../middleware/fileUpload'
import { authMiddleware } from '../middleware/auth'
import User from '../models/User'

const router = express.Router()

// Rota para upload de arquivos por clientes
router.post('/client', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo foi enviado' })
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    user.files = user.files || []
    user.files.push({
      url: (req.file as any).location,
      name: req.file.originalname,
      type: req.file.mimetype
    })
    await user.save()

    res.json({ message: 'Arquivo enviado com sucesso', file: (req.file as any).location })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar arquivo' })
  }
})

// Rota para upload de arquivos por profissionais
router.post('/professional', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo foi enviado' })
    }

    const professional = await Professional.findOne({ userId: req.user._id })
    if (!professional) {
      return res.status(404).json({ message: 'Profissional não encontrado' })
    }

    professional.portfolio = professional.portfolio || []
    professional.portfolio.push({
      url: (req.file as any).location,
      name: req.file.originalname,
      type: req.file.mimetype
    })
    await professional.save()

    res.json({ message: 'Arquivo enviado com sucesso', file: (req.file as any).location })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar arquivo' })
  }
})

// Rota para upload de arquivos por administradores
router.post('/admin', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo foi enviado' })
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso não autorizado' })
    }

    // Aqui você pode implementar a lógica para salvar o arquivo em um local específico para administradores
    // Por exemplo, você pode criar um modelo de documento para arquivos administrativos

    res.json({ message: 'Arquivo enviado com sucesso', file: (req.file as any).location })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar arquivo' })
  }
})

export default router

