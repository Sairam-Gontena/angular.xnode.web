module "rg" {
  source   = "./modules/resource_group"
  name     = "${var.name}${var.app}-${var.env}"
}

module "plan" {
  source   = "./modules/service_plan"
  name     = "${var.name}${var.app}-${var.env}"
  rg_name  = module.rg.rg_name
  location = module.rg.location
  type     = var.service_plan_type
  tier     = var.service_plan_tier
}

module "app" {
  source          = "./modules/app_service"
  for_each        = toset(var.app_service_names)
  name            = "${var.name}${var.app}${each.value}${var.env}"
  rg_name         = module.rg.rg_name
  location        = module.rg.location
  service_plan_id = module.plan.service_plan_id
  identity_ids    = [module.keyvault.identity_id]
}

resource "random_password" "password" {
  length = 16
}

module "postgres" {
  source      = "./modules/postgres"
  server_name = "${var.name}${var.app}"
  db_name     = "${var.app}db-${var.env}"
  rg_name     = module.rg.rg_name
  location    = module.rg.location
  sku         = var.sku
  login       = var.login
  password    = random_password.password.result
}

module "keyvault" {
  source                = "./modules/keyvault"
  name                  = "${var.name}${var.app}-${var.env}"
  managed_identity_name = "${var.name}${var.app}-${var.env}"
  rg_name               = module.rg.rg_name
  location              = module.rg.location
  configs = {
    "XNODE-PSQL-USERNAME" = module.postgres.login
    "XNODE-PSQL-PASSWORD" = module.postgres.password
  }
}