(function() {
  /* ── Early image-swap guard ──────────────────────────────────────────
   * Framer hydration replaces the SSR image with its original CDN URL.
   * This observer fires *before* a paint, swapping it back instantly
   * so the user never sees the old image flash.
   */
  (function earlyImageGuard() {
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf("/personal-training") === -1 && path.indexOf("/teacher-training") === -1) return;

    var LOCAL_PT_SRC = "/assets/personal-training-program.jpg";
    var LOCAL_TT_SRC = "/assets/teacher-training-program.mp4";
    var isPT = path.indexOf("/personal-training") !== -1;

    var observer = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === "attributes" && m.attributeName === "src" && m.target.tagName === "IMG") {
          if (isPT && m.target.src.indexOf("framerusercontent") !== -1 && m.target.closest(".framer-5j3lq1")) {
            m.target.src = LOCAL_PT_SRC;
            m.target.removeAttribute("srcset");
          }
        }
        if (m.type === "childList") {
          var imgs = [];
          for (var j = 0; j < m.addedNodes.length; j++) {
            var node = m.addedNodes[j];
            if (node.nodeType === 1) {
              if (node.tagName === "IMG") imgs.push(node);
              else if (node.querySelectorAll) {
                var found = node.querySelectorAll("img");
                for (var k = 0; k < found.length; k++) imgs.push(found[k]);
              }
            }
          }
          for (var n = 0; n < imgs.length; n++) {
            if (isPT && imgs[n].src.indexOf("framerusercontent") !== -1 && imgs[n].closest(".framer-5j3lq1")) {
              imgs[n].src = LOCAL_PT_SRC;
              imgs[n].removeAttribute("srcset");
            }
          }
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });

    // Auto-disconnect after 10 seconds (hydration is long done by then)
    setTimeout(function() { observer.disconnect(); }, 10000);
  })();

  /* ── Language state ── */
  var EYC_LANG_KEY = "eyc-lang";
  var eycLang = (function() {
    try {
      var stored = localStorage.getItem(EYC_LANG_KEY);
      if (stored === "en" || stored === "nl") return stored;
    } catch(e) {}
    return "en";
  })();

  const map = new Map([["At Empower Your Core, we never force your body into unnatural positions. Instead, we use precise technique and form to help your body move better, prevent injury, and build strength in the most natural way possible. We use techniques grounded in biomechanics and the latest insights from anatomy and neuroscience. Each exercise is carefully selected to support your body, meaning the technique always serves your needs\u2014never the other way around.", "Bij Empower Your Core dwingen we het lichaam nooit in onnatuurlijke posities. In plaats daarvan werken we met precisie, techniek en vorm om je lichaam beter te laten bewegen, blessures te voorkomen en kracht op te bouwen op de meest natuurlijke manier mogelijk. We gebruiken technieken die geworteld zijn in biomechanica en anatomie. Elke oefening wordt zorgvuldig gekozen om jouw lichaam te ondersteunen - de techniek dient altijd jouw behoeften, nooit andersom."], ["After losing motivation for her traditional gym routine, often turning her car around halfway there, our client knew she needed a different approach. She was looking for a form of exercise that was not just a chore to be completed, but an engaging practice she would look forward to. The challenge was to overcome this fitness burnout and introduce her to a method that was both physically effective and mentally stimulating.", "Nadat ze haar motivatie voor de traditionele sportschool volledig was kwijtgeraakt \u2013 ze draaide soms halverwege de rit haar auto alweer om \u2013 wist onze cli\u00ebnte dat ze een andere aanpak nodig had. Ze zocht een vorm van beweging die niet aanvoelde als de zoveelste verplichting, maar als iets waar ze echt naar uitkeek. De uitdaging was om deze 'sport-burnout' te doorbreken en haar kennis te laten maken met een methode die zowel fysiek effectief als mentaal stimulerend was."], ["The transformation has been remarkable. What began as a trial has blossomed into a consistent, can't-miss weekly appointment. Our client has not only found a sustainable fitness routine but has also discovered a deep appreciation for the intelligence of the Pilates method. She has learned to listen to her body and trusts that any issue she feels can be addressed and resolved within her session.", "De transformatie is bewonderenswaardig. Wat begon als een proefles, is uitgegroeid tot een vaste wekelijkse afspraak die ze voor geen goud wil missen. Ze heeft niet alleen een duurzame routine gevonden, maar heeft ook een diepe waardering gekregen voor de intelligentie achter de methode. Ze heeft geleerd naar haar lichaam te luisteren en vertrouwt erop dat elk ongemak tijdens de sessie kan worden aangepakt."], ["From the very first trial session, our focus was on building a personal connection and demonstrating the depth of the Pilates method. The client was immediately \"fascinated\" by the instructor's intense focus and the time he took to understand her personal history and interests. This created a foundation of trust and engagement that a conventional gym couldn't offer.", "Vanaf de allereerste proefles lag onze focus op het leggen van een persoonlijke connectie en het tonen van de diepgang van de Empower Your Core methode. De cli\u00ebnte was direct gegrepen door de intense focus en de tijd die werd genomen om haar achtergrond en interesses te begrijpen. Dit legde een fundament van vertrouwen en betrokkenheid dat een reguliere sportschool simpelweg niet kan bieden."], ["The transformation has been a complete game-changer. The frequent, debilitating episodes of pain have vanished. Where he once needed a chiropractor several times a year, he has only needed a single visit in the last two years. Today, Harry is stronger, more flexible, and can lift more without restriction, all while enjoying the game he is passionate about.", "De transformatie is een totale game-changer geweest. De frequente, slopende periodes van pijn behoren tot het verleden. Waar Harry vroeger meerdere keren per jaar naar de chiropractor moest, is hij de afgelopen twee jaar nog maar \u00e9\u00e9n keer geweest. Vandaag de dag is hij sterker, flexibeler en kan hij weer ongehinderd tillen en sporten."], ["Two years ago, a friend recommended Pilates as a long-term solution. Our approach was to move beyond temporary fixes and address the root cause of his issues. We developed a personalised program focused on systematically improving his posture and building the foundational core strength necessary to support the rotational demands of a golf swing.", "Twee jaar geleden besloot Harry, op aanraden van een vriend, Pilates te proberen als oplossing voor de lange termijn. Onze aanpak was gericht op het doorbreken van de symptoombestrijding en het aanpakken van de werkelijke oorzaak. We ontwikkelden een persoonlijk programma dat zich richtte op:\n\u2022 Posturale correctie: Het systematisch verbeteren van zijn houding.\n\u2022 Functionele Core Stability: Het opbouwen van de noodzakelijke stabiliteit om de explosieve draaibewegingen van zijn golfswing veilig op te vangen."], ["As an avid golfer, Harry was trapped in a frustrating cycle. Severe back problems would flare up four to five times a year, forcing him to see a chiropractor just to get moving again. The constant pain and lack of mobility were not only affecting his daily life but were also keeping him from the sport he loved.", "Als fanatiek golfer zat Harry gevangen in een frustrerende cirkel. Vier tot vijf keer per jaar schoot het zo ernstig in zijn rug dat hij alleen met intensieve hulp van de chiropractor weer in beweging kon komen. Deze constante dreiging van pijn en het gebrek aan mobiliteit be\u00efnvloedden niet alleen zijn dagelijks leven, maar hielden hem ook weg van de golfbaan \u2014 de plek waar zijn passie ligt."], ["The strength of the Empower Your Core method lies in its customisation. We tailor every training session to your unique physical goals and capabilities. This personalised approach helps you achieve quicker, more sustainable results while staying safe and injury-free.", "De kracht van de Empower Your Core methode ligt in maatwerk. Elke trainingssessie wordt afgestemd op jouw unieke doelen en fysieke mogelijkheden. Deze persoonlijke benadering zorgt voor snellere, duurzamere resultaten, terwijl je veilig en blessurevrij blijft bewegen."], ["Empower Your Core is an innovative movement method aimed at strengthening the core, improving mobility, and enhancing body awareness. Our unique approach is built on a simple, powerful principle: supporting the natural movement patterns of your body.", "Empower Your Core is een vernieuwende bewegingsmethode die gericht is op het versterken van de core, het vergroten van mobiliteit en het ontwikkelen van lichaamsbewustzijn. Onze unieke aanpak is gebaseerd op een eenvoudig maar krachtig principe: het ondersteunen van de natuurlijke bewegingspatronen van jouw lichaam."], ["Whether you have specific goals, are recovering from an injury, or simply prefer individual attention, we ensure each session meets your unique circumstances. Discover the benefits of personal training and experience how quickly you achieve results.", "Of je nu specifieke doelen hebt, herstelt van een blessure, of simpelweg de voorkeur geeft aan individuele begeleiding - wij zorgen ervoor dat elke sessie aansluit bij jouw unieke situatie. Ontdek de voordelen van persoonlijke training en ervaar hoe snel je resultaat kunt behalen."], ["Our ongoing approach is rooted in this intuitive and precise guidance. We address physical issues in real-time, providing targeted exercises that resolve blockages on the spot, turning each session into a productive and enlightening experience.", "Onze doorlopende begeleiding is geworteld in intu\u00eftie en precisie. We pakken fysieke klachten direct aan en bieden gerichte oefeningen die blokkades ter plekke verhelpen. Dit maakt van elke sessie een productieve en verhelderende ervaring."], ["At Empower Your Core, we offer personalised guidance tailored specifically to your body, needs, and goals. Our Personal Training is uniquely designed to enhance your strength, mobility, and body awareness in a way that perfectly suits you.", "Bij Empower Your Core bieden we persoonlijke begeleiding die volledig is afgestemd op jouw lichaam, behoeften en doelen. Onze Persoonlijke training is ontworpen om jouw kracht, mobiliteit en lichaamsbewustzijn te verbeteren op een manier die perfect bij jou past."], ["You'll receive one-on-one attention from an expert trainer who will help you perform movements and techniques naturally and safely. Together, we work on strengthening your body, increasing your flexibility, and preventing injuries.", "Je krijgt een-op-een aandacht van een ervaren trainer die je helpt om bewegingen en technieken op een natuurlijke en veilige manier uit te voeren. Samen werken we aan het versterken van je lichaam, het vergroten van je flexibiliteit en het voorkomen van blessures."], ["After losing motivation for her traditional gym routine, she discovered a new passion. See how our personalized, intuitive approach transformed exercise from a chore into a fascinating practice she never wants to miss.", "Nadat ze haar motivatie voor de traditionele sportschool volledig was kwijtgeraakt, ontdekte ze een nieuwe passie. Ontdek hoe onze persoonlijke, intu\u00eftieve aanpak sporten veranderde van een verplichting in een fascinerende training waar ze nooit meer een sessie van wil missen."], ["is not a hype, but a legacy - built on 15 years of experience, reflection and vision. With science-backed strategies, we help you relieve pain, rebuild strength, improve mobility, and move with confidence again.", "is geen trend, maar een methode met blijvende waarde. Gebouwd op 15 jaar expertise en verdieping. Evidence-based strategieen die je helpen pijn te verminderen, kracht op te bouwen, mobiliteit te verbeteren en opnieuw met vertrouwen te bewegen."], ["An avid golfer was sidelined by severe back problems 4-5 times a year. See how our personalized Pilates program eliminated his pain, dramatically reduced his chiropractor visits, and got him back on the course.", "Een fanatieke golfer werd vier tot vijf keer per jaar volledig uitgeschakeld door ernstige rugklachten. Ontdek hoe ons persoonlijke Pilates-programma zijn pijn deed verdwijnen, het aantal bezoeken aan de chiropractor drastisch verminderde en hem weer vol vertrouwen de baan op hielp."], ["Discover the Empower Your Core method. An innovative, science-backed approach that supports your body\u2019s natural movement to build strength, improve mobility, and enhance awareness safely and effectively.", "Ontdek de Empower Your Core methode. Een innovatieve, wetenschappelijk onderbouwde aanpak die de natuurlijke beweging van je lichaam ondersteunt om kracht op te bouwen, mobiliteit te verbeteren en lichaamsbewustzijn op een veilige en effectieve manier te verdiepen."], ["\"Before I started Pilates, I had serious back problems 4-5 times a year... Now that's rarely necessary. My back is stronger, I'm more flexible, and my backaches are pretty much gone.\"", "\"Voordat ik met Pilates begon, had ik 4 \u00e0 5 keer per jaar ernstige rugklachten... Nu is een bezoek aan de chiropractor nog maar zelden nodig. Mijn rug is sterker, ik ben flexibeler en mijn rugpijn is zo goed als weg.\""], ["Become an expert in movement. Our scientifically-grounded teacher training program provides a clear, logical path from foundational principles to confident, real-world application.", "Word een expert in beweging. Ons opleidingsprogramma biedt een helder en logisch traject: van fundamentele principes naar zelfverzekerde, toepasbare vaardigheden in de praktijk."], ["The most powerful result is the shift in mindset: exercise is no longer a chore to be avoided, but a fascinating journey of discovery she is excited to continue.", "Het krachtigste resultaat is de verandering in haar mindset: sporten is niet langer een verplichting, maar een fascinerende ontdekkingsreis."], ["Our method is suitable for everyone looking to move more consciously, powerfully, and flexibly, regardless of your previous experience or current fitness level.", "Onze methode is geschikt voor iedereen die bewuster, krachtiger en flexibeler wil bewegen - ongeacht ervaring of huidig niveau."], ["We begin by looking at your body together. This first session is about seeing how you move, where your strengths lie, and what needs attention", "We beginnen door samen naar jouw lichaam te kijken. Deze eerste sessie draait om zien hoe je beweegt, waar je sterke punten liggen en wat aandacht nodig heeft."], ["\"I was fascinated by him... He asked me about my past and my interests. And from the first class, I came back to him every Monday.\"", "\"Ik was direct door hem geboeid... Hij vroeg naar mijn verleden en mijn interesses. Sinds die eerste les ben ik elke maandag bij hem teruggekomen.\""], ["From there, we design sessions around your body and your progress, blending Pilates precision with functional strength", "Van daaruit ontwerpen we sessies rond jouw lichaam en jouw vooruitgang, waarbij we Pilates-precisie combineren met functionele kracht."], ["We teach you how to move better, not just harder. Breath, posture, and alignment form the foundation of every session", "We leren je beter te bewegen, niet alleen harder. Ademhaling, houding en alignment vormen de basis van elke sessie."], ["At Empower Your Core, we offer clear and flexible pricing options designed to meet your individual needs and goals.", "Bij Empower Your Core bieden we heldere en flexibele prijsopties, afgestemd op jouw persoonlijke behoeften en doelen."], ["\"These testimonials were recorded under our previous name, True and Pure Pilates - now proudly Empower Your Core.\"", "\"Deze getuigenissen zijn opgenomen onder onze vorige naam, True and Pure Pilates \u2013 nu met trots Empower Your Core.\""], ["Let's collaborate on a custom program for your team. Contact us to discuss your organisation's needs", "Samenwerken aan een programma op maat voor jouw team? Neem contact met ons op om de behoeften van jouw organisatie te bespreken."], ["Create a free website with Framer, the website builder loved by startups, designers and agencies.", "Maak een gratis website met Framer, de websitebouwer geliefd bij startups, designers en bureaus."], ["Their stories show what\u2019s possible \u2014 now it\u2019s your turn. Connect with us and join the journey.", "Hun ervaringen tonen wat mogelijk is. Nu is het tijd voor jouw volgende stap. Verbind je met ons en begin de reis."], ["Ready to start your journey? Send us an email to ask a question or book your first session", "Klaar om jouw reis te beginnen? Stuur ons een e-mail om een vraag te stellen of je eerste sessie te boeken."], ["Contact us today and find out what Personal Training at Empower Your Core can do for you!", "Neem vandaag nog contact met ons op en ontdek wat Persoonlijke training bij Empower Your Core voor jou kan betekenen."], ["- Fully equipped, tailored to you - where transformation begins with mindful movement", "- Volledig uitgerust en afgestemd op jou - waar transformatie begint met bewuste beweging"], ["Private, boutique sessions that build precision, alignment, and functional strength.", "Priv\u00e9, boutique sessies die precisie, alignment en functionele kracht opbouwen."], ["The offer is just the start-the real magic happens in the way we work together.", "Het aanbod is pas het startpunt. De echte transformatie gebeurt in onze samenwerking."], ["Transformations begin with the right tools \u2014here's how we can help you.", "Transformatie begint met de juiste middelen - ontdek hoe wij jou kunnen ondersteunen."], ["We've shown you how we work\u2014now listen to those who've experienced it.", "Je hebt gezien hoe wij werken. Nu hoor je van mensen die het zelf hebben meegemaakt."], ["Step into our private Pilates Studio in Dubai Marina", "Stap binnen in onze priv\u00e9 Pilates Studio in Utrecht"], ["Step into your center \u2014 the journey starts today", "Stap in je kern \u2014 de reis begint vandaag."], ["Have questions or need help? We're here for you", "Vragen? We helpen je graag."], ["\u00a9 2025 Empower Your Core All rights reserved.", "\u00a9 2025 Empower Your Core Alle rechten voorbehouden."], ["Everything begins at the center-yours too?", "Alles begint in de kern \u2014 ook jouw kern?"], ["An Innovative Method for Modern Bodies", "Een innovatieve methode voor moderne lichamen"], ["Personal Training at Empower Your Core", "Persoonlijke training bij Empower Your Core"], ["We\u2019d love to help! Let us know how", "We helpen je graag! Laat ons weten waarmee"], ["Best Value for Consistent Results", "Beste waarde voor consistente resultaten"], ["Single Personal Training Session", "Losse Persoonlijke training Sessie"], ["Full Access to Studio Equipment", "Volledige toegang tot alle studio-apparatuur"], ["Real-Time Feedback & Correction", "Directe feedback en correctie in real-time"], ["Ideal for Transformative Goals", "Ideaal voor langdurige transformatie"], ["One-on-One Expert Instruction", "Een-op-een begeleiding door een expert"], ["Natural Movement Comes First", "Natuurlijke beweging staat voorop"], ["Pilates Studio Dubai Marina", "Pilates Studio Utrecht"], ["One-on-One Virtual Guidance", "Een-op-een virtuele begeleiding"], ["Understanding the Challenge", "De uitdaging"], ["The Power of Customisation", "De kracht van maatwerk"], ["Teacher Training Program", "Opleiding voor Pilatesdocenten"], ["How may we assist you?", "Waarmee kunnen we je helpen?"], ["Package of 10 Sessions", "Pakket van 10 sessies"], ["Hear from our clients", "Ervaringen van onze cli\u00ebnten"], ["10 Personal Trainings", "10 Persoonlijke training sessies"], ["Persoonlijke training", "Persoonlijke Training"], ["Persoonlijke Training", "Persoonlijke Training"], ["Subject of Interest", "Onderwerp"], ["Corporate Wellness", "Bedrijfswelzijn"], ["Personal Training", "Persoonlijke Training"], ["Send Your Message", "Verstuur je bericht"], ["+971 50 XXX XXXX", "+31 6 13 62 99 65"], ["Connect With Us", "Verbind je met ons"], ["Request a Quote", "Vraag een offerte aan"], ["55 minutes each", "55 minuten per sessie"], ["Online Training", "Online training"], ["View Casestudy", "Bekijk casestudy"], ["Book a Session", "Boek een sessie"], ["What we offer", "Ons aanbod"], ["Email Address", "E-mailadres"], ["Our Approach", "Onze aanpak"], ["Testimonials", "Ervaringen"], ["per session", "per sessie"], ["per package", "per pakket"], ["Get Started", "Start vandaag"], ["Book Online", "Boek online"], ["The Results", "Het resultaat"], ["Book a Call", "Verbind je met ons"], ["55 minutes", "55 minuten"], ["Full Name", "Volledige naam"], ["AED 2,940", "EUR 800"], ["About Us", "Over Ons"], ["Reach Us", "Bereik ons"], ["Over ons", "Over Ons"], ["Over Ons", "Over Ons"], ["AED 315", "EUR 87,50"], ["Contact", "Contact"], ["Pricing", "Prijzen"], ["PRICING", "PRIJZEN"], ["Our Method", "Onze Methode"], ["Method", "Methode"], ["Hoofd", "Home"], ["Works", "Ervaringen"], ["Main", "Home"], ["Home", "Home"], ["Personal", "Persoonlijke"], ["How we work", "Hoe wij werken"], ["Observe", "Observeer"], ["Refine", "Verfijn"], ["Inspire", "Inspireer"]]);
  const supplementalMapEntries = [
    ["Dealing with chronic knee, hip, and back pain, Rolf was a Pilates sceptic until his first session. See how our personalised, precise approach helped him get hooked, regain flexibility, and return to an active, pain-free lifestyle.", "Met chronische knie-, heup- en rugpijn was Rolf tot aan zijn eerste sessie sceptisch over Pilates. Ontdek hoe onze persoonlijke, precieze aanpak hem overtuigde, zijn flexibiliteit terugbracht en hem hielp terugkeren naar een actief, pijnvrij leven."],
    ["When Rolf’s wife suggested he try Pilates, he was a true sceptic, admitting, \"I thought it was something esoteric.\"", "Toen Rolfs vrouw voorstelde om Pilates te proberen, was hij een rasechte scepticus: \"Ik dacht dat het iets zweverigs was,\" geeft hij toe."],
    ["When Rolf’s wife suggested he try Pilates, he was a true sceptic, admitting, \"I thought it was something esoteric.\"", "Toen Rolfs vrouw voorstelde om Pilates te proberen, was hij een rasechte scepticus: \"Ik dacht dat het iets zweverigs was,\" geeft hij toe."],
    ["He was dealing with a frustrating chain reaction of chronic pain that started in his knees and radiated to his hip, causing a stiff back and frequent leg pain. He needed a solution that could address the root cause of his interconnected issues and get him back to the active lifestyle he loved.", "Hij kampte met een frustrerende kettingreactie van chronische pijn die begon in zijn knieën en doorstraalde naar zijn heup, met een stijve rug en terugkerende beenpijn tot gevolg. Hij zocht een oplossing die de kern van zijn klachten aanpakte en hem zijn actieve levensstijl teruggaf."],
    ["Our ongoing approach is built on the three principles Rolf identified as key to his success:", "Onze doorlopende aanpak is gebouwd op drie principes die voor Rolf doorslaggevend waren:"],
    ["Precision: We ensure every exercise is performed with perfect form for maximum benefit and safety.", "Precisie: We zien erop toe dat elke oefening met een perfecte techniek wordt uitgevoerd voor maximaal resultaat en veiligheid."],
    ["Personalisation: We design a \"custom work\" program tailored specifically to address his unique physical challenges.", "Personalisatie: We ontwerpen een programma op maat, specifiek gericht op het aanpakken van zijn unieke fysieke uitdagingen."],
    ["Personalization: We design a \"custom work\" program tailored specifically to address his unique physical challenges.", "Personalisatie: We ontwerpen een programma op maat, specifiek gericht op het aanpakken van zijn unieke fysieke uitdagingen."],
    ["Flexibility: We listen to his body, adjusting sessions in real-time to focus on what needs attention that day.", "Flexibiliteit: We luisteren naar zijn lichaam en passen de sessies in real-time aan om de focus te leggen op wat die dag de meeste aandacht nodig heeft."],
    ["Precision:", "Precisie:"],
    ["Personalisation:", "Personalisatie:"],
    ["Personalization:", "Personalisatie:"],
    ["Flexibility:", "Flexibiliteit:"],
    [" We ensure every exercise is performed with perfect form for maximum benefit and safety.", " We zien erop toe dat elke oefening met een perfecte techniek wordt uitgevoerd voor maximaal resultaat en veiligheid."],
    [" We design a \"custom work\" program tailored specifically to address his unique physical challenges.", " We ontwerpen een programma op maat, specifiek gericht op het aanpakken van zijn unieke fysieke uitdagingen."],
    [" We listen to his body, adjusting sessions in real-time to focus on what needs attention that day.", " We luisteren naar zijn lichaam en passen de sessies in real-time aan om de focus te leggen op wat die dag de meeste aandacht nodig heeft."],
    ["Rolf's dedication, combined with our tailored approach, has produced a complete transformation. He has not only resolved his chronic pain but has also built a new foundation of strength and flexibility that will serve him for years to come.", "Rolfs toewijding, gecombineerd met onze persoonlijke aanpak, heeft geleid tot een complete transformatie. Hij is niet alleen van zijn chronische pijn af, maar heeft ook een nieuwe basis van kracht en flexibiliteit opgebouwd waar hij nog jaren profijt van zal hebben."],
    ["\"I can do all the sports that I want to do next to Pilates without any big pain.\"", "\"Ik kan alle sporten doen die ik naast Pilates wil doen, zonder noemenswaardige pijn.\""],
    ["From a decades-old spinal injury to renewed flexibility, see how personalised Pilates training helped Lisa reclaim a pain-free, active life and even improved her golf swing.", "Van een decennialange rugblessure naar herwonnen flexibiliteit: ontdek hoe persoonlijke Pilatestraining Lisa hielp om weer pijnvrij en actief te leven, en zelfs haar golfswing verbeterde."],
    ["From a decades-old spinal injury to renewed flexibility, see how personalized Pilates training helped Lisa reclaim a pain-free, active life and even improved her golf swing.", "Van een decennialange rugblessure naar herwonnen flexibiliteit: ontdek hoe persoonlijke Pilatestraining Lisa hielp om weer pijnvrij en actief te leven, en zelfs haar golfswing verbeterde."],
    ["A tennis injury in his mid-twenties left Chris with a back problem that would trouble him for nearly 30 years. After three decades of living with the issue, he was open to trying something new. When a friend suggested Pilates, he discovered a method that would completely reshape his physical wellbeing.", "Een tennisblessure op 25-jarige leeftijd bezorgde Chris rugklachten waar hij bijna dertig jaar lang last van hield. Na drie decennia vol beperkingen stond hij open voor een nieuwe benadering. Toen een vriend hem Pilates aanraadde, ontdekte hij een methode die zijn fysieke welzijn fundamenteel veranderde."],
    ["Lisa\u2019s journey is a powerful testament to the body\u2019s ability to heal and strengthen, regardless of age or the duration of an injury.", "Lisa\u2019s traject is het ultieme bewijs dat het lichaam kan herstellen en sterker kan worden, ongeacht leeftijd of hoe lang een blessure al bestaat."],
    ["Lisa's journey is a powerful testament to the body's ability to heal and strengthen, regardless of age or the duration of an injury.", "Lisa's traject is het ultieme bewijs dat het lichaam kan herstellen en sterker kan worden, ongeacht leeftijd of hoe lang een blessure al bestaat."],
    ["The benefits have extended far beyond her initial goals, enhancing her hobbies and restoring a level of physical freedom she hadn\u2019t felt in decades.", "Ze herwon een mate van fysieke vrijheid die ze in decennia niet had gevoeld."],
    ["The benefits have extended far beyond her initial goals, enhancing her hobbies and restoring a level of physical freedom she hadn't felt in decades.", "Ze herwon een mate van fysieke vrijheid die ze in decennia niet had gevoeld."],
    ["Chris came to us not as a beginner, but as a dedicated Pilates practitioner of 15 years. He had already experienced the transformative power of the method and was now seeking a true expert to guide him on the next phase of his journey.", "Chris kwam niet als beginner bij ons, maar als een toegewijde beoefenaar met vijftien jaar Pilates-ervaring. Hij kende de transformerende kracht van de methode al, maar zocht een expert om hem naar het volgende niveau te tillen. Hij koos specifiek voor onze studio vanwege een cruciale reden:"],
    ["\"I chose him because I could see from his training that he had done all the essential Pilates training.\"", "\"Ik koos voor hem omdat ik aan zijn opleiding zag dat hij alle essenti\u00eble Pilatestrainingen had gevolgd.\""],
    ["Our approach with Chris has been a partnership in precision. We provide the expert guidance and deep knowledge of the Pilates method required to challenge an experienced client, helping him continue to refine his practice, improve his body, and work towards new goals.", "Onze aanpak met Chris is een partnerschap in precisie. We bieden de diepgaande kennis die nodig is om een ervaren cliënt te blijven uitdagen. Samen verfijnen we zijn techniek, verbeteren we zijn fysieke belastbaarheid en werken we gericht naar nieuwe doelen."],
    ["For Chris, the result of his dedication is a life free from the limitations of a decades-old injury. He has become a self-described \"Pilates fanatic\" who sees his practice as a \"nonstop, never-ending process\" of improvement. His story is a powerful testament to the fact that with the right expert guidance, it is never too late to achieve a \"whole new body.\"", "Voor Chris is het resultaat van zijn toewijding een leven zonder de beperkingen van een decennia-oude blessure. Hij noemt zichzelf inmiddels een \"Pilatesfanaat\" en ziet zijn practice als een continu proces van groei. Zijn verhaal bewijst dat het met de juiste deskundige begeleiding nooit te laat is om een \"totaal nieuw lichaam\" te bereiken."],
    ["Barely able to walk due to debilitating back and leg pain, she sought a safe way to rebuild strength. See how our personalized, one-on-one approach provided rapid relief and restored her ability to walk upright and pain-free.", "Omdat ze door slopende rug- en beenpijn nauwelijks nog kon lopen, zocht ze een veilige manier om haar kracht weer op te bouwen. Ontdek hoe onze persoonlijke een-op-een aanpak snel verlichting gaf en haar vermogen om rechtop en pijnvrij te lopen herstelde."],
    ["Barely able to walk due to debilitating back and leg pain, she sought a safe way to rebuild strength. See how our personalised, one-on-one approach provided rapid relief and restored her ability to walk upright and pain-free.", "Omdat ze door slopende rug- en beenpijn nauwelijks nog kon lopen, zocht ze een veilige manier om haar kracht weer op te bouwen. Ontdek hoe onze persoonlijke een-op-een aanpak snel verlichting gaf en haar vermogen om rechtop en pijnvrij te lopen herstelde."],
    ["When our client first came to us, she was dealing with a debilitating situation. Severe back pain had radiated to her shins, making it so difficult to walk that she needed a form of exercise that could build strength without adding any further burden to her body. Recalling a positive experience with Reformer Pilates a decade ago, she knew a personalized, one-on-one approach was essential.", "Toen onze cli\u00ebnte voor het eerst bij ons kwam, bevond zij zich in een zware situatie. Ernstige rugpijn straalde uit naar haar schenen, waardoor lopen zo moeizaam werd dat ze een bewegingsvorm nodig had die kracht opbouwde zonder haar lichaam verder te belasten. Vanwege een positieve ervaring met de Reformer, tien jaar eerder, wist ze dat een persoonlijke \u00e9\u00e9n-op-\u00e9\u00e9n aanpak essentieel was voor haar herstel."],
    ["When our client first came to us, she was dealing with a debilitating situation. Severe back pain had radiated to her shins, making it so difficult to walk that she needed a form of exercise that could build strength without adding any further burden to her body. Recalling a positive experience with Reformer Pilates a decade ago, she knew a personalised, one-on-one approach was essential.", "Toen onze cli\u00ebnte voor het eerst bij ons kwam, bevond zij zich in een zware situatie. Ernstige rugpijn straalde uit naar haar schenen, waardoor lopen zo moeizaam werd dat ze een bewegingsvorm nodig had die kracht opbouwde zonder haar lichaam verder te belasten. Vanwege een positieve ervaring met de Reformer, tien jaar eerder, wist ze dat een persoonlijke \u00e9\u00e9n-op-\u00e9\u00e9n aanpak essentieel was voor haar herstel."],
    ["From the start, the focus was on a deep understanding of her body's unique needs. \"One-on-one is very important,\" she notes, \"because so much attention is given to the physiology and anatomy.\" Our approach was built on careful observation of her body's reactions and a foundational emphasis on core stability. By teaching her to engage her core correctly, we aimed to relieve the burden on her back and rebuild her body's natural support system.", "Vanaf het begin lag de focus op een diep begrip van de unieke behoeften van haar lichaam. \"\u00c9\u00e9n-op-\u00e9\u00e9n is heel belangrijk,\" legt ze uit, \"omdat er bij deze methode zoveel aandacht is voor fysiologie en anatomie.\" Onze aanpak was gebaseerd op:\n\u2022 Zorgvuldige observatie: Constant monitoren hoe haar lichaam reageerde op elke beweging.\n\u2022 Core Stability als fundament: Haar leren hoe ze haar diepe kernspieren correct activeert om de rug te ontlasten en het natuurlijke ondersteuningssysteem van haar lichaam te heractiveren."],
    ["The progress was both rapid and profound. In just two months of consistent, targeted sessions, the chronic pain that had limited her mobility was gone. She can now walk with a new, upright posture, free from the back and leg pain that had troubled her for so long.", "De vooruitgang was zowel snel als ingrijpend. In slechts twee maanden van consistente, gerichte sessies verdween de chronische pijn die haar mobiliteit beperkte. Ze loopt nu met een nieuwe, trotse houding, vrij van de rug- en beenpijn die haar zo lang heeft belemmerd."],
    ["\"I have less of a backache now, because I walk more and more upright... thanks to my core stability. The pain in my shins gradually went away in just two months.\"", "\"Ik heb nu minder last van mijn rug, omdat ik steeds rechter loop... dankzij mijn verbeterde core stability. De pijn in mijn schenen verdween geleidelijk binnen slechts twee maanden.\""],
    ["The turning point came not from within the studio, but from the outside world.", "Het keerpunt kwam onverwacht, door feedback uit haar directe omgeving:"],
    ["\"Immediately, someone in my circle said: 'It seems as if you're walking and standing differently.' I had also seen this myself, but I didn't tell the people whom I had asked if they could see what was wrong with my back.\"", "\"Meteen zei iemand: 'Het lijkt alsof je anders loopt en staat.' Dat zag ik zelf ook, maar ik had diegene niet eens verteld wat er precies met mijn rug aan de hand was.\""],
    ["\"He told me last week: 'You shouldn't change your swing at all. Because it's great. I've never seen anyone your age who is that flexible.'\"", "\"Hij zei vorige week: 'Je moet je swing helemaal niet veranderen. Die is uitstekend. Ik heb nog nooit iemand van jouw leeftijd gezien die zo flexibel is.'\""],
    ["project img", "projectafbeelding"]
  ];

  supplementalMapEntries.forEach(([english, dutch]) => {
    map.set(english, dutch);
  });

  const norm = (s) => s.replace(/[\s\u00A0\u202F]+/g, ' ').replace(/®/g, '').trim();
  const lowerMap = new Map(
    Array.from(map.entries(), ([k, v]) => [norm(k).toLowerCase(), v])
  );

  // Build reverse map: Dutch → English (for EN mode)
  var nlToEnMap = new Map();
  map.forEach(function(dutchVal, englishKey) {
    nlToEnMap.set(norm(dutchVal), englishKey);
    nlToEnMap.set(norm(dutchVal).toLowerCase(), englishKey);
  });
  supplementalMapEntries.forEach(function(pair) {
    nlToEnMap.set(norm(pair[1]), pair[0]);
    nlToEnMap.set(norm(pair[1]).toLowerCase(), pair[0]);
  });

  const titleMap = new Map([
    ["How Empower Your Core Helped Lisa Reclaim Her Life from a 50 Year Old Injury", "Hoe Lisa na 50 jaar eindelijk weer pijnvrij is dankzij Empower Your Core"],
    ["From Pilates Skeptic to Pain-Free Athlete in Three Years", "Van Pilates-scepticus naar pijnvrije atleet in drie jaar"],
    ["From a 30-Year Back Injury to a \"Whole New Body\"", "Van een 30 jaar oude rugblessure naar een \"totaal nieuw lichaam\""],
    ["From Recurring Back Pain to a Stronger Swing", "Van terugkerende rugpijn naar een krachtigere swing"],
    ["From Gym Burnout to a Fascinating Practice", "Van sportmoeheid naar een fascinerende passie"],
    ["Finding Stability and a Pain-Free Stride", "Weer stabiel en pijnvrij in beweging"]
  ]);
  // Add titleMap reverse entries to nlToEnMap
  titleMap.forEach(function(dutchVal, englishKey) {
    nlToEnMap.set(norm(dutchVal), englishKey);
    nlToEnMap.set(norm(dutchVal).toLowerCase(), englishKey);
  });

  // Content corrections: these Dutch values should map to CORRECTED English (not original Framer English)
  nlToEnMap.set(norm("Stap binnen in onze privé Pilates Studio in Utrecht"), "Step into our private Pilates Studio in Utrecht");
  nlToEnMap.set(norm("stap binnen in onze privé pilates studio in utrecht"), "Step into our private Pilates Studio in Utrecht");
  nlToEnMap.set(norm("Pilates Studio Utrecht"), "Pilates Studio Utrecht");
  nlToEnMap.set(norm("pilates studio utrecht"), "Pilates Studio Utrecht");
  nlToEnMap.set(norm("EUR 87,50"), "EUR 87,50");
  nlToEnMap.set(norm("EUR 800"), "EUR 800");
  nlToEnMap.set(norm("+31 6 13 62 99 65"), "+31 6 13 62 99 65");
  nlToEnMap.set(norm("Stap in je kern — de reis begint vandaag."), "Step into your center — the journey starts today");
  nlToEnMap.set(norm("Alles begint in de kern — ook jouw kern?"), "Everything begins at the center — yours too?");

  // Process section text (hardcoded in replaceProcessSection, not in original map)
  nlToEnMap.set(norm("ONTDEKKEN"), "DISCOVER");
  nlToEnMap.set(norm("ontdekken"), "DISCOVER");
  nlToEnMap.set(norm("OPBOUWEN"), "BUILD");
  nlToEnMap.set(norm("opbouwen"), "BUILD");
  nlToEnMap.set(norm("TRANSFORMEREN"), "TRANSFORM");
  nlToEnMap.set(norm("transformeren"), "TRANSFORM");
  nlToEnMap.set(norm("We beginnen door samen naar jouw lichaam te kijken. Deze eerste sessie draait om zien hoe je beweegt, waar je sterke punten liggen en wat aandacht nodig heeft."), "We start by looking at your body together. This first session is about seeing how you move, where your strengths lie, and what needs attention.");
  nlToEnMap.set(norm("Van daaruit ontwerpen we sessies rond jouw lichaam en jouw vooruitgang, waarbij we Pilates-precisie combineren met functionele kracht."), "From there, we design sessions around your body and your progress, blending Pilates precision with functional strength.");
  nlToEnMap.set(norm("We leren je beter te bewegen, niet alleen harder. Ademhaling, houding en alignment vormen de basis van elke sessie."), "We teach you how to move better, not just harder. Breath, posture, and alignment form the foundation of every session.");

  // Nav labels
  nlToEnMap.set(norm("Over Ons"), "About Us");
  nlToEnMap.set(norm("over ons"), "About Us");
  nlToEnMap.set(norm("Onze Methode"), "Our Method");
  nlToEnMap.set(norm("onze methode"), "Our Method");
  nlToEnMap.set(norm("Prijzen"), "Pricing");
  nlToEnMap.set(norm("prijzen"), "Pricing");
  nlToEnMap.set(norm("Ervaringen"), "Testimonials");
  nlToEnMap.set(norm("ervaringen"), "Testimonials");
  nlToEnMap.set(norm("Hoe wij werken"), "How we work");
  nlToEnMap.set(norm("hoe wij werken"), "How we work");
  nlToEnMap.set(norm("Ons aanbod"), "What we offer");
  nlToEnMap.set(norm("ons aanbod"), "What we offer");
  nlToEnMap.set(norm("Onze aanpak"), "Our Approach");
  nlToEnMap.set(norm("onze aanpak"), "Our Approach");
  nlToEnMap.set(norm("Bekijk casestudy"), "View Case Study");
  nlToEnMap.set(norm("bekijk casestudy"), "View Case Study");
  nlToEnMap.set(norm("Boek een sessie"), "Book a Session");
  nlToEnMap.set(norm("boek een sessie"), "Book a Session");
  nlToEnMap.set(norm("Start vandaag"), "Get Started");
  nlToEnMap.set(norm("start vandaag"), "Get Started");
  nlToEnMap.set(norm("Boek online"), "Book Online");
  nlToEnMap.set(norm("boek online"), "Book Online");
  nlToEnMap.set(norm("Verbind je met ons"), "Connect With Us");
  nlToEnMap.set(norm("verbind je met ons"), "Connect With Us");
  nlToEnMap.set(norm("Verstuur je bericht"), "Send Your Message");
  nlToEnMap.set(norm("verstuur je bericht"), "Send Your Message");

  // Home docx intro / kicker
  nlToEnMap.set(norm("Empower Your Core® is geen trend."), "Empower Your Core® is not a trend.");
  nlToEnMap.set(norm("Het is een methode met blijvende waarde."), "It is a method with lasting value.");
  nlToEnMap.set(norm("Gebouwd op 15 jaar ervaring en verdieping. Met evidence-based strategieën die je helpen pijn te verminderen, kracht op te bouwen, mobiliteit te verbeteren en weer met vertrouwen te bewegen."), "Built on 15 years of expertise and depth. Evidence-based strategies that help you reduce pain, build strength, improve mobility and move with confidence again.");
  nlToEnMap.set(norm("Methode • Evidence-based • 15 jaar"), "Method • Evidence-based • 15 years");
  nlToEnMap.set(norm("methode • evidence-based • 15 jaar"), "Method • Evidence-based • 15 years");

  // Additional fix function text
  nlToEnMap.set(norm("Opleiding voor Pilatesdocenten"), "Teacher Training Program");
  nlToEnMap.set(norm("opleiding voor pilatesdocenten"), "Teacher Training Program");
  nlToEnMap.set(norm("Persoonlijke Training"), "Personal Training");
  nlToEnMap.set(norm("persoonlijke training"), "Personal Training");
  nlToEnMap.set(norm("Persoonlijke training bij Empower Your Core"), "Personal Training at Empower Your Core");
  nlToEnMap.set(norm("Online training"), "Online Training");
  nlToEnMap.set(norm("Bedrijfswelzijn"), "Corporate Wellness");
  nlToEnMap.set(norm("Vragen? We helpen je graag."), "Have questions or need help? We're here for you");
  nlToEnMap.set(norm("We helpen je graag! Laat ons weten waarmee"), "We'd love to help! Let us know how");
  nlToEnMap.set(norm("Waarmee kunnen we je helpen?"), "How may we assist you?");
  nlToEnMap.set(norm("Volledige naam"), "Full Name");
  nlToEnMap.set(norm("E-mailadres"), "Email Address");
  nlToEnMap.set(norm("Onderwerp"), "Subject of Interest");
  nlToEnMap.set(norm("Bereik ons"), "Reach Us");

  // Teacher training card
  nlToEnMap.set(norm("Word een expert in beweging. Ons opleidingsprogramma biedt een helder en logisch traject: van fundamentele principes naar zelfverzekerde, toepasbare vaardigheden in de praktijk."), "Become an expert in movement. Our scientifically-grounded teacher training program provides a clear, logical path from foundational principles to confident, real-world application.");

  // Pricing
  nlToEnMap.set(norm("Losse Persoonlijke training Sessie"), "Single Personal Training Session");
  nlToEnMap.set(norm("Pakket van 10 sessies"), "Package of 10 Sessions");
  nlToEnMap.set(norm("10 Persoonlijke training sessies"), "10 Personal Trainings");
  nlToEnMap.set(norm("55 minuten per sessie"), "55 minutes each");
  nlToEnMap.set(norm("55 minuten"), "55 minutes");
  nlToEnMap.set(norm("per sessie"), "per session");
  nlToEnMap.set(norm("per pakket"), "per package");
  nlToEnMap.set(norm("Beste waarde voor consistente resultaten"), "Best Value for Consistent Results");
  nlToEnMap.set(norm("Ideaal voor langdurige transformatie"), "Ideal for Transformative Goals");
  nlToEnMap.set(norm("Een-op-een begeleiding door een expert"), "One-on-One Expert Instruction");
  nlToEnMap.set(norm("Volledige toegang tot alle studio-apparatuur"), "Full Access to Studio Equipment");
  nlToEnMap.set(norm("Directe feedback en correctie in real-time"), "Real-Time Feedback & Correction");

  // Footer
  nlToEnMap.set(norm("© 2025 Empower Your Core Alle rechten voorbehouden."), "© 2025 Empower Your Core® All rights reserved.");

  // Testimonials section
  nlToEnMap.set(norm("Ervaringen van onze cliënten"), "Hear from our clients");
  nlToEnMap.set(norm("Je hebt gezien hoe wij werken. Nu hoor je van mensen die het zelf hebben meegemaakt."), "We've shown you how we work—now listen to those who've experienced it.");
  nlToEnMap.set(norm("Hun ervaringen tonen wat mogelijk is. Nu is het tijd voor jouw volgende stap. Verbind je met ons en begin de reis."), "Their stories show what's possible — now it's your turn. Connect with us and join the journey.");
  nlToEnMap.set(norm("Deze getuigenissen zijn opgenomen onder onze vorige naam, True and Pure Pilates – nu met trots Empower Your Core."), "These testimonials were recorded under our previous name, True and Pure Pilates - now proudly Empower Your Core.");

  // About us / method
  nlToEnMap.set(norm("Natuurlijke beweging staat voorop"), "Natural Movement Comes First");
  nlToEnMap.set(norm("De kracht van maatwerk"), "The Power of Customisation");
  nlToEnMap.set(norm("Een innovatieve methode voor moderne lichamen"), "An Innovative Method for Modern Bodies");
  nlToEnMap.set(norm("De uitdaging"), "Understanding the Challenge");
  nlToEnMap.set(norm("Het resultaat"), "The Results");
  nlToEnMap.set(norm("Observeer"), "Observe");
  nlToEnMap.set(norm("Verfijn"), "Refine");
  nlToEnMap.set(norm("Inspireer"), "Inspire");

  // Case study titles
  nlToEnMap.set(norm("Hoe Lisa na 50 jaar eindelijk weer pijnvrij is dankzij Empower Your Core"), "How Empower Your Core Helped Lisa Reclaim Her Life from a 50 Year Old Injury");
  nlToEnMap.set(norm("Van Pilates-scepticus naar pijnvrije atleet in drie jaar"), "From Pilates Skeptic to Pain-Free Athlete in Three Years");

  // Premium intro section (applyHomeDocxIntro hardcoded Dutch)
  nlToEnMap.set(norm("Empower Your Core is geen trend."), "Empower Your Core\u00AE is not a trend.");
  nlToEnMap.set(norm("Empower Your Core\u00AE is geen trend."), "Empower Your Core\u00AE is not a trend.");
  nlToEnMap.set(norm("Het is een methode met blijvende waarde."), "It is a method with lasting value.");
  nlToEnMap.set(norm("Gebouwd op 15 jaar ervaring en verdieping. Met bewezen strategie\u00ebn die je helpen pijn te verminderen, kracht op te bouwen, je mobiliteit te verbeteren en opnieuw met vertrouwen te bewegen."), "Built on 15 years of expertise and depth. Evidence-based strategies that help you reduce pain, build strength, improve mobility and move with confidence again.");
  nlToEnMap.set(norm("Pijn verminderen"), "Reduce pain");
  nlToEnMap.set(norm("pijn verminderen"), "Reduce pain");
  nlToEnMap.set(norm("slimmer, niet harder"), "smarter, not harder");
  nlToEnMap.set(norm("Kracht opbouwen"), "Build strength");
  nlToEnMap.set(norm("kracht opbouwen"), "Build strength");
  nlToEnMap.set(norm("core + ketens"), "core + chains");
  nlToEnMap.set(norm("Mobiliteit"), "Mobility");
  nlToEnMap.set(norm("mobiliteit"), "Mobility");
  nlToEnMap.set(norm("ruimte in beweging"), "freedom of movement");
  nlToEnMap.set(norm("Vertrouwen"), "Confidence");
  nlToEnMap.set(norm("vertrouwen"), "Confidence");
  nlToEnMap.set(norm("controle & consistentie"), "control & consistency");
  nlToEnMap.set(norm("Stap binnen in onze priv\u00e9 Pilatesstudio in Utrecht"), "Step into our private Pilates Studio in Utrecht");
  nlToEnMap.set(norm("Volledig uitgerust en afgestemd op jou \u2014 waar transformatie begint met bewuste beweging."), "Fully equipped and tailored to you \u2014 where transformation begins with mindful movement.");
  nlToEnMap.set(norm("Exclusief."), "Exclusive.");
  nlToEnMap.set(norm("Persoonlijk. Rustig. Doelgericht."), "Personal. Calm. Purposeful.");
  nlToEnMap.set(norm("Plan een intake"), "Book an intake");
  nlToEnMap.set(norm("plan een intake"), "Book an intake");
  nlToEnMap.set(norm("Priv\u00e9sessies \u2022 Full Equipment \u2022 Utrecht"), "Private sessions \u2022 Full Equipment \u2022 Utrecht");
  nlToEnMap.set(norm("Methode \u2022 Evidence-based \u2022 15 jaar"), "Method \u2022 Evidence-based \u2022 15 years");
  nlToEnMap.set(norm("methode \u2022 evidence-based \u2022 15 jaar"), "Method \u2022 Evidence-based \u2022 15 years");

  // replaceProcessSection hardcoded text
  nlToEnMap.set(norm("We bekijken hoe je beweegt en waar je lichaam ondersteuning nodig heeft."), "We look at how you move and where your body needs support.");
  nlToEnMap.set(norm("We trainen doelgericht, afgestemd op jouw lichaam en jouw vooruitgang."), "We train with purpose, tailored to your body and your progress.");
  nlToEnMap.set(norm("Je leert beter bewegen, sterker worden en je lichaam vertrouwen."), "You learn to move better, grow stronger and trust your body.");

  // About us page
  nlToEnMap.set(norm("De Oprichter & De Visie"), "The Founder & The Vision");
  nlToEnMap.set(norm("Missie"), "Mission");
  nlToEnMap.set(norm("Visie"), "Vision");
  nlToEnMap.set(norm("Kernwaarden"), "Core Values");
  nlToEnMap.set(norm("Authenticiteit:"), "Authenticity:");
  nlToEnMap.set(norm("Maatwerk:"), "Customisation:");
  nlToEnMap.set(norm("Passie:"), "Passion:");

  // Contact / form
  nlToEnMap.set(norm("Klaar om jouw reis te beginnen? Stuur ons een e-mail om een vraag te stellen of je eerste sessie te boeken."), "Ready to start your journey? Send us an email to ask a question or book your first session.");
  nlToEnMap.set(norm("Neem vandaag nog contact met ons op en ontdek wat Persoonlijke training bij Empower Your Core voor jou kan betekenen."), "Contact us today and find out what Personal Training at Empower Your Core can do for you!");

  // ── ABOUT US page: ABOUT_US_INTRO_HTML ──
  nlToEnMap.set(norm("Ontdek het verhaal achter Empower Your Core. Leer hoe oprichter Mohammed Rahali de klassieke Pilates-methode transformeerde tot een innovatieve, evidence-based praktijk, gericht op betekenisvolle beweging en duurzame resultaten."), "Discover the story behind Empower Your Core. Learn how founder Mohammed Rahali transformed the classical Pilates method into an innovative, evidence-based practice focused on meaningful movement and lasting results.");

  // ── ABOUT US page: ABOUT_US_BODY_HTML paragraphs ──
  nlToEnMap.set(norm("Empower Your Core is ontwikkeld door Mohammed Rahali: methode-ontwikkelaar en ondernemer. Geboren en getogen in Nederland, kwam Mohammed in Los Angeles voor het eerst in aanraking met de klassieke Pilatesmethode. Na een intensieve opleiding, de oprichting van zijn eigen studio True and Pure Pilates en jarenlange praktijkervaring, raakte hij ervan overtuigd dat het tijd was voor innovatie."), "Empower Your Core was developed by Mohammed Rahali: method developer and entrepreneur. Born and raised in the Netherlands, Mohammed first encountered the classical Pilates method in Los Angeles. After intensive training, founding his own studio True and Pure Pilates, and years of hands-on experience, he became convinced it was time for innovation.");
  nlToEnMap.set(norm("Door zijn praktische expertise te combineren met een diepe nieuwsgierigheid naar anatomie, biomechanica en moderne trainingsprincipes, zag Mohammed de beperkingen van het klassieke systeem. Hij ontwikkelde een bredere, slimmere en effectievere methode."), "Combining practical expertise with a deep curiosity about anatomy, biomechanics, and modern training principles, Mohammed recognised the limitations of the classical system. He developed a broader, smarter, and more effective method.");
  nlToEnMap.set(norm("We leven in een tijd waarin kritisch denken, autonomie en evidence-based praktijken essentieel zijn. Empower Your Core vertaalt wetenschappelijke inzichten naar effectieve, direct toepasbare trainingsmethoden. De methode biedt een helder alternatief voor rigide, verouderde bewegingssystemen."), "We live in an era where critical thinking, autonomy, and evidence-based practices are essential. Empower Your Core translates scientific findings into effective, directly applicable training methods. The method provides a clear alternative to rigid, outdated movement systems.");
  nlToEnMap.set(norm("Geen dogma's. Geen herhaling om de herhaling. Alleen betekenisvolle beweging - gericht op kracht, bewustzijn en vrijheid."), "No dogmas. No repetition for repetition's sake. Just meaningful movement — focused on strength, awareness, and freedom.");
  nlToEnMap.set(norm("Onze missie bij Empower Your Core is het bevorderen van kracht, mobiliteit en lichaamsbewustzijn door middel van een wetenschappelijk onderbouwde, holistische benadering van beweging. Wij willen mensen helpen hun lichaam beter te begrijpen en te versterken door beweging bewust uit te voeren en een balans te vinden tussen kracht en flexibiliteit."), "Our mission at Empower Your Core is to promote strength, mobility, and body awareness through a scientifically grounded, holistic approach to movement. We aim to empower individuals to understand and strengthen their bodies by performing movements intentionally and finding a balance between strength and flexibility.");
  nlToEnMap.set(norm("Empower Your Core haalt inspiratie uit verschillende bewegingssystemen, maar vertrekt altijd vanuit het lichaam zelf. Wat we uit bestaande systemen overnemen, vertalen we naar functionele kracht, coordinatie en mobiliteit. Het lichaam bepaalt wat nodig is - niet een vastgelegde vorm."), "Empower Your Core draws insights from various movement systems but always starts from the body itself. What we incorporate from existing systems is translated into functional strength, coordination, and mobility. The body dictates what's necessary — not a fixed form.");
  nlToEnMap.set(norm("Veel traditionele methoden leggen de nadruk op gestandaardiseerde bewegingen en vaste patronen. Bij Empower Your Core geloven we dat ieder lichaam uniek is en dat het lichaam zelf de beste richting geeft voor effectieve beweging. In plaats van technieken rigide te volgen, richten wij ons op het ontwikkelen van een dieper lichaamsbewustzijn. We leren je luisteren naar wat het lichaam op elk moment nodig heeft. Dit maakt onze methode niet alleen flexibel, maar ook respectvol naar de natuurlijke bewegingen van het menselijk lichaam."), "Many traditional methods emphasise standardised movements and fixed patterns. At Empower Your Core, we believe each body is unique and that the body itself provides the best guidance for effective movement. Instead of rigidly following techniques, we focus on cultivating deeper body awareness. We teach you to listen to what the body needs at each moment. This makes our method not only flexible but also respectful of the human body's natural movements.");
  nlToEnMap.set(norm("Blijf altijd trouw aan jezelf en de mogelijkheden van jouw lichaam."), "Always remain true to yourself and the possibilities of your body.");
  nlToEnMap.set(norm("Elk lichaam is uniek; daarom stemmen we elk trainingsprogramma af op het individu."), "Each body is unique; that is why we tailor every training programme to the individual.");
  nlToEnMap.set(norm("Wij delen onze liefde en passie voor beweging met enthousiasme en overtuiging met onze cliënten."), "We enthusiastically share our love and passion for movement with our clients.");
  nlToEnMap.set(norm("Mohammed — oprichter van Empower Your Core"), "Mohammed — founder of Empower Your Core");

  // ── ABOUT US: applyCriticalCopyReplacements output strings ──
  nlToEnMap.set(norm("De Oprichter & De Visie"), "The Founder & The Vision");
  nlToEnMap.set(norm("Ontdek het verhaal achter Empower Your Core. Lees hoe oprichter Mohammed klassieke Pilates doorontwikkelde tot een innovatieve, evidence-based methode gericht op betekenisvolle beweging en blijvende resultaten."), "Discover the story behind Empower Your Core. Learn how founder Mohammed evolved classical Pilates into an innovative, evidence-based method focused on meaningful movement and lasting results.");
  nlToEnMap.set(norm("Empower Your Core is ontwikkeld door Mohammed, methodeontwikkelaar en ondernemer."), "Empower Your Core was developed by Mohammed, a method developer and entrepreneur.");
  nlToEnMap.set(norm("Geboren en opgegroeid in Nederland kwam Mohammed in Los Angeles voor het eerst in aanraking met de klassieke Pilatesmethode."), "Born and raised in the Netherlands, Mohammed first encountered the classical Pilates method in Los Angeles.");
  nlToEnMap.set(norm("Na intensieve opleiding, het oprichten van zijn eigen studio True and Pure Pilates, en jarenlange praktijkervaring, raakte hij ervan overtuigd dat het tijd was voor innovatie."), "After intensive training, founding his own studio True and Pure Pilates, and years of practical experience, he became convinced it was time for innovation.");
  nlToEnMap.set(norm("Door zijn praktische expertise te combineren met een diepe nieuwsgierigheid naar anatomie, biomechanica en moderne trainingsprincipes, zag Mohammed de beperkingen van klassieke Pilates."), "Combining hands-on experience with deep curiosity about anatomy, biomechanics, and modern training principles, Mohammed recognised the limitations of classical Pilates.");
  nlToEnMap.set(norm("Hij ontwikkelde een bredere, slimmere en effectievere methode."), "He developed a broader, smarter, and more effective method.");
  nlToEnMap.set(norm("We leven in een tijd waarin kritisch denken, autonomie en evidence-based praktijken essentieel zijn."), "We live in an era where critical thinking, autonomy, and evidence-based practices are essential.");
  nlToEnMap.set(norm("Empower Your Core vertaalt wetenschappelijke inzichten naar effectieve, toepasbare trainingsmethoden."), "Empower Your Core translates scientific findings into effective, practical training methods.");
  nlToEnMap.set(norm("De methode biedt een helder alternatief voor rigide bewegingssystemen."), "The method provides a clear alternative to rigid movement systems.");
  nlToEnMap.set(norm("Geen dogma's. Geen herhaling om de herhaling. Alleen betekenisvolle beweging - gericht op kracht, bewustzijn en vrijheid."), "No dogmas. No repetition for repetition's sake. Just meaningful movement — focused on strength, awareness, and freedom.");
  nlToEnMap.set(norm("De missie van Empower Your Core is het bevorderen van kracht, mobiliteit en lichaamsbewustzijn via een wetenschappelijk gefundeerde en holistische benadering van beweging."), "The mission of Empower Your Core is to promote strength, mobility, and body awareness through a scientifically grounded and holistic approach to movement.");
  nlToEnMap.set(norm("Wij willen mensen helpen hun lichaam beter te begrijpen en te versterken door beweging bewust uit te voeren en een balans te vinden tussen kracht en flexibiliteit."), "We aim to empower individuals to understand and strengthen their bodies by performing movements intentionally and finding a balance between strength and flexibility.");
  nlToEnMap.set(norm("Empower Your Core haalt inspiratie uit verschillende bewegingssystemen, maar vertrekt altijd vanuit het lichaam zelf."), "Empower Your Core draws insights from various movement systems but always starts from the body itself.");
  nlToEnMap.set(norm("Wat we uit bestaande systemen meenemen, vertalen we naar functionele kracht, coordinatie en mobiliteit."), "What we incorporate from existing systems is translated into functional strength, coordination, and mobility.");
  nlToEnMap.set(norm("Het lichaam bepaalt wat nodig is - niet een vaste vorm."), "The body dictates what's necessary — not a fixed form.");
  nlToEnMap.set(norm("Veel traditionele methoden leggen de nadruk op gestandaardiseerde bewegingen en vaste patronen."), "Many traditional methods emphasise standardised movements and fixed patterns.");
  nlToEnMap.set(norm("Bij Empower Your Core geloven we dat ieder lichaam uniek is, en dat het lichaam zelf de beste richting geeft voor effectieve beweging."), "At Empower Your Core, we believe each body is unique, and that the body itself provides the best guidance for effective movement.");
  nlToEnMap.set(norm("In plaats van technieken rigide te volgen, richten wij ons op het ontwikkelen van dieper lichaamsbewustzijn en het leren luisteren naar wat het lichaam op elk moment nodig heeft."), "Instead of rigidly following techniques, we focus on cultivating deeper body awareness and learning to listen to what the body needs at each moment.");
  nlToEnMap.set(norm("Hierdoor is onze methode niet alleen flexibel, maar ook respectvol naar de natuurlijke beweging van het lichaam."), "This makes our method not only flexible but also respectful of the body's natural movement.");
  nlToEnMap.set(norm("Authenticiteit: Altijd trouw blijven aan jezelf en aan je lichaam."), "Authenticity: Always remain true to yourself and your body.");
  nlToEnMap.set(norm("Maatwerk: Elk lichaam is uniek - daarom wordt elk trainingsprogramma persoonlijk afgestemd."), "Customisation: Each body is unique — that is why every training programme is individually tailored.");
  nlToEnMap.set(norm("Wetenschappelijke basis: Onze methode is gebaseerd op de nieuwste inzichten uit onderzoek en praktijk."), "Scientific Foundation: Our method is grounded in the latest insights from research and practice.");
  nlToEnMap.set(norm("Passie: Wij delen onze liefde voor beweging met enthousiasme en toewijding met onze clienten."), "Passion: We enthusiastically share our love and passion for movement with our clients.");
  nlToEnMap.set(norm("Wetenschappelijke basis"), "Scientific Foundation");
  nlToEnMap.set(norm("wetenschappelijke basis"), "Scientific Foundation");

  // ── ABOUT US: Dutch text from applyCriticalCopyReplacements longer passages ──
  nlToEnMap.set(norm("Empower Your Core is geen trend, maar een duurzame methode. Ontstaan uit 15 jaar ervaring en verdieping. Een aanpak gebaseerd op bewezen strategieën die je helpen pijn te verminderen, sterker te worden, soepeler te bewegen en opnieuw vertrouwen in je lichaam te krijgen."), "Empower Your Core is not a trend — it is a lasting method. Born from 15 years of expertise and depth. An approach based on proven strategies that help you reduce pain, grow stronger, move more freely, and regain confidence in your body.");
  nlToEnMap.set(norm("Ontdek onze exclusieve privé Pilatesstudio in Utrecht."), "Discover our exclusive private Pilates studio in Utrecht.");
  nlToEnMap.set(norm("Een volledig uitgeruste omgeving, zorgvuldig afgestemd op jouw lichaam – waar transformatie start met bewuste beweging."), "A fully equipped environment, carefully tailored to your body — where transformation starts with mindful movement.");

  // ── TEACHER TRAINING page: TEACHER_TRAINING_BODY_HTML ──
  nlToEnMap.set(norm("Een Nieuwe Standaard in Bewegingseducatie"), "A New Standard in Movement Education");
  nlToEnMap.set(norm("Het trainingsprogramma van Empower Your Core Academy is ontstaan uit persoonlijke frustratie. Tijdens mijn eigen opleiding kreeg ik een boek met foto's en vage uitleg. Er zat weinig logica in en veel dingen moest ik zelf uitzoeken."), "The Empower Your Core Academy training programme was born out of personal frustration. During my own training I received a book with photos and vague explanations. There was little logic to it and I had to figure out a lot on my own.");
  nlToEnMap.set(norm("Daarom krijgen mijn studenten juist het tegenovergestelde."), "That is why my students receive the exact opposite.");
  nlToEnMap.set(norm("Bij Empower Your Core Academy werken we met een duidelijk en gestructureerd programma. Elke oefening wordt uitgelegd: wat je doet, waarom je het doet en hoe het werkt in het lichaam. Zo wordt wat vaak vaag blijft, een duidelijke en effectieve methode."), "At Empower Your Core Academy we work with a clear and structured programme. Every exercise is explained: what you do, why you do it, and how it works in the body. This turns what often remains vague into a clear and effective method.");
  nlToEnMap.set(norm("Onze Basisprincipes"), "Our Core Principles");
  nlToEnMap.set(norm("Logische opbouw:"), "Logical progression:");
  nlToEnMap.set(norm("De opleiding bouwt stap voor stap op: van basisprincipes naar meer gevorderde toepassingen."), "The programme builds step by step: from foundational principles to more advanced applications.");
  nlToEnMap.set(norm("Direct toepasbaar:"), "Directly applicable:");
  nlToEnMap.set(norm("Door praktische oefeningen en duidelijke richtlijnen kun je de kennis meteen gebruiken in de praktijk."), "Through practical exercises and clear guidelines, you can apply the knowledge immediately in practice.");
  nlToEnMap.set(norm("Het Resultaat"), "The Result");
  nlToEnMap.set(norm("het resultaat"), "The Result");
  nlToEnMap.set(norm("Onze studenten voelen niet alleen wat ze doen — ze begrijpen ook waarom het werkt. Daardoor kunnen ze met meer zekerheid, precisie en vertrouwen werken met hun eigen cliënten."), "Our students don't just feel what they do — they also understand why it works. This enables them to work with greater confidence, precision, and trust with their own clients.");
  nlToEnMap.set(norm("Meer informatie"), "More information");
  nlToEnMap.set(norm("meer informatie"), "More information");
  nlToEnMap.set(norm("Wil je meer weten over het programma, de inhoud en de aanmelding?"), "Would you like to know more about the programme, the content, and how to enrol?");
  nlToEnMap.set(norm("Bezoek de website van Empower Your Core Academy:"), "Visit the Empower Your Core Academy website:");

  // ── howWeWorkSteps (replaceProcessSection) — texts differ from existing entries ──
  nlToEnMap.set(norm("We bekijken hoe je beweegt en waar je lichaam ondersteuning nodig heeft."), "We look at how you move and where your body needs support.");
  nlToEnMap.set(norm("We trainen doelgericht, afgestemd op jouw lichaam en voortgang."), "We train with purpose, tailored to your body and your progress.");
  nlToEnMap.set(norm("Je ontwikkelt kracht, stabiliteit en lichaamsbewustzijn."), "You develop strength, stability, and body awareness.");

  // ── fixChrisCaseStudyIntro ──
  nlToEnMap.set(norm("Na dertig jaar kampen met een hardnekkige tennisblessure, vond Chris in Pilates de sleutel tot een pijnvrij leven. Ondanks zijn vijftien jaar ervaring zocht hij een expert met diepgaande kennis om zijn praktijk naar een nog hoger niveau te tillen. Zijn verhaal bewijst dat je met de juiste specialistische begeleiding je lichaam op elke leeftijd fundamenteel kunt transformeren."), "After thirty years of struggling with a persistent tennis injury, Chris found in Pilates the key to a pain-free life. Despite fifteen years of experience, he sought an expert with in-depth knowledge to take his practice to the next level. His story proves that with the right specialist guidance, you can fundamentally transform your body at any age.");

  // ── syncJourneyStayConnectedCta ──
  nlToEnMap.set(norm("Blijf verbonden"), "Stay Connected");
  nlToEnMap.set(norm("blijf verbonden"), "Stay Connected");

  // ── interceptContactForm ──
  nlToEnMap.set(norm("Vul alsjeblieft je naam, e-mail en bericht in."), "Please fill in your name, email, and message.");
  nlToEnMap.set(norm("Verzenden..."), "Sending...");
  nlToEnMap.set(norm("Bericht verzonden!"), "Message sent!");
  nlToEnMap.set(norm("Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op."), "Thank you for your message. We will get back to you as soon as possible.");
  nlToEnMap.set(norm("Er is iets misgegaan. Probeer het later opnieuw of stuur een e-mail naar hi@empoweryourcore.com"), "Something went wrong. Please try again later or send an email to hi@empoweryourcore.com");

  // ── HOME_TEACHER_TRAINING_CARD_TEASER ──
  nlToEnMap.set(norm("Word een expert in beweging."), "Become an expert in movement.");
  nlToEnMap.set(norm("word een expert in beweging."), "Become an expert in movement.");

  // ── forcePersonalTrainingHero alt text ──
  nlToEnMap.set(norm("Persoonlijke training bij Empower Your Core®"), "Personal Training at Empower Your Core\u00AE");

  // ── insertHomeBenefitVideo aria-label ──
  nlToEnMap.set(norm("Video-impressie van de Empower Your Core studio"), "Video impression of the Empower Your Core studio");

  // ── fixContactHeadingSpacing ──
  nlToEnMap.set(norm("Bereik ons Anytime"), "Reach Us Anytime");
  nlToEnMap.set(norm("bereik ons anytime"), "Reach Us Anytime");

  // ── applyHomeDocxIntro premium intro ──
  nlToEnMap.set(norm("Gebouwd op 15 jaar ervaring en verdieping. Met bewezen strategieën die je helpen pijn te verminderen, kracht op te bouwen, je mobiliteit te verbeteren en opnieuw met vertrouwen te bewegen."), "Built on 15 years of expertise and depth. Evidence-based strategies that help you reduce pain, build strength, improve mobility, and move with confidence again.");
  nlToEnMap.set(norm("Empower Your Core is geen trend."), "Empower Your Core\u00AE is not a trend.");
  nlToEnMap.set(norm("Het is een methode met blijvende waarde."), "It is a method with lasting value.");
  nlToEnMap.set(norm("Stap binnen in onze privé Pilatesstudio in Utrecht"), "Step into our private Pilates studio in Utrecht");
  nlToEnMap.set(norm("stap binnen in onze privé pilatesstudio in utrecht"), "Step into our private Pilates studio in Utrecht");
  nlToEnMap.set(norm("Volledig uitgerust en afgestemd op jou — waar transformatie begint met bewuste beweging."), "Fully equipped and tailored to you — where transformation begins with mindful movement.");
  nlToEnMap.set(norm("Exclusief. Persoonlijk. Rustig. Doelgericht."), "Exclusive. Personal. Calm. Purposeful.");
  nlToEnMap.set(norm("Plan een intake"), "Book an intake");
  nlToEnMap.set(norm("plan een intake"), "Book an intake");
  nlToEnMap.set(norm("Privésessies • Full Equipment • Utrecht"), "Private sessions \u2022 Full Equipment \u2022 Utrecht");
  nlToEnMap.set(norm("Methode • Evidence-based • 15 jaar"), "Method \u2022 Evidence-based \u2022 15 years");
  nlToEnMap.set(norm("Kernvoordelen"), "Key Benefits");

  // ── Case study regex replacement outputs (Dutch text produced by applyCaseStudyReplacements) ──
  nlToEnMap.set(norm("Met chronische knie-, heup- en rugpijn was Rolf tot aan zijn eerste sessie sceptisch over Pilates."), "Dealing with chronic knee, hip, and back pain, Rolf was a Pilates sceptic until his first session.");
  nlToEnMap.set(norm("Ontdek hoe onze persoonlijke, precieze aanpak hem overtuigde, zijn flexibiliteit terugbracht en hem hielp terugkeren naar een actief, pijnvrij leven."), "See how our personalised, precise approach helped him get hooked, regain flexibility, and return to an active, pain-free lifestyle.");
  nlToEnMap.set(norm("Toen Rolfs vrouw voorstelde om Pilates te proberen, was hij een rasechte scepticus: \"Ik dacht dat het iets zweverigs was,\" geeft hij toe."), "When Rolf's wife suggested he try Pilates, he was a true sceptic, admitting, \"I thought it was something esoteric.\"");
  nlToEnMap.set(norm("Hij kampte met een frustrerende kettingreactie van chronische pijn die begon in zijn knieën en doorstraalde naar zijn heup, met een stijve rug en terugkerende beenpijn tot gevolg."), "He was dealing with a frustrating chain reaction of chronic pain that started in his knees and radiated to his hip, causing a stiff back and frequent leg pain.");
  nlToEnMap.set(norm("Hij zocht een oplossing die de kern van zijn klachten aanpakte en hem zijn actieve levensstijl teruggaf."), "He needed a solution that could address the root cause of his interconnected issues and get him back to the active lifestyle he loved.");
  nlToEnMap.set(norm("Onze doorlopende aanpak is gebouwd op drie principes die voor Rolf doorslaggevend waren:"), "Our ongoing approach is built on the three principles Rolf identified as key to his success:");
  nlToEnMap.set(norm("We wisten dat de eerste sessie Rolfs scepsis moest doorbreken met direct voelbare resultaten."), "We knew the first session had to overcome Rolf's scepticism by delivering undeniable results.");
  nlToEnMap.set(norm("We begeleidden hem door een uitdagende, precieze workout die onmiddellijk de kracht van onze methode bewees."), "We guided him through a challenging, precise workout that immediately demonstrated the power of our method.");
  nlToEnMap.set(norm("Zoals Rolf zegt: \"Ik was erna helemaal kapot... en meteen verkocht.\""), "As Rolf says, he was \"completely done after it... and really got hooked.\"");
  nlToEnMap.set(norm("Precisie: We zien erop toe dat elke oefening met een perfecte techniek wordt uitgevoerd voor maximaal resultaat en veiligheid."), "Precision: We ensure every exercise is performed with perfect form for maximum benefit and safety.");
  nlToEnMap.set(norm("Personalisatie: We ontwerpen een programma op maat, specifiek gericht op het aanpakken van zijn unieke fysieke uitdagingen."), "Personalisation: We design a custom programme tailored specifically to address his unique physical challenges.");
  nlToEnMap.set(norm("Flexibiliteit: We luisteren naar zijn lichaam en passen de sessies in real-time aan om de focus te leggen op wat die dag de meeste aandacht nodig heeft."), "Flexibility: We listen to his body, adjusting sessions in real-time to focus on what needs attention that day.");
  nlToEnMap.set(norm("Rolfs toewijding, gecombineerd met onze persoonlijke aanpak, heeft geleid tot een complete transformatie."), "Rolf's dedication, combined with our tailored approach, has produced a complete transformation.");
  nlToEnMap.set(norm("Hij is niet alleen van zijn chronische pijn af, maar heeft ook een nieuwe basis van kracht en flexibiliteit opgebouwd waar hij nog jaren profijt van zal hebben."), "He has not only resolved his chronic pain but has also built a new foundation of strength and flexibility that will serve him for years to come.");
  nlToEnMap.set(norm("\"Ik kan alle sporten doen die ik naast Pilates wil doen, zonder noemenswaardige pijn.\""), "\"I can do all the sports that I want to do next to Pilates without any big pain.\"");
  nlToEnMap.set(norm("Van een decennialange rugblessure naar herwonnen flexibiliteit: ontdek hoe persoonlijke Pilatestraining Lisa hielp om weer pijnvrij en actief te leven, en zelfs haar golfswing verbeterde."), "From a decades-old spinal injury to renewed flexibility, see how personalised Pilates training helped Lisa reclaim a pain-free, active life and even improved her golf swing.");
  nlToEnMap.set(norm("Bijna vijf decennia lang leefde Lisa met de dagelijkse gevolgen van een zware val in 1972, waarbij haar wervelkolom beschadigd raakte."), "For nearly five decades, Lisa lived with the daily consequences of a severe fall in 1972 that left her with a damaged spinal column.");
  nlToEnMap.set(norm("Ondanks jaren van behandelingen adviseerde haar eigen fysiotherapeut uiteindelijk een actievere aanpak — een methode die haar houding en algehele fysieke conditie fundamenteel zou verbeteren als basis voor blijvende kracht."), "Despite years of treatment, her own physiotherapist eventually recommended a more proactive approach — one that would fundamentally improve her posture and overall physical condition to build a foundation for lasting strength.");
  nlToEnMap.set(norm("Lisa was aanvankelijk sceptisch en plande slechts één proefles."), "Lisa was initially hesitant, planning only a trial session to see what Pilates was about.");
  nlToEnMap.set(norm("Ons doel was direct helder: de complexiteit van haar langdurige blessure doorgronden en een veilige, gecontroleerde omgeving creëren."), "Our immediate goal was to understand the unique complexities of her long-term injury and create a safe, controlled environment for her to explore movement.");
  nlToEnMap.set(norm("We richtten ons op de fundamenten, met een sterke nadruk op precisie en core-activatie om stabiliteit van binnenuit op te bouwen."), "We focused on foundational exercises, emphasising precision and core engagement to build stability from the inside out.");
  nlToEnMap.set(norm("Deze ongevraagde bevestiging uit de echte wereld bewees de directe impact van onze methode."), "This unsolicited, real-world feedback validated the immediate impact of our method.");
  nlToEnMap.set(norm("Wat begon als een enkele proefles, groeide uit tot een toegewijde reis van vier jaar, waarbij elke wekelijkse sessie voortbouwde op de vorige."), "What began as a single trial session quickly evolved into a dedicated, four-year journey of consistent weekly training, with each session building upon the last.");
  nlToEnMap.set(norm("De transformatie is opmerkelijk."), "The transformation has been nothing short of remarkable.");
  nlToEnMap.set(norm("Lisa\u2019s traject is het ultieme bewijs dat het lichaam kan herstellen en sterker kan worden, ongeacht leeftijd of hoe lang een blessure al bestaat."), "Lisa\u2019s journey is a powerful testament to the body\u2019s ability to heal and strengthen, regardless of age or the duration of an injury.");
  nlToEnMap.set(norm("Ze herwon een mate van fysieke vrijheid die ze in decennia niet had gevoeld."), "The benefits have extended far beyond her initial goals, restoring a level of physical freedom she hadn\u2019t felt in decades.");
  nlToEnMap.set(norm("Het meest verrassende compliment kwam onlangs van haar golfinstructeur:"), "The most surprising testament to her progress came from an unexpected source — her golf instructor.");
  nlToEnMap.set(norm("Een tennisblessure op 25-jarige leeftijd bezorgde Chris rugklachten waar hij bijna dertig jaar lang last van hield."), "A tennis injury in his mid-twenties left Chris with a back problem that would trouble him for nearly 30 years.");
  nlToEnMap.set(norm("Na drie decennia vol beperkingen stond hij open voor een nieuwe benadering."), "After three decades of living with the issue, he was open to trying something new.");
  nlToEnMap.set(norm("Toen een vriend hem Pilates aanraadde, ontdekte hij een methode die zijn fysieke welzijn fundamenteel veranderde."), "When a friend suggested Pilates, he discovered a method that would completely reshape his physical wellbeing.");
  nlToEnMap.set(norm("Chris kwam niet als beginner bij ons, maar als een toegewijde beoefenaar met vijftien jaar Pilates-ervaring."), "Chris came to us not as a beginner, but as a dedicated Pilates practitioner of 15 years.");
  nlToEnMap.set(norm("Hij kende de transformerende kracht van de methode al, maar zocht een expert om hem naar het volgende niveau te tillen."), "He had already experienced the transformative power of the method and was now seeking a true expert to guide him on the next phase of his journey.");
  nlToEnMap.set(norm("Hij koos specifiek voor onze studio vanwege een cruciale reden:"), "He specifically chose our studio for a critical reason:");
  nlToEnMap.set(norm("\"Ik koos voor hem omdat ik aan zijn opleiding zag dat hij alle essentiële Pilatestrainingen had gevolgd.\""), "\"I chose him because I could see from his training that he had done all the essential Pilates training.\"");
  nlToEnMap.set(norm("Onze aanpak met Chris is een partnerschap in precisie."), "Our approach with Chris has been a partnership in precision.");
  nlToEnMap.set(norm("We bieden de diepgaande kennis die nodig is om een ervaren cliënt te blijven uitdagen. Samen verfijnen we zijn techniek, verbeteren we zijn fysieke belastbaarheid en werken we gericht naar nieuwe doelen."), "We provide the expert guidance and deep knowledge of the Pilates method required to challenge an experienced client, helping him continue to refine his practice, improve his body, and work towards new goals.");
  nlToEnMap.set(norm("Voor Chris is het resultaat van zijn toewijding een leven zonder de beperkingen van een decennia-oude blessure."), "For Chris, the result of his dedication is a life free from the limitations of a decades-old injury.");
  nlToEnMap.set(norm("Hij noemt zichzelf inmiddels een \"Pilatesfanaat\" en ziet zijn practice als een continu proces van groei."), "He has become a self-described \"Pilates fanatic\" who sees his practice as a \"nonstop, never-ending process\" of improvement.");
  nlToEnMap.set(norm("Zijn verhaal bewijst dat het met de juiste deskundige begeleiding nooit te laat is om een \"totaal nieuw lichaam\" te bereiken."), "His story is a powerful testament to the fact that with the right expert guidance, it is never too late to achieve a \"whole new body.\"");
  nlToEnMap.set(norm("Omdat ze door slopende rug- en beenpijn nauwelijks nog kon lopen, zocht ze een veilige manier om haar kracht weer op te bouwen."), "Barely able to walk due to debilitating back and leg pain, she sought a safe way to rebuild strength.");
  nlToEnMap.set(norm("Ontdek hoe onze persoonlijke een-op-een aanpak snel verlichting gaf en haar vermogen om rechtop en pijnvrij te lopen herstelde."), "See how our personalised, one-on-one approach provided rapid relief and restored her ability to walk upright and pain-free.");
  nlToEnMap.set(norm("Toen onze cliënte voor het eerst bij ons kwam, bevond zij zich in een zware situatie."), "When our client first came to us, she was dealing with a debilitating situation.");
  nlToEnMap.set(norm("Ernstige rugpijn straalde uit naar haar schenen, waardoor lopen zo moeizaam werd dat ze een bewegingsvorm nodig had die kracht opbouwde zonder haar lichaam verder te belasten."), "Severe back pain had radiated to her shins, making it so difficult to walk that she needed a form of exercise that could build strength without adding any further burden to her body.");
  nlToEnMap.set(norm("Vanwege een positieve ervaring met de Reformer, tien jaar eerder, wist ze dat een persoonlijke één-op-één aanpak essentieel was voor haar herstel."), "Recalling a positive experience with Reformer Pilates a decade ago, she knew a personalised, one-on-one approach was essential.");
  nlToEnMap.set(norm("Vanaf het begin lag de focus op een diep begrip van de unieke behoeften van haar lichaam."), "From the start, the focus was on a deep understanding of her body's unique needs.");
  nlToEnMap.set(norm("\"Eén-op-één is heel belangrijk,\" legt ze uit, \"omdat er bij deze methode zoveel aandacht is voor fysiologie en anatomie.\""), "\"One-on-one is very important,\" she notes, \"because so much attention is given to the physiology and anatomy.\"");
  nlToEnMap.set(norm("Onze aanpak was gebaseerd op:\n\u2022 Zorgvuldige observatie: Constant monitoren hoe haar lichaam reageerde op elke beweging.\n\u2022 Core Stability als fundament: Haar leren hoe ze haar diepe kernspieren correct activeert om de rug te ontlasten en het natuurlijke ondersteuningssysteem van haar lichaam te heractiveren."), "Our approach was built on careful observation of her body's reactions and a foundational emphasis on core stability. By teaching her to engage her core correctly, we aimed to relieve the burden on her back and rebuild her body's natural support system.");
  nlToEnMap.set(norm("De vooruitgang was zowel snel als ingrijpend."), "The progress was both rapid and profound.");
  nlToEnMap.set(norm("In slechts twee maanden van consistente, gerichte sessies verdween de chronische pijn die haar mobiliteit beperkte."), "In just two months of consistent, targeted sessions, the chronic pain that had limited her mobility was gone.");
  nlToEnMap.set(norm("Ze loopt nu met een nieuwe, trotse houding, vrij van de rug- en beenpijn die haar zo lang heeft belemmerd."), "She can now walk with a new, upright posture, free from the back and leg pain that had troubled her for so long.");
  nlToEnMap.set(norm("\"Ik heb nu minder last van mijn rug, omdat ik steeds rechter loop... dankzij mijn verbeterde core stability. De pijn in mijn schenen verdween geleidelijk binnen slechts twee maanden.\""), "\"I have less of a backache now, because I walk more and more upright... thanks to my core stability. The pain in my shins gradually went away in just two months.\"");
  nlToEnMap.set(norm("Het keerpunt kwam onverwacht, door feedback uit haar directe omgeving:"), "The turning point came not from within the studio, but from the outside world.");
  nlToEnMap.set(norm("het lijkt alsof je anders loopt en staat"), "It seems as if you're walking and standing differently");
  nlToEnMap.set(norm("Dat zag ik zelf ook, maar ik had diegene niet eens verteld wat er precies met mijn rug aan de hand was."), "I had also seen this myself, but I didn't tell the people whom I had asked if they could see what was wrong with my back.");
  nlToEnMap.set(norm("\"Hij zei vorige week: 'Je moet je swing helemaal niet veranderen. Die is uitstekend. Ik heb nog nooit iemand van jouw leeftijd gezien die zo flexibel is.'\""), "\"He told me last week: 'You shouldn't change your swing at all. Because it's great. I've never seen anyone your age who is that flexible.'\"");
  nlToEnMap.set(norm("projectafbeelding"), "project image");

  // ── Case study titles (titleMap outputs) ──
  nlToEnMap.set(norm("Van een 30 jaar oude rugblessure naar een \"totaal nieuw lichaam\""), "From a 30-Year Back Injury to a \"Whole New Body\"");
  nlToEnMap.set(norm("Van terugkerende rugpijn naar een krachtigere swing"), "From Recurring Back Pain to a Stronger Swing");
  nlToEnMap.set(norm("Van sportmoeheid naar een fascinerende passie"), "From Gym Burnout to a Fascinating Practice");
  nlToEnMap.set(norm("Weer stabiel en pijnvrij in beweging"), "Finding Stability and a Pain-Free Stride");

  // ── Testimonials section ──
  nlToEnMap.set(norm("Ervaringen van onze cliënten"), "Hear from our clients");
  nlToEnMap.set(norm("Deze getuigenissen zijn opgenomen onder onze vorige naam, True and Pure Pilates – nu met trots Empower Your Core."), "These testimonials were recorded under our previous name, True and Pure Pilates — now proudly Empower Your Core.");

  // ── Home story intro / benefit text ──
  nlToEnMap.set(norm("Het aanbod is pas het startpunt."), "What we offer is just the starting point.");
  nlToEnMap.set(norm("het aanbod is pas het startpunt."), "What we offer is just the starting point.");
  nlToEnMap.set(norm("Stap in je kern — de reis begint vandaag"), "Step into your center — the journey starts today");
  nlToEnMap.set(norm("Alles begint in de kern — ook jouw kern?"), "Everything begins at the center — yours too?");
  nlToEnMap.set(norm("alles begint in de kern — ook jouw kern?"), "Everything begins at the center — yours too?");

  // ── Footer ──
  nlToEnMap.set(norm("© 2025 Empower Your Core Alle rechten voorbehouden."), "© 2025 Empower Your Core® All rights reserved.");

  // ── Pricing text ──
  nlToEnMap.set(norm("Losse Persoonlijke training Sessie"), "Single Personal Training Session");
  nlToEnMap.set(norm("Pakket van 10 sessies"), "Package of 10 Sessions");
  nlToEnMap.set(norm("10 Persoonlijke training sessies"), "10 Personal Trainings");

  // ── forceDutchNavLabels outputs ──
  nlToEnMap.set(norm("Home"), "Home");

  // ── replaceProcessSection aria-label ──
  nlToEnMap.set(norm("Hoe wij werken"), "How we work");

  // ── De uitdaging / Het resultaat (case study headings from applyCriticalCopyReplacements) ──
  nlToEnMap.set(norm("De uitdaging"), "Understanding the Challenge");
  nlToEnMap.set(norm("de uitdaging"), "Understanding the Challenge");
  nlToEnMap.set(norm("Bekijk casestudy"), "View Case Study");
  nlToEnMap.set(norm("bekijk casestudy"), "View Case Study");

  // ── Contact page: additional Dutch text ──
  nlToEnMap.set(norm("Vraag een offerte aan"), "Request a quote");
  nlToEnMap.set(norm("vraag een offerte aan"), "Request a quote");

  // ── Case study: combined paragraph text from mobile SSR HTML ──
  // Lisa case study — combined paragraphs (mobile HTML bakes multiple sentences into one <p>)
  nlToEnMap.set(norm("Een rugblessure die haar decennia lang achtervolgde, hield Lisa niet langer tegen. Dankzij persoonlijke Pilates-begeleiding is ze flexibeler dan ooit, geniet ze weer van een actief leven en slaat ze zelfs een betere bal op de golfbaan."), "A spinal injury that haunted her for decades could no longer hold Lisa back. Thanks to personalised Pilates guidance, she is more flexible than ever, enjoys an active life again, and even hits a better ball on the golf course.");
  nlToEnMap.set(norm("Bijna vijf decennia lang leefde Lisa met de dagelijkse gevolgen van een zware val in 1972, waarbij haar wervelkolom beschadigd raakte. Ondanks jaren van behandelingen adviseerde haar eigen fysiotherapeut uiteindelijk een actievere aanpak \u2014 een methode die haar houding en algehele fysieke conditie fundamenteel zou verbeteren als basis voor blijvende kracht."), "For nearly five decades, Lisa lived with the daily consequences of a severe fall in 1972 that left her with a damaged spinal column. Despite years of treatment, her own physiotherapist eventually recommended a more proactive approach \u2014 one that would fundamentally improve her posture and overall physical condition to build a foundation for lasting strength.");
  nlToEnMap.set(norm("Lisa was aanvankelijk sceptisch en plande slechts \u00e9\u00e9n proefles. Ons doel was direct helder: de complexiteit van haar langdurige blessure doorgronden en een veilige, gecontroleerde omgeving cre\u00ebren. We richtten ons op de fundamenten, met een sterke nadruk op precisie en core-activatie om stabiliteit van binnenuit op te bouwen."), "Lisa was initially hesitant, planning only a trial session to see what Pilates was about. Our immediate goal was to understand the unique complexities of her long-term injury and create a safe, controlled environment for her to explore movement. We focused on foundational exercises, emphasising precision and core engagement to build stability from the inside out.");
  nlToEnMap.set(norm("Deze ongevraagde bevestiging uit de echte wereld bewees de directe impact van onze methode. Wat begon als een enkele proefles, groeide uit tot een toegewijde reis van vier jaar, waarbij elke wekelijkse sessie voortbouwde op de vorige."), "This unsolicited, real-world feedback validated the immediate impact of our method. What began as a single trial session quickly evolved into a dedicated, four-year journey of consistent weekly training, with each session building upon the last.");
  nlToEnMap.set(norm("De transformatie is opmerkelijk. Lisa\u2019s traject is het ultieme bewijs dat het lichaam kan herstellen en sterker kan worden, ongeacht leeftijd of hoe lang een blessure al bestaat. Ze herwon een mate van fysieke vrijheid die ze in decennia niet had gevoeld."), "The transformation has been nothing short of remarkable. Lisa\u2019s journey is a powerful testament to the body\u2019s ability to heal and strengthen, regardless of age or the duration of an injury. The benefits have extended far beyond her initial goals, restoring a level of physical freedom she hadn\u2019t felt in decades.");
  nlToEnMap.set(norm("De transformatie is opmerkelijk. Lisa's traject is het ultieme bewijs dat het lichaam kan herstellen en sterker kan worden, ongeacht leeftijd of hoe lang een blessure al bestaat. Ze herwon een mate van fysieke vrijheid die ze in decennia niet had gevoeld."), "The transformation has been nothing short of remarkable. Lisa's journey is a powerful testament to the body's ability to heal and strengthen, regardless of age or the duration of an injury. The benefits have extended far beyond her initial goals, restoring a level of physical freedom she hadn't felt in decades.");
  nlToEnMap.set(norm("Het meest verrassende compliment kwam onlangs van haar golfinstructeur:"), "The most surprising testament to her progress came from an unexpected source \u2014 her golf instructor:");

  // Rolf case study — combined paragraphs (mobile HTML variant)
  nlToEnMap.set(norm("Rolf kampte met chronische pijn in zijn knie, heup en rug en was aanvankelijk behoorlijk sceptisch over Pilates \u2013 tot zijn eerste sessie. Ontdek hoe onze persoonlijke en precieze aanpak hem hielp de smaak te pakken te krijgen, zijn flexibiliteit terug te winnen en weer volop te genieten van een actief, pijnvrij leven."), "Dealing with chronic knee, hip, and back pain, Rolf was a Pilates sceptic until his first session. See how our personalised, precise approach helped him get hooked, regain flexibility, and return to an active, pain-free lifestyle.");
  nlToEnMap.set(norm("Toen Rolfs vrouw voorstelde om Pilates te proberen, was hij een rasechte scepticus. \"Ik dacht dat het iets zweverigs was,\" geeft hij eerlijk toe. Hij kampte met een frustrerende kettingreactie van chronische pijn: die begon in zijn knie\u00ebn en doorstraalde naar zijn heup, met een stijve rug en terugkerende beenpijn tot gevolg. Hij zocht een oplossing die de kern van zijn klachten aanpakte en hem zijn actieve levensstijl teruggaf."), "When Rolf's wife suggested he try Pilates, he was a true sceptic, admitting, \"I thought it was something esoteric.\" He was dealing with a frustrating chain reaction of chronic pain that started in his knees and radiated to his hip, causing a stiff back and frequent leg pain. He needed a solution that could address the root cause of his interconnected issues and get him back to the active lifestyle he loved.");
  nlToEnMap.set(norm("We wisten dat de eerste sessie Rolfs scepsis moest doorbreken met direct voelbare resultaten. We begeleidden hem door een uitdagende, precieze workout die onmiddellijk de kracht van onze methode bewees. Zoals Rolf zelf zegt: hij was na die eerste les \"Ik was erna helemaal kapot... en meteen verkocht.\""), "We knew the first session had to overcome Rolf's scepticism by delivering undeniable results. We guided him through a challenging, precise workout that immediately demonstrated the power of our method. As Rolf says, he was \"completely done after it... and really got hooked.\"");
  nlToEnMap.set(norm("Rolfs toewijding, gecombineerd met onze persoonlijke aanpak, heeft geleid tot een complete transformatie. Hij is niet alleen van zijn chronische pijn af, maar heeft ook een nieuwe basis van kracht en flexibiliteit opgebouwd waar hij nog jaren profijt van zal hebben."), "Rolf's dedication, combined with our tailored approach, has produced a complete transformation. He has not only resolved his chronic pain but has also built a new foundation of strength and flexibility that will serve him for years to come.");

  // Chris case study — combined paragraphs (mobile HTML variant)
  nlToEnMap.set(norm("Een tennisblessure op 25-jarige leeftijd bezorgde Chris rugklachten waar hij bijna dertig jaar lang last van hield. Na drie decennia vol beperkingen stond hij open voor een nieuwe benadering. Toen een vriend hem Pilates aanraadde, ontdekte hij een methode die zijn fysieke welzijn fundamenteel veranderde."), "A tennis injury in his mid-twenties left Chris with a back problem that would trouble him for nearly 30 years. After three decades of living with the issue, he was open to trying something new. When a friend suggested Pilates, he discovered a method that would completely reshape his physical wellbeing.");
  nlToEnMap.set(norm("Chris kwam niet als beginner bij ons, maar als een toegewijde beoefenaar met vijftien jaar Pilates-ervaring. Hij kende de transformerende kracht van de methode al, maar zocht een expert om hem naar het volgende niveau te tillen. Hij koos specifiek voor onze studio vanwege een cruciale reden:"), "Chris came to us not as a beginner, but as a dedicated Pilates practitioner of 15 years. He had already experienced the transformative power of the method and was now seeking a true expert to guide him on the next phase of his journey. He specifically chose our studio for a critical reason:");
  nlToEnMap.set(norm("Onze aanpak met Chris is een partnerschap in precisie. We bieden de diepgaande kennis die nodig is om een ervaren cli\u00ebnt te blijven uitdagen. Samen verfijnen we zijn techniek, verbeteren we zijn fysieke belastbaarheid en werken we gericht naar nieuwe doelen."), "Our approach with Chris has been a partnership in precision. We provide the expert guidance and deep knowledge of the Pilates method required to challenge an experienced client, helping him continue to refine his practice, improve his body, and work towards new goals.");
  nlToEnMap.set(norm("Voor Chris is het resultaat van zijn toewijding een leven zonder de beperkingen van een decennia-oude blessure. Hij noemt zichzelf inmiddels een \"Pilatesfanaat\" en ziet zijn practice als een continu proces van groei. Zijn verhaal bewijst dat het met de juiste deskundige begeleiding nooit te laat is om een \"totaal nieuw lichaam\" te bereiken."), "For Chris, the result of his dedication is a life free from the limitations of a decades-old injury. He has become a self-described \"Pilates fanatic\" who sees his practice as a \"nonstop, never-ending process\" of improvement. His story is a powerful testament to the fact that with the right expert guidance, it is never too late to achieve a \"whole new body.\"");

  // Golfer / Harry case study — combined paragraphs (mobile HTML variant)
  nlToEnMap.set(norm("Een fanatieke golfer werd vier tot vijf keer per jaar volledig uitgeschakeld door ernstige rugklachten. Ontdek hoe ons persoonlijke Pilates-programma zijn pijn deed verdwijnen, het aantal bezoeken aan de chiropractor drastisch verminderde en hem weer vol vertrouwen de baan op hielp."), "An avid golfer was sidelined by severe back problems 4-5 times a year. See how our personalized Pilates program eliminated his pain, dramatically reduced his chiropractor visits, and got him back on the course.");
  nlToEnMap.set(norm("Als fanatiek golfer zat Harry gevangen in een frustrerende cirkel. Vier tot vijf keer per jaar schoot het zo ernstig in zijn rug dat hij alleen met intensieve hulp van de chiropractor weer in beweging kon komen. Deze constante dreiging van pijn en het gebrek aan mobiliteit be\u00efnvloedden niet alleen zijn dagelijks leven, maar hielden hem ook weg van de golfbaan \u2014 de plek waar zijn passie ligt."), "As an avid golfer, Harry was trapped in a frustrating cycle. Severe back problems would flare up four to five times a year, forcing him to see a chiropractor just to get moving again. The constant pain and lack of mobility were not only affecting his daily life but were also keeping him from the sport he loved.");
  nlToEnMap.set(norm("Twee jaar geleden besloot Harry, op aanraden van een vriend, Pilates te proberen als oplossing voor de lange termijn. Onze aanpak was gericht op het doorbreken van de symptoombestrijding en het aanpakken van de werkelijke oorzaak. We ontwikkelden een persoonlijk programma dat zich richtte op posturale correctie \u2014 het systematisch verbeteren van zijn houding \u2014 en functionele core stability: het opbouwen van de noodzakelijke stabiliteit om de explosieve draaibewegingen van zijn golfswing veilig op te vangen."), "Two years ago, a friend recommended Pilates as a long-term solution. Our approach was to move beyond temporary fixes and address the root cause of his issues. We developed a personalised program focused on postural correction \u2014 systematically improving his posture \u2014 and functional core stability: building the foundational stability necessary to support the rotational demands of a golf swing.");
  nlToEnMap.set(norm("De transformatie is een totale game-changer geweest. De frequente, slopende periodes van pijn behoren tot het verleden. Waar hij vroeger meerdere keren per jaar naar de chiropractor moest, is hij de afgelopen twee jaar nog maar \u00e9\u00e9n keer geweest. Vandaag de dag is hij sterker, flexibeler en kan hij weer ongehinderd tillen en sporten."), "The transformation has been a complete game-changer. The frequent, debilitating episodes of pain have vanished. Where he once needed a chiropractor several times a year, he has only needed a single visit in the last two years. Today, Harry is stronger, more flexible, and can lift more without restriction, all while enjoying the game he is passionate about.");

  // Gym burnout / Anneke case study — combined paragraphs (mobile HTML variant)
  nlToEnMap.set(norm("Nadat ze haar motivatie voor de traditionele sportschool volledig was kwijtgeraakt, ontdekte ze een nieuwe passie. Ontdek hoe onze persoonlijke, intu\u00eftieve aanpak sporten veranderde van een verplichting in een fascinerende training waar ze nooit meer een sessie van wil missen."), "After losing motivation for her traditional gym routine, she discovered a new passion. See how our personalized, intuitive approach transformed exercise from a chore into a fascinating practice she never wants to miss.");
  nlToEnMap.set(norm("Nadat ze haar motivatie voor de traditionele sportschool volledig was kwijtgeraakt \u2013 ze draaide soms halverwege de rit haar auto alweer om \u2013 wist onze cli\u00ebnte dat ze een andere aanpak nodig had. Ze zocht een vorm van beweging die niet aanvoelde als de zoveelste verplichting, maar als iets waar ze echt naar uitkeek. De uitdaging was om deze 'sport-burnout' te doorbreken en haar kennis te laten maken met een methode die zowel fysiek effectief als mentaal stimulerend was."), "After losing motivation for her traditional gym routine, often turning her car around halfway there, our client knew she needed a different approach. She was looking for a form of exercise that was not just a chore to be completed, but an engaging practice she would look forward to. The challenge was to overcome this fitness burnout and introduce her to a method that was both physically effective and mentally stimulating.");
  nlToEnMap.set(norm("Vanaf de allereerste proefles lag onze focus op het leggen van een persoonlijke connectie en het tonen van de diepgang van de Empower Your Core methode. De cli\u00ebnte was direct \"gegrepen\" door de intense focus en de tijd die werd genomen om haar achtergrond en interesses te begrijpen. Dit legde een fundament van vertrouwen en betrokkenheid dat een reguliere sportschool simpelweg niet kan bieden."), "From the very first trial session, our focus was on building a personal connection and demonstrating the depth of the Pilates method. The client was immediately \"fascinated\" by the instructor's intense focus and the time he took to understand her personal history and interests. This created a foundation of trust and engagement that a conventional gym couldn't offer.");
  nlToEnMap.set(norm("Onze doorlopende begeleiding is geworteld in intu\u00eftie en precisie. We pakken fysieke klachten direct aan en bieden gerichte oefeningen die blokkades ter plekke verhelpen. Dit maakt van elke sessie een productieve en verhelderende ervaring."), "Our ongoing approach is rooted in this intuitive and precise guidance. We address physical issues in real-time, providing targeted exercises that resolve blockages on the spot, turning each session into a productive and enlightening experience.");
  nlToEnMap.set(norm("De transformatie is bewonderenswaardig. Wat begon als een proefles is uitgegroeid tot een vaste wekelijkse afspraak die ze voor geen goud wil missen. Ze heeft niet alleen een duurzame routine gevonden, maar heeft ook een diepe waardering gekregen voor de intelligentie achter de methode. Ze heeft geleerd naar haar lichaam te luisteren en vertrouwt erop dat elk ongemak tijdens de sessie kan worden aangepakt."), "The transformation has been remarkable. What began as a trial has blossomed into a consistent, can't-miss weekly appointment. Our client has not only found a sustainable fitness routine but has also discovered a deep appreciation for the intelligence of the Pilates method. She has learned to listen to her body and trusts that any issue she feels can be addressed and resolved within her session.");
  nlToEnMap.set(norm("Het krachtigste resultaat is de verandering in haar mindset: sporten is niet langer een verplichting, maar een fascinerende ontdekkingsreis."), "The most powerful result is the shift in mindset: exercise is no longer a chore to be avoided, but a fascinating journey of discovery she is excited to continue.");

  // Pain-free stride / Charetti case study — combined paragraphs (mobile HTML variant)
  nlToEnMap.set(norm("Ze kon nauwelijks nog lopen door de slopende pijn in haar rug en benen en zocht wanhopig naar een veilige manier om weer kracht op te bouwen. Ontdek hoe onze persoonlijke \u00e9\u00e9n-op-\u00e9\u00e9n begeleiding voor een snel herstel zorgde en hoe ze haar vermogen terugkreeg om weer rechtop en zonder pijn door het leven te gaan."), "Barely able to walk due to debilitating back and leg pain, she sought a safe way to rebuild strength. See how our personalised, one-on-one approach provided rapid relief and restored her ability to walk upright and pain-free.");
  nlToEnMap.set(norm("Toen onze cli\u00ebnte voor het eerst bij ons kwam, bevond zij zich in een zware situatie. Ernstige rugpijn straalde uit naar haar schenen, waardoor lopen zo moeizaam werd dat ze een bewegingsvorm nodig had die kracht opbouwde zonder haar lichaam verder te belasten. Vanwege een positieve ervaring met de Reformer, tien jaar eerder, wist ze dat een persoonlijke \u00e9\u00e9n-op-\u00e9\u00e9n aanpak essentieel was voor haar herstel."), "When our client first came to us, she was dealing with a debilitating situation. Severe back pain had radiated to her shins, making it so difficult to walk that she needed a form of exercise that could build strength without adding any further burden to her body. Recalling a positive experience with Reformer Pilates a decade ago, she knew a personalised, one-on-one approach was essential.");
  nlToEnMap.set(norm("Onze aanpak was gebaseerd op zorgvuldige observatie \u2014 constant monitoren hoe haar lichaam reageerde op elke beweging \u2014 en core stability als fundament: haar leren hoe ze haar diepe kernspieren correct activeert om de rug te ontlasten en het natuurlijke ondersteuningssysteem van haar lichaam te heractiveren."), "Our approach was built on careful observation \u2014 constantly monitoring how her body reacted to each movement \u2014 and core stability as a foundation: teaching her to engage her deep core muscles correctly to relieve the burden on her back and reactivate her body's natural support system.");
  nlToEnMap.set(norm("De vooruitgang was zowel snel als ingrijpend. In slechts twee maanden van consistente, gerichte sessies verdween de chronische pijn die haar mobiliteit beperkte. Ze loopt nu met een nieuwe, trotse houding, vrij van de rug- en beenpijn die haar zo lang heeft belemmerd."), "The progress was both rapid and profound. In just two months of consistent, targeted sessions, the chronic pain that had limited her mobility was gone. She can now walk with a new, upright posture, free from the back and leg pain that had troubled her for so long.");

  // ── Missing individual sentence from caseStudyRegexReplacements (line 1069) ──
  nlToEnMap.set(norm("Door haar te leren haar core correct te activeren, wilden we haar rug ontlasten en het natuurlijke ondersteuningssysteem van haar lichaam opnieuw opbouwen."), "By teaching her to engage her core correctly, we aimed to relieve the burden on her back and rebuild her body's natural support system.");

  // ── Quoted text from mobile HTML that combines multiple sentences ──
  nlToEnMap.set(norm("\"Meteen zei iemand: 'Het lijkt alsof je anders loopt en staat.' Dat zag ik zelf ook, maar ik had diegene niet eens verteld wat er precies met mijn rug aan de hand was.\""), "\"Immediately, someone in my circle said: 'It seems as if you're walking and standing differently.' I had also seen this myself, but I didn't tell the people whom I had asked if they could see what was wrong with my back.\"");

  // "Deze getuigenissen" disclaimer with ® variants (appears on all case study pages)
  nlToEnMap.set(norm("Deze getuigenissen zijn opgenomen onder onze vorige naam, True and Pure Pilates \u2013 nu met trots Empower Your Core\u00AE."), "These testimonials were recorded under our previous name, True and Pure Pilates \u2014 now proudly Empower Your Core\u00AE.");
  nlToEnMap.set(norm("\"Deze getuigenissen zijn opgenomen onder onze vorige naam, True and Pure Pilates \u2013 nu met trots Empower Your Core\u00AE.\""), "\"These testimonials were recorded under our previous name, True and Pure Pilates \u2014 now proudly Empower Your Core\u00AE.\"");
  nlToEnMap.set(norm("\"Deze getuigenissen zijn opgenomen onder onze vorige naam, True and Pure Pilates \u2013 nu met trots Empower Your Core.\""), "\"These testimonials were recorded under our previous name, True and Pure Pilates \u2014 now proudly Empower Your Core.\"");
  nlToEnMap.set(norm("\u201CDeze getuigenissen zijn opgenomen onder onze vorige naam, True and Pure Pilates \u2013 nu met trots Empower Your Core\u00AE.\u201D"), "\u201CThese testimonials were recorded under our previous name, True and Pure Pilates \u2014 now proudly Empower Your Core\u00AE.\u201D");

  // Personal training page - combined paragraphs with ® variants
  nlToEnMap.set(norm("Bij Empower Your Core\u00AE bieden we persoonlijke begeleiding die volledig is afgestemd op jouw lichaam, behoeften en doelen. Onze Persoonlijke training is ontworpen om jouw kracht, mobiliteit en lichaamsbewustzijn te verbeteren op een manier die perfect bij jou past."), "At Empower Your Core\u00AE, we offer personalised guidance tailored specifically to your body, needs, and goals. Our Personal Training is uniquely designed to enhance your strength, mobility, and body awareness in a way that perfectly suits you.");
  nlToEnMap.set(norm("Neem vandaag nog contact met ons op en ontdek wat Persoonlijke training bij Empower Your Core\u00AE voor jou kan betekenen."), "Contact us today and find out what Personal Training at Empower Your Core\u00AE can do for you!");
  nlToEnMap.set(norm("Je krijgt een-op-een aandacht van een ervaren trainer die je helpt om bewegingen en technieken op een natuurlijke en veilige manier uit te voeren. Samen werken we aan het versterken van je lichaam, het vergroten van je flexibiliteit en het voorkomen van blessures."), "You'll receive one-on-one attention from an expert trainer who will help you perform movements and techniques naturally and safely. Together, we work on strengthening your body, increasing your flexibility, and preventing injuries.");
  nlToEnMap.set(norm("Of je nu specifieke doelen hebt, herstelt van een blessure, of simpelweg de voorkeur geeft aan individuele begeleiding - wij zorgen ervoor dat elke sessie aansluit bij jouw unieke situatie. Ontdek de voordelen van persoonlijke training en ervaar hoe snel je resultaat kunt behalen."), "Whether you have specific goals, are recovering from an injury, or simply prefer individual attention, we ensure each session meets your unique circumstances. Discover the benefits of personal training and experience how quickly you achieve results.");

  // Gym burnout (Anneke) combined paragraphs
  nlToEnMap.set(norm("Vanaf de allereerste proefles lag onze focus op het leggen van een persoonlijke connectie en het tonen van de diepgang van de Empower Your Core\u00AE methode. De cli\u00ebnte was direct gegrepen door de intense focus en de tijd die werd genomen om haar achtergrond en interesses te begrijpen. Dit legde een fundament van vertrouwen en betrokkenheid dat een reguliere sportschool simpelweg niet kan bieden."), "From the very first trial session, our focus was on building a personal connection and demonstrating the depth of the Empower Your Core\u00AE method. The client was immediately fascinated by the instructor's intense focus and the time he took to understand her personal history and interests. This created a foundation of trust and engagement that a conventional gym couldn't offer.");
  nlToEnMap.set(norm("Vanaf de allereerste proefles lag onze focus op het leggen van een persoonlijke connectie en het tonen van de diepgang van de Empower Your Core methode. De cli\u00ebnte was direct gegrepen door de intense focus en de tijd die werd genomen om haar achtergrond en interesses te begrijpen. Dit legde een fundament van vertrouwen en betrokkenheid dat een reguliere sportschool simpelweg niet kan bieden."), "From the very first trial session, our focus was on building a personal connection and demonstrating the depth of the Empower Your Core method. The client was immediately fascinated by the instructor's intense focus and the time he took to understand her personal history and interests. This created a foundation of trust and engagement that a conventional gym couldn't offer.");

  // Rolf combined paragraphs (desktop variant - 3 sentences merged into one text node)
  nlToEnMap.set(norm("Toen Rolfs vrouw voorstelde om Pilates te proberen, was hij een rasechte scepticus: \"Ik dacht dat het iets zweverigs was,\" geeft hij toe. Hij kampte met een frustrerende kettingreactie van chronische pijn die begon in zijn knie\u00ebn en doorstraalde naar zijn heup, met een stijve rug en terugkerende beenpijn tot gevolg. Hij zocht een oplossing die de kern van zijn klachten aanpakte en hem zijn actieve levensstijl teruggaf."), "When Rolf's wife suggested he try Pilates, he was a true sceptic, admitting, \"I thought it was something esoteric.\" He was dealing with a frustrating chain reaction of chronic pain that started in his knees and radiated to his hip, causing a stiff back and frequent leg pain. He needed a solution that could address the root cause of his interconnected issues and get him back to the active lifestyle he loved.");
  nlToEnMap.set(norm("We wisten dat de eerste sessie Rolfs scepsis moest doorbreken met direct voelbare resultaten. We begeleidden hem door een uitdagende, precieze workout die onmiddellijk de kracht van onze methode bewees. Zoals Rolf zegt: \"Ik was erna helemaal kapot... en meteen verkocht.\""), "We knew that the first session had to break through Rolf's scepticism with immediately tangible results. We guided him through a challenging, precise workout that immediately demonstrated the power of our method. As Rolf says: \"I was completely exhausted afterwards... and immediately hooked.\"");

  // Build reverse titleMap for EN mode
  var reverseTitleMap = new Map();
  titleMap.forEach(function(dutchVal, englishKey) {
    reverseTitleMap.set(norm(dutchVal), englishKey);
  });

  function rewriteTitles(root) {
    if (!root || !root.querySelectorAll) return;
    const headers = root.querySelectorAll("h2");
    headers.forEach((h2) => {
      const key = norm(h2.textContent || "");

      var replacement;
      if (eycLang === "en") {
        replacement = reverseTitleMap.get(key);
      } else {
        replacement = titleMap.get(key);
      }
      if (!replacement) return;
      var sm = h2.innerHTML.match(/(<span[^>]*>)([^<]*)(<\/span>)/);
      if (!sm) {
        h2.textContent = replacement;
        return;
      }
      h2.innerHTML = replacement.split(" ").map(function(w) { return sm[1] + w + sm[3]; }).join(" ");
    });
  }

  function addRegisteredBrandMarks(text) {
    if (!text) return text;
    let next = text;
    next = next.replace(/Empower Your Core(?!\s*®)/gi, (match) => `${match}®`);
    next = next.replace(/\bEYC\b(?!\s*®)(?![-./@])/g, "EYC®");
    next = next.replace(/®(?=[A-Za-zÀ-ÿ0-9])/g, "® ");
    return next;
  }

  function getFirstRenderableTextNode(node) {
    if (!node) return null;
    if (node.nodeType === Node.TEXT_NODE) return node;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const tag = node.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return null;

    for (const child of node.childNodes) {
      const match = getFirstRenderableTextNode(child);
      if (match) return match;
    }

    return null;
  }

  function getLastRenderableText(node) {
    if (!node) return "";
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const tag = node.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return "";

    for (let index = node.childNodes.length - 1; index >= 0; index -= 1) {
      const text = getLastRenderableText(node.childNodes[index]);
      if (text) return text;
    }

    return "";
  }

  function normalizeRegisteredBrandSpacing(root) {
    if (!root) return;

    const containers = [];
    if (root.nodeType === Node.ELEMENT_NODE) {
      containers.push(root);
      if (root.querySelectorAll) containers.push(...root.querySelectorAll("*"));
    } else if (root.parentElement) {
      containers.push(root.parentElement);
    }

    const seen = new Set();
    containers.forEach((container) => {
      if (!container || seen.has(container)) return;
      seen.add(container);

      const children = Array.from(container.childNodes || []);
      for (let index = 1; index < children.length; index += 1) {
        const prevText = getLastRenderableText(children[index - 1]).replace(/[\s\u00A0\u202F]+$/g, "");
        if (!prevText.endsWith("®")) continue;

        const firstTextNode = getFirstRenderableTextNode(children[index]);
        if (!firstTextNode) continue;

        const current = firstTextNode.textContent || "";
        if (!current) continue;
        if (/^[\s\u00A0\u202F]/.test(current)) continue;
        if (!/^[A-Za-zÀ-ÿ0-9]/.test(current)) continue;

        firstTextNode.textContent = ` ${current}`;
      }
    });
  }

  function translateTextNode(node) {
    if (!node || !node.textContent) return;
    // EN mode: after initial sweep, skip per-node translation to prevent ping-pong
    // (translateTextNode converts EN→NL, sweepToEnglish converts NL→EN, infinite loop)
    /* EN: translate runs normally; sweepToEnglish converts back */
    var current = node.textContent;
    var key = norm(current);
    var trimmed = key.trim();
    if (!trimmed) return;

    var translated, next;

    // NL mode: existing behavior (English→Dutch)
    translated = map.get(key) || lowerMap.get(key.toLowerCase());
    next = addRegisteredBrandMarks(translated || current);
    if (next !== current) node.textContent = next;
  }

  function translateAttrs(el) {
    if (!el || !el.getAttribute) return;
    /* EN: translate runs normally; sweepToEnglish converts back */
    var attrNames = ['placeholder', 'aria-label', 'title', 'alt', 'value'];
    for (var i = 0; i < attrNames.length; i++) {
      var attr = attrNames[i];
      var v = el.getAttribute(attr);
      if (!v) continue;
      var key = norm(v);
      var trimmed = key.trim();
      if (!trimmed) continue;

      var translated, next;

      // NL mode
      translated = map.get(key) || lowerMap.get(key.toLowerCase());
      next = addRegisteredBrandMarks(translated || v);
      if (next !== v) el.setAttribute(attr, next);
    }
  }

  function translateTree(root) {
    /* EN: translate runs normally; sweepToEnglish converts back */
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let node;
    while ((node = walker.nextNode())) {
      translateTextNode(node);
    }

    const elements = root.querySelectorAll('[placeholder], [aria-label], [title], [alt], [value]');
    elements.forEach(translateAttrs);
    rewriteTitles(root);
  }

  function enforceRegisteredBranding() {
    const nextTitle = addRegisteredBrandMarks(document.title || "");
    if (nextTitle && nextTitle !== document.title) document.title = nextTitle;

    const metaTags = document.head ? document.head.querySelectorAll("meta[content]") : [];
    metaTags.forEach((meta) => {
      const current = meta.getAttribute("content") || "";
      if (!current) return;
      if (/^(https?:|mailto:|tel:)/i.test(current)) return;
      const next = addRegisteredBrandMarks(current);
      if (next !== current) meta.setAttribute("content", next);
    });

    normalizeRegisteredBrandSpacing(document.body);
  }

  const introVideoSrc = "/assets/Intro_Video.mp4";
  const outroVideoSrc = "/assets/Outro_Video.mp4";
  function fixVideos(root) {
    if (!root || !root.querySelectorAll) return;
    const videos = root.querySelectorAll("video");
    videos.forEach((video, index) => {
      if (video.dataset && video.dataset.eycVideoLock === "true") return;
      const desiredSrc = index === 0 ? introVideoSrc : outroVideoSrc;
      let updated = false;
      const current = video.getAttribute("src") || "";
      if (current !== desiredSrc) {
        video.setAttribute("src", desiredSrc);
        updated = true;
      }
      const sources = video.querySelectorAll("source");
      sources.forEach((source) => {
        const src = source.getAttribute("src") || "";
        if (src !== desiredSrc) {
          source.setAttribute("src", desiredSrc);
          updated = true;
        }
      });
      if (updated && typeof video.load === "function") {
        video.load();
      }
    });
  }

  /* ── Unmute YouTube testimonial iframes ── */
  function fixYouTubeMute(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('iframe[src*="youtube.com/embed/"]').forEach(function (iframe) {
      var src = iframe.getAttribute("src") || "";
      if (src.indexOf("mute=1") !== -1) {
        iframe.setAttribute("src", src.replace(/&mute=1/g, "").replace(/\?mute=1&?/, "?"));
      }
    });
  }

  function fixLinks(root) {
    if (!root || !root.querySelectorAll) return;
    const anchors = root.querySelectorAll("a[href]");
    anchors.forEach((a) => {
      const href = a.getAttribute("href");
      if (!href) return;
      if (/^(https?:|mailto:|tel:|#)/i.test(href)) return;

      let next = href;
      const defaultWorks = "works/lisa-pilates-injury-recovery-story.html";

      if (href.startsWith("./works/")) {
        const rest = href.slice("./works/".length);
        if (rest && !rest.endsWith(".html")) next = `./works/${rest}.html`;
      } else if (href.startsWith("/works/")) {
        const rest = href.slice("/works/".length);
        if (rest && !rest.endsWith(".html")) next = `/works/${rest}.html`;
      } else if (href === "/works") {
        next = `/${defaultWorks}`;
      } else if (href.startsWith("works/")) {
        const rest = href.slice("works/".length);
        if (rest && !rest.endsWith(".html")) next = `works/${rest}.html`;
      } else if (href === "works" || href === "works/") {
        next = defaultWorks;
      } else if (href === "./works" || href === "./works/") {
        next = `./${defaultWorks}`;
      } else if (href === "../works" || href === "../works/") {
        next = `../${defaultWorks}`;
      } else if (href === "./pricing" || href === "/pricing" || href === "pricing") {
        next = href.replace("pricing", "pricing.html");
      } else if (href === "../pricing") {
        next = "../pricing.html";
      } else if (href === "./contact" || href === "/contact" || href === "contact") {
        next = href.replace("contact", "contact.html");
      } else if (href === "../contact") {
        next = "../contact.html";
      }

      if (next !== href) a.setAttribute("href", next);
    });
  }

  const INSTAGRAM_URL = eycLang === "en"
    ? "https://www.instagram.com/empowerbymo/"
    : "https://www.instagram.com/empoweryourcore.nl/";
  function fixSocialLinks(root) {
    if (!root || !root.querySelectorAll) return;
    const anchors = root.querySelectorAll("a[href]");
    anchors.forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (!/instagram\.com/i.test(href)) return;
      if (href === INSTAGRAM_URL) return;
      a.setAttribute("href", INSTAGRAM_URL);
      if (!a.getAttribute("target")) a.setAttribute("target", "_blank");
      const rel = a.getAttribute("rel") || "";
      if (!/noopener/i.test(rel)) a.setAttribute("rel", "noopener");
    });
  }

  const forcedDutchNav = new Map([
    ["testimonials", "Ervaringen"],
    ["testimonial", "Ervaringen"],
    ["about us", "Over Ons"],
    ["about", "Over Ons"],
    ["works", "Ervaringen"],
    ["work", "Ervaringen"],
    ["start", "Home"],
  ]);

  function forceDutchNavLabels(root) {
    /* lang-aware: fix functions run for both NL and EN */
    if (!root || !root.querySelectorAll) return;

    const textNodes = root.querySelectorAll("a, button, p, h1, h2, h3, h4, h5, h6, span");
    textNodes.forEach((el) => {
      const text = norm(el.textContent || "");
      if (!text || text.length > 24) return;
      const val = forcedDutchNav.get(text.toLowerCase());
      if (val && text !== val) el.textContent = val;
    });

    const attrs = root.querySelectorAll("[aria-label], [title]");
    attrs.forEach((el) => {
      ["aria-label", "title"].forEach((attr) => {
        const raw = el.getAttribute(attr);
        if (!raw) return;
        const text = norm(raw);
        const val = forcedDutchNav.get(text.toLowerCase());
        if (val && text !== val) el.setAttribute(attr, val);
      });
    });

    root.querySelectorAll("a[href]").forEach((a) => {
      const href = (a.getAttribute("href") || "").trim();
      if (!/^(\/|\.\/|\.\.\/)?$/.test(href)) return;
      const text = norm(a.textContent || "").toLowerCase();
      if (text === "start" || text === "main" || text === "hoofd") {
        a.textContent = "Home";
      }
    });
  }

  function applyCriticalCopyReplacements(text) {
    if (!text) return text;
    let next = text;
    const replacements = [
      [/\bTestimonials\b/gi, "Ervaringen"],
      [/\bTestimonial\b/gi, "Ervaringen"],
      [/\bAbout\s+Us\b/gi, "Over Ons"],
      [/\bOur Founder\s*&\s*Visie\b/gi, "De Oprichter & De Visie"],
      [/\bOur Founder\s*&\s*Vision\b/gi, "De Oprichter & De Visie"],
      [/\bFounder\s*&\s*Vision\b/gi, "De Oprichter & De Visie"],
      [/\bFounder and Vision\b/gi, "De Oprichter & De Visie"],
      [/\bOprichter en Visie\b/gi, "De Oprichter & De Visie"],
      [/\bOur Method\b/gi, "Onze Methode"],
      [/\bOur Methode\b/gi, "Onze Methode"],
      [/Discover the story behind Empower Your Core\.\s*Learn how founder Mohammed Rahali evolved classical Pilates into an innovative, evidence-based practice focused on meaningful movement and lasting results\./gi, "Ontdek het verhaal achter Empower Your Core. Lees hoe oprichter Mohammed klassieke Pilates doorontwikkelde tot een innovatieve, evidence-based methode gericht op betekenisvolle beweging en blijvende resultaten."],
      [/Empower Your Core was developed by Mohammed Rahali, a method developer and entrepreneur\./gi, "Empower Your Core is ontwikkeld door Mohammed, methodeontwikkelaar en ondernemer."],
      [/Born and raised in the Netherlands, Mohammed encountered the classical Pilates method in Los Angeles\./gi, "Geboren en opgegroeid in Nederland kwam Mohammed in Los Angeles voor het eerst in aanraking met de klassieke Pilatesmethode."],
      [/After intensive training, founding his own studio, True and Pure Pilates, and years of practical experience, he became convinced it was time for innovation\./gi, "Na intensieve opleiding, het oprichten van zijn eigen studio True and Pure Pilates, en jarenlange praktijkervaring, raakte hij ervan overtuigd dat het tijd was voor innovatie."],
      [/Combining hands-on experience with deep curiosity about anatomy, biomechanics, and modern training principles, Mohammed recognised the limitations of classical Pilates\./gi, "Door zijn praktische expertise te combineren met een diepe nieuwsgierigheid naar anatomie, biomechanica en moderne trainingsprincipes, zag Mohammed de beperkingen van klassieke Pilates."],
      [/He envisioned a broader, smarter, and more effective method\./gi, "Hij ontwikkelde een bredere, slimmere en effectievere methode."],
      [/We live in an era where critical thinking, autonomy, and evidence-based practices are essential\./gi, "We leven in een tijd waarin kritisch denken, autonomie en evidence-based praktijken essentieel zijn."],
      [/Empower Your Core translates scientific findings into effective, practical training methods\./gi, "Empower Your Core vertaalt wetenschappelijke inzichten naar effectieve, toepasbare trainingsmethoden."],
      [/The method provides a clear alternative to rigid movement systems\./gi, "De methode biedt een helder alternatief voor rigide bewegingssystemen."],
      [/No dogmas\.\s*No repetition for repetition[’']?s sake\.\s*Just meaningful movement[—-]focused on strength, awareness, and freedom\./gi, "Geen dogma's. Geen herhaling om de herhaling. Alleen betekenisvolle beweging - gericht op kracht, bewustzijn en vrijheid."],
      [/\bMission\b/gi, "Missie"],
      [/Our mission at Empower Your Core is to promote strength, mobility, and body awareness through a scientifically grounded, holistic approach to movement\./gi, "De missie van Empower Your Core is het bevorderen van kracht, mobiliteit en lichaamsbewustzijn via een wetenschappelijk gefundeerde en holistische benadering van beweging."],
      [/We aim to empower individuals to understand and strengthen their bodies by performing movements intentionally and finding a balance between strength and flexibility\./gi, "Wij willen mensen helpen hun lichaam beter te begrijpen en te versterken door beweging bewust uit te voeren en een balans te vinden tussen kracht en flexibiliteit."],
      [/\bVision\b/gi, "Visie"],
      [/Empower Your Core draws insights from various movement systems but always starts from the body itself\./gi, "Empower Your Core haalt inspiratie uit verschillende bewegingssystemen, maar vertrekt altijd vanuit het lichaam zelf."],
      [/What we incorporate from existing systems is translated into functional strength, coordination, and mobility\./gi, "Wat we uit bestaande systemen meenemen, vertalen we naar functionele kracht, coordinatie en mobiliteit."],
      [/The body dictates what(?:'|’)s necessary, not rigid forms\./gi, "Het lichaam bepaalt wat nodig is - niet een vaste vorm."],
      [/Many traditional methods emphasise standardi[sz]ed movements and fixed forms\./gi, "Veel traditionele methoden leggen de nadruk op gestandaardiseerde bewegingen en vaste patronen."],
      [/At Empower Your Core, we believe each person is unique and that the body provides the best guidance on effective movements and approaches\./gi, "Bij Empower Your Core geloven we dat ieder lichaam uniek is, en dat het lichaam zelf de beste richting geeft voor effectieve beweging."],
      [/Instead of rigidly following techniques, we focus on cultivating deeper body awareness and listening to what the body needs at each moment\./gi, "In plaats van technieken rigide te volgen, richten wij ons op het ontwikkelen van dieper lichaamsbewustzijn en het leren luisteren naar wat het lichaam op elk moment nodig heeft."],
      [/This makes (?:our method|Onze Methode|onze methode) not only flexible but also respectful of the body[‘\u2018\u2019\x27]s natural movements\./gi, "Hierdoor is onze methode niet alleen flexibel, maar ook respectvol naar de natuurlijke beweging van het lichaam."],
      [/\bCore Values\b/gi, "Kernwaarden"],
      [/\bAuthenticity\b/gi, "Authenticiteit"],
      [/\bCustomi[sz]ation\b/gi, "Maatwerk"],
      [/\bScientific Foundation\b/gi, "Wetenschappelijke basis"],
      [/\bPassion\b/gi, "Passie"],
      [/Authenticity:\s*Always remain true to yourself and your body\.?/gi, "Authenticiteit: Altijd trouw blijven aan jezelf en aan je lichaam."],
      [/Customi[sz]ation:\s*Each body is unique, thus every training program is individually tailored\.?/gi, "Maatwerk: Elk lichaam is uniek - daarom wordt elk trainingsprogramma persoonlijk afgestemd."],
      [/Scientific Foundation:\s*All our methods are grounded in the latest scientific research\.?/gi, "Wetenschappelijke basis: Onze methode is gebaseerd op de nieuwste inzichten uit onderzoek en praktijk."],
      [/Passion:\s*We enthusiastically share our love and passion for movement with our clients\.?/gi, "Passie: Wij delen onze liefde voor beweging met enthousiasme en toewijding met onze clienten."],
      [/Empower Your Core is geen trend, maar een methode met blijvende waarde\.\s*Gebouwd op 15 jaar expertise en verdieping\.\s*Evidence-based strategiee?n die je helpen pijn te verminderen, kracht op te bouwen, mobiliteit te verbeteren en opnieuw met vertrouwen te bewegen\./gi, "Empower Your Core is geen trend, maar een duurzame methode. Ontstaan uit 15 jaar ervaring en verdieping. Een aanpak gebaseerd op bewezen strategieën die je helpen pijn te verminderen, sterker te worden, soepeler te bewegen en opnieuw vertrouwen in je lichaam te krijgen."],
      [/is geen trend, maar een methode met blijvende waarde\.\s*Gebouwd op 15 jaar expertise en verdieping\.\s*Evidence-based strategiee?n die je helpen pijn te verminderen, kracht op te bouwen, mobiliteit te verbeteren en opnieuw met vertrouwen te bewegen\./gi, "is geen trend, maar een duurzame methode. Ontstaan uit 15 jaar ervaring en verdieping. Een aanpak gebaseerd op bewezen strategieën die je helpen pijn te verminderen, sterker te worden, soepeler te bewegen en opnieuw vertrouwen in je lichaam te krijgen."],
      [/Empower Your Core is geen trend, maar een duurzame methode\.\s*Ontstaan uit 15 jaar ervaring en verdieping\.\s*Een aanpak gebaseerd op bewezen strategiee?n die je helpen pijn te verminderen, sterker te worden, soepeler te bewegen en opnieuw vertrouwen in je lichaam te krijgen\./gi, "Empower Your Core is geen trend, maar een duurzame methode. Ontstaan uit 15 jaar ervaring en verdieping. Een aanpak gebaseerd op bewezen strategieën die je helpen pijn te verminderen, sterker te worden, soepeler te bewegen en opnieuw vertrouwen in je lichaam te krijgen."],
      [/Stap binnen in onze privé Pilates Studio in Utrecht/gi, "Ontdek onze exclusieve privé Pilatesstudio in Utrecht."],
      [/Ontdek onze exclusieve privé Pilatesstudio in Utrecht\./gi, "Ontdek onze exclusieve privé Pilatesstudio in Utrecht."],
      [/- Volledig uitgerust en afgestemd op jou - waar transformatie begint met bewuste beweging/gi, "Een volledig uitgeruste omgeving, zorgvuldig afgestemd op jouw lichaam – waar transformatie start met bewuste beweging."],
      [/Een volledig uitgeruste omgeving,\s*zorgvuldig afgestemd op jouw lichaam\s*-\s*waar transformatie begint met bewuste beweging\./gi, "Een volledig uitgeruste omgeving, zorgvuldig afgestemd op jouw lichaam – waar transformatie start met bewuste beweging."],
      [/bewezen strategieen/gi, "bewezen strategieën"],
      [/exclusieve prive Pilatesstudio/gi, "exclusieve privé Pilatesstudio"],
      [/jouw lichaam\s*-\s*waar transformatie start met bewuste beweging/gi, "jouw lichaam – waar transformatie start met bewuste beweging"],
      [/\bThe challenge\b/gi, "De uitdaging"],
      [/\bOur approach\b/gi, "Onze aanpak"],
      [/\bThe result\b/gi, "Het resultaat"],
      [/\bThe results\b/gi, "Het resultaat"],
      [/\bView Casestudy\b/gi, "Bekijk casestudy"],
      [/\bView Case Study\b/gi, "Bekijk casestudy"],
    ];

    replacements.forEach(([pattern, replacement]) => {
      next = next.replace(pattern, replacement);
    });
    return next;
  }

  function forceDutchCriticalCopy(root) {
    /* lang-aware: fix functions run for both NL and EN */
    if (!root) return;
    walkTextNodes(root, (node) => {
      const current = node.textContent || "";
      if (!current) return;
      const next = applyCriticalCopyReplacements(current);
      if (next !== current) node.textContent = next;
    });

    if (root.querySelectorAll) {
      root.querySelectorAll("[aria-label], [title]").forEach((el) => {
        ["aria-label", "title"].forEach((attr) => {
          const raw = el.getAttribute(attr);
          if (!raw) return;
          const next = applyCriticalCopyReplacements(raw);
          if (next !== raw) el.setAttribute(attr, next);
        });
      });
    }
  }

  const ABOUT_US_PAGE_VERSION = "2026-03-22-founder-photo";
  const ABOUT_US_TITLE_HTML = `<h2 style="--font-selector:RlI7SW50ZXJEaXNwbGF5LU1lZGl1bQ==;--framer-font-family:'Inter Display', 'Inter Display Placeholder', sans-serif;--framer-font-open-type-features:'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on;--framer-font-size:clamp(28px, 3.5vw, 52px);--framer-font-weight:500;--framer-letter-spacing:-0.04em;--framer-line-height:120%;--framer-text-color:var(--token-b5fea8a8-bc55-41f8-b49e-19319ef24b24, rgb(255, 255, 255))" class="framer-text">De Oprichter &amp; De Visie</h2>`;
  const ABOUT_US_INTRO_HTML = `
    <p class="framer-text" style="--font-selector: RlI7SW50ZXJEaXNwbGF5; --framer-font-family: &quot;Inter Display&quot;, &quot;Inter Display Placeholder&quot;, sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: clamp(14px, 1.2vw, 18px); --framer-letter-spacing: -0.04em; --framer-line-height: 1.6em; --framer-text-color: var(--token-9b0083b8-b14b-4f4a-b9c6-4a160184ab2b, rgba(255, 255, 255, 0.6));">Ontdek het verhaal achter Empower Your Core. Leer hoe oprichter Mohammed Rahali de klassieke Pilates-methode transformeerde tot een innovatieve, evidence-based praktijk, gericht op betekenisvolle beweging en duurzame resultaten.</p>
  `;
  const ABOUT_US_BODY_HTML = `
    <style>.eyc-about-video-wrap{width:100%;max-width:100%;margin:0 0 2em 0;border-radius:20px;overflow:hidden;}@media(min-width:768px){.eyc-about-video-wrap{width:70%;max-width:480px;margin:0 auto 2.5em auto;border-radius:24px;box-shadow:0 4px 20px rgba(0,0,0,0.25);}}</style>
    <div class="eyc-about-video-wrap">
      <video data-eyc-video-lock="true" autoplay loop muted playsinline style="width:100%;height:auto;display:block;">
        <source src="/assets/videos/about-intro.mp4" type="video/mp4">
      </video>
    </div>
    <p class="framer-text framer-styles-preset-saf75d">Empower Your Core is ontwikkeld door Mohammed Rahali: methode-ontwikkelaar en ondernemer. Geboren en getogen in Nederland, kwam Mohammed in Los Angeles voor het eerst in aanraking met de klassieke Pilatesmethode. Na een intensieve opleiding, de oprichting van zijn eigen studio True and Pure Pilates en jarenlange praktijkervaring, raakte hij ervan overtuigd dat het tijd was voor innovatie.</p>
    <p class="framer-text framer-styles-preset-saf75d">Door zijn praktische expertise te combineren met een diepe nieuwsgierigheid naar anatomie, biomechanica en moderne trainingsprincipes, zag Mohammed de beperkingen van het klassieke systeem. Hij ontwikkelde een bredere, slimmere en effectievere methode.</p>
    <p class="framer-text framer-styles-preset-saf75d">We leven in een tijd waarin kritisch denken, autonomie en evidence-based praktijken essentieel zijn. Empower Your Core vertaalt wetenschappelijke inzichten naar effectieve, direct toepasbare trainingsmethoden. De methode biedt een helder alternatief voor rigide, verouderde bewegingssystemen.</p>
    <p class="framer-text framer-styles-preset-saf75d">Geen dogma's. Geen herhaling om de herhaling. Alleen betekenisvolle beweging - gericht op kracht, bewustzijn en vrijheid.</p>
    <div style="width:100%;display:flex;justify-content:center;margin:2em 0;"><img src="/assets/founder-portrait.jpg" alt="Mohammed — oprichter van Empower Your Core" style="width:100%;max-width:420px;border-radius:20px;box-shadow:0 4px 20px rgba(0,0,0,0.25);object-fit:cover;" /></div>
    <h4 class="framer-text framer-styles-preset-1jfyso"><strong class="framer-text">Missie</strong></h4>
    <p class="framer-text framer-styles-preset-saf75d">Onze missie bij Empower Your Core is het bevorderen van kracht, mobiliteit en lichaamsbewustzijn door middel van een wetenschappelijk onderbouwde, holistische benadering van beweging. Wij willen mensen helpen hun lichaam beter te begrijpen en te versterken door beweging bewust uit te voeren en een balans te vinden tussen kracht en flexibiliteit.</p>
    <h4 class="framer-text framer-styles-preset-1jfyso"><strong class="framer-text">Visie</strong></h4>
    <p class="framer-text framer-styles-preset-saf75d">Empower Your Core haalt inspiratie uit verschillende bewegingssystemen, maar vertrekt altijd vanuit het lichaam zelf. Wat we uit bestaande systemen overnemen, vertalen we naar functionele kracht, coordinatie en mobiliteit. Het lichaam bepaalt wat nodig is - niet een vastgelegde vorm.</p>
    <p class="framer-text framer-styles-preset-saf75d">Veel traditionele methoden leggen de nadruk op gestandaardiseerde bewegingen en vaste patronen. Bij Empower Your Core geloven we dat ieder lichaam uniek is en dat het lichaam zelf de beste richting geeft voor effectieve beweging. In plaats van technieken rigide te volgen, richten wij ons op het ontwikkelen van een dieper lichaamsbewustzijn. We leren je luisteren naar wat het lichaam op elk moment nodig heeft. Dit maakt onze methode niet alleen flexibel, maar ook respectvol naar de natuurlijke bewegingen van het menselijk lichaam.</p>
    <h4 class="framer-text framer-styles-preset-1jfyso"><strong class="framer-text">Kernwaarden</strong></h4>
    <ul class="framer-text" style="margin-top:0.5em;">
      <li data-preset-tag="p" class="framer-text framer-styles-preset-saf75d" style="margin-bottom:0.6em;"><p class="framer-text framer-styles-preset-saf75d"><span style="margin-right:0.4em;opacity:0.5;">•</span><strong class="framer-text">Authenticiteit:</strong> Blijf altijd trouw aan jezelf en de mogelijkheden van jouw lichaam.</p></li>
      <li data-preset-tag="p" class="framer-text framer-styles-preset-saf75d" style="margin-bottom:0.6em;"><p class="framer-text framer-styles-preset-saf75d"><span style="margin-right:0.4em;opacity:0.5;">•</span><strong class="framer-text">Maatwerk:</strong> Elk lichaam is uniek; daarom stemmen we elk trainingsprogramma af op het individu.</p></li>
      <li data-preset-tag="p" class="framer-text framer-styles-preset-saf75d" style="margin-bottom:0.6em;"><p class="framer-text framer-styles-preset-saf75d"><span style="margin-right:0.4em;opacity:0.5;">•</span><strong class="framer-text">Passie:</strong> Wij delen onze liefde en passie voor beweging met enthousiasme en overtuiging met onze cliënten.</p></li>
    </ul>
  `;

  /**
   * Translate the hero title (.framer-8d3or5 h2) on works pages.
   * Framer hydration replaces the SSR Dutch text with English animated spans,
   * so we must re-translate the full h2 textContent after hydration.
   */
  function translateWorksHeroTitle() {
    /* lang-aware: fix functions run for both NL and EN */
    const scope = document.body;
    if (!scope) return;
    const container = scope.querySelector(".framer-8d3or5");
    if (!container) return;
    const h2 = container.querySelector("h2");
    if (!h2) return;
    const text = h2.textContent.replace(/\s+/g, " ").trim();
    const dutch = map.get(text) || null;
    if (dutch && dutch !== text) {
      // Preserve the h2's computed style but replace content with a single text node
      const spans = h2.querySelectorAll("span");
      if (spans.length > 0) {
        // Keep the first span's style for the whole text
        spans.forEach((s, i) => { if (i > 0) s.remove(); });
        spans[0].textContent = dutch;
      } else {
        h2.textContent = dutch;
      }
    }
  }

  /**
   * Hide the "Static mirror" Framer debug label that leaks into production.
   */
  function hideStaticMirrorLabel() {
    const scope = document.body;
    if (!scope) return;
    const allEls = scope.querySelectorAll("div, span, button, p, label, a");
    allEls.forEach(function(el) {
      var txt = el.textContent.trim();
      if (txt === "Static mirror" || txt === "Static Mirror") {
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("opacity", "0", "important");
        el.style.setProperty("pointer-events", "none", "important");
        el.setAttribute("aria-hidden", "true");
      }
    });
  }

  function enforceAboutUsDutchCopy(root) {
    /* lang-aware: fix functions run for both NL and EN */
    const pathname = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : "";
    if (!pathname.includes("/about-us")) return;

    document.body.setAttribute("data-eyc-page", "about-us");
    const scope = document.body || root;
    if (!scope || !scope.querySelectorAll) return;

    const title = scope.querySelector(".framer-8d3or5");
    if (title && title.dataset.eycAboutVersion !== ABOUT_US_PAGE_VERSION) {
      title.innerHTML = ABOUT_US_TITLE_HTML;
      title.dataset.eycAboutVersion = ABOUT_US_PAGE_VERSION;
    }

    const intro = scope.querySelector(".framer-12eccs8");
    if (intro && intro.dataset.eycAboutVersion !== ABOUT_US_PAGE_VERSION) {
      intro.innerHTML = ABOUT_US_INTRO_HTML;
      intro.dataset.eycAboutVersion = ABOUT_US_PAGE_VERSION;
    }

    const content = scope.querySelector(".framer-5j3lq1");
    if (content && content.dataset.eycAboutVersion !== ABOUT_US_PAGE_VERSION) {
      content.innerHTML = ABOUT_US_BODY_HTML;
      content.dataset.eycAboutVersion = ABOUT_US_PAGE_VERSION;
    }
  }

  const caseStudyRegexReplacements = [
    [/\bDealing with chronic knee, hip, and back pain, Rolf was a Pilates s(?:ceptic|keptic) until his first session\./gi, "Met chronische knie-, heup- en rugpijn was Rolf tot aan zijn eerste sessie sceptisch over Pilates."],
    [/\bSee how our (?:personalised|personalized), precise approach helped him get hooked, regain flexibility, and return to an active, pain-free lifestyle\./gi, "Ontdek hoe onze persoonlijke, precieze aanpak hem overtuigde, zijn flexibiliteit terugbracht en hem hielp terugkeren naar een actief, pijnvrij leven."],
    [/When Rolf[’']s wife suggested he try Pilates, he was a true s(?:ceptic|keptic), admitting, "I thought it was something esoteric\."/gi, "Toen Rolfs vrouw voorstelde om Pilates te proberen, was hij een rasechte scepticus: \"Ik dacht dat het iets zweverigs was,\" geeft hij toe."],
    [/He was dealing with a frustrating chain reaction of chronic pain that started in his knees and radiated to his hip, causing a stiff back and frequent leg pain\./gi, "Hij kampte met een frustrerende kettingreactie van chronische pijn die begon in zijn knieën en doorstraalde naar zijn heup, met een stijve rug en terugkerende beenpijn tot gevolg."],
    [/He needed a solution that could address the root cause of his interconnected issues and get him back to the active lifestyle he loved\./gi, "Hij zocht een oplossing die de kern van zijn klachten aanpakte en hem zijn actieve levensstijl teruggaf."],
    [/Our ongoing approach is built on the three principles Rolf identified as key to his success:/gi, "Onze doorlopende aanpak is gebouwd op drie principes die voor Rolf doorslaggevend waren:"],
    [/We knew the first session had to overcome Rolf[’']s s(?:cepticism|kepticism) by delivering undeniable results\./gi, "We wisten dat de eerste sessie Rolfs scepsis moest doorbreken met direct voelbare resultaten."],
    [/We guided him through a challenging, precise workout that immediately demonstrated the power of (?:our method|Onze Methode|onze methode)\./gi, "We begeleidden hem door een uitdagende, precieze workout die onmiddellijk de kracht van onze methode bewees."],
    [/As Rolf says, he was "?completely done after it\.\.\. and really got hooked\.?"?/gi, "Zoals Rolf zegt: \"Ik was erna helemaal kapot... en meteen verkocht.\""],
    [/Precision:\s*We ensure every exercise is performed with perfect form for maximum benefit and safety\./gi, "Precisie: We zien erop toe dat elke oefening met een perfecte techniek wordt uitgevoerd voor maximaal resultaat en veiligheid."],
    [/Personali[sz]ation:\s*We design a "custom work" program tailored specifically to address his unique physical challenges\./gi, "Personalisatie: We ontwerpen een programma op maat, specifiek gericht op het aanpakken van zijn unieke fysieke uitdagingen."],
    [/Flexibility:\s*We listen to his body, adjusting sessions in real-time to focus on what needs attention that day\./gi, "Flexibiliteit: We luisteren naar zijn lichaam en passen de sessies in real-time aan om de focus te leggen op wat die dag de meeste aandacht nodig heeft."],
    [/Rolf[’']s dedication, combined with our tailored approach, has produced a complete transformation\./gi, "Rolfs toewijding, gecombineerd met onze persoonlijke aanpak, heeft geleid tot een complete transformatie."],
    [/He has not only resolved his chronic pain but has also built a new foundation of strength and flexibility that will serve him for years to come\./gi, "Hij is niet alleen van zijn chronische pijn af, maar heeft ook een nieuwe basis van kracht en flexibiliteit opgebouwd waar hij nog jaren profijt van zal hebben."],
    [/"I can do all the sports that I want to do next to Pilates without any big pain\."/gi, "\"Ik kan alle sporten doen die ik naast Pilates wil doen, zonder noemenswaardige pijn.\""],
    [/\bFrom a decades-old spinal injury to renewed flexibility, see how (?:personalised|personalized) Pilates training helped Lisa reclaim a pain-free, active life and even improved her golf swing\./gi, "Van een decennialange rugblessure naar herwonnen flexibiliteit: ontdek hoe persoonlijke Pilatestraining Lisa hielp om weer pijnvrij en actief te leven, en zelfs haar golfswing verbeterde."],
    [/Pilates Studio Utrecht\s+From a decades-old spinal injury to renewed flexibility, see how (?:personalised|personalized) Pilates training helped Lisa reclaim a pain-free, active life and even improved her golf swing\./gi, "Van een decennialange rugblessure naar herwonnen flexibiliteit: ontdek hoe persoonlijke Pilatestraining Lisa hielp om weer pijnvrij en actief te leven, en zelfs haar golfswing verbeterde."],
    [/For nearly five decades, Lisa lived with the daily consequences of a severe fall in 1972 that left her with a damaged spinal column\./gi, "Bijna vijf decennia lang leefde Lisa met de dagelijkse gevolgen van een zware val in 1972, waarbij haar wervelkolom beschadigd raakte."],
    [/Despite years of treatment, her own physiotherapist eventually recommended a more proactive approach[—-]one that would fundamentally improve her posture and overall physical condition to build a foundation for lasting strength\./gi, "Ondanks jaren van behandelingen adviseerde haar eigen fysiotherapeut uiteindelijk een actievere aanpak — een methode die haar houding en algehele fysieke conditie fundamenteel zou verbeteren als basis voor blijvende kracht."],
    [/Lisa was initially hesitant, planning only a trial session to see what Pilates was about\./gi, "Lisa was aanvankelijk sceptisch en plande slechts één proefles."],
    [/Our immediate goal was to understand the unique complexities of her long-term injury and create a safe, controlled environment for her to explore movement\./gi, "Ons doel was direct helder: de complexiteit van haar langdurige blessure doorgronden en een veilige, gecontroleerde omgeving creëren."],
    [/We focused on foundational exercises, emphasi[sz]ing precision and core engagement to build stability from the inside out\./gi, "We richtten ons op de fundamenten, met een sterke nadruk op precisie en core-activatie om stabiliteit van binnenuit op te bouwen."],
    [/This unsolicited, real-world feedback validated the immediate impact of (?:our method|Onze Methode|onze methode)\./gi, "Deze ongevraagde bevestiging uit de echte wereld bewees de directe impact van onze methode."],
    [/What began as a single trial session quickly evolved into a dedicated, four-year journey of consistent weekly training, with each session building upon the last\./gi, "Wat begon als een enkele proefles, groeide uit tot een toegewijde reis van vier jaar, waarbij elke wekelijkse sessie voortbouwde op de vorige."],
    [/The transformation has been nothing short of remarkable\./gi, "De transformatie is opmerkelijk."],
    [/Lisa[‘\u2018\u2019\x27`]s journey is a powerful testament to the body[‘\u2018\u2019\x27`]s ability to heal and strengthen, regardless of age or the duration of an injury\./gi, "Lisa\u2019s traject is het ultieme bewijs dat het lichaam kan herstellen en sterker kan worden, ongeacht leeftijd of hoe lang een blessure al bestaat."],
    [/The benefits have extended far beyond her initial goals, enhancing her hobbies and restoring a level of physical freedom she hadn[‘\u2018\u2019\x27`]t felt in decades\./gi, "Ze herwon een mate van fysieke vrijheid die ze in decennia niet had gevoeld."],
    [/The most surprising testament to her progress came from an unexpected source[—-]her golf instructor\./gi, "Het meest verrassende compliment kwam onlangs van haar golfinstructeur:"],
    [/A tennis injury in his mid-twenties left Chris with a back problem that would trouble him for nearly 30 years\./gi, "Een tennisblessure op 25-jarige leeftijd bezorgde Chris rugklachten waar hij bijna dertig jaar lang last van hield."],
    [/After three decades of living with the issue, he was open to trying something new\./gi, "Na drie decennia vol beperkingen stond hij open voor een nieuwe benadering."],
    [/When a friend suggested Pilates, he discovered a method that would completely reshape his physical wellbeing\./gi, "Toen een vriend hem Pilates aanraadde, ontdekte hij een methode die zijn fysieke welzijn fundamenteel veranderde."],
    [/Chris came to us not as a beginner, but as a dedicated Pilates practitioner of 15 years\./gi, "Chris kwam niet als beginner bij ons, maar als een toegewijde beoefenaar met vijftien jaar Pilates-ervaring."],
    [/He had already experienced the transformative power of the method and was now seeking a true expert to guide him on the next phase of his journey\./gi, "Hij kende de transformerende kracht van de methode al, maar zocht een expert om hem naar het volgende niveau te tillen."],
    [/He specifically chose our studio for a critical reason:/gi, "Hij koos specifiek voor onze studio vanwege een cruciale reden:"],
    [/"I chose him because I could see from his training that he had done all the essential Pilates training\."/gi, "\"Ik koos voor hem omdat ik aan zijn opleiding zag dat hij alle essentiële Pilatestrainingen had gevolgd.\""],
    [/Our approach with Chris has been a partnership in precision\./gi, "Onze aanpak met Chris is een partnerschap in precisie."],
    [/We provide the expert guidance and deep knowledge of the Pilates method required to challenge an experienced client, helping him continue to refine his practice, improve his body, and work towards new goals\./gi, "We bieden de diepgaande kennis die nodig is om een ervaren cliënt te blijven uitdagen. Samen verfijnen we zijn techniek, verbeteren we zijn fysieke belastbaarheid en werken we gericht naar nieuwe doelen."],
    [/For Chris, the result of his dedication is a life free from the limitations of a decades-old injury\./gi, "Voor Chris is het resultaat van zijn toewijding een leven zonder de beperkingen van een decennia-oude blessure."],
    [/He has become a self-described "Pilates fanatic" who sees his practice as a "nonstop, never-ending process" of improvement\./gi, "Hij noemt zichzelf inmiddels een \"Pilatesfanaat\" en ziet zijn practice als een continu proces van groei."],
    [/His story is a powerful testament to the fact that with the right expert guidance, it is never too late to achieve a "whole new body\."\s*/gi, "Zijn verhaal bewijst dat het met de juiste deskundige begeleiding nooit te laat is om een \"totaal nieuw lichaam\" te bereiken. "],
    [/Barely able to walk due to debilitating back and leg pain, she sought a safe way to rebuild strength\./gi, "Omdat ze door slopende rug- en beenpijn nauwelijks nog kon lopen, zocht ze een veilige manier om haar kracht weer op te bouwen."],
    [/See how our (?:personalised|personalized), one-on-one approach provided rapid relief and restored her ability to walk upright and pain-free\./gi, "Ontdek hoe onze persoonlijke een-op-een aanpak snel verlichting gaf en haar vermogen om rechtop en pijnvrij te lopen herstelde."],
    [/When our client first came to us, she was dealing with a debilitating situation\./gi, "Toen onze cli\u00ebnte voor het eerst bij ons kwam, bevond zij zich in een zware situatie."],
    [/Severe back pain had radiated to her shins, making it so difficult to walk that she needed a form of exercise that could build strength without adding any further burden to her body\./gi, "Ernstige rugpijn straalde uit naar haar schenen, waardoor lopen zo moeizaam werd dat ze een bewegingsvorm nodig had die kracht opbouwde zonder haar lichaam verder te belasten."],
    [/Recalling a positive experience with Reformer Pilates a decade ago, she knew a personali[sz]ed, one-on-one approach was essential\./gi, "Vanwege een positieve ervaring met de Reformer, tien jaar eerder, wist ze dat een persoonlijke \u00e9\u00e9n-op-\u00e9\u00e9n aanpak essentieel was voor haar herstel."],
    [/From the start, the focus was on a deep understanding of her body[’']s unique needs\./gi, "Vanaf het begin lag de focus op een diep begrip van de unieke behoeften van haar lichaam."],
    [/"One-on-one is very important," she notes, "because so much attention is given to the physiology and anatomy\."/gi, "\"\u00c9\u00e9n-op-\u00e9\u00e9n is heel belangrijk,\" legt ze uit, \"omdat er bij deze methode zoveel aandacht is voor fysiologie en anatomie.\""],
    [/Our approach was built on careful observation of her body[‘\u2018\u2019\x27]s reactions and a foundational emphasis on core stability\./gi, "Onze aanpak was gebaseerd op:\n\u2022 Zorgvuldige observatie: Constant monitoren hoe haar lichaam reageerde op elke beweging.\n\u2022 Core Stability als fundament: Haar leren hoe ze haar diepe kernspieren correct activeert om de rug te ontlasten en het natuurlijke ondersteuningssysteem van haar lichaam te heractiveren."],
    [/By teaching her to engage her core correctly, we aimed to relieve the burden on her back and rebuild her body[’']s natural support system\./gi, "Door haar te leren haar core correct te activeren, wilden we haar rug ontlasten en het natuurlijke ondersteuningssysteem van haar lichaam opnieuw opbouwen."],
    [/The progress was both rapid and profound\./gi, "De vooruitgang was zowel snel als ingrijpend."],
    [/In just two months of consistent, targeted sessions, the chronic pain that had limited her mobility was gone\./gi, "In slechts twee maanden van consistente, gerichte sessies verdween de chronische pijn die haar mobiliteit beperkte."],
    [/She can now walk with a new, upright posture, free from the back and leg pain that had troubled her for so long\./gi, "Ze loopt nu met een nieuwe, trotse houding, vrij van de rug- en beenpijn die haar zo lang heeft belemmerd."],
    [/"I have less of a backache now, because I walk more and more upright\.\.\. thanks to my core stability\. The pain in my shins gradually went away in just two months\."/gi, "\"Ik heb nu minder last van mijn rug, omdat ik steeds rechter loop... dankzij mijn verbeterde core stability. De pijn in mijn schenen verdween geleidelijk binnen slechts twee maanden.\""],
    [/The turning point came not from within the studio, but from the outside world\./gi, "Het keerpunt kwam onverwacht, door feedback uit haar directe omgeving:"],
    [/It seems as if you(?:'|’)re walking and standing differently/gi, "het lijkt alsof je anders loopt en staat"],
    [/I had also seen this myself, but I didn(?:'|’)t tell the people whom I had asked if they could see what was wrong with my back\./gi, "Dat zag ik zelf ook, maar ik had diegene niet eens verteld wat er precies met mijn rug aan de hand was."],
    [/"He told me last week: 'You shouldn(?:'|’)t change your swing at all\. Because it(?:'|’)s great\. I(?:'|’)ve never seen anyone your age who is that flexible\.'"/gi, "\"Hij zei vorige week: 'Je moet je swing helemaal niet veranderen. Die is uitstekend. Ik heb nog nooit iemand van jouw leeftijd gezien die zo flexibel is.'\""],
    [/\bproject img\b/gi, "projectafbeelding"]
  ];

  function applyCaseStudyReplacements(text) {
    if (!text) return text;
    let next = text;
    caseStudyRegexReplacements.forEach(([pattern, replacement]) => {
      next = next.replace(pattern, replacement);
    });
    return next;
  }

  function forceDutchCaseStudyCopy(root) {
    /* lang-aware: fix functions run for both NL and EN */
    if (!root) return;
    walkTextNodes(root, (node) => {
      const current = node.textContent || "";
      if (!current) return;
      const next = applyCaseStudyReplacements(current);
      if (next !== current) node.textContent = next;
    });

    // Add visual spacing before inline bullet points (• chars inside <p>)
    if (root.querySelectorAll) {
      root.querySelectorAll("p").forEach(function(p) {
        var text = p.textContent || "";
        if (text.includes("\u2022") && text.match(/:\n\u2022/) && !p.getAttribute("data-eyc-bullets-spaced")) {
          p.setAttribute("data-eyc-bullets-spaced", "true");
          p.style.setProperty("white-space", "pre-wrap", "important");
          // Replace first :\n• with :\n\n• to add visual gap
          var walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            var t = walker.currentNode.textContent;
            if (t.includes(":\n\u2022")) {
              walker.currentNode.textContent = t.replace(":\n\u2022", ":\n\n\u2022");
              break;
            }
          }
        }
      });
    }

    if (!root.querySelectorAll) return;
    root.querySelectorAll("[aria-label], [title], [alt], [placeholder]").forEach((el) => {
      ["aria-label", "title", "alt", "placeholder"].forEach((attr) => {
        const raw = el.getAttribute(attr);
        if (!raw) return;
        const next = applyCaseStudyReplacements(raw);
        if (next !== raw) el.setAttribute(attr, next);
      });
    });
  }

  const TEACHER_TRAINING_PAGE_VERSION = "2026-03-14-v4";
  const TEACHER_TRAINING_VIDEO_SRC = "/assets/teacher-training-program.mp4";
  const TEACHER_TRAINING_VIDEO_POSTER = "https://framerusercontent.com/images/vHRkazprqjlKNPYIGqCjNq0SBnE.jpg?width=6459&height=4306";
  const TEACHER_TRAINING_NOTICE_TEXT = "www.eycessencecircle.com more information soon.";
  const PERSONAL_TRAINING_PAGE_VERSION = "2026-03-14-v1";
  const PERSONAL_TRAINING_IMAGE_SRC = "/assets/personal-training-program.jpg";
  const CASE_STUDY_SLUGS = [
    "lisa-pilates-injury-recovery-story",
    "rolf-pilates-transformation",
    "chris-pilates-story",
    "golfer-back-pain-pilates",
    "gym-burnout-pilates-story",
    "pain-free-stride-pilates"
  ];
  const TEACHER_TRAINING_MEDIA_HTML = `
    <video
      class="framer-text framer-image framer-styles-preset-166h8qx"
      style="aspect-ratio: 16 / 9; width: 100%; height: auto; display: block;"
      data-eyc-video-lock="true"
      data-eyc-unmute="true"
      src="${TEACHER_TRAINING_VIDEO_SRC}"
      poster="${TEACHER_TRAINING_VIDEO_POSTER}"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    ></video>
  `;
  const TEACHER_TRAINING_BODY_HTML = `
    <h4 class="framer-text framer-styles-preset-1jfyso">Een Nieuwe Standaard in Bewegingseducatie</h4>
    <p class="framer-text framer-styles-preset-saf75d"><strong class="framer-text">${TEACHER_TRAINING_NOTICE_TEXT}</strong></p>
    <p class="framer-text framer-styles-preset-saf75d">Het trainingsprogramma van Empower Your Core Academy is ontstaan uit persoonlijke frustratie. Tijdens mijn eigen opleiding kreeg ik een boek met foto's en vage uitleg. Er zat weinig logica in en veel dingen moest ik zelf uitzoeken.</p>
    <p class="framer-text framer-styles-preset-saf75d">Daarom krijgen mijn studenten juist het tegenovergestelde.</p>
    <p class="framer-text framer-styles-preset-saf75d">Bij Empower Your Core Academy werken we met een duidelijk en gestructureerd programma. Elke oefening wordt uitgelegd: wat je doet, waarom je het doet en hoe het werkt in het lichaam. Zo wordt wat vaak vaag blijft, een duidelijke en effectieve methode.</p>
    <h4 class="framer-text framer-styles-preset-1jfyso" style="margin-top:1.2em;margin-bottom:0.6em;">Onze Basisprincipes</h4>
    <ul class="framer-text" style="margin:0 0 0.8em 0;padding-left:1.4em;list-style:disc;">
      <li class="framer-text" style="margin-bottom:0.5em;"><strong class="framer-text">Logische opbouw:</strong> De opleiding bouwt stap voor stap op: van basisprincipes naar meer gevorderde toepassingen.</li>
      <li class="framer-text" style="margin-bottom:0.5em;"><strong class="framer-text">Direct toepasbaar:</strong> Door praktische oefeningen en duidelijke richtlijnen kun je de kennis meteen gebruiken in de praktijk.</li>
    </ul>
    <h4 class="framer-text framer-styles-preset-1jfyso" style="margin-top:1.2em;margin-bottom:0.5em;">Het Resultaat</h4>
    <p class="framer-text framer-styles-preset-saf75d">Onze studenten voelen niet alleen wat ze doen — ze begrijpen ook waarom het werkt. Daardoor kunnen ze met meer zekerheid, precisie en vertrouwen werken met hun eigen cliënten.</p>
    <h4 class="framer-text framer-styles-preset-1jfyso">Meer informatie</h4>
    <p class="framer-text framer-styles-preset-saf75d">Wil je meer weten over het programma, de inhoud en de aanmelding?</p>
    <p class="framer-text framer-styles-preset-saf75d">Bezoek de website van Empower Your Core Academy: <a class="framer-text" href="https://www.eycacademy.com" target="_blank" rel="noreferrer noopener">www.eycacademy.com</a></p>
  `;

  function selectSelfOrDescendant(root, selector) {
    if (!root || root.nodeType !== Node.ELEMENT_NODE) return null;
    if (root.matches && root.matches(selector)) return root;
    return root.querySelector ? root.querySelector(selector) : null;
  }

  function forceTeacherTrainingNotice(root) {
    /* lang-aware: fix functions run for both NL and EN */
    if (!root || !root.querySelectorAll) return;
    const pathname = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : "";
    if (!pathname.includes("/teacher-training")) return;

    const notice = selectSelfOrDescendant(root, ".framer-12eccs8");
    if (notice) {
      notice.textContent = "";
      notice.style.display = "none";
      notice.dataset.eycTeacherTrainingVersion = TEACHER_TRAINING_PAGE_VERSION;
    }

    const content = selectSelfOrDescendant(root, ".framer-5j3lq1");
    if (!content) return;

    if (content.dataset.eycTeacherTrainingVersion === TEACHER_TRAINING_PAGE_VERSION) return;

    content.innerHTML = `${TEACHER_TRAINING_MEDIA_HTML}${TEACHER_TRAINING_BODY_HTML}`;
    content.dataset.eycTeacherTrainingVersion = TEACHER_TRAINING_PAGE_VERSION;

    // Unmute the video on first user interaction (browsers block autoplay with sound)
    var video = content.querySelector("video[data-eyc-unmute]");
    if (video && !video.dataset.eycUnmuteListenerAdded) {
      video.dataset.eycUnmuteListenerAdded = "true";
      function unmuteOnInteraction() {
        video.muted = false;
        document.removeEventListener("click", unmuteOnInteraction);
        document.removeEventListener("touchstart", unmuteOnInteraction);
        document.removeEventListener("scroll", unmuteOnInteraction);
        document.removeEventListener("keydown", unmuteOnInteraction);
      }
      document.addEventListener("click", unmuteOnInteraction, { once: true });
      document.addEventListener("touchstart", unmuteOnInteraction, { once: true });
      document.addEventListener("scroll", unmuteOnInteraction, { once: true });
      document.addEventListener("keydown", unmuteOnInteraction, { once: true });
    }
  }

  function forcePersonalTrainingHero(root) {
    if (!root || !root.querySelectorAll) return;
    const pathname = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : "";
    if (!pathname.includes("/personal-training")) return;

    const content = selectSelfOrDescendant(root, ".framer-5j3lq1");
    if (!content) return;

    let heroImage = selectSelfOrDescendant(content, "img.framer-image");
    if (!heroImage) {
      // Mobile SSR variant doesn't include the hero image — inject it
      if (content.dataset.eycPersonalTrainingVersion === PERSONAL_TRAINING_PAGE_VERSION) return;
      heroImage = document.createElement("img");
      heroImage.className = "framer-image";
      heroImage.style.cssText = "width:100%;height:auto;border-radius:16px;margin-bottom:1.5em;display:block;";
      content.insertBefore(heroImage, content.firstChild);
    }
    if (heroImage.dataset.eycPersonalTrainingVersion === PERSONAL_TRAINING_PAGE_VERSION) return;

    heroImage.setAttribute("src", PERSONAL_TRAINING_IMAGE_SRC);
    heroImage.removeAttribute("srcset");
    heroImage.removeAttribute("sizes");
    heroImage.setAttribute("width", "2048");
    heroImage.setAttribute("height", "1365");
    heroImage.setAttribute("alt", "Persoonlijke training bij Empower Your Core®");
    heroImage.dataset.eycPersonalTrainingVersion = PERSONAL_TRAINING_PAGE_VERSION;
    content.dataset.eycPersonalTrainingVersion = PERSONAL_TRAINING_PAGE_VERSION;
  }

  function isCaseStudyPath() {
    const pathname = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : "";
    return CASE_STUDY_SLUGS.some((slug) => pathname.includes(`/works/${slug}`));
  }

  function ensureCaseStudyHeroTitleStyles() {
    if (document.getElementById("eyc-case-study-hero-title-fix")) return;
    if (!isCaseStudyPath()) return;

    const style = document.createElement("style");
    style.id = "eyc-case-study-hero-title-fix";
    style.textContent = `
      .framer-19vzira .framer-8d3or5 h2,
      .framer-19vzira .framer-8d3or5 h2 span,
      .framer-19vzira .framer-8d3or5 h2 .framer-text {
        color: #ffffff !important;
        -webkit-text-fill-color: #ffffff !important;
        opacity: 1 !important;
        filter: none !important;
        transform: none !important;
        will-change: auto !important;
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Fix stuck Framer animation on YouTube video containers ──
     Framer's appear animation leaves the RichTextContainer that wraps
     the YouTube iframe at opacity:0 + translateY(12px) on mobile.
     Force it visible so users can tap play. */
  function ensureCaseStudyVideoVisible() {
    if (document.getElementById("eyc-case-study-video-fix")) return;
    if (!isCaseStudyPath()) return;

    var style = document.createElement("style");
    style.id = "eyc-case-study-video-fix";
    style.textContent = "\
      .framer-5j3lq1[data-framer-component-type='RichTextContainer'] {\
        opacity: 1 !important;\
        transform: none !important;\
        will-change: auto !important;\
      }\
      /* Override Lenis pointer-events:none on YouTube iframes */\
      iframe[src*='youtube.com'],\
      .lenis-scrolling iframe[src*='youtube.com'],\
      article iframe[src*='youtube.com'] {\
        pointer-events: auto !important;\
      }\
      article[role='presentation'] {\
        pointer-events: auto !important;\
      }\
      /* Add spacing between paragraph and bullet list on case study pages */\
      div.framer-5j3lq1[data-framer-component-type] p + ul,\
      div.framer-5j3lq1[data-framer-component-type] p + ol,\
      [data-framer-component-type='RichTextContainer'] p + ul,\
      [data-framer-component-type='RichTextContainer'] p + ol {\
        margin-top: 16px !important;\
      }\
      /* Reduce excessive spacing between bullet items — About Us only */\
      body[data-eyc-page=\"about-us\"] [data-framer-component-type='RichTextContainer'] ul.framer-text li + li {\
        margin-top: -28px !important;\
      }\
      /* Remove unwanted bold from headings on case study pages */\
      h3.framer-text strong.framer-text,\
      h4.framer-text strong.framer-text {\
        font-weight: inherit !important;\
      }\
      /* Match h3 heading size to h4 (32px) on case study pages */\
      h3.framer-text.framer-styles-preset-11q9d05 {\
        --framer-font-size: 32px !important;\
        font-size: 32px !important;\
        line-height: 44.8px !important;\
      }\
    ";
    document.head.appendChild(style);
  }

  /**
   * Fix Chris case study: Framer exported Lisa's intro on the desktop variant.
   * Replace it with Chris's correct intro after translation runs.
   */
  function fixChrisCaseStudyIntro() {
    /* lang-aware: fix functions run for both NL and EN */
    const pathname = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : "";
    if (!pathname.includes("chris-pilates-story")) return;

    const LISA_INTRO = "Van een decennialange rugblessure naar herwonnen flexibiliteit: ontdek hoe persoonlijke Pilatestraining Lisa hielp om weer pijnvrij en actief te leven, en zelfs haar golfswing verbeterde.";
    const CHRIS_INTRO = "Na dertig jaar kampen met een hardnekkige tennisblessure, vond Chris in Pilates de sleutel tot een pijnvrij leven. Ondanks zijn vijftien jaar ervaring zocht hij een expert met diepgaande kennis om zijn praktijk naar een nog hoger niveau te tillen. Zijn verhaal bewijst dat je met de juiste specialistische begeleiding je lichaam op elke leeftijd fundamenteel kunt transformeren.";

    const allP = document.querySelectorAll("p");
    allP.forEach(function(p) {
      if (p.textContent.trim() === LISA_INTRO) {
        p.textContent = CHRIS_INTRO;
      }
    });
  }

  const howWeWorkSteps = [
    {
      num: "01",
      label: "ONTDEKKEN",
      text: "We bekijken hoe je beweegt en waar je lichaam ondersteuning nodig heeft."
    },
    {
      num: "02",
      label: "OPBOUWEN",
      text: "We trainen doelgericht, afgestemd op jouw lichaam en voortgang."
    },
    {
      num: "03",
      label: "TRANSFORMEREN",
      text: "Je ontwikkelt kracht, stabiliteit en lichaamsbewustzijn."
    }
  ];

  function ensureHowWeWorkStyles() {
    if (document.getElementById("eyc-how-style")) return;
    const style = document.createElement("style");
    style.id = "eyc-how-style";
    style.textContent = `
      .eyc-how {
        background: transparent;
        padding: 0 0 clamp(16px, 2vw, 24px);
        width: 100%;
        max-width: 100%;
        flex: 1 1 100%;
        align-self: stretch;
        box-sizing: border-box;
        border: 0;
        border-radius: 0;
        box-shadow: none;
      }

      .eyc-how__wrap {
        width: 100%;
        max-width: 980px;
        margin: 0 auto;
        padding-inline: 0;
        box-sizing: border-box;
        border: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
      }

      .eyc-how__rule {
        display: none;
      }

      .eyc-how__rule--bottom {
        margin-top: 0;
      }

      .eyc-how__grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: clamp(16px, 1.8vw, 24px);
        padding: 0;
        width: 100%;
        box-sizing: border-box;
      }

      .eyc-how__item {
        min-height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        text-align: left;
        padding: clamp(20px, 2vw, 28px) clamp(16px, 1.8vw, 22px);
        border: 1px solid rgba(212, 180, 110, 0.18);
        border-radius: 22px;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.022), rgba(255,255,255,0.01));
        backdrop-filter: blur(12px) saturate(108%);
        -webkit-backdrop-filter: blur(12px) saturate(108%);
        box-shadow:
          inset 0 1px 0 rgba(212, 180, 110, 0.06),
          0 14px 30px rgba(0, 0, 0, 0.14);
      }

      .eyc-how__num {
        margin: 0 0 16px 0;
        font-size: clamp(58px, 5.7vw, 96px);
        font-weight: 300;
        line-height: 1;
        letter-spacing: 0.02em;
        color: transparent;
        -webkit-text-stroke: 1px rgba(212, 180, 110, 0.55);
        text-stroke: 1px rgba(212, 180, 110, 0.55);
      }

      .eyc-how__label {
        margin: 0 0 14px 0;
        color: rgba(212, 180, 110, 0.9);
        font-size: 13px;
        letter-spacing: 0.22em;
        font-weight: 500;
        text-align: left;
      }

      .eyc-how__text {
        margin: 0;
        color: rgba(255, 255, 255, 0.72);
        max-width: 100%;
        font-size: clamp(16px, 1.2vw, 18px);
        line-height: 1.65;
        overflow-wrap: anywhere;
        text-align: left;
      }

      .eyc-how-unclip {
        width: 100% !important;
        max-width: 100% !important;
        flex: 1 1 100% !important;
        align-self: stretch !important;
        height: auto !important;
        min-height: 0 !important;
        overflow: visible !important;
        border-radius: 0 !important;
      }

      .eyc-how-unclip::after,
      .eyc-how-unclip::before {
        display: none !important;
      }

      @media (max-width: 1280px) {
        .eyc-how__grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .eyc-how__item--wide {
          grid-column: 1 / -1;
          width: min(100%, 620px);
          margin: 0 auto;
        }
      }

      @media (max-width: 980px) {
        .eyc-how {
          background: transparent;
          padding: 0 0 28px;
          margin-bottom: 14px;
          width: 100%;
          max-width: 100%;
        }

        .eyc-how__wrap {
          width: 100%;
          max-width: 100%;
          padding-inline: 0;
        }

        .eyc-how-unclip {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .eyc-how__rule,
        .eyc-how__rule--bottom {
          display: none;
        }

        .eyc-how__grid {
          grid-template-columns: 1fr;
          gap: 22px;
          padding-top: 0;
        }

        .eyc-how__item,
        .eyc-how__item--wide {
          width: 100%;
        }

        .eyc-how__item {
          border-radius: 14px;
          padding: 20px 16px;
        }

        .eyc-how__num {
          font-size: clamp(52px, 16vw, 76px);
          margin-bottom: 12px;
        }

        .eyc-how__label {
          letter-spacing: 0.16em;
          margin-bottom: 10px;
        }

        .eyc-how__text {
          max-width: 36ch;
          line-height: 1.6;
          font-size: 16px;
        }

        /* Remove Framer Points container padding and border-radius on mobile */
        .eyc-how-unclip[data-framer-name="Points"] {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          border-radius: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function replaceProcessSection(root) {
    /* lang-aware: fix functions run for both NL and EN */
    if (!root || !root.querySelector) return;
    const points = root.querySelector('[data-framer-name="Points"]');
    if (!points || points.querySelector('[data-eyc-process-html="true"]')) return;
    ensureHowWeWorkStyles();
    points.classList.add("eyc-how-unclip");
    points.innerHTML = "";
    const section = document.createElement("section");
    section.className = "eyc-how";
    section.setAttribute("aria-label", "Hoe wij werken");
    const wrap = document.createElement("div");
    wrap.className = "eyc-how__wrap";
    const topRule = document.createElement("div");
    topRule.className = "eyc-how__rule";
    topRule.setAttribute("aria-hidden", "true");
    const grid = document.createElement("div");
    grid.className = "eyc-how__grid";
    const bottomRule = document.createElement("div");
    bottomRule.className = "eyc-how__rule eyc-how__rule--bottom";
    bottomRule.setAttribute("aria-hidden", "true");

    howWeWorkSteps.forEach((step, index) => {
      const item = document.createElement("article");
      item.className = "eyc-how__item";
      if (index === howWeWorkSteps.length - 1) item.classList.add("eyc-how__item--wide");
      const num = document.createElement("div");
      num.className = "eyc-how__num";
      num.textContent = step.num;
      const label = document.createElement("div");
      label.className = "eyc-how__label";
      label.textContent = step.label;
      const text = document.createElement("p");
      text.className = "eyc-how__text";
      text.textContent = step.text;
      item.appendChild(num);
      item.appendChild(label);
      item.appendChild(text);
      grid.appendChild(item);
    });

    wrap.appendChild(topRule);
    wrap.appendChild(grid);
    wrap.appendChild(bottomRule);
    section.appendChild(wrap);
    section.setAttribute("data-eyc-process-html", "true");
    points.appendChild(section);

    const parentBlocks = [
      points.parentElement,
      points.closest(".framer-1laf7k2"),
      points.closest(".framer-1vorql8"),
      points.closest(".framer-bbt7ix"),
      points.closest(".framer-1vq7ieh"),
    ];

    parentBlocks.forEach((block) => {
      if (block && block.classList) block.classList.add("eyc-how-unclip");
    });

    if (points.parentElement && points.parentElement.classList) {
      points.parentElement.classList.add("eyc-home-flow-shell", "eyc-how-shell");
    }
  }

  /** Make only the hero section transparent so video shows through,
   *  while keeping the rest of the page dark (#0e0e0f).
   *  ONLY runs on homepage. */
  function fixHeroBackground() {
    var pathname = (window.location && window.location.pathname) ? window.location.pathname : "";
    if (pathname !== "/" && pathname !== "/index.html" && !pathname.endsWith("framer.app/")) return;

    // Make only the hero/scrollsection transparent (not body/root)
    var scrollSection = document.getElementById("scrollsection") || document.querySelector(".framer-192e1xt");
    if (scrollSection) {
      scrollSection.style.setProperty("background-color", "transparent", "important");
    }
    // Nav wrapper transparent
    document.querySelectorAll('.framer-yifQo').forEach(function(el) {
      el.style.setProperty('background-color', 'transparent', 'important');
      el.style.setProperty('background', 'transparent', 'important');
    });
  }

  function swapHomepageImages() {
    var pathname = (window.location && window.location.pathname) ? window.location.pathname : "";
    if (pathname !== "/" && pathname !== "/index.html" && !pathname.endsWith("framer.app/")) return;

    var IMG_MAP = {
      "vHRkazprqjlKNPYIGqCjNq0SBnE": "/assets/teacher-training-hero.jpg",
      "wWUfMmIoufYKJpOBoPQKRtsd0": "/assets/personal-training-hero.jpg"
    };

    document.querySelectorAll("img").forEach(function(img) {
      var src = img.getAttribute("src") || "";
      Object.keys(IMG_MAP).forEach(function(id) {
        if (src.indexOf(id) !== -1) {
          img.setAttribute("src", IMG_MAP[id]);
          img.removeAttribute("srcset");
          img.removeAttribute("sizes");
          img.style.objectFit = "cover";
          img.style.opacity = "1";
        }
      });
    });
  }

  function ensureResponsiveLayoutStyles() {
    if (document.getElementById("eyc-layout-fixes")) return;
    const style = document.createElement("style");
    style.id = "eyc-layout-fixes";
    style.textContent = `
      html, body, #main {
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }

      [data-framer-generated-page=""],
      [data-layout-template="true"],
      [data-framer-root] {
        width: 100% !important;
        max-width: 100% !important;
      }

      /* Fix About Us Kernwaarden list: remove extra space before first bullet + between items */
      body[data-eyc-page="about-us"] [data-framer-component-type='RichTextContainer'] ul.framer-text {
        font-size: 0 !important;
        line-height: 0 !important;
      }
      body[data-eyc-page="about-us"] [data-framer-component-type='RichTextContainer'] ul.framer-text li {
        font-size: 16px !important;
        line-height: 25.6px !important;
      }
      body[data-eyc-page="about-us"] [data-framer-component-type='RichTextContainer'] ul.framer-text li::marker {
        font-size: 16px !important;
      }
      body[data-eyc-page="about-us"] [data-framer-component-type='RichTextContainer'] ul.framer-text li + li {
        margin-top: 8px !important;
      }

      /* Footer containers: constrain to viewport */
      .framer-v181ca { overflow: hidden !important; }

      /* Hide orange radial gradient "bg shape" overlay in Benefit Section */
      .framer-rxijhn[data-framer-name="bg shape"] { display: none !important; }

      /* Hide "Static mirror" label from Framer */
      [data-framer-name="Static mirror"],
      [aria-label="Static mirror"] { display: none !important; }

      /* "Ervaringen van onze cliënten" container: fix clipped text on mobile */
      .framer-1pxw2q4 {
        height: auto !important;
      }

      /* iPad Mini (768px): "Je hebt gezien" + "Ervaringen" centered by parent alignItems:center — force full-width + hero-aligned padding */
      @media (max-width: 810px) {
        .framer-ReojI .framer-1pxw2q4,
        .framer-1pxw2q4 {
          width: 100% !important;
          max-width: 100% !important;
          align-self: stretch !important;
          padding-left: 32.5px !important;
          padding-right: 32.5px !important;
          box-sizing: border-box !important;
        }
      }

      /* "Je hebt gezien hoe wij werken..." — italic + match size of "Transformatie begint..." */
      .framer-1pxw2q4 > p.framer-text:first-child {
        font-style: italic !important;
        font-size: clamp(22px, 6.5vw, 30px) !important;
      }

      /* Reduce extra space after h4 subheadings on works pages (Basisprincipes, Kernwaarden, etc.) */
      .framer-5j3lq1 h4,
      .framer-5j3lq1 h4.framer-styles-preset-1jfyso {
        --framer-paragraph-spacing: 12px !important;
        margin-bottom: 4px !important;
        padding-bottom: 0 !important;
      }
      .framer-5j3lq1 ul,
      .framer-5j3lq1 ul.framer-text {
        --framer-paragraph-spacing: 8px !important;
        margin-top: 0 !important;
      }
      .framer-5j3lq1 h4 + ul,
      .framer-5j3lq1 h4 + p {
        margin-top: 0 !important;
      }

      /* On tablet/desktop (>=810px): make scrollsection bg transparent so video shows through */
      @media (min-width: 810px) {
        #scrollsection {
          background-color: transparent !important;
          background: transparent !important;
        }
        /* Make the framer root transparent too */
        .framer-ReojI.framer-72rtr7,
        .framer-ReojI [data-framer-root] {
          background-color: transparent !important;
        }
        /* Pull video up to cover the full area */
        .framer-p0zxn2-container {
          top: -15% !important;
          height: 135% !important;
          left: 0 !important;
          width: 100% !important;
        }
        /* Shift video content so the model's face is fully visible below the nav */
        .framer-p0zxn2-container video {
          object-position: 50% 30% !important;
        }
      }

      /* Slim down the nav so it doesn't cover the model's face (closed state only) */
      nav.framer-64i0W:not([data-framer-name="Desktop Open"]):not([data-framer-name="Phone Open"]),
      nav.framer-64i0W:not([data-framer-name="Desktop Open"]):not([data-framer-name="Phone Open"]) .framer-c3gred,
      nav.framer-64i0W:not([data-framer-name="Desktop Open"]):not([data-framer-name="Phone Open"]) .framer-b6gkj0 {
        height: 70px !important;
        min-height: 70px !important;
        max-height: 70px !important;
      }

      /* Nav wrapper + nav + body: all transparent so video shows through (closed state only) */
      .framer-yifQo,
      nav.framer-64i0W:not([data-framer-name="Desktop Open"]):not([data-framer-name="Phone Open"]),
      nav.framer-64i0W[style]:not([data-framer-name="Desktop Open"]):not([data-framer-name="Phone Open"]) {
        background-color: transparent !important;
        background: transparent !important;
      }
      /* When menu is open: dark overlay for readability */
      nav[data-framer-name="Desktop Open"],
      nav[data-framer-name="Phone Open"] {
        background-color: rgba(14, 14, 15, 0.82) !important;
        backdrop-filter: blur(14px) !important;
        -webkit-backdrop-filter: blur(14px) !important;
      }

      /* Pricing rows: allow wrapping on all breakpoints so long text doesn't overlap */
      [data-framer-name="Row"] {
        flex-wrap: wrap !important;
        gap: 2px 8px !important;
      }
      [data-framer-name="Row"] > [data-framer-name="Leading text"],
      [data-framer-name="Row"] > [data-framer-name="Trailing text"] {
        min-width: 0 !important;
        white-space: normal !important;
      }

      /* Pricing cards: fix layout on mobile */
      @media (max-width: 809px) {
        /* All pricing rows: wrap so items stack vertically */
        [data-framer-name="Row"] {
          flex-wrap: wrap !important;
        }
        [data-framer-name="Row"] > [data-framer-name="Leading text"],
        [data-framer-name="Row"] > [data-framer-name="Trailing text"] {
          flex: 0 0 100% !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          white-space: normal !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        /* Pricing card containers: auto-height so cards don't overlap */
        .framer-zXd3h .framer-1ho4yhm-container,
        .framer-zXd3h .framer-1m1uzis-container,
        .framer-zXd3h .framer-jzz9fq-container {
          height: auto !important;
          min-height: 0 !important;
          flex: 0 0 auto !important;
        }
        /* Parent wrappers: auto-height to fit expanded cards */
        .framer-zXd3h .framer-fg9h1e,
        .framer-zXd3h .framer-jzwg06,
        .framer-zXd3h .framer-qco6id {
          height: auto !important;
          min-height: 0 !important;
        }
        /* Pricing cards: keep titles inside, auto-height so nothing clips */
        .framer-yspRw.framer-60c7ud,
        .framer-Cwum2.framer-1r9i0kq {
          height: auto !important;
          min-height: 0 !important;
          overflow: visible !important;
          padding-top: 24px !important;
        }
        /* Reset heading sections so they sit inside the card naturally */
        .framer-73mxrg,
        .framer-1u3030y {
          top: 0 !important;
          margin-top: 0 !important;
          height: auto !important;
          position: relative !important;
        }
        /* Prevent text clipping inside pricing card feature lists */
        [data-framer-name="Table"],
        [data-framer-name="Content"],
        [data-framer-name="Pricing content"] {
          overflow: visible !important;
        }
        [data-framer-name="Leading text"] p.framer-text,
        [data-framer-name="Trailing text"] p.framer-text {
          white-space: normal !important;
          word-wrap: break-word !important;
        }
      }

      @media (min-width: 810px) {
        .framer-ReojI .framer-192e1xt {
          height: auto !important;
          min-height: clamp(760px, 88vh, 980px) !important;
        }

        .eyc-home-flow-shell {
          width: min(980px, 100%) !important;
          max-width: min(980px, 100%) !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .eyc-how-shell {
          display: block !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          background: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
          overflow: visible !important;
        }

        .eyc-how-shell::after,
        .eyc-how-shell::before {
          display: none !important;
        }

        .eyc-how-shell > .eyc-how-unclip {
          width: 100% !important;
          max-width: 100% !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          flex: 0 0 auto !important;
          align-self: stretch !important;
        }

        .eyc-how-shell > [data-framer-name="Light"],
        .eyc-how-shell > .framer-1mwm0gz {
          display: none !important;
        }

        .eyc-how-shell .eyc-how {
          width: 100% !important;
          max-width: 100% !important;
        }
        .eyc-how-shell .eyc-how__wrap {
          width: 100% !important;
          max-width: min(980px, 100%) !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .eyc-how-shell .eyc-how {
          padding-top: 0 !important;
          padding-bottom: clamp(24px, 3vw, 34px) !important;
        }

        .eyc-home-carousel-shell {
          width: min(980px, 100%) !important;
          max-width: min(980px, 100%) !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          overflow: visible !important;
        }

        .eyc-home-carousel-frame,
        .eyc-home-carousel-viewport,
        .eyc-home-carousel-shell .framer--carousel {
          width: 100% !important;
          max-width: 100% !important;
        }

        .eyc-home-carousel-viewport {
          padding-left: 0 !important;
          padding-right: 0 !important;
          overflow: visible !important;
        }

        .eyc-home-story-intro,
        .eyc-testimonial-intro-fix,
        .eyc-unclipped-copy {
          width: min(980px, 100%) !important;
          max-width: min(980px, 100%) !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        /* Keep the testimonial journey paragraph aligned with the section headings. */
        .eyc-unclipped-copy {
          text-align: left !important;
        }

        .framer-ReojI .framer-1vorql8.eyc-unclipped-block,
        .framer-ReojI .framer-15xfov9.eyc-unclipped-block {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .eyc-unclipped-copy,
        .eyc-home-story-intro,
        .eyc-testimonial-intro-fix,
        .eyc-unclipped-copy p,
        .eyc-home-story-intro p,
        .eyc-testimonial-intro-fix p,
        .eyc-unclipped-copy .framer-text,
        .eyc-home-story-intro .framer-text,
        .eyc-testimonial-intro-fix .framer-text {
          text-align: left !important;
        }

        .eyc-journey-copy-italic,
        .eyc-journey-copy-italic p,
        .eyc-journey-copy-italic .framer-text {
          font-family: Inter, "Inter Placeholder", sans-serif !important;
          font-style: italic !important;
          font-weight: 400 !important;
          letter-spacing: normal !important;
          line-height: 1.4 !important;
          opacity: 1 !important;
          transform: none !important;
          will-change: auto !important;
        }

        .eyc-testimonial-intro-fix,
        .eyc-testimonial-intro-fix p,
        .eyc-testimonial-intro-fix .framer-text {
          opacity: 1 !important;
          transform: none !important;
          will-change: auto !important;
        }
      }

      @media (max-width: 809.98px) {
        .framer-ReojI .framer-192e1xt {
          height: auto !important;
          min-height: clamp(680px, 96svh, 860px) !important;
        }

        .eyc-home-flow-shell {
          width: calc(100vw - 65px) !important;
          max-width: calc(100vw - 65px) !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        /* Remove visible outer box around Hoe wij werken on mobile */
        .framer-ReojI #benefit.framer-1vlqip2:has(.eyc-how-shell),
        .framer-1vlqip2:has(.eyc-how-shell) {
          border-radius: 0 !important;
          overflow: visible !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          padding-top: 0 !important;
        }

        /* Force inner Framer wrapper to full width so text blocks align left */
        .framer-1vlqip2:has(.eyc-how-shell) > .framer-uzoqzu {
          width: 100% !important;
          max-width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }

        .eyc-how-shell,
        .eyc-home-carousel-shell {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
        }

        /* Hide Framer radial gradient "Light" overlay on mobile */
        .eyc-how-shell > [data-framer-name="Light"],
        .eyc-how-shell > .framer-1mwm0gz {
          display: none !important;
        }

        /* Remove Framer margin so cards align with text at 28px */
        .eyc-how-shell,
        .eyc-home-flow-shell {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }

        .eyc-home-story-intro,
        .eyc-testimonial-intro-fix,
        .eyc-unclipped-copy {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          white-space: normal !important;
          overflow-wrap: anywhere;
        }

        /* Consistent left padding for all text blocks on mobile */
        .eyc-home-story-intro,
        .eyc-testimonial-intro-fix,
        .eyc-unclipped-copy {
          padding-left: 28px !important;
          padding-right: 28px !important;
          text-align: left !important;
        }

        /* Remove inner padding when already inside a padded section */
        #benefit .eyc-home-story-intro {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .eyc-home-story-intro .framer-text,
        .eyc-testimonial-intro-fix .framer-text,
        .eyc-unclipped-copy .framer-text {
          width: 100% !important;
          max-width: 100% !important;
          white-space: normal !important;
          overflow-wrap: anywhere;
        }

        .eyc-journey-copy-italic,
        .eyc-journey-copy-italic p,
        .eyc-journey-copy-italic .framer-text {
          font-family: Inter, "Inter Placeholder", sans-serif !important;
          font-style: italic !important;
          font-weight: 400 !important;
          letter-spacing: normal !important;
          line-height: 1.4 !important;
          opacity: 1 !important;
          transform: none !important;
          will-change: auto !important;
        }

        .eyc-testimonial-intro-fix,
        .eyc-testimonial-intro-fix p,
        .eyc-testimonial-intro-fix .framer-text {
          opacity: 1 !important;
          transform: none !important;
          will-change: auto !important;
        }

        .eyc-unclipped-block {
          height: auto !important;
          min-height: 0 !important;
          overflow: visible !important;
        }

        .framer-ReojI .framer-1laf7k2 {
          width: 100% !important;
          height: auto !important;
        }

        .framer-ReojI .framer-1vorql8,
        .framer-ReojI .framer-bbt7ix,
        .framer-ReojI .framer-1vq7ieh {
          height: auto !important;
          min-height: 0 !important;
        }

        /* Prevent carousel from causing horizontal overflow on mobile */
        .framer-ReojI .framer-bbt7ix,
        .framer-ReojI .framer-sdjd3g-container {
          overflow: hidden !important;
          max-width: 100vw !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function syncJourneyStayConnectedCta(root) {
    /* lang-aware: fix functions run for both NL and EN */
    if (!root || !root.querySelectorAll) return;

    root.querySelectorAll("[data-framer-component-type='RichTextContainer'], p, span").forEach((node) => {
      const labelText = norm(node.textContent || "");
      if (
        labelText !== "Verbind je met ons"
        && labelText !== "Connect With Us"
        && labelText !== "Book a Call"
        && labelText !== "Blijf verbonden"
      ) {
        return;
      }

      if (node.getAttribute && node.getAttribute("data-framer-component-type") === "RichTextContainer") {
        const textChildren = node.querySelectorAll("p, span");
        if (textChildren.length) {
          textChildren.forEach((child) => {
            child.textContent = "Blijf verbonden";
          });
        } else {
          node.textContent = "Blijf verbonden";
        }
      } else {
        node.textContent = "Blijf verbonden";
      }

      const link = node.closest("a");
      if (!link) return;

      link.setAttribute("href", INSTAGRAM_URL);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer noopener");
    });
  }

  /** Insert 3 studio clip videos between "03 TRANSFORMEREN" and testimonials intro */
  function insertStudioClips() {
    if (!isHomePath()) return;
    if (document.getElementById("eyc-studio-clips")) return;

    // Find TRANSFORMEREN card, walk up to its section, insert clips after it
    var transEl = null;
    var allEls = document.querySelectorAll("*");
    for (var i = 0; i < allEls.length; i++) {
      if (allEls[i].textContent && allEls[i].textContent.trim() === "TRANSFORMEREN" && allEls[i].offsetWidth > 50) {
        transEl = allEls[i];
        break;
      }
    }
    if (!transEl) return;

    // Walk up to the "Benefit Section" (section tag or container with 3+ children)
    var target = transEl;
    while (target.parentElement && target.parentElement.tagName !== "BODY") {
      target = target.parentElement;
      if (target.tagName === "SECTION" || (target.getAttribute && target.getAttribute("data-framer-name") === "Benefit Section")) break;
    }
    if (!target || target.tagName === "BODY") return;

    var container = document.createElement("div");
    container.id = "eyc-studio-clips";
    // Use srcdoc iframes to isolate videos from Framer's mutation observer
    var clipSrcs = ["/assets/studio-clip-1.mp4", "/assets/studio-clip-2.mp4", "/assets/studio-clip-3.mp4"];
    var row = document.createElement("div");
    row.style.cssText = "display:flex;gap:16px;width:100%;max-width:980px;margin:20px auto 0;padding:0;box-sizing:border-box";
    clipSrcs.forEach(function(src) {
      var frame = document.createElement("iframe");
      frame.style.cssText = "flex:1;min-width:0;border:none;border-radius:16px;aspect-ratio:16/9;overflow:hidden;background:#0e0e0f";
      frame.srcdoc = '<!DOCTYPE html><html><head><style>*{margin:0;padding:0;overflow:hidden;background:#0e0e0f}video{width:100%;height:100%;object-fit:contain}</style></head><body><video autoplay muted loop playsinline src="' + src + '"></video></body></html>';
      row.appendChild(frame);
    });
    container.appendChild(row);

    // Add responsive style for mobile: stack vertically
    if (!document.getElementById("eyc-studio-clips-style")) {
      var style = document.createElement("style");
      style.id = "eyc-studio-clips-style";
      style.textContent = "\
        /* Reduce spacing around studio clips */\
        #eyc-studio-clips {\
          margin-bottom: 0 !important;\
          width: 100% !important;\
        }\
        #eyc-studio-clips > div {\
          width: 100% !important;\
        }\
        #eyc-studio-clips iframe {\
          min-width: 0 !important;\
          width: 100% !important;\
        }\
        @media (max-width: 809px) {\
          #eyc-studio-clips {\
            margin-bottom: 0 !important;\
            width: calc(100vw - 65px) !important;\
            margin-left: 0px !important;\
          }\
          #eyc-studio-clips > div {\
            flex-direction: column !important;\
            gap: 12px !important;\
            padding: 0 !important;\
            margin: 20px 0 !important;\
            width: 100% !important;\
          }\
          #eyc-studio-clips iframe {\
            height: auto !important;\
            aspect-ratio: 16/9 !important;\
            width: 100% !important;\
            border-radius: 12px !important;\
          }\
        }\
      ";
      document.head.appendChild(style);
    }

    // Insert AFTER the target (after the 01/02/03 cards section)
    target.parentElement.insertBefore(container, target.nextSibling);

  }

  function fixTestimonialsIntroHeading(root) {
    if (!root || !root.querySelectorAll) return;
    ensureResponsiveLayoutStyles();

    root.querySelectorAll('[data-framer-component-type="RichTextContainer"]').forEach((block) => {
      const text = norm(block.textContent || "");
      if (!text.includes("Je hebt gezien hoe wij werken.")) return;
      if (!text.includes("Ervaringen van onze cliënten")) return;

      block.classList.add("eyc-testimonial-intro-fix", "eyc-unclipped-block");
    });
  }

  function alignTestimonialsCarousel(root) {
    if (!root || !root.querySelectorAll) return;
    if (!isHomePath()) return;
    ensureResponsiveLayoutStyles();

    const carousels = new Set();
    if (root.matches && root.matches(".framer--carousel")) carousels.add(root);
    root.querySelectorAll(".framer--carousel").forEach((carousel) => carousels.add(carousel));

    carousels.forEach((carousel) => {
      const shell = carousel.closest(".framer-1vorql8, .framer-15xfov9");
      const frame = carousel.closest('.framer-e8xuus-container, [data-framer-name="Projects Carousel"]');
      const viewport = carousel.parentElement;

      if (shell && shell.classList) shell.classList.add("eyc-home-carousel-shell");
      if (frame && frame.classList) frame.classList.add("eyc-home-carousel-frame");
      if (viewport && viewport.classList) viewport.classList.add("eyc-home-carousel-viewport");
    });
  }

  /** Remove italic from "Ons aanbod" and "Hoe wij werken" headings */
  function removeItalicFromHeadings(root) {
    if (!root || !root.querySelectorAll) return;
    var targets = ["Ons aanbod", "Hoe wij werken", "Hoe we werken", "Ervaringen van onze cli\u00ebnten"];
    root.querySelectorAll("strong, span, p").forEach(function(el) {
      var text = el.textContent && el.textContent.trim();
      if (targets.indexOf(text) !== -1) {
        var isErvaringen = text === "Ervaringen van onze cli\u00ebnten";
        // Keep "Ervaringen van onze cliënten" italic (cursive) on all viewports
        if (!isErvaringen) {
          el.style.setProperty("font-style", "normal", "important");
        }
        // Also fix parent elements that may have italic (skip Ervaringen)
        var parent = el.parentElement;
        while (parent && parent.tagName !== "BODY") {
          var ps = getComputedStyle(parent).fontStyle;
          if (ps === "italic" && !isErvaringen) {
            parent.style.setProperty("font-style", "normal", "important");
          }
          if (ps !== "italic") break;
          parent = parent.parentElement;
        }
      }
    });
  }

  function alignHomeStoryIntro(root) {
    if (!root || !root.querySelectorAll) return;
    ensureResponsiveLayoutStyles();

    root.querySelectorAll('[data-framer-component-type="RichTextContainer"]').forEach((block) => {
      const text = norm(block.textContent || "");
      if (!text.includes("Het aanbod is pas het startpunt.")) return;
      if (!text.includes("Hoe wij werken")) return;

      block.classList.add("eyc-home-story-intro", "eyc-unclipped-block");
    });
  }

  function fixJourneySectionLayout(root) {
    if (!root || !root.querySelectorAll) return;
    ensureResponsiveLayoutStyles();
    const textNodes = root.querySelectorAll("p, span, div");
    let foundJourneyCopy = false;

    textNodes.forEach((el) => {
      const text = norm(el.textContent || "");
      if (!text.includes("Hun ervaringen tonen wat mogelijk is.")) return;
      if (!text.includes("Verbind je met ons en begin de reis.")) return;
      foundJourneyCopy = true;

      const textBlock = el.closest('[data-framer-component-type="RichTextContainer"]');
      if (!textBlock) return;
      textBlock.classList.add("eyc-unclipped-copy", "eyc-unclipped-block", "eyc-journey-copy-italic");
    });

    if (foundJourneyCopy) syncJourneyStayConnectedCta(root);
  }

  const CONTACT_PHONE_DISPLAY = "+31 6 13 62 99 65";
  const CONTACT_PHONE_HREF = "tel:+31613629965";
  const CONTACT_EMAIL = "hi@empoweryourcore.com";
  const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

  function walkTextNodes(root, onText) {
    if (!root || typeof onText !== "function") return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let node;
    while ((node = walker.nextNode())) onText(node);
  }

  function ensureContactPageStyles() {
    if (document.getElementById("eyc-contact-fixes")) return;
    const style = document.createElement("style");
    style.id = "eyc-contact-fixes";
    style.textContent = `
      .eyc-contact-heading {
        white-space: normal !important;
      }

      .eyc-contact-anytime {
        margin-left: 0.26em !important;
        display: inline !important;
        font-family: "Instrument Serif", "Instrument Serif Placeholder", serif !important;
        font-style: italic !important;
        font-weight: 400 !important;
        color: rgba(228, 233, 242, 0.96) !important;
        -webkit-text-fill-color: rgba(228, 233, 242, 0.96) !important;
        background: none !important;
        background-image: none !important;
        -webkit-background-clip: border-box !important;
        background-clip: border-box !important;
        opacity: 1 !important;
      }

      h1 .eyc-contact-anytime,
      h2 .eyc-contact-anytime,
      h3 .eyc-contact-anytime {
        display: inline !important;
        color: rgba(228, 233, 242, 0.96) !important;
        -webkit-text-fill-color: rgba(228, 233, 242, 0.96) !important;
      }

      .eyc-contact-heading [data-text-fill="true"] {
        background: none !important;
        background-image: none !important;
        color: rgba(228, 233, 242, 0.96) !important;
        -webkit-text-fill-color: rgba(228, 233, 242, 0.96) !important;
      }

      .eyc-contact-phone-link,
      a[href^="tel:+31613629965"] {
        color: #ffffff !important;
        text-decoration: none !important;
        font-weight: 500;
        letter-spacing: 0.02em;
        line-height: 1.35;
      }

      .eyc-contact-phone-link:hover {
        color: #ffffff !important;
        text-decoration: none !important;
        opacity: 0.92;
      }

      .eyc-contact-hero-phone,
      .eyc-contact-hero-phone .framer-text,
      .eyc-contact-hero-phone a {
        color: #ffffff !important;
        font-size: 32px !important;
        font-weight: 600 !important;
      }

      @media (max-width: 809.98px) {
        .eyc-contact-heading {
          text-align: center !important;
          font-size: clamp(30px, 8.8vw, 52px) !important;
          line-height: 1.06 !important;
          letter-spacing: -0.014em !important;
          margin-bottom: 10px !important;
          white-space: normal !important;
          text-wrap: balance;
        }

        .eyc-contact-heading .eyc-contact-anytime {
          display: inline !important;
          margin-left: 0.2em !important;
          margin-top: 0;
          opacity: 1 !important;
        }

        .eyc-contact-hero-phone,
        .eyc-contact-hero-phone .framer-text,
        .eyc-contact-hero-phone a {
          text-align: center !important;
          font-size: clamp(22px, 6vw, 28px) !important;
          line-height: 1.3 !important;
          font-weight: 500 !important;
          letter-spacing: 0.01em !important;
          margin-top: 8px !important;
          margin-bottom: 8px !important;
          text-decoration: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function fixContactHeadingSpacing(root) {
    if (!root || !root.querySelectorAll) return;
    ensureContactPageStyles();

    const headings = root.querySelectorAll("h1, h2, h3");
    headings.forEach((heading) => {
      const collapsed = (heading.textContent || "").replace(/[\s\u00A0\u202F]+/g, "").toLowerCase();
      if (!collapsed.startsWith("bereikons")) return;
      heading.classList.add("eyc-contact-heading");
      const hasAnytime = /anytime|altijd/.test(collapsed);

      if (!hasAnytime) {
        const anytime = document.createElement("span");
        anytime.className = "eyc-contact-anytime";
        anytime.textContent = "\u00A0Anytime";
        heading.appendChild(anytime);
      }

      const highlighted = heading.querySelectorAll("span, em, i");
      highlighted.forEach((el) => {
        const value = norm(el.textContent || "").toLowerCase();
        if (value === "anytime" || value === "altijd") {
          el.classList.add("eyc-contact-anytime");
          const clean = (el.textContent || "").replace(/^[\s\u00A0\u202F]+/, "");
          el.textContent = clean.toLowerCase() === "altijd" ? "\u00A0Anytime" : `\u00A0${clean}`;
        }
      });

      if (!heading.querySelector("span, em, i") && (collapsed === "bereikonsanytime" || collapsed === "bereikonsaltijd")) {
        heading.textContent = "Bereik ons Anytime";
      }
    });
  }

  function fixContactDetails(root) {
    if (!root || !root.querySelectorAll) return;
    const pathname = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : "";
    const isContactPage = pathname.endsWith("/contact") || pathname.endsWith("/contact.html");
    if (!isContactPage) return;

    fixContactHeadingSpacing(root);

    root.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const combined = `${href} ${norm(a.textContent || "")}`.toLowerCase();

      if (/^tel:/i.test(href) || combined.includes("+971")) {
        a.setAttribute("href", CONTACT_PHONE_HREF);
        if (a.textContent && norm(a.textContent) !== CONTACT_PHONE_DISPLAY) a.textContent = CONTACT_PHONE_DISPLAY;
        a.classList.add("eyc-contact-phone-link");
      }

      if (/^mailto:/i.test(href) || /info@empoweryourcore\.com|landio@support\.com|hi@empoweryourcore\.com/i.test(combined)) {
        a.setAttribute("href", CONTACT_EMAIL_HREF);
        if (/@/.test(a.textContent || "") && norm(a.textContent || "") !== CONTACT_EMAIL) a.textContent = CONTACT_EMAIL;
      }
    });

    walkTextNodes(root, (node) => {
      const text = norm(node.textContent || "");
      if (!text) return;
      if (text === "+971 50 XXX XXXX" || text === "E-mail: hi@empoweryourcore.com") {
        node.textContent = CONTACT_PHONE_DISPLAY;
      } else if (text === "info@empoweryourcore.com" || text === "landio@support.com") {
        node.textContent = CONTACT_EMAIL;
      }
    });

    root.querySelectorAll(".framer-7JSZL").forEach((icon) => {
      const card = icon.closest('[data-border="true"]');
      if (!card) return;
      const candidates = Array.from(card.querySelectorAll(".framer-text, p, a, span, div")).filter((el) => {
        const text = norm(el.textContent || "");
        return text && text.length <= 36 && (/^\+/.test(text) || /e-mail/i.test(text) || /@/.test(text));
      });
      const target = candidates[0];
      if (target) target.textContent = CONTACT_PHONE_DISPLAY;

      const telLink = card.querySelector('a[href^="tel:"], a[href*="+971"]');
      if (telLink) {
        telLink.setAttribute("href", CONTACT_PHONE_HREF);
        telLink.textContent = CONTACT_PHONE_DISPLAY;
        telLink.classList.add("eyc-contact-phone-link");
      }
    });

    root.querySelectorAll(".framer-bp64j").forEach((icon) => {
      const card = icon.closest('[data-border="true"]');
      if (!card) return;
      const text = norm(card.textContent || "");
      if (text.includes("boek een sessie") || text.includes("e-mail") || text.includes("@")) {
        const emailLink = card.querySelector('a[href^="mailto:"], a[href*="@"]');
        if (emailLink) {
          emailLink.setAttribute("href", CONTACT_EMAIL_HREF);
          emailLink.textContent = CONTACT_EMAIL;
          return;
        }

        const candidates = Array.from(card.querySelectorAll(".framer-text, p, span, div")).filter((el) => {
          const value = norm(el.textContent || "");
          return value && value.length <= 48 && /@|e-mail/i.test(value);
        });
        const target = candidates[0];
        if (target) target.textContent = CONTACT_EMAIL;
      }
    });

    root.querySelectorAll(".framer-text, p, span, div").forEach((el) => {
      if (!el || el.tagName === "A") return;
      if (el.querySelector("a[href^='tel:']")) return;
      if (norm(el.textContent || "") !== CONTACT_PHONE_DISPLAY) return;

      const link = document.createElement("a");
      link.setAttribute("href", CONTACT_PHONE_HREF);
      link.className = "eyc-contact-phone-link";
      link.textContent = CONTACT_PHONE_DISPLAY;

      el.textContent = "";
      el.appendChild(link);
    });

    root.querySelectorAll(".framer-text, p, span, div, a").forEach((el) => {
      if (!el || !el.textContent) return;
      if (norm(el.textContent) !== CONTACT_PHONE_DISPLAY) return;
      const textBlock = el.closest('[data-framer-component-type="RichTextContainer"]');
      if (textBlock && textBlock.classList) textBlock.classList.add("eyc-contact-hero-phone");
      if (el.classList) el.classList.add("eyc-contact-hero-phone");
    });
  }

  function removeContactQuoteButton(root) {
    if (!root || !root.querySelectorAll) return;
    const pathname = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : "";
    const isContactPage = pathname.endsWith("/contact") || pathname.endsWith("/contact.html");
    if (!isContactPage) return;

    const candidates = root.querySelectorAll("a, button");
    candidates.forEach((el) => {
      const text = norm(el.textContent || "").toLowerCase();
      const href = (el.getAttribute && el.getAttribute("href")) ? el.getAttribute("href").toLowerCase() : "";
      if (!text) return;
      if (
        text.includes("vraag een offerte aan")
        || text.includes("request a quote")
        || (text.includes("offerte") && text.includes("aan"))
        || href.includes("quote")
      ) {
        el.remove();
      }
    });
  }

  function isHomePath() {
    const pathname = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : "";
    return pathname === "/" || pathname.endsWith("/index.html");
  }

  function fixHomeKickerPunctuation(root) {
    /* lang-aware: fix functions run for both NL and EN */
    if (!root || !isHomePath()) return;

    walkTextNodes(root, (node) => {
      const current = node.textContent || "";
      if (!current.includes("Stap in je kern — de reis begint vandaag.")) return;

      const next = current.replace(
        /Stap in je kern — de reis begint vandaag\./g,
        "Stap in je kern — de reis begint vandaag"
      );
      if (next !== current) node.textContent = next;
    });
  }

  const HOME_TEACHER_TRAINING_CARD_VERSION = "2026-03-14-v1";
  const HOME_TEACHER_TRAINING_CARD_TEASER = "Word een expert in beweging.";
  const HOME_TEACHER_TRAINING_CARD_TEASER_HTML = `
    <p class="framer-text framer-styles-preset-saf75d" data-styles-preset="xEbsc9wJk" style="--framer-text-color:var(--extracted-r6o4lv, var(--token-9b0083b8-b14b-4f4a-b9c6-4a160184ab2b, rgba(255, 255, 255, 0.6)))">${HOME_TEACHER_TRAINING_CARD_TEASER}</p>
  `;

  function syncHomeTeacherTrainingCard(root) {
    /* lang-aware: fix functions run for both NL and EN */
    if (!root || !root.querySelectorAll) return;
    if (!isHomePath()) return;

    const cards = new Set();
    const closestCard = root.closest ? root.closest('a[href*="teacher-training"]') : null;
    if (closestCard) cards.add(closestCard);
    if (root.matches && root.matches('a[href*="teacher-training"]')) cards.add(root);
    root.querySelectorAll('a[href*="teacher-training"]').forEach((card) => cards.add(card));

    cards.forEach((card) => {
      const text = norm(card.textContent || "");
      if (
        !text.includes("Opleiding voor Pilatesdocenten")
        && !text.includes("Teacher Training Program")
        && !text.includes(TEACHER_TRAINING_NOTICE_TEXT)
        && !text.includes("Word een expert in beweging")
      ) {
        return;
      }

      const richBlocks = [...card.querySelectorAll('[data-framer-component-type="RichTextContainer"]')];
      if (!richBlocks.length) return;

      const titleBlock = richBlocks.find((block) => {
        const blockText = norm(block.textContent || "");
        return blockText.includes("Opleiding voor Pilatesdocenten") || blockText.includes("Teacher Training Program");
      });
      if (!titleBlock) return;

      const teaserBlock = richBlocks.find((block) => {
        if (block === titleBlock) return false;
        const blockText = norm(block.textContent || "");
        if (!blockText) return false;
        if (blockText.includes("Bekijk")) return false;
        return true;
      });
      if (!teaserBlock) return;

      if (
        teaserBlock.dataset.eycHomeTeacherTrainingCardVersion === HOME_TEACHER_TRAINING_CARD_VERSION
        && norm(teaserBlock.textContent || "") === HOME_TEACHER_TRAINING_CARD_TEASER
      ) {
        return;
      }

      teaserBlock.innerHTML = HOME_TEACHER_TRAINING_CARD_TEASER_HTML;
      teaserBlock.dataset.eycHomeTeacherTrainingCardVersion = HOME_TEACHER_TRAINING_CARD_VERSION;
    });
  }

  const HOME_BENEFIT_VIDEO_SRC = "/assets/home-benefit-video.mp4";
  const HOME_BENEFIT_VIDEO_POSTER = "/assets/home-benefit-video-poster.jpg";

  function ensureHomeBenefitVideoStyles() {
    if (document.getElementById("eyc-home-benefit-video")) return;
    if (!isHomePath()) return;

    const style = document.createElement("style");
    style.id = "eyc-home-benefit-video";
    style.textContent = `
      #benefit.framer-1vlqip2,
      #benefit .framer-uzoqzu,
      #benefit .framer-10uv332,
      #benefit .framer-1xv11j0 {
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
      }

      #benefit.framer-1vlqip2 {
        padding-top: clamp(48px, 5vw, 72px) !important;
        padding-bottom: 13px !important;
        border-radius: 0 !important;
        overflow: visible !important;
      }

      #testimonial.framer-15xfov9 {
        padding-top: 0px !important;
      }

      #testimonial .eyc-home-carousel-viewport {
        padding-top: 0 !important;
      }

      #benefit .framer-uzoqzu,
      #benefit .framer-10uv332,
      #benefit .framer-1xv11j0 {
        align-items: stretch !important;
      }

      #benefit .framer-10uv332,
      #benefit .framer-1xv11j0 {
        justify-content: flex-start !important;
      }

      .framer-10vbf28-container,
      .framer-10vbf28-container > * {
        overflow: visible !important;
      }

      /* Nav closed: subtle dark tint so nav is visible over hero video (all variants) */
      .framer-10vbf28-container .framer-64i0W.framer-wfgthj:not([data-framer-name="Desktop Open"]):not([data-framer-name="Phone Open"]) {
        background: rgba(14, 14, 15, 0.18) !important;
        background-image: none !important;
        -webkit-backdrop-filter: blur(6px) !important;
        backdrop-filter: blur(6px) !important;
        -webkit-mask-image: none !important;
        mask-image: none !important;
      }

      #benefit .framer-uzoqzu {
        gap: clamp(30px, 3.6vw, 48px) !important;
        max-width: 100% !important;
        overflow: visible !important;
        box-sizing: border-box !important;
      }
      @media (min-width: 810px) {
        #benefit .framer-uzoqzu {
          padding-left: 64px !important;
          padding-right: 64px !important;
        }
      }

      #benefit .framer-1xv11j0 {
        gap: clamp(14px, 2vw, 22px) !important;
      }

      #benefit .framer-w9tee5 {
        width: min(100%, 980px) !important;
        max-width: 980px !important;
        margin: 0 auto !important;
        align-self: center !important;
        justify-content: flex-start !important;
      }

      #benefit .framer-6o77r {
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        justify-content: flex-start !important;
        align-items: flex-start !important;
        opacity: 1 !important;
        transform: none !important;
        will-change: auto !important;
      }

      #benefit .framer-uidrzw {
        width: min(100%, 980px) !important;
        max-width: 980px !important;
        margin: 0 auto !important;
        align-self: center !important;
        height: auto !important;
        justify-content: flex-start !important;
        align-items: flex-start !important;
      }

      /* Constrain journey intro text to match 980px content width */
      #benefit .framer-mdaglj {
        width: min(100%, 980px) !important;
        max-width: min(980px, 100%) !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      /* Remove fixed heights on "Hoe wij werken" and "Ervaringen" containers */
      #benefit .framer-y7rf7p {
        height: auto !important;
      }

      @media (min-width: 810px) {
        #benefit .framer-y7rf7p {
          margin-top: -38px !important;
        }
      }

      @media (max-width: 809.98px) {
        #benefit .framer-y7rf7p {
          margin-top: -8px !important;
        }

        /* Match all intro text blocks to "Ons aanbod" style on mobile */
        #benefit .framer-134ky5m p.framer-text,
        #benefit .framer-mdaglj p.framer-text,
        .eyc-journey-copy-italic p.framer-text {
          font-size: clamp(22px, 6.5vw, 30px) !important;
          line-height: 44px !important;
          font-weight: 400 !important;
          font-style: italic !important;
          font-family: Inter, "Inter Placeholder", sans-serif !important;
          letter-spacing: normal !important;
        }
        /* Ensure heading strong tags keep bold weight */
        #benefit .framer-134ky5m strong.framer-text,
        #benefit .framer-mdaglj strong.framer-text,
        .eyc-journey-copy-italic strong.framer-text {
          font-weight: 700 !important;
        }
      }

      #benefit .framer-134ky5m {
        height: auto !important;
        width: min(100%, 980px) !important;
        max-width: min(980px, 100%) !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      #benefit .framer-1vorql8 {
        height: auto !important;
        gap: clamp(30px, 3.6vw, 48px) !important;
        padding-top: clamp(24px, 3vw, 40px) !important;
        padding-bottom: clamp(24px, 3vw, 40px) !important;
      }

      #benefit .framer-6o77r p,
      #benefit .framer-6o77r .framer-text {
        text-align: left !important;
        opacity: 1 !important;
        transform: none !important;
        will-change: auto !important;
      }

      #benefit .eyc-benefit-video-shell {
        position: relative !important;
        width: 980px !important;
        max-width: 100% !important;
        margin: 0 auto 32px !important;
        align-self: center !important;
        padding: 0 !important;
        border-radius: 0 !important;
        border: 0 !important;
        background: #0e0e0f !important;
        box-shadow: none !important;
        overflow: hidden !important;
        isolation: isolate !important;
      }

      #benefit .eyc-benefit-video-shell::before {
        display: none !important;
      }

      #benefit .eyc-benefit-video {
        position: relative !important;
        z-index: 1 !important;
        display: block !important;
        width: 100% !important;
        aspect-ratio: 16 / 9 !important;
        border-radius: 0 !important;
        background: #0e0e0f !important;
        object-fit: cover !important;
        box-shadow: none !important;
      }

      @media (max-width: 810px) {
        #benefit.framer-1vlqip2 {
          padding-top: 24px !important;
          padding-bottom: 40px !important;
          padding-left: 32.5px !important;
          padding-right: 32.5px !important;
          box-sizing: border-box !important;
        }

        #benefit .framer-10uv332,
        #benefit .framer-1xv11j0 {
          width: 100% !important;
          max-width: 100% !important;
        }

        #benefit .eyc-benefit-video-shell {
          width: calc(100vw - 65px) !important;
          max-width: calc(100vw - 65px) !important;
          margin-left: 0px !important;
          margin-right: auto !important;
          overflow: hidden !important;
          border-radius: 12px !important;
        }

        #benefit .eyc-benefit-video-shell .eyc-benefit-video {
          width: 100% !important;
          max-width: 100% !important;
        }

        #benefit .framer-uzoqzu {
          gap: 22px !important;
        }

        #benefit .framer-1xv11j0 {
          gap: 14px !important;
        }

        #benefit .framer-w9tee5,
        #benefit .framer-6o77r,
        #benefit .framer-uidrzw {
          max-width: 100% !important;
        }

        /* Remove fixed height so images sit right below "Ons aanbod" */
        #benefit .framer-uidrzw {
          height: auto !important;
          justify-content: flex-start !important;
          align-items: flex-start !important;
        }

        /* Scale down italic intro text for mobile */
        #benefit .framer-6o77r p,
        #benefit .framer-6o77r .framer-text {
          font-size: clamp(22px, 6.5vw, 30px) !important;
        }

        #benefit .eyc-benefit-video-shell {
          padding: 0 !important;
          border-radius: 0 !important;
          margin-top: 32px !important;
          margin-bottom: 40px !important;
          margin-left: -32.5px !important;
          margin-right: -32.5px !important;
          width: calc(100% + 65px) !important;
          max-width: none !important;
        }

        #benefit .eyc-benefit-video {
          border-radius: 0 !important;
          background-color: rgb(14, 14, 15) !important;
          width: 100% !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function insertHomeBenefitVideo(root) {
    if (!root) return;
    if (!isHomePath()) return;
    ensureHomeBenefitVideoStyles();

    const benefit = document.getElementById("benefit");
    if (!benefit) return;

    const stack = benefit.querySelector(".framer-1xv11j0");
    if (!stack) return;

    const version = "2026-03-14-v1";
    const existing = stack.querySelector(".eyc-benefit-video-shell");
    if (existing) {
      const video = existing.querySelector("video");
      if (video) {
        if (video.getAttribute("src") !== HOME_BENEFIT_VIDEO_SRC) video.setAttribute("src", HOME_BENEFIT_VIDEO_SRC);
        if (video.getAttribute("poster") !== HOME_BENEFIT_VIDEO_POSTER) video.setAttribute("poster", HOME_BENEFIT_VIDEO_POSTER);
        video.dataset.eycVideoLock = "true";
        video.muted = true;
        video.defaultMuted = true;
      }
      stack.setAttribute("data-eyc-benefit-video-version", version);
      return;
    }

    const shell = document.createElement("div");
    shell.className = "eyc-benefit-video-shell";
    shell.setAttribute("data-eyc-benefit-video", "true");
    shell.innerHTML = `
      <video
        class="eyc-benefit-video"
        src="${HOME_BENEFIT_VIDEO_SRC}"
        poster="${HOME_BENEFIT_VIDEO_POSTER}"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        data-eyc-video-lock="true"
        aria-label="Video-impressie van de Empower Your Core studio"
      ></video>
    `;

    const target = stack.querySelector(".framer-w9tee5");
    stack.insertBefore(shell, target || stack.firstChild);
    stack.setAttribute("data-eyc-benefit-video-version", version);

    // On mobile, force alignment with cards (left:28px, width:365px)
    if (window.innerWidth <= 809) {
      shell.style.setProperty("width", "calc(100vw - 65px)", "important");
      shell.style.setProperty("max-width", "calc(100vw - 65px)", "important");
      shell.style.setProperty("margin-left", "0", "important");
      shell.style.setProperty("margin-right", "auto", "important");
      shell.style.setProperty("border-radius", "12px", "important");
    }

    const video = shell.querySelector("video");
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      if (typeof video.play === "function") {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
      }
    }
  }

  function ensureHomeDocxIntroStyle() {
    if (document.getElementById("eyc-home-docx-intro")) return;
    if (!isHomePath()) return;

    // Load Cormorant Garamond + Inter from Google Fonts
    if (!document.getElementById("eyc-google-fonts")) {
      const link = document.createElement("link");
      link.id = "eyc-google-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@300;400;500&display=swap";
      document.head.appendChild(link);
    }

    const style = document.createElement("style");
    style.id = "eyc-home-docx-intro";
    style.textContent = `
      #scrollsection .eyc-home-kicker,
      .eyc-home-kicker {
        --eyc-kicker-text: #f5ead0 !important;
        --eyc-kicker-shadow: 0 1px 2px rgba(0, 0, 0, 0.38) !important;
        display: block !important;
        width: fit-content !important;
        max-width: min(92vw, 960px) !important;
        margin: 6px auto 14px !important;
        padding: clamp(10px, 1.3vw, 15px) clamp(20px, 3vw, 36px) !important;
        border-radius: 999px !important;
        border: 1px solid rgba(224, 194, 129, 0.72) !important;
        background: rgba(245, 236, 217, 0.14) !important;
        box-sizing: border-box !important;
        box-shadow: none !important;
        backdrop-filter: blur(8px) saturate(108%) !important;
        -webkit-backdrop-filter: blur(8px) saturate(108%) !important;
        text-align: center !important;
        overflow: visible !important;
        white-space: normal !important;
        text-wrap: balance !important;
      }

      #scrollsection .eyc-home-kicker,
      #scrollsection .eyc-home-kicker p,
      #scrollsection .eyc-home-kicker .framer-text,
      #scrollsection .eyc-home-kicker [data-text-fill="true"],
      .eyc-home-kicker,
      .eyc-home-kicker p,
      .eyc-home-kicker .framer-text,
      .eyc-home-kicker [data-text-fill="true"] {
        font-family: "Instrument Sans", "Instrument Sans Placeholder", sans-serif !important;
        font-size: clamp(17px, 1.7vw, 26px) !important;
        font-weight: 600 !important;
        line-height: 1.26 !important;
        letter-spacing: 0.01em !important;
        color: var(--eyc-kicker-text) !important;
        -webkit-text-fill-color: var(--eyc-kicker-text) !important;
        --framer-text-color: var(--eyc-kicker-text) !important;
        opacity: 1 !important;
        text-shadow: var(--eyc-kicker-shadow) !important;
        background: none !important;
        -webkit-text-stroke: 0 !important;
      }

      #scrollsection .eyc-home-intro-shell,
      .eyc-home-intro-shell {
        --eyc-home-flow-width: min(980px, calc(100vw - 65px)) !important;
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 auto !important;
        padding-inline: 0 !important;
        height: auto !important;
        max-height: none !important;
        overflow: visible !important;
        box-sizing: border-box !important;
      }

      #scrollsection .eyc-home-intro-shell .framer-1qjazz9,
      .eyc-home-intro-shell .framer-1qjazz9 {
        padding-bottom: clamp(36px, 3vw, 68px) !important;
        min-height: 0 !important;
        height: auto !important;
      }

      #scrollsection .eyc-home-intro-card,
      .eyc-home-intro-card,
      #scrollsection .eyc-premium-intro,
      .eyc-premium-intro,
      #scrollsection .eyc-home-intro-shell,
      .eyc-home-intro-shell {
        --eyc-home-flow-width: min(980px, calc(100vw - 65px)) !important;
      }

      #scrollsection .eyc-home-intro-card,
      .eyc-home-intro-card {
        display: block !important;
        width: var(--eyc-home-flow-width) !important;
        max-width: var(--eyc-home-flow-width) !important;
        margin: 0 auto !important;
        height: auto !important;
        max-height: none !important;
        overflow: visible !important;
        box-sizing: border-box !important;
      }

      #scrollsection .eyc-home-intro-card,
      .eyc-home-intro-card {
        padding: 0 !important;
        border: 0 !important;
        background: none !important;
      }

      #scrollsection .eyc-home-intro-card [data-text-fill="true"],
      #scrollsection .eyc-home-intro-card .framer-text[data-text-fill],
      .eyc-home-intro-card [data-text-fill="true"],
      .eyc-home-intro-card .framer-text[data-text-fill] {
        background-image: none !important;
        -webkit-background-clip: border-box !important;
        background-clip: border-box !important;
      }

      /* Remove legacy Framer seam layers between hero video and premium intro. */
      #scrollsection .framer-1ocbugl,
      #scrollsection .framer-1c8aodz,
      #scrollsection .framer-15vo5wy-container,
      #scrollsection .framer-1fs3iez,
      #scrollsection .framer-s93ff6 {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        min-height: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      #scrollsection .framer-1k50l8t {
        display: none !important;
        height: 0 !important;
        min-height: 0 !important;
        max-height: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      #scrollsection .eyc-premium-intro,
      .eyc-premium-intro {
        --text: #eae7e1;
        --muted: rgba(234, 231, 225, 0.78);
        --gold: #c9a24a;
        --line: rgba(201, 162, 74, 0.35);
        --radius: 24px;
        --shadow: none;
        font-family: Inter, "Instrument Sans", system-ui, -apple-system, sans-serif !important;
        color: var(--text) !important;
        line-height: 1.5 !important;
        position: relative !important;
        isolation: isolate !important;
        display: block !important;
        width: var(--eyc-home-flow-width) !important;
        max-width: var(--eyc-home-flow-width) !important;
        min-width: 0 !important;
        margin: 0 auto !important;
        padding: clamp(40px, 5vw, 64px) clamp(16px, 2.5vw, 32px) clamp(24px, 2.4vw, 34px) !important;
        border-radius: var(--radius) !important;
        border: 1px solid rgba(201, 162, 74, 0.1) !important;
        background:
          radial-gradient(1080px 560px at 50% 8%, rgba(201, 162, 74, 0.08), transparent 58%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.014), rgba(255, 255, 255, 0.006)) !important;
        box-shadow: var(--shadow) !important;
        text-align: center !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
      }

      #scrollsection .eyc-premium-intro *,
      .eyc-premium-intro * {
        box-sizing: border-box !important;
      }

      #scrollsection .eyc-premium-hero,
      .eyc-premium-hero {
        display: block !important;
        text-align: center !important;
      }

      #scrollsection .eyc-premium-kicker,
      .eyc-premium-kicker {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: fit-content !important;
        max-width: min(100%, 100%) !important;
        margin: 0 auto !important;
        gap: 0 !important;
        padding: 10px 14px !important;
        border-radius: 999px !important;
        border: 1px solid rgba(201, 162, 74, 0.25) !important;
        background: rgba(255, 255, 255, 0.02) !important;
        color: rgba(234, 231, 225, 0.86) !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        text-align: center !important;
      }

      #scrollsection .eyc-premium-dot,
      .eyc-premium-dot {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      #scrollsection .eyc-premium-title,
      .eyc-premium-title {
        display: block !important;
        margin: 24px 0 10px !important;
        font-family: "Cormorant Garamond", "Instrument Serif", "Instrument Serif Placeholder", serif !important;
        font-style: normal !important;
        font-weight: 600 !important;
        letter-spacing: -0.02em !important;
        font-size: clamp(38px, 5.2vw, 66px) !important;
        line-height: 1.02 !important;
        color: #c9a24a !important;
        -webkit-text-fill-color: #c9a24a !important;
        text-shadow: 0 8px 26px rgba(0, 0, 0, 0.45) !important;
        white-space: normal !important;
      }

      #scrollsection .eyc-premium-sub,
      #scrollsection .eyc-premium-copy,
      #scrollsection .eyc-premium-panel p,
      .eyc-premium-sub,
      .eyc-premium-copy,
      .eyc-premium-panel p {
        display: block !important;
        white-space: normal !important;
        text-wrap: pretty !important;
        text-overflow: clip !important;
        overflow: visible !important;
        -webkit-line-clamp: unset !important;
        line-clamp: unset !important;
        color: rgba(234, 231, 225, 0.9) !important;
        -webkit-text-fill-color: rgba(234, 231, 225, 0.9) !important;
      }

      #scrollsection .eyc-premium-sub,
      .eyc-premium-sub {
        margin: 0 auto !important;
        max-width: 56ch !important;
        font-size: clamp(18px, 2.1vw, 22px) !important;
        line-height: 1.4 !important;
        font-weight: 400 !important;
      }

      #scrollsection .eyc-premium-divider,
      .eyc-premium-divider {
        width: min(560px, 92%) !important;
        height: 1px !important;
        margin: 20px auto 0 !important;
        background: linear-gradient(90deg, transparent, var(--line), transparent) !important;
      }

      #scrollsection .eyc-premium-copy,
      .eyc-premium-copy {
        margin: 22px auto 0 !important;
        max-width: 64ch !important;
        font-size: clamp(15px, 1.2vw, 18px) !important;
        font-weight: 300 !important;
        line-height: 1.6 !important;
      }

      #scrollsection .eyc-premium-benefits,
      .eyc-premium-benefits {
        margin: 26px auto 0 !important;
        display: grid !important;
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        gap: 0 !important;
        width: 100% !important;
        max-width: 940px !important;
        overflow: visible !important;
        border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
      }

      #scrollsection .eyc-premium-chip,
      .eyc-premium-chip {
        display: block !important;
        padding: 16px 14px 0 !important;
        border-radius: 0 !important;
        border: 0 !important;
        border-left: 1px solid rgba(255, 255, 255, 0.06) !important;
        background: transparent !important;
        box-shadow: none !important;
        text-align: center !important;
      }

      #scrollsection .eyc-premium-chip:first-child,
      .eyc-premium-chip:first-child {
        border-left: 0 !important;
      }

      #scrollsection .eyc-premium-chip b,
      .eyc-premium-chip b {
        display: block !important;
        color: #f2f5fb !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        letter-spacing: 0.01em !important;
      }

      #scrollsection .eyc-premium-chip span,
      .eyc-premium-chip span {
        display: block !important;
        margin-top: 6px !important;
        color: rgba(234, 231, 225, 0.7) !important;
        font-size: 12px !important;
        font-weight: 300 !important;
      }

      #scrollsection .eyc-premium-panel,
      .eyc-premium-panel {
        display: block !important;
        width: 100% !important;
        max-width: 760px !important;
        min-height: 0 !important;
        height: auto !important;
        margin: clamp(30px, 3.8vw, 42px) auto 0 !important;
        border-radius: 0 !important;
        border: 0 !important;
        border-top: 1px solid rgba(201, 162, 74, 0.16) !important;
        background: transparent !important;
        box-shadow: var(--shadow) !important;
        padding: clamp(24px, 2.8vw, 30px) 0 0 !important;
        text-align: center !important;
      }

      #scrollsection .eyc-premium-panel > *,
      .eyc-premium-panel > * {
        margin-left: auto !important;
        margin-right: auto !important;
      }

      #scrollsection .eyc-premium-panel > *:last-child,
      .eyc-premium-panel > *:last-child {
        margin-bottom: 0 !important;
      }

      #scrollsection .eyc-premium-panel h3,
      .eyc-premium-panel h3 {
        display: block !important;
        margin: 0 0 10px !important;
        font-family: "Cormorant Garamond", "Instrument Serif", "Instrument Serif Placeholder", serif !important;
        font-size: clamp(28px, 3.5vw, 42px) !important;
        line-height: 1.12 !important;
        letter-spacing: -0.01em !important;
        font-weight: 600 !important;
        color: #f0ece5 !important;
        -webkit-text-fill-color: #f0ece5 !important;
      }

      #scrollsection .eyc-premium-tagline,
      .eyc-premium-tagline {
        margin-top: 16px !important;
        max-width: 30ch !important;
        line-height: 1.45 !important;
        font-size: 14px !important;
        color: rgba(234, 231, 225, 0.75) !important;
        letter-spacing: 0.02em !important;
      }

      #scrollsection .eyc-premium-tagline em,
      .eyc-premium-tagline em {
        color: #c9a24a !important;
        font-style: normal !important;
        font-weight: 500 !important;
      }

      #scrollsection .eyc-premium-cta,
      .eyc-premium-cta {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0 !important;
        width: auto !important;
        max-width: 100% !important;
        min-height: 50px !important;
        margin-top: 22px !important;
        padding: 12px 26px !important;
        border-radius: 999px !important;
        border: 1px solid rgba(201, 162, 74, 0.35) !important;
        background: linear-gradient(180deg, rgba(201, 162, 74, 0.16), rgba(201, 162, 74, 0.06)) !important;
        color: #f0ece5 !important;
        text-decoration: none !important;
        font-size: 16px !important;
        font-weight: 500 !important;
        box-shadow: 0 16px 34px rgba(0, 0, 0, 0.4) !important;
      }

      #scrollsection .eyc-premium-cta-dot,
      .eyc-premium-cta-dot {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      #scrollsection .eyc-premium-cta-sub,
      .eyc-premium-cta-sub {
        display: block !important;
        margin-top: 12px !important;
        position: relative !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: fit-content !important;
        max-width: min(100%, 38ch) !important;
        text-align: center !important;
        color: rgba(234, 231, 225, 0.72) !important;
        font-size: 13px !important;
        line-height: 1.45 !important;
        font-weight: 400 !important;
      }

      @media (max-width: 1140px) {
        #scrollsection .eyc-premium-benefits,
        .eyc-premium-benefits {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }

        #scrollsection .eyc-premium-chip:nth-child(2n + 1),
        .eyc-premium-chip:nth-child(2n + 1) {
          border-left: 0 !important;
        }
      }

      @media (min-width: 811px) and (max-width: 1200px) {
        /* Mid laptop/tablet widths: avoid compressed "zoomed-out" layout. */
        .framer-ReojI #benefit.framer-1vlqip2,
        .framer-ReojI .framer-1kzql4v,
        .framer-ReojI .framer-1vq7ieh {
          padding-left: clamp(16px, 4.6vw, 56px) !important;
          padding-right: clamp(16px, 4.6vw, 56px) !important;
        }
      }

      @media (max-width: 810px) {
        /* Match hero card margin (32.5px) so content aligns across all sections */
        .framer-ReojI .framer-1kzql4v,
        .framer-ReojI .framer-1vq7ieh {
          padding-left: 32.5px !important;
          padding-right: 32.5px !important;
        }
        /* #benefit padding must match hero card margin (32.5px each side) */
        .framer-ReojI #benefit.framer-1vlqip2 {
          padding-left: 32.5px !important;
          padding-right: 32.5px !important;
        }

        /* Remove overflow:hidden that creates visible seam line between sections */
        .framer-ReojI .framer-1kzql4v {
          overflow: visible !important;
        }

        /* Mobile seam cleanup: Framer gradient strips that create visible lines between sections. */
        .framer-ReojI .framer-1fs3iez,
        .framer-ReojI .framer-1k50l8t {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          min-height: 0 !important;
          max-height: 0 !important;
          overflow: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        #scrollsection .eyc-home-intro-shell,
        .eyc-home-intro-shell {
          width: calc(100vw - 65px) !important;
          max-width: calc(100vw - 65px) !important;
          padding-inline: 0 !important;
          margin-top: clamp(18px, 4.8vw, 30px) !important;
          margin-left: auto !important;
          margin-right: auto !important;
          align-self: center !important;
          flex: 0 0 auto !important;
        }

        #scrollsection .eyc-home-intro-shell > *,
        .eyc-home-intro-shell > * {
          width: calc(100vw - 65px) !important;
          max-width: calc(100vw - 65px) !important;
          min-width: 0 !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        #scrollsection .eyc-home-intro-card,
        .eyc-home-intro-card {
          width: calc(100vw - 65px) !important;
          max-width: calc(100vw - 65px) !important;
          min-width: 0 !important;
          margin-top: clamp(14px, 4.2vw, 24px) !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }

        #scrollsection .eyc-home-kicker,
        .eyc-home-kicker {
          max-width: min(94vw, 720px) !important;
          padding: 9px 15px !important;
          border-radius: 999px !important;
          margin: 4px auto 12px !important;
        }

        #scrollsection .eyc-home-kicker,
        #scrollsection .eyc-home-kicker p,
        #scrollsection .eyc-home-kicker .framer-text,
        #scrollsection .eyc-home-kicker [data-text-fill="true"],
        .eyc-home-kicker,
        .eyc-home-kicker p,
        .eyc-home-kicker .framer-text,
        .eyc-home-kicker [data-text-fill="true"] {
          font-size: clamp(15px, 4.3vw, 19px) !important;
          line-height: 1.38 !important;
          letter-spacing: 0.008em !important;
        }

        #scrollsection .eyc-premium-intro,
        .eyc-premium-intro {
          width: calc(100vw - 65px) !important;
          max-width: calc(100vw - 65px) !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding: 36px 14px 40px !important;
          border-radius: 18px !important;
        }

        #scrollsection .eyc-premium-kicker,
        .eyc-premium-kicker {
          max-width: min(100%, 330px) !important;
          padding: 10px 14px !important;
          margin: 0 auto !important;
          gap: 0 !important;
          font-size: clamp(11px, 3.1vw, 12.5px) !important;
          font-weight: 550 !important;
          line-height: 1.22 !important;
          letter-spacing: 0.045em !important;
          text-transform: none !important;
          white-space: nowrap !important;
          text-wrap: nowrap !important;
        }

        #scrollsection .eyc-premium-dot,
        .eyc-premium-dot {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        #scrollsection .eyc-premium-title,
        .eyc-premium-title {
          font-size: clamp(30px, 9vw, 42px) !important;
          line-height: 1.06 !important;
        }

        #scrollsection .eyc-premium-sub,
        .eyc-premium-sub {
          font-size: clamp(16px, 4.5vw, 20px) !important;
          line-height: 1.45 !important;
          max-width: 32ch !important;
        }

        #scrollsection .eyc-premium-copy,
        .eyc-premium-copy {
          font-size: 15px !important;
          line-height: 1.62 !important;
          max-width: 42ch !important;
        }

        #scrollsection .eyc-premium-benefits,
        .eyc-premium-benefits {
          grid-template-columns: 1fr !important;
          gap: 0 !important;
          margin-top: 24px !important;
        }

        #scrollsection .eyc-premium-panel,
        .eyc-premium-panel {
          margin-top: 22px !important;
          max-width: 100% !important;
          padding: 18px 0 0 !important;
        }

        #scrollsection .eyc-premium-panel h3,
        .eyc-premium-panel h3 {
          font-size: clamp(24px, 7vw, 30px) !important;
        }

        #scrollsection .eyc-premium-panel p,
        .eyc-premium-panel p {
          font-size: 15px !important;
          line-height: 1.6 !important;
          max-width: 36ch !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        #scrollsection .eyc-premium-tagline,
        .eyc-premium-tagline {
          max-width: 24ch !important;
          font-size: 15px !important;
          line-height: 1.5 !important;
          margin-top: 14px !important;
        }

        #scrollsection .eyc-premium-chip b,
        .eyc-premium-chip b {
          font-size: 15px !important;
          line-height: 1.35 !important;
        }

        #scrollsection .eyc-premium-chip span,
        .eyc-premium-chip span {
          font-size: 13px !important;
          line-height: 1.45 !important;
        }

        #scrollsection .eyc-premium-chip,
        .eyc-premium-chip {
          padding: 14px 0 0 !important;
          border-left: 0 !important;
          border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
        }

        #scrollsection .eyc-premium-chip:first-child,
        .eyc-premium-chip:first-child {
          border-top: 0 !important;
        }

        #scrollsection .eyc-premium-cta,
        .eyc-premium-cta {
          width: min(100%, 320px) !important;
          min-height: 52px !important;
          margin-top: 20px !important;
          padding: 12px 20px !important;
          font-size: clamp(16px, 4.6vw, 18px) !important;
          line-height: 1.2 !important;
        }

        #scrollsection .eyc-premium-cta-sub,
        .eyc-premium-cta-sub {
          margin-top: 10px !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          color: rgba(234, 231, 225, 0.78) !important;
        }
      }

      @media (max-width: 430px) {
        .framer-ReojI .framer-1kzql4v,
        .framer-ReojI .framer-1vq7ieh {
          padding-left: 8px !important;
          padding-right: 8px !important;
        }

        #scrollsection .eyc-home-intro-shell,
        .eyc-home-intro-shell {
          width: calc(100vw - 65px) !important;
          max-width: calc(100vw - 65px) !important;
          padding-inline: 0 !important;
          margin-top: 14px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          align-self: center !important;
          flex: 0 0 auto !important;
        }

        #scrollsection .eyc-premium-intro,
        .eyc-premium-intro {
          width: calc(100vw - 65px) !important;
          max-width: calc(100vw - 65px) !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding: 34px 12px 36px !important;
          border: 0 !important;
          border-radius: 0 !important;
        }

        #scrollsection .eyc-premium-kicker,
        .eyc-premium-kicker {
          max-width: min(100%, 300px) !important;
          padding: 9px 12px !important;
          margin: 0 auto !important;
          font-size: clamp(10px, 3.2vw, 11px) !important;
          letter-spacing: 0.028em !important;
        }
      }

      /* Hide seam overlay on all viewports */
      .eyc-home-intro-shell .framer-s93ff6 {
        display: none !important;
        height: 0 !important;
        overflow: hidden !important;
      }

      @media (min-width: 1024px) {
        /* Desktop-only: remove Framer seam overlays that appear outside #scrollsection. */
        .framer-ReojI .framer-1ocbugl,
        .framer-ReojI .framer-1fs3iez,
        .framer-ReojI .framer-1c8aodz,
        .framer-ReojI .framer-1k50l8t,
        .framer-ReojI .framer-s93ff6,
        .framer-ReojI .framer-15vo5wy-container {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          min-height: 0 !important;
          max-height: 0 !important;
          overflow: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* Safety cleanup for desktop video shell to avoid visible section seams. */
        .framer-ReojI #scrollsection .framer-12g3jbp,
        .framer-ReojI #scrollsection .framer-p0zxn2-container {
          border: 0 !important;
          box-shadow: none !important;
          outline: 0 !important;
        }

        #scrollsection .eyc-home-intro-shell,
        .eyc-home-intro-shell,
        #scrollsection .eyc-home-intro-card,
        .eyc-home-intro-card,
        #scrollsection .eyc-premium-intro,
        .eyc-premium-intro {
          --eyc-home-flow-width: 980px !important;
        }

        #scrollsection .eyc-home-intro-shell,
        .eyc-home-intro-shell {
          padding-inline: 0 !important;
          margin-top: clamp(-116px, -7vw, -72px) !important;
        }

        #scrollsection .eyc-home-intro-card,
        .eyc-home-intro-card {
          max-width: var(--eyc-home-flow-width) !important;
        }

        #scrollsection .eyc-home-kicker,
        .eyc-home-kicker {
          max-width: min(78vw, 980px) !important;
        }

        #scrollsection .eyc-premium-intro,
        .eyc-premium-intro {
          padding: clamp(48px, 4.4vw, 76px) clamp(28px, 3.6vw, 52px) clamp(34px, 3vw, 52px) !important;
        }

        #scrollsection .eyc-premium-benefits,
        .eyc-premium-benefits {
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 14px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function applyHomeDocxIntro(root) {
    /* lang-aware: fix functions run for both NL and EN */
    if (!root || !root.querySelectorAll) return;
    if (!isHomePath()) return;
    ensureHomeDocxIntroStyle();
    const premiumIntroVersion = "2026-03-14-v8";
    const isMobileViewport = window.matchMedia && window.matchMedia("(max-width: 810px)").matches;
    const mobileIntroWidth = "calc(100vw - 65px)";

    function forceKickerTextStyle(el) {
      if (!el || !el.style) return;
      el.style.setProperty("color", "rgba(249, 236, 202, 1)", "important");
      el.style.setProperty("-webkit-text-fill-color", "rgba(249, 236, 202, 1)", "important");
      el.style.setProperty("--framer-text-color", "rgba(249, 236, 202, 1)", "important");
      el.style.setProperty("text-shadow", "0 0.4px 0 rgba(224, 191, 122, 0.3), 0 1px 1.8px rgba(0, 0, 0, 0.2)", "important");
      el.style.setProperty("mix-blend-mode", "normal", "important");
      el.style.setProperty("opacity", "1", "important");
      el.style.setProperty("-webkit-text-stroke", "0", "important");
      el.style.setProperty("filter", "none", "important");
    }

    const kickerBlocks = new Set();
    const textBlocks = [];
    if (root.matches && root.matches('[data-framer-component-type="RichTextContainer"]')) {
      textBlocks.push(root);
    }
    root.querySelectorAll('[data-framer-component-type="RichTextContainer"]').forEach((el) => textBlocks.push(el));
    textBlocks.forEach((block) => {
      const text = norm(block.textContent || "").toLowerCase();
      if (!text) return;

      const isTopKicker = text.includes("alles begint in de kern") && text.includes("jouw kern");
      const isBottomKicker = text.includes("stap in je kern") && text.includes("reis begint vandaag");
      if (isTopKicker || isBottomKicker) {
        block.classList.remove("eyc-home-kicker");
        kickerBlocks.add(block);
      }

      const hasMainCopy = (
        /empower\s*your\s*core(?:\s*®)?\s*is\s*geen\s*trend/.test(text)
        && /(15\s*jaar)/.test(text)
      );
      if (!hasMainCopy) return;

      if (block.getAttribute("data-eyc-premium-intro-version") !== premiumIntroVersion) {
        block.innerHTML = `
          <section class="eyc-premium-intro" aria-label="Empower Your Core Intro">
            <section class="eyc-premium-hero" aria-label="Premium Intro Hero">
              <div class="eyc-premium-kicker">Methode \u2022 Evidence-based \u2022 15 jaar</div>
              <h2 class="eyc-premium-title">Empower Your Core is geen trend.</h2>
              <p class="eyc-premium-sub">Het is een methode met blijvende waarde.</p>
              <div class="eyc-premium-divider" aria-hidden="true"></div>
              <p class="eyc-premium-copy">
                Gebouwd op 15 jaar ervaring en verdieping. Met bewezen strategie\u00ebn die je helpen
                pijn te verminderen, kracht op te bouwen, je mobiliteit te verbeteren en opnieuw
                met vertrouwen te bewegen.
              </p>
              <div class="eyc-premium-benefits" aria-label="Kernvoordelen">
                <div class="eyc-premium-chip"><b>Pijn verminderen</b><span>slimmer, niet harder</span></div>
                <div class="eyc-premium-chip"><b>Kracht opbouwen</b><span>core + ketens</span></div>
                <div class="eyc-premium-chip"><b>Mobiliteit</b><span>ruimte in beweging</span></div>
                <div class="eyc-premium-chip"><b>Vertrouwen</b><span>controle &amp; consistentie</span></div>
              </div>
            </section>
            <section class="eyc-premium-panel" aria-label="Priv\u00e9 studio">
              <h3>Stap binnen in onze priv\u00e9 Pilatesstudio in Utrecht</h3>
              <p>Volledig uitgerust en afgestemd op jou \u2014 waar transformatie begint met bewuste beweging.</p>
              <div class="eyc-premium-tagline"><em>Exclusief.</em> Persoonlijk. Rustig. Doelgericht.</div>
              <a class="eyc-premium-cta" href="/contact.html">Plan een intake</a>
              <div><small class="eyc-premium-cta-sub">Priv\u00e9sessies \u2022 Full Equipment \u2022 Utrecht</small></div>
            </section>
          </section>
        `;
        block.setAttribute("data-eyc-premium-intro", "true");
        block.setAttribute("data-eyc-premium-intro-version", premiumIntroVersion);
      }

      block.classList.add("eyc-home-intro-card");
      // Force the block and its immediate Framer wrapper to expand,
      // but do NOT walk all ancestors (that breaks the Framer section stack)
      block.style.setProperty("height", "auto", "important");
      block.style.setProperty("max-height", "none", "important");
      block.style.setProperty("overflow", "visible", "important");
      block.style.setProperty("width", "100%", "important");
      block.style.setProperty("min-width", "0", "important");
      block.style.setProperty("max-width", "100%", "important");
      block.style.setProperty("position", "relative", "important");
      if (isMobileViewport) {
        block.style.setProperty("width", mobileIntroWidth, "important");
        block.style.setProperty("min-width", "0", "important");
        block.style.setProperty("max-width", mobileIntroWidth, "important");
        block.style.setProperty("margin-left", "auto", "important");
        block.style.setProperty("margin-right", "auto", "important");
        block.style.setProperty("align-self", "center", "important");
        block.style.setProperty("flex", "0 0 auto", "important");
      }
      // Only fix the immediate parent wrapper, not the entire tree
      const wrapper = block.parentElement;
      if (wrapper) {
        wrapper.style.setProperty("height", "auto", "important");
        wrapper.style.setProperty("max-height", "none", "important");
        wrapper.style.setProperty("overflow", "visible", "important");
        wrapper.style.setProperty("width", "100%", "important");
        wrapper.style.setProperty("min-width", "0", "important");
        wrapper.style.setProperty("max-width", "100%", "important");
        if (isMobileViewport) {
          wrapper.style.setProperty("width", mobileIntroWidth, "important");
          wrapper.style.setProperty("min-width", "0", "important");
          wrapper.style.setProperty("max-width", mobileIntroWidth, "important");
          wrapper.style.setProperty("margin-left", "auto", "important");
          wrapper.style.setProperty("margin-right", "auto", "important");
          wrapper.style.setProperty("align-self", "center", "important");
          wrapper.style.setProperty("flex", "0 0 auto", "important");
        }
      }
      const shell = block.closest('[data-framer-name="Section"]') || block.parentElement;
      if (shell && shell.classList) shell.classList.add("eyc-home-intro-shell");

      const premiumIntro = block.querySelector(".eyc-premium-intro");
      if (premiumIntro && isMobileViewport && premiumIntro.style) {
        premiumIntro.style.setProperty("width", mobileIntroWidth, "important");
        premiumIntro.style.setProperty("max-width", mobileIntroWidth, "important");
        premiumIntro.style.setProperty("min-width", "0", "important");
        premiumIntro.style.setProperty("margin-left", "auto", "important");
        premiumIntro.style.setProperty("margin-right", "auto", "important");
        premiumIntro.style.setProperty("align-self", "center", "important");
      }

      block.querySelectorAll("p").forEach((p) => {
        const line = norm(p.textContent || "").toLowerCase();
        if (!line) return;
        if (line.includes("empower your core is geen trend")) {
          p.classList.add("eyc-home-intro-main");
        } else if (line.includes("stap binnen in onze") || line.includes("pilatesstudio in utrecht")) {
          p.classList.add("eyc-home-intro-studio");
        } else if (line.includes("volledig uitgerust en afgestemd op jou")) {
          p.classList.add("eyc-home-intro-support");
        }
      });
    });

    const inlineCandidates = [];
    const candidateSelector = "p, span, div, .framer-text, [data-text-fill='true']";
    if (root.matches && root.matches(candidateSelector)) inlineCandidates.push(root);
    root.querySelectorAll(candidateSelector).forEach((el) => inlineCandidates.push(el));

    const matchedKickerBlocks = new WeakSet();
    inlineCandidates.forEach((el) => {
      const text = norm(el.textContent || "").toLowerCase();
      if (!text) return;
      const isTopKicker = text.includes("alles begint in de kern") && text.includes("jouw kern");
      const isBottomKicker = text.includes("stap in je kern") && text.includes("reis begint vandaag");
      if (!isTopKicker && !isBottomKicker) return;

      const childMatch = el.querySelectorAll
        ? Array.from(el.querySelectorAll(candidateSelector)).some((child) => {
          if (child === el) return false;
          const childText = norm(child.textContent || "").toLowerCase();
          if (!childText) return false;
          return (
            (childText.includes("alles begint in de kern") && childText.includes("jouw kern"))
            || (childText.includes("stap in je kern") && childText.includes("reis begint vandaag"))
          );
        })
        : false;
      if (childMatch) return;

      const targetLine = el.closest("p, span, div") || el;
      targetLine.classList.add("eyc-home-kicker");
      forceKickerTextStyle(targetLine);
      if (targetLine.querySelectorAll) {
        targetLine.querySelectorAll("*").forEach((child) => forceKickerTextStyle(child));
      }

      const richBlock = targetLine.closest('[data-framer-component-type="RichTextContainer"]');
      if (richBlock) {
        matchedKickerBlocks.add(richBlock);
        richBlock.classList.remove("eyc-home-kicker");
      }
    });

    kickerBlocks.forEach((block) => {
      if (!matchedKickerBlocks.has(block)) block.classList.add("eyc-home-kicker");
    });
  }

  function ensureHomeWhiteTextStyle() {
    if (document.getElementById("eyc-home-white-text")) return;
    if (!isHomePath()) return;

    const style = document.createElement("style");
    style.id = "eyc-home-white-text";
    style.textContent = `
      /* White text for all homepage Framer content EXCEPT premium intro section */
      #scrollsection [data-text-fill="true"]:not(.eyc-premium-intro [data-text-fill="true"]),
      #scrollsection .framer-text[data-text-fill]:not(.eyc-premium-intro .framer-text),
      #scrollsection .framer-text [data-text-fill="true"]:not(.eyc-premium-intro [data-text-fill="true"]),
      #scrollsection .framer-text:not(.eyc-premium-intro .framer-text),
      #scrollsection h1:not(.eyc-premium-intro h1),
      #scrollsection h2:not(.eyc-premium-intro h2):not(.eyc-premium-title),
      #scrollsection h3:not(.eyc-premium-intro h3):not(.eyc-premium-panel h3),
      #scrollsection p:not(.eyc-premium-intro p):not(.eyc-premium-sub):not(.eyc-premium-copy) {
        background-image: none !important;
        background: none !important;
        color: #f4f6fa !important;
        -webkit-text-fill-color: #f4f6fa !important;
        -webkit-background-clip: border-box !important;
        background-clip: border-box !important;
        opacity: 1 !important;
      }

      /* Ensure premium intro elements are never overridden by the white text rule */
      .eyc-premium-intro,
      .eyc-premium-intro * {
        background: initial;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * On mobile (≤809px), Framer positions pricing card titles at -48px above
   * the card boundary. Since cards use overflow:hidden, the titles are
   * invisible. This function extracts the title text from inside each card
   * and places it as a separate element ABOVE the card container so it is
   * visible without any ugly hacks.
   */
  function fixPricingCardTitles() {
    // Find pricing cards by their known Framer classes
    var cards = document.querySelectorAll('.framer-yspRw, .framer-Cwum2');
    if (!cards.length) return;

    cards.forEach(function(card) {
      // Find the heading section using data-framer-name (works for both cards)
      var heading = card.querySelector('[data-framer-name="Heading"]');
      if (!heading) return;

      // Fix price: €87,50 → €87 (always run, all viewports)
      var priceH2 = heading.querySelector('h2.framer-text');
      if (priceH2 && priceH2.textContent.trim() === '€87,50') {
        priceH2.textContent = '€87';
      }

      // Mobile-only title fixes
      if (window.innerWidth > 809) return;
      if (card.getAttribute('data-eyc-titles-fixed')) return;

      // The title is the first child of the heading section
      var titleEl = heading.children[0];
      if (!titleEl) return;

      // Reset the title positioning so it sits inside the card naturally
      titleEl.style.cssText = 'position: relative !important; top: 0 !important; margin-top: 0 !important;';

      // Style the title to match "Online training" card title
      var titleP = titleEl.querySelector('p.framer-text');
      if (titleP) {
        titleP.style.cssText = 'font-family: "Instrument Sans", "Instrument Sans Placeholder", sans-serif !important; font-size: 16px !important; font-weight: 400 !important; line-height: 24px !important; white-space: normal !important; color: #fff !important; -webkit-text-fill-color: #fff !important;';
      }

      card.setAttribute('data-eyc-titles-fixed', '1');
    });

    // Also clean up any previously extracted titles (from earlier runs)
    var externalTitles = document.querySelectorAll('.eyc-pricing-title');
    externalTitles.forEach(function(el) { el.remove(); });
  }

  function fixPricingCurrency(root) {
    if (!root || !root.querySelectorAll) return;

    walkTextNodes(root, (node) => {
      const current = node.textContent || "";
      if (!current.includes("$") && !/\bEUR[\s\u00A0\u202F]+\d/.test(current)) return;

      let next = current.replace(/(^|[\s(])\$\s*(\d)/g, "$1€$2");
      if (next.trim() === "$") next = next.replace("$", "€");
      next = next.replace(/\$(?=[\d.,])/g, "€");
      next = next.replace(/\bEUR[\s\u00A0\u202F]+([0-9]+(?:[.,][0-9]+)?)/g, "€$1");
      next = next.replace(/€[\s\u00A0\u202F]+([0-9])/g, "€$1");

      if (next !== current) node.textContent = next;
    });
  }



  /* ── Language toggle UI ── */
  /* Toggle lives INSIDE the nav flex row (.framer-b6gkj0 "Top") so it moves,
     scales and responds exactly like the hamburger icon and the "ER" logo.
     Framer may recreate the nav on variant changes, so we re-insert via rAF. */
  function injectLangToggle() {
    // Inject styles once
    if (!document.querySelector('#eyc-lang-styles')) {
      var style = document.createElement('style');
      style.id = 'eyc-lang-styles';
      style.textContent = [
        '/* Toggle sits inside nav flex — no position:fixed */',
        '.eyc-lang-toggle{',
        '  display:flex;align-items:center;flex-shrink:0;',
        '  margin-right:8px;',
        '}',
        '.eyc-lang-toggle button{',
        '  display:flex;align-items:center;justify-content:center;',
        '  width:40px;height:40px;border-radius:40px;',
        '  background:rgba(255,255,255,0.1);',
        '  border:none;cursor:pointer;',
        '  color:#fff;font-size:12px;font-weight:600;',
        '  letter-spacing:0.04em;',
        '  font-family:"Inter Display","Inter",sans-serif;',
        '  transition:background 0.2s,transform 0.15s;',
        '  text-transform:uppercase;',
        '}',
        '.eyc-lang-toggle button:hover{background:rgba(255,255,255,0.2);}',
        '.eyc-lang-toggle button:active{transform:scale(0.92);}'
      ].join('\n');
      document.head.appendChild(style);
    }

    var nextLang = eycLang === 'nl' ? 'en' : 'nl';

    // Create toggle element (reuse if already exists in body from a prior insert)
    function createToggle() {
      var t = document.createElement('div');
      t.className = 'eyc-lang-toggle';
      t.innerHTML = '<button aria-label="Switch to ' + nextLang.toUpperCase() + '">' + nextLang.toUpperCase() + '</button>';
      t.querySelector('button').addEventListener('click', function() {
        eycLang = nextLang;
        try { localStorage.setItem(EYC_LANG_KEY, nextLang); } catch(e) {}
        window.location.reload();
      });
      return t;
    }

    // Wrap toggle + hamburger in a flex row so they stay grouped on the right
    function ensureToggleInNav() {
      var topRow = document.querySelector('nav .framer-b6gkj0');
      if (!topRow) return;
      // Already inserted?
      if (topRow.querySelector('.eyc-lang-toggle')) return;
      var hamburger = topRow.querySelector('.framer-1kpu9vk');
      if (!hamburger) return;

      // Create a flex wrapper to keep toggle and hamburger together
      var wrapper = document.createElement('div');
      wrapper.className = 'eyc-nav-right';
      wrapper.style.cssText = 'display:flex;align-items:center;gap:8px;flex-shrink:0;';

      var toggle = createToggle();
      wrapper.appendChild(toggle);

      // Move hamburger into the wrapper (keeps its event listeners)
      topRow.replaceChild(wrapper, hamburger);
      wrapper.appendChild(hamburger);
    }

    // Initial insert
    ensureToggleInNav();

    // Re-insert if Framer recreates nav elements (variant change, menu open/close)
    (function pollNavToggle() {
      var topRow = document.querySelector('nav .framer-b6gkj0');
      if (topRow && !topRow.querySelector('.eyc-lang-toggle')) {
        ensureToggleInNav();
      }
      requestAnimationFrame(pollNavToggle);
    })();
  }

  // --- EN mode: one-shot sweep to convert Dutch text to English ---
  // Disconnects observer to prevent loops, walks all text nodes, reconnects.
  var _enSweepQueued = false;
  var _enInitialDone = false; // Set after first scheduleTranslate+sweep cycle
  function queueEnSweep() {
    console.log("[EYC] queueEnSweep called, lang=" + eycLang + ", queued=" + _enSweepQueued);
    if (_enSweepQueued || eycLang !== "en") return;
    _enSweepQueued = true;
    requestAnimationFrame(function() {
      try {
        _enSweepQueued = false;
        sweepToEnglish();
      } catch(e) {
        console.error("[EYC] sweepToEnglish error:", e);
        _enSweepQueued = false;
      }
    });
  }

  function sweepToEnglish() {
    console.log("[EYC] sweepToEnglish called, nlToEnMap size=" + nlToEnMap.size);
    // Temporarily disconnect observer to prevent loops
    if (typeof observer !== 'undefined') observer.disconnect();

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node;
    while (node = walker.nextNode()) {
      var raw = node.nodeValue;
      if (!raw) continue;
      var txt = norm(raw).trim();
      if (!txt || txt.length < 2) continue;

      // Check nlToEnMap for Dutch→English
      var en = nlToEnMap.get(txt) || nlToEnMap.get(txt.toLowerCase());
      if (en && en !== txt) {
        node.nodeValue = en;
      } else if (txt.length > 50 && txt.indexOf("Bij Empower") > -1) {
        console.log("[EYC-SWEEP-DEBUG] no match for:", txt.substring(0, 80), "len=" + txt.length);
        // Try to find closest match in map
        nlToEnMap.forEach(function(v, k) {
          if (k.indexOf("Bij Empower") > -1) console.log("[EYC-SWEEP-DEBUG] map key:", k.substring(0, 80), "len=" + k.length);
        });
      }
    }

    // Also sweep attributes
    var els = document.body.querySelectorAll('[placeholder],[aria-label],[title],[alt]');
    els.forEach(function(el) {
      ['placeholder', 'aria-label', 'title', 'alt'].forEach(function(attr) {
        var val = el.getAttribute(attr);
        if (!val) return;
        var trimmed = norm(val).trim();
        var en = nlToEnMap.get(trimmed) || nlToEnMap.get(trimmed.toLowerCase());
        if (en && en !== trimmed) el.setAttribute(attr, en);
      });
    });

    // Reconnect observer
    if (typeof observer !== 'undefined') {
      observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['href', 'src', 'title', 'alt', 'placeholder', 'aria-label', 'value']
      });
    }
    _enInitialDone = true;
  }

  let scheduled = false;
  function scheduleTranslate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      translateTree(document.body);
      fixVideos(document.body);
      fixYouTubeMute(document.body);
      fixLinks(document.body);
      forceDutchNavLabels(document.body);
      forceDutchCriticalCopy(document.body);
      enforceAboutUsDutchCopy(document.body);
      translateWorksHeroTitle();
      hideStaticMirrorLabel();
      forceDutchCaseStudyCopy(document.body);
      ensureCaseStudyHeroTitleStyles();
      ensureCaseStudyVideoVisible();
      fixChrisCaseStudyIntro();
      forceTeacherTrainingNotice(document.body);
      forcePersonalTrainingHero(document.body);
      fixSocialLinks(document.body);
      replaceProcessSection(document.body);
      fixHomeKickerPunctuation(document.body);
      syncHomeTeacherTrainingCard(document.body);
      alignHomeStoryIntro(document.body);
      removeItalicFromHeadings(document.body);
      fixTestimonialsIntroHeading(document.body);
      alignTestimonialsCarousel(document.body);
      fixJourneySectionLayout(document.body);
      fixContactDetails(document.body);
      removeContactQuoteButton(document.body);
      applyHomeDocxIntro(document.body);
      insertHomeBenefitVideo(document.body);
      swapHomepageImages();
      insertStudioClips();
      fixHeroBackground();
      ensureHomeWhiteTextStyle();
      fixPricingCurrency(document.body);
      fixPricingCardTitles();
      enforceRegisteredBranding();
      interceptContactForm();
      fixMobileNavLinks();
      injectLangToggle();
      // EN mode: queue a single sweep to convert Dutch text injected by fix functions
      queueEnSweep();
    });
  }

  /**
   * Fix mobile nav links: Framer's JS routing doesn't always handle taps inside
   * iframes on mobile Safari. Add a touchend listener on nav links that forces
   * native navigation when tapped.
   */
  function fixMobileNavLinks() {
    var nav = document.querySelector("nav.framer-64i0W");
    if (!nav || nav.dataset.eycNavFixed) return;
    nav.dataset.eycNavFixed = "true";

    nav.addEventListener("click", function(e) {
      var link = e.target.closest("a[href]");
      if (!link) return;
      var href = link.getAttribute("href");
      if (!href || href === "#") return;
      // Let Framer handle anchor scrolls (href starting with #)
      if (href.charAt(0) === "#") return;
      e.preventDefault();
      e.stopPropagation();
      window.location.href = href;
    }, true);
  }

  /**
   * Intercept the Framer contact form and submit via our own API route.
   * Framer's form POSTs to api.framer.com which doesn't work on self-hosted sites.
   * We attach a submit listener, gather field values by position (3 fields share
   * name="Name"), POST to /api/contact, and toggle Framer's success/error variants.
   */
  function interceptContactForm() {
    var pathname = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : "";
    if (pathname.indexOf("/contact") === -1) return;

    var form = document.querySelector("form");
    if (!form || form.dataset.eycIntercepted) return;
    form.dataset.eycIntercepted = "true";

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      e.stopPropagation();

      // Gather inputs by position: [0]=Name, [1]=Email, [2]=Subject, [3]=Message
      var inputs = form.querySelectorAll("input, textarea");
      var name = inputs[0] ? inputs[0].value.trim() : "";
      var email = inputs[1] ? inputs[1].value.trim() : "";
      var subject = inputs[2] ? inputs[2].value.trim() : "";
      var message = inputs[3] ? inputs[3].value.trim() : "";

      if (!name || !email || !message) {
        alert("Vul alsjeblieft je naam, e-mail en bericht in.");
        return;
      }

      // Find the submit button and show loading state
      var btn = form.querySelector('button[type="submit"], input[type="submit"]');
      var btnText = btn ? btn.textContent : "";
      if (btn) btn.textContent = "Verzenden...";

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email, subject: subject, message: message })
      })
      .then(function(res) {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(function() {
        // Show success: hide form fields, show message inside the form container
        Array.from(form.children).forEach(function(child) { child.style.display = "none"; });
        var msg = document.createElement("div");
        msg.style.cssText = "text-align:center;padding:40px 20px;";
        msg.innerHTML = '<h3 style="color:#fff;font-size:24px;margin-bottom:12px;">Bericht verzonden!</h3><p style="color:#d5dbe6;font-size:16px;">Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.</p>';
        form.appendChild(msg);
      })
      .catch(function() {
        // Show error
        if (btn) btn.textContent = btnText;
        alert("Er is iets misgegaan. Probeer het later opnieuw of stuur een e-mail naar hi@empoweryourcore.com");
      });
    }, true);
  }

  /* Dark scrollbar — inject immediately so no white flash on Windows Chrome */
  (function injectDarkScrollbar() {
    var s = document.createElement("style");
    s.id = "eyc-dark-scrollbar";
    s.textContent = "* { scrollbar-color: #2a2a2b #0e0e0f; } ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #0e0e0f; } ::-webkit-scrollbar-thumb { background: #2a2a2b; border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: #3a3a3b; }";
    document.head.appendChild(s);
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleTranslate, { once: true });
  } else {
    scheduleTranslate();
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'characterData') {
        translateTextNode(m.target);
        if (m.target && m.target.parentElement) {
          fixContactDetails(m.target.parentElement);
          removeContactQuoteButton(m.target.parentElement);
          applyHomeDocxIntro(m.target.parentElement);
          insertHomeBenefitVideo(m.target.parentElement);
          fixHomeKickerPunctuation(m.target.parentElement);
          syncHomeTeacherTrainingCard(m.target.parentElement);
          alignHomeStoryIntro(m.target.parentElement);
          removeItalicFromHeadings(m.target.parentElement);
          fixPricingCurrency(m.target.parentElement);
          forceDutchCaseStudyCopy(m.target.parentElement);
          forcePersonalTrainingHero(m.target.parentElement);
          fixTestimonialsIntroHeading(m.target.parentElement);
          alignTestimonialsCarousel(m.target.parentElement);
          enforceRegisteredBranding();
          ensureHomeWhiteTextStyle();
          swapHomepageImages();
          insertStudioClips();
          document.querySelectorAll("video[data-eyc-src]").forEach(function(v) {
            var correct = v.getAttribute("data-eyc-src");
            if (v.src !== correct && !v.src.endsWith(correct)) { v.src = correct; }
          });
          fixHeroBackground();
          queueEnSweep();
        }
      } else if (m.type === 'childList') {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === Node.TEXT_NODE) {
            translateTextNode(n);
            if (n.parentElement) {
              fixContactDetails(n.parentElement);
              removeContactQuoteButton(n.parentElement);
              applyHomeDocxIntro(n.parentElement);
              insertHomeBenefitVideo(n.parentElement);
              fixHomeKickerPunctuation(n.parentElement);
              syncHomeTeacherTrainingCard(n.parentElement);
              alignHomeStoryIntro(n.parentElement);
              fixPricingCurrency(n.parentElement);
              enforceAboutUsDutchCopy(n.parentElement);
              translateWorksHeroTitle();
              hideStaticMirrorLabel();
              forceDutchCaseStudyCopy(n.parentElement);
              fixChrisCaseStudyIntro();
              forceTeacherTrainingNotice(n.parentElement);
              forcePersonalTrainingHero(n.parentElement);
              fixTestimonialsIntroHeading(n.parentElement);
              alignTestimonialsCarousel(n.parentElement);
              enforceRegisteredBranding();
              ensureHomeWhiteTextStyle();
              ensureCaseStudyHeroTitleStyles();
              ensureCaseStudyVideoVisible();
              interceptContactForm();
              queueEnSweep();
            }
          } else if (n.nodeType === Node.ELEMENT_NODE) {
            translateTree(n);
            fixVideos(n);
            fixYouTubeMute(n);
            fixLinks(n);
            forceDutchNavLabels(n);
            forceDutchCriticalCopy(n);
            enforceAboutUsDutchCopy(n);
            translateWorksHeroTitle();
            hideStaticMirrorLabel();
            forceDutchCaseStudyCopy(n);
            ensureCaseStudyHeroTitleStyles();
      ensureCaseStudyVideoVisible();
            fixChrisCaseStudyIntro();
            forceTeacherTrainingNotice(n);
            forcePersonalTrainingHero(n);
            fixSocialLinks(n);
            replaceProcessSection(n);
            fixTestimonialsIntroHeading(n);
            alignTestimonialsCarousel(n);
            fixJourneySectionLayout(n);
            fixContactDetails(n);
            removeContactQuoteButton(n);
            applyHomeDocxIntro(n);
            insertHomeBenefitVideo(n);
            fixHomeKickerPunctuation(n);
            syncHomeTeacherTrainingCard(n);
            alignHomeStoryIntro(n);
            ensureHomeWhiteTextStyle();
            fixPricingCurrency(n);
            fixPricingCardTitles();
            enforceRegisteredBranding();
            injectLangToggle();
            queueEnSweep();
          }
        });
      } else if (m.type === 'attributes') {
        if (m.target && m.target.nodeType === Node.ELEMENT_NODE) {
          translateAttrs(m.target);
          fixVideos(m.target);
          fixYouTubeMute(m.target);
          fixLinks(m.target);
          forceDutchNavLabels(m.target);
          forceDutchCriticalCopy(m.target);
          enforceAboutUsDutchCopy(m.target);
          translateWorksHeroTitle();
          hideStaticMirrorLabel();
          forceDutchCaseStudyCopy(m.target);
          ensureCaseStudyHeroTitleStyles();
      ensureCaseStudyVideoVisible();
          forceTeacherTrainingNotice(m.target);
          forcePersonalTrainingHero(m.target);
          fixSocialLinks(m.target);
          replaceProcessSection(m.target);
          fixTestimonialsIntroHeading(m.target);
          alignTestimonialsCarousel(m.target);
          fixJourneySectionLayout(m.target);
          fixContactDetails(m.target);
          removeContactQuoteButton(m.target);
          applyHomeDocxIntro(m.target);
          insertHomeBenefitVideo(m.target);
          fixHomeKickerPunctuation(m.target);
          syncHomeTeacherTrainingCard(m.target);
          alignHomeStoryIntro(m.target);
          ensureHomeWhiteTextStyle();
          fixPricingCurrency(m.target);
          enforceRegisteredBranding();
          queueEnSweep();
        }
      }
      }
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['href', 'src', 'title', 'alt', 'placeholder', 'aria-label', 'value']
  });
})();
