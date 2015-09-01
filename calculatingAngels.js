var limit = 200000; 
var totalMax;
var angelProject = {"lastAngel": 0, "lastProject":0};
var ref = new Firebase("https://burning-inferno-8363.firebaseio.com/projects");
var url = new Firebase("https://burning-inferno-8363.firebaseio.com");
var angels;
var projects;
var grantsDist = {angelId:0, grants:[]};
var angelsBalance = [];
var balance = []; 

url.once("value", function(snapshot) {
               console.log(snapshot.val());
               angels = snapshot.val().angels;
               projects = snapshot.val().projects;
               initiateGrantsDist();
          //     calculateAngelsBalance();
   },
   function (errorObject) {
        console.log("The read failed: " + errorObject.code);
   }
);

function initiateGrantsDist(){
  for (var project=0; project<projects.length; project++){
    grantsDist.grants[project] = {projectId: project, balance:0};
    console.dir(grantsDist);
  }
  console.log('grantsDist:');
  console.dir(grantsDist);
    for (var angel=0; angel<angels.length; angel++){
    angelsBalance[angel] = limit;
  }
  console.dir(angelsBalance);
}


//takes the grant data from the form and invoking the updateGrant with it
$(function() {
    $('.error').hide();
    $(".button").click(function(e) {
      e.preventDefault();
      $('.error').hide();
  	  var angel = $("input#angel").val();
      console.log('angel:')
      console.dir(angel);
  		var projectGrants = [$("input#project").val(), $("input#project1").val(), $("input#project2").val()];
      console.log('project:');
      console.dir(projectGrants);
      var grants = [$("input#grant0").val(), $("input#grant1").val(), $("input#grant2").val()];
      console.log('grants:');
      console.dir(grants);
      showGrantsDist(angel,projectGrants,grants);
    });
  });
  
function showGrantsDist(angelId, projectGrants, grants){
    var angelsTempBalance = balance;
    var projectName = projects[0].name;
    angelsTempBalance[0] = {name : projectName, grant : grants[0]};
    projectName = projects[1].name;
    angelsTempBalance[1] ={name : projectName, grant : grants[1]};
    projectName = projects[2].name;
    angelsTempBalance[2] = {name : projectName, grant : grants[2]};
       console.dir(angelsTempBalance);
    $('.balance').append('<p class="remainSum">Your ramaining amount to grant is '+ angelsBalance[angelId] +'</p>');
    for (var projectId=0; projectId<3; projectId++){
        $('.balance').append('<div class="grantsGiven">You have granted' + angelsTempBalance[projectId].grant +' to ' + angelsTempBalance[projectId].name+ '"</div>');
   }
}
  
  
  

function updateGrant(angel, project, grantSum){
  if (angel > angels.length -1 || project > projects.lengh -1){
    alert("invalid angel or project");
  }
  else if(angelsBalance[angel] - grantSum < 0){
    alert('Not enough money left to grant. Your balance is ' + angelsBalance[angel]);
  }
  else{
      var localUrl = "https://burning-inferno-8363.firebaseio.com/projects/" + project + "/grantsDist/" + angel;
      var newGrant = new Firebase(localUrl);
      var update = {angelId: parseInt(angel), sum: parseInt(grantSum)}
      newGrant.update(update, function(){
           url.once("value", function(snapshot) {
               console.log(snapshot.val());
               angels = snapshot.val().angels;
               projects = snapshot.val().projects;
               calculateAngelsBalance();
               showAngelBalance(angel);
            });
      });
  }
}

function calculateAngelsBalance(){
  initiateBalance();
  for (var projectId=0; projectId<projects.length; projectId++){
      for (var grantId=0; grantId<angels.length; grantId++){
        angelsBalance[projects[projectId].grantsDist[grantId].angelId] -= projects[projectId].grantsDist[grantId].sum;
      }  
  }
}

function showAngelBalance(angelId){
  $('.balance').append('<p class="remainSum">Your ramaining amount to grant is '+ angelsBalance[angelId] +'</p>');
  for (var projectId=0; projectId<projects.length; projectId++){
    $('.balance').append('<div class="grantsGiven">You have granted '+ projects[projectId].grantsDist[angelId].sum + ' to "' + projects[projectId].name + '"</div>');
  }
  
}