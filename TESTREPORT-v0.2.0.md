# Testrapport Drone Assistant v0.2.0

## Nieuwe functionaliteit

Behoud van de mobiele PWA-basis plus lokale Project State, projectbeheer, autosave en herstelkopie.

## Testomgeving

- Geïsoleerde automatische broncontroles vóór oplevering
- Statische GitHub Pages-architectuur
- Doelbrowser: Android Chrome

## Automatische tests

De tests controleren onder meer:

- versienummer;
- geldig manifest;
- GitHub Pages-relatieve start-URL en scope;
- aanwezigheid van navigatie en diagnostiek;
- responsieve en veilige-area-opmaak;
- juiste serviceworkercache;
- afwezigheid van camera-, locatie-, WebSocket- en dronebesturingsaanroepen.
- project maken, wijzigen, openen, dupliceren en verwijderen;
- bewaren na herladen;
- herstel uit een geldige back-up bij beschadigde hoofdopslag;
- weigeren van een lege projectnaam.

## Resultaten

- Automatische regressie- en projectcontroles: **27/27 geslaagd**
- Productie-/bestandscontrole: **7/7 vereiste onderdelen aanwezig**
- Testdatum: **2026-08-28**
- Mislukte inhoudelijke tests: **geen**

De automatische controles zijn vóór oplevering uitgevoerd. De gebruiker hoeft daarvoor geen package te installeren of buildopdracht uit te voeren.

## Automatisch niet-testbare onderdelen

- werkelijke installatie als PWA;
- offline herstart in Android Chrome;
- visuele schaal op de beheerde werktelefoon;
- Android-bestands- en browserbeleid.

## Openstaande praktijktests

Zie `PRAKTIJKTEST-v0.2.0.md`, inclusief de relevante regressietests van v0.1.0.

## Bekende beperkingen

- toekomstige modules zijn nog niet actief;
- nog geen droneprofiel of media-import;
- geen AR;
- geen directe droneverbinding of -besturing.

## Acceptatiestatus

- Gebouwd: voltooid
- Automatisch getest: geslaagd
- Praktijktest: openstaand
- Stabiele baseline: nog niet goedgekeurd
