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
document.querySelector('.file-select').addEventListener('change', function(e){
    selectedFile = e.target.files[0];
    console.log(selectedFile);
});
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
    console.log(error);
  }, () => {
     // Do something once upload is complete
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    console.log('File available at', downloadURL);
    csvtoJson(downloadURL);
  });
     //console.log('success');
  });
});
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
}



document.querySelector('#buildHtmlTable').addEventListener('click',function () {
  console.log("yes");
  //var ref = firebase.database().ref('/');
  firebase.database().ref('/').once('value').then(function(snapshot) {
  //var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
  //console.log(snapshot.val());
  var myObj=snapshot.val();
  console.log(myObj);
  var jsonArr=snapshotToArray(snapshot);
  console.log(jsonArr[0]);

  var table=document.getElementById('DataTable');
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
]
var th=[];
for(var i=0;i<tableHeaders.length;i++)
{
  th[i]=document.createElement('th');
  var heading=document.createTextNode(tableHeaders[i]);
  th[i].appendChild(heading);
  table.appendChild(th[i]);
}
  var tr=[];
  for(var i=0;i<jsonArr.length;i++ ){
  tr[i] = document.createElement('tr');
  var td=[];
  var tableData =[];
  for(var j=0;j<tableHeaders.length;j++)
  {
     td[j]=document.createElement('td');
     tr[i].appendChild(td[j]);
     tableData[j]=document.createTextNode(jsonArr[i][tableHeaders[j]])
     td[j].appendChild(tableData[j]);
  }
    //tableData[0] = document.createTextNode(jsonArr[i][tableHeaders[0]]);
      //tableData[0] = document.createTextNode(jsonArr[i].ID);
      //tableData[1] = document.createTextNode(jsonArr[i]['Job Number']);
      //tableData[2] = document.createTextNode(jsonArr[i]["Completed"]);
      //tableData[3] = document.createTextNode(jsonArr[i]["Artist"]);
  table.appendChild(tr[i]);
}
  // ...
});



/*
    for (var i = 0 ; i < myList.length ; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0 ; colIndex < columns.length ; colIndex++) {
            var cellValue = myList[i][columns[colIndex]];

            if (cellValue == null) { cellValue = ""; }

            row$.append($('<td/>').html(cellValue));
        }
        $("#excelDataTable").append(row$);
    }*/
});

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};
// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records
