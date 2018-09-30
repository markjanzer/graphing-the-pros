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
        plotlyDatum.marker.color = teamColors()[plotlyDatum.name];
      } else if (sort === "region") {
        plotlyDatum.marker.color = regionColors()[plotlyDatum.name];
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

const teamColors = () => {
  return {
    "Team Vitality": '#e6194b',
    "100 Thieves": '#3cb44b',
    "Fnatic": '#ffe119',
    "Invictus Gaming": '#4363d8',
    "Royal Never Give Up": '#f58231',
    "Phong Vũ Buffalo": '#911eb4',
    "Cloud9": '#46f0f0',
    "Dire Wolves": '#f032e6',
    "G Rex": '#bcf60c',
    "G2 Esports": '#fabebe',
    "KaBuM! e Sports": '#008080',
    "Gen.G": '#e6beff',
    "Team Liquid": '#9a6324',
    "MAD Team": '#fffac8',
    "EDward Gaming": '#800000',
    "SuperMassive eSports": '#aaffc3',
    "Ascension Gaming": '#808000',
    "Gambit Esports": '#000000',
    "DetonatioN FocusMe": '#000075',
    "Kaos Latin Gamers": '#808080',
  }
}

const regionColors = () => {
  return {
    "NA": '#e6194b',
    "EU": '#3cb44b',
    "CN": '#ffe119',
    "LMS": '#4363d8',
    "VN": '#f58231',
    "OCE": '#911eb4',
    "JP": '#46f0f0',
    "CIS": '#f032e6',
    "BR": '#bcf60c',
    "TR": '#fabebe',
    "LAS": '#008080',
    "SEA": '#e6beff',
    "KR": '#9a6324',
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
    event.target.classList.contains("js-sort")) {
    renderPlot();
  }
});

// Set max games to Rekkles + 20, fallback to 270
$(".js-max-games")[0].value = (data.find(pro => pro.player === "Rekkles").games + 20) || 270;
renderPlot();