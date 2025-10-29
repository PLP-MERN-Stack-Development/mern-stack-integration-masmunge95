import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react';
import Button from '@/components/Button';
import Dashboard from './Dashboard';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

const PenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const AuthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;

export default function HomePage() {
  const { isSignedIn } = useUser();

  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <div>
          {/* Hero Section */}
          <section className="text-center py-16">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl max-w-4xl mx-auto mb-15">
              Welcome to <span className="text-blue-600 dark:text-blue-400">MERN Blog Manager!</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg">
              Your all-in-one playground for ideas — write them, shape them, and share them with the world. 
              Fueled by the MERN stack’s muscle and guarded by Clerk’s top-tier security. Create boldly, publish safely.
            </p>
            <div className="mt-8">
              <SignInButton mode="modal">
                <Button size="lg" variant="primary">
                  Get Started
                </Button>
              </SignInButton>
            </div>
          </section>

          {/* Features Section */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12 ">
              Features
            </h2>
            <p className="text-center mx-auto max-w-2xl mb-12">
              Dive into the features that make MERN Blog more than just another blogging platform — 
              it’s your digital megaphone, notebook, and creative studio all rolled into one.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<PenIcon />}
                title="Full CRUD for Posts"
                description="Total control, zero confusion. 
                Whether you’re crafting a masterpiece or cleaning out old drafts, managing your posts is as easy as writing them — no tech degree required."
              />
              <FeatureCard
                icon={<CategoryIcon />}
                title="Category Management"
                description="Keep your chaos classy. Create categories, tag your thoughts, and turn your content into an easily navigable wonderland. Your readers (and future self) will thank you."
              />
              <FeatureCard
                icon={<AuthIcon />}
                title="Secure Authentication"
                description="Sign in with confidence, not confusion. Clerk handles the locks and keys so you can focus on the words. Smooth, secure, and stress-free — just the way login should be."
              />
            </div>
          </section>
        </div>
      </SignedOut>
    </>
  );
}