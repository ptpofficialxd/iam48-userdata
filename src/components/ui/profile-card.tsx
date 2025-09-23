import type { UserProfile } from "../../type/user";

export function ProfileCard({ profile }: { profile: UserProfile }) {
  const spent = profile.totalGiftAmount || 0;
  const isT1 = spent >= 50000 && spent < 100000;   // ⭐ 50k–99,999
  const isT2 = spent >= 100000 && spent < 500000;  // 🔥 100k–499,999
  const isT3 = spent >= 500000;                    // 👑 500k+
  const hasCover = Boolean(profile.coverImageUrl);
  const isDev = profile.id === 174797;             // ✅ Developer ID

  return (
    <div
      className={`relative h-full flex flex-col rounded-xl shadow-lg p-6 text-center transition transform hover:scale-105 hover:shadow-xl overflow-hidden ${
        hasCover ? "" : "bg-gray-800"
      }`}
      style={
        hasCover
          ? {
              backgroundImage: `url(${profile.coverImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {/* Overlay เฉพาะถ้ามี cover */}
      {hasCover && <div className="absolute inset-0 bg-black/80" />}

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Avatar + Badge */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          {isDev ? (
            <div className="relative w-24 h-24">
              {/* 🔥 กรอบ gradient หมุนช้า */}
              <div className="absolute inset-0 rounded-full p-[5px] bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 animate-spin-slow"></div>

              {/* วงกลมด้านใน */}
              <div className="absolute inset-[5px] rounded-full overflow-hidden bg-gray-900 shadow-lg shadow-purple-500/40">
                <img
                  src={profile.profileImageUrl}
                  alt={profile.displayName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          ) : (
            <img
              src={profile.profileImageUrl}
              alt={profile.displayName}
              className={`w-24 h-24 rounded-full object-cover ring-2 ${
                isT3
                  ? "border-4 border-yellow-400 ring-yellow-300" // 👑 กรอบทอง
                  : isT2
                  ? "border-4 border-red-500 ring-red-400"      // 🔥 กรอบแดง
                  : "border-4 border-blue-500 ring-blue-400"     // ⭐/ปกติ
              }`}
            />
          )}

          {/* ⭐ Tier 1 */}
          {isT1 && (
            <img
              src="https://i.pinimg.com/originals/70/7c/21/707c21db7365fce68ef9e059f5824626.gif"
              alt="star badge"
              className="absolute -top-1.5 -right-3.5 w-11 h-11 pointer-events-none"
            />
          )}

          {/* 🔥 Tier 2 */}
          {isT2 && (
            <img
              src="https://cdn.pixabay.com/animation/2025/06/26/05/26/05-26-59-506_512.gif"
              alt="fire badge"
              className="absolute -top-2.5 -right-3 w-10 h-10 pointer-events-none"
            />
          )}

          {/* 👑 Tier 3 */}
          {isT3 && (
            <img
              src="https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUycnp0OTVydWtvb3Y5Z2FjYzVxN3FqM3hybWo3aXR2NTJkMXR0M2lzNCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/bHHUYJlqm1KQnVVdIi/source.gif"
              alt="crown badge"
              className="absolute -top-6 left-12.5 -translate-x-1/2 w-12 h-12 transform rotate-22 pointer-events-none"
            />
          )}

          {/* 🚀 Dev */}
          {isDev && (
            <img
              src="https://img5.pic.in.th/file/secure-sv1/https___thepracticaldev.s3.amazonaws.com_i_90l6yftawx9kbiqyejlu-ezgif.com-crop.gif"
              alt="dev badge"
              className="absolute -top-3.5 -right-32 -translate-x-1/2 w-14 h-6 pointer-events-none"
            />
          )}
        </div>

        {/* Info */}
        <h2 className="text-xl font-semibold">{profile.displayName}</h2>
        <p className="text-xs text-gray-300">{profile.id}</p>
        <p className="text-xs text-gray-300 font-bold mt-2 mb-4 line-clamp-2">
          {profile.caption || "—"}
        </p>

        {/* Stats */}
        <div className="mt-auto space-y-2 text-sm">
          <div className="flex justify-between text-pink-400 font-extrabold">
            <span>[💕] Oshi Members:</span>
            <span>{profile.totalFollowing}</span>
          </div>
          <div className="flex justify-between text-green-400 font-extrabold">
            <span>[💸] Cookies Spent:</span>
            <span>{profile.totalGiftAmount}</span>
          </div>
          <div className="flex justify-between text-yellow-400 font-extrabold">
            <span>[🥠] Cookies Balance:</span>
            <span>{profile.spendableBalance ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
