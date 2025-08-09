import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from "../../Components/Layout";
import Navbar from '../../Components/Navbar';

// Componente Icon local para el dashboard
const Icon = ({ children }) => (
  <div className="w-5 h-5 flex items-center justify-center">{children}</div>
);

// Componente Avatar local para el dashboard
const Avatar = ({ src, alt }) => (
  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white overflow-hidden">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <span>U</span>
    )}
  </div>
);

function Prompt() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    message: '',
    date: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    active: true
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const mappedData = {
      message: formData.message,
      date: formData.date,
      active: formData.active
    };

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch('http://localhost:8000/prompt/api/v1/prompt/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(mappedData)
      });

      if (response.status === 401) {
        // Token no válido o expirado
        localStorage.removeItem('access_token');
        navigate('/');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'Error de conexión con el servidor'
        }));
        
        // Manejar el caso específico de cliente duplicado
        if (errorData.error) {
          setError('Error al crear el mensaje del prompt');
          return;
        }
        
        throw new Error(
          errorData.error || 
          errorData.detail || 
          errorData.message || 
          'Error al crear el cliente'
        );
      }

      const data = await response.json();
      // Mostrar mensaje de éxito
      setError(null);
      alert('Mensaje del prompt creado exitosamente');
      // Redireccionar a la lista de prompts
      navigate('/prompt/list');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
   
  return (
    <div className="flex">
      <Navbar />  

      <div className="flex flex-1">
        <section className="flex-1 bg-white dark:bg-gray-800 flex flex-col p-4 shadow-md dark:shadow-none overflow-y-auto h-screen">
          {/* Botón de navegación */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/prompt/list')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Lista de Prompts
            </button>
          </div>

          <div className="w-full">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow w-full">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Crear Nuevo Mensaje de Prompt</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mensaje
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hora
                    </label>
                    <input
                      type="time"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estado
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          active: e.target.checked
                        }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Activo</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${
                      loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white px-6 py-2 rounded-lg transition-colors flex items-center`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      'Guardar Mensaje'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Prompt;
