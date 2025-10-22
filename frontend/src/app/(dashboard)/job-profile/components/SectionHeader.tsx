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
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center text-white">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
      >
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </button>
    </div>
  );
}