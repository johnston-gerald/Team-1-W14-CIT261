<?php
    include("databaseenv.php");

    $db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

    if ($db->connect_errno) {
        echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
        exit();
    }

    $user = $db->query("UPDATE `lists` SET `list_title` =  '" . $_POST['list_name'] . "' WHERE `list_id` = " . $_POST['list_id']) or die(mysqli_error($db));