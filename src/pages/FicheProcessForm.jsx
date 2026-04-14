import React, { useState, useEffect } from "react";
import {
  Activity,
  Database,
  Calculator,
  ArrowLeft,
  AlertCircle,
  Info,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Composant réutilisable pour les Headers de Section
const SectionHeader = ({ icon: Icon, title, color = "emerald" }) => {
  const colors = {
    emerald: {
      border: "border-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
    blue: {
      border: "border-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    orange: {
      border: "border-orange-600",
      bg: "bg-orange-50",
      text: "text-orange-700",
    },
    slate: {
      border: "border-slate-600",
      bg: "bg-slate-50",
      text: "text-slate-700",
    },
    purple: {
      border: "border-purple-600",
      bg: "bg-purple-50",
      text: "text-purple-700",
    },
  };
  const c = colors[color] || colors.emerald;
  return (
    <div
      className={`flex items-center gap-3 border-l-4 ${c.border} ${c.bg} p-3 mb-4 rounded-r-lg`}
    >
      <Icon className={`${c.text}`} size={20} />
      <h3 className={`font-black ${c.text} uppercase text-xs tracking-widest`}>
        {title}
      </h3>
    </div>
  );
};

const FicheProcessForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("infos");

  const [formData, setFormData] = useState({
    infos_generales: {
      date: new Date().toISOString().split("T")[0],
      ligne: "",
      chef_equipe: "",
      operateur: "",
    },
    u03_attaque: {
      temperature_cuve: "",
      delta_t: "",
      niveau_m01: "",
      niveau_m02: "",
      taux_solide: "",
    },
    u13_stockage: { orientation_production: "F", bac_1_val: "", bac_2_val: "" },
    compteurs: {
      h2so4: { debut: "", fin: "", conso: "" },
      acide_produit: { debut: "", fin: "", conso: "" },
      eau_brute: { debut: "", fin: "", conso: "" },
      heures_marche: 0, // Libre
    },
    typeDoc: "PROCESS",
  });

  // Charger la fiche si ID présent
  useEffect(() => {
    if (id) {
      axios
        .get(
          `https://ocp-process-backend-production.up.railway.app/api/fiches/${id}`,
        )
        .then((res) => setFormData(res.data))
        .catch((err) => console.error("Erreur de chargement:", err));
    }
  }, [id]);

  const getBacLabels = (orientation) => {
    const mapping = {
      F: ["13FR03", "13HR03"],
      E: ["13ER03", "13GR03"],
      AB: ["13AR03", "13BR03"],
      CD: ["13CR03", "13DR03"],
      XY: ["13XR03", "13YR03"],
      ZU: ["13ZR03", "13UR03"],
    };
    return mapping[orientation] || ["", ""];
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // Modification : heures_marche = libre, les autres compteurs = calcul automatique
  const handleCompteurChange = (field, subField, value) => {
    setFormData((prev) => {
      const updatedCompteurs = { ...prev.compteurs };

      if (field === "heures_marche") {
        updatedCompteurs[field] = value; // juste valeur directe
      } else {
        const val = parseFloat(value) || 0;
        const updatedCompteur = { ...updatedCompteurs[field], [subField]: val };
        updatedCompteur.conso = Number(
          (updatedCompteur.fin - updatedCompteur.debut).toFixed(2),
        );
        updatedCompteurs[field] = updatedCompteur;
      }

      return { ...prev, compteurs: updatedCompteurs };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const cleanData = JSON.parse(
        JSON.stringify(formData, (key, value) => {
          return value === "" ? 0 : value;
        }),
      );

      const dataToSend = {
        ...cleanData,
        id: "FICHE-" + Date.now(),
        infos_generales: {
          ...cleanData.infos_generales,
          date: new Date(cleanData.infos_generales.date),
        },
      };

      console.log("Données envoyées :", dataToSend);

      const response = await axios.post(
        "https://ocp-process-backend-production.up.railway.app/api/fiches",
        dataToSend,
      );

      if (response.status === 200 || response.status === 201) {
        alert("Fiche Process enregistrée avec succès !");
        navigate("/ficheprocesslist");
      }
    } catch (err) {
      console.error("Erreur Backend:", err.response?.data || err.message);
      alert("Erreur lors de l'enregistrement. Vérifie la console.");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen font-sans">
      <form
        onSubmit={handleSave}
        className="shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="bg-white p-6 rounded-t-3xl shadow-sm border border-slate-100">
          <button
            type="button"
            onClick={() => navigate("/ficheprocesslist")}
            className="p-2 bg-slate-100 rounded-full hover:bg-emerald-100 text-emerald-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <br />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              Fiche Process
            </h1>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex bg-white border-b border-slate-200">
          {[
            { id: "infos", label: "Général", icon: Info },
            { id: "production", label: "Unités U02/U03", icon: Activity },
            { id: "stockage", label: "Stockage & Compteurs", icon: Database },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"}`}
            >
              <tab.icon size={16} />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="bg-white p-8 min-h-[500px]">
          {/* Onglet Infos */}
          {activeTab === "infos" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <SectionHeader
                icon={Info}
                title="Identification du Poste"
                color="emerald"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.infos_generales.date}
                    onChange={(e) =>
                      handleNestedChange(
                        "infos_generales",
                        "date",
                        e.target.value,
                      )
                    }
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>

                <div className="space-y-2 group">
                  <div className="flex items-center gap-2 ml-1">
                    <div
                      className={`w-1 h-3 rounded-full transition-colors ${formData.infos_generales.ligne ? "bg-emerald-600" : "bg-slate-300"}`}
                    ></div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Ligne de Production
                    </label>
                  </div>
                  <div className="relative">
                    <select
                      value={formData.infos_generales.ligne}
                      onChange={(e) =>
                        handleNestedChange(
                          "infos_generales",
                          "ligne",
                          e.target.value,
                        )
                      }
                      className="w-full appearance-none bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none shadow-sm transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 cursor-pointer"
                      required
                    >
                      <option value="" disabled className="text-slate-400">
                        -- Choisir la ligne --
                      </option>
                      {["F", "E", "AB", "CD", "XY", "ZU"].map((l) => (
                        <option key={l} value={l} className="font-bold py-2">
                          Ligne {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[9px] font-medium text-slate-400 ml-1">
                    {formData.infos_generales.ligne
                      ? `Unité sélectionnée : ${formData.infos_generales.ligne}`
                      : "Sélection obligatoire pour le rapport"}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">
                    Chef d'Équipe
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nom complet"
                    value={formData.infos_generales.chef_equipe}
                    onChange={(e) =>
                      handleNestedChange(
                        "infos_generales",
                        "chef_equipe",
                        e.target.value,
                      )
                    }
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">
                    Opérateur
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nom de l'opérateur"
                    value={formData.infos_generales.operateur}
                    onChange={(e) =>
                      handleNestedChange(
                        "infos_generales",
                        "operateur",
                        e.target.value,
                      )
                    }
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Onglet Production */}
          {activeTab === "production" && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <section>
                <SectionHeader
                  icon={Activity}
                  title="Paramétre Critique"
                  color="blue"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Temp. Cuve",
                      field: "temperature_cuve",
                      unit: "°C",
                    },
                    { label: "Delta T", field: "delta_t", unit: "Δ" },
                    { label: "Niveau M01", field: "niveau_m01", unit: "%" },
                    { label: "Niveau M02", field: "niveau_m02", unit: "%" },
                  ].map((item) => (
                    <div
                      key={item.field}
                      className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center"
                    >
                      <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">
                        {item.label}
                      </label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={formData.u03_attaque[item.field]}
                        onChange={(e) =>
                          handleNestedChange(
                            "u03_attaque",
                            item.field,
                            parseFloat(e.target.value),
                          )
                        }
                        className="w-full bg-white border-none rounded-lg p-2 text-center font-black outline-none"
                        placeholder={item.unit}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Onglet Stockage & Compteurs */}
          {activeTab === "stockage" && (
            <div className="space-y-10 animate-in fade-in duration-300">
              {/* Stockage */}
              <section>
                <SectionHeader
                  icon={Database}
                  title="Unité 13 : Stockage Acide"
                  color="orange"
                />
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {["F", "E", "AB", "CD", "XY", "ZU"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          handleNestedChange(
                            "u13_stockage",
                            "orientation_production",
                            opt,
                          )
                        }
                        className={`flex-1 min-w-[60px] py-3 rounded-xl font-black text-xs transition-all border-2 ${formData.u13_stockage.orientation_production === opt ? "bg-orange-500 border-orange-500 text-white shadow-lg" : "bg-white border-slate-200 text-slate-500"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getBacLabels(
                      formData.u13_stockage.orientation_production,
                    ).map((label, i) => (
                      <div
                        key={label}
                        className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex justify-between items-center"
                      >
                        <span className="text-[10px] font-black text-orange-700 uppercase">
                          Bac {label}
                        </span>
                        <input
                          type="number"
                          required
                          step="0.01"
                          value={
                            i === 0
                              ? formData.u13_stockage.bac_1_val
                              : formData.u13_stockage.bac_2_val
                          }
                          onChange={(e) =>
                            handleNestedChange(
                              "u13_stockage",
                              i === 0 ? "bac_1_val" : "bac_2_val",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-32 bg-white rounded-lg p-2 text-right font-black outline-none"
                          placeholder="m³"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Compteurs */}
              <section>
                <SectionHeader
                  icon={Calculator}
                  title="Consommations & Flux"
                  color="slate"
                />
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <tr>
                        <th className="p-4 text-left">Paramètre</th>
                        <th className="p-4 text-center">Début</th>
                        <th className="p-4 text-center">Fin</th>
                        <th className="p-4 text-center bg-emerald-50 text-emerald-700">
                          Consommation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Object.keys(formData.compteurs).map((key) => {
                        if (key === "heures_marche") {
                          return (
                            <tr key={key}>
                              <td className="p-4 font-bold text-slate-700 uppercase text-[10px]">
                                {key.replace("_", " ")}
                              </td>
                              <td colSpan={3}>
                                <input
                                  type="number"
                                  value={formData.compteurs[key]}
                                  onChange={(e) =>
                                    handleCompteurChange(
                                      key,
                                      null,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full text-center p-2 outline-none font-bold"
                                  placeholder="Heures"
                                  required
                                />
                              </td>
                            </tr>
                          );
                        } else {
                          return (
                            <tr key={key} className="hover:bg-slate-50">
                              <td className="p-4 font-bold text-slate-700 uppercase text-[10px]">
                                {key.replace("_", " ")}
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  value={formData.compteurs[key].debut}
                                  onChange={(e) =>
                                    handleCompteurChange(
                                      key,
                                      "debut",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full text-center p-2 outline-none font-bold"
                                  required
                                />
                              </td>
                              <td className="p-2 text-center font-black bg-emerald-50/30 text-emerald-700">
                                <input
                                  type="number"
                                  value={formData.compteurs[key].fin}
                                  onChange={(e) =>
                                    handleCompteurChange(
                                      key,
                                      "fin",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full text-center p-2 outline-none font-bold"
                                  required
                                />
                              </td>
                              <td className="p-2 text-center font-black bg-emerald-50 text-emerald-700">
                                {formData.compteurs[key].conso}
                              </td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-100 font-bold text-[10px] uppercase">
              <AlertCircle size={14} /> Vérifier leurs informations
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={() => navigate("/ficheprocesslist")}
                className="flex-1 px-8 py-4 rounded-2xl text-[10px] font-black text-slate-400 hover:bg-slate-100 uppercase transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-2 flex items-center justify-center gap-3 px-12 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black shadow-xl hover:bg-emerald-700 hover:-translate-y-1 transition-all uppercase"
              >
                Enregistrer fiche process
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FicheProcessForm;
