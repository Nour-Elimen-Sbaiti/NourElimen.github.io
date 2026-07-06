<?php
// contact.php — handles the portfolio contact form submission via SMTP (PHPMailer)
// Manual install (no Composer needed) — see setup instructions
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
// If you installed via Composer instead, comment the 3 lines above
// and uncomment this one instead:
// require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Credentials now live in config.php, which is NOT committed to GitHub
require __DIR__ . '/config.php';

// ==== these now come from config.php ====
$smtpUser  = SMTP_USER;
$smtpPass  = SMTP_PASS;
$recipient = SMTP_RECIPIENT;
// ==========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: index.html#contact");
    exit;
}
// Honeypot spam trap
if (!empty($_POST["website"] ?? "")) {
    header("Location: index.html?contact=success#contact");
    exit;
}
$name    = trim($_POST["name"] ?? "");
$email   = trim($_POST["email"] ?? "");
$subject = trim($_POST["subject"] ?? "");
$message = trim($_POST["message"] ?? "");
$email = str_replace(["\r", "\n"], "", $email);
if ($name === "" || $email === "" || $message === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: index.html?contact=invalid#contact");
    exit;
}
if (strlen($name) > 100 || strlen($subject) > 150 || strlen($message) > 5000) {
    header("Location: index.html?contact=invalid#contact");
    exit;
}
$name    = htmlspecialchars($name, ENT_QUOTES, "UTF-8");
$subject = htmlspecialchars($subject !== "" ? $subject : "New portfolio contact message", ENT_QUOTES, "UTF-8");
$message = htmlspecialchars($message, ENT_QUOTES, "UTF-8");
$mail = new PHPMailer(true);
// --- TEMPORARY DEBUG MODE: remove these 2 lines once the form works ---
$mail->SMTPDebug = 2;
$mail->Debugoutput = 'html';
// ------------------------------------------------------------------
try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = "smtp.gmail.com";
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    // Sender / recipient
    $mail->setFrom($smtpUser, "Portfolio Contact Form");
    $mail->addAddress($recipient);
    $mail->addReplyTo($email, $name);
    // Content
    $mail->isHTML(false);
    $mail->Subject = "Portfolio Contact: " . $subject;
    $mail->Body    = "You received a new message from your portfolio contact form.\n\n"
                   . "Name: $name\n"
                   . "Email: $email\n\n"
                   . "Message:\n$message\n";
    $mail->send();
    header("Location: index.html?contact=success#contact");
} catch (Exception $e) {
    // Log the real error server-side for debugging, don't expose it to visitors
    error_log("Contact form mail error: " . $mail->ErrorInfo);
    header("Location: index.html?contact=error#contact");
}
exit;