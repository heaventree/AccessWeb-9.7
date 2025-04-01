import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import type { SubscriptionFeature, SubscriptionUsage } from '../types';

interface SubscriptionStatus {
  status: 'active' | 'inactive' | 'past_due' | 'cancelled';
  plan: string;
  features: Record<string, {
    max_value: number | null;
    current_value: number;
    is_enabled: boolean;
  }>;
  usage: Record<string, {
    daily: number;
    monthly: number;
    total: number;
  }>;
}

export function useSubscription(subscriptionId: string) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptionStatus();
  }, [subscriptionId]);

  const loadSubscriptionStatus = async () => {
    try {
      const { data, error } = await supabase
        .rpc('check_subscription_status', {
          p_subscription_id: subscriptionId
        });

      if (error) throw error;
      setStatus(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load subscription status';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const checkFeatureAvailability = async (
    featureKey: string,
    increment: number = 1
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('check_subscription_limit', {
          p_subscription_id: subscriptionId,
          p_feature_key: featureKey,
          p_increment: increment
        });

      if (error) throw error;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check feature availability';
      toast.error(message);
      return false;
    }
  };

  const getFeatureValue = (featureKey: string): number | null => {
    if (!status?.features) return null;
    return status.features[featureKey]?.current_value ?? null;
  };

  const getFeatureLimit = (featureKey: string): number | null => {
    if (!status?.features) return null;
    return status.features[featureKey]?.max_value ?? null;
  };

  const isFeatureEnabled = (featureKey: string): boolean => {
    if (!status?.features) return false;
    return status.features[featureKey]?.is_enabled ?? false;
  };

  const getUsage = (featureKey: string): {
    daily: number;
    monthly: number;
    total: number;
  } | null => {
    if (!status?.usage) return null;
    return status.usage[featureKey] ?? null;
  };

  return {
    status,
    loading,
    error,
    checkFeatureAvailability,
    getFeatureValue,
    getFeatureLimit,
    isFeatureEnabled,
    getUsage,
    refresh: loadSubscriptionStatus
  };
}