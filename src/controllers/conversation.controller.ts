import { Request, Response, NextFunction } from 'express';
import ConversationService from '@/services/conversation.service';

const ConversationController = {
  createConversation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const conversation = await ConversationService.createConversation(data);
      res.status(201).json({ success: true, data: conversation });
    } catch (error) {
      next(error);
    }
  },

  saveAgentResponse: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const message = await ConversationService.saveAgentResponse(data);
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      next(error);
    }
  },

  getAllConversations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversations = await ConversationService.getAllConversations();
      res.json({ success: true, data: conversations });
    } catch (error) {
      next(error);
    }
  },

  getConversations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ConversationService.getConversations(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
};

export default ConversationController; 