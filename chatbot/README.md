# 🤖 Gryp – WhatsApp AI Chatbot

Chatbot oficial de WhatsApp con Inteligencia Artificial para **Gryp Studio**, desarrollado con **Node.js**, **Meta WhatsApp Cloud API** y **OpenAI (`gpt-4o-mini`)**.

---

## 📁 Estructura del Proyecto

```
chatbot/
├── .env                  # Tus credenciales secretas (ignorado por git)
├── .env.example          # Plantilla de variables
├── package.json          # Dependencias y scripts
├── README.md             # Esta guía
└── src/
    ├── config.js         # Carga y validación de variables de entorno
    ├── knowledge.js      # Base de conocimiento (precios, paquetes, FAQs de Gryp)
    ├── memory.js         # Gestión de sesiones y memoria conversacional
    ├── openaiService.js  # Integración con OpenAI + detección de derivación humana
    ├── whatsappService.js# Envío de mensajes y alertas vía WhatsApp Cloud API
    └── server.js         # Servidor Express y Webhook verificado por Meta
```

---

## 🚀 Cómo iniciar el chatbot

1. Entra a la carpeta del chatbot en tu terminal:
   ```powershell
   cd c:\Users\PC\GP-web-studio\chatbot
   ```

2. Inicia el servidor en modo desarrollo:
   ```powershell
   npm run dev
   ```
   *(El servidor arrancará en `http://localhost:3000`)*

---

## 📋 ¿Qué falta hacer por tu cuenta? (Checklist de Conexión)

Para que el chatbot reciba mensajes de WhatsApp en tiempo real y responda con IA, necesitas completar estos **4 pasos**:

### 1. Obtener tu clave de OpenAI
1. Entra a [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2. Crea una nueva clave secreta (`sk-proj-...`).
3. Pégala en el archivo `.env` en la línea:
   ```env
   OPENAI_API_KEY=sk-proj-tu_clave_aqui
   ```

### 2. Configurar Meta for Developers (WhatsApp Cloud API)
1. Entra a [developers.facebook.com](https://developers.facebook.com/) e inicia sesión.
2. Crea una app de tipo **Negocio (Business)** y añade el producto **WhatsApp**.
3. En la sección **WhatsApp &rarr; Inicio rápido (API Setup)** verás:
   - **Identificador de número de teléfono (Phone Number ID)**: Cópialo y pégalo en `.env` en `META_PHONE_NUMBER_ID`.
   - **Token de acceso temporal**: Cópialo y pégalo en `.env` en `META_ACCESS_TOKEN`.
   - Agrega tu número personal a la lista de números permitidos para recibir mensajes de prueba.

### 3. Exponer tu servidor local con HTTPS (ngrok o Cloudflare)
Meta exige una URL pública con certificado SSL (`https://`):
1. En una terminal nueva, descarga o ejecuta `ngrok`:
   ```powershell
   npx ngrok http 3000
   ```
2. Te dará una URL pública como: `https://a1b2-c3d4.ngrok-free.app`.

### 4. Vincular el Webhook en el panel de Meta
1. En Meta for Developers ve a **WhatsApp &rarr; Configuración &rarr; Webhook**.
2. Haz clic en **Editar**:
   - **URL de devolución de llamada**: `https://tu-url-ngrok.ngrok-free.app/webhook`
   - **Token de verificación**: `gryp_secure_verify_token_2025` *(el mismo que está en tu `.env`)*
3. Haz clic en **Verificar y guardar**. Verás en la consola de tu servidor que el handshake se aprueba al instante.
4. En **Campos de webhook**, haz clic en **Administrar** y activa la suscripción al evento **`messages`**.

¡Listo! A partir de ese momento, cada mensaje que envíes al número de WhatsApp será procesado por la IA de Gryp con memoria, conocimiento de paquetes y derivación automática a humano.
