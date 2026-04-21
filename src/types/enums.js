export const VehicleType = Object.freeze({
  Car: 1,
  Truck: 2,
});

export const VehicleStatus = Object.freeze({
  Pending: 1,
  Active: 2,
  Inactive: 3,
  Maintenance: 4,
  Rejected: 5,
});

export const ShipmentRequestStatus = Object.freeze({
  Open: 1,
  Cancelled: 2,
  Expired: 3,
});

export const ShipmentOfferStatus = Object.freeze({
  Pending: 1,
  Accepted: 2,
  Rejected: 3,
});

export const ShipmentStatus = Object.freeze({
  Created: 1,
  InTransit: 2,
  Delivered: 3,
  Cancelled: 4,
  Return: 5,
});

export const RideRequestStatus = Object.freeze({
  Open: 1,
  Matched: 2,
  Cancelled: 3,
});

export const OfferStatus = Object.freeze({
  Active: 1,
  Paused: 2,
  Closed: 3,
  Complete: 4,
});

export const ServiceType = Object.freeze({
  Shared: 1,
  Contract: 2,
  Truck: 3,
});

export const DriverVerificationStatus = Object.freeze({
  Pending: 1,
  Active: 2,
  Inactive: 3,
  Rejected: 4,
});

export const BookingStatus = Object.freeze({
  Pending: 1,
  Confirmed: 2,
  Cancelled: 3,
});

export const PaymentStatus = Object.freeze({
  Unpaid: 1,
  Paid: 2,
  Refunded: 3,
});

export const CompanyType = Object.freeze({
  Bus: 1,
  CarRental: 2,
  RideSharing: 3,
});

export const CompanyStatus = Object.freeze({
  Pending: 0,
  Approved: 1,
  Rejected: 2,
  Suspended: 3,
});
