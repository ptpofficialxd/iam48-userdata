"use client";

import { useEffect, useState } from "react";
import { Github, X } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

export function Footer() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (!error) setUserCount(count || 0);
    };

    fetchCount();
  }, []);

  return (
    <footer className="w-full border-t border-gray-700 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between p-6 text-gray-400 text-sm">
        {/* Left: Credit */}
        <p className="mb-4 md:mb-0">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-200">ptpofficialxd</span>.{" "}
          All rights reserved.
          {userCount !== null && (
            <span className="ml-2 text-gray-400">
              | iAM48 users in database:{" "}
              <span className="font-semibold text-gray-200">
                {userCount.toLocaleString()}
              </span>
            </span>
          )}
        </p>

        {/* Right: Social links */}
        <div className="flex gap-4">
          <a
            href="https://x.com/ptpofficialxd"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-800 transition"
            aria-label="Twitter/X"
          >
            <X className="w-5 h-5 text-gray-300 hover:text-sky-400" />
          </a>
          <a
            href="https://github.com/ptpofficialxd"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-800 transition"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5 text-gray-300 hover:text-white" />
          </a>
        </div>
      </div>
    </footer>
  );
}
