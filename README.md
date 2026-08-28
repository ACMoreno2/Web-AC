# AC Moreno Logistics — sitio web

Web corporativa de una sola página: HTML, CSS y JavaScript sin dependencias ni
proceso de compilación. Se abre haciendo doble clic en `index.html` y se publica
en GitHub Pages automáticamente.

El contenido procede del brochure corporativo *SOLUCIONES LOGÍSTICAS INTEGRALES*.

## Estructura

```
index.html              Todo el contenido de la página
assets/css/styles.css   Estilos: paleta, tipografía, responsive, modo oscuro
assets/css/fonts.css    Declaraciones de las tipografías autoalojadas
assets/fonts/           League Spartan, Montserrat y DM Sans (.woff2)
assets/img/             Logotipo, isotipo, favicons e imagen para redes
assets/js/main.js       Menú móvil, acordeón, contador, validación del formulario
.github/workflows/      Despliegue automático en GitHub Pages
```

Secciones: Inicio · Servicios · Nosotros · Por qué elegirnos · Preguntas
frecuentes · Contacto.

## Cómo verla en tu ordenador

Abre `index.html` con el navegador. No hace falta instalar nada.

Con un servidor local (recomendable, para que las rutas se comporten igual que
en producción):

```bash
python3 -m http.server 8000
# y abre http://localhost:8000
```

## Identidad de marca

| Elemento | Valor |
| --- | --- |
| Azul profundo | `#2B374B` — color principal, textos y fondos oscuros |
| Amarillo | `#F7D26D` — acento; siempre con texto oscuro encima |
| Verde | `#55AB80` — acento secundario (confirmaciones) |
| Tipografía principal | League Spartan (titulares y logotipo) |
| Tipografía secundaria | Montserrat (navegación, botones, etiquetas) |
| Tipografía complementaria | DM Sans (texto corrido) |

Los colores están centralizados como variables al principio de
`assets/css/styles.css`. Cambiar `--navy`, `--gold` o `--green` actualiza toda
la web.

Las variables terminadas en `-ink` (`--gold-ink`, `--green-ink`) son versiones
oscurecidas de esos colores **para usarlos en texto**: el amarillo y el verde de
marca no tienen suficiente contraste sobre blanco. Si cambias los colores,
recalcula también esas variantes.

### Logotipo

Los archivos se generaron a partir del logotipo original:

- `assets/img/logo.png` — logotipo completo, fondo transparente
- `assets/img/isotipo.png` — sólo el monograma AC (se usa en la cabecera)
- `assets/img/favicon-512.png`, `apple-touch-icon.png`, `favicon.png` — iconos
- `assets/img/og-image.jpg` — imagen de 1200×630 para WhatsApp y redes

El logotipo es negro; sobre los fondos oscuros (pie de página y modo oscuro) se
invierte por CSS con `filter: invert(1)`, así no hace falta un segundo archivo.

### Tipografías

Están **autoalojadas** en `assets/fonts/`: la web no llama a Google Fonts, con
lo que carga antes y no expone la IP de los visitantes a un tercero. Si
necesitas otro peso, descarga el `.woff2` correspondiente y añade su bloque
`@font-face` en `assets/css/fonts.css`.

## Qué conviene revisar antes de publicar

El contenido es real, salvo estos puntos:

| Punto | Dónde | Qué hacer |
| --- | --- | --- |
| Respuestas de las preguntas frecuentes | `index.html`, sección `#faq` | Validarlas con el equipo de operaciones (están marcadas con un comentario `REVISAR`) |
| Política de privacidad, aviso legal y cookies | Enlaces `href="#"` del formulario y el pie | Redactar las páginas y enlazarlas |
| Tarjeta de seguimiento del inicio | `index.html`, bloque `.hero__visual` | Es una ilustración de la operativa, no un sistema real de rastreo |
| Sección de clientes | — | No se incluyó porque no había datos reales. Si quieres añadirla, hacen falta los nombres o logotipos autorizados |

Los datos de contacto, servicios, cifras y textos de «Quiénes somos» y «Por qué
elegirnos» provienen literalmente del brochure.

## Formulario de contacto

Tal como está, el formulario valida los datos y abre el gestor de correo del
visitante con el mensaje ya redactado hacia `administracion@ac-moreno.com`
(constante `DESTINO` en `assets/js/main.js`). Funciona sin servidor, que es la
única opción en GitHub Pages.

Para recibir los mensajes directamente en la bandeja, sin que el visitante tenga
que enviar el correo, usa un servicio de formularios (Formspree, Web3Forms,
Basin). Con Formspree:

1. Crea un formulario y copia el endpoint (`https://formspree.io/f/xxxx`).
2. En `index.html`, añade al `<form>`: `action="https://formspree.io/f/xxxx" method="POST"`.
3. En `assets/js/main.js`, dentro del `submit`, sustituye el bloque del `mailto:`
   por un `fetch` al endpoint con `new FormData(form)`.

## Publicar en GitHub Pages

El flujo `.github/workflows/deploy.yml` publica el sitio en cada push a `main`.
Para activarlo, una sola vez:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Fusiona esta rama en `main`.

La primera ejecución tarda un par de minutos. Quedará en
`https://acmoreno2.github.io/Web-AC/`.

## Conectar el dominio ac-moreno.com (comprado en GoDaddy)

El dominio ya tiene una landing básica de GoDaddy. Hay que **quitar esa conexión
primero**, o los registros DNS nuevos entrarán en conflicto.

**1. En GoDaddy**

- Si el dominio está conectado al *Creador de páginas web* o a un dominio
  aparcado, desconéctalo (Mis productos → el dominio → quitar la conexión al
  sitio o al parking).
- Entra en **DNS → Administrar zonas** y borra los registros `A` de `@` y el
  `CNAME` de `www` que apunten a GoDaddy (`parkingpage`, `WebsiteBuilder`, etc.).
- Añade estos registros:

  | Tipo | Nombre | Valor | TTL |
  | --- | --- | --- | --- |
  | A | @ | 185.199.108.153 | 1 hora |
  | A | @ | 185.199.109.153 | 1 hora |
  | A | @ | 185.199.110.153 | 1 hora |
  | A | @ | 185.199.111.153 | 1 hora |
  | CNAME | www | acmoreno2.github.io | 1 hora |

  Opcionalmente, para IPv6, cuatro registros `AAAA` en `@`:
  `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
  `2606:50c0:8003::153`.

**2. En GitHub**

- **Settings → Pages → Custom domain**: escribe `www.ac-moreno.com` y guarda.
  GitHub creará un archivo `CNAME` en el repositorio.
- Espera a que la comprobación de DNS aparezca en verde (de minutos a 24 horas,
  según propague GoDaddy) y marca **Enforce HTTPS**. El certificado lo emite
  GitHub gratis.

**Importante:** no añadas el archivo `CNAME` al repositorio antes de que el DNS
apunte a GitHub. Si lo haces, la dirección `acmoreno2.github.io` empezará a
redirigir a un dominio que todavía no resuelve y la web quedará inaccesible
mientras tanto.

Con esta configuración `ac-moreno.com` redirige a `www.ac-moreno.com`, que es la
dirección declarada como canónica en el `<head>` de `index.html`.

## Accesibilidad y compatibilidad

- Contraste verificado: los 43 elementos de texto cumplen WCAG AA (4,5:1 para
  texto normal, 3:1 para texto grande) tanto en modo claro como oscuro.
- Navegación por teclado con enlace de salto al contenido y foco visible.
- Etiquetas y mensajes de error del formulario asociados a cada campo.
- Respeta la preferencia del sistema de *reducir movimiento*.
- Modo oscuro automático según la configuración del visitante.
- Diseño adaptable verificado a 390, 768, 1024 y 1440 px de ancho.
- Datos estructurados (`schema.org`) para que Google entienda la empresa.
