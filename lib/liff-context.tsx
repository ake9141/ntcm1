"use client";

import { createContext, useEffect, useState, useContext } from "react";
import liff from "@line/liff";

interface LiffContextType {
  liffObject: typeof liff | null;
  profile: {
    userId: string;
    displayName: string;
    pictureUrl: string;
  } | null;
}

const LiffContext = createContext<LiffContextType>({
  liffObject: null,
  profile: null,
});

export const LiffProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<LiffContextType["profile"]>(null);

  useEffect(() => {
    const initLiff = async () => {
      await liff.init({ liffId: "YOUR_LIFF_ID" }); // 🔁 เปลี่ยน liffId ให้ตรงของคุณ
      if (!liff.isLoggedIn()) liff.login();
      const userProfile = await liff.getProfile();
      setProfile({
        userId: userProfile.userId,
        displayName: userProfile.displayName,
        pictureUrl: userProfile.pictureUrl || "",
      });
    };
    initLiff();
  }, []);

  return (
    <LiffContext.Provider value={{ liffObject: liff, profile }}>
      {children}
    </LiffContext.Provider>
  );
};

export const useLiff = () => useContext(LiffContext);