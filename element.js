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

    function create(html) {
        const element = document.createElement("DIV");
		element.innerHTML = html;
        const ids = [...html.matchAll(/\sid=['"](\w+)["']/g)].map(matchArr => matchArr[1]);
        ids.forEach(id => {
            element["$" + id] = element.querySelector("#" + id);
        });
        return element;
    }

    function makeElementDraggable(element) {
        element = query(element);

        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        var headerSelector = `.${element.id}-header`;
        var header = document.querySelector(headerSelector);
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

    function draggablePanel({ id, title, content }) {
        const panel = create(`
            <div id="header" class="${id}-header">${title}</div>
            <div id="body" class="${id}-body"></div>
        `);
        panel.$header.setAttribute('style', `
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
        panel.$body.setAttribute('style', `
            padding: 5px;
        `);
        panel.$body.appendChild(content);

        panel.setAttribute('id', id);
        panel.setAttribute('style', `
            z-index: 998;
            position: absolute;
            top: 20px;
            left: 20px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            background-color: white;
        `);
    
        let isVisible = true;
        panel.togglePanel = (forceVisible) => {
        	if (forceVisible != null) {
        		isVisible = forceVisible;
        	} else {
        		isVisible = !isVisible;
        	}
            panel.$body.style.display = isVisible ? 'block' : 'none';
        }
    
        panel.$header.addEventListener('click', function(event) {
            if (panel.dragged !== 0) return;
            panel.togglePanel();
        });
        panel.togglePanel(false);
    
        document.body.appendChild(panel);
        makeElementDraggable(panel);
    
        return panel;
    }

    function panel({ x, y }) {
        const element = div({
            style: {
                position: 'absolute',
                top: y + 'px',
                left: x + 'px',
                zIndex: 999
            }
        });
        document.body.prepend(element);
        return element;
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
        query, includeBootstrapCSS, create, draggablePanel, panel,
        makeElementDraggable, waitFor, fireEvent, type,
    }
})();
