
import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../firebase";
// import { doc, getDoc } from "firebase/firestore";
// src/state/useAuth.jsx


export function useAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) setRole(snap.data().role || "user");
      } else {
        setRole("user");
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return {
    user: { uid: "demo-user", name: "Stephen" },
    role: "admin", // or "user"
    loading: false,
  };
}
