import { Router } from 'express';
import ConversationController from '@/controllers/conversation.controller';
import validateRequest from '@/middlewares/validateRequest.middleware';
import { conversationValidationSchema, agentResponseValidationSchema } from '@/validations/conversation.validation';

const router = Router();

router.post('/', validateRequest(conversationValidationSchema), ConversationController.createConversation);
router.post('/agent-response', validateRequest(agentResponseValidationSchema), ConversationController.saveAgentResponse);

export default router; 