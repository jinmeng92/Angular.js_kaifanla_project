<?php
/*
*   该php页面用于order.html
*   向客户端分页返回菜名数据，保存到数据库
*   向客户端返回保存结果，以JSON格式
*/

$output = array();
@$user_name = $_REQUEST['user_name'];
@$phone = $_REQUEST['phone'];
@$sex = $_REQUEST['sex'];
@$addr = $_REQUEST['addr'];
@$did = $_REQUEST['did'];
$order_time = time()*1000;  //下单时间，当前的系统时间
if( !$user_name || !$addr || !$phone || !$did ){
    echo '{"result" : "err" ,"msg" : "INVALID request DATA"}';
    return;
}
/*    */
$conn = mysqli_connect('127.0.0.1','root','root','kaifanla'); //访问数据库
$sql = 'SET NAMES UTF8';
mysqli_query($conn, $sql);
$sql = "INSERT INTO kf_order VALUES(NULL,'$phone','$user_name','$sex','$order_time','$addr','$did')";
$result = mysqli_query($conn, $sql);
if( $result ){
    $output['result'] = 'ok';
    $output['oid'] = mysqli_insert_id($conn);
}else{
    $output['result'] = 'fail';
    $output['msg'] = '添加失败，很可能是SQL语法错误!'.$sql;
}



echo json_encode($output);

?>