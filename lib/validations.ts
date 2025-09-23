import { z } from 'zod';

// Transaction search validation
export const transactionSearchSchema = z.object({
  email: z
    .string()
    .min(1, 'Email es requerido')
    .email('Formato de email inválido')
    .max(255, 'Email demasiado largo'),
  
  lastFour: z
    .string()
    .min(1, 'Últimos 4 dígitos son requeridos')
    .regex(/^\d{4}$/, 'Debe ser exactamente 4 dígitos')
    .transform(val => val.replace(/\D/g, '')),
  
  transactionDate: z
    .string()
    .min(1, 'Fecha de transacción es requerida')
    .refine(
      (date) => {
        const transactionDate = new Date(date);
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        return transactionDate >= oneYearAgo && transactionDate <= today;
      },
      'La fecha debe estar dentro del último año'
    ),
  
  amount: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const amount = parseFloat(val.replace(/[^0-9.-]/g, ''));
        return amount > 0 && amount < 10000;
      },
      'El monto debe estar entre $0.01 y $9,999.99'
    ),
  
  orderNumber: z
    .string()
    .optional()
    .max(50, 'Número de orden demasiado largo')
});

// Chat message validation
export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Mensaje es requerido')
    .max(1000, 'Mensaje demasiado largo')
    .trim(),
  
  sessionId: z
    .string()
    .optional(),
  
  transactionId: z
    .string()
    .optional()
});

// Inquiry form validation
export const inquiryFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email es requerido')
    .email('Formato de email inválido'),
  
  inquiryType: z.enum(['Refund', 'Cancel', 'Update Payment', 'General']),
  
  description: z
    .string()
    .min(10, 'Descripción debe tener al menos 10 caracteres')
    .max(1000, 'Descripción demasiado larga'),
  
  transactionId: z
    .string()
    .optional()
});

// Email validation utility
export const emailSchema = z
  .string()
  .email('Formato de email inválido')
  .transform(email => email.toLowerCase().trim());

// Amount validation utility
export const amountSchema = z
  .string()
  .regex(/^\$?\d+(\.\d{2})?$/, 'Formato de monto inválido')
  .transform(val => {
    const cleanAmount = val.replace(/[^0-9.-]/g, '');
    return parseFloat(cleanAmount);
  });

// Date validation utility
export const dateSchema = z
  .string()
  .refine(
    (date) => !isNaN(Date.parse(date)),
    'Fecha inválida'
  )
  .transform(date => new Date(date).toISOString());

// Export types
export type TransactionSearchInput = z.infer<typeof transactionSearchSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type InquiryFormInput = z.infer<typeof inquiryFormSchema>;




