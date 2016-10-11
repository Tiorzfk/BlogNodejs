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
  url: 'http://comrade-api.azurewebsites.net/kategori',
  dataType: 'json',
  success: function (data) {
    jQuery.each(data.result, function(i, data) {
      var url = data.tgl_posting.substring(0,4)+"/"+slug(data.judul)+"/"+data.id_posting;
      var a = "<li>"+
                "<p><a href='/event/<%=url%>'><%=data.nama%>.</a></p>"+
                "<p class='time'><%= moment(data.tgl_posting).format('DD MMM YYYY') %></p>"+
              "</li>";
        $('#event').append(a);
        if(i==1)
        return false;
    });
  },
  error: function (xhr, ajaxOptions, thrownError) {
    console.log(xhr);
  }
});
