terraform {
  required_providers {
    heroku = {
      source  = "heroku/heroku"
      version = "~> 5.0"
    }
  }
}

locals {
  app_name = "multiple-screen-share-app"
}

provider "heroku" {}

resource "heroku_app" "multiple_screen_share_app" {
  name   = local.app_name
  region = "eu"
}

resource "heroku_build" "multiple_screen_share_build" {
  app_id     = heroku_app.multiple_screen_share_app.id
  buildpacks = ["https://github.com/heroku/heroku-buildpack-nodejs#v192"]

  source {
    path = "../deployment"
  }
}

resource "heroku_addon" "multiple_screen_share_addon" {
  app_id = heroku_app.multiple_screen_share_app.id
  plan   = "heroku-postgresql:hobby-dev"
}

output "multiple_screen_share_app_url" {
  value = "https://${heroku_app.multiple_screen_share_app.name}.herokuapp.com"
}
