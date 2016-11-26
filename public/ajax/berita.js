var slug = function(str) {
    var $slug = '';
    var trimmed = $.trim(str);
    $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
    replace(/-+/g, '-').
    replace(/^-|-$/g, '');
    return $slug.toLowerCase();
}

//berita
$.ajax({
  type: 'GET',
  url: 'http://comrade-api.azurewebsites.net/posting/kategori/1/page/0',
  dataType: 'json',
  beforeSend: function () {
        document.getElementById('loadingberita').style.display = 'block';
  },
  success: function (data) {
    document.getElementById('loadingberita').style.display = 'none';
    jQuery.each(data.result, function(i, data) {
      var url = data.tgl_posting.substring(0,4)+"/"+slug(data.judul)+"/"+data.id_posting;
      var cek = data.foto.substr(0, 4);
      var foto = "https://comrade-app.azurewebsites.net/uploads/img/"+data.foto+"";
      if(cek == 'http'){
        foto = data.foto;
      }
      var a = "<div class='col-sm-4'>"+
                "<article>"+
                  "<a href='post/"+url+"'> "+
                    "<div class='image'>"+
                      "<img src='"+foto+"' alt='"+data.judul+"' style='width:360px;height:221px'>"+
                        "<div class='overlay'>"+
                          "<i class='fa fa-eye'></i>"+
                        "</div>"+
                    "</div>"+
                  "</a>"+
                  "<div class='content'>"+
                    "<div class='text'>"+
                      "<p class='time'>"+data.tgl_posting+"</p>"+
                      "<h5><a href='post/"+url+"'>"+data.judul+"</a></h5>"+
                      "<p>"+data.deskripsi+".</p>"+
                      "<span class='line'></span>"+
                      "<ul class='list-unstyled list-inline bottom'>"+
                        "<li><h2><a href='blog-post.html#comments-list'><i class='fa fa-comment'></i>17 comments</a></h2></li>"+
                        "<li class='pull-right'>"+
                          "<ul class='list-unstyled list-inline share-like'>"+
                            "<li><a href='#'><i class='fa fa-share-alt'></i></a></li>"
                            "<li><a class='tooltips like' href='#'><i class='fa fa-hear'></i><span>12</span></a></li>"+
                          "</ul>"+
                        "</li>"+
                      "</ul>"+
                    "</div>"+
                  "</div>"+
                "</article>"+
              "</div>";
        $('#berita').append(a);
    });
  },
  error: function (xhr, ajaxOptions, thrownError) {
    console.log(xhr);
  }
});
