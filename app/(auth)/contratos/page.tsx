"use client";
import React, { useEffect, useState } from "react";
import 'react-toastify/ReactToastify.css'
import { ToastContainer, ToastPosition, toast } from 'react-toastify'
import { useRouter } from 'next/router';
import Buttoncontra from "@/app/libs/ui/Buttoncontra";
import Menu from "@/app/libs/ui/menu";



const moveInput = (direction) => {
  const divInputsActividades = document.getElementById('actividades');
  let inputs = Array.from(divInputsActividades?.getElementsByTagName('textarea') || []);

  // Encuentra el textarea seleccionado
  let selectedInput = inputs.find(input => input.classList.contains('selected'));

  if (!selectedInput) return; // No hay input seleccionado

  const index = inputs.indexOf(selectedInput);
  const newIndex = index + direction;

  // Verifica que el nuevo índice esté dentro del rango
  if (newIndex < 0 || newIndex >= inputs.length) return;

  if (direction === -1 && index > 0) {
    // Mover hacia arriba
    divInputsActividades.insertBefore(selectedInput.parentElement.parentElement, inputs[newIndex].parentElement.parentElement);
  } else if (direction === 1 && index <= inputs.length - 1) {
    // Mover hacia abajo
    divInputsActividades.insertBefore(inputs[newIndex].parentElement.parentElement, selectedInput.parentElement.parentElement);
  }

  // Actualizar los contadores
  updateCounters();
}

const updateCounters = () => {
  const divInputsActividades = document.getElementById('actividades');
  let inputs = Array.from(divInputsActividades?.getElementsByTagName('textarea') || []);

  inputs.forEach((input, index) => {
    const label = input.parentElement;
    if (label && label.classList.contains('activity-label')) {
      label.querySelector('.counter').textContent = `Actividad ${index + 1}:`;
    }
  });
}

const selectInput = (event) => {
  document.querySelectorAll('#actividades textarea').forEach(textarea => {
    textarea.classList.remove('selected');
  });
  event.target.classList.add('selected');
  const moveDiv = document.getElementById('button-move-input');
  if (moveDiv) {
    moveDiv.classList.remove('hidden');
    moveDiv.classList.add('flex')
  }
}

const addInput = () => {
  const divInputsActividades = document.getElementById('actividades');
  const divbuttonErase = document.getElementById('button-erase-input');
  const spanHijo = divInputsActividades?.children[0];
  if (spanHijo?.classList.contains('hidden')) {
    spanHijo.classList.remove('hidden');
  }
  if (divbuttonErase?.classList.contains('hidden')) {
    divbuttonErase.classList.remove('hidden');
    divbuttonErase.classList.add('flex')
  }

  let input = document.createElement('textarea');
  input.classList.add('block', 'my-4', 'w-full', 'rounded-md', 'border-0', 'py-2', 'px-4', 'text-gray-900', 'shadow-sm', 'ring-1', 'ring-inset', 'ring-gray-300', 'placeholder:text-gray-400', 'focus:ring-2', 'focus:ring-inset', 'focus:ring-indigo-600', 'sm:text-sm', 'sm:leading-6');
  input.addEventListener('click', selectInput);

  // Agregar contador y encapsular en un label dentro de un div
  let div = document.createElement('div');
  div.classList.add('activity-div', 'my-2');

  let label = document.createElement('label');
  label.classList.add('activity-label', 'block', 'text-gray-900');

  let counter = document.createElement('span');
  counter.classList.add('counter', 'mr-2');
  counter.textContent = `Actividad ${divInputsActividades.children.length - 1}:`;

  label.appendChild(counter);
  label.appendChild(input);
  div.appendChild(label);

  divInputsActividades?.appendChild(div);

  // Actualizar los contadores
  updateCounters();
}

const eraseInput = () => {
  const divInputsActividades = document.getElementById('actividades');
  let inputs = Array.from(divInputsActividades?.getElementsByTagName('textarea') || []);

  // Encuentra el textarea seleccionado
  let selectedInput = inputs.find(input => input.classList.contains('selected'));

  if (selectedInput) {
    const div = selectedInput.parentElement.parentElement;
    if (div && div.classList.contains('activity-div')) {
      div.remove();
    }
  }

  // Actualizar los contadores
  updateCounters();
}

const showMessage = (data: any) => {
  if (data.title === "Error") {
    toast.error(data.cuerpo, { position: 'top-right' as ToastPosition });
  } else {
    toast.success(data.cuerpo, { position: 'top-right' as ToastPosition });
  }
};

const MAX_RETRIES = 3;

const enviarDataContrato = async (data: any, retryCount = 0): Promise<number> => {
  try {
    const response = await fetch('/api/contrato', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const responseData = await response.json();
      showMessage({ title: 'Éxito', cuerpo: 'Datos del contrato enviados correctamente' });
      return responseData.contratoId;
    } else {
      throw new Error('Error en el envío de datos del contrato');
    }
  } catch (error) {
    showMessage({ title: 'Error', cuerpo: 'Error al enviar datos del contrato: ' + error.message });
    if (retryCount < MAX_RETRIES) {
      return enviarDataContrato(data, retryCount + 1);
    } else {
      throw error;
    }
  }
};

const enviarDataCobro = async (data: any, retryCount = 0): Promise<void> => {
  try {
    const response = await fetch('/api/cobros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const responseCobroData = await response.json();
      showMessage({ title: 'Éxito', cuerpo: 'Datos del cobro enviados correctamente' });
      console.log(`Joseph el mascamonda ${responseCobroData.cobroId}`)
      return responseCobroData.cobroId;
    } else {
      showMessage({title:'Error', cuerpo:'Error en el envío de datos del cobro'});
    }
  } catch (error) {
    showMessage({ title: 'Error', cuerpo: 'Error al enviar datos del cobro: ' + error.message });
    if (retryCount < MAX_RETRIES) {
      await enviarDataCobro(data, retryCount + 1);
    } else {
      throw error;
    }
  }
};

const enviarDataAplicaciones = async (data: any, retryCount = 0): Promise<void> => {
  console.log(data)
  try {
    const response = await fetch('/api/actividades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      showMessage({ title: 'Éxito', cuerpo: 'Datos de las actividades enviados correctamente' });
      console.log('Datos de las actividades enviados correctamente');
    } else {
      showMessage({title:'Error', cuerpo:'Error en el envío de datos del cobro'});
    }
  } catch (error) {
    showMessage({ title: 'Error', cuerpo: 'Error al enviar datos de las actividades: ' + error.message });
    if (retryCount < MAX_RETRIES) {
      await enviarDataAplicaciones(data, retryCount + 1);
    } else {
      throw error;
    }
  }
};


const enviarData = async () => {
  try {
    const nombresInput = (document.getElementById("primer_nombre") as HTMLInputElement).value + ' ' + (document.getElementById("segundo_nombre") as HTMLInputElement).value;
    const apellidosInput = (document.getElementById("primer_apellido") as HTMLInputElement).value + ' ' + (document.getElementById("segundo_apellido") as HTMLInputElement).value;
    const documentoInput = (document.getElementById("documento") as HTMLInputElement).value;
    const telefonoInput = (document.getElementById("telefono") as HTMLInputElement).value;
    const bancoInput = (document.getElementById("banco") as HTMLSelectElement).value;
    const tipoCuentaInput = (document.getElementById("tipoCuenta") as HTMLSelectElement).value;
    const nroCuentaInput = (document.getElementById("nro_cuenta") as HTMLInputElement).value;
    const correoElectronicoInput = (document.getElementById("correoElectronico") as HTMLInputElement).value;
    const direccionInput = (document.getElementById("direccion") as HTMLInputElement).value;
    const identificacionFiscalInput = (document.getElementById("identificacionFiscal") as HTMLInputElement).value;
    const numeroContratoInput = (document.getElementById("numero_contrato") as HTMLInputElement).value;
    const anoContratoInput = (document.getElementById("ano_contrato") as HTMLInputElement).value;
    const valorMesInput = (document.getElementById("valor_mes") as HTMLInputElement).value;
    const objetoContratoInput = (document.getElementById("objeto_contrato") as HTMLTextAreaElement).value;
    const dependenciaInput = (document.getElementById("dependencia") as HTMLTextAreaElement).value;

    let validacion = {
      validate: true,
    };
    const campos = [
      { id: "primer_nombre", nombre: "primer_nombre", valor: (document.getElementById("primer_nombre") as HTMLInputElement).value.trim() },
      { id: "segundo_nombre", nombre: "segundo_nombre", valor: (document.getElementById("segundo_nombre") as HTMLInputElement).value.trim() },
      { id: "primer_apellido", nombre: "primer_apellido", valor: (document.getElementById("primer_apellido") as HTMLInputElement).value.trim() },
      { id: "segundo_apellido", nombre: "segundo_apellido", valor: (document.getElementById("segundo_apellido") as HTMLInputElement).value.trim() },
      { id: "documento", nombre: "Documento", valor: (document.getElementById("documento") as HTMLInputElement).value.trim() },
      { id: "telefono", nombre: "Teléfono", valor: (document.getElementById("telefono") as HTMLInputElement).value.trim() },
      { id: "banco", nombre: "Banco", valor: (document.getElementById("banco") as HTMLSelectElement).value },
      { id: "tipoCuenta", nombre: "Tipo de cuenta", valor: (document.getElementById("tipoCuenta") as HTMLSelectElement).value },
      { id: "nro_cuenta", nombre: "Número de cuenta", valor: (document.getElementById("nro_cuenta") as HTMLInputElement).value.trim() },
      { id: "correoElectronico", nombre: "Correo electrónico", valor: (document.getElementById("correoElectronico") as HTMLInputElement).value.trim() },
      { id: "direccion", nombre: "Dirección", valor: (document.getElementById("direccion") as HTMLInputElement).value.trim() },
      { id: "identificacionFiscal", nombre: "Identificación fiscal", valor: (document.getElementById("identificacionFiscal") as HTMLInputElement).value.trim() },
      { id: "numero_contrato", nombre: "Número de contrato", valor: (document.getElementById("numero_contrato") as HTMLInputElement).value.trim() },
      { id: "ano_contrato", nombre: "Año de contrato", valor: (document.getElementById("ano_contrato") as HTMLInputElement).value.trim() },
      { id: "valor_mes", nombre: "Valor del mes", valor: (document.getElementById("valor_mes") as HTMLInputElement).value.trim() },
      { id: "objeto_contrato", nombre: "Objeto de contrato", valor: (document.getElementById("objeto_contrato") as HTMLTextAreaElement).value.trim() },
      { id: "dependencia", nombre: "dependencia", valor: (document.getElementById("dependencia") as HTMLTextAreaElement).value.trim() }
    ];

    for (const campo of campos) {
      if (campo.valor === '' &&
        campo.nombre !== "segundo_nombre" &&
        campo.nombre !== "segundo_apellido" &&
        campo.nombre !== "valor_mes") {
        validacion.validate = false;
        const elemento = document.getElementById(campo.id);
        console.log(elemento);
        if (elemento && elemento.classList.contains('ring-gray-300')) {
          elemento.classList.add("ring-red-600");
          elemento.classList.remove("ring-gray-300");
        }
      } else {
        if (campo.id === 'correoElectronico') {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!regex.test(campo.valor)) {
            validacion.validate = false;
            const elemento = document.getElementById(campo.id);
            if (elemento) {
              elemento.classList.add("ring-red-600");
              elemento.classList.remove("ring-gray-300");
            }
          } else {
            const elemento = document.getElementById(campo.id);
            if (elemento && elemento.classList.contains('ring-red-600')) {
              elemento.classList.remove("ring-red-600");
              elemento.classList.add("ring-gray-300");
            }
          }
        } else {
          const elemento = document.getElementById(campo.id);
          if (elemento && elemento.classList.contains('ring-red-600')) {
            elemento.classList.remove("ring-red-600");
            elemento.classList.add("ring-gray-300");
          }
        }
      }
    }
    if (validacion.validate) {
      const dataContrato = {
        dependencia: dependenciaInput,
        numero_contrato: numeroContratoInput,
        objeto_contrato: objetoContratoInput,
        ano_contrato: anoContratoInput,
        valor_mes: 0,
      };
      const contratoID = await enviarDataContrato(dataContrato);
      const dataCobro = {
        nombres: nombresInput,
        apellidos: apellidosInput,
        documento: documentoInput,
        telefono: telefonoInput,
        bancoId: bancoInput,
        tipoCuentaId: tipoCuentaInput,
        nro_cuenta: nroCuentaInput,
        correoElectronico: correoElectronicoInput,
        direccion: direccionInput,
        identificacionFiscal: identificacionFiscalInput,
        contratoId: contratoID,
      };
      console.log(dataCobro)
      const cobroID = await enviarDataCobro(dataCobro);
      const actividadesInputs = Array.from(document.querySelectorAll('#actividades textarea'))
        .map((textarea) => (textarea as HTMLTextAreaElement).value);
      console.log(actividadesInputs)

      const dataActividades = {
        cobroId: cobroID,
        objetos_contractuales: actividadesInputs,
      };

      console.log(dataActividades);
      enviarDataAplicaciones(dataActividades);

    };
    validacion.validate = true;

  } catch (error) {
    console.error('Error al intentar extraer los valores de los campos: ' + error);
  }

}

const Contratos = () => {
  const [bancosLoaded, setBancosLoaded] = useState(false);

  useEffect(() => {
    const usuarioString = window.localStorage.getItem('user');

    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        if (usuario && usuario.cedula) {
          searchContrato(usuario.cedula);
        } else {
          showMessage({ title: 'Error', cuerpo: 'No se encontró cédula en los datos del usuario.' });
        }
      } catch (error) {
        showMessage({ title: 'Error', cuerpo: 'Error al procesar los datos del usuario.' });
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  const searchContrato = async (identificacion: string) => {
    if (!identificacion) {
      showMessage({ title: 'Error', cuerpo: 'Por favor, ingrese un número de cédula válido.' });
      return;
    }

    try {
      const response = await fetch(`/api/searchcontratos?numeroCedula=${identificacion}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          const {
            id,
            identificacion,
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            direccion,
            telefono,
            email,
            nro_cuenta,
            tipo_cuenta,
            id_banco,
            contratos
          } = data.data;
          (document.getElementById("primer_nombre") as HTMLInputElement).value = primer_nombre || '';
          (document.getElementById("segundo_nombre") as HTMLInputElement).value = segundo_nombre || '';
          (document.getElementById("primer_apellido") as HTMLInputElement).value = primer_apellido || '';
          (document.getElementById("segundo_apellido") as HTMLInputElement).value = segundo_apellido || '';
          (document.getElementById("documento") as HTMLInputElement).value = identificacion || '';
          (document.getElementById("telefono") as HTMLInputElement).value = telefono || '';
          (document.getElementById("nro_cuenta") as HTMLInputElement).value = nro_cuenta || '';
          (document.getElementById("correoElectronico") as HTMLInputElement).value = email || '';
          (document.getElementById("direccion") as HTMLInputElement).value = direccion || '';
          (document.getElementById("identificacionFiscal") as HTMLInputElement).value = identificacion || '';
          (document.getElementById("tipoCuenta") as HTMLSelectElement).value = tipo_cuenta || '';

          if (contratos && contratos.length > 0) {
            const { nro_contrato, objeto } = contratos[0];
            (document.getElementById("numero_contrato") as HTMLInputElement).value = nro_contrato || '';
            (document.getElementById("objeto_contrato") as HTMLTextAreaElement).value = objeto || '';
            showMessage({ title: 'Éxito', cuerpo: 'Datos del contrato y contratistas encontrados correctamente.' });
          }
          const select = document.getElementById('banco');
          console.log(id_banco)
          id_banco.forEach(dict => {
            const optionExists = Array.from(select?.options || []).some(option => option.value === dict.id_banco.toString());
            if (!optionExists) {
              let option = document.createElement('option');
              option.value = dict.id_banco.toString();
              option.textContent = dict.nombre;
              select?.appendChild(option);
            }
          });

        } else {
          showMessage({ title: 'Error', cuerpo: 'Datos del contratista no encontrados.' });
        }
      } else {
        showMessage({ title: 'Error', cuerpo: `Error en la solicitud: ${response.statusText}` });
      }
    } catch (error) {
      showMessage({ title: 'Error', cuerpo: `Error en la solicitud: ${error instanceof Error ? error.message : String(error)}` });
    }
  };

  return (
    <div >
      <Menu />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className=" w-full p-6 bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Datos de Contratacion
            </h2>

            <div className="mt-10 grid  gap-x-6 gap-y-8 sm:grid-cols-4">
              <div className="sm:col-span-1">
                <label
                  htmlFor="primer_nombre"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Primer Nombre
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="primer_nombre"
                    id="primer_nombre"
                    autoComplete="primer_nombre"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label
                  htmlFor="segundo_nombre"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Segundo Nombre
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="segundo_nombre"
                    id="segundo_nombre"
                    autoComplete="segundo_nombre"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="primer_apellido"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Primer Apellido
                </label>
                <div className="mt-2">
                  <input

                    type="text"
                    name="primer_apellido"
                    id="primer_apellido"
                    autoComplete="primer_apellido"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label
                  htmlFor="segundo_apellido"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Segundo Apellido
                </label>
                <div className="mt-2">
                  <input

                    type="text"
                    name="segundo_apellido"
                    id="segundo_apellido"
                    autoComplete="segundo_apellido"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="documento"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Numero de documento
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    id="documento"
                    name="documento"
                    autoComplete="documento"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Telefono
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    name="telefono"
                    id="telefono"
                    autoComplete="telefono"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="banco"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Banco
                </label>
                <div className="mt-2">
                  <select
                    id="banco"
                    name="banco"
                    autoComplete="banco"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                  
                  </select>
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="tipoCuenta"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tipo de Cuenta
                </label>
                <div className="mt-2">
                  <select
                    id="tipoCuenta"
                    name="tipoCuenta"
                    autoComplete="tipoCuenta"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >

                    <option value={1}>Ahorros</option>
                    <option value={2}>Corriente</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="nro_cuenta"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nro Cuenta
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    name="nro_cuenta"
                    id="nro_cuenta"
                    autoComplete="nrocuenta"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Correo electronico
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="email"
                    id="correoElectronico"
                    name="correoElectronico"
                    typeof="correoElectronico"
                    autoComplete="correoElectronico"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="direccion"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Direccion
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    name="direccion"
                    id="direccion"
                    autoComplete="direccion"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="identificacionFiscal"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Identificacion fiscal
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    name="identificacionFiscal"
                    id="identificacionFiscal"
                    autoComplete="identificacionFiscal"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="numero_contrato"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Número de Contrato
                </label>
                <div className="mt-2">
                  <input
                    required
                    type="text"
                    name="numero_contrato"
                    id="numero_contrato"
                    autoComplete="numero_contrato"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="ano_contrato"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Año del Contrato
                </label>
                <div className="mt-2">
                  <input
                    disabled
                    value={new Date().getFullYear()}
                    type="number"
                    name="ano_contrato"
                    id="ano_contrato"
                    autoComplete="ano_contrato"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-1 hidden">
                <label
                  htmlFor="valor_mes"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Valor mes del contrato
                </label>
                <div className="mt-2">
                  <input
                    value={0}
                    type="text"
                    name="valor_mes"
                    id="valor_mes"
                    autoComplete="valor_mes"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="objeto_contrato"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Objeto contrato
                </label>
                <div className="mt-2">
                  <textarea
                    typeof="text"
                    id="objeto_contrato"
                    name="objeto_contrato"
                    rows={3}
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  ></textarea>
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="dependencia"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Dependencia
                </label>
                <div className="mt-2">
                  <textarea
                    typeof="text"
                    id="dependencia"
                    name="dependencia"
                    rows={3}
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  ></textarea>
                </div>
              </div>
              <div className="col-span-full" id="actividades">
                <span className="hidden mt-4 mb-4">Actividades del Contrato</span>

              </div>
              <div className="flex col-span-2 space-x-6 items-center cursor-pointer bg-purple-700 rounded-xl px-4" onClick={addInput}>
                <span className="p-3 rounded-full bg-transparent border-solid border-2 border-white max-w-8 max-h-8 text-2xl flex items-center justify-center text-white">+</span>
                <span className="w-64 col-span-3 line-clamp-1 text-white">Agregar Actividad</span>
              </div>

              <div className="col-span-3 space-x-16 items-center cursor-pointer bg-purple-700 rounded-xl px-4 hidden" id="button-erase-input" onClick={eraseInput}>
                <span className="p-3 rounded-full bg-transparent border-solid border-2 border-white max-w-8 max-h-8 text-2xl flex items-center justify-center text-white">-</span>
                <span className="w-64 col-span-3 line-clamp-1 text-white">Eliminar Actividad Seleccionada</span>
              </div>


              <div className="col-span-1 items-center bg-purple-700 rounded-xl px-4 hidden justify-center" id="button-move-input">
                <div className="flex items-center justify-center">
                  <span
                    className="p-3 rounded-full bg-transparent border-solid border-2 border-white max-w-8 max-h-8 text-2xl flex items-center justify-center text-white cursor-pointer"
                    onClick={() => moveInput(-1)} // Cambia a una función anónima que llama a moveInput
                  >
                    ▲
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span
                    className="p-3 rounded-full bg-transparent border-solid border-2 border-white max-w-8 max-h-8 text-2xl flex items-center justify-center text-white cursor-pointer"
                    onClick={() => moveInput(1)} // Cambia a una función anónima que llama a moveInput
                  >
                    ▼
                  </span>
                </div>
              </div>

              <Buttoncontra onClick={enviarData}></Buttoncontra>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );

};

export default Contratos;