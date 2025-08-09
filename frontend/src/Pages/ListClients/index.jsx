import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/20/solid';
import axiosInstance from '../../services/axios';
import Navbar from '../../Components/Navbar';
import EditClients from '../../Components/EditClients';

function ListClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    typeDocument: '',
    district: ''
  });

  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get('/clients/api/v1/clients/');
      setClients(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los clientes');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = (
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.numberDocument?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nameCompany?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters = (
      (!filters.typeDocument || client.typeDocument === filters.typeDocument) &&
      (!filters.district || client.district === filters.district)
    );

    return matchesSearch && matchesFilters;
  });

  const handleEditClient = (clientId) => {
    setSelectedClientId(clientId);
    setIsEditModalOpen(true);
  };

  const handleClientUpdated = (updatedClient) => {
    setClients(currentClients => 
      currentClients.map(client => 
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await axiosInstance.delete(`/clients/api/v1/clients/${clientId}/`);
        setClients(currentClients => currentClients.filter(client => client.id !== clientId));
      } catch (error) {
        setError('Error al eliminar el cliente');
      }
    }
  };

  return (
    <div className="flex relative">
      <Navbar />

      <div className="flex flex-1">
        <section className="flex-1 bg-white dark:bg-gray-800 flex flex-col p-4 shadow-md dark:shadow-none overflow-y-auto h-screen">
          {/* Header y Filtros */}
          <div className="mb-6">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Clientes</h1>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  Lista completa de clientes registrados en el sistema
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button
                  type="button"
                  onClick={() => navigate('/clients')}
                  className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Agregar cliente
                </button>
              </div>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 dark:bg-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="Buscar por nombre, documento o empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-x-1 rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  Filtros
                </Menu.Button>

                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tipo de Documento
                      </label>
                      <select
                        value={filters.typeDocument}
                        onChange={(e) => setFilters(prev => ({ ...prev, typeDocument: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-600 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Todos</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="NIT">NIT</option>
                        <option value="CE">Cédula de Extranjería</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Barrio
                      </label>
                      <input
                        type="text"
                        value={filters.district}
                        onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        placeholder="Filtrar por barrio"
                      />
                    </div>
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          </div>

          {/* Tabla de Clientes */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-600 dark:text-red-400">{error}</div>
          ) : (
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                            Nombre
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Documento
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Empresa
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Dirección
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Celular
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Día de Facturación
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Acciones</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                        {filteredClients.map((client) => (
                          <tr key={client.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                              {client.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                              {client.typeDocument} {client.numberDocument}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                              {client.nameCompany || '-'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                              {client.address}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                              {client.cellphone || '-'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                              {client.billingDate || '-'}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <div className="flex justify-end gap-4">
                                <button
                                  onClick={() => handleEditClient(client.id)}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteClient(client.id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* El modal se renderiza al final para que esté por encima del contenido */}
      <EditClients
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        clientId={selectedClientId}
        onClientUpdated={handleClientUpdated}
      />
    </div>
  );
}

export default ListClients;
