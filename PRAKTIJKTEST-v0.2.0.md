# Praktijktest Drone Assistant v0.2.0

## Testomgeving

- Toestel: beheerde Android-werktelefoon
- Browser: Chrome
- App-link: https://gasvdv-lab.github.io/drone-assistant/

## Basistest

- [ ] App-link opent zonder foutmelding.
- [ ] Interface past volledig op het telefoonscherm.
- [ ] Start, Modules, Diagnostiek en Over openen.
- [ ] Terugkeren naar Start werkt.
- [ ] Online/offlinestatus verandert correct.
- [ ] Diagnostiek toont appversie 0.2.0.
- [ ] Knop **Kopieer diagnostiek** werkt.
- [ ] Er wordt geen camera-, locatie- of droneverbindingstoestemming gevraagd.

## Nieuwe projecttests v0.2.0

- [ ] Open **Projecten**; de lege projectweergave verschijnt.
- [ ] Maak een project met naam `Testproject`, een locatie en een beschrijving.
- [ ] Het project verschijnt in de lijst en wordt automatisch actief.
- [ ] Het actieve project verschijnt op het startscherm.
- [ ] Sluit Chrome volledig en open opnieuw; het project bestaat nog.
- [ ] Wijzig naam, locatie en beschrijving; de wijziging blijft na herstart bestaan.
- [ ] Dupliceer het project; een tweede project met `— kopie` verschijnt.
- [ ] Open afwisselend beide projecten; het juiste actieve project staat op Start.
- [ ] Kies verwijderen en annuleer; het project blijft bestaan.
- [ ] Verwijder daarna de kopie definitief.
- [ ] Probeer een project zonder naam te bewaren; de app weigert dit begrijpelijk.

## PWA- en offlinetest

- [ ] App eenmaal volledig online geopend.
- [ ] Toevoegen aan startscherm is beschikbaar of beperking is genoteerd.
- [ ] Internet uitgeschakeld.
- [ ] App opnieuw geopend.
- [ ] Basisinterface blijft offline beschikbaar.
- [ ] Internet opnieuw ingeschakeld.
- [ ] App blijft werken.

## Herstarttest

- [ ] Browser/app volledig afgesloten.
- [ ] App opnieuw geopend zonder refreshprobleem.
- [ ] Navigatie werkt nog steeds.

## Resultaat

- [ ] Geslaagd — v0.2.0 mag stabiele baseline worden.
- [ ] Niet geslaagd — fout en diagnostiek terugsturen.

### Opmerkingen

Schrijf hier waargenomen fouten, afwijkingen of verbeterpunten.
