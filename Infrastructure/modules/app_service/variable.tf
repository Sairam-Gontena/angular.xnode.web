variable "name" {}
variable "rg_name" {}
variable "location" {}
variable "service_plan_id" {}
variable "identity_ids" {
  type = list(any)
}