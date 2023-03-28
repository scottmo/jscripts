// cdn: https://cdn.jsdelivr.net/gh/scottmo/monkeyscripts@main/element.js
// purge each update https://www.jsdelivr.com/tools/purge
// git https://github.com/scottmo/monkeyscripts/blob/main/element.js

var $el = (function() {
    function query(selectors) {
        if (typeof selectors === 'string') {
            selectors = [selectors];
        }
        if (Array.isArray(selectors)) {
            for (let sel of selectors) {
                const elm = document.querySelector(sel);
                if (elm) {
                    return elm;
                }
            }
            return null;
        }
        if (typeof selectors === 'object') {
            return selectors; // already a node
        }
        return null;
    }

    function createElement({ api = {}, created, render }) {
        const container = document.createElement("DIV");
        Object.assign(container, api);
        const template = render.call(container);
		container.innerHTML = template;
        const ids = [...template.matchAll(/\sid=['"](\w+)["']/g)].map(matchArr => matchArr[1]);
        const children = {};
        ids.forEach(id => {
            children[id] = container.querySelector("#" + id);
            children[id].setAttribute("id", id + "-" + uniqueId());
        });
        container.$ = children;
        if (typeof created === "function") {
            created.call(container, children);
        }
        return container;
    }

    function makeElementDraggable(element) {
        element = query(element);

        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        var header = element.querySelector(".header");
        if (header) {
            // if present, the header is where you move the DIV from:
            header.onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            element.onmousedown = dragMouseDown;
        }
    
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
            element.dragged = 0;
        }
    
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
    
            element.dragged += pos1 + pos2;
        }
    
        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    function uniqueId() {
        // add prefix to make selector valid
        return "el" + uuidv4().substring(0, 4);
    }

    function formatStyles(style) {
        if (typeof style === "string") {
            return style.split("\n").map(s => s.trim()).join("");
        }
        return Object.keys(style).reduce((acc, key) => (
            acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + ';'
        ), '');
    }

    function createPanel(title, content, { isDraggable = true, x = 20, y = 20, isCollapsed = false } = {}) {
        const panel = createElement({
            api: {
                isCollapsed: false,
                togglePanel: function(isShown) {
                    if (isShown != null) {
                        this.isCollapsed = !isShown;
                    } else {
                        this.isCollapsed = !this.isCollapsed;
                    }
                    this.$.body.style.display = this.isCollapsed ? 'none' : 'block';
                },
            },
            created({ panel, header, body }) {
                if (isDraggable) {
                    makeElementDraggable(panel);
                }
                body.appendChild(content);
                header.addEventListener('click', () => {
                    if (panel.dragged !== 0) return;
                    this.togglePanel();
                });
                this.togglePanel(!isCollapsed);
            },
            render() {
                const panelStyles = formatStyles(`
                    z-index: 998;
                    position: absolute;
                    top: ${x}px;
                    left: ${y}px;
                    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                    background-color: white;
                `);
                const headerStyles = formatStyles(`
                    z-index: 999;
                    background-color: #2196F3; 
                    color: #fff;
                    font-weight: bold;
                    font-size: 1.2rem;
                    padding: 5px;
                    text-align: center;
                    cursor: pointer;
                    box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%);
                `);
                const bodyStyles = formatStyles(`
                    padding: 5px;
                `);
                return `
                    <div id="panel" style="${panelStyles}">
                        <div id="header" class="header" style="${headerStyles}">${title}</div>
                        <div id="body" class="body" style="${bodyStyles}"></div>
                    </div>
                `;
            }
        });

        document.body.appendChild(panel);
        return panel;
    }

    async function waitFor(elementSel, interval, maxWaitTimes) {
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

    function fireEvent(element, eventName) {
        element = query(element);
        const event = new Event(eventName, { bubbles: true});
        event.simulated = true;
        element.dispatchEvent(event);    
    }

    function type(element, value) {
        element = query(element);
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(element, value);
        fireEvent(element, "input");
        fireEvent(element, "change");
    }

    function includeBootstrapCSS() {
        var bootstrapCSS = document.createElement("link");
        bootstrapCSS.setAttribute("rel", "stylesheet");
        bootstrapCSS.setAttribute("href", "https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css");
        bootstrapCSS.setAttribute("integrity", "sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu");
        bootstrapCSS.setAttribute("crossorigin", "anonymous");
        document.head.prepend(bootstrapCSS);    
    }

    return {
        query, includeBootstrapCSS, createElement, createPanel, formatStyles,
        makeElementDraggable, waitFor, fireEvent, type,
    }
})();
