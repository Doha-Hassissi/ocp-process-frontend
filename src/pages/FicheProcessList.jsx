import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Plus, FileText, 
  Download, Eye, Trash2 
} from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

const FicheProcessList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFiches();
  }, []);

  const fetchFiches = () => {
    axios.get('https://ocp-process-backend-production.up.railway.app/api/fiches')
      .then(res => {
        setFiches(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette fiche ?")) {
      axios.delete(`https://ocp-process-backend-production.up.railway.app/api/fiches/${id}`)
        .then(() => fetchFiches())
        .catch(err => console.error(err));
    }
  };

  
  const filteredFiches = fiches.filter(f => {
    const ligne = (f.infos_generales?.ligne || '').toLowerCase();
    const id = String(f._id || f.id || '').toLowerCase();

    return (
      ligne.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase())
    );
  });

  const exportToExcel = (fiche) => {
    const data = [
    {
      "Date": fiche.infos_generales?.date || fiche.date,
      "Ligne": fiche.infos_generales?.ligne,
      "Chef D'équipe": fiche.infos_generales?.chef_equipe,
      "Opérateur": fiche.infos_generales?.operateur,

      

      // U03 Attaque
      "Temp. Cuve": fiche.u03_attaque?.temperature_cuve,
      "Delta T": fiche.u03_attaque?.delta_t,
      "Niveau M01": fiche.u03_attaque?.niveau_m01,
      "Niveau M02": fiche.u03_attaque?.niveau_m02,
      

      // U13 Stockage
      
      "Bac 1": fiche.u13_stockage?.bac_1_val,
      "Bac 2": fiche.u13_stockage?.bac_2_val,

      // Compteurs
      "H2SO4 Début": fiche.compteurs?.h2so4?.debut,
      "H2SO4 Fin": fiche.compteurs?.h2so4?.fin,
      "H2SO4 Conso": fiche.compteurs?.h2so4?.conso,

      "Acide Produit Début": fiche.compteurs?.acide_produit?.debut,
      "Acide Produit Fin": fiche.compteurs?.acide_produit?.fin,
      "Acide Produit Conso": fiche.compteurs?.acide_produit?.conso,

      "Eau Brute Début": fiche.compteurs?.eau_brute?.debut,
      "Eau Brute Fin": fiche.compteurs?.eau_brute?.fin,
      "Eau Brute Conso": fiche.compteurs?.eau_brute?.conso,

      "Heures Marche": fiche.compteurs?.heures_marche || 0,
    }
  ];


    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fiche");

    XLSX.writeFile(wb, `Fiche_${fiche._id || fiche.id}.xlsx`);
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen font-sans animate-fadeIn transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#004621] dark:text-green-400 flex items-center gap-2 tracking-tight">
              <FileText size={28} /> {t('Process_Sheets')}
            </h1>
            
          </div>

          <Link 
            to="/ficheprocessform"
            className="bg-[#004621] dark:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-900/20 hover:bg-[#003318] dark:hover:bg-green-500 transition-all active:scale-95 text-sm uppercase tracking-wider"
          >
            <Plus size={20} /> Ajouter Nouvelle Fiche process
          </Link>
        </div>

        {/* SEARCH */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par ligne ou ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-[#004621] transition-all text-sm font-medium"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left border-collapse">

            {/* HEADER */}
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Ligne de Production
                </th>
                <th className="p-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="p-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-slate-400 dark:text-slate-500 font-medium">
                    Chargement des données...
                  </td>
                </tr>
              ) : filteredFiches.length > 0 ? (
                filteredFiches.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                    
                    {/* LIGNE */}
                    <td className="p-4">
                      <div className="font-bold text-slate-800 dark:text-white text-sm">
                        {item.infos_generales?.ligne || 'N/A'}
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300 font-mono text-xs">
                      {item.infos_generales?.date
                        ? new Date(item.infos_generales.date).toLocaleDateString()
                        : 'N/R'}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right flex justify-end gap-2">

                      <button 
                        onClick={() => exportToExcel(item)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="Voir"
                      >
                        <Eye size={18}/>
                      </button>

                      <button 
                        onClick={() => exportToExcel(item)}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg"
                        title="Excel"
                      >
                        <Download size={18}/>
                      </button>

                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={18}/>
                      </button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-20 text-center text-slate-400 font-medium dark:text-slate-500">
                    Aucun résultat {searchTerm}
                  </td> 
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
};

export default FicheProcessList;