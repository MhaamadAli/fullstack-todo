<?php 

include "./connection.php";

$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];

$check_user = $connection ->prepare('SELECT username, email FROM users WHERE username= ? OR email= ?');

$check_user ->bind_param('ss', $username, $email);

$check_user ->execute();

$result = $check_user ->fetch();

if ($result == 1) {
    $response['message'] = "user already exist";
} else {
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $query = $connection ->prepare('INSERT INTO users(username, email, password) VALUES (?, ?, ?)');
    $query ->bind_param('sss', $username, $email, $hashed_password);

    if($query->execute()) {
        $response['message'] = "user created";
    } else {
        $response['message'] = "user not created";
    }
}

echo json_encode($response);

$connection ->close();