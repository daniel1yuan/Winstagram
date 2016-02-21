$(document).ready(function(){
    var fileToUpload = $("#fileToUpload"),
          chooseFileBtn = $("#chooseFileToUploadBtn"),
          uploadButton = $("#uploadButton"),
          details = $("#details"),
          progress = $("#progress");
        
    function fileSelected() {
        var count = document.getElementById('fileToUpload').files.length;
              details.html("");
              for (var index = 0; index < count; index ++)
              {
                     var file = document.getElementById('fileToUpload').files[index];
 
                     var fileSize = 0;
 
                     if (file.size > 1024 * 1024)
 
                            fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
 
                     else
 
                            fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
 
                    content = 'Name: ' + file.name + '<br>Size: ' + fileSize + '<br>Type: ' + file.type;
                    details.html(content);                   
              }
      }
 
    function sendFile(img){
        var b64 = img.substring(23);
        
        console.log("Uploading file...");
        details.html("Loading...");
        $.post("//winstagram.azurewebsites.net/winsta", {"image":b64}, function(data){
            details.html(data);
        });
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
                sendFile(dataURL);
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

            sendFile(dataURL);
        };

        image.onerror = function () {
            alert('There was an error processing your file!');
        };
    }
 
    function readFile(file) {
        var reader = new FileReader();

        reader.onloadend = function () {
            processFile(reader.result, file.type);
        }

        reader.onerror = function () {
            alert('There was an error reading the file!');
        }

        reader.readAsDataURL(file);
    }
 
    function uploadFile() {
        var fd = new FormData();
        var count = document.getElementById('fileToUpload').files.length;
        for (var index = 0; index < count; index ++)
        {
               var file = document.getElementById('fileToUpload').files[index];
               readFile(file);
        } 
    }

    fileToUpload.change(fileSelected);
    uploadButton.click(uploadFile);
    chooseFileBtn.click(function(e){
        fileToUpload.click();
    });
});