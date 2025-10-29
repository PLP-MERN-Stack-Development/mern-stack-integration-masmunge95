import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import PostPage from '@/pages/PostPage';
import { ThemeProvider } from '@/context/ThemeContext';
import { Routes, Route } from 'react-router-dom';

export default function App(){
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostPage />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}
