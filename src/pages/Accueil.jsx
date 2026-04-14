import React from 'react'

function Accueil() {
  return (
    <div className="bg-gray-50 px-6 md:px-12 py-10">

      
      <div className="flex flex-col md:flex-row-reverse items-center gap-12">

        {/* Image */}
        <div className="md:w-1/2">
          <img 
            src="backgroundimg.png" 
            alt="workflow"
            className="w-full max-w-xl mx-auto animate-fadeIn"
          />
        </div>

        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left animate-slideUp">

          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-green-700">
            Digital Workflow <br />
            System
          </h2>

          {/* Paragraph */}
          <p className="text-gray-600 text-lg max-w-md mx-auto md:mx-0">
            Solution digitale pour centraliser les procédures, digitaliser 
            les checklists et gérer efficacement les anomalies.
          </p>

        </div>
      </div>

      {/* CARDS  */}
      <div className="mt-20 text-center">

        <h3 className="text-2xl md:text-3xl font-semibold text-green-700 mb-12">
          Fonctionnalités principales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 place-items-center">

          {/* Card */}
          <div className="bg-white p-6 w-64 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <img src="centralisationimg.png" alt="" className="h-20 mx-auto mb-4"/>
            <h4 className="text-green-700 font-semibold">Centralisation</h4>
          </div>

          <div className="bg-white p-6 w-64 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <img src="checklistimg.png" alt="" className="h-20 mx-auto mb-4"/>
            <h4 className="text-green-700 font-semibold">Checklists digitales</h4>
          </div>

          <div className="bg-white p-6 w-64 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <img src="gestionanomalieimg.png" alt="" className="h-20 mx-auto mb-4"/>
            <h4 className="text-green-700 font-semibold">Gestion des anomalies</h4>
          </div>

          <div className="bg-white p-6 w-64 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <img src="notificationimg.png" alt="" className="h-20 mx-auto mb-4"/>
            <h4 className="text-green-700 font-semibold">Notifications</h4>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Accueil