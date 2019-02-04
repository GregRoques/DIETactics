$(document).ready(()=>{
    // Navbar Mobile Functionality
    $('.navbar-mobile-links').css('display','none');
    $('.nav-burger').click(()=>{
        $('.navbar-mobile-links').toggle();
    });

    // Resizing for .video-content
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

    /* Populate today's date in Daily Input Form */
    let todaysDate = new Date();
    let todaysDay = todaysDate.getDate();
    let todaysMonth = todaysDate.getMonth() + 1;
    let todaysYear = todaysDate.getFullYear();

    if(todaysMonth < 10){
        todaysMonth = "0" + todaysMonth;
    }
    if(todaysDay < 10){
        todaysDay = "0" + todaysDay;
    }

    let today = `${todaysYear}-${todaysMonth}-${todaysDay}`;
    $('.date-input').val(today);
});

// User Home Page 
$(".daily-progress-form").submit(()=>{
    $(".right-information").css("visibility", "visible");
})