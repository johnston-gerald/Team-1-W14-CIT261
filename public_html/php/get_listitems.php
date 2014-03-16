<?php
    include("databaseenv.php");

    $db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

    if ($db->connect_errno) {
        echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
        exit();
    }

    $user = $db->query("SELECT `list_items`.`list_item_id`, `list_items`.`title`, `list_items`.`is_deleted` FROM `list_items` WHERE `list_items`.`list_id` = '" . $_POST['list_id'] . "'");

    if($user->num_rows){
		echo json_encode($user->fetch_all());
    }