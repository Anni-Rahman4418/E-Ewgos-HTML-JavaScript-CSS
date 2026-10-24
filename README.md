# E-Ewgos – Sport E-commerce Landing Page

A responsive, interactive landing page for a sports e-commerce brand, built with plain **HTML, CSS and JavaScript** (no frameworks). The layout follows a Figma design at **1920 px** wide and scales smoothly down to tablets and phones.

**Live demo:** https://anni-rahman4418.github.io/E-Ewgos-HTML-JavaScript-CSS/
*(works after you turn on GitHub Pages – see "Publish it" below)*

---

## Features

- **Pixel-matched layout** – every box uses the exact width, height and position from the Figma file.
- **Responsive design** – full desktop design scaled down on smaller windows, a stacked layout on tablets and phones, and a hamburger menu on small screens.
- **Categories + card slider**
  - Previous / next arrows and clickable categories
  - Drag with the mouse, swipe with a finger, or scroll sideways on a touchpad (Shift + wheel on a mouse)
  - One full card on phones, two on tablets, three on laptops
  - Cards turn blue on hover with a white button that turns lime when pointed at
- **Journey section**
  - Five stacked pictures – hovering an icon brings its picture to the front with a soft gradient
  - The main picture follows the cursor a little
  - Tilted and square pictures move on hover
- **Animated progress bars** – striped bars and numbers that count up, replaying each time you scroll to them
- **Hover motion everywhere** – buttons, logos, links, cards, FAQ rows, footer links and social icons
- **Scroll reveal** – headings and text fade in as you scroll
- **Contact form** – checks that every field is filled and shows an error or thank-you message
- **FAQ** – native accordion (`<details>`), no JavaScript needed
- **Automatic laptop / touch detection** – the page adds a `mouse` or `touch` class to `<html>` so touch devices get tap and swipe behaviour
- **Accessibility** – alt text on images, `aria-label` on icon buttons, visible keyboard focus, and a "reduce motion" setting that switches animations off

---

## Built with

| Tool | Used for |
|---|---|
| HTML5 | Page structure |
| CSS3 | Layout, variables, gradients, transitions, animations, media queries |
| JavaScript (ES6) | Slider, hover logic, scroll effects, form check |
| Google Fonts | Montserrat, Noto Sans, Poppins |
| Material Symbols | Orbit icons (inline SVG) |
| Simple Icons | Footer social icons (inline SVG) |

---

## Project structure

```
E-Ewgos-HTML-JavaScript-CSS/
├── index.html      page structure
├── style.css       all styling, responsive rules and hover effects
├── script.js       slider, journey pictures, progress bars, form, scroll effects
├── README.md       this file
└── images/         photos, logos and icons used by the page
```

---

## Run it locally

1. Clone or download the project:
   ```bash
   git clone https://github.com/Anni-Rahman4418/E-Ewgos-HTML-JavaScript-CSS.git
   ```
2. Open the folder in **VS Code**.
3. Right-click `index.html` → **Open with Live Server** (install the *Live Server* extension first), **or** just double-click `index.html` to open it in Chrome.

An internet connection is needed the first time so the Google Fonts can load.

---

## How the responsive layout works

The design width is 1920 px. A single CSS variable describes "one Figma pixel":

```css
--u: calc(min(100vw, 1920px) / 1920);
```

Sizes are written as `calc(214 * var(--u))`, so a 214 px Figma button is exactly 214 px on a 1920 px screen and shrinks proportionally on smaller ones. Each positioned element carries its Figma values directly in the HTML:

```html
<a class="a btn" style="--x:1469; --y:31; --w:214; --h:74">Show More</a>
```

| Screen width | Layout |
|---|---|
| above 960 px | Full desktop design, scaled to fit |
| 960 px and below | Stacked tablet / phone layout with a hamburger menu |
| 600 – 960 px | Tablet: two cards in the slider, 4-column footer |
| below 600 px | Phone: one card in the slider, 2-column footer |
| footer only, 1279 px and below | Footer switches to a stacked layout |

To move the phone breakpoint, search `style.css` for `960px` and change every occurrence to the same new number.

---

## Customize

| I want to… | Change this |
|---|---|
| Change the brand colours | `--blue`, `--lime`, `--bg`, `--gray`, `--footer` at the top of `style.css` |
| Move or resize an element | its `--x`, `--y`, `--w`, `--h` in `index.html` |
| Replace a picture | put the new file in `images/` and update its `src` |
| Change hover strength | the numbers inside `translateY()`, `scale()` and `rotate()` in the hover section of `style.css` |
| Change animation speed | the time values in `transition: … .3s` |
| Change the progress values | `data-count` and `data-w` on the two bars in `index.html` |
| Add another card | copy one `<article class="card">…</article>` inside `#track` |

---

## Known limitations

- The contact form only validates the fields. It does **not** send the message anywhere yet (connect it to a service such as Formspree or your own server).
- Many links (`href="#"`) are placeholders and do nothing until you add real addresses.
- Brand logos in the hero row are shown as grey versions of the real logos – check usage rights before publishing.
- Some Figma values could not be read exactly and were estimated (the thin circles behind the orbit icons and a few paragraph positions).

---

## Publish it (GitHub Pages)

1. Push the project to GitHub.
2. On GitHub open the repository → **Settings** → **Pages**.
3. Under **Branch** choose `main` and `/ (root)`, then click **Save**.
4. After a minute your site is live at `https://<your-username>.github.io/<repository-name>/`.

---

## Credits

- Design: Figma file *E-Ewgos – Sport E-commerce Website*
- Fonts: [Google Fonts](https://fonts.google.com/) (Open Font License)
- Icons: [Material Symbols](https://fonts.google.com/icons) (Apache 2.0) and [Simple Icons](https://simpleicons.org/) (CC0)
- Photos and logos: belong to their respective owners and are used here for learning and demonstration

---

## Author

Built by [Anni-Rahman4418](https://github.com/Anni-Rahman4418).
