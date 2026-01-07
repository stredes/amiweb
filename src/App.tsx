import AppRouter from './router';
import useScrollToTop from './hooks/useScrollToTop';

function App() {
  useScrollToTop();
  return <AppRouter />;
}

export default App;
