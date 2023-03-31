$.trigger = function(element, eventName) {
    element = $(element);
    const event = new Event(eventName, { bubbles: true});
    event.simulated = true;
    element.dispatchEvent(event);    
}
