<?php
/**
 * Created by PhpStorm.
 * User: andy
 * Date: 2016/11/29
 * Time: 07:21
 */
session_start();
//$_SESSION['levels']=1;
//$_SESSION['account']='abc1';
if(!empty($_SESSION['account'])) {
    $levels = $_SESSION['levels'];
    $account = $_SESSION['account'];
    echo json_encode(array('account' => $account, 'levels' => $levels));
}else{
    echo json_encode(array('account' => '', 'levels' => ''));
}