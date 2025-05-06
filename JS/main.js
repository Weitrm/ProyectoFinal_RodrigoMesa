document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("invoiceForm")
    const tipoPagoSelect = document.getElementById("tipoPago");


    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const factura = crearFacturaDesdeFormulario()

        guardarFactura(factura)
        mostrarFactura(factura)

    })

    tipoPagoSelect.addEventListener("change", (e) => {
        const cuotasDiv = document.getElementById("cuotasContainer")
        if (tipoPagoSelect.value === "cuota") {
            cuotasDiv.style.display = "block"
        } else {
            cuotasDiv.style.display = "none"
        }
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


    let ivaCalculado = 0

    if (incluyeIva) {
        ivaCalculado = total * 0.22
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
        iva: ivaCalculado.toFixed(2),
    }
}

// Guardar la factura
function guardarFactura(factura) {
    const facturasGuardadas = JSON.parse(localStorage.getItem("facturas")) || []
    facturasGuardadas.unshift(factura)
    localStorage.setItem("facturas", JSON.stringify(facturasGuardadas))
}

// Muestra la factura creada en uan nueva ventana
function mostrarFactura(factura) {
    const totalPorCuota = (parseFloat(factura.total) / factura.cuotas).toFixed(2);
    const facturaHTML = `
        <html>
        <head>
            <title>Factura ${factura.numeroFactura}</title>
            <link rel="stylesheet" href="./CSS/facturas_styles.css">
        </head>
        <body>
            <div class="header">
                <img src="./img/jslogo.png" alt="Logo" class="logo">
                <h1>Factura</h1>
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
            ${factura.cuotas > 1 ? `<p ><strong>Cuotas:</strong> ${factura.cuotas} de $${totalPorCuota}</p>` : ""}
            ${factura.incluyeIva ? `<p><strong>IVA:</strong> $${factura.iva}</p>` : ""}
            <p class="total"><strong>Total:</strong> $${factura.total}</p>
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
