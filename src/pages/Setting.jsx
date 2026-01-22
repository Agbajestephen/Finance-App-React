import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  Bell,
  Palette,
  Lock,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Save,
  Key,
  UserCheck,
} from "lucide-react";

export default function Setting() {
  const {
    currentUser,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
  } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || "",
    email: currentUser?.email || "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      transactions: true,
      security: true,
    },
    preferences: {
      theme: "light",
      language: "en",
      currency: "NGN",
    },
    privacy: {
      profileVisibility: "private",
      dataSharing: false,
    },
    security: {
      biometricLogin: false,
      sessionTimeout: 30,
    },
  });

  const isAdmin = currentUser?.email?.includes("admin") || false;

  useEffect(() => {
    // Load saved settings
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem(
          `user_settings_${currentUser?.uid}`,
        );
        if (savedSettings) {
          const data = JSON.parse(savedSettings);
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    if (currentUser) {
      loadSettings();
    }
  }, [currentUser]);

  const saveSettings = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      localStorage.setItem(
        `user_settings_${currentUser.uid}`,
        JSON.stringify(settings),
      );
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      await updateUserProfile({ displayName: profileData.displayName });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      await updateUserEmail(profileData.email);
      toast.success(
        "Email update initiated. Please check your email for verification.",
      );
    } catch (error) {
      toast.error("Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentUser) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword(passwordData.newPassword);
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (theme) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, theme },
    }));
    document.documentElement.setAttribute("data-theme", theme);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <p className="text-base-content/60">
            You need to be logged in to access settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-base-100 border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-base-content/60 mt-1">
                Manage your account preferences
              </p>
            </div>
            <button
              onClick={saveSettings}
              disabled={loading}
              className="btn btn-primary gap-2"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <nav className="space-y-2">
                <a
                  href="#profile"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <User size={18} />
                  <span>Profile</span>
                </a>
                <a
                  href="#security"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <Shield size={18} />
                  <span>Security</span>
                </a>
                <a
                  href="#notifications"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <Bell size={18} />
                  <span>Notifications</span>
                </a>
                <a
                  href="#preferences"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <Palette size={18} />
                  <span>Preferences</span>
                </a>
                <a
                  href="#privacy"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <Lock size={18} />
                  <span>Privacy</span>
                </a>
                {isAdmin && (
                  <a
                    href="#admin"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors text-warning"
                  >
                    <SettingsIcon size={18} />
                    <span>Admin</span>
                  </a>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Settings */}
            <section id="profile" className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  <User size={24} className="text-primary" />
                  <h2 className="card-title text-xl">Profile Settings</h2>
                </div>

                <div className="space-y-6">
                  {/* Display Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Display Name
                      </span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        className="input input-bordered flex-1"
                        value={profileData.displayName}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            displayName: e.target.value,
                          }))
                        }
                        placeholder="Enter your display name"
                      />
                      <button
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className="btn btn-primary"
                      >
                        {loading ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          "Update"
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Email Address
                      </span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="email"
                        className="input input-bordered flex-1"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Enter your email"
                      />
                      <button
                        onClick={handleEmailUpdate}
                        disabled={loading}
                        className="btn btn-primary"
                      >
                        {loading ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          "Update"
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-base-content/60 mt-1">
                      Changing your email will require verification
                    </p>
                  </div>

                  {/* Change Password */}
                  <div className="divider">Change Password</div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">New Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="input input-bordered w-full pr-10"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Confirm Password</span>
                      </label>
                      <input
                        type="password"
                        className="input input-bordered w-full"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text invisible">Action</span>
                      </label>
                      <button
                        onClick={handlePasswordChange}
                        disabled={loading}
                        className="btn btn-primary w-full"
                      >
                        {loading ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          "Change Password"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Settings */}
            <section id="security" className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  <Shield size={24} className="text-primary" />
                  <h2 className="card-title text-xl">Security Settings</h2>
                </div>

                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text font-medium">
                        Enable Biometric Login
                      </span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={settings.security.biometricLogin}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            security: {
                              ...prev.security,
                              biometricLogin: e.target.checked,
                            },
                          }))
                        }
                      />
                    </label>
                    <p className="text-sm text-base-content/60 mt-1">
                      Use fingerprint or face recognition for faster login
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Session Timeout (minutes)
                      </span>
                    </label>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            sessionTimeout: Number(e.target.value),
                          },
                        }))
                      }
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={240}>4 hours</option>
                      <option value={0}>Never</option>
                    </select>
                    <p className="text-sm text-base-content/60 mt-1">
                      Automatically log out after period of inactivity
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Notification Settings */}
            <section id="notifications" className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  <Bell size={24} className="text-primary" />
                  <h2 className="card-title text-xl">
                    Notification Preferences
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-medium flex items-center gap-2">
                          <Mail size={16} />
                          Email Notifications
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={settings.notifications.email}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                email: e.target.checked,
                              },
                            }))
                          }
                        />
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-medium flex items-center gap-2">
                          <Smartphone size={16} />
                          Push Notifications
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={settings.notifications.push}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                push: e.target.checked,
                              },
                            }))
                          }
                        />
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-medium">
                          Transaction Alerts
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={settings.notifications.transactions}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                transactions: e.target.checked,
                              },
                            }))
                          }
                        />
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-medium">
                          Security Alerts
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={settings.notifications.security}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                security: e.target.checked,
                              },
                            }))
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section id="preferences" className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  <Palette size={24} className="text-primary" />
                  <h2 className="card-title text-xl">App Preferences</h2>
                </div>

                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Theme</span>
                    </label>

                    {/* Enhanced Theme Selector */}
                    <div className="bg-gradient-to-r from-base-200 to-base-300 p-6 rounded-2xl">
                      {/* Main Toggle */}
                      <div className="flex items-center justify-center gap-6 mb-6">
                        <div
                          className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                            settings.preferences.theme === "light"
                              ? "bg-yellow-100 text-yellow-800 shadow-lg scale-105"
                              : "bg-base-100 hover:bg-base-300"
                          }`}
                        >
                          <Sun size={24} className="text-yellow-500" />
                          <span className="font-semibold">Light</span>
                        </div>

                        {/* Animated Toggle Switch */}
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={settings.preferences.theme === "dark"}
                            onChange={(e) =>
                              handleThemeChange(
                                e.target.checked ? "dark" : "light",
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-16 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                        </div>

                        <div
                          className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                            settings.preferences.theme === "dark"
                              ? "bg-blue-100 text-blue-800 shadow-lg scale-105"
                              : "bg-base-100 hover:bg-base-300"
                          }`}
                        >
                          <Moon size={24} className="text-blue-500" />
                          <span className="font-semibold">Dark</span>
                        </div>
                      </div>

                      {/* Theme Preview Cards */}
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={`relative p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            settings.preferences.theme === "light"
                              ? "bg-gradient-to-br from-white to-gray-50 border-2 border-yellow-400 shadow-xl"
                              : "bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 hover:border-yellow-300"
                          }`}
                          onClick={() => handleThemeChange("light")}
                        >
                          {/* Light Theme Preview */}
                          <div className="space-y-3 mb-4">
                            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                            <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full w-4/5"></div>
                            <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full w-3/5"></div>
                            <div className="flex gap-2 mt-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-sm mb-1">
                              Light Theme
                            </p>
                            <p className="text-xs text-gray-600">
                              Clean & Bright
                            </p>
                          </div>
                          {settings.preferences.theme === "light" && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>

                        <div
                          className={`relative p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            settings.preferences.theme === "dark"
                              ? "bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-blue-400 shadow-xl"
                              : "bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600 hover:border-blue-300"
                          }`}
                          onClick={() => handleThemeChange("dark")}
                        >
                          {/* Dark Theme Preview */}
                          <div className="space-y-3 mb-4">
                            <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full"></div>
                            <div className="h-3 bg-gradient-to-r from-gray-500 to-gray-400 rounded-full w-4/5"></div>
                            <div className="h-3 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full w-3/5"></div>
                            <div className="flex gap-2 mt-3">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-sm mb-1 text-white">
                              Dark Theme
                            </p>
                            <p className="text-xs text-gray-300">
                              Easy on Eyes
                            </p>
                          </div>
                          {settings.preferences.theme === "dark" && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Theme Description */}
                      <div className="mt-4 text-center">
                        <p className="text-sm text-base-content/60">
                          {settings.preferences.theme === "light"
                            ? "Perfect for bright environments and daytime use"
                            : "Ideal for low-light conditions and nighttime use"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Language</span>
                    </label>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      value={settings.preferences.language}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            language: e.target.value,
                          },
                        }))
                      }
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
                      <span className="label-text font-medium">
                        Display Currency
                      </span>
                    </label>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      value={settings.preferences.currency}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            currency: e.target.value,
                          },
                        }))
                      }
                    >
                      <option value="NGN">NGN (₦)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Settings */}
            <section id="privacy" className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  <Lock size={24} className="text-primary" />
                  <h2 className="card-title text-xl">Privacy Settings</h2>
                </div>

                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Profile Visibility
                      </span>
                    </label>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      value={settings.privacy.profileVisibility}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          privacy: {
                            ...prev.privacy,
                            profileVisibility: e.target.value,
                          },
                        }))
                      }
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                    <p className="text-sm text-base-content/60 mt-1">
                      Control who can see your profile information
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text font-medium">
                        Data Sharing
                      </span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={settings.privacy.dataSharing}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            privacy: {
                              ...prev.privacy,
                              dataSharing: e.target.checked,
                            },
                          }))
                        }
                      />
                    </label>
                    <p className="text-sm text-base-content/60 mt-1">
                      Allow anonymous usage data to help improve our services
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Admin Section */}
            {isAdmin && (
              <section
                id="admin"
                className="card bg-base-100 shadow-lg border-2 border-warning"
              >
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-6">
                    <SettingsIcon size={24} className="text-warning" />
                    <h2 className="card-title text-xl text-warning">
                      Admin Controls
                    </h2>
                    <div className="badge badge-warning">ADMIN</div>
                  </div>

                  <p className="text-base-content/60 mb-6">
                    Administrative functions for system management and user
                    oversight.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => navigate("/admin-dashboard")}
                      className="btn btn-warning btn-outline gap-2"
                    >
                      <UserCheck size={18} />
                      Admin Dashboard
                    </button>
                    <button className="btn btn-error btn-outline gap-2">
                      <Key size={18} />
                      System Logs
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
