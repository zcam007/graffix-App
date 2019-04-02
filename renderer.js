// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var firebase=require('./firebase/firebase.js');
var creds=require("./credentials.js")
require('./jquery.min.js')
firebase.initializeApp(creds.calstalelausufirebase);

var signInbtn=document.getElementById('signinbtn');
  if(signInbtn!=null){

  signInbtn.addEventListener('click',function(){
      console.log("clicked");
    var emailField=document.getElementById('inputEmail').value;
    var passwordField=document.getElementById('inputPassword').value;
   // alert(emailField+" "+passwordField);
    firebase.auth().signInWithEmailAndPassword(emailField,passwordField).then(function()
    {
      //  alert("Signed In");
       document.location.href="landing.html";
}).catch(function(error)
{
    alert("Wrong username/password");
        if(error!=null)
    {
        console.log(error.message);
        return;
    }
});
});
}
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log("Loggedin detected: "+user.email);
    var signOutbtn=document.getElementById('signoutbtn');
    if(signOutbtn!=null)
    signOutbtn.addEventListener('click',function(){
      console.log("Signout Clicked");
      firebase.auth().signOut().then(function() {
        console.log('Signed Out');
        document.location.href="index.html";
          }, function(error) {
                console.error('Sign Out Error', error);
                  });
    });
  }

  else {
    // No user is signed in.
    console.log("No user signed in")
  }
});






let selectedFile;
const storageService = firebase.storage();
const storageRef = storageService.ref();
var dnloadURL='';
if(document.querySelector('.file-select')!=null)
{
document.querySelector('.file-select').addEventListener('change', function(e){
    selectedFile = e.target.files[0];
    console.log(selectedFile);
    var infoArea = document.getElementById( 'file-upload-filename' );
    // the change event gives us the input it occurred in
var input = e.srcElement;
var fileName = input.files[0].name;
infoArea.innerHTML = 'Selected file: ' + fileName;

//enabling submit button only if the file is slected
if(infoArea.innerHTML!=""){
  console.log(infoArea.innerHTML);
  document.getElementById('inputGroupFileAddon02').disabled=false;
}

});
}

var fileName = document.getElementById( 'file-upload-filename' );
if (fileName!=null){
if(fileName.innerHTML=="")
{
  //console.log("")
  document.getElementById('inputGroupFileAddon02').disabled=true;
}
else
{

    document.getElementById('inputGroupFileAddon02').disabled=false;
}

}

if(document.querySelector('.file-submit')!=null){
document.querySelector('.file-submit').addEventListener('click', function(e){
  const uploadTask = storageRef.child(`${"log"}`).put(selectedFile); //create a child directory called images, and place the file inside this directory
  uploadTask.on('state_changed', (snapshot) => {
  // Observe state change events such as progress, pause, and resume
  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
  }, (error) => {
    // Handle unsuccessful uploads
     alert("Upload Unsuccesfull.. Please try again!");
    console.log(error);
  }, () => {
     // Do something once upload is complete

    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    console.log('File available at', downloadURL);
    csvtoJson(downloadURL);
    var ref = firebase.database().ref('/');
    //For last updated timestamp - pushing at last of json obj to firebase.
    var currentdate = new Date();
    var datetime = (currentdate.getMonth()+1) + "/"
                + currentdate.getDate()  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
    ref.set({'timestamp':datetime});
//location.reload();
  });
     //console.log('success');
     alert("Upload Succesfull");
     //
  });
});
}
function csvtoJson(downloadURL)
{
  var data='';
  var ref = firebase.database().ref('/');
  ref.set('/', null)
  const request=require('request')
  const csv=require('csvtojson')
  csv()
  .fromStream(request.get(downloadURL))
  .subscribe((json,lineNumber)=>{
 // process the json line in synchronouse.
 console.log(json);
 //console.log(JSON.stringify(json));

 ref.push(json);
  return json;
 },(error)=>{
   console.log(error);
 })
 //location.reload();
}


if(document.querySelector('#buildHtmlTable')!=null){
document.querySelector('#buildHtmlTable').addEventListener('click',function () {
//datapull("buildHtmlTable","All");
datapull("usersDataTable");
getArtists();
getPackage();
});
}


//function
var usersSignInbtn=document.getElementById('usersigninbtn');
  if(usersSignInbtn!=null){
    usersSignInbtn.addEventListener('click',function(){
      document.location.href="users.html";
    });

  }


if(document.querySelector('#usersDataTable')!=null){

datapull("usersDataTable");
getArtists();
getPackage();
}

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};


//CONSTANTS
const ARTIST=3;
const PACKAGE=6;
const CANCEL="CANCEL";




function datapull(ID)
{
  firebase.database().ref('/').once('value').then(function(snapshot) {
    var jsonArr=snapshotToArray(snapshot);

    var lastUpdatedText=document.getElementById('lastUpdated');
    if(lastUpdatedText!=null){
      //jsonArr last key is timestamp
      lastUpdatedText.innerHTML="Last Updated: "+jsonArr[jsonArr.length-1];
    }
  var myObj=snapshot.val();
  var table=document.getElementById(ID);
  table.innerHTML='';
var tableHeaders=[
    "ID",
    "Job Number",
    "Completed",
    "Artist",
    "Dept",
    "Contact",
    "Package",
    "Project Name",
    "Blurbs Tshirt",
    "Event Date",
    "Date Needed",
    "First Draft",
    "To Print",
    "Color Poster",
    "Theme Requestor Copy",
    "Postcard",
    "Postcard Size",
    "1'3 Sheet",
    "UT Ad Dates (1'2)",
    "Invites",
    "Certificates",
    "Brochures",
    "Button",
    "Big Banner",
    "Foamboard",
    "Window Decal",
    "Aframe",
    "Paper Banner",
    "Free Speech",
    "Event Signage",
    "T-Shirt",
    "CAM-S Request",
    "Plasma",
    "Jpeg",
    "Social Media"
];
var colors=[];
colors[5]="sContact"
colors[8]="sBlurb"
colors[11]="sFirstDraft";
colors[12]="sToPrint";
colors[13]="sColorPoster";
colors[15]="sPostCard";
colors[16]="sPostCard";
colors[17]="s13sheet";
colors[18]="sUtAd"
colors[19]="sBrochure"
colors[20]="sBrochure"
colors[21]="sBrochure"
colors[22]="sButton"
colors[23]="sBigBanner";
colors[24]="sFoamBoard";
colors[25]="sWindowDecal"
colors[26]="sAframe";
colors[27]="sPaperBanner"
colors[28]="sFreeSpeech"
colors[29]="sEventSignage";
colors[30]="sShirt";
colors[32]="sPlasma";
colors[33]="sPlasma";
var th=[];
for(var i=0;i<tableHeaders.length;i++)
{
  th[i]=document.createElement('th');
  var heading=document.createTextNode(tableHeaders[i]);
  th[i].appendChild(heading);
  table.appendChild(th[i]);

  if(i<4){
    th[i].classList.add("headerColor1");
  }else if (i<8){
    th[i].classList.add("headerColor2");
  }else if (i<13){
    th[i].classList.add("headerColor1");
  }else if (i<23){
    th[i].classList.add("headerColor2");
  }else if (i<26){
    th[i].classList.add("headerColor1");
  }else if (i<30){
    th[i].classList.add("headerColor2");
  }else if (i<32){
    th[i].classList.add("headerColor1");
  }else if (i>31){
    th[i].classList.add("headerColor2");
  }
  // if(){
  //
  // }
  // if(){
  //
  // }
  // if(){
  //
  // }
}
  var tr=[];
  for(var i=0;i<jsonArr.length-1;i++ )
  {
  tr[i] = document.createElement('tr');
  var td=[];
  var tableData =[];
  for(var j=0;j<tableHeaders.length;j++)
  {
     td[j]=document.createElement('td');
     tr[i].appendChild(td[j]);
     tableData[j]=document.createTextNode(jsonArr[i][tableHeaders[j]])
     td[j].appendChild(tableData[j]);



    if(td[j].innerText!=''){
      td[j].classList.add(colors[j]);
    }
  }



var artistsArr=[];
for(var k=0;k<jsonArr.length-1;k++ )
{
  artistsArr[k]=jsonArr[k]['Artist'];
}
artistsArr=removeDups(artistsArr).sort();
var artistColor=[];
for(var k=1;k<=artistsArr.length;k++)
{
  artistColor[k]="artistColor"+k;
}

for(var k=0;k<artistsArr.length;k++){
  if(td[ARTIST].innerText==artistsArr[k])
  {
    if(td[ARTIST].innerText==CANCEL)
    {
    td[ARTIST].classList.add("sCanceltext");
    }
    else{
    td[ARTIST].classList.add(artistColor[k]);
  }
  }
}

  //ADD BG-COLOR TO CANCEL USING THIS LOGIC
  if(td[ARTIST].innerText==CANCEL)
  {
    tr[i].classList.add("sCancel"); // Adding cancel css class
  }
  if(td[PACKAGE].innerText.includes("WEB"))
  {
    td[PACKAGE].classList.add("sWeb");
  }
  else if(td[PACKAGE].innerText.includes("CAM"))
  {
    td[PACKAGE].classList.add("sCamPackage");
  }
  else if(td[PACKAGE].innerText.includes("SHIRT"))
  {
    td[PACKAGE].classList.add("sShirtPackage");
  }


  //for eliminating null entries from the csv to show up in the table
    if(td[ARTIST].innerText=='')
    {
      continue;
    }
    var artist = document.getElementById("artistDropdown").value;
    var package = document.getElementById("packageDropdown").value;
    if(artist=="All" && package=="All")
    {
      table.appendChild(tr[i]);
    }
    else if(artist=="All" && package!="All" )
    {
      if(package==td[PACKAGE].innerText)
      {
        table.appendChild(tr[i]);
      }
    }
    else if(artist!="All" && package=="All")
    {
      if(artist==td[ARTIST].innerText)
      {
          table.appendChild(tr[i]);
      }
    }
    else {
      if(package==td[PACKAGE].innerText)
      {
        if(artist==td[ARTIST].innerText)
        {
          table.appendChild(tr[i]);
        }
      }
    }
}
});


}

//Get artists from the data given.
function getArtists()
{
  var artistsArr=[];
  firebase.database().ref('/').once('value').then(function(snapshot) {
  var jsonArr=snapshotToArray(snapshot);
  for(var i=0;i<jsonArr.length-1;i++ )
  {
    artistsArr[i]=jsonArr[i]['Artist'];
  }
  artistsLoad(removeDups(artistsArr).sort());
  return artistsArr;
});
}

//Get package name from the data
function getPackage()
{
  var packageArr=[];
  firebase.database().ref('/').once('value').then(function(snapshot) {
  var jsonArr=snapshotToArray(snapshot);
  for(var i=0;i<jsonArr.length-1;i++ )
  {
    packageArr[i]=jsonArr[i]['Package'];
  }
  packageLoad(removeDups(packageArr).sort());
  //console.log(removeDups(packageArr));
});
}
//remove duplicated generic function
function removeDups(names) {
  let unique = {};
  names.forEach(function(i) {
    if(!unique[i]) {
      unique[i] = true;
    }
  });
  return Object.keys(unique);
}

//ArtistsLoad Function Start
function artistsLoad(arr) {
  console.log(arr);
  var len=arr.length;
  var x = document.getElementById("artistDropdown");
  for(var i=0;i<len;i++){
    if(arr[i]!=""){
    var option = document.createElement("option");
    option.text = arr[i];
    option.value=arr[i];
    x.add(option);
    }
  }
}
//PackageLoad function start
function packageLoad(artists) {
  //console.log(artists);
  var len=artists.length;
  var x = document.getElementById("packageDropdown");
  for(var i=0;i<len;i++){
    if(artists[i]!=""){
    var option = document.createElement("option");
    option.text = artists[i];
    option.value=artists[i];
    x.add(option);
    }
  }
}

//On artistDropdown change event pull data respectively
if(document.querySelector('#artistDropdown')!=null)
{
    document.querySelector('#artistDropdown').addEventListener('change', function(e){
    datapull("usersDataTable");
  });
}

//On artistDropdown change event pull data respectively
if(document.querySelector('#packageDropdown')!=null)
{
    document.querySelector('#packageDropdown').addEventListener('change', function(e){
    datapull("usersDataTable");
  });
}
