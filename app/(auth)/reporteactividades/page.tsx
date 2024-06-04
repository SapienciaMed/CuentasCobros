"use client";
import "@/app/miscss/reporteactivi.css";
import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import Buttonpdf from "@/app/libs/ui/Buttonpdf";
import { log } from "console";

const ReporteActividades = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [actividades, setActividades] = useState<any[]>([]);
  useEffect(() => {
    const actividadesDesdeBD = [
      {
        id: 1,
        descripcion:
          "Administración de las bases de datos, los archivos y el Sistema de Información de la estrategia TIC, en lo relacionado con los procesos propios del objeto del contrato, con énfasis en los proyectos SIIS, Isolucion, Mercurio, y demás que se requieran, para la administración, manejo y soporte de la infraestructura en la nube Google Cloud, permitiendo una óptima sistematización de la información.",
      },
      {
        id: 2,
        descripcion:
          'Administración de las bases de datos, los archivos y el Sistema de Información de la estrategia TIC, en lo relacionado con los procesos propios del objeto del contrato, con énfasis en los proyectos SIIS, Isolucion, Mercurio, y demás que se requieran, para la administración, manejo y soporte de la infraestructura en la nube Google Cloud, permitiendo una óptima sistematización de la información.'
      }
      
    ];

    setActividades(actividadesDesdeBD);
  }, []);

  const printDocument = () => {
    const input = componentRef.current;
    if (input) {
      const options = {
        margin: [10, 10, 10, 10], // Margen de 10 mm en todos los lados
        filename: "ReporteDeActividades.pdf",
        image: { type: "jpeg", quality: 1 }, // Usando JPEG con la máxima calidad
        html2canvas: { scale: 2, dpi: 600, letterRendering: true }, // Escala y DPI aumentados
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
        ul.parentElement?.parentElement?.classList.add('hidden');
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
            if (comentario.trim() !== '') { // Ensure comment is not empty
                var li = document.createElement('li');
                li.innerHTML = '&#8226; ' + comentario; // Adding bullet point (•) before the comment
                ul.appendChild(li);
                input.value = '';
                input.classList.add('hidden');
            }
        }
    }
}


  return (
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
              Junio de 2023
            </td>
          </tr>
          <tr>
            <td className="td2">Dependencia o proceso:</td>
            <td className="td22" colSpan={4}>
              SUBDIRECCIÓN ADMINSITRATIVA FINAICERA YD E APOYO A LA GESTIÓN /
              TI
            </td>
          </tr>
          <tr>
            <td className="td2">Nombre Contratista:</td>
            <td className="td23">Emerson Bolney Machado Cordoba</td>
            <td className="td24">Documento de identidad:</td>
            <td className="td24">71210748</td>
          </tr>
          <tr>
            <td className="td2">Objeto del contrato:</td>
            <td className="td22" colSpan={4}>
              Prestación de servicios profesionales para la administración de
              nube pública y privada, desarrollo, implementación y puesta en
              marcha de aplicativos y demás. Esto con relación a la Agencia de
              Educación Postsecundaria de Medellín. – SAPIENCIA
            </td>
          </tr>
          <tr>
            <td className="td2">Número del contrato:</td>
            <td className="td22">380 DE 2023</td>
            <td className="td24">Periodo reportado:</td>
            <td className="td24">Junio de 2023</td>
          </tr>
        </table>

        <table className="table3 mb-5">
          <tr>
            <td className="tdd bg-zinc-400 text-center font-black">ITEM</td>
            <td className="bg-zinc-400 text-center font-black">Actividades Desarrolladas en el marco de las obligaciones contractuales</td>
          </tr>
          {actividades.map((actividad) => (
            <React.Fragment key={actividad.id}>
              <tr>
                <td className="align-top pt-8">{actividad.id}</td>
                <td>{actividad.descripcion}</td>
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
          Certifico bajo gravedad de juramento que la información consignada en
          este informe verídica y esta soportada de manera física y en medio
          magnético, y podrá ser confirmada por la entidad contratante.
        </p>

        <p>
          Firma_________________________ <br /> Nombre: Nombre Emerson Bolney
          Machado <br />
          CC.88398893
        </p>
      </div>
      <Buttonpdf onClick={eventClick} />
    </div>
  );
};

export default ReporteActividades;