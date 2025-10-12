"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUser,
  FaFileAlt,
  FaBriefcase,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { cn } from "@/app/lib/utils";

const menuItems = [
  { title: "Dashboard", icon: FaTachometerAlt, path: "/dashboard" },
  {
    title: "Profile",
    icon: FaUser,
    path: "/dashboard/profile",
  },
  { title: "CV Generate", icon: FaFileAlt, path: "/dashboard/cv-generate" },
  { title: "Job Offers", icon: FaBriefcase, path: "/dashboard/job-offers" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const normalize = (p?: string) =>
    (p || "/").toLowerCase().replace(/\/+$/g, "") || "/";

  const current = normalize(pathname);

  return (
    <aside
      className={cn(
        "h-screen border-r border-border bg-white shadow-sm transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
        )}
        <button
          onClick={() => setCollapsed((s) => !s)}
          className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <FaBars className="h-5 w-5" />
          ) : (
            <FaTimes className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => {
          const itemPath = normalize(item.path);
          const isActive =
            current === itemPath || current.startsWith(itemPath + "/");

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                "hover:bg-blue-50",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                  : "text-gray-700"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
