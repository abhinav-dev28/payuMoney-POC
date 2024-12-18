import PayU from "payu-websdk";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import cors from "cors";
import axios from "axios";

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
  res.send("Hello PayU Money Server");
});

app.post("/get-payment", async (req: Request, res: Response) => {
  try {
    const txn_id = "PAYU_MONEY_" + Math.floor(Math.random() * 8888888);
    const { amount, product, firstname, email, mobile } = req.body;
    // const amount = 100;
    // const product = {
    //   name: "t-shirt",
    //   size: "M",
    //   brand: "Zara",
    // };
    // const firstname = "Abhinav";
    // const email = "abhinav@gmail.com";
    // const mobile = 8923498323;
    const udf1 = "",
      udf2 = "",
      udf3 = "",
      udf4 = "",
      udf5 = "";

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
    res.send(data);
  } catch (error: any) {
    res.status(400).send({
      msg: error.message,
      stack: error.stack,
    });
  }
});

app.get("/verify/:txnid", async (req: Request, res: Response) => {
  const { txnid } = req.params;

  try {
    const verified_Data = await payuClient.verifyPayment(txnid);
    const data = verified_Data.transaction_details[txnid];
    res.json(data);
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Unable to verify payment" });
  }
});

// app.get("/get-transaction", async (req: Request, res: Response) => {
//   try {
//     const data = await payuClient.getTransactionDetails(
//       "2024-12-01",
//       "2024-12-05"
//     );
//     console.log(data);
//     res.send(data);
//   } catch (error) {
//     console.log(error);
//   }
// });

app.get("/get-paymentInfo/:mihpayuID", async (req: Request, res: Response) => {
  const PAYU_CHECK_PAYMENT_URL =
    "https://test.payu.in/merchant/postservice.php?form=2";
  try {
    const { mihpayuID } = req.params;

    if (!mihpayuID) {
      res
        .status(400)
        .json({ error: "PayU Transaction ID (mihpayuID) is required." });
    }

    // Step 1: Generate the hash
    const command = "check_payment";
    const hashString = `${PAYU_KEY}|${command}|${mihpayuID}|${PAYU_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    // Step 2: Prepare the POST request
    const formData = new URLSearchParams();
    formData.append("key", PAYU_KEY!);
    formData.append("command", command);
    formData.append("var1", mihpayuID);
    formData.append("hash", hash);

    // Step 3: Make the API request
    const { data } = await axios.post(
      PAYU_CHECK_PAYMENT_URL!,
      formData.toString()
      // {
      //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
      // }
    );

    // Step 4: Send the response
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/refund/:mihpayid/:amount", async (req: Request, res: Response) => {
  const PAYU_REFUND_URL = "https://test.payu.in/merchant/postservice?form=2";
  try {
    const tokenId = "REFUND_PAYU" + Math.floor(Math.random() * 8888888);
    const { mihpayid, amount } = req.params;

    // Input Validation
    if (!mihpayid || !tokenId || !amount) {
      res.status(400).json({
        error:
          "PayU Transaction ID (mihpayid), tokenId, and amount are required.",
      });
    }

    // Step 1: Generate the hash
    const command = "cancel_refund_transaction";
    const hashString = `${PAYU_KEY}|${command}|${mihpayid}|${tokenId}|${amount}|${PAYU_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const formData = new URLSearchParams();
    formData.append("key", PAYU_KEY!);
    formData.append("command", command);
    formData.append("var1", mihpayid);
    formData.append("var2", tokenId);
    formData.append("var3", amount);
    formData.append("hash", hash);

    const { data } = await axios.post(PAYU_REFUND_URL, formData.toString());
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Refund API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to process refund. Please try again later.",
    });
  }
});

app.get("/status/refund/:request_id", async (req: Request, res: Response) => {
  const PAYU_REFUND_URL = "https://test.payu.in/merchant/postservice?form=2";
  try {
    // console.log(req.params.id);
    const { request_id } = req.params;

    // Input Validation
    if (!request_id) {
      res.status(400).json({
        error: "PayU Transaction ID (request_id) are required.",
      });
    }

    // Step 1: Generate the hash
    const command = "check_action_status";
    const hashString = `${PAYU_KEY}|${command}|${request_id}|${PAYU_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    // Step 2: Prepare the POST request data
    const formData = new URLSearchParams();
    formData.append("key", PAYU_KEY!);
    formData.append("command", command);
    formData.append("var1", request_id);
    formData.append("hash", hash);

    const response = await axios.post(PAYU_REFUND_URL, formData.toString());

    res.status(200).json({
      message: "Refund status retrieved successfully.",
      data: response.data,
    });
  } catch (error: any) {
    console.error("Refund API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to process refund. Please try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
