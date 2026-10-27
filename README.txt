DIGITORA — Cinematic Brutalist Landing Page

ENTRY FILE
- index.html

RUN LOCALLY
- Extract the ZIP and open index.html in a modern browser.
- For local development, a simple static server is recommended (for example: `python -m http.server 8000`) and then visit http://localhost:8000.
- No build step, framework, API key, or backend is required.

ASSETS & MOTION
- character.png is the original character image supplied in the project and is used locally.
- Google Fonts, GSAP, ScrollTrigger, and Lenis are loaded from CDNs. An internet connection is needed for the chosen web fonts and enhanced animation libraries. The core page and navigation remain usable if those libraries fail; native scrolling is the fallback.
- The branded loader lasts 7 seconds in normal-motion mode. It is bypassed for users who request reduced motion.

BEFORE LAUNCH
- In index.html, replace `hello@digitora.example` with the studio's verified contact email. This is intentionally a clearly marked placeholder and is not a real contact address.
- The three selected-work visuals are explicitly labelled concept explorations, not real client projects.

DEPLOYMENT
- Upload the contents of this folder to any static web host (Vercel, Netlify, GitHub Pages, or standard hosting). Keep index.html, style.css, script.js, and character.png in the same directory.

TESTING NOTE
- The files were checked for local asset references and internal section links. Browser automation / a live browser session was not available during packaging, so cross-device visual QA should still be performed on the target browsers before launch.
