# Drone Assistant v0.3.1

Mobiele GitHub Pages-PWA voor toekomstige analyse van dronebeelden, Ground AR, inspecties en terreinkartering. De app bestuurt de drone niet.

## Vaste links

- Repository: https://github.com/gasvdv-lab/drone-assistant
- App: https://gasvdv-lab.github.io/drone-assistant/

## Nieuwe hardwarebaseline

De aangeleverde foto's, batterijvorm en werkende XSW UFO-app wijzen met hoge waarschijnlijkheid op:

- **model:** VISUO/TIANQU XS809HW;
- **camera:** één eenvoudige wifi-FPV-camera;
- **opslag:** foto en video via XSW UFO op de telefoon;
- **niet aanwezig:** GPS, tweede camera en optical flow;
- **nog onbevestigd:** de exacte cameraresolutie.

Daarom gebruikt de app niet langer de XS816 Battle Sharks als primaire kandidaat. XS809W blijft alleen als nabijgelegen alternatieve variant beschikbaar.

## Wat werkt in v0.3.1?

- alle functies van v0.3.0;
- zichtbaar hardwareprofiel voor de XS809HW;
- knop **Gebruik dit herkende profiel**;
- vooraf ingevuld model, merk, XSW UFO, één camera en opslag op telefoon;
- duidelijke vermelding van ontbrekende GPS, tweede camera en optical flow;
- XS809HW en XS809W als primaire kandidaten;
- bestaande projecten en droneprofielen blijven behouden;
- mobiele navigatie, offline app-shell en diagnostiek;
- projecten lokaal maken, openen, wijzigen, dupliceren en verwijderen;
- droneprofielen en maximaal drie lokale bewijsfoto's beheren;
- zekerheidsscore, compatibiliteitsmatrix en projectkoppeling.

## Bewuste grenzen

Deze versie opent de camera niet rechtstreeks, vraagt geen locatie en maakt geen verbinding met de drone. De app verstuurt geen vlucht-, motor- of protocolcommando's. Bewijsfoto's worden alleen verwerkt nadat de gebruiker ze via de bestandskiezer selecteert. Browsergegevens wissen verwijdert lokale projecten, profielen en foto's.

## Ieder bestand uitgelegd

| Bestand/map | Functie |
|---|---|
| `index.html` | Volledige schermstructuur en teksten van de app. |
| `css/app.css` | Mobiele vormgeving en responsieve layout. |
| `js/app.js` | Navigatie, formulieren, hardwarepreset, diagnostiek en gebruikersinteractie. |
| `js/project-state.js` | Veilige lokale projectopslag, herstelkopie en projectmigratie. |
| `js/drone-profile-state.js` | Droneprofielen, kandidaatmodellen, identificatiescore en lokale opslag. |
| `service-worker.js` | Bewaart de app-shell voor offline openen en verwijdert oude caches na een upgrade. |
| `manifest.webmanifest` | PWA-naam, kleur, pictogram en startinstellingen. |
| `assets/icon.svg` | App-pictogram. |
| `ROADMAP.md` | Cumulatieve productroadmap en actuele status. |
| `CHANGELOG.md` | Cumulatieve wijzigingen per versie. |
| `TESTREPORT-v0.3.1.md` | Resultaten van de automatisch uitgevoerde controles. |
| `PRAKTIJKTEST-v0.3.1.md` | Stappen om de upgrade op Android Chrome te testen. |
| oudere testdocumenten | Historiek van eerdere versies. |

## Uploaden naar GitHub

1. Pak `Drone-Assistant-v0.3.1.zip` uit.
2. Open https://github.com/gasvdv-lab/drone-assistant.
3. Kies **Add file → Upload files**.
4. Upload de volledige uitgepakte inhoud; `index.html` moet rechtstreeks in de hoofdmap staan.
5. Kies **Commit changes** met bericht `Upgrade Drone Assistant naar v0.3.1`.
6. Wacht op GitHub Pages en open daarna de vaste app-link.

Er is geen package-installatie, npm-opdracht of buildstap nodig.

## Testresultaat

Voor deze oplevering zijn **60/60 automatische controles geslaagd** en zijn **8/8 productieonderdelen aanwezig**. Zie `TESTREPORT-v0.3.1.md`.

## Praktijktest

Volg `PRAKTIJKTEST-v0.3.1.md`. v0.2.0 blijft de stabiele baseline totdat de identificatie-upgrade op de vaste GitHub Pages-link is goedgekeurd.
