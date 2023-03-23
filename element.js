// cdn: https://cdn.jsdelivr.net/gh/scottmo/monkeyscripts@main/element.js
// purge each update https://www.jsdelivr.com/tools/purge
// git https://github.com/scottmo/monkeyscripts/blob/main/element.js

var $el = (function() {
    const css = {
        formControl: {
            display: 'block',
            width: '100%',
            padding: '.375rem .75rem',
            fontSize: '1rem',
            fontWeight: '400',
            lineHeight: '1.5',
            color: '#212529',
            backgroundColor: '#fff',
            backgroundClip: 'padding-box',
            border: '1px solid #ced4da',
            appearance: 'none',
            borderRadius: '.25rem',
            transition: 'border-color .15s ease-in-out, box-shadow .15s ease-in-out',
        },
        textArea: {
            minHeight: 'calc(1.5em + .75rem + 2px)',
            resize: 'vertical'
        },
        label: {
            display: 'inline-block',
            marginBottom: '.5rem',
        }
    };

    function select(selectors) {
        if (typeof selectors === 'string') {
            selectors = [selectors];
        }
        for (let sel of selectors) {
            const elm = document.querySelector(sel);
            if (elm) {
                return elm;
            }
        }
        return null;
    }

    function div({ children = [], style = {} }) {
        const element = document.createElement('DIV');
        Object.assign(element.style, style);
        children.forEach(child => element.appendChild(child));
        return element;
    }

    function label({ content = '', style = {} }) {
        const element = document.createElement('label');
        element.value = content;
        Object.assign(element.style, css.label, style);
        return element;
    }

    function textarea({ content = '', placeholder = '', style = {} }) {
        const element = document.createElement('TEXTAREA');
        element.value = content;
        element.placeholder = placeholder;
        Object.assign(element.style, css.formControl, css.textArea, style);
        return element;
    }

    function input({ content = '', placeholder = '', style = {} }) {
        const element = document.createElement('INPUT');
        element.value = content;
        element.placeholder = placeholder;
        Object.assign(element.style, css.formControl, style);
        return element;
    }

    function button({ type = 'success', label = 'button', style = {}, onclick }) {
        const element = document.createElement('BUTTON');
        element.textContent = label;
        if (typeof onclick === 'function') {
            element.addEventListener('click', onclick);
        }
        return element;
    }

    function a({ href, label = href, target = '_blank', style = {} }) {
        const element = document.createElement("a");
        element.setAttribute("href", href);
        element.setAttribute("target", target);
        element.textContent = label;
        Object.assign(element.style, style);
        return element;
    }

    function makeElementDraggable(element) {
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
            element.style.top = (element.offsetTop - pos2) + 'px';
            element.style.left = (element.offsetLeft - pos1) + 'px';

            element.dragged += pos1 + pos2;
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function draggablePanel({titleSymbol = '⚙', title, content, style}) {
        const panel = document.createElement('DIV');
        Object.assign(panel.style, {
            zIndex: '998',
            position: 'absolute',
            transition: 'all 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) 0s',
            transform: 'translate3d(0px, 0px, 0px)',
            top: '20px',
            left: '20px',
        }, style.panel);

        const header = document.createElement('DIV');
        header.setAttribute('class', 'header');
        Object.assign(header.style, {
            zIndex: '999',
            backgroundColor: '#2196F3',
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)',
        }, style.header);
        panel.appendChild(header);

        const body = document.createElement('DIV');
        body.setAttribute('class', 'body');
        body.appendChild(content);
        Object.assign(body.style, style.body);
        panel.appendChild(body);

        function togglePanel(isVisible) {
            if (isVisible) {
                Object.assign(header.style, {
                    borderRadius: '0',
                    height: '100%',
                    width: '100%',
                    pointer: 'move',
                    fontSize: '14px',
                    lineHeight: '25px',
                }, style.header);
                setTimeout(() => {
                    header.textContent = title;
                }, 500);

                Object.assign(body.style, {
                    padding: '5px',
                    height: '300px',
                    width: '300px',
                    overflow: 'auto',
                }, style.body);

                panel.style.boxShadow = '0 4px 8px 0 rgba(0,0,0,0.2)';
            } else {
                Object.assign(header.style, {
                    borderRadius: '50%',
                    height: '40px',
                    width: '40px',
                    cursor: 'pointer',
                    fontSize: '40px',
                    lineHeight: '40px',
                });
                header.textContent = titleSymbol;

                Object.assign(body.style, {
                    padding: '0px',
                    height: '0px',
                    width: '0px',
                    overflow: 'hidden',
                });

                panel.style.boxShadow = 'none';
            }
        }

        header.addEventListener('click', function() {
            if (panel.dragged !== 0) return;
            togglePanel(body.style.overflow === 'hidden');
        });

        togglePanel(false);

        document.body.appendChild(panel);
        makeElementDraggable(panel);

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
        var event = new Event(eventName, { bubbles: true});
        event.simulated = true;
        element.dispatchEvent(event);    
    }

    function type(element, value) {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(element, value);
        fireEvent(element, "input");
        fireEvent(element, "change");
    }

    return {
        select,
        div, input, button, label, textarea, a, draggablePanel,
        makeElementDraggable, waitFor, fireEvent, type
    }
})();
