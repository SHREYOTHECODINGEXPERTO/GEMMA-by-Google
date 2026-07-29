# Build with Gemma - GDG TIU Buildathon RSVP Portal

A premium, fully interactive RSVP registration portal for the **Build with Gemma GDG TIU Buildathon** hackathon at Techno India University, West Bengal. This project features high-fidelity Google AI and Gemini styling, glassmorphism design, real-time countdowns, and dynamic badge ticket generation.

## 🚀 Features

*   **Premium Visual Branding**: Designed with Google and Gemini-themed dark color schemes, glowing borders, custom vector branding, and interactive canvas backgrounds.
*   **Canvas Particle Background**: A dynamic star-constellation network rendered on HTML5 canvas representing AI neural links.
*   **Live Event Countdown**: Shows the days, hours, minutes, and seconds remaining until the starting time (July 31, 2026, at 2:00 PM IST).
*   **Responsive Information Grid**: Detailed sections highlighting the 30-hour timeline, stages, important guidelines, perks/swags, and instructions.
*   **Intelligent RSVP Form**: Validates inputs, handles custom college entries, and stores details securely on the browser.
*   **Dynamic Ticket Pass Generator**: Generates an interactive, holographic conference badge with a unique ID and a live-rendered QR code encoding participant metadata. Includes utilities to **Download Pass (PNG)** or **Print Pass**.
*   **Administrative RSVP Dashboard**: A slide-out panel that tracks local registrations, displays total and skill statistics, and allows searching and deleting records.

## 🛠️ Technology Stack

*   **Structure**: HTML5 (Semantic Elements)
*   **Styling**: Custom CSS3 (Flexbox, Grid, Variables, Keyframe Animations, Glassmorphic overlays)
*   **Logic**: Pure Vanilla JavaScript (ES6)
*   **Libraries**:
    *   [QRious JS](https://github.com/neocotic/qrious) (Client-side QR Canvas engine)
    *   [Html2Canvas](https://github.com/niklasvh/html2canvas) (PNG badge renderer)
    *   [FontAwesome 6](https://fontawesome.com/) (Vector icon libraries)
    *   [Google Fonts](https://fonts.google.com/) (Outfit and Plus Jakarta Sans typefaces)

## 📦 File Structure

```
├── index.html   # Main layout, forms, structures, and third-party library imports
├── style.css    # Core stylesheets, animations, variables, and responsive design
└── app.js       # Star network script, countdown logic, local storage sync, and ticket builder
```

## 💻 How to Run Locally

1. Clone this repository or download the source files.
2. Double-click `index.html` to open the portal in any modern web browser (e.g., Chrome, Edge, Safari, Firefox).
3. Fill out the registration form to instantly generate and test the dynamic badge pass downloader.
