$.toggle = function(node, forceShow) {
    let toShow = forceShow != null
        ? forceShow
        : $.css(node, "display") === "none";
    $.css(node, { "display": toShow ? 'block' : 'none' });
}
