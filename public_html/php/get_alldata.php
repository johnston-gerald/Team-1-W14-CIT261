<?php
include("databaseenv.php");
$myData = file_get_contents("php://input");

$data = json_decode($myData, true);

$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

// check connection
if ($conn->connect_error) {
  trigger_error('Database connection failed: '  . $conn->connect_error, E_USER_ERROR);
}
$sql="
    SELECT lists.list_id,user_list.access_level,lists.list_title,list_item_id,list_items.title,list_items.status FROM `user_list` 
    JOIN `lists` ON `lists`.`list_id` = `user_list`.`list_id` 
    JOIN `list_items` ON `list_items`.`list_id` = `lists`.`list_id` 
    WHERE user_id = " . $data['id'] . " AND lists.is_deleted = 0";    
$result=$conn->query($sql);
if($result === false) {
  trigger_error('Wrong SQL: ' . $sql . ' Error: ' . $conn->error, E_USER_ERROR);
} else {
  $result->data_seek(0);

while($row = $result->fetch_assoc())
  {
      $chat[] = $row;
  }
  
  
 echo json_encode($chat);   
}



         
                
                
                

?>    