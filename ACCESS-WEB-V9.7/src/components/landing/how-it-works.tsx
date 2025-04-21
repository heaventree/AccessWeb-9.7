import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Activity, Code, CheckCircle } from "lucide-react";

interface StepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

function StepCard({ number, title, description, icon, index }: StepProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="relative"
    >
      <div className="card h-full">
        <div className="mb-4 text-5xl font-bold text-primary-600/20 dark:text-primary-500/20">
          {number}
        </div>
        <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      number: "01",
      title: "Connect Your Website",
      description: "Simply connect your website using our seamless integration tools that work with any platform.",
      icon: <Code />,
      index: 0
    },
    {
      number: "02",
      title: "Automated Analysis",
      description: "Our AI-powered tools scan your entire site for WCAG compliance issues and provide detailed reports.",
      icon: <Activity />,
      index: 1
    },
    {
      number: "03", 
      title: "Implement Fixes",
      description: "Apply our suggested fixes automatically or manually with the help of our developer guidance.",
      icon: <CheckCircle />,
      index: 2
    }
  ];

  return (
    <section className="py-20 bg-background dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How AccessWeb Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our easy 3-step process to make your website accessible
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <StepCard 
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              index={step.index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}