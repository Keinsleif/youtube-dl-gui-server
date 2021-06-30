var pid;
window.onload = function() {
    document.getElementById('submit').onclick = function() {
        post();
    };

    xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (!xhr.responseText.match("/False/")){
                    pid=xhr.responseText;
                    var source = new EventSource("/stream/"+pid);
                    source.addEventListener('progress-item', function(event){
                        var response=JSON.parse(event.data);
                        $('.progress-bar').css('width', response["progress"]+"%").attr('aria-valuenow', response["progress"]);
                        $('.progress-bar').html = response["progress"]+"%";
                    }, false);
                    source.addEventListener('last-item', function(){
                        source.close();
                        $('.progress-bar').css('width', '100%').attr('aria-valuenow', 100);
                        $('.progress-bar').innerHTML = "100%";
                        location.reload();
                    }, false);                }
                else{
                    document.getElementById("submit").disabled=false;
                }
            }
            else {
                add_alert("Network Error");
            }
        }
    };
}

function add_alert(text) {
    var alert=document.getElementById("alert");
    alert.id="alert";
    alert.className="alert alert-danger alert-fadeout";
    alert.role="alert";
    alert.innerHTML=text;
}

function post() {
    if (!document.getElementById("url").value){
        add_alert("Please enter the URL.");
        return;
    }
    args=["url","format"];
    request="url="+document.getElementById("url").value;
    request=request+"&"+"format"+"="+document.getElementById("format").value;
    xhr.open('POST', '/', true);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    document.getElementById("submit").disabled=true;
    document.getElementById("progress").style="display:block";
    xhr.send(request);
}
