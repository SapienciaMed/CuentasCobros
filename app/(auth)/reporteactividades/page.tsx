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
    return (
      <div  ref={componentRef}>
        {<div className='container'>
        <table className='mb-5'>
            <tr>
                <td className='td1'>REPORTE DE ACTIVIDADES PARA SERVICIO DE APOYO A LA GESTIÓN</td>
                <td className='td11'>Página 1 de 2 </td>
            </tr>
        </table>
        
        <table className='table1 mb-6'>
            <tr>
                <td className='td2'>Informe Número</td>
                <td className='td22'colSpan={4}>Nro. 01</td>
            </tr>
            <tr>
                <td className='td2'>Fecha</td>
                <td className='td22'colSpan={4}>Junio de 2023</td>
            </tr>
            <tr>
                <td className='td2'>Dependencia o proceso:</td>
                <td className='td22'colSpan={4}>SUBDIRECCIÓN ADMINSITRATIVA FINAICERA YD E APOYO A LA GESTIÓN / TI</td>
            </tr>
            <tr>
                <td className='td2'>Nombre Contratista:</td>
                <td className='td23' >Emerson	Bolney Machado Cordoba</td>
                <td className='td24'>Documento de identidad:</td>
                <td className='td24'>71210748</td>
            </tr>
            <tr>
                <td className='td2'>Objeto del contrato:</td>
                <td className='td22'colSpan={4}>Prestación de servicios profesionales para la administración de nube pública y privada, 
                    desarrollo, implementación y puesta en marcha de aplicativos y demás. 
                    Esto con relación a la Agencia de Educación Postsecundaria de Medellín. 
                    – SAPIENCIA
                </td>
            </tr>
            <tr>
                <td className='td2'>Número del contrato:</td>
                <td className='td22'>380 DE 2023</td>
                <td className='td24'>Periodo reportado:</td>
                <td className='td24'>Junio de 2023</td>
            </tr>
        </table>
       
        <table className='table3 mb-5'>
            <tr>
                <td className='tdd bg-zinc-400 text-center font-black'>ITEM</td>
                <td className=' bg-zinc-400 text-center font-black'>Actividades Desarrolladas en el marco de las obligaciones contractuales</td>
            </tr>
            <tr>
                <td className='text-center'>1</td>
                <td>Administración de las bases de datos, los archivos y el Sistema de Información de la estrategia TIC, 
                    en lo relacionado con los procesos propios del objeto del contrato, con énfasis en los proyectos SIIS, 
                    Isolucion, Mercurio, y demás que se requieran, para la administración, manejo y soporte de la infraestructura 
                    en la nube Google Cloud, permitiendo una óptima sistematización de la información.
                </td>
            </tr>
            <tr>
                <td className='text-center'></td>
                <td><ul>
                    <li>Se realiza el despliegue de las vistas de sygmatech</li>
                    <li>Se realiza el cargue de 16784 facturas correspondientes al mes de junio </li>
                    <li>Se realiza la creación de 16784 urls de las facturas del mes de junio</li>
                    <li>Se crean 12 nuevos perfiles de usuario en el aplicativo SIIS.</li>
                    <li>Se crea cuenta github sapiencia para manejar los repositorios de los </li>
                    <li>módulos de automatización por parte i4digital</li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td className='text-center'>2</td>
                <td>Elaborar o actualizar los manuales técnicos, de usuario y los que se consideren necesarios,
                    siguiendo los estándares definidos en los procedimientos del área de TI, de las aplicaciones 
                    desarrolladas, que se desarrollen o mejoren durante la ejecución del contrato.
                </td>
            </tr>
            <tr>
                <td className='text-center'></td>
                <td>No se realiza en este mes</td>
            </tr>
            <tr>
                <td className='text-center'>3</td>
                <td>Participar en los procesos del sistema de información a través del acompañamiento, 
                    orientación y atención de los requerimientos generados por las diferentes dependencias de la Agencia,
                    relacionados con Minotauro, SIIS, Isolucion, Mercurio, y la administración, manejo y soporte de la infraestructura en la 
                    nube GoogleCloud u otro nuevo desarrollo y/o aplicación.
                </td>
            </tr>
            <tr>
                <td className='text-center'></td>
                <td><ul>
                    <li>Se apoya al área de planeación en la respuesta para control interno, con respecto al
                         proceso que ayudara a mitigar la amenaza de que ISOLUCION deje de funcionar.
                    </li>
                    <li>Se crea el borrador del proceso de disaster recover, que permitirá mantener 
                        el aplicativo Isolucion funcionando en caso de una caída no controlada.
                    </li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td className='text-center'>4</td>
                <td>Definir con el líder de TI el alcance del sistema de información que se desea desarrollar, 
                    definir la metodología de desarrollo de software sea para licitar o para desarrollo in-house, 
                    así como buenas prácticas para el levantamiento de requisitos y estándares de documentación.
                </td>
            </tr>
            <tr>
                <td className='text-center'>5</td>
                <td>Administrar los servidores de la Agencia, gestionar la creación de los nuevos usuarios
                    para uso y manejo de los aplicativos con las configuraciones y los perfiles que se requiera, 
                    garantizando su adecuada operación.
                </td>
            </tr>
            <tr>
                <td className='text-center'></td>
                <td>
                    <ul>
                        <li>Se realiza el despliegue de los controladores de sygmatech</li>
                        <li>Se realiza el cargue de 16784 facturas correspondientes al mes de junio </li>
                        <li>Se realiza la creación de 16784 urls de las facturas del mes de </li>
                        <li>Se crean 12 nuevos perfiles de usuario en el aplicativo SIIS.</li>
                        <li>Se crea cuenta github sapiencia para manejar los repositorios de los módulos de automatización por parte i4digital</li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td className='text-center'>6</td>
                <td>Participar con el acompañamiento a la Agencia en las diferentes aplicaciones
                    y plataformas que sean desarrollados por proveedores externos.
                </td>
            </tr>
            <tr>
                <td className='text-center'></td>
                <td>
                    <ul>
                        <li>•	Se apoya al personal de soporte técnico de Isolucion en resolver el problema que se tenía con
                             el correo electrónico configurado en el servidor de aplicaciones.
                        </li>
                        <li>•	Se apoya al gerente de proyectos de la empresa i4digital en la levantacion de requerimiento con
                             todas las áreas de la agencia, para la automatización de los procesos
                        </li>
                        <li>•	Se crean los repositorios del código fuente donde se alamacenaran y versionaran los códigos fuentes
                             de los modulos creados por i4digital durante la automatización.
                        </li>
                        <li>•	Se crea pipeline para el desarrollo de las pruebas unitarias y despligues de los códigos fuentes de
                             la automatización 
                        </li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td className='text-center'>7</td>
                <td>Apoyar al Departamento Técnico de Fondos y las IES con las herramientas tecnológicas
                    desarrolladas y con los requerimientos de mejoras o nuevos desarrollos.
                </td>
            </tr>
            <tr>
                <td className='text-center'></td>
                <td>Administración de los servidores de Fondos Convocatoria en la nube GCP.
                    Se realiza ajustes a la carpeta compartida de las IES para el cargue del
                     archivo Excel que envía las universidades EAFIT y UPB
                </td>
            </tr>
            <tr>
                <td className='text-center'>8</td>
                <td>Gestionar la documentación de procedimientos, manuales, instructivos, formatos y demás documentos
                     que tengan relación con las actividades del proceso al cual apoya, conforme a los
                     lineamientos del sistema de gestión de la calidad de la Agencia de educación Postsecundaria-Sapiencia
                </td>
            </tr>
            <tr>
                <td className='text-center'></td>
                <td>
                    <ul>
                        <li>Se realiza la entrega y socialización del aplicativo Gestión Humana</li>
                        <li>Se realiza 7 procedimientos para el desarrollo de software Se continúa con
                             la documentación del proceso de desarrollo que estaremos pasando al área de 
                             calidad y que da cumplimiento a lo reportado en el FURAG 2021.
                        </li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td className='text-center'>9</td>
                <td>Apoyar en los diferentes procesos de contratación o adquisición relacionados con el área de sistemas de información.</td>
            </tr>
            <tr>
                <td className='text-center'></td>
                <td>Se participa en el comité de contratación en el cual se revisa la contratación de la nube publica,
                     en este se interviene y se explica por qué la necesidad de la contratación de la nube publica
                </td>
            </tr>
            <tr>
                <td className='text-center'>10</td>
                <td>Organizar, conservar y transferir al área de Gestión Documental los documentos que produce
                     en desarrollo de sus obligaciones, según el listado maestro de documentos y los tiempos establecidos
                    por las Tablas de Retención Documental.
                </td>
            </tr>
            <tr>
                <td className='text-center'></td>
                <td>
                    <ul>
                        <li>•	Se capacita al Ingeniero Carlos Villegas en la creación de las Urls para
                             el cargue masivo de facturas, resoluciones, Cartas de amortización y paz y salvos.
                        </li>
                        <li>•	Se realiza el cargue masivo de la paz y salvos.</li>
                        <li>•	Se realiza el cargue masivo de las solicitudes de cartera.</li>
                        <li>•	Se configura el servidor SFTP en perfil de encapsulación para que
                             los usuarios de las IES solo tengan acceso a la información correspondiente
                              a sus propias universidades
                        </li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td className='text-center'>11</td>
                <td>Organizar, conservar y transferir al área de Gestión Documental los documentos que produce 
                    en desarrollo de sus obligaciones, según el listado maestro de documentos y los tiempos establecidos
                    por las Tablas de Retención Documental.
                </td>
            </tr>
            <tr>
                <td className='text-center'>12</td>
                <td>Cumplir con las obligaciones de su contrato, de conformidad con las reglas de la buena fe, diligencia
                    y comprometiéndome a NO compartir, ni divulgar información registrada en las bases de datos, ni formatos
                    a agentes externos a la Agencia, además ejercer las obligaciones contractuales dentro del marco de la Política de
                    Tratamiento de Datos de la Entidad, además, el deber que le asiste como contratista público de actuar en estos casos
                    de conformidad con lo dispuesto en la Ley Estatutaria 1581 del 17 de octubre de 2012, reglamentada parcialmente por el
                     Decreto 1377 de 2013, que establece las disposiciones generales para la protección de datos personales.
                </td>
            </tr>
            <tr>
                <td className='text-center'>13</td>
                <td>Asistir a reuniones, capacitaciones o eventos de representación internas y/o interinstitucionales, que le sean
                    programadas y donde sea requerido para el conocimiento de la gestión de la Agencia o para asuntos relacionados
                    con el contrato.
                </td>
            </tr>
            <tr>
                <td className='text-center'>14</td>
                <td>Para realizar y ejecutar las obligaciones contractuales, el contratista deberá disponer de su capacidad para
                    prestar el servicio en los términos establecidos por la Agencia, en atención a los mecanismos, instrumentos,
                    canales, sedes y horarios habilitados para la atención.
                </td>
            </tr>
        </table>
        
        <p className='mb-10'>Certifico bajo gravedad de juramento que la información consignada en este informe verídica y esta soportada de manera
             física y en medio magnético, y podrá ser confirmada por la entidad contratante.
        </p>
     
        <p> Firma_________________________ <br /> Nombre: Nombre Emerson Bolney Machado  <br />
            CC.88398893</p>
    </div>}
        <Buttonpdf onClick={eventClick} />
      </div>
    );
  };
  
  export default ReporteActividades;


