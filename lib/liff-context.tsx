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
  isLoading: boolean;
  error: string | null;
}

const LiffContext = createContext<LiffContextType>({
  liffObject: null,
  profile: null,
  isLoading: true,
  error: null,
});

export const LiffProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<LiffContextType["profile"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError("Failed to initialize LIFF");
      } finally {
        setIsLoading(false);
      }
    };
    initLiff();
  }, []);

  return (
    <LiffContext.Provider value={{ liffObject: liff, profile, isLoading, error }}>
      {children}
    </LiffContext.Provider>
  );
};

export const useLiff = () => useContext(LiffContext);