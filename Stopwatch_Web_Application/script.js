let startTime, updatedTime, difference, timerInterval;
let running = false;
let lapCounter = 0;

function formatTime(ms) {
    const date = new Date(ms);
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(Math.floor(ms % 1000 / 10)).padStart(2, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
}

function startStopwatch() {
    if (!running) {
        startTime = Date.now() - (difference || 0);
        timerInterval = setInterval(() => {
            difference = Date.now() - startTime;
            document.getElementById('display').textContent = formatTime(difference);
        }, 10);
        running = true;
    }
}

function pauseStopwatch() {
    if (running) {
        clearInterval(timerInterval);
        running = false;
    }
}

function resetStopwatch() {
    clearInterval(timerInterval);
    running = false;
    difference = 0;
    document.getElementById('display').textContent = "00:00:00.00";
    document.getElementById('laps').innerHTML = "";
    lapCounter = 0;
}

function lapTime() {
    if (!running) return;
    lapCounter++;
    const lapDisplay = formatTime(difference);
    const lapElement = document.createElement('div');
    lapElement.className = 'lap';
    lapElement.textContent = `Lap ${lapCounter}: ${lapDisplay}`;
    document.getElementById('laps').prepend(lapElement);
}