<?php
/**
 * Created by PhpStorm.
 * User: andy
 * Date: 2016/11/29
 * Time: 07:21
 */
$dbName = "sqlsrv:Server=119.29.201.29,1433;Database=GameDB";
$dbUser = "chen";
$dbPassword = "meng343359067.";
$db = new PDO($dbName, $dbUser, $dbPassword);

$account=$_POST['account'];
$password=$_POST['password'];
$sql="SELECT account,levels FROM Admin WHERE account='$account' AND password='$password'";
$row=$db->query($sql);
$data=$row->fetchAll();
if(!empty($data[0]['account'])){
    session_start();
    $_SESSION['account']=$data[0]['account'];
    $_SESSION['levels']=$data[0]['levels'];
    echo 1;
}else{
    echo 0;
}