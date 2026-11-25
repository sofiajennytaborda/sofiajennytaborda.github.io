(() => {
  "use strict";

  const API_URL = "https://script.google.com/macros/s/AKfycbwcWQwI_Otseu_5iAoTLp_vd1kWvSxtI32ghWiZO9lqJTXqLY1Q8P9vaTcSpNTvssXN-A/exec";

  const category = document.body.dataset.category || "";
  const isWhatsApp = category === "WhatsApp Premium";

  const $ = id => document.getElementById(id);

  let paypalUrl = "";
  const previewLinks = new Set();

  const languageNames = {
    en: "🇬🇧 English",
    ur: "🇵🇰 اردو",
    es: "🇪🇸 Español",
    it: "🇮🇹 Italiano",
    fr: "🇫🇷 Français",
    ar: "🇸🇦 العربية",
    pt: "🇧🇷 Português",
    de: "🇩🇪 Deutsch",
    hi: "🇮🇳 हिन्दी",
    zh: "🇨🇳 中文"
  };

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
      clickPay:"CLICK TO PAY WITH PAYPAL",
      sameEmail:"Same Gmail address used for payment",
      timeout:"The request timed out. Please try again.",
      connectError:"Could not connect to the website service. Please try again.",
      folderUnavailable:"Folder details are currently unavailable.",
      collectionError:"Could not load the collection. Please refresh and try again.",
      screenshotReadError:"Could not read the payment screenshot.",
      submitError:"Your request could not be submitted. Please try again.",
      collectionItem:"Collection item",
      lockedAlt:"Locked preview"
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
      waPrivate:"ادائیگی منظور ہونے تک آپ کا واٹس ایپ رابطہ پوشیدہ رہے گا۔",
      waReady:"آپ کی واٹس ایپ پریمیم رسائی منظور ہوگئی ہے۔",
      setup:"ادائیگی کا نظام ابھی مکمل طور پر سیٹ نہیں ہوا۔ براہ کرم بعد میں کوشش کریں۔",
      sending:"آپ کی درخواست جمع ہو رہی ہے…",
      requestId:"درخواست کا آئی ڈی",
      accessHint:"فولڈر اسی گوگل اکاؤنٹ سے کھولیں جس کا جی میل آپ نے دیا تھا۔",
      invalid:"تمام ضروری خانے پُر کریں اور 6 MB تک JPG، PNG یا WEBP اسکرین شاٹ منتخب کریں۔",
      locked:"مقفل مواد",
      clickPay:"پے پال سے ادائیگی کے لیے کلک کریں",
      sameEmail:"ادائیگی کے لیے استعمال کیا گیا وہی جی میل",
      timeout:"درخواست کا وقت ختم ہوگیا۔ دوبارہ کوشش کریں۔",
      connectError:"ویب سائٹ سروس سے رابطہ نہیں ہو سکا۔ دوبارہ کوشش کریں۔",
      folderUnavailable:"فولڈر کی تفصیلات فی الحال دستیاب نہیں ہیں۔",
      collectionError:"کلیکشن لوڈ نہیں ہو سکی۔ صفحہ ریفریش کرکے دوبارہ کوشش کریں۔",
      screenshotReadError:"ادائیگی کا اسکرین شاٹ پڑھا نہیں جا سکا۔",
      submitError:"آپ کی درخواست جمع نہیں ہو سکی۔ دوبارہ کوشش کریں۔",
      collectionItem:"کلیکشن آئٹم",
      lockedAlt:"مقفل پیش نظارہ"
    },

    es: {
      back:"← Volver al inicio",
      oneTime:"PAGO ÚNICO",
      pay:"PAGAR CON PAYPAL",
      payNote:"Paga mediante PayPal. Después, envía tu ID de transacción y una captura del pago. El acceso se concede solo cuando Sofia verifica el pago.",
      items:"Colección",
      itemsIntro:"Aquí aparecen las vistas previas que se suban desde el Panel de administración. El contenido completo permanece privado hasta su aprobación.",
      empty:"Todavía no se han subido artículos.",
      payment:"Solicitud de confirmación de pago",
      paymentIntro:"Después de pagar con PayPal, introduce tus datos y envía la solicitud.",
      name:"Tu nombre",
      email:"Gmail / Correo electrónico",
      txn:"ID de transacción de PayPal",
      shot:"Captura del pago",
      phone:"Tu número de WhatsApp (opcional)",
      submit:"Enviar datos de pago",
      submitNote:"Sofia verificará la transacción en PayPal antes de aprobarla.",
      check:"Comprobar mi acceso",
      checkIntro:"Usa la misma dirección de Gmail que incluiste en tu solicitud de pago.",
      checkEmail:"Introduce tu Gmail / correo electrónico",
      checkId:"Introduce el ID de tu solicitud de WhatsApp",
      checkBtn:"Comprobar estado",
      waiting:"Gracias. Hemos recibido tu solicitud. Espera mientras Sofia verifica el pago y aprueba el acceso.",
      pending:"Tu solicitud sigue pendiente de aprobación.",
      open:"ABRIR MI CARPETA PRIVADA",
      approved:"Tu acceso ha sido aprobado.",
      notFound:"No se encontró acceso aprobado con estos datos.",
      waPrivate:"Tu contacto de WhatsApp permanecerá oculto hasta que se apruebe el pago.",
      waReady:"Tu acceso a WhatsApp Premium ha sido aprobado.",
      setup:"La configuración del pago aún no está completa. Inténtalo más tarde.",
      sending:"Enviando tu solicitud…",
      requestId:"ID de solicitud",
      accessHint:"Abre la carpeta con la misma cuenta de Google y el mismo Gmail que enviaste.",
      invalid:"Completa todos los campos obligatorios y elige una captura JPG, PNG o WEBP de hasta 6 MB.",
      locked:"CONTENIDO BLOQUEADO",
      clickPay:"HAZ CLIC PARA PAGAR CON PAYPAL",
      sameEmail:"El mismo Gmail utilizado para el pago",
      timeout:"La solicitud ha agotado el tiempo de espera. Inténtalo de nuevo.",
      connectError:"No se pudo conectar con el servicio del sitio web. Inténtalo de nuevo.",
      folderUnavailable:"Los detalles de la carpeta no están disponibles en este momento.",
      collectionError:"No se pudo cargar la colección. Actualiza la página e inténtalo de nuevo.",
      screenshotReadError:"No se pudo leer la captura del pago.",
      submitError:"No se pudo enviar tu solicitud. Inténtalo de nuevo.",
      collectionItem:"Artículo de la colección",
      lockedAlt:"Vista previa bloqueada"
    },

    it: {
      back:"← Torna alla Home",
      oneTime:"PAGAMENTO UNA TANTUM",
      pay:"PAGA CON PAYPAL",
      payNote:"Paga tramite PayPal. Poi invia l'ID della transazione e uno screenshot del pagamento. L'accesso viene concesso solo dopo la verifica del pagamento da parte di Sofia.",
      items:"Collezione",
      itemsIntro:"Qui vengono mostrate le anteprime caricate tramite il Pannello di amministrazione. I contenuti completi restano privati fino all'approvazione.",
      empty:"Non è ancora stato caricato alcun elemento.",
      payment:"Richiesta di conferma del pagamento",
      paymentIntro:"Dopo aver completato il pagamento PayPal, inserisci i tuoi dati e invia la richiesta.",
      name:"Il tuo nome",
      email:"Gmail / Email",
      txn:"ID transazione PayPal",
      shot:"Screenshot del pagamento",
      phone:"Il tuo numero WhatsApp (facoltativo)",
      submit:"Invia i dati di pagamento",
      submitNote:"Sofia verificherà la transazione su PayPal prima dell'approvazione.",
      check:"Verifica il mio accesso",
      checkIntro:"Usa lo stesso indirizzo Gmail inserito nella richiesta di pagamento.",
      checkEmail:"Inserisci Gmail / Email",
      checkId:"Inserisci l'ID della richiesta WhatsApp",
      checkBtn:"Verifica stato",
      waiting:"Grazie. La tua richiesta è stata ricevuta. Attendi che Sofia verifichi il pagamento e approvi l'accesso.",
      pending:"La tua richiesta è ancora in attesa di approvazione.",
      open:"APRI LA MIA CARTELLA PRIVATA",
      approved:"Il tuo accesso è stato approvato.",
      notFound:"Non è stato trovato un accesso approvato per questi dati.",
      waPrivate:"Il tuo contatto WhatsApp resta nascosto fino all'approvazione del pagamento.",
      waReady:"Il tuo accesso a WhatsApp Premium è stato approvato.",
      setup:"La configurazione del pagamento non è ancora completa. Riprova più tardi.",
      sending:"Invio della richiesta…",
      requestId:"ID richiesta",
      accessHint:"Apri la cartella con lo stesso account Google e lo stesso Gmail che hai inviato.",
      invalid:"Completa tutti i campi obbligatori e scegli uno screenshot JPG, PNG o WEBP fino a 6 MB.",
      locked:"CONTENUTO BLOCCATO",
      clickPay:"CLICCA PER PAGARE CON PAYPAL",
      sameEmail:"Lo stesso Gmail utilizzato per il pagamento",
      timeout:"La richiesta è scaduta. Riprova.",
      connectError:"Impossibile connettersi al servizio del sito. Riprova.",
      folderUnavailable:"I dettagli della cartella non sono al momento disponibili.",
      collectionError:"Impossibile caricare la collezione. Aggiorna la pagina e riprova.",
      screenshotReadError:"Impossibile leggere lo screenshot del pagamento.",
      submitError:"Impossibile inviare la richiesta. Riprova.",
      collectionItem:"Elemento della collezione",
      lockedAlt:"Anteprima bloccata"
    },

    fr: {
      back:"← Retour à l'accueil",
      oneTime:"PAIEMENT UNIQUE",
      pay:"PAYER AVEC PAYPAL",
      payNote:"Payez avec PayPal. Envoyez ensuite votre identifiant de transaction et une capture d'écran du paiement. L'accès est accordé uniquement après vérification du paiement par Sofia.",
      items:"Collection",
      itemsIntro:"Les aperçus ajoutés depuis le panneau d'administration apparaissent ici. Le contenu complet reste privé jusqu'à son approbation.",
      empty:"Aucun élément n'a encore été ajouté.",
      payment:"Demande de confirmation du paiement",
      paymentIntro:"Après avoir effectué le paiement PayPal, saisissez vos coordonnées et envoyez votre demande.",
      name:"Votre nom",
      email:"Gmail / E-mail",
      txn:"Identifiant de transaction PayPal",
      shot:"Capture d'écran du paiement",
      phone:"Votre numéro WhatsApp (facultatif)",
      submit:"Envoyer les informations de paiement",
      submitNote:"Sofia vérifiera la transaction sur PayPal avant de l'approuver.",
      check:"Vérifier mon accès",
      checkIntro:"Utilisez la même adresse Gmail que celle indiquée dans votre demande de paiement.",
      checkEmail:"Saisissez votre Gmail / E-mail",
      checkId:"Saisissez l'identifiant de votre demande WhatsApp",
      checkBtn:"Vérifier le statut",
      waiting:"Merci. Votre demande a bien été reçue. Veuillez patienter pendant que Sofia vérifie le paiement et approuve l'accès.",
      pending:"Votre demande est toujours en attente d'approbation.",
      open:"OUVRIR MON DOSSIER PRIVÉ",
      approved:"Votre accès a été approuvé.",
      notFound:"Aucun accès approuvé n'a été trouvé avec ces informations.",
      waPrivate:"Votre contact WhatsApp reste masqué jusqu'à l'approbation du paiement.",
      waReady:"Votre accès WhatsApp Premium est approuvé.",
      setup:"La configuration du paiement n'est pas encore terminée. Veuillez réessayer plus tard.",
      sending:"Envoi de votre demande…",
      requestId:"Identifiant de demande",
      accessHint:"Ouvrez le dossier avec le même compte Google et la même adresse Gmail que celle fournie.",
      invalid:"Remplissez tous les champs obligatoires et choisissez une capture JPG, PNG ou WEBP de 6 Mo maximum.",
      locked:"CONTENU VERROUILLÉ",
      clickPay:"CLIQUEZ POUR PAYER AVEC PAYPAL",
      sameEmail:"La même adresse Gmail que celle utilisée pour le paiement",
      timeout:"La demande a expiré. Veuillez réessayer.",
      connectError:"Impossible de joindre le service du site. Veuillez réessayer.",
      folderUnavailable:"Les informations du dossier sont momentanément indisponibles.",
      collectionError:"Impossible de charger la collection. Actualisez la page et réessayez.",
      screenshotReadError:"Impossible de lire la capture d'écran du paiement.",
      submitError:"Votre demande n'a pas pu être envoyée. Veuillez réessayer.",
      collectionItem:"Élément de la collection",
      lockedAlt:"Aperçu verrouillé"
    },

    ar: {
      back:"العودة إلى الصفحة الرئيسية ←",
      oneTime:"دفعة واحدة",
      pay:"الدفع عبر باي بال",
      payNote:"ادفع عبر باي بال، ثم أرسل رقم المعاملة ولقطة شاشة للدفع. لن يتم منح الوصول إلا بعد أن تتحقق صوفيا من الدفع.",
      items:"المجموعة",
      itemsIntro:"تظهر هنا المعاينات التي يرفعها المسؤول. يبقى المحتوى الكامل خاصاً حتى الموافقة.",
      empty:"لم تتم إضافة أي عناصر بعد.",
      payment:"طلب تأكيد الدفع",
      paymentIntro:"بعد إتمام الدفع عبر باي بال، أدخل بياناتك وأرسل الطلب.",
      name:"اسمك",
      email:"Gmail / البريد الإلكتروني",
      txn:"رقم معاملة باي بال",
      shot:"لقطة شاشة للدفع",
      phone:"رقم واتساب الخاص بك (اختياري)",
      submit:"إرسال بيانات الدفع",
      submitNote:"ستتحقق صوفيا من المعاملة في باي بال قبل الموافقة.",
      check:"تحقق من إمكانية الوصول",
      checkIntro:"استخدم عنوان Gmail نفسه الذي أدخلته في طلب الدفع.",
      checkEmail:"أدخل Gmail / البريد الإلكتروني",
      checkId:"أدخل رقم طلب واتساب",
      checkBtn:"تحقق من الحالة",
      waiting:"شكراً لك. تم استلام طلبك. يرجى الانتظار حتى تتحقق صوفيا من الدفع وتوافق على الوصول.",
      pending:"لا يزال طلبك في انتظار الموافقة.",
      open:"افتح مجلدي الخاص",
      approved:"تمت الموافقة على وصولك.",
      notFound:"لم يتم العثور على وصول معتمد لهذه البيانات.",
      waPrivate:"سيظل رقم واتساب الخاص بك مخفياً حتى الموافقة على الدفع.",
      waReady:"تمت الموافقة على وصولك إلى واتساب بريميوم.",
      setup:"لم يكتمل إعداد الدفع بعد. يرجى المحاولة لاحقاً.",
      sending:"جارٍ إرسال طلبك…",
      requestId:"رقم الطلب",
      accessHint:"افتح المجلد باستخدام حساب Google نفسه وعنوان Gmail الذي قدمته.",
      invalid:"أكمل جميع الحقول المطلوبة واختر لقطة JPG أو PNG أو WEBP بحجم لا يتجاوز 6 ميغابايت.",
      locked:"محتوى مقفل",
      clickPay:"اضغط للدفع عبر باي بال",
      sameEmail:"عنوان Gmail نفسه المستخدم للدفع",
      timeout:"انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.",
      connectError:"تعذر الاتصال بخدمة الموقع. يرجى المحاولة مرة أخرى.",
      folderUnavailable:"تفاصيل المجلد غير متاحة حالياً.",
      collectionError:"تعذر تحميل المجموعة. حدّث الصفحة وحاول مرة أخرى.",
      screenshotReadError:"تعذرت قراءة لقطة شاشة الدفع.",
      submitError:"تعذر إرسال طلبك. يرجى المحاولة مرة أخرى.",
      collectionItem:"عنصر من المجموعة",
      lockedAlt:"معاينة مقفلة"
    },

    pt: {
      back:"← Voltar ao início",
      oneTime:"PAGAMENTO ÚNICO",
      pay:"PAGAR COM PAYPAL",
      payNote:"Pague pelo PayPal. Em seguida, envie o ID da transação e uma captura de tela do pagamento. O acesso só será concedido depois que Sofia verificar o pagamento.",
      items:"Coleção",
      itemsIntro:"As prévias enviadas pelo Painel de Administração aparecem aqui. O conteúdo completo permanece privado até a aprovação.",
      empty:"Nenhum item foi enviado ainda.",
      payment:"Solicitação de confirmação de pagamento",
      paymentIntro:"Depois de concluir o pagamento pelo PayPal, informe seus dados e envie a solicitação.",
      name:"Seu nome",
      email:"Gmail / E-mail",
      txn:"ID da transação do PayPal",
      shot:"Captura de tela do pagamento",
      phone:"Seu número do WhatsApp (opcional)",
      submit:"Enviar dados de pagamento",
      submitNote:"Sofia verificará a transação no PayPal antes de aprovar.",
      check:"Verificar meu acesso",
      checkIntro:"Use o mesmo endereço do Gmail informado na solicitação de pagamento.",
      checkEmail:"Informe seu Gmail / E-mail",
      checkId:"Informe o ID da solicitação do WhatsApp",
      checkBtn:"Verificar status",
      waiting:"Obrigado. Sua solicitação foi recebida. Aguarde enquanto Sofia verifica o pagamento e aprova o acesso.",
      pending:"Sua solicitação ainda está aguardando aprovação.",
      open:"ABRIR MINHA PASTA PRIVADA",
      approved:"Seu acesso foi aprovado.",
      notFound:"Nenhum acesso aprovado foi encontrado com esses dados.",
      waPrivate:"Seu contato do WhatsApp ficará oculto até a aprovação do pagamento.",
      waReady:"Seu acesso ao WhatsApp Premium foi aprovado.",
      setup:"A configuração do pagamento ainda não foi concluída. Tente novamente mais tarde.",
      sending:"Enviando sua solicitação…",
      requestId:"ID da solicitação",
      accessHint:"Abra a pasta usando a mesma conta Google e o mesmo Gmail informado.",
      invalid:"Preencha todos os campos obrigatórios e escolha uma captura JPG, PNG ou WEBP de até 6 MB.",
      locked:"CONTEÚDO BLOQUEADO",
      clickPay:"CLIQUE PARA PAGAR COM PAYPAL",
      sameEmail:"O mesmo Gmail usado para o pagamento",
      timeout:"O tempo da solicitação expirou. Tente novamente.",
      connectError:"Não foi possível conectar ao serviço do site. Tente novamente.",
      folderUnavailable:"Os detalhes da pasta não estão disponíveis no momento.",
      collectionError:"Não foi possível carregar a coleção. Atualize a página e tente novamente.",
      screenshotReadError:"Não foi possível ler a captura de tela do pagamento.",
      submitError:"Não foi possível enviar sua solicitação. Tente novamente.",
      collectionItem:"Item da coleção",
      lockedAlt:"Prévia bloqueada"
    },

    de: {
      back:"← Zurück zur Startseite",
      oneTime:"EINMALIGE ZAHLUNG",
      pay:"MIT PAYPAL BEZAHLEN",
      payNote:"Bezahlen Sie über PayPal. Senden Sie anschließend Ihre Transaktions-ID und einen Screenshot der Zahlung. Der Zugriff wird erst freigegeben, nachdem Sofia die Zahlung überprüft hat.",
      items:"Sammlung",
      itemsIntro:"Hier erscheinen Vorschauen, die über das Admin-Panel hochgeladen wurden. Der vollständige Inhalt bleibt bis zur Genehmigung privat.",
      empty:"Es wurden noch keine Inhalte hochgeladen.",
      payment:"Anfrage zur Zahlungsbestätigung",
      paymentIntro:"Geben Sie nach der PayPal-Zahlung Ihre Daten ein und senden Sie Ihre Anfrage.",
      name:"Ihr Name",
      email:"Gmail / E-Mail",
      txn:"PayPal-Transaktions-ID",
      shot:"Screenshot der Zahlung",
      phone:"Ihre WhatsApp-Nummer (optional)",
      submit:"Zahlungsdaten senden",
      submitNote:"Sofia überprüft die Transaktion bei PayPal vor der Genehmigung.",
      check:"Meinen Zugriff prüfen",
      checkIntro:"Verwenden Sie dieselbe Gmail-Adresse, die Sie in Ihrer Zahlungsanfrage angegeben haben.",
      checkEmail:"Gmail / E-Mail eingeben",
      checkId:"WhatsApp-Anfrage-ID eingeben",
      checkBtn:"Status prüfen",
      waiting:"Vielen Dank. Ihre Anfrage ist eingegangen. Bitte warten Sie, während Sofia die Zahlung prüft und den Zugriff genehmigt.",
      pending:"Ihre Anfrage wartet noch auf die Genehmigung.",
      open:"MEINEN PRIVATEN ORDNER ÖFFNEN",
      approved:"Ihr Zugriff wurde genehmigt.",
      notFound:"Für diese Angaben wurde kein genehmigter Zugriff gefunden.",
      waPrivate:"Ihr WhatsApp-Kontakt bleibt verborgen, bis Ihre Zahlung genehmigt wurde.",
      waReady:"Ihr WhatsApp-Premium-Zugriff wurde genehmigt.",
      setup:"Die Zahlungseinrichtung ist noch nicht abgeschlossen. Bitte versuchen Sie es später erneut.",
      sending:"Ihre Anfrage wird gesendet…",
      requestId:"Anfrage-ID",
      accessHint:"Öffnen Sie den Ordner mit demselben Google-Konto und derselben Gmail-Adresse, die Sie angegeben haben.",
      invalid:"Füllen Sie alle Pflichtfelder aus und wählen Sie einen JPG-, PNG- oder WEBP-Screenshot bis 6 MB.",
      locked:"INHALT GESPERRT",
      clickPay:"KLICKEN, UM MIT PAYPAL ZU BEZAHLEN",
      sameEmail:"Dieselbe Gmail-Adresse, die für die Zahlung verwendet wurde",
      timeout:"Zeitüberschreitung der Anfrage. Bitte versuchen Sie es erneut.",
      connectError:"Verbindung zum Website-Dienst fehlgeschlagen. Bitte versuchen Sie es erneut.",
      folderUnavailable:"Ordnerdetails sind derzeit nicht verfügbar.",
      collectionError:"Die Sammlung konnte nicht geladen werden. Aktualisieren Sie die Seite und versuchen Sie es erneut.",
      screenshotReadError:"Der Zahlungsscreenshot konnte nicht gelesen werden.",
      submitError:"Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
      collectionItem:"Sammlungselement",
      lockedAlt:"Gesperrte Vorschau"
    },

    hi: {
      back:"← होम पेज पर वापस जाएँ",
      oneTime:"एक बार का भुगतान",
      pay:"PAYPAL से भुगतान करें",
      payNote:"PayPal के माध्यम से भुगतान करें। फिर ट्रांज़ैक्शन ID और भुगतान का स्क्रीनशॉट भेजें। Sofia द्वारा भुगतान सत्यापित करने के बाद ही पहुँच दी जाएगी।",
      items:"कलेक्शन",
      itemsIntro:"एडमिन पैनल से अपलोड किए गए प्रीव्यू यहाँ दिखाई देंगे। पूरी सामग्री मंज़ूरी मिलने तक निजी रहेगी।",
      empty:"अभी कोई आइटम अपलोड नहीं किया गया है।",
      payment:"भुगतान की पुष्टि का अनुरोध",
      paymentIntro:"PayPal भुगतान पूरा करने के बाद अपनी जानकारी भरें और अनुरोध भेजें।",
      name:"आपका नाम",
      email:"Gmail / ईमेल",
      txn:"PayPal ट्रांज़ैक्शन ID",
      shot:"भुगतान का स्क्रीनशॉट",
      phone:"आपका WhatsApp नंबर (वैकल्पिक)",
      submit:"भुगतान की जानकारी भेजें",
      submitNote:"मंज़ूरी से पहले Sofia PayPal में ट्रांज़ैक्शन सत्यापित करेंगी।",
      check:"मेरी पहुँच जाँचें",
      checkIntro:"वही Gmail पता इस्तेमाल करें जो आपने भुगतान अनुरोध में दिया था।",
      checkEmail:"अपना Gmail / ईमेल दर्ज करें",
      checkId:"अपना WhatsApp अनुरोध ID दर्ज करें",
      checkBtn:"स्थिति जाँचें",
      waiting:"धन्यवाद। आपका अनुरोध प्राप्त हो गया है। Sofia द्वारा भुगतान सत्यापित करके पहुँच मंज़ूर करने तक प्रतीक्षा करें।",
      pending:"आपका अनुरोध अभी मंज़ूरी की प्रतीक्षा में है।",
      open:"मेरा निजी फ़ोल्डर खोलें",
      approved:"आपकी पहुँच मंज़ूर हो गई है।",
      notFound:"इन विवरणों के लिए कोई मंज़ूर पहुँच नहीं मिली।",
      waPrivate:"भुगतान मंज़ूर होने तक आपका WhatsApp संपर्क छिपा रहेगा।",
      waReady:"आपकी WhatsApp Premium पहुँच मंज़ूर हो गई है।",
      setup:"भुगतान सेटअप अभी पूरा नहीं हुआ है। कृपया बाद में फिर कोशिश करें।",
      sending:"आपका अनुरोध भेजा जा रहा है…",
      requestId:"अनुरोध ID",
      accessHint:"उसी Google खाते से फ़ोल्डर खोलें जिसका Gmail आपने दिया था।",
      invalid:"सभी ज़रूरी फ़ील्ड भरें और 6 MB तक का JPG, PNG या WEBP स्क्रीनशॉट चुनें।",
      locked:"लॉक की गई सामग्री",
      clickPay:"PAYPAL से भुगतान करने के लिए क्लिक करें",
      sameEmail:"भुगतान के लिए इस्तेमाल किया गया वही Gmail",
      timeout:"अनुरोध का समय समाप्त हो गया। कृपया फिर कोशिश करें।",
      connectError:"वेबसाइट सेवा से कनेक्ट नहीं हो सका। कृपया फिर कोशिश करें।",
      folderUnavailable:"फ़ोल्डर का विवरण अभी उपलब्ध नहीं है।",
      collectionError:"कलेक्शन लोड नहीं हो सका। पेज रीफ़्रेश करके फिर कोशिश करें।",
      screenshotReadError:"भुगतान का स्क्रीनशॉट पढ़ा नहीं जा सका।",
      submitError:"आपका अनुरोध भेजा नहीं जा सका। कृपया फिर कोशिश करें।",
      collectionItem:"कलेक्शन आइटम",
      lockedAlt:"लॉक किया गया प्रीव्यू"
    },

    zh: {
      back:"← 返回首页",
      oneTime:"一次性付款",
      pay:"使用 PAYPAL 付款",
      payNote:"请通过 PayPal 付款，然后提交交易编号和付款截图。只有 Sofia 核实付款后才会开通访问权限。",
      items:"内容集合",
      itemsIntro:"管理员通过管理面板上传的预览会显示在这里。完整内容在获批前保持私密。",
      empty:"尚未上传任何内容。",
      payment:"付款确认申请",
      paymentIntro:"完成 PayPal 付款后，请填写以下信息并提交申请。",
      name:"您的姓名",
      email:"Gmail / 电子邮箱",
      txn:"PayPal 交易编号",
      shot:"付款截图",
      phone:"您的 WhatsApp 号码（可选）",
      submit:"提交付款信息",
      submitNote:"Sofia 会先在 PayPal 核实交易，然后再批准。",
      check:"检查我的访问权限",
      checkIntro:"请使用您在付款申请中填写的同一个 Gmail 地址。",
      checkEmail:"输入您的 Gmail / 电子邮箱",
      checkId:"输入您的 WhatsApp 申请编号",
      checkBtn:"检查状态",
      waiting:"谢谢，已收到您的申请。请等待 Sofia 核实付款并批准访问权限。",
      pending:"您的申请仍在等待批准。",
      open:"打开我的私人文件夹",
      approved:"您的访问权限已获批准。",
      notFound:"未找到与这些信息对应的已批准访问权限。",
      waPrivate:"付款获批前，您的 WhatsApp 联系方式将保持隐藏。",
      waReady:"您的 WhatsApp Premium 访问权限已获批准。",
      setup:"付款设置尚未完成，请稍后再试。",
      sending:"正在提交申请…",
      requestId:"申请编号",
      accessHint:"请使用您提交申请时填写的同一个 Google 账户和 Gmail 地址打开文件夹。",
      invalid:"请填写所有必填项，并选择不超过 6 MB 的 JPG、PNG 或 WEBP 截图。",
      locked:"内容已锁定",
      clickPay:"点击使用 PAYPAL 付款",
      sameEmail:"付款时使用的同一个 Gmail 地址",
      timeout:"请求超时，请重试。",
      connectError:"无法连接网站服务，请重试。",
      folderUnavailable:"目前无法获取文件夹信息。",
      collectionError:"无法加载内容集合。请刷新页面后重试。",
      screenshotReadError:"无法读取付款截图。",
      submitError:"无法提交您的申请，请重试。",
      collectionItem:"集合项目",
      lockedAlt:"已锁定的预览"
    }
  };

  const longPackageCopy = {
    en: {
      tag:"EXCLUSIVE LONG PACKAGE",
      title:"I Want to Meet Sofia Jenny Taborda",
      description:"Discover the exclusive Long Package collection. Explore available package details and submit your payment request for private access.",
      action:"VIEW LONG PACKAGE DETAILS",
      footer:"© 2026 Sofia Jenny Taborda · Official Website"
    },
    ur: {
      tag:"خصوصی لانگ پیکیج",
      title:"صوفیہ جینی تابورڈا سے ملاقات",
      description:"خصوصی لانگ پیکیج کلیکشن دیکھیں۔ دستیاب پیکیج کی تفصیلات ملاحظہ کریں اور نجی رسائی کے لیے ادائیگی کی درخواست جمع کروائیں۔",
      action:"لانگ پیکیج کی تفصیلات دیکھیں",
      footer:"© 2026 صوفیہ جینی تابورڈا · آفیشل ویب سائٹ"
    },
    es: {
      tag:"PAQUETE EXCLUSIVO DE LARGA DURACIÓN",
      title:"Quiero conocer a Sofia Jenny Taborda",
      description:"Descubre la colección exclusiva de paquetes de larga duración. Consulta los paquetes disponibles y envía tu solicitud de pago para obtener acceso privado.",
      action:"VER LOS DETALLES DEL PAQUETE",
      footer:"© 2026 Sofia Jenny Taborda · Sitio web oficial"
    },
    it: {
      tag:"PACCHETTO ESCLUSIVO A LUNGO TERMINE",
      title:"Voglio incontrare Sofia Jenny Taborda",
      description:"Scopri la collezione esclusiva di pacchetti a lungo termine. Consulta i pacchetti disponibili e invia la richiesta di pagamento per ottenere l'accesso privato.",
      action:"VEDI I DETTAGLI DEL PACCHETTO",
      footer:"© 2026 Sofia Jenny Taborda · Sito ufficiale"
    },
    fr: {
      tag:"FORFAIT EXCLUSIF LONGUE DURÉE",
      title:"Je veux rencontrer Sofia Jenny Taborda",
      description:"Découvrez la collection exclusive de forfaits longue durée. Consultez les forfaits disponibles et envoyez votre demande de paiement pour obtenir un accès privé.",
      action:"VOIR LES DÉTAILS DU FORFAIT",
      footer:"© 2026 Sofia Jenny Taborda · Site officiel"
    },
    ar: {
      tag:"الباقة الحصرية طويلة الأجل",
      title:"أرغب في لقاء صوفيا جيني تابوردا",
      description:"اكتشف مجموعة الباقات الحصرية طويلة الأجل. اطّلع على تفاصيل الباقات المتاحة وأرسل طلب الدفع للحصول على وصول خاص.",
      action:"عرض تفاصيل الباقة طويلة الأجل",
      footer:"© 2026 صوفيا جيني تابوردا · الموقع الرسمي"
    },
    pt: {
      tag:"PACOTE EXCLUSIVO DE LONGA DURAÇÃO",
      title:"Quero conhecer Sofia Jenny Taborda",
      description:"Conheça a coleção exclusiva de pacotes de longa duração. Consulte os pacotes disponíveis e envie sua solicitação de pagamento para obter acesso privado.",
      action:"VER DETALHES DO PACOTE",
      footer:"© 2026 Sofia Jenny Taborda · Site oficial"
    },
    de: {
      tag:"EXKLUSIVES LANGZEITPAKET",
      title:"Ich möchte Sofia Jenny Taborda treffen",
      description:"Entdecken Sie die exklusive Langzeitpaket-Kollektion. Sehen Sie sich die verfügbaren Pakete an und senden Sie Ihre Zahlungsanfrage für privaten Zugriff.",
      action:"DETAILS ZUM LANGZEITPAKET ANSEHEN",
      footer:"© 2026 Sofia Jenny Taborda · Offizielle Website"
    },
    hi: {
      tag:"विशेष लॉन्ग पैकेज",
      title:"मैं Sofia Jenny Taborda से मिलना चाहता/चाहती हूँ",
      description:"विशेष लॉन्ग पैकेज कलेक्शन देखें। उपलब्ध पैकेज की जानकारी प्राप्त करें और निजी पहुँच के लिए भुगतान अनुरोध भेजें।",
      action:"लॉन्ग पैकेज की जानकारी देखें",
      footer:"© 2026 Sofia Jenny Taborda · आधिकारिक वेबसाइट"
    },
    zh: {
      tag:"独家长期套餐",
      title:"我想与 Sofia Jenny Taborda 见面",
      description:"探索独家长期套餐系列。查看可用套餐详情，并提交付款申请以获得私人访问权限。",
      action:"查看长期套餐详情",
      footer:"© 2026 Sofia Jenny Taborda · 官方网站"
    }
  };

  const otherFolderCopy = {
    "Photo Gallery": {
      en:{tag:"EXCLUSIVE PHOTO COLLECTION",title:"Sofia Jenny Taborda Photos",description:"Explore the photo collection. Preview the available images and submit your payment request for private access to the full collection.",action:"VIEW PHOTO COLLECTION"},
      ur:{tag:"خصوصی تصویری کلیکشن",title:"صوفیہ جینی تابورڈا کی تصاویر",description:"تصاویر کی کلیکشن دیکھیں۔ دستیاب تصاویر کا پیش نظارہ کریں اور مکمل کلیکشن تک نجی رسائی کے لیے ادائیگی کی درخواست جمع کروائیں۔",action:"تصاویر کی کلیکشن دیکھیں"},
      es:{tag:"COLECCIÓN EXCLUSIVA DE FOTOS",title:"Fotos de Sofia Jenny Taborda",description:"Explora la colección de fotos. Mira las imágenes disponibles y envía tu solicitud de pago para acceder de forma privada a la colección completa.",action:"VER LA GALERÍA DE FOTOS"},
      it:{tag:"COLLEZIONE FOTOGRAFICA ESCLUSIVA",title:"Foto di Sofia Jenny Taborda",description:"Esplora la raccolta fotografica. Visualizza le immagini disponibili e invia la richiesta di pagamento per accedere in privato alla collezione completa.",action:"VEDI LA GALLERIA FOTOGRAFICA"},
      fr:{tag:"COLLECTION PHOTO EXCLUSIVE",title:"Photos de Sofia Jenny Taborda",description:"Découvrez la collection de photos. Consultez les images disponibles et envoyez votre demande de paiement pour accéder en privé à la collection complète.",action:"VOIR LA GALERIE PHOTO"},
      ar:{tag:"مجموعة الصور الحصرية",title:"صور صوفيا جيني تابوردا",description:"استكشف مجموعة الصور. شاهد الصور المتاحة وأرسل طلب الدفع للحصول على وصول خاص إلى المجموعة الكاملة.",action:"عرض مجموعة الصور"},
      pt:{tag:"COLEÇÃO EXCLUSIVA DE FOTOS",title:"Fotos de Sofia Jenny Taborda",description:"Explore a coleção de fotos. Veja as imagens disponíveis e envie sua solicitação de pagamento para ter acesso privado à coleção completa.",action:"VER A GALERIA DE FOTOS"},
      de:{tag:"EXKLUSIVE FOTOSAMMLUNG",title:"Fotos von Sofia Jenny Taborda",description:"Entdecken Sie die Fotosammlung. Sehen Sie sich die verfügbaren Bilder an und senden Sie Ihre Zahlungsanfrage für privaten Zugriff auf die gesamte Sammlung.",action:"FOTOSAMMLUNG ANSEHEN"},
      hi:{tag:"विशेष फोटो कलेक्शन",title:"Sofia Jenny Taborda की तस्वीरें",description:"फोटो कलेक्शन देखें। उपलब्ध तस्वीरों का प्रीव्यू करें और पूरी कलेक्शन की निजी पहुँच के लिए भुगतान अनुरोध भेजें।",action:"फोटो कलेक्शन देखें"},
      zh:{tag:"独家照片合集",title:"Sofia Jenny Taborda 的照片",description:"浏览照片合集，预览可用图片，并提交付款申请以获得完整照片合集的私人访问权限。",action:"查看照片合集"}
    },

    "Gifts & Services": {
      en:{tag:"GIFTS & PERSONALIZED SERVICES",title:"Send a Gift to Sofia Jenny Taborda 🎁",description:"Explore the available gift options and personalized services. Choose an option, complete the PayPal payment, and submit your payment details for verification.",action:"VIEW GIFT OPTIONS"},
      ur:{tag:"تحائف اور خصوصی خدمات",title:"صوفیہ جینی تابورڈا کو تحفہ بھیجیں 🎁",description:"دستیاب تحائف اور ذاتی خدمات دیکھیں۔ اپنی پسند کا آپشن منتخب کریں، پے پال سے ادائیگی کریں اور تصدیق کے لیے ادائیگی کی تفصیلات جمع کروائیں۔",action:"تحائف کے آپشن دیکھیں"},
      es:{tag:"REGALOS Y SERVICIOS PERSONALIZADOS",title:"Envía un regalo a Sofia Jenny Taborda 🎁",description:"Explora las opciones de regalos y los servicios personalizados disponibles. Elige una opción, paga con PayPal y envía los datos del pago para su verificación.",action:"VER OPCIONES DE REGALO"},
      it:{tag:"REGALI E SERVIZI PERSONALIZZATI",title:"Invia un regalo a Sofia Jenny Taborda 🎁",description:"Scopri le opzioni regalo e i servizi personalizzati disponibili. Scegli un'opzione, paga con PayPal e invia i dati del pagamento per la verifica.",action:"VEDI LE OPZIONI REGALO"},
      fr:{tag:"CADEAUX ET SERVICES PERSONNALISÉS",title:"Envoyer un cadeau à Sofia Jenny Taborda 🎁",description:"Découvrez les cadeaux disponibles et les services personnalisés. Choisissez une option, payez avec PayPal et envoyez les informations de paiement pour vérification.",action:"VOIR LES OPTIONS DE CADEAU"},
      ar:{tag:"الهدايا والخدمات الشخصية",title:"أرسل هدية إلى صوفيا جيني تابوردا 🎁",description:"اكتشف خيارات الهدايا والخدمات الشخصية المتاحة. اختر ما يناسبك، وأكمل الدفع عبر باي بال، ثم أرسل بيانات الدفع للتحقق.",action:"عرض خيارات الهدايا"},
      pt:{tag:"PRESENTES E SERVIÇOS PERSONALIZADOS",title:"Envie um presente para Sofia Jenny Taborda 🎁",description:"Explore as opções de presentes e os serviços personalizados disponíveis. Escolha uma opção, pague pelo PayPal e envie os dados de pagamento para verificação.",action:"VER OPÇÕES DE PRESENTES"},
      de:{tag:"GESCHENKE UND PERSONALISIERTE SERVICES",title:"Senden Sie Sofia Jenny Taborda ein Geschenk 🎁",description:"Entdecken Sie verfügbare Geschenkoptionen und persönliche Services. Wählen Sie eine Option, bezahlen Sie mit PayPal und senden Sie Ihre Zahlungsdaten zur Prüfung.",action:"GESCHENKOPTIONEN ANSEHEN"},
      hi:{tag:"उपहार और व्यक्तिगत सेवाएँ",title:"Sofia Jenny Taborda को उपहार भेजें 🎁",description:"उपलब्ध उपहार विकल्प और व्यक्तिगत सेवाएँ देखें। एक विकल्प चुनें, PayPal से भुगतान करें और सत्यापन के लिए भुगतान की जानकारी भेजें।",action:"उपहार विकल्प देखें"},
      zh:{tag:"礼品与个性化服务",title:"向 Sofia Jenny Taborda 赠送礼物 🎁",description:"浏览可选礼品和个性化服务。选择一个选项，通过 PayPal 付款，并提交付款信息以供核实。",action:"查看礼品选项"}
    },

    "WhatsApp Premium": {
      en:{tag:"PRIVATE WHATSAPP PREMIUM",title:"Sofia Jenny Taborda Personal WhatsApp",description:"Review the WhatsApp Premium subscription details. Submit your payment information and wait for Sofia to verify and approve your private access.",action:"VIEW WHATSAPP PREMIUM DETAILS"},
      ur:{tag:"نجی واٹس ایپ پریمیم",title:"صوفیہ جینی تابورڈا کا ذاتی واٹس ایپ",description:"واٹس ایپ پریمیم سبسکرپشن کی تفصیلات دیکھیں۔ ادائیگی کی معلومات جمع کروائیں اور نجی رسائی کی منظوری کے لیے صوفیہ کی تصدیق کا انتظار کریں۔",action:"واٹس ایپ پریمیم کی تفصیلات دیکھیں"},
      es:{tag:"WHATSAPP PREMIUM PRIVADO",title:"WhatsApp personal de Sofia Jenny Taborda",description:"Consulta los detalles de la suscripción WhatsApp Premium. Envía la información de pago y espera a que Sofia verifique y apruebe tu acceso privado.",action:"VER DETALLES DE WHATSAPP PREMIUM"},
      it:{tag:"WHATSAPP PREMIUM PRIVATO",title:"WhatsApp personale di Sofia Jenny Taborda",description:"Consulta i dettagli dell'abbonamento WhatsApp Premium. Invia i dati di pagamento e attendi che Sofia verifichi e approvi il tuo accesso privato.",action:"VEDI I DETTAGLI DI WHATSAPP PREMIUM"},
      fr:{tag:"WHATSAPP PREMIUM PRIVÉ",title:"WhatsApp personnel de Sofia Jenny Taborda",description:"Consultez les détails de l'abonnement WhatsApp Premium. Envoyez vos informations de paiement et attendez que Sofia vérifie et approuve votre accès privé.",action:"VOIR LES DÉTAILS WHATSAPP PREMIUM"},
      ar:{tag:"واتساب بريميوم الخاص",title:"واتساب صوفيا جيني تابوردا الشخصي",description:"راجع تفاصيل اشتراك واتساب بريميوم. أرسل معلومات الدفع وانتظر حتى تتحقق صوفيا من الدفع وتوافق على وصولك الخاص.",action:"عرض تفاصيل واتساب بريميوم"},
      pt:{tag:"WHATSAPP PREMIUM PRIVADO",title:"WhatsApp pessoal de Sofia Jenny Taborda",description:"Consulte os detalhes da assinatura WhatsApp Premium. Envie as informações de pagamento e aguarde Sofia verificar e aprovar seu acesso privado.",action:"VER DETALHES DO WHATSAPP PREMIUM"},
      de:{tag:"PRIVATES WHATSAPP PREMIUM",title:"Persönliches WhatsApp von Sofia Jenny Taborda",description:"Lesen Sie die Details des WhatsApp-Premium-Abonnements. Senden Sie Ihre Zahlungsdaten und warten Sie, bis Sofia Ihre private Freigabe überprüft und genehmigt.",action:"WHATSAPP-PREMIUM-DETAILS ANSEHEN"},
      hi:{tag:"निजी WhatsApp Premium",title:"Sofia Jenny Taborda का निजी WhatsApp",description:"WhatsApp Premium सदस्यता की जानकारी देखें। भुगतान की जानकारी भेजें और निजी पहुँच की पुष्टि तथा मंज़ूरी के लिए Sofia की प्रतीक्षा करें।",action:"WHATSAPP PREMIUM की जानकारी देखें"},
      zh:{tag:"私人 WhatsApp Premium",title:"Sofia Jenny Taborda 的个人 WhatsApp",description:"查看 WhatsApp Premium 订阅详情。提交付款信息，并等待 Sofia 核实付款及批准您的私人访问权限。",action:"查看 WHATSAPP PREMIUM 详情"}
    }
  };

  const tr = key => {
    const lang = $("languageSelect")?.value || "en";
    return (words[lang] && words[lang][key]) || words.en[key] || key;
  };

  function setupLanguageSelector() {
    const select = $("languageSelect");
    if (!select) return;

    const previous = select.value;
    select.innerHTML = "";

    Object.entries(languageNames).forEach(([code, label]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = label;
      select.appendChild(option);
    });

    let saved = "";
    try {
      saved = localStorage.getItem("sofia-language") || "";
    } catch (e) {}

    const initial = words[saved] ? saved : (words[previous] ? previous : "en");
    select.value = initial;
  }


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
    const select = $("languageSelect");
    const lang = words[select.value] ? select.value : "en";

    document.documentElement.lang = lang;
    document.documentElement.dir = ["ur", "ar"].includes(lang) ? "rtl" : "ltr";

    try {
      localStorage.setItem("sofia-language", lang);
    } catch (e) {}

    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = tr(el.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.placeholder = tr(el.dataset.i18nPlaceholder);
    });

    const accessEmail = $("accessEmail");
    if (accessEmail) accessEmail.placeholder = tr("sameEmail");

    document.querySelectorAll(".locked-card").forEach(card => {
      const lockText = card.querySelector(".lock-text");
      const lockAction = card.querySelector(".lock-action");

      if (lockText) lockText.textContent = tr("locked");
      if (lockAction) lockAction.textContent = tr("clickPay");

      const title = card.dataset.itemTitle || "";
      card.setAttribute("aria-label", title + ". " + tr("clickPay"));
    });

    const previewEmpty = $("previewEmpty");

    if (previewEmpty && previewEmpty.dataset.messageKey) {
      previewEmpty.textContent = tr(previewEmpty.dataset.messageKey);
    }

    // Long Package page translation
    const copy = category === "Long Package System"
      ? longPackageCopy[lang]
      : (otherFolderCopy[category] && otherFolderCopy[category][lang]);

    if (copy) {
      const hero = document.querySelector(".hero");

      if (hero) {
        const tag = hero.querySelector(".eyebrow");
        const title = hero.querySelector("h1");
        const description = hero.querySelector(".hero-copy > p");
        const action = hero.querySelector(".hero-image-cta");
        const image = hero.querySelector(".hero-image img");

        if (tag) tag.textContent = copy.tag;
        if (title) title.textContent = copy.title;
        if (description) description.textContent = copy.description;
        if (action) action.textContent = copy.action;
        if (image) image.alt = copy.title;
      }

      const footer = document.querySelector("footer");
      if (footer && copy.footer) footer.textContent = copy.footer;
    }
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
        reject(new Error(tr("timeout")));
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
        reject(new Error(tr("connectError")));
      };

      s.src = API_URL + "?" + qs;
      document.head.appendChild(s);
    });
  }


  function status(el, msg, kind = "info") {
    el.textContent = msg;
    el.className = "status show " + kind;
  }


  async function loadInfo() {
    try {
      const d = await jsonp("folderInfo", {category});

      if (!d || !d.success) {
        throw new Error(d?.message || tr("folderUnavailable"));
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


  function createLockedCard(item) {
    const card = document.createElement("a");

    card.className = "preview-card locked-card";
    card.href = paypalUrl || "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const title = item.title || tr("collectionItem");
    card.dataset.itemTitle = title;

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

    const media = document.createElement("div");
    media.className = "preview-media";

    if (item.thumbnailUrl) {
      const img = document.createElement("img");

      img.src = item.thumbnailUrl;
      img.alt = tr("lockedAlt");
      img.loading = "lazy";

      media.appendChild(img);

    } else {
      media.style.height = "190px";
      media.style.display = "grid";
      media.style.placeItems = "center";
      media.style.color = "#fff";
      media.textContent = "🔒";
    }

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

    const h = document.createElement("h3");
    h.textContent = title;
    card.appendChild(h);

    if (item.description) {
      const p = document.createElement("p");
      p.textContent = item.description;
      card.appendChild(p);
    }

    return card;
  }


  async function loadItems() {
    if (isWhatsApp) return;

    try {
      const d = await jsonp("folderContents", {category});

      if (!d || d.success === false) {
        throw new Error(tr("collectionError"));
      }

      const items = Array.isArray(d.items) ? d.items : [];
      const grid = $("previewGrid");

      grid.innerHTML = "";
      previewLinks.clear();

      if (!items.length) {
        $("previewEmpty").classList.remove("hidden");
        $("previewEmpty").dataset.messageKey = "empty";
        $("previewEmpty").textContent = tr("empty");
        return;
      }

      $("previewEmpty").classList.add("hidden");
      delete $("previewEmpty").dataset.messageKey;

      items.forEach(item => {
        const card = createLockedCard(item);
        grid.appendChild(card);
      });

    } catch(e) {
      $("previewEmpty").classList.remove("hidden");
      $("previewEmpty").dataset.messageKey = "collectionError";
      $("previewEmpty").textContent =
        e.message || tr("collectionError");
    }
  }


  function readFile(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();

      r.onload = () => resolve(String(r.result || ""));

      r.onerror = () => reject(
        new Error(tr("screenshotReadError"))
      );

      r.readAsDataURL(file);
    });
  }


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
          d.message || tr("submitError"),
          "error"
        );
      }
    });
  }


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

  setupLanguageSelector();

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
