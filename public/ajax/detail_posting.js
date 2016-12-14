var url = window.location.pathname;
var id = url.substring(url.lastIndexOf('/') + 1);
$.ajax({
  type: 'GET',
  url: 'http://comrade-api.azurewebsites.net/posing/'+id,
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
        "<img class='head' src='"+foto+"' alt='"+data.judul+"' style='width:749.5px;height:400px'>"+
          "<div class='content'>"+
            "<div class='text'>"+
                "<p class='time'>"+data.tgl_posting+"</p>"+
                "<h5>"+data.judul+"</h5>"+
                "<p>"+data.isi+" <a href="+data.sumber+" target=_blank>More</a></p>"+
                "<span class='line'></span>"+
                "<ul class='list-unstyled list-inline bottom'>"+
                  "<li class='tags'>"+
                    "<h3>"+
                      "<i class='fa fa-tags'></i>"+
                      "<a href='#'>#comrades</a>"+
                      "<a href='#'>#aplikasi</a>"+
                      "<a href='#'>#hiv</a>"+
                      "<a href='#'>#aids</a>"+
                      "<a href='#'>#hiv/aids</a>"+
                      "<a href='#'>#odha</a>"+
                      "<a href='#'>#informasi</a>"+
                      "<a href='#'>#konsultasi</a>"+
                      "<a href='#'>#support</a>"+
                      "<a href='#'>#dukungan</a>"+
                      "<a href='#'>#komunitas</a>"+
                    "</h3>"+
                  "</li>"+
                "</ul>"+
            "</div>";
      $('#detail').append(a);
    });
  },timeout: 16000,
  error: function (jqXHR, textStatus, thrownError) {
    if(textStatus==="timeout") {
      document.getElementById('cobalagi').style.display = 'block';
    }
  }
});
