# ঢাকা কলেজ ফটোগ্রাফি ক্লাব (DCPC) - Member Enrollment Website 2026

A modern, high-performance, mobile-first enrollment platform for **Dhaka College Photography Club (DCPC)** with direct **Google Sheets database** integration, camera viewfinder UI aesthetic, real-time client-side validation, bKash/Nagad fee copy tools, and an executive administration dashboard.

---

## ⚡ Deploy with GitHub Pages

This repository deploys automatically from `main` using `.github/workflows/deploy-pages.yml`.

1. Open the repository on GitHub and go to **Settings** > **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push or merge changes into `main`, then monitor the **Deploy static site to GitHub Pages** workflow under **Actions**.
4. Open the Pages URL shown in the workflow deployment environment.

If the site still displays an older login form, confirm that Pages is using this repository's `main` deployment, wait for the workflow to finish, and perform a hard refresh or open the URL in a private window. The current source does not contain the old PIN form.

---

## 📊 Connecting to Google Sheets (3 Minutes)

Your Google Sheet is already created and formatted:
🔗 **[DCPC New Member Enrollment 2026 (Responses)](https://docs.google.com/spreadsheets/d/1e6MFrvBZSxkCaYVK1sl7VIGxv5wQk3s_6paqQeaRM5g/edit)**

1. Open the Google Sheet above.
2. Click **Extensions** > **Apps Script**.
3. Copy all code from `google-apps-script/Code.gs` and paste it into the editor.
4. Click **Deploy** > **New deployment** > Select **Web app**.
5. Set:
   - **Execute as**: `Me`
   - **Who has access**: **`Anyone`**
6. Click **Deploy** and copy the resulting **Web App URL**.
7. Open `js/config.js` and paste your URL into `GOOGLE_SHEET_WEB_APP_URL`.
8. That's it! Every submitted application appears in real-time in your Google Sheet!

---

## 🛡️ Administration
- The Google Sheet is the production administration surface. Restrict its sharing permissions to authorized club executives.
- `admin.html` requires the administrator password and supports local CSV export.
- The password is not stored as plaintext; only its SHA-256 hash is committed in `js/config.js`. This is a client-side gate, not a security boundary. Anyone who can inspect the published JavaScript can bypass it, so do not treat this page as protection for sensitive live data.

---

## 🎨 Design & Features
- **Official Branding**: Custom high-fidelity vector SVG emblem matching the Dhaka College Photography Club logo (cyan, magenta, and red lens aperture circles with top-left shutter release indicator).
- **Camera Viewfinder Aesthetic**: Dark luxury theme inspired by camera HUDs (`[● REC]`, `ISO 100`, `f/1.8`, reticle brackets, aperture animation).
- **Sound Effects**: Synthesized mechanical camera shutter sound on navigation and submission (via native Web Audio API, no external downloads needed).
- **Payment Helper**: Quick copy button for `01581964228` (bKash / Nagad Personal) with clear instructions for sending 100 Tk enrollment fee.
- **Printable Acknowledgment Slip**: Instant digital receipt generated with unique Reference ID (`DCPC-YYMMDD-XXX`) upon submission.
