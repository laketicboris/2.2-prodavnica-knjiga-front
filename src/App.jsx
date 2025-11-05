import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Layout/Home.jsx";
import Publishers from "./components/User/Publishers.jsx";
import Books from "./components/Books/Books.jsx";
import BookForm from "./components/Books/BookForm.jsx";
import Authors from "./components/User/Authors.jsx";
import Header from "./components/Layout/Header.jsx";
import Footer from "./components/Layout/Footer.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/User/Register.jsx";
import GoogleAuthSuccess from "./components/Google/GoogleAuthSuccess.jsx";
import GoogleAuthError from "./components/Google/GoogleAuthError.jsx";
import UserContext from "./components/User/UserContext.jsx";
import './style/main.scss';

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/publishers" element={<Publishers />} />
          <Route path="/books" element={<Books />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/create-book" element={<BookForm />} />
          <Route path="/edit-book/:id" element={<BookForm />} />
          
          {/* Google Authentication Routes */}
          <Route path="/auth/google-success" element={<GoogleAuthSuccess />} />
          <Route path="/auth/google-error" element={<GoogleAuthError />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;