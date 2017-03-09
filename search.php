<?php
/**
 * Created by PhpStorm.
 * User: andy
 * Date: 2016/11/30
 * Time: 01:21
 */
$dbName = "sqlsrv:Server=119.29.201.29,1433;Database=GameDB";
$dbUser = "chen";
$dbPassword = "meng343359067.";
$db = new PDO($dbName, $dbUser, $dbPassword);

$name=$_POST['name'];
if($_POST['type']=='normal') {
    $sql = "SELECT AccountID,PlayerName,DiaMond,'normal' AS type FROM AccountBase WHERE PlayerName='$name'";
    $row=$db->query($sql);
    $data=$row->fetchAll(PDO::FETCH_ASSOC);
    $sql="SELECT count(*) AS a FROM AccountBase";
    $rs=$db->query($sql);
    $num=$rs->fetchAll();
    $page_all=ceil($num[0]['a']/3);
    echo json_encode(array('datalist'=>$data,'page'=>1));
}elseif($_POST['type']=='admin'){
    $sql="SELECT id,account,diamond_number,'admin' AS type FROM Admin WHERE account='$name' AND account<>'root'";
    $row=$db->query($sql);
    $data=$row->fetchAll(PDO::FETCH_ASSOC);
    $sql="SELECT count(*) AS a FROM Admin";
    $rs=$db->query($sql);
    $num=$rs->fetchAll();
    $page_all=ceil($num[0]['a']/3);
    echo json_encode(array('datalist'=>$data,'page'=>1));
}
