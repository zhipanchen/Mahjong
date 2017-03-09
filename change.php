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

//$row=$db->query("SELECT * FROM AccountBase");
//$data=$row->fetchAll();
//var_dump(iconv("UTF-8","gbk",$data[0]['PlayerName']));
//$db->query("INSERT INTO Admin(account,password,levels) VALUES('abc2','123456',2)");
session_start();
//$_SESSION['levels']=0;
//$_SESSION['account']='root';
$levels=$_SESSION['levels'];
$account=$_SESSION['account'];
if($_POST['action']=='add'&&$_POST['type']=='normal'&&$levels==0){
    $number=intval($_POST['number']);
    $id=intval($_POST['id']);
    $sql="UPDATE AccountBase SET Diamond=Diamond+$number WHERE AccountID=$id";
    if($db->query($sql)){
        echo json_encode("修改成功");
    } else {
        echo json_encode("修改失败");
    }
}elseif($_POST['action']=='add'&&$_POST['type']=='normal'&&$levels!==0){
    $number=intval($_POST['number']);
    $id=intval($_POST['id']);
    $sql="SELECT diamond_number FROM Admin WHERE account='$account'";
    $row=$db->query($sql);
    $data=$row->fetchAll();
    if($data[0]['diamond_number']>=$number) {
        $sql = "UPDATE AccountBase SET Diamond=Diamond+$number WHERE AccountID=$id";
        $sql2="UPDATE Admin SET diamond_number=diamond_number-$number WHERE account='$account'";
        if (($db->query($sql))&&($db->query($sql2))) {
            echo json_encode("修改成功");
        } else {
            echo json_encode("修改失败");
        }
    }else{
        echo json_encode("钻石数不足");
    }
}elseif($_POST['action']=='reduce'&&$_SESSION['levels']==0&&$_POST['type']=='normal'){
    $number=intval($_POST['number']);
    $id=intval($_POST['id']);
    $sql="UPDATE AccountBase SET Diamond=Diamond-$number WHERE AccountID=$id";
    if($db->query($sql)){
        echo json_encode("修改成功");
    }else{
        echo json_encode("修改失败");
    }
}
/*elseif($_POST['action']=='reduce'&&$_POST['type']=='admin'&&$_SESSION['levels']!==0){
    echo json_encode("您没有权限进行操作");
}*/
elseif($_POST['action']=='add'&&$_POST['type']=='admin'&&$_SESSION['levels']==0){
    $number=intval($_POST['number']);
    $id=intval($_POST['id']);
    $sql="UPDATE Admin SET diamond_number=diamond_number+$number WHERE id=$id";
//    $db->query($sql);
    if($db->query($sql)){
        echo json_encode("修改成功");
    }else{
        echo json_encode("修改失败");
    }
}elseif($_POST['action']=='reduce'&&$_POST['type']=='admin'&&$_SESSION['levels']==0){
    $number=intval($_POST['number']);
    $id=intval($_POST['id']);
    $sql="UPDATE Admin SET diamond_number=diamond_number-$number WHERE id=$id";
//    $db->query($sql);
    if($db->query($sql)){
        echo json_encode("修改成功");
    }else{
        echo json_encode("修改失败");
    }
}elseif($_POST['action']=='reduce'&&$_POST['type']=='admin'&&intval($_SESSION['levels'])!==0){
    echo json_encode("您没有权限进行操作");
}