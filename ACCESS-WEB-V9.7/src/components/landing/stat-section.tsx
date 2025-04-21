import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function StatSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { value: "10M+", label: "Pages Scanned" },
    { value: "97%", label: "Detection Accuracy" },
    { value: "15k+", label: "Happy Customers" },
    { value: "60%", label: "Time Saved" },
  ];

  return (
    <section className="py-12 bg-background dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div 
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-500 mb-1">
                {stat.value}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}