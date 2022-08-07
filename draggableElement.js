function makeDraggable(element, dragHandle) {
    var draggedX = 0, draggedY = 0, lastX = 0, lastY = 0;
    (dragHandle || element).onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        lastX = e.clientX;
        lastY = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        element.dragged = 0;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        draggedX = lastX - e.clientX;
        draggedY = lastY - e.clientY;
        lastX = e.clientX;
        lastY = e.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - draggedY) + "px";
        element.style.left = (element.offsetLeft - draggedX) + "px";

        element.dragged += draggedX + draggedY;
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
