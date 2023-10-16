<?php 
header("Access-Control-Allow-Origin: http://localhost:3000");
function openCon($server, $user, $pass, $dbName){
    $conn = new mysqli($server, $user, $pass, $dbName) or die("Connection error: " . $conn->connect_error);

    $conn->select_db($dbName) or die("Unable to select database..");

    return $conn;
}

function closeCon($conn) {
    $conn->close();
}

function dataValidation($data, $conn) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = $conn->real_escape_string($data);
    return $data;
}
?>