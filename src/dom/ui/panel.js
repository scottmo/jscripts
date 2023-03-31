$.panel = function(title, content, { isDraggable = true, x = 20, y = 20, isDisplayed = true } = {}) {
    const cmp = $.component({
        host: "body",
        css: {
            ".panel":{
                "z-index": "998",
                "position": "absolute",
                "top": x + "px",
                "left": y + "px",
                "box-shadow": "rgba(0, 0, 0, 0.2) 0px 4px 8px 0px",
                "background-color": "white"
            },
            ".header": {
                "z-index": "999",
                "background-color": "rgb(33, 150, 243)",
                "color": "rgb(255, 255, 255)",
                "font-weight": "bold",
                "font-size": "1.2rem",
                "padding-top": "5px",
                "padding-right": "5px",
                "padding-bottom": "5px",
                "padding-left": "5px",
                "text-align": "center",
                "cursor": "pointer",
                "box-shadow": "rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 3px 1px -2px, rgba(0, 0, 0, 0.2) 0px 1px 5px 0px"
            },
            ".body": {
                "padding": "5px",
            }
        },
        html: `
            <div class="panel">
                <div id="header" class="header">${title}</div>
                <div id="body" class="body"></div>
            </div>
        `,
        api: {
            isDisplayed: false,
            toggle(shouldDisplay) {
                if (shouldDisplay != null) {
                    this.isDisplayed = shouldDisplay;
                } else {
                    this.isDisplayed = !this.isDisplayed;
                }
                $.css(this.$.body, { "display": this.isDisplayed ? 'block' : 'none' });
            },
        },
        created() {
            const { header, body } = this.$;
            body.appendChild(content);
            header.addEventListener("click", () => {
                if (this.dragged !== 0) return;
                this.toggle();
            });
            this.toggle(isDisplayed);
        }
    });
    if (isDraggable) {
        $.draggable(cmp);
    }

    return cmp;
};
