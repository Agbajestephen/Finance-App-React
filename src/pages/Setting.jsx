
import React, { useEffect, useState } from "react";

// import { db } from "../firebase"; // initialized Firebase app/db
// import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../state/useAuth"; // your custom auth hook
import ThemeToggle from "../components/ThemeToggle";

export default function Setting() {
  const { user, role } = useAuth(); // role: 'admin' | 'user'
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

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const ref = doc(db, "settings", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setForm(prev => ({ ...prev, ...snap.data() }));
      setLoading(false);
    };
    load();
  }, [user]);

  const save = async () => {
    if (!user) return;
    const ref = doc(db, "settings", user.uid);
    await setDoc(ref, form, { merge: true });
    // Optional: toast success
  };

  const setField = (path, value) => {
    setForm(prev => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys.at(-1)] = value;
      return next;
    });
  };

  if (!user) return <div>Please sign in to manage settings.</div>;
  if (loading) return <div className="loading loading-spinner" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Security */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title">Security</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Require PIN for transfers</span>
            </label>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={form.security.requirePinForTransfers}
              onChange={e => setField("security.requirePinForTransfers", e.target.checked)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Daily transfer limit</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              value={form.security.dailyTransferLimit}
              onChange={e => setField("security.dailyTransferLimit", Number(e.target.value))}
              min={0}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Enable international transfers</span>
            </label>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={form.security.internationalTransfersEnabled}
              onChange={e => setField("security.internationalTransfersEnabled", e.target.checked)}
            />
          </div>
          <button className="btn btn-primary" onClick={save}>Save security</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title">Notifications</h2>
          {["deposits","withdrawals","transfers","fraudAlerts"].map(key => (
            <div key={key} className="form-control">
              <label className="label"><span className="label-text">Notify on {key}</span></label>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={form.notifications[key]}
                onChange={e => setField(`notifications.${key}`, e.target.checked)}
              />
            </div>
          ))}
          <div className="flex gap-4">
            <label className="label cursor-pointer">
              <span className="label-text">Email</span>
              <input
                type="checkbox"
                className="toggle toggle-primary ml-2"
                checked={form.notifications.email}
                onChange={e => setField("notifications.email", e.target.checked)}
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">SMS</span>
              <input
                type="checkbox"
                className="toggle toggle-primary ml-2"
                checked={form.notifications.sms}
                onChange={e => setField("notifications.sms", e.target.checked)}
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">Push</span>
              <input
                type="checkbox"
                className="toggle toggle-primary ml-2"
                checked={form.notifications.push}
                onChange={e => setField("notifications.push", e.target.checked)}
              />
            </label>
          </div>
          <button className="btn btn-primary" onClick={save}>Save notifications</button>
        </div>
      </div>

      {/* Preferences */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title">Preferences</h2>
          <div className="form-control">
            <label className="label"><span className="label-text">Theme</span></label>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Language</span></label>
            <select
              className="select select-bordered w-full"
              value={form.preferences.language}
              onChange={e => setField("preferences.language", e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Display currency</span></label>
            <select
              className="select select-bordered w-full"
              value={form.preferences.currency}
              onChange={e => setField("preferences.currency", e.target.value)}
            >
              <option>USD</option>
              <option>NGN</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={save}>Save preferences</button>
        </div>
      </div>

      {/* Payments */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title">Payments</h2>
          <div className="form-control">
            <label className="label"><span className="label-text">Default account ID</span></label>
            <input
              className="input input-bordered"
              value={form.payments.defaultAccountId}
              onChange={e => setField("payments.defaultAccountId", e.target.value)}
              placeholder="e.g., ACC-123456"
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Only allow saved beneficiaries</span></label>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={form.payments.allowedBeneficiariesOnly}
              onChange={e => setField("payments.allowedBeneficiariesOnly", e.target.checked)}
            />
          </div>
          <button className="btn btn-primary" onClick={save}>Save payments</button>
        </div>
      </div>

      {/* Admin-only controls */}
      {role === "admin" && (
        <div className="card bg-base-100 shadow">
          <div className="card-body space-y-4">
            <h2 className="card-title">Admin controls</h2>
            <p className="text-sm">Override risk flags, freeze accounts, enforce resets.</p>
            <div className="flex gap-3">
              <button className="btn btn-warning">Freeze selected account</button>
              <button className="btn btn-error">Force password reset</button>
              <button className="btn">View fraud logs</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Setting;