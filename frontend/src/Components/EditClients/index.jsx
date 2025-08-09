import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axios';

function EditClients({ isOpen, onClose, clientId, onClientUpdated }) {
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
    direccion2: '',
    billingDate: '',
    active: true
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId) return;
      
      try {
        const response = await axiosInstance.get(`/clients/api/v1/clients/${clientId}/`);
        const data = response.data;
        setFormData({
          nombre: data.name || '',
          nombreCorto: data.nameShort || '',
          tipoDocumento: data.typeDocument || '',
          numeroDocumento: data.numberDocument || '',
          direccion: data.address || '',
          barrio: data.district || '',
          observacionesDireccion: data.managementObservations || '',
          celular: data.cellphone || '',
          nombreEmpresa: data.nameCompany || '',
          direccion2: data.adressSecondary || '',
          billingDate: data.billingDate || '',
          active: data.active
        });
      } catch (err) {
        setError('Error al cargar los datos del cliente');
        console.error(err);
      }
    };

    if (isOpen && clientId) {
      fetchClientData();
    }
  }, [clientId, isOpen]);

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
      name: formData.nombre,
      nameShort: formData.nombreCorto,
      typeDocument: formData.tipoDocumento,
      numberDocument: formData.numeroDocumento,
      address: formData.direccion,
      district: formData.barrio,
      managementObservations: formData.observacionesDireccion,
      cellphone: formData.celular,
      nameCompany: formData.nombreEmpresa,
      adressSecondary: formData.direccion2,
      billingDate: formData.billingDate ? parseInt(formData.billingDate) : null,
      active: formData.active
    };

    try {
      const response = await axiosInstance.put(`/clients/api/v1/clients/${clientId}/`, mappedData);
      const data = response.data;
      onClientUpdated && onClientUpdated(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar el cliente');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Editar Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Día de Facturación
              </label>
              <input
                type="number"
                name="billingDate"
                value={formData.billingDate}
                onChange={handleInputChange}
                min="1"
                max="31"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={(e) => handleInputChange({
                  target: {
                    name: 'active',
                    value: e.target.checked
                  }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cliente Activo
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
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
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditClients;
