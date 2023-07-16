"use strict";
//Variables y Selectores-----------------------------------
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

//Eventos--------------------------------------------------

eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener("submit", agregarGasto);
}

//Clases---------------------------------------------------

class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );

    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    //Extrayendo valores
    const { presupuesto, restante } = cantidad;

    //añadir al html
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");
    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    //añadir mensaje
    divMensaje.textContent = mensaje;

    //insertar en html

    document.querySelector(".primario").insertBefore(divMensaje, formulario);

    //Quitar del html
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
  mostrarGastos(gastos) {
    //elimina el HTML duplicado
    this.limpiarHtml();

    // Iterar sobre los gastos
    gastos.forEach((gasto) => {
      const { cantidad, nombreGasto, id } = gasto;

      //crear un li
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className =
        " list-group-item d-flex justify-content-between align-items-center border border-primary ";
      nuevoGasto.dataset.id = id;

      //Agregar el HTML del gasto
      nuevoGasto.innerHTML = `${nombreGasto}  <span class='badge badge-primary badge-pill'>$ ${cantidad} </span> `;

      //boton para borrar gasto

      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.innerHTML = "Borrar &times";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      nuevoGasto.appendChild(btnBorrar);

      //Agregar al html
      gastoListado.appendChild(nuevoGasto);
    });
  }

  limpiarHtml() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }
  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobrarPresupuesto(presupuestObj) {
    const { presupuesto, restante } = presupuestObj;
    const restanteDiv = document.querySelector(".restante");

    //comprobar presupuesto 25%
    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    }
    //comprobar presupuesto 50%
    else if (presupuesto / 2 >= restante) {
      restanteDiv.classList.remove("alert-success", "alert-danger");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    //si el presupuesto se agota
    if (restante <= 0) {
      ui.imprimirAlerta("Presupuesto agotado", "error");
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

//instanciar----------------------------------------------

const ui = new UI();

let presupuesto;

//Funciones------------------------------------------------
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");

  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    //este código reinicia la pagina
    window.location.reload();
  }

  presupuesto = new Presupuesto(presupuestoUsuario);

  ui.insertarPresupuesto(presupuesto);
}

//añade gastos

function agregarGasto(e) {
  e.preventDefault();

  //leer los datos del formulario
  const nombreGasto = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  //validar
  if (nombreGasto === "" || cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no valida", "error");
    return;
  }

  //Generar un objeto con el gasto
  const gasto = { nombreGasto, cantidad, id: Date.now() };

  //añade un nuevo gasto
  presupuesto.nuevoGasto(gasto);

  //mensaje todo ok
  ui.imprimirAlerta("Gasto Agregado Correctamente");

  //imprimir los gastos
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobrarPresupuesto(presupuesto);

  //reiniciar formulario
  formulario.reset();
}

function eliminarGasto(id) {
  //elimina los datos de la clase
  presupuesto.eliminarGasto(id);

  //elimina los gastos del HTML
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobrarPresupuesto(presupuesto);
}

//reiniciar pagina
const btnReset = document.querySelector("#reset");
btnReset.onclick = () => {
  resetPagina();
};

function resetPagina() {
  location.reload(); // location.reload();
}
