output "login" {
  value = azurerm_postgresql_server.server.administrator_login
}
output "password" {
  value = azurerm_postgresql_server.server.administrator_login_password
}