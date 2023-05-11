variable "name" {}
variable "app" {}
variable "env" {}
variable "location" {
  default = "eastus"
}
variable "app_service_names" {
  type = list(any)
}
variable "service_plan_type" {
  default = "Linux"
}
variable "service_plan_tier" {
  default = "B1"
}
variable "sku" {
  default = "B_Gen5_1"
}
variable "login" {
  default = "psqladmin"
}