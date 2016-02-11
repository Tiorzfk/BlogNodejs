
/*--------------------------------------------------------

	Main Scripts

	[Table of contents]
		1. Preloader
		2. Scroll Top
		3. Flexslider
		4. Blur Header
		5. Magnific Popup
		6. Get Date
		7. Isotope
		8. Contact Form

--------------------------------------------------------*/

(function(){
	"use strict";
	$(window).load(function() {

		/*--------------------------------------------------------
			1. Preloader
		--------------------------------------------------------*/

	    $('#status').fadeOut();
	    $('#preloader').delay(350).fadeOut('slow');
	    $('body').delay(350).css({'overflow':'visible'});

		/*--------------------------------------------------------
			2. Scroll Top
		--------------------------------------------------------*/

		if ($(window).width() > 850) {
			$(window).scroll(function(){
				$(this).scrollTop() > 500 ? $('.scrolltop').fadeIn() : $('.scrolltop').fadeOut();
			});
			$('.scrolltop').click(function(){
				$('html, body').animate({scrollTop: 0}, 500);
				return false;
			});
		}

		/*--------------------------------------------------------
			3. Flexslider
		--------------------------------------------------------*/

		$('.flexslider').flexslider({
			prevText: "",
			nextText: "",
			slideshowSpeed: 4000
		});

		$('.highlight').flexslider({
			prevText: "",
			nextText: "",
			directionNav: false,
			slideshowSpeed: 4000
		});
	});

	$(window).ready(function(){

		/*--------------------------------------------------------
			4. Blur Header
		--------------------------------------------------------*/

		var blur = $('.blur'),
			offsetEnd = $('.head-image').height()/3 + $('.navbar').height(),
			opacity,
			offset = $(document).scrollTop();
		offset > offsetEnd ? opacity = 1 : opacity = offset/offsetEnd;
		blur.css("opacity", opacity);
		$(window).scroll(function(){
			offset = $(document).scrollTop();
			offset <= offsetEnd ? opacity = offset/offsetEnd : opacity = 1;
			blur.css('opacity', opacity);
		});

		/*--------------------------------------------------------
			5. Magnific Popup
		--------------------------------------------------------*/

		$('#blog-post article .photos').magnificPopup({
			delegate: 'a',
			type: 'image'
		});

		$('#gallery .grid').magnificPopup({
			delegate: 'a',
			type: 'image'
		});

		/*--------------------------------------------------------
			6. Get Date
		--------------------------------------------------------*/

		var dt,
			day,
			month,
			minutes,
			time;
		dt = new Date();
		dt.getDate() < 10 ? day = "0" + dt.getDate() : day = dt.getDate();
		dt.getMonth() < 10 ? month = "0" + dt.getMonth() : month = dt.getMonth();
		dt.getMinutes() < 10 ? minutes = "0" + dt.getMinutes() : minutes = dt.getMinutes();
		time = day + "." + month + "." + dt.getFullYear() + " at " + dt.getHours() + ":" + minutes;
		$('#blog-post #leave-comment .comment .content .text p.time').html(time);

		/*--------------------------------------------------------
			7. Isotope
		--------------------------------------------------------*/

		var $container = $('#gallery .grid');
	    $container.imagesLoaded(function() {
	    	$container.isotope({
	            itemSelector: '.item',
	            layoutMode: 'fitRows'
	        });
	    });
	    $('#gallery .filters li a').click(function() {
	        $('#gallery .filters li a').removeClass('active');
	        $(this).addClass('active');
	        var selector = $(this).attr('data-filter');
	        $container.isotope({
	        	filter: selector
	        });
	        return false;
	    });

		/*--------------------------------------------------------
			8. Contact Form
		--------------------------------------------------------*/
        $("#contacts button.mini-button").click(function() {
            var user_name = $('input[name=input-name]').val(),
                user_email = $('input[name=input-email]').val(),
                user_message = $('textarea[name=input-message]').val(),
                process = true;
            if (user_name == "") {
                $('input[name=input-name]').css('border-color','#ed5564');
                process = false;
            }

            if (user_email == "") {
                $('input[name=input-email]').css('border-color','#ed5564');
                process = false;
            }

            if (user_message == "") {
                $('textarea[name=input-message]').css('border-color','#ed5564');
                process = false;
            }

            if (process) {
                var post_data = {'userName':user_name, 'userEmail':user_email, 'userMessage':user_message};
                $.post('contact_me.html', post_data, function(response){     /* change your email and subject in contact_me.php */
                    if(response.type == 'error') {
                        output = response.text;
                    }
                    else {
                        output = response.text;
                        $('#contacts input').val('');
                        $('#contacts textarea').val('');
                    }
                    $(".result").hide().html(output).slideDown();
                }, 'json');
            }
        });
        $("#contacts input, #contacts textarea").keyup(function() {
            $("#contacts input, #contacts textarea").css('border-color','');
            $("#result").slideUp();
        });
	});
})(jQuery);