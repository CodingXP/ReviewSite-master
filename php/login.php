<?php 
include 'database.php';

function logUser($user, $pass) {
    $conn = openCon("localhost", "root", "", "reviewsite");

    $user = dataValidation($user, $conn);
    $pass = dataValidation($pass, $conn);

    $userQuery = "SELECT * FROM users WHERE username = '$user' AND PASSWORD = '$pass'";
    $userResult = $conn->query($userQuery);

    $userCount = mysqli_num_rows($userResult);

    if ($userCount === 1) {
        $userRow = $userResult->fetch_assoc();
        $result = array("username" => $userRow['username'], "isadmin" => $userRow['isAdmin']);
        echo json_encode($result);
    }

    closeCon($conn);
}
if (isset($_POST['username'])){
    logUser($_POST['username'], $_POST['password']);
}


?>