app.controller('overallResultCtrl', function($scope){
    $scope.overall = [];
    socket.emit('overallList');

    socket.on('overallList', function(data){
        console.log(data);
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
        if (data.length > 13) {
            data = data.slice(0,13);
        } else {
            var num = 13 - data.length;
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

        $scope.overall = data;
        $scope.$apply();
    });
});
