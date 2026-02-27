import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CookieBanner } from './components/CookieBanner';
import { MobileHUD } from './components/MobileHUD';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { NewProduct } from './pages/admin/NewProduct';
import { EditProduct } from './pages/admin/EditProduct';
import { ProductList } from './pages/admin/ProductList';
import { UserList } from './pages/admin/UserList';
import { Categories } from './pages/admin/Categories';
import { NewPost } from './pages/admin/NewPost';
import { Settings } from './pages/admin/Settings';
import { AdminManagement } from './pages/admin/AdminManagement';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
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
                <Route 
                  path="/perfil" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Rotas Protegidas para Admin */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/novo-produto" 
                  element={
                    <ProtectedRoute adminOnly>
                      <NewProduct />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/editar-produto/:id" 
                  element={
                    <ProtectedRoute adminOnly>
                      <EditProduct />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/produtos" 
                  element={
                    <ProtectedRoute adminOnly>
                      <ProductList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/categorias" 
                  element={
                    <ProtectedRoute adminOnly>
                      <Categories />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/novo-post" 
                  element={
                    <ProtectedRoute adminOnly>
                      <NewPost />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/configuracoes" 
                  element={
                    <ProtectedRoute adminOnly>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/usuarios-registrados" 
                  element={
                    <ProtectedRoute adminOnly>
                      <UserList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/usuarios" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminManagement />
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
            <MobileHUD />
            <CookieBanner />
          </div>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}
