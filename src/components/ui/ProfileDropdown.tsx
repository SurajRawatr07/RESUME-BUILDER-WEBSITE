import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FileText,
  FilePlus,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";

interface ProfileDropdownProps {
  onNavigateToProfile?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToEditor?: () => void;
  onNavigateToSettings?: () => void;
  className?: string;
}

export default function ProfileDropdown({
  onNavigateToProfile,
  onNavigateToDashboard,
  onNavigateToEditor,
  onNavigateToSettings,
  className = "",
}: ProfileDropdownProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const initials = getInitials(user.name);

  const handleAction = (callback?: () => void) => {
    setIsOpen(false);
    if (callback) {
      callback();
    }
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left select-none ${className}`}
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      {/* Profile Trigger Button */}
      <button
        type="button"
        id="profile-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open profile menu"
        className="flex items-center gap-2 sm:gap-2.5 px-2.5 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm"
      >
        {/* Avatar / Initials */}
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs bg-gradient-to-tr from-indigo-700 to-indigo-900 text-white shadow-sm ring-2 ring-indigo-500/20 shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* User Name */}
        <span className="hidden md:inline-block text-xs font-bold text-gray-800 dark:text-gray-200 max-w-[130px] truncate tracking-wide">
          {user.name}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Kokonut-style Profile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header: User Information */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-slate-50/70 dark:bg-gray-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm bg-gradient-to-tr from-indigo-700 to-indigo-900 text-white shadow-md ring-2 ring-indigo-500/30 shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {user.email}
                  </p>
                  {user.title && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
                      {user.title}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Actions */}
            <div className="p-2 space-y-1">
              <button
                type="button"
                id="menu-item-profile"
                onClick={() => handleAction(onNavigateToProfile)}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <span>Profile</span>
              </button>

              <button
                type="button"
                id="menu-item-my-resumes"
                onClick={() => handleAction(onNavigateToDashboard)}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <span>My Resumes</span>
              </button>

              <button
                type="button"
                id="menu-item-create-resume"
                onClick={() => handleAction(onNavigateToEditor)}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 shrink-0">
                  <FilePlus className="w-4 h-4" />
                </div>
                <span>Create Resume</span>
              </button>

              <button
                type="button"
                id="menu-item-settings"
                onClick={() => handleAction(onNavigateToSettings || onNavigateToProfile)}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 shrink-0">
                  <Settings className="w-4 h-4" />
                </div>
                <span>Settings</span>
              </button>
            </div>

            {/* Logout Divider & Button */}
            <div className="p-2 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                id="menu-item-logout"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
