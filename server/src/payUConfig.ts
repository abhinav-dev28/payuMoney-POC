// export interface IBooking extends Document {
//   userId: string;
//   bookingId: string; //txn_id
//   orderId: string; //mihpayid
//   razorpayPaymentId: string;
//   // transactionId: string;
//   currency: string;
//   status: {
//     type: string;
//     enum: ["success", "failed", "refunded"];
//   };
//   sessionId: string;
//   sessionType: "PublicSession" | "PrivateSession";
//   grandTotal: number;
//   actualAmount: number;
//   discountAmount: number;
//   discountPercent: number;
//   payment_mode: string;
//   payment_date: string;
//   seats: number;
//   note: string;
// }
export interface IBooking extends Document {
  userId: string;
  bookingId: string; //txn_id - PAYU_MONEY_7923506
  orderId: string; //mihpayid - 403993715532997116
  request_id: string; // "137556756",
  firstname: string;
  status: {
    type: string;
    enum: ["success", "failure", "refunded"];
  };
  payment_source: string; //payu
  total_amount: number; //amount
  amount_paid: number; //amount_paid
  discount: number; //discount
  payment_mode: string; //UPI
  payment_date: string; //addedon -2024-12-16 17:38:37"
  note: string; //field7 -Transaction completed successfully
}
