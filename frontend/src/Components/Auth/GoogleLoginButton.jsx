import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleLoginButton() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleScript = () => {
      try {
        if (!window.google) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = initializeGoogleSignIn;
          script.onerror = () => setError('Error al cargar el script de Google');
          document.head.appendChild(script);
        } else {
          initializeGoogleSignIn();
        }
      } catch (err) {
        setError('Error al inicializar Google Sign-In');
        console.error('Error:', err);
      }
    };

    loadGoogleScript();
  }, []);

  const initializeGoogleSignIn = () => {
    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        scope: 'openid email profile',
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleLoginButton'),
        {
          theme: 'outline',
          size: 'large',
          width: 320,
          locale: 'es'
        }
      );
    } catch (err) {
      setError('Error al inicializar Google Sign-In');
      console.error('Error de inicialización:', err);
    }
  };

  const handleCredentialResponse = async (response) => {
    try {
      if (!response.credential) {
        throw new Error('No se recibió el token de Google');
      }

      const result = await sendTokenToBackend(response.credential);
      
      if (result.success) {
        // Guardar los tokens JWT
        localStorage.setItem('access_token', result.access);
        localStorage.setItem('refresh_token', result.refresh);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redireccionar al dashboard
        navigate('/dashboard', {state: { user: result.user }});
      }
    } catch (err) {
      setError(err.message);
      console.error('Error en la respuesta de credenciales:', err);
    }
  };

  const sendTokenToBackend = async (idToken) => {
    try {
      const response = await fetch('http://localhost:8000/api/google-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error en la autenticación');
      }

      return data;
    } catch (err) {
      console.error('Error al enviar token al backend:', err);
      throw new Error('Error al comunicarse con el servidor');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        id="googleLoginButton"
        className="flex items-center justify-center h-9 w-80"
      />
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}

export default GoogleLoginButton;