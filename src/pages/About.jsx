import { Link } from "react-router-dom"; // ✅ Import Link
import { useState } from "react";
import MainLayout from "../layouts/MainLayout"; // Includes Sidebar, Header, and Footer
import { FiUsers, FiCheckCircle, FiTrendingUp } from "react-icons/fi";
import JpgAdilbek from "../assets/1.jpg"
import JpgZhandos from "../assets/2.jpg"
import JpgIlias from "../assets/3.jpg"
// Sample Team Data
const teamMembers = [
  { name: "Mels Adilbek", role: "CEO & Founder", img: JpgAdilbek},
  { name: "Ait Zhandos", role: "CTO", img: JpgZhandos },
  { name: "Kassenov Ilias", role: "Lead Developer", img: JpgIlias },
];

// Sample Testimonials
const testimonials = [
  { name: "John Smith", review: "This platform helped my business grow by managing our online reputation effectively!" },
  { name: "Samantha Lee", review: "Excellent customer service and great features. Highly recommend!" },
];

export default function About() {
  return (
    <MainLayout title="About Us">
    {/* Hero Section */}
    <section className="relative w-full bg-blue-600 text-white text-center py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold">Empowering Businesses, One Review at a Time</h1>
          <p className="mt-3 text-lg text-blue-100">
            Reputation Monitor provides powerful tools to track and enhance your online reputation.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition"
          >
            Contact Us
          </a>
        </div>
      </section>
        
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* About Company */}
        
        <section>
            
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Who We Are</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Reputation Monitor is a powerful platform designed to help businesses manage their online reputation.
            We provide real-time monitoring, sentiment analysis, and automated reporting to help companies improve their public image.
          </p>
        </section>

        {/* Mission Statement */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Our mission is to empower businesses with cutting-edge tools to understand and control their online presence.
          </p>
        </section>

        {/* Statistics Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <StatCard icon={<FiUsers />} value="5,000+" label="Businesses Served" />
          <StatCard icon={<FiTrendingUp />} value="1M+" label="Reviews Analyzed" />
          <StatCard icon={<FiCheckCircle />} value="98%" label="Satisfaction Rate" />
        </section>

        {/* Meet the Team */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                {/* Bigger and Stable Avatar */}
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto object-cover shadow-lg"
                />
                <h3 className="text-lg font-semibold mt-3 text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Testimonials */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">What Our Users Say</h2>
          <div className="mt-6 space-y-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <p className="text-gray-600 dark:text-gray-300">"{testimonial.review}"</p>
                <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Link
            to="/contact"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

// 📌 **Reusable Components**
function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center">
      <div className="text-4xl text-blue-500">{icon}</div>
      <h3 className="text-xl font-bold mt-2">{value}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
    </div>
  );
}

// 📌 **FAQ Section**
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: "How does Reputation Monitor work?", answer: "We analyze online reviews and social mentions to help businesses manage their reputation." },
    { question: "Is there a free trial available?", answer: "Yes, we offer a 14-day free trial with access to all features." },
  ];

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">Frequently Asked Questions</h2>
      <div className="mt-6 space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <button
              className="w-full text-left font-medium text-gray-800 dark:text-white flex justify-between"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {faq.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && <p className="mt-2 text-gray-600 dark:text-gray-300">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
