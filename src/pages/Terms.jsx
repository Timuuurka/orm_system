import { useState } from "react";
import MainLayout from "../layouts/MainLayout"; 
export default function Terms() {
  const [expanded, setExpanded] = useState(null);
  const [accepted, setAccepted] = useState(false);

  const termsSections = [
    {
      title: "1. Introduction",
      content: "By accessing and using Reputation Monitor, you agree to comply with these terms and conditions.",
    },
    {
      title: "2. User Responsibilities",
      content: "Users must provide accurate information and adhere to ethical guidelines while using the platform.",
    },
    {
      title: "3. Prohibited Activities",
      content: "You may not use Reputation Monitor for illegal activities, spamming, or data scraping.",
    },
    {
      title: "4. Termination of Service",
      content: "We reserve the right to suspend accounts that violate our policies without prior notice.",
    },
    {
      title: "5. Changes to Terms",
      content: "We may update these terms from time to time, and continued use of the service constitutes agreement to the new terms.",
    },
  ];

  return (
    <MainLayout title="Terms of Service">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        
        {/* Last Updated Date */}
        <p className="text-sm text-gray-500 dark:text-gray-400">📅 Last Updated: March 2025</p>

        {/* Terms Sections */}
        {termsSections.map((section, index) => (
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

        {/* Accept Terms Checkbox */}
        <div className="flex items-center space-x-2 mt-6">
          <input
            type="checkbox"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
            className="w-4 h-4 border-gray-300 rounded dark:bg-gray-700"
          />
          <p className="text-gray-700 dark:text-gray-300">
            I have read and agree to the Terms of Service.
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
            Contact for Legal Concerns
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
