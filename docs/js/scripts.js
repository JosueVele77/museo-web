/* ================= CARRUSEL DE INICIO ================= */
let indiceActual = 5;
const diapositivas = document.querySelectorAll('.diapositiva');

if(diapositivas.length > 0) {
    function mostrarDiapositiva(indice) {
        if (indice >= diapositivas.length) indiceActual = 0;
        else if (indice < 0) indiceActual = diapositivas.length - 1;
        else indiceActual = indice;

        diapositivas.forEach(diapositiva => diapositiva.classList.remove('activa'));
        diapositivas[indiceActual].classList.add('activa');
    }

    function moverCarrusel(paso) {
        mostrarDiapositiva(indiceActual + paso);
    }

    setInterval(() => {
        moverCarrusel(1);
    }, 5000);
}

/* ================= LÓGICA DE EVALUACIÓN ================= */
document.addEventListener("DOMContentLoaded", () => {
    // Verificamos si estamos en la página de evaluación
    const quizContainer = document.getElementById('quiz-preguntas-container');
    if (!quizContainer) return;

    const preguntas = document.querySelectorAll('.pregunta-item');
    const totalPreguntas = preguntas.length;
    let preguntaActual = 0;
    let puntaje = 0;

    const progressBar = document.getElementById('quiz-progress');
    const progressText = document.getElementById('quiz-progress-text');
    const progressPercent = document.getElementById('quiz-progress-percent');
    const nextBtn = document.getElementById('btn-siguiente');
    const resultContainer = document.getElementById('resultado-container');
    const scoreText = document.getElementById('score-final');

    function actualizarProgreso() {
        // Calculamos porcentaje basado en preguntas completadas o mostrando la actual
        let porcentaje = Math.round((preguntaActual / totalPreguntas) * 100);
        progressBar.style.width = porcentaje + '%';
        progressBar.setAttribute('aria-valuenow', porcentaje);
        progressText.innerText = `Pregunta ${preguntaActual + 1} de ${totalPreguntas}`;
        progressPercent.innerText = `${porcentaje}% completado`;
    }

    function mostrarPregunta(index) {
        preguntas.forEach((p, i) => {
            p.style.display = i === index ? 'block' : 'none';
        });
        nextBtn.style.display = 'none'; // Ocultar botón siguiente hasta responder
        if (index < totalPreguntas) {
            actualizarProgreso();
        }
    }

    preguntas.forEach((pregunta, index) => {
        const botones = pregunta.querySelectorAll('.opcion-btn');
        const feedbackBox = pregunta.querySelector('.feedback');

        botones.forEach(boton => {
            boton.addEventListener('click', function() {
                if (this.disabled) return;

                const esCorrecta = this.getAttribute('data-correcta') === 'true';

                // Deshabilitar botones de esta pregunta
                botones.forEach(btn => {
                    btn.disabled = true;
                    if (btn.getAttribute('data-correcta') === 'true') {
                        btn.classList.add('correcta');
                    }
                });

                feedbackBox.style.display = 'block';
                if (esCorrecta) {
                    puntaje++;
                    feedbackBox.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> ¡Correcto!';
                    feedbackBox.className = 'feedback mt-3 text-center text-success';
                } else {
                    this.classList.add('incorrecta');
                    feedbackBox.innerHTML = '<i class="bi bi-x-circle-fill text-danger"></i> Incorrecto.';
                    feedbackBox.className = 'feedback mt-3 text-center text-danger';
                }

                // Mostrar botón para avanzar
                nextBtn.style.display = 'inline-block';
                if (index === totalPreguntas - 1) {
                    nextBtn.innerText = 'Ver Resultados Finales';
                }
            });
        });
    });

    nextBtn.addEventListener('click', () => {
        preguntaActual++;
        if (preguntaActual < totalPreguntas) {
            mostrarPregunta(preguntaActual);
        } else {
            // Mostrar pantalla de resultados
            quizContainer.style.display = 'none';
            nextBtn.style.display = 'none';
            resultContainer.style.display = 'block';

            let porcentajeFinal = Math.round((puntaje / totalPreguntas) * 100);

            let mensaje = '';
            if(porcentajeFinal >= 80) mensaje = "¡Excelente! Eres un experto en el museo.";
            else if(porcentajeFinal >= 50) mensaje = "¡Buen trabajo! Pero aún puedes aprender más.";
            else mensaje = "Te invitamos a leer nuevamente nuestra sección de Historia.";

            scoreText.innerHTML = `
                <h3 class="display-5 text-primary mb-3">${porcentajeFinal}% de aciertos</h3>
                <p class="lead">Obtuviste <strong>${puntaje}</strong> de <strong>${totalPreguntas}</strong> respuestas correctas.</p>
                <p class="text-muted mt-3">${mensaje}</p>
            `;

            // Llenar la barra de progreso al 100%
            progressBar.style.width = '100%';
            progressBar.setAttribute('aria-valuenow', 100);
            progressText.innerText = `Evaluación completada`;
            progressPercent.innerText = `100% completado`;
        }
    });

    // Iniciar con la primera pregunta
    mostrarPregunta(0);
});