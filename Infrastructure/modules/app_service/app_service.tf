resource "azurerm_linux_web_app" "app" {
  name                = var.name
  resource_group_name = var.rg_name
  location            = var.location
  service_plan_id     = var.service_plan_id
  logs {
    application_logs {
      file_system_level = "Information"
    }
  }
  site_config {
    always_on        = true
  }
  identity {
    type = "UserAssigned"
    identity_ids = var.identity_ids
  }
}