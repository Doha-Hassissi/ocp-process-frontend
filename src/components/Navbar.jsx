import  { useState } from "react";
import { Link } from "react-router-dom";
import { 
  HomeIcon, 
 
  ClipboardDocumentListIcon, 
  CheckCircleIcon, 
  TableCellsIcon, 
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  
} from '@heroicons/react/24/outline';

function Navbar({ isLoggedIn=true, user, onLogout }) { 
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md px-6 py-3 transition-colors duration-300">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <img src="/logo.png" alt="logo" className="h-10 md:h-12" />
        </Link>

        {/* Mobile button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? (
            <XMarkIcon className="h-7 w-7 text-[#004621] dark:text-green-400" />
          ) : (
            <Bars3Icon className="h-7 w-7 text-[#004621] dark:text-green-400" />
          )}
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center space-x-6">

          <li className="flex items-center space-x-2 group">
            <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full">
              <HomeIcon className="h-5 w-5 text-[#004621] dark:text-green-400" />
            </div>
            <Link to="/" className="text-[#00833E] font-medium dark:text-white hover:text-green-600">Accueil</Link>
          </li>

          {/* Non connecté */}
          {!isLoggedIn && (
            <Link 
              to="/login" 
              className="bg-[#004621] text-white px-5 py-2 rounded-xl flex items-center space-x-2 hover:bg-green-700 transition font-bold text-sm shadow-md"
            >
              <span>Login</span>
            </Link>
          )}

          {/* Connecté */}
          {isLoggedIn && (
            <>
              <li className="flex items-center space-x-2">
                <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-[#004621] dark:text-green-400" />
                </div>
                <Link to="/ficheprocesslist" className="text-[#00833E] font-medium dark:text-white hover:text-green-600">Fiche Process</Link>
              </li>

              <li className="flex items-center space-x-2">
                <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full">
                  <CheckCircleIcon className="h-5 w-5 text-[#004621] dark:text-green-400" />
                </div>
                <Link to="/checklistlist" className="text-[#00833E] font-medium dark:text-white hover:text-green-600">Checklists</Link>
              </li>

              <li className="flex items-center space-x-2">
                <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full">
                  <TableCellsIcon className="h-5 w-5 text-[#004621] dark:text-green-400" />
                </div>
                <Link to="/dashboard" className="text-[#00833E] font-medium dark:text-white hover:text-green-600">Dashboard</Link>
              </li>

              <li className="flex items-center space-x-2">
                <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full">
                  <UserCircleIcon className="h-5 w-5 text-[#004621] dark:text-green-400" />
                </div>
                <Link to="/profile" className="text-[#00833E] font-medium dark:text-white hover:text-green-600">Profile</Link>
              </li>
              <li>
                <button onClick={onLogout} className="text-red-500 font-bold hover:text-red-700 ml-4 dark:text-red-400 dark:hover:text-red-300">
                  Déconnexion
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <ul className="flex flex-col mt-4 space-y-4 md:hidden animate-fadeIn dark:text-white">

          <li className="flex items-center space-x-3 p-2">
            <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full">
              <HomeIcon className="h-5 w-5 text-[#00833E] dark:text-green-400" />
            </div>
            <Link to="/" onClick={()=>setMenuOpen(false)}>Accueil</Link>
          </li>

          {!isLoggedIn && (
            <Link 
              to="/login" 
              onClick={()=>setMenuOpen(false)}
              className="bg-[#004621] text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 font-bold shadow-md"
            >
              <UserCircleIcon className="h-5 w-5" />
              <span>Login</span>
            </Link>
          )}

          {isLoggedIn && (
            <>
              <li className="flex items-center space-x-3 p-2">
                <ClipboardDocumentListIcon className="h-5 w-5 text-[#00833E] dark:text-green-400" />
                <Link to="/ficheprocesslist" onClick={()=>setMenuOpen(false)}>Fiche Process</Link>
              </li>

              <li className="flex items-center space-x-3 p-2">
                <CheckCircleIcon className="h-5 w-5 text-[#00833E] dark:text-green-400" />
                <Link to="/checklistlist" onClick={()=>setMenuOpen(false)}>Checklists</Link>
              </li>

              <li className="flex items-center space-x-3 p-2">
                <TableCellsIcon className="h-5 w-5 text-[#00833E] dark:text-green-400" />
                <Link to="/dashboard" onClick={()=>setMenuOpen(false)}>Dashboard</Link>
              </li>

              <li className="flex items-center space-x-3 p-2">
                <UserCircleIcon className="h-5 w-5 text-[#00833E] dark:text-green-400" />
                <Link to="/profile" onClick={()=>setMenuOpen(false)}>Profile</Link>
              </li>
              <li className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => { onLogout(); setMenuOpen(false); }} className="text-red-500 font-bold flex items-center space-x-2 w-full text-left p-2">
                  <span>Logout</span>
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;