/* =========================================================
   AC Moreno Logistics — comportamiento de la página
   Sin dependencias externas.
   ========================================================= */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Menú móvil ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    var sub = document.querySelector('.nav__item--has-sub');
    if (sub) {
      sub.classList.remove('is-open');
      var b = sub.querySelector('.subnav__toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });

    // Cerrar al pulsar un enlace o la tecla Escape
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();   // los enlaces navegan; el botón del desplegable no cierra
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Sombra de la cabecera al hacer scroll ---------- */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Desplegable de Servicios en el menú móvil ---------- */
  /* En escritorio se abre con el ratón o el teclado (CSS); en táctil no hay
     hover, así que el botón lo despliega. */
  var subToggle = document.querySelector('.subnav__toggle');
  var subItem = subToggle && subToggle.closest('.nav__item--has-sub');

  if (subToggle && subItem) {
    subToggle.addEventListener('click', function () {
      var abierto = subItem.classList.toggle('is-open');
      subToggle.setAttribute('aria-expanded', String(abierto));
      subToggle.setAttribute('aria-label', abierto ? 'Ocultar servicios' : 'Mostrar servicios');
    });
  }

  /* ---------- Aparición de elementos al hacer scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Contadores animados de la barra de estadísticas ---------- */
  var counters = document.querySelectorAll('.counter');

  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10) || 0;
    if (reducedMotion) { el.textContent = String(target); return; }

    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);   // easeOutCubic
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.dataset.target; });
  }

  /* ---------- FAQ: un solo panel abierto a la vez ----------
     Los navegadores modernos lo hacen solos con <details name="faq">.
     Este bloque cubre los que todavía no lo soportan.               */
  var faqItems = document.querySelectorAll('.faq__item');
  var supportsExclusive = 'name' in document.createElement('details');

  if (!supportsExclusive) {
    faqItems.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  /* ---------- Formulario de contacto ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  // ==== EDITAR: dirección donde quieres recibir las solicitudes ====
  var DESTINO = 'administracion@ac-moreno.com';

  function setError(field, message) {
    /* Se busca dentro del propio formulario, no en todo el documento: dos
       formularios de la web comparten nombres de campo (nombre, email…). */
    var ambito = field.form || document;
    var box = ambito.querySelector('[data-error-for="' + field.name + '"]');
    if (box) box.textContent = message || '';
    if (message) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  }

  function validate() {
    var ok = true;
    var firstInvalid = null;

    var rules = [
      { el: form.nombre,     test: function (v) { return v.trim().length >= 2; },
        msg: 'Escribe tu nombre.' },
      { el: form.email,      test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
        msg: 'Escribe un email válido.' },
      { el: form.mensaje,    test: function (v) { return v.trim().length >= 10; },
        msg: 'Cuéntanos algo más (mínimo 10 caracteres).' }
    ];

    rules.forEach(function (rule) {
      var valid = rule.test(rule.el.value);
      setError(rule.el, valid ? '' : rule.msg);
      if (!valid) { ok = false; firstInvalid = firstInvalid || rule.el; }
    });

    var privacidad = form.privacidad;
    if (!privacidad.checked) {
      setError(privacidad, 'Debes aceptar la política de privacidad.');
      ok = false;
      firstInvalid = firstInvalid || privacidad;
    } else {
      setError(privacidad, '');
    }

    if (firstInvalid) firstInvalid.focus();
    return ok;
  }

  if (form) {
    // Limpiar el error de un campo en cuanto el visitante lo corrige
    form.addEventListener('input', function (e) {
      if (e.target.hasAttribute('aria-invalid')) setError(e.target, '');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form__status';
      status.textContent = '';

      if (!validate()) {
        status.textContent = 'Revisa los campos marcados.';
        status.classList.add('is-error');
        return;
      }

      var d = new FormData(form);
      var cuerpo = [
        'Nombre: ' + d.get('nombre'),
        'Empresa: ' + (d.get('empresa') || '—'),
        'Email: ' + d.get('email'),
        'Teléfono: ' + (d.get('telefono') || '—'),
        'Servicio: ' + (d.get('servicio') || '—'),
        '',
        'Detalles del envío:',
        d.get('mensaje')
      ].join('\n');

      var asunto = 'Solicitud de cotización · ' + d.get('nombre');
      window.location.href = 'mailto:' + DESTINO +
        '?subject=' + encodeURIComponent(asunto) +
        '&body=' + encodeURIComponent(cuerpo);

      status.textContent = 'Abriendo tu gestor de correo con el mensaje listo para enviar…';
      status.classList.add('is-ok');
    });
  }


  /* ---------- Libro de Reclamaciones ----------
     Estructura exigida por el Código de Protección y Defensa del Consumidor.

     IMPORTANTE: la norma obliga a entregar copia de la hoja al consumidor y a
     conservar el registro. Un sitio estático no puede hacerlo por sí solo, así
     que hay que enrutar el envío por un servicio de formularios. Pega abajo el
     endpoint (Web3Forms, Formspree o similar) antes de publicar la página; sin
     él, el formulario cae en el correo del propio visitante y ni queda copia ni
     hay constancia de recepción.                                              */
  var LIBRO_ENDPOINT = '';                              // ← pegar aquí el endpoint
  var LIBRO_DESTINO  = 'administracion@ac-moreno.com';  // a dónde llegan las reclamaciones

  var libro = document.getElementById('libroForm');

  if (libro) {
    var estadoLibro = document.getElementById('libroStatus');

    /* Número correlativo y fecha, visibles antes de enviar */
    var ahora = new Date();
    var dosDig = function (n) { return String(n).padStart(2, '0'); };
    var correlativo = 'AC-' + ahora.getFullYear() + dosDig(ahora.getMonth() + 1) +
                      dosDig(ahora.getDate()) + '-' + dosDig(ahora.getHours()) +
                      dosDig(ahora.getMinutes()) + dosDig(ahora.getSeconds());
    var elCorr = document.getElementById('correlativo');
    var elFecha = document.getElementById('fechaHoy');
    if (elCorr) elCorr.textContent = correlativo;
    if (elFecha) elFecha.textContent = ahora.toLocaleDateString('es-PE',
      { day: '2-digit', month: '2-digit', year: 'numeric' });

    /* Los datos del apoderado sólo se piden si el consumidor es menor */
    var menor = document.getElementById('lr_menor');
    var campoApoderado = document.getElementById('campoApoderado');
    menor.addEventListener('change', function () {
      campoApoderado.classList.toggle('oculto', !menor.checked);
      if (!menor.checked) setError(libro.apoderado, '');
    });

    libro.addEventListener('input', function (e) {
      if (e.target.hasAttribute('aria-invalid')) setError(e.target, '');
    });

    function validarLibro() {
      var reglas = [
        { el: libro.nombre,      ok: function (v) { return v.trim().length >= 3; },  msg: 'Escribe tus nombres y apellidos.' },
        { el: libro.documento,   ok: function (v) { return v.trim().length >= 6; },  msg: 'Escribe tu número de documento.' },
        { el: libro.domicilio,   ok: function (v) { return v.trim().length >= 5; },  msg: 'Escribe tu domicilio.' },
        { el: libro.email,       ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }, msg: 'Escribe un correo válido: ahí recibirás la copia.' },
        { el: libro.descripcion, ok: function (v) { return v.trim().length >= 4; },  msg: 'Indica el servicio o producto.' },
        { el: libro.detalle,     ok: function (v) { return v.trim().length >= 20; }, msg: 'Detalla lo ocurrido (mínimo 20 caracteres).' },
        { el: libro.pedido,      ok: function (v) { return v.trim().length >= 10; }, msg: 'Indica qué solución esperas.' }
      ];
      if (menor.checked) {
        reglas.push({ el: libro.apoderado, ok: function (v) { return v.trim().length >= 3; },
                      msg: 'Indica el nombre del padre, madre o apoderado.' });
      }

      var valido = true, primero = null;
      reglas.forEach(function (r) {
        var bien = r.ok(r.el.value);
        setError(r.el, bien ? '' : r.msg);
        if (!bien) { valido = false; primero = primero || r.el; }
      });
      if (!libro.privacidad.checked) {
        setError(libro.privacidad, 'Necesitamos tu autorización para tratar los datos.');
        valido = false; primero = primero || libro.privacidad;
      } else {
        setError(libro.privacidad, '');
      }
      if (primero) primero.focus();
      return valido;
    }

    function resumenLibro(d) {
      return [
        'LIBRO DE RECLAMACIONES · Hoja N.º ' + correlativo,
        'Fecha de registro: ' + ahora.toLocaleString('es-PE'),
        '',
        '1. CONSUMIDOR',
        'Nombre: ' + d.get('nombre'),
        'Documento: ' + d.get('tipodoc') + ' ' + d.get('documento'),
        'Domicilio: ' + d.get('domicilio'),
        'Email: ' + d.get('email'),
        'Teléfono: ' + (d.get('telefono') || '—'),
        'Menor de edad: ' + (menor.checked ? 'Sí — apoderado: ' + d.get('apoderado') : 'No'),
        '',
        '2. SERVICIO CONTRATADO',
        'Tipo: ' + d.get('tipobien'),
        'Descripción: ' + d.get('descripcion'),
        'Monto reclamado: ' + (d.get('monto') || '—'),
        'Referencia: ' + (d.get('referencia') || '—'),
        '',
        '3. RECLAMACIÓN',
        'Tipo: ' + d.get('tipo'),
        'Fecha del incidente: ' + (d.get('fechaIncidente') || '—'),
        '',
        'Detalle:',
        d.get('detalle'),
        '',
        'Pedido del consumidor:',
        d.get('pedido')
      ].join('\n');
    }

    libro.addEventListener('submit', function (e) {
      e.preventDefault();
      estadoLibro.className = 'form__status';
      estadoLibro.textContent = '';

      if (!validarLibro()) {
        estadoLibro.textContent = 'Revisa los campos marcados.';
        estadoLibro.classList.add('is-error');
        return;
      }

      var d = new FormData(libro);
      var asunto = 'Libro de Reclamaciones ' + correlativo + ' · ' + d.get('tipo') + ' · ' + d.get('nombre');
      var cuerpo = resumenLibro(d);

      if (LIBRO_ENDPOINT) {
        d.append('hoja', correlativo);
        d.append('subject', asunto);
        d.append('resumen', cuerpo);
        estadoLibro.textContent = 'Enviando…';

        fetch(LIBRO_ENDPOINT, { method: 'POST', body: d })
          .then(function (r) {
            if (!r.ok) throw new Error('respuesta ' + r.status);
            libro.reset();
            campoApoderado.classList.add('oculto');
            estadoLibro.className = 'form__status is-ok';
            estadoLibro.textContent = 'Reclamación registrada con el número ' + correlativo +
              '. Recibirás una copia por correo y te responderemos en un plazo máximo de 15 días hábiles improrrogables.';
          })
          .catch(function () {
            estadoLibro.className = 'form__status is-error';
            estadoLibro.textContent = 'No pudimos registrar la reclamación. Escríbenos a ' +
              LIBRO_DESTINO + ' o llámanos al 989 219 244.';
          });
      } else {
        /* Sin endpoint: se abre el gestor de correo del visitante. Funciona,
           pero no deja constancia ni envía copia automática. */
        window.location.href = 'mailto:' + LIBRO_DESTINO +
          '?subject=' + encodeURIComponent(asunto) +
          '&body=' + encodeURIComponent(cuerpo);
        estadoLibro.className = 'form__status is-ok';
        estadoLibro.textContent = 'Abriendo tu gestor de correo con la hoja ' + correlativo +
          ' ya redactada. Envíala para completar el registro.';
      }
    });
  }

  /* ---------- Año actual en el pie ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

})();
