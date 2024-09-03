const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public")); // Serve static files like CSS

// Sample data (this can be replaced by API data or database queries)
const chartData = [
  {
    category: "Jan 2023",
    electric: 20000,
    electricOther: -10000, // Negative value
    water: 3000,
    waterOther: 800,
    sewer: 2000,
    gas: 5000,
    gasOther: 1200,
    other: -1000, // Negative value
    baseline: 15000,
  },
  {
    category: "Feb 2023",
    electric: 15000,
    electricOther: 4000,
    water: -2500, // Negative value
    waterOther: 700,
    sewer: 1800,
    gas: 4000,
    gasOther: -1100, // Negative value
    other: 900,
    baseline: 13000,
  },
  {
    category: "Mar 2023",
    electric: -18000, // Negative value
    electricOther: 4500,
    water: 2700,
    waterOther: 750,
    sewer: 1900,
    gas: 4500,
    gasOther: 1150,
    other: 950,
    baseline: 14000,
  },
  {
    category: "Apr 2023",
    electric: 16000,
    electricOther: -4200, // Negative value
    water: 2400,
    waterOther: 720,
    sewer: -1700, // Negative value
    gas: 4200,
    gasOther: 1000,
    other: 900,
    baseline: 12000,
  },
  {
    category: "May 2023",
    electric: 17000,
    electricOther: 4300,
    water: 2600,
    waterOther: -800, // Negative value
    sewer: 1800,
    gas: 4300,
    gasOther: 1050,
    other: 950,
    baseline: 13500,
  },
  {
    category: "Jun 2023",
    electric: -20000, // Negative value
    electricOther: 4700,
    water: 2800,
    waterOther: 850,
    sewer: 2000,
    gas: 4700,
    gasOther: 1200,
    other: 18000,
    baseline: 15000,
  },
  {
    category: "Jul 2023",
    electric: 19000,
    electricOther: -4800, // Negative value
    water: 2900,
    waterOther: 900,
    sewer: 2100,
    gas: -4800, // Negative value
    gasOther: 1300,
    other: 1100,
    baseline: 16000,
  },
  {
    category: "Aug 2023",
    electric: 12000,
    electricOther: 3000,
    water: 2000,
    waterOther: 600,
    sewer: -1500, // Negative value
    gas: 3500,
    gasOther: 900,
    other: 800,
    baseline: 9000,
  },
  // Add more data as needed
];

// Route to render the chart
app.get("/chart", (req, res) => {
  res.render("chart", { data: chartData });
});

// Route to generate PDF and allow download
app.get("/download-pdf", async (req, res) => {
  try {
    // Render the EJS template to HTML
    const htmlContent = await ejs.renderFile(
      path.join(__dirname, "views", "chart.ejs"),
      { data: chartData }
    );

    // console.log('html', htmlContent)

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the content of the page to the rendered HTML
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Set the viewport to the desired size (optional)
    await page.setViewport({ width: 1280, height: 1024 });

    // Take a screenshot
    const screenshotPath = path.join(
      __dirname,
      "output",
      "chart_screenshot.png"
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // Create a PDF from the screenshot
    const pdfPath = path.join(__dirname, "output", "chart.pdf");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await fs.promises.writeFile(pdfPath, pdfBuffer);

    await browser.close();

    // Send the PDF as a download
    res.download(pdfPath, "chart.pdf", (err) => {
      if (err) {
        console.error("Error downloading the PDF:", err);
        res.status(500).send("Error downloading the PDF");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
