import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from "../../Components/Layout";
import Navbar from '../../Components/Navbar';
import EditPrompt from '../../Components/EditPrompt';

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

function ListPrompt() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    message: '',
    date: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    active: true
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    setLoadingPrompts(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch('http://localhost:8000/prompt/api/v1/prompt/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/');
        return;
      }

      if (!response.ok) {
        throw new Error('Error al cargar los prompts');
      }

      const data = await response.json();
      setPrompts(data);
    } catch (err) {
      setError('Error al cargar los prompts: ' + err.message);
    } finally {
      setLoadingPrompts(false);
    }
  };

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
          'Error al crear el prompt'
        );
      }

      const data = await response.json();
      // Mostrar mensaje de éxito
      setError(null);
      alert('Mensaje del prompt creado exitosamente');
      // Limpiar el formulario
      setFormData({
        message: '',
        date: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        active: true
      });
      // Actualizar la lista de prompts
      fetchPrompts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro que deseas eliminar este prompt?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch(`http://localhost:8000/prompt/api/v1/prompt/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/');
        return;
      }

      if (!response.ok) {
        throw new Error('Error al eliminar el prompt');
      }

      // Actualizar la lista de prompts
      fetchPrompts();
      alert('Prompt eliminado exitosamente');
    } catch (err) {
      setError('Error al eliminar el prompt: ' + err.message);
    }
  };

  const handleEditClick = (prompt) => {
    setEditingPrompt(prompt);
    setIsEditModalOpen(true);
  };

  const handlePromptUpdated = (updatedPrompt) => {
    setPrompts(prevPrompts => 
      prevPrompts.map(prompt => 
        prompt.id === updatedPrompt.id ? updatedPrompt : prompt
      )
    );
  };

  return (
    <div className="flex">
      <Navbar />  

      <div className="flex flex-1">
        <section className="flex-1 bg-white dark:bg-gray-800 flex flex-col p-4 shadow-md dark:shadow-none overflow-y-auto h-screen">
          {/* Botón de navegación */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/prompt')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver a Crear Prompts
            </button>
          </div>

          {/* Lista de Prompts */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Lista de Prompts</h2>
            {loadingPrompts ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mensaje</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hora</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                      {prompts.map((prompt) => (
                        <tr key={prompt.id}>
                          <td className="px-6 py-4 whitespace-normal">
                            <div className="text-sm text-gray-900 dark:text-white">{prompt.message}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{prompt.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              prompt.active 
                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            }`}>
                              {prompt.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditClick(prompt)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(prompt.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <EditPrompt
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingPrompt(null);
            }}
            promptData={editingPrompt}
            onPromptUpdated={handlePromptUpdated}
          />
        </section>
      </div>
    </div>
  );
}

export default ListPrompt;
