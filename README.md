# 🧮 Rekenmaatje - Interactieve Rekenapp voor Basisschool

> **Een leuke en interactieve manier voor leerlingen om te oefenen met rekenen op basisschoolniveau**

Een moderne web applicatie die leerlingen van groep 6, 7 en 8 helpt bij het oefenen van rekenvaardigheiten. Met verschillende moeilijkheidsgraden, spelmodussen en directe feedback.

## ✨ Functies

### 🎯 **Rekensoorten**
- ➕ **Optellen** - Van eenvoudige sommen tot grotere getallen
- ➖ **Aftrekken** - Met verschillende moeilijkheidsgraden
- ✖️ **Vermenigvuldigen** - Tafels en complexere berekeningen
- ➗ **Delen** - Staartdelingen en eenvoudige deling
- 🍰 **Breuken** - Omzetten naar decimalen
- 🔢 **Kommagetallen** - Rekenen met decimalen

### 🎮 **Spelmodussen**
- 🎯 **Oefenmodus** - Rustig oefenen zonder tijdsdruk
- 📝 **Quiz** - Gestructureerd oefenen
- ⏱️ **Uitdaging** - 30 seconden per som voor extra spanning

### 📊 **Voortgang Bijhouden**
- ✅ Aantal goede antwoorden
- ❌ Aantal foute antwoorden
- 🔥 Huidige serie correct
- 📈 Totaal percentage

### 🎨 **Gebruiksvriendelijk**
- 📱 Responsive design voor alle apparaten
- 🎨 Kleurrijke en aantrekkelijke interface
- 💬 Positieve feedback en aanmoediging
- 📖 Uitleg bij foute antwoorden

## 🚀 Snel Starten

### Lokaal Draaien
```bash
# Clone het project
git clone <repository-url>
cd rekenmaatje

# Installeer dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Productie Build
```bash
# Build voor productie
npm run build

# Start productie server
npm start
```

## 🎓 Voor Wie is Dit?

### 👨‍🏫 **Voor Docenten**
- 📚 Ondersteunt het curriculum van groep 6, 7 en 8
- 📊 Inzicht in voortgang van leerlingen
- 🎯 Verschillende moeilijkheidsgraden per onderwerp
- 💡 Automatische uitleg bij foute antwoorden

### 👩‍🎓 **Voor Leerlingen**
- 🎮 Gamification maakt oefenen leuk
- 🏆 Beloningssysteem met series en scores
- 📱 Werkt op tablet, computer en telefoon
- 🔄 Onbeperkt oefenen met nieuwe sommen

### 👨‍👩‍👧‍👦 **Voor Ouders**
- 🏠 Thuis oefenen wordt makkelijk en leuk
- 📈 Zichtbare voortgang van je kind
- 🎯 Gerichte oefening op zwakke punten
- ✅ Veilig en reclamevrij

## 🛠️ Technische Details

### 📦 **Tech Stack**
- ⚛️ **Next.js 15** - React framework
- 🎨 **Tailwind CSS** - Styling
- 📝 **TypeScript** - Type safety
- 📱 **Responsive Design** - Werkt overal

### 🏗️ **Project Structuur**
```
src/
├── app/
│   ├── layout.tsx          # App layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
└── components/
    └── MathLearningApp.tsx # Hoofdcomponent
```

### 🎯 **Moeilijkheidsgraden**

| Niveau | Optellen | Aftrekken | Vermenigvuldigen | Delen |
|--------|----------|-----------|------------------|-------|
| **Makkelijk** | 1-20 | 1-20 | 1-10 × 1-10 | Eenvoudige deling |
| **Gemiddeld** | 10-100 | 10-100 | 1-12 × 1-15 | Tafels tot 12 |
| **Moeilijk** | 50-500 | 50-500 | 1-25 × 1-20 | Complexere deling |

## 🎮 Hoe Te Gebruiken

### 1️⃣ **Kies Je Instellingen**
- Selecteer spelmodus (oefenen, quiz, of uitdaging)
- Kies rekensoort (of gemengd voor variatie)
- Stel moeilijkheidsgraad in

### 2️⃣ **Los Sommen Op**
- Typ je antwoord in het invoerveld
- Druk op Enter of klik "Controleren"
- Krijg direct feedback

### 3️⃣ **Leer Van Fouten**
- Bij een fout antwoord, klik op "Toon uitleg"
- Lees de stap-voor-stap uitleg
- Probeer de volgende som

### 4️⃣ **Volg Je Voortgang**
- Zie je score en serie in real-time
- Probeer je persoonlijke record te verbeteren
- Reset statistieken om opnieuw te beginnen

## 🎨 Aanpassingen

### 🎯 **Nieuwe Rekensoorten Toevoegen**
```typescript
// In MathLearningApp.tsx
const generateNewType = (id: string, difficulty: string): MathProblem => {
  // Implementeer nieuwe rekensoort
  return {
    id,
    question: "Nieuwe som",
    answer: 42,
    type: 'newtype',
    difficulty,
    explanation: "Uitleg van de som"
  }
}
```

### 🎨 **Styling Aanpassen**
```css
/* In globals.css of component */
.custom-button {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}
```

## 📚 Educatieve Doelen

### 🎯 **Leerdoelen Groep 6**
- ✅ Optellen en aftrekken tot 1000
- ✅ Tafels van 1 t/m 10
- ✅ Delen door getallen uit de tafels
- ✅ Eenvoudige breuken

### 🎯 **Leerdoelen Groep 7**
- ✅ Rekenen met grotere getallen
- ✅ Tafels tot 12
- ✅ Kommagetallen optellen en aftrekken
- ✅ Breuken omzetten naar decimalen

### 🎯 **Leerdoelen Groep 8**
- ✅ Complexe berekeningen
- ✅ Alle tafels vloeiend
- ✅ Rekenen met kommagetallen
- ✅ Procenten en verhoudingen

## 🤝 Bijdragen

### 🐛 **Bug Reports**
Vond je een fout? Maak een issue aan met:
- 📝 Beschrijving van het probleem
- 🔄 Stappen om te reproduceren
- 📱 Browser en apparaat informatie

### 💡 **Feature Requests**
Heb je een idee? We horen graag:
- 🎯 Welke functie je wilt
- 👥 Voor wie het nuttig zou zijn
- 📚 Hoe het het leren zou verbeteren

## 📄 Licentie

Dit project is gemaakt voor educatieve doeleinden. Vrij te gebruiken voor scholen en thuisonderwijs.

## 👨‍💻 Gemaakt Door

**Tom Naberink** - Gepassioneerd over onderwijs en technologie

---

## 🎉 **Klaar om te Beginnen?**

Start de app en help leerlingen hun rekenvaardigheden te verbeteren op een leuke en interactieve manier!

**🧮 Veel rekenplezier! 🎯**

---

*Versie 1.0 - Rekenmaatje voor Basisschool*  
*Last updated: December 2024*