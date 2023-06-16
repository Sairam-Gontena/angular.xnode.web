// TODO - this file needs to be removed in future
export const InputDataJson: any = {
  "User": {
    "type": "object",
    "properties": {
      "user_id": {
        "type": "integer",
        "primaryKey": true
      },
      "first_name": {
        "type": "string"
      },
      "last_name": {
        "type": "string"
      },
      "email": {
        "type": "string"
      },
      "password": {
        "type": "string"
      }
    }
  },
  "Accounts": {
    "type": "object",
    "properties": {
      "account_id": {
        "type": "integer",
        "primaryKey": true
      },
      "user_id": {
        "type": "integer",
        "foreignKey": "User.user_id"
      },
      "account_name": {
        "type": "string"
      },
      "account_type": {
        "type": "string"
      },
      "account_balance": {
        "type": "number"
      },
      "interest_rate": {
        "type": "number"
      },
      "minimum_payment": {
        "type": "number"
      }
    }
  },
  "Transactions": {
    "type": "object",
    "properties": {
      "transaction_id": {
        "type": "integer",
        "primaryKey": true
      },
      "account_id": {
        "type": "integer",
        "foreignKey": "Accounts.account_id"
      },
      "transaction_date": {
        "type": "date"
      },
      "transaction_type": {
        "type": "string"
      },
      "transaction_amount": {
        "type": "number"
      },
      "transaction_category": {
        "type": "string"
      }
    }
  },
  "Budgets": {
    "type": "object",
    "properties": {
      "budget_id": {
        "type": "integer",
        "primaryKey": true
      },
      "user_id": {
        "type": "integer",
        "foreignKey": "User.user_id"
      },
      "budget_name": {
        "type": "string"
      },
      "budget_amount": {
        "type": "number"
      },
      "budget_category": {
        "type": "string"
      },
      "budget_start_date": {
        "type": "date"
      },
      "budget_end_date": {
        "type": "date"
      }
    }
  },
  "Goals": {
    "type": "object",
    "properties": {
      "goal_id": {
        "type": "integer",
        "primaryKey": true
      },
      "user_id": {
        "type": "integer",
        "foreignKey": "User.user_id"
      },
      "goal_name": {
        "type": "string"
      },
      "goal_amount": {
        "type": "number"
      },
      "goal_category": {
        "type": "string"
      },
      "goal_start_date": {
        "type": "date"
      },
      "goal_end_date": {
        "type": "date"
      }
    }
  },
  "Notifications": {
    "type": "object",
    "properties": {
      "notification_id": {
        "type": "integer",
        "primaryKey": true
      },
      "user_id": {
        "type": "integer",
        "foreignKey": "User.user_id"
      },
      "notification_type": {
        "type": "string"
      },
      "notification_message": {
        "type": "string"
      },
      "notification_date": {
        "type": "date"
      }
    }
  }
}
