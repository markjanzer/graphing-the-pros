require "scraper.rb"
require "sidekiq"

class Worker
  include Sidekiq::Worker
  def perform
    config[:pro_data] = Scraper.new.response
  end
end