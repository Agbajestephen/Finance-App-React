
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
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Notifications</span>
            </label>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Dark Mode</span>
            </label>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Language</span>
            </label>
            <select className="select select-bordered w-full">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <button className="btn btn-primary mt-6">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default Setting;