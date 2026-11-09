# Office VR Digital Twin (3D Virtual Workspace)

A customized, immersive WebVR/WebXR digital twin application modeled directly after your real office walkthrough video (`1793953520916_2087173265260365371_5791890832961969580.mp4`).

Built with **HTML5**, **A-Frame 1.6.0**, and standard **WebXR**. Runs smoothly on desktop, mobile, and VR headsets (Meta Quest, Apple Vision Pro, PCVR).

---

## 🏢 Office Recreation Details

The 3D environment faithfully replicates the office layout and key architectural elements from your video:

1. **Central Meeting & Collaboration Table**:
   - Long light-wood conference table with 6 blue ergonomic conference chairs.
   - White ceramic centerpiece vase with dried pampas floral arrangement.
   - Open MacBook laptop, coffee mugs, and water carafe.
2. **Lead Developer Workstation (Foreground)**:
   - Desk with dual monitors on an articulated monitor arm (one horizontal, one tilted).
   - Clickable screens that toggle between **VS Code IDE**, **Live IoT Dashboard**, and **Office Archive Photo**.
   - Laptop stand, keyboard, and ergonomic office swivel chair.
3. **Pantry & Break Station (West Wall)**:
   - Silver two-door refrigerator.
   - Microwave oven perched right on top of the fridge (click to hear heating hum, interior light, and finish *ding!*).
   - Wooden credenza with electric kettle and coffee mugs.
   - Tall storage bookcases filled with colorful binders and manuals.
4. **Supervisor & Admin Station (North Wall)**:
   - Supervisor desk with PC workstation.
   - **Authentic Vietnam Miniature Desk Flag** on chrome stand.
   - Large magnetic sprint whiteboard with project roadmap & sticky notes.
   - Office multifunction laser copier/printer.
5. **Window Garden & ZZ Plant (East Wall)**:
   - Large white ceramic floor planter with lush green ZZ plant (*Zamioculcas zamiifolia*).
   - Office windows with natural daylight skyline, tree canopy, and vertical blinds.
   - Glass privacy partitions.
6. **Interactive Wall-Mounted Oscillating Fans**:
   - Dual wall fans on East and West walls with aerodynamic rotating 3-blade propellers inside wire cages.
   - Click either fan to start/stop spinning with authentic spatial sound!
7. **Original Office Tour Media Theater**:
   - 65" conference display screen embedded right on the office wall playing your actual video (`office-tour.mp4`).
   - 3D spatial media buttons: **Play/Pause**, **Audio On/Off**, and **Replay**.
8. **Atmosphere & Lighting Switcher**:
   - ☀️ **Daylight**: Crisp office lighting with soft sunbeams filtering through blinds.
   - 🌅 **Golden Hour / Sunset**: Warm sunset glow, amber sun rays, cozy twilight work mood.
   - 🌙 **Night Shift**: Dimmed fluorescent lighting, glowing blue monitor screens, focused overtime atmosphere.
9. **Interactive Mini-Map Floor Plan**:
   - 2D HUD floor plan in the bottom-right corner showing real-time player location and quick teleport shortcuts.

---

## 🚀 Quick Start

WebXR security standards require a local HTTP server (`http://localhost` or `https://`):

### Option 1: Python HTTP Server (Recommended)
Open Terminal in this directory and run:

```bash
python3 -m http.server 8000
```
Then visit:
👉 **[http://localhost:8000](http://localhost:8000)**

### Option 2: Node.js Serve
```bash
npx serve .
```

---

## 🎮 Navigation & Controls

| Platform | Controls | Action |
| :--- | :--- | :--- |
| **Desktop** | **WASD** / Arrow Keys | Walk around the office |
| **Desktop** | Mouse Click & Drag | Look around 360° |
| **Desktop / VR** | Left Click / Trigger | Interact with fans, microwave, monitors, and media TV |
| **Mobile** | Gyroscope / Swipe | Look around 360° |
| **Mobile** | Tap Screen | Teleport via floor rings or trigger props |
| **VR Headset** | Thumbstick | Smooth locomotion or snap turn |
| **VR Headset** | Controller Trigger / Laser | Teleport or click objects |
| **VR Headset** | Hand Tracking | Pinch gesture to select or click |

---

## 🥽 Testing on VR Headsets

1. **Meta Quest (Quest 2 / 3 / 3S / Pro)**:
   - Ensure your Quest and computer are connected to the same local Wi-Fi.
   - Find your Mac's IP address (e.g. `ipconfig getifaddr en0`).
   - Inside Meta Quest, open the **Meta Quest Browser**.
   - Navigate to `http://<YOUR-IP>:8000`.
   - Click the **"Enter VR"** button in the lower-right corner to step directly into your office!
2. **Apple Vision Pro**:
   - In visionOS Safari, open `http://<YOUR-IP>:8000`.
   - Tap **"Enter VR"** to launch spatial immersion.
3. **PCVR (SteamVR / Oculus Link)**:
   - Connect your headset to your PC via Link or AirLink.
   - Open [http://localhost:8000](http://localhost:8000) in Chrome, Edge, or Brave.
   - Click the **"Enter VR"** button.

---

## 📁 Project Structure

```text
├── index.html               # 3D Office Scene architecture & A-Frame setup
├── style.css                # Glassmorphic HUD, mini-map, and toast notifications
├── app.js                   # Web Audio HRTF synthesizer, lighting manager & interactions
├── generate_textures.py     # Python procedural texture generator (tiles, wood, screens)
├── office-tour.mp4          # Symlink to your original office video
├── assets/                  # Generated crisp PBR-ready texture maps
│   ├── floor-tiles.png      # Off-white ceramic floor tiles with grout
│   ├── ceiling-tiles.png    # Suspended acoustic ceiling grid
│   ├── wood-desk.png        # Birch/oak desk surface
│   ├── whiteboard.png       # Office sprint task board
│   ├── screen-code.png      # VS Code dark IDE display
│   ├── screen-dash.png      # Office IoT & acoustic dashboard
│   ├── vietnam-flag.png     # Vietnamese national desk flag
│   ├── wall-clock.png       # Minimalist wall clock dial
│   ├── window-view.png      # Outdoor skyline and tree foliage
│   ├── window-blinds.png    # Vertical blinds texture
│   └── office-snapshot.png  # High-res capture from your office video
└── README.md                # Documentation & quick start guide
```
