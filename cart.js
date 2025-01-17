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

    const payment = document.getElementById("payment").value;
    if (payment === "card") {
        const cardNumber = document.getElementById("cardNumber").value;
        const expiry = document.getElementById("expiry").value;
        const cvv = document.getElementById("cvv").value;

        if (!cardNumber || !expiry || !cvv) {
            alert("Please fill in all card details.");
            return;
        }
    } else if (payment === "upi") {
        const upiId = document.getElementById("upiId").value;
        if (!upiId) {
            alert("Please enter your UPI ID.");
            return;
        }
    }

    alert("Order placed successfully!");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
});

// Initialize Cart
window.onload = loadCart;
