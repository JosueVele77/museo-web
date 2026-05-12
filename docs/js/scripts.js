import { languageData } from './translations.js';

let updateQuizLanguageFn = null;

function initApp() {
    /* ================= THEME TOGGLE ================= */
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let theme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
            localStorage.setItem('theme', theme);
        });
    }

    /* ================= LANGUAGE SWITCHER ================= */
    const idiomaActualTexto = document.getElementById('idioma-actual-texto');
    const banderaActual = document.getElementById('bandera-actual');
    const listaIdiomas = document.querySelector('.lista-idiomas');

    function setLanguage(lang) {
        const langStrings = languageData[lang];
        if (!langStrings) return;

        document.documentElement.lang = lang;
        document.title = langStrings.titulo || document.title;

        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (langStrings[key]) {
                elem.innerHTML = langStrings[key];
            }
        });

        if (lang === 'es') {
            if (idiomaActualTexto) idiomaActualTexto.textContent = 'Español';
            if (banderaActual) {
                banderaActual.textContent = '🇪🇨';
                banderaActual.alt = 'Ecuador';
            }
        } else if (lang === 'en') {
            if (idiomaActualTexto) idiomaActualTexto.textContent = 'English';
            if (banderaActual) {
                banderaActual.textContent = '🇺🇸';
                banderaActual.alt = 'United States';
            }
        }

        localStorage.setItem('language', lang);
        
        if (listaIdiomas) {
            listaIdiomas.style.display = 'none';
        }

        if (document.getElementById('quiz-preguntas-container') && updateQuizLanguageFn) {
            updateQuizLanguageFn(langStrings);
        }
    }

    const idiomaActualDiv = document.querySelector('.idioma-actual');
    if (idiomaActualDiv) {
        idiomaActualDiv.addEventListener('click', () => {
            if (listaIdiomas) {
                listaIdiomas.style.display = listaIdiomas.style.display === 'block' ? 'none' : 'block';
            }
        });
    }

    if (listaIdiomas) {
        listaIdiomas.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                e.preventDefault();
                const lang = link.getAttribute('data-lang');
                setLanguage(lang);
            }
        });
    }

    const savedLang = localStorage.getItem('language') || 'es';
    setLanguage(savedLang);


    /* ================= CARRUSEL DE INICIO ================= */
    const diapositivas = document.querySelectorAll('.diapositiva');
    if (diapositivas.length > 0) {
        let indiceActual = 0;

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
    const quizContainer = document.getElementById('quiz-preguntas-container');
    if (quizContainer) {
        const preguntas = Array.from(document.querySelectorAll('.pregunta-item'));
        const totalPreguntas = preguntas.length;
        let preguntaActual = 0;
        let puntaje = 0;

        const progressBar = document.getElementById('quiz-progress');
        const progressText = document.getElementById('quiz-progress-text');
        const progressPercent = document.getElementById('quiz-progress-percent');
        const nextBtn = document.getElementById('btn-siguiente');
        const resultContainer = document.getElementById('resultado-container');
        const scoreText = document.getElementById('score-final');

        updateQuizLanguageFn = function(langStrings) {
            if (progressText) progressText.innerText = `${langStrings.evaluacion_progreso_pregunta} ${preguntaActual + 1} ${langStrings.evaluacion_progreso_de} ${totalPreguntas}`;
            if (progressPercent) progressPercent.innerText = `${Math.round(((preguntaActual) / totalPreguntas) * 100)}% ${langStrings.evaluacion_progreso_completado}`;

            if (nextBtn) {
                if (preguntaActual === totalPreguntas - 1) {
                    nextBtn.innerText = langStrings.evaluacion_ver_resultados_finales;
                } else {
                    nextBtn.innerHTML = `${langStrings.evaluacion_siguiente_pregunta} <i class="bi bi-arrow-right"></i>`;
                }
            }

            document.querySelectorAll('.feedback').forEach(feedbackBox => {
                if (feedbackBox.style.display === 'block') {
                    const currentQuestion = feedbackBox.closest('.pregunta-item');
                    const explanationKey = currentQuestion.getAttribute('data-explanation-key');
                    const explanation = langStrings[explanationKey] || '';
                    const correctAnswerButton = currentQuestion.querySelector('.opcion-btn[data-correcta="true"]');
                    const correctAnswerText = correctAnswerButton ? correctAnswerButton.textContent : '';

                    if (feedbackBox.classList.contains('text-success')) {
                        feedbackBox.innerHTML = `<i class="bi bi-check-circle-fill text-success"></i> ${langStrings.evaluacion_correcto}`;
                    } else if (feedbackBox.classList.contains('text-danger')) {
                        feedbackBox.innerHTML = `<i class="bi bi-x-circle-fill text-danger"></i> ${langStrings.evaluacion_incorrecto}<br><span class="text-dark small">${explanation} ${langStrings.evaluacion_explicacion_correcta || ''} ${correctAnswerText}</span>`;
                    }
                }
            });

            if (resultContainer && resultContainer.style.display === 'block') {
                let porcentajeFinal = Math.round((puntaje / totalPreguntas) * 100);
                let mensaje = '';
                if (porcentajeFinal >= 80) mensaje = langStrings.evaluacion_mensaje_excelente;
                else if (porcentajeFinal >= 50) mensaje = langStrings.evaluacion_mensaje_buen_trabajo;
                else mensaje = langStrings.evaluacion_mensaje_invitacion;
                if(scoreText) {
                    scoreText.innerHTML = `
                        <h3 class="display-5 text-primary mb-3">${porcentajeFinal}% ${langStrings.evaluacion_aciertos}</h3>
                        <p class="lead">${langStrings.evaluacion_obtuviste} <strong>${puntaje}</strong> ${langStrings.evaluacion_de} <strong>${totalPreguntas}</strong> ${langStrings.evaluacion_respuestas_correctas}.</p>
                        <p class="text-muted mt-3">${mensaje}</p>
                    `;
                }
            }
        };

        function actualizarProgreso() {
            const langStrings = languageData[document.documentElement.lang] || languageData['es'];
            let porcentaje = Math.round(((preguntaActual) / totalPreguntas) * 100);
            if(progressBar) {
                progressBar.style.width = porcentaje + '%';
                progressBar.setAttribute('aria-valuenow', porcentaje);
            }
            if(progressText) progressText.innerText = `${langStrings.evaluacion_progreso_pregunta} ${preguntaActual + 1} ${langStrings.evaluacion_progreso_de} ${totalPreguntas}`;
            if(progressPercent) progressPercent.innerText = `${porcentaje}% ${langStrings.evaluacion_progreso_completado}`;
        }

        function mostrarPregunta(index) {
            preguntas.forEach((p, i) => {
                if (i === index) {
                    p.style.display = 'block';
                } else {
                    p.style.display = 'none';
                }
            });
            if (nextBtn) nextBtn.style.display = 'none';
            if (index < totalPreguntas) {
                actualizarProgreso();
            }
        }

        preguntas.forEach((pregunta, index) => {
            const botones = Array.from(pregunta.querySelectorAll('.opcion-btn'));
            const feedbackBox = pregunta.querySelector('.feedback');

            botones.forEach(boton => {
                boton.style.pointerEvents = 'auto';

                boton.addEventListener('click', function(e) {
                    e.preventDefault();

                    if (pregunta.dataset.respondida === 'true') {
                        return;
                    }
                    pregunta.dataset.respondida = 'true';

                    const esCorrecta = this.getAttribute('data-correcta') === 'true';

                    botones.forEach(btn => {
                        btn.style.pointerEvents = 'none';
                        if (btn.getAttribute('data-correcta') === 'true') {
                            btn.classList.add('btn-success', 'text-white');
                            btn.classList.remove('btn-outline-secondary');
                        }
                    });

                    if (feedbackBox) {
                        feedbackBox.style.display = 'block';
                        const langStrings = languageData[document.documentElement.lang] || languageData['es'];
                        const explanationKey = pregunta.getAttribute('data-explanation-key');
                        const explanation = langStrings[explanationKey] || '';

                        if (esCorrecta) {
                            puntaje++;
                            feedbackBox.innerHTML = `<i class="bi bi-check-circle-fill text-success"></i> ${langStrings.evaluacion_correcto}`;
                            feedbackBox.className = 'feedback mt-3 text-center text-success fw-bold';
                        } else {
                            this.classList.add('btn-danger', 'text-white');
                            this.classList.remove('btn-outline-secondary');

                            feedbackBox.innerHTML = `<i class="bi bi-x-circle-fill text-danger"></i> ${langStrings.evaluacion_incorrecto}<br><span class="text-dark small">${explanation}</span>`;
                            feedbackBox.className = 'feedback mt-3 text-center text-danger fw-bold';
                        }
                    }

                    if (nextBtn) {
                        nextBtn.style.display = 'inline-block';
                        const langStrings = languageData[document.documentElement.lang] || languageData['es'];
                        if (index === totalPreguntas - 1) {
                            nextBtn.innerText = langStrings.evaluacion_ver_resultados_finales;
                        } else {
                            nextBtn.innerHTML = `${langStrings.evaluacion_siguiente_pregunta} <i class="bi bi-arrow-right"></i>`;
                        }
                    }
                });
            });
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                preguntaActual++;
                if (preguntaActual < totalPreguntas) {
                    mostrarPregunta(preguntaActual);
                } else {
                    quizContainer.style.display = 'none';
                    nextBtn.style.display = 'none';
                    if (resultContainer) resultContainer.style.display = 'block';
                    
                    const langStrings = languageData[document.documentElement.lang] || languageData['es'];
                    let porcentajeFinal = Math.round((puntaje / totalPreguntas) * 100);
                    let mensaje = '';
                    if (porcentajeFinal >= 80) mensaje = langStrings.evaluacion_mensaje_excelente;
                    else if (porcentajeFinal >= 50) mensaje = langStrings.evaluacion_mensaje_buen_trabajo;
                    else mensaje = langStrings.evaluacion_mensaje_invitacion;
                    
                    if (scoreText) {
                        scoreText.innerHTML = `
                            <h3 class="display-5 text-primary mb-3">${porcentajeFinal}% ${langStrings.evaluacion_aciertos}</h3>
                            <p class="lead">${langStrings.evaluacion_obtuviste} <strong>${puntaje}</strong> ${langStrings.evaluacion_de} <strong>${totalPreguntas}</strong> ${langStrings.evaluacion_respuestas_correctas}.</p>
                            <p class="text-muted mt-3">${mensaje}</p>
                        `;
                    }
                    if (progressBar) {
                        progressBar.style.width = '100%';
                        progressBar.setAttribute('aria-valuenow', 100);
                    }
                    if (progressText) progressText.innerText = langStrings.evaluacion_completada;
                    if (progressPercent) progressPercent.innerText = `100% ${langStrings.evaluacion_progreso_completado}`;
                }
            });
        }

        mostrarPregunta(0);
        actualizarProgreso();
    }
}

// Iniciar aplicación asegurando que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}