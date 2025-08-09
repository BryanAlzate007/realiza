import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Layout from "../../Components/Layout"
import icon3 from '../../assets/img/icon3.png'
import GoogleLoginButton from '../../Components/Auth/GoogleLoginButton';

function Signin() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Función que se ejecuta al hacer clic en el botón "Entrar"
  const handleLogin = async () => {
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || 'Error en el inicio de sesión');
        return;
      }

      const data = await response.json();
      console.log('Login exitoso:', data);

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify({
        name: user,
        email: user
      }));

      navigate('/dashboard');

    } catch (error) {
      console.error('Error de red o del servidor:', error);
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <Layout>
      <div className="flex flex-row items-center mt-20 h-200 m-30 w-full backdrop-opacity-10">
        {/* seccion Icono de la compañia */}
        <div className="ml-12 flex-1 flex items-center justify-end">
 
            <div className="flex justify-start items-center">
              <img 
                src={icon3} 
                alt="Icon 3" 
                className="w-150 h-185 object-contain" 
              />
            </div>

        </div>
        {/* seccion form Login*/}
        <div className=" flex-1 h-full" >
          <div className=" mt-25 h-150 w-120 flex flex-col items-center rounded-lg bg-[#212026]">
            <div className="font-semibold font-montserrat text-5xl pl-8 mt-20 mb-9 self-start text-[#007bc4]">
              <h1>Login</h1>
            </div>
            <div className=" mb-2 pl-5 pr-3 items-center rounded-tl-lg h-9 w-80 flex flex-row bg-[#131216] text-[#007bc4]">
              <img src="" alt="" />
              {/* Añade clases al input para anular estilos por defecto */}
              <input
                type="text"
                placeholder="Name User"
                className="p-0 border-none outline-none h-full bg-transparent flex-grow" // Añadidas clases aquí
                value={user}
                onChange={(e) => setUser(e.target.value)}
                >
              </input>
            </div>
            <div className=" mt-2 pl-5 pr-3 items-center rounded-tl-lg h-9 w-80 flex flex-row bg-[#131216] text-[#007bc4]">
              <img src="" alt="" />
              {/* Añade clases al input para anular estilos por defecto */}
              <input
                type="password"
                placeholder="**********"
                className="p-0 border-none outline-none h-full bg-transparent flex-grow" // Añadidas clases aquí
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                >
              </input>
            </div>
            {/* DIV DE TERMINOS Y CONDICIONES - MODIFICADO */}
              <div className="text-[#007bc4] font-montserrat mt-4 mb-4 pl-20 flex items-center self-start"> {/* Añadido flex y items-center */}
                <input
                  type="checkbox"
                  id="acceptTerms" // Añade un ID al input
                  className="mr-2 form-checkbox h-4 w-4 text-[#007bc4] rounded border-gray-300 focus:ring-[#007bc4]" // Clases de Tailwind para el checkbox (requiere el plugin @tailwindcss/forms)
                /> {/* El input checkbox */}
                <label htmlFor="acceptTerms" className="text-sm"> {/* La etiqueta asociada al input por su ID */}
                  Aceptar terminos y condiciones
                </label> {/* El texto ahora está dentro de la etiqueta label */}
              </div>
              {/* BOTON DE ENTRAR - MODIFICADO */}
              <div>
                {/* Añadimos la clase active:opacity-75 */}
                <button 
                className="bg-[#007bc4] h-9 w-80 rounded-md text-white font-semibold active:opacity-75"
                onClick={handleLogin}
                > {/* <--- Añadido active:opacity-75 */}
                  Entrar
                </button>
              </div>
            <div className="mt-4 mb-6">
              <GoogleLoginButton />
            </div>
            <div className="flex items-center w-80 mb-4">
              <div className="flex-1 border-t border-gray-500"></div>
              <span className="px-3 text-sm text-gray-500">o</span>
              <div className="flex-1 border-t border-gray-500"></div>
            </div>
            <div className="text-[#007bc4] text-sm mt-3 items-center">
              <a href="#" className="no-underline hover:underline">
                Registrarse
              </a>
            </div>
            <div className="text-[#007bc4] text-sm mt-3 items-center">
              <a href="#" className="no-underline hover:underline">
                Olvidaste tu contraseña?
              </a>
            </div>
            <div>
              
            </div>
          </div>
        </div>
      
      </div>
      <div className="pr-5 pb-5 pl-5 mr-2 mb-2 ml-2 font-montserrat font-semibold text-sm text-[#56555B]">
            <h4>
              version  1.0  Feeling Unites 2025
              {/* mas adelante tiene que se una hipervinculo a la pagina de Feeling unites */}
            </h4>
      </div>
    </Layout>
  )
}

export default Signin
