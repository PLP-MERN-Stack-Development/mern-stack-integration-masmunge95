import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from "react";
import PostManager from '@/components/PostManager';
import CategoryManager from '@/components/CategoryManager';

/**
 * A dashboard component that displays a welcome message and user-specific content.
 */
export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [message, setMessage] = useState("");

  const messages = [
    "Ready to create something awesome today?",
    "Your stories won’t write themselves — let’s get started!",
    "New ideas? Let’s turn them into posts!",
    "Your dashboard’s fresh and waiting — what are we publishing today?",
    "Let’s make some blog magic happen ✨",
    "Got thoughts? Let’s get them out there!",
    "Another day, another chance to share your ideas with the world.",
    "Your readers are waiting — time to give them something good!",
    "Let’s build your next big post together.",
    "Don’t just scroll — create, post, and inspire!",
  ];

  useEffect(() => {
    // Pick a random message when the dashboard loads
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMsg);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Render a loading state while waiting for user data.
  if (!isLoaded || !isSignedIn) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto p-6 text-center rounded-lg shadow-md ">
        <h1 className="text-4xl font-bold ">
          Welcome back, {user.firstName}!
        </h1>
        <p className="mt-2">{message}</p>
      </div>
      <PostManager />
      <hr className="my-12 border-gray-700" />
      <CategoryManager />
    </div>
  );
}