import './App.css';
import Providers from './providers/Providers';
import ToastProvider from './providers/ToastProvider';
import Router from './shared/Router';

function App() {
  return (
    <Providers>
      <ToastProvider />
      <Router />
    </Providers>
  );
}

export default App;
