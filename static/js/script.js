function currentRiderUpdate (data) {
    $("#riderNum").val(data);
}

function addZeros(data) {
    data = data.toString();
    if (data.length == 1) {
        data = "0" + data;
    }
    return data;
}

$(document).ready(function(){
    // For dev purposes
    // $('#trackToggle').click();
    // $('#newTrackButton').click();

    // $('#categoryToggle').click();
    // $('#newCategoryButton').click();

    // $('#riderToggle').click();
    // $('#newRiderButton').click();
});
