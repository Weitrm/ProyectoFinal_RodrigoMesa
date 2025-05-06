document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("facturasContainer");
    const inputBuscar = document.getElementById("buscadorCliente");
    const facturas = JSON.parse(localStorage.getItem("facturas")) || [];

    function mostrarFacturas(filtradas) {
        contenedor.innerHTML = "";
    
        filtradas.forEach((factura, index) => {
            const div = document.createElement("div");
            div.classList.add("factura-card");
    
            div.innerHTML = `
                <h3>Factura N° ${factura.numeroFactura}</h3>
                <p><strong>Cliente:</strong> ${factura.nombreCliente}</p>
                <p><strong>Teléfono:</strong> ${factura.numeroTelefono}</p>
                <p><strong>Fecha:</strong> ${factura.fechaFactura}</p>
                <p><strong>Total:</strong> $${factura.total}</p>
                ${factura.cuotas > 1 ? `<p><strong>Cuota actual:</strong> ${factura.cuotaActual || 1}/${factura.cuotas}</p>` : ""}
                <button onclick="verFactura(${index})">Ver factura</button>
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
        const texto = inputBuscar.value.toLowerCase();
        const filtradas = facturas.filter(f => f.nombreCliente.toLowerCase().includes(texto));
        mostrarFacturas(filtradas);
    });

    mostrarFacturas(facturas);
});

function verFactura(index) {
    const facturas = JSON.parse(localStorage.getItem("facturas")) || [];
    const factura = facturas[index];
    mostrarFactura(factura);
}


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
                <p>Gracias por su preferencia</p>
            </div>
        </body>
        </html>
    `;

    const ventana = window.open("", "_blank");
    ventana.document.writeln(facturaHTML);
    ventana.document.close();
}

function eliminarFactura(index) {
    if (confirm("¿Estás seguro de que querés eliminar esta factura?")) {
        const facturas = JSON.parse(localStorage.getItem("facturas")) || [];
        facturas.splice(index, 1);
        localStorage.setItem("facturas", JSON.stringify(facturas));
        location.reload(); 
    }
}

function mostrarFormularioCuota(index) {
    document.getElementById(`formCuota-${index}`).style.display = "block";
}

function actualizarCuota(index) {
    const facturas = JSON.parse(localStorage.getItem("facturas")) || [];
    const nuevaCuota = parseInt(document.getElementById(`nuevaCuota-${index}`).value);

    if (isNaN(nuevaCuota) || nuevaCuota < 1 || nuevaCuota > facturas[index].cuotas) {
        alert("Número de cuota inválido");
        return;
    }

    facturas[index].cuotaActual = nuevaCuota;
    localStorage.setItem("facturas", JSON.stringify(facturas));
    alert("Cuota actualizada correctamente");
    location.reload();
}