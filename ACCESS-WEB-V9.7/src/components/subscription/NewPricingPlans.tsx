import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Check, ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

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
  ctaLink: string;
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
  ctaLink,
  variant,
  delay,
  accentColor,
}: PricingPlanProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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

      <Link to={ctaLink}>
        <Button
          variant={variant as any}
          className={`w-full
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
      </Link>
    </motion.div>
  );
}

export function NewPricingPlans() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const { isAuthenticated } = useAuth();
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
        if (data.success && data.data) {
          // Transform the data to include dynamic pricing and CTA links
          const transformedPlans = data.data.map((plan: any) => ({
            ...plan,
            price:
              billingInterval === "monthly"
                ? `$${plan.price}`
                : `$${(parseFloat(plan.price) * 10).toFixed(0)}`,
            period: billingInterval === "monthly" ? "month" : "year",
            ctaLink: isAuthenticated
              ? "/dashboard/billing"
              : `/signup?plan=${plan.name.toLowerCase()}`,
          }));
          setPlans(transformedPlans);
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
  }, [billingInterval, isAuthenticated]);

  // Show loading state
  if (loading) {
    return (
      <div className="py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#0fae96] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading pricing plans...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="py-12">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:flex-col sm:align-center mb-12">
        {/* Billing interval toggle */}
        <Badge
          variant="outline"
          className="bg-[#e0f5f1] dark:bg-[#0fae96]/20 text-[#0fae96] dark:text-[#5eead4] border-0 rounded-full px-4 py-1 mb-6 self-center"
        >
          Choose billing cycle
        </Badge>

        <div className="relative mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 flex self-center">
          <button
            type="button"
            className={`relative py-2 px-6 border-0 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#0fae96] focus:z-10 sm:w-auto sm:px-8 ${
              billingInterval === "monthly"
                ? "bg-white dark:bg-gray-700 border-gray-200 shadow-sm text-gray-900 dark:text-white"
                : "bg-transparent text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setBillingInterval("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`relative py-2 px-6 border-0 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#0fae96] focus:z-10 sm:w-auto sm:px-8 ${
              billingInterval === "yearly"
                ? "bg-white dark:bg-gray-700 border-gray-200 shadow-sm text-gray-900 dark:text-white"
                : "bg-transparent text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setBillingInterval("yearly")}
          >
            Yearly{" "}
            <span className="text-[#0fae96] dark:text-[#5eead4] font-medium">
              (Save 15%)
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <PricingPlan
            key={index}
            name={plan.name}
            description={plan.description}
            price={plan.price}
            period={plan.period}
            features={plan.features}
            isPopular={plan.isPopular}
            cta={plan.cta}
            ctaLink={plan.ctaLink}
            variant={plan.variant}
            delay={0.1 * index}
            accentColor={plan.accentColor}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-20 text-center"
      >
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Need a custom solution for your enterprise organization?
        </p>
        <Button
          variant="outline"
          className="border-[#0fae96] text-[#0fae96] dark:border-[#5eead4] dark:text-[#5eead4] hover:bg-[#0fae96]/10 dark:hover:bg-[#0fae96]/20 hover:text-[#0fae96] dark:hover:text-[#5eead4] rounded-full"
        >
          Contact our sales team <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
