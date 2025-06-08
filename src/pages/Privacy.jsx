import { useState } from "react";
import MainLayout from "../layouts/MainLayout"; 
export default function Privacy() {
  const [expanded, setExpanded] = useState(null); // For collapsible sections
  const [accepted, setAccepted] = useState(false); // User acceptance state

  // Privacy Sections Data
  const privacySections = [
    {
      title: "What Information Do We Collect?",
      content: "We collect personal data such as email, name, and usage statistics for better service.",
    },
    {
      title: "How Do We Use Your Information?",
      content: "Your information is used to enhance user experience, improve our services, and ensure security.",
    },
    {
      title: "Do We Share Your Data?",
      content: "We never sell your data. We only share necessary information with trusted service providers.",
    },
    {
      title: "Your Rights & Choices",
      content: "You can request data deletion, export your information, and control cookies in your settings.",
    },
  ];

  return (
    <MainLayout title="Privacy Policy">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        
        {/* Last Updated Date */}
        <p className="text-sm text-gray-500 dark:text-gray-400">📅 Last Updated: March 2025</p>

        {/* Privacy Policy Sections */}
        {privacySections.map((section, index) => (
          <div key={index} className="border-b pb-4 dark:border-gray-700">
            <button
              className="w-full text-left flex justify-between items-center text-lg font-semibold text-gray-900 dark:text-white py-2"
              onClick={() => setExpanded(expanded === index ? null : index)}
            >
              {section.title}
              <span className="text-blue-500">{expanded === index ? "▲" : "▼"}</span>
            </button>
            {expanded === index && <p className="text-gray-600 dark:text-gray-300 mt-2">{section.content}</p>}
          </div>
        ))}

        {/* Accept Privacy Policy Checkbox */}
        <div className="flex items-center space-x-2 mt-6">
          <input
            type="checkbox"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
            className="w-4 h-4 border-gray-300 rounded dark:bg-gray-700"
          />
          <p className="text-gray-700 dark:text-gray-300">
            I have read and accept the Privacy Policy.
          </p>
        </div>

        {/* Download & Contact Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => alert("Downloading PDF...")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition"
          >
            Download PDF
          </button>
          <button
            onClick={() => alert("Redirecting to Contact Form...")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition"
          >
            Contact for Privacy
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
