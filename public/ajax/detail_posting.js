var url = window.location.pathname;
var id = url.substring(url.lastIndexOf('/') + 1);
$.ajax({
  type: 'GET',
  url: 'http://comrade-api.azurewebsites.net/posting/'+id,
  dataType: 'json',
  beforeSend: function () {
        document.getElementById('loadingartikel').style.display = 'block';
  },
  success: function (data) {
    document.getElementById('loadingartikel').style.display = 'none';
    jQuery.each(data.result, function(i, data) {
      var cek = data.foto.substr(0, 4);
      var foto = "https://comrade-app.azurewebsites.net/uploads/img/"+data.foto+"";
      if(cek == 'http'){
        foto = data.foto;
      }
      var a =
        "<img class='head' src='"+foto+"' alt='Article Picture' style='width:749.5px;height:400px'>"+
          "<div class='content'>"+
            "<div class='text'>"+
                "<p class='time'>"+data.tgl_posting+"</p>"+
                "<h5>"+data.judul+"</h5>"+
                "<p>"+data.isi+"</p>"+
                "<span class='line'></span>"+
            "</div>";
      $('#detail').append(a);
    });
  },
  error: function (xhr, ajaxOptions, thrownError) {
    console.log(xhr);
  }
});
