import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Strict validation format email
    if (!email.endsWith('@ocpgroup.ma')) {
      setError("L'email doit impérativement se terminer par @ocpgroup.ma");
      return;
    }

    try {
      const res = await axios.post('https://ocp-process-backend-production.up.railway.app/api/auth/login', { email, password });
      // Call Context Login method
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Email ou mot de passe incorrect.");
      } else {
        setError("Impossible de se connecter au serveur.");
      }
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300 min-h-[80vh] flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-700 p-10 md:p-14 relative">
        <div className="absolute top-8 left-8">
          <img src="/logo.png" alt="OCP" className="h-10" />
        </div>
        
        <h2 className="text-center text-3xl font-black text-[#004621] dark:text-green-400 mb-2 mt-8 uppercase tracking-widest">
          {t('Login')}
        </h2>
        <p className="text-center text-slate-400 font-bold text-xs uppercase mb-10">Portail Sécurisé</p>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 p-4 rounded-xl font-bold text-sm text-center mb-6 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">{t('Email')}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='votre.nom@ocpgroup.ma'
              className="w-full px-6 py-4 rounded-full border border-slate-200 dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#004621] transition-all shadow-sm font-bold text-sm" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">{t('Password')}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='••••••••'
              className="w-full px-6 py-4 rounded-full border border-slate-200 dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#004621] transition-all shadow-sm font-bold text-sm tracking-widest" 
            />
          </div>

          <div className="flex justify-center pt-8">
            <button type="submit" className="w-full bg-[#004621] dark:bg-green-600 text-white px-12 py-4 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-[#003318] dark:hover:bg-green-500 transition-all active:scale-95 shadow-xl shadow-green-900/20">
              {t('Login')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;