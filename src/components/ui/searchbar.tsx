"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  name: string;
  setName: (val: string) => void;
  loading: boolean;
  onEnter: () => void; // ✅ เพิ่ม prop สำหรับกด Enter
}

export function SearchBar({ name, setName, loading, onEnter }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEnter(); // ✅ กด Enter จะค้นหา
        }}
        placeholder="กรอกชื่อในแอพ iAM48"
        disabled={loading}
        className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
      />
    </div>
  );
}
