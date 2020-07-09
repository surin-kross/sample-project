// function runTest() {
//   Logger.log("Hello World! test!");
// }

const runTest = () => {
  Logger.log("Hello World! es6test!");
};

function renameSpreadsheet() {
  var SHEET_FILE_ID = "1i5YXaRDrTk6jxCnGKk-odzafBNIJx3gXXzjFJzVpOeU";
  var sheet = SpreadsheetApp.openById(SHEET_FILE_ID);
  sheet.rename("2017 Avocado Prices in Portland, Seattle");
}

function duplicateAndOrganizeActiveSheet() {
  var SHEET_FILE_ID = "1i5YXaRDrTk6jxCnGKk-odzafBNIJx3gXXzjFJzVpOeU";
  var sheet = SpreadsheetApp.openById(SHEET_FILE_ID);
  var duplicateSheet = sheet.duplicateActiveSheet();

  duplicateSheet.setName("Sheet_" + duplicateSheet.getSheetId());

  duplicateSheet.autoResizeColumns(1, 5);
  duplicateSheet.setFrozenRows(2);

  var myRange = duplicateSheet.getRange("F2:F");
  myRange.moveTo(duplicateSheet.getRange("C2"));

  myRange = duplicateSheet.getRange("A3:D55");
  myRange.sort(3);
}
