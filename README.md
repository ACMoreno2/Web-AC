# AC Moreno Logistics — sitio web

Web corporativa de una sola página: HTML, CSS y JavaScript sin dependencias ni
proceso de compilación. Se abre haciendo doble clic en `index.html` y se publica
en GitHub Pages automáticamente.

El contenido procede del brochure corporativo *SOLUCIONES LOGÍSTICAS INTEGRALES*.

## Estructura

Sitio de 10 páginas. Cada entrada del menú es una página propia y cada servicio
tiene la suya.

```
index.html                             Inicio
servicios.html                         Índice de servicios
servicio-agenciamiento-de-aduanas.html
servicio-transporte-terrestre.html
servicio-carga-proyecto-imo.html
servicio-almacenaje-y-maniobras.html
nosotros.html                          Quiénes somos
por-que-elegirnos.html
preguntas-frecuentes.html
contacto.html

assets/css/styles.css   Estilos: paleta, tipografía, responsive, modo oscuro
assets/css/fonts.css    Declaraciones de las tipografías autoalojadas
assets/fonts/           League Spartan, Montserrat y DM Sans (.woff2)
assets/img/             Logotipo, iconos y fotografías
assets/js/main.js       Menú, desplegable, acordeón, contador y formulario
.github/workflows/      Despliegue automático en GitHub Pages
```

### La cabecera y el pie están repetidos en cada archivo

No hay sistema de plantillas, para que puedas editar cualquier página desde el
navegador sin instalar nada. La contrapartida: **si cambias el menú, el pie o la
franja de llamada a la acción, hay que tocarlo en las 10 páginas**. Busca los
comentarios `CABECERA` y `PIE` para localizarlos.

Las fotografías se extrajeron del brochure corporativo. Están optimizadas para
web (máximo 1600 px de ancho, JPEG progresivo) y se cargan de forma diferida
salvo la primera, que es la que se ve al entrar.

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

## Libro de Reclamaciones

La página `libro-de-reclamaciones.html` reproduce la Hoja de Reclamación que exige
el Código de Protección y Defensa del Consumidor. El enlace está en el pie de las
once páginas.

### Falta un paso para que sea válido

La norma obliga a **entregar copia de la hoja al consumidor** y a **conservar el
registro**. Un sitio estático no puede hacer ninguna de las dos cosas: hoy el
formulario abre el gestor de correo del visitante, y si esa persona no llega a
enviarlo, la reclamación se pierde y no queda constancia.

Para resolverlo hay que enrutar el envío por un servicio de formularios
(Web3Forms y Formspree tienen plan gratuito y ambos permiten respuesta
automática al consumidor):

1. Crea la cuenta y copia el endpoint o la clave de acceso.
2. En `assets/js/main.js`, pega el valor en `LIBRO_ENDPOINT`.
3. Configura en el servicio la respuesta automática al correo del consumidor,
   con el contenido de la hoja.

Las reclamaciones llegan a `administracion@ac-moreno.com`, definido en
`LIBRO_DESTINO` en el mismo archivo.

**Mientras `LIBRO_ENDPOINT` esté vacío, la página no debería publicarse como
Libro de Reclamaciones oficial.**

### Flujo de atención

Quien gestione el buzón debe seguir estos pasos:

| # | Paso | Plazo |
| --- | --- | --- |
| 1 | Poner el Libro a disposición de inmediato. **No condicionar la atención al pago previo** del servicio reclamado | Inmediato |
| 2 | Registrar el reclamo o queja | Al recibirlo |
| 3 | Evaluar el caso | — |
| 4 | Elaborar la respuesta por escrito, física o electrónica | — |
| 5 | Emitir la respuesta | **15 días hábiles improrrogables** |
| 6 | Si se envía una propuesta de solución, hacerlo por un medio que deje constancia | — |
| 7 | Al enviarla, **el cómputo del plazo queda suspendido** | — |
| 8 | Esperar el pronunciamiento del consumidor | **5 días hábiles** |
| 9 | Si acepta: formalizar el acuerdo en la misma Hoja, dejando constancia expresa | — |
| 10 | Si rechaza o no responde: continuar la atención y emitir la respuesta | — |
| 11 | Si no queda conforme, puede recurrir a solución de controversias o denunciar ante INDECOPI | — |
| 12 | Cierre y archivo, dejando constancia de la respuesta, el acuerdo y la documentación | — |

El plazo del paso 5 es **improrrogable**: pasarlo expone a la empresa a sanción.
Conviene llevar el control de vencimientos fuera del correo.

### Pendiente de validación legal

La estructura del formulario, los textos y este flujo deben ser revisados por
asesoría legal antes de publicar. Recogen la norma general, no un asesoramiento
sobre el caso concreto de la empresa.

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
