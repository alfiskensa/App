var App = angular.module('controllers', []);

/*creating Directive to Upload file starts*/
App.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          
          element.bind('change', function(event){
             scope.$apply(function(){
                var files = event.target.files;
                /* 
                    Writing the selected file name below the Upload image
                */  
                angular.element( document.querySelector( '#selectedFile' )).html(files[0].name);
                modelSetter(scope, element[0].files[0]);
             });
          });
       }
    };
}]);

App.controller('ReadCtrl', function($scope, api, $route){
	$scope.api = [];
	api.read().then(function(data){
		$scope.api = data.data;
		if(data.data.length === 0){
			$scope.notFound = true;
		}
	},function(data){
		console.log("data", data);
	});

	$scope.deletar = function(id){
        if (confirm("sure to delete?")) {
            api.delete(id).then(function(data){
			console.log(data);
			$route.reload();
		});	     
        }    
            
	};
});	

App.controller('CreateCtrl', function($scope, api, fileUpload, $location){
	$scope.tambah = function(item){
            var data = {
			nim : item.nim, 
			nama : item.nama,
			prodi : item.prodi, 
            jk : item.jk,
            agama : item.agama,
            alamat : item.alamat,
            hobby : item.hobby
            };
		api.create(data).then(function(data){
			$location.path('/');
            $scope.success = true;
	});
  };    
});

App.controller('EditCtrl', function($scope, api, $routeParams, $location){
	var id = $routeParams.id;
	api.profile(id).then(function(data){
		$scope.item = data.data;
        if(data.data.jk == 'Laki - Laki'){
			$scope.laki = true;
		}else{
            $scope.perempuan = true;
        }
	});

	$scope.edit = function(item){
		console.log(item);
		api.update(item, item.id).then(function(data){
			$location.path('/');
		});
	};
});	

