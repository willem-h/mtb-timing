app.controller('countCtrl', function($scope){
    var _time = 10;
    var time = _time;
    var timer = null;
    $scope.mins = addZeros(0);
    $scope.secs = addZeros(0);

    function startTimer() {
        clearInterval(timer);
        timer = null;

        timer = setInterval(function(){
            time--;
            $scope.mins = addZeros(Math.floor(time/60));
            $scope.secs = addZeros(time%60);
            $scope.$apply();
            if (time === 0) {
                socket.emit('riderSent', $scope.number);
                $('body').toggleClass('go');
                clearInterval(timer);
                timer = null;
                setTimeout(function(){
                    $('body').toggleClass('returnToNormal');
                },1800);
                setTimeout(function(){
                    $('body').toggleClass('returnText');
                    $scope.number = '';
                    $scope.name = '';
                    $scope.category = '';
                    $scope.$apply();
                },2500);
                setTimeout(function(){
                    $('body').toggleClass('returnText returnToNormal go');
                },4000);
            }
        },1000);
    }

    $('#reset').click(function(){
        clearInterval(timer);
        timer = null;
        time = _time;
        $scope.mins = addZeros(Math.floor(time/60));
        $scope.secs = addZeros(time%60);
        $scope.$apply();
        startTimer();
    });

    socket.on('startRider', function(data){
        console.log("Start rider: "+ data.rider.name);

        time = data.start - Math.floor(Date.now()/1000);
        $scope.mins = addZeros(Math.floor(time/60));
        $scope.secs = addZeros(time%60);
        $scope.number = data.rider.number;
        $scope.name = data.rider.name;
        $scope.category = data.rider.category;
        $scope.$apply();
        startTimer();
    });
});
