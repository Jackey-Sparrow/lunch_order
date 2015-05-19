/**
 * Created by Jackey Li on 2015/5/17.
 */

/**
 * basic menu string
 *
 * @param menu
 * @returns {string}
 */
var menuMessage = function (menu) {
    var str = '<div class="menu_message" menuId="' + menu.id + '">' +
        '<div class="menu_message_name">' + menu.name + '</div>' +
        '<div class="menu_message_total">1</div>' +
        '<div class="menu_message_price">¥ ' + menu.price + '</div>' +
        '</div>';
    return str;
};

/**
 * calculate the total price and num
 *
 * @param menu
 */
var calculate = function (menu) {
    var $total = $('.message .total');
    var totalOrder = parseInt($total.children('.menu_message_total').html());
    $total.children('.menu_message_total').html(totalOrder + 1);
    var totalMoney = parseInt($total.children('.menu_message_price').html().replace('¥', ''));
    $total.children('.menu_message_price').html('¥ ' + (totalMoney + parseInt(menu.price)));
};

/**
 * add message to basket
 *
 * @param menu
 */
var addMessageOrder = function (menu) {
    var $menus = $('.menus_container .menu_message');
    var id = menu.id;
    calculate(menu);
    for (var i = 0; i < $menus.length; i++) {
        var $menu = $($menus[i]);
        var menuId = $menu.attr('menuId');
        if (parseInt(id) === parseInt(menuId)) {
            var total = parseInt($menu.children('.menu_message_total').html());
            total++;
            $menu.children('.menu_message_total').html(total);
            return;
        }
    }
    $('.menus_container').append(menuMessage(menu));
};


//var messageStr = '<div class="message" <%=user%> >' +
//    '<div class="menus_container">' +
//    '</div>' +
//    '<div class="menu_message total">' +
//    '<div class="menu_message_name">今日已点</div>' +
//    '<div class="menu_message_total">0</div>' +
//    '<div class="menu_message_price">¥ 0</div>' +
//    '</div>' +
//    '</div>';
//$('body').append(messageStr);