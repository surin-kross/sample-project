function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu("Quick formats")
    .addItem("Format row header", "formatRowHeader")
    .addItem("Format column header", "formatColumnHeader")
    .addItem("Format dataset", "formatDataset")
    .addSeparator()
    .addSubMenu(
      ui
        .createMenu("Create character sheet")
        .addItem("Episode IV", "createPeopleSheetIV")
        .addItem("Episode V", "createPeopleSheetV")
        .addItem("Episode VI", "createPeopleSheetVI")
    )
    .addToUi();
}

function formatRowHeader() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());

  headerRange
    .setFontWeight("bold")
    .setFontColor("#ffffff")
    .setBackground("#007272")
    .setBorder(
      true,
      true,
      true,
      true,
      null,
      null,
      null,
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );
}

function formatColumnHeader() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const numRows = sheet.getDataRange().getLastRow() - 1;
  const columnHeaderRange = sheet.getRange(2, 1, numRows, 1);

  columnHeaderRange
    .setFontWeight("bold")
    .setFontStyle("italic")
    .setBorder(
      true,
      true,
      true,
      true,
      null,
      null,
      null,
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );

  hyperlinkColumnHeaders_(columnHeaderRange, numRows);
}

function hyperlinkColumnHeaders_(headerRange, numRows) {
  const headerColIndex = 1;
  const urlColIndex = columnIndexOf_("url");

  if (urlColIndex == -1) return;

  const urlRange = headerRange.offset(0, urlColIndex - headerColIndex);
  const headerValues = headerRange.getValues();
  const urlValues = urlRange.getValues();

  for (let row = 0; row < numRows; row++) {
    headerValues[row][0] =
      '=HYPERLINK("' + urlValues[row] + '","' + headerValues[row] + '")';
  }
  headerRange.setValues(headerValues);

  SpreadsheetApp.getActiveSheet().deleteColumn(urlColIndex);
}

function columnIndexOf_(colName) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const columnHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  const columnNames = columnHeaders.getValues();

  for (let col = 1; col <= columnNames[0].length; col++) {
    if (columnNames[0][col - 1] === colName) return col;
  }
  return -1;
}

function formatDataset() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const fullDataRange = sheet.getDataRange();

  const noHeaderRange = fullDataRange.offset(
    1,
    1,
    fullDataRange.getNumRows() - 1,
    fullDataRange.getNumColumns() - 1
  );

  if (!noHeaderRange.getBandings()[0]) {
    noHeaderRange.applyRowBanding(
      SpreadsheetApp.BandingTheme.LIGHT_GREY,
      false,
      false
    );
  }

  formatDates_(columnIndexOf_("release_date"));
  fullDataRange.setBorder(
    true,
    true,
    true,
    true,
    null,
    null,
    null,
    SpreadsheetApp.BorderStyle.SOLID_MEDIUM
  );

  sheet.autoResizeColumns(1, fullDataRange.getNumColumns());
  sheet.autoResizeRows(1, fullDataRange.getNumRows());
}

function formatDates_(colIndex) {
  if (colIndex < 0) return;
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet
    .getRange(2, colIndex, sheet.getLastRow() - 1, 1)
    .setNumberFormat("mmmm dd, yyyy (dddd)");
}

function createPeopleSheetIV() {
  createResourceSheet_("characters", 1, "IV");
}

function createPeopleSheetV() {
  createResourceSheet_("characters", 2, "V");
}

function createPeopleSheetVI() {
  createResourceSheet_("characters", 3, "VI");
}

function createResourceSheet_(resourceType, idNumber, episodeNumber) {
  const filmData = fetchApiResourceObject_(
    "https://swapi.co/api/films/" + idNumber
  );
  const resourceUrls = filmData[resourceType];

  let resourceDataList = [];
  for (let i = 0; i < resourceUrls.length; i++) {
    resourceDataList.push(fetchApiResourceObject_(resourceUrls[i]));
  }

  const resourceObjectKeys = Object.keys(resourceDataList[0]);
  const resourceSheet = createNewSheet_(
    "Episode " + episodeNumber + " " + resourceType
  );

  filmSheetWithData_(resourceSheet, resourceObjectKeys, resourceDataList);
  formatRowHeader();
  formatColumnHeader();
  formatDataset();
}

function fetchApiResourceObject_(url) {
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const json = response.getContentText();
  const responseObject = JSON.parse(json);

  return responseObject;
}

function createNewSheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);

  if (sheet) return sheet.activate();
  sheet = ss.insertSheet(name);
  return sheet;
}

function fillSheetWithData_(resourceSheet, objectKeys, resourceDataList) {
  const numRows = resourceDataList.length;
  const numColumns = objectKeys.length;

  const resourceRange = resourceSheet.getRange(1, 1, numRows + 1, numColumns);
  const resourceValues = resourceRange.getValues();

  for (let column = 0; column < numColumns; column++) {
    const columnHeader = objectKeys[column];
    resourceValues[0][column] = columnHeader;

    for (let row = 1; row < numRows + 1; row++) {
      const resource = resourceDataList[row - 1];
      const value = resource[columnHeader];
      resourceValues[row][column] = value;
    }
  }

  resourceSheet.clear();
  resourceRange.setValues(resourceValues);
}
