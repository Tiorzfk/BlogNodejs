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
      var a =
        "<img class='head' src='https://comrade-app.azurewebsites.net/uploads/img/"+data.foto+"' alt='Article Picture' style='width:847.5px;height:400px'>"+
          "<div class='content'>"+
            "<div class='text'>"+
                "<p class='time'>"+data.tgl_posting+"</p>"+
                "<h5>"+data.judul+"</h5>"+
                "<p>"+data.isi+"</p>"+
                "<span class='line'></span>"+
                "<ul class='list-unstyled list-inline bottom'>"+
                  "<li class='tags'>"+
                    "<h3>"+
                      "<i class='fa fa-tags'></i>"+
                      "<a href='#'>#nature</a>"+
                      "<a href='#'>#landscape</a>"+
                      "<a href='#'>#flowers</a>"+
                      "<a href='#'>#travel</a>"+
                      "<a href='#'>#photography</a>"+
                      "<a href='#'>#forest</a>"+
                    "</h3>"+
                  "</li>"+
                  "<li class='pull-right'>"+
                    "<ul class='list-unstyled list-inline share-like'>"+
                      "<li><a href='#'><i class='fa fa-share-alt'></i></a></li>"+
                      "<li><a class='tooltips like' href='#'><i class='fa fa-heart'></i><span>12</span></a></li>"+
                    "</ul>"+
                  "</li>"+
                "</ul>"+
              "</div>"+
            "</div>";
      $('#detail').append(a);
    });
  },
  error: function (xhr, ajaxOptions, thrownError) {
    console.log(xhr);
  }
});
