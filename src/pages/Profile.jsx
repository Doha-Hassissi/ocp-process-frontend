import React, { useContext, useState } from 'react';
import { 
  User, Mail, Shield, Award, Settings, 
  LogOut, MapPin, Briefcase, Bell, Key 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user: authUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });

  // Safe fallback if user info not fully loaded
  const user = authUser || {
    nom: 'Administrateur',
    matricule: '00000',
    email: 'admin@ocpgroup.ma',
    role: 'Admin'
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('https://ocp-process-backend-production.up.railway.app/api/auth/change-password', passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Mot de passe changé avec succès !');
      setShowModal(false);
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors du changement de mot de passe");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 transition-colors pb-12 font-sans">
      {/* HEADER DE PROFIL (Bannière) */}
      <div className="h-48 bg-gradient-to-r from-[#004621] to-[#006837] relative">
        <div className="max-w-5xl mx-auto px-6 h-full flex items-end">
          <div className="translate-y-12 flex flex-col md:flex-row items-end md:items-center gap-6">
            <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-[32px] p-2 shadow-xl">
              <div className="w-full h-full bg-slate-100 dark:bg-slate-700 rounded-[24px] flex items-center justify-center text-[#004621] dark:text-green-500">
                <User size={64} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        


        {/* COLONNE DROITE : PARAMÈTRES & COORDONNÉES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-black text-slate-800 dark:text-white text-lg uppercase tracking-tight">Informations Professionnelles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoRow icon={Mail} label="Email OCP" value={user.email} />
              
            </div> <br />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <button onClick={() => setShowModal(true)} className="flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 hover:border-[#004621] dark:hover:border-green-500 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Key size={20} />
                  </div>
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Changer le mot de passe</span>
                </div>
             </button>
          </div>
        </div>
      </div>
          </div>

          {/* ACTIONS DE COMPTE */}
          

      {/* MODAL CHANGEMENT MPD */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-wider">Sécurité du compte</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Ancien mot de passe</label>
                <input 
                  type="password" 
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-slate-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nouveau mot de passe</label>
                <input 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-slate-800 dark:text-white"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl">Annuler</button>
                <button type="submit" className="flex-1 py-3 text-sm font-black text-white bg-[#004621] dark:bg-green-600 hover:bg-[#003318] dark:hover:bg-green-500 rounded-xl shadow-lg">Confirmer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Petit composant pour les lignes d'info
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 p-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
    <div className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 rounded-2xl">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">{value || 'N/A'}</p>
    </div>
  </div>
);

export default Profile;