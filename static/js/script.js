function currentRiderUpdate (data) {
    $("#riderNum").val(data);
}

$(document).ready(function(){
    $("#newRider").submit(function(e){
        var name = $("#newName").val();
        var num = $("#newNum").val();
        var cat = $("#newCat").val();
        var info = {
            name: name,
            number: num,
            category: cat
        };
        console.log(JSON.stringify(info));
        var newRider = socketNewRider(info);
        if (newRider == "1") {
            $(".noti").text(name +" added successfully");
            $(".noti").addClass("notiSuccess");
        } else if (newRider == '0') {
            $(".noti").text("There's a problem databasing");
            $(".noti").addClass("notiFail");
        }
        e.preventDefault();
    });

    $("#cancelNewRider").click(function(){
        $("#newRider").trigger("reset");
    });

    // Search riders
    $('#riderNum').keyup(function(){
        $('#searchNum, #searchName, #searchCat').text("");
        var query = $('#riderNum').val();
        if (query !== "" && query !== null) {
            console.log(query);
            socketSearch(query);
        }
    });
});
