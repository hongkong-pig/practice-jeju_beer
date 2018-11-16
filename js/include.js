function setup_navigation(){
    var gnb = $('.gnb ul');
    var gnb_utill = $('.gnb .gnb_utill');
    var width= gnb.width();
    gnb.css({
        "margin-left": -1*width + "px"
    });
    gnb_utill.css({
        "height": "250px",
        "line-height": "250px",
        "top": "50%",
        "margin-top": "-125px",
    })
    gnb_utill.find('img').attr("src","./images/common/icon_open.png");
    
    
    /*clicking utill button action*/
    var clickable = true;
    gnb_utill.click(function(){
        if(clickable) {
            clickable = false;
            var position = gnb.css("margin-left").replace("px","");
                console.log(position);
            var destination = 0;
            if(position==0) {
                /*close*/
                destination = -1*width;
                gnb_utill.find('img').attr("src","./images/common/icon_open.png");
                gnb.animate({
                    "margin-left": destination+"px"
                }, 300, function(){
                    if(position==0) {
                        gnb_utill.animate({
                            "height": "250px",
                            "line-height": "250px",
                            "top": "50%",
                            "margin-top": "-125px",
                        },300, function(){
                            clickable= true;
                        });
                    }
                });
            } else{
                /*open*/
                gnb_utill.find('img').attr("src","./images/common/icon_close.png");
                gnb_utill.animate({
                    "height": "60px",
                    "line-height": "60px",
                    "top": "-60px",
                    "margin-top": "0",
                },300, function(){
                    gnb.animate({
                        "margin-left": destination+"px"
                    }, 300, function(){
                        clickable= true;
                    });
                });
            }
        }
    });
    
    /*list hover action*/
//    var gnb_list = gnb.find('li');
//    gnb_list.hover(function(){
//        $(this).animate({
//            "margin": "10px 0",
//            "transform": "scale(1.2)",
//            "transform-origin": "left",
//        },200);
////        $(this).css({
////            "margin": "10px 0",
////            "transform": "scale(1.2)",
////            "transform-origin": "left",
////        });
//    }, function() {
//        $(this).animate({
//            "margin": "5px 0",
//            "transform": "scale(1)",
//        },200);
////        $(this).css({
////            "margin": "5px 0",
////            "transform": "scale(1)",
////        });
//    })
}

$(document).ready(function(){
    $("#navigation").load("./include/navigation.html", function(){
        setup_navigation();
    });
    $("#header").load("./include/header.html");
    $("#footer").load("./include/footer.html");
})