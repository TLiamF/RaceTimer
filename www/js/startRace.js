/*************************************************************************************************
 * Start Timer.
------------------------------------------------------------------------------------------------*/
function start(duration, display) {
    // Disable Start Button
    $('#startButton').prop('disabled', true);
    $('#startIcon').css('filter', 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(180deg)');

    // Clear Actions
    action1.textContent = "";
    action2.textContent = "";
    action3.textContent = "";

    // Time Display
    var display = document.querySelector('#time');

    // Start Time
    var start = Date.now();
    
    var myInterval = null;
    function timer() {
        // Start at 6:10
        var duration = (60 * 6) + 10;

        // get the number of seconds that have elapsed since 
        // start() was called
        var diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        var minutes = (diff / 60) | 0;
        var seconds = (diff % 60) | 0;

        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (display.textContent == "06:00") {
            action1.textContent = "SOUND HORN 5 TIMES.";
            action2.textContent = "";
        } else if (display.textContent == "05:50") {
            action1.textContent = "";
            action2.textContent = "";
        } else if (display.textContent == "05:15") {
            action1.textContent = "PREPARE TO RAISE FLEET FLAG.";
            action2.textContent = "";
        } else if (display.textContent == "05:00") {
            action1.textContent = "SOUND HORN ONCE.";
            action2.textContent = "RAISE THE FLEET FLAG.";
        } else if (display.textContent == "04:50") {
            action1.textContent = "";
            action2.textContent = "";
        } else if (display.textContent == "04:15") {
            action1.textContent = "";
            action2.textContent = "PREPARE TO RAISE PREP FLAG.";
        } else if (display.textContent == "04:00") {
            action1.textContent = "SOUND HORN ONCE.";
            action2.textContent = "RAISE PREP FLAG.";
        } else if (display.textContent == "03:45") {
            action1.textContent = "";
            action2.textContent = "";
        } else if (display.textContent == "01:15") {
            action2.textContent = "PREPARE TO LOWER PREP FLAG.";
        } else if (display.textContent == "01:00") {
            action1.textContent = "SOUND HORN ONCE.";
            action2.textContent = "LOWER PREP FLAG.";
        } else if (display.textContent == "00:45") {
            action1.textContent = "";
            action2.textContent = "";
        } else if (display.textContent == "00:15") {
            action1.textContent = "PREPARE TO LOWER FLEET FLAG.";
            action2.textContent = "";
        } else if (display.textContent == "00:10") {
            action1.textContent = "";
            action2.textContent = "PREPARE TO START RACE.";
        } else if (display.textContent == "00:00") {
            action1.textContent = "SOUND HORN ONCE.";
            action2.textContent = "LOWER THE FLEET FLAG.";
            action3.textContent = "RACE STARTED!!";
        
            clearInterval(myInterval);
        }
        
        // add one second so that the count down starts at the full duration
        // example 05:00 not 04:59 
        if (diff <= 0) {
            start = Date.now() + 1000;
        }
    };

    action1.textContent = "WAIT FOR";
    action2.textContent = "INSTRUCTIONS.";

    // Start Immediately
    timer();

    // Start Interval
    myInterval = setInterval(timer, 1000);
}

/*************************************************************************************************
 * Reload Timer.
------------------------------------------------------------------------------------------------*/
function restart() {
    startRace($('#startContainer').parent());
}

/*************************************************************************************************
 * Create Race Timer.
------------------------------------------------------------------------------------------------*/
function startRace(element) {
    $(element).html(`
        <div id='startContainer' style='height: 160px; width: 100%;'>
            <button id='startButton' style='width: 25%; display: inline-block;'>
                <img id='startIcon' src="icons/start_seq.png" />
            </button>
            <div style='height: 100%; width: 50%; vertical-align: top; display: inline-block;'>
                <div id="time"    style='vertical-align: top; text-align: center; font-size: 48px;'>00:00</div>
                <div id="action1" style='vertical-align: top; text-align: center; font-size: 24px;'></div>
                <div id="action2" style='vertical-align: top; text-align: center; font-size: 24px;'></div>
                <div id="action3" style='vertical-align: top; text-align: center; font-size: 24px;'></div>
            </div>
            <div style='width: 20%; vertical-align: top; display: inline-block;'>
                <button id="restartButton" class="mybutton">
                    <img id="restart_button" src="icons/restart.png" />
                </button>
            </div>
        </div>
    `);

    $('#startButton'  ).on('click', start);
    $('#restartButton').on('click', restart);
}
