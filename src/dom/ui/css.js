$.css = function(node, styles) {
    let stylesStr;
    if (typeof styles === "string") {
        stylesStr = styles.split("\n").map(s => s.trim()).join("");
    } else {
        stylesStr = Object.keys(styles).reduce((acc, key) => (
            acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + styles[key] + ';'
        ), '');
    }
    node.setAttribute("style", stylesStr);
}

$.injectCSS = function(css) {
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
}
