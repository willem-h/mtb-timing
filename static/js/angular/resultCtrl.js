app.controller('resultCtrl', function($scope){
    $scope.today = [];
    $scope.recent = [];
    $scope.onLap = [];
    socket.emit('resultList', function(){
        console.log("Request results");
    });

    socket.on('resultList', function(data){
        // var today = data[0];
        // var recent = data[1];
        var onLap;
        console.log(data.current);

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
            var etaTime = Math.round(((localStore.distance * 1000) / avgSpeed));
            etaTime = etaTime - time;
            var etaMins = addZeros(Math.abs(Math.ceil(etaTime/60)));
            var etaSecs = addZeros(Math.abs(etaTime%60));
            if (etaTime > 0) {
                negativeSign = "-";
                etaMins = addZeros(Math.abs(Math.floor(etaTime/60)));
            }
            data[i].etaTime = negativeSign + etaMins +":"+ etaSecs;
        }

        // $scope.today = today;
        // $scope.recent = recent;
        // $scope.onLap = onLap;
        $scope.onLap = onLap;
        $scope.$apply();
    });

    setInterval(function(){
        socket.emit('resultList');
    },1000);
});
