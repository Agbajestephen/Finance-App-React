"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast" // Added toast for notifications

export default function Setting() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
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
      currency: "NGN", // Changed to NGN for Nigerian Naira
    },
    security: {
      requirePinForTransfers: true,
      dailyTransferLimit: 2000000, // Updated to Naira equivalent
      internationalTransfersEnabled: false,
    },
    payments: {
      defaultAccountId: "",
      allowedBeneficiariesOnly: true,
    },
  })

  const isAdmin = currentUser?.email?.includes("admin") || false

  useEffect(() => {
    const loadSettings = () => {
      if (!currentUser) return

      try {
        const savedSettings = localStorage.getItem(`user_settings_${currentUser.uid}`)

        if (savedSettings) {
          const data = JSON.parse(savedSettings)
          setForm((prev) => ({
            ...prev,
            notifications: { ...prev.notifications, ...data.notifications },
            preferences: { ...prev.preferences, ...data.preferences },
            security: { ...prev.security, ...data.security },
            payments: { ...prev.payments, ...data.payments },
          }))
        }
      } catch (error) {
        console.error("Error loading settings:", error)
        toast.error("Failed to load settings")
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [currentUser])

  const saveSettings = () => {
    if (!currentUser) return

    try {
      localStorage.setItem(`user_settings_${currentUser.uid}`, JSON.stringify(form))
      toast.success("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings. Please try again.")
    }
  }

  const setField = (path, value) => {
    setForm((prev) => {
      const next = JSON.parse(JSON.stringify(prev))
      const keys = path.split(".")
      let obj = next

      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]]
      }

      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  const handleThemeChange = (theme) => {
    setField("preferences.theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }

  if (!currentUser)
    return (
      <div className="p-4 text-center">
        <p className="text-lg">Please sign in to manage settings.</p>
      </div>
    )

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <div className="badge badge-primary">{currentUser.displayName || currentUser.email}</div>
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
                  onChange={(e) => setField("security.requirePinForTransfers", e.target.checked)}
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Daily Transfer Limit (₦)</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="100000"
                  value={form.security.dailyTransferLimit}
                  onChange={(e) => setField("security.dailyTransferLimit", Number(e.target.value))}
                  className="range range-primary flex-1"
                />
                <span className="font-bold min-w-[120px]">₦{form.security.dailyTransferLimit.toLocaleString()}</span>
              </div>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text font-medium">Enable International Transfers</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={form.security.internationalTransfersEnabled}
                  onChange={(e) => setField("security.internationalTransfersEnabled", e.target.checked)}
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
              {["deposits", "withdrawals", "transfers", "fraudAlerts"].map((key) => (
                <div key={key} className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={form.notifications[key]}
                      onChange={(e) => setField(`notifications.${key}`, e.target.checked)}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="divider">Notification Channels</div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={form.notifications.email}
                  onChange={(e) => setField("notifications.email", e.target.checked)}
                />
                <span>Email</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={form.notifications.sms}
                  onChange={(e) => setField("notifications.sms", e.target.checked)}
                />
                <span>SMS</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={form.notifications.push}
                  onChange={(e) => setField("notifications.push", e.target.checked)}
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
              <select
                className="select select-bordered w-full max-w-xs"
                value={form.preferences.theme}
                onChange={(e) => handleThemeChange(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="cupcake">Cupcake</option>
                <option value="bumblebee">Bumblebee</option>
                <option value="emerald">Emerald</option>
                <option value="corporate">Corporate</option>
                <option value="synthwave">Synthwave</option>
                <option value="retro">Retro</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="valentine">Valentine</option>
                <option value="halloween">Halloween</option>
                <option value="garden">Garden</option>
                <option value="forest">Forest</option>
                <option value="aqua">Aqua</option>
                <option value="lofi">Lofi</option>
                <option value="pastel">Pastel</option>
                <option value="fantasy">Fantasy</option>
                <option value="wireframe">Wireframe</option>
                <option value="black">Black</option>
                <option value="luxury">Luxury</option>
                <option value="dracula">Dracula</option>
                <option value="cmyk">CMYK</option>
                <option value="autumn">Autumn</option>
                <option value="business">Business</option>
                <option value="acid">Acid</option>
                <option value="lemonade">Lemonade</option>
                <option value="night">Night</option>
                <option value="coffee">Coffee</option>
                <option value="winter">Winter</option>
              </select>
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
                <option value="yo">Yoruba</option>
                <option value="ig">Igbo</option>
                <option value="ha">Hausa</option>
                <option value="fr">French</option>
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
                <option value="NGN">NGN (₦)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
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
                onChange={(e) => setField("payments.defaultAccountId", e.target.value)}
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
                  onChange={(e) => setField("payments.allowedBeneficiariesOnly", e.target.checked)}
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
              <button className="btn btn-warning btn-outline">Freeze Account</button>

              <button className="btn btn-error btn-outline">Force Password Reset</button>

              <button className="btn btn-outline">View Audit Logs</button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-4 pt-4">
        <button className="btn btn-ghost">Cancel</button>
        <button onClick={saveSettings} className="btn btn-primary">
          Save All Settings
        </button>
      </div>
    </div>
  )
}
