data "azurerm_client_config" "current" {}

resource "azurerm_user_assigned_identity" "user" {
  location            = var.location
  name                = var.managed_identity_name
  resource_group_name = var.rg_name
}

resource "azurerm_key_vault" "keyvault" {
  name                        = var.name
  location                    = var.location
  resource_group_name         = var.rg_name
  enabled_for_disk_encryption = true
  tenant_id                   = azurerm_user_assigned_identity.user.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false

  sku_name = "standard"
  access_policy {
    tenant_id = azurerm_user_assigned_identity.user.tenant_id
    object_id = azurerm_user_assigned_identity.user.client_id
    secret_permissions = [
      "Get", "List"
    ]
  }
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id
    secret_permissions = [
      "Get", "List", "Set", "Delete", "Purge"
    ]
  }
}

resource "azurerm_key_vault_secret" "configs" {
  for_each = var.configs
  name         = each.key
  value        = each.value
  key_vault_id = azurerm_key_vault.keyvault.id
}