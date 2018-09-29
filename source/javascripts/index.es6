function renderPlot(initial) {
  let mobile = window.innerWidth <= 480;
  let colorBy = $(".js-color")[0].selectedOptions[0].value

  const minGames = parseInt($(".js-min-games")[0].value || 0);
  const maxGames = parseInt($(".js-max-games")[0].value || 0);

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

  const plotlyData = dataToPlotlyData(massagedData, colorBy);
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

function dataToPlotlyData(data, sort) {
  var plotlyData = data.map(pro => {
    let proData = {
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

    if (sort === "role") {
      proData.marker.color = roleColors()[pro.role];
    }

    return proData
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
  let margin = {
    t: 25
  };
  if (options.mobile) {
    margin = {
      l: 50,
      r: 20,
      t: 25
    }
  }

  var layout = {
    xaxis: {
      title: "Games Played",
    },
    yaxis: {
      tickvals: [0, 100, 200, 300, 400, 500, 600, 700, 800, 1000, 1175],
      ticktext: ["Plat III", "Plat II", "Plat I", "D V", "D IV", "D III", "D II", "D I", "Master", "200LP", "Chal"],
    },
    margin: margin,
    hovermode: "closest",
    showlegend: !options.mobile,
  }
  
  return layout;
}

const roleColors = () => {
  return {
    "Top": "rgb(244, 169, 65)",
    "Jungle": "rgb(65, 244, 97)",
    "Mid": "rgb(65, 65, 244)",
    "ADC": "rgb(244, 66, 66)",
    "Support": "rgb(163, 65, 244)",
  }
}

const $ = (selector) => {
  if (selector.charAt(0) === "#") {
    return document.querySelector(selector);
  } else {
    return document.querySelectorAll(selector);
  }
}

document.addEventListener("change", (event) => {
  if (event.target.classList.contains("js-input") ||
    event.target.classList.contains("js-color")) {
    renderPlot();
  }
});

renderPlot();