$(document).ready(function(){

    $('#form').submit(function () {
        btn = $('button[type="submit"]');
        simpleLoad(btn, true)

        simpleLoad(btn, false)
    });
});

function simpleLoad(btn, state) {
    if (state) {
        btn.attr('disabled','disabled');
        btn.contents().last().replaceWith(" Loading");
    } else {
        setTimeout(function () {
            btn.attr('disabled',false);
            btn.contents().last().replaceWith(" Save");
        }, 3000);
    }
}