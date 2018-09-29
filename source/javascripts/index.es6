function renderPlot(initial) {
  let mobile = window.innerWidth <= 480;

  const minGames = parseInt($(".js-min-games")[0].value);
  const maxGames = parseInt($(".js-max-games")[0].value);

  let massagedData = data.filter(pro => {
    return pro.games < maxGames && pro.games > minGames
  });

  massagedData = massagedData.sort((proA, proB) => {
    const nameA = proA.player.toUpperCase();
    const nameB = proB.player.toUpperCase();
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  });

  const plotlyData = dataToPlotlyData(massagedData);
  const layout = generateLayout({ mobile });
  const config = {
    responsive: true,
    displayModeBar: false,
  }

  if (initial) {
    Plotly.newPlot('graphing-the-pros', plotlyData, layout, config);
  } else {
    Plotly.react('graphing-the-pros', plotlyData, layout, config);
  }
}

function dataToPlotlyData(data) {
  var plotlyData = data.map(pro => {
    return {
      x: [pro.games],
      y: [lpFromPlatIII(pro)],
      name: pro.player,
      mode: "markers",
      marker: {
        size: 8
      },
      type: "scatter",
      hoverinfo: "text+markers",
      text: [`${pro.player}<br>${pro.rank}, ${pro.lp} LP<br>${pro.win_percent}% WR`],
    }
  });

  return plotlyData;
}

function lpFromPlatIII(pro) {
  var ranks = ["Platinum III", "Platinum II", "Platinum I", "Diamond V", "Diamond IV", "Diamond III", "Diamond II", "Diamond I", "Master"];

  if (pro.rank === "Unranked") {
    return parseInt(pro.lp)
  } else if (pro.rank === "Challenger") {
    var rankIndex = ranks.indexOf("Master");
    return parseInt(pro.lp) + (rankIndex * 100);
  } else {
    var rankIndex = ranks.indexOf(pro.rank);
    return parseInt(pro.lp) + (rankIndex * 100);
  }
}

function generateLayout(options) {
  var layout = {
    xaxis: {
      title: "Games Played",
    },
    yaxis: {
      tickvals: [0, 100, 200, 300, 400, 500, 600, 700, 800, 1000, 1175],
      ticktext: ["Plat III", "Plat II", "Plat I", "D V", "D IV", "D III", "D II", "D I", "Master", "200LP", "≈ Challenger"],
    },
    margin: {
      // l: 150,
      // r: 150,
      // b: 100,
      t: 25,
      // pad: 4
    }, 
    hovermode: "closest",

    showlegend: !options.mobile,
    // legend: {
    //   orientation: "h",
    // },
  }
  
  return layout;
}

const $ = (selector) => {
  if (selector.charAt(0) === "#") {
    return document.querySelector(selector);
  } else {
    return document.querySelectorAll(selector);
  }
}

function debounce(func, wait) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;
      
    var later = function() {
      timeout = null;
    };
  
    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
  };
};

document.addEventListener("change", (event) => {
  if (event.target.classList.contains("js-input")) {
    renderPlot();
  }
});

renderPlot();