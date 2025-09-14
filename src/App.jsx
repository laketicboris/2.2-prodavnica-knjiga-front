import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Publishers from "./components/Publishers.jsx";
import Books from "./components/Books.jsx";
import BookForm from "./components/BookForm.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import './style/main.scss';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publishers" element={<Publishers />} />
        <Route path="/books" element={<Books />} />
        <Route path="/create-book" element={<BookForm />} />
        <Route path="/edit-book/:id" element={<BookForm />} /> {/* EDIT */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
