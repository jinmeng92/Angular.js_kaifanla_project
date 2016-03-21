<?php
/*
*   该php页面用于main.html
*   搜索关键字返回菜品数据，以JSON格式
*/

$output = array();
@$kw = $_REQUEST['kw'];
if(!$kw){  //客户端未提交或者提交空字符串
    echo '[]';
    return;    //退出当前页面的执行
}

$conn = mysqli_connect('127.0.0.1','root','root','kaifanla'); //访问数据库
$sql = 'SET NAMES UTF8';
mysqli_query($conn, $sql);
$sql = "SELECT img_sm,name,price,material FROM kf_dish WHERE name LIKE '%$kw%' OR material LIKE '%$kw%'";
$result = mysqli_query($conn, $sql);
while(($row=mysqli_fetch_assoc($result))!== NULL){  //一行一行读取数据
    $output[] = $row;
}

echo json_encode($output);

?>