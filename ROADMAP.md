# Drone Assistant — Master Roadmap

**Documentstatus:** vastgesteld startplan  
**Huidige projectstatus:** v0.4.0.1 diagnostische cachecorrectie gebouwd; betrouwbare hertest met echte drone-wifi is de volgende stap  
**Eerste doelplatform:** beheerde Android-telefoon, Chrome, zonder APK  
**Distributie en testworkflow:** GitHub-repository met mobiele PWA via een vaste GitHub Pages-link  
**Vaste repository:** `https://github.com/gasvdv-lab/drone-assistant`  
**Beoogde vaste app-link:** `https://gasvdv-lab.github.io/drone-assistant/`  
**Eerste testdrone:** zeer waarschijnlijk VISUO XS809HW; één eenvoudige wifi-FPV-camera; exacte cameraresolutie nog te bevestigen  
**Bevestigde werkende referentie-app:** XSW UFO  

## 1. Doel van de app

Drone Assistant wordt een modulaire mobiele webapp voor:

- het identificeren en documenteren van drones;
- het voorbereiden en registreren van vluchten;
- het beheren en analyseren van dronefoto's en -video's;
- Ground AR met de telefooncamera;
- fysieke markers, landingsplaatsen en inspectiepunten;
- visuele terrein- en inspectiekartering;
- 2D-kaarten, ruwe metingen en latere 3D-reconstructies;
- ruimtelijke notities, voor-en-na-vergelijkingen en rapportage.

De app is voorlopig **geen afstandsbediening**. De drone wordt uitsluitend bestuurd met de fysieke afstandsbediening en, indien nodig, de officiële drone-app.

## 2. Vastgelegde grenzen

### 2.1 Wel binnen de actieve roadmap

- droneprofielen en compatibiliteitsinformatie;
- import van bestaande opnames;
- eventueel livebeeld bekijken en analyseren wanneer dit veilig en technisch mogelijk is;
- gebruik van de telefooncamera voor AR;
- fysieke markers als schaal-, locatie- en herkenningsanker;
- visuele begeleiding voor de gebruiker;
- kwaliteitscontrole van opnames;
- projectbeheer, lokale opslag, back-up en export;
- 2D-terreinkaarten en latere 3D-terreinmodellen;
- AI als ondersteunende analyselaag.

### 2.2 Niet binnen de actieve roadmap

- joystick- of vluchtcommando's vanuit de app;
- motoren starten of stoppen;
- automatisch opstijgen of landen;
- automatische koerscorrecties;
- autonome routes of waypointvluchten;
- return-to-home vanuit de app;
- protocolonderzoek met als doel vluchtbesturing;
- een hardwarebridge voor dronebesturing.

Deze functies worden niet voorbereid of stilzwijgend ingebouwd. Ze kunnen alleen later als afzonderlijk onderzoeksproject worden overwogen wanneer de gebruiker dat uitdrukkelijk beslist.

## 3. Ontwikkelprincipes

1. Stabiliteit gaat voor het aantal functies.
2. Per versie wordt slechts één duidelijke functionele laag toegevoegd.
3. Bestaande stabiele functies mogen niet breken door een upgrade.
4. De app blijft bruikbaar zonder APK of USB-debugging.
5. Android Chrome is het eerste testplatform.
6. Afhankelijkheden blijven beperkt en vervangbaar.
7. Projectgegevens, geometrie en berekeningen blijven deterministisch.
8. AI mag analyseren en adviseren, maar geen onzekere uitkomst als exact voorstellen.
9. Onzekerheid, geschatte nauwkeurigheid en technische beperkingen worden zichtbaar gemaakt.
10. Privacygevoelige opnames blijven standaard lokaal.
11. De app verstuurt nooit onverwachte netwerk- of dronecommando's.
12. Iedere versie krijgt documentatie, tests en een expliciete acceptatiestatus.

## 4. Vaste architectuurlagen

De app wordt modulair opgebouwd uit:

- **App Shell:** navigatie, installatie, updates en offlinecache;
- **Project State:** projecten, sessies, media, markers, kaarten en notities;
- **Storage:** lokale opslag, back-up, import, export en migraties;
- **Drone Profiles:** modellen, kenmerken en compatibiliteit;
- **Media:** foto- en video-import, metadata en galerij;
- **Capture Quality:** scherpte, belichting, overlap en volledigheid;
- **Ground AR:** AR met de telefooncamera;
- **Markers:** herkenning, schaal en lokale ankers;
- **Vision:** beeldanalyse en object-/markerherkenning;
- **Mapping:** 2D-mozaïek, metingen en kaartlagen;
- **Inspection:** inspectiepunten, tijdlijn en rapportage;
- **Diagnostics:** foutenlogboek en herstelgegevens;
- **AI Support:** optionele ondersteunende analyse boven op de stabiele kern.

## 5. Doorlopende kernlagen

De volgende onderwerpen behoren niet tot één losse fase; ze worden bij iedere relevante upgrade onderhouden.

### 5.1 Automatische tests en regressietests

Na iedere upgrade worden alle automatisch testbare onderdelen uitgevoerd:

- unit-tests voor logica en berekeningen;
- opslag-, import- en exporttests;
- projectmigraties;
- tests met vaste droneprofielen;
- markerherkenning met vaste testbeelden;
- kaart- en schaalberekeningen;
- foutafhandeling;
- PWA-manifest en serviceworker;
- productiebuild;
- regressietests van alle eerder voltooide functies.

### 5.2 Praktijktests

Niet volledig automatiseerbare tests worden afzonderlijk bijgehouden:

- Android Chrome;
- beheerd werktoestel;
- camera- en opslagtoestemming;
- installatie en offline openen van de PWA;
- Ground AR/WebXR;
- echte markerherkenning onder verschillende lichtomstandigheden;
- import uit de officiële drone-app;
- gedrag zonder internet en bij beperkte opslag;
- eventueel rechtstreeks drone-livebeeld.

### 5.3 Documentatie per versie

Bij iedere upgrade worden bijgewerkt:

- `README.md`;
- `ROADMAP.md`;
- `CHANGELOG.md`;
- de vaste GitHub Pages-link zodra die bestaat.

Afzonderlijke praktijktest- en testrapportbestanden worden vanaf v0.4.0 niet meer meegeleverd. Automatische tests blijven verplicht en hun resultaat wordt kort in `README.md` en in de chat vermeld. `ROADMAP.md` blijft cumulatief in iedere volledige versie-ZIP aanwezig.

### 5.4 Privacy en gegevensbescherming

- standaard lokale verwerking en opslag;
- geen automatische cloud-upload;
- expliciete actie vóór delen of exporteren;
- metadata zichtbaar en verwijderbaar;
- later optionele vervaging van gezichten en nummerplaten;
- duidelijke verwijder- en herstelprocedure.

### 5.5 AI als ondersteunende laag

AI kan later helpen bij beeldselectie, objectherkenning, veranderingsdetectie, kwaliteitsbeoordeling en adviezen. AI beheert nooit rechtstreeks Project State, geometrie, schaal, opslag, AR-lifecycle of definitieve meetwaarden.

## 6. Versie- en acceptatieregels

Iedere versie krijgt vier afzonderlijke statussen:

- **Gebouwd** — de nieuwe laag is geïmplementeerd;
- **Automatisch getest** — alle automatische tests zijn uitgevoerd en opgeslagen;
- **Praktijktest uitgevoerd** — benodigde toestel- of terreintests zijn uitgevoerd;
- **Stabiele baseline** — de gebruiker heeft de noodzakelijke praktijktests bevestigd.

Een versie is pas volledig afgerond wanneer:

1. de nieuwe functie werkt;
2. alle automatische tests opnieuw zijn uitgevoerd;
3. bekende beperkingen zijn gedocumenteerd;
4. `README.md`, `ROADMAP.md` en `CHANGELOG.md` zijn bijgewerkt;
5. noodzakelijke toesteltests zijn in de chat uitgelegd;
6. de gebruiker de relevante werking heeft goedgekeurd.

Elke opgeleverde versie-ZIP bevat minstens:

- de complete appcode;
- `README.md`;
- de actuele cumulatieve `ROADMAP.md`;
- `CHANGELOG.md`.

De ZIP bevat `index.html` en de hoofddocumentatie rechtstreeks in de root; opmaak staat in `css/`, JavaScript in `js/` en visuele bestanden in `assets/`. Er staat geen `tests/`-map, testrapport, praktijktestbestand of extra bovenliggende map in. De gebruikers-ZIP is geen npm- of Node-package en bevat geen verplichte buildstap.

De primaire versieflow is:

1. code en documentatie bijwerken;
2. alle lokaal automatiseerbare tests uitvoeren;
3. `README.md`, `ROADMAP.md` en `CHANGELOG.md` bijwerken;
4. de complete, geteste versie verpakken als ZIP, bijvoorbeeld `Drone-Assistant-v0.1.0.zip`;
5. de ZIP aan de gebruiker bezorgen;
6. de gebruiker downloadt de ZIP en uploadt de uitgepakte inhoud naar de GitHub-repository;
7. GitHub Actions voert waar voorzien opnieuw build- en regressietests uit;
8. GitHub Pages publiceert de bron via dezelfde vaste link;
9. de gebruiker test de vaste Pages-link op de beheerde werktelefoon;
10. de gebruiker koppelt het praktische resultaat terug in de chat;
11. de versie wordt na goedkeuring als stabiele baseline gemarkeerd en kan in GitHub worden getagd, bijvoorbeeld `v0.1.0`.

De ZIP dient uitsluitend voor overdracht en upload naar GitHub. De app wordt op de werktelefoon niet vanuit de ZIP geïnstalleerd of geopend; gebruik en praktijktesten verlopen via GitHub Pages.

## 7. Gefaseerde master-roadmap

### Fase 0 — Hardware- en gebruiksprofiel

**Doel:** exact vastleggen waarmee we testen en welke grenzen het toestel oplegt.

#### Te verzamelen

- modelidentificatie verder bevestigen; actuele hardwarebaseline is `VISUO XS809HW`, met `XS809W` als nabije alternatieve variant;
- foto's van bovenkant, onderkant, camera's, sticker en batterijvak;
- naam van het drone-wifinetwerk;
- gebruikte referentie-app: `XSW UFO` (werking door gebruiker bevestigd); exacte appversie nog registreren;
- wijze van opname en opslag;
- één eenvoudige wifi-FPV-camera bevestigd als werkhypothese; exacte cameraresolutie nog controleren;
- afwezigheid van GPS, tweede camera en optical flow als hardwaregrens hanteren;
- Android- en Chrome-versie;
- beperkingen van het beheerde toestel;
- enkele originele testfoto's en korte testvideo's.

#### Resultaat

- eerste hardwareprofiel;
- lijst met bewezen en onbewezen mogelijkheden;
- initiële compatibiliteitsmatrix;
- map met gecontroleerde testmedia.

#### Exitcriterium

Het model en de huidige opnameworkflow zijn voldoende gedocumenteerd om geen protocol- of cameramogelijkheden te hoeven raden.

---

### Versie 0.1.0 — PWA-basis en kwaliteitsfundament

**Doel:** een lege maar stabiele mobiele webapp publiceren.

#### Functies

- mobiele app-shell;
- basisnavigatie;
- versienummer en buildinformatie;
- duidelijke foutpagina;
- PWA-manifest;
- serviceworker en offline app-shell;
- updatecontrole;
- diagnostisch basislogboek;
- vaste GitHub Pages-publicatie;
- testframework en eerste CI-testworkflow.

#### Automatische tests

- productiebuild slaagt;
- hoofdscherm rendert;
- navigatie werkt;
- manifest is geldig;
- serviceworker wordt gebouwd;
- offlinebestanden zijn aanwezig;
- basisfouten worden opgevangen.

#### Praktijktests

- openen via Android Chrome;
- toevoegen aan startscherm indien toegestaan;
- opnieuw openen zonder internet;
- update na nieuwe publicatie;
- bruikbaarheid op het beheerde toestel.

#### Exitcriterium

De PWA opent stabiel via de vaste link, kan opnieuw starten en toont begrijpelijke fouten.

---

### Versie 0.2.0 — Project State en lokaal projectbeheer

**Doel:** een duurzame gegevensbasis leggen vóór AR, media en kartering.

#### Gegevensmodel

- project;
- locatiebeschrijving;
- opnamesessie/vlucht;
- droneprofiel;
- media-item;
- marker;
- AR-punt, lijn en zone;
- inspectiepunt;
- kaartlaag;
- meting;
- notitie en status;
- app- en dataversie.

#### Functies

- project maken, openen, hernoemen en dupliceren;
- automatisch lokaal opslaan;
- recente projecten;
- tijdelijke herstelkopie;
- beveiligde verwijderbevestiging;
- projectschema valideren;
- migratiebasis voor toekomstige versies.

#### Automatische tests

- create/read/update/delete;
- autosave en herladen;
- dupliceren;
- herstel na onvolledige opslag;
- schema-validatie;
- migratie van testgegevens.

#### Exitcriterium

Een project overleeft herladen en appupdates zonder gegevensverlies.

---

### Versie 0.3.0 — Drone-identificatie en profielwizard

**Doel:** drones identificeren zonder ze te bedienen.

#### Functies

- profiel handmatig maken, wijzigen, dupliceren en verwijderen;
- kenmerken, alternatieve modelnamen en referentie-app opslaan;
- wifi-naam handmatig registreren;
- camera- en opslagkenmerken vastleggen;
- bewijsbronnen registreren;
- maximaal drie lokaal verkleinde bewijsfoto's opslaan;
- deterministische zekerheidsscore berekenen;
- kandidaatmodellen XS816, XS816L en XS809S tonen (historische v0.3.0-startset);
- profiel aan een project koppelen;
- bewezen, vermoedelijke en niet-ondersteunde mogelijkheden onderscheiden;
- compatibiliteitsrapport tonen;
- later OCR-, barcode- en automatische visuele herkenning voorbereiden.

#### Compatibiliteitsstatus per functie

- ondersteund;
- beperkt ondersteund;
- nog te onderzoeken;
- niet ondersteund;
- bewust niet voorzien.

#### Automatische tests

- validatie, opslag, herstel, wijzigen en dupliceren van droneprofielen;
- alternatieve modelnamen;
- identificatie- en zekerheidsscores;
- compatibiliteitsstatussen;
- migratie van bestaande v0.2-projecten;
- projectkoppeling en ontkoppeling;
- ontbreken van vluchtbesturingsfuncties.

#### Exitcriterium

De eerste VISUO kan correct aan een project worden gekoppeld en de app belooft geen onbewezen functies.

---

### Versie 0.3.1 — Gecorrigeerd XS809HW-hardwareprofiel

**Doel:** de identificatiemodule corrigeren op basis van de aangeleverde drone- en batterijfoto's.

#### Functies

- VISUO XS809HW als primaire hardwarebaseline tonen;
- XS809W als nabije alternatieve variant behouden;
- één eenvoudige wifi-FPV-camera registreren;
- opslag op de telefoon via XSW UFO registreren;
- GPS, tweede camera en optical flow expliciet als niet aanwezig tonen;
- exacte cameraresolutie zichtbaar onbevestigd laten;
- met één knop een vooraf ingevuld XS809HW-profiel openen;
- bestaande projecten en profielen ongewijzigd behouden.

#### Exitcriterium

De app toont nergens meer de XS816 Battle Sharks als primaire testdrone en maakt geen aanspraak op een tweede camera, GPS of optical flow.

---

### Versie 0.4.0 — Live Video Feasibility

**Doel:** veilig vaststellen of de camerastream van de VISUO rechtstreeks in Android Chrome bereikbaar is.

#### Functies

- uitleg over offlinecache, drone-wifi en gateway-IP;
- handmatige invoer van gateway- of camera-IP;
- uitsluitend privé-IP-adressen toelaten;
- een begrensde HTTP-bereikbaarheidstest uitvoeren;
- lokale-netwerktoegang via Chrome gebruiken wanneer beschikbaar;
- browsercompatibele HTTP/MJPEG-paden één voor één proberen;
- videopoging onmiddellijk kunnen stoppen;
- resultaten lokaal loggen en kopiëren;
- geen automatische netwerkscan;
- geen UDP-, motor- of vluchtcommando's.

#### Automatische tests

- versie- en serviceworkercache;
- aanwezigheid Live-module;
- validatie van privé-IP en lokale URL;
- time-out en foutafhandeling;
- afwezigheid van camera-, locatie-, WebSocket- en vluchtbesturingscode;
- regressie van projecten en droneprofielen.

#### Mogelijke uitkomsten

- browsercompatibele stream gevonden: v0.4.1 bouwt de volwaardige livevideospeler;
- alleen eigen UDP-stream gevonden: directe weergave via GitHub Pages is niet mogelijk;
- lokaal verkeer door toestelbeleid geblokkeerd: beperking documenteren;
- onbekend protocol: gericht vervolgonderzoek zonder besturingspakketten.

#### Exitcriterium

We weten aantoonbaar of rechtstreeks livebeeld in deze GitHub Pages-webapp haalbaar is en via welk lokaal adres/protocol.

### Voorwaardelijke versie 0.4.1 — Livevideospeler

Alleen bouwen wanneer v0.4.0 een browsercompatibele stream vindt. Voorziet livebeeld, volledig scherm, stop/herverbinden, vertragingstatus en later lokale opname. Als v0.4.0 aantoont dat alleen rauwe UDP beschikbaar is, vervalt deze versie.

### Latere module — Media-import, galerij, back-up en export

De eerder voor v0.4.0 geplande media-import blijft volledig in de roadmap, maar is uitgesteld totdat het livevideo-onderzoek afgerond is.

---

### Versie 0.5.0 — Opnamevoorbereiding en missiechecklist

**Doel:** de gebruiker begeleiden bij het verzamelen van bruikbare beelden, zonder de drone te bedienen.

#### Functies

- doel van de opname vastleggen;
- terrein- of inspectietype kiezen;
- checklist voor toestel, batterij, licht, wind en omgeving;
- gewenste camerahoek en overlap tonen;
- schaalmarkers en landingsbasis voorbereiden;
- rastervlucht als visuele instructie tonen;
- privacy- en veiligheidscontrole;
- sessie starten en afronden;
- handmatige vluchtnotities en timer.

#### Automatische tests

- checklistlogica;
- verplichte en optionele stappen;
- sessiestatus;
- opslaan en hervatten;
- geen aanroep van vluchtbesturing.

#### Exitcriterium

De app kan een volledige handmatig gevlogen opnamesessie voorbereiden en registreren.

---

### Versie 0.6.0 — Opnamekwaliteitscontrole

**Doel:** vóór kartering vaststellen of het beeldmateriaal bruikbaar is.

#### Functies

- scherpte en bewegingsonscherpte beoordelen;
- donkere en overbelichte beelden signaleren;
- dubbele of bijna-identieke beelden vinden;
- resolutie en beeldverhouding controleren;
- voorlopige overlap inschatten;
- ontbrekende beeldreeksen signaleren;
- kwaliteitsscore per beeld en per sessie;
- duidelijke aanbevelingen voor heropname.

#### Automatische tests

- vaste scherpe, wazige, donkere en overbelichte testbeelden;
- grenswaarden;
- dubbele detectie;
- reproduceerbare kwaliteitsscores;
- foutgedrag bij onleesbare media.

#### Exitcriterium

De app kan consequent bruikbaar en onbruikbaar testmateriaal onderscheiden, met zichtbare onzekerheid.

---

### Versie 0.7.0 — Fysieke markers en kalibratiebasis

**Doel:** schaal, herkenning en lokale ankers betrouwbaarder maken.

#### Markertypes

- `H` — thuis-/landingsbasis;
- `D1`, `D2`, ... — bestemming;
- `I` — inspectiepunt;
- `N` — noodlandingsplaats;
- `V` — verboden of te vermijden zone;
- `S` — schaalreferentie;
- `A`, `B`, `C`, ... — karteringsanker.

#### Functies

- eigen markerpatronen genereren;
- markerblad afdrukken/exporteren;
- fysieke afmetingen registreren;
- marker met telefooncamera herkennen;
- marker in geïmporteerd dronebeeld herkennen;
- herkenningsscore tonen;
- schaal uit bekende markerafmeting afleiden;
- markerpositie aan project koppelen;
- begin van camerakalibratie met testpatroon.

#### Automatische tests

- detectie met vaste beelden;
- rotatie, schaal en perspectief;
- meerdere markers;
- foutieve marker-ID;
- schaalberekening;
- lage herkenningsscore.

#### Praktijktests

- buiten en binnen;
- zon, schaduw en avondlicht;
- verschillende afstanden en hoeken;
- marker zichtbaar in echte droneopname.

#### Exitcriterium

Minstens één schaalmarker en landingsmarker worden betrouwbaar herkend onder afgesproken testcondities.

---

### Versie 0.8.0 — Ground AR met telefooncamera

**Doel:** locaties en zones vóór een vlucht ruimtelijk plannen.

#### Functies

- AR-sessie starten en correct afsluiten;
- vlakdetectie en hit-test;
- virtuele landingszone plaatsen;
- bestemming of inspectiepunt plaatsen;
- veiligheids- en verboden zones tekenen;
- eenvoudige route of corridor visualiseren;
- fysieke marker als lokaal anker gebruiken;
- AR-plan in Project State opslaan;
- opgeslagen plan opnieuw openen met duidelijke relocalisatiebeperking.

#### Automatische tests

- AR-state en lifecyclelogica waar simuleerbaar;
- geometrie en zonevalidatie;
- opslaan/herladen van ankers;
- nette foutmelding wanneer WebXR ontbreekt;
- correcte teardown na afsluiten.

#### Praktijktests

- WebXR/ARCore op Android Chrome;
- camera terug openen zonder refresh;
- binnen/buiten;
- verlies en herstel van tracking;
- markers en virtuele zones combineren.

#### Exitcriterium

Een gebruiker kan een landingszone en inspectiepunt plaatsen, opslaan en de AR-modus betrouwbaar verlaten en herstarten.

---

### Versie 0.9.0 — Annotatie en AR-laag op dronebeelden

**Doel:** dronebeelden inhoudelijk bruikbaar maken voor inspectie en planning.

#### Functies

- punt, kader, lijn en vlak tekenen;
- labels, kleuren, symbolen en categorieën;
- marker en notitie aan een beeld koppelen;
- handmatige objectselectie;
- eenvoudige beeldtracking in videofragmenten onderzoeken;
- annotaties als afzonderlijke niet-destructieve laag bewaren;
- afbeelding of videoframe met annotaties exporteren.

#### Automatische tests

- coördinaten en schaal bij verschillende resoluties;
- annotaties opslaan en opnieuw tekenen;
- export zonder origineel te wijzigen;
- verwijderde of verplaatste annotaties;
- ontbrekende bronmedia.

#### Exitcriterium

Annotaties blijven correct uitgelijnd na opslaan, herladen en exporteren.

---

### Versie 0.10.0 — Inspecties en ruimtelijk geheugen

**Doel:** herhaalbare terrein- en objectinspecties beheren.

#### Functies

- inspectiepunt met foto, tekst en gesproken notitie;
- categorie, prioriteit, verantwoordelijke en status;
- koppeling aan marker, kaartpositie of beeldannotatie;
- open, opgevolgd en afgewerkt;
- vorige inspectie terugvinden;
- inspectieroute/checklist;
- basisinspectierapport exporteren.

#### Automatische tests

- statusworkflow;
- media- en markerrelaties;
- filters en sortering;
- rapportgegevens;
- ontbrekende gekoppelde media.

#### Exitcriterium

Eenzelfde inspectiepunt kan over meerdere sessies gevolgd en gerapporteerd worden.

---

### Versie 0.11.0 — 2D-terreinkartering

**Doel:** overlappende dronebeelden samenvoegen tot een bruikbare visuele kaart.

#### Stap 1: project voorbereiden

- terreingrens en doel vastleggen;
- schaal- en ankerpunten registreren;
- gekende afstanden invoeren;
- gewenste overlap bepalen.

#### Stap 2: beelden selecteren

- kwaliteitscontrole toepassen;
- relevante beelden kiezen;
- volgorde en dekking beoordelen;
- ontbrekende zones aanduiden.

#### Stap 3: mozaïek maken

- overeenkomstige beeldpunten zoeken;
- beelden uitlijnen;
- perspectief gedeeltelijk corrigeren;
- schaalmarkers toepassen;
- onzekerheid en vervorming zichtbaar maken;
- 2D-mozaïek genereren.

#### Stap 4: kaart gebruiken

- punten, lijnen en vlakken;
- ruwe afstanden en oppervlakten;
- inspectiepunten en notities;
- kaartlagen tonen/verbergen;
- kaart als afbeelding en projectdata exporteren.

#### Automatische tests

- kleine vaste beeldsets;
- feature matching;
- transformaties;
- schaalberekening;
- kaartgeometrie;
- onvoldoende overlap;
- reproduceerbaarheid.

#### Exitcriterium

Een vaste referentiedataset levert herhaalbaar een bruikbare 2D-mozaïekkaart met expliciete nauwkeurigheidsbeperking.

---

### Versie 0.12.0 — Voor-en-na-vergelijking

**Doel:** veranderingen tussen twee of meer opnamedatums zichtbaar maken.

#### Functies

- sessies op datum groeperen;
- hetzelfde gebied of standpunt terugvinden;
- beelden en kaarten uitlijnen;
- transparantie-/schuifvergelijking;
- veranderingen handmatig markeren;
- later ondersteunende automatische veranderingsdetectie;
- tijdlijn en voortgangsrapport.

#### Automatische tests

- datumselectie;
- uitlijning van vaste testparen;
- verschilmaskers;
- handmatige correcties;
- rapportexport.

#### Exitcriterium

De gebruiker kan twee terreinopnames betrouwbaar vergelijken zonder dat automatische detectie als absolute waarheid wordt gepresenteerd.

---

### Versie 0.13.0 — Uitgebreide rapportage en uitwisseling

**Doel:** projectresultaten bruikbaar delen en archiveren.

#### Functies

- inspectierapport;
- terreinrapport;
- opnamekwaliteitsrapport;
- kaart, afbeeldingen en tabellen bundelen;
- export naar gangbare bestandsformaten;
- metadata en privacyopties vóór export;
- projectarchief met versie-informatie;
- herimport en integriteitscontrole.

#### Automatische tests

- rapportinhoud;
- ontbrekende gegevens;
- export-/importintegriteit;
- privacykeuzes;
- compatibiliteit van oudere projectarchieven.

#### Exitcriterium

Een volledig project kan begrijpelijk worden geëxporteerd, gedeeld en later opnieuw geopend.

---

### Versie 0.14.0 — Ondersteunende AI-analyse

**Doel:** analyse versnellen zonder de controle over kerngegevens over te dragen.

#### Mogelijke functies

- voorstellen welke beelden bruikbaar zijn;
- objecten of aandachtspunten voorstellen;
- vergelijkbare inspectiepunten groeperen;
- veranderingen suggereren;
- ontbrekende terreindekking signaleren;
- notities structureren;
- onzekerheidsscore en menselijke bevestiging.

#### Harde regels

- AI-resultaten zijn voorstellen;
- menselijke bevestiging vóór opname in definitieve projectdata;
- oorspronkelijke beelden blijven behouden;
- deterministische meetresultaten blijven apart;
- functie werkt ook zonder AI, eventueel met minder automatisering.

#### Exitcriterium

AI bespaart aantoonbaar werk op een vaste testset zonder de stabiele kern of reproduceerbaarheid te ondermijnen.

---

### Versie 0.15.0 — 3D-terreinreconstructie

**Doel:** een ruwe driedimensionale terreinweergave maken uit meerdere opnames.

#### Mogelijke functies

- puntenwolk genereren of importeren;
- ruwe mesh en textuur;
- schaal via markers;
- hoogteverschillen en hellingen visualiseren;
- eenvoudig 3D-model op het terrein plaatsen;
- ruwe volume-inschatting;
- twee modellen vergelijken;
- export naar een gangbaar 3D-formaat.

#### Technische positie

De webapp verzamelt, controleert en organiseert de beelden. Zware fotogrammetrie kan afhankelijk van prestaties lokaal op een computer of via een later gekozen verwerkingsdienst plaatsvinden. GitHub Pages levert zelf geen zware backendverwerking.

#### Exitcriterium

Een vaste referentiedataset levert een schaalbaar, inspecteerbaar 3D-resultaat met duidelijk beschreven nauwkeurigheid en beperkingen.

---

### Versie 0.16.0 — Rechtstreeks livebeeld onderzoeken, alleen-kijken

**Doel:** nagaan of dronevideo rechtstreeks in Chrome kan worden bekeken, zonder besturing.

Deze fase is optioneel en mag eerder worden onderzocht wanneer dit nodig blijkt, maar mag de stabiele kern niet blokkeren.

#### Toegestane scope

- telefoon handmatig verbinden met drone-wifi;
- netwerkstatus tonen;
- browservriendelijke videostream detecteren;
- livebeeld alleen bekijken;
- vertraging en beeldverlies meten;
- eventueel frames lokaal analyseren of opnemen;
- verbinding veilig afsluiten.

#### Uitgesloten scope

- geen besturingspakketten;
- geen motorcommando's;
- geen joystickemulatie;
- geen automatische vluchtacties;
- geen protocolbridge voor besturing.

#### Mogelijke uitkomsten

- rechtstreeks livebeeld werkt;
- alleen via de officiële app beschikbaar;
- browserbeperkingen verhinderen toegang;
- beelden blijven via import gebruikt worden.

#### Exitcriterium

Er is een gedocumenteerde, reproduceerbare conclusie zonder risico op dronebesturing.

---

### Versie 1.0.0 — Geïntegreerde stabiele Drone Assistant

**Doel:** de afzonderlijke stabiele modules samenbrengen tot één bruikbaar product.

#### Beoogde kern

- PWA via vaste GitHub Pages-link;
- lokaal projectbeheer, back-up en export;
- droneprofielen en compatibiliteitsmatrix;
- media-import en kwaliteitscontrole;
- missievoorbereiding zonder dronebesturing;
- markers, kalibratie en Ground AR;
- beeldannotaties en inspecties;
- 2D-terreinkartering;
- voor-en-na-vergelijking;
- rapportage;
- optionele AI-ondersteuning;
- eventueel alleen-kijken-livebeeld wanneer haalbaar;
- duidelijke grenzen rond nauwkeurigheid en compatibiliteit.

#### Releasecriteria

- volledige automatische regressiesuite slaagt;
- geen kritieke bekende fouten;
- projectmigraties en back-up zijn getest;
- offline/PWA-praktijktest slaagt;
- kernworkflow is getest met echte VISUO-media;
- privacy- en foutscenario's zijn gecontroleerd;
- README, ROADMAP, CHANGELOG en testrapport zijn actueel;
- gebruiker keurt de stabiele baseline goed.

## 8. Latere uitbreidingen na 1.0

- extra droneprofielen en adapterloze compatibiliteit;
- iPhone/Safari waar browsermogelijkheden dit toelaten;
- desktopweergave voor zware analyse;
- uitgebreidere camerakalibratie;
- grotere terreinprojecten;
- geavanceerdere 3D- en volumevergelijking;
- optionele, bewust gekozen synchronisatie;
- samenwerken en projectdeling;
- VR-weergave van terreinmodellen;
- koppeling met CAD/GIS-formaten.

Vluchtbesturing blijft ook na 1.0 buiten scope totdat daar een afzonderlijke, expliciete beslissing over wordt genomen.

## 9. Voorgestelde repositorystructuur

```text
/
├── README.md
├── ROADMAP.md
├── CHANGELOG.md
├── package.json
├── src/
│   ├── app/
│   ├── project-state/
│   ├── storage/
│   ├── drone-profiles/
│   ├── media/
│   ├── capture-quality/
│   ├── markers/
│   ├── ground-ar/
│   ├── vision/
│   ├── mapping/
│   ├── inspection/
│   ├── diagnostics/
│   └── ai-support/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── fixtures/
│   │   ├── images/
│   │   ├── markers/
│   │   └── projects/
│   └── reports/
├── docs/
│   ├── architecture/
│   ├── compatibility/
│   ├── calibration/
│   └── manual-tests/
└── public/
```

## 10. Testresultaten vanaf v0.4.0

Automatische regressietests blijven intern uitgevoerd. Alleen het samengevatte resultaat komt in `README.md` en in de chat; er worden geen afzonderlijke test- of praktijktestbestanden meer aan de ZIP toegevoegd.

## 11. Eerstvolgende concrete stap

De eerstvolgende stap is v0.4.0 via GitHub Pages publiceren, met de drone-wifi verbinden en het gateway-/camera-adres alleen-lezen onderzoeken.

Voor Fase 0 verzamelen we eerst:

1. de actuele identificatie `VISUO XS809HW` waar mogelijk nog bevestigen via verpakking of handleiding;
2. bevestigde referentie-app `XSW UFO` registreren en de exacte geïnstalleerde appversie nog noteren;
3. naam van het drone-wifinetwerk;
4. enkele originele foto's en een korte video uit die app;
5. bevestigen hoe bestanden vanuit XSW UFO naar Chrome/bestandsopslag kunnen worden gebracht;
6. de werkelijke uitvoerresolutie van een originele foto en korte video controleren.

## 12. Actuele voortgang

- [x] Hoofddoel van de app bepaald
- [x] Geen vluchtbesturing als harde grens vastgelegd
- [x] Automatische test- en regressieregels bepaald
- [x] Cumulatieve documentatieregels bepaald
- [x] Master-roadmap opgesteld
- [x] Hardware op basis van foto's gecorrigeerd naar zeer waarschijnlijk VISUO XS809HW
- [x] Eén eenvoudige wifi-FPV-camera als hardwarebaseline vastgelegd
- [x] GPS, tweede camera en optical flow uitgesloten voor de actieve testdrone
- [x] Werkende referentie-app vastgesteld: XSW UFO
- [x] GitHub-repository aangemaakt: `gasvdv-lab/drone-assistant`
- [ ] GitHub Pages activeren en vaste app-link verifiëren
- [ ] XS809HW waar mogelijk nog via verpakking of handleiding bevestigen
- [ ] Exacte cameraresolutie met een origineel XSW UFO-bestand controleren
- [ ] Exacte geïnstalleerde versie van XSW UFO registreren
- [ ] Fase 0 — exact hardwareprofiel verzamelen
- [x] Versie 0.1.0 — PWA-basis bouwen
- [x] Versie 0.1.0 — automatische tests uitvoeren (15/15 controles en 6/6 buildonderdelen geslaagd)
- [x] Versie 0.1.0 — regressiefuncties bevestigd tijdens cumulatieve praktijktest v0.2.0
- [x] Versie 0.1.0 — opgenomen in de goedgekeurde v0.2.0-baseline
- [x] Versie 0.2.0 — lokaal projectbeheer bouwen
- [x] Versie 0.2.0 — automatische regressie- en projecttests uitvoeren (27/27 controles en 7/7 buildonderdelen geslaagd)
- [x] Versie 0.2.0 — cumulatieve praktijktest op Android Chrome geslaagd
- [x] Versie 0.2.0 — door gebruiker goedgekeurd als stabiele baseline
- [x] Versie 0.3.0 — drone-identificatie en profielwizard bouwen
- [x] Versie 0.3.0 — automatische regressie- en identificatietests uitvoeren (51/51 controles en 8/8 buildonderdelen geslaagd)
- [x] Versie 0.3.0 — opgevolgd door correctierelease v0.3.1 vóór afzonderlijke goedkeuring
- [x] Versie 0.3.1 — XS809HW-hardwareprofiel en preset bouwen
- [x] Versie 0.3.1 — automatische regressie- en hardwareprofieltests uitvoeren (60/60 controles en 8/8 buildonderdelen geslaagd)
- [x] Livevideo als eerstvolgende productprioriteit vastgesteld
- [x] Afzonderlijke praktijktest- en testrapportbestanden vanaf v0.4.0 geschrapt
- [x] Versie 0.4.0 — veilige Live Video Feasibility-module bouwen
- [x] Versie 0.4.0 — automatische regressietests uitvoeren (88/88 controles en 9/9 productieonderdelen geslaagd)
- [x] Versie 0.4.0.1 — voorkomen dat offlinecache lokale camerafouten als HTTP-succes presenteert
- [ ] Versie 0.4.0.1 — `192.168.0.20` en de werkelijk vermelde gateway opnieuw testen
- [ ] Versie 0.4.0 — via GitHub Pages met de echte drone-wifi testen
- [ ] Versie 0.4.0 — beslissen of v0.4.1 livevideospeler haalbaar is
