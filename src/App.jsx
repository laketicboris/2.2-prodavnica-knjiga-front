import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Publishers from "./components/Publishers.jsx";
import Books from "./components/Books.jsx";
import BookForm from "./components/BookForm.jsx";
import Authors from "./components/Authors.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
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
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;