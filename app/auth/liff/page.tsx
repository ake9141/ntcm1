import { LiffProvider } from "@/lib/liff-context";
import { SignUpForm } from "@/components/sign-up-form";
import "../../globals.css";

import { useLiff } from "@/lib/liff-context";

export default function Page() {
  const { profile } = useLiff();

  if (!profile) return <div>Loading...</div>;

  return (
    <LiffProvider>
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
    </LiffProvider>
  );
}