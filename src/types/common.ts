/** @format */

export enum DECISION {
  none = "None",
  rejected = "Rejected",
  evaluate = "Evaluate",
  alternate = "Alternate",
  selected = "Selected",
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
  purchase = "Purchase",
  pickup = "SPIEL Pickup",
  dropoff = "PAX Dropoff",
}
