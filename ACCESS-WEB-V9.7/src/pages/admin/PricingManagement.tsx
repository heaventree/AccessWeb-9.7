import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface PricingPlan {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  currency: string;
  billingPeriod: string;
  features: string[];
  scanLimits: {
    monthly: number;
    concurrent: number;
    pageDepth: number;
  };
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
}

const PricingManagement: React.FC = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    currency: 'USD',
    billingPeriod: 'monthly',
    features: [''],
    scanLimits: {
      monthly: 0,
      concurrent: 1,
      pageDepth: 10
    },
    isActive: true,
    isPopular: false,
    sortOrder: 0
  });

  // Fetch pricing plans
  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/admin/pricing-plans');
      const data = await response.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const planData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== ''),
      price: parseFloat(formData.price)
    };

    try {
      const url = editingPlan 
        ? `/api/admin/pricing-plans/${editingPlan.id}`
        : '/api/admin/pricing-plans';
      
      const method = editingPlan ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });

      const data = await response.json();
      
      if (data.success) {
        fetchPlans();
        resetForm();
        alert(editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/pricing-plans/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        fetchPlans();
        alert('Plan deleted successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      currency: 'USD',
      billingPeriod: 'monthly',
      features: [''],
      scanLimits: {
        monthly: 0,
        concurrent: 1,
        pageDepth: 10
      },
      isActive: true,
      isPopular: false,
      sortOrder: 0
    });
    setEditingPlan(null);
    setShowForm(false);
  };

  // Edit plan
  const editPlan = (plan: PricingPlan) => {
    setFormData({
      name: plan.name,
      slug: plan.slug,
      description: plan.description || '',
      price: plan.price,
      currency: plan.currency,
      billingPeriod: plan.billingPeriod,
      features: plan.features.length > 0 ? plan.features : [''],
      scanLimits: plan.scanLimits || { monthly: 0, concurrent: 1, pageDepth: 10 },
      isActive: plan.isActive,
      isPopular: plan.isPopular,
      sortOrder: plan.sortOrder
    });
    setEditingPlan(plan);
    setShowForm(true);
  };

  // Add feature
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Update feature
  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#0fae96] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pricing Plans Management
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#0fae96] text-white px-4 py-2 rounded-full hover:bg-[#0d9a85] transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Plan
          </button>
        </div>

        {/* Pricing Plans List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  {plan.isPopular && (
                    <span className="inline-block bg-[#0fae96] text-white text-xs px-2 py-1 rounded-full mt-1">
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editPlan(plan)}
                    className="p-2 text-gray-600 hover:text-[#0fae96] transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${plan.price}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                    /{plan.billingPeriod}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {plan.description}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features:</h4>
                <ul className="space-y-1">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#0fae96] rounded-full mr-2 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-sm text-gray-500 dark:text-gray-500">
                      +{plan.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Slug: {plan.slug}</span>
                <span className={`px-2 py-1 rounded-full ${
                  plan.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {editingPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Plan Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0fae96] dark:bg-slate-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0fae96] dark:bg-slate-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0fae96] dark:bg-slate-700 dark:text-white"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0fae96] dark:bg-slate-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Currency
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0fae96] dark:bg-slate-700 dark:text-white"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Billing Period
                      </label>
                      <select
                        value={formData.billingPeriod}
                        onChange={(e) => setFormData(prev => ({ ...prev, billingPeriod: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0fae96] dark:bg-slate-700 dark:text-white"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Features
                    </label>
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0fae96] dark:bg-slate-700 dark:text-white"
                          placeholder="Enter feature"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-[#0fae96] hover:text-[#0d9a85] text-sm"
                    >
                      + Add Feature
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Monthly Scans
                      </label>
                      <input
                        type="number"
                        value={formData.scanLimits.monthly}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          scanLimits: { ...prev.scanLimits, monthly: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0fae96] dark:bg-slate-700 dark:text-white"
                        placeholder="-1 for unlimited"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Concurrent Scans
                      </label>
                      <input
                        type="number"
                        value={formData.scanLimits.concurrent}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          scanLimits: { ...prev.scanLimits, concurrent: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0fae96] dark:bg-slate-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Page Depth
                      </label>
                      <input
                        type="number"
                        value={formData.scanLimits.pageDepth}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          scanLimits: { ...prev.scanLimits, pageDepth: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0fae96] dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isPopular}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Popular</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#0fae96] dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#0fae96] text-white rounded-lg hover:bg-[#0d9a85]"
                    >
                      {editingPlan ? 'Update Plan' : 'Create Plan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingManagement;