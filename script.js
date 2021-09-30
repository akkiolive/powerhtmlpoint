const powerhtmlpoint = {
    ///////////////////////////////////////////////////////////////////////////
    // vars
    ///////////////////////////////////////////////////////////////////////////
    vars: {
        mouseX: undefined,
        mouseY: undefined,
        stage: undefined,
        controller: undefined,
        controllers: [],
    },

    ///////////////////////////////////////////////////////////////////////////
    // getter
    ///////////////////////////////////////////////////////////////////////////
    get mouseX() { return powerhtmlpoint.vars.mouseX; },
    get mouseY() { return powerhtmlpoint.vars.mouseY; },
    get stage() { return document.querySelector(".stage"); },
    get selectedItems() { return document.querySelectorAll(".selected"); },
    get selectedBorderWidth() { },
    get selectorRectsNum() { },
    get selectorRects() { },
    get controller() { return powerhtmlpoint.vars.controller; },
    get codeElem() { return document.querySelector(".code"); },

    ///////////////////////////////////////////////////////////////////////////
    // utils
    ///////////////////////////////////////////////////////////////////////////
    utils: {
        getItemPos: (item) => {
            let stage = document.querySelector(".stage");
            let stageRect = stage.getBoundingClientRect();
            let itemRect = item.getBoundingClientRect();
            // console.log(stageRect)
            // console.log(itemRect)
            let ret = {};
            for (let key of ["left", "right"]) {
                ret[key] = itemRect[key] - stageRect.left - stage.clientLeft;
            }
            for (let key of ["top", "bottom"]) {
                ret[key] = itemRect[key] - stageRect.top - stage.clientTop;
            }
            for (let key of ["width", "height"]) {
                ret[key] = itemRect[key];
            }
            return ret
        },
        getCursorPosOnStage: () => {
            let stage = document.querySelector(".stage");

        },
        updateCode: () => {
            powerhtmlpoint.codeElem.innerText = powerhtmlpoint.stage.outerHTML;
        },
    },

    ///////////////////////////////////////////////////////////////////////////
    // new
    ///////////////////////////////////////////////////////////////////////////
    new: {
        get controller() {
            document.body.style.positoin = "relative";
            let c = document.createElement("div");
            c.setAttribute("draggable", "true");
            c.classList.add("strong")
            c.style.zIndex = 10000;
            c.style.left = "100px";
            c.style.top = "100px";
            c.style.position = "absolute";
            c.style.cursor = "grab";
            c.innerText = "+";
            c.isDragging = false;
            document.body.appendChild(c);
            powerhtmlpoint.vars.controller = c;
            powerhtmlpoint.vars.controllers.push(c);
            c.addEventListener("mousedown", e => {
                console.log("controller mousedown", e)
                e.preventDefault();
                c.isDragging = true
                c.dragStartTopLeft = {
                    top: c.getBoundingClientRect().top,
                    left: c.getBoundingClientRect().left
                };
                c.dragStartPos = {
                    x: e.clientX,
                    y: e.clientY
                };
                for (let item of powerhtmlpoint.selectedItems) {
                    let itemRect = item.getBoundingClientRect();
                    item.dragBeforePos = {
                        left: itemRect.left,
                        top: itemRect.top,
                    }
                }
            });
            c.addEventListener("mouseup", e => {
                console.log("mouseup", e)
                e.preventDefault();
                c.isDragging = false;
            });
            c.updatePos = () => {
                if (!c.isDragging) return;
                c.style.left = c.dragStartTopLeft.left + (powerhtmlpoint.mouseX - c.dragStartPos.x) + "px";
                c.style.top = c.dragStartTopLeft.top + (powerhtmlpoint.mouseY - c.dragStartPos.y) + "px";
                let deltaX = powerhtmlpoint.mouseX - c.dragStartPos.x;
                let deltaY = powerhtmlpoint.mouseY - c.dragStartPos.y;
                for (let item of powerhtmlpoint.selectedItems) {
                    console.log("selectedItem", item);
                    let bodyRect = document.body.getBoundingClientRect();
                    let stage = powerhtmlpoint.stage;
                    let stageRect = stage.getBoundingClientRect();
                    let newX = (item.dragBeforePos.left + deltaX) - stage.clientLeft - stageRect.left;
                    let newY = (item.dragBeforePos.top + deltaY) - stage.clientTop - stageRect.top;
                    item.style.left = newX + "px";
                    item.style.top = newY + "px";
                }
            };

            window.addEventListener("mousemove", e => {
                if (!c) return;
                c.updatePos();
                powerhtmlpoint.utils.updateCode();
            });

            return c;
        }
    },

    ///////////////////////////////////////////////////////////////////////////
    // init
    ///////////////////////////////////////////////////////////////////////////
    init: () => {
        console.log(this)
        //document.body.addEventListener("load", e => console.log(e))
        window.addEventListener("mousemove", (e) => {
            powerhtmlpoint.vars.mouseX = e.clientX;
            powerhtmlpoint.vars.mouseY = e.clientY;
        });
        powerhtmlpoint.vars.stage = document.querySelector(".stage");
        (powerhtmlpoint.new.controller).hidden = "true";
        powerhtmlpoint.stage.addEventListener("mousedown", e => {
            //e.preventDefault();
            console.log("stage is mousedown");
            powerhtmlpoint.controller.setAttribute("hidden", "true");
        });
        powerhtmlpoint.utils.updateCode();
    },

    ///////////////////////////////////////////////////////////////////////////
    // main
    ///////////////////////////////////////////////////////////////////////////
    main: () => {
        powerhtmlpoint.init();

        for (let item of document.querySelectorAll(".item")) {
            item.setPosOnStage = (posX, posY) => {

            };


            item.addEventListener("click", function (e) {
                console.log("item click")
                e.stopPropagation();
                let controller = powerhtmlpoint.controller;
                controller.removeAttribute("hidden");
                console.log(e, item);
                if (!e.target.classList.contains("selected")) {
                    e.target.classList.add("selected");
                }
                let itemRect = item.getBoundingClientRect()
                let itemCenterX = itemRect.left + itemRect.width / 2.;
                let controllerRect = controller.getBoundingClientRect()
                let controllerX = itemCenterX - controllerRect.width / 2.;
                let controllerY = itemRect.bottom + 15;
                controller.style.left = controllerX + "px";
                controller.style.top = controllerY + "px";

            });
            item.addEventListener("mousemove", function (e) {
                console.log(e, item);
                //e.target.style.cursor = "pointer";

            });
            item.addEventListener("rightclick", function (e) {
                console.log(e, item);
            });

        }



    }
};

window.addEventListener("load", () => {
    powerhtmlpoint.main();
});