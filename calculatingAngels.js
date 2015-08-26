var limit = 200000; 
var totalMax;
var angelProject = {"lastAngel": 0, "lastProject":0};
var ref = new Firebase("https://burning-inferno-8363.firebaseio.com/projects");
var angels;
var projects;
var angelsBalance = [];
var balance = [];

//takes the grant data from the form and invoking the updateGrant with it
$(function() {
    $('.error').hide();
    $(".button").click(function() {
      $('.error').hide();
  	  var angel = $("input#angel").val();		
  		var project = $("input#project").val();
      var grant = $("input#grant").val();
      updateGrant(angel, project, grant);
      
    });
  });

function updateGrant(angel, project, grantSum){
  var url = "https://burning-inferno-8363.firebaseio.com/projects/" + project + "/grantsDist/" + angel;
  var newGrant = new Firebase(url);
  var update = {angelId: parseInt(angel), sum: parseInt(grantSum)}
  newGrant.update(update);
}

