//业务逻辑（star）---------------------------------------------------------------------------------------------------------
var currectPages=document.getElementById("currectPages");
//var totalPages=document.getElementById("totalPages");
var currectPage=1,totalPages=1;
var jurisdiction="管理员",pageStatus="normal";
var controlerName,searchName;
var firstPageSearch=false;

$(function(){//主函数
    jurisdictionContrlJudgement();//权限:判断权限+元素显隐模块
    firstCustomerPageData();//初始化用户第一页数据。（页面翻页模块被封装在里面。）
    firstAgentDiamondsNumber();//初始化代理商剩余砖石数。
    starPageDate();//用户，代理，搜索第一页页码控制器。
    addingDialogShow('adding','addFloatBox','block');//增加钻石，浮动框显示模块
    reduceDialogShow('reduce','removeFloatBox','block');//减少钻石，浮动框显示模块
    dialogHidden("addClose","addFloatBox");//确定按钮，浮动框消失模块
    dialogHidden("removeClose","removeFloatBox");//确定按钮，浮动框消失模块
});

function jurisdictionContrlJudgement(){//请求后台，获得登录者权限等级。
    $.ajax({
        type:"POST",
        url:"../yamj/login_msg.php",           
        dataType:"json",                                      
        data:{
        },
        success:function(data){
            var datalist=eval(data);
            if(datalist.levels=="0"){
                jurisdiction="管理员";
            }else if(datalist.levels>=1){
                jurisdiction="代理商";
                controlerName=datalist.account;
            }else if(datalist.levels==""){
                window.location.href="web1.html";
            };
            jurisdictionContrlDisplay();
        }
    });
};


function jurisdictionContrlDisplay(){//通过权限等级，控制元素的显隐。
    var searchAgentor=document.getElementById("searchAgentor");
    var agentor=document.getElementById("agentor");
    var agentDiamondsDiv=document.getElementById("agentDiamondsDiv");
    if(jurisdiction=="管理员"){
        agentDiamondsDiv.style.display="none";
    }else if(jurisdiction=="代理商"){
        for(var i=0;i<3;i++){
            searchAgentor.style.display="none";
            var obj2=document.getElementById("reduce"+(i+1));
            obj2.style.display="none";
        };
        agentor.style.display="none";
    };
};

function firstAgentDiamondsNumber(){
    $.ajax({
        type:"POST",
        url:"../yamj/number.php",           
        dataType:"json",                                      
        data:{
        },
        success:function(data){
            var datalist=eval(data);
            $("#agentDiamonds").text(data);
        }
    });
};

function firstCustomerPageData(){//初始化用户第一页面,并显示总页码。
    var dataList;
    totalPagesObject=document.getElementById("totalPages");
    $.ajax({
        type:"POST",
        url:"../yamj/index.php",           
        dataType:"json",                                      
        data:{
            type:"normal",
            page:"1"
        },
        success:function(data){
            dataList=eval(data);
            totalPagesObject.innerText=dataList.page;
            totalPages=totalPagesObject.innerText;
            for(var i=0;i<3;i++){
                $("#name"+(i+1)).html("");
                $("#value"+(i+1)).html("");
                $("#ID"+(i+1)).html("");
                $("#type"+(i+1)).html("");
            };
            for(var i=0;i<dataList.datalist.length;i++){
               var names=document.getElementById("name"+(i+1));
               var values=document.getElementById("value"+(i+1));
               var types=document.getElementById("type"+(i+1));
               var IDs=document.getElementById("ID"+(i+1));
               names.innerText=dataList.datalist[i].PlayerName;
               if(!dataList.datalist[i].DiaMond && typeof(dataList.datalist[i].DiaMond)!="undefined" && dataList.datalist[i].DiaMond!=0){
                   dataList.datalist[i].DiaMond="0";
               };
               values.innerText=dataList.datalist[i].DiaMond;
               if(dataList.datalist[i].type=="normal"){
                   dataList.datalist[i].type="用户";
               };
               types.innerText=dataList.datalist[i].type;
               IDs.innerText=dataList.datalist[i].AccountID;
               if(totalPages>=5){
                   pageControl();//大于四个页面控制模块
               }else{
                   lessPageControl();//小于四个页面控制模块
               };
           };
        }
    });
    var currectPages=document.getSelection("currectPages");
    currectPage=1;
    currectPages.innerText=currectPage;
};


function firstAdminPageData(){//初始化代理商第一页面,并显示总页码。
    var dataList;
    totalPagesObject=document.getElementById("totalPages");
    $.ajax({
        type:"POST",
        url:"../yamj/index.php",           
        dataType:"json",                                      
        data:{
            type:"admin",
            page:"1"
        },
        success:function(data){
            dataList=eval(data);
            totalPagesObject.innerText=dataList.page;
            totalPages=totalPagesObject.innerText;
            for(var i=0;i<3;i++){
                $("#name"+(i+1)).html("");
                $("#value"+(i+1)).html("");
                $("#ID"+(i+1)).html("");
                $("#type"+(i+1)).html("");
            };
            for(var i=0;i<dataList.datalist.length;i++){
               var names=document.getElementById("name"+(i+1));
               var values=document.getElementById("value"+(i+1));
               var types=document.getElementById("type"+(i+1));
               var IDs=document.getElementById("ID"+(i+1));
               names.innerText=dataList.datalist[i].account;
               if(dataList.datalist[i].diamond_number=="null"){
                   dataList.datalist[i].diamond_number="0";
               };
               values.innerText=dataList.datalist[i].diamond_number;
               if(dataList.datalist[i].type=="admin"){
                   dataList.datalist[i].type="代理商";
               };
               types.innerText=dataList.datalist[i].type;
               IDs.innerText=dataList.datalist[i].id;
               if(totalPages>=5){
                   pageControl();//大于四个页面控制模块
               }else{
                   lessPageControl();//小于四个页面控制模块
               };
           };
        }
    });
    var currectPages=document.getElementById("currectPages");
    currectPage=1;
    currectPages.innerText=currectPage;
};


function firstSearchPageData(){//初始化代理商第一页面,并显示总页码。
        var checkboxValue=document.getElementById("checkboxValue");
        var totalPag=document.getElementById("totalPages");
        var value;

        firstPageSearch=true;
        if($("#searchInformation").val()!=""){
            if(jurisdiction=="用户"){
                value=false;
            }else{
                value=checkboxValue.checked;
            };
        if(value){
            $.ajax({
            type:"POST",
            url:"../yamj/search.php",           
            dataType:"json",                                      
            data:{
                type:"admin",
                name:$("#searchInformation").val(),
                page:"1"
            },
            success:function(data){
                var dataList=eval(data);
                for(var i=0;i<3;i++){
                    $("#name"+(i+1)).html("");
                    $("#value"+(i+1)).html("");
                    $("#ID"+(i+1)).html("");
                    $("#type"+(i+1)).html("");

                    $("#ul"+(i+1)).hide();
                };
                if(dataList.datalist.length!=0){
                for(var i=0;i<dataList.datalist.length;i++){
                    $("#ul"+(i+1)).show();
                    var ids=document.getElementById("ID"+(i+1));
                    var accounts=document.getElementById("name"+(i+1));
                    var diamonds=document.getElementById("value"+(i+1));
                    var types=document.getElementById("type"+(i+1));                    
                    accounts.innerText=dataList.datalist[i].account;
                    diamonds.innerText=dataList.datalist[i].diamond_number;
                    if(dataList.datalist[i].type=="admin"){
                       dataList.datalist[i].type="代理商";
                    };
                    types.innerText=dataList.datalist[i].type;
                    ids.innerText=dataList.datalist[i].id;
                    totalPages=dataList.page;
                    var totalPagex=document.getElementById("totalPages");
                    totalPagex.innerText=totalPages;
                    currectPage=1;
                    currectPages.innerText=currectPage;
                    searchName=dataList.datalist[i].account;
                    if(totalPages>=5){
                        pageControl();//大于四个页面控制模块
                    }else{
                        lessPageControl();//小于四个页面控制模块
                    };
                    };
                 }else{
                     var searchInformation=document.getElementById("searchInformation");
                     searchInformation.value="";
                     searchInformation.placeholder="代理商不存在！";
                     currectPage=0;
                     currectPages.innerText="0";
                     totalPages=0;
                     var totalPagex=document.getElementById("totalPages");
                     totalPagex.innerText="0";
                     lessPageControl();
                 };
                 }
             });
        }else{
            $.ajax({
            type:"POST",
            url:"../yamj/search.php",           
            dataType:"json",                                      
            data:{
                type:"normal",
                name:$("#searchInformation").val(),
                page:"1"
            },
            success:function(data){
                var dataList=eval(data);
                for(var i=0;i<3;i++){
                    $("#name"+(i+1)).html("");
                    $("#value"+(i+1)).html("");
                    $("#ID"+(i+1)).html("");
                    $("#type"+(i+1)).html("");

                    $("#ul"+(i+1)).hide();
                };
                if(dataList.datalist.length!=0){
                for(var i=0;i<dataList.datalist.length;i++){//添加到的搜索信息。
                     $("#ul"+(i+1)).show();
                     var ids=document.getElementById("ID"+(i+1));
                     var accounts=document.getElementById("name"+(i+1));
                     var diamonds=document.getElementById("value"+(i+1));
                     var types=document.getElementById("type"+(i+1));                    
                     ids.innerText=dataList.datalist[i].AccountID;
                     accounts.innerText=dataList.datalist[i].PlayerName;
                     diamonds.innerText=dataList.datalist[i].DiaMond;
                     if(dataList.datalist[i].type=="normal"){
                     types.innerText="用户";
                     totalPages=dataList.page;
                     var totalPagex=document.getElementById("totalPages");
                     totalPagex.innerText=totalPages;
                     currectPage=1;
                     currectPages.innerText=currectPage;
                     searchName=dataList.datalist[i].account;
                     if(totalPages>=5){
                        pageControl();//大于四个页面控制模块
                     }else{
                        lessPageControl();//小于四个页面控制模块
                     };
                     };
                   };
                 }else{
                     var searchInformation=document.getElementById("searchInformation");
                     searchInformation.value="";
                     searchInformation.placeholder="用户不存在！";
                     currectPage=0;
                     currectPages.innerText="0";
                     totalPages=0;
                     var totalPagex=document.getElementById("totalPages");
                     totalPagex.innerText="0";
                     lessPageControl();
                 };
                }
            });
        };
        }else{
            var searchInformation=document.getElementById("searchInformation");  
            searchInformation.placeholder="搜索信息不能为空！";
        };
};


function starPageDate(){//用户，代理第一页页码控制器
    var agentor=document.getElementById("agentor");
    var custmor=document.getElementById("custmor");
    var searchFunction=document.getElementById("searchFunction");
    agentor.onclick=function(){
        firstAdminPageData();
        pageStatus="admin";
        currectPage="1";
        currectPages.innerText=currectPage;
        firstPageSearch=false;
        for(var i=0;i<3;i++){
            $("#ul"+(i+1)).show();
        };
    };
    custmor.onclick=function(){
        firstCustomerPageData();
        pageStatus="normal";
        currectPage="1";
        currectPages.innerText=currectPage;
        firstPageSearch=false;
        for(var i=0;i<3;i++){
            $("#ul"+(i+1)).show();
        };
    };
    searchFunction.onclick=function(){
        firstSearchPageData();
        pageStatus="search";
        currectPage="1";
        currectPages.innerText=currectPage;
        firstPageSearch=false;
        for(var i=0;i<3;i++){
            $("#ul"+(i+1)).show();
        };       
    };
};

function lessPageControl(){
    var PageButton1=document.getElementById("PageButton1");
    var PageButton2=document.getElementById("PageButton2");
    var PageButton3=document.getElementById("PageButton3");
    var PageButton4=document.getElementById("PageButton4");
    var PageButton5=document.getElementById("PageButton5");
    if(totalPages==0){
        PageButton1.innerText="";
        PageButton2.innerText="";
        PageButton3.innerText="0";
        PageButton4.innerText="";
        PageButton5.innerText="";
    }
    else if(totalPages==1){
        PageButton1.innerText="";
        PageButton2.innerText="";
        PageButton3.innerText="1";
        PageButton4.innerText="";
        PageButton5.innerText="";
        PageButton3.onclick=function(){
            currectPage=PageButton3.innerText;
            currectPages.innerText=currectPage
            //页码传给后端，请求后台数据，这里假设后端返回的数据
            $.ajax({
                type:"POST",
                url:"../yamj/index.php",           
                dataType:"json",                                      
                data:{
                    type:pageStatus,
                    page:currectPage
                },
                success:function(data){
                    var datalist=eval(data);
                    curPageData(datalist);
                }
            });
        };
    }else if(totalPages==2){
        PageButton1.innerText="";
        PageButton2.innerText="1";
        PageButton3.innerText="";
        PageButton4.innerText="2";
        PageButton5.innerText="";
        PageButton2.onclick=function(){
            currectPage=PageButton2.innerText;
            currectPages.innerText=currectPage
            //页码传给后端，请求后台数据，这里假设后端返回的数据
            $.ajax({
                type:"POST",
                url:"../yamj/index.php",           
                dataType:"json",                                      
                data:{
                    type:pageStatus,
                    page:currectPage
                },
                success:function(data){
                    var datalist=eval(data);
                    curPageData(datalist);
                }
            });
        };
        PageButton4.onclick=function(){
            currectPage=PageButton4.innerText;
            currectPages.innerText=currectPage
            //页码传给后端，请求后台数据，这里假设后端返回的数据
            $.ajax({
                type:"POST",
                url:"../yamj/index.php",           
                dataType:"json",                                      
                data:{
                    type:pageStatus,
                    page:currectPage
                },
                success:function(data){
                    var datalist=eval(data);
                    curPageData(datalist);
                }
            });
        };
    }else if(totalPages==3){
        PageButton1.innerText="";
        PageButton2.innerText="1";
        PageButton3.innerText="2";
        PageButton4.innerText="3";
        PageButton5.innerText="";
        PageButton2.onclick=function(){
            currectPage=PageButton2.innerText;
            currectPages.innerText=currectPage
            //页码传给后端，请求后台数据，这里假设后端返回的数据
            $.ajax({
                type:"POST",
                url:"../yamj/index.php",           
                dataType:"json",                                      
                data:{
                    type:pageStatus,
                    page:currectPage
                },
                success:function(data){
                    var datalist=eval(data);
                    curPageData(datalist);
                }
            });
        };
        PageButton3.onclick=function(){
            currectPage=PageButton3.innerText;
            currectPages.innerText=currectPage
            //页码传给后端，请求后台数据，这里假设后端返回的数据
            $.ajax({
                type:"POST",
                url:"../yamj/index.php",           
                dataType:"json",                                      
                data:{
                    type:pageStatus,
                    page:currectPage
                },
                success:function(data){
                    var datalist=eval(data);
                    curPageData(datalist);
                }
            });
        };
        PageButton4.onclick=function(){
            currectPage=PageButton4.innerText;
            currectPages.innerText=currectPage
            //页码传给后端，请求后台数据，这里假设后端返回的数据
            $.ajax({
                type:"POST",
                url:"../yamj/index.php",           
                dataType:"json",                                      
                data:{
                    type:pageStatus,
                    page:currectPage
                },
                success:function(data){
                    var datalist=eval(data);
                    curPageData(datalist);
                }
            });
        };
    }else if(totalPages==4){
        PageButton1.innerText="1";
        PageButton2.innerText="2";
        PageButton3.innerText="";
        PageButton4.innerText="3";
        PageButton5.innerText="4";
        PageButton1.onclick=function(){
            currectPage=PageButton1.innerText;
            currectPages.innerText=currectPage
            //页码传给后端，请求后台数据，这里假设后端返回的数据
            $.ajax({
                type:"POST",
                url:"../yamj/index.php",           
                dataType:"json",                                      
                data:{
                    type:pageStatus,
                    page:currectPage
                },
                success:function(data){
                    var datalist=eval(data);
                    curPageData(datalist);
                }
            });
        };
        PageButton1.onclick=function(){
            currectPage=PageButton1.innerText;
            currectPages.innerText=currectPage
            //页码传给后端，请求后台数据，这里假设后端返回的数据
            $.ajax({
                type:"POST",
                url:"../yamj/index.php",           
                dataType:"json",                                      
                data:{
                    type:pageStatus,
                    page:currectPage
                },
                success:function(data){
                    var datalist=eval(data);
                    curPageData(datalist);
                }
            });
        };
        PageButton2.onclick=function(){
            currectPage=PageButton2.innerText;
            currectPages.innerText=currectPage
            //页码传给后端，请求后台数据，这里假设后端返回的数据
            $.ajax({
                type:"POST",
                url:"../yamj/index.php",           
                dataType:"json",                                      
                data:{
                    type:pageStatus,
                    page:currectPage
                },
                success:function(data){
                    var datalist=eval(data);
                    curPageData(datalist);
                }
            });
        };
        PageButton4.onclick=function(){
            currectPage=PageButton4.innerText;
            currectPages.innerText=currectPage
            //页码传给后端，请求后台数据，这里假设后端返回的数据
            $.ajax({
                type:"POST",
                url:"../yamj/index.php",           
                dataType:"json",                                      
                data:{
                    type:pageStatus,
                    page:currectPage
                },
                success:function(data){
                    var datalist=eval(data);
                    curPageData(datalist);
                }
            });
        };
        PageButton5.onclick=function(){
            currectPage=PageButton5.innerText;
            currectPages.innerText=currectPage
            //页码传给后端，请求后台数据，这里假设后端返回的数据
            $.ajax({
                type:"POST",
                url:"../yamj/index.php",           
                dataType:"json",                                      
                data:{
                    type:pageStatus,
                    page:currectPage
                },
                success:function(data){
                    var datalist=eval(data);
                    curPageData(datalist);
                }
            });
        };
    };
};

function pageControl(){//页面控制模块
    var previousPage=document.getElementById("previousPage");
    var PageButton1=document.getElementById("PageButton1");
    var PageButton2=document.getElementById("PageButton2");
    var PageButton3=document.getElementById("PageButton3");
    var PageButton4=document.getElementById("PageButton4");
    var PageButton5=document.getElementById("PageButton5");
    var nextPage=document.getElementById("nextPage");
    for(var i=0;i<3;i++){
        $("#ul"+(i+1)).show();
    };
    for(var i=0;i<5;i++){
        eval("PageButton"+(i+1)+".innerText="+(i+1)+";");
    };  
    previousPage.onclick=function(){//前一页功能

        if(PageButton1.innerText<5){
            for(var i=0;i<5;i++){
                eval("PageButton"+(i+1)+".innerText="+"''"+";");
            };
            if(totalPages==0){
                PageButton1.innerText="";
                PageButton2.innerText="";
                PageButton3.innerText="0";
                PageButton4.innerText="";
                PageButton5.innerText="";
            }else if(totalPages==1){
                PageButton1.innerText="";
                PageButton2.innerText="";
                PageButton3.innerText="1";
                PageButton4.innerText="";
                PageButton5.innerText="";
            }else if(totalPages==2){
                PageButton1.innerText="";
                PageButton2.innerText="1";
                PageButton3.innerText="";
                PageButton4.innerText="2";
                PageButton5.innerText="";
            }else if(totalPages==3){
                PageButton1.innerText="";
                PageButton2.innerText="1";
                PageButton3.innerText="2";
                PageButton4.innerText="3";
                PageButton5.innerText="";
            }else if(totalPages==4){
                PageButton1.innerText="1";
                PageButton2.innerText="2";
                PageButton3.innerText="";
                PageButton4.innerText="3";
                PageButton5.innerText="4";
            }

        }else{
            PageButton1.innerText=PageButton1.innerText-5;
            PageButton2.innerText=PageButton2.innerText-5;
            PageButton3.innerText=PageButton3.innerText-5;
            PageButton4.innerText=PageButton4.innerText-5;
            PageButton5.innerText=PageButton5.innerText-5;
        };
    };
    
    nextPage.onclick=function(){//下一页功能
        if(totalPages>5){
            if(PageButton5.innerText<(totalPages-5)){
                PageButton1.innerText=parseInt(PageButton1.innerText)+5;
                PageButton2.innerText=parseInt(PageButton2.innerText)+5;//加法千万要用parseInt，减法都可以不用，加，必须要。
                PageButton3.innerText=parseInt(PageButton3.innerText)+5;
                PageButton4.innerText=parseInt(PageButton4.innerText)+5;
                PageButton5.innerText=parseInt(PageButton5.innerText)+5;
            }else{
                PageButton1.innerText=totalPages-4;
                PageButton2.innerText=totalPages-3;
                PageButton3.innerText=totalPages-2;
                PageButton4.innerText=totalPages-1;
                PageButton5.innerText=totalPages-0;
            };
        };
    };

    PageButton1.onclick=function(){
        currectPage=PageButton1.innerText;
        currectPages.innerText=currectPage;
        //页码传给后端，请求后台数据
        if(pageStatus=="search"){
            var checkboxValue=document.getElementById("checkboxValue");
            var types;
            if(checkboxValue.checked){
                types="admin";
            }else{
                types="normal";
            };
        $.ajax({
            type:"POST",
            url:"../yamj/search.php",           
            dataType:"json",                                      
            data:{
                type:types,
                name:$("#searchInformation").val(),
                page:currectPage
            },
            success:function(data){
                var datalist=eval(data);
                curPageData(datalist);
            }
        });

        }else{
        $.ajax({
            type:"POST",
            url:"../yamj/index.php",           
            dataType:"json",                                      
            data:{
                type:pageStatus,
                page:currectPage
            },
            success:function(data){
                var datalist=eval(data);
                curPageData(datalist);
            }
        });
    };
    };
    PageButton2.onclick=function(){
        currectPage=PageButton2.innerText;
        currectPages.innerText=currectPage
        //页码传给后端，请求后台数据，这里假设后端返回的数据
        if(pageStatus=="search"){
            var checkboxValue=document.getElementById("checkboxValue");
            var types;
            if(checkboxValue.checked){
                types="admin";
            }else{
                types="normal";
            };
        $.ajax({
            type:"POST",
            url:"../yamj/search.php",           
            dataType:"json",                                      
            data:{
                type:types,
                name:$("#searchInformation").val(),
                page:currectPage
            },
            success:function(data){
                var datalist=eval(data);
                curPageData(datalist);
            }
        });

        }else{
        $.ajax({
            type:"POST",
            url:"../yamj/index.php",           
            dataType:"json",                                      
            data:{
                type:pageStatus,
                page:currectPage
            },
            success:function(data){
                var datalist=eval(data);
                curPageData(datalist);
            }
        });
    };
    };
    PageButton3.onclick=function(){
        currectPage=PageButton3.innerText;
        currectPages.innerText=currectPage;
        if(currectPage!="0"){
        //页码传给后端，请求后台数据，这里假设后端返回的数据
        if(pageStatus=="search"){
            var checkboxValue=document.getElementById("checkboxValue");
            var types;
            if(checkboxValue.checked){
                types="admin";
            }else{
                types="normal";
            };
        $.ajax({
            type:"POST",
            url:"../yamj/search.php",           
            dataType:"json",                                      
            data:{
                type:types,
                name:$("#searchInformation").val(),
                page:currectPage
            },
            success:function(data){
                var datalist=eval(data);
                curPageData(datalist);
            }
        });

        }else{
        $.ajax({
            type:"POST",
            url:"../yamj/index.php",           
            dataType:"json",                                      
            data:{
                type:pageStatus,
                page:currectPage
            },
            success:function(data){
                var datalist=eval(data);
                curPageData(datalist);
            }
        });
    };
        };
    };
    PageButton4.onclick=function(){
        currectPage=PageButton4.innerText;
        currectPages.innerText=currectPage
        //页码传给后端，请求后台数据，这里假设后端返回的数据
        if(pageStatus=="search"){
            var checkboxValue=document.getElementById("checkboxValue");
            var types;
            if(checkboxValue.checked){
                types="admin";
            }else{
                types="normal";
            };
        $.ajax({
            type:"POST",
            url:"../yamj/search.php",           
            dataType:"json",                                      
            data:{
                type:types,
                name:$("#searchInformation").val(),
                page:currectPage
            },
            success:function(data){
                var datalist=eval(data);
                curPageData(datalist);
            }
        });

        }else{
        $.ajax({
            type:"POST",
            url:"../yamj/index.php",           
            dataType:"json",                                      
            data:{
                type:pageStatus,
                page:currectPage
            },
            success:function(data){
                var datalist=eval(data);
                curPageData(datalist);
            }
        });
    };
    };
    PageButton5.onclick=function(){
        currectPage=PageButton5.innerText;
        currectPages.innerText=currectPage
        //页码传给后端，请求后台数据，这里假设后端返回的数据
        if(pageStatus=="search"){
            var checkboxValue=document.getElementById("checkboxValue");
            var types;
            if(checkboxValue.checked){
                types="admin";
            }else{
                types="normal";
            };
        $.ajax({
            type:"POST",
            url:"../yamj/search.php",           
            dataType:"json",                                      
            data:{
                type:types,
                name:$("#searchInformation").val(),
                page:currectPage
            },
            success:function(data){
                var datalist=eval(data);
                curPageData(datalist);
            }
        });

        }else{
        $.ajax({
            type:"POST",
            url:"../yamj/index.php",           
            dataType:"json",                                      
            data:{
                type:pageStatus,
                page:currectPage
            },
            success:function(data){
                var datalist=eval(data);
                curPageData(datalist);
            }
        });
    };
    };
};

function addingDialogShow(type,box,displayValue){//增加,浮动框控制模块
        var adding1=document.getElementById(type+'1');
        var adding2=document.getElementById(type+'2');
        var adding3=document.getElementById(type+'3');
        var boxs=document.getElementById(box);
        var addingDiamonds=document.getElementById("addingDiamonds");      
        var addyes=document.getElementById("addyes");   
        var agentDiamonds=document.getElementById("agentDiamonds"); 
        adding1.onclick=function(){
            boxs.style.display=displayValue;
            var Name=document.getElementById("name1");
            var idValue=document.getElementById("ID1");
            var Diamondsvalue=document.getElementById("value1");
            var custmor1=document.getElementById("nameInformation1");
            var custmor2=document.getElementById("nameInformation2");
            custmor1.innerText=Name.innerText;
            custmor2.innerText=Name.innerText;
            addyes.onclick=function(){
                if(addingDiamonds.value==""){
                    addingDiamonds.placeholder="无数据！";
                }else{
                $.ajax({
                    type:"POST",
                    url:"../yamj/change.php",           
                    dataType:"json",                                      
                    data:{
                        action:"add",
                        type:pageStatus,
                        number:addingDiamonds.value,
                        id:idValue.innerText
                    },
                    success:function(data){
                        Diamondsvalue.innerText=parseInt(Diamondsvalue.innerText)+parseInt(addingDiamonds.value);
                        agentDiamonds.innerText=parseInt(agentDiamonds.innerText)-parseInt(addingDiamonds.value);
                        addingDiamonds.value="";
                        addingDiamonds.placeholder=data;
                    }
                });
                };
            };
        };
        adding2.onclick=function(){
            boxs.style.display=displayValue;
            var Name=document.getElementById("name2");
            var idValue=document.getElementById("ID2");
            var Diamondsvalue=document.getElementById("value2");
            var custmor1=document.getElementById("nameInformation1");
            var custmor2=document.getElementById("nameInformation2");
            custmor1.innerText=Name.innerText;
            custmor2.innerText=Name.innerText;
            addyes.onclick=function(){
                if(addingDiamonds.value==""){
                    addingDiamonds.placeholder="无数据！";
                }else{
                $.ajax({
                    type:"POST",
                    url:"../yamj/change.php",           
                    dataType:"json",                                      
                    data:{
                        action:"add",
                        type:pageStatus,
                        number:addingDiamonds.value,
                        id:idValue.innerText
                    },
                    success:function(data){
                        Diamondsvalue.innerText=parseInt(Diamondsvalue.innerText)+parseInt(addingDiamonds.value);
                        agentDiamonds.innerText=parseInt(agentDiamonds.innerText)-parseInt(addingDiamonds.value);
                        addingDiamonds.value="";
                        addingDiamonds.placeholder=data;
                    }
                });
                };
            }
        };
        adding3.onclick=function(){
            boxs.style.display=displayValue;
            var Name=document.getElementById("name3");
            var idValue=document.getElementById("ID3");
            var Diamondsvalue=document.getElementById("value3");
            var custmor1=document.getElementById("nameInformation1");
            var custmor2=document.getElementById("nameInformation2");
            custmor1.innerText=Name.innerText;
            custmor2.innerText=Name.innerText;
            addyes.onclick=function(){
                if(addingDiamonds.value==""){
                    addingDiamonds.placeholder="无数据！";
                }else{
                $.ajax({
                    type:"POST",
                    url:"../yamj/change.php",           
                    dataType:"json",                                      
                    data:{
                        action:"add",
                        type:pageStatus,
                        number:addingDiamonds.value,
                        id:idValue.innerText
                    },
                    success:function(data){
                        Diamondsvalue.innerText=parseInt(Diamondsvalue.innerText)+parseInt(addingDiamonds.value);
                        agentDiamonds.innerText=parseInt(agentDiamonds.innerText)-parseInt(addingDiamonds.value);
                        addingDiamonds.value="";
                        addingDiamonds.placeholder=data;
                    }
                });
                };
            }
       };
};

function reduceDialogShow(type,box,displayValue){//减少,浮动框控制模块
        var reduce1=document.getElementById(type+(1));
        var reduce2=document.getElementById(type+(2));
        var reduce3=document.getElementById(type+(3));
        var boxs=document.getElementById(box);
        var removeDiamonds=document.getElementById("removeDiamonds");
        var removeyes=document.getElementById("removeyes");
        reduce1.onclick=function(){
            boxs.style.display=displayValue;
            var Name=document.getElementById("name1");
            var idValue=document.getElementById("ID1");
            var Diamondsvalue=document.getElementById("value1");
            var custmor1=document.getElementById("nameInformation1");
            var custmor2=document.getElementById("nameInformation2");
            custmor1.innerText=Name.innerText;
            custmor2.innerText=Name.innerText;
            removeyes.onclick=function(){
                if(removeDiamonds.value==""){
                    removeDiamonds.placeholder="无数据！";
                }else{
                $.ajax({
                    type:"POST",
                    url:"../yamj/change.php",           
                    dataType:"json",                                      
                    data:{
                        action:"reduce",
                        type:pageStatus,
                        number:removeDiamonds.value,
                        id:idValue.innerText
                    },
                    success:function(data){
                        Diamondsvalue.innerText=parseInt(Diamondsvalue.innerText)-parseInt(removeDiamonds.value);
                        removeDiamonds.value="";
                        removeDiamonds.placeholder=data;
                    }
                });
                };
            }
    };
        reduce2.onclick=function(){
            boxs.style.display=displayValue;
            var Name=document.getElementById("name2");
            var idValue=document.getElementById("ID2");
            var Diamondsvalue=document.getElementById("value2");
            var custmor1=document.getElementById("nameInformation1");
            var custmor2=document.getElementById("nameInformation2");
            custmor1.innerText=Name.innerText;
            custmor2.innerText=Name.innerText;
            removeyes.onclick=function(){
                if(removeDiamonds.value==""){
                    removeDiamonds.placeholder="无数据！";
                }else{
                $.ajax({
                    type:"POST",
                    url:"../yamj/change.php",           
                    dataType:"json",                                      
                    data:{
                        action:"reduce",
                        type:pageStatus,
                        number:removeDiamonds.value,
                        id:idValue.innerText
                    },
                    success:function(data){
                        Diamondsvalue.innerText=parseInt(Diamondsvalue.innerText)-parseInt(removeDiamonds.value);
                        removeDiamonds.value="";
                        removeDiamonds.placeholder=data;
                    }
                });
                };
            }
    };
        reduce3.onclick=function(){
            boxs.style.display=displayValue;
            var Name=document.getElementById("name3");
            var idValue=document.getElementById("ID3");
            var Diamondsvalue=document.getElementById("value3");
            var custmor1=document.getElementById("nameInformation1");
            var custmor2=document.getElementById("nameInformation2");
            custmor1.innerText=Name.innerText;
            custmor2.innerText=Name.innerText;
            removeyes.onclick=function(){
                if(removeDiamonds.value==""){
                    removeDiamonds.placeholder="无数据！";
                }else{
                $.ajax({
                    type:"POST",
                    url:"../yamj/change.php",           
                    dataType:"json",                                      
                    data:{
                        action:"reduce",
                        type:pageStatus,
                        number:removeDiamonds.value,
                        id:idValue.innerText
                    },
                    success:function(data){
                        Diamondsvalue.innerText=parseInt(Diamondsvalue.innerText)-parseInt(removeDiamonds.value);
                        removeDiamonds.value="";
                        removeDiamonds.placeholder=data;
                    }
                });
                };
            }
        };
};

function dialogHidden(button,box){//悬浮窗关闭按钮控制模块
    var removeDiamonds=document.getElementById("removeDiamonds");
    var addingDiamonds=document.getElementById("addingDiamonds");
    eval('var Button=document.getElementById("'+button+'");');
    eval('var Box=document.getElementById("'+box+'");');
    Button.onclick=function(){
        Box.style.display="none";
        removeDiamonds.value="";
        addingDiamonds.value="";
    };
};


function curPageData(jsonData){//选页展示页面数据
    //解析后台的json赋值
    var dataList=eval(jsonData);
    if(pageStatus=="normal"){
        for(var i=0;i<dataList.datalist.length;i++){
            var names=document.getElementById("name"+(i+1));
            var values=document.getElementById("value"+(i+1));
            var types=document.getElementById("type"+(i+1));
            var IDs=document.getElementById("ID"+(i+1));
            names.innerText=dataList.datalist[i].PlayerName;
            values.innerText=dataList.datalist[i].DiaMond;
            if(dataList.datalist[i].type=="normal"){
                dataList.datalist[i].type="用户";
            };
            types.innerText=dataList.datalist[i].type;
            IDs.innerText=dataList.datalist[i].AccountID;
        };
    }else if(pageStatus=="admin"){
        for(var i=0;i<dataList.datalist.length;i++){
            var names=document.getElementById("name"+(i+1));
            var values=document.getElementById("value"+(i+1));
            var types=document.getElementById("type"+(i+1));
            var IDs=document.getElementById("ID"+(i+1));
            names.innerText=dataList.datalist[i].account;
            values.innerText=dataList.datalist[i].diamond_number;
            if(dataList.datalist[i].type=="admin"){
                dataList.datalist[i].type="代理商";
            };
            types.innerText=dataList.datalist[i].type;
            IDs.innerText=dataList.datalist[i].id;
        };
    }else if(pageStatus=="search"){
        for(var i=0;i<dataList.datalist.length;i++){
            var names=document.getElementById("name"+(i+1));
            var values=document.getElementById("value"+(i+1));
            var types=document.getElementById("type"+(i+1));
            var IDs=document.getElementById("ID"+(i+1));
            names.innerText=dataList.datalist[i].account;
            values.innerText=dataList.datalist[i].diamond_number;
            if(dataList.datalist[i].type=="admin"){
                dataList.datalist[i].type="代理商";
            };
            types.innerText=dataList.datalist[i].type;
            IDs.innerText=dataList.datalist[i].id;
        };
    };             
};


//业务逻辑（end）--------------------------------------------------------------------------------------------------------

//动态（star）-----------------------------------------------------------------------------------------------------------

//动态（end）------------------------------------------------------------------------------------------------------------