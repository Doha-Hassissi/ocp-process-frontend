import React from "react";
import { useParams, Link } from "react-router-dom";

const ChecklistView = ({ checklist }) => {
  const { id } = useParams();
  const checklistt = checklist?.find(c => c.id.toString() === id);

  if (!checklistt) {
    return <p className="p-6">Checklist introuvable</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg space-y-4">
      <h1 className="text-xl font-bold text-[#004621]">Checklist {checklistt.id}</h1>
      <p><strong>Date:</strong> {checklistt.date}</p>
      <p><strong>Type:</strong> {checklistt.type}</p>
      <p><strong>Entité:</strong> {checklistt.entite}</p>
      <p><strong>Unité:</strong> {checklistt.unite}</p>
      <p><strong>Bâtiment:</strong> {checklistt.batiment}</p>
      <p><strong>Observations:</strong> {checklistt.observation}</p>
      <p><strong>Nom:</strong> {checklistt.nom}</p>
      <p><strong>Matricule:</strong> {checklistt.matricule}</p>
      {checklistt.signature && (
        <img src={checklistt.signature} alt="Signature" className="mt-4 border rounded-lg" />
      )}

      <div className="flex gap-4 mt-6">
        <Link 
          to={`/checklistform/${checklistt.id}`} 
          className="px-6 py-2 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-400"
        >
          Modifier
        </Link>
        <Link 
          to="/" 
          className="px-6 py-2 bg-[#004621] text-white rounded-full font-bold hover:bg-[#003318]"
        >
          Retour
        </Link>
      </div>
    </div>
  );
};

export default ChecklistView;