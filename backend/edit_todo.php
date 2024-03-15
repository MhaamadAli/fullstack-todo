<?php
include './connection.php';

$user_id = $_POST['user_id'];
$todo_id = $_POST['todo_id'];
$isdone = isset($_POST['isCompleted']) ? $_POST['isCompleted'] : null;
$description = isset($_POST['description']) ? $_POST['description'] : null;

// Construct the query based on the provided parameters
if ($description !== null && $isdone !== null) {
    $query = $mysqli->prepare('UPDATE todos SET description=?, isCompleted=? WHERE todo_id=? AND user_id=?');
    $query->bind_param('siii', $description, $isdone, $todo_id, $user_id);
} elseif ($description !== null) {
    $query = $mysqli->prepare('UPDATE todos SET description=? WHERE todo_id=? AND user_id=?');
    $query->bind_param('sii', $description, $todo_id, $user_id);
} elseif ($isdone !== null) {
    $query = $mysqli->prepare('UPDATE todos SET isCompleted=? WHERE todo_id=? AND user_id=?');
    $query->bind_param('iii', $isdone, $todo_id, $user_id);
} else {
    // If no valid parameters provided, return an error response
    $response['message'] = "No valid parameters provided for update";
    echo json_encode($response);
    exit; // Terminate further execution
}

if ($query->execute()) {
    $response['message'] = "edited successfully";
} else {
    $response['message'] = "error not updated";
}

echo json_encode($response);

$mysqli->close();
?>
