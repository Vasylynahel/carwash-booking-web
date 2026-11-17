import { Outlet, useLocation } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageTransition from '@/components/common/PageTransition';

export default function Layout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8">
        <ErrorBoundary>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
