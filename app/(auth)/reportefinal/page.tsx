"use client";
import "@/app/miscss/reporteactivi.css";
import React, { useRef, useState, useEffect, createElement } from "react";
import 'react-toastify/ReactToastify.css'
import { ToastContainer, ToastPosition, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Buttonpdf from "@/app/libs/ui/Buttonpdf";
import Menu from "@/app/libs/ui/menu";
import FirmaComponent from "../src/components/FirmaComponent";
import html2pdf from 'html2pdf.js';

const ReporteActividades = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<{ [key: number]: string[] }>({});
  const [nombreContratista, setNombreContratista] = useState<string | null>(null);
  const [documentoContratista, setDocumentoContratista] = useState<string | null>(null);
  const [objetoContrato, setObjetoContrato] = useState<string | null>(null);
  const [numeroContrato, setNumeroContrato] = useState<string | null>(null);
  const [numeroInforme, setNumeroInforme] = useState<string | null>(null);
  const [dependencia, setDependencia] = useState<string | null>(null);
  const [actividades, setActividades] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<{ [key: number]: string[] }>({});
  const [hiddenButtons, setHiddenButtons] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);

  const waitForImagesToLoad = (images: HTMLImageElement[]): Promise<void> => {
    return new Promise((resolve) => {
      let loadedImages = 0;
      images.forEach(image => {
        if (image.complete) {
          loadedImages++;
          if (loadedImages === images.length) {
            resolve();
          }
        } else {
          image.onload = () => {
            loadedImages++;
            if (loadedImages === images.length) {
              resolve();
            }
          };
        }
      });
    });
  };
  const measurePageHeight = () => {
    // Selecciona todos los tbody dentro de las tablas en el componente
    const tableTbody = componentRef.current ? componentRef.current.querySelectorAll<HTMLTableSectionElement>('table tbody') : null;

    if (!tableTbody || !tableTbody[2]) {
      console.error("No se encontró el tbody específico.");
      return;
    }
    const height = tableTbody[2].offsetHeight;
    console.log("Altura del tbody:", height);
    const pixelPosition = 520;
    const elementAtPixel = getElementAtPixel(pixelPosition, tableTbody[2]);

    if (elementAtPixel) {
      console.log("Etiqueta en el pixel", pixelPosition, ":", elementAtPixel.tagName);
    } else {
      console.log("No se encontró ningún elemento en el pixel", pixelPosition);
    }
  };
  const getElementAtPixel = (pixelPosition: number, tableTbody: HTMLTableSectionElement): HTMLElement | null => {
    if (tableTbody) {
      const elements = tableTbody.querySelectorAll<HTMLElement>("*");

      for (let element of elements) {
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;

        console.log(`Elemento ${element.tagName} - Top: ${elementTop}, Bottom: ${elementBottom}`);

        // Verificar si el pixelPosition está dentro de este elemento
        if (pixelPosition >= elementTop && pixelPosition <= elementBottom) {
          const diferenciaPos = (pixelPosition - elementTop) - 20;
          console.log("Diferencia con la posición inicial:", diferenciaPos);

          // Crear los <br> antes y después del trSeparator
          const brBefore = document.createElement('br');
          const brAfter = document.createElement('br');

          // Crear el tr que servirá como separador
          const trSeparator = document.createElement('tr');
          const tdElementSeparator = document.createElement('td');

          // Asignar la altura directamente al estilo en línea
          tdElementSeparator.classList.add('col-span-2', 'border-0', 'p-0');
          tdElementSeparator.style.height = `${diferenciaPos}px`;
          trSeparator.appendChild(tdElementSeparator);

          // Crear el tr y td que contendrá el reporte
          const trElement = document.createElement('tr');
          const tdElement = document.createElement('td');
          tdElement.classList.add('td1');
          tdElement.setAttribute('colspan', '2');
          tdElement.textContent = 'REPORTE DE ACTIVIDADES PARA SERVICIO DE APOYO A LA GESTIÓN';

          // Agregar el td al tr
          trElement.appendChild(tdElement);

          // Verificar que el elemento y su parentElement son válidos
          if (element.parentElement) {
            // Insertar el <br> antes del trSeparator
            element.parentElement.insertBefore(brBefore, element);

            // Insertar el trSeparator y el tr con el reporte
            element.parentElement.insertBefore(trSeparator, element);
            element.parentElement.insertBefore(trElement, element);

            // Insertar el <br> después del trSeparator
            element.parentElement.insertBefore(brAfter, trElement.nextSibling);
          }

          console.log("Elemento encontrado en el pixel", pixelPosition, ":", element);
          return element;
        }
      }
    }
    return null;
  };
  const printDocument = async () => {
    if (componentRef.current) {
      setLoading(true);
      setIsPdfGenerating(true);
      const button = document.querySelector('.pdf-button');
      if (button) button.remove();

      const input = componentRef.current;
      const options = {
        margin: [10, 10, 10, 10],
        filename: "ReporteDeActividades.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, dpi: 600, letterRendering: true, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(input).set(options).save().then(() => {
        setLoading(false);
        setIsPdfGenerating(false);
        if (button) document.querySelector('.pdf-container')?.appendChild(button);
      }).catch(() => {
        setLoading(false);
        setIsPdfGenerating(false);
        if (button) document.querySelector('.pdf-container')?.appendChild(button);
      });
    }
  };

  const handlePdfGeneration = () => {
    printDocument();
    const dataToSave = {
      numeroInforme: numeroInforme,
      comments: comments,
      selectedImages: selectedImages,
    };
    const jsonData = JSON.stringify(dataToSave);
    localStorage.setItem('ReporteActividad', jsonData);
  };

  const addInput = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const input = e.currentTarget.parentElement?.firstChild as HTMLInputElement;
    const ul = e.currentTarget.parentElement?.querySelector('ul');
    if (input && ul) {
      if (input.classList.contains('hidden')) {
        input.classList.remove('hidden');
      } else {
        const comentario = "• " + input.value;
        if (comentario.trim() !== '') {
          setComments(prev => {
            const updatedComments = [...(prev[index] || []), comentario];
            return {
              ...prev,
              [index]: updatedComments
            };
          });

          input.value = '';
          input.classList.add('hidden');
        }
      }
    }
  };
  const editComment = (index: number, comment: string) => {
    const input = document.getElementById(`editInput${index}`) as HTMLInputElement;
    if (input) {
      input.value = comment;
      input.classList.remove('hidden');
      input.dataset.originalComment = comment; // Guardar el comentario original
    }
  };

  const deleteComment = (index: number, comment: string) => {
    setComments(prev => {
      const updatedComments = prev[index].filter(c => c !== comment);
      return {
        ...prev,
        [index]: updatedComments
      };
    });
  };

  const saveComment = (index: number) => {
    const input = document.getElementById(`editInput${index}`) as HTMLInputElement;

    if (input) {
      const newComment = input.value;
      setComments(prev => {
        if (!prev[index]) {
          showMessage({ title: 'Error', cuerpo: `No se puede guardar un comentario en blanco  ${nombreContratista}` });
          return prev;
        }
        const updatedComments = prev[index].map(c =>
          (c === input.dataset.originalComment ? newComment : c)
        );
        return {
          ...prev,
          [index]: updatedComments
        };
      });
      input.classList.add('hidden');
    }
  };

  const handleButtonClick = (index: number) => {
    const input = document.getElementById(`fileInput${index}`) as HTMLInputElement;
    input?.click();
  };

  const handleImageUpload = (index: number) => {
    const input = document.getElementById(`fileInput${index}`) as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const files = Array.from(input.files);
      const newImages = files.map(file => {
        const reader = new FileReader();
        return new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImages).then(results => {
        setSelectedImages(prev => {
          const updatedImages = [...(prev[index] || []), ...results].slice(0, 3); // Máximo de 3 imágenes
          return {
            ...prev,
            [index]: updatedImages
          };
        });

        setHiddenButtons(prev => ({
          ...prev,
          [index]: results.length >= 3 // Si ya hay 3 imágenes o más
        }));
      });
    }
  };

  const removeImage = (index: number, imageIndex: number) => {
    setSelectedImages(prev => {
      const updatedImages = prev[index].filter((_, idx) => idx !== imageIndex);
      return {
        ...prev,
        [index]: updatedImages
      };
    });
  };

  const datos = async (numeroContrato: any) => {
    try {
      const response = await fetch(`/api/reporteactividades?numeroCedula=${numeroContrato}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActividades(data.actividades);
        setNombreContratista(data.cobro.nombres + " " + data.cobro.apellidos);
        setDocumentoContratista(data.cobro.documento);
        setObjetoContrato(data.contrato.objeto_contrato);
        setNumeroContrato(data.contrato.numero_contrato);
        setDependencia(data.contrato.dependencia);
      } else {
        console.error('Error en la solicitud:', response.statusText);
      }
    } catch (error) {
      console.error('Error al solicitar los bancos:', error);
    }
  };

  const formattedDate = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
    .format(new Date())
    .toLowerCase()
    .replace(/^\w/, c => c.toUpperCase())
    .replace(/\s+de\s+/, ' ');

  const searchContrato = () => {
    const inputNumeroContrato = document.getElementById('inputNumeroContrato') as HTMLInputElement;
    datos(inputNumeroContrato.value);
  };
  const showMessage = (data: any) => {
    if (data.title === "Error") {
      toast.error(data.cuerpo, { position: 'top-right' as ToastPosition });
    } else {
      toast.success(data.cuerpo, { position: 'top-right' as ToastPosition });
    }
  };
  useEffect(() => {
    const usuarioString = window.localStorage.getItem('user');

    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        if (usuario && usuario.cedula) {
          (document.getElementById("inputNumeroContrato") as HTMLInputElement).value = usuario.cedula;
          searchContrato()
        } else {
          showMessage({ title: 'Error', cuerpo: 'No se encontró cédula en los datos del usuario.' });
        }
      } catch (error) {
        showMessage({ title: 'Error', cuerpo: 'Error al procesar los datos del usuario.' });
      }
    } else {
      window.location.href = '/login';
    }
    const jsonData = localStorage.getItem('ReporteActividad');
    if (jsonData) {
      const data = JSON.parse(jsonData);
      setNumeroInforme(data.numeroInforme);
      setComments(data.comments);
      setSelectedImages(data.selectedImages);
    }
  }, []);

  return (
    <div className="bg-gray-100">
      <Menu />
      <button onClick={measurePageHeight}>Apretar aqui</button>
      <div className="flex items-center justify-center space-x-9 mt-1 mb-1 hidden">
        <input
          placeholder="Digite el número de contrato"
          id="inputNumeroContrato"
          type="number"
          className="block p-2.5 w-60 z-20 text-sm rounded-lg text-gray-900 bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          required
        />
        <button
          className="focus:outline-none text-white bg-fuchsia-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-1 mt-1 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          onClick={searchContrato}
        >
          Buscar Contrato
        </button>
      </div>
      <div ref={componentRef} className="pdf-container">
        <div className="container">
          <table className="mb-5">
            <tbody>
              <tr>
                <td className="td1">
                  REPORTE FINAL PARA SERVICIO DE APOYO A LA GESTIÓN
                </td>

              </tr>
            </tbody>
          </table>

          <table className="table1 mb-6">
            <tbody>
              <tr>
              <td className="td2">Informe Número</td>
                <td className="td22" colSpan={4} id="informeNro">
                  FINAL
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
                  {dependencia}
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
                <td className="td22">
                  {numeroContrato} de {formattedDate}
                </td>
                <td className="td24">Periodo reportado:</td>
                <td className="td24">
                  <p className="mb-0 h-6">Desde</p> <input type="Date" className="border-none mt-0  h-6" />
                  <p className="mb-0 h-6"> Hasta</p> <input type="Date" className="border-none mt-0 h-6 " />
                </td>
              </tr>
            </tbody>
          </table>
          <table className="table3 mb-5">
            <tbody>
              <tr>
                <td className="tdd bg-zinc-400 text-center font-black">ITEM</td>
                <td className="bg-zinc-400 text-center font-black">
                  Actividades Desarrolladas en el marco de las obligaciones contractuales
                </td>
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
                      <textarea
                        id={`editInput${index}`}
                        data-original-comment=""
                        className={`text-gray-800 w-full text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-50% p-2.5 dark:bg-gray-100 dark:placeholder-gray-800 dark:focus:ring-blue-500 dark:focus:border-blue-500 hidden border-solid border-2 border-black mb-2 mt-4 ${isPdfGenerating ? 'hidden' : ''}`}
                      />
                      <ul>
                        {comments[index]?.map((comment, commentIndex) => (
                          <li key={commentIndex}>
                            <span>{comment}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                  <ToastContainer />
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <p className="mb-10">
            Certifico bajo gravedad de juramento que la información consignada en este informe es verídica y está soportada de manera física y en medio magnético, y podrá ser confirmada por la entidad contratante.
          </p>
          <div>
            <FirmaComponent />
          </div>
          <p>
            Firma_________________________ <br /> Nombre: {nombreContratista} <br />
            {documentoContratista}
          </p>
        </div>
        <div className="pdf-container">
          <Buttonpdf onClick={handlePdfGeneration} className="pdf-button" />
        </div>
      </div>
    </div>

  );
};

export default ReporteActividades;