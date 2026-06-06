# 🎬 Guía: Renderizar en 4K con Remotion sin Lag

## ❓ ¿Por qué los videos se ven "trabados" en 4K?

El lag/trabado en videos 4K renderizados con Remotion ocurre por estas razones:

### 1. Decodificación concurrente demasiado alta
Remotion usa múltiples instancias de Chromium en paralelo. Si el video es 4K y usás
muchos hilos al mismo tiempo, el sistema se queda sin RAM/CPU y produce frames con lag.

**Solución:** Reducir `--concurrency` a 1 o 2 para videos pesados.

### 2. Codec incorrecto para 4K
El codec por defecto de Remotion (`h264`) en su configuración base no está optimizado
para archivos 4K. Se necesita usar `--crf` (Constant Rate Factor) para controlar la
calidad vs. tamaño.

**CRF para 4K:**
- `18` = Casi sin pérdida (archivo muy grande)
- `22` = Balance calidad/tamaño ✅ (recomendado)
- `28` = Más comprimido (puede verse malo)

### 3. Falta de aceleración de hardware
Por defecto Remotion no usa GPU para codificar. Se puede activar con `--x264-preset`
para controlar velocidad de encoding.

---

## ✅ Solución: Comandos de Render Correctos

### 🔷 Render 4K — Primeros 15 segundos (frames 0–449 a 30fps)

```bash
npx remotion render Main --output=out/aroma_4K_15seg.mp4 --scale=3.7 --frames=0-449 --concurrency=1 --crf=22 --x264-preset=slow --image-format=jpeg --jpeg-quality=80
```

**¿Por qué `--scale=3.7`?**
El proyecto es 1080×1920. Para llegar a 4K (3840×2160):
- `3840 / 1080 = 3.555...` → usamos `3.7` para llegar cerca de 4K.
- Resultado: `~3996×7110` en modo vertical (más que 4K).
- Para exactamente UHD 4K horizontal: el factor correcto sería `--scale=3.556`

**Para 4K exacto (3840 de ancho):**
```bash
npx remotion render Main --output=out/aroma_4K_exacto_15seg.mp4 --scale=3.556 --frames=0-449 --concurrency=1 --crf=22 --x264-preset=slow
```

---

### 🔷 Render Full HD (1080p) sin lag — video completo

```bash
npx remotion render Main --output=out/aroma_fullhd.mp4 --concurrency=2 --crf=18 --x264-preset=medium
```

---

### 🔷 Render 4K — Video completo (los 30 segundos)

```bash
npx remotion render Main --output=out/aroma_4K_completo.mp4 --scale=3.556 --concurrency=1 --crf=22 --x264-preset=slow
```

---

## 🔧 Explicación de cada parámetro

| Parámetro | Valor | ¿Por qué? |
|-----------|-------|-----------|
| `--scale` | `3.556` | Escala 1080→3840px (4K UHD) |
| `--frames` | `0-449` | Primeros 15 segundos (15 × 30 fps = 450 frames, 0 a 449) |
| `--concurrency` | `1` | 1 solo hilo = sin saturar CPU/RAM en 4K |
| `--crf` | `22` | Calidad alta sin archivo gigante |
| `--x264-preset` | `slow` | Mejor compresión, más tiempo de encode |
| `--image-format` | `jpeg` | Más rápido que PNG para compositing interno |
| `--jpeg-quality` | `80` | Balance velocidad/calidad interna |

---

## ⚠️ Requisitos de Hardware para 4K

| Componente | Mínimo recomendado |
|-----------|-------------------|
| RAM | 16 GB (idealmente 32 GB) |
| CPU | 8 núcleos o más |
| Disco | SSD (no HDD) |

---

## 🎯 Flujo de trabajo recomendado

1. **Previsualizar** en Remotion Studio: `npm run dev`
2. **Verificar un frame** en HD para chequear layout: 
   ```bash
   npx remotion still Main --scale=1 --frame=0 --output=out/check_frame.jpeg
   ```
3. **Renderizar los primeros 15 seg en 4K** (comando principal arriba)
4. **Revisar** el output en un reproductor que soporte 4K (VLC recomendado)
5. Si se ve bien → renderizar el video completo

---

## 💡 Tip: Pre-procesar los videos fuente

Si tus videos fuente (`assets/`) ya están en alta resolución (como los videos TensorPix),
considera **re-exportarlos a 1080p a 30fps** antes de usarlos en Remotion. 
Esto hace que la decodificación interna sea mucho más rápida y el render no se traba.

```bash
# Con FFmpeg: convertir un video a 1080p 30fps para usar en Remotion
ffmpeg -i "input_4k.mp4" -vf "scale=1080:-2" -r 30 -c:v libx264 -crf 20 "output_1080p_30fps.mp4"
```
