
import { Routes,Route,Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { checkAuth } from "./authSlice";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import ProblemPage from './pages/ProblemPage';
import ContestPage from './pages/ContestPage'; // The new ContestPage
import LeaderboardPage from './pages/LeaderboardPage'; 
import AdminPanel from "./components/AdminPanel";
// import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo"
import AdminDelete from "./components/AdminDelete"
import AdminUpload from "./components/AdminUpload"
import ProfilePage from './pages/ProfilePage';


function App (){


   // code likhna isAuthentciated
    const dispatch = useDispatch();
     const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);
   
     // check initial authentication
     useEffect(() => {
       dispatch(checkAuth());
     }, [dispatch]);
     
     if (loading) {
       return <div className="min-h-screen flex items-center justify-center">
         <span className="loading loading-spinner loading-lg"></span>
       </div>;
     }
    
  return (
    <>
  <Routes>
  <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
       <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
       <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
        <Route path="/problem/:problemid" element={<ProblemPage />} />
            <Route path="/contests" element={<ContestPage />} /> {/* New route */}
        <Route path="/leaderboard" element={<LeaderboardPage />} />
         <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
      <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
      <Route path="/admin/upload/:problemid" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
      <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} /> {/* <--- Add this route */}

  </Routes>
    </>

  )
}
export default App;

// // import { Routes,Route,Navigate } from "react-router";
// // import Login from "./pages/Login";
// // import Signup from "./pages/Signup";
// // import Homepage from "./pages/Homepage";
// // import { checkAuth } from "./authSlice";
// // import { useDispatch,useSelector } from "react-redux";
// // import { useEffect } from "react";
// // import ProblemPage from './pages/ProblemPage';
// // import ContestPage from './pages/ContestPage';
// // import LeaderboardPage from './pages/LeaderboardPage'; 
// // import AdminPanel from "./components/AdminPanel";
// // import Admin from "./pages/Admin";
// // import AdminVideo from "./components/AdminVideo"
// // import AdminDelete from "./components/AdminDelete"
// // import AdminUpload from "./components/AdminUpload"
// // import ProfilePage from './pages/ProfilePage'; // <--- NEW IMPORT
// // import { Toaster } from 'react-hot-toast'; // <--- NEW IMPORT


// // function App (){
// //     const dispatch = useDispatch();
// //     const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);
   
// //     useEffect(() => {
// //         dispatch(checkAuth());
// //     }, [dispatch]);
     
// //     if (loading) {
// //         return (
// //             <div className="min-h-screen flex items-center justify-center bg-slate-950">
// //                 <span className="loading loading-spinner loading-lg text-indigo-500"></span>
// //             </div>
// //         );
// //     }
    
// //     return (
// //         <>
// //             <Toaster position="top-right" reverseOrder={false} /> {/* <--- NEW: Toaster for notifications */}
// //             <Routes>
// //                 <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
// //                 <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
// //                 <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
// //                 <Route path="/problem/:problemid" element={<ProblemPage />} />
// //                 <Route path="/contests" element={<ContestPage />} />
// //                 <Route path="/leaderboard" element={<LeaderboardPage />} />
// //                 <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} /> {/* <--- NEW ROUTE */}
// //                 <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
// //                 <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
// //                 <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
// //                 <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
// //                 <Route path="/admin/upload/:problemid" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
// //             </Routes>
// //         </>
// //     );
// // }
// // export default App;
// import { Routes,Route,Navigate } from "react-router";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Homepage from "./pages/Homepage";
// import { checkAuth } from "./authSlice";
// import { useDispatch,useSelector } from "react-redux";
// import { useEffect } from "react";
// import ProblemPage from './pages/ProblemPage';
// import ContestPage from './pages/ContestPage';
// import LeaderboardPage from './pages/LeaderboardPage'; 
// import AdminPanel from "./components/AdminPanel";
// import Admin from "./pages/Admin";
// import AdminVideo from "./components/AdminVideo"
// import AdminDelete from "./components/AdminDelete"
// import AdminUpload from "./components/AdminUpload"
// import ProfilePage from './pages/ProfilePage'; // NEW IMPORT


// function App (){
//     const dispatch = useDispatch();
//     const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);
   
//     useEffect(() => {
//         dispatch(checkAuth());
//     }, [dispatch]);
     
//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-slate-950">
//                 <span className="loading loading-spinner loading-lg text-indigo-500"></span>
//             </div>
//         );
//     }
    
//     return (
//         <>
//             {/* <Toaster position="top-right" reverseOrder={false} /> Removed */}
//             <Routes>
//                 <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
//                 <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
//                 <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
//                 <Route path="/problem/:problemid" element={<ProblemPage />} />
//                 <Route path="/contests" element={<ContestPage />} />
//                 <Route path="/leaderboard" element={<LeaderboardPage />} />
//                 <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
//                 <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
//                 <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
//                 <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
//                 <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
//                 <Route path="/admin/upload/:problemid" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
//             </Routes>
//         </>
//     );
// }
// export default App;