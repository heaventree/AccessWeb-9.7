import { FormEvent } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";

interface NewsletterSectionProps {
  onNewsletterSignup: (e: FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export default function NewsletterSection({ onNewsletterSignup, isSubmitting }: NewsletterSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-[#e0f5f1] dark:bg-[#0f1729]">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Stay Updated on Accessibility</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Join our newsletter to receive the latest updates, tips, and resources on web accessibility compliance.
          </p>
          
          <form onSubmit={onNewsletterSignup} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="form-input rounded-full px-4 py-3 flex-grow"
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary px-6 py-3 whitespace-nowrap"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"} <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              We respect your privacy. No spam, just accessibility insights.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}