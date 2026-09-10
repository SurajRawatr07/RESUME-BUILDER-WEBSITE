import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  Github,
  Linkedin,
  FileText,
  Clock,
  Sparkles,
  Edit3,
  Check,
  X,
  ArrowLeft,
  ShieldCheck,
  Award,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ProfileDropdown from "@/components/ui/ProfileDropdown";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProfilePageProps {
  onBackToDashboard: () => void;
  onNavigateToEditor: () => void;
}

export default function ProfilePage({
  onBackToDashboard,
  onNavigateToEditor,
}: ProfilePageProps) {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(user?.name || "");
  const [title, setTitle] = useState(user?.title || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [skillsText, setSkillsText] = useState(
    (user?.skills || []).join(", ")
  );
  const [linkedin, setLinkedin] = useState(user?.linkedin || "");
  const [github, setGithub] = useState(user?.github || "");
  const [portfolio, setPortfolio] = useState(user?.portfolio || "");

  if (!user) {
    return null;
  }

  const handleStartEditing = () => {
    setName(user.name);
    setTitle(user.title || "");
    setPhone(user.phone || "");
    setLocation(user.location || "");
    setBio(user.bio || "");
    setAvatar(user.avatar || "");
    setSkillsText((user.skills || []).join(", "));
    setLinkedin(user.linkedin || "");
    setGithub(user.github || "");
    setPortfolio(user.portfolio || "");
    setErrorMessage(null);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setErrorMessage(null);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage("Full Name is required.");
      return;
    }

    setIsSaving(true);

    const parsedSkills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const success = await updateProfile({
      name: trimmedName,
      title: title.trim(),
      phone: phone.trim(),
      location: location.trim(),
      bio: bio.trim(),
      avatar: avatar.trim(),
      skills: parsedSkills,
      linkedin: linkedin.trim(),
      github: github.trim(),
      portfolio: portfolio.trim(),
    });

    setIsSaving(false);

    if (success) {
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } else {
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  const initials = getInitials(user.name);

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100 transition-colors duration-200"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-gray-900/85 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="profile-back-button"
              onClick={onBackToDashboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 pl-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-700 to-indigo-900 text-white flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">
                Resume Builder Profile
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ProfileDropdown
              onNavigateToProfile={() => {}}
              onNavigateToDashboard={onBackToDashboard}
              onNavigateToEditor={onNavigateToEditor}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Success Banner */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 shadow-sm"
            >
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <p className="text-sm font-semibold">
                Your profile has been saved successfully!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-800 dark:text-red-300 shadow-sm">
            <X className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            <p className="text-sm font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex items-center justify-center font-bold text-2xl bg-gradient-to-tr from-indigo-700 to-indigo-900 text-white shadow-md ring-4 ring-indigo-500/20 shrink-0">
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

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified User
                  </span>
                </div>

                <p className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                  {user.title || "Career Professional"}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                  {user.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </span>
                  )}
                  {user.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4" />
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Edit / Action Buttons */}
            <div>
              {!isEditing ? (
                <Button
                  onClick={handleStartEditing}
                  id="edit-profile-btn"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-5 py-2.5 font-semibold text-sm shadow-sm transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCancelEditing}
                    variant="outline"
                    className="flex items-center gap-1.5 rounded-xl border-gray-300 dark:border-gray-700 text-sm font-semibold"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editing Mode Form */}
        {isEditing ? (
          <form
            onSubmit={handleSaveChanges}
            className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-6 mb-8"
          >
            <h2 className="text-xl font-bold border-b border-gray-100 dark:border-gray-800 pb-3">
              Edit Account Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Professional Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Profile Photo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Leave blank to automatically use clean, personalized initials.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Career Summary / Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief overview of your background and career goals..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Product Management, Python..."
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  GitHub URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Portfolio / Personal Website
                </label>
                <input
                  type="url"
                  placeholder="https://mywebsite.com"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEditing}
                className="rounded-xl border-gray-300 dark:border-gray-700 text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                id="save-profile-btn"
                disabled={isSaving}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : null}

        {/* Profile Details Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Professional Bio, Skills, Social Links */}
          <div className="lg:col-span-2 space-y-8">
            {/* Career Summary / Bio */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-7 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Career Summary
              </h2>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {user.bio ||
                  "No career summary specified yet. Click 'Edit Profile' to add your bio and summary."}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-7 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Key Skills & Competencies
              </h2>
              {user.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200/80 dark:border-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No skills listed yet. Add skills through the edit profile button.
                </p>
              )}
            </div>

            {/* Professional Links */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-7 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Professional Links
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {user.linkedin ? (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 bg-gray-50/50 dark:bg-gray-800/50 text-xs font-bold text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate">LinkedIn Profile</span>
                  </a>
                ) : (
                  <div className="p-3 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-xs text-gray-400">
                    LinkedIn: Not linked
                  </div>
                )}

                {user.github ? (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 bg-gray-50/50 dark:bg-gray-800/50 text-xs font-bold text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    <Github className="w-4 h-4 text-gray-900 dark:text-white shrink-0" />
                    <span className="truncate">GitHub Profile</span>
                  </a>
                ) : (
                  <div className="p-3 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-xs text-gray-400">
                    GitHub: Not linked
                  </div>
                )}

                {user.portfolio ? (
                  <a
                    href={user.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 bg-gray-50/50 dark:bg-gray-800/50 text-xs font-bold text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Portfolio Site</span>
                  </a>
                ) : (
                  <div className="p-3 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-xs text-gray-400">
                    Portfolio: Not linked
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Resume Account Stats */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-7 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Resume Information
              </h2>

              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    Total Resumes
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {user.totalResumes ?? 1}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    Latest Resume
                  </span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 truncate block">
                    {user.latestResume || "Primary_Resume.pdf"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Last Updated
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {user.lastUpdated || "Recently"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-2 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Resume Templates Used
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(user.templatesUsed || ["Modern", "Professional"]).map(
                      (tmpl, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                        >
                          {tmpl}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Resume Action */}
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                <Button
                  onClick={onNavigateToEditor}
                  className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 shadow-sm"
                >
                  Open Resume Editor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
