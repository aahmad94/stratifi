const drawArc = (_ctx, centerX, centerY, radius, startAngle, endAngle) => {
  _ctx.beginPath();
  _ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  _ctx.stroke();
};

const drawPieSlice = (_ctx, centerX, centerY, radius, startAngle, endAngle, color) => {
  if (color === "grd") {
    const grd = _ctx.createLinearGradient(0, 0, 0, radius);
    grd.addColorStop(0.7, "#00ca41"); // green
    grd.addColorStop(1, "#f39f09"); // orange
    _ctx.fillStyle = grd;
  } else {
    _ctx.fillStyle = color;
  }
  _ctx.beginPath();
  _ctx.moveTo(centerX, centerY);
  _ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  _ctx.closePath();
  _ctx.fill();
};

var Piechart = function (options) {
  this.options = options;
  this.canvas = options.canvas;
  this.ctx = this.canvas.getContext("2d");
  this.colors = options.colors;

  this.draw = function () {
    let totalValue = 0;
    let colorsIdx = 0;
    for (var categ in this.options.data) {
      if (categ) {
        const val = this.options.data[categ];
        totalValue += val;
      }
    }

    let startAngle = Math.PI + Math.PI / 2;
    for (categ in this.options.data) {
      if (categ) {

        const val = this.options.data[categ];
        var sliceAngle = 2 * Math.PI * val / totalValue;
        
        drawPieSlice(
          this.ctx,
          this.canvas.width / 2,
          this.canvas.height / 2,
          Math.min(this.canvas.width / 2 * this.options.scaleFactor, this.canvas.height / 2 * this.options.scaleFactor),
          startAngle,
          startAngle + sliceAngle,
          this.colors[colorsIdx % this.colors.length]
        );
        
        startAngle += sliceAngle;
        colorsIdx++;
      }
    }

    //drawing a white circle over the chart
    //to create the doughnut chart
    if (this.options.doughnutHoleSize) {
      drawPieSlice(
        this.ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        this.options.doughnutHoleSize * Math.min(this.canvas.width / 2 * this.options.scaleFactor, this.canvas.height / 2 * this.options.scaleFactor),
        0,
        2 * Math.PI,
        "#ffffff"
      );
    }
    
  };
};

const writeText = (_ctx, text, font, color, centerX, centerY) => {
  _ctx.font = font;
  _ctx.fillStyle = color;
  _ctx.fillText(text, centerX, centerY);
};

window.onload = () => {
  const canvas = document.getElementById('pie-chart-canvas');
  const ctx = canvas.getContext('2d');
  canvas.height = 250; // 174
  canvas.width = 250; // 185
    
  const outerData = {
    "darker blue": 50,
    "lighter blue": 50
  };

  const innerData = {
    "green": 25,
    "grey": 75,
  };

  const outerPieChart = new Piechart(
    {
      canvas: canvas,
      scaleFactor: 1,
      data: outerData,
      colors: ["#c4fffa", "#b5e6fd"],
      doughnutHoleSize: 0.925
    }
  );

  const innerPieChart = new Piechart(
    {
      canvas: canvas,
      scaleFactor: 0.825,
      data: innerData,
      colors: ["grd", "#d3d6db"],
      doughnutHoleSize: 0.85 
    }
  );

  // ------ bar graph animation ------
  const move = (itemId, max) => {
    var elem = document.querySelector(`#${itemId}`);
    var width = 1;
    const frame = () => {
      if (width >= max) {
        clearInterval(id);
      } else {
        width++;
        elem.style.width = width + '%';
      }
    };
    let id = setInterval(frame, 10);
  };
  

  move("first", 100);
  move("second", 66);
  move("third", 75);
  move("fourth", 85);

  outerPieChart.draw();
  innerPieChart.draw();
  writeText(ctx, "2.5", "62px Arial", "#00cc3d", 82.5, 140);
  writeText(ctx, "out of 10", "20px Arial", "#7a8b94", 85, 170);
};
