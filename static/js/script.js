var localStore;
if (localStorage.mtb_timing) {
    localStore = JSON.parse(localStorage.mtb_timing);
} else {
    localStore = {
        distance: 0,
    };
}

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
    $("#lapDist").val(localStore.distance);

    $("#newRider").submit(function(e){
        var name = $("#newName").val();
        var num = $("#newNum").val();
        var cat = $("#newCat").val();
        var info = {
            name: name,
            number: num,
            category: cat,
            current: {
                start: 0,
                end: 0,
                distance: 0
            },
            laps: [],
            totalTime: 0,
            totalDistance: 0
        };

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
        var distance = $("#lapDist").val();
        socket.emit('startRider', [rider,distance]);
        $('#riderNum').val('');
        e.preventDefault();
    });

    $("#lapDistForm").submit(function(e){
        var distance = $("#lapDist").val();
        console.log("Submit distance: "+ distance);
        localStore.distance = distance;
        localStorage.setItem('mtb_timing', JSON.stringify(localStore));
        e.preventDefault();
    });

    $("#newRider input").focusout(function(){
        data = $(this).val();
        if (data == null || data == "") {
            $(this).parent().addClass('has-error');
        }
    });

    $('#newRiderButton').click(function(){
        $('#riderList, #newRiderBox, .riderBoxHeading, #newRiderButton').toggleClass('hidden');
    });

    $('#newCategoryButton').click(function(){
        $('#categoryList, #newCategoryBox, .categoryBoxHeading, #newCategoryButton').toggleClass('hidden');
    });

    $('#newTrackButton').click(function(){
        $('#trackList, #newTrackBox, trackBoxHeading, #newTrackButton').toggleClass('hidden');
    });

    $("#cancelNewCategory").click(function(){
        $("#newCategory").trigger("reset");
        $('#newCategoryButton').click();
    });

    $("#cancelNewRider").click(function(){
        $("#newRider").trigger("reset");
        $('#newRiderButton').click();
    });

    $("#cancelNewTrack").click(function(){
        $("#newTrack").trigger("reset");
        $('#newTrackButton').click();
    });

    // For dev purposes
    // $('#trackToggle').click();
    // $('#newTrackButton').click();
});
