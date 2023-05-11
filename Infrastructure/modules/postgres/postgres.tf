resource "azurerm_postgresql_server" "server" {
  name                = var.server_name
  location            = var.location
  resource_group_name = var.rg_name

  administrator_login          = var.login
  administrator_login_password = var.password

  sku_name   = var.sku
  version    = "11"
  storage_mb = 5120

  backup_retention_days        = 7
  auto_grow_enabled            = true

  public_network_access_enabled    = true
  ssl_enforcement_enabled          = true
}

resource "azurerm_postgresql_database" "db" {
  name                = var.db_name
  resource_group_name = var.rg_name
  server_name         = azurerm_postgresql_server.server.name
  charset             = "UTF8"
  collation           = "English_United States.1252"
}