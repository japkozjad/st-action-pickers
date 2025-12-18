import { SlashCommandParser } from "../../../slash-commands/SlashCommandParser.js";
import { SlashCommand } from "../../../slash-commands/SlashCommand.js";
import { executeSlashCommands, executeSlashCommandsWithOptions, registerSlashCommand } from '../../../slash-commands.js';

// Import action select lists
import { moodList, commonList, targetList, hasList, dillemaList, abstractList } from "./actionselectlists.js";

// Caller Popup
function createCallerPopup() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        min-height: 100vh;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        box-sizing: border-box;
        touch-action: none;
    `;

    const panel = document.createElement('div');
    panel.style.cssText = `
        background: #181818;
        padding: 20px;
        border-radius: 10px;
        color: #bfc9cc;
        width: 340px;
        border: 1px solid #222;
    `;

    const callerIdLabel = document.createElement('label');
    callerIdLabel.textContent = 'Caller ID';
    callerIdLabel.style.display = 'block';
    callerIdLabel.style.color = '#bfc9cc';

    const callerIdInput = document.createElement('input');
    callerIdInput.style.cssText = `
        width: 100%;
        margin-bottom: 10px;
        padding: 5px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
    `;
    callerIdInput.placeholder = 'Leave empty for unknown caller';
    
    callerIdInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            callTargetInput.focus();
        }
    });

    const callTargetLabel = document.createElement('label');
    callTargetLabel.textContent = 'Call Target';
    callTargetLabel.style.display = 'block';
    callTargetLabel.style.color = '#bfc9cc';

    const callTargetInput = document.createElement('input');
    callTargetInput.style.cssText = `
        width: 100%;
        margin-bottom: 10px;
        padding: 5px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
    `;
    callTargetInput.placeholder = 'Who is being called?';

    callTargetInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendButton.click();
        }
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; justify-content: center; gap: 10px; margin-top: 10px;';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        padding: 5px 15px;
        background: #181818;
        border: 1px solid #3b4a6c;
        color: #bfc9cc;
        cursor: pointer;
        border-radius: 5px;
    `;
    cancelButton.onclick = () => {
        overlay.remove();
        document.querySelector('#send_textarea').focus(); 
    }

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Ok';
    sendButton.style.cssText = `
        padding: 5px 15px;
        background: #2c1818;
        border: 1px solid #6c3b3b;
        color: #bfc9cc;
        cursor: pointer;
        border-radius: 5px;
    `;
    sendButton.onclick = () => {
        const callerId = callerIdInput.value || 'unknown caller';
        const callTarget = callTargetInput.value;
        executeSlashCommands(`/sys compact=true *${callTarget} gets a call from ${callerId || 'unknown caller'}*`);
        overlay.remove();
        document.querySelector('#send_textarea').focus();
    };

    buttonContainer.appendChild(sendButton);
    buttonContainer.appendChild(cancelButton);
    panel.appendChild(callerIdLabel);
    panel.appendChild(callerIdInput);
    panel.appendChild(callTargetLabel);
    panel.appendChild(callTargetInput);
    panel.appendChild(buttonContainer);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            overlay.remove();
            document.querySelector('#send_textarea').focus();
        }
    });

    overlay.tabIndex = -1;
    overlay.focus();

    callerIdInput.focus();
}

// Timeskip Popup
function createTimeskipPopup() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        min-height: 100vh;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        box-sizing: border-box;
        touch-action: none;
    `;

    const panel = document.createElement('div');
    panel.style.cssText = `
        background: #181818;
        padding: 20px;
        border-radius: 10px;
        color: #bfc9cc;
        width: 340px;
        border: 1px solid #222;
    `;

    // Amount
    const amountLabel = document.createElement('label');
    amountLabel.textContent = 'Amount';
    amountLabel.style.display = 'block';
    amountLabel.style.color = '#bfc9cc';

    // Create spinbox container
    const spinboxContainer = document.createElement('div');
    spinboxContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 10px;
        width: 100%;
    `;

    // Minus button
    const minusButton = document.createElement('button');
    minusButton.textContent = '-';
    minusButton.className = 'button-select';
    minusButton.style.cssText = `
        padding: 5px 15px;
        min-width: 40px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
    `;

    // Amount input
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.min = 1;
    amountInput.max = 60;
    amountInput.value = 5;
    amountInput.className = 'text-select';
    amountInput.style.cssText = `
        width: 100%;
        padding: 5px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
    `;

    // Plus button
    const plusButton = document.createElement('button');
    plusButton.textContent = '+';
    plusButton.className = 'button-select';
    plusButton.style.cssText = `
        padding: 5px 15px;
        min-width: 40px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
    `;

    // Add event listeners
    minusButton.onclick = () => {
        let val = parseInt(amountInput.value, 10) - 1;
        if (val < 1) val = 1;
        amountInput.value = val;
        updateUnits(val);
    };

    plusButton.onclick = () => {
        let val = parseInt(amountInput.value, 10) + 1;
        if (val > 60) val = 60;
        amountInput.value = val;
        updateUnits(val);
    };

    amountInput.addEventListener('input', () => {
        let val = parseInt(amountInput.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 60) val = 60;
        amountInput.value = val;
        updateUnits(val);
    });

    // Function to update units based on amnt
    function updateUnits(val) {
        // Save current selection and its index
        const currentUnit = unitSelect.value;
        let currentIndex = Array.from(unitSelect.options).findIndex(opt => opt.value === currentUnit);

        // Determine correct units
        const units = val === 1 ? unitsSingular : unitsPlural;

        // Rebuild options
        unitSelect.innerHTML = '';
        units.forEach(unit => {
            const opt = document.createElement('option');
            opt.value = unit;
            opt.textContent = unit;
            unitSelect.appendChild(opt);
        });

        // Try to restore previous selection by index, fallback to default if out of range
        if (currentIndex >= 0 && currentIndex < units.length) {
            unitSelect.selectedIndex = currentIndex;
        } else {
            unitSelect.value = (val === 1 ? 'minute' : 'minutes');
        }
    }

    // Build spinbox
    spinboxContainer.appendChild(minusButton);
    spinboxContainer.appendChild(amountInput);
    spinboxContainer.appendChild(plusButton);

    // Replace the slider-related code in the panel building section with:
    panel.appendChild(amountLabel);
    panel.appendChild(spinboxContainer);

    // Unit
    const unitLabel = document.createElement('label');
    unitLabel.textContent = 'Unit';
    unitLabel.style.display = 'block';
    unitLabel.style.color = '#bfc9cc';

    const unitsPlural = [
        'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'
    ];
    const unitsSingular = [
        'second', 'minute', 'hour', 'day', 'week', 'month', 'year'
    ];

    const unitSelect = document.createElement('select');
    unitSelect.style.cssText = `
        width: 100%;
        margin-bottom: 10px;
        padding: 5px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
    `;
    unitsPlural.forEach(unit => {
        const opt = document.createElement('option');
        opt.value = unit;
        opt.textContent = unit;
        unitSelect.appendChild(opt);
    });
    unitSelect.value = 'minutes'; // Default to minutes

    // Direction
    const directionLabel = document.createElement('label');
    directionLabel.textContent = 'Direction';
    directionLabel.style.display = 'block';
    directionLabel.style.color = '#bfc9cc';

    const directionSelect = document.createElement('select');
    directionSelect.style.cssText = `
        width: 100%;
        margin-bottom: 10px;
        padding: 5px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
    `;
    ['later', 'earlier'].forEach(dir => {
        const opt = document.createElement('option');
        opt.value = dir;
        opt.textContent = dir.charAt(0).toUpperCase() + dir.slice(1);
        directionSelect.appendChild(opt);
    });

    // Time of day
    const timeOfDayLabel = document.createElement('label');
    timeOfDayLabel.textContent = 'Time of Day (optional)';
    timeOfDayLabel.style.display = 'block';
    timeOfDayLabel.style.color = '#bfc9cc';

    const timeOfDaySelect = document.createElement('select');
    timeOfDaySelect.style.cssText = `
        width: 100%;
        margin-bottom: 10px;
        padding: 5px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
    `;
    const timesOfDay = [
        '', 'dawn', 'morning', 'noon', 'afternoon', 'evening', 'night', 'midnight'
    ];
    timesOfDay.forEach(time => {
        const opt = document.createElement('option');
        opt.value = time;
        opt.textContent = time ? time.charAt(0).toUpperCase() + time.slice(1) : '(ignore)';
        timeOfDaySelect.appendChild(opt);
    });

    // Plural/singular unit logic (do not change unit selection)
    amountInput.addEventListener('input', () => {
        let val = parseInt(amountInput.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 60) val = 60;
        amountInput.value = val;

        // Save current selection
        const currentUnit = unitSelect.value;
        // Determine correct units
        const units = val === 1 ? unitsSingular : unitsPlural;
        // Rebuild options
        unitSelect.innerHTML = '';
        units.forEach(unit => {
            const opt = document.createElement('option');
            opt.value = unit;
            opt.textContent = unit;
            unitSelect.appendChild(opt);
        });
        // Restore selection if possible, otherwise default to minutes
        if (units.includes(currentUnit)) {
            unitSelect.value = currentUnit;
        } else {
            unitSelect.value = (val === 1 ? 'minute' : 'minutes');
        }
    });

    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; justify-content: center; gap: 10px; margin-top: 10px;';

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply';
    applyButton.style.cssText = `
        padding: 5px 15px;
        background: #2c1818;
        border: 1px solid #6c3b3b;
        color: #bfc9cc;
        cursor: pointer;
        border-radius: 5px;
    `;
    applyButton.onclick = () => {
        const amount = amountInput.value;
        const unit = unitSelect.value;
        const direction = directionSelect.value;
        const timeOfDay = timeOfDaySelect.value;
        let cmd = `/sys compact=true *${amount} ${unit} ${direction}.*`;
        if (timeOfDay) cmd += ` *${timeOfDay}.*`;
        executeSlashCommands(cmd);
        overlay.remove();
        document.querySelector('#send_textarea')?.focus();
    };

    const nextDayButton = document.createElement('button');
    nextDayButton.textContent = 'Next Day';
    nextDayButton.style.cssText = `
        padding: 5px 15px;
        background: #181818;
        border: 1px solid #3b4a6c;
        color: #bfc9cc;
        cursor: pointer;
        border-radius: 5px;
    `;
    nextDayButton.onclick = () => {
        const timeOfDay = timeOfDaySelect.value;
        let cmd = `/sys compact=true *next day*`;
        if (timeOfDay) cmd += ` *${timeOfDay}.*`;
        executeSlashCommands(cmd);
        overlay.remove();
        document.querySelector('#send_textarea')?.focus();
    };

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        padding: 5px 15px;
        background: #181818;
        border: 1px solid #3b4a6c;
        color: #bfc9cc;
        cursor: pointer;
        border-radius: 5px;
    `;
    cancelButton.onclick = () => {
        overlay.remove();
        document.querySelector('#send_textarea')?.focus();
    };

    buttonContainer.appendChild(applyButton);
    buttonContainer.appendChild(nextDayButton);
    buttonContainer.appendChild(cancelButton);

    panel.appendChild(amountLabel);
    panel.appendChild(spinboxContainer);
    panel.appendChild(unitLabel);
    panel.appendChild(unitSelect);
    panel.appendChild(directionLabel);
    panel.appendChild(directionSelect);
    panel.appendChild(timeOfDayLabel);
    panel.appendChild(timeOfDaySelect);
    panel.appendChild(buttonContainer);

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // Keyboard: Escape closes, Enter on amount/unit/direction applies, Enter on timeOfDay applies
    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            overlay.remove();
            document.querySelector('#send_textarea')?.focus();
        }
        if (e.key === 'Enter') {
            if (document.activeElement === amountInput ||
                document.activeElement === unitSelect ||
                document.activeElement === directionSelect ||
                document.activeElement === timeOfDaySelect) {
                e.preventDefault();
                applyButton.click();
            }
        }
    });
    overlay.tabIndex = -1;
    overlay.focus();
    amountInput.focus();

    // Add these helper functions after spinbox creation
    let holdTimer = null;
    let holdInterval = null;

    function startDecrement(e) {
        // Immediate first click
        let val = parseInt(amountInput.value, 10) - 1;
        if (val < 1) val = 1;
        amountInput.value = val;
        updateUnits(val);
        
        // Start hold behavior after a longer initial delay
        holdTimer = setTimeout(() => {
            holdInterval = setInterval(() => {
                val = parseInt(amountInput.value, 10) - 1;
                if (val < 1) val = 1;
                amountInput.value = val;
                updateUnits(val);
            }, 50); // Repeat every 50ms once started
        }, 800); // Wait 800ms before starting repeat
    }

    function startIncrement(e) {
        // Immediate first click
        let val = parseInt(amountInput.value, 10) + 1;
        if (val > 60) val = 60;
        amountInput.value = val;
        updateUnits(val);

        // Start hold behavior after a longer initial delay
        holdTimer = setTimeout(() => {
            holdInterval = setInterval(() => {
                val = parseInt(amountInput.value, 10) + 1;
                if (val > 60) val = 60;
                amountInput.value = val;
                updateUnits(val);
            }, 50); // Repeat every 50ms once started
        }, 800); // Wait 800ms before starting repeat
    }

    function stopHold() {
        if (holdTimer) clearTimeout(holdTimer);
        if (holdInterval) clearInterval(holdInterval);
        holdTimer = null;
        holdInterval = null;
    }

    // Replace the existing button event listeners with:
    minusButton.addEventListener('mousedown', startDecrement);
    minusButton.addEventListener('mouseup', stopHold);
    minusButton.addEventListener('mouseleave', stopHold);

    plusButton.addEventListener('mousedown', startIncrement);
    plusButton.addEventListener('mouseup', stopHold);
    plusButton.addEventListener('mouseleave', stopHold);

    // Add touch support
    minusButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDecrement();
    });
    minusButton.addEventListener('touchend', stopHold);
    minusButton.addEventListener('touchcancel', stopHold);

    plusButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startIncrement();
    });
    plusButton.addEventListener('touchend', stopHold);
    plusButton.addEventListener('touchcancel', stopHold);
}

// if you're reading this, you already know that code is a total mess
// anyways, it works, right?
// yeah, i know...
// :P

// Action Selection Popup
async function createActionSelectionPopup({ user = "{{user}}", char = "{{char}}" } = {}) {
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        min-height: 100vh;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        box-sizing: border-box;
        touch-action: none;
    `;

    const panel = document.createElement('div');
    panel.style.cssText = `
        background: #181818;
        padding: 20px;
        border-radius: 10px;
        color: #bfc9cc;
        width: 400px;
        border: 1px solid #222;
    `;

    // Target type
    const targetLabel = document.createElement('label');
    targetLabel.textContent = 'Target';
    targetLabel.style.display = 'block';
    targetLabel.style.color = '#bfc9cc';

    const targetSelect = document.createElement('select');
    targetSelect.style.cssText = `
        width: 100%;
        margin-bottom: 10px;
        padding: 5px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
    `;
    [
        { value: user, text: `User (${user})` },
        { value: char, text: `Character (${char})` },
        { value: 'custom', text: 'Custom...' }
    ].forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.text;
        targetSelect.appendChild(o);
    });

    // Custom target input
    const customTargetInput = document.createElement('input');
    customTargetInput.style.cssText = `
        width: 100%;
        margin-bottom: 10px;
        padding: 5px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
        display: none;
    `;
    customTargetInput.placeholder = 'Enter custom target...';

    targetSelect.addEventListener('change', () => {
        customTargetInput.style.display = targetSelect.value === 'custom' ? '' : 'none';
    });

    // Action type
    const actionTypeLabel = document.createElement('label');
    actionTypeLabel.textContent = 'Action Type';
    actionTypeLabel.style.display = 'block';
    actionTypeLabel.style.color = '#bfc9cc';

    const actionTypeSelect = document.createElement('select');
    actionTypeSelect.style.cssText = `
        width: 100%;
        margin-bottom: 10px;
        padding: 5px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
    `;
    [
        { value: 'mood', text: 'Mood Change' },
        { value: 'common', text: 'Common Actions' },
        { value: 'target', text: 'Target Actions' },
        { value: 'has', text: 'Has/Gets Actions' },
        { value: 'dillema', text: 'Dillema Actions' },
        { value: 'abstract', text: 'Abstract Actions' }
    ].forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.text;
        actionTypeSelect.appendChild(o);
    });

    // Listbox for actions
    const actionListLabel = document.createElement('label');
    actionListLabel.textContent = 'Action';
    actionListLabel.style.display = 'block';
    actionListLabel.style.color = '#bfc9cc';

    const actionListBox = document.createElement('select');
    actionListBox.size = 20;
    actionListBox.style.cssText = `
        width: 100%;
        margin-bottom: 10px;
        padding: 5px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
    `;

    function updateActionList() {
        actionListBox.innerHTML = '';
        let list = [];
        if (actionTypeSelect.value === 'mood') list = moodList;
        else if (actionTypeSelect.value === 'common') list = commonList;
        else if (actionTypeSelect.value === 'target') list = targetList;
        else if (actionTypeSelect.value === 'has') list = hasList;
        else if (actionTypeSelect.value === 'dillema') list = dillemaList;
        else if (actionTypeSelect.value === 'abstract') list = abstractList;
        list.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            actionListBox.appendChild(opt);
        });
        if (actionListBox.options.length > 0) actionListBox.selectedIndex = 0;
    }
    actionTypeSelect.addEventListener('change', updateActionList);
    updateActionList();

    // Command type radio buttons
    const commandTypeLabel = document.createElement('label');
    commandTypeLabel.textContent = 'Command Type';
    commandTypeLabel.style.display = 'block';
    commandTypeLabel.style.color = '#bfc9cc';

    const radioContainer = document.createElement('div');
    radioContainer.style.cssText = 'margin-bottom: 10px; display: flex; gap: 20px;';

    const impersonateRadio = document.createElement('input');
    impersonateRadio.type = 'radio';
    impersonateRadio.name = 'commandType';
    impersonateRadio.value = 'impersonate';
    impersonateRadio.id = 'impersonateRadio';
    impersonateRadio.checked = true;

    const impersonateLabel = document.createElement('label');
    impersonateLabel.htmlFor = 'impersonateRadio';
    impersonateLabel.textContent = 'Impersonate';
    impersonateLabel.style.marginRight = '10px';

    const straightRadio = document.createElement('input');
    straightRadio.type = 'radio';
    straightRadio.name = 'commandType';
    straightRadio.value = 'straight';
    straightRadio.id = 'straightRadio';

    const straightLabel = document.createElement('label');
    straightLabel.htmlFor = 'straightRadio';
    straightLabel.textContent = 'System';

    const respondRadio = document.createElement('input');
    respondRadio.type = 'radio';
    respondRadio.name = 'commandType';
    respondRadio.value = 'respond';
    respondRadio.id = 'respondRadio';

    const respondLabel = document.createElement('label');
    respondLabel.htmlFor = 'respondRadio';
    respondLabel.textContent = 'Gen';

    radioContainer.appendChild(impersonateRadio);
    radioContainer.appendChild(impersonateLabel);
    radioContainer.appendChild(straightRadio);
    radioContainer.appendChild(straightLabel);
    radioContainer.appendChild(respondRadio);
    radioContainer.appendChild(respondLabel);

    // Target type 2
    const target2Label = document.createElement('label');
    target2Label.textContent = 'Target (for {target})';
    target2Label.style.display = 'block';
    target2Label.style.color = '#bfc9cc';
    target2Label.style.marginTop = '5px';

    const target2Select = document.createElement('select');
    target2Select.style.cssText = `
        width: 100%;
        margin-bottom: 10px;
        padding: 5px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
    `;
    [
        { value: user, text: `User (${user})` },
        { value: char, text: `Character (${char})` },
        { value: 'custom', text: 'Custom...' }
    ].forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.text;
        target2Select.appendChild(o);
    });
    target2Select.value = char;

    const customTarget2Input = document.createElement('input');
    customTarget2Input.style.cssText = `
        width: 100%;
        margin-bottom: 10px;
        padding: 5px;
        background: #111;
        border: 1px solid #222;
        color: #bfc9cc;
        border-radius: 5px;
        display: none;
    `;
    customTarget2Input.placeholder = 'Enter custom target...';

    target2Select.addEventListener('change', () => {
        customTarget2Input.style.display = target2Select.value === 'custom' ? '' : 'none';
    });

    // Show/hide second target selector only for target actions
    function updateTarget2Visibility() {
        const show = actionTypeSelect.value === 'target';
        target2Label.style.display = show ? 'block' : 'none';
        target2Select.style.display = show ? '' : 'none';
        customTarget2Input.style.display = (show && target2Select.value === 'custom') ? '' : 'none';
    }
    actionTypeSelect.addEventListener('change', updateTarget2Visibility);
    target2Select.addEventListener('change', updateTarget2Visibility);
    updateTarget2Visibility();

    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; justify-content: center; gap: 10px; margin-top: 10px;';

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply';
    applyButton.style.cssText = `
        padding: 5px 15px;
        background: #2c1818;
        border: 1px solid #6c3b3b;
        color: #bfc9cc;
        cursor: pointer;
        border-radius: 5px;
    `;
    applyButton.onclick = () => {
        let subject = targetSelect.value;
        if (subject === 'custom') subject = customTargetInput.value.trim() || 'someone';

        let action = actionListBox.value;
        let modifier;
        if (actionTypeSelect.value === 'mood') {
            modifier = 'should be';
        } else if (actionTypeSelect.value === 'has'|| actionTypeSelect.value === 'dillema' || actionTypeSelect.value === 'abstract') {
            modifier = '';
        } else {
            modifier = 'should';
        }

        // For target actions, replace {target} with the second target
        if (actionTypeSelect.value === 'target' && action.includes('{target}')) {
            let target2 = target2Select.value;
            if (target2 === 'custom') target2 = customTarget2Input.value.trim() || 'someone';
            action = action.replaceAll('{target}', target2);
        }

        let cmd = '';
        if (impersonateRadio.checked) {
            cmd = `/impersonate *${subject} ${modifier} ${action}*`;
        } else if (straightRadio.checked) {
            cmd = `/sys compact=true *${subject} ${modifier} ${action}*`;
        } else if (respondRadio.checked) {
            cmd = `/gen Respond as ${subject}, ${subject} ${modifier} ${action} | /sendas name=${subject} {{pipe}}`;
        }
        executeSlashCommands(cmd);
        overlay.remove();
        document.querySelector('#send_textarea')?.focus();
    };

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        padding: 5px 15px;
        background: #181818;
        border: 1px solid #3b4a6c;
        color: #bfc9cc;
        cursor: pointer;
        border-radius: 5px;
    `;
    cancelButton.onclick = () => {
        overlay.remove();
        document.querySelector('#send_textarea')?.focus();
    };

    buttonContainer.appendChild(applyButton);
    buttonContainer.appendChild(cancelButton);

    // Build panel
    panel.appendChild(targetLabel);
    panel.appendChild(targetSelect);
    panel.appendChild(customTargetInput);
    panel.appendChild(actionTypeLabel);
    panel.appendChild(actionTypeSelect);
    panel.appendChild(actionListLabel);
    panel.appendChild(actionListBox);
    panel.appendChild(commandTypeLabel);
    panel.appendChild(radioContainer);
    panel.appendChild(target2Label);
    panel.appendChild(target2Select);
    panel.appendChild(customTarget2Input);
    panel.appendChild(buttonContainer);

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            overlay.remove();
            document.querySelector('#send_textarea')?.focus();
        }
        if (e.key === 'Enter') {
            if (
                document.activeElement === targetSelect ||
                document.activeElement === customTargetInput ||
                document.activeElement === actionTypeSelect ||
                document.activeElement === actionListBox ||
                document.activeElement === impersonateRadio ||
                document.activeElement === straightRadio
            ) {
                e.preventDefault();
                applyButton.click();
            }
        }
    });
    overlay.tabIndex = -1;
    overlay.focus();
}

// Slash Commands
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: 'hello-world',
    callback: async () => {
        window.alert('Hello, world!');
        return "";
    }
})),

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: 'call',
    helpString: 'Displays a call popup where you can initiate a phone call request.',
    callback: async () => {
        createCallerPopup();
    }
})),

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: 'timeskip',
    helpString: 'Displays a time skip popup where you can manage the time flow using an interactive UI.',
    callback: async () => {
        createTimeskipPopup();
    }
})),

SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: 'actionselect',
    helpString: 'Displays an action selection popup where you can choose a desired action using from interactive UI.',
    callback: async () => {
        await createActionSelectionPopup({});
    }
}))