/* =====================================================================
   Livingstone — mesure d'audience et consentement
   ---------------------------------------------------------------------
   Un seul fichier, charge sur toutes les pages du site. Il fait trois
   choses :

     1. affiche un bandeau de consentement (injecte en JS, aucun markup a
        dupliquer dans les pages) ;
     2. ne charge AUCUN traceur tant que le visiteur n'a pas accepte — les
        scripts n'existent pas dans la page avant le clic ;
     3. expose window.lvTrack(nom, params) pour marquer les conversions.

   Le choix est memorise sous la cle « lv_consentement », la meme que
   celle utilisee par la landing /swisslife-altitude : un visiteur qui a
   deja repondu la-bas n'est pas re-sollicite ici, et inversement.

   Refuser et Accepter ont strictement la meme presentation visuelle,
   comme l'exige la CNIL.
   ===================================================================== */
(function () {
  'use strict';

  /* --- Identifiants ---------------------------------------------------
     GA4_ID est vide tant que la propriete n'est pas creee : dans cet etat
     le script Google n'est simplement pas insere, rien ne casse.
     Pour l'activer, coller ici l'identifiant « G-XXXXXXXXXX ». */
  var GA4_ID          = '';
  var META_PIXEL_ID   = '1008236828925161';
  var UET_ID          = '187272453';

  var CLE = 'lv_consentement';

  function lire()   { try { return window.localStorage.getItem(CLE); } catch (e) { return null; } }
  function ecrire(v){ try { window.localStorage.setItem(CLE, v); } catch (e) {} }

  /* --- Chargement des traceurs (apres accord uniquement) -------------- */
  var mesureChargee = false;

  function chargerMesure() {
    if (mesureChargee) return;
    mesureChargee = true;

    /* Google Analytics 4 */
    if (GA4_ID) {
      var g = document.createElement('script');
      g.async = true;
      g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
      document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA4_ID, { anonymize_ip: true });
    }

    /* Microsoft Advertising — balise de suivi universel des evenements (UET) */
    (function (w, d, t, r, u) {
      var f, n, i;
      w[u] = w[u] || [];
      f = function () { var o = { ti: UET_ID }; o.q = w[u]; w[u] = new UET(o); w[u].push('pageLoad'); };
      n = d.createElement(t); n.src = r; n.async = 1;
      n.onload = n.onreadystatechange = function () {
        var s = this.readyState;
        if (!s || s === 'loaded' || s === 'complete') { f(); n.onload = n.onreadystatechange = null; }
      };
      i = d.getElementsByTagName(t)[0];
      i.parentNode.insertBefore(n, i);
    })(window, document, 'script', 'https://bat.bing.com/bat.js', 'uetq');

    window.uetq = window.uetq || [];
    window.uetq.push('consent', 'update', { ad_storage: 'granted' });

    /* Meta — pixel.
       Aucune donnee patrimoniale n'est jamais jointe aux evenements Meta :
       les Conditions des Outils Meta Business interdisent de transmettre des
       informations financieres sur une personne. Meta recoit le fait qu'il y
       a conversion, rien de plus. */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  /* --- Marquage des conversions --------------------------------------
     Appelable depuis n'importe quelle page. Les gardes « if (window.x) »
     font que l'appel est sans effet tant que le visiteur a refuse. */
  window.lvTrack = function (nom, params) {
    params = params || {};
    try { if (window.gtag) window.gtag('event', nom, params); } catch (e) {}
    try { if (window.fbq)  window.fbq('trackCustom', nom); } catch (e) {}
    try { if (window.uetq) window.uetq.push('event', nom, params); } catch (e) {}
  };

  /* Conversion « lead » standard, reconnue nativement par Meta. */
  window.lvLead = function (params) {
    try { if (window.fbq) window.fbq('track', 'Lead'); } catch (e) {}
    window.lvTrack('lead', params || {});
  };


  /* --- Cablage automatique des conversions ---------------------------
     Plutot qu'un script de suivi recopie page par page — qu'on oublie
     invariablement sur la page suivante —, on branche ici tout ce qui
     compte, partout, a partir du balisage :

       - tout formulaire Formspree compte comme un lead, etiquete par son
         champ cache « source », donc attribuable a la page exacte ;
       - un formulaire portant data-lv-event="x" emet x au lieu du lead
         (la prise de rendez-vous n'est pas un lead de plus, c'est l'etape
         suivante) ;
       - tout lien portant data-lv="guide" compte comme un depart vers le
         guide, avec la page d'origine : c'est ce qui dira quels cas
         pratiques alimentent reellement le tunnel. */
  function cabler() {
    var formulaires = document.querySelectorAll('form[action*="formspree"]');
    Array.prototype.forEach.call(formulaires, function (f) {
      f.addEventListener('submit', function () {
        var champ = f.querySelector('input[name="source"]');
        var source = champ ? champ.value : location.pathname;
        var evt = f.getAttribute('data-lv-event');
        if (evt) window.lvTrack(evt, { source: source });
        else window.lvLead({ source: source });
      });
    });

    var liens = document.querySelectorAll('[data-lv="guide"]');
    Array.prototype.forEach.call(liens, function (a) {
      a.addEventListener('click', function () {
        window.lvTrack('depart_guide', { source: location.pathname });
      });
    });
  }

  /* --- Bandeau ------------------------------------------------------- */
  function construireBanniere() {
    var el = document.createElement('div');
    el.id = 'lv-consent';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Consentement aux cookies de mesure');
    el.innerHTML =
      '<div class="lv-consent-inner">' +
        '<p>Nous souhaitons d\u00e9poser des cookies de mesure d\u2019audience, afin de savoir ' +
        'quelles pages et quelles annonces am\u00e8nent des visiteurs sur ce site. Ils ne ' +
        'servent qu\u2019\u00e0 cela. Votre navigation reste identique si vous refusez. ' +
        '<a href="/confidentialite.html">En savoir plus</a>.</p>' +
        '<div class="lv-consent-actions">' +
          '<button type="button" id="lv-consent-refuser">Refuser</button>' +
          '<button type="button" id="lv-consent-accepter">Accepter</button>' +
        '</div>' +
      '</div>';
    return el;
  }

  function demarrer() {
    var banniere = construireBanniere();
    document.body.appendChild(banniere);

    var accepter = document.getElementById('lv-consent-accepter');
    var refuser  = document.getElementById('lv-consent-refuser');

    function fermer() { banniere.classList.remove('is-open'); }

    accepter.addEventListener('click', function () { ecrire('accepte'); fermer(); chargerMesure(); });
    refuser.addEventListener('click',  function () { ecrire('refuse');  fermer(); });

    /* Tout lien/bouton portant cet id rouvre le choix (pied de page). */
    var rouvrir = document.getElementById('lv-consent-rouvrir');
    if (rouvrir) {
      rouvrir.addEventListener('click', function (e) {
        e.preventDefault();
        banniere.classList.add('is-open');
      });
    }

    cabler();

    var choix = lire();
    if (choix === 'accepte') chargerMesure();
    else if (choix !== 'refuse') banniere.classList.add('is-open');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();
