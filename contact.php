<?php
// Simple contact form handler
// Validates input and logs submissions (email functionality to be added later)

// Decide response mode: JSON for AJAX, redirect for regular form submission
$accept = $_SERVER['HTTP_ACCEPT'] ?? '';
$wantsJson = str_contains($accept, 'application/json') || ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'XMLHttpRequest';

if ($wantsJson) {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    if ($wantsJson) {
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    }
    exit;
}

// Support JSON or form-encoded submission
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (str_contains($contentType, 'application/json')) {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        if ($wantsJson) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
        } else {
            header('Location: contact.html?sent=0&error=' . urlencode('Invalid submission'));
        }
        exit;
    }
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $message = trim($data['message'] ?? '');
} else {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');
    
    // Honeypot anti-spam (silently succeed for bots)
    if (!empty($_POST['website'])) {
        if ($wantsJson) {
            echo json_encode(['success' => true, 'message' => 'Message received.']);
        } else {
            header('Location: contact.html?sent=1');
        }
        exit;
    }
}

// Validation
if ($name === '' || $email === '' || $message === '') {
    if ($wantsJson) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'All fields are required.']);
    } else {
        header('Location: contact.html?sent=0&error=' . urlencode('All fields are required.'));
    }
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    if ($wantsJson) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Invalid email address.']);
    } else {
        header('Location: contact.html?sent=0&error=' . urlencode('Invalid email address.'));
    }
    exit;
}

// Log the submission for later processing
$logFile = __DIR__ . '/contact-submissions.txt';
$logEntry = sprintf(
    "[%s] Name: %s | Email: %s | IP: %s\nMessage: %s\n\n",
    date('Y-m-d H:i:s'),
    $name,
    $email,
    $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    $message
);
@file_put_contents($logFile, $logEntry, FILE_APPEND);

// Return success (email sending to be added later)
if ($wantsJson) {
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you! Your message has been received. We will get back to you soon.'
    ]);
} else {
    header('Location: contact.html?sent=1');
}
