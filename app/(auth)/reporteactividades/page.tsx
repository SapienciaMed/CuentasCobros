"use client";
import "@/app/miscss/reporteactivi.css";
import React, { useRef, useState, useEffect, createElement } from "react";
import "react-toastify/ReactToastify.css";
import { ToastContainer, ToastPosition, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Buttonpdf from "@/app/libs/ui/Buttonpdf";
import Menu from "@/app/libs/ui/menu";
import FirmaComponent from "../src/components/FirmaComponent";
import html2pdf from "html2pdf.js";

const ReporteActividades = () => {
  type ImageType = {
    name: string;
    data: string;
    id: number;
    id_actividad: number;
  };

  type CommentType = {
    id: number | null;
    objeto: string;
  };

  type ActivityDataType = {
    id: number;
    comentario: CommentType[];
    imagen: ImageType[];
  };

  const componentRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<{ [key: number]: CommentType[] }>(
    {}
  );
  const [nombreContratista, setNombreContratista] = useState<string | null>(
    null
  );
  const [documentoContratista, setDocumentoContratista] = useState<
    string | null
  >(null);
  const [numeroContrato, setNumeroContrato] = useState<string | null>(null);
  const [numeroInforme, setNumeroInforme] = useState<string | null>(null);
  const [objetoContrato, setObjetoContrato] = useState<string | null>(null);
  const [dependencia, setDependencia] = useState<string | null>(null);
  const [actividades, setActividades] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<{
    [key: number]: ImageType[];
  }>({});
  const [hiddenButtons, setHiddenButtons] = useState<{
    [key: number]: boolean;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);

  const waitForImagesToLoad = (images: HTMLImageElement[]): Promise<void> => {
    return new Promise((resolve) => {
      let loadedImages = 0;
      images.forEach((image) => {
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

  const printDocument = async () => {
    if (componentRef.current) {
      setLoading(true);
      setIsPdfGenerating(true);
      const button = document.querySelector(".pdf-button");
      if (button) button.remove();
      const input = componentRef.current;
      const options = {
        margin: [25, 10, 1, 10],
        filename: "ReporteDeActividades.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: window.devicePixelRatio,
          letterRendering: true,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: "avoid-all",
          before: ".header",
          after: ".content-end",
        },
      };
      setTimeout(() => {
        const pdf = html2pdf().from(input).set(options);
        pdf
          .toPdf()
          .get("pdf")
          .then((pdfDoc) => {
            const totalPages = pdfDoc.internal.getNumberOfPages();
            const pageWidth = pdfDoc.internal.pageSize.getWidth();
            for (let i = 1; i <= totalPages; i++) {
              pdfDoc.setPage(i);
              pdfDoc.setFontSize(10);
              pdfDoc.setFont("helvetica", "bold");
              pdfDoc.setDrawColor(193, 193, 193);
              pdfDoc.rect(11, 6, pageWidth - 25, 15);
              const dividerXStart = 11 + (pageWidth - 25) * 0.75;
              const dividerXEnd = dividerXStart;
              const dividerYStart = 6;
              const dividerYEnd = 21;
              pdfDoc.setDrawColor(193, 193, 193);
              pdfDoc.line(dividerXStart, dividerYStart, dividerXEnd, dividerYEnd);
              pdfDoc.text(
                "REPORTE DE ACTIVIDADES PARA SERVICIO DE APOYO A LA GESTIÓN",
                17,
                15,
                { align: "left" }
              );
              const pageText = `Página ${i} de ${totalPages}`;
              pdfDoc.text(pageText, pageWidth - 50, 15);
            }
          })
          .save()
          .then(() => {
            setLoading(false);
            setIsPdfGenerating(false);
            if (button) document.querySelector(".pdf-container")?.appendChild(button);
          })
          .catch(() => {
            setLoading(false);
            setIsPdfGenerating(false);
            if (button) document.querySelector(".pdf-container")?.appendChild(button);
          });
      }, 500); // Aumenta el tiempo de espera para asegurar que todo cargue
    }
  };
  const sendDataEndPoint = () => {
    const dataActComent = actividades.map((actividad, index) => {
      // Obtener comentarios y mapas a la estructura necesaria
      const comentarios =
        comments[index]?.map((comment) => ({
          id: comment.id || "",
          objeto: comment.objeto,
        })) || [];

      // Obtener imágenes
      const imagenes =
        selectedImages[index]?.map((image) => ({
          name: image.name || `imagen${imageIndex + 1}`,
          data: image.data,
          id: image.id || "",
        })) || [];

      return {
        id: actividad.id_actividades,
        comentario: comentarios,
        imagen: imagenes,
      };
    });

    const finalData = { dataActComent };

    // Aquí puedes hacer el fetch a tu endpoint o lo que necesites
    console.log(finalData);
    const MAX_RETRIES = 3;
    const enviarDataActividades = async (
      data: any,
      retryCount = 0
    ): Promise<number> => {
      try {
        const response = await fetch("/api/cudcomentarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        });

        if (response.ok) {
          const responseData = await response.json();
          showMessage({
            title: "Éxito",
            cuerpo: "Datos de actividades enviados correctamente",
          });
          return responseData.contratoId; // Ajusta esto si necesitas retornar otro ID
        } else {
          throw new Error("Error en el envío de datos de actividades");
        }
      } catch (error) {
        showMessage({
          title: "Error",
          cuerpo: "Error al enviar datos de actividades: " + error.message,
        });
        if (retryCount < MAX_RETRIES) {
          return enviarDataActividades(data, retryCount + 1);
        } else {
          throw error;
        }
      }
    };

    // Llama a la función para enviar los datos
    enviarDataActividades(finalData);
  };

  const handlePdfGeneration = () => {
    sendDataEndPoint();
    printDocument();
    const dataToSave = {
      numeroInforme: numeroInforme,
      comments: comments,
      selectedImages: selectedImages,
    };
    const jsonData = JSON.stringify(dataToSave);
    console.log(jsonData)
    localStorage.setItem("ReporteActividad", jsonData);
  };

  const addInput = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
    id_actividad: number
  ) => {
    const textarea = e.currentTarget.parentElement
      ?.firstChild as HTMLTextAreaElement;

    if (textarea) {
      if (textarea.classList.contains("hidden")) {
        textarea.classList.remove("hidden");
      } else {
        const comentario = "• "+textarea.value.trim(); // Obtener el valor del textarea
        if (comentario !== "") {
          const newId = Date.now(); // Generar un ID único
          setComments((prev) => {
            const updatedComments = [
              ...(prev[index] || []),
              { id: newId, objeto: comentario }, // Agregar nuevo comentario
            ];
            return {
              ...prev,
              [index]: updatedComments,
            };
          });
          textarea.value = ""; // Limpiar el textarea
          textarea.classList.add("hidden"); // Ocultar el textarea
        }
      }
    }
  };

  // Editar comentario
  const editComment = (index: number, comment: CommentType) => {
    const textarea = document.getElementById(
      `editInput${index}`
    ) as HTMLTextAreaElement; // Obtener el textarea
    if (textarea) {
      textarea.value = comment.objeto; // Asignar el texto del comentario al textarea
      textarea.classList.remove("hidden"); // Mostrar el textarea

      const saveEdit = () => {
        const updatedComment = textarea.value.trim();
        if (updatedComment !== "") {
          setComments((prev) => {
            const updatedComments = prev[index].map(
              (c) =>
                c.id === comment.id ? { ...c, objeto: updatedComment } : c // Actualiza solo el comentario específico
            );
            return {
              ...prev,
              [index]: updatedComments,
            };
          });
          textarea.value = ""; // Limpiar el textarea después de guardar
          textarea.classList.add("hidden"); // Ocultar el textarea nuevamente
        }
      };

      // Agregar event listeners para guardar cambios
      textarea.removeEventListener("blur", saveEdit);
      textarea.removeEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          saveEdit();
        }
      });

      textarea.addEventListener("blur", saveEdit);
      textarea.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          saveEdit();
        }
      });

      // Ajustar la altura del textarea para adaptarse al contenido
      textarea.style.height = "auto"; // Restablecer la altura
      textarea.style.height = `${textarea.scrollHeight}px`; // Ajustar la altura al contenido
    }
  };

  // Eliminar comentario
  const deleteComment = (index: number, commentIndex: number) => {
    setComments((prev) => {
      const updatedComments = prev[index].filter(
        (_, idx) => idx !== commentIndex
      ); // Filtrar usando el índice
      return {
        ...prev,
        [index]: updatedComments,
      };
    });
  };

  const handleButtonClick = (index: number) => {
    const input = document.getElementById(
      `fileInput${index}`
    ) as HTMLInputElement;
    input?.click();
  };

  const handleImageUpload = (index: number, id_actividad: number) => {
    const input = document.getElementById(
      `fileInput${index}`
    ) as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const files = Array.from(input.files);
      const newImages = files.map((file) => {
        const reader = new FileReader();
        return new Promise<{
          name: string;
          data: string;
          id: number;
          id_actividad: number;
        }>((resolve) => {
          reader.onloadend = () => {
            const imageId = 201 + Math.floor(Math.random() * 1000);
            resolve({
              name: file.name,
              data: reader.result as string,
              id: imageId,
              id_actividad, // Guardar id_actividad
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImages).then((results) => {
        setSelectedImages((prev) => {
          const updatedImages = [...(prev[index] || []), ...results].slice(
            0,
            3
          );

          return {
            ...prev,
            [index]: updatedImages,
          };
        });

        setHiddenButtons((prev) => ({
          ...prev,
          [index]: results.length >= 3,
        }));
      });
    }
  };
  const removeImage = (index: number, imageIndex: number) => {
    setSelectedImages((prev) => {
      const updatedImages = prev[index].filter((_, idx) => idx !== imageIndex);
      return {
        ...prev,
        [index]: updatedImages,
      };
    });
  };

  const datos = async (numeroContrato: any) => {
    try {
      const response = await fetch(
        `/api/reporteactividades?numeroCedula=${numeroContrato}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActividades(data.actividades);
        setNombreContratista(data.cobro.nombres + " " + data.cobro.apellidos);
        setDocumentoContratista(data.cobro.documento);
        setObjetoContrato(data.contrato.objeto_contrato);
        setNumeroContrato(data.contrato.numero_contrato);
        setDependencia(data.contrato.dependencia);
      } else {
        console.error("Error en la solicitud:", response.statusText);
      }
    } catch (error) {
      console.error("Error al solicitar los bancos:", error);
    }
  };

  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  })
    .format(new Date())
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+de\s+/, " ");

  const searchContrato = () => {
    const inputNumeroContrato = document.getElementById(
      "inputNumeroContrato"
    ) as HTMLInputElement;
    datos(inputNumeroContrato.value);
  };
  const showMessage = (data: any) => {
    if (data.title === "Error") {
      toast.error(data.cuerpo, { position: "top-right" as ToastPosition });
    } else {
      toast.success(data.cuerpo, { position: "top-right" as ToastPosition });
    }
  };
  useEffect(() => {
    console.log("Número de contrato:", numeroContrato);

    const usuarioString = window.localStorage.getItem("user");

    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        if (usuario && usuario.cedula) {
          (
            document.getElementById("inputNumeroContrato") as HTMLInputElement
          ).value = usuario.cedula;
          searchContrato();
        } else {
          showMessage({
            title: "Error",
            cuerpo: "No se encontró cédula en los datos del usuario.",
          });
        }
      } catch (error) {
        showMessage({
          title: "Error",
          cuerpo: "Error al procesar los datos del usuario.",
        });
      }
    } else {
      window.location.href = "/login";
    }
    const jsonData = localStorage.getItem("ReporteActividad");
    if (jsonData) {
      const data = JSON.parse(jsonData);
      setComments(data.comments);
     // setSelectedImages(data.selectedImages);
      setNumeroInforme(data.numeroInforme);
    }
  }, []);

  return (
    <div className="bg-gray-100">
      <Menu />
      
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
          <table className="table1 mb-6">
            <tbody>
              <tr>
                <td className="td2 font-bold">Informe Número</td>
                <td className="td22" colSpan={4} id="informeNro">
                  Nro° {" "}
                  <input
                    type="text"
                    className="border-none mt-1 w-4 h-7"
                    value={numeroInforme ?? ""} // Si numeroInforme es null, se usará ""
                    onChange={(e) => setNumeroInforme(e.target.value)} // Agrega un onChange si necesitas actualizarlo
                  />
                </td>
              </tr>
              <tr>
                <td className="td2 font-bold">Fecha</td>
                <td className="td22" colSpan={4}>
                  {formattedDate}
                </td>
              </tr>
              <tr>
                <td className="td2 font-bold">Dependencia o proceso:</td>
                <td className="td22" colSpan={4}>
                  {dependencia}
                </td>
              </tr>
              <tr>
                <td className="td2 font-bold">Nombre Contratista:</td>
                <td className="td23">{nombreContratista}</td>
                <td className="td24 font-bold">Documento de identidad:</td>
                <td className="td24">{documentoContratista}</td>
              </tr>
              <tr>
                <td className="td2 font-bold">Objeto del contrato:</td>
                <td className="td22" colSpan={4}>
                  {objetoContrato}
                </td>
              </tr>
              <tr>
                <td className="td2 font-bold">Número del contrato:</td>
                <td className="td22">
                  {numeroContrato} de {formattedDate}
                </td>
                <td className="td24 font-bold">Periodo reportado:</td>
                <td className="td24">
                  <p className="mb-0 h-6">Desde</p>{" "}
                  <input type="Date" className="border-none mt-0  h-6" />
                  <p className="mb-0 h-6"> Hasta</p>{" "}
                  <input type="Date" className="border-none mt-0 h-6 " />
                </td>
              </tr>
            </tbody>
          </table>
          <table className="table1 mb-5">
            <tbody>
              <tr>
                <td className="tdd bg-zinc-400 text-center font-black">ITEM</td>
                <td className="bg-zinc-400 text-center font-black">
                  Actividades Desarrolladas en el marco de las obligaciones
                  contractuales
                </td>
              </tr>
              {actividades.map((actividad, index) => (
                <React.Fragment key={actividad.id_actividades}>
                  <tr
                    className=""
                    data-mojon={actividad.id_actividades}
                    data-noindex={index}
                  >
                    <td className="align-top">{index + 1}</td>
                    <td>{actividad.objeto_contractual}</td>
                  </tr>
                  <tr>
                    <td></td>
                    
                    <td data-name="comentario">
                      <textarea maxLength={435}
                        id={`editInput${index}`}
                        data-original-comment=""
                        className={`text-gray-800 w-full text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-50% p-2.5 dark:bg-gray-100 dark:placeholder-gray-800 dark:focus:ring-blue-500 dark:focus:border-blue-500 hidden border-solid border-2 border-black mb-2 mt-4 ${
                          isPdfGenerating ? "hidden" : ""
                        }`}
                      />
                      <ul>
                        {comments[index]?.map((comment, commentIndex) => (
                          <li key={comment.id}>
                            {" "}
                            {/* Usamos el id único como clave */}
                            <span>{comment.objeto}</span>
                            <button
                              className={`delete-button border-black border-solid border-2 ml-2 ${
                                isPdfGenerating ? "hidden" : ""
                              }`}
                              onClick={() => editComment(index, comment)}
                            >
                              Editar
                            </button>
                            <button
                              className={`delete-button border-black border-solid border-2 ml-2 ${
                                isPdfGenerating ? "hidden" : ""
                              }`}
                              onClick={() => deleteComment(index, commentIndex)}
                            >
                              Eliminar
                            </button>
                            <input
                              type="text"
                              id={`editInput${index}-${comment.id}`}
                              className="hidden"
                            />{" "}
                            {/* Cada input tiene un id único */}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={(e) =>
                          addInput(e, index, actividad.id_actividades)
                        }
                        data-name="AddCommentsActivity"
                        className={`text-white mt-4 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 ${
                          isPdfGenerating ? "hidden" : ""
                        }`}
                      >
                        Agregar
                      </button>
                     <button
                        onClick={() => handleButtonClick(index)}
                        data-name="AddEvidencia"
                        className={`text-white mt-4 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 ${
                          hiddenButtons[index] || isPdfGenerating
                            ? "hidden"
                            : ""
                        }`}
                      >
                        Subir Imágenes
                      </button>
                      <input
                        type="file"
                        id={`fileInput${index}`}
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={() =>
                          handleImageUpload(index, actividad.id_actividades)
                        }
                      />*
                      <div className="image-container flex flex-wrap gap-2">
                        {selectedImages[index]?.map((image, imageIndex) => (
                          <div key={imageIndex} className="flex items-center">
                            <img
                              src={image.data}
                              alt={`Imagen ${imageIndex + 1}`}
                              style={{
                                maxWidth: "210px",
                                maxHeight: "210px",
                                objectFit: "cover",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                              }}
                            />
                            <button
                              onClick={() => removeImage(index, imageIndex)}
                              className={`text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1 ml-2 ${
                                isPdfGenerating ? "hidden" : ""
                              }`}
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                  <ToastContainer />
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <p className="mb-10">
            Certifico bajo gravedad de juramento que la información consignada
            en este informe es verídica y está soportada de manera física y en
            medio magnético, y podrá ser confirmada por la entidad contratante.
          </p>
          <div>
            <FirmaComponent />
          </div>
          <p>
            Firma_________________________ <br /> Nombre: {nombreContratista}{" "}
            <br />
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
