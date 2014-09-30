app.controller('femaleOverallResultCtrl', function($scope){
    $scope.femaleOverall = [];

    socket.on('femaleOverallList', function(data){
        // Make seconds into minutes and seconds
        for (var i=0; i<data.length; i++) {
            // Work out lap time
            var negativeSign = "";
            var time = data[i].lap.end - data[i].lap.start;
            var mins = addZeros(Math.abs(Math.floor(time/60)));
            var secs = addZeros(Math.abs(time%60));
            if (time < 0) {
                negativeSign = "-";
                mins = addZeros(Math.abs(Math.ceil(time/60)));
            }
            data[i].time = negativeSign + mins +":"+ secs;
        }

        // Limit array to 5 elements and add some if less to preserve page formatting
        if (data.length > 5) {
            data = data.slice(0,5);
        } else {
            var num = 5 - data.length;
            for (var x=0; x<num; x++) {
                var dummy = {
                    rank: "-",
                    number: "-",
                    name: "-",
                    category: "-",
                    time: "-"
                };
                data.push(dummy);
            }
        }

        $scope.femaleOverall = data;
        $scope.$apply();
    });
});
