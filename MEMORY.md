# Projektgedächtnis

- Der Vokabeltrainer ist eine statische Web-App ohne Build-System. Hauptlogik liegt in `app.js`, die Oberfläche in `style.css`, Wortdaten in `vokabeln.js`; Profile und Listen werden lokal im Browser gespeichert.
- Die Vorschau läuft aktuell über `index.html` im integrierten Browser. Automatisches Live-Reload ist nicht eingerichtet.
- Der Quizbildschirm zeigt „Weiter“ direkt unter der Vokabelkarte und die Erfolgs-/Fehlermeldung unter den Antwortoptionen.
- Eigene Listen können aus einem Schulbuchfoto erstellt werden. Tesseract.js 5.1.1 wird bei Bedarf aus jsDelivr geladen; OCR und Fotoverarbeitung laufen im Browser, das Foto wird nicht hochgeladen. Die erkannten Paare werden als Englisch-links/Deutsch-rechts interpretiert und müssen vor dem Speichern geprüft werden.
- Der Lernfortschritt zählt ein Wort ab Fach 3 als gelernt (in der Regel nach drei richtigen Antworten); das wurde als gewünschtes Verhalten bestätigt.
- Für Foto-OCR wurde im Browser mit einem synthetischen Zweispaltenbild getestet: `cat ; die Katze` und `dog ; der Hund` wurden korrekt erkannt. Ein automatisierter Test-Runner ist im Repository nicht vorhanden.
