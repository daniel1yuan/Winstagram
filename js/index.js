$(document).ready(function(){
	var b64Prefx = "base64,";
    var fileToUpload = $("#fileToUploads"),
		  chooseFileBtn = $("#chooseFileToUploadBtn"),
		  uploadButton = $("#uploadButton"),
		  cardContent = $("#card-content"),
		  details = $("#details"),
		  loader = $("#loader"),
		  cardImage = $("#card-image"),
		  cardContainer = $("#card-container"),
		  loadedImg = "",
		  isLoading = false,
		  hasImageLoaded = false;
        
    function fileSelected() {
		var count = document.getElementById('fileToUploads').files.length;
		  details.html("");
		  for (var index = 0; index < count; index ++)
		  {
			 var file = document.getElementById('fileToUploads').files[index];

			 var fileSize = 0;

			 if (file.size > 1024 * 1024)

					fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
			 else
					fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

			content = 'Name: ' + file.name + '<br>Size: ' + fileSize + '<br>Type: ' + file.type;
			details.html(content);                   
		  }
		  prepFile();
		  hasImageLoaded = true;
		  updateUI();
      }
 
    function sendFile(img){
        console.log("Uploading file...");
        $.post("//winstagram.azurewebsites.net/winsta", {"image":fullDataUrlToB64(loadedImg)}, function(data){
			console.log(data);
            details.html(data);
			isLoading = false;
			updateUI();
        });
    }
	
	function updateCardImg(){
		console.log('updating card img');
		cardImage.attr("src", loadedImg);
	}
 
	function fullDataUrlToB64(fullData) {
		var i = fullData.indexOf(b64Prefx);
		return fullData.substring(i + b64Prefx.length);
	}
 
    function processFile(dataURL, fileType) {
        var maxWidth = 800;
        var maxHeight = 800;

        var image = new Image();
        image.src = dataURL;
		
        image.onload = function () {
            var width = image.width;
            var height = image.height;
            var shouldResize = (width > maxWidth) || (height > maxHeight);

            if (!shouldResize) {
                loadedImg = dataURL;
				updateCardImg();
                return;
            }

            var newWidth;
            var newHeight;

            if (width > height) {
                newHeight = height * (maxWidth / width);
                newWidth = maxWidth;
            } else {
                newWidth = width * (maxHeight / height);
                newHeight = maxHeight;
            }

            var canvas = document.createElement('canvas');

            canvas.width = newWidth;
            canvas.height = newHeight;

            var context = canvas.getContext('2d');

            context.drawImage(this, 0, 0, newWidth, newHeight);

            dataURL = canvas.toDataURL(fileType);

            loadedImg = dataURL;
			updateCardImg();
        };

        image.onerror = function () {
            alert('There was an error processing your file!');
        };
		

    }
 
    function readFile(file) {
        var reader = new FileReader();

        reader.onloadend = function () {
            processFile(reader.result, file.type);
        };

        reader.onerror = function () {
            alert('There was an error reading the file!');
        };

        reader.readAsDataURL(file);
    }
 
	function prepFile(){
		var fd = new FormData();
		var count = document.getElementById('fileToUploads').files.length;
		for (var index = 0; index < count; index ++)
		{
		   var file = document.getElementById('fileToUploads').files[index];
		   readFile(file);
		}
	}
 
    function uploadFile() {
		if (!isLoading && hasImageLoaded) {
			isLoading = true;
			updateUI();
			sendFile(loadedImg);
		}
    }
	
	function updateUI() {
		if (isLoading) {
			console.log("ui updated(loader shown)");
			loader.show();
			chooseFileBtn.hide();
		}
		else {
			loader.hide();
			console.log("ui updated (loader hidden)");
			chooseFileBtn.show();
		}
		
		if (hasImageLoaded) {
			cardContainer.show();
		} else {
			cardContainer.hide();
		}
		
		if (hasImageLoaded && !isLoading) {
			uploadButton.removeClass("disabled");
		}
		else {
			uploadButton.addClass("disabled");
		}
	}
	
	updateUI();
    fileToUpload.change(fileSelected);
    uploadButton.click(uploadFile);
    chooseFileBtn.click(function(e){
		fileToUpload.click();
    });
});