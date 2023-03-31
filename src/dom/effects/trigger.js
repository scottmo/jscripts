$.trigger = function(node, eventName) {
    node = $(node);
    const event = new Event(eventName, { bubbles: true});
    event.simulated = true;
    node.dispatchEvent(event);    
}
