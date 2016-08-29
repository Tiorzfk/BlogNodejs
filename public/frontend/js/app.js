var app = angular.module('myApp', []);
app.controller('artikelController', function($scope, $http){	
	$http.get('http://comrade-api.azurewebsites.net/posting/kategori/2').success(function(data)
	{
		$scope.dataartikel = data.result; // response data 
	}).error(function(data){
		console.log(data);
	});
	
 });

app.controller('eventController', function($scope, $http){	
	$http.get('http://comrade-api.azurewebsites.net/event/public').success(function(data)
	{
		$scope.dataevent = data.result; // response data 
	}).error(function(data){
		console.log(data);
	});
	
 });

app.controller('beritaController', function($scope, $http){	
	$http.get('http://comrade-api.azurewebsites.net/posting/kategori/1').success(function(data)
	{
		$scope.databerita = data.result; // response data 
	}).error(function(data){
		console.log(data);
	});
	
 });

app.controller('bannerController', function($scope, $http){	
	$http.get('http://comrade-api.azurewebsites.net/banner').success(function(data)
	{
		$scope.databanner = data.result; // response data 
	}).error(function(data){
		console.log(data);
	});
	
 });