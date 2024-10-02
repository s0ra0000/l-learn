"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MdSpaceDashboard,
  MdOutlineFormatListBulleted,
  MdQuiz,
  MdMenu,
} from "react-icons/md";
import { BsFillFolderFill } from "react-icons/bs";
import { IoLogOutSharp, IoCloseSharp } from "react-icons/io5";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Helper function to determine if a link is active for exact paths
  const isActive = (link: string) => pathname === link;

  // Helper function to determine if a dynamic link is active (e.g., quiz or folder by ID)
  const isDynamicActive = (linkPrefix: string) =>
    pathname?.startsWith(linkPrefix);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Button to open sidebar */}
      {!isSidebarOpen && (
        <button
          className="absolute top-5 left-4 text-white z-50 md:hidden text-secondary"
          onClick={toggleSidebar}
        >
          <MdMenu className="text-3xl text-secondary" />
        </button>
      )}

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 w-[250px] bg-secondary text-white min-h-screen px-4 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:static md:w-[200px] z-40`}
      >
        <div className="w-full text-[32px] py-4 flex justify-between items-center">
          <h1>L-Learn</h1>
          {isSidebarOpen && (
            <button
              className="text-white text-3xl md:hidden"
              onClick={toggleSidebar}
            >
              <IoCloseSharp />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-8 mt-4 text-[16px]">
          <div
            onClick={toggleSidebar}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isActive("/dashboard") ? "bg-white text-secondary" : ""
            }`}
          >
            <MdSpaceDashboard className="text-[24px]" />
            <Link href="/dashboard">Dashboard</Link>
          </div>
          <div
            onClick={toggleSidebar}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isActive("/dashboard/words") ? "bg-white text-secondary" : ""
            }`}
          >
            <MdOutlineFormatListBulleted className="text-[24px]" />
            <Link href="/dashboard/words">Word list</Link>
          </div>
          <div
            onClick={toggleSidebar}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isDynamicActive("/dashboard/folder")
                ? "bg-white text-secondary"
                : ""
            }`}
          >
            <BsFillFolderFill className="text-[24px]" />
            <Link href="/dashboard/folders">Folders</Link>
          </div>
          <div
            onClick={toggleSidebar}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isDynamicActive("/dashboard/quiz")
                ? "bg-white text-secondary"
                : ""
            }`}
          >
            <MdQuiz className="text-[24px]" />
            <Link href="/dashboard/quizzes">Quiz</Link>
          </div>
          <div className="flex items-center gap-2 mt-8" onClick={toggleSidebar}>
            <IoLogOutSharp className="text-[24px]" />
            <LogoutLink>Sign out</LogoutLink>
          </div>
        </div>
      </nav>

      {/* Overlay for when the sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
