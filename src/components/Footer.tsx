import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Phone, Mail, ShieldCheck, CreditCard, Store } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 overflow-hidden bg-accent text-white">
                <Store size={24} className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter font-display leading-none">
                  <span className="text-accent">LIDER</span><span className="text-white">MAQ</span>
                </span>
                <span className="text-[10px] font-medium font-sans text-white tracking-[0.3em] leading-none mt-1">
                  EQUIPAMENTOS
                </span>
              </div>
            </Link>
            <p className="text-zinc-400 leading-relaxed text-sm max-w-sm">
              Com mais de 10 anos de experiência, a Lidermaq é referência no fornecimento de máquinas e equipamentos comerciais em Picos-PI e região.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/lidermaqequipamentos/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-accent hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/lider.maq.33?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-accent hover:text-white transition-all">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Institucional</h4>
            <ul className="space-y-3">
              {[
                { name: 'Quem Somos', path: '/sobre' },
                { name: 'Nossas Lojas', path: '/contato' },
                { name: 'Trabalhe Conosco', path: '/contato' },
                { name: 'Política de Privacidade', path: '/privacidade' },
                { name: 'Termos de Uso', path: '/termos' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-zinc-400 hover:text-accent transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Central de Ajuda */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Central de Ajuda</h4>
            <ul className="space-y-3">
              {[
                { name: 'Meus Pedidos', path: '/perfil' },
                { name: 'Trocas e Devoluções', path: '/assistencia' },
                { name: 'Assistência Técnica', path: '/assistencia' },
                { name: 'Dúvidas Frequentes', path: '/contato' },
                { name: 'Fale Conosco', path: '/contato' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-zinc-400 hover:text-accent transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Televendas & Atendimento */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Atendimento</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-zinc-400 text-sm">
                <Phone size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-1">Televendas</p>
                  <p>(89) 99917-0800</p>
                  <p>(89) 99986-1264</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-zinc-400 text-sm">
                <Mail size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-1">E-mail</p>
                  <p>contato@lidermaq.com.br</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-zinc-400 text-sm">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-1">Loja Física</p>
                  <p>Av. Senador Helvídio Nunes, N°4731 - Junco, Picos - PI</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Payment & Security */}
        <div className="py-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Formas de Pagamento</h4>
            <div className="flex gap-3 text-zinc-400">
              <CreditCard size={32} />
              <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold">PIX</div>
              <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold">Boleto</div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Segurança</h4>
            <div className="flex gap-3 text-zinc-400">
              <div className="flex items-center gap-2 border border-zinc-800 rounded px-3 py-1">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-xs font-bold">Site Seguro</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} Lidermaq Equipamentos. Todos os direitos reservados. <br className="md:hidden" />
            CNPJ: 19.743.850/0001-08.
          </p>
        </div>
      </div>
    </footer>
  );
};
