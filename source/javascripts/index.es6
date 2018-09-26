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
    hoverinfo: "markers+text",
    text: [`${pro.player}<br>${pro.rank}, ${pro.lp} LP<br>${pro.winPercent}% WR`],
  }
});

var layout = {
  title: "Tracking the Pros",
  xaxis: {
    title: "Games Played",
  },
  yaxis: {
    title: "Rank",
    tickvals: [0, 100, 200, 300, 400, 500, 600, 700, 800, 1000, 1175],
    ticktext: ["Platinum III", "Platinum II", "Platinum I", "Diamond V", "Diamond IV", "Diamond III", "Diamond II", "Diamond I", "Master", "200LP", "≈ Challenger"]
  },
  // responsive: true,
  // autosize: false,
  // width: 1600,
  // height: 1000,
  margin: {
    // l: 150,
    // r: 150,
    // b: 100,
    // t: 100,
    // pad: 4
  }, 
  hovermode: "closest"
}

var config = {
  responsive: true
}

Plotly.newPlot('graphing-the-pros', plotlyData, layout, { responsive: true });