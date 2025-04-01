import { motion } from 'framer-motion';
import { CustomAPISetup } from '../../components/integrations/CustomAPISetup';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { BackToTop } from '../../components/BackToTop';

export function CustomAPIPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
        <div className="content-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">API Integration</h1>
            <p className="text-lg text-gray-600">
              Generate and manage API keys for custom integrations
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CustomAPISetup />
          </motion.div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}