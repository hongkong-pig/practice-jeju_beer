$.fn.make_slider = function(option){
    $(this).wrap("<div class='slider_touch_area'></div>");
    var touch_area = $(this).parent();
    touch_area.css({
        "width": "100%",
        "height": "100%",
        "position": "relative",
    });
    $(this).wrap("<div class='slider_wrap'></div>");
    $(this).parent().css({
        "width": "100%",
        "height": "100%",
        "overflow": "hidden",
        "position": "relative",
    });
        
    var list= $(this).find('li');
    var width= 0;
    var height= $(this).clientHeight;
    var PAGE_SIZE= 4;
    
    var starting_point=0;
    var now_pos_x= 0;
    
    var navigator;
    
    if(option["page"]!=undefined) {
        PAGE_SIZE = option["page"];
    } else if(list.length<4) {
        PAGE_SIZE = list.length;
    }
    
    
    /*element height, width are updated and apply new width to each elements*/
    
    var elem_width = touch_area.width()/PAGE_SIZE;
    
    for(var i= 0; i< list.length; ++i) {
        list.eq(i).css({
            "width": elem_width + "px",
            "display": "inline-block",
            "position": "absolute",
            "top": 0,
            "left": width + "px",
        });
        var image = list.eq(i).find('img');
        image.attr("draggable","false");
        var elem_height = image.height()/image.width() * elem_width;
        image.css({
            "width": elem_width,
            "height": elem_height,
        })
        var elem = list.get(i);
        elem_width = elem.clientWidth;
        height = elem.clientHeight;
        width+= elem_width;
    }
    $(this).css({
        "width": width,
        "height": height,
    });
    
    /*attach navigation buttons*/
    var prev;
    var next;
    if(option["buttons"]) {
        touch_area.append("<div class='slider_button_wrap'><div class='slider_prev'>"+(option["button_image_left"]!=undefined?"":"&lt;")+"</div><div class='slider_next'>"+(option["button_image_right"]!=undefined?"":"&gt;")+"</div></div>");
                
        var button_wrap = touch_area.find('.slider_button_wrap');

        prev = button_wrap.find('.slider_prev');
        next = button_wrap.find('.slider_next');
        
        var button_height = option["button_height"]!=undefined?option["button_height"].replace("px",""): height;
        var button_width = option["button_width"]!=undefined?option["button_width"].replace("px",""): 40;
        var dispersion = option["button_dispersion"]!=undefined?option["button_dispersion"].replace("px",""): 0;

        button_wrap.css({
            "width":"100%",
            "height":height +"px",
            "top":0,
            "left":0,
            "position": "absolute",
        });
        var btn_attr={
            "width": button_width + "px",
            "height": button_height + "px",
            "line-height": button_height + "px",
            "text-align": "center",
            "cursor": "pointer",
            "color": option["button_basic_color"]!=undefined?option["button_basic_color"]:"#fff",
            "font-size": "30px",
            "opacity": "1",
            
            "top": "50%",
            "margin-top": -1*button_height/2 + "px",
            "position": "absolute",
        };
        prev.css(btn_attr);
        prev.css({
            "background": (option["button_background"]!=undefined?option["button_background"]:"rgba(0,0,0,0.3)")+(option["button_image_left"]!=undefined?" url("+option["button_image_left"]+") no-repeat center":""),
            "left": dispersion*-1 + "px",
        });
        next.css(btn_attr);
        next.css({
            "background": (option["button_background"]!=undefined?option["button_background"]:"rgba(0,0,0,0.3)")+(option["button_image_right"]!=undefined?" url("+option["button_image_right"]+") no-repeat center":""),
            "right": dispersion*-1 + "px",
        });
        
        prev.click(function(){
            move_smoothly(now_pos_x + elem_width, 500);
        })
        next.click(function(){
            move_smoothly(now_pos_x - elem_width, 500);
        })
    }
    var option_background_off = option["navigator_color_off"]!=undefined? option["navigator_color_off"]:"#fff";
    var option_background_on = option["navigator_color_on"]!=undefined? option["navigator_color_on"]:"#000";
    
    if(option["navigator"]){
        var navigator_height = option["navigator_height"]!=undefined?option["navigator_height"].replace("px",""): 14;
        var navigator_width = option["navigator_width"]!=undefined?option["navigator_width"].replace("px",""): 14;
        
        var ul = $("<ul class=\"slider_navigator\"></ul>");
        for(var i= 0; i< list.length; ++i) {
            ul.append("<li></li>")
        }
        touch_area.append(ul);
        navigator = ul.find("li");
        
        ul.css({
            "width":"100%",
            "height": navigator_height + "px",
            "text-align": option["navigator_position"]!=undefined? option["navigator_position"]:"center",
            "bottom": option["navigator_bottom"]!=undefined? option["navigator_bottom"]:"14px",
            "margin-bottom": option["navigator_margin_bottom"]!=undefined? option["navigator_margin_bottom"]:0,
            "left":0,
            "position": "absolute",
        })
        navigator.css({
            "width": navigator_width + "px",
            "height": navigator_height + "px",
            "margin": "0 "+navigator_height/2+"px",
            "display": "inline-block",
            "cursor": "pointer",
            "border-radius": option["navigator_radious"]!=undefined? option["navigator_radious"]:"50%",
        })
        navigator.click(function(){
            console.log("index : "+ $(this).index());
            move_smoothly(-1*$(this).index() * elem_width);
        })
    }
    
    button_display(0);
    
    /*add mouse events and define function finalize() for animation what makes suite for each index of images*/
    
    var MIN_POS_X= touch_area.width() - width;
    var MAX_POS_X= 0;
    console.log("max: "+ MAX_POS_X +", min: "+ MIN_POS_X + ", elem_width" + elem_width);
    
    var mouse_in = false;
    var is_animating = false;
    var range= 0;
    
    function button_display(index){
        if(navigator!=undefined){
            for(var i= 0; i< navigator.length;++i) {
                if(i == -1*index){
                    navigator.eq(i).css("background-color",option_background_on);
                } else {
                    navigator.eq(i).css("background-color",option_background_off);
                }
            }
        }
        if(prev!=undefined && next!=undefined) {
            if(index == 0) {
                prev.animate({"opacity": 0}, 100);
            } else {
                prev.animate({"opacity": 1}, 100);
            }
            if(PAGE_SIZE - index >= list.length) {
                next.animate({"opacity": 0}, 100);
            } else {
                next.animate({"opacity": 1}, 100);
            }
        }
    }
    
    function move(x) {
        if(x > MIN_POS_X && x <= MAX_POS_X) {
            for(var i= 0; i< list.length; ++i) {
                list.eq(i).css("left", x + i*elem_width);
            }
            now_pos_x = x;
        }
    }
    
    function move_smoothly(x, delay = 200) {
        if(x >= MIN_POS_X && x <= MAX_POS_X && !is_animating){
            is_animating = true;
            for(var i= 0; i< list.length; ++i) {
                list.eq(i).animate({
                    "left":x + i*elem_width
                }, delay, function(){
                    if(is_animating){
                        is_animating = false;
                        now_pos_x = x;
                        range= 0;
                        button_display(parseInt(now_pos_x/elem_width));
                    }
                });
            }
        }
    }
    
    function finalize(){
        console.log("call finalize");
        if(range!=0) {
            var dest_pos_x= now_pos_x- range;
            var elem_index = parseInt(dest_pos_x/elem_width  -0.5);
            dest_pos_x = elem_width * elem_index;
            move_smoothly(dest_pos_x);
        }
    };
    
    if(option["scrollable"]) {
        touch_area
        .mousemove(function(event){
            if(mouse_in && !is_animating) {
                if(starting_point == 0){
                    starting_point = event.pageX;
                    console.log("starting_point:" + starting_point);
                } else {
                    range = parseInt((starting_point - event.pageX)/10);
                    move(now_pos_x - range);
    //                if(now_pos_x - range > MIN_POS_X 
    //                   && now_pos_x - range < MAX_POS_X) {
    //                    now_pos_x -= range;
    //                    
    //                    move(now_pos_x);
    //                    console.log("now:" + now_pos_x);
    //                }
                }
            }
        })
        .mousedown(function(){
            if(!mouse_in && !is_animating) {
                mouse_in = true;
                starting_point = 0;
            }
            console.log("mouse_down");
        }).mouseup(function(){
            if(mouse_in && !is_animating) {
                mouse_in = false;
                finalize();
            }
            console.log("mouse_up");
        }).mouseleave(function(){
            if(mouse_in && !is_animating) {
                mouse_in = false;
                finalize();
            }
            console.log("mouse_leave");
        });
    }
}