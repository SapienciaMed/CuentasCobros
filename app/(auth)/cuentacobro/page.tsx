"use client";
import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import Buttonpdf from '@/app/libs/ui/Buttonpdf';
import { ToastContainer, ToastPosition, toast } from 'react-toastify';
import '@/app/miscss/cuentacobro.css';
import Menu from "@/app/libs/ui/menu";
import FirmaComponent from '../src/components/FirmaComponent';

const CuentaDeCobro: React.FC = () => {

  const [primer_nombre, setPrimerNombre] = useState<string | null>(null);
  const [primer_apellido, setPrimerApellido] = useState<string | null>(null);
  const [segundo_nombre, setSegundoNombre] = useState<string | null>(null);
  const [segundo_apellido, setSegundoApellido] = useState<string | null>(null);
  const [identificacion, setIdentificacion] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [idFiscal, setIdFiscal] = useState<string | null>(null);
  const [direccion, setDireccion] = useState<string | null>(null);
  const [telefono, setTelefono] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [tipo_cuenta, setTipoCuenta] = useState<string | null>(null);
  const [nro_cuenta, setNroCuenta] = useState<string | null>(null);
  const [nro_contrato, setNroContrato] = useState<string | null>(null);
  const [objeto, setObjeto] = useState<string | null>(null);
  const [banco, setBanco] = useState<string | null>(null);

  const [valorEnLetras, setValorEnLetras] = useState<string | null>(null);
  const [valorEnNumeros, setvalorEnNumeros] = useState<string | null>("0");

  const [datos, setDatos] = useState<any>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [mesVencido, setMesVencido] = useState<boolean>(false);
  const [periodoAdeudado, setPeriodoAdeudado] = useState<string>('');
  const [ARL, setARL] = useState<string[]>(["0"]);
  const [AFP, setAFP] = useState<string[]>(["0"]);
  const [AFS, setAFS] = useState<string[]>(["0"]);
  const [TOTAL, setTOTAL] = useState<string[]>(["0"]);
  const [dontApplyAFP, setDontApplyAFP] = useState([false]);
  const [dontApplyAFS, setDontApplyAFS] = useState([false]);
  const [dontApplyARL, setDontApplyARL] = useState([false]);
  const [dontApplyTOTAL, setDontApplyTOTAL] = useState([false]);

  const componentRef = useRef<HTMLDivElement>(null);

  const [hiddenElements, setHiddenElements] = useState<string[]>([]);

  const showMessage = (data: any) => {
    if (data.title === "Error") {
      toast.error(data.cuerpo, { position: 'top-right' as ToastPosition });
    } else {
      toast.success(data.cuerpo, { position: 'top-right' as ToastPosition });
    }
  };

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

  const buscarCobro = async () => {
    var nroCedula = (document.getElementById('inputNroCedula') as HTMLInputElement).value;
    try {
      const response = await fetch(`/api/searchcontratoprisma?numeroCedula=${nroCedula}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDatos(data);
        setPrimerNombre(data.data.primer_nombre);
        setPrimerApellido(data.data.primer_apellido);
        setSegundoNombre(data.data.segundo_nombre);
        setSegundoApellido(data.data.segundo_apellido);
        setIdentificacion(data.data.identificacion);
        setId(data.data.id);
        setIdFiscal(data.data.id_fiscal);
        setDireccion(data.data.direccion);
        setTelefono(data.data.telefono);
        setEmail(data.data.email);
        setTipoCuenta(data.data.tipo_cuenta);
        setNroCuenta(data.data.nro_cuenta);
        setNroContrato(data.data.contratos.nro_contrato);
        setObjeto(data.data.contratos.objeto);
        setBanco(data.data.banco_empleado.nombre);
      } else {
        console.error('Error en la solicitud:', response.statusText);
      }
    } catch (error) {
      console.error('Error al solicitar los contratos:', error);
    }
  };

  const fechaActual = new Date().getFullYear();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  const handleMesVencidoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMesVencido(event.target.checked);
  };


  const sizeHandleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Size actived")
    const inputElement = event.target;
    inputElement.style.width = `${inputElement.value.length + 1}ch`;
  };

  const duplicarAportes = () => {
    setAFP(prev => [...prev, 0]);
    setAFS(prev => [...prev, 0]);
    setARL(prev => [...prev, 0]);
    setTOTAL(prev => [...prev, 0]);
  }

  const eliminarAportes = (index: number) => {
    setAFP(prev => prev.filter((_, i) => i !== index));
    setAFS(prev => prev.filter((_, i) => i !== index));
    setARL(prev => prev.filter((_, i) => i !== index));
    setTOTAL(prev => prev.filter((_, i) => i !== index));
  }

  const restoreHiddenElements = () => {
    let elementos = [];
    elementos.push(document.getElementById('pensionado'))
    elementos.push(document.getElementById('botonDuplicador'))
    elementos.push(document.getElementById('butonGenerarPdf'))
    elementos.push(document.getElementById('mesVencido'))
    elementos.forEach(element => {
      if (element) {
        showElement(element);
      }
    });
    let butonsEliminar = Array.from(document.getElementsByClassName('bg-red-500 text-white px-4 py-2 rounded'));
    butonsEliminar.forEach(element => {
      element.classList.remove("hidden")
    });
    let inputs = Array.from(document.getElementsByTagName('input'));
    inputs.forEach(element => {
      element.classList.add('border-black', 'border-solid', 'border-2');
    });
    let divsNoAplica = Array.from(document.querySelectorAll('[id-confirmación="No Aplica"]'));
    divsNoAplica.forEach(element => {
      element.classList.remove("hidden")
    })
    let but
  };

  const showElement = (element: HTMLElement) => {
    element.classList.remove('hidden');
  };

  const hiddenElement = (element: HTMLElement) => {
    element.classList.add('hidden');
    setHiddenElements(prev => [...prev, element.id]);
  };

  const eventClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const botonduplicador = document.getElementById('botonDuplicador');
    const checkpensionado = document.getElementById('pensionado');
    const mesVencido = document.getElementById('mesVencido');
    const inputValorEnNumeros = document.getElementById('inputValorEnLetras')

    if (mesVencido) {
      hiddenElement(mesVencido)
    } if (botonduplicador) {
      hiddenElement(botonduplicador)
    } if (checkpensionado) {
      hiddenElement(checkpensionado)
    } if (inputValorEnNumeros) {
      hiddenElement(inputValorEnNumeros)
      console.log(inputValorEnNumeros)
    }
    let inputs = Array.from(document.getElementsByTagName('input'));
    inputs.forEach(element => {
      element.classList.remove('border-black', 'border-solid', 'border-2');
    });
    const spanValorEnNumeros = document.getElementById('spanValorEnLetras')
    showElement(spanValorEnNumeros as HTMLElement)
    setTimeout(() => { console.log("bruto") }, 5000)
    let butonsEliminar = Array.from(document.getElementsByClassName('bg-red-500 text-white px-4 py-2 rounded'))
    butonsEliminar.forEach(element => {
      element.classList.add("hidden")
    })
    let divsNoAplica = Array.from(document.querySelectorAll('[id-confirmación="No Aplica"]'));
    divsNoAplica.forEach(element => {
      element.classList.add("hidden")
    })
    printDocument();
    const dataToSave = {
      primerNombre: primer_nombre,
      segundoNombre: segundo_nombre,
      primerApellido: primer_apellido,
      segundoApellido: segundo_apellido,
      identificacion: identificacion,
      id: id,
      idFiscal: idFiscal,
      direccion: direccion,
      telefono: telefono,
      email: email,
      tipo_cuenta: tipo_cuenta,
      nro_cuenta: nro_cuenta,
      nro_contrato: nro_contrato,
      objeto: objeto,
      banco: banco,
      periodoAdeudado: periodoAdeudado,
      valorEnLetras: valorEnLetras,
      valorEnNumeros: valorEnNumeros,
      totalSeguridadSocial: TOTAL.reduce((acc, curr) => acc + curr, 0),
      isChecked: isChecked,
      ARL: ARL,
      AFP: AFP,
      AFS: AFS,
      TOTAL: TOTAL,
    };
    const jsonData = JSON.stringify(dataToSave);
    localStorage.setItem('CuentaCobro', jsonData);
    setTimeout(() => {
      restoreHiddenElements();
      showElement(inputValorEnNumeros as HTMLElement)
      hiddenElement(spanValorEnNumeros as HTMLElement)
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const valueWithCommas = e.target.value.replace(/\./g, '');
    const value = parseInt(valueWithCommas.replace(/\D/g, ''), 10);

    setter(prev => {
      const newState = [...prev];
      const formattedValue = formatNumberWithDots(isNaN(value) ? "0" : value.toString());
      newState[index] = isNaN(value) ? "0" : formattedValue;
      return newState;
    });
  };


  const handleInputNumberTo = (numero: string) => {
    let numeroStr = numero.toString().replace(/[.,]/g, "");
    setValorEnLetras(numeroALetras(parseInt(numeroStr)));
    let formattedNumber = formatNumberWithDots(numeroStr);
    setvalorEnNumeros(formattedNumber);
  };

  const formatNumberWithDots = (numeroStr: string) => {
    let numberWithDot = [];
    for (let i = numeroStr.length - 1; i >= 0; i--) {
      numberWithDot.push(numeroStr[i]);
      if ((numeroStr.length - i) % 3 === 0 && i !== 0) {
        numberWithDot.push(".");
      }
    }
    return numberWithDot.reverse().join("");
  };

  const numeroALetras = (numero: number): string => {
    if (numero === 0) return 'Cero';

    const unidades = ['Cero', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve'];
    const especiales = ['Diez', 'Once', 'Doce', 'Trece', 'Catorce', 'Quince'];
    const decenas = ['Diez', 'Veinte', 'Treinta', 'Cuarenta', 'Cincuenta', 'Sesenta', 'Setenta', 'Ochenta', 'Noventa'];
    const centenas = ['Cien', 'Doscientos', 'Trescientos', 'Cuatrocientos', 'Quinientos', 'Seiscientos', 'Setecientos', 'Ochocientos', 'Novecientos'];

    const convertBelowHundred = (num: number): string => {
      if (num < 10) return unidades[num];
      if (num < 16) return especiales[num - 10];
      if (num < 20) return `Dieci${unidades[num - 10].toLowerCase()}`;
      if (num < 30) return num === 20 ? 'Veinte' : `Veinti${unidades[num - 20].toLowerCase()}`;
      const decena = Math.floor(num / 10);
      const unidad = num % 10;
      return `${decenas[decena - 1]}${unidad === 0 ? '' : ` y ${unidades[unidad]}`}`;
    };

    const convertBelowThousand = (num: number): string => {
      if (num < 100) return convertBelowHundred(num);
      const centena = Math.floor(num / 100);
      const resto = num % 100;
      if (num === 100) return 'Cien';
      return `${centenas[centena - 1]}${resto === 0 ? '' : ` ${convertBelowHundred(resto)}`}`;
    };

    const convertBelowMillion = (num: number): string => {
      if (num < 1000) return convertBelowThousand(num);
      const mil = Math.floor(num / 1000);
      const resto = num % 1000;
      const milText = mil === 1 ? 'Mil' : `${convertBelowThousand(mil)} mil`;
      return `${milText}${resto === 0 ? '' : ` ${convertBelowThousand(resto)}`}`;
    };

    const convertMillions = (num: number): string => {
      if (num < 1000000) return convertBelowMillion(num);
      const millonesPart = Math.floor(num / 1000000);
      const resto = num % 1000000;
      const millonesText = millonesPart === 1 ? 'Un millón' : `${convertBelowThousand(millonesPart)} millones`;
      return `${millonesText}${resto === 0 ? '' : ` ${convertBelowMillion(resto)}`}`;
    };

    const convertBillions = (num: number): string => {
      if (num < 1000000000) return convertMillions(num);
      const billonesPart = Math.floor(num / 1000000000);
      const resto = num % 1000000000;
      const billonesText = billonesPart === 1 ? 'Un billón' : `${convertBelowThousand(billonesPart)} billones`;
      return `${billonesText}${resto === 0 ? '' : ` ${convertMillions(resto)}`}`;
    };

    if (numero < 1000) return convertBelowThousand(numero);
    if (numero < 1000000) return convertBelowMillion(numero);
    if (numero < 1000000000) return convertMillions(numero);
    if (numero < 1000000000000) return convertBillions(numero);
    return 'Número demasiado grande';
  };

  useEffect(() => {
    const jsonData = localStorage.getItem('CuentaCobro');
    if (jsonData) {
      const data = JSON.parse(jsonData);
      console.log(data)
      setPrimerNombre(data.primerNombre);
      setSegundoNombre(data.segundoNombre);
      setPrimerApellido(data.primerApellido);
      setSegundoApellido(data.segundoApellido);
      setIdentificacion(data.identificacion);
      setId(data.id);
      setIdFiscal(data.idFiscal);
      setDireccion(data.direccion);
      setTelefono(data.telefono);
      setEmail(data.email);
      setTipoCuenta(data.tipo_cuenta);
      setNroCuenta(data.nro_cuenta);
      setNroContrato(data.nro_contrato);
      setObjeto(data.objeto);
      setBanco(data.banco);
      setPeriodoAdeudado(data.periodoAdeudado);
      setValorEnLetras(data.valorEnLetras);
      setvalorEnNumeros(data.valorEnNumeros);
      setIsChecked(data.isChecked);
      setARL(data.ARL);
      setAFP(data.AFP);
      setAFS(data.AFS);
      setTOTAL(data.TOTAL);
    } else {
      const usuarioString = window.localStorage.getItem('user');
      if (usuarioString) {
        try {
          const usuario = JSON.parse(usuarioString);
          if (usuario && usuario.cedula) {
            (document.getElementById("inputNroCedula") as HTMLInputElement).value = usuario.cedula;
            buscarCobro()
          } else {
            showMessage({ title: 'Error', cuerpo: 'No se encontró cédula en los datos del usuario.' });
          }
        } catch (error) {
          showMessage({ title: 'Error', cuerpo: 'Error al procesar los datos del usuario.' });
        }
      } else {
        window.location.href = '/login';
      }
    }
  }, []);

  const handleCheckboxChangeDontApply = (e: React.ChangeEvent<HTMLInputElement>, index: number, setDontApply: React.Dispatch<React.SetStateAction<boolean[]>>, setValue: React.Dispatch<React.SetStateAction<number[]>>) => {
    const checked = e.target.checked;
    setDontApply(prev => {
      const newState = [...prev];
      newState[index] = checked;
      return newState;
    });

    if (checked) {
      setValue(prev => {
        const newState = [...prev];
        newState[index] = 0;
        return newState;
      });
    }
  };

  useEffect(() => {
    setTOTAL(prevTOTAL => {
      const newTOTAL = [...prevTOTAL];
      for (let i = 0; i < AFP.length; i++) {
        const afpValue = parseInt(AFP[i].toString().replace(/\./g, ''), 10);
        const afsValue = parseInt(AFS[i].toString().replace(/\./g, ''), 10);
        const arlValue = parseInt(ARL[i].toString().replace(/\./g, ''), 10);
        newTOTAL[i] = (afpValue + afsValue + arlValue).toString();
        newTOTAL[i] = formatNumberWithDots(newTOTAL[i])
      }
      return newTOTAL;
    });
  }, [AFP, AFS, ARL]);

  return (
    <div>
      <Menu />
      <div className='items-center justify-center space-x-7 hidden'>
        <input id='inputNroCedula' type="text" className='block p-2.5 w-50% z-20 text-sm rounded-lg text-gray-900 bg-gray-50  border-s-gray-50 border-s-2 border border-gray-300   dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600  placeholder="Digite su numero de CC" ' />
        <button onClick={buscarCobro} className='focus:outline-none text-white bg-fuchsia-800  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-1 mt-1 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'>Buscar CuentaCobro</button>
      </div>
      <div ref={componentRef} className='background'>
        <div className="container">
          <div className="texto1 bg-transparent">FECHA: <input
            type="text" disabled
            className="border-none mt-1 h-7 bg-white"
            defaultValue={new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
              .format(new Date())
              .toLowerCase()
              .replace(/^\w/, c => c.toUpperCase())
              .replace(/\s+de\s+/, ' ')}
          /></div>
          <div className="text-center p-2 sm:px-7 font-medium text-gray-800">
            <h1 className="texto4 mb-3">CUENTA DE COBRO No.<input type="text" className="border-none mt-1 w-3 h-6" onChange={sizeHandleInputChange} />- {fechaActual}</h1>
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
                <td className="td-inicial2">{primer_nombre} {segundo_nombre} {primer_apellido} {segundo_apellido}</td>
              </tr>
              <tr>
                <td className="td-inicial">CC/NIT</td>
                <td className="td-inicial2">{identificacion}</td>
              </tr>
              <tr>
                <td className="td-inicial">IDENTIFICACION FISCAL</td>
                <td className="td-inicial2">{idFiscal}</td>
              </tr>
              <tr>
                <td className="td-inicial">DIRECCIÓN</td>
                <td className="td-inicial2">{direccion}</td>
              </tr>
              <tr>
                <td className="td-inicial">TELÉFONOS</td>
                <td className="td-inicial2">{telefono}</td>
              </tr>
              <tr>
                <td className="td-inicial">CORREO ELECTRÓNICO</td>
                <td className="td-inicial2">{email}</td>
              </tr>
              <tr>
                <td className="td-inicial">CUENTA BANCARIA <br /> (Clase, banco y número)</td>
                <td className="td-inicial2">{banco} - {tipo_cuenta} <br />
                  {nro_cuenta}
                </td>
              </tr>
            </table>
            <h1 className="texto2 text-center mt-1 pb-2">POR LOS SIGUIENTES CONCEPTOS:</h1>
            <table className="table3 mt-2">
              <tr>
                <td className="td-inicial2">No. DE CONTRATO</td>
                <td>{nro_contrato} <input
                  type="text" disabled
                  className="border-none mt-1 h-7 bg-white"
                  defaultValue={new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
                    .format(new Date())
                    .toLowerCase()
                    .replace(/^\w/, c => c.toUpperCase())
                    .replace(/\s+de\s+/, ' ')}
                /></td>
              </tr>
              <tr>
                <td className="td-inicial2">OBJETO DEL CONTRATO</td>
                <td className='leading-none'>
                  {objeto}
                </td>
              </tr>
            </table>
            <table className="table3 ">
              <tr>
                <td className="td-inicial2">PERÍODO ADEUDADO</td>
                <td>Desde   <input type="Date" className="border-none mt-0 ml-2 mr-4 h-6" />   Hasta <input type="Date" className="border-none ml-2 mt-0  h-6" /></td>
              </tr>
              <tr>
                <td className="td-inicial2">VALOR EN LETRAS</td>
                <td >
                  <textarea id='inputValorEnLetras' className="border-none w-full h-7 line-clamp-2 mt-1 leading-none" value={valorEnLetras ?? "Ceroz"}></textarea>
                  <span id='spanValorEnLetras' className='hidden'>{valorEnLetras}</span>
                </td>
              </tr>
              <tr>
                <td className="td-inicial2">VALOR EN NÚMEROS</td>
                <td>

                  <input type="text" className="border-none w-full mt-1 h-7" value={valorEnNumeros ?? "0"} onChange={(e) => handleInputNumberTo(e.target.value)} />
                </td>
              </tr>
            </table>
            <div>
              <div className="pensionado" id='pensionado'>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />{' '}
                Pensionado
              </div>
              <div className="mesVencido" id='mesVencido'>
                <input
                  type="checkbox"
                  checked={mesVencido}
                  onChange={handleMesVencidoChange}
                />{' '}
                Mes vencido
              </div>
              <div>
                {isChecked ? (
                  <p className="texto3 mt-3 leading-none mb-3">
                    Cumplió con el pago de la seguridad social en (salud y riesgos laborales). No aporta a pensión porque no está obligado,
                    según la RESOLUCION 1747 DE 2008, con la cual se modifica la Resolución 634 de 2006 del Ministerio de la protección social:
                    Numeral 4. Cotizante con requisitos cumplidos para pensión: Este subtipo de cotizante solo puede ser utilizado cuando la
                    persona que está cotizando tiene una edad de 55 años de edad o más y manifiesta que ya ha cumplido los requisitos para
                    adquirir la pensión. Para este subtipo de cotizante no está obligado a realizar cotización a pensiones, pero puede hacerlo
                    voluntariamente, y de acuerdo lo dispuesto en la ley 1150 de 2007, a la ley 789 de 2002 art.50 y a la ley 1562 de 2012.
                    El contratista se encuentra a paz y salvo con el pago de la seguridad social integral, conforme a la información contenida
                    en el documento que se relaciona y adjunta a la cuenta de cobro y se valida con el Acta de pago correspondiente.
                  </p>
                ) : (<></>)}

                <div className='contenedor-duplicados'>
                  <div>
                    {ARL.map((ev, index) => (
                      <div className="aportes" key={index} id-posicion={index}>
                        <p className="texto3 mt-3 leading-none mb-3">
                          {mesVencido ? (
                            <>
                              He cancelado los aportes a la seguridad social mes vencido
                              mediante Planilla de pago Nro. <input
                                type="text"
                                className="border-black border-solid border-2 mt-2 mb-2 h-7"
                                style={{ width: "auto" }}
                                onChange={sizeHandleInputChange}
                              />, para el periodo no
                              aplica, discriminado así:
                              <p className='mt-2'>
                              Adjunta pago a la seguridad social mes vencido conforme a lo establecido en el Decreto 1273 de 2018.
                              </p>
                            </>
                          ) : (
                            <>
                              He cancelado los aportes a la seguridad social
                              mediante Planilla de pago Nro. <input
                                type="text"
                                className="border-black border-solid border-2 mt-2 mb-2 h-7"
                                style={{ width: "auto" }}
                                onChange={sizeHandleInputChange}
                              />, para el periodo no
                              aplica, discriminado así:
                            </>
                          )}
                        </p>
                        <table className="table2 mb-3">
                          <tbody>
                            <tr>
                              <td>Aportes Fondo de Pensiones:</td>
                              <td id-posicion={index.toString()} tipo="AFP">
                                {dontApplyAFP[index] ? (
                                  <span>No Aplica</span>
                                ) : (
                                  <input
                                    className="border-black border-solid border-2 mt-1 h-7 w-28"
                                    type="text"
                                    value={AFP[index]}
                                    onChange={(e) => handleInputChange(e, index, setAFP)}
                                  />
                                )}
                                <div id-confirmación="No Aplica">
                                  <input
                                    type="checkbox"
                                    name="aplica"
                                    checked={dontApplyAFP[index]}
                                    onChange={(e) => handleCheckboxChangeDontApply(e, index, setDontApplyAFP, setAFP)}
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>Aportes Fondo de Salud:</td>
                              <td id-posicion={index.toString()} tipo="AFS">
                                {dontApplyAFS[index] ? (
                                  <span>No Aplica</span>
                                ) : (
                                  <input
                                    className="border-black border-solid border-2 mt-1 h-7 w-28"
                                    type="text"
                                    value={AFS[index]}
                                    onChange={(e) => handleInputChange(e, index, setAFS)}
                                  />
                                )}
                                <div id-confirmación="No Aplica">
                                  <input
                                    type="checkbox"
                                    name="aplica"
                                    checked={dontApplyAFS[index]}
                                    onChange={(e) => handleCheckboxChangeDontApply(e, index, setDontApplyAFS, setAFS)}
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>Aportes Fondo de ARL:</td>
                              <td id-posicion={index.toString()} tipo="ARL">
                                {dontApplyARL[index] ? (
                                  <span>No Aplica</span>
                                ) : (

                                  <input
                                    className="border-black border-solid border-2 mt-1 h-7 w-28"
                                    type="text"
                                    value={ARL[index]}
                                    onChange={(e) => handleInputChange(e, index, setARL)}
                                  />
                                )}
                                <div id-confirmación="No Aplica">

                                  <input
                                    type="checkbox"
                                    name="aplica"
                                    checked={dontApplyARL[index]}
                                    onChange={(e) => handleCheckboxChangeDontApply(e, index, setDontApplyARL, setARL)}
                                  />
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>Total Seguridad Social:</td>
                              <td id-posicion={index.toString()} tipo="TOTAL">
                                <span>$</span>
                                <input
                                  className="border-black border-solid border-2 mt-1 h-7 w-28"
                                  type="text"
                                  value={TOTAL[index]}
                                  onChange={(e) => handleInputChange(e, index, setTOTAL)}
                                />
                              </td>
                            </tr>
                            <tr>
                              <button onClick={() => eliminarAportes(index)} className='bg-red-500 text-white px-4 py-2 rounded'>
                                Eliminar Aporte
                              </button>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <button id='botonDuplicador' onClick={duplicarAportes} className='text-white mt-4 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 '>
                    Duplicar Aportes
                  </button>
                </div>

              </div>
              <div>
                {mesVencido ? (
                  <></>
                ) : (<p className="texto3 mt-3 leading-none mb-2">
                  Solicito que estos valores sean descontados de la base de retención en la fuente.
                </p>)}
              </div>
            </div>
            <p className="texto3 leading-none mb-2">
              Con fundamento en lo establecido en la ley 2277 de 2022 que modifico el parágrafo 2 del Art. 383
              E.T, reglamentado por el Decreto 2231 de 2023 y los Art.1.2.4.1.17 y el 1.2.4.1.6 del DUR 1625 de
              2016, manifiesto bajo gravedad de juramento que en lo referente a la retención en la fuente me
              acojo a lo dispuesto en el artículo 383 del Estatuto Tributario y renuncio a solicitar costos y
              deducciones asociados al desarrollo de mi actividad económica en mi declaración de renta por el
              año 2024.
            </p>
            <p className="texto3 leading-none mb-5">
              Así mismo declaro que los ingresos obtenidos corresponden a honorarios y/o compensación por
              servicios personales por concepto de rentas de trabajo que no provienen de una relación laboral o
              legal y reglamentaria.
            </p>
            <div>
              <FirmaComponent />
            </div>
            <p className='texto3'>
              Firma_________________________ <br /> Nombre: {primer_nombre} {segundo_nombre} {primer_apellido} {segundo_apellido} <br />
              C.C {identificacion}
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
      <div className="flex justify-center mt-4">
        <button onClick={eventClick} className="focus:outline-none text-base text-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300  rounded-lg px-2 py-2 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" id='butonGenerarPdf'>Generar PDF</button>
      </div>
    </div>
  );

}
export default CuentaDeCobro;