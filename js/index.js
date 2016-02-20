$(document).ready(function(){
    var fileToUpload = $("#fileToUpload"),
          chooseFileBtn = $("#chooseFileToUploadBtn"),
          uploadButton = $("#uploadButton"),
          details = $("#details"),
          progress = $("#progress");
    
    var fr = new FileReader();
    fr.onload = function(e) {
        var b64 = e.target.result.substring(22);
        console.log(b64);
        $.post("//winstagram.azurewebsites.net/winsta", {"image":b64}, function(data){
            console.log(data);
        });
    }
    
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
 
    function uploadFile() {
        var fd = new FormData();
        var count = document.getElementById('fileToUpload').files.length;
        for (var index = 0; index < count; index ++)
        {
               var file = document.getElementById('fileToUpload').files[index];
               if (fr.readAsDataURL) {fr.readAsDataURL(file);}
               else if (fr.readAsDataurl) {fr.readAsDataurl(file);}
        } 
    }

    fileToUpload.change(fileSelected);
    uploadButton.click(uploadFile);
    chooseFileBtn.click(function(e){
        fileToUpload.click();
    });
});