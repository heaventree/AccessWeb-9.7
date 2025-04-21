import { FormEvent } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";

interface CTABannerProps {
  onTrialSignup: (e: FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export default function CTABanner({ onTrialSignup, isSubmitting }: CTABannerProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gradient-primary text-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Start your free trial today and see how easy it is to achieve WCAG compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <form onSubmit={onTrialSignup}>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-primary-600 font-medium transition-all duration-300 rounded-full px-8 py-3"
              >
                {isSubmitting ? "Starting..." : "Start Free Trial"} <ArrowRight className="ml-2 h-5 w-5 inline" />
              </button>
            </form>
            <button
              type="button"
              className="inline-flex items-center justify-center px-8 py-3 border border-white hover:bg-white/10 rounded-full text-white font-medium"
            >
              View Pricing
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}