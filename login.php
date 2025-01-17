<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "seo"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
	echo "connect";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve email and password from POST request
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);
	echo "got email password";
    // Query to fetch the user with the given email
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
	echo "got result";
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Verify the password
        //if (password_verify($password, $user['password'])) 
		if ($password== $user['password']) 
		{
            // Start session and store user data
			echo "password verified";
            session_start();
           // $_SESSION['user_id'] = $user['id'];
		    $_SESSION['user_id'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            
            // Redirect to dashboard or desired page
            header("Location: shop.html");
            exit();
        } else {
            $error = "Invalid password.";
			echo "ip";
        }
    } else {
        $error = "No user found with this email.";
		echo "no user found";
    }

    $stmt->close();
}

$conn->close();
?>