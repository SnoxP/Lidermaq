import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus, Trash2, Tag, Edit, Save, X } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { SEO } from '../../components/SEO';

interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  active: boolean;
}

export const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountPercentage: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ code: '', discountPercentage: 0, active: true });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const q = query(collection(db, 'coupons'), orderBy('code'));
      const snapshot = await getDocs(q);
      const couponsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Coupon[];
      setCoupons(couponsData);
    } catch (error) {
      console.error('Erro ao buscar cupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || newCoupon.discountPercentage <= 0) return;

    try {
      const code = newCoupon.code.toUpperCase().trim();
      const couponRef = doc(db, 'coupons', code);
      await setDoc(couponRef, {
        code,
        discountPercentage: newCoupon.discountPercentage,
        active: true,
        createdAt: new Date().toISOString()
      });
      
      setNewCoupon({ code: '', discountPercentage: 0 });
      setIsAdding(false);
      fetchCoupons();
    } catch (error) {
      console.error('Erro ao adicionar cupom:', error);
      alert('Erro ao adicionar cupom. Verifique se o código já existe.');
    }
  };

  const handleUpdateCoupon = async (id: string) => {
    try {
      const couponRef = doc(db, 'coupons', id);
      await updateDoc(couponRef, {
        code: editData.code.toUpperCase().trim(),
        discountPercentage: editData.discountPercentage,
        active: editData.active
      });
      setEditingId(null);
      fetchCoupons();
    } catch (error) {
      console.error('Erro ao atualizar cupom:', error);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cupom?')) return;
    try {
      await deleteDoc(doc(db, 'coupons', id));
      fetchCoupons();
    } catch (error) {
      console.error('Erro ao excluir cupom:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'coupons', id), { active: !currentStatus });
      fetchCoupons();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-500 pb-20">
      <SEO title="Gerenciar Cupons - Lidermaq" />
      
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 mb-8">
        <div className="container mx-auto flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-accent transition-colors">Início</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/admin" className="hover:text-accent transition-colors">Painel Administrativo</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-zinc-900 dark:text-white font-medium">Cupons</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter dark:text-white font-display flex items-center gap-3">
              <Tag className="text-accent" />
              CUPONS DE DESCONTO
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Gerencie os cupons promocionais da loja.</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors"
          >
            {isAdding ? <X size={20} /> : <Plus size={20} />}
            {isAdding ? 'Cancelar' : 'Novo Cupom'}
          </button>
        </div>

        {isAdding && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddCoupon}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8"
          >
            <h3 className="font-bold text-lg mb-4 dark:text-white">Adicionar Novo Cupom</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Código do Cupom</label>
                <input
                  type="text"
                  required
                  placeholder="EX: BEMVINDO10"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Desconto (%)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  placeholder="10"
                  value={newCoupon.discountPercentage || ''}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountPercentage: Number(e.target.value) })}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Salvar Cupom
              </button>
            </div>
          </motion.form>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <th className="p-4 font-bold">Código</th>
                  <th className="p-4 font-bold">Desconto</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500 dark:text-zinc-400">Carregando cupons...</td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500 dark:text-zinc-400">Nenhum cupom cadastrado.</td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4 font-bold text-zinc-900 dark:text-white font-mono">
                        {editingId === coupon.id ? (
                          <input
                            type="text"
                            value={editData.code}
                            onChange={(e) => setEditData({ ...editData, code: e.target.value.toUpperCase() })}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-zinc-900 dark:text-white uppercase"
                          />
                        ) : (
                          coupon.code
                        )}
                      </td>
                      <td className="p-4 text-zinc-600 dark:text-zinc-400">
                        {editingId === coupon.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={editData.discountPercentage}
                              onChange={(e) => setEditData({ ...editData, discountPercentage: Number(e.target.value) })}
                              className="w-20 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-zinc-900 dark:text-white"
                            />
                            <span>%</span>
                          </div>
                        ) : (
                          `${coupon.discountPercentage}%`
                        )}
                      </td>
                      <td className="p-4">
                        {editingId === coupon.id ? (
                          <select
                            value={editData.active ? 'true' : 'false'}
                            onChange={(e) => setEditData({ ...editData, active: e.target.value === 'true' })}
                            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-zinc-900 dark:text-white"
                          >
                            <option value="true">Ativo</option>
                            <option value="false">Inativo</option>
                          </select>
                        ) : (
                          <button
                            onClick={() => toggleActive(coupon.id, coupon.active)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                              coupon.active 
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30' 
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                            }`}
                          >
                            {coupon.active ? 'Ativo' : 'Inativo'}
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {editingId === coupon.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdateCoupon(coupon.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                              title="Salvar"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                              title="Cancelar"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingId(coupon.id);
                                setEditData({ code: coupon.code, discountPercentage: coupon.discountPercentage, active: coupon.active });
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
