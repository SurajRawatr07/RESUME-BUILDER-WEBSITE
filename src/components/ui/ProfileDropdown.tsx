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
    >
      {/* Profile Trigger Button */}
      <button
        type="button"
        id="profile-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`User profile for ${user.name}`}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-[rgba(17,17,17,0.10)] dark:border-[rgba(255,255,255,0.12)] bg-neutral-100/70 dark:bg-neutral-800/70 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 shadow-xs cursor-pointer select-none shrink-0"
      >
        {/* Avatar / Initials (30px compact) */}
        <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex items-center justify-center font-bold text-xs bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs shrink-0">
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

        {/* User Name (13–14px, compact & graceful truncation) */}
        <span className="inline-block text-[13px] md:text-[13.5px] font-medium text-[#111111] dark:text-white max-w-[80px] md:max-w-[95px] lg:max-w-[110px] truncate whitespace-nowrap">
          {user.name}
        </span>

        {/* Chevron Dropdown Arrow */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Profile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl bg-[#FFFFFF] dark:bg-[#111111] border border-[rgba(17,17,17,0.10)] dark:border-[rgba(255,255,255,0.12)] shadow-2xl z-50 overflow-hidden"
          >
            {/* Header: User Information */}
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shrink-0 shadow-xs">
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
                  <p className="text-sm font-bold text-[#111111] dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {user.email}
                  </p>
                  {user.title && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
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
