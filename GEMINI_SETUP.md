# Configuración de Google Gemini AI

## ¿Qué es Gemini?
Google Gemini es la IA que alimenta el chatbot de tu aplicación. Permite que los usuarios conversen de forma natural para buscar transacciones y realizar acciones.

## Cómo obtener el API Key

### Paso 1: Ir a Google AI Studio
1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Inicia sesión con tu cuenta de Google

### Paso 2: Crear API Key
1. Haz clic en **"Get API key"** en el menú lateral
2. Haz clic en **"Create API key"**
3. Selecciona un proyecto de Google Cloud (o crea uno nuevo)
4. Copia el API key generado

### Paso 3: Configurar en la aplicación
1. Edita el archivo `.env`
2. Reemplaza `your_gemini_api_key_here` con tu API key:

```env
VITE_GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

## Funcionalidades del Chatbot

### ✅ **Búsqueda de transacciones**
- Busca en Airtable por email, últimos 4 dígitos y fecha
- Muestra todos los detalles de la transacción encontrada

### ✅ **Acciones disponibles**
- **Solicitar reembolso**: Procesa solicitudes de reembolso
- **Cancelar suscripción**: Cancela suscripciones automáticas
- **Actualizar método de pago**: Redirige a página segura

### ✅ **Conversación natural**
- Entiende español e inglés
- Extrae información automáticamente
- Sugiere próximos pasos

## Ejemplo de conversación

**Usuario:** "Hola, necesito ayuda con una transacción"
**Chatbot:** "¡Hola! Te ayudo a encontrar tu transacción. ¿Podrías proporcionarme tu email?"

**Usuario:** "mi@email.com"
**Chatbot:** "Perfecto. Ahora necesito los últimos 4 dígitos de la tarjeta que usaste."

**Usuario:** "1234"
**Chatbot:** "Excelente. ¿Cuál fue la fecha aproximada de la transacción?"

**Usuario:** "15 de enero"
**Chatbot:** "¡Perfecto! Encontré tu transacción:
💰 **TechFlow Solutions**
📅 Fecha: 15/01/2024
💳 Monto: $49.99
🆔 ID: SA12345678
✅ Estado: Completed
¿Qué te gustaría hacer con esta transacción?"

## Costos
- **Gratis**: Hasta 15 solicitudes por minuto
- **Pago**: $0.0005 por 1K caracteres después del límite gratuito

## Próximos pasos
1. Obtén tu API key de Gemini
2. Actualiza el archivo `.env`
3. Reinicia la aplicación
4. ¡Prueba el chatbot!







