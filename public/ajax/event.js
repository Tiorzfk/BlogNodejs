var slug = function(str) {
    var $slug = '';
    var trimmed = $.trim(str);
    $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
    replace(/-+/g, '-').
    replace(/^-|-$/g, '');
    return $slug.toLowerCase();
}
//event
$.ajax({
  type: 'GET',
  url: 'http://comrade-api.azurewebsites.net/event/public/page/0',
  dataType: 'json',
  beforeSend: function () {
        document.getElementById('loadingevent').style.display = 'block';
  },
  success: function (data) {
    document.getElementById('loadingevent').style.display = 'none';
    jQuery.each(data.result, function(i, data) {
      var url = data.tgl_posting.substring(0,4)+"/"+slug(data.nama)+"/"+data.id_event;
      var text = $(data.deskripsi).text()
      var arrayisi = text.split(' ');//striptags(data.deskripsi).split(' ');
      var sliceisi = arrayisi.slice(0,17);
      var a = "<div class='col-sm-4'>"+
                "<article>"+
                  "<a href='event/"+url+"'> "+
                    "<div class='image'>"+
                      "<img src='https://comrade-app.azurewebsites.net/uploads/img/event/"+data.foto+"' alt='' style='width:360px;height:221px'>"+
                        "<div class='overlay'>"+
                          "<i class='fa fa-eye'></i>"+
                        "</div>"+
                    "</div>"+
                  "</a>"+
                  "<div class='content'>"+
                    "<div class='text'>"+
                      "<p class='time'>"+data.tgl_event+"</p>"+
                      "<h5><a href='event/"+url+"'>"+data.nama+"</a></h5>"+
                      "<p>"+sliceisi.join(' ')+".</p>"+
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
        $('#event').append(a);
        if(i==2)
        return false;
    });
  }
});
