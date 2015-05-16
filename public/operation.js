/**
 * Created by Jackey Li on 2015/5/14.
 */
$(function () {
    //var
    $('.menu').click(function () {
        var isSelected = $(this).attr('class').indexOf('selected');
        if (isSelected === -1) {
            $('.menu').removeClass('selected');
            $(this).addClass('selected');
        }
    }).dblclick(function(){

        $('#myForm').modal('show');
    });

    $('.cancel').click(function(){
        $('#myForm').modal('hide');
    });
});