var slug = function(str) {
    var $slug = '';
    var trimmed = $.trim(str);
    $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
    replace(/-+/g, '-').
    replace(/^-|-$/g, '');
    return $slug.toLowerCase();
}

$.ajax({
  type: 'GET',
  url: 'http://comrade-api.azurewebsites.net/kategori',
  dataType: 'json',
  success: function (data) {
    jQuery.each(data.result, function(i, data) {
      var a = "<li><p><a href='/"+data.nama+"'>"+data.nama+"<span>"+data.jml_post+"</span></a></p></li>";
        $('#kategori').append(a);
    });
  },
  error: function (xhr, ajaxOptions, thrownError) {
    console.log(xhr);
  }
});

$.ajax({
  type: 'GET',
  url: 'http://comrade-api.azurewebsites.net/event/public/page/0',
  dataType: 'json',
  success: function (data) {
    jQuery.each(data.result, function(i, data) {
      var url = data.tgl_posting.substring(0,4)+"/"+slug(data.nama)+"/"+data.id_event;
      var a = "<li>"+
                "<p><a href='/event/"+url+"'>"+data.nama+".</a></p>"+
                "<p class='time'>"+data.tgl_mulai+"</p>"+
              "</li>";
        $('#eventnav').append(a);
        if(i==5)
        return false;
    });
  },
  error: function (xhr, ajaxOptions, thrownError) {
    console.log(xhr);
  }
});
