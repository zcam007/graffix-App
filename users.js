var btn=document.getElementById('goBackBtn');
btn.addEventListener('click',function (){
  document.location.href="index.html";
});

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