<div align="center">

# 🚀 CoderWorld - Modern Coding Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://coder-world3855.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/mukeshk78254/CoderWorld3855)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

**A comprehensive LeetCode-style coding platform with real-time code execution, AI assistance, premium features, and competitive programming contests.**

[🌐 Live Website](https://coder-world3855.vercel.app) • [📖 Documentation](#documentation) • [🎯 Features](#features) • [🛠️ Tech Stack](#tech-stack)

</div>

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-endpoints)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)

---

## ✨ Features

### 👨‍💻 User Features
- 🔐 **Multi-Auth System** - JWT, OAuth (Google, GitHub, Facebook)
- 💻 **Advanced Code Editor** - Monaco Editor with syntax highlighting
- ⚡ **Real-time Execution** - Judge0 API integration for instant code testing
- 🤖 **AI Assistant** - Google Gemini 2.5-flash powered chatbot
- 📊 **Problem Solving** - 500+ DSA problems with multiple test cases
- 🏆 **Leaderboard** - Global rankings and achievements
- 💬 **Discussion Forum** - Community-driven problem discussions
- 📈 **Analytics Dashboard** - Track your coding journey
- 🎥 **Video Solutions** - Learn from expert explanations
- 📧 **Email Integration** - Verification, OTP, password reset

### 🛡️ Admin Features
- ➕ **Problem Management** - Create, update, delete problems
- 📹 **Video Upload** - Add solution videos via Cloudinary
- 👥 **User Management** - Monitor and manage users
- 📊 **Analytics Dashboard** - Platform statistics and insights
- 🔔 **Notification System** - Send updates to users

### 💎 Premium Features
- ✨ **Premium Badge** - Stand out in the community
- 🤖 **Unlimited AI Access** - No limits on AI chat queries
- 📹 **All Video Solutions** - Access premium content
- ⚡ **Priority Execution** - Faster code execution queue
- 💳 **Flexible Payments** - Razorpay & Stripe integration
- 📊 **Advanced Analytics** - Detailed performance insights

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| ⚛️ React 18 + Vite | Fast, modern UI framework |
| 🔄 Redux Toolkit | State management |
| 🎨 Tailwind CSS | Utility-first styling |
| ✨ GSAP + Framer Motion | Smooth animations |
| 📝 Monaco Editor | VS Code-like editor |
| 🎯 Lucide React | Beautiful icons |
| 🌐 Axios | HTTP client |

### Backend
| Technology | Purpose |
|------------|---------|
| 🟢 Node.js + Express | Server framework |
| 🍃 MongoDB + Mongoose | Database & ODM |
| 🔑 JWT | Authentication |
| ⚡ Redis | Caching & performance |
| ⚖️ Judge0 API | Code execution engine |
| 🤖 Google Gemini AI | AI chatbot (gemini-2.5-flash) |
| 💳 Razorpay + Stripe | Payment gateways |
| ☁️ Cloudinary | Media storage |
| 📧 Nodemailer | Email service |
| 🔐 Passport.js | OAuth strategies |

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Redis server
- Git

### Backend Setup

1️⃣ **Clone the repository:**
```bash
git clone https://github.com/mukeshk78254/CoderWorld3855.git
cd CoderWorld3855
```

2️⃣ **Install backend dependencies:**
```bash
npm install
```

3️⃣ **Create `.env` file in root directory** 

4️⃣ **Start the backend server:**
```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1️⃣ **Navigate to frontend directory:**
```bash
cd frontend1
```

2️⃣ **Install frontend dependencies:**
```bash
npm install
```

3️⃣ **Create `.env` file in frontend1 directory:**
```env
VITE_API_URL=http://localhost:5000    (For local server)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4️⃣ **Start the development server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend `.env` (Root Directory)

```env

PORT=5000
CLIENT_URL=http://localhost:5173


DB_CONNECT_STRING=mongodb+srv://username:password@cluster.mongodb.net/database


JWT_KEY=your_super_secret_jwt_key_min_32_characters


REDIS_PASS=your_redis_password


GEMINI_KEY=your_google_gemini_api_key


CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password


GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/user/auth/google/callback


GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:5000/user/auth/github/callback


FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:5000/user/auth/facebook/callback


RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret


### Frontend `.env` (frontend1 Directory)

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 📡 API Endpoints

### 🔐 Authentication (`/user`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/user/create` | Register new user | ✅ |
| POST | `/user/login` | User login | ✅ |
| POST | `/user/verify-otp` | Verify email OTP | ✅ |
| POST | `/user/forgot-password` | Request password reset | ✅ |
| GET | `/user/auth/google` | Google OAuth | ✅ |
| GET | `/user/auth/github` | GitHub OAuth | ✅ |
| GET | `/user/auth/facebook` | Facebook OAuth | ✅ |

### 📝 Problems (`/prob`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/prob/problems` | Get all problems | ✅ |
| GET | `/prob/problem/:id` | Get problem by ID | ✅ |
| POST | `/prob/create` | Create problem | 🛡️ Admin |
| PUT | `/prob/update/:id` | Update problem | 🛡️ Admin |
| DELETE | `/prob/delete/:id` | Delete problem | 🛡️ Admin |

### 🚀 Submissions (`/submit`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/submit/submission` | Submit code | ✅ |
| GET | `/submit/submissions/:userId` | Get user submissions | ✅ |
| GET | `/submit/submission/:id` | Get submission details | ✅ |

### 🤖 AI Chat (`/api`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/solve-doubt` | Ask AI assistant | ✅ Premium |

### 💳 Payments (`/payment`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/payment/create-order` | Create Razorpay order | ✅ |
| POST | `/payment/verify` | Verify payment | ✅ |

### 💬 Discussion (`/discuss`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/discuss/posts` | Get all posts | ✅ |
| POST | `/discuss/post` | Create post | ✅ |
| POST | `/discuss/comment` | Add comment | ✅ |

---

## 🚀 Deployment





### Quick Deploy Options

| Platform | Backend | Frontend | Cost |
|----------|---------|----------|------|
| 🎨 Render | ✅ | ✅ | Free tier |
| ▲ Vercel | ❌ | ✅ | Free |
| 🚂 Railway | ✅ | ❌ | $5/month |
| ☁️ AWS | ✅ | ✅ | Pay as you go |

---

## 🔒 Security

### ⚠️ Critical Security Guidelines

✅ **DO:**
- Use environment variables for all sensitive data
- Enable rate limiting (express-rate-limit)
- Implement CORS properly for your domain
- Use HTTPS in production
- Hash passwords with bcrypt (12+ rounds)
- Validate all user inputs
- Sanitize MongoDB queries
- Keep dependencies updated

❌ **DON'T:**
- Commit `.env` files to Git
- Expose API keys in frontend code
- Use default/weak JWT secrets
- Allow unlimited API requests
- Store passwords in plain text
- Trust user input without validation

### 🛡️ Protected Files
The `.gitignore` protects:
- All `.env` files
- `node_modules/`
- API keys and secrets
- Database credentials
- OAuth tokens
- Build artifacts

---

## 🌟 Features Showcase

### Code Execution Engine
- **Multi-language support:** C++, Java, JavaScript, Python
- **Real-time results:** Instant feedback with Judge0 API
- **Multiple test cases:** Comprehensive validation
- **Memory & time tracking:** Performance metrics
- **Error handling:** Clear error messages

### AI Chat Assistant
- **Context-aware:** Understands your problem context
- **DSA tutoring:** Expert explanations
- **Code suggestions:** Smart recommendations
- **24/7 availability:** Always ready to help
- **Premium feature:** Unlimited queries for premium users

### Premium Subscription Plans
| Plan | Price | Features |
|------|-------|----------|
| 🆓 Free | ₹0 
| 💎 Monthly | ₹1/month | All problems, unlimited AI |
| 👑 Yearly | ₹2/year | Save 17%, all features |

---

## 📊 Project Structure

```
CoderWorld3855/
├── 📁 src/                    # Backend source code
│   ├── 📁 controllers/        # Route controllers
│   ├── 📁 models/             # MongoDB models
│   ├── 📁 routes/             # API routes
│   ├── 📁 middleware/         # Auth & validation
│   ├── 📁 utils/              # Helper functions
│   └── 📁 config/             # Configuration files
├── 📁 frontend1/              # React frontend
│   ├── 📁 src/
│   │   ├── 📁 pages/          # Page components
│   │   ├── 📁 components/     # Reusable components
│   │   ├── 📁 utils/          # Frontend utilities
│   │   └── 📁 assets/         # Static assets
│   └── 📄 package.json
├── 📄 .gitignore              # Protected files
├── 📄 README.md               # This file
├── 📄 DEPLOYMENT_GUIDE.md     # Deployment docs
└── 📄 package.json            # Backend dependencies
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Judge0](https://judge0.com/) for code execution API
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [MongoDB](https://www.mongodb.com/) for database
- [React](https://react.dev/) for frontend framework
- All open-source contributors

---

## 📧 Contact & Support

- 🐛 **Report Bugs:** [GitHub Issues](https://github.com/mukeshk78254/CoderWorld3855/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/mukeshk78254/CoderWorld3855/discussions)
- 📧 **Email:** support@coder-world3855.vercel.app
- 🌐 **Website:** [CoderWorld](https://coder-world3855.vercel.app)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

**Built with ❤️ by the CoderWorld Team**  

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>
