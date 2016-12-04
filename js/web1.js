//业务逻辑（star）--------------------------------------------------------------------
$(function(){//主函数
    loginValidation();//登录验证模块
});

function loginValidation(){//登录验证模块
    var transferValue=1;//登录验证结果
    sendData.onclick=function(){
        var accountText=$("#userName").val();
        var passwordText=$("#password").val();
        if(accountText==""){
            worry.innerText="用户名不能为空！";
            worry.style.opacity=1;
        }else if(passwordText==""){
            worry.innerText="密码不能为空！";
            worry.style.opacity=1;
        }else{
            $.ajax({
                type:"POST",
                url:"../yamj/login.php",           
                dataType:"json",                                      
                data:{
                    account:$("#userName").val(),
                    password:$("#password").val()
                },
                success:function(data){
                    transferValue=eval(data);
                    if(transferValue==1){
                        worry.style.opacity=0;
                        window.location.href="web2.html";
                    }else{
                        worry.style.opacity=1;
                        worry.innerText="用户名/密码有误！";
                    };
                },
                error:function(jqXHR){
                    alert('发生错误'+jqXHR.Status);
                }
            });
        };
    };
};

//业务逻辑（end）--------------------------------------------------------------------------------------------------

//动态（star）-----------------------------------------------------------------------------------------------------
var timer=null,boxtimer1=null,boxtimer2=null,boxTimer3=null;
var opacityNumber=0,boxMoveNumber1=0,boxMoveNumber2=0,boxMoveNumber3=0;

$(function(){
    setTimeout("lateStar1()",1800);
    setTimeout("lateStar2()",2050);
    setTimeout("lateStar3()",2300);
    timer=setInterval("logOpacity()",30);
});


function lateStar1(){
    boxTimer1=setInterval("boxMove1()",5);
}
function lateStar2(){
    boxTimer2=setInterval("boxMove2()",5);
}
function lateStar3(){
    boxTimer3=setInterval("boxMove3()",5);
}

function logOpacity(){
    var log=document.getElementById("log");
    var title=document.getElementById("title");
    var subtitle=document.getElementById("subtitle");
    opacityNumber++;
    if(log.style.opacity==100){
        clearInterval(timer);
    }else{
        log.style.opacity=opacityNumber/100;
        title.style.opacity=opacityNumber/100;
        subtitle.style.opacity=opacityNumber/100;
    };
};

function boxMove1(){
    boxMoveNumber1+=10;
    if(boxMoveNumber1>=1000){
        clearInterval(boxTimer1);
    };
    var userTextBox=document.getElementById("userTextBox");
    userTextBox.style.left=(1000-boxMoveNumber1);
    userTextBox.style.opacity=boxMoveNumber1/1000;
};

function boxMove2(){
    boxMoveNumber2+=10;
    if(boxMoveNumber2>=1000){
        clearInterval(boxTimer2);
    };
    var passwordTextBox=document.getElementById("passwordTextBox");
    passwordTextBox.style.left=(1000-boxMoveNumber2);
    passwordTextBox.style.opacity=boxMoveNumber2/1000;
};
function boxMove3(){
    boxMoveNumber3+=10;
    if(boxMoveNumber3>=1000){
        clearInterval(boxTimer3);
    };
    var loginButton=document.getElementById("loginButton");
    loginButton.style.left=(1000-boxMoveNumber3);
    loginButton.style.opacity=boxMoveNumber3/1000;
};


//动态（end）----------------------------------------------------------------------------------------------------