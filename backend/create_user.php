<?php 
include "./connection.php";

$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];

$check_user = $mysqli ->prepare('SELECT user_name, email FROM users WHERE user_name= ? OR email= ?');

$check_user ->bind_param('ss', $username, $email);

$check_user ->execute();

$result = $check_user ->fetch();

if ($result == 1) {
    $response['message'] = "user already exist";
} else {
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $query = $mysqli ->prepare('INSERT INTO users(user_name, email, password) VALUES (?, ?, ?)');
    $query ->bind_param('sss', $username, $email, $hashed_password);

    if($query->execute()) {
        $response['message'] = "user created";
        $response['user_name'] = $username;
        $response['email'] = $email;
    } else {
        $response['message'] = "user not created";
    }
}

echo json_encode($response);

$mysqli ->close();