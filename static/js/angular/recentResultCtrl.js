app.controller('recentResultCtrl', function($scope){
    $scope.recent = [];
    socket.emit('recentList');

    socket.on('recentList', function(data){
        // console.log(data);
        data = data.reverse();

        // Make seconds into minutes and seconds
        for (var i=0; i<data.length; i++) {
            // Work out lap time
            var negativeSign = "";
            var time = data[i].laps[data[i].laps.length - 1].end - data[i].laps[data[i].laps.length - 1].start;
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
            console.log(num);
            for (var x=0; x<num; x++) {
                var dummy = {
                    number: "-",
                    name: "-",
                    category: "-",
                    time: "-",
                    etaTime: "-"
                };
                data.push(dummy);
            }
        }

        $scope.recent = data;
        $scope.$apply();
    });
});
