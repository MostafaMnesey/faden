export const ORDER_STATUSES = Object.freeze({
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  SHIPPED: "SHIPPED",
  RETURNED: "RETURNED",
  CANCELLED: "CANCELLED",
});

export const PAYMENT_STATUSES = Object.freeze({
  PENDING: "PENDING",
  PAID: "PAID",
  UNPAID: "UNPAID",
  REFUNDED: "REFUNDED",
});

export const PAYMENT_PROVIDERS = Object.freeze({
  STRIPE: "stripe",
  COD: "cod",
});

export const ALLOWED_ORDER_TRANSITIONS = Object.freeze({
  [ORDER_STATUSES.PENDING]: [
    ORDER_STATUSES.FULFILLED,
    ORDER_STATUSES.CANCELLED,
  ],
  [ORDER_STATUSES.FULFILLED]: [
    ORDER_STATUSES.SHIPPED,
    ORDER_STATUSES.RETURNED,
    ORDER_STATUSES.CANCELLED,
  ],
  [ORDER_STATUSES.SHIPPED]: [],
  [ORDER_STATUSES.RETURNED]: [],
  [ORDER_STATUSES.CANCELLED]: [],
});

export const ORDER_STATUS_VALUES = Object.freeze(Object.values(ORDER_STATUSES));
export const PAYMENT_STATUS_VALUES = Object.freeze(Object.values(PAYMENT_STATUSES));
export const PAYMENT_PROVIDER_VALUES = Object.freeze(Object.values(PAYMENT_PROVIDERS));

export const canTransitionOrderStatus = (from, to) =>
  from === to || ALLOWED_ORDER_TRANSITIONS[from]?.includes(to) === true;
