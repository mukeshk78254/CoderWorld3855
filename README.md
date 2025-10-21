# 🚀 CoderWorld - LeetCode Style Coding Platform

A comprehensive full-stack coding platform similar to LeetCode, built with modern web technologies.

## 🌟 Features

### 👨‍💻 For Users
- **Problem Solving**: 500+ DSA problems with multiple difficulty levels
- **Code Editor**: Monaco editor with syntax highlighting for C++, Java, JavaScript
- **Real-time Execution**: Judge0 API integration for code execution
- **AI Assistant**: Gemini AI-powered chatbot for hints and solutions
- **Contests**: Participate in coding competitions
- **Discussion Forum**: Community discussions and problem explanations
- **Profile Dashboard**: Track your progress and statistics
- **Premium Subscription**: Razorpay integration for premium features

### 🔐 Authentication
- JWT-based authentication
- OTP verification for registration
- Forgot password with OTP
- Social OAuth (Google, Facebook, GitHub)
- Role-based access (User/Admin)

### 💎 Premium Features
- AI Code Assistant
- Video Solutions
- Advanced Analytics
- Ad-Free Experience
- Priority Support
- Exclusive Problems

### 🛠️ Admin Features
- Create/Update/Delete Problems
- User Management
- Payment Management
- Video Upload for Solutions

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Redux Toolkit** - State Management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **GSAP** - Advanced Animations
- **Monaco Editor** - Code Editor
- **Axios** - API Calls
- **React Hook Form** - Form Handling
- **Zod** - Validation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Nodemailer** - Email Service
- **Razorpay** - Payment Gateway
- **Judge0 API** - Code Execution
- **Google Generative AI** - AI Assistant

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd LEETCODE/src
npm install

# Create .env file with these variables:
MONGO_URL=your_mongodb_connection_string
JWT_KEY=your_jwt_secret
GEMINI_KEY=your_google_ai_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
JUDGE0_API_KEY=your_judge0_api_key

# Start backend
npm start
# or
nodemon server.js
```

### Frontend Setup

```bash
cd LEETCODE/frontend1
npm install

# Start frontend
npm run dev
```

## 🔑 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017/coderworld
JWT_KEY=your-secret-key-here
GEMINI_KEY=your-gemini-api-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
JUDGE0_API_KEY=your-judge0-api-key
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## 📱 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/send-otp` - Send OTP
- `POST /api/user/verify-otp` - Verify OTP
- `GET /api/user/check` - Check auth status
- `POST /api/user/logout` - Logout
- `POST /api/user/send-reset-otp` - Forgot password
- `POST /api/user/change-password` - Reset password

### Problems
- `GET /api/problem` - Get all problems
- `GET /api/problem/:id` - Get problem by ID
- `POST /api/problem/create` - Create problem (Admin)
- `PUT /api/problem/:id` - Update problem (Admin)
- `DELETE /api/problem/:id` - Delete problem (Admin)

### Submissions
- `POST /api/submission/run` - Run code
- `POST /api/submission/submit` - Submit solution
- `GET /api/submission/user/:userId` - Get user submissions

### Payments
- `POST /payment/create-order` - Create Razorpay order
- `POST /payment/verify` - Verify payment
- `GET /payment/subscription-status` - Check subscription

### AI Assistant
- `POST /api/solve-doubt` - Ask AI for help

### Discussion
- `GET /api/discuss` - Get all discussions
- `POST /api/discuss` - Create discussion
- `POST /api/discuss/:id/comment` - Add comment

## 🎨 Features in Detail

### Problem Solving
- Multiple test cases (visible and hidden)
- Language support: C++, Java, JavaScript
- Real-time code execution
- Memory and time complexity tracking
- Solution history

### AI Chat Assistant
- Context-aware DSA tutor
- Provides hints without giving solutions
- Code review and debugging
- Complexity analysis
- Approach suggestions

### Premium System
- Monthly (₹1) and Yearly (₹2) plans for testing
- Razorpay integration
- Automatic subscription management
- Feature gating based on subscription

## 🚀 Deployment

### Backend
```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

### Frontend
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 License

This project is for educational purposes.

## 👨‍💻 Developer

**Mukesh Kumar**
- GitHub: [@mukeshk78254](https://github.com/mukeshk78254)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For any queries, reach out via GitHub issues or email.

---

**⚠️ Security Note**: Never commit `.env` files or expose API keys in public repositories.

Made with ❤️ by CoderWorld Team
