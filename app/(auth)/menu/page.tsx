import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

const Menu = () => {
    return (
        <div>
            <nav className=" bg-fuchsia-800 border-gray-200 mb-0">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-2"> 
                    <span className="text-white self-center text-lg font-semibold whitespace-nowrap dark:text-white">SAPIENCIA</span> 
                    <button data-collapse-toggle="mega-menu-full" type="button" className="inline-flex items-center p-1 w-8 h-8 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mega-menu-full" aria-expanded="false"> 
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div id="mega-menu-full" className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
                        <ul className="flex flex-col mt-2 font-medium md:flex-row md:mt-0 md:space-x-6"> 
                            <li>
                                <a href="/cuentacobro" className="block py-1 px-2  border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700 text-white" aria-current="page">Cuenta De Cobro</a> 
                            </li>
                            <li>
                                <a href="/reporteactividades" className="block py-1 px-2  border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700 text-white">Reporte De Activades</a> 
                            </li>
                            <li>
                                <a href="#" className="block py-1 px-2 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700 text-white">Resources</a> 
                            </li>
                            <li>
                                <a href="#" className="block py-1 px-2 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700 text-white">Contact</a> 
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="mega-menu-full-dropdown" className="mt-1 bg-white border-gray-200 shadow-sm border-y dark:bg-gray-800 dark:border-gray-600"></div>
                
            </nav>
        </div>
    );
}

export default Menu;