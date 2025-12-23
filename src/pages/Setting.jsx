import React, { useEffect, useState } from "react";
//  
import { useAuth } from "../contexts/AuthContext"; // Changed import path
import ThemeToggle from "../components/ThemeToggle";

export default function Setting() {
  const { currentUser } = useAuth(); // Changed from {user, role} to {currentUser}
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    notifications: {
      deposits: true,
      withdrawals: true,
      transfers: true,
      fraudAlerts: true,
      email: true,
      sms: false,
      push: true,
    },
    preferences: {
      theme: "system",
      language: "en",
      currency: "USD",
    },
    security: {
      requirePinForTransfers: true,
      dailyTransferLimit: 2000,
      internationalTransfersEnabled: false,
    },
    payments: {
      defaultAccountId: "",
      allowedBeneficiariesOnly: true,
    },
  });

  // Check if user is admin (simple example - you should implement proper role checking)
  const isAdmin = currentUser?.email?.includes("admin") || false;

  useEffect(() => {
    const loadSettings = async () => {
      if (!currentUser) return;
      
      try {
        const ref = doc(db, "settings", currentUser.uid);
        const snap = await getDoc(ref);
        
        if (snap.exists()) {
          const data = snap.data();
          // Merge with existing form state, preserving defaults for missing fields
          setForm(prev => ({
            ...prev,
            notifications: { ...prev.notifications, ...data.notifications },
            preferences: { ...prev.preferences, ...data.preferences },
            security: { ...prev.security, ...data.security },
            payments: { ...prev.payments, ...data.payments },
          }));
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [currentUser]);

  const saveSettings = async () => {
    if (!currentUser) return;
    
    try {
      const ref = doc(db, "settings", currentUser.uid);
      await setDoc(ref, form, { merge: true });
      // Show success message
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  const setField = (path, value) => {
    setForm(prev => {
      const next = JSON.parse(JSON.stringify(prev)); // Alternative to structuredClone
      const keys = path.split(".");
      let obj = next;
      
      // Navigate to the nested property
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      
      // Set the value
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  if (!currentUser) return <div className="p-4">Please sign in to manage settings.</div>;
  
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <div className="badge badge-primary">
          {currentUser.displayName || currentUser.email}
        </div>
      </div>

      {/* Security Settings */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Security Settings</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text font-medium">Require PIN for transfers</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={form.security.requirePinForTransfers}
                  onChange={(e) =>
                    setField("security.requirePinForTransfers", e.target.checked)
                  }
                />
              </label>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Daily Transfer Limit</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={form.security.dailyTransferLimit}
                  onChange={(e) =>
                    setField("security.dailyTransferLimit", Number(e.target.value))
                  }
                  className="range range-primary flex-1"
                />
                <span className="font-bold">${form.security.dailyTransferLimit}</span>
              </div>
            </div>
            
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text font-medium">Enable International Transfers</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={form.security.internationalTransfersEnabled}
                  onChange={(e) =>
                    setField("security.internationalTransfersEnabled", e.target.checked)
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["deposits", "withdrawals", "transfers", "fraudAlerts"].map(
                (key) => (
                  <div key={key} className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={form.notifications[key]}
                        onChange={(e) =>
                          setField(`notifications.${key}`, e.target.checked)
                        }
                      />
                    </label>
                  </div>
                )
              )}
            </div>
            
            <div className="divider">Notification Channels</div>
            
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={form.notifications.email}
                  onChange={(e) =>
                    setField("notifications.email", e.target.checked)
                  }
                />
                <span>Email</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={form.notifications.sms}
                  onChange={(e) =>
                    setField("notifications.sms", e.target.checked)
                  }
                />
                <span>SMS</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={form.notifications.push}
                  onChange={(e) =>
                    setField("notifications.push", e.target.checked)
                  }
                />
                <span>Push Notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Preference Settings */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Theme</span>
              </label>
              <div className="flex items-center gap-3">
                <ThemeToggle />
              </div>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Language</span>
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={form.preferences.language}
                onChange={(e) => setField("preferences.language", e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Display Currency</span>
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={form.preferences.currency}
                onChange={(e) => setField("preferences.currency", e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Payment Settings</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Default Account ID</span>
              </label>
              <input
                className="input input-bordered w-full max-w-md"
                value={form.payments.defaultAccountId}
                onChange={(e) =>
                  setField("payments.defaultAccountId", e.target.value)
                }
                placeholder="Enter account ID (e.g., ACC-123456)"
              />
            </div>
            
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text font-medium">Only Allow Saved Beneficiaries</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={form.payments.allowedBeneficiariesOnly}
                  onChange={(e) =>
                    setField("payments.allowedBeneficiariesOnly", e.target.checked)
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="card bg-base-100 shadow-lg border-2 border-warning">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="card-title text-xl text-warning">Admin Controls</h2>
              <span className="badge badge-warning">ADMIN</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Administrative functions for system management and user oversight.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-warning btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
                Freeze Account
              </button>
              
              <button className="btn btn-error btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Force Password Reset
              </button>
              
              <button className="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                View Audit Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save All Button */}
      <div className="flex justify-end gap-4 pt-4">
        <button className="btn btn-ghost">Cancel</button>
        <button onClick={saveSettings} className="btn btn-primary">
          Save All Settings
        </button>
      </div>
    </div>
  );
}