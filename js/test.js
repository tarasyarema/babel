var BASE64_MARKER = ';base64,';

function take_snapshot(){
	Webcam.snap(function(data_uri){
		document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
		console.log(convertDataURIToBinary(data_uri));
		//return convertDataURIToBinary(data_uri);
	});
}


function get_file(){
	var preview = document.querySelector('img'); //selects the query named img
	var file    = document.querySelector('input[type=file]').files[0]; //sames as here
	var reader  = new FileReader();

	reader.onloadend = function(){
		console.log(get_image_byte_array(reader.result).data);
	}

	if(file) reader.readAsDataURL(file); //reads the data as a URL
	else preview.src = "";
}

function get_image_byte_array(src){
	var c = document.getElementById("test_canvas");
        var ctx = c.getContext("2d");
        var img = document.getElementById("uploaded_image");
	img.src = src;
	ctx.drawImage(img, 0, 0, 128, 95);
        return ctx.getImageData(0, 0, 128, 95);
}

function convertDataURIToBinary(dataURI) {
	var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	var base64 = dataURI.substring(base64Index);
	var raw = window.atob(base64);
	var array = new Uint8Array(new ArrayBuffer(raw.length));

	for(var i = 0; i < raw.length; ++i) array[i] = raw.charCodeAt(i);
  
	return array;
}
