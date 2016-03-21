<?php
/*
*   该php页面用于main.html
*   向客户端分页返回菜名数据，以JSON格式
*   每次最多返回5条菜品数据，
*   需要客户提供从哪一行(0/5/10/15...)开始读取
*   诺客户端提供开始行
*/
$output = array();
$count = 5;   //每次最多返回的记录数
@$start = $_REQUEST['start'];   //压制当前行产生的错误信息
if($start===NULL){
    $start = 0;  //设置$start默认值
}

$conn = mysqli_connect('127.0.0.1','root','root','kaifanla'); //访问数据库
$sql = 'SET NAMES UTF8';
mysqli_query($conn, $sql);
$sql = "SELECT did,name,price,img_sm,material FROM kf_dish LIMIT $start,$count";
$result = mysqli_query($conn, $sql);
while(($row=mysqli_fetch_assoc($result))!== NULL){  //一行一行读取数据
    $output[] = $row;
}
//var_dump($start);
//var_dump($conn);

echo json_encode($output);

?>