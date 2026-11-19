import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateType } from "@/types/resume";

export type AvatarList = {
  image?: string;
  label: string;
  key: "templates" | "ats" | "editor" | "export";
};

export interface HeroSectionProps {
  avatarList?: AvatarList[];
  onStartBuilding?: (templateId?: TemplateType) => void;
  onExploreTemplates?: () => void;
}

function HeroSection({
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

              {/* Hero Actions */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                {/* Primary & Secondary CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-3.5">
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
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
