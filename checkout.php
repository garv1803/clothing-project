<?php
$data = file_get_contents("php://input");
$orderData = json_decode($data, true);

if ($orderData) {
    $cart = $orderData['cart'];
    $totalAmount = $orderData['totalAmount'];
    $paymentDetails = $orderData['paymentDetails'];
    $customer = $orderData['customer']; // Customer details

    // Database connection
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "seomal_narayandas";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die(json_encode(["status" => "error", "message" => "Database connection failed"]));
    }

    // Start transaction
    $conn->begin_transaction();
    #echo "transaction start";

    try {
        // Insert customer data
        #echo "insert customer start";
        #$stmt = $conn->prepare("INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)");
        $stmt = $conn->prepare("INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)");
        #$stmt->bind_param("ssss", $customer['name'], $customer['email'], $customer['phone'], $customer['address']);
        $stmt->bind_param("sss", $customer['name'], $customer['phone'], $customer['address']);
        $stmt->execute();
        $customerId = $stmt->insert_id;

        // Insert order data
        #echo "insert order start";
        $stmt = $conn->prepare("INSERT INTO orders (customer_id, total, payment_method, payment_details) VALUES (?, ?, ?, ?)");
        $paymentMethod = $paymentDetails['method'];
        $paymentDetailsJson = json_encode($paymentDetails);
        $stmt->bind_param("idss", $customerId, $totalAmount, $paymentMethod, $paymentDetailsJson);
        $stmt->execute();
        $orderId = $stmt->insert_id;

        // Insert order items
        #echo "insert order start";
        $stmt = $conn->prepare("INSERT INTO order_items (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)");
        foreach ($cart as $item) {
            $stmt->bind_param("isid", $orderId, $item['item_name'], $item['quantity'], $item['price']);
            $stmt->execute();
        }

        // Commit transaction
        #echo "transaction commit";
        $conn->commit();

        echo json_encode(["status" => "success", "message" => "Order placed successfully!"]);
    } catch (Exception $e) {
        $conn->rollback(); // Rollback on error
        echo json_encode(["status" => "error", "message" => "Order placement failed: " . $e->getMessage()]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid data received"]);
}
?>
