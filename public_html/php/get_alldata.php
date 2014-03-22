<?php
include("databaseenv.php");
$myData = file_get_contents("php://input");

$data = json_decode($myData, true);
$db = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if ($db->connect_errno) {
    echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
    exit();
}
$user_data = $db->query("
    SELECT lists.list_id,user_list.access_level,lists.title,list_item_id,list_items.title,list_items.status FROM `user_list` 
    JOIN `lists` ON `lists`.`list_id` = `user_list`.`list_id` 
    JOIN `list_items` ON `list_items`.`list_id` = `lists`.`list_id` 
    WHERE user_id = " . $data['id'] . " AND lists.is_deleted = 0");    
if($user_data->num_rows > 0){
    //get users lists and list items
    $rows = array();
    while($line = $user_data->fetch_array()) {
        $rows[] = $line;
    }
    echo json_encode($rows);       
                
                
                
}
?>    