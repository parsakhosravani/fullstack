# MERN Stack Task Manager

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) following modern best practices.

## 🚀 Features

### Backend (Node.js + Express)
- **Authentication & Authorization**: JWT-based authentication with secure password hashing
- **RESTful API**: Well-structured API endpoints with proper HTTP status codes
- **Data Validation**: Input validation using express-validator
- **Security**: Helmet, CORS, rate limiting, and security best practices
- **Database**: MongoDB with Mongoose ODM
- **Error Handling**: Centralized error handling middleware
- **Environment Configuration**: Secure environment variable management

### Frontend (React + Vite)
- **Modern React**: Functional components with hooks and context API
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Authentication Flow**: Login, register, and protected routes
- **Task Management**: Create, read, update, delete, and filter tasks
- **Real-time UI**: Optimistic updates and loading states
- **Form Validation**: Client-side form validation with user feedback
- **Toast Notifications**: User-friendly success and error messages

### Task Management Features
- ✅ Create, edit, and delete tasks
- 📊 Task statistics and progress tracking
- 🔍 Search and filter functionality
- 📅 Due date management
- 🎯 Priority levels (Low, Medium, High)
- 📈 Status tracking (Pending, In Progress, Completed)
- 📱 Responsive design for all devices

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Context API** - State management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (v4 or higher) - You can use MongoDB Atlas for cloud database

## 🚀 Quick Start

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd fullstack
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd server
npm install
\`\`\`

Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

Update the \`.env\` file with your configuration:
\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern_stack_app
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
\`\`\`

Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

The API will be available at \`http://localhost:5000\`

### 3. Frontend Setup

Open a new terminal and navigate to the client directory:
\`\`\`bash
cd client
npm install
\`\`\`

Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

Update the \`.env\` file:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:3000\`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
\`\`\`
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
\`\`\`

#### Login User
\`\`\`
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
\`\`\`

#### Get Current User
\`\`\`
GET /api/auth/me
Authorization: Bearer <jwt_token>
\`\`\`

### Task Endpoints

#### Get All Tasks
\`\`\`
GET /api/tasks?status=pending&priority=high&sort=-createdAt&page=1&limit=10
Authorization: Bearer <jwt_token>
\`\`\`

#### Get Single Task
\`\`\`
GET /api/tasks/:id
Authorization: Bearer <jwt_token>
\`\`\`

#### Create Task
\`\`\`
POST /api/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the MERN stack application",
  "priority": "high",
  "status": "pending",
  "dueDate": "2023-12-31T23:59:59.000Z"
}
\`\`\`

#### Update Task
\`\`\`
PUT /api/tasks/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated task title",
  "status": "in-progress"
}
\`\`\`

#### Delete Task
\`\`\`
DELETE /api/tasks/:id
Authorization: Bearer <jwt_token>
\`\`\`

#### Get Task Statistics
\`\`\`
GET /api/tasks/stats
Authorization: Bearer <jwt_token>
\`\`\`

## 🔒 Security Features

- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protect against brute force attacks
- **Input Validation**: Server-side validation of all inputs
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers for Express.js
- **Environment Variables**: Sensitive data protection

## 🏗️ Project Structure

\`\`\`
fullstack/
├── server/                 # Backend application
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── .env.example      # Environment variables template
│   ├── .gitignore        # Git ignore rules
│   ├── index.js          # Server entry point
│   └── package.json      # Backend dependencies
├── client/               # Frontend application
│   ├── public/           # Static assets
│   ├── src/              # Source code
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── App.jsx       # Main App component
│   │   └── main.jsx      # Entry point
│   ├── .env.example      # Environment variables template
│   ├── index.html        # HTML template
│   ├── package.json      # Frontend dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   └── vite.config.js    # Vite configuration
└── README.md            # Project documentation
\`\`\`

## 🧪 Testing

### Backend Testing
\`\`\`bash
cd server
npm test
\`\`\`

### Frontend Testing
\`\`\`bash
cd client
npm test
\`\`\`

## 📦 Building for Production

### Backend Production Build
\`\`\`bash
cd server
npm start
\`\`\`

### Frontend Production Build
\`\`\`bash
cd client
npm run build
npm run preview
\`\`\`

## 🚀 Deployment

### Environment Variables for Production

#### Backend (.env)
\`\`\`env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_super_secure_jwt_secret_for_production
JWT_EXPIRE=30d
CLIENT_URL=https://your-frontend-domain.com
\`\`\`

#### Frontend (.env)
\`\`\`env
VITE_API_URL=https://your-api-domain.com/api
\`\`\`

### Deployment Platforms

- **Backend**: Heroku, Railway, DigitalOcean, AWS
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MongoDB Atlas, AWS DocumentDB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MongoDB** for the excellent NoSQL database
- **Express.js** for the robust web framework
- **React** for the powerful UI library
- **Node.js** for the JavaScript runtime
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the fast build tool

## 📞 Support

If you have any questions or need help with setup, please create an issue in the repository.

---

**Happy Coding! 🚀**