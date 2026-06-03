<h1 align="center">🚨 Emergency Rescue Node Communication System</h1>

<p align="center">
  <strong>Offline LoRa Mesh Disaster Communication Platform</strong><br>
  <em>Enabling SOS communication when cellular networks and internet fail</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ESP32-LoRa%20V2-blue?style=for-the-badge&logo=espressif" />
  <img src="https://img.shields.io/badge/LoRa-SX1276-39AC4F?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frequency-433%20MHz-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-Supabase-3FCF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Status-Completed-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

<p align="center">
  <a href="#-about-the-project">About</a> •
  <a href="#-key-achievements">Achievements</a> •
  <a href="#%EF%B8%8F-system-architecture">Architecture</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-team">Team</a>
</p>

---

## 📖 About the Project

The **Emergency Rescue Node Communication System (ERNCS)** is an offline, decentralized disaster communication platform built using a 3-node **LoRa mesh network**. It enables disaster victims to send SOS alerts with their GPS location to rescue teams **without internet, cellular service, or any app installation**.

### 🌍 The Problem

During the **2025 Pakistan floods**, over **4,300 telecom towers** were destroyed within days, leaving millions of victims unable to communicate with rescue teams at the exact moment communication was most critical. Existing solutions like satellite phones are prohibitively expensive, and internet-based SOS apps fail when internet is down — exactly when they are needed most.

### 💡 The Solution

ERNCS provides a completely **offline communication infrastructure**:

- 📡 **3-Node LoRa Mesh** operating at 433 MHz with multi-hop routing
- 📱 **Browser-Based SOS Portal** — victim's phone connects to node Wi-Fi, browser opens captive portal SOS page
- 🗺️ **Phone GPS Capture** — coordinates extracted via Geolocation API (no GPS hardware needed)
- 🖥️ **Real-Time Dashboard** — Supabase PostgreSQL backend with WebSocket subscriptions
- 🔋 **11+ Hour Battery Life** — fully field-deployable on 3.7V LiPo

---

## 🎯 Key Achievements

| Metric | Result |
|--------|--------|
| Packet Delivery Rate | **97.3%** |
| End-to-End SOS Latency | **5.4 seconds** |
| Battery Runtime | **11.2 hours** (2000 mAh LiPo) |
| Phone GPS Accuracy | **3.8 meters** (open sky) |
| Mesh Range | **800m – 1.2 km per hop** |
| SOS Submission Time | **34 seconds** (non-technical user) |

---

## 🏗️ System Architecture

```
[Victim Phone]
      ↓ Wi-Fi connection
[EmergencyNode 1] ──LoRa 433MHz──► [EmergencyNode 2] ──LoRa──► [EmergencyNode 3 - Gateway]
   (Rescue Node)                     (Relay Node)                       ↓
                                                              [Supabase PostgreSQL]
                                                                        ↓
                                                              [Rescue Dashboard]
```

### Hardware per Node:
- **LoRa ESP32 V2** — ESP32 + SX1276 + OLED + WiFi (all integrated)
- **3.7V LiPo Battery** — JST connector
- **TP4056 Module** — USB Type-C charging
- **433 MHz Antenna** — IPEX connector

---

## 🛠️ Tech Stack

**Embedded / Firmware**
- C/C++ (Arduino IDE)
- ESP32 Arduino Framework
- RadioLib (LoRa SX1276 driver)
- U8g2 (OLED display library)
- ESP32 WebServer

**Frontend / Captive Portal**
- HTML5 / CSS3 / JavaScript
- Browser Geolocation API
- Responsive mobile-first design

**Backend / Database**
- Supabase (PostgreSQL)
- Real-time WebSocket subscriptions
- REST APIs

**Mobile App**
- Android SDK
- Native HTTP client
- Local storage for emergency contacts

---

## 📂 Repository Structure

```
Emergency-Rescue-Node-Communication-System--FYP-/
│
├── Android-app/
│   └── SOS-Emergency-App-main/        # Android companion app (Java/Kotlin)
│
├── Doc/
│   ├── Final_Report.pdf               # Complete FYP report
│   ├── hardware-photos/               # Photos of nodes, hardware
│   ├── screenshots/                   # Captive portal, dashboard, app
│   └── architecture-diagrams/         # DFD, system architecture
│
├── Website/
│   └── emergency-rescue-node-communicati.../  # Rescue dashboard web app
│
├── firmware/
│   ├── EmergencyNode_1/               # Rescue node firmware
│   │   └── EmergencyNode_1.ino
│   ├── EmergencyNode_2/               # Relay node firmware
│   │   └── EmergencyNode_2.ino
│   └── EmergencyNode_3_Gateway/       # Gateway node firmware
│       └── EmergencyNode_3.ino
│
└── README.md
```

---

## ⚡ Quick Start

### Hardware Requirements
- 3× LoRa ESP32 V2 boards
- 3× 433 MHz LoRa antennas
- 3× 3.7V LiPo batteries (2000 mAh recommended)
- 3× TP4056 USB Type-C charging modules

### Software Setup

1. **Install Arduino IDE 2.x** and add ESP32 board support:
   ```
   File → Preferences → Additional Boards URL:
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```

2. **Install Required Libraries** (via Library Manager):
   - RadioLib by Jan Gromeš
   - U8g2 by Oliver Kraus

3. **Configure each node** by changing `MY_NODE_ID` in firmware:
   ```cpp
   #define MY_NODE_ID   1     // Set to 1, 2, or 3 per board
   #define GATEWAY_ID   3
   #define LORA_FREQ    433.0
   ```

4. **Flash firmware** to each board via USB

5. **Setup Supabase** project:
   - Create new project at supabase.com
   - Run `database/schema.sql` to create the `sos_alerts` table
   - Copy your URL and anon key

6. **Configure dashboard** with your Supabase credentials in `dashboard/script.js`

7. **Run dashboard** locally or deploy to Vercel/Netlify

---

## 📱 Usage

### For Disaster Victims:
1. Connect smartphone to Wi-Fi network "**EmergencyNode1**" (or 2, 3)
2. Browser automatically opens the SOS Emergency Help page
3. Enter your **Name** and **Emergency Contact Number**
4. Tap "**Send Emergency Alert**" — GPS captured automatically
5. Confirmation screen appears

### For Rescue Teams:
1. Open the Rescue Dashboard on any internet-connected device
2. New SOS alerts appear in real-time with victim location on map
3. Acknowledge alerts, assign rescue teams, track status

---

## 📊 Database Schema

The `sos_alerts` table in Supabase PostgreSQL:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated alert identifier |
| `name` | VARCHAR(50) | Victim's name |
| `emergency_number` | VARCHAR(20) | Contact phone number |
| `location` | TEXT | GPS coordinates (lat, lng) |
| `created_at` | TIMESTAMPTZ | Auto-set timestamp |

---


## 🚀 Future Work

- [ ] AES-128 packet encryption for SOS messages
- [ ] Solar PV charging for indefinite autonomous operation
- [ ] RSSI-based adaptive routing (CD-Mesh)
- [ ] Two-way communication (downlink from gateway to victims)
- [ ] Scaling to 10+ node deployments
- [ ] iOS version of the mobile application
- [ ] Live dashboard deployment to public hosting
- [ ] Integration with National Disaster Management Authority (NDMA) Pakistan

---

## 🌱 Sustainable Development Goals

This project contributes to:

- **SDG 3** — Good Health and Well-Being (faster rescue saves lives)
- **SDG 11** — Sustainable Cities and Communities (disaster resilience)
- **SDG 13** — Climate Action (response to climate-driven disasters)

---

## 👥 Team

| Role | Name |
|------|------|
| **Supervisor** | Engr. Usra Sami |
| **Team Member** | Muhammad Tayyab |
| **Team Member** | Muhammad Talha |
| **Team Member** | Samra Ali |

**Institution:** Bahria University, Karachi Campus
**Department:** Computer Engineering
**Session:** 2022–2026



---

## 📬 Contact

For questions, collaboration, or feedback:

- **Email:** Tayyabali9361@gmail.com
- **LinkedIn:** [linkedin.com/in/muhammad-tayyab-nasir](https://www.linkedin.com/in/muhammad-tayyab-nasir)

---

## 🙏 Acknowledgments

- **Engr. Usra Sami** — for her invaluable supervision and guidance throughout the project
- **Bahria University Karachi Campus** — for providing resources and lab facilities
- **Open-source community** — Heltec Automation, RadioLib developers, Supabase team
- **The 2025 Pakistan flood victims** — who inspired the urgency and purpose of this work

---

<p align="center">
  ⭐ If you found this project useful or interesting, please consider giving it a star!
</p>

<p align="center">
  <em>Built with ❤️ to save lives when networks fail.</em>
</p>

<p align="center">
  <a href="https://www.linkedin.com/in/muhammad-tayyab-nasir">
    <img src="https://img.shields.io/badge/Connect-LinkedIn-0077B5?style=for-the-badge&logo=linkedin" />
  </a>
  <a href="mailto:Tayyabali9361@gmail.com">
    <img src="https://img.shields.io/badge/Email-Tayyabali9361-D14836?style=for-the-badge&logo=gmail" />
  </a>
</p>
