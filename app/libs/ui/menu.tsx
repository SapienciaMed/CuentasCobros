import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';



const Menu = () => {
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('user');
        localStorage.removeItem('CuentaCobro');
        localStorage.removeItem('ReporteActividad');
        window.location.href = '/login';
    };
    return (
        <div>
            <nav className=" bg-fuchsia-800 border-gray-200 mb-0">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-2">
                    <span className="text-white self-center text-lg font-semibold whitespace-nowrap dark:text-white">SAPIENCIA</span>
                    
                    <div id="mega-menu-full" className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
                        <ul className="flex flex-col mt-2 font-medium md:flex-row md:mt-0 md:space-x-6">
                            <li>
                                <a href="/cuentacobro" className="block py-1 px-2  border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700 text-white" aria-current="page">Cuenta De Cobro</a>
                            </li>
                            <li>
                                <a href="/reporteactividades" className="block py-1 px-2  border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700 text-white">Reporte De Activades</a>
                            </li>
                            <li>
                                <a href="/reportefinal" className="block py-1 px-2  border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700 text-white">Reporte Final</a>
                            </li>
                            <li>
                                <a href="/contratos" className="block py-1 px-2  border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700 text-white">Registrar contratos</a>
                            </li>
                            <li>
                                <a href="/updatecontratos" className="block py-1 px-2  border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700 text-white">Actualizar contrato</a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    onClick={handleLogout}
                                    className="block py-1 px-2 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700 text-white"
                                >
                                    Cerrar Sesión
                                </a>
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