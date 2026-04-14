import { useState, useEffect } from 'react';
import { Plus, Search, FileCheck, Calendar, Trash2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Carte checklist
const ChecklistCard = ({ checklist, onDelete }) => {
  const exportSingleToExcel = () => {
    const data = [{
      "Date": new Date( checklist.date).toLocaleDateString(),
      "Unité": checklist.unite ,
      "Zone": checklist.zone ,
      "Entité": checklist.entite ,
      "Observations": checklist.observations ,
      "Nom": checklist.nom ,
      "Matricule": checklist.matricule 
    }];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Checklist");
    XLSX.writeFile(wb, `Checklist_${checklist._id.substring(0,8)}.xlsx`);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-4 hover:shadow-xl transition-all">
      <div className="bg-green-50 p-4 rounded-full w-fit mx-auto">
        <FileCheck className="text-[#004621]" size={28} />
      </div>

      <div className="text-center space-y-1">
        <div className="flex items-center justify-center space-x-2 text-[#004621] font-bold text-sm">
          <Calendar size={14} />
          <span>{new Date( checklist.date).toLocaleDateString()}</span>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
           {checklist.unite || "Unité :"}
        </p>
        <p className="text-xs text-slate-600 mt-1">{checklist.entite || "Entité :"}</p>
      </div>

      <div className="flex space-x-2 pt-4">
        <Link
          onClick={exportSingleToExcel}
          className="flex-1 bg-[#004621] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#003318] transition-colors flex items-center justify-center space-x-2"
        >
          <FileCheck size={14} />
          <span>Voir</span>
        </Link>
        <button
          onClick={() => onDelete(checklist._id)}
          className="flex-1 bg-red-100 text-red-600 py-2.5 rounded-xl text-xs font-bold hover:bg-red-200 transition-colors flex items-center justify-center space-x-2"
        >
          <Trash2 size={14} />
          <span>Supprimer</span>
        </button>
        <button
          onClick={exportSingleToExcel}
          className="flex-1 bg-blue-100 text-blue-700 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-200 transition-colors flex items-center justify-center space-x-2"
        >
          <Download size={14} />
          <span>Excel</span>
        </button>
      </div>
    </div>
  );
};

// Page complète de checklists avec recherche
const ChecklistList = () => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get('https://ocp-process-backend-production.up.railway.app/api/checklists')
      .then(res => {
        setChecklists(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette checklist ?")) {
      axios.delete(`https://ocp-process-backend-production.up.railway.app/api/checklists/${id}`)
        .then(() => setChecklists(checklists.filter(c => c._id !== id)))
        .catch(err => console.error(err));
    }
  };

  // Filtre global sur Zone + Unité + Entité
  const filteredChecklists = checklists.filter(item => {
    const search = searchTerm.toLowerCase();
    return (item.zone || "").toLowerCase().includes(search)
      || (item.unite || "").toLowerCase().includes(search)
      || (item.entite || "").toLowerCase().includes(search);
  });

  return (
    <div className="p-8 min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#004621] tracking-tight">Checklists</h1>
            
          </div>
          <Link
            to="/checklistform"
            className="bg-[#004621] text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 font-bold shadow-lg hover:bg-[#003318] transition-transform active:scale-95"
          >
            <Plus size={20} />
            <span>Ajouter Nouvelle CheckList</span>
          </Link>
        </div>

        {/* Barre de recherche globale */}
<div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
  <div className="relative flex-1">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
    <input 
      type="text" 
      placeholder="Rechercher par Zone, Unité ou Entité..." 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-[#004621] transition-all text-sm font-medium"
    />
  </div>
</div>

        {/* Grille des checklists */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 font-medium mt-4">Chargement...</p>
          </div>
        ) : filteredChecklists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredChecklists.map(check => (
              <ChecklistCard key={check._id} checklist={check} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border-2 border-dashed border-slate-200">
            <Search className="mx-auto text-slate-300 mb-6" size={56} />
            <p className="text-slate-500 font-bold text-lg">Aucun résultat  {searchTerm}</p>
            <p className="text-slate-400 text-sm mt-2">Vérifiez l'orthographe ou ajoutez une nouvelle checklist.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChecklistList;