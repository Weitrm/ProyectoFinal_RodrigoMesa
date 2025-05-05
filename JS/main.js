document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("invoiceForm")
    const tipoPagoSelect = document.getElementById("tipoPago");


    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const factura = crearFacturaDesdeFormulario()

        guardarFactura(factura)
        mostrarFactura(factura)

    })
})    

function crearFacturaDesdeFormulario() {
    const  numeroFactura = document.getElementById("numeroFactura").value
    const  nombreCliente = document.getElementById("nombreCliente").value
    const numeroTelefono = document.getElementById("numeroTelefono").value
    const fechaFactura = document.getElementById("fechaFactura").value
    const incluyeRut = document.getElementById("incluyeRut").checked
    const rut = incluyeRut ? document.getElementById("rut").value : "";
    const incluyeIva = document.getElementById("incluyeIva").checked
    const tipoPago = document.getElementById("tipoPago").value
    const cuotas = tipoPago === "cuota" ? parseInt(document.getElementById("cuotas").value) : 1
    const descripcion = document.getElementById("descripcion").value

    // Servicios seleccionados 

    const servicios = [] 

    document.querySelectorAll(".servicio").forEach(servicioDiv => {
        const checkbox = servicioDiv.querySelector("input[type='checkbox']")
        if (checkbox.checked) {
            const nombre = checkbox.value
            const inputPrecio = servicioDiv.querySelector("input[type='number']")
            const inputDetalle = servicioDiv.querySelector("input[type='text']")
            const precio = inputPrecio ? parseFloat(inputPrecio.value) || 0 : 0 
            const detalle = inputDetalle ? inputDetalle.value : ""

            servicios.push({
                nombre,
                precio,
                detalle
            })
        }
    })


    let total = servicios.reduce((sum, s) => sum + s.precio, 0)

    if (incluyeIva) {
        total *= 1.22 
    }

    return {
        numeroFactura,
        nombreCliente,
        numeroTelefono,
        fechaFactura,
        rut,
        incluyeIva,
        tipoPago,
        cuotas,
        descripcion,
        servicios,
        total: total.toFixed(2),
        cuotasPagadas: 1 
    }
}

// Guardar la factura
function guardarFactura(factura) {
    const facturasGuardadas = JSON.parse(localStorage.getItem("facturas")) || []
    facturasGuardadas.push(factura)
    localStorage.setItem("facturas", JSON.stringify(facturasGuardadas))
}

// Muestra la factura creada en uan nueva ventana
function mostrarFactura(factura) {
    const facturaHTML = `
        <html>
        <head>
            <title>Factura ${factura.numeroFactura}</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                h1 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                .footer { margin-top: 40px; text-align: center; }
            </style>
        </head>
        <body>
            <h1>Factura</h1>
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
            <p><strong>Total:</strong> $${factura.total}</p>
            ${factura.tipoPago === "cuotas" ? `<p><strong>Cuotas:</strong> ${factura.cuotas} (Cuota 1/${factura.cuotas})</p>` : ""}
            <p><strong>Descripción:</strong> ${factura.descripcion}</p>
            <div class="footer">
                <p>Gracias por su compra</p>
            </div>
        </body>
        </html>
    `;

    const ventana = window.open("", "_blank");
    ventana.document.writeln(facturaHTML);
    ventana.document.close();
}
