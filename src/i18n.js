import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      "Dashboard": "Tableau de Bord",
      "Login": "Connexion",
      "Process_Sheets": "Fiches Process",
      "Checklists": "Checklists",
      "Profile": "Profil",
      "Logout": "Déconnexion",
      "Add_Process_Sheet": "Ajouter Fiche Process",
      "Add_Checklist": "Ajouter Checklist",
      "Total_Inspections": "Inspections Totales",
      "Equipment_OK": "Équipements OK",
      "Active_Anomalies": "Anomalies Actives",
      "Users": "Utilisateurs",
      "Change_Language": "Changer la langue",
      "Dark_Mode": "Mode Sombre",
      "Light_Mode": "Mode Clair",
      "Measure_Evolution": "Évolution des Mesures",
      "Critical_Alerts": "Alertes Critiques",
      "Email": "Email (@ocpgroup.ma obligatoire)",
      "Password": "Mot de passe"
    }
  },
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "Login": "Login",
      "Process_Sheets": "Process Sheets",
      "Checklists": "Checklists",
      "Profile": "Profile",
      "Logout": "Logout",
      "Add_Process_Sheet": "Add Process Sheet",
      "Add_Checklist": "Add Checklist",
      "Total_Inspections": "Total Inspections",
      "Equipment_OK": "Equipment OK",
      "Active_Anomalies": "Active Anomalies",
      "Users": "Users",
      "Change_Language": "Change Language",
      "Dark_Mode": "Dark Mode",
      "Light_Mode": "Light Mode",
      "Measure_Evolution": "Measures Evolution",
      "Critical_Alerts": "Critical Alerts",
      "Email": "Email (@ocpgroup.ma required)",
      "Password": "Password"
    }
  },
  ar: {
    translation: {
      "Dashboard": "لوحة القيادة",
      "Login": "تسجيل الدخول",
      "Process_Sheets": "أوراق العملية",
      "Checklists": "قوائم الفحص",
      "Profile": "الملف الشخصي",
      "Logout": "تسجيل الخروج",
      "Add_Process_Sheet": "إضافة ورقة عملية",
      "Add_Checklist": "إضافة قائمة فحص",
      "Total_Inspections": "إجمالي الفحوصات",
      "Equipment_OK": "معدات سليمة",
      "Active_Anomalies": "شذوذ نشط",
      "Users": "المستخدمين",
      "Change_Language": "تغيير اللغة",
      "Dark_Mode": "الوضع الداكن",
      "Light_Mode": "الوضع الفاتح",
      "Measure_Evolution": "تطور القياسات",
      "Critical_Alerts": "تنبيهات حرجة",
      "Email": "البريد الإلكتروني (@ocpgroup.ma مطلوب)",
      "Password": "كلمة المرور"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
