app.controller('categories', function($scope){
    $scope.category = {};
    $scope.categoryList = {};

    socket.emit('categoryList');

    $scope.newCategory = function() {
        data = {
            category_id: null,
            name: $scope.category.name,
            parameters: $scope.category.parameters,
            track_id: $scope.category.track_id
        };
        socket.emit('newCategory', data);
    };

    socket.on('newCategory', function(data){
        if (data.bool) {
            jquery('.noti').text(data.name +' was added to Categories');
            jquery('#cancelNewCategory').click();
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

    socket.on('categoryList', function(data){
        $scope.categoryList = data;
        $scope.$apply();
    });
});
