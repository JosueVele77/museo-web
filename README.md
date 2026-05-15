
# Proyecto Web del Museo Nacional del Ecuador

Este es el repositorio del proyecto web para el Museo Nacional del Ecuador. El sitio web es una plataforma interactiva y multilingüe diseñada para proporcionar información sobre el museo, su historia y sus exposiciones.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
museo-web/
├── docs/
│   ├── css/
│   │   ├── language-selector.css  # Estilos para el selector de idioma
│   │   └── style.css              # Estilos principales del sitio
│   ├── img/                       # Imágenes utilizadas en el sitio
│   │   ├── historia1.webp
│   │   ├── ...
│   ├── js/
│   │   ├── scripts.js             # Lógica principal de la aplicación
│   │   └── translations.js        # Traducciones para el soporte multi-idioma
│   ├── pages/
│   │   ├── evaluacion.html        # Página del cuestionario de evaluación
│   │   ├── historia.html          # Página sobre la historia del museo
│   │   └── ubicacion.html         # Página con la ubicación del museo
│   └── index.html                 # Página de inicio
└── README.md                      # Este archivo
```

## Tecnologías Utilizadas

-   **HTML5:** Para la estructura semántica del contenido.
-   **CSS3:** Para el diseño y la presentación, incluyendo un modo oscuro y un diseño responsivo.
-   **JavaScript (ES6 Modules):** Para la interactividad del sitio, como el cambio de tema, el selector de idioma y el cuestionario de evaluación.
-   **Bootstrap 5:** Como framework de CSS para componentes de la interfaz de usuario y un diseño responsivo.
-   **Google Fonts:** Para la tipografía (`Cinzel`).
-   **Bootstrap Icons:** Para los iconos utilizados en la interfaz.

## Funcionalidades Principales

### 1. Cambio de Tema (Modo Oscuro/Claro)

-   **Archivo:** `js/scripts.js` y `css/style.css`
-   **Descripción:** Los usuarios pueden cambiar entre un tema claro y uno oscuro. La preferencia se guarda en el `localStorage` del navegador para que se mantenga en futuras visitas.
-   **Implementación:**
    -   En `js/scripts.js`, un `eventListener` en el botón `#theme-toggle` añade o elimina la clase `dark-mode` del `<body>`.
    -   En `css/style.css`, los estilos para el modo oscuro se aplican usando el selector `body.dark-mode`.

### 2. Selector de Idioma

-   **Archivos:** `js/scripts.js` y `js/translations.js`
-   **Descripción:** El sitio soporta español e inglés. Los usuarios pueden cambiar el idioma, y la selección se guarda en `localStorage`.
-   **Implementación:**
    -   `js/translations.js` exporta un objeto `languageData` que contiene las cadenas de texto para cada idioma.
    -   En `js/scripts.js`, la función `setLanguage(lang)` actualiza el contenido de los elementos con el atributo `data-key` según el idioma seleccionado.

### 3. Carrusel de Imágenes

-   **Archivo:** `index.html`
-   **Descripción:** La página de inicio muestra un carrusel de imágenes utilizando el componente de carrusel de Bootstrap.

### 4. Cuestionario de Evaluación

-   **Archivos:** `pages/evaluacion.html` y `js/scripts.js`
-   **Descripción:** Una página de evaluación interactiva con preguntas de opción múltiple. El cuestionario muestra el progreso, da retroalimentación instantánea y muestra un puntaje final.
-   **Implementación:**
    -   La lógica se encuentra en `js/scripts.js` dentro de la sección `/* ================= LÓGICA DE EVALUACIÓN ================= */`.
    -   Gestiona el estado de las preguntas, actualiza la barra de progreso, valida las respuestas y calcula el puntaje final.
    -   El contenido del cuestionario también se traduce al cambiar de idioma.

## Cómo Ejecutar el Proyecto

1.  Clona este repositorio o descarga los archivos.
2.  Abre el archivo `docs/index.html` en tu navegador web.

No se requiere un servidor local para ejecutar este proyecto, ya que es un sitio estático.

