// If you don't want the particles, change the following to false:
const doParticles = true;
var players = [];
var clicked = false;

function getWidth() { // credit to travis on stack overflow
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}
if (doParticles) {
	if (getWidth() < 400) $.firefly({minPixel: 1,maxPixel: 2,total: 20});
	else $.firefly({minPixel: 1,maxPixel: 3,total: 40});
}

// This is for the click to copy
let t;
$(document).ready(()=>{
	t = $(".ip").html();
});

$(document).on("click",".ip",()=>{
	let copy = document.createElement("textarea");
	copy.style.position = "absolute";
	copy.style.left = "-99999px";
	copy.style.top = "0";
	copy.setAttribute("id", "ta");
	document.body.appendChild(copy);
	copy.textContent = t;
	copy.select();
	document.execCommand("copy");
	$(".ip").html("<span class='extrapad'>IP copied!</span>");
  clicked = true;
	setTimeout(function(){
		$(".ip").html(t);
		var copy = document.getElementById("ta");
		copy.parentNode.removeChild(copy);
    clicked = false;
	}, 1000);
});

$(document).on({
  mouseenter: () => {
    if (!clicked) {
      $(".ip").html("<span class='extrapad'>Click to copy IP</span>");
    } else {
      //$(".ip").html("<span class='extrapad'>IP copied!</span>");
    }
  },
  mouseleave: () => {
    $(".ip").html(t);
	  var copy = document.getElementById("ta");
	  copy.parentNode.removeChild(copy);
  }
}, ".ip");

$(document).on({
  mouseenter: () => {
    $(".online-players").html(`<p><span class='extrapad' style="color: white;">${players.join(', ')}</span></p>`);
  },
  mouseleave: () => {
    $(".online-players").html("");
  }
}, ".count");

// This is to fetch the player count
$(document).ready(()=>{
  const ip = $(".count").attr("data-ip");
  const port = $(".count").attr("data-port");

  $.get(`https://mcapi.us/server/status?ip=${ip}&port=${port}`, (result)=>{
    if (result.online) {
      $(".count").html(result.players.now);
      $.get(`https://mcapi.us/server/query?ip=${ip}&port=${port}`, (queryResult)=>{
        if (queryResult.players.list.length > 10) {
          for (var i = 0; i < 10; i++) {
            players.push(queryResult.players.list[i]);
          }
          players.push('and more!');
        } else {
          for (const player of queryResult.players.list) {
            players.push(player);
          }
        }
      });
    } else {
      $(".playercount").html("Server isn't online!");
    }
  });

  setInterval(()=>{
    $.get(`https://mcapi.us/server/status?ip=${ip}&port=${port}`, (result)=>{
      if (result.online) {
        $(".count").html(result.players.now);
        $.get(`https://mcapi.us/server/query?ip=${ip}&port=${port}`, (queryResult)=>{
          players = [];
          if (queryResult.players.list.length > 10) {
            for (var i = 0; i < 10; i++) {
              players.push(queryResult.players.list[i]);
            }
            players.push('and more!');
          } else {
            for (const player of queryResult.players.list) {
              players.push(player);
            }
          }
        });
      } else {
        $(".playercount").html("Server isn't online!");
      }
    });
  }, 3000);
});
