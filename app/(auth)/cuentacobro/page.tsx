"use client";
import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import Buttonpdf from '@/app/libs/ui/Buttonpdf';
import '@/app/miscss/cuentacobro.css';
import Menu from "@/app/libs/ui/menu";

const CuentaDeCobro = () => {
  const [datos, setDatos] = useState<any>(null);
  const [periodoAdeudado, setPeriodoAdeudado] = useState<string>('');
  const [valorEnLetras, setValorEnLetras] = useState<string>('');
  const [valorEnNumeros, setValorEnNumeros] = useState<string>('');

  const componentRef = useRef<HTMLDivElement>(null);

  const printDocument = () => {
    const input = componentRef.current;
    if (input) {
      const options = {
        margin: [10, 10, 10, 10], // Margen de 10 mm en todos los lados
        filename: 'CuentaDeCobro.pdf',
        image: { type: 'jpeg', quality: 1 }, // Usando JPEG con la máxima calidad
        html2canvas: { scale: 2, dpi: 600, letterRendering: true }, // Escala y DPI aumentados
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().from(input).set(options).save();
    }
  };

  const hidden = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.display = 'none';
  };

  const eventClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    printDocument();
    hidden(e);
  };

  const buscarCobro = async () => {
    var nroCedula = (document.getElementById('inputNroCedula') as HTMLInputElement).value;
    try {
      const response = await fetch(`/api/searchcontratos?numeroCedula=${nroCedula}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDatos(data);
      } else {
        console.error('Error en la solicitud:', response.statusText);
      }
    } catch (error) {
      console.error('Error al solicitar los contratos:', error);
    }
  };

  const modificarPlanilla = () => {
    var nroPlanilla = (document.getElementById('inputNroPlanilla') as HTMLInputElement).value;
    var spanPlanilla = document.getElementById('nroPlanilla') as HTMLElement;
    if (nroPlanilla) {
      console.log(nroPlanilla);
      spanPlanilla.innerText = nroPlanilla;
    } else {
      console.log('No se encontró el elemento con el ID "inputNroPlanilla".');
    }
  };

  const fechaActual = new Date().getFullYear();

  return (
    <div>
      <Menu />
      <div className='flex items-center justify-center space-x-7'>
      <input id='inputNroPlanilla' type="text" className='block p-2.5 w-50% z-20 text-sm rounded-lg text-gray-900 bg-gray-50  border-s-gray-50 border-s-2 border border-gray-300   dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600   placeholder="Digite su Planilla" ' required/>
      <button onClick={modificarPlanilla} className='focus:outline-none text-white bg-fuchsia-800  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-1 mt-1 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'>Modificar Nro-Planilla</button>
        <input id='inputNroCedula' type="text" className='block p-2.5 w-50% z-20 text-sm rounded-lg text-gray-900 bg-gray-50  border-s-gray-50 border-s-2 border border-gray-300   dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600  placeholder="Digite su numero de CC" ' />
        <button onClick={buscarCobro} className='focus:outline-none text-white bg-fuchsia-800  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-1 mt-1 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'>Buscar CuentaCobro</button>
      </div>
      {datos && (
        <div ref={componentRef} className='background'>
          <div className="container">
            <div className="texto1">FECHA: <input type="text" className="border-none mt-1 h-7" /></div>
            <div className="text-center p-2 sm:px-7 font-medium text-gray-800">
              <h1 className="texto4 mb-3">CUENTA DE COBRO No.<input type="text" className="border-none mt-1 w-3 h-6" />- {fechaActual}</h1>
              <h1 className="texto4">
                LA AGENCIA DE EDUCACIÓN POSTSECUNDARIA DE MEDELLÍN - SAPIENCIA
              </h1>
              <h1 className="texto4">NIT:900.602.106-0</h1>
              <h1 className="texto4 mb-1">DEBE A:</h1>
            </div>
            <div>
              <table className="table1">
                <tr>
                  <td className="td-inicial">NOMBRE Y APELLIDOS CONTRATISTA</td>
                  <td className="td-inicial2">{datos.data.primer_nombre} {datos.data.segundo_nombre} {datos.data.primer_apellido} {datos.data.segundo_apellido}</td>
                </tr>
                <tr>
                  <td className="td-inicial">CC/NIT</td>
                  <td className="td-inicial2">{datos.data.identificacion}</td>
                </tr>
                <tr>
                  <td className="td-inicial">IDENTIFICACION FISCAL</td>
                  <td className="td-inicial2">{datos.data.id}</td>
                </tr>
                <tr>
                  <td className="td-inicial">DIRECCIÓN</td>
                  <td className="td-inicial2">{datos.data.direccion}</td>
                </tr>
                <tr>
                  <td className="td-inicial">TELÉFONOS</td>
                  <td className="td-inicial2">{datos.data.telefono}</td>
                </tr>
                <tr>
                  <td className="td-inicial">CORREO ELECTRÓNICO</td>
                  <td className="td-inicial2">{datos.data.email}</td>
                </tr>
                <tr>
                  <td className="td-inicial">CUENTA BANCARIA <br /> (Clase, banco y número)</td>
                  <td className="td-inicial2">
                    {datos.data.tipo_cuenta} <br />
                    {datos.data.nro_cuenta}
                  </td>
                </tr>
              </table>
              <h1 className="texto2 text-center mt-1 pb-2">POR LOS SIGUIENTES CONCEPTOS:</h1>
              {datos.data.contratos && datos.data.contratos.length > 0 && (
                <table className="table3 mt-2">
                  <tr>
                    <td className="td-inicial2">No. DE CONTRATO</td>
                    <td>{datos.data.contratos[0].nro_contrato}</td>
                  </tr>
                  <tr>
                    <td className="td-inicial2">OBJETO DEL CONTRATO</td>
                    <td className='leading-none'>
                      {datos.data.contratos[0].objeto}
                    </td>
                  </tr>
                </table>
              )}
              <table className="table3 ">
                <tr>
                  <td className="td-inicial2">PERÍODO ADEUDADO</td>
                  <td><input type="text" className="border-none w-full mt-1  h-7" /></td>
                </tr>
                <tr>
                  <td className="td-inicial2">VALOR EN LETRAS</td>
                  <td><textarea  className="border-none w-full h-7 line-clamp-1 mt-1 leading-none" /></td>
                </tr>
                <tr>
                  <td className="td-inicial2">VALOR EN NÚMEROS</td>
                  <td><input type="text" className="border-none w-full mt-1 h-7" /></td>
                </tr>
              </table>
              <p className="texto3 mt-3 leading-none mb-3">
                He cancelado los aportes a la seguridad social mes vencido
                mediante Planilla de pago Nro. <span id='nroPlanilla'></span>, para el periodo no
                aplica, discriminado así:
              </p>
              <table className="table2 mb-3">
                <tr>
                  <td>Aportes Fondo de Pensiones:</td>
                  <td>No aplica</td>
                </tr>
                <tr>
                  <td>Aportes Fondo de Salud:</td>
                  <td>No aplica</td>
                </tr>
                <tr>
                  <td>Aportes Fondo de ARL:</td>
                  <td>No aplica</td>
                </tr>
                <tr>
                  <td>Total Seguridad Social:</td>
                  <td>No aplica</td>
                </tr>
              </table>
              <p className="texto3 leading-none mb-5">
                Con fundamento en lo establecido en la ley 2277 de 2022 que
                modifico el parágrafo 2 del artículo 616-1 del ET y el decreto
                0780 del 15 de mayo de 2016, el presente documento es equivalente
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <button onClick={eventClick} className="focus:outline-none text-base text-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300  rounded-lg px-2 py-2 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Generar PDF</button>
      </div>
    </div>
  );
};

export default CuentaDeCobro;