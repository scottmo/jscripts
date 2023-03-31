$.component = function({ host, api = {}, css = {}, html, created } = {}) {
    const cmp = document.createElement("DIV");
    // render
    cmp.innerHTML = html;
    for (const [key, value] of Object.entries(css)) {
        cmp.querySelectorAll(key).forEach(node => {
            $.css(node, value);
        });
    }
    // set apis
    Object.assign(cmp, api);
    // init
    const ids = [...html.matchAll(/\sid=['"](\w+)["']/g)].map(matchArr => matchArr[1]);
    const children = {};
    ids.forEach(id => {
        children[id] = cmp.querySelector("#" + id);
        children[id].setAttribute("id", id + "-" + $.uuid(4));
    });
    cmp.$ = children;
    if (typeof created === "function") {
        created.call(cmp, children);
    }
    // mount
    if (host) {
        $(host).appendChild(cmp);
    }
    return cmp;
}
