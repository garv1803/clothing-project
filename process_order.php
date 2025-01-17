<?php
session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "seo"; // Replace with your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_SESSION['email']; // Assuming email is stored in the session
    $name = $conn->real_escape_string($_POST['name']);
    $phone_no = $conn->real_escape_string($_POST['phone']);
    $address = $conn->real_escape_string($_POST['address']);
    $mode_of_payment = $conn->real_escape_string($_POST['payment']);
    $card_no = isset($_POST['cardNumber']) ? $conn->real_escape_string($_POST['cardNumber']) : null;
    $upi_id = isset($_POST['upiId']) ? $conn->real_escape_string($_POST['upiId']) : null;
    $items = $conn->real_escape_string($_POST['items']);
    $total_amount = $conn->real_escape_string($_POST['total_amount']);

    $sql = "INSERT INTO orders (email, name, phone_no, address, mode_of_payment, card_no, upi_id, items, total_amount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssssd", $email, $name, $phone_no, $address, $mode_of_payment, $card_no, $upi_id, $items, $total_amount);

    if ($stmt->execute()) {
        echo "Order placed successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>
