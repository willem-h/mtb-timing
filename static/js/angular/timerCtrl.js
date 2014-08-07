app.controller('countCtrl', function($scope){
    var _time = 15;
    var time = _time;
    var timer = null;
    $scope.mins = addZeros(Math.floor(time/60));
    $scope.secs = addZeros(time%60);

    function addZeros(data) {
        data = data.toString();
        if (data.length == 1) {
            data = "0" + data;
        }
        return data;
    }

    function startTimer() {
        timer = setInterval(function(){
            time--;
            $scope.mins = addZeros(Math.floor(time/60));
            $scope.secs = addZeros(time%60);
            $scope.$apply();
            if (time === 0) {
                $('body').toggleClass('go');
                clearInterval(timer);
                timer = null;
                setTimeout(function(){
                    $('body').toggleClass('returnToNormal');
                },1500);
                setTimeout(function(){
                    $('body').toggleClass('returnText');
                },2200);
                setTimeout(function(){
                    $('body').toggleClass('returnText returnToNormal go');
                },3700);
            }
        },1000);
    }

    // $('#start').click(function(){
    //     if (timer === null) {
    //         startTimer();
    //     }
    //     console.log("started");
    // });
    //
    // $('#stop').click(function(){
    //     clearInterval(timer);
    //     timer = null;
    // });
    //
    $('#reset').click(function(){
        clearInterval(timer);
        timer = null;
        time = _time;
        $scope.mins = addZeros(Math.floor(time/60));
        $scope.secs = addZeros(time%60);
        $scope.$apply();
        startTimer();
    });

    startTimer();
});
