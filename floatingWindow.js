function createPanel({id, title, content, style}) {
    const transitionStyles = {
        transition: 'all 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) 0s',
        transform: 'translate3d(0px, 0px, 0px)',
    };

    const gearIcon = '⚙';
    const header = document.createElement('DIV');
    header.setAttribute('class', `${id}-header`);
    Object.assign(header.style, {
        backgroundColor: '#2196F3',
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        cursor: 'pointer',
    }, transitionStyles, style.header);

    const body = document.createElement('DIV');
    body.setAttribute('class', `${id}-body`);
    Object.assign(body.style, transitionStyles, style.body);
    body.appendChild(content);

    const panel = document.createElement('DIV');
    panel.setAttribute('id', id);
    Object.assign(panel.style, {
        zIndex: '999',
        position: 'absolute',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        top: '20px',
        left: '20px',
    }, style.panel);

    panel.$header = header;
    panel.$body = body;
    panel.appendChild(header);
    panel.appendChild(body);

    function togglePanel(isVisible) {
        if (isVisible) {
            Object.assign(header.style, {
                borderRadius: '0',
                height: '100%',
                width: '100%',
                fontSize: '14px',
                lineHeight: '25px',
            });
            Object.assign(body.style, {
                padding: '5px',
                height: '300px',
                width: '300px',
                overflow: 'auto',
            }, style.body);
            Object.assign(panel.style, {
                borderRadius: '0',
            });
            setTimeout(() => {
                header.textContent = title
            }, 500);
        } else {
            Object.assign(header.style, {
                borderRadius: '50%',
                height: '40px',
                width: '40px',
                fontSize: '40px',
                lineHeight: '40px',
            });
            header.textContent = gearIcon;
            Object.assign(body.style, {
                padding: '0px',
                height: '0px',
                width: '0px',
                overflow: 'hidden',
            });
            Object.assign(panel.style, {
                borderRadius: '50%',
            });
        }
    }

    header.addEventListener('click', function(event) {
        if (panel.dragged !== 0) return;
        togglePanel(header.textContent === gearIcon);
    });

    togglePanel(false);

    document.body.appendChild(panel);

    return panel;
}
