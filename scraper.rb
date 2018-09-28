# require "watir"
# require "nokogiri"
# require "byebug"
require "HTTParty"

# class Scraper
#   def initialize
#   end

#   def call
#     puts "Scraper called"
#     # This is too fast, td 10 doesn't show up
#     # browser = Watir::Browser.new :chrome, headless: true

#     browser = Watir::Browser.new :chrome
    
#     # This url has the stream toggled off on the first visit
#     browser.goto "https://www.trackingthepros.com/s/toggle_stream?page=bootcamp"
#     # browser.goto "https://www.trackingthepros.com/d/list_bootcamp?existing=no&_=1538114849356"

#     # byebug

#     select = browser.select(name: "displayTable_length")
#     option = select.option(value: "-1")
#     option.click

#     html = Nokogiri::HTML(browser.html)

#     table = html.at_css("#displayTable")
#     table_body = table.at_css("tbody")
#     table_rows = table_body.css("tr")

#     response = table_rows.to_a.map do |tr|
#       self.table_row_to_data(tr)
#     end

#     browser.close

#     return response
#   end

#   def table_row_to_data(table_row)
#     table_data = table_row.css("td")

#     id = table_row["id"]
#     team = table_data[1].children[0].text.strip
#     player = table_data[2].children[0].text
#     summoner_name = table_data[3].children[0].text
#     role = table_data[4].text
#     rank = table_data[5].text
#     lp = table_data[6].text.to_i
#     wins = table_data[7].text.gsub(",", "").to_i
#     losses = table_data[8].text.gsub(",", "").to_i
#     win_percent = table_data[9].text.to_f
#     games = wins + losses

#     obj = { 
#       id: id,
#       team: team,
#       player: player,
#       summoner_name: summoner_name,
#       role: role,
#       rank: rank,
#       lp: lp,
#       wins: wins,
#       losses: losses,
#       win_percent: win_percent,
#       games: games
#     }
#   end
# end

# scraper = Scraper.new
# puts scraper.response


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


def scrape
  timestamp = Time.now.to_i.to_s
  response = HTTParty.get("https://www.trackingthepros.com/d/list_bootcamp?existing=no&_=" + timestamp)

  data = JSON.parse(response)["data"]

  pros = data.map do |pro|
    {
      player: removeATag(pro["player"]),
      summoner: removeATag(pro["summoner"]),
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

