# Changelog

Alle belangrijke wijzigingen aan Drone Assistant worden hier cumulatief bijgehouden.

## [0.3.1] — 2026-08-30

### Gecorrigeerd

- primaire testdrone gewijzigd van de voorlopige XS816-inschatting naar **VISUO XS809HW**;
- XS809W behouden als nabije alternatieve variant;
- hardwareprofiel vastgelegd met één eenvoudige wifi-FPV-camera en opslag op de telefoon via XSW UFO;
- GPS, tweede camera en optical flow expliciet als niet aanwezig gemarkeerd;
- exacte cameraresolutie bewust onbevestigd gelaten.

### Toegevoegd

- zichtbaar hardwareoverzicht in de identificatiemodule;
- knop **Gebruik dit herkende profiel** met veilige voorinvulling;
- regressietests voor XS809HW/XS809W, camera-aantal, opslagwijze en hardwareclaims.

### Behouden

- bestaande lokale projecten en droneprofielen;
- alle v0.3.0-functies;
- geen camera-, locatie-, drone- of vluchtbesturingstoegang.

## [0.3.0] — 2026-08-30

### Toegevoegd

- drone-identificatie- en profielwizard;
- bewijsstatussen van onbekend tot bevestigd;
- deterministische zekerheidsscore;
- kandidaatmodellen XS816, XS816L en XS809S;
- registratie van XSW UFO, appversie en wifi-naam;
- camera- en opslagkenmerken;
- maximaal drie lokaal verkleinde bewijsfoto's;
- compatibiliteitsmatrix;
- koppeling tussen droneprofiel en project;
- migratie van v0.2-projectgegevens naar schema 2;
- herstelkopie voor droneprofielen.

### Behouden

- stabiele v0.2.0-projectbasis;
- statische GitHub Pages-app;
- geen rechtstreekse camera-, locatie-, netwerk- of dronebesturingstoegang.

## [0.2.0] — 2026-08-28

### Toegevoegd

- lokale Project State met schema-versie;
- projecten maken, openen, wijzigen, dupliceren en verwijderen;
- projectnaam, locatie en beschrijving;
- actief project op het startscherm;
- automatisch bewaren en herstelkopie;
- veilige verwijderbevestiging;
- 12 nieuwe automatische project- en opslagcontroles.

### Behouden

- alle functies en veiligheidsgrenzen van v0.1.0;
- geen camera-, locatie- of droneverbinding;
- statische GitHub Pages-app zonder package-installatie.

## [0.1.0] — 2026-08-28

### Toegevoegd

- mobiele app-shell met vier basisweergaven;
- responsieve Android-interface;
- PWA-manifest en serviceworker;
- offline app-shell;
- online/offlinestatus;
- diagnostische toestel- en browserinformatie;
- kopieerbare diagnostiek;
- gecontroleerde update-indicatie;
- automatische build- en regressiecontroles;
- vaste GitHub-repository en GitHub Pages-link.

### Veiligheidsgrenzen

- geen dronebesturing;
- geen droneverbinding;
- geen camera- of locatietoestemming;
- nog geen project- of mediagegevens.
