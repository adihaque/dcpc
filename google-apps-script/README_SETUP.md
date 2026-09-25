# Google Sheet Database Setup Guide (Takes 3 Minutes)

This website uses your Google Sheet as a live, secure database with **zero monthly costs** and **zero server maintenance**.

Your Google Sheet is already created here:
👉 **[DCPC New Member Enrollment 2026 (Responses)](https://docs.google.com/spreadsheets/d/1e6MFrvBZSxkCaYVK1sl7VIGxv5wQk3s_6paqQeaRM5g/edit)**

---

### Step 1: Open Apps Script
1. Open the Google Sheet above.
2. In the top menu, click **Extensions** > **Apps Script**.

### Step 2: Paste the Code
1. Delete any existing code in the script editor (`myFunction`).
2. Copy all code from `Code.gs` and paste it into the editor.
3. Click the **Save** icon (diskette icon) or press `Ctrl + S` / `Cmd + S`.

### Step 3: Deploy as Web App
1. At the top right, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon (⚙️) next to "Select type" and select **Web app**.
3. Fill in the fields:
   - **Description**: `DCPC Enrollment Web App`
   - **Execute as**: `Me (your email)`
   - **Who has access**: **`Anyone`** *(Crucial: allows students to submit without requiring Google sign-in)*
4. Click **Deploy**.
5. When prompted, click **Authorize access**, choose your Google account, click **Advanced**, and click **Go to Untitled project (unsafe)** > **Allow**.
6. Copy the **Web App URL** (it ends with `/exec`).

### Step 4: Connect to your Website
1. Open `js/config.js` in your website folder.
2. Replace `GOOGLE_SHEET_WEB_APP_URL` with your copied URL:
   ```javascript
   GOOGLE_SHEET_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbx.../exec"
   ```
3. Done! Every student submission on the website will now appear instantly as a new row in your Google Sheet!

---

### Fallback Mode:
If you haven't deployed the Apps Script yet, the website automatically runs in **Offline / Local Backup Mode**. Submissions are saved securely in the browser's `localStorage` and can be downloaded as a CSV or synced anytime from `/admin.html`.
