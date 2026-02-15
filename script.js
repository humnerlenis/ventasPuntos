// Variables globales para firmas
let signaturePad, fingerprintPad;
let isDrawing = false;
let lastX = 0, lastY = 0;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeForms();
    initializeSignaturePads();
    setupEventListeners();
    setupQRScanner();
});

// Inicializar todos los formularios
function initializeForms() {
    // Disglobal - Mostrar/ocultar secciones según tipo de cliente
    const tipoClienteRadios = document.querySelectorAll('input[name="tipoCliente"]');
    if (tipoClienteRadios.length) {
        tipoClienteRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const registroMercantil = document.getElementById('registroMercantilSection');
                const representanteLegal = document.getElementById('representanteLegalSection');
                if (this.value === 'natural') {
                    registroMercantil.style.display = 'none';
                    representanteLegal.style.display = 'none';
                } else {
                    registroMercantil.style.display = 'block';
                    representanteLegal.style.display = 'block';
                }

            });
        });
    }

    // Disglobal - Mostrar/ocultar operadora según SIM
    const simSi = document.getElementById('simSi');
    const simNo = document.getElementById('simNo');
    const operadoraGroup = document.getElementById('operadoraGroup');

    if (simSi && simNo && operadoraGroup) {
        simSi.addEventListener('change', function() {
            operadoraGroup.style.display = 'block';
        });
        simNo.addEventListener('change', function() {
            operadoraGroup.style.display = 'none';
        });
    }

    // Disglobal - Mostrar/ocultar tarifa seguro
    const seguroSi = document.getElementById('seguroSi');
    const seguroNo = document.getElementById('seguroNo');
    const tarifaSeguroGroup = document.getElementById('tarifaSeguroGroup');

    if (seguroSi && seguroNo && tarifaSeguroGroup) {
        seguroSi.addEventListener('change', function() {
            tarifaSeguroGroup.style.display = 'block';
        });
        seguroNo.addEventListener('change', function() {
            tarifaSeguroGroup.style.display = 'none';
        });
    }

    // Disglobal - Mostrar/ocultar nombre de app adicional
    const appsSi = document.getElementById('appsSi');
    const appsNo = document.getElementById('appsNo');
    const nombreAppGroup = document.getElementById('nombreAppGroup');

    if (appsSi && appsNo && nombreAppGroup) {
        appsSi.addEventListener('change', function() {
            nombreAppGroup.style.display = 'block';
        });
        appsNo.addEventListener('change', function() {
            nombreAppGroup.style.display = 'none';
        });
    }

    // Vepagos - Mostrar/ocultar adendum según tipo de colocación
    const tipoColocacionRadios = document.querySelectorAll('input[name="tipoColocacion"]');
    const adendumSection = document.getElementById('adendumSection');
    
    if (tipoColocacionRadios.length && adendumSection) {
        tipoColocacionRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'financiado') {
                    adendumSection.style.display = 'block';
                } else {
                    adendumSection.style.display = 'none';
                }
            });
        });
    }
}

// Inicializar pads de firma
function initializeSignaturePads() {
    const signatureCanvas = document.getElementById('signatureCanvas');
    const fingerprintCanvas = document.getElementById('fingerprintCanvas');

    if (signatureCanvas) {
        setupCanvas(signatureCanvas);
        document.getElementById('clearSignature')?.addEventListener('click', () => clearCanvas(signatureCanvas));
    }

    if (fingerprintCanvas) {
        setupCanvas(fingerprintCanvas);
        document.getElementById('clearFingerprint')?.addEventListener('click', () => clearCanvas(fingerprintCanvas));
    }
}

// Configurar canvas para dibujo
function setupCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Eventos para mouse
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Eventos para touch
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
}

// Funciones de dibujo
function startDrawing(e) {
    isDrawing = true;
    const pos = getCoordinates(e);
    lastX = pos.x;
    lastY = pos.y;
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = e.target;
    const ctx = canvas.getContext('2d');
    const pos = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastX = pos.x;
    lastY = pos.y;
}

function stopDrawing() {
    isDrawing = false;
}

function getCoordinates(e) {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;

    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function handleTouchStart(e) {
    e.preventDefault();
    startDrawing(e);
}

function handleTouchMove(e) {
    e.preventDefault();
    draw(e);
}

function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Configurar event listeners generales
function setupEventListeners() {
    // Botones de generar PDF
    document.getElementById('generarPDF')?.addEventListener('click', function() {
        if (validarFormularioDisglobal()) {
            generarPDF();
        }
    });
    document.getElementById('enviarWhatsApp')?.addEventListener('click', enviarPorWhatsApp);
    document.getElementById('qrScannerBtn')?.addEventListener('click', scanQR);
}

// Función para escanear QR (simulada)
function scanQR() {
    // Simular escaneo de QR
    alert('Por favor, escanee el código QR del RIF');
    
    // Aquí iría la lógica real de escaneo
    // Por ahora simulamos datos
    setTimeout(() => {
        const razonSocial = document.querySelector('input[name="razonSocial"]');
        const rif = document.querySelector('input[name="rif"]');
        const direccion = document.querySelector('textarea[name="direccion"], input[name="direccionFiscal"]');
        
        if (razonSocial) razonSocial.value = 'COMERCIO EJEMPLO CA';
        if (rif) rif.value = 'J-123456789';
        if (direccion) direccion.value = 'Av. Principal, Edif. Comercial, Piso 1, Caracas 1010';
        
        alert('Datos del RIF cargados exitosamente');
    }, 2000);
}

//######### VALIDACIONES PAG DISGLOBAL #########
/*
function validarFormularioDisglobal() {
    const camposVacios = [];
    const campos = document.querySelectorAll('#disglobalForm input:not([type="radio"]):not([type="checkbox"]), #disglobalForm select, #disglobalForm textarea');
    
    campos.forEach(campo => {
        // Omitir campos ocultos o deshabilitados
        if (campo.type === 'hidden' || campo.disabled) return;
        
        // Verificar si el campo está visible
        const estilo = window.getComputedStyle(campo);
        if (estilo.display === 'none' || estilo.visibility === 'hidden') return;
        
        // Validar que no esté vacío (solo si es requerido o queremos validar todos)
        let valorVacio = false;
        if (campo.tagName === 'SELECT') {
            valorVacio = !campo.value || campo.value === '';
        } else {
            valorVacio = !campo.value.trim();
        }
        
        if (valorVacio && campo.hasAttribute('required')) {
            // Obtener nombre del campo para el mensaje
            let nombreCampo = '';
            const label = document.querySelector(`label[for="${campo.id}"]`);
            if (label) {
                nombreCampo = label.textContent.trim();
            } else {
                const parentDiv = campo.closest('.form-group');
                if (parentDiv) {
                    const parentLabel = parentDiv.querySelector('label');
                    if (parentLabel) nombreCampo = parentLabel.textContent.trim();
                }
            }
            
            camposVacios.push(nombreCampo || campo.name || campo.id || 'Campo sin nombre');
            campo.style.borderColor = '#ff4444';
        } else {
            campo.style.borderColor = '';
        }
    });

    // Validaciones condicionales específicas
    if (document.getElementById('simSi')?.checked) {
        const operadora = document.getElementById('operadora');
        if (operadora && (!operadora.value || !operadora.value.trim())) {
            camposVacios.push('Operadora');
            operadora.style.borderColor = '#ff4444';
        }
    }

    if (document.getElementById('seguroSi')?.checked) {
        const tarifaSeguro = document.getElementById('tarifaSeguro');
        const frecuenciaCobro = document.getElementById('frecuenciaCobro');
        const montoTarifa = document.getElementById('montoTarifa');
        
        if (tarifaSeguro && !tarifaSeguro.value.trim()) {
            camposVacios.push('Tarifa del Seguro');
            tarifaSeguro.style.borderColor = '#ff4444';
        }
        if (frecuenciaCobro && (!frecuenciaCobro.value || !frecuenciaCobro.value.trim())) {
            camposVacios.push('Frecuencia de Cobro');
            frecuenciaCobro.style.borderColor = '#ff4444';
        }
        if (montoTarifa && !montoTarifa.value.trim()) {
            camposVacios.push('Monto de Tarifa');
            montoTarifa.style.borderColor = '#ff4444';
        }
    }

    if (document.getElementById('appsSi')?.checked) {
        const nombreApp = document.getElementById('nombreApp');
        if (nombreApp && !nombreApp.value.trim()) {
            camposVacios.push('Nombre de la Aplicación');
            nombreApp.style.borderColor = '#ff4444';
        }
    }

    if (document.querySelector('input[name="tipoCliente"][value="juridica"]')?.checked) {
        const camposRegistro = [
            { id: 'nombreRegistroMercantil', nombre: 'Nombre del Registro Mercantil' },
            { id: 'fechaRegistro', nombre: 'Fecha de Registro' },
            { id: 'nroRegistro', nombre: 'Nro de Registro' },
            { id: 'numeroTomo', nombre: 'Número de Tomo' },
            { id: 'clausulaDelegatoria', nombre: 'Clausula Delegatoria' },
            { id: 'ciudadRegistro', nombre: 'Ciudad de Registro' }
        ];
        
        camposRegistro.forEach(campoInfo => {
            const campo = document.getElementById(campoInfo.id);
            if (campo && !campo.value.trim()) {
                camposVacios.push(campoInfo.nombre);
                campo.style.borderColor = '#ff4444';
            }
        });
    }

    if (camposVacios.length > 0) {
        alert('Campos obligatorios vacíos:\n- ' + camposVacios.join('\n- '));
        return false;
    }
    
    return true;
}*/

function validarFormularioDisglobal() {
    const camposVacios = [];
    const tipoCliente = document.querySelector('input[name="tipoCliente"]:checked')?.value;
    if (tipoCliente === 'natural') {
        // Para persona natural, copiar datos de razón social al representante legal
        const razonSocial = document.querySelector('input[name="razonSocial"]');
        let rif = document.querySelector('input[name="rif"]').value ;
        const telefono = document.querySelector('input[name="telefono"]').value;
        const correo = document.querySelector('input[name="correo"]').value; 
        const nombresRepresentante = document.getElementById('nombresRepresentante');
        const cedulaRepresentante = document.getElementById('cedulaRepresentante');
        const cargoRepresentante = document.getElementById('cargoRepresentante');
        const telefonoRepresentante = document.getElementById('telefonoRepresentante');
        const correoRepresentante = document.getElementById('correoRepresentante');
        if (razonSocial && nombresRepresentante) {   
            nombresRepresentante.value = razonSocial.value;
            cedulaRepresentante.value = rif.slice(0, -1); // Asumiendo que el RIF termina con una letra, se quita para la cédula
            cargoRepresentante.value = 'DUEÑO';
            telefonoRepresentante.value = telefono;
            correoRepresentante.value = correo;
        }
    }

    const campos = document.querySelectorAll('#disglobalForm input:not([type="radio"]):not([type="checkbox"]), #disglobalForm select, #disglobalForm textarea');
    
    campos.forEach(campo => {
        // Omitir campos ocultos o deshabilitados
        if (campo.type === 'hidden' || campo.disabled) return;
        
        // Verificar si el campo está visible
        const estilo = window.getComputedStyle(campo);
        if (estilo.display === 'none' || estilo.visibility === 'hidden') return;
        
        // Validar que no esté vacío (solo si es requerido o queremos validar todos)
        let valorVacio = false;
        if (campo.tagName === 'SELECT') {
            valorVacio = !campo.value || campo.value === '';
        } else {
            valorVacio = !campo.value.trim();
        }
        
        if (valorVacio && campo.hasAttribute('required')) {
            // Obtener nombre del campo para el mensaje
            let nombreCampo = '';
            const label = document.querySelector(`label[for="${campo.id}"]`);
            if (label) {
                nombreCampo = label.textContent.trim();
            } else {
                const parentDiv = campo.closest('.form-group');
                if (parentDiv) {
                    const parentLabel = parentDiv.querySelector('label');
                    if (parentLabel) nombreCampo = parentLabel.textContent.trim();
                }
            }
            
            camposVacios.push(nombreCampo || campo.name || campo.id || 'Campo sin nombre');
            campo.style.borderColor = '#ff4444';
        } else {
            campo.style.borderColor = '';
        }
    });

    // Validaciones condicionales específicas
    if (document.getElementById('simSi')?.checked) {
        // Validar operadora
        const operadora = document.getElementById('operadora');
        if (operadora && (!operadora.value || !operadora.value.trim())) {
            camposVacios.push('Operadora');
            operadora.style.borderColor = '#ff4444';
        }
        
        // Validar serial del SIM Card
        const serialSim = document.getElementById('serialSim');
        if (serialSim && !serialSim.value.trim()) {
            camposVacios.push('Serial del SIM Card');
            serialSim.style.borderColor = '#ff4444';
        }
    }

    if (document.getElementById('seguroSi')?.checked) {
        const tarifaSeguro = document.getElementById('tarifaSeguro');
        const frecuenciaCobro = document.getElementById('frecuenciaCobro');
        const montoTarifa = document.getElementById('montoTarifa');
        
        if (tarifaSeguro && !tarifaSeguro.value.trim()) {
            camposVacios.push('Tarifa del Seguro');
            tarifaSeguro.style.borderColor = '#ff4444';
        }
        if (frecuenciaCobro && (!frecuenciaCobro.value || !frecuenciaCobro.value.trim())) {
            camposVacios.push('Frecuencia de Cobro');
            frecuenciaCobro.style.borderColor = '#ff4444';
        }
        if (montoTarifa && !montoTarifa.value.trim()) {
            camposVacios.push('Monto de Tarifa');
            montoTarifa.style.borderColor = '#ff4444';
        }
    }

    if (document.getElementById('appsSi')?.checked) {
        const nombreApp = document.getElementById('nombreApp');
        if (nombreApp && !nombreApp.value.trim()) {
            camposVacios.push('Nombre de la Aplicación');
            nombreApp.style.borderColor = '#ff4444';
        }
    }

    // Validación específica para Persona Jurídica
    if (tipoCliente === 'juridica') {
        // Validar que el tipo de RIF sea J
        const tipoRif = document.querySelector('select[name="tipoRif"]');
        if (tipoRif && tipoRif.value !== 'J') {
            camposVacios.push('Tipo de RIF debe ser J para Persona Jurídica');
            tipoRif.style.borderColor = '#ff4444';
            
            // Mostrar mensaje específico
            alert('Para Persona Jurídica, el Tipo de RIF debe ser "J"');
        } else if (tipoRif) {
            tipoRif.style.borderColor = '';
        }

        // Validar campos del Registro Mercantil
        const camposRegistro = [
            { id: 'nombreRegistroMercantil', nombre: 'Nombre del Registro Mercantil' },
            { id: 'fechaRegistro', nombre: 'Fecha de Registro' },
            { id: 'nroRegistro', nombre: 'Nro de Registro' },
            { id: 'numeroTomo', nombre: 'Número de Tomo' },
            { id: 'clausulaDelegatoria', nombre: 'Clausula Delegatoria' },
            { id: 'ciudadRegistro', nombre: 'Ciudad de Registro' }
        ];
        
        camposRegistro.forEach(campoInfo => {
            const campo = document.getElementById(campoInfo.id);
            if (campo && !campo.value.trim()) {
                camposVacios.push(campoInfo.nombre);
                campo.style.borderColor = '#ff4444';
            }
        });

        // Validar campos del Representante Legal (solo para persona jurídica)
        const camposRepresentante = [
            { id: 'cedulaRepresentante', nombre: 'Cédula del Representante' },
            { id: 'nombresRepresentante', nombre: 'Nombres y Apellidos del Representante' },
            { id: 'cargoRepresentante', nombre: 'Cargo del Representante' },
            { id: 'telefonoRepresentante', nombre: 'Teléfono del Representante' },
            { id: 'correoRepresentante', nombre: 'Correo del Representante' }
        ];
            if(tipoCliente !== 'natural') {
            camposRepresentante.forEach(campoInfo => {
                const campo = document.getElementById(campoInfo.id);
                if (campo && !campo.value.trim()) {
                    camposVacios.push(campoInfo.nombre);
                    campo.style.borderColor = '#ff4444';
                }
            });
        }
    } else if (tipoCliente === 'natural' || tipoCliente === 'firma') {
        // Para persona natural o firma personal, validamos que el tipo de RIF sea V
        const tipoRif = document.querySelector('select[name="tipoRif"]');
        if (tipoRif && tipoRif.value !== 'V' && tipoRif.value !== 'E') {
            camposVacios.push('Tipo de RIF debe ser V o E para Persona Natural o Firma Personal');
            tipoRif.style.borderColor = '#ff4444';
            alert('Para Persona Natural o Firma Personal, el Tipo de RIF debe ser "V" o "E"');
        } else if (tipoRif) {
            tipoRif.style.borderColor = '';
        }

        // Nota: Los campos del representante legal NO se validan para persona natural
        // ya que se usan los datos de la razón social
        console.log('Validación de persona natural: usando datos de razón social');
    }

    // Validación específica para el formato del RIF
    const rifInput = document.getElementById('rif');
    if (rifInput && rifInput.value.trim()) {
        const rifValue = rifInput.value.trim();
        
        // Validar que el RIF tenga el formato correcto (solo números)
        if (!/^\d+$/.test(rifValue)) {
            camposVacios.push('RIF (solo números, sin letras ni guiones)');
            rifInput.style.borderColor = '#ff4444';
            alert('El RIF debe contener solo números');
        }
    }

    if (camposVacios.length > 0) {
        alert('Campos obligatorios vacíos o incorrectos:\n- ' + camposVacios.join('\n- '));
        return false;
    }
    
    return true;
}



//######## FIN VALIDACIONES PAG DISGLOBAL #########





// Función para generar PDF según el aliado
function generarPDF() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage.includes('disglobal')) {
        //generarPDFDisglobal();
        generarPlanillaUnicaDisglobal();
        generarCargoDisglobal();
    } else if (currentPage.includes('vepagos')) {
        generarPDFVepagos();
    } else if (currentPage.includes('master')) {
        generarPDFMaster();
    } else if (currentPage.includes('credicard')) {
        generarPDFCredicard();
    } else {
        alert('Seleccione un aliado para generar el PDF');
    }
}

// Generar PDF para Disglobal
function generarPDFDisglobal() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Obtener datos del formulario
    const tipoColocacion = document.querySelector('input[name="modeloNegocio"]').value;
    const tipoCliente = document.querySelector('input[name="tipoCliente"]:checked').value;
    const razonSocial = document.querySelector('input[name="razonSocial"]').value;
    const rif = document.querySelector('input[name="rif"]').value;
    
    // Configurar documento
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('CONTRATO DISGLOBAL', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tipo de Colocación: ${tipoColocacion}`, 20, 40);
    doc.text(`Tipo de Cliente: ${tipoCliente}`, 20, 50);
    doc.text(`Razón Social: ${razonSocial}`, 20, 60);
    doc.text(`RIF: ${rif}`, 20, 70);
    
    // Agregar firma si existe
    const signatureCanvas = document.getElementById('signatureCanvas');
    if (signatureCanvas && !isCanvasBlank(signatureCanvas)) {
        const signatureData = signatureCanvas.toDataURL('image/png');
        doc.addImage(signatureData, 'PNG', 20, 150, 80, 30);
        doc.text('Firma del Representante', 20, 190);
    }
    
    // Guardar PDF
    doc.save('contrato_disglobal.pdf');
    alert('PDF generado exitosamente');
}

function generarPlanillaUnicaDisglobal() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Obtener datos del formulario
    const tipoColocacion = document.querySelector('select[name="modeloNegocio"]').value;
    const tipoCliente = document.querySelector('input[name="tipoCliente"]:checked').value;
    const razonSocial = document.querySelector('input[name="razonSocial"]').value;
    const tiporif = document.querySelector('select[name="tipoRif"]').value;
    let rif = document.querySelector('input[name="rif"]').value;
    const banco = document.querySelector('select[name="banco"]').value;
    let cuentaBancaria = document.querySelector('input[name="cuentaBancaria"]').value;
    const actividadEconomica = document.querySelector('input[name="actividadEconomica"]').value;
    const ciudad = document.querySelector('input[name="ciudad"]').value;
    const estado = document.querySelector('input[name="estado"]').value;
    const municipio = document.querySelector('input[name="municipio"]').value;
    const codigoPostal = document.querySelector('input[name="codigoPostal"]').value;
    const direccionFiscal = document.querySelector('input[name="direccionFiscal"]').value;
    const telefono = document.querySelector('input[name="telefono"]').value;
    const correo = document.querySelector('input[name="correo"]').value;
    const nombreRegistroMercantil = document.querySelector('input[name="nombreRegistroMercantil"]').value;
    const fechaRegistro = document.querySelector('input[name="fechaRegistro"]').value;
    const nroRegistro = document.querySelector('input[name="nroRegistro"]').value;    
    const numeroTomo = document.querySelector('input[name="numeroTomo"]').value;
    const clausulaDelegatoria = document.querySelector('input[name="clausulaDelegatoria"]').value;
    const ciudadRegistro = document.querySelector('input[name="ciudadRegistro"]').value;
    const representanteLegal = document.querySelector('input[name="nombresRepresentante"]').value;
    const cargoRepresentante = document.querySelector('input[name="cargoRepresentante"]').value;
    const telefonoRepresentante = document.querySelector('input[name="telefonoRepresentante"]').value;
    const correoRepresentante = document.querySelector('input[name="correoRepresentante"]').value;
    const cedulaRepresentante = document.querySelector('input[name="cedulaRepresentante"]').value;
    const modeloEquipo = document.querySelector('input[name="modeloEquipo"]').value;
    const cantidadEquipo = document.querySelector('input[name="cantidadEquipo"]').value;
    const incluyeSim = document.querySelector('input[name="incluyeSim"]:checked').value;
    const operadora = document.querySelector('select[name="operadora"]').value;
    const incluyeSeguro = document.querySelector('input[name="incluyeSeguro"]:checked').value;    
    const tarifaSeguro = document.querySelector('input[name="tarifaSeguro"]').value;
    const frecuenciaCobro = document.querySelector('select[name="frecuenciaCobro"]').value;
    const montoTarifa = document.querySelector('input[name="montoTarifa"]').value;    
    const appAdicional = document.querySelector('input[name="appsAdicionales"]:checked').value;
    const nombreAppAdicional = document.querySelector('input[name="nombreApp"]').value;
    const serialEquipo = document.querySelector('input[name="serialEquipo"]').value;
    const serialSim = document.querySelector('input[name="serialSim"]').value;
    const modeloRecepcion = document.querySelector('input[name="modeloRecepcion"]').value;
    const marcaRecepcion = document.querySelector('input[name="marcaRecepcion"]').value;
    const serialRecepcion = document.querySelector('input[name="serialRecepcion"]').value;


    // Configurar documento
    let imgData= new Image();
    imgData.src = 'img/disglobal/planilla_unica.png'; // Tu imagen en Base64
    doc.addImage(imgData, 'PNG', 0, 0, 210, 297); // 210x297mm es A4
    doc.setFont('helvetica');
    doc.setFontSize(7);
    const fechaActual = new Date();

    const dia = fechaActual.getDate();       // Día del mes (1-31)
    const mes = fechaActual.getMonth() + 1;  // Mes (0-11, por eso sumamos 1)
    const anio = fechaActual.getFullYear();
    doc.text(`  ${String(dia).padStart(2, '0')} ${String(mes).padStart(2, '0')}  ${anio}`, 185, 16, );
    doc.setFontSize(12);
    doc.text("X", 193, 25, );
    
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    switch (tipoColocacion ) {
        case "contado":
            doc.text("X", 110, 44, );
            break;
        case "financiado":
            doc.text("X", 140, 44, );
            break;
        case "comodato":
            doc.text("X", 162, 44, );
            break;    
        default:
            break;
    }
     doc.setFontSize(10);
    doc.text(` ${banco.toUpperCase()}`, 31, 53);
   
    
    cuentaBancaria.replace(/[\s-]+/g, '');
    let distancia = 105; // Posición inicial para la primera letra
    for (let caracter of cuentaBancaria) {

    doc.text(` ${caracter}`, distancia, 53); 
    distancia += 4.35; // Incrementar la distancia para la siguiente letra
    }
    doc.text(` ${tiporif}`, 18, 66);

    //doc.text(`RIF: ${rif}`, 18, 66);
    rif = rif.replace(/[\s-a-zA-Z]/g, '');
        distancia = 22.3; // Posición inicial para la primera letra
    for (let caracter of rif) {

    doc.text(` ${caracter}`, distancia, 66); 
    distancia += 4.35; // Incrementar la distancia para la siguiente letra
    }
    
    doc.text(`${razonSocial.toUpperCase().slice(0, 30)}`, 65, 66);
    doc.text(`${actividadEconomica.toUpperCase().slice(0, 25)}`, 140, 66);
    doc.text(`${ciudad.toUpperCase().slice(0, 25)}`, 16, 76);
    doc.text(`${estado.toUpperCase().slice(0, 25)}`, 71, 76);
    doc.text(`${municipio.toUpperCase().slice(0, 25)}`, 128, 76);
    doc.text(`${codigoPostal.toUpperCase().slice(0, 6)}`, 180, 76);
    doc.text(`${direccionFiscal.toUpperCase().slice(0, 100)}`, 16, 86);
    doc.text(`${telefono.toUpperCase().slice(0, 4)}`, 19, 95);
    doc.text(`${telefono.toUpperCase().slice(4, 11)}`, 40, 95);
    doc.text(`${correo.toUpperCase().slice(0, 30)}`, 132, 95);
    doc.text(`${nombreRegistroMercantil.toUpperCase().slice(0, 50)}`, 16, 109);
    let fechareg = fechaRegistro.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1');
    

    //const fechaFormateada = `${diaR}/${mesR}/${anioR}`;
    doc.text(`${fechareg}`, 16, 117);
    doc.text(`${nroRegistro.toUpperCase().slice(0, 30)}`, 50, 117);    
    doc.text(`${numeroTomo.toUpperCase().slice(0, 30)}`, 90, 117);
    doc.text(`${clausulaDelegatoria.toUpperCase().slice(0, 30)}`, 133, 117);
    doc.text(`${ciudadRegistro.toUpperCase().slice(0, 30)}`, 160, 117);
    
    if (tipoCliente === 'natural') {
        doc.setFontSize(9);
        doc.text(`${rif.slice(0, 8)}`, 16, 132);
        doc.text(`${razonSocial.toUpperCase().slice(0, 30)}`, 36, 132);
        doc.text(`${telefono.toUpperCase().slice(0, 11)}`, 123, 132);
        doc.text(`${correo.toUpperCase().slice(0, 30)}`, 155, 132);
        //seccion de representante legal al final del documento
        doc.setFontSize(7);
        doc.text(`${razonSocial.toUpperCase().slice(0, 30)}`, 34, 221);
        doc.text(`${ciudad.toUpperCase().slice(0, 30)}`, 16, 225);
        doc.text(`${rif.slice(0, 8)}`, 100, 225);
    } else {
         doc.setFontSize(9);
       /* doc.text(`${razonSocial.toUpperCase().slice(0, 30)}`, 16, 132);
        doc.text(`${telefono.toUpperCase().slice(0, 11)}`, 123, 132);*/
        doc.text(`${cedulaRepresentante.slice(0, 10)}`, 16, 132);
        doc.text(`${representanteLegal.toUpperCase().slice(0, 30)}`, 40, 132);
        doc.text(`${cargoRepresentante.toUpperCase().slice(0, 30)}`, 70, 132);
        doc.text(`${telefonoRepresentante.toUpperCase().slice(0, 11)}`, 126, 132);
        doc.text(`${correoRepresentante.toUpperCase().slice(0, 30)}`, 153, 132);
        //seccion de representante legal al final del documento
        doc.setFontSize(7);
        doc.text(`${representanteLegal.toUpperCase().slice(0, 30)}`, 34, 221);
        doc.text(`${ciudad.toUpperCase().slice(0, 30)}`, 16, 225);
        doc.text(`${cedulaRepresentante.slice(0, 10)}`, 100, 225);
    }

    doc.text(`${modeloEquipo.toUpperCase().slice(0, 30)}`, 22, 147);
    doc.text(`${cantidadEquipo.toUpperCase().slice(0, 5)}`, 60, 147);

        switch (incluyeSim) {
        case "si":
            doc.text("X", 71, 147 );
            break;
        case "no":
            doc.text("X", 80, 147 );
            break;
        default:
            break;
    }
        switch (operadora) {
        case "movistar":
            doc.text("X", 110, 143 );
            break;
        case "digitel":
            doc.text("X", 110, 147 );
            break;
        case "movilnet":
            doc.text("X", 110, 151 );
            break;
        default:
            break;
    }
        switch (incluyeSeguro) {
        case "si":
            doc.text("X", 123, 147 );
            doc.text(`${tarifaSeguro.toUpperCase().slice(0, 30)}`, 141, 147);
             doc.setFontSize(5);
            doc.text(`${frecuenciaCobro.toUpperCase().slice(0, 30)}`, 159, 147);
             doc.setFontSize(9);
            doc.text(`${montoTarifa.toUpperCase().slice(0, 30)}`, 183, 147);
            break;
        case "no":  
            doc.text("X", 132, 147 );
            break;
        default:
            break;
    }

        switch (appAdicional) { 
        case "si":
            doc.text("X", 63, 151 );
            doc.setFontSize(9);
            doc.text(`${nombreAppAdicional.toUpperCase().slice(0, 80)}`, 28, 155);
            break;
        case "no":
            doc.text("X", 71, 151 );
            break;
        default:
            break;
    }
    doc.setFontSize(9);
     doc.text(`${serialEquipo.toUpperCase().slice(0, 30)}`, 34, 166);
     doc.text(`${serialSim.toUpperCase().slice(0, 30)}`, 105, 166);

    doc.text(`${modeloRecepcion.toUpperCase().slice(0, 30)}, ${marcaRecepcion.toUpperCase().slice(0, 30)}, ${serialRecepcion.toUpperCase().slice(0, 30)}`, 16, 174);
   






    // Agregar firma si existe
    const signatureCanvas = document.getElementById('signatureCanvas');
    if (signatureCanvas && !isCanvasBlank(signatureCanvas)) {
        const signatureData = signatureCanvas.toDataURL('image/png');
        doc.text(`${razonSocial.toUpperCase().slice(0, 30)}`, 65, 245);
        doc.text(`${rif.slice(0, 8)}`, 68, 256);
        doc.addImage(signatureData, 'PNG', 65, 258, 35, 10);
        
    }
    
    // Guardar PDF
    doc.save('planilla_unica_disglobal.pdf');
    alert('   Planilla Unica generada exitosamente');
}

function generarCargoDisglobal() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();    
        
    const tipoCliente = document.querySelector('input[name="tipoCliente"]:checked').value;
    let representanteLegal = document.querySelector('input[name="nombresRepresentante"]').value ;
    let cedulaRepresentante = document.querySelector('input[name="cedulaRepresentante"]').value ;
    const razonSocial = document.querySelector('input[name="razonSocial"]').value ;
    const tiporif = document.querySelector('select[name="tipoRif"]').value ;
    let rif = document.querySelector('input[name="rif"]').value ;
    const banco = document.querySelector('select[name="banco"]').value ;
    const cuentaBancaria = document.querySelector('input[name="cuentaBancaria"]').value ;
    let imgData= new Image();
    imgData.src = 'img/disglobal/cargo_a_cuenta.png'; // Tu imagen en Base64
    doc.addImage(imgData, 'PNG', 0, 0, 210, 297); // 210x297mm es A4
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');    
     
    if (tipoCliente === 'natural') {
        // Para persona natural, copiar datos de razón social al representante legal
        representanteLegal = document.querySelector('input[name="razonSocial"]').value
        cedulaRepresentante = rif.slice(0, -1);
        doc.text(`${representanteLegal.toUpperCase()}`, 30, 82);  
        doc.text(`${tiporif.toUpperCase()}-${cedulaRepresentante.toUpperCase()}`, 120, 88);  
        doc.text(`${razonSocial.toUpperCase()}`, 85, 107);  
        doc.text(`${tiporif.toUpperCase()}-${rif}`, 60, 113); 
        doc.text(`${cuentaBancaria}`, 37, 124);
               
    }else {
        doc.text(`${representanteLegal.toUpperCase()}`, 30, 82);  
        doc.text(`${cedulaRepresentante.toUpperCase()}`, 120, 88);  
        doc.text(`${razonSocial.toUpperCase()}`, 85, 107);  
        doc.text(`${tiporif.toUpperCase()}-${rif}`, 60, 113); 
        doc.text(`${cuentaBancaria}`, 37, 124);
     

    }

    // Agregar firma si existe
    const signatureCanvas = document.getElementById('signatureCanvas');
    if (signatureCanvas && !isCanvasBlank(signatureCanvas)) {
        const signatureData = signatureCanvas.toDataURL('image/png');
        
        doc.addImage(signatureData, 'PNG', 30, 200, 35, 10);
        
    }
         doc.setFontSize(7);
    doc.text(`${representanteLegal.toUpperCase()}`, 30, 220); 
      doc.setFontSize(10);
    doc.text(`${cedulaRepresentante.toUpperCase()}`, 30, 230); 
    
    
      
    doc.save('cargo_a_cuenta.pdf');
    alert('Cargo a cuenta generado exitosamente');
}   

function generarContratoDisglobal(tipoContrato) {
    /* datos necesarios para el contrato */
    /* 
    pag 1
    nombre completo
    ciudad de domicilio
    RIF
    pago mensual (mNTENIMIENTO)
    pag 2
    DIRECCION
    TELEFONO
    NOMBRE
    CORREO
    CIUDAD 
    FECHA
    modelo
    serial equipo
    serial simcard
    banco    */

     // Obtener datos del formulario
    const tipoColocacion = document.querySelector('select[name="modeloNegocio"]').value;
    const tipoCliente = document.querySelector('input[name="tipoCliente"]:checked').value;
    const razonSocial = document.querySelector('input[name="razonSocial"]').value;
    const tiporif = document.querySelector('select[name="tipoRif"]').value;
    let rif = document.querySelector('input[name="rif"]').value;
    const banco = document.querySelector('select[name="banco"]').value;
   
    const ciudad = document.querySelector('input[name="ciudad"]').value;
    const estado = document.querySelector('input[name="estado"]').value;
    
    
    const direccionFiscal = document.querySelector('input[name="direccionFiscal"]').value;
    const telefono = document.querySelector('input[name="telefono"]').value;
    const correo = document.querySelector('input[name="correo"]').value;
    const nombreRegistroMercantil = document.querySelector('input[name="nombreRegistroMercantil"]').value;
    const fechaRegistro = document.querySelector('input[name="fechaRegistro"]').value;
    const nroRegistro = document.querySelector('input[name="nroRegistro"]').value;    
    const numeroTomo = document.querySelector('input[name="numeroTomo"]').value;
    const clausulaDelegatoria = document.querySelector('input[name="clausulaDelegatoria"]').value;
    const ciudadRegistro = document.querySelector('input[name="ciudadRegistro"]').value;
    let representanteLegal = document.querySelector('input[name="nombresRepresentante"]').value;
    const cargoRepresentante = document.querySelector('input[name="cargoRepresentante"]').value;
    const telefonoRepresentante = document.querySelector('input[name="telefonoRepresentante"]').value;
    const correoRepresentante = document.querySelector('input[name="correoRepresentante"]').value;
    let cedulaRepresentante = document.querySelector('input[name="cedulaRepresentante"]').value;
    const modeloEquipo = document.querySelector('input[name="modeloEquipo"]').value;
    
    
   
      
    
    const serialEquipo = document.querySelector('input[name="serialEquipo"]').value;
    const serialSim = document.querySelector('input[name="serialSim"]').value;
   



    const { jsPDF } = window.jspdf;
            const doc = new jsPDF(); 

    switch (tipoContrato) {
        
        
        case 'natural':
            // Generar contrato PN
               
                
            
            
            let imgData1= new Image();
            imgData1.src = 'img/disglobal/contrato_PN_1.png'; // Tu imagen en Base64
            doc.addImage(imgData1, 'PNG', 0, 0, 216, 279); //carta es 216x279mm
            doc.setFontSize(6);
            doc.setFont('helvetica', 'normal');    
            
            
                // Para persona natural, copiar datos de razón social al representante legal
                representanteLegal = document.querySelector('input[name="razonSocial"]').value
                cedulaRepresentante = rif.slice(0, -1);
                doc.text(`${representanteLegal.toUpperCase()}`, 15, 29.5);  
                doc.text(`${ciudad.toUpperCase()}`, 127, 29.5); 
                doc.text(`${cedulaRepresentante.toUpperCase()}`, 15, 32);  
                
                doc.text(`${tiporif.toUpperCase()}-${rif}`, 80, 32); 
                doc.text(`CUARENTA`, 125, 119.5);
                doc.text(`40$`, 195, 119.5);
                    
           doc.addPage();
            let imgData2= new Image();
            imgData2.src = 'img/disglobal/contrato_PN_2.png'; // Tu imagen en Base64
            doc.addImage(imgData2, 'PNG', 0, 0, 216, 279);  
            doc.setFontSize(6);
            doc.setFont('helvetica', 'normal');

            doc.text(`${direccionFiscal.toUpperCase()}`, 15, 152.5);
            doc.text(`${telefono.toUpperCase()}`, 95, 152.5);
             doc.text(`${representanteLegal.toUpperCase()}`, 146, 152.5); 
            doc.text(`${correo.toUpperCase()}`, 15, 155);
            doc.text(`${ciudad.toUpperCase()}`, 151, 157);
            const fechaActual = new Date();
            const dia = fechaActual.getDate();       // const mes = fechaActual.getMonth() + 1;  // Mes (0-11, por eso sumamos 1)
            const mes = fechaActual.toLocaleString('default', { month: 'long' });   
            const anio = fechaActual.getFullYear();
            doc.text(` ${dia} `, 190, 157);
            doc.text(`  ${mes.toUpperCase()} `, 20, 159.5);
            doc.text(` ### ${anio}`, 54, 159.5);
            doc.text(`${modeloEquipo.toUpperCase()}`, 30, 183);
            doc.text(`${serialEquipo.toUpperCase()}`, 30, 185.6);
            doc.text(`${serialSim.toUpperCase()}`, 30, 188);
            doc.text(`${banco.toUpperCase()}`, 30, 190.4);
            doc.setFontSize(5);
            doc.text(`${ciudad.toUpperCase()}`, 79.8, 195);
            doc.setFontSize(6);
            doc.text(` ${dia} `, 102, 195);
            doc.text(`  ${mes.toUpperCase()} `, 120, 195);
            doc.text(` ### ${anio}`, 147.5, 195);

            // Agregar firma si existe
            const signatureCanvas = document.getElementById('signatureCanvas');
            if (signatureCanvas && !isCanvasBlank(signatureCanvas)) {
                const signatureData = signatureCanvas.toDataURL('image/png');
                
                doc.addImage(signatureData, 'PNG', 137, 165, 35, 10);
                doc.addImage(signatureData, 'PNG', 137, 205, 35, 10);
                
            }
                doc.setFontSize(7);
           
            
            
            
            
            doc.save('contrato_PN.pdf');
            alert('Contrato PN generado exitosamente');
            break;
        case 'juridica':
            // Generar contrato 2
            break;
            case 'firma':
            // Generar contrato 3
            break;
    
        default:
            break;
    }
}

// Generar PDF para Vepagos
function generarPDFVepagos() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const tipoColocacion = document.querySelector('input[name="tipoColocacion"]:checked')?.value || 'contado';
    const comercio = document.querySelector('input[name="comercio"]').value;
    const monto = document.querySelector('input[name="monto"]')?.value || '0';
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('RECIBO DE PAGO VEPAGOS', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Comercio: ${comercio}`, 20, 40);
    doc.text(`Tipo: ${tipoColocacion}`, 20, 50);
    doc.text(`Monto: Bs. ${monto}`, 20, 60);
    
    // Si es financiado, generar adendum
    if (tipoColocacion === 'financiado') {
        doc.addPage();
        doc.setFontSize(16);
        doc.text('ADENDUM FINANCIAMIENTO', 105, 20, { align: 'center' });
        
        const plazo = document.querySelector('input[name="plazoFinanciamiento"]').value;
        const tasa = document.querySelector('input[name="tasaInteres"]').value;
        const cuota = document.querySelector('input[name="cuotaMensual"]').value;
        
        doc.setFontSize(12);
        doc.text(`Plazo: ${plazo} meses`, 20, 40);
        doc.text(`Tasa de Interés: ${tasa}%`, 20, 50);
        doc.text(`Cuota Mensual: Bs. ${cuota}`, 20, 60);
    }
    
    // Agregar firma
    const signatureCanvas = document.getElementById('signatureCanvas');
    if (signatureCanvas && !isCanvasBlank(signatureCanvas)) {
        const signatureData = signatureCanvas.toDataURL('image/png');
        doc.addImage(signatureData, 'PNG', 20, 150, 80, 30);
        doc.text('Firma', 20, 190);
    }
    
    doc.save('recibo_vepagos.pdf');
    alert('Recibo generado exitosamente');
}

// Generar PDF para Master
function generarPDFMaster() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const razonSocial = document.querySelector('input[name="razonSocial"]').value;
    const rif = document.querySelector('input[name="rif"]').value;
    const modelo = document.querySelector('input[name="modelo"]').value;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('SOLICITUD DE AUTORIZACIÓN DE VENTA - MASTER', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Razón Social: ${razonSocial}`, 20, 40);
    doc.text(`RIF: ${rif}`, 20, 50);
    doc.text(`Modelo de Equipo: ${modelo}`, 20, 60);
    doc.text('Tipo de Venta: Contado', 20, 70);
    doc.text('Marca: MASTER', 20, 80);
    
    // Agregar firma
    const signatureCanvas = document.getElementById('signatureCanvas');
    if (signatureCanvas && !isCanvasBlank(signatureCanvas)) {
        const signatureData = signatureCanvas.toDataURL('image/png');
        doc.addImage(signatureData, 'PNG', 20, 150, 80, 30);
        doc.text('Firma del Solicitante', 20, 190);
    }
    
    doc.save('solicitud_master.pdf');
    alert('Solicitud generada exitosamente');
}

// Generar PDF para Credicard
function generarPDFCredicard() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const modalidad = document.querySelector('input[name="modalidad"]:checked').value;
    const razonSocial = document.querySelector('input[name="razonSocial"]').value;
    const rif = document.querySelector('input[name="rifComercio"]').value;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('CONTRATO CREDICARD', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Modalidad: ${modalidad}`, 20, 40);
    doc.text(`Razón Social: ${razonSocial}`, 20, 50);
    doc.text(`RIF: ${rif}`, 20, 60);
    
    // Agregar firma
    const signatureCanvas = document.getElementById('signatureCanvas');
    if (signatureCanvas && !isCanvasBlank(signatureCanvas)) {
        const signatureData = signatureCanvas.toDataURL('image/png');
        doc.addImage(signatureData, 'PNG', 20, 150, 80, 30);
        doc.text('Firma del Representante', 20, 190);
    }
    
    doc.save('contrato_credicard.pdf');
    alert('Contrato generado exitosamente');
}

// Función para enviar por WhatsApp
function enviarPorWhatsApp() {
    const currentPage = window.location.pathname.split('/').pop();
    let mensaje = 'Hola, adjunto los documentos de la venta:\n\n';
    
    // Obtener datos básicos según la página
    if (currentPage.includes('disglobal')) {
        const razonSocial = document.querySelector('input[name="razonSocial"]').value;
        mensaje += `*Disglobal*\nRazón Social: ${razonSocial}\n`;
    } else if (currentPage.includes('vepagos')) {
        const comercio = document.querySelector('input[name="comercio"]').value;
        mensaje += `*Vepagos*\nComercio: ${comercio}\n`;
    } else if (currentPage.includes('master')) {
        const razonSocial = document.querySelector('input[name="razonSocial"]').value;
        mensaje += `*Master*\nRazón Social: ${razonSocial}\n`;
    } else if (currentPage.includes('credicard')) {
        const razonSocial = document.querySelector('input[name="razonSocial"]').value;
        mensaje += `*Credicard*\nRazón Social: ${razonSocial}\n`;
    }
    
    mensaje += '\nLos documentos PDF se adjuntan por separado.';
    
    // Codificar mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Abrir WhatsApp
    window.open(`https://wa.me/?text=${mensajeCodificado}`, '_blank');
    
    // Generar PDF antes de enviar
    generarPDF();
}

// Utilidad para verificar si el canvas está vacío
function isCanvasBlank(canvas) {
    const context = canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(
        context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
    return !pixelBuffer.some(color => color !== 0);
}