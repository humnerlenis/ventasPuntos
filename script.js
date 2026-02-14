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
                if (this.value === 'natural') {
                    registroMercantil.style.display = 'none';
                } else {
                    registroMercantil.style.display = 'block';
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
    document.getElementById('generarPDF')?.addEventListener('click', generarPDF);
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

// Función para generar PDF según el aliado
function generarPDF() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage.includes('disglobal')) {
        //generarPDFDisglobal();
        generarPlanillaUnicaDisglobal()
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
    const tipoColocacion = document.querySelector('input[name="modeloNegocio"]')?.value || 'No especificado';
    const tipoCliente = document.querySelector('input[name="tipoCliente"]:checked')?.value || 'No especificado';
    const razonSocial = document.querySelector('input[name="razonSocial"]')?.value || 'No especificado';
    const rif = document.querySelector('input[name="rif"]')?.value || 'No especificado';
    
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
    const tipoColocacion = document.querySelector('select[name="modeloNegocio"]')?.value || 'No especificado';
    const tipoCliente = document.querySelector('input[name="tipoCliente"]:checked')?.value || 'No especificado';
    const razonSocial = document.querySelector('input[name="razonSocial"]')?.value || 'No especificado';
    const tiporif = document.querySelector('select[name="tipoRif"]')?.value || 'No especificado';
    let rif = document.querySelector('input[name="rif"]')?.value || 'No especificado';
    const banco = document.querySelector('select[name="banco"]')?.value || 'No especificado';
    let cuentaBancaria = document.querySelector('input[name="cuentaBancaria"]')?.value || 'No especificado';
    const actividadEconomica = document.querySelector('input[name="actividadEconomica"]')?.value || 'No especificado';
    const ciudad = document.querySelector('input[name="ciudad"]')?.value || 'No especificado';
    const estado = document.querySelector('input[name="estado"]')?.value || 'No especificado';
    const municipio = document.querySelector('input[name="municipio"]')?.value || 'No especificado';
    const codigoPostal = document.querySelector('input[name="codigoPostal"]')?.value || 'No especificado';
    const direccionFiscal = document.querySelector('input[name="direccionFiscal"]')?.value || 'No especificado';
    const telefono = document.querySelector('input[name="telefono"]')?.value || 'No especificado';
    const correo = document.querySelector('input[name="correo"]')?.value || 'No especificado';
    const nombreRegistroMercantil = document.querySelector('input[name="nombreRegistroMercantil"]')?.value || 'No especificado';
    const fechaRegistro = document.querySelector('input[name="fechaRegistro"]')?.value || 'No especificado';
    const nroRegistro = document.querySelector('input[name="nroRegistro"]')?.value || 'No especificado';    
    const numeroTomo = document.querySelector('input[name="numeroTomo"]')?.value || 'No especificado';
    const clausulaDelegatoria = document.querySelector('input[name="clausulaDelegatoria"]')?.value || 'No especificado';
    const ciudadRegistro = document.querySelector('input[name="ciudadRegistro"]')?.value || 'No especificado';

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
    
    
    // Agregar firma si existe
    const signatureCanvas = document.getElementById('signatureCanvas');
    if (signatureCanvas && !isCanvasBlank(signatureCanvas)) {
        const signatureData = signatureCanvas.toDataURL('image/png');
        doc.addImage(signatureData, 'PNG', 20, 150, 80, 30);
        doc.text('Firma del Representante', 20, 190);
    }
    
    // Guardar PDF
    doc.save('planilla_unica_disglobal.pdf');
    alert(fechaRegistro +" "+ fechareg +'   Planilla Unica generada exitosamente');
}


// Generar PDF para Vepagos
function generarPDFVepagos() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const tipoColocacion = document.querySelector('input[name="tipoColocacion"]:checked')?.value || 'contado';
    const comercio = document.querySelector('input[name="comercio"]')?.value || 'No especificado';
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
        
        const plazo = document.querySelector('input[name="plazoFinanciamiento"]')?.value || 'No especificado';
        const tasa = document.querySelector('input[name="tasaInteres"]')?.value || 'No especificado';
        const cuota = document.querySelector('input[name="cuotaMensual"]')?.value || 'No especificado';
        
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
    
    const razonSocial = document.querySelector('input[name="razonSocial"]')?.value || 'No especificado';
    const rif = document.querySelector('input[name="rif"]')?.value || 'No especificado';
    const modelo = document.querySelector('input[name="modelo"]')?.value || 'No especificado';
    
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
    
    const modalidad = document.querySelector('input[name="modalidad"]:checked')?.value || 'No especificado';
    const razonSocial = document.querySelector('input[name="razonSocial"]')?.value || 'No especificado';
    const rif = document.querySelector('input[name="rifComercio"]')?.value || 'No especificado';
    
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
        const razonSocial = document.querySelector('input[name="razonSocial"]')?.value || 'No especificado';
        mensaje += `*Disglobal*\nRazón Social: ${razonSocial}\n`;
    } else if (currentPage.includes('vepagos')) {
        const comercio = document.querySelector('input[name="comercio"]')?.value || 'No especificado';
        mensaje += `*Vepagos*\nComercio: ${comercio}\n`;
    } else if (currentPage.includes('master')) {
        const razonSocial = document.querySelector('input[name="razonSocial"]')?.value || 'No especificado';
        mensaje += `*Master*\nRazón Social: ${razonSocial}\n`;
    } else if (currentPage.includes('credicard')) {
        const razonSocial = document.querySelector('input[name="razonSocial"]')?.value || 'No especificado';
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