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
    $("#newRider").submit(function(e){
        var name = $("#newName").val();
        var num = $("#newNum").val();
        var cat = $("#newCat").val();
        var info = {
            name: name,
            number: num,
            category: cat,
            current: {
                    start: 30,
                    end: 0,
            },
            laps: {},
            avgSpeed: 0
        };
        // console.log(JSON.stringify(info));
        // var newRider = socketNewRider(info);
        socket.emit("newRider", info);
        socket.emit('riderList');
        socket.on('newRider', function(data){
            if (data.name) {
                $(".noti").text(data.name +" added successfully");
                $(".noti").addClass("notiSuccess");
                setTimeout(function(){
                    $(".noti").text("");
                },3000);
                $("#newName, #newNum, #newCat").val('');
            } else if (!data.name) {
                $(".noti").text("There's a problem databasing");
                $(".noti").addClass("notiFail");
            }
        });
        $('#newRiderBox, #riderList').toggleClass('hidden');
        e.preventDefault();
    });

    $("#cancelNewRider").click(function(){
        $("#newRider").trigger("reset");
    });

    // Search riders
    $('#riderNum').keyup(function(e){
        $('#searchNum, #searchName, #searchCat').text("");
        var query = $('#riderNum').val();
        if (query !== "" || query !== null) {
            socket.emit('search', query);
        }
    });

    $('#riderNumForm').submit(function(e){
        var rider = $('#riderNum').val();
        socket.emit('startRider', rider);
        $('#riderNum').val('');
        e.preventDefault();
    });

    $('#newRiderBtn, #cancelNewRider').click(function(){
        $('#newRiderBox, #riderList').toggleClass('hidden');
    });
});
