<?php
include("databaseenv.php");
$myData = file_get_contents("php://input");
echo $myData;
$data = json_decode($myData, true);
echo $myData;
if (!$data['id']){
   # $data['id'] = "106262262045390994176";
}


    $db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

    if ($db->connect_errno) {
        echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
        exit();
    }

    $user = $db->query("SELECT * FROM `users` WHERE id = '" . $data['id'] . "'");
    
    if($user->num_rows){
        echo "OK";
    } else {
        //Add the user
        $db->query("INSERT INTO `users` (`id`, `user_name`, `email`)  VALUES (" . $data['id'] . ", '" . $data['user_name'] . "', '" . $data['email'] . "')");
        echo "Added User";
    }
    
?>    