"use client";
import '@/app/miscss/reporteactivi.css';
import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import Buttonpdf from '@/app/libs/ui/Buttonpdf';


const ReporteActividades = () => {
    const componentRef = useRef<HTMLDivElement>(null);
  
    const printDocument = () => {
      const input = componentRef.current;
      if (input) {
        const options = {
          margin: [10, 10, 10, 10], // Margen de 10 mm en todos los lados
          filename: 'ReporteDeActividades.pdf',
          image: { type: 'jpeg', quality: 1 }, // Usando JPEG con la máxima calidad
          html2canvas: { scale: 2, dpi: 600, letterRendering: true }, // Escala y DPI aumentados
          jsPDF: { unit: 'mm', format: 'legal', orientation: 'portrait' }
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
    return (
      <div  ref={componentRef}>
        {<div className='container'>
        <table>
            <tr>
                <td className='td1'>REPORTE DE ACTIVIDADES PARA SERVICIO DE APOYO A LA GESTIÓN</td>
                <td className='td11'>Página 1 de 2 </td>
            </tr>
        </table>
        <br />
        <table className='table1'>
            <tr>
                <td className='td2'>Informe Número</td>
                <td className='td22'>Nro. 01</td>
            </tr>
            <tr>
                <td className='td2'>Fecha</td>
                <td className='td22'>Junio de 2023</td>
            </tr>
            <tr>
                <td className='td2'>Dependencia o proceso:</td>
                <td className='td22'>SUBDIRECCIÓN ADMINSITRATIVA FINAICERA YD E APOYO A LA GESTIÓN / TI</td>
            </tr>
            <tr>
                <td className='td2'>Nombre Contratista:</td>
                <td className='td23'>Emerson	Bolney Machado Cordoba</td>
                <td className='td23'>Documento de identidad:</td>
                <td>71210748</td>
            </tr>
            <tr>
                <td className='td2'>Objeto del contrato:</td>
                <td className='td22'>Prestación de servicios profesionales para la administración de nube pública y privada, 
                    desarrollo, implementación y puesta en marcha de aplicativos y demás. 
                    Esto con relación a la Agencia de Educación Postsecundaria de Medellín. 
                    – SAPIENCIA
                </td>
            </tr>
            <tr>
                <td className='td2'>Número del contrato:</td>
                <td className='td22'>380 DE 2023</td>
                <td>Periodo reportado:</td>
                <td>Junio de 2023</td>
            </tr>
        </table>
    </div>}
        <Buttonpdf onClick={eventClick} />
      </div>
    );
  };
  
  export default ReporteActividades;


