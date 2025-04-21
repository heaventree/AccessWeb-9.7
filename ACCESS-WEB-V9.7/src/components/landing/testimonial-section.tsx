import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, Users, Building } from "lucide-react";

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  rating: number;
  index: number;
}

function TestimonialCard({ quote, name, title, company, avatar, rating, index }: TestimonialProps) {
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
      className="card"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}, {company}</p>
          </div>
        </div>
        <div className="flex">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
          ))}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 italic">"{quote}"</p>
    </motion.div>
  );
}

export default function TestimonialSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const testimonials = [
    {
      quote: "AccessWeb has completely transformed how we approach accessibility. What used to take weeks now takes hours, and our compliance score has increased by 83%.",
      name: "Sarah Johnson",
      title: "Director of Digital",
      company: "TechCorp Inc.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      index: 0
    },
    {
      quote: "The automated scanning and fix suggestions have saved our development team countless hours. The ROI was evident within the first month.",
      name: "Michael Chen",
      title: "Lead Developer",
      company: "Webflow Solutions",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      rating: 5,
      index: 1
    },
    {
      quote: "As a government contractor, WCAG compliance is non-negotiable for us. AccessWeb provides peace of mind with its comprehensive monitoring.",
      name: "Lisa Rodriguez",
      title: "Compliance Manager",
      company: "GovTech Services",
      avatar: "https://randomuser.me/api/portraits/women/57.jpg",
      rating: 5,
      index: 2
    }
  ];

  return (
    <section className="py-20 bg-background dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="badge badge-primary inline-block rounded-full px-4 py-1 mb-6">
            Trusted by industry leaders
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See what our customers are saying about our accessibility platform
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              title={testimonial.title}
              company={testimonial.company}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
              index={index}
            />
          ))}
        </div>
        
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-between opacity-60 dark:opacity-40">
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/Verizon_Logo.svg" alt="Verizon" className="h-8 mx-auto dark:invert" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Nike_logo.svg" alt="Nike" className="h-8 mx-auto dark:invert" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1e/Deloitte.svg" alt="Deloitte" className="h-8 mx-auto dark:invert" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" alt="BMW" className="h-10 mx-auto dark:invert" />
        </div>
      </div>
    </section>
  );
}