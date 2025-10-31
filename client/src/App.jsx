import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import PostPage from '@/pages/PostPage';
import { ThemeProvider } from '@/context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';

export default function App(){
  return (
    <ThemeProvider>
      <HelmetProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:slug" element={<PostPage />} />
          </Routes>
        </Layout>
      </HelmetProvider>
    </ThemeProvider>
  );
}
