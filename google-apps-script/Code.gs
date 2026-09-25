/**
 * Dhaka College Photography Club (DCPC) - Member Enrollment Backend
 * Google Apps Script Web App for Google Sheets Database
 *
 * Spreadsheet ID: 1e6MFrvBZSxkCaYVK1sl7VIGxv5wQk3s_6paqQeaRM5g
 */

const SPREADSHEET_ID = '1e6MFrvBZSxkCaYVK1sl7VIGxv5wQk3s_6paqQeaRM5g';
const SHEET_NAME = 'Sheet1';

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    club: 'Dhaka College Photography Club (DCPC)',
    service: 'Member Enrollment API',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  // Wait up to 30 seconds for concurrent requests to avoid race conditions.
  if (!lock.tryLock(30000)) {
    return jsonResponse({
      status: 'error',
      message: 'The enrollment service is busy. Please try again.'
    });
  }

  try {
    let sheet;
    if (SPREADSHEET_ID && SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID') {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    } else {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    }

    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    const requiredFields = ['nameBn', 'nameEn', 'mobile', 'collegeRoll', 'trxId'];
    const missingField = requiredFields.find(function(field) {
      return !String(data[field] || '').trim();
    });
    if (missingField) {
      return jsonResponse({
        status: 'error',
        message: 'Required enrollment information is missing.'
      });
    }

    const mobile = String(data.mobile).trim();
    if (!/^01[3-9]\d{8}$/.test(mobile)) {
      return jsonResponse({
        status: 'error',
        message: 'Please provide a valid Bangladesh mobile number.'
      });
    }

    const timestamp = new Date();
    const formattedTimestamp = Utilities.formatDate(timestamp, "Asia/Dhaka", "dd/MM/yyyy HH:mm:ss");

    const row = [
      formattedTimestamp,
      safeCell(data.nameBn),
      safeCell(data.nameEn),
      safeCell(data.dob),
      safeCell(data.bloodGroup),
      safeCell(data.classYear),
      safeCell(data.department),
      safeCell(data.session),
      safeCell(data.collegeRoll),
      safeCell(data.section),
      safeCell(mobile),
      safeCell(data.whatsapp),
      safeCell(data.email),
      safeCell(data.presentAddress),
      safeCell(data.permanentAddress),
      safeCell(data.guardianInfo),
      safeCell(data.facebookLink),
      safeCell(data.device),
      safeCell(data.cameraModel),
      safeCell(data.experience),
      safeCell(Array.isArray(data.interests) ? data.interests.join(', ') : data.interests),
      safeCell(data.reason),
      safeCell(data.paymentMethod),
      safeCell(data.trxId ? String(data.trxId).toUpperCase().trim() : ''),
      'Pending Verification'
    ];

    sheet.appendRow(row);

    const result = {
      status: 'success',
      message: 'Enrollment recorded successfully in DCPC Database!',
      timestamp: formattedTimestamp,
      referenceId: 'DCPC-' + Utilities.formatDate(timestamp, "Asia/Dhaka", "yyMMdd") + '-' + (sheet.getLastRow() - 1)
    };

    return jsonResponse(result);

  } catch (error) {
    console.error(error);
    return jsonResponse({
      status: 'error',
      message: 'The enrollment could not be saved. Please try again.'
    });
  } finally {
    lock.releaseLock();
  }
}

function safeCell(value) {
  const text = String(value || '').trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
