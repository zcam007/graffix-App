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

if(document.querySelector('#analysisTable')!=null){
  
loadAnalysisTable();


}










firebase.database().ref('/Summer 2019').once('value').then(function(snapshot) {
  
});