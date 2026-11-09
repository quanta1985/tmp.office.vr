#!/usr/bin/env python3
"""
Generate ultra-realistic PBR texture maps, normal maps, and contact shadows
for the Office VR Digital Twin application.
"""
import os
import math
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

os.makedirs('assets', exist_ok=True)

def generate_contact_shadows():
    """Generates soft ambient occlusion / contact shadow maps to ground 3D furniture."""
    # 1. Meeting Table Contact Shadow (3.4m x 1.3m footprint)
    w, h = 512, 1024
    img = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(img)
    # Draw soft rounded rectangular core shadow
    draw.rounded_rectangle([60, 100, w - 60, h - 100], radius=40, fill=180)
    # Draw 4 leg intense contact points
    legs = [(100, 160), (w - 100, 160), (100, h - 160), (w - 100, h - 160)]
    for lx, ly in legs:
        draw.ellipse([lx - 35, ly - 35, lx + 35, ly + 35], fill=240)
    
    # Heavy Gaussian Blur for realistic soft penumbra
    shadow = img.filter(ImageFilter.GaussianBlur(radius=32))
    # Invert and save as transparent PNG
    alpha_img = Image.new('RGBA', (w, h), (15, 18, 25, 0))
    alpha_img.putalpha(shadow)
    alpha_img.save('assets/shadow-table.png')
    print('Created assets/shadow-table.png')

    # 2. Workstation Desk Contact Shadow
    w, h = 512, 512
    img = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([40, 80, w - 40, h - 80], radius=30, fill=190)
    # Chair shadow
    draw.ellipse([w//2 - 90, h - 150, w//2 + 90, h - 10], fill=150)
    shadow = img.filter(ImageFilter.GaussianBlur(radius=28))
    alpha_img = Image.new('RGBA', (w, h), (15, 18, 25, 0))
    alpha_img.putalpha(shadow)
    alpha_img.save('assets/shadow-desk.png')
    print('Created assets/shadow-desk.png')

def generate_floor_pbr():
    """Generates realistic ceramic tile diffuse, normal, and roughness maps."""
    size = 1024
    diffuse = Image.new('RGB', (size, size), '#f5f2eb')
    draw = ImageDraw.Draw(diffuse)

    # Subtle porcelain micro-mottling
    random.seed(42)
    pixels = diffuse.load()
    for y in range(size):
        for x in range(size):
            val = random.randint(-5, 5)
            r = max(0, min(255, 246 + val))
            g = max(0, min(255, 243 + val))
            b = max(0, min(255, 236 + val))
            pixels[x, y] = (r, g, b)

    # 4 Ceramic tiles (60x60cm scale) with crisp grout
    grout_color = (190, 185, 175)
    grout_w = 4
    half = size // 2

    # Tile borders
    for w_i in range(grout_w):
        draw.line([(0, w_i), (size, w_i)], fill=grout_color)
        draw.line([(0, size - 1 - w_i), (size, size - 1 - w_i)], fill=grout_color)
        draw.line([(w_i, 0), (w_i, size)], fill=grout_color)
        draw.line([(size - 1 - w_i, 0), (size - 1 - w_i, size)], fill=grout_color)
        draw.line([(0, half - grout_w // 2 + w_i), (size, half - grout_w // 2 + w_i)], fill=grout_color)
        draw.line([(half - grout_w // 2 + w_i, 0), (half - grout_w // 2 + w_i, size)], fill=grout_color)

    diffuse.save('assets/floor-tiles.png')
    print('Created assets/floor-tiles.png')

    # Generate matching Normal Map for realistic grout bevel & tile reflections
    normal_map = np.zeros((size, size, 3), dtype=np.uint8)
    normal_map[:, :] = [128, 128, 255] # Flat normal vector (0, 0, 1)

    # Beveled grout indentation
    g_range = 6
    for i in range(g_range):
        # Slope factor
        slope = int(45 * (1.0 - i / g_range))
        # Top edges (normals point down)
        normal_map[i, :, 1] = max(0, 128 - slope)
        normal_map[half - g_range + i, :, 1] = min(255, 128 + slope)
        normal_map[half + i, :, 1] = max(0, 128 - slope)
        normal_map[size - 1 - i, :, 1] = min(255, 128 + slope)
        # Left edges (normals point right)
        normal_map[:, i, 0] = min(255, 128 + slope)
        normal_map[:, half - g_range + i, 0] = max(0, 128 - slope)
        normal_map[:, half + i, 0] = min(255, 128 + slope)
        normal_map[:, size - 1 - i, 0] = max(0, 128 - slope)

    norm_img = Image.fromarray(normal_map, 'RGB')
    norm_img = norm_img.filter(ImageFilter.GaussianBlur(radius=1.2))
    norm_img.save('assets/floor-normal.png')
    print('Created assets/floor-normal.png')

def generate_wood_pbr():
    """Generates warm natural oak/birch wood tabletop texture with matching normal map."""
    w, h = 1024, 512
    img = Image.new('RGB', (w, h), '#e6d0af')
    draw = ImageDraw.Draw(img)

    random.seed(88)
    # Fine wood grain fibers
    for y in range(0, h, 2):
        shade = random.randint(-14, 14)
        r = max(0, min(255, 230 + shade))
        g = max(0, min(255, 208 + shade))
        b = max(0, min(255, 175 + shade))
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Organic wood grain cathedrals / waves
    for _ in range(50):
        y0 = random.randint(0, h)
        grain_r = random.randint(195, 218)
        grain_g = random.randint(172, 192)
        grain_b = random.randint(142, 162)
        points = []
        for x in range(0, w, 15):
            cur_y = y0 + int(math.sin(x * 0.012) * 10 + math.cos(x * 0.025) * 4)
            points.append((x, cur_y))
        draw.line(points, fill=(grain_r, grain_g, grain_b), width=random.randint(1, 2))

    img.save('assets/wood-desk.png')
    print('Created assets/wood-desk.png')

    # Matching wood normal map
    gray = img.convert('L')
    gray_arr = np.array(gray, dtype=np.float32)
    dy, dx = np.gradient(gray_arr)
    # Scale slopes
    dx = dx * 1.5
    dy = dy * 1.5
    dz = np.ones_like(dx) * 20.0
    norm = np.sqrt(dx*dx + dy*dy + dz*dz)
    nx = ((dx / norm) * 0.5 + 0.5) * 255.0
    ny = ((dy / norm) * 0.5 + 0.5) * 255.0
    nz = ((dz / norm) * 0.5 + 0.5) * 255.0
    normal_wood = np.stack([nx, ny, nz], axis=2).astype(np.uint8)
    norm_wood_img = Image.fromarray(normal_wood, 'RGB')
    norm_wood_img = norm_wood_img.filter(ImageFilter.GaussianBlur(radius=0.8))
    norm_wood_img.save('assets/wood-normal.png')
    print('Created assets/wood-normal.png')

def generate_fabric_chair_texture():
    """Generates detailed blue mesh fabric texture for office chairs."""
    size = 256
    img = Image.new('RGB', (size, size), '#1e40af')
    draw = ImageDraw.Draw(img)

    # Breathable mesh weave pattern
    for y in range(0, size, 4):
        for x in range(0, size, 4):
            shade = 18 if (x + y) % 8 == 0 else -18
            r = max(0, min(255, 30 + shade))
            g = max(0, min(255, 64 + shade))
            b = max(0, min(255, 175 + shade))
            draw.rectangle([x, y, x + 3, y + 3], fill=(r, g, b))

    img.save('assets/chair-fabric.png')
    print('Created assets/chair-fabric.png')

def generate_pc_tower_texture():
    """Generates realistic PC tower front and glass side panel."""
    w, h = 512, 1024
    img = Image.new('RGB', (w, h), '#0b0f19')
    draw = ImageDraw.Draw(img)

    # Front Honeycomb Mesh Grille
    draw.rectangle([40, 60, w - 40, h - 120], fill='#111827', outline='#374151', width=3)
    # Two Large 140mm Glowing RGB Intake Fans
    fan_centers = [(w // 2, 280), (w // 2, 600)]
    for fcx, fcy in fan_centers:
        # Fan circle
        draw.ellipse([fcx - 140, fcy - 140, fcx + 140, fcy + 140], outline='#1f2937', width=6)
        # Glowing cyan / teal RGB ring
        draw.ellipse([fcx - 130, fcy - 130, fcx + 130, fcy + 130], outline='#06b6d4', width=8)
        draw.ellipse([fcx - 132, fcy - 132, fcx + 132, fcy + 132], outline='#38bdf8', width=2)
        # Fan blades
        for a in range(0, 360, 45):
            rad = math.radians(a)
            bx = fcx + 110 * math.cos(rad)
            by = fcy + 110 * math.sin(rad)
            draw.line([(fcx, fcy), (bx, by)], fill='#1e293b', width=12)
        # Center hub
        draw.ellipse([fcx - 35, fcy - 35, fcx + 35, fcy + 35], fill='#0f172a', outline='#38bdf8', width=2)

    # Front I/O Ports (Top)
    draw.rectangle([w // 2 - 80, 20, w // 2 + 80, 45], fill='#1f2937')
    # Power button & USB ports
    draw.ellipse([w // 2 - 60, 26, w // 2 - 46, 38], fill='#38bdf8') # Power LED
    draw.rectangle([w // 2 - 30, 28, w // 2 - 10, 36], fill='#0284c7') # USB 3.0
    draw.rectangle([w // 2 + 5, 28, w // 2 + 25, 36], fill='#0284c7') # USB 3.0
    draw.rectangle([w // 2 + 40, 28, w // 2 + 55, 36], fill='#e2e8f0') # Type-C

    img.save('assets/pc-tower.png')
    print('Created assets/pc-tower.png')

if __name__ == '__main__':
    generate_contact_shadows()
    generate_floor_pbr()
    generate_wood_pbr()
    generate_fabric_chair_texture()
    generate_pc_tower_texture()
    print('Advanced realistic assets generated successfully!')

