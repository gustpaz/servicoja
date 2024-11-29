import express from 'express';
import Chat from '../models/Chat';
import { authMiddleware } from '../middleware/auth';
import { filterPersonalInfo } from '../utils/messageFilter';

const router = express.Router();

router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: { $all: [req.user._id, req.params.userId] } })
      .populate('participants', 'name')
      .sort({ 'messages.timestamp': -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats' });
  }
});

router.post('/:userId', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    let chat = await Chat.findOne({ participants: { $all: [req.user._id, req.params.userId] } });
    if (!chat) {
      chat = new Chat({ participants: [req.user._id, req.params.userId] });
    }
    const filteredContent = filterPersonalInfo(content);
    const newMessage = {
      sender: req.user._id,
      content: filteredContent,
      flagged: filteredContent !== content
    };
    chat.messages.push(newMessage);
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

export default router;

