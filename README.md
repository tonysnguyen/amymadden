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
| `assets/img/` | Every image the site uses (web-sized) |
| `assets/js/dc-lite.js` | Small script that renders each page from its template |
| `assets/js/site-config.js` | Site settings (the contact form address) |
| `assets/favicon.svg` | Browser tab icon |
| `_redirects` | Old Squarespace links → new pages (Netlify / Cloudflare only) |
| `_archive/` | Original photos, old pages and build tools. **Not uploaded** — see `.gitignore` |

## Before the site goes live: hook up the contact form

Right now the Contact form only *pretends* to send. To receive messages:

1. Create a free form at [formspree.io](https://formspree.io) (or a similar form service) using Amy's email.
2. Copy the form's endpoint URL (it looks like `https://formspree.io/f/abcdwxyz`).
3. Paste it into `assets/js/site-config.js`: `formEndpoint: 'https://formspree.io/f/abcdwxyz'`.

If sending fails, visitors see a friendly error and can try again.

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

To add a photo to a gallery, put the image in `assets/img/` and add its file name to that gallery's photo list in the page's script.

## Images

`assets/img/` holds the web-sized photos the site shows. Full-resolution originals and every other web-sized photo from the old site are kept in `_archive/` on this computer only.
