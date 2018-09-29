var ranks = ["Platinum III", "Platinum II", "Platinum I", "Diamond V", "Diamond IV", "Diamond III", "Diamond II", "Diamond I", "Master"];

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

var dataWithoutManyGames = data.filter(pro => {
  // return pro;
  return pro.games < 250 && pro.games > 20
});


dataWithoutManyGames = dataWithoutManyGames.sort((proA, proB) => {
  var nameA = proA.player.toUpperCase();
  var nameB = proB.player.toUpperCase();
  if (nameA < nameB) {
    return -1;
  } else if (nameA > nameB) {
    return 1;
  } else {
    return 0;
  }
});

var plotlyData = dataWithoutManyGames.map(pro => {
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


var layout = {
  xaxis: {
    title: "Games Played",
    // showspikes: true,
  },
  yaxis: {
    tickvals: [0, 100, 200, 300, 400, 500, 600, 700, 800, 1000, 1175],
    ticktext: ["Plat III", "Plat II", "Plat I", "D V", "D IV", "D III", "D II", "D I", "Master", "200LP", "≈ Challenger"],
  },
  // autosize: false,
  // width: 1600,
  // height: 1000,
  margin: {
    // l: 150,
    // r: 150,
    // b: 100,
    t: 25,
    // pad: 4
  }, 
  hovermode: "closest",
  // showlegend: false,

}

var config = {
  responsive: true,
  displayModeBar: false,
}

Plotly.newPlot('graphing-the-pros', plotlyData, layout, config);