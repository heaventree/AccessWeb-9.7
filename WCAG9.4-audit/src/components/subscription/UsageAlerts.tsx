import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UsageAlert {
  id: string;
  feature_key: string;
  message: string;
  type: 'warning' | 'critical';
  acknowledged: boolean;
  created_at: string;
}

export function UsageAlerts() {
  const [alerts, setAlerts] = useState<UsageAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
    subscribeToAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('usage_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Failed to load usage alerts');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToAlerts = () => {
    const subscription = supabase
      .channel('usage_alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'usage_alerts'
        },
        (payload) => {
          const newAlert = payload.new as UsageAlert;
          setAlerts(prev => [newAlert, ...prev]);
          
          // Show toast notification for new alerts
          toast(
            (t) => (
              <div className="flex items-center">
                {newAlert.type === 'critical' ? (
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                ) : (
                  <Bell className="w-5 h-5 text-yellow-500 mr-2" />
                )}
                <div>
                  <p className="font-medium">{newAlert.feature_key}</p>
                  <p className="text-sm">{newAlert.message}</p>
                </div>
              </div>
            ),
            {
              duration: 5000,
              style: {
                background: newAlert.type === 'critical' ? '#FEE2E2' : '#FEF3C7',
                color: newAlert.type === 'critical' ? '#991B1B' : '#92400E'
              }
            }
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('usage_alerts')
        .update({ acknowledged: true })
        .eq('id', alertId);

      if (error) throw error;
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        )
      );
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast.error('Failed to acknowledge alert');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="ml-3 text-lg font-medium text-gray-900">
              Usage Alerts
            </h2>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {alerts.filter(a => !a.acknowledged).length} unacknowledged
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {alerts.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts</h3>
            <p className="mt-1 text-sm text-gray-500">
              You're within your usage limits
            </p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {alert.type === 'critical' ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Bell className="w-5 h-5 text-yellow-500" />
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.feature_key}
                    </p>
                    <p className="text-sm text-gray-500">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="ml-4 text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}