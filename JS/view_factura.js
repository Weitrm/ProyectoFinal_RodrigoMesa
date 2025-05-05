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
                ${factura.tipoPago === "cuotas" ? `
                    <p><strong>Cuotas:</strong> ${factura.cuotas}</p>
                    <p><strong>Cuotas pagadas:</strong> <span id="cuotasPagadas-${index}">${factura.cuotasPagadas}</span>/${factura.cuotas}</p>
                    <input type="number" min="1" max="${factura.cuotas}" value="${factura.cuotasPagadas}" id="inputCuotas-${index}" style="width: 60px;">
                    <button onclick="actualizarCuotas(${index})">Actualizar Cuotas</button>
                ` : ""}
                <button onclick="verFactura(${index})">Ver factura</button>
                <button onclick="eliminarFactura(${index})" style="margin-left: 10px; color: red;">Eliminar</button>
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

function eliminarFactura(index) {
    if (confirm("¿Estás seguro de que querés eliminar esta factura?")) {
        const facturas = JSON.parse(localStorage.getItem("facturas")) || [];
        facturas.splice(index, 1);
        localStorage.setItem("facturas", JSON.stringify(facturas));
        location.reload(); 
    }
}
