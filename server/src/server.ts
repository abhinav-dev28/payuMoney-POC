import PayU from "payu-websdk";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import cors from "cors";

dotenv.config();
const app = express();

const PAYU_KEY = process.env.PAYU_MERCHANT_KEY;
const PAYU_SALT = process.env.PAYU_SALT;
const PORT = process.env.PORT || 4500;

app.use(express.json());
app.use(cors());

export const payuClient = new PayU(
  {
    key: PAYU_KEY,
    salt: PAYU_SALT,
  },
  process.env.PAYMENT_MODE
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello PayU Money Serverr");
});

// console.log(PAYU_KEY, PAYU_SALT);

app.post("/get-payment", async (req: Request, res: Response) => {
  try {
    const txn_id = "PAYU_MONEY_" + Math.floor(Math.random() * 8888888);
    // const { amount, product, firstname, email, mobile } = req.body;
    const amount = 1;
    const product = {
      name: "t-shirt",
      size: "M",
      brand: "Zara",
    };
    const firstname = "Abhinav";
    const email = "abhinav@gmail.com";
    const mobile = 8923498323;
    let udf1 = "";
    let udf2 = "";
    let udf3 = "";
    let udf4 = "";
    let udf5 = "";

    const hashString = `${PAYU_KEY}|${txn_id}|${amount}|${JSON.stringify(
      product
    )}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PAYU_SALT}`;

    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const data = await payuClient.paymentInitiate({
      isAmountFilledByCustomer: false,
      txnid: txn_id,
      amount,
      currency: "INR",
      productinfo: JSON.stringify(product),
      firstname,
      email,
      phone: mobile,
      surl: `http://localhost:5173/payment/success/${txn_id}`,
      furl: `http://localhost:5173/payment/failure/${txn_id}`,
      hash,
    });
    console.log(data);
    res.send(data);
  } catch (error: any) {
    res.status(400).send({
      msg: error.message,
      stack: error.stack,
    });
  }
});

app.post("/verify/:status/:txnid", async (req: Request, res: Response) => {
  const { txnid, status } = req.params;
  // console.log(txnid, status);
  try {
    // const data = await payuClient.verifyPayment(txnid);
    const verified_Data = await payuClient.verifyPayment(txnid);
    const data = verified_Data.transaction_details[txnid];
    console.log(data);
    res.redirect(
      `http://localhost:5173/payment/${data?.status}/${data?.txnid}`
    );
  } catch (error) {
    console.log(error);
  }
});
app.get("/get-transaction", async (req: Request, res: Response) => {
  const { txnid, status } = req.params;
  // console.log(txnid, status);
  try {
    const data = await payuClient.getTransactionDetails(
      "2024-12-01",
      "2024-12-05"
    );
    console.log(data);
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
