import React, { useState, useEffect } from 'react';

interface Feature {
  id: number;
  name: string;
  included: boolean;
}

interface Plan {
  id: number;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  description: string;
  features: Feature[];
  isActive: boolean;
}

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/admin/plans');
        // const data = await response.json();
        
        // For now, we'll simulate some data
        setTimeout(() => {
          const mockPlans: Plan[] = [
            {
              id: 1,
              name: 'Basic Plan',
              price: 19.99,
              billingPeriod: 'monthly',
              description: 'Essential accessibility tools for individuals and small businesses',
              features: [
                { id: 1, name: 'Basic website scanning', included: true },
                { id: 2, name: 'WCAG compliance reports', included: true },
                { id: 3, name: 'Up to 5 projects', included: true },
                { id: 4, name: 'Color contrast analyzer', included: true },
                { id: 5, name: 'AI-powered suggestions', included: false },
                { id: 6, name: 'API access', included: false },
                { id: 7, name: 'Priority support', included: false },
              ],
              isActive: true
            },
            {
              id: 2,
              name: 'Professional Plan',
              price: 49.99,
              billingPeriod: 'monthly',
              description: 'Advanced tools for growing businesses and agencies',
              features: [
                { id: 1, name: 'Basic website scanning', included: true },
                { id: 2, name: 'WCAG compliance reports', included: true },
                { id: 3, name: 'Unlimited projects', included: true },
                { id: 4, name: 'Color contrast analyzer', included: true },
                { id: 5, name: 'AI-powered suggestions', included: true },
                { id: 6, name: 'API access', included: true },
                { id: 7, name: 'Priority support', included: false },
              ],
              isActive: true
            },
            {
              id: 3,
              name: 'Enterprise Plan',
              price: 149.99,
              billingPeriod: 'monthly',
              description: 'Comprehensive solution for large organizations',
              features: [
                { id: 1, name: 'Basic website scanning', included: true },
                { id: 2, name: 'WCAG compliance reports', included: true },
                { id: 3, name: 'Unlimited projects', included: true },
                { id: 4, name: 'Color contrast analyzer', included: true },
                { id: 5, name: 'AI-powered suggestions', included: true },
                { id: 6, name: 'API access', included: true },
                { id: 7, name: 'Priority support', included: true },
              ],
              isActive: true
            }
          ];
          
          setPlans(mockPlans);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan({...plan});
    setIsModalOpen(true);
  };

  const handleAddPlan = () => {
    const newPlan: Plan = {
      id: Math.max(0, ...plans.map(p => p.id)) + 1,
      name: 'New Plan',
      price: 0,
      billingPeriod: 'monthly',
      description: 'Description of the new plan',
      features: plans.length > 0 
        ? [...plans[0].features.map(f => ({ ...f, included: false }))]
        : [],
      isActive: true
    };
    
    setSelectedPlan(newPlan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setIsAddingFeature(false);
    setNewFeatureName('');
  };

  const savePlanChanges = () => {
    if (!selectedPlan) return;
    
    // In a real implementation, this would be an API call
    // const method = selectedPlan.id ? 'PUT' : 'POST';
    // await fetch(`/api/admin/plans${selectedPlan.id ? `/${selectedPlan.id}` : ''}`, {
    //   method,
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(selectedPlan)
    // });
    
    // Update the plans array with the edited plan
    const updatedPlans = selectedPlan.id && plans.some(p => p.id === selectedPlan.id)
      ? plans.map(plan => plan.id === selectedPlan.id ? selectedPlan : plan)
      : [...plans, selectedPlan];
    
    setPlans(updatedPlans);
    closeModal();
  };

  const toggleFeature = (featureId: number) => {
    if (!selectedPlan) return;
    
    const updatedFeatures = selectedPlan.features.map(feature => 
      feature.id === featureId ? { ...feature, included: !feature.included } : feature
    );
    
    setSelectedPlan({ ...selectedPlan, features: updatedFeatures });
  };

  const addNewFeature = () => {
    if (!selectedPlan || !newFeatureName.trim()) return;
    
    const newFeature: Feature = {
      id: Math.max(0, ...selectedPlan.features.map(f => f.id)) + 1,
      name: newFeatureName.trim(),
      included: false
    };
    
    setSelectedPlan({
      ...selectedPlan,
      features: [...selectedPlan.features, newFeature]
    });
    
    setNewFeatureName('');
    setIsAddingFeature(false);
  };

  const removeFeature = (featureId: number) => {
    if (!selectedPlan) return;
    
    const updatedFeatures = selectedPlan.features.filter(
      feature => feature.id !== featureId
    );
    
    setSelectedPlan({ ...selectedPlan, features: updatedFeatures });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-10 h-10 border-4 border-[#0fae96] border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Subscription Plans
        </h1>
        <button 
          onClick={handleAddPlan}
          className="px-4 py-2 bg-[#0fae96] text-white rounded-full hover:bg-[#0d9a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0fae96] focus:ring-offset-2"
        >
          Add New Plan
        </button>
      </div>
      
      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {plans.map(plan => (
          <div 
            key={plan.id}
            className={`bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow ${!plan.isActive ? 'opacity-60' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {plan.description}
                </p>
              </div>
              {plan.isActive ? (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  Inactive
                </span>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${plan.price.toFixed(2)}
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                  /{plan.billingPeriod === 'monthly' ? 'mo' : 'yr'}
                </span>
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Features
              </h3>
              <ul className="space-y-2">
                {plan.features.map(feature => (
                  <li key={feature.id} className="flex items-center">
                    {feature.included ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0fae96] mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleEditPlan(plan)}
                className="w-full py-2 bg-[#0fae96] text-white rounded-full hover:bg-[#0d9a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0fae96] focus:ring-offset-2"
              >
                Edit Plan
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Plans table for comparison */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Plan Comparison
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Feature
                </th>
                {plans.map(plan => (
                  <th key={plan.id} className="py-3 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Get all unique features across all plans */}
              {plans.length > 0 && 
                Array.from(new Set(plans.flatMap(plan => plan.features.map(f => f.name)))).map((featureName, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-slate-700">
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {featureName}
                    </td>
                    {plans.map(plan => {
                      const feature = plan.features.find(f => f.name === featureName);
                      return (
                        <td key={plan.id} className="py-3 px-4 text-center">
                          {feature?.included ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0fae96] mx-auto" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit plan modal */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedPlan.id && plans.some(p => p.id === selectedPlan.id) ? 'Edit Plan' : 'Add New Plan'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={selectedPlan.name}
                  onChange={(e) => setSelectedPlan({...selectedPlan, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={selectedPlan.price}
                    onChange={(e) => setSelectedPlan({...selectedPlan, price: parseFloat(e.target.value) || 0})}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Billing Period
                </label>
                <select
                  value={selectedPlan.billingPeriod}
                  onChange={(e) => setSelectedPlan({...selectedPlan, billingPeriod: e.target.value as 'monthly' | 'yearly'})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={selectedPlan.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setSelectedPlan({...selectedPlan, isActive: e.target.value === 'active'})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={selectedPlan.description}
                  onChange={(e) => setSelectedPlan({...selectedPlan, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                  Features
                </h3>
                <button 
                  onClick={() => setIsAddingFeature(true)}
                  className="text-sm text-[#0fae96] hover:text-[#0d9a85] transition-colors focus:outline-none"
                >
                  + Add Feature
                </button>
              </div>
              
              {isAddingFeature && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Feature Name
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newFeatureName}
                      onChange={(e) => setNewFeatureName(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
                      placeholder="Enter feature name"
                    />
                    <button
                      onClick={addNewFeature}
                      className="px-4 py-2 bg-[#0fae96] text-white rounded-full hover:bg-[#0d9a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0fae96] focus:ring-offset-2"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingFeature(false);
                        setNewFeatureName('');
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors focus:outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="overflow-y-auto max-h-60">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Feature
                      </th>
                      <th className="py-2 px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        Included
                      </th>
                      <th className="py-2 px-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPlan.features.map(feature => (
                      <tr key={feature.id} className="border-b border-gray-200 dark:border-slate-700">
                        <td className="py-2 px-4 text-sm text-gray-900 dark:text-white">
                          {feature.name}
                        </td>
                        <td className="py-2 px-4 text-center">
                          <button
                            onClick={() => toggleFeature(feature.id)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              feature.included
                                ? 'bg-[#0fae96] text-white'
                                : 'bg-gray-200 dark:bg-slate-600'
                            }`}
                          >
                            {feature.included && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <button
                            onClick={() => removeFeature(feature.id)}
                            className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors focus:outline-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={savePlanChanges}
                className="px-4 py-2 bg-[#0fae96] text-white rounded-full hover:bg-[#0d9a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0fae96] focus:ring-offset-2"
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;