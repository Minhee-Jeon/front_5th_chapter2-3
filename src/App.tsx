import { BrowserRouter as Router } from 'react-router-dom';
import { queryClient } from './app/queryClient.ts';
import { QueryProvider } from './app/QueryProvider.tsx';
import Header from './widgets/ui/Header.tsx';
import Footer from './widgets/ui/Footer.tsx';
import PostsManagerPage from './pages/PostsManagerPage.tsx';

const App = () => (
  <QueryProvider client={queryClient}>
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <PostsManagerPage />
        </main>
        <Footer />
      </div>
    </Router>
  </QueryProvider>
);

export default App;
