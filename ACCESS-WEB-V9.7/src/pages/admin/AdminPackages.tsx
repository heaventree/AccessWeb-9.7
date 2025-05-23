import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";

interface PricingPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  period: string;
  features: Array<{ text: string; available: boolean }>;
  isPopular: boolean;
  cta: string;
  variant: string;
  accentColor: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PackageFormData {
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: Array<{ text: string; available: boolean }>;
  isPopular: boolean;
  cta: string;
  variant: string;
  accentColor: string;
  isActive: boolean;
}

const initialFormData: PackageFormData = {
  name: "",
  price: 0,
  currency: "USD",
  period: "month",
  description: "",
  features: [{ text: "", available: true }],
  isPopular: false,
  cta: "Get Started",
  variant: "outline",
  accentColor: "text-primary",
  isActive: true,
};

export function AdminPackages() {
  const [packages, setPackages] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PricingPlan | null>(
    null,
  );
  const [formData, setFormData] = useState<PackageFormData>(initialFormData);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<PricingPlan | null>(null);

  // Fetch pricing plans from database
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      console.log("Admin: Fetching pricing plans from database...");
      const response = await fetch("/api/pricing-plans");
      const data = await response.json();

      console.log("Admin API Response:", data);

      if (data.success && data.data) {
        console.log("Admin: Setting plans:", data.data);
        setPackages(data.data);
        setError(null);
      } else {
        console.error("Admin API returned error:", data);
        setError("Failed to load pricing plans");
      }
    } catch (err) {
      console.error("Admin: Error fetching pricing plans:", err);
      setError("Failed to load pricing plans");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pkg?: PricingPlan) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        price: pkg.price,
        currency: pkg.currency,
        period: pkg.period,
        description: pkg.description,
        features: pkg.features,
        isPopular: pkg.isPopular,
        cta: pkg.cta,
        variant: pkg.variant,
        accentColor: pkg.accentColor,
        isActive: pkg.isActive,
      });
    } else {
      setEditingPackage(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
    setFormData(initialFormData);
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { text: "", available: true }],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureChange = (index: number, text: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? { ...feature, text } : feature,
      ),
    }));
  };

  const handleFeatureAvailabilityChange = (
    index: number,
    available: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? { ...feature, available } : feature,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData, "formData");

    try {
      if (editingPackage) {
        // Update existing package
        const response = await fetch(
          `/api/pricing-plans/${editingPackage.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          },
        );

        const data = await response.json();

        if (data.success) {
          setPackages(
            packages.map((p) => (p.id === editingPackage.id ? data.data : p)),
          );
          toast.success("Package updated successfully");
        } else {
          toast.error(data.message || "Failed to update package");
          return;
        }
      } else {
        // Create new package
        const response = await fetch("/api/pricing-plans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          setPackages([...packages, data.data]);
          toast.success("Package created successfully");
        } else {
          toast.error(data.message || "Failed to create package");
          return;
        }
      }
      handleCloseModal();
      fetchPackages(); // Refresh the list
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Failed to save package");
    }
  };

  const handleOpenDeleteModal = (pkg: PricingPlan) => {
    setPackageToDelete(pkg);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPackageToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!packageToDelete) return;

    try {
      const response = await fetch(`/api/pricing-plans/${packageToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Package deleted successfully");
        // Refetch packages to show updated list
        await fetchPackages();
        handleCloseDeleteModal();
      } else {
        toast.error(data.message || "Failed to delete package");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Packages</h2>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Package
        </button>
      </div>

      {loading ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-600">Loading pricing plans...</p>
        </div>
      ) : error ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchPackages}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg">
          <div className="divide-y divide-gray-200">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {pkg.name}
                      </h3>
                      {pkg.isPopular && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {pkg.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleOpenModal(pkg)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(pkg)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {pkg.price}/{pkg.period}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span
                          className={`h-5 w-5 mr-2 ${feature.available ? "text-green-500" : "text-gray-400"}`}
                        >
                          {feature.available ? "✓" : "✗"}
                        </span>
                        <span
                          className={
                            feature.available
                              ? "text-gray-900"
                              : "text-gray-500"
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                {editingPackage ? "Edit Package" : "Add New Package"}
              </Dialog.Title>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Package Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (in cents)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: parseInt(e.target.value),
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center mb-2 space-x-2">
                    <input
                      type="text"
                      value={feature.text}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Feature description"
                      required
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={feature.available}
                        onChange={(e) =>
                          handleFeatureAvailabilityChange(
                            index,
                            e.target.checked,
                          )
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-1"
                      />
                      <span className="text-sm text-gray-600">Available</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Feature
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingPackage ? "Update Package" : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={handleCloseDeleteModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 text-center mb-2">
                Delete Package
              </h3>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                Are you sure you want to delete "{packageToDelete?.name}"? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCloseDeleteModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
