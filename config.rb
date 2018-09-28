# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

# Use Sprockets for asset pipeline
require "sprockets/es6"
activate :sprockets do |s|
  s.supported_output_extensions << '.es6'
end


# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false


# Use “pretty” URLs (without the `.html` suffix)
activate :directory_indexes

# Append hashes to compiled assets
activate :asset_hash

require "scraper.rb"
set :pro_data, scrape
# scraper = Scraper.new
# PRO_DATA = scraper.response
# PRO_DATA = Scraper.new.response
# set :pro_data, Scraper.new.call

# require "set_pro_data.rb" 

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

# helpers do
#   def some_helper
#     'Helping'
#   end
# end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript
# end
