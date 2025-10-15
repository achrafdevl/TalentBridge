"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "../../../redux/hooks";
import { logout } from "../../../redux/slices/authSlice";
import {
  FaTachometerAlt,
  FaUser,
  FaFileAlt,
  FaBriefcase,
  FaBars,
  FaSignOutAlt,
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaEye
} from "react-icons/fa";
import { cn } from "@/app/lib/utils";

const menuItems = [
  { 
    title: "Dashboard", 
    icon: FaTachometerAlt, 
    path: "/dashboard",
    badge: null
  },
  { 
    title: "Profil Pro", 
    icon: FaUser, 
    path: "/job-profile",
    badge: null
  },
  { 
    title: "CV & Candidatures", 
    icon: FaFileAlt, 
    path: "/cv-generate",
    badge: "3",
    subItems: [
      { title: "Générer un CV", path: "/cv-generate", icon: FaPlus },
      { title: "Mes CV", path: "/cv-generate?tab=my-resumes", icon: FaEye }
    ]
  },
  { 
    title: "Offres d'emploi", 
    icon: FaBriefcase, 
    path: "/job-offers",
    badge: "12"
  },
  { 
    title: "Mon Profil", 
    icon: FaCog, 
    path: "/profile",
    badge: null
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const normalize = (p?: string) =>
    (p || "/").toLowerCase().replace(/\/+$/g, "") || "/";
  const current = normalize(pathname);

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  return (
    <aside
      className={cn(
        "h-screen flex flex-col justify-between transition-all duration-300 shadow-xl border-r border-gray-100",
        collapsed ? "w-20" : "w-72",
        "bg-gradient-to-b from-[#1C96AD] via-[#1C96AD] to-[#178496] text-white"
      )}
    >
      {/* Header avec logo */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaBriefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">TalentBridge</h1>
              <p className="text-xs opacity-75">Votre carrière, notre passion</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed((s) => !s)}
          className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
          aria-label="Toggle sidebar"
        >
          <FaBars className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Navigation principale */}
      <nav className="flex flex-col gap-2 mt-6 px-3 flex-grow overflow-y-auto">
        {menuItems.map((item) => {
          const itemPath = normalize(item.path);
          const isActive = current === itemPath || current.startsWith(itemPath + "/");
          const isExpanded = expandedItems.includes(item.path);
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.path} className="space-y-1">
              {/* Item principal */}
              <div className="relative">
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 font-medium group relative overflow-hidden",
                    isActive
                      ? "bg-white text-[#1C96AD] shadow-lg transform scale-[1.02]"
                      : "hover:bg-white/10 hover:transform hover:scale-[1.01]"
                  )}
                >
                  {/* Indicateur actif */}
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-[#1C96AD] rounded-r-full"></div>
                  )}
                  
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-200",
                    isActive ? "text-[#1C96AD]" : "text-white/90"
                  )} />
                  
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      
                      {/* Badge de notification */}
                      {item.badge && (
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-bold",
                          isActive 
                            ? "bg-[#1C96AD] text-white" 
                            : "bg-white/20 text-white"
                        )}>
                          {item.badge}
                        </span>
                      )}
                      
                      {/* Flèche pour sous-menus */}
                      {hasSubItems && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleExpanded(item.path);
                          }}
                          className="p-1 hover:bg-white/10 rounded transition-all"
                        >
                          {isExpanded ? (
                            <FaChevronDown className="w-3 h-3" />
                          ) : (
                            <FaChevronRight className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </>
                  )}
                </Link>
              </div>

              {/* Sous-items */}
              {!collapsed && hasSubItems && isExpanded && (
                <div className="ml-4 space-y-1 border-l border-white/20 pl-4">
                  {item.subItems!.map((subItem) => {
                    const subItemPath = normalize(subItem.path);
                    const isSubActive = current === subItemPath;
                    
                    return (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                          isSubActive
                            ? "bg-white/20 text-white font-medium"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        )}
                      >
                        <subItem.icon className="h-4 w-4" />
                        <span>{subItem.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Section utilisateur et déconnexion */}
      <div className="border-t border-white/10 p-4 space-y-3">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FaUser className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">John Doe</p>
              <p className="text-xs opacity-75 truncate">john.doe@email.com</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => dispatch(logout())}
          className={cn(
            "flex items-center gap-3 w-full rounded-xl px-4 py-3 transition-all duration-200 hover:bg-red-500/20 text-white font-medium group",
            collapsed ? "justify-center" : ""
          )}
        >
          <FaSignOutAlt className="h-5 w-5 group-hover:scale-110 transition-transform" />
          {!collapsed && <span>Se déconnecter</span>}
        </button>
      </div>
    </aside>
  );
}