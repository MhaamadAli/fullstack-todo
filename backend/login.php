<?php
include('./connection.php');


$username = isset($_POST['username'])? $_POST['username'] : null;
$email = isset($_POST['email'])? $_POST['email'] : null;
$password = $_POST['password'];

if($username) {
    $query = $mysqli ->prepare('SELECT id,user_name,email,password
    FROM users
    WHERE user_name=?');

    $query->bind_param('s', $username);
}elseif($email) {
    $query = $mysqli ->prepare('SELECT id,user_name,email,password
    FROM users
    WHERE email=?');

    $query->bind_param('s', $email);
}

$query->execute();
$query->store_result();

$query->bind_result($id, $username, $email, $hashed_password);

$query->fetch();

$num_rows = $query->num_rows();

if ($num_rows == 0) {
    $response['message'] = "user not found";
} else {
    if (password_verify($password, $hashed_password)) {
        $response['message'] = "logged in";
        $response['id'] = $id;
        $response['user_name'] = $username;
        $response['email'] = $email;
    } else {
        $response['message'] = "incorrect password";
    }
}

echo json_encode($response);

$mysqli ->close();