import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Code2, FileCheck2, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateType } from "@/types/resume";

export type AvatarList = {
  image?: string;
  label: string;
  key: "templates" | "ats" | "editor" | "export";
};

export interface HeroSectionProps {
  avatarList: AvatarList[];
  onStartBuilding?: (templateId?: TemplateType) => void;
  onExploreTemplates?: () => void;
}

const badgeIcons = {
  templates: Layers,
  ats: FileCheck2,
  editor: Code2,
  export: Sparkles,
};

function HeroSection({
  avatarList,
  onStartBuilding,
  onExploreTemplates,
}: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="border-b border-black/[0.06] dark:border-white/[0.08]"
    >
      <div className="w-full h-full relative overflow-hidden">
        <div className="relative w-full pt-10 md:pt-20 pb-12 md:pb-16 before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-sky-100 before:via-white before:to-amber-100 before:rounded-full before:top-24 before:blur-3xl before:-z-10 dark:before:from-slate-800 dark:before:via-black dark:before:to-stone-700 dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col max-w-5xl mx-auto gap-8">
              {/* Hero Heading & Supporting Copy */}
              <div className="relative flex flex-col text-center items-center sm:gap-6 gap-4">
                <motion.h1
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-[5rem] font-medium leading-[1.12] md:leading-[1.08] tracking-tight text-foreground"
                  style={{
                    fontFamily:
                      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  Build a professional resume{" "}
                  <span
                    className="italic font-normal tracking-tight"
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                    }}
                  >
                    that gets noticed.
                  </span>
                </motion.h1>

                <motion.p
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                  className="text-base sm:text-lg font-normal max-w-2xl text-muted-foreground leading-relaxed"
                >
                  Create a recruiter-ready, ATS-compliant resume in minutes without design friction.
                </motion.p>
              </div>

              {/* Hero Actions & Genuine Resume Craft Feature Stack */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                className="flex items-center flex-col md:flex-row justify-center gap-6 md:gap-8"
              >
                {/* Primary & Secondary CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    id="hero-create-resume-btn"
                    type="button"
                    onClick={() => onStartBuilding?.()}
                    className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer"
                  >
                    <span className="relative z-10 transition-all duration-500 whitespace-nowrap">
                      Create Resume
                    </span>
                    <span className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                      <ArrowUpRight size={16} />
                    </span>
                  </Button>

                  {onExploreTemplates && (
                    <Button
                      id="hero-explore-templates-btn"
                      type="button"
                      variant="outline"
                      onClick={onExploreTemplates}
                      className="h-12 px-6 rounded-full text-sm font-medium border-border bg-background/80 hover:bg-muted text-foreground transition-colors cursor-pointer"
                    >
                      Explore Templates
                    </Button>
                  )}
                </div>

                {/* Overlapping Visual Stack (Hero-01 avatar arrangement using genuine Resume Craft capability badges) */}
                <div className="flex items-center sm:gap-5 gap-3">
                  <ul
                    className="avatar flex flex-row items-center"
                    aria-label="Resume Craft core capabilities"
                  >
                    {avatarList.map((avatar, index) => {
                      const BadgeIcon = badgeIcons[avatar.key];
                      return (
                        <li
                          key={avatar.label}
                          title={avatar.label}
                          className={`relative -mr-2.5 last:mr-0 z-10 transition-transform duration-200 hover:-translate-y-0.5 hover:z-20`}
                          style={{ zIndex: avatarList.length - index }}
                        >
                          {avatar.image ? (
                            <img
                              src={avatar.image}
                              alt={avatar.label}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full border-2 border-background object-cover shadow-sm"
                            />
                          ) : (
                            <span
                              className="w-10 h-10 rounded-full border-2 border-background bg-muted text-foreground flex items-center justify-center shadow-sm"
                              aria-label={avatar.label}
                            >
                              <BadgeIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  <div className="gap-0.5 flex flex-col items-start text-left">
                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      ATS-Compliant Builder
                    </p>
                    <p className="text-xs font-normal text-muted-foreground">
                      Overleaf &amp; LaTeX-inspired • Instant PDF
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
