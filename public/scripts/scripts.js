$(document).ready(()=>{
    $('.navbar-mobile-links').css('display','none');

    let winWid = $(window).width();
    let eWid = $('.video-content').width();
    let totalSpace = winWid - eWid;
    let halfSpace = totalSpace/2;
    $('.video-content').css('left', halfSpace);

    $(window).resize(()=>{
        let winWid = $(window).width();
        let eWid = $('.video-content').width();
        let totalSpace = winWid - eWid;
        let halfSpace = totalSpace/2;
        $('.video-content').css('left', halfSpace);
        //footerAdjust();
    });    

    //footerAdjust();

    $('.nav-burger').click(()=>{
        $('.navbar-mobile-links').toggle();
    });
});

/*function footerAdjust(){
    if(window.location.href.includes("register") || window.location.href.includes("login")){
        if($(window).height() > 852){
            $('.footer').css({
                'position':'absolute',
                'bottom':'0',
                'width':'100%'
            })
        }
    }

}*/

// User Home Page 
$(".daily-progress-form").submit(()=>{
    $(".right-information").css("visibility", "visible");
})
