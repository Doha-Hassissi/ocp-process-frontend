import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, UserCheck, AlertCircle, ArrowLeft } from "lucide-react";
import axios from "axios";

// Composant réutilisable pour un champ input
const InputField = ({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
}) => (
  <div className="space-y-1">
    <label className="text-[11px] font-extrabold text-[#004621] uppercase ml-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#004621] focus:border-transparent outline-none transition-all text-sm"
    />
  </div>
);

// Composant réutilisable pour un menu déroulant (select)
const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="space-y-1">
    <label className="text-[11px] font-extrabold text-[#004621] uppercase ml-1">
      {label}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#004621] focus:border-transparent outline-none text-sm appearance-none"
    >
      <option value="">Choisir...</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const ChecklistForm = () => {
  const { id } = useParams(); // Récupère l'ID si on est en mode édition
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    entite: "",
    unite: "",
    zone: "",
    tag: "",
    observations: "",
    nom: "",
    matricule: "",
  });

  // Si on est en mode édition, on charge la checklist existante
  useEffect(() => {
    if (id) {
      axios
        .get("https://ocp-process-backend-production.up.railway.app/api/checklists")
        .then((res) => {
          const found = res.data.find((c) => c._id === id);
          if (found) setFormData(found);
        })
        .catch(console.error);
    }
  }, [id]);

  // Met à jour le state à chaque changement dans les inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Sauvegarde de la checklist (POST ou PUT selon mode)
  const handleSave = async (e) => {
  e.preventDefault();

  // Vérification des champs obligatoires
  for (let key in formData) {
    // Si c'est un champ vide ou juste des espaces
    if (!formData[key] || formData[key].toString().trim() === "") {
      alert(`Veuillez remplir le champ "${key}" !`);
      return; // Stoppe l'envoi
    }
  }

  try {
    if (id) {
      await axios.put(`https://ocp-process-backend-production.up.railway.app/api/checklists/${id}`, formData);
    } else {
      await axios.post("https://ocp-process-backend-production.up.railway.app/api/checklists", formData);
    }
    alert("Checklist enregistrée avec succès !");
    navigate("/checklistlist");
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'enregistrement.");
  }
};
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen font-sans">

      {/* HEADER avec logo et titre */}
      <div className="bg-white p-6 rounded-t-3xl shadow-sm border border-slate-100">
        <button
          type="button"
          onClick={() => navigate("/checklistlist")} // <- page où tu montres toutes les checklists
          className="p-2 bg-slate-100 rounded-full hover:bg-emerald-100 text-emerald-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>{" "}
        <br />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-xl font-black text-[#004621] uppercase">
            Add Checklist
          </h1>
        </div>
      </div>

      {/* FORMULAIRE */}
      <form
        onSubmit={handleSave}
        className="bg-white p-8 rounded-b-3xl shadow-sm border-x border-b border-slate-100 mb-10 space-y-10"
      >
        {/* SECTION INFORMATIONS */}
        <section>
          <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-2">
            <ShieldCheck className="text-[#004621]" size={20} />
            <h2 className="font-bold text-[#004621] text-sm uppercase">
              Les Informations
            </h2>
          </div>

          {/* Grid responsive pour inputs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <InputField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />
            <InputField
              label="Entité"
              name="entite"
              placeholder="OCP"
              value={formData.entite}
              onChange={handleChange}
            />
            <InputField
              label="Unité"
              name="unite"
              placeholder="ex: U03F"
              value={formData.unite}
              onChange={handleChange}
            />
            <SelectField
              label="Zone"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              options={["E", "F", "AB", "CD", "XY", "ZU"]}
            />

            {/* Tag et Observations côte à côte */}
            <div className="md:col-span-2">
              <InputField
                label="Tag"
                name="tag"
                placeholder="Tag"
                value={formData.tag}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-extrabold text-[#004621] uppercase ml-1">
                Observations
              </label>
              <textarea
                name="observations"
                placeholder="R.A.S"
                value={formData.observations || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#004621] outline-none text-sm resize-none"
              />
            </div>
          </div>
        </section>

        {/* SECTION VALIDATION INTERVENANT */}
        <section className="bg-green-50 p-6 rounded-3xl border border-green-100">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <UserCheck className="text-[#004621]" size={20} />
            <h2 className="font-bold text-[#004621] text-sm uppercase">
              Validation Intervenant
            </h2>
          </div>

          {/* Grid centrée pour inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
            <InputField
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
            />
            <InputField
              label="Matricule"
              name="matricule"
              value={formData.matricule}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* BOUTON ENREGISTRER */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="px-16 py-4 bg-[#004621] text-white rounded-full font-black text-sm uppercase hover:bg-[#003318] shadow-xl shadow-green-900/20 transition-all active:scale-95"
          >
            ENREGISTRER LA CHECKLIST
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChecklistForm;
