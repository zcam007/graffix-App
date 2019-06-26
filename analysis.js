var firebase=require('./firebase/firebase.js');


//Table Framework
if(document.querySelector('#analysisButton')!=null){
document.querySelector('#analysisButton').addEventListener('click',function(){
    document.location.href="analysis.html";

});
}
const loadAnalysisTable=()=>{
    
    var table=document.querySelector('#analysisTable');
    var tr1=document.createElement('tr');
    var th1=[]
    var tr1Headings=["SUMMER", "FALL","SPRING"]
    tr1.appendChild(document.createElement('td'));//empty 1st cell in 1st row
    for(var i=0;i<3;i++)
    {
        th1[i]=document.createElement('th');
        var text=document.createTextNode(tr1Headings[i]);
        th1[i].setAttribute("colspan", "6");
        th1[i].appendChild(text);
        tr1.appendChild(th1[i]);
    }

    var tr2Headings=["CAM", "CAM-S","THEME","SHIRT","WEB","CANCEL"];
    var tr2=document.createElement('tr');
    var tdArr=[]
    tr2.appendChild(document.createElement('td')); //empty 1st cell in 2nd row
    for(var i=0;i<18;i=i+6)
    {
        for(var j=0;j<6;j++){
        tdArr[i]=document.createElement('td');
        var text=document.createTextNode(tr2Headings[j]);
        tdArr[i].appendChild(text);
        tr2.appendChild(tdArr[i]);
        }
    }
    table.appendChild(tr1);
    table.appendChild(tr2);
    //remaining 9 rows - CCC - CSI- PIT - OPERATION - CALSTATE LA - USU - GRAFFIX -FISCALYEAR - TOTAL
    var rem_row_headings=["CCC","CSI","THE PIT","OPERATIONS","CALSTATE LA","U-SU","GRAFFIX","YEAR TOTAL","TOTAL"]

    var rem_tr=[];
    var rem_td=[];
    for(var i=0;i<9;i++)
    {
         rem_tr[i]=document.createElement('tr');
        
         var td=document.createElement('td');
         var text=document.createTextNode(rem_row_headings[i]);
         td.appendChild(text);
         rem_tr[i].appendChild(td);
         for(var j=0;j<18;j++){
         rem_td[j]=document.createElement('td');
         var text=document.createTextNode("");
         rem_td[j].appendChild(text);
         rem_tr[i].appendChild(rem_td[j]);
         }
         table.appendChild(rem_tr[i]);
    }

   
}


const newtable=(semsesterName)=>{
    var table=document.createElement('table');
    var th=document.createElement('th');
    var tr1=document.createElement('tr');
    var text=document.createTextNode(semsesterName);
    th.appendChild(text);
    th.setAttribute("colspan", "6");
    tr1.appendChild(th); // Semestername row append
    table.appendChild(tr1);
    var tr2Headings=["CAM", "CAM-S","THEME","SHIRT","WEB","CANCEL"];
    var tr2=document.createElement('tr');
    var tdArr=[]
   
        for(var i=0;i<6;i++){
        tdArr[i]=document.createElement('td');
        var text=document.createTextNode(tr2Headings[i]);
        tdArr[i].appendChild(text);
        tr2.appendChild(tdArr[i]);
        }
    
     table.appendChild(tr2); // Request type headings append
    
    
    var tr=[]
    var td=[]
    
    for(var i=0;i<9;i++)
    {
        tr[i]=document.createElement('tr');
        for(var j=0;j<6;j++)
        {
            td[j]=document.createElement('td');
            var text=document.createTextNode(" ");
            td[j].appendChild(text);
            tr[i].appendChild(td[j]);
        }
        table.appendChild(tr[i]);
    }
    
    document.getElementById("tablesDiv").appendChild(table);
}

if(document.querySelector('#analysisTable')!=null){
  
//loadAnalysisTable();
newtable("Summer");
newtable("Fall");

}

firebase.database().ref('/Summer 2019').once('value').then(function(snapshot) {
    var jsonArr=snapshotToArray(snapshot);
    //console.log(jsonArr);
console.log(getDeptCount(jsonArr,"ccc"));
console.log(getCAMcount(jsonArr,"ccc"));
console.log(getShirtCount(jsonArr,"ccc"));
console.log(getWebCount(jsonArr,"operations"));
console.log(getCancelCount(jsonArr));
console.log(getCAM_SCount(jsonArr,"operations"));
//let matrix=[[]];
var matrix = Create2DArray(8);
var departments=["ccc","csi","the pit","xtreme","operation","csula","u-su","graffix"]
for(var i=0;i<departments.length;i++){
let deptCount=getDeptCount(jsonArr,departments[i]);
let camCount=getCAMcount(jsonArr,departments[i]);
let cam_sCount=getCAM_SCount(jsonArr,departments[i])
let shirtCount=getShirtCount(jsonArr,departments[i]);
let webCount=getWebCount(jsonArr,departments[i])
let cancelCount=getCancelCount(jsonArr,departments[i]);
let themeCount=deptCount-(camCount+cam_sCount+shirtCount+webCount);

matrix[i][0]=camCount;
matrix[i][1]=cam_sCount;
matrix[i][2]=themeCount;
matrix[i][3]=shirtCount;
matrix[i][4]=webCount;
matrix[i][5]=cancelCount;

}
console.log(matrix);

});

// get count functions


const getDeptCount=(jsonArr,dept)=>{
    var count=0;
    for(var i=0;i<jsonArr.length;i++)
    {
        if(jsonArr[i]["Dept"]!=undefined && jsonArr[i]["Dept"].toLowerCase()==dept){
            count++;
        }
        //console.log(jsonArr[i]["Dept"]);
    }
    return count;
}


const getCAMcount=(jsonArr,dept)=>{
    var count=0;
    for(var i=0;i<jsonArr.length;i++)
    {
        if(jsonArr[i]["Dept"]!=undefined && jsonArr[i]["Dept"].toLowerCase()==dept){
            if(jsonArr[i]["Package"].toLowerCase().includes("cam") && jsonArr[i]["Package"].toLowerCase()!="cam-s")
            count++;
        }
        //console.log(jsonArr[i]["Dept"]);
    }
return count;
}

const getCAM_SCount=(jsonArr,dept)=>{
    var count=0;
    for(var i=0;i<jsonArr.length;i++)
    {
        if(jsonArr[i]["Dept"]!=undefined && jsonArr[i]["Dept"].toLowerCase()==dept){
         //   console.log (jsonArr[i]["Package"]);
            if(jsonArr[i]["Package"].toLowerCase()=="cam-s"){
            count++;
            }
        }
        //console.log(jsonArr[i]["Dept"]);
    }
return count;
}


const getShirtCount=(jsonArr,dept)=>{
    var count=0;
    for(var i=0;i<jsonArr.length;i++)
    {
        if(jsonArr[i]["Dept"]!=undefined && jsonArr[i]["Dept"].toLowerCase()==dept){
            if(jsonArr[i]["Package"].toLowerCase()=="shirt")
            count++;
        }
        //console.log(jsonArr[i]["Dept"]);
    }
return count;
}


const getWebCount=(jsonArr,dept)=>{
    var count=0;
    for(var i=0;i<jsonArr.length;i++)
    {
        if(jsonArr[i]["Dept"]!=undefined && jsonArr[i]["Dept"].toLowerCase()==dept){
            if(jsonArr[i]["Package"].toLowerCase().includes("web"))
            count++;
        }
        //console.log(jsonArr[i]["Dept"]);
    }
return count;
}

const getCancelCount=(jsonArr,dept)=>{
    var count=0;
    for(var i=0;i<jsonArr.length;i++)
    {
        if(jsonArr[i]["Artist"]!=undefined && jsonArr[i]["Artist"].toLowerCase()=="cancel"){
            if(jsonArr[i]["Dept"]!=undefined && jsonArr[i]["Dept"].toLowerCase()==dept)
            count++;
        }
        //console.log(jsonArr[i]["Dept"]);
    }
return count;
}

const getThemeCount=(jsonArr,dept)=>{
    var count=0;
    for(var i=0;i<jsonArr.length;i++)
    {
        if(jsonArr[i]["Dept"]!=undefined && jsonArr[i]["Dept"].toLowerCase()==dept){
            if(jsonArr[i]["Package"].toLowerCase().includes("cam") && jsonArr[i]["Package"].toLowerCase()!="cam-s")
            count++;
        }
        //console.log(jsonArr[i]["Dept"]);
    }
return count;
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


function Create2DArray(rows) {
    var arr = [];
  
    for (var i=0;i<rows;i++) {
       arr[i] = [];
    }
  
    return arr;
  }