require "scraper.rb"
# require "sidekiq"

PRO_DATA = Scraper.new.response

# class Worker
#   include Sidekiq::Worker
#   def perform
#     PRO_DATA = Scraper.new.response
#   end
# end