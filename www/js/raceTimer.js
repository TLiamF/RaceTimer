/*************************************************************************************************
 * Convert to String.
------------------------------------------------------------------------------------------------*/
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

/*************************************************************************************************
 * Format Time.
------------------------------------------------------------------------------------------------*/
function formatTime(date) {
    var hh = date.getHours  ().toString().padStart(2, '0');	
    var mm = date.getMinutes().toString().padStart(2, '0');	
    var ss = date.getSeconds().toString().padStart(2, '0');	
    
    // Time String
    return `${hh}:${mm}:${ss}`;
}

/*************************************************************************************************
 * Create Timer Object.
------------------------------------------------------------------------------------------------*/
function raceTimer(id, prefix) {
    // Add Buttons
    $(id).append(`
        <img id='${prefix}_playButton'  src="icons/play-button.png"  />
        <img id='${prefix}_pauseButton' src="icons/pause-button.png" />
        <img id='${prefix}_resetButton' src="icons/reset-button.png" />
    `);

    // Timer Object
    var timer = {
        startTime:     null,
        elapsedTime:   0,
        timerInterval: null,
        raceStart:     'No Race Started',
        playButton:    $(`#${prefix}_playButton`),
        pauseButton:   $(`#${prefix}_pauseButton`),
        resetButton:   $(`#${prefix}_resetButton`),
        display:       $(`#${prefix}_display`)
    };

    // Reset Timer
    timer.reset = function() {
        // Reset Timer
        clearInterval(timer.timerInterval);
        timer.display.html(`
            <span style='color: #0cde31;'>00:00:00</span>
            <span style='color: #ff0000;'>+00:00:00:00</span>
        `);

        // Play Button
        $(timer.playButton ).show();
        $(timer.pauseButton).hide();

        timer.startTime   = null;
        timer.elapsedTime = 0;
    };
    
    // Play Button
    timer.playButton.on('click', () => {
        // Set Start Time
        timer.raceStart = getCurrentTime();
        timer.startTime = Date.now() - timer.elapsedTime;

        // Start Timer
        timer.timerInterval = setInterval(function printTime() {
            timer.elapsedTime = Date.now() - timer.startTime;
            timer.display.html(`
                <span style='color: #0cde31;'>${formatTime(new Date(timer.startTime))}</span>
                <span style='color: #ff0000;'>+${timeToString(timer.elapsedTime)}</span>
            `);
        }, 10);

        // Pause Button
        $(timer.playButton ).hide();
        $(timer.pauseButton).show();
    });

    // Pause Button
    timer.pauseButton.on('click', () => {
        // Stop Timer
        clearInterval(timer.timerInterval);

        // Play Button
        $(timer.playButton ).show();
        $(timer.pauseButton).hide();
    });

    // Reset Button
    timer.resetButton.on('click', () => {
        if(confirm('Stop and clear timer?')) {
            timer.reset();
        }
    });

    // Play Button
    $(timer.playButton ).show();
    $(timer.pauseButton).hide();

    // Attach Object
    $(id).data('timer', timer);

    // Return Object
    return timer;
}

// race scoring functions
function FinishBoat(prefix, timer) {
    let undo         = prefix + "_undo";
    let undo_img     = prefix +	"_undo_img";
    let finish       = prefix + "_finish";
    let finish_img   = prefix + "_finish_img"; 
    let dnf          = prefix + "_dnf";
    let dnf_img      = prefix + "_dnf_img";
    let time_finish  = prefix + "_time_finish";

    document.getElementById(finish).disabled=true;
    document.getElementById(dnf).disabled=true;
    document.getElementById(finish_img).src="icons/finished.png";
    document.getElementById(dnf_img).src="icons/dnf_disabled.png";
    document.getElementById(time_finish).textContent=getCurrentTime();

    // Finish Time
    $(`#${prefix}_time_display`).html(`
        <div style='color: #0cde31;'>${formatTime(new Date())}</div>
        <div style='color: #ff0000;'>+${timeToString(timer.elapsedTime)}</div>
    `);

    // enable undo button
    // disable undo button
    document.getElementById(undo).disabled=false;
    document.getElementById(undo_img).src="icons/undo.png";	
}

function DNFBoat(prefix) {
    let undo         = prefix + "_undo";
    let undo_img     = prefix +	"_undo_img";
    let finish       = prefix + "_finish";
    let finish_img   = prefix + "_finish_img"; 
    let dnf          = prefix + "_dnf";
    let dnf_img      = prefix + "_dnf_img";

    document.getElementById(dnf).disabled=false;
    document.getElementById(finish).disabled=true;
    document.getElementById(dnf_img).src="icons/dnf.png";
    document.getElementById(finish_img).src="icons/dnf_racing.png";

    // Finish Time
    $(`#${prefix}_time_display`).html(`
        <div style='color: #ff0000;'>-- DNF --</div>
    `);


    // enable undo button
    document.getElementById(undo).disabled=false;
    document.getElementById(undo_img).src="icons/undo.png";
}

function undo_result(prefix, timer) {
    let undo         = prefix + "_undo";
    let undo_img     = prefix +	"_undo_img";
    let finish       = prefix + "_finish";
    let finish_img   = prefix + "_finish_img"; 
    let dnf          = prefix + "_dnf";
    let dnf_img      = prefix + "_dnf_img";

    // enable finish and DNF buttons and reset time
    document.getElementById(finish).disabled=false;
    document.getElementById(dnf).disabled=false;
    document.getElementById(finish_img).src="icons/racing.png";
    document.getElementById(dnf_img).src="icons/dnf1.png";

    // Finish Time
    $(`#${prefix}_time_display`).html(`00:00:00:00`);

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
    } else {
        pom.click();
    }
}

function getResultsAsString(start_boat, end_boat, fleet, startTime) {
    let select = document.getElementById('course');
    let course = select.options[select.selectedIndex].text;
    let results_as_text = "";
    let line = "\n--------------------------------------------------------------------------------\n";
    results_as_text += new Date() + line;
    results_as_text += "FLEET: "   + fleet + "\n";
    results_as_text += "COURSE: "  + course + "\n";
    results_as_text += "START: "   + startTime + line;

    for (let i = start_boat; i <= end_boat; i++) {
        results_as_text += document.getElementById("b" + i + "_boat_name").textContent.padEnd(30);
        results_as_text += "\t";
        results_as_text += document.getElementById("b" + i + "_time_display").textContent;
        results_as_text += "\n";
    }

    return results_as_text;
}


function CSVResultsAsString(prefix, boats, fleet, startTime) {
    let select = document.getElementById('course');
    let course = select.options[select.selectedIndex].text;
    let new_race = "+";
    let results_as_text = "";
    let header = "RaceNo,Fleet,Boat,Start,Finish";
    let line = "\n--------------------------------------------------------------------------------\n";
    results_as_text += header + "\n";

	  for (var i = 0; i < boats; i++) {
        // remove the + sign at the start of the line
        // for all but the first line 
        if (i > 0) {
            new_race = "";
        }

        // RaceNo
        results_as_text += new_race;
        results_as_text += ",";

        // Fleet
        results_as_text += fleet;
        results_as_text += ",";

        // Boat
        results_as_text += $(`#${prefix}_${i}_boat_name`).text();
        results_as_text += ",";

        // Start
        results_as_text += startTime;
        results_as_text += ",";

        // Finish
        results_as_text += $(`#${prefix}_${i}_time_finish`).text();
        results_as_text += "\n";
	  }

    return results_as_text;
}

function getCurrentTime() {
	  var date    = new Date;
    var seconds = String(date.getSeconds()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    var hour    = String(date.getHours()).padStart(2, '0');

    return hour + ":" + minutes + ":" + seconds;
}
