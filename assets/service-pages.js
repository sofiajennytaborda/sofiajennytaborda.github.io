(() => {
  "use strict";

  const API_URL = "https://script.google.com/macros/s/AKfycbwcWQwI_Otseu_5iAoTLp_vd1kWvSxtI32ghWiZO9lqJTXqLY1Q8P9vaTcSpNTvssXN-A/exec";
  const $ = id => document.getElementById(id);
  const category = document.body.dataset.category || "";
  const pageType = document.body.dataset.pageType || "store";
  const frame = $("responseFrame");
  let selectedItem = null;
  let items = [];

  function setStatus(id, message, kind = "info") {
    const node = $(id);
    if (!node) return;
    node.textContent = message;
    node.className = "status show " + kind;
  }

  function jsonp(action, params = {}) {
    return new Promise((resolve, reject) => {
      const callback = "sjPage_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);
      const query = new URLSearchParams({ ...params, action, callback }).toString();
      const script = document.createElement("script");
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error("The website service took too long to respond. Please refresh and try again."));
      }, 20000);

      function cleanup() {
        clearTimeout(timer);
        try { delete window[callback]; } catch (e) { window[callback] = undefined; }
        script.remove();
      }

      window[callback] = data => {
        cleanup();
        resolve(data);
      };
      script.onerror = () => {
        cleanup();
        reject(new Error("Could not connect to the website service."));
      };
      script.src = API_URL + "?" + query;
      document.head.appendChild(script);
    });
  }

  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined && text !== null) el.textContent = String(text);
    return el;
  }

  function safePayPal(url) {
    return /^https:\/\/www\.paypal\.com\/ncp\/payment\/[A-Za-z0-9]+/i.test(String(url || ""));
  }

  function safeDrive(url) {
    return /^https:\/\/drive\.google\.com\//i.test(String(url || ""));
  }

  function makeMedia(item) {
    const wrap = node("div", "catalogue-media-wrap");
    const mediaUrl = String(item.mediaUrl || "");
    const thumbUrl = String(item.thumbnailUrl || "");

    if (item.mediaType === "video" && safeDrive(mediaUrl)) {
      const iframe = node("iframe", "catalogue-media-frame");
      iframe.src = mediaUrl;
      iframe.title = item.title || "Product video";
      iframe.loading = "lazy";
      iframe.allow = "autoplay; encrypted-media; picture-in-picture";
      iframe.allowFullscreen = true;
      wrap.appendChild(iframe);
    } else if (safeDrive(thumbUrl || mediaUrl)) {
      const img = node("img", "catalogue-media");
      img.src = thumbUrl || mediaUrl;
      img.alt = item.title || "Product image";
      img.loading = "lazy";
      img.onerror = () => {
        img.remove();
        wrap.appendChild(node("div", "catalogue-placeholder", "Image preview is not available."));
      };
      wrap.appendChild(img);
    } else {
      wrap.appendChild(node("div", "catalogue-placeholder", "Preview will appear here when uploaded by the administrator."));
    }
    return wrap;
  }

  function makePayPalLink(url, label = "Pay with PayPal") {
    const a = node("a", "pay-button");
    a.textContent = label;
    if (safePayPal(url)) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    } else {
      a.href = "#";
      a.classList.add("disabled");
      a.setAttribute("aria-disabled", "true");
      a.addEventListener("click", e => e.preventDefault());
    }
    return a;
  }

  function renderCatalogue(list) {
    const grid = $("catalogueGrid");
    const empty = $("emptyState");
    if (!grid || !empty) return;
    grid.innerHTML = "";

    if (!list.length) {
      empty.classList.remove("hidden");
      empty.textContent = "No active items are available yet. Please check again later.";
      return;
    }

    empty.classList.add("hidden");
    list.forEach(item => {
      const card = node("article", "catalogue-card");
      card.appendChild(makeMedia(item));

      const body = node("div", "catalogue-card-body");
      body.appendChild(node("h3", "", item.title || "Untitled item"));
      if (item.serviceType) body.appendChild(node("div", "catalogue-meta", "Service: " + item.serviceType));
      if (item.description) body.appendChild(node("p", "", item.description));
      body.appendChild(node("div", "catalogue-price", "$" + Number(item.price || 0).toFixed(2) + " USD"));

      const actions = node("div", "catalogue-actions");
      actions.appendChild(makePayPalLink(item.paypalLink, "PayPal Payment"));

      const choose = node("button", "", pageType === "service" ? "Apply for this service" : "Order this item");
      choose.type = "button";
      choose.addEventListener("click", () => selectItem(item));
      actions.appendChild(choose);

      body.appendChild(actions);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function selectItem(item) {
    selectedItem = item;

    if (pageType === "service") {
      $("listingId").value = item.id || "";
      $("serviceTypeValue").value = item.serviceType || "";
      $("selectedServiceName").textContent = item.title || "Selected service";
      $("selectedServicePrice").textContent = "$" + Number(item.price || 0).toFixed(2) + " USD";
      $("applicationPayPal").href = item.paypalLink || "#";
      $("applicationSection").classList.remove("hidden");
      $("applicationSection").scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      $("productId").value = item.id || "";
      $("selectedProductName").textContent = item.title || "Selected item";
      $("selectedProductPrice").textContent = "$" + Number(item.price || 0).toFixed(2) + " USD";
      $("orderPayPal").href = item.paypalLink || "#";
      $("orderSection").classList.remove("hidden");
      $("orderSection").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function loadCatalogue() {
    try {
      const result = await jsonp("catalogue", { category });
      if (!result || !result.success) throw new Error("The product list could not be loaded.");
      items = Array.isArray(result.products) ? result.products : [];
      renderCatalogue(items);
    } catch (error) {
      setStatus("setupStatus", error.message || "Could not load this page.", "error");
      $("emptyState").classList.remove("hidden");
      $("emptyState").textContent = "The collection could not be loaded. Please refresh the page.";
    }
  }

  function readDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Could not read the selected image."));
      reader.readAsDataURL(file);
    });
  }

  async function compressedImageData(file) {
    if (!file) throw new Error("Please select all required images.");
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      throw new Error("Please upload JPG, PNG or WEBP images only.");
    }
    if (file.size > 25 * 1024 * 1024) {
      throw new Error("Each selected image must be smaller than 25 MB before upload.");
    }

    if (!window.createImageBitmap) {
      const raw = await readDataUrl(file);
      if (raw.length > 8 * 1024 * 1024) throw new Error("Image is too large. Please choose a smaller image.");
      return raw;
    }

    const bitmap = await createImageBitmap(file);
    const maxSide = 1700;
    let scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    let data = "";

    for (let attempt = 0; attempt < 5; attempt++) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      let quality = 0.84;
      data = canvas.toDataURL("image/jpeg", quality);
      while (data.length > 2 * 1024 * 1024 && quality > 0.55) {
        quality -= 0.07;
        data = canvas.toDataURL("image/jpeg", quality);
      }
      if (data.length <= 2 * 1024 * 1024) {
        bitmap.close && bitmap.close();
        return data;
      }
      scale *= 0.78;
    }

    bitmap.close && bitmap.close();
    if (!data || data.length > 6 * 1024 * 1024) {
      throw new Error("Could not reduce this image enough. Please select a smaller image.");
    }
    return data;
  }

  function setupPostMessages() {
    window.addEventListener("message", event => {
      if (!frame || event.source !== frame.contentWindow) return;
      const data = event.data || {};
      const accepted = [
        "PRODUCT_ORDER_SUCCESS",
        "SERVICE_APPLICATION_SUCCESS",
        "LUCKY_ENTRY_SUCCESS",
        "FORM_SUBMISSION_ERROR"
      ];
      if (!accepted.includes(data.type)) return;

      const submitButton = document.querySelector(".request-submit:disabled");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || "Submit Request";
      }

      if (data.success) {
        let reference = data.orderId || data.applicationId || data.entryId || "";
        const message = (data.message || "Your request has been received.") +
          (reference ? " Reference ID: " + reference : "");
        const target = pageType === "service" ? "applicationStatus" :
                       pageType === "lucky" ? "entryStatus" : "orderStatus";
        setStatus(target, message, "success");
        const form = pageType === "service" ? $("applicationForm") :
                     pageType === "lucky" ? $("entryForm") : $("orderForm");
        if (form) form.reset();
        selectedItem = null;
      } else {
        const target = pageType === "service" ? "applicationStatus" :
                       pageType === "lucky" ? "entryStatus" : "orderStatus";
        setStatus(target, data.message || "The request could not be submitted.", "error");
      }
    });
  }

  async function setupStoreOrderForm() {
    const form = $("orderForm");
    if (!form) return;
    form.action = API_URL;

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!selectedItem) {
        setStatus("orderStatus", "Select a product first.", "error");
        return;
      }
      const screenshot = $("orderScreenshot").files[0];
      if (!screenshot) {
        setStatus("orderStatus", "Please upload your PayPal payment screenshot.", "error");
        return;
      }
      if (screenshot.size > 6 * 1024 * 1024) {
        setStatus("orderStatus", "Payment screenshot must be 6 MB or smaller.", "error");
        return;
      }

      const button = $("orderSubmit");
      button.dataset.originalText = button.textContent;
      button.disabled = true;
      button.textContent = "Submitting…";

      try {
        $("orderScreenshotData").value = await readDataUrl(screenshot);
        form.submit();
      } catch (error) {
        button.disabled = false;
        button.textContent = button.dataset.originalText;
        setStatus("orderStatus", error.message, "error");
      }
    });
  }

  async function setupServiceApplicationForm() {
    const form = $("applicationForm");
    if (!form) return;
    form.action = API_URL;

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!selectedItem) {
        setStatus("applicationStatus", "Select a service listing first.", "error");
        return;
      }

      const files = {
        screenshot: $("applicationScreenshot").files[0],
        idFront: $("idFrontFile").files[0],
        idBack: $("idBackFile").files[0],
        passport: $("passportFile").files[0],
        photo: $("applicantPhotoFile").files[0]
      };
      if (Object.values(files).some(file => !file)) {
        setStatus("applicationStatus", "Upload the payment screenshot and all four required applicant images.", "error");
        return;
      }

      const button = $("applicationSubmit");
      button.dataset.originalText = button.textContent;
      button.disabled = true;
      button.textContent = "Preparing secure documents…";

      try {
        $("applicationScreenshotData").value = await compressedImageData(files.screenshot);
        $("idFrontData").value = await compressedImageData(files.idFront);
        $("idBackData").value = await compressedImageData(files.idBack);
        $("passportData").value = await compressedImageData(files.passport);
        $("applicantPhotoData").value = await compressedImageData(files.photo);

        button.textContent = "Submitting application…";
        form.submit();
      } catch (error) {
        button.disabled = false;
        button.textContent = button.dataset.originalText;
        setStatus("applicationStatus", error.message || "Could not prepare the documents.", "error");
      }
    });
  }

  async function loadLuckyDraws() {
    try {
      const result = await jsonp("luckyDraws");
      if (!result || !result.success) throw new Error("Lucky Draw information could not be loaded.");
      const draws = Array.isArray(result.draws) ? result.draws : [];
      const grid = $("drawGrid");
      const empty = $("emptyState");
      grid.innerHTML = "";

      if (!draws.length) {
        empty.classList.remove("hidden");
        empty.textContent = "No active Lucky Draw is available right now.";
        return;
      }
      empty.classList.add("hidden");

      draws.forEach(draw => {
        const card = node("article", "draw-card-public");
        const mediaWrap = node("div", "catalogue-media-wrap");
        if (draw.mediaType === "video" && safeDrive(draw.mediaUrl)) {
          const iframe = node("iframe", "catalogue-media-frame");
          iframe.src = draw.mediaUrl;
          iframe.title = draw.title || "Lucky Draw prize video";
          iframe.loading = "lazy";
          iframe.allowFullscreen = true;
          mediaWrap.appendChild(iframe);
        } else if (safeDrive(draw.mediaUrl)) {
          const img = node("img", "catalogue-media");
          img.src = draw.mediaUrl;
          img.alt = draw.prize || draw.title || "Lucky Draw prize";
          img.loading = "lazy";
          mediaWrap.appendChild(img);
        } else {
          mediaWrap.appendChild(node("div", "catalogue-placeholder", "Prize image will appear when uploaded."));
        }
        card.appendChild(mediaWrap);

        const body = node("div", "draw-card-body");
        body.appendChild(node("h3", "", draw.title || "Lucky Draw"));
        body.appendChild(node("div", "draw-prize", "Prize: " + (draw.prize || "See details")));
        if (draw.description) body.appendChild(node("p", "", draw.description));
        body.appendChild(node("div", "catalogue-price", "$" + Number(draw.price || 0).toFixed(2) + " USD per entry"));
        if (draw.drawDate) body.appendChild(node("div", "catalogue-meta", "Draw date: " + draw.drawDate));

        const actions = node("div", "catalogue-actions");
        actions.appendChild(makePayPalLink(draw.paypalLink, "PayPal Entry Payment"));
        const join = node("button", "", "Enter this draw");
        join.type = "button";
        join.addEventListener("click", () => selectDraw(draw));
        actions.appendChild(join);
        body.appendChild(actions);
        card.appendChild(body);
        grid.appendChild(card);
      });
    } catch (error) {
      setStatus("setupStatus", error.message || "Could not load Lucky Draws.", "error");
      $("emptyState").classList.remove("hidden");
      $("emptyState").textContent = "Lucky Draws could not be loaded. Please refresh the page.";
    }
  }

  function selectDraw(draw) {
    selectedItem = draw;
    $("drawId").value = draw.id || "";
    $("selectedDrawName").textContent = draw.title || "Lucky Draw";
    $("selectedDrawPrize").textContent = draw.prize || "";
    $("selectedDrawPrice").textContent = "$" + Number(draw.price || 0).toFixed(2) + " USD";
    $("entryPayPal").href = draw.paypalLink || "#";
    $("entrySection").classList.remove("hidden");
    $("entrySection").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setupLuckyEntryForm() {
    const form = $("entryForm");
    if (!form) return;
    form.action = API_URL;

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!selectedItem) {
        setStatus("entryStatus", "Select an active Lucky Draw first.", "error");
        return;
      }
      const screenshot = $("entryScreenshot").files[0];
      if (!screenshot) {
        setStatus("entryStatus", "Please upload your payment screenshot.", "error");
        return;
      }
      if (screenshot.size > 6 * 1024 * 1024) {
        setStatus("entryStatus", "Payment screenshot must be 6 MB or smaller.", "error");
        return;
      }

      const button = $("entrySubmit");
      button.dataset.originalText = button.textContent;
      button.disabled = true;
      button.textContent = "Submitting…";
      try {
        $("entryScreenshotData").value = await readDataUrl(screenshot);
        form.submit();
      } catch (error) {
        button.disabled = false;
        button.textContent = button.dataset.originalText;
        setStatus("entryStatus", error.message, "error");
      }
    });
  }

  setupPostMessages();

  if (pageType === "lucky") {
    loadLuckyDraws();
    setupLuckyEntryForm();
  } else {
    loadCatalogue();
    if (pageType === "service") setupServiceApplicationForm();
    else setupStoreOrderForm();
  }
})();
