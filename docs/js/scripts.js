let indiceActual = 0;
const diapositivas = document.querySelectorAll('.diapositiva');

function mostrarDiapositiva(indice) {
    // Si llegamos al final, volvemos a la primera
    if (indice >= diapositivas.length) {
        indiceActual = 0;
    }
    // Si retrocedemos desde la primera, vamos a la última
    else if (indice < 0) {
        indiceActual = diapositivas.length - 1;
    }
    else {
        indiceActual = indice;
    }

    // Ocultamos todas las diapositivas
    diapositivas.forEach(diapositiva => {
        diapositiva.classList.remove('activa');
    });

    // Mostramos solo la actual
    diapositivas[indiceActual].classList.add('activa');
}

function moverCarrusel(paso) {
    mostrarDiapositiva(indiceActual + paso);
}

// Hace que el carrusel pase automáticamente cada 5 segundos
setInterval(() => {
    moverCarrusel(1);
}, 5000);