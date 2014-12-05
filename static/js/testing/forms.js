function makeString (type) {
    var text = "";
    var possible;
    if (type == 'mix') {
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    } else {
        possible = "123456789";
    }


    for( var i=0; i < 7; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

$(document).ready(function(){
    $('#trackToggle').click();
    // $('#newTrackButton').click();
    // $('#newTrackName').click();
    // $('#newTrackName').val(makeString('mix'));
    // $('#newTrackLength').val(Number(makeString('numbers')));
    // $('#submitNewTrack').click();

    $('#trackToggle').click(function(){
        $('#newTrackButton').click();
    });
});
