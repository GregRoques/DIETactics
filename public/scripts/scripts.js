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
    });

    $('.nav-burger').click(()=>{
        $('.navbar-mobile-links').toggle();
    });
});