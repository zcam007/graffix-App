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

if(document.querySelector('#semesterUploadDropDownYear')!=null)
{
    var x = document.getElementById("semesterUploadDropDownYear");
    let currentYear=new Date().getFullYear();
    for(var i=(currentYear+1);i>=2015;i--)
    {
        var option = document.createElement("option");
        option.text = i;
        option.value=i;
        x.add(option);
    }
}



// if(document.querySelector('#semesterDropdown')!=null)
// {
//     var x = document.getElementById("semesterDropdown");
//     var semesters=["Fall","Spring","Summer"];
//     for(var i=0;i<semesters.length;i++)
//     {
//         var option = document.createElement("option");
//         option.text = semesters[i];
//         option.value=semesters[i];
//         x.add(option);
//     }
// }