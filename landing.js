const {dialog} = require('electron').remote;
var fs = require('fs');
// Or with ECMAScript 6

//testing
if(document.querySelector('#semesterUploadDropDown')!=null)
{
    var x = document.getElementById("semesterUploadDropDown");
    var semesters=["Fall","Spring","Summer"];
    for(var i=0;i<semesters.length;i++)
    {
        var option = document.createElement("option");
        option.text = semesters[i];
        option.value=semesters[i];
        x.add(option);
    }
}

if(document.querySelector('#semesterDropdown')!=null)
{
    var x = document.getElementById("semesterDropdown");
    var semesters=["Fall","Spring","Summer"];
    for(var i=0;i<semesters.length;i++)
    {
        var option = document.createElement("option");
        option.text = semesters[i];
        option.value=semesters[i];
        x.add(option);
    }
}