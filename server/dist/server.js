"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payuClient = void 0;
const payu_websdk_1 = __importDefault(require("payu-websdk"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
const cors_1 = __importDefault(require("cors"));
// import { PAYU_KEY, PAYU_SALT } from "./config";
dotenv_1.default.config();
const app = (0, express_1.default)();
const PAYU_KEY = process.env.PAYU_MERCHANT_KEY;
const PAYU_SALT = process.env.PAYU_SALT;
const PORT = process.env.PORT || 4500;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
exports.payuClient = new payu_websdk_1.default({
    key: PAYU_KEY,
    salt: PAYU_SALT,
}, process.env.PAYMENT_MODE);
app.get("/", (req, res) => {
    res.send("Hello PayU Money Serverr");
});
// console.log(PAYU_KEY, PAYU_SALT);
app.post("/get-payment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const hashString = `${PAYU_KEY}|${txn_id}|${amount}|${JSON.stringify(product)}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PAYU_SALT}`;
        const hash = crypto_1.default.createHash("sha512").update(hashString).digest("hex");
        const data = yield exports.payuClient.paymentInitiate({
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
    }
    catch (error) {
        res.status(400).send({
            msg: error.message,
            stack: error.stack,
        });
    }
}));
app.post("/verify/:status/:txnid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { txnid, status } = req.params;
    // console.log(txnid, status);
    try {
        // const data = await payuClient.verifyPayment(txnid);
        const verified_Data = yield exports.payuClient.verifyPayment(txnid);
        const data = verified_Data.transaction_details[txnid];
        console.log(data);
        res.redirect(`http://localhost:5173/payment/${data === null || data === void 0 ? void 0 : data.status}/${data === null || data === void 0 ? void 0 : data.txnid}`);
    }
    catch (error) {
        console.log(error);
    }
}));
app.get("/get-transaction", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { txnid, status } = req.params;
    // console.log(txnid, status);
    try {
        const data = yield exports.payuClient.getTransactionDetails("2024-12-01", "2024-12-05");
        console.log(data);
        res.send(data);
    }
    catch (error) {
        console.log(error);
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
