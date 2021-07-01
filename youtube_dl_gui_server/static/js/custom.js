var pid;
window.onload = function() {
    document.getElementById('submit').onclick = function() {
        post();
    };

    xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                pid=xhr.responseText;
                var source = new EventSource("/stream/"+pid);
                source.addEventListener('start',function(event){
                    var response=JSON.parse(event.data);
                    $('#bars').html($('<div class="progress" id="progress"><div class="progress-bar" style="width:0%" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div></div>'));
                },false);
                source.addEventListener('downloading', function(event){
                    var response=JSON.parse(event.data);
                    $('.progress-bar').css('width', response["progress"]+"%").attr('aria-valuenow', response["progress"]);
                    $('.progress-bar').html(response["progress"]+"%");
                }, false);
                source.addEventListener('finished', function(){
                    $('.progress-bar').css('width', '100%').attr('aria-valuenow', 100);
                    $('.progress-bar').html("100%");
                }, false);
                source.addEventListener('error', function(event){
                    source.close();
                    var response=JSON.parse(event.data);
                    add_alert(response["text"]);
                    $('#submit').prop("disabled", false);
                    $("#bars").html("");
                }, false);
                source.addEventListener('end', function(){
                    source.close();
                    location.reload();
                }, false);
            }
            else {
                add_alert("Network Error");
            }
        }
    };
}

function add_alert(text) {
    var alert=document.getElementById("alert");
    alert.className="alert alert-danger";
    alert.role="alert";
    alert.innerHTML=text;
}

function post() {
    if (!document.getElementById("url").value){
        add_alert("Please enter the URL.");
        return;
    }
    $("#alert").removeClass("alert","alert-danger").html("");
    request="url="+document.getElementById("url").value;
    request=request+"&"+"format"+"="+document.getElementById("format").value;
    xhr.open('POST', '/', true);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    document.getElementById("submit").disabled=true;
    xhr.send(request);
}
