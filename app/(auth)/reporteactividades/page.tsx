"use client";
import "@/app/miscss/reporteactivi.css";
import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import Buttonpdf from "@/app/libs/ui/Buttonpdf";
<<<<<<< HEAD
import Menu from "@/app/libs/ui/menu";
=======
>>>>>>> 849eda0dc40dc28243fabd8693194039399d0c61

const ReporteActividades = () => {
  const componentRef = useRef(null);
  const [nombreContratista, setNombreContratista] = useState<string | null>(null);
  const [documentoContratista, setDocumentoContratista] = useState<string | null>(null);
  const [objetoContrato, setObjetoContrato] = useState<string | null>(null);
  const [numeroContrato, setNumeroContrato] = useState<string | null>(null);
  const [actividades, setActividades] = useState<any[]>([]);

  const printDocument = () => {
    const input = componentRef.current;
    if (input) {
      const options = {
        margin: [10, 10, 10, 10],
        filename: "ReporteDeActividades.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, dpi: 600, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf().from(input).set(options).save();
    }
  };

  const hidden = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.display = "none";
    var buttons = document.querySelectorAll('[data-name="AddCommentsActivity"]');
    buttons.forEach((button) => {
      var ul = button.parentElement?.querySelector('ul');
      var li = ul?.querySelector('li')
      if (li) {
        button.classList.add('hidden');
      } else {
        ul?.parentElement?.parentElement?.classList.add('hidden');
      }
    });
  };

  const eventClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    hidden(e);
    printDocument();
  };

  const addInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    var input = e.currentTarget.parentElement?.firstChild as HTMLInputElement;
    var ul = e.currentTarget.parentElement?.querySelector('ul');
    if (input && ul) {
      if (input.classList.contains('hidden')) {
        input.classList.remove('hidden');
      } else {
        var comentario = input.value;
        if (comentario.trim() !== '') {
          var li = document.createElement('li');
          li.innerHTML = '&#8226; ' + comentario;
          ul.appendChild(li);
          input.value = '';
          input.classList.add('hidden');
        }
      }
    }
  };

  const datos = async (numeroContrato: any) => {
    try {
      const response = await fetch(`/api/reporteactividades?numeroContrato=${numeroContrato}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
<<<<<<< HEAD
        console.log(data)
=======
>>>>>>> 849eda0dc40dc28243fabd8693194039399d0c61
        setActividades(data.actividades);
        setNombreContratista(data.cobro.nombres);
        setDocumentoContratista(data.cobro.documento);
        setObjetoContrato(data.contrato.objeto_contrato);
        setNumeroContrato(data.contrato.numero_contrato);
      } else {
        console.error('Error en la solicitud:', response.statusText);
      }
    } catch (error) {
      console.error('Error al solicitar los bancos:', error);
    }
  };

  const formattedDate = new Date().toLocaleDateString('es-ES');

  const searchContrato = () => {
    let inputNumeroContrato = document.getElementById('inputNumeroContrato') as HTMLInputElement;
    datos(inputNumeroContrato.value);
  };

  return (
    <div>
<<<<<<< HEAD
      
      <Menu/>

      <div className="flex items-center justify-center space-x-9 mt-1 mb-1">
        <input placeholder="Digite el numero de contrato" id="inputNumeroContrato" type="number" className="block p-2.5 w-60 z-20 text-sm rounded-lg text-gray-900 bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"  required />
        <button className="focus:outline-none text-white bg-fuchsia-800  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-1 mt-1 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" onClick={searchContrato}>Buscar Contrato</button>
      </div>

      <div ref={componentRef}>
        <div className="container">
          <table className="mb-5">
            <tr>
              <td className="td1">
                REPORTE DE ACTIVIDADES PARA SERVICIO DE APOYO A LA GESTIÓN
              </td>
              <td className="td11">Página 1 de 2 </td>
            </tr>
          </table>

          <table className="table1 mb-6">
            <tr>
              <td className="td2">Informe Número</td>
              <td className="td22" colSpan={4}>
                Nro. 01
              </td>
            </tr>
            <tr>
              <td className="td2">Fecha</td>
              <td className="td22" colSpan={4}>
                {formattedDate}
              </td>
            </tr>
            <tr>
              <td className="td2">Dependencia o proceso:</td>
              <td className="td22" colSpan={4}>
                SUBDIRECCIÓN ADMINSITRATIVA FINAICERA YD E APOYO A LA GESTIÓN / TI
              </td>
            </tr>
            <tr>
              <td className="td2">Nombre Contratista:</td>
              <td className="td23">{nombreContratista}</td>
              <td className="td24">Documento de identidad:</td>
              <td className="td24">{documentoContratista}</td>
            </tr>
            <tr>
              <td className="td2">Objeto del contrato:</td>
              <td className="td22" colSpan={4}>
                {objetoContrato}
              </td>
            </tr>
            <tr>
              <td className="td2">Número del contrato:</td>
              <td className="td22">{numeroContrato}</td>
              <td className="td24">Periodo reportado:</td>
              <td className="td24">Junio de 2023</td>
            </tr>
          </table>

=======
      <div className="w-2/3 flex justify-center space-x-4 mx-auto items-center mt-4">
        <input placeholder="Digite el numero de contrato" id="inputNumeroContrato" type="number" className="block w-1/4 mb-5 rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
        <button className="bg-red-500 rounded-xl text-white border-solid border-black border-2 p-2" onClick={searchContrato}>Buscar Contrato</button>
      </div>
      <div ref={componentRef}>
        <div className="container">
          <table className="mb-5">
            <tr>
              <td className="td1">
                REPORTE DE ACTIVIDADES PARA SERVICIO DE APOYO A LA GESTIÓN
              </td>
              <td className="td11">Página 1 de 2 </td>
            </tr>
          </table>

          <table className="table1 mb-6">
            <tr>
              <td className="td2">Informe Número</td>
              <td className="td22" colSpan={4}>
                Nro. 01
              </td>
            </tr>
            <tr>
              <td className="td2">Fecha</td>
              <td className="td22" colSpan={4}>
                {formattedDate}
              </td>
            </tr>
            <tr>
              <td className="td2">Dependencia o proceso:</td>
              <td className="td22" colSpan={4}>
                SUBDIRECCIÓN ADMINSITRATIVA FINAICERA YD E APOYO A LA GESTIÓN / TI
              </td>
            </tr>
            <tr>
              <td className="td2">Nombre Contratista:</td>
              <td className="td23">{nombreContratista}</td>
              <td className="td24">Documento de identidad:</td>
              <td className="td24">{documentoContratista}</td>
            </tr>
            <tr>
              <td className="td2">Objeto del contrato:</td>
              <td className="td22" colSpan={4}>
                {objetoContrato}
              </td>
            </tr>
            <tr>
              <td className="td2">Número del contrato:</td>
              <td className="td22">{numeroContrato}</td>
              <td className="td24">Periodo reportado:</td>
              <td className="td24">Junio de 2023</td>
            </tr>
          </table>

>>>>>>> 849eda0dc40dc28243fabd8693194039399d0c61
          <table className="table3 mb-5">
            <tr>
              <td className="tdd bg-zinc-400 text-center font-black">ITEM</td>
              <td className="bg-zinc-400 text-center font-black">Actividades Desarrolladas en el marco de las obligaciones contractuales</td>
            </tr>
            
            {actividades.map((actividad, index) => (
            <React.Fragment key={actividad.id}>
              <tr>
                <td className="align-top pt-8">{index + 1}</td>
                <td>{actividad.objeto_contractual}</td>
              </tr>
              <tr>
                <td></td>
                <td data-name="comentario">
                  <input type="text" className="  text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-50% p-2.5 dark:bg-gray-100  dark:placeholder-gray-800  dark:focus:ring-blue-500 dark:focus:border-blue-500 hidden border-solid border-2 border-black mb-2 mt-4" />
                  <ul></ul>
                  <button
                    onClick={addInput} data-name="AddCommentsActivity"
                    className="text-white mt-4 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  >
                    agregar
                  </button>
                </td>
              </tr>
            </React.Fragment>
            ))}
          </table>

          <p className="mb-10">
            Certifico bajo gravedad de juramento que la información consignada en este informe verídica y esta soportada de manera física y en medio magnético, y podrá ser confirmada por la entidad contratante.
          </p>

          <p>
            Firma_________________________ <br /> Nombre: {nombreContratista} <br />
<<<<<<< HEAD
            {documentoContratista}3
=======
            {documentoContratista}
>>>>>>> 849eda0dc40dc28243fabd8693194039399d0c61
          </p>
        </div>
        <Buttonpdf onClick={eventClick} />
      </div>
    </div>
  );
};

export default ReporteActividades;