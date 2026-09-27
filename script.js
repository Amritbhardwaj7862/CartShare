/* =================================================
   CARTSHARE - STAGE 4
   ================================================= */


/* ================= GLOBAL VARIABLES ================= */

let currentUser = "Amrit";

let currentRoom = "";

let cart = [];



/* ================= START ================= */

function startCartShare() {

    document.getElementById("loginSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}



/* ================= LOGIN ================= */

function loginUser() {

    console.log("Continue button clicked");


    document.getElementById("loginSection")
        .style.display = "none";


    document.getElementById("roomSection")
        .style.display = "block";


    document.getElementById("roomSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}



/* ================= GENERATE ROOM ================= */

function generateRoomCode() {

    let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";


    for (let i = 0; i < 6; i++) {

        let randomIndex =
            Math.floor(
                Math.random() *
                characters.length
            );

        code += characters[randomIndex];
    }


    return code;
}



/* ================= CREATE ROOM ================= */

function createRoom() {

    currentRoom = generateRoomCode();


    localStorage.setItem(
        "cartshareRoom",
        currentRoom
    );


    localStorage.setItem(
        "cartshareUser",
        currentUser
    );


    let roomCartKey =
        "cartshareCart_" +
        currentRoom;


    if (
        localStorage.getItem(roomCartKey)
        === null
    ) {

        localStorage.setItem(
            roomCartKey,
            JSON.stringify([])
        );
    }


    document.getElementById(
        "roomResult"
    ).innerHTML = `

        <h3>
            Room Created Successfully! 🎉
        </h3>

        <p>
            ${currentUser},
            share this room code with your group.
        </p>

        <div class="room-code">
            ${currentRoom}
        </div>

    `;


    document.getElementById(
        "continueSection"
    ).style.display = "block";


    console.log(
        "Room created:",
        currentRoom
    );
}



/* ================= JOIN ROOM ================= */

function joinRoom() {

    let roomCode =
        document.getElementById(
            "roomCodeInput"
        ).value;


    roomCode =
        roomCode
        .trim()
        .toUpperCase();


    if (roomCode === "") {

        alert(
            "Please enter a room code."
        );

        return;
    }


    if (roomCode.length !== 6) {

        alert(
            "Room code must contain 6 characters."
        );

        return;
    }


    currentRoom = roomCode;


    localStorage.setItem(
        "cartshareRoom",
        currentRoom
    );


    localStorage.setItem(
        "cartshareUser",
        currentUser
    );


    let roomCartKey =
        "cartshareCart_" +
        currentRoom;


    if (
        localStorage.getItem(roomCartKey)
        === null
    ) {

        localStorage.setItem(
            roomCartKey,
            JSON.stringify([])
        );
    }


    document.getElementById(
        "roomResult"
    ).innerHTML = `

        <h3>
            Successfully Joined Room! 🎉
        </h3>

        <p>
            ${currentUser},
            you joined room:
        </p>

        <div class="room-code">
            ${currentRoom}
        </div>

    `;


    document.getElementById(
        "continueSection"
    ).style.display = "block";


    console.log(
        "Joined room:",
        currentRoom
    );
}



/* ================= GO TO CART ================= */

function goToCart() {

    console.log(
        "Continue to Cart clicked"
    );


    if (currentRoom === "") {

        alert(
            "Please create or join a room first."
        );

        return;
    }


    document.getElementById(
        "roomSection"
    ).style.display = "none";


    document.getElementById(
        "cartSection"
    ).style.display = "block";


    document.getElementById(
        "cartUser"
    ).textContent = currentUser;


    document.getElementById(
        "cartRoom"
    ).textContent = currentRoom;


    loadCart();


    document.getElementById(
        "cartSection"
    ).scrollIntoView({
        behavior: "smooth"
    });
}



/* ================= ADD ITEM ================= */

function addItem() {

    let itemName =
        document.getElementById(
            "itemName"
        ).value.trim();


    let itemPrice =
        Number(
            document.getElementById(
                "itemPrice"
            ).value
        );


    let itemQuantity =
        Number(
            document.getElementById(
                "itemQuantity"
            ).value
        );


    if (itemName === "") {

        alert(
            "Please enter item name."
        );

        return;
    }


    if (itemPrice <= 0) {

        alert(
            "Please enter a valid price."
        );

        return;
    }


    if (itemQuantity <= 0) {

        alert(
            "Please enter a valid quantity."
        );

        return;
    }


    let item = {

        name: itemName,

        price: itemPrice,

        quantity: itemQuantity,

        addedBy: currentUser

    };


    cart.push(item);


    saveCart();


    displayCart();


    document.getElementById(
        "itemName"
    ).value = "";


    document.getElementById(
        "itemPrice"
    ).value = "";


    document.getElementById(
        "itemQuantity"
    ).value = 1;
}



/* ================= DISPLAY CART ================= */

function displayCart() {

    let cartContainer =
        document.getElementById(
            "cartItems"
        );


    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <p class="empty-cart">
                No items added yet.
            </p>

        `;


        document.getElementById(
            "cartTotal"
        ).textContent = "0.00";


        document.getElementById(
            "itemCount"
        ).textContent = "0 Items";


        return;
    }


    cart.forEach(
        function(item, index) {

            let itemTotal =
                item.price *
                item.quantity;


            cartContainer.innerHTML += `

                <div class="cart-item">

                    <div class="item-info">

                        <h4>
                            ${item.name}
                        </h4>

                        <p>
                            ₹${item.price}
                            ×
                            ${item.quantity}
                        </p>

                        <small>
                            Added by:
                            ${item.addedBy}
                        </small>

                    </div>


                    <div>

                        <span class="item-price">
                            ₹${itemTotal.toFixed(2)}
                        </span>


                        <button
                            class="btn btn-danger btn-sm"
                            onclick="removeItem(${index})">

                            Remove

                        </button>

                    </div>

                </div>

            `;
        }
    );


    calculateTotal();


    document.getElementById(
        "itemCount"
    ).textContent =
        cart.length +
        (
            cart.length === 1
            ? " Item"
            : " Items"
        );
}



/* ================= REMOVE ITEM ================= */

function removeItem(index) {

    if (
        index < 0 ||
        index >= cart.length
    ) {

        return;
    }


    cart.splice(index, 1);


    saveCart();


    displayCart();
}



/* ================= TOTAL ================= */

function calculateTotal() {

    let total = 0;


    cart.forEach(
        function(item) {

            total +=
                item.price *
                item.quantity;

        }
    );


    document.getElementById(
        "cartTotal"
    ).textContent =
        total.toFixed(2);
}



/* ================= SAVE CART ================= */

function saveCart() {

    if (currentRoom === "") {

        return;
    }


    let roomCartKey =
        "cartshareCart_" +
        currentRoom;


    localStorage.setItem(
        roomCartKey,
        JSON.stringify(cart)
    );
}



/* ================= LOAD CART ================= */

function loadCart() {

    if (currentRoom === "") {

        return;
    }


    let roomCartKey =
        "cartshareCart_" +
        currentRoom;


    let savedCart =
        localStorage.getItem(
            roomCartKey
        );


    if (savedCart !== null) {

        try {

            cart =
                JSON.parse(
                    savedCart
                );

        } catch (error) {

            cart = [];

        }

    } else {

        cart = [];

    }


    displayCart();
}



/* ================= CLEAR CART ================= */

function clearCart() {

    if (cart.length === 0) {

        alert(
            "Cart is already empty."
        );

        return;
    }


    let confirmation =
        confirm(
            "Are you sure you want to clear the cart?"
        );


    if (!confirmation) {

        return;
    }


    cart = [];


    saveCart();


    displayCart();
}



/* ================= BACK TO ROOM ================= */

function goBackToRoom() {

    document.getElementById(
        "cartSection"
    ).style.display = "none";


    document.getElementById(
        "roomSection"
    ).style.display = "block";


    document.getElementById(
        "roomSection"
    ).scrollIntoView({
        behavior: "smooth"
    });
}



/* =================================================
   RAZORPAY PAYMENT
   ================================================= */


/* ================= START PAYMENT ================= */

async function startPayment() {

    // Check cart

    if (cart.length === 0) {

        alert(
            "Please add at least one item before payment."
        );

        return;
    }


    // Calculate total

    let total = 0;


    cart.forEach(
        function(item) {

            total +=
                item.price *
                item.quantity;

        }
    );


    if (total <= 0) {

        alert(
            "Invalid cart total."
        );

        return;
    }


    // Disable button

    let payButton =
        document.getElementById(
            "payButton"
        );


    payButton.disabled = true;


    payButton.textContent =
        "Creating Order...";


    hidePaymentStatus();


    try {

        /*
         Send cart total to backend.
         Backend creates Razorpay order.
        */

        let response =
            await fetch(
                "/api/create-order",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        amount: total,

                        room: currentRoom,

                        user: currentUser

                    })

                }
            );


        let data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Unable to create payment order."
            );
        }


        /*
         Razorpay Checkout options
        */

        let options = {

            key: data.keyId,

            amount: data.amount,

            currency: data.currency,

            name: "CartShare",

            description:
                "Shared Cart Payment",

            order_id:
                data.orderId,


            prefill: {

                name: currentUser

            },


            theme: {

                color: "#0d6efd"

            },


            handler:
                async function(paymentResponse) {

                    await verifyPayment(
                        paymentResponse
                    );

                },


            modal: {

                ondismiss:
                    function() {

                        resetPayButton();

                        showPaymentStatus(
                            "Payment window closed.",
                            false
                        );

                    }

            }

        };


        /*
         Open Razorpay Checkout
        */

        let razorpay =
            new Razorpay(options);


        razorpay.on(
            "payment.failed",
            function(response) {

                console.log(
                    "Payment failed:",
                    response
                );


                showPaymentStatus(
                    "Payment failed. Please try again.",
                    false
                );


                resetPayButton();

            }
        );


        razorpay.open();


    } catch (error) {

        console.error(
            "Payment error:",
            error
        );


        showPaymentStatus(
            error.message,
            false
        );


        resetPayButton();
    }
}



/* ================= VERIFY PAYMENT ================= */

async function verifyPayment(
    paymentResponse
) {

    try {

        let response =
            await fetch(
                "/api/verify-payment",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        razorpay_order_id:
                            paymentResponse.razorpay_order_id,

                        razorpay_payment_id:
                            paymentResponse.razorpay_payment_id,

                        razorpay_signature:
                            paymentResponse.razorpay_signature

                    })

                }
            );


        let data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Payment verification failed."
            );
        }


        /*
         Payment successfully verified
        */

        showPaymentStatus(
            "✅ Payment successful! Payment ID: " +
            data.paymentId,
            true
        );


        /*
         Clear cart after successful payment
        */

        cart = [];


        saveCart();


        displayCart();


        resetPayButton();


    } catch (error) {

        console.error(
            "Verification error:",
            error
        );


        showPaymentStatus(
            "Payment verification failed.",
            false
        );


        resetPayButton();
    }
}



/* ================= PAYMENT MESSAGE ================= */

function showPaymentStatus(
    message,
    success
) {

    let status =
        document.getElementById(
            "paymentStatus"
        );


    status.style.display = "block";


    status.textContent = message;


    if (success) {

        status.className =
            "payment-status payment-success";

    } else {

        status.className =
            "payment-status payment-error";

    }
}



/* ================= HIDE STATUS ================= */

function hidePaymentStatus() {

    let status =
        document.getElementById(
            "paymentStatus"
        );


    status.style.display = "none";
}



/* ================= RESET PAYMENT BUTTON ================= */

function resetPayButton() {

    let payButton =
        document.getElementById(
            "payButton"
        );


    payButton.disabled = false;


    payButton.textContent =
        "💳 Pay Now";
}



/* =================================================
   CROSS TAB SYNCHRONIZATION
   ================================================= */

window.addEventListener(
    "storage",
    function(event) {

        if (
            !event.key ||
            currentRoom === ""
        ) {

            return;
        }


        let roomCartKey =
            "cartshareCart_" +
            currentRoom;


        if (
            event.key === roomCartKey
        ) {

            console.log(
                "Cart updated in another browser tab."
            );


            loadCart();
        }

    }
);



/* ================= PAGE LOAD ================= */

window.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "CartShare Stage 4 loaded successfully."
        );


        let savedRoom =
            localStorage.getItem(
                "cartshareRoom"
            );


        let savedUser =
            localStorage.getItem(
                "cartshareUser"
            );


        if (savedRoom !== null) {

            currentRoom =
                savedRoom;
        }


        if (savedUser !== null) {

            currentUser =
                savedUser;
        }

    }
);