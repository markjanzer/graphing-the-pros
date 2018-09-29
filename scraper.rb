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
        role: pro["role"],
        team: pro["team_plug"].gsub("-", " "),
        win_percent: pro["winper"].to_f,
        wins: pro["wins"].to_i,
        losses: pro["losses"].to_i,
        rank: pro["rankHigh"],
        lp: pro["rankHighLP"].to_i,
        games: pro["wins"].to_i + pro["losses"].to_i
      }
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

end

