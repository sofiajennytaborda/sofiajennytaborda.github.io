
(() => {
  "use strict";

  const API_URL = "https://script.google.com/macros/s/AKfycbwcWQwI_Otseu_5iAoTLp_vd1kWvSxtI32ghWiZO9lqJTXqLY1Q8P9vaTcSpNTvssXN-A/exec";

  const category = document.body.dataset.category || "";
  const isWhatsApp = category === "WhatsApp Premium";

  const $ = id => document.getElementById(id);

  let paypalUrl = "";
  const previewLinks = new Set();

  const words = {
    en: {
      back:"← Back to Home",
      oneTime:"ONE-TIME PAYMENT",
      pay:"PAY WITH PAYPAL",
      payNote:"Pay through PayPal. Then submit your transaction ID and payment screenshot. Access is granted only after Sofia verifies the payment.",
      items:"Collection",
      itemsIntro:"Previews uploaded through the Admin Panel appear here. Full content remains private until approval.",
      empty:"No items have been uploaded yet.",
      payment:"Payment Confirmation Request",
      paymentIntro:"After completing PayPal payment, enter your details below and submit your request.",
      name:"Your Name",
      email:"Gmail / Email",
      txn:"PayPal Transaction ID",
      shot:"Payment Screenshot",
      phone:"Your WhatsApp Number (optional)",
      submit:"Submit Payment Details",
      submitNote:"Sofia will verify the transaction in PayPal before approval.",
      check:"Check My Access",
      checkIntro:"Use the same Gmail address entered in your payment request.",
      checkEmail:"Enter your Gmail / Email",
      checkId:"Enter your WhatsApp request ID",
      checkBtn:"Check Status",
      waiting:"Thank you. Your request has been received. Please wait while Sofia verifies your payment and approves access.",
      pending:"Your request is still waiting for approval.",
      open:"OPEN MY PRIVATE FOLDER",
      approved:"Your access has been approved.",
      notFound:"No approved access was found for these details.",
      waPrivate:"Your WhatsApp contact is hidden until your payment is approved.",
      waReady:"Your WhatsApp Premium access is approved.",
      setup:"Payment setup is not complete yet. Please try again later.",
      sending:"Submitting your request…",
      requestId:"Request ID",
      accessHint:"Open the folder while signed in to Google with the same Gmail address you submitted.",
      invalid:"Complete all required fields and choose a JPG, PNG or WEBP screenshot up to 6 MB.",
      locked:"LOCKED CONTENT",
      clickPay:"CLICK TO PAY WITH PAYPAL"
    },

    ur: {
      back:"← ہوم پیج پر واپس",
      oneTime:"ایک مرتبہ ادائیگی",
      pay:"پے پال سے ادائیگی کریں",
      payNote:"پے پال کے ذریعے ادائیگی کریں، پھر ٹرانزیکشن آئی ڈی اور ادائیگی کا اسکرین شاٹ جمع کروائیں۔ صوفیہ تصدیق کے بعد رسائی دیں گی۔",
      items:"کلیکشن",
      itemsIntro:"ایڈمن پینل سے اپ لوڈ کیے گئے نمونے یہاں نظر آئیں گے۔ مکمل مواد منظوری تک نجی رہے گا۔",
      empty:"ابھی کوئی مواد اپ لوڈ نہیں کیا گیا۔",
      payment:"ادائیگی کی تصدیق کی درخواست",
      paymentIntro:"پے پال ادائیگی کے بعد اپنی تفصیلات درج کرکے درخواست جمع کروائیں۔",
      name:"آپ کا نام",
      email:"جی میل / ای میل",
      txn:"پے پال ٹرانزیکشن آئی ڈی",
      shot:"ادائیگی کا اسکرین شاٹ",
      phone:"آپ کا واٹس ایپ نمبر (اختیاری)",
      submit:"ادائیگی کی تفصیلات جمع کروائیں",
      submitNote:"صوفیہ پے پال میں ٹرانزیکشن چیک کرکے منظوری دیں گی۔",
      check:"اپنی رسائی چیک کریں",
      checkIntro:"وہی جی میل استعمال کریں جو ادائیگی کی درخواست میں دیا تھا۔",
      checkEmail:"اپنا جی میل / ای میل درج کریں",
      checkId:"واٹس ایپ درخواست کا آئی ڈی درج کریں",
      checkBtn:"حالت چیک کریں",
      waiting:"شکریہ! آپ کی درخواست موصول ہوگئی ہے۔ صوفیہ ادائیگی کی تصدیق کرکے رسائی منظور کریں گی۔ براہ کرم انتظار کریں۔",
      pending:"آپ کی درخواست ابھی منظوری کے انتظار میں ہے۔",
      open:"میرا نجی فولڈر کھولیں",
      approved:"آپ کی رسائی منظور ہوگئی ہے۔",
      notFound:"ان تفصیلات کے لیے منظور شدہ رسائی نہیں ملی۔",
      waPrivate:"آپ کا واٹس ایپ رابطہ ادائیگی کی منظوری تک پوشیدہ رہے گا۔",
      waReady:"آپ کی واٹس ایپ پریمیم رسائی منظور ہوگئی ہے۔",
      setup:"ادائیگی کا نظام ابھی مکمل طور پر سیٹ نہیں ہوا۔",
      sending:"درخواست جمع ہو رہی ہے…",
      requestId:"درخواست کا آئی ڈی",
      accessHint:"فولڈر اسی جی میل سے کھولیں جو آپ نے درخواست میں دیا تھا۔",
      invalid:"تمام ضروری خانے پُر کریں اور 6 MB تک JPG، PNG یا WEBP اسکرین شاٹ منتخب کریں۔",
      locked:"مقفل مواد",
      clickPay:"پے پال سے ادائیگی کے لیے کلک کریں"
    }
  };

  const tr = key =>
    (words[$("languageSelect").value] || words.en)[key] ||
    words.en[key] || key;


  // LOCKED PHOTO / VIDEO PREVIEW DESIGN

  function addLockStyles() {

    if ($("sjLockStyles")) return;

    const style = document.createElement("style");
    style.id = "sjLockStyles";

    style.textContent = `
      .preview-card.locked-card {
        display:block;
        position:relative;
        text-decoration:none;
        color:inherit;
        cursor:pointer;
        overflow:hidden;
        transition:transform .2s,box-shadow .2s;
      }

      .preview-card.locked-card:hover {
        transform:translateY(-3px);
        box-shadow:0 8px 22px rgba(8,45,82,.15);
      }

      .preview-card.locked-card:focus-visible {
        outline:3px solid #ffc439;
        outline-offset:3px;
      }

      .locked-card .preview-media {
        position:relative;
        width:100%;
        overflow:hidden;
        background:#082d52;
        min-height:190px;
      }

      .locked-card .preview-media img {
        display:block;
        width:100%;
        height:190px;
        object-fit:cover;
        filter:blur(7px) brightness(.38);
        transform:scale(1.12);
        transition:filter .25s;
      }

      .locked-card:hover .preview-media img {
        filter:blur(5px) brightness(.32);
      }

      .locked-card .preview-lock {
        position:absolute;
        inset:0;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:9px;
        color:#fff;
        text-align:center;
        background:rgba(3,20,42,.30);
        pointer-events:none;
      }

      .locked-card .lock-icon {
        font-size:37px;
        line-height:1.2;
      }

      .locked-card .lock-text {
        font-size:12px;
        font-weight:900;
        letter-spacing:1px;
      }

      .locked-card .lock-action {
        background:#ffc439;
        color:#082d52;
        border-radius:6px;
        padding:7px 12px;
        font-size:11px;
        font-weight:900;
      }

      .locked-card h3 {
        text-decoration:none;
      }
    `;

    document.head.appendChild(style);
  }


  function applyLanguage() {

    const lang = $("languageSelect").value;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = tr(el.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.placeholder = tr(el.dataset.i18nPlaceholder);
    });
  }


  function jsonp(action, params = {}) {

    return new Promise((resolve, reject) => {

      const cb = "sjcb_" + Date.now() + "_" +
        Math.floor(Math.random() * 999999);

      const qs = new URLSearchParams({
        ...params,
        action,
        callback:cb
      }).toString();

      const s = document.createElement("script");

      const timer = setTimeout(() => {
        cleanup();
        reject(new Error("Request timed out."));
      }, 18000);

      function cleanup() {
        clearTimeout(timer);
        try {
          delete window[cb];
        } catch(e) {
          window[cb] = undefined;
        }
        s.remove();
      }

      window[cb] = d => {
        cleanup();
        resolve(d);
      };

      s.onerror = () => {
        cleanup();
        reject(new Error("Could not connect to the website service."));
      };

      s.src = API_URL + "?" + qs;
      document.head.appendChild(s);
    });
  }


  function status(el, msg, kind = "info") {
    el.textContent = msg;
    el.className = "status show " + kind;
  }


  // LOAD CATEGORY PRICE AND PAYPAL LINK

  async function loadInfo() {

    try {

      const d = await jsonp("folderInfo", {category});

      if (!d || !d.success) {
        throw new Error(d?.message || "Folder details unavailable.");
      }

      $("priceValue").textContent =
        "$" + Number(d.price || 0).toFixed(2) + " USD";

      if (
        d.paypalLink &&
        d.paypalLink.startsWith("https://www.paypal.com/") &&
        Number(d.price) > 0
      ) {

        paypalUrl = d.paypalLink;

        $("payButton").href = paypalUrl;
        $("payButton").classList.remove("disabled");
        $("payButton").setAttribute("aria-disabled", "false");

        // Update all existing preview cards
        previewLinks.forEach(link => {
          link.href = paypalUrl;
          link.setAttribute("aria-disabled", "false");
        });

      } else {

        paypalUrl = "";

        status($("setupStatus"), tr("setup"), "error");
      }

    } catch(e) {

      status(
        $("setupStatus"),
        e.message || tr("setup"),
        "error"
      );
    }
  }


  // MAKE EVERY PREVIEW CARD CLICKABLE

  function createLockedCard(item) {

    const card = document.createElement("a");

    card.className = "preview-card locked-card";
    card.href = paypalUrl || "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const title = item.title || "Collection item";

    card.setAttribute(
      "aria-label",
      title + ". " + tr("clickPay")
    );

    card.addEventListener("click", e => {

      if (!paypalUrl) {

        e.preventDefault();

        status(
          $("setupStatus"),
          tr("setup"),
          "error"
        );
      }

    });

    previewLinks.add(card);

    // IMAGE AREA

    const media = document.createElement("div");
    media.className = "preview-media";

    if (item.thumbnailUrl) {

      const img = document.createElement("img");

      img.src = item.thumbnailUrl;
      img.alt = "Locked preview";
      img.loading = "lazy";

      media.appendChild(img);

    } else {

      media.style.height = "190px";
      media.style.display = "grid";
      media.style.placeItems = "center";
      media.style.color = "#fff";
      media.textContent = "🔒";
    }

    // LOCK OVERLAY

    const overlay = document.createElement("div");
    overlay.className = "preview-lock";

    const icon = document.createElement("span");
    icon.className = "lock-icon";
    icon.textContent = "🔒";

    const lockText = document.createElement("span");
    lockText.className = "lock-text";
    lockText.textContent = tr("locked");

    const action = document.createElement("span");
    action.className = "lock-action";
    action.textContent = tr("clickPay");

    overlay.append(icon, lockText, action);
    media.appendChild(overlay);

    card.appendChild(media);

    // TITLE

    const h = document.createElement("h3");
    h.textContent = title;
    card.appendChild(h);

    // DESCRIPTION

    if (item.description) {

      const p = document.createElement("p");
      p.textContent = item.description;
      card.appendChild(p);
    }

    return card;
  }


  // LOAD PUBLIC PREVIEW THUMBNAILS

  async function loadItems() {

    if (isWhatsApp) return;

    try {

      const d = await jsonp("folderContents", {category});

      if (!d || d.success === false) {
        throw new Error("Could not load collection.");
      }

      const items = Array.isArray(d.items) ? d.items : [];

      const grid = $("previewGrid");

      grid.innerHTML = "";

      previewLinks.clear();

      if (!items.length) {

        $("previewEmpty").classList.remove("hidden");
        $("previewEmpty").textContent = tr("empty");

        return;
      }

      $("previewEmpty").classList.add("hidden");

      items.forEach(item => {

        const card = createLockedCard(item);

        grid.appendChild(card);

      });

    } catch(e) {

      $("previewEmpty").classList.remove("hidden");

      $("previewEmpty").textContent =
        e.message || tr("empty");
    }
  }


  // READ PAYMENT SCREENSHOT

  function readFile(file) {

    return new Promise((resolve, reject) => {

      const r = new FileReader();

      r.onload = () => resolve(String(r.result || ""));

      r.onerror = () => reject(
        new Error("Could not read screenshot.")
      );

      r.readAsDataURL(file);
    });
  }


  // PAYMENT SUBMISSION - EXISTING SYSTEM PRESERVED

  function setupPayment() {

    const form = $("paymentForm");
    const frame = $("paymentFrame");

    form.action = API_URL;

    form.addEventListener("submit", async e => {

      e.preventDefault();

      if (!form.reportValidity()) return;

      const f = $("screenshotFile").files[0];

      if (
        !f ||
        f.size > 6 * 1024 * 1024 ||
        !/^image\/(jpeg|png|webp)$/i.test(f.type)
      ) {

        status(
          $("paymentStatus"),
          tr("invalid"),
          "error"
        );

        return;
      }

      const b = $("submitPayment");

      b.disabled = true;
      b.textContent = tr("sending");

      try {

        $("screenshotData").value = await readFile(f);

        form.submit();

      } catch(err) {

        b.disabled = false;
        b.textContent = tr("submit");

        status(
          $("paymentStatus"),
          err.message,
          "error"
        );
      }

    });


    window.addEventListener("message", e => {

      if (e.source !== frame.contentWindow) return;

      const d = e.data || {};

      if (
        d.type !== "FOLDER_PAYMENT_SUCCESS" &&
        d.type !== "FORM_SUBMISSION_ERROR"
      ) return;

      const b = $("submitPayment");

      b.disabled = false;
      b.textContent = tr("submit");

      if (d.success) {

        status(
          $("paymentStatus"),
          tr("waiting") + " " +
          tr("requestId") + ": " +
          (d.paymentId || ""),
          "success"
        );

        if (isWhatsApp && d.paymentId) {

          $("accessRequestId").value = d.paymentId;

          try {
            localStorage.setItem(
              "sjWhatsAppRequestId",
              d.paymentId
            );
          } catch(err) {}
        }

      } else {

        status(
          $("paymentStatus"),
          d.message || "Request could not be submitted.",
          "error"
        );
      }

    });

  }


  // CHECK CUSTOMER ACCESS

  async function checkAccess(e) {

    e.preventDefault();

    $("accessResult").innerHTML = "";

    try {

      if (isWhatsApp) {

        const id =
          $("accessRequestId").value.trim() ||
          localStorage.getItem("sjWhatsAppRequestId") ||
          "";

        if (!id) throw new Error(tr("checkId"));

        const d = await jsonp("whatsappStatus", {
          paymentId:id
        });

        if (!d || !d.found) {
          throw new Error(tr("notFound"));
        }

        if (d.status !== "approved") {

          status(
            $("accessStatus"),
            tr("pending"),
            "info"
          );

          return;
        }

        status(
          $("accessStatus"),
          tr("waReady"),
          "success"
        );

        if (d.number) {

          const a = document.createElement("a");

          a.className = "access-link";

          a.href =
            "https://wa.me/" +
            String(d.number).replace(/\D/g, "");

          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = d.number;

          $("accessResult").appendChild(a);

        } else if (d.username) {

          const p = document.createElement("p");

          p.textContent = d.username;

          $("accessResult").appendChild(p);
        }

        return;
      }


      const email = $("accessEmail").value.trim();

      if (!email) throw new Error(tr("checkEmail"));

      const d = await jsonp("folderAccess", {
        category,
        email
      });

      if (!d || !d.success) {
        throw new Error(d?.message || tr("notFound"));
      }

      if (!d.access) {

        status(
          $("accessStatus"),
          tr("pending"),
          "info"
        );

        return;
      }

      status(
        $("accessStatus"),
        tr("approved") + " " + tr("accessHint"),
        "success"
      );

      const a = document.createElement("a");

      a.className = "access-link";
      a.href = d.folderUrl;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = tr("open");

      $("accessResult").appendChild(a);

    } catch(err) {

      status(
        $("accessStatus"),
        err.message || tr("notFound"),
        "error"
      );
    }
  }


  // INITIALIZE

  $("languageSelect").addEventListener(
    "change",
    applyLanguage
  );

  $("accessForm").addEventListener(
    "submit",
    checkAccess
  );

  if (isWhatsApp) {

    try {

      $("accessRequestId").value =
        localStorage.getItem("sjWhatsAppRequestId") || "";

    } catch(e) {}
  }

  addLockStyles();
  applyLanguage();

  setupPayment();
  loadInfo();
  loadItems();

})();
