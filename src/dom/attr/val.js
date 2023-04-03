$.val = function(node, value) {
    function setInputProp(input, prop, value) {
        // to avoid triggering custom logic
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, prop).set.call(input, value);
    }
    node = $(node);
    if (node.nodeName === "INPUT") {
        if (node.getAttribute("type") === "checkbox") {
            setInputProp(node, "checked", value);
        } else {
            setInputProp(node, "value", value);
        }
    } else {
        node.value = value;
    }
}
