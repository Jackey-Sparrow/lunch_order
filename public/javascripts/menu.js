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

var testA = function (arg) {
    console.log(arg);
};

//TODO: use proxy will be better
/**
 * menu mouseenter mouseover mouseleave
 * show / hide dom
 */
$('.menu').mouseenter(function () {
    menuAttach(this, 'show');
    //$.proxy(menuAttach('show'),this);

}).mousemove(function () {
    menuAttach(this, 'show');
    //$.proxy(testA,this,'show');
    //$.proxy(menuAttach('show'),this);
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
                var record = response.record;
                menu.record = record;
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

$('.menu_message_delete').click(function () {
    var orderId = $(this).attr('orderId');
    var that = this;
    $.ajax({
        url: '/deleteOrder',
        method: 'POST',
        data: {orderId: orderId},
        success: function (response) {
            console.log(response);
            $(that).parent('.menu_message').remove();
            calculate();
        },
        error: function (error) {
            console.log('delete order fail' + error);
            //todo: show error dialog
        }
    });
});