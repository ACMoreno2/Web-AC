# AC Moreno Logistics — sitio web

Web corporativa de una sola página: HTML, CSS y JavaScript sin dependencias
ni proceso de compilación. Se abre haciendo doble clic en `index.html` y se
publica en GitHub Pages automáticamente.

## Estructura

```
index.html              Todo el contenido de la página
assets/css/styles.css   Estilos (colores, tipografía, responsive, modo oscuro)
assets/js/main.js       Menú móvil, acordeón de preguntas, contadores, formulario
.github/workflows/      Despliegue automático en GitHub Pages
robots.txt              Permite la indexación en buscadores
```

Secciones de la página: Inicio · Servicios · Nosotros · Casos de éxito ·
Preguntas frecuentes · Contacto.

## Cómo verla en tu ordenador

Abre `index.html` con el navegador. No hace falta instalar nada.

Si prefieres un servidor local (recomendable para probar bien las rutas):

```bash
python3 -m http.server 8000
# y abre http://localhost:8000
```

## Qué tienes que personalizar

Busca en el código los comentarios `EDITAR`, marcan los puntos que dependen
de tus datos reales:

| Qué | Dónde |
| --- | --- |
| Título y descripción para Google | `index.html`, dentro de `<head>` |
| Email, teléfono y dirección | `index.html`, sección `#contacto` y pie |
| Nombres de clientes | `index.html`, lista `.logos` |
| Cifras de la barra de estadísticas | `index.html`, atributos `data-target` |
| Textos de servicios, casos y FAQ | `index.html`, cada sección |
| Colores de marca | `assets/css/styles.css`, variables `--brand*` |
| Email que recibe el formulario | `assets/js/main.js`, constante `DESTINO` |

Las cifras, testimonios y casos de éxito que vienen puestos son **de ejemplo**:
sustitúyelos por datos reales antes de publicar.

### Añadir el logotipo

Coloca el archivo en `assets/img/logo.svg` (o `.png`) y sustituye en
`index.html` el bloque:

```html
<span class="brand__mark">AC</span>
<span class="brand__name">AC Moreno <em>Logistics</em></span>
```

por:

```html
<img src="assets/img/logo.svg" alt="AC Moreno Logistics" height="38">
```

Hay dos apariciones: la cabecera y el pie.

## Formulario de contacto

Tal como está, el formulario valida los datos y abre el gestor de correo del
visitante con el mensaje ya redactado hacia la dirección de la constante
`DESTINO`. Funciona sin servidor, que es la única opción en GitHub Pages.

Si prefieres recibir los mensajes directamente en tu bandeja, sin que el
visitante tenga que enviar el correo, usa un servicio de formularios
(por ejemplo Formspree, Web3Forms o Basin). Con Formspree:

1. Crea un formulario en su web y copia el endpoint (`https://formspree.io/f/xxxx`).
2. En `index.html`, añade al `<form>`: `action="https://formspree.io/f/xxxx" method="POST"`.
3. En `assets/js/main.js`, dentro del `submit`, sustituye el bloque del
   `mailto:` por un `fetch` al endpoint con `new FormData(form)`.

## Publicar en GitHub Pages

El flujo de trabajo `.github/workflows/deploy.yml` publica el sitio en cada
push a `main`. Para activarlo, una sola vez:

1. Ve a **Settings → Pages** del repositorio.
2. En **Build and deployment → Source**, elige **GitHub Actions**.
3. Fusiona esta rama en `main` (o haz push a `main`).

La primera ejecución tarda un par de minutos. La URL queda como
`https://acmoreno2.github.io/Web-AC/` y aparece en la pestaña **Actions**,
dentro del despliegue.

### Dominio propio

Si tienes un dominio, añádelo en **Settings → Pages → Custom domain** y crea
en tu proveedor de DNS un registro `CNAME` que apunte a `acmoreno2.github.io`.
GitHub creará el archivo `CNAME` en el repositorio y emitirá el certificado
HTTPS solo.

## Accesibilidad y compatibilidad

- Navegación por teclado con enlace de salto al contenido y foco visible.
- Etiquetas y mensajes de error del formulario asociados a cada campo.
- Respeta la preferencia del sistema de *reducir movimiento*.
- Modo oscuro automático según la configuración del visitante.
- Diseño adaptable desde 320 px hasta pantallas grandes.
