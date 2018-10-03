function renderPlot(initial) {
  let mobile = window.innerWidth <= 480;
  let sortBy = $(".js-sort")[0].selectedOptions[0].value

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

  const plotlyData = dataToPlotlyData(massagedData, sortBy);
  console.log(plotlyData);
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
  let plotlyData = [];

  data.forEach(pro => {
    let plotlyDatum = plotlyData.find(pd => pd.name === pro[sort]);
    if (plotlyDatum) {
      plotlyDatum.x.push(pro.games);
      plotlyDatum.y.push(lpFromPlatIII(pro));
      plotlyDatum.text.push(`${pro.player}<br>${pro.rank}, ${pro.lp} LP<br>${pro.win_percent}% WR`)
    } else {
      plotlyDatum = {
        x: [pro.games],
        y: [lpFromPlatIII(pro)],
        name: pro[sort],
        mode: "markers",
        marker: {
          size: 8
        },
        type: "scatter",
        hoverinfo: "text+markers",
        text: [`${pro.player}<br>${pro.rank}, ${pro.lp} LP<br>${pro.win_percent}% WR`],
      }

      if (sort === "team") {
        plotlyDatum.marker.color = teamColors(plotlyDatum.name);
      } else if (sort === "region") {
        plotlyDatum.marker.color = regionColors(plotlyDatum.name);
      }

      plotlyData.push(plotlyDatum);
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

const colors = ["#543aad", "#6fad45", "#ab68dc", "#c09437", "#637bd6", "#d05235", "#5a9dbe", "#d23e70", "#61a886", "#cd4eb3", "#4e612f", "#653685", "#c4906e", "#454e7b", "#7d3e2a", "#b28cc5", "#793358", "#d37d95"]
const regions = ["NA", "EU", "CN", "LMS", "VN", "OCE", "JP", "CIS", "BR", "TR", "LAS", "SEA", "KR"];
const teams = ["Team Vitality", "100 Thieves", "Fnatic", "Invictus Gaming", "Royal Never Give Up", "Phong Vũ Buffalo", "Cloud9", "Dire Wolves", "G Rex", "G2 Esports", "KaBuM! e Sports", "Gen.G", "Team Liquid", "MAD Team", "EDward Gaming", "SuperMassive eSports", "Ascension Gaming", "Gambit Esports", "DetonatioN FocusMe", "Kaos Latin Gamers", "Infinity eSports"]

const teamColors = (teamName) => {
  return colors[teams.indexOf(teamName)];
}

const regionColors = (regionName) => {
  return colors[regions.indexOf(regionName)];
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
    event.target.classList.contains("js-sort")) {
    renderPlot();
  }
});

// Set max games to Rekkles + 20, fallback to 270
$(".js-max-games")[0].value = (data.find(pro => pro.player === "Rekkles").games + 20) || 270;
renderPlot();