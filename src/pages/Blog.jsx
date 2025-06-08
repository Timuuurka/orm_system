import { useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "../layouts/MainLayout"; 
import blog1 from "../assets/blog1.jpg";
import blog2 from "../assets/blog2.jpg";
import blog3 from "../assets/blog3.jpg";

// Sample Blog Data
const blogPosts = [
  {
    id: 1,
    title: "How to Manage Online Reputation Effectively",
    category: "Guides",
    date: "March 12, 2025",
    image: blog1,
    excerpt: "Learn the best strategies to monitor, respond, and improve your online reputation.",
  },
  {
    id: 2,
    title: "Reputation Monitor 2.0 – New Features & Updates",
    category: "Updates",
    date: "March 8, 2025",
    image: blog2,
    excerpt: "Discover our latest platform improvements, including AI-based sentiment analysis.",
  },
  {
    id: 3,
    title: "Case Study: How a Local Business Recovered from Negative Reviews",
    category: "Case Studies",
    date: "March 5, 2025",
    image: blog3,
    excerpt: "See how one company used Reputation Monitor to restore its online credibility.",
  },
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered Blog Posts
  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout title="Latest News & Updates">
      {/* Featured Blog Post */}
      <section className="relative bg-blue-600 text-white text-center py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold">Stay Informed with Reputation Insights</h1>
          <p className="mt-3 text-lg text-blue-100">
            Discover expert tips, product updates, and industry news to manage your online reputation.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Search Bar */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search blog posts..."
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <BlogPost key={post.id} {...post} />)
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No blog posts found.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

/* --- Components --- */

// Blog Post Card Component
function BlogPost({ title, category, date, image, excerpt }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <span className="text-sm text-blue-500">{category}</span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{excerpt}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">{date}</span>
          <a
            href="#"
            className="text-blue-500 hover:underline font-medium"
          >
            Read More →
          </a>
        </div>
      </div>
    </motion.div>
  );
}
