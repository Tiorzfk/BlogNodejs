$.ajax({
  type: 'GET',
  url: 'http://comrade-api.azurewebsites.net/listbanner',
  dataType: 'json',
  success: function (data) {
    jQuery.each(data.result, function(index, data) {
        $('.slides').append('<li><img src="https://comrade-app.azurewebsites.net/uploads/banner/'+data.banner_img+'" class="head=image" style="height:200px"></li>');
    });
  }
});
