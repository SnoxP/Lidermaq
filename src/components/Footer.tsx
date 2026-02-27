import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-white font-bold">L</div>
              <span className="text-xl font-bold tracking-tighter">LIDERMAQ</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Móveis que duram. Qualidade, durabilidade e design para transformar seus ambientes. Desde 1995 servindo com excelência.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Institucional</h4>
            <ul className="flex flex-col gap-4 text-white/60 text-sm">
              <li><Link to="/sobre" className="hover:text-accent transition-colors">Sobre a Lidermaq</Link></li>
              <li><Link to="/catalogo" className="hover:text-accent transition-colors">Nossos Produtos</Link></li>
              <li><Link to="/assistencia" className="hover:text-accent transition-colors">Assistência Técnica</Link></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">Blog & Dicas</Link></li>
              <li><Link to="/politica-privacidade" className="hover:text-accent transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6">Categorias</h4>
            <ul className="flex flex-col gap-4 text-white/60 text-sm">
              <li><Link to="/catalogo?cat=Sofás" className="hover:text-accent transition-colors">Sofás</Link></li>
              <li><Link to="/catalogo?cat=Mesas" className="hover:text-accent transition-colors">Mesas e Cadeiras</Link></li>
              <li><Link to="/catalogo?cat=Dormitórios" className="hover:text-accent transition-colors">Dormitórios</Link></li>
              <li><Link to="/catalogo?cat=Armários" className="hover:text-accent transition-colors">Armários e Estantes</Link></li>
              <li><Link to="/catalogo?cat=Office" className="hover:text-accent transition-colors">Escritório</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contato</h4>
            <ul className="flex flex-col gap-4 text-white/60 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0" />
                <span>Av. Principal, 1234 - Centro, Picos - PI, 64600-000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <div className="flex flex-col">
                  <span>(89) 99917-0800 (Jonas)</span>
                  <span>(89) 99986-1264 (Lena)</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <span>contato@lidermaq.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© 2026 Lidermaq Móveis. CNPJ: 00.000.000/0001-00. Todos os direitos reservados.</p>
          <p>Desenvolvido por <a href="#" className="hover:text-white transition-colors underline">Sua Agência</a></p>
        </div>
      </div>
    </footer>
  );
};
