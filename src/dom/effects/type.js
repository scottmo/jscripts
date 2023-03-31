$.type = function(node, value) {
    $.val(node, value);
    $.trigger(node, "input");
    $.trigger(node, "change");
}
