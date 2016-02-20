$(document).ready(function(){
    var fileToUpload = $("#fileToUpload"),
          uploadButton = $("#uploadButton"),
          details = $("#details"),
          progress = $("#progress");
    
    var fr = new FileReader();
    fr.onload = function(e) {
        var b64 = e.target.result.substring(22);
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
 
      function uploadProgress(evt) {
 
        if (evt.lengthComputable) {
 
          var percentComplete = Math.round(evt.loaded * 100 / evt.total);
 
          document.getElementById('progress').innerHTML = percentComplete.toString() + '%';
 
        }
 
        else {
 
          document.getElementById('progress').innerHTML = 'unable to compute';
 
        }
 
      }
 
      function uploadComplete(evt) {
 
        /* This event is raised when the server send back a response */
 
        alert(evt.target.responseText);
 
      }
 
      function uploadFailed(evt) {
 
        alert("There was an error attempting to upload the file.");
 
      }
 
      function uploadCanceled(evt) {
 
        alert("The upload has been canceled by the user or the browser dropped the connection.");
 
      }

    fileToUpload.change(fileSelected);
    uploadButton.click(uploadFile);
});