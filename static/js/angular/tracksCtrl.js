app.controller('tracks', function($scope){
    $scope.track = {};
    $scope.trackList = {};

    socket.emit('trackList');

    $scope.newTrack = function() {
        data = {
            track_id: null,
            name: $scope.track.name,
            length: $scope.track.length
        };
        socket.emit('newTrack', data);
    };

    socket.on('newTrack', function(data){
        if (data.bool) {
            jquery('.noti').text(data.name +' was added to Tracks');
            jquery('#cancelNewTrack').click();
            setTimeout(function(){
                jquery('.noti').text('');
            },2500);
        } else {
            jquery('.noti').toggleClass('notiSuccess notiError').text("Something's wrong");
            setTimeout(function(){
                jquery('.noti').toggleClass('notiSuccess notiError').text('');
            },2500);
        }
    });

    socket.on('trackList', function(data){
        $scope.trackList = data;
        $scope.$apply();
    });
});
