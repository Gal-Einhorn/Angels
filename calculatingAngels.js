var limit = 200000; 
var totalMax;
var angelProject = {"lastAngel": 0, "lastProject":0};
var ref = new Firebase("https://burning-inferno-8363.firebaseio.com/projects");
var url = new Firebase("https://burning-inferno-8363.firebaseio.com");
var angels;
var projects;
var angelsBalance = [];
var balance = [];

url.once("value", function(snapshot) {
               console.log(snapshot.val());
               angels = snapshot.val().angels;
               projects = snapshot.val().projects;
               initiateBalance();
               calculateAngelsBalance();
   },
   function (errorObject) {
        console.log("The read failed: " + errorObject.code);
   }
);

function initiateBalance(){
  for (var project=0; project<projects.length; project++){
    balance[project] = {"projectId": project, "balance":0};
  }
  console.dir(balance);
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
  		var project = $("input#project").val();
      var grant = $("input#grant").val();
      updateGrant(angel, project, grant);
    });
  });

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