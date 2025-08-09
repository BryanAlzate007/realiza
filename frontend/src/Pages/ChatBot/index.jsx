import Navbar from '../../Components/Navbar';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axios';
import { useLocation } from 'react-router-dom';

// Componente Icon local para el chat
const Icon = ({ children }) => (
  <div className="w-5 h-5 flex items-center justify-center">{children}</div>
);

// Componente Avatar local para el chat
const Avatar = ({ src, alt }) => (
  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white overflow-hidden">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <span>U</span>
    )}
  </div>
);

function ChatBot() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState({});
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [clients, setClients] = useState([]);
  const location = useLocation();

  // Función para obtener el nombre del cliente basado en el número de teléfono
  const getClientName = (phoneNumber) => {
    // Limpiamos el número de teléfono para asegurarnos que coincida con el formato guardado
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    // Buscamos el cliente que coincida con el número de teléfono
    const client = clients.find(c => {
      // Limpiamos también el número del cliente para la comparación
      const clientPhone = c.cellphone ? c.cellphone.replace(/\D/g, '') : '';
      return clientPhone === cleanedPhoneNumber;
    });
    return client ? client.name : phoneNumber;
  };

  useEffect(() => {
    if (location.state?.user) {
      console.log('User from location state:', location.state.user);
      setUser(location.state.user);
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log('User from localStorage:', JSON.parse(storedUser));
        setUser(JSON.parse(storedUser));
      }
    }
  }, [location]);

  // Efecto para cargar las conversaciones de WhatsApp
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:8000/whatsapp/messages/');
        const data = await response.json();
        
        setConversations(prev => {
          const newConversations = { ...prev };
          // Update messages for all conversations while preserving order
          Object.keys(data).forEach(phone => {
            newConversations[phone] = data[phone];
          });
          return newConversations;
        });

        // Only select the first number if there is no selected chat and no conversations loaded yet
        if (!selectedPhone && Object.keys(conversations).length === 0) {
          const phones = Object.keys(data);
          if (phones.length > 0) {
            setSelectedPhone(phones[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching WhatsApp messages:', error);
      }
    };

    fetchMessages();
    // Configurar un intervalo para actualizar los mensajes cada 10 segundos
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [selectedPhone]);

  // Efecto para cargar los clientes
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/clients/');
        if (!response.ok) {
          throw new Error('Error al obtener los clientes');
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedPhone) return;

    try {
      const response = await axiosInstance.post('/whatsapp/messages/', {
        phone_number: selectedPhone,
        message: inputMessage.trim(),
      });

      // Añadir el mensaje localmente sin esperar la actualización
      const newMessage = response.data;
      setConversations(prev => ({
        ...prev,
        [selectedPhone]: [...(prev[selectedPhone] || []), newMessage],
      }));

      // Limpiar el input
      setInputMessage('');
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.data?.details) {
        alert(`Error al enviar mensaje: ${error.response.data.details}`);
      } else {
        alert('No se pudo enviar el mensaje. Por favor intenta de nuevo.');
      }
    }
  };

  return (
    <div className="flex w-full h-screen">
      <Navbar />  
      <div className="flex flex-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">

      <section className="w-80 bg-white dark:bg-gray-800 flex flex-col p-4 shadow-md dark:shadow-none overflow-y-auto">
        {/* Título y Contador */}
        <div className="flex items-center justify-between mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chats</h2>
          <span className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
            {Object.keys(conversations).length}
          </span>
        </div>

        {/* Lista de conversaciones */}
        <div className="flex flex-col space-y-3 overflow-y-auto">
          {Object.entries(conversations).map(([phone, messages]) => {
            const lastMessage = messages[messages.length - 1];
            return (
              <div
                key={phone}
                onClick={() => setSelectedPhone(phone)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                  selectedPhone === phone ? 'bg-gray-100 dark:bg-gray-700' : ''
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <Avatar src="" alt={getClientName(phone)} />
                <div className="flex-1">
                  <h3 className="font-medium">{getClientName(phone)}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {lastMessage?.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Área principal de chat */}
      <main className="flex-grow bg-white dark:bg-gray-800 flex flex-col shadow-inner dark:shadow-none">
        {selectedPhone ? (
          <>
            {/* Encabezado del chat */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar src="" alt={getClientName(selectedPhone)} />
                <h2 className="text-xl font-semibold">{getClientName(selectedPhone)}</h2>
              </div>
            </div>

            {/* Área de mensajes */}
            <div className="flex-grow p-6 space-y-4 overflow-y-auto">
              {conversations[selectedPhone]?.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.is_from_me ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar src="" alt={message.is_from_me ? 'Me' : selectedPhone} />
                  <div className="flex flex-col">
                    <div
                      className={`p-3 rounded-lg max-w-md ${
                        message.is_from_me
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <p>{message.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-2">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Área de input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Enviar
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Selecciona una conversación para comenzar
            </p>
          </div>
        )}
      </main>
    </div>
    </div> 
  );
}

export default ChatBot
