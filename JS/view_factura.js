document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("facturasContainer")
    const inputBuscar = document.getElementById("buscadorCliente")
    const facturas = JSON.parse(localStorage.getItem("facturas")) || []

    function mostrarFacturas(filtradas) {
        contenedor.innerHTML = "";
    
        filtradas.forEach((factura, index) => {
            const div = document.createElement("div")
            div.classList.add("factura-card");
    
            div.innerHTML = `
                <h3>Factura N° ${factura.numeroFactura}</h3>
                <p><strong>Cliente:</strong> ${factura.nombreCliente}</p>
                <p><strong>Teléfono:</strong> ${factura.numeroTelefono}</p>
                <p><strong>Fecha:</strong> ${factura.fechaFactura}</p>
                <p><strong>Total:</strong> $${factura.total}</p>
                ${factura.cuotas > 1 ? `<p><strong>Cuota actual:</strong> ${factura.cuotaActual || 1}/${factura.cuotas}</p>` : ""}
                <button onclick="verFactura(${index})">Ver factura</button>
                <button onclick="descargarFacturaPDF(${index})" style="margin-left: 10px;">Descargar PDF</button>
                <button onclick="eliminarFactura(${index})" style="margin-left: 10px; color: red;">Eliminar</button>
                ${factura.cuotas > 1 ? `
                    <div style="margin-top:10px;">
                        <button onclick="mostrarFormularioCuota(${index})">Modificar cuotas pagadas</button>
                        <div id="formCuota-${index}" style="display: none; margin-top: 5px;">
                            <label>Cuota pagada:</label>
                            <input type="number" id="nuevaCuota-${index}" min="1" max="${factura.cuotas}" value="${factura.cuotaActual || 1}">
                            <button onclick="actualizarCuota(${index})">Guardar</button>
                        </div>
                    </div>
                ` : ""}
                <hr>
            `;
    
            contenedor.appendChild(div);
        });
    }
    

    inputBuscar.addEventListener("input", () => {
        const texto = inputBuscar.value.toLowerCase()
        const filtradas = facturas.filter(f => f.nombreCliente.toLowerCase().includes(texto) || f.numeroTelefono.includes(texto) || f.fechaFactura.includes(texto))
        mostrarFacturas(filtradas)
    });

    mostrarFacturas(facturas);
});

function verFactura(index) {
    const facturas = JSON.parse(localStorage.getItem("facturas")) || []
    const factura = facturas[index]
    mostrarFactura(factura)
}


function mostrarFactura(factura) {
    const totalPorCuota = (parseFloat(factura.total) / factura.cuotas).toFixed(2)
    const facturaHTML = `
        <html>
        <head>
            <title>Factura ${factura.numeroFactura}</title>
            <link rel="stylesheet" href="./CSS/facturas_styles.css">
        </head>
        <body>
            <div id="factura_container">
                <div class="header">
                    <img src="./img/jslogo.png" alt="Logo" width="100" height="100">
                    <h1>Factura Nro ${factura.numeroFactura}</h1>
                    <a href="./facturas.html">Volver al Historial</a>
                </div>
                <p><strong>Número:</strong> ${factura.numeroFactura}</p>
                <p><strong>Cliente:</strong> ${factura.nombreCliente}</p>
                <p><strong>Teléfono:</strong> ${factura.numeroTelefono}</p>
                <p><strong>Fecha:</strong> ${factura.fechaFactura}</p>
                ${factura.rut ? `<p><strong>RUT:</strong> ${factura.rut}</p>` : ""}
                <table>
                    <thead><tr><th>Servicio</th><th>Detalle</th><th>Precio</th></tr></thead>
                    <tbody>
                        ${factura.servicios.map(s => `<tr><td>${s.nombre}</td><td>${s.detalle}</td><td>$${s.precio.toFixed(2)}</td></tr>`).join("")}
                    </tbody>
                </table>
                ${factura.cuotas > 1 ? `<p><strong>Cuotas:</strong> ${factura.cuotaActual || 1}/${factura.cuotas} (${factura.cuotas} de $${totalPorCuota})</p>` : ""}
                ${factura.incluyeIva ? `<p><strong>IVA:</strong> $${factura.iva}</p>` : ""}
                <p class="total"><strong>Total:</strong> $${factura.total}</p>
                <p><strong>Descripción:</strong> ${factura.descripcion}</p>
                <div class="footer">
                    <p>Gracias por su compra</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const ventana = window.open("", "_blank")
    ventana.document.writeln(facturaHTML)
    ventana.document.close()
}

function eliminarFactura(index) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará la factura",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const facturas = JSON.parse(localStorage.getItem("facturas")) || [];
            facturas.splice(index, 1);
            localStorage.setItem("facturas", JSON.stringify(facturas));
            Swal.fire(
                '¡Eliminada!',
                'La factura fue eliminada correctamente.',
                'success'
            ).then(() => {
                location.reload();
            });
        }
    });
}


function mostrarFormularioCuota(index) {
    document.getElementById(`formCuota-${index}`).style.display = "block";
}

function actualizarCuota(index) {
    const facturas = JSON.parse(localStorage.getItem("facturas")) || [];
    const nuevaCuota = parseInt(document.getElementById(`nuevaCuota-${index}`).value);

    if (isNaN(nuevaCuota) || nuevaCuota < 1 || nuevaCuota > facturas[index].cuotas) {
        alert("Número de cuota inválido")
        return;
    }

    facturas[index].cuotaActual = nuevaCuota;
    localStorage.setItem("facturas", JSON.stringify(facturas));
    alert("Cuota actualizada correctamente")
    location.reload();
}


// Descargar pdf de la factura
function descargarFacturaPDF(index) {
    const facturas = JSON.parse(localStorage.getItem("facturas")) || [];
    const factura = facturas[index]
    const totalPorCuota = (parseFloat(factura.total) / factura.cuotas).toFixed(2)

    const container = document.createElement("div")
    container.innerHTML = `
        <div id="factura_container" style="font-family: Arial; padding: 20px;">
            <div class="header" style="text-align:center;">
                <img src="./img/jslogo.png" alt="Logo" width="100" height="100">
                <h1>Factura Nro ${factura.numeroFactura}</h1>
            </div>
            <p><strong>Número:</strong> ${factura.numeroFactura}</p>
            <p><strong>Cliente:</strong> ${factura.nombreCliente}</p>
            <p><strong>Teléfono:</strong> ${factura.numeroTelefono}</p>
            <p><strong>Fecha:</strong> ${factura.fechaFactura}</p>
            ${factura.rut ? `<p><strong>RUT:</strong> ${factura.rut}</p>` : ""}
            <table style="width: 100%; border-collapse: collapse;" border="1">
                <thead><tr><th>Servicio</th><th>Detalle</th><th>Precio</th></tr></thead>
                <tbody>
                    ${factura.servicios.map(s => `<tr><td>${s.nombre}</td><td>${s.detalle}</td><td>$${s.precio.toFixed(2)}</td></tr>`).join("")}
                </tbody>
            </table>
            ${factura.cuotas > 1 ? `<p><strong>Cuotas:</strong> ${factura.cuotas} de $${totalPorCuota}</p>` : ""}
            ${factura.incluyeIva ? `<p><strong>IVA:</strong> $${factura.iva}</p>` : ""}
            <p style="font-size: 18px;"><strong>Total:</strong> $${factura.total}</p>
            <p><strong>Descripción:</strong> ${factura.descripcion}</p>
            <div class="footer" style="margin-top: 30px; text-align:center;">
                <p>Gracias por su compra</p>
            </div>
        </div>
    `;

    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => {
        const opciones = {
            margin: 0.5,
            filename: `factura_${factura.numeroFactura}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opciones).from(container).save()
    };
    document.body.appendChild(script)
}
