# CrowdFlow OS | Mega-Event Hospitality & Crowd Orchestration Platform

![CrowdFlow OS Banner](https://raw.githubusercontent.com/Yogesh994501/CrowdFlow_OS_Orchestra/main/public/banner.png)

> **CrowdFlow OS** is an intelligent, connected decision-making command center and attendee mobility platform designed for high-density metropolitan events (e.g., Greater Mumbai Summit / World Expo). It connects hotel accommodation reserves, transit corridors, venue turnstiles, and live meteorological telemetry into a real-time predictive pressure engine.

---

## 🌟 Key Capabilities

### 1. Deterministic Multi-Sector Zone Pressure Engine
Computes real-time telemetry-weighted risk scores across **8 Greater Mumbai sectors** (Bandra-Kurla Complex, Dadar Transit Core, Andheri, Churchgate, Goregaon, Navi Mumbai, Thane, Virār):
$$\text{Pressure Score} = 0.30 \times \text{Occupancy} + 0.25 \times \text{Arrivals} + 0.20 \times \text{Transit} + 0.15 \times \text{Venue} + 0.10 \times \text{Weather}$$

- **Stable Buffer**: $0 - 49$ (Green)
- **Watch Alert**: $50 - 69$ (Amber)
- **High Attention**: $70 - 84$ (Orange)
- **Critical Action**: $85 - 100$ (Rose/Red)

### 2. Connected Decision Loop (Not Just a Dashboard)
- **Signal Ingestion**: Real-time integration with OpenStreetMap, Nominatim, Open-Meteo, and OSRM.
- **Explainable Diagnostics**: 5-point telemetry decomposition for each metropolitan sector.
- **One-Click Action Protocols**: Dispatch electric buffer shuttles, dynamic room diversions, and crowd bypasses.
- **Synchronized Attendee Routing**: Live recalculation of attendee guidance, vouchers, and transit alerts.

### 3. Purpose-Driven Modern Glassmorphic Design System
- **Deep Navy Atmospheric Horizon**: Subtle 3D perspective grid evoking the Mumbai coastal transit infrastructure.
- **Scenario-Reactive Environmental Trails**: Telemetry data streams that adapt color palette based on active scenario (*Clear Operations*, *Monsoon Storm*, *Hotel Saturation*, *Metro Disruption*).
- **Frosted Glassmorphism**: High-translucency elevation system with backdrop blur, saturated refractions, and specular highlights.

### 4. 100% Free & Open-Data Policy
CrowdFlow OS runs strictly on public, free open-data services with zero paid API keys or freemium dependencies:
- **OpenStreetMap (OSM)**: Cartography & boundaries via free standard tile servers.
- **Overpass API**: Sector POIs and geographic node extraction.
- **Nominatim**: Public geocoding with strict compliance and user-agent rate limiting.
- **Open-Meteo**: Weather condition and precipitation risk without API keys.
- **OSRM (Open Source Routing Machine)**: Public demo routing instance with built-in memory caching.
- **GTFS Simulator**: Realistic suburban railway and arterial transit headway streams.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/Yogesh994501/CrowdFlow_OS_Orchestra.git
cd CrowdFlow_OS_Orchestra

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Building for Production

```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment

### GitHub Pages (Automatic via GitHub Actions)
This repository includes an automated workflow at `.github/workflows/deploy.yml`. Whenever changes are pushed to `main`:
1. GitHub Actions triggers `build` and `deploy-pages`.
2. The application is hosted automatically at:
   `https://yogesh994501.github.io/CrowdFlow_OS_Orchestra/`

> **Note**: In your repository settings under **Settings > Pages**, set **Source** to **GitHub Actions**.

### Vercel / Netlify
Because `vite.config.ts` uses universal relative base paths (`base: './'`), the project can also be deployed to Vercel or Netlify with zero configuration:
- Build command: `npm run build`
- Output directory: `dist`

---

## 📱 Role-Based Exploration

Use the top navigation **Role Switcher** to experience CrowdFlow OS from different perspectives:
- **City Authority / Event Director**: High-level macro system health, pressure gauges, and strategic intervention authorizations.
- **Transit & Shuttle Dispatcher**: Real-time corridor loads, headway adjustments, and emergency electric coach deployment.
- **Hospitality & Hotelier Hub**: Overflow buffer beds, occupancy saturation monitoring, and attendee diversion vouchers.
- **Live Attendee Companion**: Mobile-optimized journey planner, crowd-aware routing, digital passes, and gate queue advisories.

---

## 📄 License
MIT License. Built for metropolitan mega-event coordination.
