/**
 * A special function that runs when the spreadsheet is opened
 * or reloaded, used to add a custom menu to the spreadsheet.
 */
function onOpen() {
  // Get the Ui object.
  var ui = SpreadsheetApp.getUi();

  // Create a custom menu.
  ui.createMenu("Present dataset")
    .addItem(
      'Chart "Dates and USD Exchange Rates dataset"',
      "createEmbeddedLineChart"
    )
    .addItem("Export charts to Slides", "exportChartsToSlides")
    .addToUi();
}

function createEmbeddedLineChart() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const chartDataRange = sheet.getRange(
    "Dates and USD Exchange Rates dataset!A2:F102"
  );
  const hAxisOptions = {
    slantedText: true,
    slantedTextAngle: 60,
    gridlines: { count: 12 },
  };

  const lineChartBuilder = sheet.newChart().asLineChart();
  const chart = lineChartBuilder
    .addRange(chartDataRange)
    .setPosition(5, 8, 0, 0)
    .setTitle("USD Exchange rates")
    .setNumHeaders(1)
    .setLegendPosition(Charts.Position.RIGHT)
    .setOption("hAxis", hAxisOptions)
    .build();

  sheet.insertChart(chart);
}

function exportChartsToSlides() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let charts = [];
  const sheets = ss.getSheets();

  for (let i = 0; i < sheets.length; i++) {
    charts = charts.concat(sheets[i].getCharts());
  }

  if (charts.length == 0) {
    ss.toast("No charts to export!");
    return;
  }

  const presentationTitle = ss.getName() + " Presentation";
  const slides = SlidesApp.create(presentationTitle);
  slides.getSlides()[0].remove();

  const position = { left: 40, top: 30 };
  const size = { height: 340, width: 430 };

  for (let i = 0; i < charts.length; i++) {
    const newSlide = slides.appendSlide();
    newSlide.insertSheetsChart(
      charts[i],
      position.left,
      position.top,
      size.width,
      size.height
    );
  }

  const slidesUrl = slides.getUrl();
  const html =
    "<p>Find it in your home Drive folder:</p>" +
    '<p><a href="' +
    slidesUrl +
    '" target="_blank">' +
    presentationTitle +
    "</a></p>";

  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(html).setHeight(120).setWidth(350),
    "Created a presentation"
  );
}
