import { PrismaClient, MessageType } from '@prisma/client';
import { AppError } from '@/errors';

const prisma = new PrismaClient();

const ConversationService = {
  createConversation: async (data: any) => {
    try {
      const { contacts, messages } = data;
      const contact = contacts[0];

      const contactRecord = await prisma.contact.upsert({
        where: { wa_id: contact.wa_id },
        update: { name: contact.profile.name },
        create: {
          wa_id: contact.wa_id,
          name: contact.profile.name,
          phone_number: contact.wa_id
        }
      });

      const conversation = await prisma.conversation.create({
        data: {
          whatsapp_id: messages[0].id,
          contact_id: contactRecord.id,
          status: 'ACTIVE',
          is_bot_active: true,
          priority: 'NORMAL',
          tags: []
        }
      });

      const messagePromises = messages.map((message: any) => 
        prisma.message.create({
          data: {
            whatsapp_id: message.id,
            conversation_id: conversation.id,
            type: message.type.toUpperCase() as MessageType,
            content: message.text?.body || message.button?.text || '',
            status: 'SENT',
            from_customer: true,
            timestamp: new Date(parseInt(message.timestamp) * 1000),
            media_url: message.document?.id || message.image?.id || message.audio?.id,
            media_type: message.document?.mime_type || message.image?.mime_type || message.audio?.mime_type,
            metadata: message
          }
        })
      );

      await Promise.all(messagePromises);

      return conversation;
    } catch (error) {
      throw new AppError('INTERNAL_ERROR', ['Error al crear la conversación']);
    }
  },

  saveAgentResponse: async (data: { content: string; type: MessageType; phoneNumber: string }) => {
    try {
      const contact = await prisma.contact.findUnique({
        where: { wa_id: data.phoneNumber },
        include: {
          conversations: {
            where: { status: 'ACTIVE' },
            orderBy: { last_message_at: 'desc' },
            take: 1
          }
        }
      });

      if (!contact || !contact.conversations.length) {
        throw new AppError('NOT_FOUND', ['No se encontró una conversación activa para este número']);
      }

      const conversation = contact.conversations[0];

      const message = await prisma.message.create({
        data: {
          whatsapp_id: `agent_${Date.now()}`,
          conversation_id: conversation.id,
          type: data.type,
          content: data.content,
          status: 'SENT',
          from_customer: false,
          timestamp: new Date(),
          source: 'AGENT'
        }
      });

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { last_message_at: new Date() }
      });

      return message;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('INTERNAL_ERROR', ['Error al guardar la respuesta del agente']);
    }
  },

  getConversations: async (filters: {
    status?: string;
    contactId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  } = {}) => {
    try {
      const {
        status,
        contactId,
        startDate,
        endDate,
        limit = 10,
        offset = 0
      } = filters;

      const where: any = {};

      if (status) where.status = status;
      if (contactId) where.contact_id = contactId;
      if (startDate || endDate) {
        where.created_at = {};
        if (startDate) where.created_at.gte = startDate;
        if (endDate) where.created_at.lte = endDate;
      }

      const conversations = await prisma.conversation.findMany({
        where,
        include: {
          contact: true,
          messages: {
            orderBy: { timestamp: 'asc' }
          },
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              currency: true
            }
          }
        },
        orderBy: { last_message_at: 'desc' },
        take: limit,
        skip: offset
      });

      const total = await prisma.conversation.count({ where });

      return {
        conversations,
        pagination: {
          total,
          limit,
          offset,
          hasMore: total > offset + limit
        }
      };
    } catch (error) {
      throw new AppError('INTERNAL_ERROR', ['Error al obtener las conversaciones']);
    }
  },

  getAllConversations: async () => {
    try {
      const conversations = await prisma.conversation.findMany({
        include: {
          contact: {
            select: {
              id: true,
              wa_id: true,
              name: true,
              phone_number: true,
              created_at: true,
              updated_at: true
            }
          },
          messages: {
            orderBy: { timestamp: 'desc' },
            take: 1,
            select: {
              id: true,
              content: true,
              type: true,
              timestamp: true,
              from_customer: true,
              status: true
            }
          }
        },
        orderBy: { last_message_at: 'desc' }
      });

      return conversations;
    } catch (error) {
      throw new AppError('INTERNAL_ERROR', ['Error al obtener las conversaciones']);
    }
  }
};

export default ConversationService; 