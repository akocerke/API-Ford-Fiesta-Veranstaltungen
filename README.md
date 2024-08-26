# API-Ford-Fiesta-Veranstaltungen

API-Eine spezialisierte Plattform für Besitzer und Enthusiasten des Ford Fiesta (Modelljahr 11/2001–08/2008)

## Verzeichnisstruktur

Hier ist eine Übersicht der Verzeichnisstruktur für das Projekt:

```
API-FORD-FIESTA-VERANSTALTUNGEN/
├── database/
│   ├── models/
│   │   ├── Comment.js
│   │   ├── Event.js
│   │   ├── Rating.js
│   │   ├── User.js
│   │   └── Violation.js
│   └── setup/
│       └── database.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── comments/
│   │   └── index.js
│   ├── events/
│   │   └── index.js
│   ├── ratings/
│   │   └── index.js
│   ├── users/
│   │   └── index.js
│   └── violations/
│       └── index.js
├── services/
│   ├── auth/
│   │   └── AccessToken.js
│   └── logger.js
├── swagger/
│   └── swaggerConfig.js
├── .env
├── index.js
└── package.json
```


## API-Dokumentation mit Swagger

Die API-Dokumentation wird über Swagger bereitgestellt. Swagger bietet eine benutzerfreundliche Oberfläche, um die Endpunkte deiner API zu erkunden und zu testen.

### Swagger-UI

Die Swagger-Dokumentation ist unter folgender URL verfügbar:

```
http://localhost:5050/api-docs
```

In Swagger-UI findest du:

- **Eine Übersicht über alle verfügbaren Endpunkte**: Sieh dir die einzelnen API-Routen, deren Methoden (GET, POST, PUT, DELETE, etc.) und die zugehörigen Parameter an.
- **Interaktive Tests**: Du kannst direkt aus der Swagger-Oberfläche heraus Anfragen an die API senden, um zu sehen, wie die API auf verschiedene Eingaben reagiert.
- **Antworten und Fehlerbehandlung**: Erhalte Informationen über mögliche Antworten und Fehlercodes, die von der API zurückgegeben werden.

### Zugriff auf Swagger-UI

1. **Starte den Server**: Stelle sicher, dass der Server läuft. Du kannst den Server mit folgendem Befehl starten:

   ```bash
   npm run dev
   ```

2. **Öffne Swagger-UI**: Gehe zu `http://localhost:5050/api-docs` in deinem Webbrowser.

3. **Erkunde die API**: Nutze die Swagger-Oberfläche, um die API-Dokumentation zu durchsuchen und die API-Endpunkte zu testen.

### Beispiel-URL für Swagger-Dokumentation

Um die API-Dokumentation zu öffnen, besuche:

```
http://localhost:5050/api-docs
```

![swagger-ui](image-1.png)
