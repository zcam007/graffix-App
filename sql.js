var mysql = require('mysql');
var fs = require("fs");
var creds=require("./credentials.js")
var firebase=require('./firebase/firebase.js');
var connection = mysql.createConnection(creds.calstalelausu);
document.getElementById('downloadDatabase').addEventListener('click',function(){
  // connect to mysql
  connection.connect(function(err) {
      // in case of error

      if(err){
          console.log("error");
          console.log(err.code);
          console.log(err.fatal);
      }
  });
  // Perform a query
  $query = 'SELECT * FROM csulausuwebform.MasterList';
  //$query='SELECT CONCAT(IF(element_17=10,"Administration",""),IF(element_17=2,"Center for Student Involvement",""),IF(element_17=3,"Cross Cultural Centers",""),IF(element_17=6,"Graffix",""),IF(element_17=5,"Operations",""),IF(element_17=4,"The Pit",""),IF(element_17=7,"Xtreme Fitness",""),IF(element_17=8,"Cal State LA",""),IF(element_17=9,"U-SU","")) as "Department" ,element_122 as "Contact",CONCAT(IF(element_21=7,CONCAT(IF(element_24=12,"Community Building & Celebration",""),IF(element_24=2,"Leadership Development",""),IF(element_24=3,"Service",""),IF(element_24=4,"Golden Eagle Spirit",""),IF(element_24=5,"Music & Entertainment",""),IF(element_24=13,"Critical Dialogue",""),IF(element_24=7,"Holistic Health & Wellness",""),IF(element_24=6,"Social Identity Exploration",""),IF(element_24=10,"Recreation",""),IF(element_24=9,"Trips","")),""),IF(element_21=2,"Individual",""),IF(element_21=3,"Conference/Workshop",""),IF(element_21=5," Awards Ceremony/Special Event",""),IF(element_162=1,"Single Item Request","")) as "Event Package"  ,CONCAT(IFNULL(element_158,""),IFNULL(element_188,"") )as "Project Name",DATE_FORMAT(IFNULL(element_16,""),"%m/%d/%Y") as "Date Needed By",CONCAT(IFNULL(DATE_FORMAT(IFNULL(element_10,""),"%m/%d/%Y"),""),IFNULL(DATE_FORMAT(IF(element_162=1,CONCAT(element_16),""),"%m/%d/%Y"),"")) as "Event Date",CONCAT(if((IFNULL(element_27,"")+IFNULL(element_37,"") + IFNULL(element_60,"") + IFNULL(element_80,"")) =0,"",IFNULL(element_27,"")+IFNULL(element_37,"") + IFNULL(element_60,"") + IFNULL(element_80,"")),IF(element_21=7," (VII H U)",""),IF(element_117_1=1," I ","" ),IF(element_117_2=1," II ","" ),IF(element_117_3=1," III ","" ),IF(element_117_8=1," IV ","" ),IF(element_117_7=1," V ","" ),IF(element_117_6=1," VI ","" ),IF(element_117_5=1," VII ","" ),IF(element_117_4=1," H ","" ),IF(element_117_9=1," U ","" )) as "Color Poster",if((IFNULL(if(element_45=2,250,"")+if(element_45=5,500,"")+if(element_45=3,750,"")+if(element_45=4,1000,""),"") + IFNULL(if(element_64=2,250,"")+if(element_64=5,500,"")+if(element_64=3,750,"")+if(element_64=4,1000,""),"") + IF(element_21=7,500,""))=0,"",IFNULL(if(element_45=2,250,"")+if(element_45=5,500,"")+if(element_45=3,750,"")+if(element_45=4,1000,""),"") + IFNULL(if(element_64=2,250,"")+if(element_64=5,500,"")+if(element_64=3,750,"")+if(element_64=4,1000,""),"") + IF(element_21=7,500,""))as "Post Card",CONCAT(    if(element_46=2,"Quarter Page",""),    if(element_46=3,"Half Page","") ,  if(element_65=2,"Quarter Page",""),  if(element_65=3,"Half Page","") ) as "Post Card Size",IFNULL(element_41,"") as "1/3 Sheet", CONCAT(IFNULL(DATE_FORMAT( If(element_52=0000-00-00,"",element_52),"%m/%d/%Y")," "), "  ", IFNULL(DATE_FORMAT( If(element_108=0000-00-00,"",element_108),"%m/%d/%Y")," "), " ",IFNULL(DATE_FORMAT( If(element_72=0000-00-00,"",element_72),"%m/%d/%Y")," "), "  ", IFNULL(DATE_FORMAT( If(element_109=0000-00-00,"",element_109),"%m/%d/%Y")," "), "  ",IFNULL(DATE_FORMAT( If(element_91=0000-00-00,"",element_91),"%m/%d/%Y")," "), "  ", IFNULL(DATE_FORMAT( If(element_107=0000-00-00,"",element_107),"%m/%d/%Y")," "), "  ")AS "Ut Ad Dates" ,CONCAT(IFNULL(element_85,"")," ", IFNULL(CONCAT(if(element_163=1,"(A2)",""),if(element_163=2,"(A5)",""),if(element_163=3,"(A6)","")),""))as "Invites",IFNULL(element_87,"") as "Certificates",if((IFNULL(element_70,"")+IFNULL(element_89,""))=0,"",IFNULL(element_70,"")+IFNULL(element_89,""))as "Brochures",CONCAT(if(IFNULL(CONCAT(if(element_146=5,20,""),if(element_145=5,20,""),if(element_146=2,50,""),if(element_145=2,50,""),if(element_146=3,70,""),if(element_145=3,70,""),if(element_146=4,100,""),if(element_145=4,100,"")),0)=0,"",""), IFNULL(CONCAT(if(element_50=2,"1.5\"",""),if(element_68=2,"1.5\"",""),if(element_50=3,"2.25\"",""),if(element_68=3,"2.25\"",""),if(element_50=4,"3\"",""),if(element_68=4,"3\"",""))," "))as "Buttons",if((element_58_1+if(element_110=1,1,"")+if(element_106=1,1,""))=0,"",element_58_1+if(element_110=1,1,"")+if(element_106=1,1,"")) AS "Big Banner",if((element_58_2+if(element_110=2,1,"")+if(element_106=2,1,""))=0,"",element_58_2+if(element_110=2,1,"")+if(element_106=2,1,"")) AS "Foamboard" ,CONCAT(CONCAT(if(element_58_3=1,"CCC-1",""),if(element_58_4=1,"CSI-2",""))," ", if(element_110=3,"CCC-1",if(element_110=4,"CSI-1",""))," ",if(element_106=3,"CCC-1",if(element_106=4,"CSI-1",""))) AS "Window Decal" ,if((IF(element_77=1,2,"")+IF(element_113=1,2,""))=0,"",IF(element_77=1,2,"")+IF(element_113=1,2,"")) AS "Aframe",IF(element_77=2,"3x8",if(element_77=3,"1.5x6","")) AS "Paper Banner",IF(element_77=4,1,"") AS "Free Speech Paper Banner",CONCAT(IF(element_113=2,"TBD",""),IF(element_104=1,"TBD",IF(element_104=1,"Podium","") )) AS "Event Signage",IFNULL(CONCAT(element_188,"-",element_101),"") AS "CAM-S Request" FROM csulausuwebform.ap_form_103589';

  connection.query($query, function(err, rows, fields) {
      if(err){
          console.log("An error ocurred performing the query.");
          console.log(err);
          return;
      }
      var ref = firebase.database().ref('/Fall 2019');
      //ref.push(rows);
      for(var i=0;i<rows.length;i++){
        ref.push(rows[i]);
      }
      console.log(rows.length);
      var json2xls = require('json2xls');
      var xls = json2xls(rows);
  //console.log(__dirname);
  var path = require('path');
  var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');
  //console.log(DOWNLOAD_DIR);
  
  //fs.writeFileSync(DOWNLOAD_DIR+'/requestdata.xlsx', xls, 'binary');
//alert('File Download Success');
  });

  
  // Close the connection
  connection.end(function(){
      // The connection has been closed
      console.log("Closed");
  });
});
