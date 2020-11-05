$(document).ready(function () {

    // test flag
    const test = false;

    // get times from moment
    const now = moment().format('MMMM Do YYYY');

    // commented out for test in non-standard hours
    let nowHour24 = moment().format('H');
    let nowHour12 = moment().format('h');

    // set times for testing after hours
    if (test) {
        nowHour24 = 13;
        nowHour12 = 1;
    }

    let $dateHeading = $('#navbar-subtitle');
    $dateHeading.text(now);

    // using font awesome icon https://fontawesome.com/license
    // change description here - none
    const saveIcon = "./images/save-regular.svg";

    // Get stored to dos from localStorage
    // Parsing the JSON string to an object
    let storedPlans = JSON.parse(localStorage.getItem("storedPlans"));

    if (test) { console.log(storedPlans); }

    // If plans were retrieved from localStorage, update the plan array to it
    if (storedPlans !== null) {
        planTextArr = storedPlans;
    } else {
        // this should only occur on first time the app is loaded in the browser
        // helpfully remind user that lunch is important
        planTextArr = new Array(9);
        planTextArr[4] = "Picnic lunch outside";
    }

    if (test) { console.log("full array of planed text", planTextArr); }

    // set variable referencing planner element
    let $plannerDiv = $('#plannerContainer');
    // clear existing elements
    $plannerDiv.empty();

    if (test) { console.log("current time", nowHour12); }


    // build calendar by row for fix set of hours
    for (let hour = 9; hour <= 17; hour++) {
        // index for array use offset from hour
        let index = hour - 9;

        // build row components
        let $rowDiv = $('<div>');
        $rowDiv.addClass('row');
        $rowDiv.addClass('plannerRow');
        $rowDiv.attr('hour-index', hour);

        // Start building Time box portion of row
        let $col2TimeDiv = $('<div>');
        $col2TimeDiv.addClass('col-md-2');

        // create timeBox element (contains time)
        const $timeBoxSpn = $('<span>');
        // can use this to get value
        $timeBoxSpn.attr('class', 'timeBox');

        // format hours for display
        let displayHour = 0;
        let amPm = "";
        if (hour > 12) {
            displayHour = hour - 12;
            amPm = "pm";
        } else {
            displayHour = hour;
            amPm = "am";
        }

        // populate timeBox with time
        $timeBoxSpn.text(`${displayHour} ${amPm}`);

        $rowDiv.append($col2TimeDiv);
        $col2TimeDiv.append($timeBoxSpn);
        // STOP building Time box portion of row

        // START building input portion of row
        // build row components
        let $dailyPlanSpn = $('<input>');

        $dailyPlanSpn.attr('id', `input-${index}`);
        $dailyPlanSpn.attr('hour-index', index);
        $dailyPlanSpn.attr('type', 'text');
        $dailyPlanSpn.attr('class', 'dailyPlan');

        // access index from data array for hour 
        $dailyPlanSpn.val(planTextArr[index]);

        // create col to control width
        let $col9IptDiv = $('<div>');
        $col9IptDiv.addClass('col-md-9');

        // add col width and row component to row
        $rowDiv.append($col9IptDiv);
        $col9IptDiv.append($dailyPlanSpn);
        // STOP building Time box portion of row

        // START building save portion of row
        let $col1SaveDiv = $('<div>');
        $col1SaveDiv.addClass('col-md-1');

        let $saveBtn = $('<i>');
        $saveBtn.attr('id', `saveId-${index}`);
        $saveBtn.attr('save-id', index);
        $saveBtn.attr('class', "far fa-save saveIcon");

        $rowDiv.append($col1SaveDiv);
        $col1SaveDiv.append($saveBtn);

        // set row color based on time
        updateRowColor($rowDiv, hour);

        // add row to planner container
        $plannerDiv.append($rowDiv);
    };

    // function to update row color
    function updateRowColor($hourRow, hour) {

        if (test) { console.log("rowColor ", nowHour24, hour); }

        if (hour < nowHour24) {
            // $hourRow.css('')
            if (test) { console.log("lessThan"); }
            $hourRow.css("background-color", "darkGray")
        } else if (hour > nowHour24) {
            if (test) { console.log("greaterThan"); }
            $hourRow.css("background-color", "lightGreen")
        } else {
            if (test) { console.log("equal"); }
            $hourRow.css("background-color", "lightPink")
        }
    };

    $(document).on('click', 'i', function (event) {
        event.preventDefault();

        if (test) { console.log('click pta before ' + planTextArr); }

        let $index = $(this).attr('save-id');

        let inputId = '#input-' + $index;
        let $value = $(inputId).val();

        planTextArr[$index] = $value;


        if (test) { console.log('value ', $value); }
        if (test) { console.log('index ', $index); }
        if (test) { console.log('click pta after ' + planTextArr); }
// id tag for save button 
        $(`#saveId-${$index}`).removeClass('shadowPulse');
        localStorage.setItem("storedPlans", JSON.stringify(planTextArr));
    });

    $(document).on('change', 'input', function (event) {
        event.preventDefault();
        if (test) { console.log('onChange'); }
        if (test) { console.log('id', $(this).attr('hour-index')); }

        let i = $(this).attr('hour-index');

        $(`#saveId-${i}`).addClass('shadowPulse');
    });
});