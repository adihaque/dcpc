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
  // Wait up to 30 seconds for concurrent requests to avoid race conditions
  lock.tryLock(30000);

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

    const timestamp = new Date();
    const formattedTimestamp = Utilities.formatDate(timestamp, "Asia/Dhaka", "dd/MM/yyyy HH:mm:ss");

    const row = [
      formattedTimestamp,
      data.nameBn || '',
      data.nameEn || '',
      data.dob || '',
      data.bloodGroup || '',
      data.classYear || '',
      data.department || '',
      data.session || '',
      data.collegeRoll || '',
      data.section || '',
      data.mobile || '',
      data.whatsapp || '',
      data.email || '',
      data.presentAddress || '',
      data.permanentAddress || '',
      data.guardianInfo || '',
      data.facebookLink || '',
      data.device || '',
      data.cameraModel || '',
      data.experience || '',
      Array.isArray(data.interests) ? data.interests.join(', ') : (data.interests || ''),
      data.reason || '',
      data.paymentMethod || '',
      data.trxId ? data.trxId.toUpperCase().trim() : '',
      'Pending Verification'
    ];

    sheet.appendRow(row);

    const result = {
      status: 'success',
      message: 'Enrollment recorded successfully in DCPC Database!',
      timestamp: formattedTimestamp,
      referenceId: 'DCPC-' + Utilities.formatDate(timestamp, "Asia/Dhaka", "yyMMdd") + '-' + (sheet.getLastRow() - 1)
    };

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
