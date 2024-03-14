<?php
include './connection.php';

$todo_id = $_POST['todo_id'];
$user_id = $_POST['user_id'];

$query = $mysqli ->prepare('delete from todos WHERE todo_id= ? AND user_id= ?');
$query ->bind_param('ii', $todo_id, $user_id);
$query ->execute();
if($query -> affected_rows) {
    $response['message'] = "deleted successfully";
} else {
    $response['message'] = "error not deleted";
}

echo json_encode($response);

$mysqli ->close();