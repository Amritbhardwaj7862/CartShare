/* 
   CARTSHARE RAZORPAY BACKEND
 */

const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const Razorpay = require("razorpay");

const crypto = require("crypto");

const path = require("path");


/*  LOAD ENV */

dotenv.config();


/* APP */

const app = express();


/*  MIDDLEWARE  */

app.use(
    cors()
);


app.use(
    express.json()
);


/*  RAZORPAY  */

const razorpay =
    new Razorpay({

        key_id:
            process.env.RAZORPAY_KEY_ID,

        key_secret:
            process.env.RAZORPAY_KEY_SECRET

    });



/*  FRONTEND  */

app.use(
    express.static(
        path.join(
            __dirname,
            ".."
        )
    )
);


/*
   CREATE RAZORPAY ORDER
 */

app.post(
    "/api/create-order",
    async (req, res) => {

        try {

            const amount =
                Number(
                    req.body.amount
                );


            const room =
                req.body.room || "";


            const user =
                req.body.user || "User";


            /* Validate amount */

            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                return res
                    .status(400)
                    .json({

                        error:
                            "Invalid payment amount."

                    });

            }


            /*
             Razorpay expects amount
             in the smallest currency unit.

             ₹500 = 50000 paise
            */

            const amountInPaise =
                Math.round(
                    amount * 100
                );


            /*
             Create unique receipt
            */

            const receipt =
                "cart_" +
                Date.now();


            /*
             Create Razorpay order
            */

            const order =
                await razorpay.orders.create({

                    amount:
                        amountInPaise,

                    currency:
                        "INR",

                    receipt:
                        receipt,

                    notes: {

                        room:
                            room,

                        user:
                            user

                    }

                });


            /*
             Send order information
             back to frontend
            */

            res.json({

                success: true,

                orderId:
                    order.id,

                amount:
                    order.amount,

                currency:
                    order.currency,

                keyId:
                    process.env.RAZORPAY_KEY_ID

            });


        } catch (error) {

            console.error(
                "Order creation error:",
                error
            );


            res
                .status(500)
                .json({

                    error:
                        "Unable to create Razorpay order."

                });

        }

    }
);



/* 
   VERIFY PAYMENT
    */

app.post(
    "/api/verify-payment",
    (req, res) => {

        try {

            const {

                razorpay_order_id,

                razorpay_payment_id,

                razorpay_signature

            } = req.body;


            /*
             Check required values
            */

            if (
                !razorpay_order_id ||
                !razorpay_payment_id ||
                !razorpay_signature
            ) {

                return res
                    .status(400)
                    .json({

                        error:
                            "Missing payment information."

                    });

            }


            /*
             Create signature body
            */

            const body =
                razorpay_order_id +
                "|" +
                razorpay_payment_id;


            /*
             Generate HMAC SHA256
            */

            const expectedSignature =
                crypto
                    .createHmac(
                        "sha256",
                        process.env.RAZORPAY_KEY_SECRET
                    )
                    .update(body)
                    .digest("hex");


            /*
             Compare signatures
            */

            const isValid =
                crypto.timingSafeEqual(
                    Buffer.from(
                        expectedSignature,
                        "utf8"
                    ),
                    Buffer.from(
                        razorpay_signature,
                        "utf8"
                    )
                );


            if (!isValid) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        error:
                            "Invalid payment signature."

                    });

            }


            /*
             Payment verified
            */

            console.log(
                "Payment verified:",
                razorpay_payment_id
            );


            res.json({

                success: true,

                message:
                    "Payment verified successfully.",

                paymentId:
                    razorpay_payment_id,

                orderId:
                    razorpay_order_id

            });


        } catch (error) {

            console.error(
                "Verification error:",
                error
            );


            res
                .status(500)
                .json({

                    error:
                        "Payment verification failed."

                });

        }

    }
);



/*  HOME  */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "..",
                "index.html"
            )
        );

    }
);



/* SERVER */

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `CartShare server running at http://localhost:${PORT}`
        );

    }
);