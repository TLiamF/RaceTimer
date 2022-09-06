// Convert time to a format of hours, minutes, seconds, and milliseconds

function timeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);

  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);

  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);

  let diffInMs = (diffInSec - ss) * 100;
  let ms = Math.floor(diffInMs);

  let formattedHH = hh.toString().padStart(2, "0");	
  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");
  let formattedMS = ms.toString().padStart(2, "0");

  return `${formattedHH}:${formattedMM}:${formattedSS}:${formattedMS}`;
}

// Declare variables to use in our functions below

let startTime;
let elapsedTime = 0;
let timerInterval;
let raceStart = "No Race Started";

// Create function to modify innerHTML

function print(txt) {
  document.getElementById("display").innerHTML = txt;
}

// Create "start", "pause" and "reset" functions

function start() {
  //raceStart = new Date();
  // changed this to time only for .csv file output	
  raceStart = getCurrentTime();
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(function printTime() {
    elapsedTime = Date.now() - startTime;
    print(timeToString(elapsedTime));
  }, 10);
  showButton("PAUSE");
}

function pause() {
  clearInterval(timerInterval);
  showButton("PLAY");
}

function reset() {
if (confirm('Stop and clear timer?'))
	{
         clearInterval(timerInterval);
         print("00:00:00:00");
         elapsedTime = 0;
         showButton("PLAY");
	}
}

// Create function to display buttons

function showButton(buttonKey) {
  const buttonToShow = buttonKey === "PLAY" ? playButton : pauseButton;
  const buttonToHide = buttonKey === "PLAY" ? pauseButton : playButton;
  buttonToShow.style.display = "block";
  buttonToHide.style.display = "none";
}
// Create event listeners

let playButton = document.getElementById("playButton");
let pauseButton = document.getElementById("pauseButton");
let resetButton = document.getElementById("resetButton");

playButton.addEventListener("click", start);
pauseButton.addEventListener("click", pause);
resetButton.addEventListener("click", reset);


// race scoring functions

function FinishBoat(prefix) {
 let undo = prefix + "_undo";
 let undo_img = prefix +	"_undo_img";
 let finish = prefix + "_finish";
 let finish_img =  prefix + "_finish_img"; 
 let dnf =  prefix + "_dnf";
 let dnf_img =  prefix + "_dnf_img";
 let time_display =  prefix + "_time_display";
 let time_finish = prefix + "_time_finish"; 
 //alert("Finishing boat! id is: " + racing_button_id);
 document.getElementById(finish).disabled=true;
 document.getElementById(dnf).disabled=true;
 document.getElementById(finish_img).src="icons/finished.png";
 document.getElementById(dnf_img).src="icons/dnf_disabled.png";
 document.getElementById(time_display).textContent=timeToString(elapsedTime);
 document.getElementById(time_finish).textContent=getCurrentTime();

// enable undo button
// disable undo button
 document.getElementById(undo).disabled=false;
 document.getElementById(undo_img).src="icons/undo.png";	

}




function DNFBoat(prefix) {
 //alert("DNF boat! id is: " + dnf_button_id);
 let undo = prefix + "_undo";
 let undo_img = prefix +	"_undo_img";
 let finish = prefix + "_finish";
 let finish_img =  prefix + "_finish_img"; 
 let dnf =  prefix + "_dnf";
 let dnf_img =  prefix + "_dnf_img";
 let time_display =  prefix + "_time_display";
 document.getElementById(dnf).disabled=false;
 document.getElementById(finish).disabled=true;
 document.getElementById(dnf_img).src="icons/dnf.png";
 document.getElementById(finish_img).src="icons/dnf_racing.png";
 document.getElementById(time_display).textContent = " -- DNF --";
// enable undo button
 document.getElementById(undo).disabled=false;
 document.getElementById(undo_img).src="icons/undo.png";
}



function undo_result(prefix) {
let undo = prefix + "_undo";
let undo_img = prefix +	"_undo_img";
let finish = prefix + "_finish";
let finish_img =  prefix + "_finish_img"; 
let dnf =  prefix + "_dnf";
let dnf_img =  prefix + "_dnf_img";
let time_display =  prefix + "_time_display";

// enable finish and DNF buttons and reset time
document.getElementById(finish).disabled=false;
document.getElementById(dnf).disabled=false;
document.getElementById(finish_img).src="icons/racing.png";
document.getElementById(dnf_img).src="icons/dnf1.png";
document.getElementById(time_display).textContent="00:00:00";


// disable undo button
document.getElementById(undo).disabled=true;
document.getElementById(undo_img).src="icons/disabled_undo.png";

}	


// file handling
function download(filename, text) {
    let rnd = Math.floor(Math.random()*100000+1);
    let select = document.getElementById('course');
    let course = select.options[select.selectedIndex].text;
    let date = new Date();
    let fname_date = date.toDateString();
    fname_date = fname_date.replace(" ", "_");
    let new_filename = rnd + "_" + filename + "_" + fname_date + "_" + course + ".txt";	
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', new_filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function getResultsAsString(start_boat, end_boat, fleet, startTime) {
	let select = document.getElementById('course');
	let course = select.options[select.selectedIndex].text;
	let results_as_text = "";
	let line = "\n--------------------------------------------------------------------------------\n";
	results_as_text += new Date() + line;
	results_as_text += "FLEET: "  + fleet + "\n";
	results_as_text += "COURSE: "  + course + "\n";
	results_as_text += "START: "  + startTime + line;
	for (let i = start_boat; i <= end_boat; i++) {
          results_as_text += document.getElementById("b" + i + "_boat_name").textContent.padEnd(30);
	  results_as_text += "\t";
	  results_as_text += document.getElementById("b" + i + "_time_display").textContent;
	  results_as_text += "\n";
	}

        return results_as_text;
}


function CSVResultsAsString(start_boat, end_boat, fleet, startTime) {
	let select = document.getElementById('course');
	let course = select.options[select.selectedIndex].text;
	let new_race = "+";
	let results_as_text = "";
	let header = "RaceNo,Fleet,Boat,Start,Finish";
	let line = "\n--------------------------------------------------------------------------------\n";
	results_as_text += header + "\n";
	for (let i = start_boat; i <= end_boat; i++) {
		// remove the + sign at the start of the line
		// for all but the first line 
		if (i > start_boat) {
			new_race = "";
		}
          //RaceNo
	  results_as_text += new_race;
	  results_as_text += ",";
          //Fleet
	  results_as_text += fleet;
	  results_as_text += ",";
          //Boat
	  results_as_text += document.getElementById("b" + i + "_boat_name").textContent;
	  results_as_text += ",";
          //Start
	  results_as_text += startTime;
	  results_as_text += ",";
          //Finish
	  results_as_text += document.getElementById("b" + i + "_time_finish").textContent;;
	  results_as_text += "\n";
	}

        return results_as_text;
}


function getCurrentTime() {

	var date = new Date;
        //date.setTime(result_from_Date_getTime);
        var seconds = String(date.getSeconds()).padStart(2, '0');
        var minutes = String(date.getMinutes()).padStart(2, '0');
        var hour = String(date.getHours()).padStart(2, '0');

        return hour + ":" + minutes + ":" + seconds;

}
