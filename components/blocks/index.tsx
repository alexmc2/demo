// components/blocks/index.tsx
import { PAGE_QUERYResult } from "@/sanity.types";
import Hero1 from "@/components/blocks/hero/hero-1";
import Hero2 from "@/components/blocks/hero/hero-2";
import HeroFull from "@/components/blocks/hero/hero-full";
import SectionHeader from "@/components/blocks/section-header";
import LottieAnimationBlock from "@/components/blocks/lottie-animation";
import SplitRow from "@/components/blocks/split/split-row";
import GridRow from "@/components/blocks/grid/grid-row";
import Carousel1 from "@/components/blocks/carousel/carousel-1";
import Carousel2 from "@/components/blocks/carousel/carousel-2";
import ReviewsCarousel from "@/components/blocks/reviews/reviews-carousel";
import TimelineRow from "@/components/blocks/timeline/timeline-row";
import Cta1 from "@/components/blocks/cta/cta-1";
import LogoCloud1 from "@/components/blocks/logo-cloud/logo-cloud-1";
import FAQs from "@/components/blocks/faqs";
import FormNewsletter from "@/components/blocks/forms/newsletter";
import ContactForm, { ContactFormBlock } from "@/components/blocks/forms/contact-form";
import FormContactMap, { FormContactMapBlock } from "@/components/blocks/forms/contact-map";
import LocationMap, { LocationMapBlock } from "@/components/blocks/location/location-map";
import AllPosts from "@/components/blocks/all-posts";
import MenuSection from "@/components/blocks/menu-section";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type ExtendedBlock = Block | ContactFormBlock | LocationMapBlock | FormContactMapBlock;

const componentMap: {
  [K in ExtendedBlock["_type"]]: React.ComponentType<Extract<ExtendedBlock, { _type: K }>>;
} = {
  "hero-1": Hero1,
  "hero-2": Hero2,
  "hero-full": HeroFull,
  "section-header": SectionHeader,
  "lottie-animation": LottieAnimationBlock,
  "split-row": SplitRow,
  "grid-row": GridRow,
  "carousel-1": Carousel1,
  "carousel-2": Carousel2,
  "reviews-carousel": ReviewsCarousel,
  "timeline-row": TimelineRow,
  "cta-1": Cta1,
  "logo-cloud-1": LogoCloud1,
  faqs: FAQs,
  "form-newsletter": FormNewsletter,
  "form-contact": ContactForm,
  "form-contact-map": FormContactMap,
  "location-map": LocationMap,
  "all-posts": AllPosts,
  "menu-section": MenuSection,
};

export default function Blocks({ blocks }: { blocks: ExtendedBlock[] }) {
  return (
    <>
      {blocks?.map((block) => {
        const Component = componentMap[block._type];
        if (!Component) {
          // Fallback for development/debugging of new component types
          console.warn(
            `No component implemented for block type: ${block._type}`
          );
          return <div data-type={block._type} key={block._key} />;
        }
        return <Component {...(block as any)} key={block._key} />;
      })}
    </>
  );
}
