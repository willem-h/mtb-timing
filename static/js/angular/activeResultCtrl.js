app.controller('activeResultCtrl', function($scope){
    $scope.active = [];

    socket.on('activeList', function(data){
        // Make seconds into minutes and seconds
        for (var i=0; i<data.length; i++) {
            // Work out lap time
            var negativeSign = "";
            var time = Math.floor(Date.now()/1000) - data[i].current.start;
            var mins = addZeros(Math.abs(Math.floor(time/60)));
            var secs = addZeros(Math.abs(time%60));
            if (time < 0) {
                negativeSign = "-";
                mins = addZeros(Math.abs(Math.ceil(time/60)));
            }
            data[i].time = negativeSign + mins +":"+ secs;

            // Work out ETA time
            var avgSpeed = (data[i].totalDistance * 1000) / data[i].totalTime;
            if (avgSpeed) {
                // console.log(avgSpeed);
                var etaTime = Math.round(((localStore.distance * 1000) / avgSpeed));
                etaTime = etaTime - time;
                var etaMins = addZeros(Math.abs(Math.ceil(etaTime/60)));
                var etaSecs = addZeros(Math.abs(etaTime%60));
                if (etaTime > 0) {
                    negativeSign = "-";
                    etaMins = addZeros(Math.abs(Math.floor(etaTime/60)));
                }
                data[i].etaTime = negativeSign + etaMins +":"+ etaSecs;
            } else {
                data[i].etaTime = "N/A";
            }
        }

        // Limit array to 5 elements and add some if less to preserve page formatting
        if (data.length > 5) {
            data = data.slice(0,5);
        } else {
            var num = 5 - data.length;
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

        $scope.active = data;
        $scope.$apply();
    });
});
