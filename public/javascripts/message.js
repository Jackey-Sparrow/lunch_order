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
        '<div class="menu_message_delete" orderId="' + menu.record._id + '">x</div>' +
        '</div>';
    return str;
};

/**
 * calculate the total price and num
 *
 * @param menu
 */
var calculate = function () {
    var $menus = $('.menus_container .menu_message');
    var $totals = $menus.children('.menu_message_total');
    var $totalMoney = $menus.children('.menu_message_price');
    var len = $menus.length;
    var total = 0,
        totalMoney = 0;
    for (var i = 0; i < len; i++) {
        var num = parseInt($($totals[i]).html());
        var price = parseInt($($totalMoney[i]).html().replace('¥', ''));
        total += num;
        totalMoney += price * num;
    }

    var $total = $('.message .total');
    $total.children('.menu_message_total').html(total);
    $total.children('.menu_message_price').html('¥ ' + totalMoney);
};

/**
 * add message to basket
 *
 * @param menu
 */
var addMessageOrder = function (menu) {
    var $menus = $('.menus_container .menu_message');
    var id = menu.id;

    for (var i = 0; i < $menus.length; i++) {
        var $menu = $($menus[i]);
        var menuId = $menu.attr('menuId');
        if (parseInt(id) === parseInt(menuId)) {
            var total = parseInt($menu.children('.menu_message_total').html());
            total++;
            $menu.children('.menu_message_total').html(total);
            calculate();
            return;
        }
    }
    $('.menus_container').append(menuMessage(menu));
    calculate(menu);
};

