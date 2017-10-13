function get_file(){
	var preview = document.querySelector('img'); //selects the query named img
	var file    = document.querySelector('input[type=file]').files[0]; //sames as here
	var reader  = new FileReader();

	reader.onloadend = function () {
		console.log(get_image_byte_array(reader.result));
	}

	if(file){
		reader.readAsDataURL(file); //reads the data as a URL
	} else { 
		preview.src = "";
	}
}

function get_image_byte_array(src){
	var c = document.getElementById("test_canvas");
        var ctx = c.getContext("2d");
        var img = document.getElementById("uploaded_image");
	img.src = src;
	ctx.drawImage(img, 0, 0, 128, 95);
        return ctx.getImageData(0, 0, 128, 95);
}
