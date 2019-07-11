// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//Get App Version number
var appVersion = require('electron').remote.app.getVersion();
var appVObj=document.getElementById('version');
if(appVObj!=null){
appVObj.innerHTML="App Version:"+appVersion;
}

//imports
var firebase=require('./firebase/firebase.js');
var creds=require("./credentials.js")
require('./jquery.min.js')
firebase.initializeApp(creds.calstalelausufirebase);
var Chart = require('chart.js');


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
       document.location.href="admin.html";
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
        document.location.href="newIndex.html";
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
  document.getElementById('downloadDatabase').disabled=true;
}
else
{
  document.getElementById('downloadDatabase').disabled=false;
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
     alert("Upload Error.. Please try again!");
    console.log(error);
  }, () => {
     // Do something once upload is complete

    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    console.log('File available at', downloadURL);
    var uploadSemesterName=document.getElementById("semesterUploadDropDown").value;
    var uploadSemesterYear=document.getElementById("semesterUploadDropDownYear").value;
    var uploadSemester=uploadSemesterName+" "+uploadSemesterYear;
    csvtoJson(downloadURL,uploadSemester);
    var ref = firebase.database().ref('/'+uploadSemester);
    //For last updated timestamp - pushing at last of json obj to firebase.
    // var currentdate = new Date();
    // var datetime = (currentdate.getMonth()+1) + "/"
    //             + currentdate.getDate()  + "/"
    //             + currentdate.getFullYear() + " @ "
    //             + currentdate.getHours() + ":"
    //             + currentdate.getMinutes() + ":"
    //             + currentdate.getSeconds();
    var datetime=getTimeStamp();
    ref.set({'timestamp':datetime});
//location.reload();
  });
     //console.log('success');
     alert("Upload Succesfull");
     //
  });
});
}
function csvtoJson(downloadURL,uploadSemester)
{
  var data='';
  var ref = firebase.database().ref('/'+uploadSemester);
  ref.set('/'+uploadSemester, null)
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


if(document.querySelector('#semesterDropdown')!=null)
{
    var x = document.getElementById("semesterDropdown");
    // var semesters=["Fall","Spring","Summer"];
   // var semestersArr=[];
    firebase.database().ref('/').once('value').then(function(snapshot) {
    var jsonArr=snapshotToArray(snapshot);
    /*for(var i=0;i<jsonArr.length;i++)
    {
    semestersArr[i]=jsonArr[i]["key"];
    }
      for(var i=0;i<semestersArr.length;i++)
    {
        var option = document.createElement("option");
        option.text = semestersArr[i];
        option.value=semestersArr[i];
        x.add(option);
    }*/

    for(var i=0;i<jsonArr.length;i++)
    {
        var option = document.createElement("option");
        option.text = jsonArr[i]["key"];
        option.value=jsonArr[i]["key"];
        x.add(option);
    }
    
    dataLoadInit();
  });
     
}

const dataLoadInit=()=>{
  var selectedSemester = document.getElementById("semesterDropdown").value; 
  datapull("usersDataTable");
  getArtists(selectedSemester);
  getPackage(selectedSemester);
}


// // if(document.querySelector('#buildHtmlTable')!=null){
// // document.querySelector('#buildHtmlTable').addEventListener('click',function () {
// //datapull("buildHtmlTable","All");
// // datapull("usersDataTable");
// // // getArtists();
// // // getPackage();
// // var selectedSemester = document.getElementById("semesterDropdown").value;
 
// // getArtists(selectedSemester);
// //   getPackage(selectedSemester);
// // });
// // }

//function
var usersSignInbtn=document.getElementById('usersigninbtn');
  if(usersSignInbtn!=null){
    usersSignInbtn.addEventListener('click',function(){
      document.location.href="users.html";
    });

  }


// // if(document.querySelector('#usersDataTable')!=null){
// // datapull("usersDataTable");
// // var selectedSemester = document.getElementById("semesterDropdown").value; 
// // getArtists(selectedSemester);
// //   getPackage(selectedSemester);
// // }



//for admin fullscreen - deprecated as of now Apr 8, 2019

if(document.querySelector('#usersDataTable')!=null)
{
  if(document.querySelector('.fullScreenHover')!=null)
  {
    document.querySelector('.fullScreenHover').addEventListener('mouseover',function(){
      //  document.getElementById('fullscreeenPNG').style.visibility="visible";
      if(document.querySelector('#fullscreeenPNG'))
        document.querySelector('#fullscreeenPNG').addEventListener('click',function(){
          window.open('users.html', '_blank', 'nodeIntegration=yes')
          });
    });
    document.querySelector('.fullScreenHover').addEventListener('mouseleave',function(){
    //  document.getElementById('fullscreeenPNG').style.visibility="hidden";
    });
  }
}


function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });
   // console.log(returnArr);
    return returnArr;
};



//CONSTANTS
const ARTIST=3;
const PACKAGE=6;
const CANCEL="cancel";
const PROJNAME=7;
const CAMSREQ=31;



//!Filter Function
 const filter=(arr,filterHeader)=>{
//let filterArr=[];
//let top=0;
const filterMap = new Map();
for(var i=0;i<arr.length;i++)
{
  if(arr[i][filterHeader]!="" && arr[i][filterHeader]!="0" && arr[i][filterHeader]!=undefined){
  //   let parsInt=arr[i][filterHeader];
  //   if(filterHeader.toLowerCase().includes("date"))
  //   {
  //     parsInt = arr[i][filterHeader].replace("/", "");
  //   }
  //   filterMap.set(i,parseInt(parsInt,10));
  // console.log(parsInt)
  filterMap.set(i,parseInt(arr[i][filterHeader]));

  //filterMap.set(i,arr[i][filterHeader]);
}
}
//console.log(filterArr.length+ "filterarraylength")
console.log(filterMap);
const mapSort1 = new Map([...filterMap.entries()].sort((a, b) => b[1] - a[1]));

//console.log(mapSort1);
var keys =[ ...mapSort1.keys() ];
let newArr = [...arr];
//console.log(newArr)
for(var i=0;i<arr.length;i++)
{
  if(arr[i][filterHeader]!="" && arr[i][filterHeader]!="0" && arr[i][filterHeader]!=undefined)
  {
  delete newArr[i];
 // console.log("yes")
  }
}
for(var i=0;i<arr.length;i++)
{
  newArr.unshift(arr[keys[i]]);
}
var filtered = newArr.filter(function (el) {
  return el != null;
});

// console.log(newArr);
return filtered;

}



function headersclick()
{
  //var k=do
  console.log("clicked"+this.innerHTML);
  const getFilterHeader=this.innerHTML;
  datapull("usersDataTable",getFilterHeader);
}


function datapull(ID,filterHeader='none')
{
  console.log("Datapull logged")
  //var selectedSemester = document.getElementById("semesterDropdown").value;
  var selectedSemester=getSelectedSemester();
  firebase.database().ref('/'+selectedSemester).once('value').then(function(snapshot) {
    var jsonArr=snapshotToArray(snapshot); 
    var lastUpdatedText=document.getElementById('lastUpdated');
    if(lastUpdatedText!=null){
      //jsonArr last key is timestamp
      lastUpdatedText.innerHTML="Last Updated: "+jsonArr[jsonArr.length-1];
    }
  var myObj=snapshot.val();
  //console.log(jsonArr)
   jsonArr=filter(jsonArr,filterHeader);
   loadCompletedChart(jsonArr);
  //filter(jsonArr,filterHeader);
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
    "Blurbs",
    "Event Date",
    "Date Needed",
    "First Draft",
    "To Print",
    "Color Poster",
    "Theme Requestor Copy",
    "Postcard",
    "Postcard Size",
    "1'3 Sheet",
    "UT Ads",
    "Invites",
    "Certificates",
    "Brochures",
    "Buttons",
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
    "Social Media",
    "Notes",
    "Qty"
];
var colors=[];
colors[5]="sContact"
colors[8]="sBlurb"
colors[11]="sFirstDraft";
colors[12]="sToPrint";
colors[13]="sColorPoster";
colors[14]="sThemeRequestercopy";
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

var artist = document.getElementById("artistDropdown").value.toLowerCase();
var package = document.getElementById("packageDropdown").value.toLowerCase();
var thtr=document.createElement('tr');
for(var i=0;i<tableHeaders.length;i++)
{
  th[i]=document.createElement('th');
  var heading=document.createTextNode(tableHeaders[i]);
  th[i].id="heading-"+tableHeaders[i];
  th[i].onclick=headersclick;
  th[i].appendChild(heading);
  //thtr = 
  thtr.appendChild(th[i]);
  //table.appendChild(th[i]);

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

}
table.appendChild(thtr);
/*Increase width to particular columns*/
th[PROJNAME].classList.add("sTH_Width_Increase");
th[CAMSREQ].classList.add("sTH_Width_Increase");

  var tr=[];
  for(var i=0;i<jsonArr.length-1;i++ )
  {
  tr[i] = document.createElement('tr');
  var td=[];
  var tableData =[];
  for(var j=0;j<tableHeaders.length;j++)
  {
     td[j]=document.createElement('td');
    
    //Only admins can edit the table 
     if(getCurrentPageName()=="admin.html")
     {
       //console.log(j);
      if(artist=="all" && package=="all"){
      td[j].setAttribute('contenteditable', 'true');
      document.getElementById('export-btn').style.visibility="visible";
      document.getElementById('downloadbtn').disabled=false;
      }
      else
      {
        
      document.getElementById('export-btn').style.visibility="hidden";
      document.getElementById('downloadbtn').disabled=true;
      }
     }
     tr[i].appendChild(td[j]);
     tableData[j]=document.createTextNode(jsonArr[i][tableHeaders[j]])
     td[j].appendChild(tableData[j]);

    /* Display blank in the cells if the value is either 0 or not defined(not entered)*/
     if(td[j].innerText=='0' ||td[j].innerText=="undefined" )
     {
       td[j].innerText="";
     }
     /* Add colors only to non-empty cells*/
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
//console.log(artistsArr)
for(var k=0;k<artistsArr.length+1;k++)
{
  artistColor[k]="artistColor"+(k+1);
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
  if(td[ARTIST].innerText.toLowerCase()==CANCEL)
  {
    tr[i].classList.add("sCancel"); // Adding cancel css class
  }
  if(td[PACKAGE].innerText.toLowerCase().includes("web"))
  {
    td[PACKAGE].classList.add("sWeb");
  }
  else if(td[PACKAGE].innerText.toLowerCase().includes("cam"))
  {
    td[PACKAGE].classList.add("sCamPackage");
  }
  else if(td[PACKAGE].innerText.toLowerCase().includes("shirt"))
  {
    td[PACKAGE].classList.add("sShirtPackage");
  }


  //for eliminating null entries from the csv to show up in the table
    if(td[ARTIST].innerText=='')
    {
      continue;
    }
    
    //$('#usersDataTable').attr('disabled');
    //$("#usersDataTable tr td").attr("contenteditable", "false");
    if(artist=="all" && package=="all")
    {
    //  $("#usersDataTable").find("td").attr("contenteditable", "true");
   // $("#usersDataTable tr td").attr("contenteditable", "true");

      table.appendChild(tr[i]);
    }
    else if(artist=="all" && package!="all" )
    {
    
      if(package==td[PACKAGE].innerText.toLowerCase())
      {
        table.appendChild(tr[i]);
      }
    }
    else if(artist!="all" && package=="all")
    {
      if(artist==td[ARTIST].innerText.toLowerCase())
      {
          table.appendChild(tr[i]);
      }
    }
    else {
      if(package==td[PACKAGE].innerText.toLowerCase())
      {
        if(artist==td[ARTIST].innerText.toLowerCase())
        {
          table.appendChild(tr[i]);
        }
      }
    }
}
});
}

//* unCamelcase generic function
function unCamelCase (str){
  if(str==undefined || str=="")
  {
    return
  }
  return str
      // insert a space between lower & upper
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // space before last upper in a sequence followed by lower
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
      // uppercase the first character
      .replace(/^./, function(str){ return str.toUpperCase(); })
}



//!  Get Functions


//Get artists from the data given.
function getArtists(selectedSemester)
{
  var artistsArr=[];
  firebase.database().ref('/'+selectedSemester).once('value').then(function(snapshot) {
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
function getPackage(selectedSemester)
{
  var packageArr=[];
  firebase.database().ref('/'+selectedSemester).once('value').then(function(snapshot) {
  var jsonArr=snapshotToArray(snapshot);
  for(var i=0;i<jsonArr.length-1;i++ )
  {
    packageArr[i]=jsonArr[i]['Package'];
  }
  packageLoad(removeDups(packageArr).sort());
  //console.log(removeDups(packageArr));
});
}

const getSelectedSemester=()=>
{
  if(document.querySelector('#semesterDropdown')!=null)
  {
    return document.getElementById("semesterDropdown").value;
  }
  
}

const getTimeStamp=()=>{
  var currentdate = new Date();
  var datetime = (currentdate.getMonth()+1) + "/"
              + currentdate.getDate()  + "/"
              + currentdate.getFullYear() + " @ "
              + currentdate.getHours() + ":"
              + currentdate.getMinutes() + ":"
              + currentdate.getSeconds();

              return datetime;
}


const getCurrentPageName=()=>{
  var path = window.location.pathname;
var page = path.split("/").pop();
return page;
//console.log( page );
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
function artistsLoad(arr1) {
  console.log(arr1);
  var arr = [];
  //This code is for removing duplicate artist names after editing
for (var i = 0; i < arr1.length; i++) {
  if(arr1[i]!="cancel")
    arr.push(arr1[i].toLowerCase());
}
arr=removeDups(arr);
  var len=arr.length;
  var x = document.getElementById("artistDropdown");
  x.innerHTML='';
  var all = document.createElement("option");
  all.text="All Artists"
  all.value="All"
  x.add(all);
  for(var i=0;i<len;i++){
    if(arr[i]!=""){
    var option = document.createElement("option");
    
    option.text = arr[i].charAt(0).toUpperCase()+ arr[i].slice(1);
    option.value=arr[i].charAt(0).toUpperCase()+ arr[i].slice(1);
    
    x.add(option);
    }
  }
}
//PackageLoad function start
function packageLoad(packages) {
  //console.log(artists);
  var len=packages.length;
  var x = document.getElementById("packageDropdown");
  x.innerHTML='';
  //console.log(x.value);

  var all = document.createElement("option");
  all.text="All Packages"
  all.value="All";
  x.add(all);

  for(var i=0;i<len;i++){
    if(packages[i]!=""){
    var option = document.createElement("option");
    option.text = packages[i];
    option.value=packages[i];
    x.add(option);
    }
  }
}

//TableData to Json conversion function
const tableToJson=()=> {
  // var data = [];
  // var table=document.getElementById("usersDataTable");
  // // first row needs to be headers
  // var headers = [];
  // for (var i=0; i<table.rows[0].cells.length; i++) {
  //     headers[i] = table.rows[0].cells[i].innerHTML;//.replace(/ /gi,'');
  // }
//console.log(table.header);
  // go through cells
  // var ref = firebase.database().ref('/'+getSelectedSemester());
  // ref.set('/'+getSelectedSemester(), null)
  // var datetime=getTimeStamp();
  // ref.set({'timestamp':datetime});

  // for (var i=1; i<table.rows.length; i++) {

  //     var tableRow = table.rows[i];
  //     var rowData = {};

  //     for (var j=0; j<tableRow.cells.length; j++) {

  //         rowData[ headers[j] ] = tableRow.cells[j].innerHTML;

  //     }
  //     ref.push(rowData);
  //     data.push(rowData);
  // }
  
  var $TABLE = $('#usersDataTable');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;
  //console.log("yeaahh")
  var $rows = $TABLE.find('tr:not(:hidden)');
  var headers = [];
  var data = [];
   var ref = firebase.database().ref('/'+getSelectedSemester());
  ref.set('/'+getSelectedSemester(), null)
  var datetime=getTimeStamp();
  ref.set({'timestamp':datetime});
  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    headers.push($(this).text());
  });
  
  // Turn all existing rows into a loopable array
  $rows.each(function () {
    var $td = $(this).find('td');
    var h = {};
    
    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();   
    });
    ref.push(h);
    data.push(h);
    
  });
  
  dataLoadInit();
  
  // var json2xls = require('json2xls');
  //     var xls = json2xls(data);
  //     var fs = require("fs");
  // console.log(__dirname);
  // var path = require('path');
  // var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');
  // console.log(DOWNLOAD_DIR);
  // fs.writeFileSync(DOWNLOAD_DIR+getSelectedSemester()+'.xlsx', xls, 'binary');

  // alert("Saved Sucessfully and downloaded to Downloads folder ");
  console.log(getSelectedSemester());
  //console.log(datetime)
console.log(data);

}


const tableToJsonDownload=()=> {
 
  
  var $TABLE = $('#usersDataTable');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;
  //console.log("yeaahh")
  var $rows = $TABLE.find('tr:not(:hidden)');
  var headers = [];
  var data = [];
   var ref = firebase.database().ref('/'+getSelectedSemester());
  ref.set('/'+getSelectedSemester(), null)
  var datetime=getTimeStamp();
  ref.set({'timestamp':datetime});
  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    headers.push($(this).text());
  });
  
  // Turn all existing rows into a loopable array
  $rows.each(function () {
    var $td = $(this).find('td');
    var h = {};
    
    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();   
    });
    ref.push(h);
    data.push(h);
    
  });
  
  dataLoadInit();
  
  var json2xls = require('json2xls');
      var xls = json2xls(data);
      var fs = require("fs");
  console.log(__dirname);
  var path = require('path');
  var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');
  console.log(DOWNLOAD_DIR);
  fs.writeFileSync(DOWNLOAD_DIR+getSelectedSemester()+'.xlsx', xls, 'binary');

  alert("Saved Sucessfully and downloaded to Downloads folder ");
  console.log(getSelectedSemester());
  //console.log(datetime)
console.log(data);

}




//! Add EventListeners Here


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

//On semesterDropdown change event call dataLoadInit()
if(document.querySelector('#semesterDropdown')!=null)
{
    document.querySelector('#semesterDropdown').addEventListener('change', function(e){
  // var selectedSemester = document.getElementById("semesterDropdown").value;
  // getArtists(selectedSemester);
  // getPackage(selectedSemester);
  // datapull("usersDataTable");
  dataLoadInit();
  });
}


if(document.querySelector("#export-btn")!=null)
{
  document.querySelector('#export-btn').addEventListener('click',tableToJson);
}


if(document.querySelector("#downloadbtn")!=null)
{
  document.querySelector('#downloadbtn').addEventListener('click',tableToJsonDownload);
}




const loadCompletedChart=(jsonArr)=>{

if(document.querySelector("#completedChartdiv")!=null)
{
//console.log(jsonArr);
var iCompleted=0;
var iNotCompleted=0;
for(var i=0;i<jsonArr.length-1;i++)
{
      if(jsonArr[i]["Completed"]!="")
      {
        iCompleted++
      }
      else
      {
        iNotCompleted++;
      }
}
am4core.useTheme(am4themes_animated);

var chart = am4core.create("completedChartdiv", am4charts.PieChart);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

chart.data = [
  {
    index: "Completed",
    value: iCompleted
  },
  {
    index: "Not Completed",
    value: iNotCompleted
  }
];
chart.radius = am4core.percent(70);
chart.innerRadius = am4core.percent(40);
chart.startAngle = 180;
chart.endAngle = 360;  

var series = chart.series.push(new am4charts.PieSeries());
series.dataFields.value = "value";
series.dataFields.category = "index";

series.slices.template.cornerRadius = 10;
series.slices.template.innerCornerRadius = 7;
series.slices.template.draggable = true;
series.slices.template.inert = true;

series.hiddenState.properties.startAngle = 90;
series.hiddenState.properties.endAngle = 90;

chart.legend = new am4charts.Legend();
}
}

require('./analysis.js')
require('./sql.js')