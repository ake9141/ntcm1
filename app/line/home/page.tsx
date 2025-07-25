import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import avartar from "@/public/images/avartar.png"; // Default avatar image

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const user = data.user;

  return (
    
    
    <div className="flex flex-col items-center gap-6 p-6 text-center">
      {/* Avatar */}
      <Image
        src={avartar} // Replace with the actual avatar URL from user.user_metadata
        alt="User Avatar"
        width={100}
        height={100}
        className="rounded-full border border-gray-300"
      />

      {/* Name and Email */}
      <div>
        <h2 className="text-2xl font-bold text-blue-600">
          {user.user_metadata?.name || "ไม่ระบุชื่อ"}
        </h2>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-xs text-gray-400 mt-1">UID: {user.id}</p>
      </div>

      {user.user_metadata && (
        <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl px-6 py-5 mb-10 shadow-sm">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            🔍 ข้อมูลบัญชีผู้ใช้
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {Object.entries(user.user_metadata).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-500 dark:text-gray-400 capitalize tracking-wide">
                  {key}
                </span>
                <span className="text-black dark:text-white font-medium max-w-[60%] text-right truncate">
                  {typeof value === "string" ? value : JSON.stringify(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
