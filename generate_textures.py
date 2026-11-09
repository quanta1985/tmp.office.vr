#!/usr/bin/env python3
"""
Generate realistic textures for the Office WebVR application.
Creates tile, ceiling, wood, screen, and accessory textures matching the office video.
"""
import os
import math
import random
from PIL import Image, ImageDraw, ImageFont

os.makedirs('assets', exist_ok=True)

def create_floor_texture():
    size = 1024
    img = Image.new('RGB', (size, size), '#f5f2eb')
    draw = ImageDraw.Draw(img)

    # Base subtle noise/mottling for porcelain ceramic look
    random.seed(42)
    pixels = img.load()
    for y in range(size):
        for x in range(size):
            val = random.randint(-4, 4)
            r = max(0, min(255, 245 + val))
            g = max(0, min(255, 242 + val))
            b = max(0, min(255, 235 + val))
            pixels[x, y] = (r, g, b)

    # Draw 4 tiles with grout lines (grid 2x2)
    grout_color = (195, 190, 180)
    grout_w = 4
    half = size // 2

    # Borders
    for w in range(grout_w):
        draw.line([(0, w), (size, w)], fill=grout_color)
        draw.line([(0, size - 1 - w), (size, size - 1 - w)], fill=grout_color)
        draw.line([(w, 0), (w, size)], fill=grout_color)
        draw.line([(size - 1 - w, 0), (size - 1 - w, size)], fill=grout_color)
        # Center grid lines
        draw.line([(0, half - grout_w // 2 + w), (size, half - grout_w // 2 + w)], fill=grout_color)
        draw.line([(half - grout_w // 2 + w, 0), (half - grout_w // 2 + w, size)], fill=grout_color)

    img.save('assets/floor-tiles.png')
    print('Created assets/floor-tiles.png')

def create_ceiling_texture():
    size = 512
    img = Image.new('RGB', (size, size), '#eef0ed')
    draw = ImageDraw.Draw(img)

    # Draw acoustic tile speckles
    random.seed(123)
    for _ in range(8000):
        x = random.randint(0, size - 1)
        y = random.randint(0, size - 1)
        gray = random.randint(185, 220)
        draw.point((x, y), fill=(gray, gray, gray))

    # T-bar metal grid border
    tbar = (180, 185, 180)
    for i in range(3):
        draw.line([(0, i), (size, i)], fill=tbar)
        draw.line([(0, size - 1 - i), (size, size - 1 - i)], fill=tbar)
        draw.line([(i, 0), (i, size)], fill=tbar)
        draw.line([(size - 1 - i, 0), (size - 1 - i, size)], fill=tbar)

    img.save('assets/ceiling-tiles.png')
    print('Created assets/ceiling-tiles.png')

def create_wood_texture():
    w, h = 1024, 512
    img = Image.new('RGB', (w, h), '#e4cca8')
    draw = ImageDraw.Draw(img)

    # Wood grain lines
    random.seed(99)
    for y in range(0, h, 2):
        shade = random.randint(-12, 12)
        base_r = max(0, min(255, 228 + shade))
        base_g = max(0, min(255, 204 + shade))
        base_b = max(0, min(255, 168 + shade))
        draw.line([(0, y), (w, y)], fill=(base_r, base_g, base_b))

    # Long subtle grain waves
    for _ in range(40):
        y0 = random.randint(0, h)
        grain_r = random.randint(190, 215)
        grain_g = random.randint(170, 190)
        grain_b = random.randint(140, 160)
        points = []
        for x in range(0, w, 20):
            cur_y = y0 + int(math.sin(x * 0.015) * 8) + random.randint(-2, 2)
            points.append((x, cur_y))
        draw.line(points, fill=(grain_r, grain_g, grain_b), width=random.randint(1, 3))

    img.save('assets/wood-desk.png')
    print('Created assets/wood-desk.png')

def create_whiteboard_texture():
    w, h = 1024, 512
    img = Image.new('RGB', (w, h), '#ffffff')
    draw = ImageDraw.Draw(img)

    # Aluminum frame
    frame = (160, 165, 170)
    for i in range(12):
        draw.rectangle([i, i, w - 1 - i, h - 1 - i], outline=frame)

    # Header
    draw.rectangle([20, 20, w - 20, 60], fill='#f0f4f8')
    draw.text((35, 28), "OFFICE SPRINT BOARD  -  VR DIGITAL TWIN", fill='#1e293b')

    # Columns
    cols = [
        ("TO DO", 30, '#f8fafc'),
        ("IN PROGRESS", 355, '#f0fdf4'),
        ("DONE / LIVE", 680, '#eff6ff')
    ]

    for title, col_x, bg_col in cols:
        draw.rectangle([col_x, 75, col_x + 310, 480], fill=bg_col, outline='#cbd5e1', width=2)
        draw.text((col_x + 15, 85), title, fill='#334155')

    # Sticky Notes
    notes = [
        (45, 120, '#fef08a', "Record 360 Video Tour\n(Completed with phone)"),
        (45, 230, '#fbcfe8', "Review office furniture:\n- Central meeting table\n- Fridge & microwave\n- Workstation monitors"),
        (45, 340, '#fed7aa', "Map dual-monitor dev desk\nwith code terminal"),
        (370, 120, '#bae6fd', "Assemble WebXR Scene:\n- A-Frame 1.6.0\n- HRTF 3D Spatial Audio\n- 6DoF Laser Pointers"),
        (370, 240, '#bbf7d0', "Interactive Props:\n- Clickable wall fan\n- Day / Sunset / Night mode\n- Media Tour TV"),
        (695, 120, '#a7f3d0', "VR Office Architecture:\n- Real tile dimensions\n- Suspended acoustic grid\n- Custom waypoints"),
        (695, 230, '#ddd6fe', "Vietnam Desk Flag model\n& office plant (ZZ plant)"),
        (695, 340, '#fed7aa', "Ready for Quest, PCVR,\nApple Vision Pro & Web!")
    ]

    for nx, ny, color, text in notes:
        draw.rectangle([nx, ny, nx + 280, ny + 95], fill=color, outline='#94a3b8', width=1)
        draw.text((nx + 10, ny + 10), text, fill='#0f172a')

    img.save('assets/whiteboard.png')
    print('Created assets/whiteboard.png')

def create_code_screen():
    w, h = 1024, 640
    img = Image.new('RGB', (w, h), '#1e1e1e')
    draw = ImageDraw.Draw(img)

    # Top tab bar
    draw.rectangle([0, 0, w, 40], fill='#252526')
    draw.rectangle([0, 0, 180, 40], fill='#1e1e1e')
    draw.text((20, 12), "OfficeVR.js  *", fill='#ffffff')
    draw.rectangle([181, 0, 360, 40], fill='#2d2d2d')
    draw.text((200, 12), "spatial-audio.js", fill='#969696')
    draw.rectangle([361, 0, 520, 40], fill='#2d2d2d')
    draw.text((380, 12), "environment.css", fill='#969696')

    # Line numbers and code
    code_lines = [
        ("import { SpatialAudio } from './audio.js';", '#4ec9b0', '#c586c0'),
        ("import { TeleportManager } from './teleport.js';", '#4ec9b0', '#c586c0'),
        ("", '#ffffff', '#ffffff'),
        ("export class VirtualOfficeEnvironment {", '#569cd6', '#4ec9b0'),
        ("  constructor(scene) {", '#569cd6', '#dcdcaa'),
        ("    this.scene = scene;", '#9cdcfe', '#ffffff'),
        ("    this.dimensions = { width: 7.6, depth: 10.4, height: 2.9 };", '#9cdcfe', '#b5cea8'),
        ("    this.activeMode = 'Daylight';", '#9cdcfe', '#ce9178'),
        ("    this.videoScreen = document.querySelector('#office-video');", '#9cdcfe', '#ce9178'),
        ("  }", '#ffffff', '#ffffff'),
        ("", '#ffffff', '#ffffff'),
        ("  initSensorsAndFans() {", '#569cd6', '#dcdcaa'),
        ("    this.wallFan = new OscillatingFan({ speed: 45, sound: true });", '#9cdcfe', '#4ec9b0'),
        ("    this.audioPanner = new SpatialAudio({ hrtf: true });", '#9cdcfe', '#4ec9b0'),
        ("    console.log('Office VR Digital Twin Initialized at 60 FPS');", '#dcdcaa', '#ce9178'),
        ("  }", '#ffffff', '#ffffff'),
        ("", '#ffffff', '#ffffff'),
        ("  onUserTeleport(waypoint) {", '#569cd6', '#dcdcaa'),
        ("    this.player.smoothTransition(waypoint.position, 600);", '#9cdcfe', '#b5cea8'),
        ("    this.audioPanner.playSpatialPing(waypoint.position);", '#9cdcfe', '#dcdcaa'),
        ("  }", '#ffffff', '#ffffff'),
        ("}", '#569cd6', '#ffffff'),
    ]

    for idx, (line, col1, col2) in enumerate(code_lines):
        y = 55 + idx * 24
        # Line number
        draw.text((15, y), f"{idx + 1:2d}", fill='#5a5a5a')
        # Code text
        draw.text((60, y), line, fill=col1)

    img.save('assets/screen-code.png')
    print('Created assets/screen-code.png')

def create_dashboard_screen():
    w, h = 1024, 640
    img = Image.new('RGB', (w, h), '#0b132b')
    draw = ImageDraw.Draw(img)

    # Header
    draw.rectangle([0, 0, w, 60], fill='#1c2541')
    draw.text((30, 20), "OFFICE OPERATIONS & ENVIRONMENT TELEMETRY", fill='#6fffe9')
    draw.text((w - 220, 20), "STATUS: LIVE  [REC] 60 FPS", fill='#5bc0be')

    # 4 Metric Cards
    cards = [
        ("INDOOR TEMP", "23.4 °C", "AC Set: 24°C Auto", 30, 80, 220),
        ("AIR HUMIDITY", "48 %", "Optimal Comfort", 270, 80, 220),
        ("DEV STATIONS", "6 Online", "2 Dual-Screen Active", 510, 80, 220),
        ("WEBXR CLIENTS", "1 Active", "Oculus Quest / PCVR", 750, 80, 240)
    ]

    for title, val, sub, cx, cy, cw in cards:
        draw.rectangle([cx, cy, cx + cw, cy + 120], fill='#1c2541', outline='#3a506b', width=2)
        draw.text((cx + 15, cy + 15), title, fill='#8d99ae')
        draw.text((cx + 15, cy + 45), val, fill='#ffffff')
        draw.text((cx + 15, cy + 90), sub, fill='#5bc0be')

    # Main Chart Panel (CPU & Audio Frequency spectrum)
    draw.rectangle([30, 230, w - 30, 600], fill='#1c2541', outline='#3a506b', width=2)
    draw.text((50, 250), "REAL-TIME ACOUSTIC & AMBIENT SIGNAL FREQUENCY", fill='#6fffe9')

    # Graph Grid
    for gy in range(290, 580, 50):
        draw.line([(60, gy), (w - 60, gy)], fill='#25324d')

    # Sine waves / spectrum bars
    points = []
    for gx in range(60, w - 60, 15):
        h_val = 430 + int(math.sin(gx * 0.03) * 60 + math.cos(gx * 0.08) * 35)
        points.append((gx, h_val))
        # Draw bar
        draw.line([(gx, 570), (gx, h_val)], fill='#3a86ff', width=6)

    draw.line(points, fill='#6fffe9', width=3)

    img.save('assets/screen-dash.png')
    print('Created assets/screen-dash.png')

def create_vietnam_flag():
    w, h = 600, 400
    img = Image.new('RGB', (w, h), '#da251d')
    draw = ImageDraw.Draw(img)

    # 5-pointed star in the center
    cx, cy = w // 2, h // 2
    r_outer = 120
    r_inner = r_outer * (math.sin(math.pi / 10) / math.sin(7 * math.pi / 10))

    points = []
    # 5 peaks, starting top (angle = -pi/2)
    for i in range(10):
        angle = -math.pi / 2 + i * (math.pi / 5)
        r = r_outer if i % 2 == 0 else r_inner
        px = cx + r * math.cos(angle)
        py = cy + r * math.sin(angle)
        points.append((px, py))

    draw.polygon(points, fill='#ffff00')
    img.save('assets/vietnam-flag.png')
    print('Created assets/vietnam-flag.png')

def create_wall_clock():
    size = 512
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = size // 2, size // 2
    r = size // 2 - 10

    # Outer Bezel
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill='#1e293b', outline='#94a3b8', width=8)
    draw.ellipse([cx - r + 16, cy - r + 16, cx + r - 16, cy + r - 16], fill='#ffffff')

    # Hour tick marks
    for h_tick in range(12):
        angle = h_tick * (math.pi / 6)
        x1 = cx + (r - 26) * math.sin(angle)
        y1 = cy - (r - 26) * math.cos(angle)
        x2 = cx + (r - 46) * math.sin(angle)
        y2 = cy - (r - 46) * math.cos(angle)
        draw.line([(x1, y1), (x2, y2)], fill='#0f172a', width=6)

    # Hour hand (at ~3:15)
    angle_h = (3.25 / 12) * 2 * math.pi
    hx = cx + (r * 0.5) * math.sin(angle_h)
    hy = cy - (r * 0.5) * math.cos(angle_h)
    draw.line([(cx, cy), (hx, hy)], fill='#0f172a', width=8)

    # Minute hand
    angle_m = (15 / 60) * 2 * math.pi
    mx = cx + (r * 0.72) * math.sin(angle_m)
    my = cy - (r * 0.72) * math.cos(angle_m)
    draw.line([(cx, cy), (mx, my)], fill='#0f172a', width=5)

    # Center pin
    draw.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], fill='#dc2626')

    img.save('assets/wall-clock.png')
    print('Created assets/wall-clock.png')

def create_window_skyline():
    w, h = 1024, 512
    img = Image.new('RGB', (w, h), '#87ceeb')
    draw = ImageDraw.Draw(img)

    # Sky gradient from azure down to light warm horizon
    for y in range(h):
        t = y / h
        r = int(135 * (1 - t) + 225 * t)
        g = int(206 * (1 - t) + 235 * t)
        b = int(235 * (1 - t) + 245 * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Tree foliage silhouettes outside the window
    random.seed(77)
    for _ in range(60):
        tx = random.randint(0, w)
        ty = random.randint(280, h + 20)
        trad = random.randint(50, 130)
        green_r = random.randint(34, 70)
        green_g = random.randint(110, 160)
        green_b = random.randint(40, 80)
        draw.ellipse([tx - trad, ty - trad, tx + trad, ty + trad], fill=(green_r, green_g, green_b))

    img.save('assets/window-view.png')
    print('Created assets/window-view.png')

def create_blinds_texture():
    w, h = 512, 1024
    img = Image.new('RGBA', (w, h), (240, 240, 240, 255))
    draw = ImageDraw.Draw(img)

    # Vertical blinds slats
    slat_w = 32
    for x in range(0, w, slat_w):
        # Slat shading
        draw.rectangle([x, 0, x + slat_w - 3, h], fill='#f5f5f7')
        # Slat shadow edge
        draw.line([(x + slat_w - 2, 0), (x + slat_w - 2, h)], fill='#d1d5db', width=2)

    img.save('assets/window-blinds.png')
    print('Created assets/window-blinds.png')

if __name__ == '__main__':
    create_floor_texture()
    create_ceiling_texture()
    create_wood_texture()
    create_whiteboard_texture()
    create_code_screen()
    create_dashboard_screen()
    create_vietnam_flag()
    create_wall_clock()
    create_window_skyline()
    create_blinds_texture()
    print('All textures successfully generated!')
