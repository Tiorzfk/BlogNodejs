var slug = function(str) {
    var $slug = '';
    var trimmed = $.trim(str);
    $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
    replace(/-+/g, '-').
    replace(/^-|-$/g, '');
    return $slug.toLowerCase();
}

// $("#morebtn").click(function() {
//   var i = 8;
//   localStorage.setItem('lastname','Smith');
//   $.ajax({
//     type: 'GET',
//     url: 'http://comrade-api.azurewebsites.net/postingMongo/kategori/Berita/page/'+i,
//     dataType: 'json',
//     beforeSend: function () {
//           document.getElementById('loadingmoreartikel').style.display = 'block';
//     },
//     success: function (data) {
//       document.getElementById('loadingmoreartikel').style.display = 'none';
//       jQuery.each(data.result, function(i, data) {
//         var url = data.tgl_posting.substring(0,4)+"/"+slug(data.judul)+"/"+data._id;
//         var cek = data.foto.substr(0, 4);
//         var foto = "https://comrade-app.azurewebsites.net/uploads/img/"+data.foto+"";
//         if(cek == 'http'){
//           foto = data.foto;
//         }
//         var a = "<div class='col-sm-4' style='height: 550px'>"+
//                   "<article>"+
//                     "<a href='post/"+url+"'> "+
//                       "<div class='image'>"+
//                         "<img src='"+foto+"' alt='"+data.judul+"' style='width:290px;height:186px'>"+
//                           "<div class='overlay'>"+
//                             "<i class='fa fa-eye'></i>"+
//                           "</div>"+
//                       "</div>"+
//                     "</a>"+
//                     "<div class='content'>"+
//                       "<div class='text'>"+
//                         "<p class='time'>"+data.tgl_posting+"</p>"+
//                         "<h5><a href='post/"+url+"'>"+data.judul+"</a></h5>"+
//                         "<p>"+data.deskripsi+".</p>"+
//                         "<span class='line'></span>"+
//                         "<ul class='list-unstyled list-inline bottom'>"+
//                           "<li><h2><a href='blog-post.html#comments-list'><i class='fa fa-comment'></i>17 comments</a></h2></li>"+
//                           "<li class='pull-right'>"+
//                             "<ul class='list-unstyled list-inline share-like'>"+
//                               "<li><a href='#'><i class='fa fa-share-alt'></i></a></li>"
//                               "<li><a class='tooltips like' href='#'><i class='fa fa-hear'></i><span>12</span></a></li>"+
//                             "</ul>"+
//                           "</li>"+
//                         "</ul>"+
//                       "</div>"+
//                     "</div>"+
//                   "</article>"+
//                 "</div>";
//           $('#artikel').append(a);
//       });
//     },
//     error: function (jqXHR, ajaxOptions, thrownError) {
//       console.log(jqXHR.thrownError.ajaxOptions);
//     }
//   });
// });

$.ajax({
  type: 'GET',
  url: 'http://comrade-api.azurewebsites.net/postingMongo/kategori/Artikel',
  dataType: 'json',
  beforeSend: function () {
        document.getElementById('loadingartikel').style.display = 'block';
  },
  success: function (data) {
    document.getElementById('loadingartikel').style.display = 'none';
    jQuery.each(data.result, function(i, data) {
      var url = data.tgl_posting.substring(0,4)+"/"+slug(data.judul)+"/"+data._id;
      var cek = data.foto.substr(0, 4);
      var foto = "https://comrade-api.azurewebsites.net/pic_posting/"+data.foto+"";
      if(cek == 'http'){
        foto = data.foto;
      }
      var a = "<div class='col-sm-4' style='height: 550px'>"+
                "<article>"+
                  "<a href='post/"+url+"'> "+
                    "<div class='image'>"+
                      "<img src='"+foto+"' alt='"+data.judul+"' style='width:290px;height:186px'>"+
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
        $('#artikel').append(a);
    });
  },timeout: 16000,
  error: function (jqXHR, textStatus, thrownError) {
    if(textStatus==="timeout") {
      document.getElementById('cobalagi').style.display = 'block';
    }
  }
});
