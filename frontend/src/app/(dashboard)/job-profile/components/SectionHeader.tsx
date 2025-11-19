"use client";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function SectionHeader({
  title,
  icon,
  isExpanded,
  onToggle,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1C96AD] to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <span className="text-xl">{icon}</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>
      <button
        onClick={onToggle}
        className="p-3 hover:bg-white/50 rounded-xl transition-all hover:scale-110 transform text-gray-600 hover:text-[#1C96AD]"
      >
        {isExpanded ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
      </button>
    </div>
  );
}