$.waitFor = async function(elementSel, interval, maxWaitTimes) {
    return new Promise(resolve => {
        let waitTime = 0;
        var pid = setInterval(function() {
            let element = document.querySelector(elementSel);
            if (element || waitTime >= maxWaitTimes) {
                clearInterval(pid);
                resolve(element);
            }
            waitTime++;
        }, interval);
    });
}
