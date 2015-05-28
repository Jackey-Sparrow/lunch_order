/**
 * Created by Jackey Li on 2015/5/19.
 */

var errorStr = '<div class="error">' +
    '<div class="error_message_overlay">' +
    '</div>' +
    '<div class="error_message_content">' +
    '<div class="error_message_content_top">' +
    '<div class="error_message_content_title"></div>' +
    '<div class="error_message_content_close">x</div>' +
    '</div>' +
    '<div class="error_message_content_message"></div>' +
    '</div>' +
    '</div>';
$('body').append(errorStr);
var bodyHeight = $('html').css('height');
$('.error_message_overlay').css('height', bodyHeight);
//todo:calculate error message position

function showError(message, title) {
    title = title ? title : '非常抱歉';
    message = message ? message : '系统异常，请重试.';
    $('.error_message_content_title').html(title);
    $('.error_message_content_message').html(message);
    $('.error').show();
}

function closeError() {
    $('.error').hide();
}

$('.error_message_content_close').click(function () {
    closeError();
});