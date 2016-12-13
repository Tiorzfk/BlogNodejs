'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('adminApp', ['chart.js']).controller("chartcont", function ($scope,$http) {
  var host = "http://"+window.location.host;
  var base_url  = host+"/apiantrian/public/api/v1/";

  //History Operator
  $scope.tahunv = '-';
  $scope.bulanv = '-';
  var operator = [];
  var jumlah = [];
  $http.post(base_url+'historyall')
    .success(function (data, status, headers, config) {
      for (var i=0; i<data.result.length; i++) {
        operator.push(data.result[i].nama_operator);
      }
      for (var i=0; i<data.result.length; i++) {
        jumlah.push(data.result[i].jumlah);
      }
    }).error(function (data, status, header, config) {
      console.log(data);
  });
  $scope.labels = operator;
  $scope.colors = [{backgroundColor:[ '#f7464a', '#00ADF9','#97bbcd', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']}];
  $scope.series = ['Antrian Terlayani'];

  $scope.data = [jumlah];

});
