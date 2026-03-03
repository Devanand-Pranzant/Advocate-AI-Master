import React, { useState, useRef } from "react";
import {
  User,
  Mail,
  Lock,
  Edit2,
  Check,
  X,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTheme } from "../Settings/themeUtils";
import Button from "../Common/Button.jsx";
import Card, { CardContent } from "../Common/Card.jsx";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const { theme, themeUtils } = useTheme();
const isGradient = theme.headerBg?.includes("gradient");

const primaryColor = isGradient
  ? "#806633"
  : theme.headerBg || "#6366f1";

const softBg10 = isGradient
  ? "rgba(128, 102, 51, 0.10)"
  : theme.headerBg
  ? `${theme.headerBg}10`
  : "#eef2ff10";

const softBg05 = isGradient
  ? "rgba(128, 102, 51, 0.05)"
  : theme.headerBg
  ? `${theme.headerBg}05`
  : "#f0fdf405";
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    about:
      "Passionate developer with expertise in React and modern web technologies. Love building intuitive user interfaces and solving complex problems.",
    profilePic: "https://picsum.photos/seed/user123/150/150.jpg",
  });

  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
    about: profile.about,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Validation error states
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    about: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ── Profile picture states ────────────────────────────────
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(profile.profilePic);
  const fileInputRef = useRef(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file");
      setMessageType("error");
      return;
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  React.useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Validation functions
  const validateName = (name) => {
    if (!name) return "Full name is required";
    if (!/^[A-Za-z\s]+$/.test(name))
      return "Only uppercase and lowercase letters are allowed";
    if (name.trim().length < 3) return "Name must be at least 3 characters";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (email.length < 8) return "Email must be at least 8 characters";
    if (!email.includes("@")) return "Email must contain @ symbol";
    if (!email.includes(".com")) return "Email must contain .com";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email address";
    return "";
  };

  const validateAbout = (about) => {
    if (!about) return "About me is required";
    const wordCount = about.trim().split(/\s+/).length;
    if (wordCount > 100)
      return `About me must be 100 words or less (currently ${wordCount} words)`;
    return "";
  };

  const validateStrongPassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must contain at least one special character";
    return "";
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setEditForm({ ...editForm, name: value });
    setValidationErrors({
      ...validationErrors,
      name: validateName(value),
    });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEditForm({ ...editForm, email: value });
    setValidationErrors({
      ...validationErrors,
      email: validateEmail(value),
    });
  };

  const handleAboutChange = (e) => {
    const value = e.target.value;
    setEditForm({ ...editForm, about: value });
    setValidationErrors({
      ...validationErrors,
      about: validateAbout(value),
    });
  };

  const handlePasswordFieldChange = (field, value) => {
    setPasswordForm({ ...passwordForm, [field]: value });

    let error = "";

    if (field === "currentPassword") {
      error = validateStrongPassword(value);
    } else if (field === "newPassword") {
      error = validateStrongPassword(value);
    } else if (field === "confirmPassword") {
      if (!value) {
        error = "Confirm password is required";
      } else if (value !== passwordForm.newPassword) {
        error = "Passwords do not match";
      }
    }

    setValidationErrors({
      ...validationErrors,
      [field]: error,
    });
  };

  const handleUpdateProfile = async () => {
    const nameError = validateName(editForm.name);
    const emailError = validateEmail(editForm.email);
    const aboutError = validateAbout(editForm.about);

    setValidationErrors({
      ...validationErrors,
      name: nameError,
      email: emailError,
      about: aboutError,
    });

    if (nameError || emailError || aboutError) {
      setMessage("Please fix validation errors");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const updatedProfile = {
      name: editForm.name,
      email: editForm.email,
      about: editForm.about,
      profilePic: profile.profilePic,
    };

    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append("profilePicture", selectedImage);

        const response = await fetch("/api/upload-profile-picture", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Image upload failed");
        }

        const result = await response.json();
        updatedProfile.profilePic =
          result.url || result.imageUrl || result.profilePic;

        setMessage("Profile picture uploaded!");
        setMessageType("success");
      } catch (err) {
        console.error(err);
        setMessage("Failed to upload profile picture");
        setMessageType("error");
      }
    }

    setProfile(updatedProfile);
    setIsEditing(false);
    setMessage("Profile updated successfully!");
    setMessageType("success");

    setSelectedImage(null);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleChangePassword = () => {
    const currentPasswordError = validateStrongPassword(
      passwordForm.currentPassword,
    );
    const newPasswordError = validateStrongPassword(passwordForm.newPassword);

    let confirmPasswordError = "";
    if (!passwordForm.confirmPassword) {
      confirmPasswordError = "Confirm password is required";
    } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      confirmPasswordError = "Passwords do not match";
    }

    setValidationErrors({
      ...validationErrors,
      currentPassword: currentPasswordError,
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError,
    });

    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      setMessage("Fill required fields ");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    setMessage("Password changed successfully!");
    setMessageType("success");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setValidationErrors({
      ...validationErrors,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: profile.name,
      email: profile.email,
      about: profile.about,
    });
    setImagePreview(profile.profilePic);
    setSelectedImage(null);
    setIsEditing(false);
    setValidationErrors({
      ...validationErrors,
      name: "",
      email: "",
      about: "",
    });
  };

  const handleCancelPassword = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setValidationErrors({
      ...validationErrors,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden" shadow="shadow-xl">
          {/* Tabs */}
          <div
            className="border-b"
            style={{ borderColor: themeUtils.getBorderColor() }}
          >
            <div className="flex">
              <button
                className={`flex-1 py-3 px-4 text-center rounded-lg font-semibold transition-all duration-200`}
                style={{
                  background:
                    activeTab === "profile" ? theme.headerBg : "transparent",
                  color:
                    activeTab === "profile"
                      ? "#FFFFFF"
                      : themeUtils.getTextColor(false),
                  borderBottom:
                    activeTab === "profile"
                      ? `4px solid ${theme.headerBg}`
                      : "4px solid transparent",
                }}
                onClick={() => setActiveTab("profile")}
              >
                <div className="flex items-center justify-center gap-3">
                  <User size={22} />
                  <span>Profile Information</span>
                </div>
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center rounded-lg font-semibold transition-all duration-200`}
                style={{
                  background:
                    activeTab === "password" ? theme.headerBg : "transparent",
                  color:
                    activeTab === "password"
                      ? "#FFFFFF"
                      : themeUtils.getTextColor(false),
                  borderBottom:
                    activeTab === "password"
                      ? `4px solid ${theme.headerBg}`
                      : "4px solid transparent",
                }}
                onClick={() => setActiveTab("password")}
              >
                <div className="flex items-center justify-center gap-3">
                  <Lock size={22} />
                  <span>Security</span>
                </div>
              </button>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className="mx-8 mt-6">
              <Card
                padding="p-4"
                className="flex items-center gap-3 animate-pulse shadow-sm"
                bgColor={messageType === "success" ? "#d1fae5" : "#fee2e2"}
              >
                {messageType === "success" ? (
                  <Check size={20} color="#065f46" />
                ) : (
                  <X size={20} color="#991b1b" />
                )}
                <span
                  className="font-medium text-sm"
                  style={{
                    color: messageType === "success" ? "#065f46" : "#991b1b",
                  }}
                >
                  {message}
                </span>
              </Card>
            </div>
          )}

          <CardContent className="p-8">
            {activeTab === "profile" && (
              <div className="space-y-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 shadow-xl"
                      style={{ borderColor: theme.headerBg }}
                    />

                    {isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={handleCameraClick}
                          className="absolute bottom-3 right-1 p-1 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
                         style={{
  ...(theme.headerBg.includes("gradient")
    ? { background: theme.headerBg }
    : { backgroundColor: theme.headerBg }),
}}
                        >
                          <Camera size={20} style={{ color: "#FFFFFF" }} />
                        </button>

                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>

                  <div className="text-center md:text-left space-y-2">
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: themeUtils.getTextColor(true) }}
                    >
                      {profile.name}
                    </h2>
                    <p
                      className="flex items-center justify-center md:justify-start gap-2 text-md"
                      style={{ color: themeUtils.getTextColor(false) }}
                    >
                      <Mail size={15} />
                      {profile.email}
                    </p>
                  </div>
                </div>

                {!isEditing ? (
                  <div className="space-y-8">
                    <Card
                      padding="p-4"
                      className="rounded-2xl"
                      bgColor={`linear-gradient(to right, ${
                        theme.headerBg ? `${theme.headerBg}10` : "#eef2ff10"
                      }, ${
                        theme.headerBg ? `${theme.headerBg}05` : "#f0fdf405"
                      })`}
                    >
                      <h3
                        className="text-sm font-bold uppercase tracking-wider mb-4"
                        style={{ color: themeUtils.getTextColor(false) }}
                      >
                        About Me
                      </h3>
                      <p
                        className="text-lg leading-relaxed"
                        style={{ color: themeUtils.getTextColor(true) }}
                      >
                        {profile.about || "No description added yet."}
                      </p>
                    </Card>

                    <Button
                      variant="primary"
                      size="small"
                      icon={Edit2}
                      onClick={() => setIsEditing(true)}
                      className="hover:scale-105 transition-all duration-200"
                    >
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  <div className="max-w-2xl space-y-7">
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: themeUtils.getTextColor(false) }}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={handleNameChange}
                        className={`w-full px-3 py-1 text-sm rounded-lg border focus:outline-none transition-all ${
                          validationErrors.name ? "border-red-500" : ""
                        }`}
                        style={{
                          borderColor: validationErrors.name
                            ? "#ef4444"
                            : themeUtils.getBorderColor(),
                          backgroundColor: themeUtils.getBgColor("input"),
                          color: themeUtils.getTextColor(true),
                        }}
                        placeholder="Enter your full name"
                      />
                      {validationErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: themeUtils.getTextColor(false) }}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={handleEmailChange}
                        className={`w-full px-3 py-1 text-sm rounded-lg border focus:outline-none transition-all ${
                          validationErrors.email ? "border-red-500" : ""
                        }`}
                        style={{
                          borderColor: validationErrors.email
                            ? "#ef4444"
                            : themeUtils.getBorderColor(),
                          backgroundColor: themeUtils.getBgColor("input"),
                          color: themeUtils.getTextColor(true),
                        }}
                        placeholder="Enter your email"
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: themeUtils.getTextColor(false) }}
                      >
                        About Me (Max 100 words)
                      </label>
                      <textarea
                        value={editForm.about}
                        onChange={handleAboutChange}
                        rows={6}
                        className={`h-20 w-full px-2 py-1 text-sm rounded-lg border focus:outline-none transition-all ${
                          validationErrors.about ? "border-red-500" : ""
                        }`}
                        style={{
                          borderColor: validationErrors.about
                            ? "#ef4444"
                            : themeUtils.getBorderColor(),
                          backgroundColor: themeUtils.getBgColor("input"),
                          color: themeUtils.getTextColor(true),
                        }}
                        placeholder="Tell us about yourself..."
                      />
                      {validationErrors.about && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.about}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        Word count:{" "}
                        {
                          editForm.about
                            .trim()
                            .split(/\s+/)
                            .filter((word) => word).length
                        }
                        /100
                      </p>
                    </div>

                    <div
                      className="flex justify-center gap-4 pt-6 border-t"
                      style={{ borderColor: themeUtils.getBorderColor() }}
                    >
                      <Button
                        variant="default"
                        onClick={handleCancelEdit}
                        className="hover:bg-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleUpdateProfile}
                        className="hover:bg-blue-700 hover:shadow-md hover:scale-105 transition-all duration-200"
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "password" && (
              <div className="max-w-lg mx-auto">
                <div className="text-center mb-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                   
                    style={{
  ...(theme.headerBg.includes("gradient")
    ? { background: theme.headerBg }
    : { backgroundColor: theme.headerBg }),
}}
                  >
                    <Lock
                      size={32}
                      style={{ color: theme.headerBg || "#6366f1" }}
                    />
                  </div>
                  <h2
                    className="text-2xl font-bold mb-3"
                    style={{ color: themeUtils.getTextColor(true) }}
                  >
                    Change Password
                  </h2>
                  <p style={{ color: themeUtils.getTextColor(false) }}>
                    Ensure your account stays secure with a strong password
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { label: "Current Password", key: "currentPassword" },
                    { label: "New Password", key: "newPassword" },
                    { label: "Confirm New Password", key: "confirmPassword" },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: themeUtils.getTextColor(false) }}
                      >
                        {label}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock
                            size={16}
                            style={{ color: themeUtils.getTextColor(false) }}
                          />
                        </div>
                        <input
                          type={showPassword[key] ? "text" : "password"}
                          value={passwordForm[key]}
                          onChange={(e) =>
                            handlePasswordFieldChange(key, e.target.value)
                          }
                          className={`w-full pl-10 pr-10 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-offset-2 transition-all ${
                            validationErrors[key]
                              ? "border-red-500 focus:border-red-500 focus:ring-red-300"
                              : ""
                          }`}
                          style={{
                            borderColor: validationErrors[key]
                              ? "#ef4444"
                              : themeUtils.getBorderColor(),
                            backgroundColor: themeUtils.getBgColor("input"),
                            color: themeUtils.getTextColor(true),
                          }}
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(key)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showPassword[key] ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {validationErrors[key] && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors[key]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div
                    className="flex justify-center gap-4 pt-6 border-t"
                    style={{ borderColor: themeUtils.getBorderColor() }}
                  >
                    <Button
                      variant="default"
                      onClick={handleCancelPassword}
                      className="hover:bg-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleChangePassword}
                      className="hover:bg-blue-700 hover:shadow-md hover:scale-105 transition-all duration-200"
                      style={{ backgroundColor: themeUtils.getBgColor("input") }}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
