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

function Clients() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    nombreCorto: '',
    tipoDocumento: '',
    numeroDocumento: '',
    direccion: '',
    barrio: '',
    observacionesDireccion: '',
    celular: '',
    nombreEmpresa: '',
    direccion2: ''
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

    // Mapear los campos al formato esperado por el backend
    const mappedData = {
      name: formData.nombre,
      nameShort: formData.nombreCorto,
      typeDocument: formData.tipoDocumento,
      numberDocument: formData.numeroDocumento,
      address: formData.direccion,
      district: formData.barrio,
      managementObservations: formData.observacionesDireccion,
      cellphone: formData.celular,
      nameCompany: formData.nombreEmpresa,
      adressSecondary: formData.direccion2
    };

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch('http://localhost:8000/clients/api/v1/createClient/', {
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
        if (errorData.error && errorData.error.includes('Ya existe un cliente')) {
          setError('Ya existe un cliente registrado con este número de documento');
          return; // No lanzar el error para mantener el formulario
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
      alert('Cliente creado exitosamente');
      // Redireccionar a la lista de clientes después de crear exitosamente
      navigate('/Clients/list');
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
              onClick={() => navigate('/Clients/list')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Clientes Registrados
            </button>
          </div>

          <div className="w-full">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow w-full">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Registrar Nuevo Cliente</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre Corto
                    </label>
                    <input
                      type="text"
                      name="nombreCorto"
                      value={formData.nombreCorto}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tipo de Documento
                    </label>
                    <select
                      name="tipoDocumento"
                      value={formData.tipoDocumento}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione...</option>
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="NIT">NIT</option>
                      <option value="CE">Cédula de Extranjería</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Número de Documento
                    </label>
                    <input
                      type="text"
                      name="numeroDocumento"
                      value={formData.numeroDocumento}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Barrio
                    </label>
                    <input
                      type="text"
                      name="barrio"
                      value={formData.barrio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Observaciones de Dirección
                    </label>
                    <textarea
                      name="observacionesDireccion"
                      value={formData.observacionesDireccion}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Número de Celular (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      name="celular"
                      value={formData.celular}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre de la Empresa
                    </label>
                    <input
                      type="text"
                      name="nombreEmpresa"
                      value={formData.nombreEmpresa}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dirección 2
                    </label>
                    <input
                      type="text"
                      name="direccion2"
                      value={formData.direccion2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
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
                      'Guardar Cliente'
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

export default Clients;
