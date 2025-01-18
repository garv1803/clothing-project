// Utility Functions for Cart
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Render Cart
function loadCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalContainer = document.getElementById("cartTotal");
    const cartSummary = document.getElementById("cartSummary");
    const emptyCartMessage = document.getElementById("emptyCartMessage");

    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartSummary.style.display = "none";
        emptyCartMessage.style.display = "block";
    } else {
        cartSummary.style.display = "block";
        emptyCartMessage.style.display = "none";

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <img src="${item.image}" alt="${item.name}" style="width: 50px;">
                    ${item.name}
                </td>
                <td>
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    ${item.quantity}
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${itemTotal.toFixed(2)}</td>
                <td><button onclick="removeFromCart(${index})">Remove</button></td>
            `;
            cartItemsContainer.appendChild(row);
        });
    }
    cartTotalContainer.textContent = `₹${total.toFixed(2)}`;
}

// Update Quantity
function updateQuantity(index, change) {
    const cart = getCart();
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    setCart(cart);
    loadCart();
}

// Remove from Cart
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    setCart(cart);
    loadCart();
}

// Toggle Payment Fields
function togglePaymentFields() {
    const paymentMethod = document.getElementById("payment").value;
    document.getElementById("cardDetails").style.display = paymentMethod === "card" ? "block" : "none";
    document.getElementById("upiDetails").style.display = paymentMethod === "upi" ? "block" : "none";
}

// Checkout Button Event Listener
document.getElementById("checkoutButton").addEventListener("click", function () {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty! Please add items to proceed.");
        return;
    }

    // Hide the cart section and show the checkout section
    document.getElementById("cartSection").style.display = "none";
    document.getElementById("checkoutSection").style.display = "block";
});

// Checkout Form Submission
document.getElementById("checkoutForm").addEventListener("submit", function (event) {
    event.preventDefault();
    //alert("started 94");
    const payment = document.getElementById("payment").value;
    let paymentDetails = {};

    if (payment === "card") {
        const cardNumber = document.getElementById("cardNumber").value;
        const expiry = document.getElementById("expiry").value;
        const cvv = document.getElementById("cvv").value;

        if (!cardNumber || !expiry || !cvv) {
            alert("Please fill in all card details.");
            return;
        }
        //alert("card detais taken");
        paymentDetails = {
            method: "card",
            cardNumber,
            expiry,
            cvv,
        };
    } else if (payment === "upi") {
        const upiId = document.getElementById("upiId").value;
        if (!upiId) {
            alert("Please enter your UPI ID.");
            return;
        }

        paymentDetails = {
            method: "upi",
            upiId,
        };
    }

    // Customer details
    const customer = {
        name: document.getElementById("name").value,
        //email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
    };
    //alert("customer details taken")

    //if (!customer.name || !customer.email || !customer.phone || !customer.address) {
    if (!customer.name || !customer.phone || !customer.address) {
        alert("Please fill in all customer details.");
        return;
    }

    // Retrieve the cart data
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    //alert("before php code");
    // Send data to the server
    fetch("checkout.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cart,
            totalAmount,
            paymentDetails,
            customer,
        }),
    })
        .then((response) => response.json())
        // .then((response) => {
        //     console.log("Fetch response received:", response);
        //     //alert(response);
        //     if (!response.ok) {
        //         throw new Error(`HTTP error! Status: ${response.status}`);
        //     }
        //     return response.json();
        // })
        .then((data) => {
            // alert("are we here?")
            if (data.status === "success") {
                alert("Order placed successfully!");
                localStorage.removeItem("cart");
                window.location.href = "index.html";
            } else {
                alert("Failed to place order: " + data.message);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while placing your order.");
        });
});


// Initialize Cart
window.onload = loadCart;
