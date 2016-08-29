var app = angular.module('myApp', []);
app.controller('artikelController', function($scope, $http){	
	$http.get('http://comrade-api.azurewebsites.net/posting/kategori/2').success(function(data)
	{
		console.log(data);
		$scope.updates = data; // response data 
	}).error(function(data){
		console.log(data);
	});
	
 });