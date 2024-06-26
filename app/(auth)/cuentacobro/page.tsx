"use client";
import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import Buttonpdf from '@/app/libs/ui/Buttonpdf';
import '@/app/miscss/cuentacobro.css';
import Menu from "@/app/libs/ui/menu";

const CuentaDeCobro = () => {
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

  const modificarPlanilla = () => {
    var nroPlanilla = document.getElementById('inputNroPlanilla') as HTMLInputElement;
    var spanPlanilla = document.getElementById('nroPlanilla') as HTMLElement
    if (nroPlanilla) {
      console.log(nroPlanilla.value);
      spanPlanilla.innerText = nroPlanilla.value;
    } else {
      console.log('No se encontró el elemento con el ID "inputNroPlanilla".');
    }
  };
  return (
    
      
    
    <div className="bg-gray-100" >
      <Menu />
      <div className='flex items-center justify-center space-x-9 mt-1 mb-1 '>
        <input id='inputNroPlanilla' type="text" className='block p-2.5 w-50% z-20 text-sm rounded-lg text-gray-900 bg-gray-50  border-s-gray-50 border-s-2 border border-gray-300   dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Digite su numero de cc" ' required/>
        <button onClick={modificarPlanilla} className='focus:outline-none text-white bg-fuchsia-800  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-1 mt-1 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'>Modificar Nro-Planilla</button>
      </div>
      <div ref={componentRef}>
        {<div className="container " >
          <div className="texto1 ">FECHA: MAYO 23 2024</div>

          <div className="text-center p-2 sm:px-7  font-medium text-gray-800">
            <h1 className="texto4 mb-3">CUENTA DE COBRO No. 03-2024</h1>

            <h1 className="texto4">
              LA AGENCIA DE EDUCACIÓN POSTSECUNDARIA DE MEDELLÍN - SAPIENCIA
            </h1>
            <h1 className="texto4 ">NIT:900.602.106-0</h1>

            <h1 className="texto4 mb-1">DEBE A:</h1>
          </div>

          <div>
            <table className="table1">
              <tr>
                <td className="td-inicial">NOMBRE Y APELLIDOS CONTRATISTA</td>
                <td className="td-inicial2">Emerson Machado </td>
              </tr>

              <tr>
                <td className="td-inicial">CC/NIT</td>
                <td className="td-inicial2">88398893</td>
              </tr>

              <tr>
                <td className="td-inicial">IDENTIFICACION FISCAL</td>
                <td className="td-inicial2">1600001270</td>
              </tr>

              <tr>
                <td className="td-inicial">DIRECCIÓN</td>
                <td className="td-inicial2">Diagonal 61 #44-65</td>
              </tr>

              <tr>
                <td className="td-inicial">TELÉFONOS</td>
                <td className="td-inicial2">3022167733</td>
              </tr>

              <tr>
                <td className="td-inicial">CORREO ELECTRÓNICO</td>
                <td className="td-inicial2">
                  emerson.machado@sapiencia.gov.co
                </td>
              </tr>

              <tr>
                <td className="td-inicial">
                  CUENTA BANCARIA <br /> (Clase, banco y número)
                </td>
                <td className="td-inicial2">
                  Cuenta de Ahorros Banco BBVA <br />
                  011154547841
                </td>
              </tr>
            </table>



            <h1 className="texto2 text-center mt-1 pb-2">
              POR LOS SIGUIENTES CONCEPTOS:
            </h1>

            <table className="table3 mt-2">
              <tr>
                <td className="td-inicial2">No. DE CONTRATO</td>
                <td >166 de 2023</td>
              </tr>

              <tr>
                <td className="td-inicial2">OBJETO DEL CONTRATO</td>
                <td className='leading-none'>
                  Prestación de servicios profesionales para la administración
                  de nube pública y privada, desarrollo, implementación y
                  puesta en marcha de aplicativos y demás. Esto con relación a
                  la Agencia de Educación Postsecundaria de Medellín. –
                  SAPIENCIA
                </td>
              </tr>

              <tr>
                <td className="td-inicial2">PERÍODO ADEUDADO</td>
                <td >Abril de 2023</td>
              </tr>

              <tr>
                <td className="td-inicial2">VALOR EN LETRAS</td>
                <td >
                  Cinco millones setecientos veintidós mil doscientos quince
                  pesos M/L
                </td>
              </tr>

              <tr>
                <td className="td-inicial2">VALOR EN NÚMEROS</td>
                <td >$ 5.722.215</td>
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
              modifico el parágrafo 2 del Art. 383 E.T, reglamentado por el
              Decreto 2231 de 2023 y los Art.1.2.4.1.17 y el 1.2.4.1.6 del DUR
              1625 de 2016, manifiesto bajo gravedad de juramento que en lo
              referente a la retención en la fuente me acojo a lo dispuesto en
              el artículo 383 del Estatuto Tributario y renuncio a solicitar
              costos y deducciones asociados al desarrollo d mi actividad
              económica en mi declaración de renta por el año 2024.
            </p>



            <p className="texto3 leading-none mb-10 ">
              Así mismo declaro que los ingresos obtenidos corresponden a
              honorarios y/o compensación por servicios personales por
              concepto de rentas de trabajo que no provienen de una relación
              laboral o legal y reglamentaria.
            </p>



            <p className="texto3">
              _________________________ <br /> Emerson Machado <br />{" "}
              CC.88398893
            </p>

          </div>

        </div>}
      </div>
      <Buttonpdf onClick={eventClick} />
    </div>
  );
};

export default CuentaDeCobro;
