import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                <span className="font-black text-xl font-display">L</span>
              </div>
              <span className="text-2xl font-black tracking-tighter font-display">LIDERMAQ</span>
            </Link>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Equipando o sucesso do seu negócio com as melhores soluções em máquinas e equipamentos comerciais desde 1994 em Picos-PI.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/lidermaqequipamentos/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-accent hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/lider.maq.33?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-accent hover:text-white transition-all">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-8">Institucional</h4>
            <ul className="space-y-4">
              {[
                { name: 'Sobre a Lidermaq', path: '/sobre' },
                { name: 'Nossos Produtos', path: '/catalogo' },
                { name: 'Assistência Técnica', path: '/assistencia' },
                { name: 'Política de Privacidade', path: '/politica-privacidade' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-8">Categorias</h4>
            <ul className="space-y-4">
              {['Padarias', 'Restaurantes', 'Açougues', 'Supermercados', 'Lanchonetes'].map((cat) => (
                <li key={cat}>
                  <Link to={`/catalogo?cat=${cat}`} className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-8">Contato</h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent shrink-0">
                  <MapPin size={20} />
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Av. Principal, 1234<br />Centro, Picos - PI
                </p>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent shrink-0">
                  <Phone size={20} />
                </div>
                <div className="text-zinc-400 text-sm leading-relaxed">
                  <p>(89) 99917-0800</p>
                  <p>(89) 99986-1264</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Lidermaq Equipamentos. CNPJ: 19.743.850/0001-08.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Privacidade</a>
            <a href="#" className="text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
