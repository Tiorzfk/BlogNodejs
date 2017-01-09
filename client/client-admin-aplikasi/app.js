//app.js
(function($) {
  var host = "http://"+window.location.host;
  if(!sessionStorage.getItem('id')){
    window.location.href = host+"/admin-login";
  }

  var email=sessionStorage.getItem("email"),
      jenis=sessionStorage.getItem("jenis_admin");
  $('#email').text(email);
  $('#jenis').text(jenis);
  var app = $.sammy('#app', function() {
    this.use('Template');
 
    // this.around(function(callback) {
    //   var context = this;
    // });
 
    this.get('#/', function(context) {
      $('#namepage').text('Dashboard Admin Aplikasi');
      $('#breadcrumb').text('Dashboard');
      context.app.swap('');
      // $.each(this.items, function(i, item) {
        context.render('home.template')
               .appendTo(context.$element());
      // });
    });
     
    this.get('#/artikel/', function(context) {
        $('#breadcrumb').text('Manage Artikel');
        $('#namepage').text('Manage Artikel');
        var str=location.href.toLowerCase();
        context.app.swap('');
        context.render('artikel/index.template')
               .appendTo(context.$element());
    });

    this.get('#/posting/detail/:id', function(context) {
      context.app.swap('');
      $('#breadcrumb').text('Detail Posting');
      $('#namepage').text('Detail Posting');
      var id = this.params['id'];
      if (!id) { return this.notFound(); }
      $.ajax({
          url: 'http://comrade-api.azurewebsites.net/posting/'+id,
          dataType: 'json',
          success: function(items) {
            $.each(items.result, function(i, item) {
              var cek = item.foto.substr(0, 4);
              var foto = "https://comrade-api.azurewebsites.net/pic_posting/"+item.foto+"";
              if(cek == 'http'){
                foto = item.foto;
              }
              context.partial('posting/detail.template', {artikel: item,foto: foto});
            });
          }
        });
    });

    this.get('#/event/', function(context) {
        $('#breadcrumb').text('Manage Event');
        $('#namepage').text('Manage Event');
        var str=location.href.toLowerCase();
        context.app.swap('');
        context.render('event/index.template')
               .appendTo(context.$element());
    });

    this.get('#/event/detail/:id', function(context) {
      context.app.swap('');
      $('#breadcrumb').text('Detail Event');
      $('#namepage').text('Detail Event');
      var id = this.params['id'];
      if (!id) { return this.notFound(); }
      $.ajax({
          url: 'http://comrade-api.azurewebsites.net/detailevent/'+id,
          dataType: 'json',
          success: function(items) {
            $.each(items.result, function(i, item) {
              var cek = item.foto.substr(0, 4);
              var foto = "https://comrade-api.azurewebsites.net/pic_event/"+item.foto+"";
              if(cek == 'http'){
                foto = item.foto;
              }
              context.partial('event/detail.template', {event: item,foto: foto});
            });
          }
        });
    });

    this.get('#/event/new/', function(context) {
      context.app.swap('');
      $('#breadcrumb').text('Tambah Event');
      $('#namepage').text('Tambah Event');
      context.app.swap('');
      context.render('event/new.template')
             .appendTo(context.$element());
    });

    this.get('#/tweets/en/', function(context) {
      context.app.swap('');
      $('#breadcrumb').text('Tweet English');
      $('#namepage').text('Tweet English');
      context.app.swap('');
      context.render('tweet/indexEn.template')
             .appendTo(context.$element());
    });

    $('#logout').click(function() {  
      sessionStorage.clear();
      window.location.href = '/admin-login';
    });
 
  });
 
  $(function() {
    app.run('#/');
  });
 
})(jQuery);