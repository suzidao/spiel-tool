/** @format */

export enum DECISION {
  none = "None",
  rejected = "Rejected",
  evaluate = "Evaluate",
  alternate = "Alternate",
  selected = "Selected",
  soft_locked = "Soft-Locked",
  placed = "Placed",
}

export enum NEGOTIATION {
  none = "None",
  emailed = "Emailed",
  promised = "Promised",
  deal = "Deal @ SPIEL",
  denied = "Denied",
}

export enum ACQUISITION {
  none = "None",
  acquired = "Acquired",
  shipping = "Shipping",
  purchased = "Purchased",
  pickup = "SPIEL Pickup",
  dropoff = "PAX Dropoff",
}
