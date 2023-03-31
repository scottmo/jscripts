$.val = function(node, value) {
    if (node.nodeName === "INPUT") {
        if (node.getAttribute("type") === "checkbox") {
            node.checked = value;
            return;
        }
    }
    node.value = value;
}
