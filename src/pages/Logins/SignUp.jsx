// pages/Logins/SignUpPage.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  User,
  Monitor,
  Shield,
  Zap,
  ArrowRight,
  Phone,
  Hash,
  Briefcase,
  Gavel,
  CheckCircle,
} from "lucide-react";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    barRegistrationNumber: "",
    phoneNumber: "",
    contactMode: {
      email: false,
      phone: false,
      whatsapp: false,
    },
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      contactMode: {
        ...formData.contactMode,
        [name]: checked,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      setError("Please enter a valid 10-digit phone number");
      setIsSubmitting(false);
      return;
    }

    // Validate at least one contact mode is selected
    if (!formData.contactMode.email && !formData.contactMode.phone && !formData.contactMode.whatsapp) {
      setError("Please select at least one mode of contact");
      setIsSubmitting(false);
      return;
    }

    try {
      // Here you would typically make an API call to register the user
      // await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, formData);
      
      // For now, simulate registration
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Show success popup
      setShowSuccessPopup(true);
      
      // Hide popup after 3 seconds and redirect to home page
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate("/");
      }, 3000);
      
    } catch (error) {
      setError("Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden ">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/images/back-login.jpg')",
        }}
      ></div>

      {/* Dark Overlay for Left Panel */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-5"></div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-md mx-4 shadow-2xl animate-fade-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/30">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
              <p className="text-white/80 text-lg mb-2">Our team will contact you shortly.</p>
              <p className="text-white/60 text-sm">Redirecting to home page...</p>
            </div>
          </div>
        </div>
      )}

      {/* Left Side Panel */}
      <div className="hidden lg:block lg:w-3/5 relative z-10">
        <div className="relative z-20 flex flex-col justify-center px-12 text-white drop-shadow-lg h-full">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
                <Gavel className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold text-white drop-shadow-xl">
                Advocate AI Master
              </h1>
            </div>
            <p className="text-xl font-medium text-white drop-shadow-md">
              Start Your Journey With Us
            </p>
            <p className="text-md text-white/80 drop-shadow-md mt-2">
              Create an account to access exclusive features and personalized content.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Personalized Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Secure & Private
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  Easy to Use
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 relative z-10 min-h-screen overflow-y-auto py-8">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl px-8 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-white">Advocate Registration</h2>
            <p className="text-sm text-white/70 mt-2">
              Join Advocate AI Master for intelligent case management
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bar Registration Number */}
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                id="barRegistrationNumber"
                name="barRegistrationNumber"
                type="text"
                value={formData.barRegistrationNumber}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Bar Registration Number"
                required
              />
            </div>
            
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Full Name"
                required
              />
            </div>

            {/* Email Address */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Email Address"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Phone Number (10 digits)"
                required
              />
            </div>

            {/* Mode of Contact */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                Mode of Contact
              </label>
              <div className="flex flex-wrap gap-4 p-3 bg-white/10 border border-white/20 rounded-lg">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="email"
                    checked={formData.contactMode.email}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-white/40 rounded focus:ring-blue-500 bg-white/20"
                  />
                  <span className="text-sm text-white/90 flex items-center gap-1">
                    <Mail className="w-4 h-4" /> Email
                  </span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="phone"
                    checked={formData.contactMode.phone}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-white/40 rounded focus:ring-blue-500 bg-white/20"
                  />
                  <span className="text-sm text-white/90 flex items-center gap-1">
                    <Phone className="w-4 h-4" /> Phone
                  </span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="whatsapp"
                    checked={formData.contactMode.whatsapp}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-white/40 rounded focus:ring-blue-500 bg-white/20"
                  />
                  <span className="text-sm text-white/90 flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.077 4.928C17.191 3.041 14.683 2 12.006 2c-5.35 0-9.71 4.36-9.71 9.71 0 1.706.446 3.38 1.296 4.86L2.5 21.5l5.056-1.337c1.446.79 3.082 1.206 4.73 1.206 5.35 0 9.71-4.36 9.71-9.71 0-2.598-1.012-5.038-2.919-6.931zM12.006 19.87c-1.47 0-2.91-.396-4.166-1.146l-.298-.178-3.014.798.8-2.94-.194-.31c-.814-1.3-1.242-2.8-1.242-4.366 0-4.47 3.636-8.106 8.114-8.106 2.166 0 4.204.846 5.736 2.38 1.532 1.534 2.376 3.572 2.376 5.738-.002 4.47-3.64 8.106-8.112 8.106zm4.446-6.042c-.244-.122-1.44-.71-1.662-.792-.222-.082-.384-.122-.546.122-.162.244-.634.792-.778.956-.144.164-.288.184-.532.062-.754-.332-1.526-.804-2.16-1.394-.814-.748-1.364-1.65-1.522-2.128-.162-.478.014-.64.122-.846.098-.184.244-.41.366-.614.122-.204.162-.346.244-.57.082-.224.028-.398-.014-.56-.042-.162-.37-1.006-.512-1.374-.134-.35-.272-.302-.37-.308h-.32c-.136 0-.356.05-.542.244-.186.194-.712.696-.712 1.698 0 1.002.73 1.97.832 2.106.102.136 1.422 2.22 3.45 3.04.482.194.858.31 1.15.398.482.134.92.116 1.266.07.388-.052 1.194-.488 1.362-.96.168-.472.168-.876.118-.96-.05-.084-.184-.136-.428-.24z"/>
                    </svg>
                    WhatsApp
                  </span>
                </label>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-white/40 rounded focus:ring-blue-500 bg-white/20"
                required
              />
              <label className="ml-3 text-sm text-white/90">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-white underline hover:text-blue-300"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-white/80">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-white hover:text-blue-300 underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;