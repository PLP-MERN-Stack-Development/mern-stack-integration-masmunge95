import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/context/ThemeContext';

/**
 * A layout component that wraps page content with a standard Header and Footer.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The page content to render.
 */
export default function Layout({ children }) {
    const { theme } = useTheme();
    
    return (
        <div className={`min-h-screen flex flex-col scroll-smooth ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 mt-16 scroll-mt-20">{children}</main>
            <Footer />
        </div>
    );
}