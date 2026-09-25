/**
 * DCPC Enrollment Platform - Global Configuration
 */
const DCPC_CONFIG = {
  CLUB_NAME_EN: "Dhaka College Photography Club",
  CLUB_NAME_BN: "ঢাকা কলেজ ফটোগ্রাফি ক্লাব",
  ACRONYM: "DCPC",
  MEMBERSHIP_FEE: 100, // in BDT
  PAYMENT_NUMBERS: {
    bKash: "01581964228",
    Nagad: "01581964228",
    type: "Personal (Send Money / সেন্ড মানি)"
  },
  GOOGLE_SHEET_URL: "https://docs.google.com/spreadsheets/d/1e6MFrvBZSxkCaYVK1sl7VIGxv5wQk3s_6paqQeaRM5g/edit",
  // PASTE YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL HERE:
  // e.g.: "https://script.google.com/macros/s/AKfycby.../exec"
  GOOGLE_SHEET_WEB_APP_URL: "https://script.google.com/macros/s/AKfycby2XgI8jmPov_VuJiimkwEfJo21dCHgDC7vxCSJeFNOel5Za8dJH1Jr9ybZVzDtFhMFdA/exec",
  CONTACT: {
    facebook: "https://facebook.com/dhakacollegephotographyclub",
    email: "adihaque15@gmail.com",
    helpline: "01581964228"
  }
};

window.DCPC_CONFIG = DCPC_CONFIG;
