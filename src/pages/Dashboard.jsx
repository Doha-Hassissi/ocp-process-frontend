import { useState, useEffect } from "react";
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ArrowUpRight,
  PlusCircle,
  Upload,
  History,
  RefreshCw,
  TrendingUp,
  Thermometer,
  Droplets,
  Gauge,
  Trash2,
  Download,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import axios from "axios";
import { Link } from "react-router-dom";

/* ================= CARD ================= */
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <span className="text-xs text-green-500 flex items-center gap-1 font-semibold">
        <ArrowUpRight size={12} /> Actif
      </span>
    </div>
    <div className="mt-4">
      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
        {title}
      </p>
      <h2 className="text-3xl font-black text-slate-800 mt-1">{value}</h2>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

/* ================= PARAMETRE CRITIQUE CARD ================= */
const ParamCard = ({
  label,
  value,
  unit,
  icon: Icon,
  color,
  max,
  critical,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const isCritical = critical && critical(value);

  return (
    <div
      className={`p-4 rounded-2xl border-2 transition-all ${isCritical ? "bg-red-50 border-red-200" : "bg-white border-slate-100"}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${isCritical ? "bg-red-500" : color}`}>
          <Icon size={18} className="text-white" />
        </div>
        <div>
          <p
            className={`text-sm font-bold ${isCritical ? "text-red-700" : "text-slate-700"}`}
          >
            {label}
          </p>
          <p className="text-xs text-slate-400">
            Max: {max}
            {unit}
          </p>
        </div>
      </div>

      <div className="flex items-end gap-2">
        <span
          className={`text-2xl font-black ${isCritical ? "text-red-600" : "text-slate-800"}`}
        >
          {value}
          {unit}
        </span>
        {isCritical && (
          <span className="text-xs text-red-500 font-bold animate-pulse">
            ⚠️ CRITIQUE
          </span>
        )}
      </div>

      {/* Barre de progression */}
      <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isCritical ? "bg-red-500" : color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/* ================= DASHBOARD ================= */
const Dashboard = () => {
  const [stats, setStats] = useState({ fiches: 0, checklists: 0, mesures: 0 });
  const [mesures, setMesures] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchAll();
    // Rafraîchissement automatique toutes les 30 secondes
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  /* ================= FETCH DATA ================= */
  const fetchAll = async () => {
    try {
      setLoading(true);

      const [fiches, checklists, filesRes] = await Promise.all([
        axios.get("https://ocp-process-backend-production.up.railway.app/api/fiches"),
        axios.get("https://ocp-process-backend-production.up.railway.app/api/checklists"),
        axios.get("https://ocp-process-backend-production.up.railway.app/api/procedures"),
      ]);

      setStats({
        fiches: fiches.data.length,
        checklists: checklists.data.length,
        mesures: fiches.data.length, // nombre de fiches correspond au "nombre de mesures"
      });

      // Extraire les paramètres critiques
      const mesuresCritiques = (fiches.data || []).map((f) => ({
        id: f._id,
        timestamp: f.infos_generales?.date,
        niveau_m01: parseFloat(f.u03_attaque?.niveau_m01) || 0,
        niveau_m02: parseFloat(f.u03_attaque?.niveau_m02) || 0,
        temperature_cuve: parseFloat(f.u03_attaque?.temperature_cuve) || 0,
        delta_t: parseFloat(f.u03_attaque?.delta_t) || 0,
      }));

      // Trier par date
      mesuresCritiques.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      );

      setMesures(mesuresCritiques);
      setFiles(filesRes.data || []);
      setLastUpdate(new Date().toLocaleTimeString("fr-FR"));

      detectAnomalies(mesuresCritiques);
    } catch (err) {
      console.error("Erreur fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DETECT ANOMALIES ================= */
  const detectAnomalies = (data) => {
    if (!data || data.length === 0) return;

    const last = data[data.length - 1];

    // Assurer que les champs sont bien numériques
    const m01 = parseFloat(last.niveau_m01) || 0;
    const m02 = parseFloat(last.niveau_m02) || 0;
    const delta = parseFloat(last.delta_t) || 0;
    const temp = parseFloat(last.temperature_cuve) || 0;

    const anomaliesList = [];

    if (m01 >= 100)
      anomaliesList.push({ label: "Niveau M01 ≥ 100%", value: m01 });

    if (m02 >= 100)
      anomaliesList.push({ label: "Niveau M02 ≥ 100%", value: m02 });

    if (!isNaN(delta) && (delta < 1.8 || delta > 3)) {
  anomaliesList.push({
    label: "Delta T critique",
    value: delta
  });
}
    if (temp >= 84)
      anomaliesList.push({ label: "Température cuve ≥ 84°C", value: temp });
    // Mettre à jour l’état pour affichage
    setAlerts(anomaliesList);

    // Envoi au serveur si anomalies détectées
    if (anomaliesList.length > 0) {
      axios
        .post("https://ocp-process-backend-production.up.railway.app/api/send-alert", {
          anomalies: anomaliesList,
          timestamp: new Date().toISOString(),
        })
        .catch((err) => console.error("Erreur envoi anomalies:", err));
    }
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if (!selectedFile) return alert("Choisir un fichier");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("https://ocp-process-backend-production.up.railway.app/api/procedures", formData);
      fetchAll();
      setSelectedFile(null);
      alert("Fichier uploadé avec succès!");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload");
    }
  };
  // 🗑️ DELETE FILE
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce fichier ?")) return;

    try {
      await axios.delete(`https://ocp-process-backend-production.up.railway.app/api/procedures/${id}`);
      fetchAll(); // refresh list
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression");
    }
  };

  // 💾 DOWNLOAD FILE
  const handleDownload = (id) => {
    try {
      window.open(`https://ocp-process-backend-production.up.railway.app/api/procedures/${id}/download`);
    } catch (err) {
      console.error("Erreur téléchargement:", err);
      alert("Erreur lors du téléchargement");
    }
  };

  /* ================= DERNIERES VALEURS ================= */
  const getLatestValues = () => {
    if (mesures.length === 0) return null;
    return mesures[mesures.length - 1]; // dernière fiche process
  };

  const latest = getLatestValues();

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#004621]">
              Dashboard OCP
            </h1>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link
              to="/ficheprocessform"
              className="bg-[#004621] text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-[#003618] transition-colors shadow-lg shadow-[#004621]/20"
            >
              <PlusCircle size={16} /> Fiche Process
            </Link>

            <Link
              to="/checklistform"
              className="border-2 border-[#004621] text-[#004621] px-5 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-[#004621]/5 transition-colors"
            >
              <FileText size={16} /> Checklist
            </Link>
          </div>
        </div>

        {/* CARDS STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Fiches Process"
            value={stats.fiches}
            icon={FileText}
            color="bg-blue-500"
            subtitle="Formulaires soumis"
          />
          <StatCard
            title="Checklists"
            value={stats.checklists}
            icon={ShieldCheck}
            color="bg-green-500"
            subtitle="Contrôles effectués"
          />
        </div>

        {/* PARAMETRES CRITIQUES - AFFICHAGE TEMPS REEL */}
        {latest && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-[#004621]" size={20} />
              <h3 className="font-bold text-slate-800">
                Paramètres Critiques - Dernière Mesure
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ParamCard
                label="Niveau M01"
                value={latest.niveau_m01}
                unit="%"
                icon={Gauge}
                color="bg-blue-500"
                max={100}
                critical={(v) => v >= 100}
              />
              <ParamCard
                label="Niveau M02"
                value={latest.niveau_m02}
                unit="%"
                icon={Gauge}
                color="bg-purple-500"
                max={100}
                critical={(v) => v >= 100}
              />
              <ParamCard
                label="Température Cuve"
                value={latest.temperature_cuve}
                unit="°C"
                icon={Thermometer}
                color="bg-orange-500"
                max={84}
                critical={(v) => v >= 84}
              />
              <ParamCard
  label="Delta T"
  value={latest.delta_t}
  unit=""
  icon={Droplets}
  color="bg-cyan-500"
  max={3}
  critical={(v) => v < 1.8 || v > 3}
/>
            </div>
          </div>
        )}

        {/* GRAPH EVOLUTION */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-[#004621]" size={20} />
              <h3 className="font-bold text-slate-800 text-lg">
                Évolution des Mesures
              </h3>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div> M01
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div> M02
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Temp
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div> Delta
                T
              </span>
            </div>
          </div>

          {mesures.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <Activity size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">
                Aucune donnée disponible
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Remplissez une fiche process pour voir l'évolution des
                paramètres
              </p>
              <Link
                to="/ficheprocessform"
                className="inline-block mt-4 text-[#004621] font-bold hover:underline"
              >
                + Créer une fiche process
              </Link>
            </div>
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={mesures}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorM01" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorM02" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="timestamp"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />

                  {/* Lignes de référence pour seuils critiques */}
                  <ReferenceLine
                    y={100}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    label={{
                      value: "Seuil M01/M02 100%",
                      fill: "#ef4444",
                      fontSize: 10,
                    }}
                  />
                  <ReferenceLine
                    y={84}
                    stroke="#f97316"
                    strokeDasharray="5 5"
                    label={{
                      value: "Seuil Temp 84°C",
                      fill: "#f97316",
                      fontSize: 10,
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="niveau_m01"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorM01)"
                    strokeWidth={3}
                    name="Niveau M01 (%)"
                  />
                  <Area
                    type="monotone"
                    dataKey="niveau_m02"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorM02)"
                    strokeWidth={3}
                    name="Niveau M02 (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature_cuve"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
                    name="Température Cuve (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="delta_t"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2 }}
                    name="Delta T"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {mesures.length > 0 && (
            <p className="text-xs text-slate-400 mt-4 text-center">
              {mesures.length} point(s) de mesure • Mis à jour automatiquement
            </p>
          )}
        </div>

        {/* ALERTES */}
        <div
          className={`p-6 rounded-3xl shadow-sm border ${alerts.length > 0 ? "bg-red-50 border-red-200" : "bg-white border-slate-100"}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle
              className={alerts.length > 0 ? "text-red-500" : "text-slate-400"}
              size={20}
            />
            <h3
              className={`font-bold ${alerts.length > 0 ? "text-red-600" : "text-slate-700"}`}
            >
              Anomalies Critiques {alerts.length > 0 && `(${alerts.length})`}
            </h3>
          </div>

          {/* ================= ANOMALIES ================= */}
          {alerts.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-2 mt-4">
              <h3 className="font-bold text-red-700 text-sm">
                ⚠️ Anomalies détectées :
              </h3>
              <ul className="text-red-600 text-xs">
                {alerts.map((a, i) => (
                  <li key={i}>
                    {a.label} — Valeur: {a.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* PROCEDURES OPERATOIRES */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-[#004621]" size={20} />
            <h3 className="font-bold text-[#004621]">Procédures Opératoires</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full p-3 border-2 border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#004621] file:text-white file:font-bold hover:file:bg-[#003618] cursor-pointer"
              />
              {selectedFile && (
                <p className="text-xs text-slate-500 mt-2">
                  Fichier sélectionné: {selectedFile.name}
                </p>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${selectedFile ? "bg-[#004621] text-white hover:bg-[#003618] shadow-lg shadow-[#004621]/20" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
            >
              <Upload size={18} /> Upload
            </button>
          </div>

          {/* Historique */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <History size={16} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-600">
                Historique ({files.length} fichiers)
              </span>
            </div>

            <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
              {files.length === 0 ? (
                <p className="text-sm text-slate-400 italic">
                  Aucun fichier uploadé
                </p>
              ) : (
                files.map((f, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 p-3 rounded-xl flex items-center justify-between group hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-[#004621]" />
                      <span className="text-sm font-medium text-slate-700">
                        {f.filename}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* DOWNLOAD */}
                      <button
                        onClick={() => handleDownload(f._id)}
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                      >
                        <Download size={16} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                      >
                        <Trash2 size={16} />
                      </button>

                      <span className="text-xs text-slate-400">
                        {new Date(f.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
