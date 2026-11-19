# DUNE landing page

Landing page and product videos for [DUNE](https://dune.dyzo.ai), the attendance, leave and salary app for offices with 10–50 people.

## Pages

| File | What it is |
|---|---|
| `en.html` | English landing page |
| `index.html` | Hinglish landing page (for Meta/Instagram ads) |
| `product-video.html` | Animated product video, 16:9 (1920×1080) |
| `product-video-916.html` | Animated product video, 9:16 (1080×1920) for Reels/Shorts |

Both landing pages link to each other from the header and footer. They are static HTML: open them in a browser or serve the folder with any static host.

## Videos

Rendered MP4s are in `videos/`:

- `dune-product-video-16x9.mp4`: 1920×1080, 30fps, 41.5s
- `dune-product-video-9x16.mp4`: 1080×1920, 30fps, 41.5s

## Re-rendering a video

Needs Google Chrome and ffmpeg (`brew install ffmpeg`).

```bash
cd tools && npm install
python3 -m http.server 8765 --directory ..   # in another terminal
node record.js "http://localhost:8765/product-video.html?rec" ../videos/dune-product-video-16x9.mp4 30 1920 1080
node record.js "http://localhost:8765/product-video-916.html?rec" ../videos/dune-product-video-9x16.mp4 30 1080 1920
```

## Before going live

- Add the real price in the Pricing section (currently `₹__`).
- Confirm salary slips, geo-fencing and the setup times with the product team.
- `img/app-punch.webp` shows a staff member's name, photo and the office address; get their consent or replace it.
