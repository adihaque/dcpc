# ঢাকা কলেজ ফটোগ্রাফি ক্লাব (DCPC) - Member Enrollment Website 2026

A modern, high-performance, mobile-first enrollment platform for **Dhaka College Photography Club (DCPC)** with direct **Google Sheets database** integration, camera viewfinder UI aesthetic, real-time client-side validation, bKash/Nagad fee copy tools, and an executive administration dashboard.

---

## ⚡ Quick Start: Host in Under 15 Minutes

### Option 1: Vercel (Recommended - Takes 2 Minutes)
1. Drag and drop this folder onto your GitHub repository (or run `git init && git push`).
2. Go to [vercel.com](https://vercel.com) > **Add New Project**.
3. Import the repository and click **Deploy**.
4. Your site is live on a free SSL domain (e.g. `dcpc-enrollment.vercel.app`)!

### Option 2: Netlify Drop (Zero Setup - Takes 60 Seconds)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this entire `dcpc-enrollment-web` folder onto the browser.
3. Your site is deployed instantly!

### Option 3: GitHub Pages (Free Forever)
1. Create a new GitHub repo (e.g., `dcpc-enrollment`).
2. Push this folder to `main`.
3. Go to **Settings** > **Pages** > Source: `Deploy from branch main /root`.
4. Your site will be live at `https://<your-username>.github.io/dcpc-enrollment/`.

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
- `admin.html` is only a local-browser backup viewer and CSV exporter. It is not an authentication boundary and should not be used to protect live applicant data.

---

## 🎨 Design & Features
- **Official Branding**: Custom high-fidelity vector SVG emblem matching the Dhaka College Photography Club logo (cyan, magenta, and red lens aperture circles with top-left shutter release indicator).
- **Camera Viewfinder Aesthetic**: Dark luxury theme inspired by camera HUDs (`[● REC]`, `ISO 100`, `f/1.8`, reticle brackets, aperture animation).
- **Sound Effects**: Synthesized mechanical camera shutter sound on navigation and submission (via native Web Audio API, no external downloads needed).
- **Payment Helper**: Quick copy button for `01581964228` (bKash / Nagad Personal) with clear instructions for sending 100 Tk enrollment fee.
- **Printable Acknowledgment Slip**: Instant digital receipt generated with unique Reference ID (`DCPC-YYMMDD-XXX`) upon submission.
