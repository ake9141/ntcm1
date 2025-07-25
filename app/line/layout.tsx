// app/lift/layout.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Image from "next/image"
import { X } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server";

export default async function LiftLayout({ children }: { children: React.ReactNode }) {
  // จำลอง user จาก cookies หรือ database
const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const user = data.user;


  const isLoggedIn = true // หรือดึงจาก cookie/session
  if (!isLoggedIn) redirect('/')

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Header รูปภาพ */}
      <div className="relative">
        <Image
          src="https://cdn.vectorstock.com/i/2000v/06/02/electro-automobile-refuels-accumulator-vector-55600602.avif"
          alt="EV Car"
          width={800}
          height={300}
          className="w-full h-48 object-cover"
        />
        <Link
          href="/"
          className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white"
        >
          <X className="w-5 h-5" />
        </Link>
        <span className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-0.5 text-xs rounded">
          OPEN till 22:30
        </span>
      </div>

      {/* ข้อมูลระบบสมาชิก */}
     <header className="flex flex-col gap-1 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
  <h1 className="text-lg font-bold text-blue-600">{user.user_metadata?.name || "ผู้ใช้งานไม่ระบุชื่อ"}</h1>
  
  <p className="text-sm text-gray-600">
    {user.user_metadata?.neta_membership_id
      ? `รหัสสมาชิก NETA: ${user.user_metadata.neta_membership_id}`
      : "ยังไม่ได้ลงทะเบียนสมาชิก NETA"}
  </p>

  <p className="text-sm text-gray-500">
    สถานะการเป็นสมาชิก:{" "}
    <span className={user.user_metadata?.is_neta_member ? "text-green-600" : "text-red-500"}>
      {user.user_metadata?.is_neta_member ? "เป็นสมาชิก" : "ไม่เป็นสมาชิก"}
    </span>
  </p>

  {user.user_metadata?.ppda_consent_given && (
    <div className="text-sm text-gray-500">
      ✅ ให้ความยินยอมตาม PDPA แล้วเมื่อ{" "}
      <span className="text-blue-600">
        {new Date(user.user_metadata.ppda_consent_timestamp).toLocaleDateString("th-TH")}
      </span>
    </div>
  )}

  <div className="flex items-center gap-2 text-sm mt-1">
    <span className="text-indigo-600 font-medium">UID:</span>
    <span className="text-gray-400 truncate">{user.id}</span>
    <button className="ml-auto text-blue-500 text-sm">ดูรายละเอียดทั้งหมด</button>
  </div>
</header>

      {/* ข่าวสารจาก NETA */}
      <div className="flex items-center justify-between p-4 bg-yellow-50 text-yellow-700 text-sm">
        <div>
          <p className="font-medium">📢 ข่าวสารจากเครือข่ายผู้บริโภค</p>
          <p className="text-xs">ติดตามสถานะการร้องเรียน กรณีรถ EV NETA</p>
        </div>
        <Link href="/complaints" className="bg-yellow-600 text-white px-3 py-1 rounded">
          ดู
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b text-sm font-medium">
        {["โปรไฟล์", "ร้องเรียน"].map((tab, index) => (
          <button
            key={tab}
            className={`px-4 py-2 whitespace-nowrap border-b-2 ${index === 0 ? "border-black" : "border-transparent text-gray-500"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        {children}
      </main>
       {/* Footer Checkout */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
                 </div>
        <button className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold">
        บันทึกข้อมูล
        </button>
      </footer>
    </div>
   
  )
}