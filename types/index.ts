// framer motion variants
import { Variants } from 'framer-motion';

export const slideFromLeftVariants = {
    initial: { opacity: 0, x: -200 },
    animate: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.5 } },
  };
  
  export const slideFromRightVariants = {
    initial: { opacity: 0, x: 200 },
    animate: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.5 } },
  };
  
  export const slideUpVariants = {
    initial: { opacity: 0, y: 100 },
    animate: {
      opacity: 1,
      y: 0,
    },
  };
  
  export const fadeInVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
  };
  export const photoAnimDelay = (index: number): Variants => ({
  hidden: { 
    translateX: 500,
    opacity: 0,
  }, // Start at scale 1
  visible: {
    translateX: 0,
    opacity: 1,
    transition: {
      ease: "easeOut",
      duration: 0.5,
      delay: index * 0.25, // Adjust the delay as needed
    },
  },
})

export const scrollRevealRight: Variants = {
  hidden: { scale: 0, x: -50 },
  visible: {
    scale: 1,
    x: 0,
    transition: {
      duration: 0.2,
    },
  },
}