// src/pages/Home.jsx
import React from "react";
import Header from "../components/Header";
import AuthForm from "../components/AuthForm";
import "../index.css";

const Home = () => {
  return (
    <div className="home">
      <Header />
      <main>
        <AuthForm />
      </main>
    </div>
  );
};

export default Home;