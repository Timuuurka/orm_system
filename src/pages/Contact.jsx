import { useState } from "react";
import MainLayout from "../layouts/MainLayout"; 

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validate Email
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!isValidEmail(formData.email)) newErrors.email = "Invalid email format.";
    if (!formData.message) newErrors.message = "Message cannot be empty.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <MainLayout title="Contact Us">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <p className="text-gray-600 dark:text-gray-300">
          Have a question or need help? Reach out to us and we’ll get back to you soon!
        </p>

        {/* Success Message */}
        {success && (
          <p className="text-green-500 text-sm text-center">
            ✅ Your message has been sent! We'll contact you shortly.
          </p>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <TextAreaField
            label="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></span>
            ) : (
              "Send Message"
            )}
          </button>
        </form>

        {/* Support Info */}
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>📍 123 Business St, City, Country</p>
          <p>📧 support@reputationmonitor.com</p>
        </div>
      </div>
    </MainLayout>
  );
}

/* --- Components --- */

// Reusable Input Field Component
function InputField({ label, type, name, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Reusable TextArea Field Component
function TextAreaField({ label, name, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="4"
        className={`w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
