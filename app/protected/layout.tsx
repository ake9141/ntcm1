'use client'; // This directive is crucial for client-side interactivity and hooks like useRouter

import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, Home, Settings, Users, Package, LogOut, UserCircle, Menu } from "lucide-react"; // Added Menu icon for mobile toggle
import Image from "next/image"; // For user avatar
import { useRouter } from 'next/navigation'; // For client-side navigation
import { useState } from 'react'; // For managing sidebar toggle state
import { AuthButton } from "@/components/auth-button";


export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility on mobile

  // Example user data (replace with actual user data from your auth system)
  const currentUser = {
    name: "Admin John",
    email: "admin.john@example.com",
    avatarUrl: "https://placehold.co/30x30/aabbcc/ffffff?text=AJ", // Placeholder image with initials
  };

  const adminNavigation = [
    { name: "หน้าหลัก", href: "/admin/dashboard", icon: Home },
    { name: "ผู้ใช้งาน", href: "/admin/users", icon: Users },
    { name: "สินค้า", href: "/admin/products", icon: Package },
    { name: "ตั้งค่า", href: "/admin/settings", icon: Settings },
  ];

  // Function for signing out (connect to your actual auth system)
  const handleSignOut = async () => {
    // In a real application, you'd integrate with your authentication service, e.g.:
    // const { error } = await supabase.auth.signOut();
    // if (error) {
    //   console.error("Error signing out:", error);
    //   // Display a user-friendly error message
    // } else {
    //   router.push('/login'); // Redirect to login page after successful sign out
    // }
    alert("คุณได้ออกจากระบบแล้ว!"); // Temporary alert for demonstration
    router.push('/login'); // Redirect to a login page (ensure this path exists)
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900"> {/* Main horizontal flex container */}
      {/* Sidebar Navigation */}
      {/* On small screens, sidebar is fixed and slides in/out */}
      {/* On medium screens and up, sidebar is a flex item, always visible */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-md p-4 flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex md:relative md:flex-shrink-0`}>
        <div className="mb-8 flex justify-between items-center md:block">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-xl font-bold transition-colors">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-indigo-500" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="currentColor" fillOpacity="0.1"/>
              <path d="M7 17V7h10v10H7zm2-8v6h6V9H9z" fill="currentColor"/>
            </svg>
            Indigo แอดมิน
          </Link>
          {/* Close button for mobile sidebar */}
          <button
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {adminNavigation.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto flex flex-col gap-4 border-t pt-4">
          <ThemeSwitcher />
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area (Toolbar + Page Content + Footer) - This will take remaining horizontal space */}
      <main className="flex-1 flex flex-col"> {/* This main is now a vertical flex container */}
        {/* Top Navbar for Admin (now part of the right-hand content area) */}
        <header className="w-full flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-b-foreground/10 h-16">
          {/* Hamburger menu for mobile - only visible if sidebar is closed */}
          {/* The hamburger menu is moved here to be part of the right-hand toolbar */}
          <button
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Breadcrumbs (You can add logic here to display current path) */}
          <div className="flex items-center gap-3 ml-4 md:ml-0"> {/* Adjusted ml-4 for mobile spacing */}
            <span className="text-gray-500 dark:text-gray-400">หน้าหลัก</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">ภาพรวมระบบ</span>
          </div>

          {/* Right-aligned Toolbar */}
          <div className="flex items-center gap-4">
               {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            <DeployButton />

            {/* User Profile and Sign Out Dropdown/Button */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {currentUser.avatarUrl ? (
                  <Image
                    src={currentUser.avatarUrl}
                    alt="User Avatar"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                ) : (
                  <UserCircle className="w-7 h-7" />
                )}
                <span className="font-medium hidden md:block">{currentUser.name}</span> {/* Hide name on small screens */}
              </button>
              {/* Dropdown Menu for Sign Out */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-6 bg-white dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            ขับเคลื่อนโดย{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline text-indigo-600 dark:text-indigo-400"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
