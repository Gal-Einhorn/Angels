var limit = 200000; 
var angelsBalance = [limit,limit,limit,limit,limit,limit];
var projectsBalance = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]]; //to change into an array of objects
var balance = [
  {"projectId":0,"balance":0},
  {"projectId":1,"balance":0},
  {"projectId":2,"balance":0},
  {"projectId":3,"balance":0},
  {"projectId":4,"balance":0},
  {"projectId":5,"balance":0}
  ];


var ref = new Firebase("https://searsangels.firebaseio.com/");
var angels;
var projects;


// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
                  console.log(snapshot.val());
                  angels = snapshot.val().angels;
                  projects = snapshot.val().projects;
   },
   function (errorObject) {
        console.log("The read failed: " + errorObject.code);
   }
);

function calculateAngelsBalance(){
  angelsBalance = [limit,limit,limit,limit,limit,limit];
  for (var projectId=0; projectId<projects.length; projectId++){
    if (typeof projects[projectId].grantsDist === "undefined"){
      console.log("projectId=" + projectId + " has no grants");
      }
    else {
      for (var grantId=0; grantId<projects[projectId].grantsDist.length; grantId++){
        angelsBalance[projects[projectId].grantsDist[grantId].angelId] -= projects[projectId].grantsDist[grantId].sum;
      }
    }  
  }
  
//  for (var angelId=0; angelId<angels.length; angelId++){
  //  document.getElementById("angelsBalance").innerHTML += angels[angelId].name + "'s balance is " + angelsBalance[angelId] + '</br>';
//  }
}
  
function calculateProjectsBalance(){
 // document.getElementById("projectsBalance").innerHTML += '</br>';
  for (var projectId=0; projectId<projects.length; projectId++){
    balance[projectId].balance = 0;
  /*  if (typeof projects[projectId].grantsDist !== "undefined"){
      for (var grantId=0; grantId<projects[projectId].grantsDist.length; grantId++){   
        balance[projectId].balance += projects[projectId].grantsDist[grantId].sum;
      }
    }
    document.getElementById("projectsBalance").innerHTML += projects[projectId].name + "'s balance is " +balance[projectId].balance + '</br>';
 */ }
}

function rankProjects(){
  calculateProjectsBalance();
  balance.sort(function (a, b){
    if (a.balance > b.balance){
      return 1;
    }
    else return -1;
  })
  console.log("Balance:");
     for (var i=0; i<6; i++){
        console.log(balance[i].projectId+ ',' + balance[i].balance);
  }
}

function isTheSecondvalueBigger(firstValue,secondValue) {
  if (firstValue.balance > secondValue.balance){
    return false;
  }
  else {
    return true;
  }
}

function showRankProjects(){
  rankProjects();
  console.log("starting showRankProjects")
 //for (var project=projects.length -1 ; project > -1 ; project--){
    //console.log("project = " + project + ", in balance it's the " + balance[project].projectId)
   // var Id = balance[project].projectId;
    //document.getElementById("rankedProjects").innerHTML += projects[Id].name + "'s balance is " + balance[project].balance + '</br>';
  for (var project=0; project<projects.length; project++){  
    $('body').append('<div class="projectDisp" id="project'+ project + '"/>');
    $('#project' + project).append('<div class="projectNames" id="projectName' + project + '"/>');
    $('#projectName' + project).append('<div class="projectTytle" id="projectTytle' + project + '">Project ' + project + "'s name</div>");
    $('#projectName' + project).append('<div class="projectDesc" id="projectDesc' + project + '">This is project number' + project + '. Look at it shine!</div></div>');
    $('#project' + project).append('<div class="grantsBar" id="grantsBar' + project + '"/></div>');
  }
}

