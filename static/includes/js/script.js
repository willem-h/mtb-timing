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
        var newRider = socketNewRider(info);
        console.log(newRider);
        if (newRider == "true") {
            $(".noti").text(name +" added successfully");
            $(".noti").addClass("notiSuccess");
        } else {
            $(".noti").text("There's a problem databasing");
            $(".noti").addClass("notiFail");
        }
        e.preventDefault();
    });

    $("#cancelNewRider").click(function(){
        $("#newRider").trigger("reset");
    });
});
