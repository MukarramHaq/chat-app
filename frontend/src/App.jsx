import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { useThemeStore } from './store/useThemeStore.js';

import { useEffect } from 'react';

import { Loader } from "lucide-react";
import { Toaster } from 'react-hot-toast';

const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const {theme} = useThemeStore();
  
  // useEffect runs some code when things change or when your component first appears on the screen
  useEffect(() => {
    checkAuth(); // this is the effect that will run
  }, [checkAuth]); // this is the dependency array which tells React when to run the effect and only when the component mounts

  console.log({ authUser });

  // If we are checking if the user is authenticated and we don't have the user data yet, we show a loading spinner
  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin' />
    </div>
  )

  return (
    <div data-theme={theme}>

      <Navbar  />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage />  : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <LoginPage />   : <Navigate to='/' />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>

      <Toaster  />

    </div>
  )
}

export default App