/**
 * Created by Jackey Li on 2015/5/17.
 */
var sidebar = '<div class="sidebar">' +
    '<a href="/">返回菜单</a>' +
    '<a class="today_order">今天已点</a>' +
    '<a>意见提议</a>' +
    '</div>';

$('body').append(sidebar);

$('.today_order').click(function(){
    var bottom = $('.message').css('bottom');
    if(parseInt(bottom)===0){
        $('.message').animate({bottom: '-100%'}, 1000);
    }else{
        $('.message').animate({bottom: '0px'}, 1000);
    }
});