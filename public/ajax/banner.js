$.ajax({
  type: 'GET',
  url: 'http://comrade-api.azurewebsites.net/listbanner',
  dataType: 'json',
  success: function (data) {
    jQuery.each(data.result, function(index, data) {
        $('.slides').append('<li><div class="carousel-caption"><h5>'+data.nama_banner+'</h5></div><img src="https://comrade-app.azurewebsites.net/uploads/banner/'+data.banner_img+'" class="head=image" style="height:550px"></li>');
    });
  }
});
