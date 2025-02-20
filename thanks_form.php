<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $privacy = isset($_POST["privacy"]) ? "Yes" : "No";
    
    $to = "contact@greenhaven.com";
    $subject = "Newsletter Subscription";
    $body = "New subscriber details:\n\n";
    $body .= "Email: " . $email . "\n";
    $body .= "Privacy Policy Accepted: " . $privacy . "\n";
    $headers = "From: " . $to . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    mail($to, $subject, $body, $headers);
    
    header("Location: thanks.html");
    exit();
}
?>
