import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/toaster";
import Footer from "./components/Footer";
import MusicPlayer from "./components/MusicPlayer";
import CursorGlow from "./components/CursorGlow";
import ScrollToTop from "./components/ScrollToTop";

// Lazy-loaded pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Admin = lazy(() => import("./pages/Admin"));
const TrippyTales = lazy(() => import("./pages/TrippyTales"));
const TrippyTalesPage = lazy(() => import("./pages/TrippyTalesPage"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));

// Minimal loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen" style={{ backgroundColor: 'transparent' }}>
        <BrowserRouter>
          <ScrollToTop />
          <CursorGlow />
          <Navbar />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/trippy-tales" element={<TrippyTalesPage />} />
              <Route path="/blog" element={<TrippyTales />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
          <Footer />
          <MusicPlayer />
          <Toaster />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
