import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

function DashBoard() {
   const [user, setUser] = useState(null);
   const location = useLocation();

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

  return (
    <div className="flex">
      <Navbar />  

      {/* ========= Sección Central (Historial de Chats) ========= */}
      <div className="flex flex-1">
        <section className="flex-1 bg-white dark:bg-gray-800 flex flex-col p-4 shadow-md dark:shadow-none overflow-y-auto h-screen">
          {/* Grid principal con dos columnas fijas */}
          <div className="grid grid-cols-[300px_1fr] gap-4 h-full">
            {/* Columna izquierda para Cards y Budget */}
            <div className="space-y-4 h-full">
              {/* Tarjeta de Cards - Altura ajustada */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow h-[48%]">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Cards</h3>
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg text-white h-[calc(100%-3rem)] flex flex-col justify-between">
                  <div>
                    <p className="text-sm mb-1">Balance</p>
                    <p className="text-2xl font-bold mb-2">₦ 22,000</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs">**** **** **** 1234</p>
                    <p className="text-xs">12/22</p>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Budget - Altura ajustada */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow h-[48%]">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Budget</h3>
                <div className="space-y-3 h-[calc(100%-3rem)] flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-sm dark:text-gray-300">Cash</span>
                    <span className="dark:text-gray-300">₦ 100,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm dark:text-gray-300">Subscriptions</span>
                    <span className="dark:text-gray-300">₦ 22,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm dark:text-gray-300">Savings</span>
                    <span className="dark:text-gray-300">₦ 35,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm dark:text-gray-300">Investments</span>
                    <span className="dark:text-gray-300">₦ 150,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha para el resto de las tarjetas */}
            <div className="grid grid-cols-2 grid-rows-3 gap-4 h-full">
              {/* Tarjeta de All Transactions */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow h-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">All Transactions</h3>
                <div className="space-y-3 h-[calc(100%-3rem)] overflow-y-auto">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                      <div>
                        <p className="text-sm font-medium dark:text-gray-200">Gerald Argungu</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">21/12/21</p>
                      </div>
                    </div>
                    <span className="text-red-500">₦ 22,000</span>
                  </div>
                  {/* Más transacciones pueden agregarse aquí */}
                </div>
              </div>

              {/* Tarjeta de Report */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow h-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Report</h3>
                <div className="h-[calc(100%-3rem)] flex items-center justify-between gap-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month) => (
                    <div key={month} className="flex flex-col items-center w-1/6 h-full">
                      <div className="w-full bg-orange-500 rounded-t flex-1"></div>
                      <span className="text-xs dark:text-gray-400 mt-1">{month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarjeta de Subscriptions */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow h-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Subscriptions</h3>
                <div className="space-y-3 h-[calc(100%-3rem)] overflow-y-auto">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-red-500"></div>
                      <div>
                        <p className="text-sm font-medium dark:text-gray-200">Netflix</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">due 21/12/21</p>
                      </div>
                    </div>
                    <span className="dark:text-gray-300">₦ 5,000</span>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Savings */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow h-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Savings</h3>
                <div className="h-[calc(100%-3rem)] flex flex-col justify-center">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-orange-500">
                          50%
                        </span>
                      </div>
                    </div>
                    <div className="flex h-2 mb-4 overflow-hidden rounded bg-gray-200 dark:bg-gray-600">
                      <div style={{ width: "50%" }} className="bg-orange-500"></div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <p>Target Reached: ₦ 250,000</p>
                      <p>Savings Target: ₦ 500,000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Loans */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow h-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Loans</h3>
                <div className="space-y-4 h-[calc(100%-3rem)] overflow-y-auto">
                  <div className="border-b dark:border-gray-600 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
                        <img src="" alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-medium dark:text-gray-200">Pay kid bro's fees</p>
                    </div>
                    <div className="flex justify-between text-xs dark:text-gray-400 mb-2">
                      <span>Date taken: 21/12/21</span>
                      <span>Amount left: ₦40,000</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Financial Advice */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow h-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Financial Advice</h3>
                <div className="space-y-3 h-[calc(100%-3rem)] flex flex-col justify-center">
                  <p className="text-sm dark:text-gray-300">Try dey enjoy life. Problem no dey finish.</p>
                  <p className="text-sm dark:text-gray-300">For this life lol...</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashBoard
