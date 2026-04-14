import React, { createContext, useState, useEffect } from 'react';

// 🎨 Création du contexte pour partager le thème dans toute l'application
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  // ✅ Initialiser le thème depuis localStorage (ou 'light' par défaut)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // 🔄 Appliquer le thème à chaque changement
  useEffect(() => {
    const root = document.documentElement; // <html>

    // 🌙 Si thème = dark → ajouter la classe "dark"
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      // ☀️ Sinon → enlever la classe
      root.classList.remove('dark');
    }

    // 💾 Sauvegarder le thème dans localStorage
    localStorage.setItem('theme', theme);

  }, [theme]);

  // 🔁 Fonction pour basculer entre light et dark
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // 📦 Fournir le thème et la fonction à toute l'application
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};