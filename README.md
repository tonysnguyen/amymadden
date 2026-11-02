# Madden's Adventures

Amy Madden's personal site — chalk street painting, little moments and big adventures.
A plain static website (HTML, CSS and a little JavaScript), ready for GitHub Pages or any static host.

## What's in this folder

| Path | What it is |
|---|---|
| `index.html` | Home |
| `about.html` | About Amy, career path |
| `chalk-art.html` | Chalk art wall with filters and photo viewer |
| `moments.html` | Major, Gear Head, Camping/Family/Fun |
| `adventures.html` | Vietnam trips, CA → WA road trip, Ojai, Paso Robles |
| `contact.html` | Contact form |
| `404.html` | "Page not found" page (used by GitHub Pages) |
| `assets/img/` | Every image the site uses, in folders by page and gallery (see **Images** below) |
| `assets/js/dc-lite.js` | Small script that renders each page from its template |
| `assets/js/site-config.js` | Site settings (the contact form address) |
| `assets/favicon.svg` | Browser tab icon |
| `_redirects` | Old Squarespace links → new pages (Netlify / Cloudflare only) |
| `_archive/` | Original photos, old pages and build tools. **Not uploaded** — see `.gitignore` |

## Contact form

Messages from the Contact page are sent to **amymmadden@gmail.com** through [FormSubmit](https://formsubmit.co), a free form-forwarding service. The address is set in `assets/js/site-config.js`.

- **One-time activation:** the first message anyone sends triggers an activation email from FormSubmit to amymmadden@gmail.com. Click the link in it; messages are delivered from then on. (Send a test message yourself right after the site goes live.)
- **Replying:** each email includes the visitor's name, email, subject and message, and replying goes straight to the visitor.
- **Hide the address (optional):** after activating, FormSubmit offers a random alias URL. Paste it into `site-config.js` in place of the current one so the email address isn't visible in the page source.
- If sending fails, visitors see a friendly error and can try again.

## Preview on your computer

From this folder, run:

```
python3 -m http.server 8000
```

then open http://localhost:8000 in your browser. (Opening the HTML files directly also works in most browsers.)

## Publish with GitHub Pages

1. Create a new repository on GitHub and upload everything in this folder (the `_archive` folder is skipped automatically).
2. In the repository go to **Settings → Pages**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
3. To use `maddenadventures.com`, add it under **Settings → Pages → Custom domain** and point the domain's DNS at GitHub Pages.

The `404.html` page links back to `/`, which works with a custom domain or a `username.github.io` site.

## Editing the site

Each page has two parts, both inside the page's `.html` file:

- **The markup** lives in `<template id="dc-template">`. Text you see on the page is written there as plain HTML, with a few placeholders like `{{v.title}}` that are filled in by the page's script.
- **The behaviour and data** live in the `<script>` at the bottom (`class Component …`). Gallery photos, piece details and trip info are listed there.

To add a photo to a gallery, just put it in that gallery's folder with the next number (see **Images** below). No code changes needed.

## Images

Images live in `assets/img/`, one folder per page and one sub-folder per gallery:

```
assets/img/
  shared/       award-medal.webp            People's Choice medal (Home + Chalk Art)
  home/         hero-background.webp        blurred street behind the hero
                hero-amy.webp               Amy cut-out (transparent background)
                hero-name-front.webp        "AMY MADDEN" lettering, front layer
                hero-name-back.webp         "AMY MADDEN" lettering, back layer
  about/        portrait.webp, banner.jpg
  chalk-art/    cover.webp                  Chalk Art section photo (Home + About tiles)
    astronaut/ velvet-cat/ grapes/ black-white-face/ bird/ flowers-beads/ dog-fruit-nose/ dog-fish/ makeup-mask/
                cover.*                     the piece's tile on the Chalk Art wall
                01.webp, 02.webp, …         the piece's gallery photos, in order
  moments/      cover.jpg                   Moments section photo (Home + Chalk Art tiles)
    major/ gear-head/ camping-family-fun/
                cover.*                     the chapter card
                01.webp, 02.webp, …         gallery photos
  adventures/   banner.webp                 big photo behind the Ibn Battuta quote
    vietnam-2017/ vietnam-2019/ ca-to-wa/   cover.webp + 01.webp, 02.webp, …
    ojai/ paso-robles/                      01.webp, … (the card uses 01)
```

**Adding gallery photos:** drop the image into the gallery's folder named with the next number — e.g. add `07.webp` to `assets/img/moments/major/` — then sync to GitHub. The site finds it automatically.
- Name gallery photos `01`, `02`, `03` … (two digits) in `.webp`, `.jpg`, `.jpeg` or `.png`. Formats can be mixed.
- Keep the numbers in a row. The site stops looking after two missing numbers, so a gap of one is fine but `01, 02, 09` would only show 01 and 02.
- Photos appear in number order. To reorder, rename the files.
- To remove a photo, delete it and renumber the ones after it so there's no big gap.

**Swapping a photo or cover:** save the new image with the same name in the same folder (replace the old file). Covers and other images can also change format — replacing `cover.webp` with `cover.jpg` works automatically.
Only the big blurred background behind the Home hero (`home/hero-background.webp`) must keep its exact name and format.

**Tips:** keep photos around 960–1600px wide and save as `.webp` or `.jpg` (under ~500KB each) so pages stay fast.
`vietnam-2017/cover.webp` also appears on the Home, Chalk Art and Moments pages as the Adventures tile.
Full-resolution originals and every other photo from the old site are in `_archive/` on this computer.
