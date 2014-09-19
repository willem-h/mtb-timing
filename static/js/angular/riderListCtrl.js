app.controller('riderListCtrl', function($scope){
    $scope.active = []
    socket.emit('activeList', function(){
        console.log("Request active rider list");
    });

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
                console.log(avgSpeed);
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

        $scope.active = data;
        $scope.$apply();
    });

    setInterval(function(){
        socket.emit('activeList');
    },1000);
});
