var getDesignerInfo = function() {
  var id = document.getElementById("inputID").value;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        document.getElementById("designerInfo").innerHTML = xmlHttp.responseText;
    }
  }
  xmlHttp.open("GET", "http://localhost:3000/designer/" + id, true); // true for asynchronous
  xmlHttp.send(null);
}
