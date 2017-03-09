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

session_start();
//$_SESSION['account']='root';
if(empty($_SESSION['account'])){
    header("location:login.php");
}
if($_POST['type']=='normal'){
    $page=$_POST['page'];
    $page=($page-1)*3;
        $sql="SELECT TOP 3 AccountID,PlayerName,DiaMond,'normal' AS type
FROM AccountBase
WHERE (AccountID NOT IN
          (SELECT TOP $page AccountID
         FROM AccountBase
         ORDER BY AccountID))
ORDER BY AccountID";
        $row=$db->query($sql);
        $data=$row->fetchAll(PDO::FETCH_ASSOC);
    $sql="SELECT count(*) AS a FROM AccountBase";
    $rs=$db->query($sql);
    $num=$rs->fetchAll();
    $page_all=ceil($num[0]['a']/3);
        echo json_encode(array('datalist'=>$data,'page'=>$page_all));
}elseif($_POST['type']=='admin'){
    $page=$_POST['page'];
    $page=($page-1)*3;
    $sql="SELECT TOP 3 id,account,diamond_number,'admin' AS type
FROM Admin
WHERE (id NOT IN
          (SELECT TOP $page id
         FROM Admin
         ORDER BY id)) AND account<>'root'
ORDER BY id";
    $row=$db->query($sql);
    $data=$row->fetchAll(PDO::FETCH_ASSOC);
    $sql="SELECT count(*) AS a FROM Admin";
    $rs=$db->query($sql);
    $num=$rs->fetchAll();
    $page_all=ceil($num[0]['a']/3);
        echo json_encode(array('datalist'=>$data,'page'=>$page_all));
}