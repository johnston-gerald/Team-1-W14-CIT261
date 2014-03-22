<?php
    include("databaseenv.php");

    $db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

    if ($db->connect_errno) {
        echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
        exit();
    }

    $user = $db->query("SELECT `lists`.`list_id`, `lists`.`list_title`, `lists`.`is_deleted` FROM `lists` JOIN `user_list` ON `lists`.`list_id` = `user_list`.`list_id` WHERE `user_list`.`user_id` = '" . $_POST['user_id'] . "' AND `user_list`.`access_level` > 0");

    if($user->num_rows){
		echo json_encode($user->fetch_all());
    }