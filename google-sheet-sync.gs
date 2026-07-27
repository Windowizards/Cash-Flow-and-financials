// CyberDollar <-> Google Sheet two-way sync
//
// SETUP (one time, ~3 minutes):
// 1. Open your Google Sheet
// 2. Extensions > Apps Script
// 3. Delete whatever is in the editor, paste this entire file, hit Save (disk icon)
// 4. Click Deploy > New deployment
//    - Click the gear icon > select "Web app"
//    - Description: CyberDollar sync
//    - Execute as: Me
//    - Who has access: Anyone
//    - Click Deploy, approve the permissions popup (Advanced > Go to project if warned)
// 5. Copy the Web app URL (ends in /exec)
// 6. Paste that URL into the CyberDollar app: Overview tab > Google Sheet sync box
//
// After that: "Push to Sheet" writes your app data into clean tabs here,
// "Pull from Sheet" reads any edits you made in those tabs back into the app.

var TABS = {
  Cash: ['name', 'balance', 'notes'],
  Owed: ['name', 'amount', 'close', 'due', 'notes'],
  Incoming: ['name', 'amount', 'notes'],
  Monthly: ['name', 'amount', 'dueDay', 'type'],
  ZeroCards: ['name', 'balance', 'limit', 'promoEnd', 'notes'],
  ChinaOrder: ['name', 'amount', 'paid', 'status', 'notes'],
  Purchases: ['name', 'amount', 'date', 'status', 'notes'],
  BigDebts: ['name', 'amount', 'limit', 'notes'],
};

var KEYMAP = {
  Cash: 'accounts',
  Owed: 'cards',
  Incoming: 'incoming',
  Monthly: 'monthly',
  ZeroCards: 'zeroCards',
  ChinaOrder: 'chinaOrder',
  Purchases: 'personalPurchases',
  BigDebts: 'debts',
};

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(TABS).forEach(function (tabName) {
    var key = KEYMAP[tabName];
    var rows = data[key] || [];
    var sh = ss.getSheetByName(tabName) || ss.insertSheet(tabName);
    sh.clearContents();
    var cols = TABS[tabName];
    sh.getRange(1, 1, 1, cols.length).setValues([cols]);
    if (rows.length) {
      var values = rows.map(function (r) {
        return cols.map(function (c) { return r[c] == null ? '' : r[c]; });
      });
      sh.getRange(2, 1, rows.length, cols.length).setValues(values);
    }
  });
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, updated: new Date().toISOString() }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var out = {};
  Object.keys(TABS).forEach(function (tabName) {
    var sh = ss.getSheetByName(tabName);
    if (!sh) return;
    var values = sh.getDataRange().getValues();
    if (values.length < 2) { out[KEYMAP[tabName]] = []; return; }
    var cols = TABS[tabName];
    var rows = [];
    for (var i = 1; i < values.length; i++) {
      var row = {};
      var empty = true;
      for (var j = 0; j < cols.length; j++) {
        var v = values[i][j];
        if (v !== '' && v != null) empty = false;
        if (v instanceof Date) {
          v = Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        }
        row[cols[j]] = v;
      }
      if (!empty) rows.push(row);
    }
    out[KEYMAP[tabName]] = rows;
  });
  return ContentService
    .createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
