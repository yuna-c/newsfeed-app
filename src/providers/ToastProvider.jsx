import { Toaster } from 'react-hot-toast';

function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: '#fff',
          color: '#000',
          fontSize: '14px',
          borderRadius: '20px',
          marginBottom: '40px'
        },
        duration: 5000,
        success: {
          icon: '🍧'
        },
        error: {
          icon: '❌'
        }
      }}
    />
  );
}

export default ToastProvider;
