/*************************************************************************************************
 * File: util.js
------------------------------------------------------------------------------------------------*/
/*************************************************************************************************
 * Add Boat.
------------------------------------------------------------------------------------------------*/
jQuery.fn.addBoat = function(name, id, timer) {
    $(this).append(`
        <tr>
            <td class="tdundo">
                <button class="button_undo" disabled id="${id}_undo" />
                <img id="${id}_undo_img" src="icons/disabled_undo.png" />
            </td>
            <td class="AFleettd">
                <span id='${id}_boat_name'>${name}</span>
            </td>
            <td>
                <button class=button id='${id}_finish';>
                    <img id="${id}_finish_img" src="icons/racing.png" />
                </button>
            </td>
            <td>
                <button class=button id="${id}_dnf" onclick="DNFBoat('${id}')"><img id="${id}_dnf_img" src="icons/dnf1.png" />
            </td>
            <td>
                <span id="${id}_time_display">00:00:00:00</span><span hidden id="${id}_time_finish"></span>
            </td>
        </tr>
    `);

    // Undo Button
    $(`#${id}_undo`).on('click', () => {
        undo_result(id, timer);
    });

    // Finish Button
    $(`#${id}_finish`).on('click', () => {
        FinishBoat(id, timer);
    });
}

/*************************************************************************************************
 * Add Fleet.
------------------------------------------------------------------------------------------------*/
jQuery.fn.addFleet = function(name, id, boats) {
    // Create HTML
    $(this).append(`
        <div class="stopwatch">
            <h1>${name}</h1>

            <div class="circle">
                <span class="atime" id="${id}_display">00:00:00:00</span>
            </div>
            <div class="controls">
                <span id='${id}_timer' class="buttonPlay"></span>
                <button class="reload">
                    <img id="${id}_reload" src="icons/Restart.png" />
                </button>
                <button class="buttonWrite">
                    <img id="${id}_download" src="icons/write.png" />
                </button>
                <select name="course" id="course" class="box">
                    <option value="Course 1">Course 1</option>
                    <option value="Course 2">Course 2</option>
                    <option value="Course 3">Course 3</option>
                    <option value="Course 4">Course 4</option>
                    <option value="Course 5">Course 5</option>
                    <option value="Course 6">Course 6</option>
                    <option value="Course 7">Course 7</option>
                    <option value="Course 8">Course 8</option>
                    <option value="Course 9">Course 9</option>
                    <option value="Course 10">Course 10</option>
                    <option value="Course 11">Course 11</option>
                    <option value="Course 12">Course 12</option>
                    <option value="Course 13">Course 13</option>
                    <option value="Course 14">Course 14</option>
                </select>
            </div>
        </div>

        <div class="results" style='padding: 20px;'>
            <table id='${id}'></table>
        </div>
    `);

    // Racing Timer
    var timer = raceTimer(`#${id}_timer`, id);

    // Add Boats
    for(var index = 0; index < boats.length; index++) {
        $('#' + id).addBoat(boats[index], `${id}_${index}`, timer);
    }

    // On Reset
    $(`#${id}_reload`).on('click', () => {
        // Confirmation
        if(reset(timer, 'Start New Race?')) {
            // Clear Boats
            $(`#${id}`).html('');

            // Reload Boats
            for(var index = 0; index < boats.length; index++) {
                $(`#${id}`).addBoat(boats[index], `${id}_${index}`, timer);
            }
        }
    });

    // Download
    $(`#${id}_download`).on('click', () => {
        download(`${name[0]}_FLEET`, CSVResultsAsString(id, boats.length, name[0], timer.raceStart));
    });
}
