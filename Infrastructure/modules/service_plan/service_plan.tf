resource "azurerm_service_plan" "plan" {
  name                = var.name
  location            = var.location
  resource_group_name = var.rg_name
  os_type             = var.type
  sku_name            = var.tier
}

