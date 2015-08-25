var limit = 200000; 
var totalMax;
var angelsBalance = [limit,limit,limit,limit,limit,limit];
var balance = [
  {"projectId":0,"balance":0},
  {"projectId":1,"balance":0},
  {"projectId":2,"balance":0},
  {"projectId":3,"balance":0},
  {"projectId":4,"balance":0},
  {"projectId":5,"balance":0}
  ];
var angelProject = {"lastAngel": 0, "lastProject":0};
var ref = new Firebase("https://searsangels.firebaseio.com/");
var angels;
var projects;

// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
               console.log(snapshot.val());
               angels = snapshot.val().angels;
               projects = snapshot.val().projects;
               showProjects();     
               calculateMaxGrant(); 
   },
   function (errorObject) {
        console.log("The read failed: " + errorObject.code);
   }
);

function showProjects(){
    for (var project=0; project<projects.length; project++){  
      $('body').append('<div class="projectDisp" id="project'+ project + '"/>');
      $('#project' + project).append('<div class="projectNames" id="projectName' + project + '"/>');
      $('#projectName' + project).append('<div class="projectTytle" id="projectTytle' + project + '">' + projects[project].name + '</div>');
      $('#projectName' + project).append('<div class="projectDesc" id="projectDesc' + project + '">'+ projects[project].desc +'</div></div>');                    
      $('#project' + project).append('<div class="grantsBar" id="grantsBar' + project + '"/></div>');
      for (var angel=0; angel < angels.length; angel++){
        $('#grantsBar' + project).append('<div class="grantMark" id="grantMarkProject' + project + 'Angel' + angel + '"/>');
      }
    }
}

function calculateMaxGrant(){
  rankProjects();
  totalMax = balance[5].balance + 3000;
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

function calculateProjectsBalance(){
  for (var projectId=0; projectId<projects.length; projectId++){
    balance[projectId].balance = 0;
    if (typeof projects[projectId].grantsDist !== "undefined"){
      for (var grantId=0; grantId<projects[projectId].grantsDist.length; grantId++){   
        balance[projectId].balance += projects[projectId].grantsDist[grantId].sum;
      }
    }
 }
}

function showNextGrant(){
  if (angelProject.lastProject < projects.length){
    showNextAngelGrant(angelProject.lastProject, angelProject.lastAngel);
    angelProject.lastProject +=1;
    console.log ('1. project = ' + angelProject.lastProject + ', angel = ' + angelProject.lastAngel);
  }
  else {
    angelProject.lastAngel +=1;
    angelProject.lastProject = 0;
    console.log ('2. project = ' + angelProject.lastProject + ', angel = ' + angelProject.lastAngel);
    showNextAngelGrant(angelProject.lastProject, angelProject.lastAngel);
    angelProject.lastProject +=1;
        console.log ('3. project = ' + angelProject.lastProject + ', angel = ' + angelProject.lastAngel);
  }
}

function showNextAngelGrant(projectId,angel){
    for (var grantId=0; grantId<projects[projectId].grantsDist.length; grantId++){
      if (projects[projectId].grantsDist[grantId].angelId == angel){
        var grant = projects[projectId].grantsDist[grantId];
        var percentage = grant.sum*100/totalMax;
        $('#grantMarkProject' + projectId + 'Angel' + angel).css({
            "width" : percentage + "%",
            "background-color" : angels[angel].color,
            "border": "1px solid black",
        });
      }
    }  
}

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

}
  


