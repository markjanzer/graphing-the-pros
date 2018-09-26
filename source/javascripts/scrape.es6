// Script for getting data from
// https://www.trackingthepros.com/bootcamp

function getObject(tableRow) {
  var tableData = tableRow.querySelectorAll("td");

  var id = tableRow.id;
  var team = tableData[1].children[0].innerText.trim();
  var player = tableData[2].children[0].innerText;
  var summonerName = tableData[3].children[0].innerText;
  var role = tableData[4].innerText;
  var rank = tableData[5].innerText;
  var lp = parseInt(tableData[6].innerText);
  var wins = parseInt(tableData[7].innerText.replace(/,/g, ''));
  var losses = parseInt(tableData[8].innerText.replace(/,/g, ''));
  var winPercent = parseFloat(tableData[9].innerText);
  var games = wins + losses

  var obj = { id, team, player, summonerName, role, rank, lp, wins, losses, winPercent, games };

  return obj;
}

var tableRows = document.getElementById("displayTable").querySelector("tbody").querySelectorAll("tr")
tableRows = Array.from(tableRows);
var jsonResult = tableRows.map(tableRow => getObject(tableRow));
console.log(JSON.stringify(jsonResult));