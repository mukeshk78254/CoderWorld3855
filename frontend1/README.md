# 🎨 CoderWorld Frontend# React + Vite



<div align="center">This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)Currently, two official plugins are available:

[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.8-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

**Modern React frontend for CoderWorld coding platform**

## Expanding the ESLint configuration

[🌐 Live Demo](https://coder-world3855.vercel.app) • [📖 Main Docs](../README.md) • [🐛 Report Bug](https://github.com/mukeshk78254/CoderWorld3855/issues)

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

</div>



---

import { useForm } from 'react-hook-form';

## 📋 Table of Contentsimport { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

- [Overview](#overview)

- [Tech Stack](#tech-stack)const signupSchema = z.object({

- [Features](#features)  firstName: z.string().min(3, "Minimum character should be 3"),

- [Project Structure](#project-structure)  emailId: z.string().email("Invalid Email"),

- [Getting Started](#getting-started)  password: z.string().min(8, "Password is to weak")

- [Environment Variables](#environment-variables)});

- [Available Scripts](#available-scripts)

- [Key Components](#key-components)function Signup() {

- [Styling](#styling)  const {

- [Performance](#performance)    register,

    handleSubmit,

---    formState: { errors },

  } = useForm({ resolver: zodResolver(signupSchema) });

## 🎯 Overview

  const onSubmit = (data) => {

CoderWorld Frontend is a modern, high-performance React application built with Vite. It provides an intuitive interface for coding practice, contests, and learning.    console.log(data);



### ✨ Key Features    // Backend data ko send kar dena chaiye?

  };

- ⚡ **Lightning Fast** - Vite for instant HMR

- 🎨 **Beautiful UI** - Tailwind CSS + DaisyUI  return (

- 📱 **Fully Responsive** - Mobile, tablet, desktop    <div className="min-h-screen flex items-center justify-center p-4"> {/* Centering container */}

- 🎬 **Smooth Animations** - GSAP + Framer Motion      <div className="card w-96 bg-base-100 shadow-xl"> {/* Existing card styling */}

- 🚀 **Code Splitting** - Route-based lazy loading        <div className="card-body">

- 🔒 **Type Safe** - Zod schema validation          <h2 className="card-title justify-center text-3xl">Leetcode</h2> {/* Centered title */}

          <form onSubmit={handleSubmit(onSubmit)}>

---            {/* Existing form fields */}

            <div className="form-control">

## 🛠️ Tech Stack              <label className="label mb-1">

                <span className="label-text">First Name</span>

### Core              </label>

- **React 19.1.0** - Latest React              <input

- **Vite 6.3.5** - Build tool                type="text"

- **React Router 7.7.1** - Routing                placeholder="John"

                className={`input input-bordered ${errors.firstName && 'input-error'}`}

### UI & Styling                {...register('firstName')}

- **Tailwind CSS 4.1.8** - Utility-first CSS              />

- **DaisyUI 5.0.42** - Component library              {errors.firstName && (

- **Framer Motion 12.23.12** - Animations                <span className="text-error">{errors.firstName.message}</span>

- **GSAP 3.13.0** - Advanced animations              )}

- **Lucide React 0.534.0** - Icons            </div>



### State & Forms            <div className="form-control  mt-4">

- **Redux Toolkit 2.8.2** - State management              <label className="label mb-1">

- **React Hook Form 7.56.4** - Forms                <span className="label-text">Email</span>

- **Zod 3.25.56** - Validation              </label>

              <input

### Code Editor                type="email"

- **Monaco Editor 4.7.0** - VS Code editor                placeholder="john@example.com"

- **Allotment 1.20.4** - Split panes                className={`input input-bordered ${errors.emailId && 'input-error'}`}

                {...register('emailId')}

### Data Visualization              />

- **Recharts 3.1.2** - Charts              {errors.emailId && (

                <span className="text-error">{errors.emailId.message}</span>

### HTTP Client              )}

- **Axios 1.9.0** - API calls            </div>



---            <div className="form-control mt-4">

              <label className="label mb-1">

## ✨ Features                <span className="label-text">Password</span>

              </label>

### 🎨 User Interface              <input

- Modern dark theme                type="password"

- Responsive design                placeholder="••••••••"

- Smooth animations                className={`input input-bordered ${errors.password && 'input-error'}`}

- Toast notifications                {...register('password')}

              />

### 💻 Code Editor              {errors.password && (

- Monaco Editor (VS Code)                <span className="text-error">{errors.password.message}</span>

- Multi-language support              )}

- Split-pane layout            </div>

- Full-screen mode

            <div className="form-control mt-6 flex justify-center">

### 📊 Dashboard              <button

- Real-time metrics                type="submit"

- 30-day charts                className="btn btn-primary"

- Activity heatmap              >

- Problem tracking                Sign Up

              </button>

### 🏆 Features            </div>

- Contest system          </form>

- Leaderboard        </div>

- Discussion forum      </div>

- User profiles    </div>

  );

### 🔐 Authentication}

- Email/Password

- OAuth (Google, Facebook)export default Signup;

- OTP verificationhttps://github.com/mukeshk78254/LEETCODE/tree/main

- Password resethttps://g.co/gemini/share/bc8b73eb8946



---



## 📂 Project Structureimport { useForm } from 'react-hook-form';

import {zodResolver} from '@hookform/resolvers/zod';

```import{z} from 'zod';

frontend1/

├── public/const signupschema=z.object({

├── src/  firstname:z.string().min(3,"firstname should be atleast 3 character"),

│   ├── components/         # Reusable components  emailid:z.string().email(),

│   │   ├── dashboard/     # Dashboard components

│   │   ├── AdminPanel.jsx  password:z.string().min(8,"password should be atleast 8 character")

│   │   └── ...

│   ├── pages/             # Page components})

│   │   ├── LandingPage.jsx

│   │   ├── Dashboard.jsx

│   │   ├── LeetCodeStylePage.jsx

│   │   └── ...

│   ├── store/             # Redux store

│   │   └── authSlice.js

│   ├── utils/             # Utilities

│   │   └── axiosClient.js

│   ├── App.jsx            # Root component

│   └── main.jsx           # Entry point

├── .env                   # Environment variables

├── package.json

├── tailwind.config.js

├── vite.config.js

└── README.md

```// formstate:{error}   means agr format submit krte time agr koi bhi error aayega yha se hh usko identify kr skte hai us jagah pr likhs kte hai i ye error aaaya hai jaise

function Signup() {

---  const {register,handleSubmit,formState: { errors },} = useForm({resolver:zodResolver(signupschema)}); // schema ko pass krne ka tarika jha data register hoga whi to validation lgega aur basically isse link bhi ho gya



## 🚀 Getting Started  return (

   

### Prerequisites 

- Node.js 16.x or higher   

- npm or yarn    <form onSubmit={handleSubmit((data) => console.log(data))} >

       <input {...register('firstname')} placeholder='Enter firstname' />  

### Installation       {errors.firstname && (<span>{errors.firstname.message}</span>)}

        {/* ...register(firstName) se ye k objctb return kr  deta hai ... register lgane se ye apna app value cjange ko show kr deta hai isme koi onchange ya value lgane ka jrurat nih hai   ye key ke terah hai firstname yha jo name dalenge wh value ke form me stote hog to ye json form me de rha hai ye to achi bat hai db sare doc ko json form mr hi loeta hai*/}

1. **Clone repository**      <input {...register('emailid', { required: true })} placeholder='Enter Emailid' />

```bash      <input {...register('password', { required: true })} placeholder='Enter Password' type='password'/>

git clone https://github.com/mukeshk78254/CoderWorld3855.git      <button type='submit' className='btn btn-lg'>Submit</button>

cd CoderWorld3855/frontend1   

```     

    </form>

2. **Install dependencies**  );

```bash}

npm install

```



3. **Setup environment**



Create `.env` file:

```env

VITE_API_URL=http://localhost:5000

VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

```



4. **Start dev server**

```bash

npm run dev

```



Visit `http://localhost:5173`

export default Signup

---



## 🔐 Environment Variables



Create `.env` file:

```env
# Backend API
VITE_API_URL=http://localhost:5000

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### Production

```env
VITE_API_URL=https://your-backend.com
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Production build

# Preview
npm run preview      # Preview production build

# Lint
npm run lint         # Check code quality
```

---

## 🧩 Key Components

### Dashboard Components

**`Header.jsx`** - Navigation with search

**`StatsCards.jsx`** - Problem stats

**`PerformanceChart.jsx`** - 30-day chart

**`HeatmapCalendar.jsx`** - Activity heatmap

**`RecentActivity.jsx`** - Latest submissions

### Pages

**`LandingPage.jsx`** - Home page

**`LeetCodeStylePage.jsx`** - Code editor

**`Dashboard.jsx`** - User dashboard

**`PremiumPage.jsx`** - Subscription

---

## 🎨 Styling

### Tailwind CSS

Custom theme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#06b6d4',
      secondary: '#a855f7',
    }
  }
}
```

### DaisyUI Components
- Buttons, cards, modals
- Forms, inputs
- Navigation, menus

---

## ⚡ Performance

### Code Splitting
```jsx
const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Loader />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>
```

### Optimizations
- Tree shaking
- Minification
- Lazy loading
- Route-based splitting

---

## 🚀 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in dashboard

---

## 🔒 Security

✅ Environment variables  
✅ XSS prevention  
✅ Input validation  
✅ Secure token storage  

---

## 🐛 Troubleshooting

**Issue:** npm install fails
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Issue:** Port in use
```bash
# Change port in vite.config.js
```

---

## 📚 Resources

- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

## 📧 Support

- 🐛 [Report Issues](https://github.com/mukeshk78254/CoderWorld3855/issues)
- 📧 [Email](mailto:support@coder-world3855.vercel.app)

---

<div align="center">

**⭐ Star the repo if you find it helpful!**

Built with ❤️ using React + Vite + Tailwind CSS

</div>
