class Scraper
  def init
  end

  def call
    timestamp = Time.now.to_i.to_s
    response = HTTParty.get("https://www.trackingthepros.com/d/list_bootcamp?existing=no&_=" + timestamp)

    data = JSON.parse(response)["data"]

    pros = data.map do |pro|
      {
        player: self.removeATag(pro["player"]),
        summoner: self.removeATag(pro["summoner"]),
        role: pro["role"].gsub(" (Sub)", ""),
        team: pro["team_plug"].gsub("-", " "),
        win_percent: pro["winper"].to_f,
        wins: pro["wins"].to_i,
        losses: pro["losses"].to_i,
        rank: pro["rankHigh"],
        lp: pro["rankHighLP"].to_i,
      }
    end

    pros.map! do |pro|
      pro[:games] = pro[:wins] + pro[:losses]
      pro[:region] = self.teams[pro[:team].to_sym][:region]
      pro
    end

    pros
  end

  # "<a href='https://www.trackingthepros.com/player/Dreams/'>Dreams</a>"
  # Returns
  # "Dreams"
  def removeATag(str)
    first_index = str.index(">")
    result = str[(first_index + 1)..-1]
    second_index = result.index("<")
    result = result[0...second_index]
    return result
  end

  def teams
    teams = {
      "Team Vitality":{
        region: "EU",
        color: "#fcaa3a",
        secondaryColor: "",
      },
      "100 Thieves":{
        region: "NA",
        color: "#d41317", # red
        secondaryColor: "#000000",
      },
      "Fnatic":{
        region: "EU",
        color: "#f39f21", # yellow
        secondaryColor: "",
      },
      "Invictus Gaming":{
        region: "CN",
        color: "#000000", # black
        secondaryColor: "",
      },
      "Royal Never Give Up":{
        region: "CN",
        color: "#b59267",
        secondaryColor: "",
      },
      "Phong Vũ Buffalo":{
        region: "VN",
        color: "#ed0f10",
        secondaryColor: "#000000",
      },
      "Cloud9":{
        region: "NA",
        color: "#00aef3",
        secondaryColor: "#0075c0",
      },
      "Dire Wolves":{
        region: "OCE",
        color: "#00ad84",
        secondaryColor: "#4f515a",
      },
      "G Rex":{
        region: "LMS",
        color: "#d4152c", # red
        secondaryColor: "#431f5b", # purple
        tertiaryColor: "#aa277e" # cyan
      },
      "G2 Esports":{
        region: "EU",
        color: "#8e8e8e",
        secondaryColor: "#c6c6c6",
      },
      "KaBuM! e Sports":{
        region: "BR",
        color: "#ed5600",
        secondaryColor: "#000",
      },
      "Gen.G":{
        region: "KR",
        color: "#af8f1d",
        secondaryColor: "#000",
      },
      "Team Liquid":{
        region: "NA",
        color: "#0d2141",
        secondaryColor: "#fff",
      },
      "MAD Team":{
        region: "LMS",
        color: "#000000",
        secondaryColor: "#fff",
      },
      "EDward Gaming":{
        region: "CN",
        color: "#1c110c", # black
        secondaryColor: "#fff",
      },
      "SuperMassive eSports":{
        region: "TR",
        color: "#00295e", # dark blue
        secondaryColor: "#0071ff", # lighter blue
      },
      "Ascension Gaming":{
        region: "SEA",
        color: "#f9942f",
        secondaryColor: "#fff",
      },
      "Gambit Esports":{
        region: "CIS",
        color: "#c00800",
        secondaryColor: "#fff",
      },
      "DetonatioN FocusMe":{
        region: "JP",
        color: "#00aaee",
        secondaryColor: "#000",
      },
      "Kaos Latin Gamers":{
        region: "LAS",
        color: "#ff0000", # light red
        secondaryColor: "#df0000", # darker red
      },
    }
  end

end

