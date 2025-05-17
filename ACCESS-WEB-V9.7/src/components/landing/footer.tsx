import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Github,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#f9fdff] dark:bg-gray-900 pt-24 pb-8 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-1 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#e0f5f1] dark:bg-[#0fae96]/20 flex items-center justify-center mr-1">
                <CheckCircle className="w-4 h-4 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">AccessWeb<span className="text-[#0fae96] dark:text-[#5eead4]">Pro</span></span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-base">
              Making web accessibility compliance simple, automated, and accessible for organizations of all sizes.
            </p>
            <div className="flex space-x-6">
              <Link to="#" className="w-10 h-10 rounded-full bg-[#f4f7fa] dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-[#0fae96] hover:text-white transition-colors">
                <Twitter size={18} />
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-[#f4f7fa] dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-[#0fae96] hover:text-white transition-colors">
                <Linkedin size={18} />
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-[#f4f7fa] dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-[#0fae96] hover:text-white transition-colors">
                <Facebook size={18} />
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-[#f4f7fa] dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-[#0fae96] hover:text-white transition-colors">
                <Github size={18} />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-5">Product</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-base">
              <li><Link to="/" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Pricing</Link></li>
              <li><Link to="/docs" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Documentation</Link></li>
              <li><Link to="/docs/api" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">API</Link></li>
              <li><Link to="/integrations" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Integrations</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-5">Resources</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-base">
              <li><Link to="/blog" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Blog</Link></li>
              <li><Link to="/tools/wcag-standards" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">WCAG Guidelines</Link></li>
              <li><Link to="/tools/image-alt-scanner" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Accessibility Tools</Link></li>
              <li><Link to="/knowledge-base" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Case Studies</Link></li>
              <li><Link to="/help" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Support Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-5">Company</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-base">
              <li><Link to="/about" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-base mb-4 md:mb-0">
            © {new Date().getFullYear()} AccessWebPro. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4] text-base transition-colors">Privacy</Link>
            <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4] text-base transition-colors">Terms</Link>
            <Link to="/cookies" className="text-gray-500 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4] text-base transition-colors">Cookies</Link>
            <Link to="/accessibility" className="text-gray-500 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4] text-base transition-colors">Accessibility Statement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
