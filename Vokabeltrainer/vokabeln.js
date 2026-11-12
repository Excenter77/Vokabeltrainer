// Wortlisten: ["Englisch", "Deutsch"]. Mehrere richtige Antworten mit " / " trennen.
// Beim Eintippen sind Artikel (der/die/das, a/an/the) und "to" optional.
// klasse: [von, bis] -> Empfehlung passend zur Klasse im Profil.
// id nicht aendern, sonst geht der Lernstand der Liste verloren.
const VOKABELN = [
  {
    id: "farben", titel: "Farben", klasse: [4, 5], woerter: [
      ["red", "rot"], ["blue", "blau"], ["green", "grün"], ["yellow", "gelb"],
      ["black", "schwarz"], ["white", "weiß"], ["orange", "orange"], ["pink", "rosa / pink"],
      ["purple", "lila"], ["brown", "braun"], ["grey", "grau"], ["light blue", "hellblau"],
      ["dark green", "dunkelgrün"],
    ],
  },
  {
    id: "zahlen", titel: "Zahlen", klasse: [4, 5], woerter: [
      ["one", "eins"], ["two", "zwei"], ["three", "drei"], ["four", "vier"], ["five", "fünf"],
      ["six", "sechs"], ["seven", "sieben"], ["eight", "acht"], ["nine", "neun"], ["ten", "zehn"],
      ["eleven", "elf"], ["twelve", "zwölf"], ["thirteen", "dreizehn"], ["fifteen", "fünfzehn"],
      ["twenty", "zwanzig"], ["thirty", "dreißig"], ["fifty", "fünfzig"],
      ["a hundred / one hundred", "hundert / einhundert"],
    ],
  },
  {
    id: "tiere", titel: "Tiere", klasse: [4, 5], woerter: [
      ["dog", "der Hund"], ["cat", "die Katze"], ["horse", "das Pferd"], ["cow", "die Kuh"],
      ["pig", "das Schwein"], ["mouse", "die Maus"], ["bird", "der Vogel"], ["fish", "der Fisch"],
      ["rabbit", "das Kaninchen"], ["guinea pig", "das Meerschweinchen"], ["sheep", "das Schaf"],
      ["duck", "die Ente"], ["elephant", "der Elefant"], ["lion", "der Löwe"], ["monkey", "der Affe"],
    ],
  },
  {
    id: "familie", titel: "Familie", klasse: [4, 5], woerter: [
      ["mother", "die Mutter"], ["father", "der Vater"], ["sister", "die Schwester"],
      ["brother", "der Bruder"], ["grandmother", "die Großmutter / die Oma"],
      ["grandfather", "der Großvater / der Opa"], ["parents", "die Eltern"], ["aunt", "die Tante"],
      ["uncle", "der Onkel"], ["cousin", "der Cousin / die Cousine"], ["son", "der Sohn"],
      ["daughter", "die Tochter"], ["baby", "das Baby"], ["family", "die Familie"],
    ],
  },
  {
    id: "schule", titel: "Schule", klasse: [4, 6], woerter: [
      ["school", "die Schule"], ["teacher", "der Lehrer / die Lehrerin"],
      ["pupil", "der Schüler / die Schülerin"], ["pen", "der Stift / der Kuli"],
      ["pencil", "der Bleistift"], ["rubber", "der Radiergummi"], ["ruler", "das Lineal"],
      ["book", "das Buch"], ["exercise book", "das Heft"], ["pencil case", "das Federmäppchen / das Mäppchen"],
      ["school bag", "die Schultasche"], ["board", "die Tafel"], ["classroom", "das Klassenzimmer"],
      ["homework", "die Hausaufgaben"], ["timetable", "der Stundenplan"], ["break", "die Pause"],
      ["lesson", "die Unterrichtsstunde / die Stunde"],
    ],
  },
  {
    id: "essen", titel: "Essen und Trinken", klasse: [4, 6], woerter: [
      ["apple", "der Apfel"], ["banana", "die Banane"], ["bread", "das Brot"], ["milk", "die Milch"],
      ["water", "das Wasser"], ["cheese", "der Käse"], ["egg", "das Ei"], ["juice", "der Saft"],
      ["cake", "der Kuchen"], ["chicken", "das Hähnchen / das Huhn"], ["potato", "die Kartoffel"],
      ["carrot", "die Karotte / die Möhre"], ["vegetables", "das Gemüse"], ["fruit", "das Obst"],
      ["tea", "der Tee"], ["sugar", "der Zucker"], ["breakfast", "das Frühstück"],
      ["lunch", "das Mittagessen"], ["dinner", "das Abendessen"],
    ],
  },
  {
    id: "koerper", titel: "Körper", klasse: [4, 6], woerter: [
      ["head", "der Kopf"], ["eye", "das Auge"], ["ear", "das Ohr"], ["nose", "die Nase"],
      ["mouth", "der Mund"], ["tooth", "der Zahn"], ["hair", "die Haare"], ["hand", "die Hand"],
      ["finger", "der Finger"], ["arm", "der Arm"], ["shoulder", "die Schulter"], ["back", "der Rücken"],
      ["stomach", "der Bauch / der Magen"], ["leg", "das Bein"], ["knee", "das Knie"], ["foot", "der Fuß"],
    ],
  },
  {
    id: "zeit", titel: "Wochentage und Monate", klasse: [5, 6], woerter: [
      ["Monday", "Montag"], ["Tuesday", "Dienstag"], ["Wednesday", "Mittwoch"], ["Thursday", "Donnerstag"],
      ["Friday", "Freitag"], ["Saturday", "Samstag"], ["Sunday", "Sonntag"], ["January", "Januar"],
      ["February", "Februar"], ["March", "März"], ["April", "April"], ["May", "Mai"], ["June", "Juni"],
      ["July", "Juli"], ["August", "August"], ["September", "September"], ["October", "Oktober"],
      ["November", "November"], ["December", "Dezember"],
    ],
  },
  {
    id: "kleidung", titel: "Kleidung", klasse: [5, 6], woerter: [
      ["T-shirt", "das T-Shirt"], ["shirt", "das Hemd"], ["trousers", "die Hose"], ["jeans", "die Jeans"],
      ["dress", "das Kleid"], ["skirt", "der Rock"], ["jumper", "der Pullover"], ["jacket", "die Jacke"],
      ["coat", "der Mantel"], ["shoes", "die Schuhe"], ["boots", "die Stiefel"], ["socks", "die Socken"],
      ["hat", "der Hut"], ["cap", "die Mütze / die Kappe"], ["scarf", "der Schal"],
      ["gloves", "die Handschuhe"],
    ],
  },
  {
    id: "wohnen", titel: "Haus und Wohnung", klasse: [5, 7], woerter: [
      ["house", "das Haus"], ["flat", "die Wohnung"], ["kitchen", "die Küche"],
      ["bathroom", "das Badezimmer / das Bad"], ["bedroom", "das Schlafzimmer"],
      ["living room", "das Wohnzimmer"], ["garden", "der Garten"], ["door", "die Tür"],
      ["window", "das Fenster"], ["wall", "die Wand"], ["floor", "der Boden / der Fußboden"],
      ["stairs", "die Treppe"], ["bed", "das Bett"], ["table", "der Tisch"], ["chair", "der Stuhl"],
      ["cupboard", "der Schrank"], ["sofa", "das Sofa"], ["fridge", "der Kühlschrank"], ["lamp", "die Lampe"],
    ],
  },
  {
    id: "verben", titel: "Wichtige Verben", klasse: [5, 7], woerter: [
      ["to go", "gehen"], ["to come", "kommen"], ["to see", "sehen"], ["to eat", "essen"],
      ["to drink", "trinken"], ["to play", "spielen"], ["to read", "lesen"], ["to write", "schreiben"],
      ["to sleep", "schlafen"], ["to run", "rennen / laufen"], ["to swim", "schwimmen"],
      ["to sing", "singen"], ["to listen", "zuhören"], ["to speak", "sprechen"], ["to help", "helfen"],
      ["to like", "mögen"], ["to want", "wollen"], ["to know", "wissen / kennen"], ["to buy", "kaufen"],
      ["to open", "öffnen / aufmachen"], ["to close", "schließen / zumachen"],
      ["to understand", "verstehen"], ["to learn", "lernen"], ["to work", "arbeiten"],
    ],
  },
  {
    id: "adjektive", titel: "Adjektive", klasse: [5, 7], woerter: [
      ["big", "groß"], ["small", "klein"], ["old", "alt"], ["young", "jung"], ["new", "neu"],
      ["good", "gut"], ["bad", "schlecht"], ["happy", "glücklich / froh"], ["sad", "traurig"],
      ["fast", "schnell"], ["slow", "langsam"], ["hot", "heiß"], ["cold", "kalt"],
      ["easy", "leicht / einfach"], ["difficult", "schwierig / schwer"], ["beautiful", "schön"],
      ["expensive", "teuer"], ["cheap", "billig / günstig"],
    ],
  },
  {
    id: "irregular-past", titel: "Unregelmäßige Verben: Simple Past", klasse: [6, 8],
    seiten: ["Infinitive", "Simple past"], sprachen: ["en", "en"], woerter: [
      ["be", "was / were"], ["have", "had"], ["do", "did"], ["go", "went"], ["see", "saw"],
      ["eat", "ate"], ["drink", "drank"], ["come", "came"], ["take", "took"], ["give", "gave"],
      ["write", "wrote"], ["buy", "bought"], ["bring", "brought"], ["think", "thought"],
      ["catch", "caught"], ["teach", "taught"], ["find", "found"], ["make", "made"], ["begin", "began"],
      ["swim", "swam"], ["run", "ran"], ["sing", "sang"], ["speak", "spoke"], ["know", "knew"],
      ["fly", "flew"],
    ],
  },
  {
    id: "irregular-participle", titel: "Unregelmäßige Verben: Past Participle", klasse: [7, 9],
    seiten: ["Infinitive", "Past participle"], sprachen: ["en", "en"], woerter: [
      ["be", "been"], ["have", "had"], ["do", "done"], ["go", "gone"], ["see", "seen"],
      ["eat", "eaten"], ["drink", "drunk"], ["come", "come"], ["take", "taken"], ["give", "given"],
      ["write", "written"], ["buy", "bought"], ["bring", "brought"], ["think", "thought"],
      ["find", "found"], ["make", "made"], ["begin", "begun"], ["swim", "swum"], ["run", "run"],
      ["speak", "spoken"], ["know", "known"], ["fly", "flown"], ["forget", "forgotten"],
      ["break", "broken"],
    ],
  },
  {
    id: "freizeit", titel: "Freizeit und Hobbys", klasse: [7, 8], woerter: [
      ["hobby", "das Hobby"], ["free time", "die Freizeit"], ["to ride a bike", "Fahrrad fahren / Rad fahren"],
      ["football", "der Fußball"], ["to dance", "tanzen"], ["to paint", "malen"], ["music", "die Musik"],
      ["instrument", "das Instrument"], ["club", "der Verein / der Club"],
      ["team", "die Mannschaft / das Team"], ["match", "das Spiel / das Match"],
      ["competition", "der Wettbewerb"], ["to practise / to practice", "üben"], ["to win", "gewinnen"],
      ["to lose", "verlieren"], ["to meet", "treffen"],
    ],
  },
  {
    id: "reisen", titel: "Reisen", klasse: [7, 9], woerter: [
      ["journey", "die Reise"], ["holiday", "der Urlaub / die Ferien"], ["luggage", "das Gepäck"],
      ["suitcase", "der Koffer"], ["ticket", "die Fahrkarte / das Ticket"], ["station", "der Bahnhof"],
      ["airport", "der Flughafen"], ["plane", "das Flugzeug"], ["train", "der Zug"],
      ["passport", "der Reisepass"], ["map", "die Karte / die Landkarte"], ["abroad", "im Ausland / ins Ausland"],
      ["to arrive", "ankommen"], ["to leave", "abfahren / verlassen / weggehen"], ["delay", "die Verspätung"],
      ["to book", "buchen"], ["accommodation", "die Unterkunft"], ["sights", "die Sehenswürdigkeiten"],
    ],
  },
  {
    id: "umwelt", titel: "Umwelt", klasse: [9, 10], woerter: [
      ["environment", "die Umwelt"], ["climate change", "der Klimawandel"],
      ["global warming", "die Erderwärmung"], ["pollution", "die Verschmutzung"],
      ["waste", "der Abfall / der Müll"], ["to recycle", "recyceln / wiederverwerten"],
      ["renewable energy", "erneuerbare Energie"], ["fossil fuels", "fossile Brennstoffe"],
      ["emissions", "die Emissionen"], ["greenhouse gas", "das Treibhausgas"], ["to protect", "schützen"],
      ["to reduce", "reduzieren / verringern"], ["sustainable", "nachhaltig"], ["rainforest", "der Regenwald"],
      ["species", "die Art / die Spezies"], ["drought", "die Dürre"], ["flood", "die Überschwemmung / die Flut"],
    ],
  },
  {
    id: "beruf", titel: "Arbeit und Beruf", klasse: [9, 10], woerter: [
      ["job", "der Job / die Arbeitsstelle"], ["career", "die Karriere / die Laufbahn"],
      ["company", "die Firma / das Unternehmen"], ["employer", "der Arbeitgeber"],
      ["employee", "der Arbeitnehmer / der Angestellte"], ["colleague", "der Kollege / die Kollegin"],
      ["salary", "das Gehalt"], ["wage", "der Lohn"], ["to earn", "verdienen"],
      ["application", "die Bewerbung"], ["to apply for", "sich bewerben"], ["CV", "der Lebenslauf"],
      ["job interview", "das Vorstellungsgespräch"], ["experience", "die Erfahrung"],
      ["skills", "die Fähigkeiten"], ["work experience", "das Praktikum"],
      ["apprenticeship", "die Ausbildung / die Lehre"], ["part-time job", "der Nebenjob / der Teilzeitjob"],
      ["unemployed", "arbeitslos"],
    ],
  },
  {
    id: "gesellschaft", titel: "Meinung, Medien, Gesellschaft", klasse: [9, 10], woerter: [
      ["opinion", "die Meinung"], ["advantage", "der Vorteil"], ["disadvantage", "der Nachteil"],
      ["to discuss", "diskutieren / besprechen"], ["to argue", "streiten / argumentieren"],
      ["social media", "die sozialen Medien"], ["privacy", "die Privatsphäre"],
      ["to influence", "beeinflussen"], ["advertisement", "die Werbung / die Anzeige"],
      ["reliable", "zuverlässig"], ["source", "die Quelle"], ["government", "die Regierung"],
      ["society", "die Gesellschaft"], ["equality", "die Gleichberechtigung / die Gleichheit"],
      ["to vote", "wählen / abstimmen"], ["rights", "die Rechte"], ["responsibility", "die Verantwortung"],
      ["however", "jedoch"], ["therefore", "deshalb / daher"], ["although", "obwohl"],
      ["in addition", "außerdem / zusätzlich"],
    ],
  },
];
