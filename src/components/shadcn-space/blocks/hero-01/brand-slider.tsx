import { motion } from "framer-motion";
import { Marquee } from "@/components/shadcn-space/animations/marquee";

export interface BrandList {
  image: string;
  name: string;
  lightimg: string;
}

export interface BrandSliderProps {
  brandList: BrandList[];
  title?: string;
}

function BrandSlider({ brandList, title }: BrandSliderProps) {
  if (!brandList || brandList.length === 0) {
    return null;
  }

  return (
    <section aria-label="Featured partners">
      <div className="py-6 md:py-10">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
            className="flex flex-col gap-3"
          >
            {title && (
              <div className="flex justify-center text-center py-3 md:py-4 relative">
                <div className="flex items-center justify-center gap-4">
                  <div className="hidden md:block h-0.5 w-40 bg-gradient-to-l from-muted-foreground to-white dark:from-muted-foreground dark:to-transparent opacity-20" />
                  <p className="text-sm font-normal sm:px-2 px-10 text-muted-foreground text-center">
                    {title}
                  </p>
                  <div className="hidden md:block h-0.5 w-40 bg-gradient-to-r from-muted-foreground to-white dark:from-muted-foreground dark:to-transparent opacity-20" />
                </div>
              </div>
            )}

            <div className="py-4">
              <Marquee pauseOnHover className="[--duration:20s] p-0">
                {brandList.map((brand, index) => (
                  <div key={index} className="flex items-center">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-36 h-8 mr-6 lg:mr-20 dark:hidden object-contain"
                    />
                    <img
                      src={brand.lightimg}
                      alt={brand.name}
                      className="hidden dark:block w-36 h-8 mr-12 lg:mr-20 object-contain"
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default BrandSlider;
