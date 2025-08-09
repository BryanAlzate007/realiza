import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axios';
import icon3 from '../../assets/img/icon3.png';
import { IoIosLogOut } from "react-icons/io";
import { IoIosCog } from "react-icons/io";
import { IoIosStats } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io";
import { IoIosPersonAdd } from "react-icons/io";
import { IoIosShuffle } from "react-icons/io";
import { IoMdClipboard } from "react-icons/io";
import { IoMdPeople } from "react-icons/io";
import { Link } from 'react-router-dom';


// Componente Icon local
const Icon = ({ children }) => (
  <div className="w-5 h-5 flex items-center justify-center">{children}</div>
);

// Componente Avatar local
const Avatar = ({ src, alt }) => (
  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white overflow-hidden">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <span>U</span>
    )}
  </div>
);

function Navbar() {
    const [user, setUser] = useState(null);
    const [clientCount, setClientCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
      // Try to get user from location state first
      if (location.state?.user) {
        console.log('User from location state:', location.state.user);
        setUser(location.state.user);
      } else {
        // Fallback to localStorage if not in location state
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          console.log('User from localStorage:', JSON.parse(storedUser));
          setUser(JSON.parse(storedUser));
        }
      }
    }, [location]);

    useEffect(() => {
      const fetchClientCount = async () => {
        try {
          console.log('Fetching clients...');
          const response = await axiosInstance.get('/clients/api/v1/clients/');
          
          console.log('Response status:', response.status);
          console.log('Clients received:', response.data);
          setClientCount(response.data.length);
        } catch (error) {
          console.error('Error fetching client count:', error);
          if (error.response?.status === 401) {
            console.log('Token expired, user will be redirected to login');
          }
        }
      };

      fetchClientCount();
      
      // Refresh count every 5 minutes
      const interval = setInterval(fetchClientCount, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
      // Remove tokens and user data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Reset user state
      setUser(null);
      
      // Navigate to login page
      navigate('/');
    };
    
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">

        {/* ========= Sección Izquierda (Barra Lateral) ========= */}
        {/* Ancho fijo, fondo oscuro, esquinas redondeadas a la derecha, padding, flex col */}
        <aside className="w-64 bg-[#1A0B2E] text-white flex flex-col p-4 rounded-r-lg shadow-lg">

        {/* Logo/Título */}
        <div className="flex items-center mb-8 px-4">
            {/* Reemplazar con tu logo */}
            {/* <img src={logo} alt="Chat BoT Logo" className="h-8 mr-2" /> */}
            <img 
            src={icon3} 
            alt="Icon 3" 
            className="w-8 h-12 object-contain mr-3" 
            />
            <span className="text-xl font-bold">Realiza</span>
        </div>

        {/* Navegación Principal */}
        <nav className="flex flex-col space-y-3 flex-grow px-4">
            {/* Cada enlace de navegación es un flex item con padding, hover y gap */}

            <a href="/Clients" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors duration-200">
            <Icon><div className="w-2 h-6"><IoMdPeople style={{ fontSize: '24px' }}/></div></Icon> {/* Placeholder Icono */}
            <span>Clients</span>
            <span className="ml-auto text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full">{clientCount}</span>
            </a>
            <Link to="/prompt" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors duration-200">
            <Icon><div className="w-2 h-6"><IoMdClipboard style={{ fontSize: '24px' }}/></div></Icon>
            <span>Prompt</span>
            <span className="ml-auto text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full">18</span>
            </Link>
            <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors duration-200">
            <Icon><div className="w-2 h-6"><IoIosShuffle style={{ fontSize: '24px' }}/></div></Icon> {/* Placeholder Icono */}
            <span>Routes</span>
            <span className="ml-auto text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full">10</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors duration-200">
            <Icon><div className="w-2 h-6 "><IoIosPersonAdd style={{ fontSize: '24px' }}/></div></Icon> {/* Placeholder Icono */}
            <span>Users</span>
            <span className="ml-auto text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full">13</span>
            </a>
            <a href="/ChatBot" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors duration-200">
            <Icon><div className="w-2 h-6"><IoLogoWhatsapp style={{ fontSize: '24px' }}/></div></Icon> {/* Placeholder Icono */}
            <span>Chat</span>
            <span className="ml-auto text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full">15</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors duration-200">
            <Icon><div className="w-2 h-6"><IoIosStats style={{ fontSize: '24px' }}/></div></Icon>
            <span>Statistice</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors duration-200">
            <Icon><div className="w-2 h-6"><IoIosCog style={{ fontSize: '24px' }}/></div></Icon>
            <span>Settings</span>
            </a>
            <a onClick={handleLogout} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
            <Icon><div className="w-2 h-6"><IoIosLogOut style={{ fontSize: '24px' }}/></div></Icon>
            <span>Log Out</span>
            </a>
            {/* Agrega más enlaces aquí */}
        </nav>


        {/* Información del Usuario */}
        <div className="flex flex-col items-center gap-3 p-4 border-t border-gray-700">
            {user && (
            <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white overflow-hidden">
                    {user.picture ? (
                        <img 
                            src={user.picture} 
                            alt="Foto de perfil" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.parentElement.innerHTML = user.name ? user.name[0].toUpperCase() : 'U';
                            }}
                        />
                    ) : (
                        <span>{user.name ? user.name[0].toUpperCase() : 'U'}</span>
                    )}
                </div>
                <div className="flex flex-col text-sm">
                <span className="font-semibold text-white">{user.name || 'Usuario'}</span>
                <span className="text-gray-400">{user.email}</span>
                </div>
            </div>
            )}
            {/* Etiqueta del Plan */}
            <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Basic</span>
        </div>

        </aside>
    </div>
  )
}

export default Navbar
