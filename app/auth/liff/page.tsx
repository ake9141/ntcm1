"use client";

import { LiffProvider } from "@/lib/liff-context";
import { SignUpForm } from "@/components/sign-up-form";
import "../../globals.css";

import liff from "@line/liff";
import { useEffect, useState } from "react";

export default function Page() {

  const [profile, setProfile] = useState<{
    userId: string;
    displayName: string;
    pictureUrl: string;
  } | null>(null);


  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: "2007818124-WopDJgx5" });
        console.log("LIFF init passed");
        if (!liff.isLoggedIn()) {
          liff.login();
          return; // รอ redirect กลับมาหลัง login เสร็จ
        }
        const userProfile = await liff.getProfile();
        setProfile({
          userId: userProfile.userId,
          displayName: userProfile.displayName,
          pictureUrl: userProfile.pictureUrl || "",
        });
      } catch (e) {
        console.error("LIFF init error", e);
       
      } finally {
       
      }
    };
    initLiff();
  }, []);


  if (!profile) {
    return <div>Loading LIFF profile...</div>;
  }

  return (
    
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <form className="space-y-4 bg-white p-6 rounded-xl shadow">
      <div className="text-center">
        <img
          src={profile.pictureUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full mx-auto"
        />
        <p className="mt-2 text-lg font-bold">{profile.displayName}</p>
      </div>

      <input
        type="text"
        name="userId"
        readOnly
        value={profile.userId}
        className="w-full rounded border px-3 py-2 bg-gray-100"
      />

       <input
        type="text"
        name="displayName"
        placeholder="Your Name"
         value={profile.displayName}
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="email"
        name="email"
        placeholder="Your email"
        className="w-full rounded border px-3 py-2"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        สมัครใช้งาน
      </button>
    </form>
        </div>
      </div>
   
  );
}