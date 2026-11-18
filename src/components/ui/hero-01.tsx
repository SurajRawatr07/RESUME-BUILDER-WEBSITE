import HeroSection, {
  type AvatarList,
} from "@/components/shadcn-space/blocks/hero-01/hero";
import Header, {
  type NavigationSection,
} from "@/components/shadcn-space/blocks/hero-01/header";
import BrandSlider, {
  type BrandList,
} from "@/components/shadcn-space/blocks/hero-01/brand-slider";
import { TemplateType } from "@/types/resume";

export const avatarList: AvatarList[] = [
  {
    key: "templates",
    label: "Role-Specific Resume Templates",
  },
  {
    key: "ats",
    label: "ATS Score Analysis",
  },
  {
    key: "editor",
    label: "Live Resume Editing",
  },
  {
    key: "export",
    label: "PDF & DOCX Export",
  },
];

export const navigationData: NavigationSection[] = [
  {
    title: "Home",
    href: "#home",
    isActive: true,
  },
  {
    title: "How It Works",
    href: "#how-it-works",
  },
  {
    title: "Templates",
    href: "#templates",
  },
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "FAQ",
    href: "#faq",
  },
];

// Genuine brand assets only; left empty so no fake partner logos are rendered.
export const brandList: BrandList[] = [];

export interface HeroOneProps {
  onStartBuilding?: (templateId?: TemplateType) => void;
  onNavigateToLogin?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToProfile?: () => void;
  onScrollTo?: (href: string) => void;
  customNavigationData?: NavigationSection[];
  customBrandList?: BrandList[];
}

export function HeroOne({
  onStartBuilding,
  onNavigateToLogin,
  onNavigateToDashboard,
  onNavigateToProfile,
  onScrollTo,
  customNavigationData,
  customBrandList,
}: HeroOneProps) {
  const scrollToTemplates = () => {
    if (onScrollTo) {
      onScrollTo("#templates");
    } else {
      document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <Header
        navigationData={customNavigationData || navigationData}
        onStartBuilding={onStartBuilding}
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToProfile={onNavigateToProfile}
        onScrollTo={onScrollTo}
      />
      <HeroSection
        avatarList={avatarList}
        onStartBuilding={onStartBuilding}
        onExploreTemplates={scrollToTemplates}
      />
      <BrandSlider brandList={customBrandList ?? brandList} />
    </div>
  );
}

export { HeroSection, Header, BrandSlider };
export type { AvatarList, NavigationSection, BrandList };
export default HeroOne;
