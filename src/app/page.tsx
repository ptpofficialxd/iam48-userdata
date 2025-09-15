"use client";

import { useState, useRef } from "react";
import { supabase } from "../lib/supabase-client";
import type { UserProfile } from "../type/user";
import { ProfileCard } from "../components/ui/profile-card";
import { SearchBar } from "../components/ui/searchbar";
import { PaginationControls } from "../components/ui/pagination-control";
import { Footer } from "../components/ui/footer";

// 🔥 Loading Overlay Component
function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function Page() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 6;
  const maxVisible = 10;
  const abortRef = useRef<AbortController | null>(null);

  const handleSearch = async (newPage = 0) => {
    if (!name.trim()) {
      setProfiles([]);
      setTotalCount(0);
      return;
    }

    // ยกเลิก request เก่าถ้ามี
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const from = newPage * pageSize;

      const { data, error } = await supabase.rpc("search_users", {
        keyword: name,
        limit_count: pageSize,
        offset_count: from,
      });

      if (error) throw error;

      // count ทั้งหมด
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .ilike("displayName", `%${name}%`);

      setTotalCount(count || 0);

      // ดึง profile เพิ่มเติม
      const profilesData = await Promise.all(
        (data as UserProfile[] || []).map(async (row: UserProfile) => {
          const res = await fetch(`/api/user/${row.id}`, {
            signal: controller.signal,
          });
          return res.ok ? await res.json() : row;
        })
      );

      setProfiles(profilesData);
      setPage(newPage);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message || "เกิดข้อผิดพลาดที่ไม่รู้จัก");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-neutral-950 text-gray-100 flex flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          ค้นหาข้อมูลผู้ใช้ iAM48
        </h1>

        {/* กล่องค้นหา */}
        <div className="flex justify-center w-full mb-6">
          <SearchBar
            name={name}
            setName={setName}
            loading={loading}
            onEnter={() => handleSearch(0)} // ✅ ค้นหาเมื่อกด Enter
          />
        </div>

        {error && <p className="text-red-400 text-center mt-4">{error}</p>}

        {profiles.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-6 items-stretch">
          {profiles.map((profile) => (
            <div key={profile.id} className="w-full sm:w-1/2 lg:w-1/3 max-w-xs">
              <ProfileCard profile={profile} />
            </div>
          ))}
        </div>
        )}

        {profiles.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <PaginationControls
              page={page}
              totalPages={totalPages}
              handleSearch={handleSearch}
              maxVisible={maxVisible}
            />
          </div>
        )}
      </div>

      {/* ✅ Loading Overlay */}
      <LoadingOverlay show={loading} />

      {/* ✅ Footer */}
      <Footer />
    </div>

    
  );
}
