app.controller('categories', function($scope){
    $scope.category = {};
    $scope.categoryList = {};
    $scope.trackList = {};

    socket.emit('categoryList');

    $scope.newCategory = function() {
        data = {
            category_id: null,
            name: $scope.category.name,
            parameters: $scope.category.parameters,
            track_id: $scope.category.track_id
        };
        socket.emit('newCategory', data);
        angular.element('#cancelNewCategory').click();
    };

    $scope.deleteCategory = function (id) {
        var d = confirm("You are deleting a category");
        if (d) {
            socket.emit('deleteCategory', id);
        }
    };

    socket.on('categoryList', function(data){
        $scope.categoryList = data;
        $scope.$apply();
    });

    socket.on('trackList', function (data) {
        $scope.trackList = data;
        $scope.$apply();
    });

    angular.element('#newCategoryButton').click(function(){
        angular.element('#categoryList, #newCategoryBox, .categoryBoxHeading, #newCategoryButton').toggleClass('hidden');
    });

    angular.element("#cancelNewCategory").click(function(){
        angular.element("#newCategory").trigger("reset");
        angular.element('#newCategoryButton').click();
    });
});
