locals {
  db_names = toset([
    "gateway_db",
    "candidate_db",
    "parser_db",
    "blacklist_db",
    "qualification_db",
    "notification_db",
  ])
}
