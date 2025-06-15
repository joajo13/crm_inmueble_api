import { z } from 'zod';

const messageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.enum(['text', 'button', 'document', 'image', 'audio']),
  text: z.object({ body: z.string() }).optional(),
  button: z.object({ payload: z.string(), text: z.string() }).optional(),
  document: z.object({
    filename: z.string(),
    mime_type: z.string(),
    sha256: z.string(),
    id: z.string()
  }).optional(),
  image: z.object({
    mime_type: z.string(),
    sha256: z.string(),
    id: z.string()
  }).optional(),
  audio: z.object({
    mime_type: z.string(),
    sha256: z.string(),
    id: z.string(),
    voice: z.boolean().optional()
  }).optional()
});

const conversationSchema = z.object({
  messaging_product: z.string(),
  metadata: z.object({
    display_phone_number: z.string(),
    phone_number_id: z.string()
  }),
  contacts: z.array(z.object({
    profile: z.object({ name: z.string() }),
    wa_id: z.string()
  })),
  messages: z.array(messageSchema)
});

const agentResponseSchema = z.object({
  content: z.string(),
  type: z.enum(['TEXT', 'BUTTON', 'DOCUMENT', 'IMAGE', 'AUDIO']),
  phoneNumber: z.string()
});

export const conversationValidationSchema = conversationSchema;
export const agentResponseValidationSchema = agentResponseSchema; 