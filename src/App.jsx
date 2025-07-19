import './App.css';
import Providers from './providers/Providers';
import Router from './shared/Router';

function App() {
  return (
    <Providers>
      <Router />
    </Providers>
  );
}

export default App;
