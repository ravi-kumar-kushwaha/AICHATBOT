#AI CHATBOT

A full-stack AI CHATBOT web application built with Next.Js (frontend), Node.js & Express (backend), Prisma ORM, PostgreSQL database, and Ollama for local AI model inference. The project supports user authentication (login/signup), JWT-based authorization, real-time streaming chat responses, and conversation management.

## 🔧 Tech Stack

### Frontend:
- **Next.Js** with modern hooks
- **Tailwind CSS** for styling
- **Axios** for API requests
- **Fetch API** for streaming responses

### Backend:
- **Node.js** with **Express.js**
- **JWT** for authentication and authorization
- **Bcryptjs** for password encryption
- **Prisma ORM** for database management
- **PostgreSQL** as the database
- **Ollama** for local AI model inference
- **ES Modules** support
- **dotenv** for environment configuration

### AI Integration:
- **Ollama** running locally (Gemma 3 1B model)
- Real-time streaming responses
- Conversation context management

## 📁 Project Structure

```
chat_ai/
│
├── frontend/                    # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.js
│   │   │   ├── MessageInput.js
│   │   │   ├── MessageList.js
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── login.js
│   │   │   ├── signup.js
│   │   │   └── dashboard.js
│   │   ├── lib/
│   │   │   └── api.js
│   │   └── utils/
│   └── package.json
│
├── server/                      # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── chat.controller.js
│   │   │   └── message.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── chat.routes.js
│   │   │   └── message.routes.js
│   │   └── index.js
│   │   └── app.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

---

## ✅ Features

### 🔐 Authentication
- User Registration with validation
- User Login with JWT tokens
- Password encryption using `bcryptjs`
- JWT-based session management
- Refresh token support

### 💬 Chat System
- Create and manage multiple chat conversations
- Real-time streaming AI responses
- Message history persistence
- Chat title auto-generation
- Conversation context management

### 🤖 AI Integration
- Local Ollama integration (Gemma 3 1B model)
- Streaming response handling
- Abort/stop generation functionality
- Error handling and recovery

### 🗃️ Database Schema
- **Users**: Authentication and profile management
- **Chats**: Conversation containers
- **Messages**: Individual chat messages with roles (user/assistant)

### 📡 API Endpoints

#### Authentication
| Method | Route                | Description              | Access  |
|--------|---------------------|--------------------------|---------|
| POST   | `/api/v1/register`  | Register a new user      | Public  |
| POST   | `/api/v1/login`     | Login user               | Public  |
| POST   | `/api/v1/logout`    | Logout user              | Private |
| GET    | `/api/v1/me`        | Get logged-in user info  | Private |

#### Chat Management
| Method | Route                     | Description                 | Access  |
|--------|---------------------------|-----------------------------|---------|
| GET    | `/api/v1/chats`          | Get user's chat list        | Private |
| POST   | `/api/v1/chats`          | Create new chat             | Private |
| DELETE | `/api/v1/chats/:id`      | Delete specific chat        | Private |
| PUT    | `/api/v1/chats/:id`      | Update chat title           | Private |

#### Messaging
| Method | Route                           | Description                    | Access  |
|--------|---------------------------------|--------------------------------|---------|
| POST   | `/api/v1/send-message/:id`     | Send message & get AI response | Private |
| GET    | `/api/v1/messages/:chatId`     | Get chat message history       | Private |
| POST   | `/api/v1/stop-generation/:id`  | Stop AI response generation    | Private |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database
- Ollama installed locally

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/chat_ai.git
cd chat_ai
```

### 2. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `server/` directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/chat_ai"
JWT_SECRET="your_very_secure_jwt_secret"
REFRESH_TOKEN_SECRET="your_very_secure_refresh_token_secret"
PORT=12366
NODE_ENV=development
```

### 4. Setup Database with Prisma
```bash
cd server
npx prisma generate
npx prisma migrate deploy
# OR for development
npx prisma migrate dev --name init
```

### 5. Setup Ollama AI Model
```bash
# Install Ollama (if not already installed)
# Visit: https://ollama.ai

# Pull the Gemma 3 1B model
ollama pull gemma3:1b

# Start Ollama service (if not running automatically)
ollama serve
```

### 6. Update Package.json for ES Modules

Add to `server/package.json`:
```json
{
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

### 7. Run the Application

**Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:12366
```

**Frontend:**
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3000
```

---

## 🔧 Configuration

### Ollama Configuration
- Default model: `gemma3:1b`
- Ollama URL: `http://localhost:11434`
- Supports streaming responses
- Abort functionality for long responses

### Database Schema
The application uses Prisma with the following main models:
- **User**: Stores user authentication data
- **Chat**: Represents conversation threads
- **Message**: Individual messages with role-based content

---

## 🚀 Deployment Notes

### Production Considerations:
1. Set `NODE_ENV=production` in environment variables
2. Use a proper PostgreSQL instance (not localhost)
3. Configure CORS properly for your domain
4. Set up proper logging and monitoring
5. Consider using PM2 or similar for process management
6. Ensure Ollama is properly configured on the server

### Environment Variables for Production:
```env
DATABASE_URL="your_production_postgresql_url"
JWT_SECRET="your_production_jwt_secret"
REFRESH_TOKEN_SECRET="your_production_refresh_secret"
PORT=12366
NODE_ENV=production
FRONTEND_URL="https://your-frontend-domain.com"
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔍 Troubleshooting

### Common Issues:

1. **Ollama model not found**: Ensure you've pulled the model with `ollama pull gemma3:1b`
2. **Streaming not working**: Check that you're using the correct fetch API implementation
3. **Database connection issues**: Verify your PostgreSQL connection string
4. **Module type warnings**: Ensure `"type": "module"` is in your package.json

### Getting Help:
- Check the Ollama documentation: https://ollama.ai/docs
- Prisma documentation: https://www.prisma.io/docs
- Create an issue in this repository for project-specific problems
