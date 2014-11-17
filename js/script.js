$(function(){

	$('#gnp div.gallery a').colorbox({rel: 'gnp'});
	$('#spp div.gallery a').colorbox({rel: 'spp'});
	$('#rumshot div.gallery a').colorbox({rel: 'rumshot'});

	$('a.donate').click(function(e){
		$(this).prev('form').submit();
		e.preventDefault();
	});

	$('#nav').localScroll(800);
	
	$('#landing').parallax(-503, -394, 0.1, true);
	$('#gnp').parallax(-266, -450, 0.1, true);
	$('#spp').parallax(-266, -450, 0.1, true);
	$('#rumshot').parallax(-511, -572, 0.1, true);

  // need to resorting to scraping bitbucket thanks to github shutting down uploads
	//var h3 = $('#gnp header h3 span').html('Data Error'),
	//	download = $('#gnp nav .download');

	//$.getJSON("https://api.github.com/repos/shellscape/Gmail-Notifier-Plus/downloads?callback=?",
	//	function(result) {
	//		if(!result || !result.data || !result.data.length){
	//			return;
	//		}

	//		var first = result.data[0],
	//			rawDate = first.created_at,
	//			date = moment(new Date(rawDate)),
	//			name = result.data[0].name,
	//			version = name.replace('Gmail-Notifier-Plus-', '').replace('.zip', '').replace('.exe', '').replace('.msi', '');
				
	//		h3.html(version + ' ( ' + date.format('MMMM Do, YYYY') + ' )');
			
			// grab the first msi file. in case i screw up the upload order on the downloads section.
	//		$.each(result.data, function(){
	//			if(this.html_url.indexOf('.msi') >= 0){
	//				download.attr('href', this.html_url);	
	//				return false;
	//			}
	//		});
			
	//});

});