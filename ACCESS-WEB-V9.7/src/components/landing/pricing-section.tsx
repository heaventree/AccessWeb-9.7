import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { Badge } from "../../components/ui/badge";

interface PlanFeature {
  text: string;
  available: boolean;
}

interface PricingPlanProps {
  name: string;
  description: string;
  price: string;
  period: string;
  features: PlanFeature[];
  isPopular?: boolean;
  cta: string;
  variant: "default" | "primary" | "outline";
  delay: number;
  accentColor: string;
}

function PricingPlan({
  name,
  description,
  price,
  period,
  features,
  isPopular = false,
  cta,
  variant,
  delay,
  accentColor,
}: PricingPlanProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border ${isPopular ? "border-[#0fae96] dark:border-[#5eead4] shadow-lg relative" : "border-gray-100 dark:border-gray-700"} flex flex-col h-full`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#0fae96] dark:bg-[#0fae96] text-white px-5 py-1.5 rounded-full text-base font-medium">
          Most Popular
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2 dark:text-white">{name}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-end">
          <span className="text-5xl font-extrabold dark:text-white">
            {price}
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-2 mb-1.5">
            /{period}
          </span>
        </div>
      </div>

      <div className="mb-8 flex-grow">
        <p className="text-base text-gray-500 dark:text-gray-400 mb-4 font-medium">
          INCLUDES:
        </p>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check
                className={`mr-3 h-5 w-5 ${feature.available ? accentColor + " dark:text-[#5eead4]" : "text-gray-300 dark:text-gray-600"} flex-shrink-0`}
              />
              <span
                className={`text-gray-600 dark:text-gray-300 ${!feature.available && "text-gray-400 dark:text-gray-500 line-through"}`}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant={variant as any}
        className={`
          ${
            variant === "primary"
              ? `bg-[#0fae96] hover:bg-[#0fae96]/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 text-white`
              : variant === "outline"
                ? "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                : ""
          }
          transition-colors rounded-full py-6 ${isPopular ? "shadow-md" : ""}
        `}
      >
        {cta} {isPopular && <ArrowRight className="ml-2 h-5 w-5" />}
      </Button>
    </motion.div>
  );
}

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pricing plans from database
  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        setLoading(true);
        console.log("Fetching pricing plans from database...");
        const response = await fetch("/api/pricing-plans");
        const data = await response.json();

        console.log("API Response:", data);
        console.log("Data:", data.data);
        if (data.success && data.data) {
          console.log("Setting plans:", data.data);
          setPlans(data.data);
          setError(null);
        } else {
          console.error("API returned error:", data);
          setError("Failed to load pricing plans");
        }
      } catch (err) {
        console.error("Error fetching pricing plans:", err);
        setError("Failed to load pricing plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPricingPlans();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <section id="pricing" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-[#e0f5f1] dark:bg-[#0fae96]/20 text-[#0fae96] dark:text-[#5eead4] border-0 rounded-full px-4 py-1 mb-6"
            >
              Choose a package
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Loading pricing plans...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#0fae96] border-t-transparent rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="pricing" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-0 rounded-full px-4 py-1 mb-6"
            >
              Error loading pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-red-600 dark:text-red-400 max-w-2xl mx-auto">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="bg-[#e0f5f1] dark:bg-[#0fae96]/20 text-[#0fae96] dark:text-[#5eead4] border-0 rounded-full px-4 py-1 mb-6"
          >
            Choose a package
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            No hidden fees or complicated tiers. Choose the plan that's right
            for your business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingPlan
              key={plan.id || index}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              isPopular={plan.isPopular}
              cta={plan.cta}
              variant={plan.variant}
              delay={0.1 * index}
              accentColor={plan.accentColor}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Need a custom solution for your enterprise organization?
          </p>
          <Button
            variant="outline"
            className="border-primary text-primary dark:border-[#5eead4] dark:text-[#5eead4] hover:bg-primary dark:hover:bg-[#0fae96]/20 hover:text-white dark:hover:text-white rounded-full"
          >
            Contact our sales team <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
