import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CookieBanner } from './components/CookieBanner';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/produto/:id" element={<ProductDetail />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/sobre" element={<About />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              
              {/* Rota Protegida para Admin */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route path="/assistencia" element={<Home />} />
              <Route path="/componentes" element={<Home />} />
              <Route path="/blog" element={<Home />} />
              <Route path="/blog/:id" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
          <CookieBanner />
        </div>
      </Router>
    </AuthProvider>
  );
}
