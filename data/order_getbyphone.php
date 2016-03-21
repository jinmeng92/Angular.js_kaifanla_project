<?php
/*
*   该php页面用于myorder.html
*   获取客户端提交的电话号码，返回该号码对应的所有订单
*   向客户端返回保存结果，以JSON格式
*/

$output = array();
@$phone = $_REQUEST['phone'];
if( !$phone ){
  echo '[]';
  return;
}

$conn = mysqli_connect('127.0.0.1','root','root','kaifanla'); //访问数据库
$sql = 'SET NAMES UTF8';
mysqli_query($conn, $sql);
$sql = "SELECT oid,user_name,order_time,img_sm,o.did FROM kf_order o,kf_dish d WHERE phone='$phone' AND o.did=d.did ORDER BY order_time DESC";

$result = mysqli_query($conn, $sql);
while(($row=mysqli_fetch_assoc($result))!== NULL){
    $output[]=$row;
}

echo json_encode($output);

?>