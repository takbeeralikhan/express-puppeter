let root1 = am5.Root.new("chartdiv1");

root1.setThemes([am5themes_Animated.new(root1)]);

let chart1 = root1.container.children.push(
  am5xy.XYChart.new(root1, {
    panY: false,
    layout: root1.verticalLayout,
    paddingTop: 100,
    paddingBottom: -70,
  })
);

let data1 = <%- JSON.stringify(data) %>;

let xAxis1 = chart1.xAxes.push(
  am5xy.CategoryAxis.new(root1, {
    categoryField: "category",
    renderer: am5xy.AxisRendererX.new(root1, { minGridDistance: 30 }),
  })
);

// Remove inside vertical grid lines
xAxis1.get("renderer").grid.template.setAll({
  visible: false,
});

xAxis1.data.setAll(data1);

let yAxis1 = chart1.yAxes.push(
  am5xy.ValueAxis.new(root1, {
    renderer: am5xy.AxisRendererY.new(root1, {}),
    min: 10000, // Start y-axis from 5000
  })
);

function createSeries1(name, field, color, pattern = null) {
  let series = chart1.series.push(
    am5xy.ColumnSeries.new(root1, {
      name: name,
      xAxis: xAxis1,
      yAxis: yAxis1,
      valueYField: field,
      categoryXField: "category",
      stacked: true,
      fill: pattern ? am5.Pattern.new(root1, { template: pattern }) : am5.color(color),
      stroke: pattern ? am5.Pattern.new(root1, { template: pattern }) : am5.color(color),
    })
  );
  series.data.setAll(data1);
  return series;
}

let electricPattern1 = am5.Pattern.new(root1, {
  pattern: am5.LinePattern.new(root1, {
    color: am5.color(0x67b7dc),
    width: 3,
    height: 3,
    strokeWidth: 1,
    rotation: 45,
  }),
});

createSeries1("Elec (kWh)", "electric", 0x4eac5b);
createSeries1("Water", "water", 0x2489f9);
createSeries1("Sewer", "sewer", 0x40189d);
createSeries1("Nat (Gas)", "gas", 0xffff00);
createSeries1("Elec (Other)", "electricOther", 0xee4b1d); // New field
createSeries1("Water (Other)", "waterOther", 0x64b5f6); // New field
createSeries1("Gas (Other)", "gasOther", 0xffff00); // New field
createSeries1("Other", "other", 0xdcdcdc); // New field

let lineSeries1 = chart1.series.push(
  am5xy.LineSeries.new(root1, {
    name: "Baseline",
    xAxis: xAxis1,
    yAxis: yAxis1,
    valueYField: "baseline",
    categoryXField: "category",
    stroke: am5.color(0xa7da18),
    fill: am5.color(0x000000),
  })
);

lineSeries1.data.setAll(data1);

lineSeries1.bullets.push(function () {
  return am5.Bullet.new(root1, {
    sprite: am5.Circle.new(root1, {
      radius: 5,
      fill: lineSeries1.get("fill"),
    }),
  });
});

let legend1 = chart1.children.push(
  am5.Legend.new(root1, {
    centerX: am5.p0, // Align legend to the left
    x: am5.p0, // Position the legend at the left
    y: am5.p0,
    centerY: am5.p100,
    layout: root1.horizontalLayout,
    paddingBottom: 40,
    paddingRight: -100,
    
  })
);

legend1.markerRectangles.template.setAll({
  cornerRadiusTL: 20,
  cornerRadiusTR: 20,
  cornerRadiusBL: 20,
  cornerRadiusBR: 20,
  width: 10,
  height: 10,
  stroke: am5.color(0x000000), // Add border color if necessary
});

legend1.markers.template.setAll({
  width: 10,
  padding: 0,
  height: 10,
  fillOpacity: 1,
});

legend1.itemContainers.template.setAll({
  paddingRight: -50,
});

// legend1.data.setAll(chart1.series.values);
legend1.data.setAll(chart1.series.values.filter(series => series !== lineSeries1));

chart1.set("cursor", am5xy.XYCursor.new(root1, {}));
