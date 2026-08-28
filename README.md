# Drone Assistant v0.1.0

Mobiele PWA voor toekomstige analyse van dronebeelden, Ground AR, inspecties en terreinkartering.

## Vaste links

- Repository: https://github.com/gasvdv-lab/drone-assistant
- App: https://gasvdv-lab.github.io/drone-assistant/

## Wat werkt in v0.1.0?

- mobiele startinterface;
- basisnavigatie;
- PWA-manifest;
- offline app-shell via serviceworker;
- online/offlinestatus;
- toestel- en browserdiagnostiek;
- diagnostiek kopiëren;
- veilige updatecontrole;
- begrijpelijke basisfoutcodes.

## Bewuste grenzen

Deze versie opent geen camera, vraagt geen locatie en maakt geen verbinding met de drone. Dronebesturing valt buiten de actieve roadmap.

## Uploaden naar GitHub

1. Pak `Drone-Assistant-v0.1.0.zip` uit.
2. Open `https://github.com/gasvdv-lab/drone-assistant`.
3. Kies **uploading an existing file** of **Add file → Upload files**.
4. Upload de volledige uitgepakte inhoud. `index.html` moet in de hoofdmap staan.
5. Commit rechtstreeks naar `main` met bericht `Upload Drone Assistant v0.1.0`.

## GitHub Pages activeren

1. Open **Settings** van de repository.
2. Kies **Pages**.
3. Kies bij **Build and deployment**: `Deploy from a branch`.
4. Selecteer branch `main` en map `/(root)`.
5. Kies **Save**.
6. Wacht op publicatie en open de vaste app-link.

## Testresultaat

Voor deze oplevering zijn **15/15 automatische controles geslaagd** en zijn **6/6 vereiste productieonderdelen aanwezig**. De gebruiker hoeft geen package, npm of buildopdracht uit te voeren. Zie `TESTREPORT-v0.1.0.md`.

## Praktijktest

Volg `PRAKTIJKTEST-v0.1.0.md`. v0.1.0 wordt pas een stabiele baseline nadat deze test door de gebruiker is goedgekeurd.
