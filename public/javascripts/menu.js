/**
 * Created by Jackey Li on 2015/5/19.
 */

/**
 * menu description / add order / favor -- show and hide
 *
 * @param e
 * @param action
 */
var menuAttach = function (e, action) {
    var childrenA = $(e).children('a');
    var cart = $(e).children('.cart');
    if (action === 'show') {
        childrenA.children('.menu_desc').show();
        childrenA.children('.menu_favor').show();
        cart.show();
    } else {
        childrenA.children('.menu_desc').hide();
        childrenA.children('.menu_favor').hide();
        cart.hide();
    }
};

//TODO: use proxy will be better
/**
 * menu mouseenter mouseover mouseleave
 * show / hide dom
 */
$('.menu').mouseenter(function () {
    menuAttach(this, 'show');
}).mousemove(function () {
    menuAttach(this, 'show');
}).mouseleave(function () {
    menuAttach(this, 'hide');
});

/**
 * add order
 *
 * @param e
 */
var addOrder = function (e) {
    var menuId = $(e).attr('menuId');
    var menuName = $(e).attr('menuName');
    var menuPrice = $(e).attr('menuPrice');
    var menu = {
        id: menuId,
        name: menuName,
        price: menuPrice
    };
    $.ajax({
        url: '/addOrder',
        method: 'POST',
        data: {menuId: menuId},
        success: function (response) {
            if (response.data === 'success') {
                addMessageOrder(menu);
                $('.message').animate({bottom: '0px'}, 1000);
            }
        },
        error: function (error) {
            console.log('add order fail:' + error);
            $('.error_message_content').html('add order fail,Please try again');
            $('.error').show();
        }
    });
};

/**
 * add order click
 */
$('.cart').click(function () {
    addOrder(this);
});

/**
 * add order double click
 */
$('.cart').dblclick(function () {
    addOrder(this);
});