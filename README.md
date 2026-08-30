# Drone Assistant v0.4.0

Mobiele GitHub Pages-PWA voor de VISUO XS809HW. Deze versie onderzoekt veilig of de camerastream rechtstreeks in Android Chrome bereikbaar is. De app bestuurt de drone niet.

## Vaste links

- Repository: https://github.com/gasvdv-lab/drone-assistant
- App: https://gasvdv-lab.github.io/drone-assistant/

## Wat betekent offlinecache?

De serviceworker bewaart de app-shell lokaal op de telefoon. Nadat Drone Assistant eenmaal via GitHub Pages is geladen, kan de interface opnieuw openen wanneer de telefoon verbonden is met het wifi-netwerk van de drone, ook al levert dat netwerk geen internet.

De cache bewaart de appcode, niet automatisch de camerastream. Een nieuwe versie wordt pas opgehaald wanneer opnieuw internet beschikbaar is.

## Waar staat het gateway-IP op Samsung?

1. Zet de drone aan, maar laat de motoren uit.
2. Open **Instellingen → Verbindingen → Wi‑Fi**.
3. Verbind met het drone-wifinetwerk, bijvoorbeeld `WiFi UFO` of `WiFi 720P`.
4. Tik op het tandwiel naast het verbonden netwerk.
5. Kies zo nodig **Meer weergeven** of **IP-instellingen**.
6. Neem het adres bij **Gateway** over in Drone Assistant.

De app start met `192.168.0.1` als veilige hypothese. De browser kan het echte gateway-IP niet automatisch uitlezen.

## Nieuw in v0.4.0

- afzonderlijke module **Live**;
- uitleg over drone-wifi, offlinecache en gateway-IP;
- invoer van een lokaal gateway- of camera-IP;
- alleen privé-IP-adressen toegestaan;
- handmatige HTTP-bereikbaarheidstest met time-out;
- lokale-netwerktoegang aanvragen via Chrome wanneer beschikbaar;
- afzonderlijk proberen van zes gangbare browser-videopaden;
- handmatig aanpasbare lokale stream-URL;
- beeldvenster met stopknop;
- lokaal diagnoselogboek en kopieerfunctie;
- laatst gebruikte IP-adres en log lokaal bewaren;
- geen automatische netwerkscan;
- geen UDP-, motor- of vluchtcommando’s.

## Veilig testen

Open eerst Drone Assistant terwijl internet beschikbaar is. Verbind daarna met de wifi van de ingeschakelde drone. Open **Live**, vul het gateway-IP in en kies **Test lokaal camera-adres**. Probeer vervolgens één videopatroon per keer.

Een mislukt HTTP-resultaat bewijst niet dat de camera defect is. Het kan betekenen dat de camera alleen een eigen UDP-stream gebruikt, die een gewone webpagina niet rechtstreeks kan openen.

## Bestanden

| Bestand/map | Functie |
|---|---|
| `index.html` | Schermen, Live-module en uitleg. |
| `css/app.css` | Mobiele vormgeving en videovenster. |
| `js/app.js` | Navigatie, projecten, profielen en veilige livevideodiagnose. |
| `js/project-state.js` | Lokale projectopslag en herstelkopie. |
| `js/drone-profile-state.js` | Droneprofielen en identificatie. |
| `service-worker.js` | Offlinecache en versie-update. |
| `manifest.webmanifest` | PWA-instellingen. |
| `assets/icon.svg` | App-pictogram. |
| `ROADMAP.md` | Cumulatieve roadmap. |
| `CHANGELOG.md` | Cumulatieve wijzigingen. |

Afzonderlijke praktijktest- en testrapportbestanden worden vanaf deze versie niet meer meegeleverd. Automatische tests blijven vóór iedere oplevering uitgevoerd; het resultaat wordt hier en in de chat vermeld.

## Uploaden naar GitHub

1. Pak `Drone-Assistant-v0.4.0.zip` uit.
2. Open https://github.com/gasvdv-lab/drone-assistant.
3. Kies **Add file → Upload files**.
4. Upload de volledige inhoud rechtstreeks naar de hoofdmap.
5. Commit met bericht `Upgrade Drone Assistant naar v0.4.0`.
6. Wacht op GitHub Pages en open de vaste app-link eenmaal met internet.

Geen package-installatie, npm-opdracht of buildstap is nodig.

## Automatische teststatus

- **88/88 automatische controles geslaagd**
- **9/9 productieonderdelen aanwezig**
- syntaxis van de Live-module en hulplogica geldig
- privé-IP- en lokale-URL-validatie inhoudelijk getest
- project- en droneprofielregressies geslaagd
- geen camera-, locatie-, WebSocket- of vluchtbesturingscode toegevoegd
