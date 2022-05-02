import React from 'react';

import { Brand, Navbar, Footer} from './Components';
import { Header, About, Search, Games, Login, Signup, Dashboard, UpdateProfile, ForgotPassword, Continue} from './Containers';
import { Routes, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import { AuthProvider } from './Context/AuthContext';

export const Empty = () => (
  <>
  </>
)

const App = () => {

  return (
    <AuthProvider>
    <div className='App'>
        <div className='gradient__bg'>
          <Navbar />
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/about" element={<Empty />} />
            <Route path="/community" element={<Header />} />
            <Route path="/search" element={<Empty />} />
            <Route path="/games" element={<Empty />} />
            <Route path="/login" element={<Empty />} />
            <Route path="/signup" element={<Empty />} />
            <Route path="/continue" element={<Empty />} />
            <Route path="/dashboard" element={<Empty />} />
            <Route path="/update-profile" element={<Empty />} />
            <Route path="/forgot-password" element={<Empty />} />

          </Routes>
        </div>
        <Routes>
          <Route path="/" element={<Empty />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Brand />} />
          <Route path="/search" element={<Search />} />
          <Route path="/games" element={<Games />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/continue" element={<Continue />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/update-profile" element={<UpdateProfile/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Routes>
        <Route path='/' element={<Footer />} />
        <Route path='/about' element={<Footer />} />
        <Route path="/community" element={<Footer />} />
        <Route path="/search" element={<Footer />} />
        <Route path="/games" element={<Empty />} />
        <Route path="/login" element={<Empty />} />
        <Route path="/signup" element={<Empty />} />
        <Route path="/continue" element={<Empty />} />
        <Route path="/dashboard" element={<Empty/>} />
        <Route path="/update-profile" element={<Empty/>} />
        <Route path="/forgot-password" element={<Empty />} />
        </Routes>
    </div>
    </AuthProvider>
  )
}

export default App


