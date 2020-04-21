/**
 * Build styles
 */
require('./index.css').toString();

const md5 = require('js-md5');
const Zdog = require("zdog");
const CodeMirror = require('codemirror/lib/codemirror.js');

require("codemirror/lib/codemirror.css").toString();
require("codemirror/mode/javascript/javascript").toString();

/**
 * Basic3d Tool for the Editor.js 2.0
 */
class Basic3d {

    static get toolbox() {
        return {
            title: '3D',
            icon: require('./../assets/icon.svg').default,
        };
    }

    constructor({ data, api, config }) {

        this.data = data;
        this.api = api;

        this.config = config || {};
        this.config.workerURL = this.config.workerURL || 'gif.worker.js';
        this.config.output = this.config.output || null;

        this.index = this.api.blocks.getCurrentBlockIndex() + 1;

        this.wrapper = {
            block: document.createElement('div'),
            renderSettings: document.createElement('div')
        };
        this.settings = [{
            name: '生成GIF',
            icon: require('./../assets/create.svg').default,
            event: (e) => {
                e.preventDefault();
                if (this.codeDiv) {

                    this.codeDiv.classList.toggle(this.CSS.hidden);
                    this.codeDiv.classList.toggle(this.CSS.codeDivMax);

                    this.codeResult.classList.toggle(this.CSS.codeResultMin);

                    this.codeDiv.addEventListener('keydown', (event) => {
                        const [ENTER, BACKSPACE] = [13, 8]; // key codes

                        switch (event.keyCode) {
                            case ENTER:
                                // this.api.blocks.insertNewBlock();
                                console.log("---enter");
                                event.preventDefault();
                                event.stopPropagation();
                                break;
                            case BACKSPACE:
                                // this.backspace(event);
                                break;
                        }
                    }, false);

                    // const editor = CodeMirror(this.codeDiv, {
                    //     lineNumbers: true,
                    //     mode: "javascript",
                    //     dragDrop: false,
                    //     cursorScrollMargin: 2,
                    //     indentUnit: 4,
                    //     inputStyle: "contenteditable",
                    //     value: this.data.code || Array.from(this.defaultCode.split(), s => s.trim()).join(",")
                    // });

                    // editor.on("change", () => {
                    //     let codeCurrent = editor.getDoc().getValue();
                    //     let cid = this._getCodeId(codeCurrent);
                    //     if (cid != this.data.id) {
                    //         console.log("--new---", codeCurrent);
                    //         // this.data.id = cid;
                    //         // this.data.code = codeCurrent;
                    //         this._updatePlay(codeCurrent);
                    //     };
                    // });
                    // this.wrapper.block.addEventListener("keydown", (event) => {
                    //     if (event.keyCode == 13) {
                    //         console.log("enter")
                    //         event.preventDefault();
                    //         event.stopPropagation();
                    //     };
                    // }, false);

                }
            }
        }];

        /**
         * Styles
         */
        this.CSS = {
            baseClass: this.api.styles.block,
            loading: this.api.styles.loader,
            input: this.api.styles.input,
            button: this.api.styles.button,
            settingsButton: this.api.styles.settingsButton,
            settingsButtonActive: this.api.styles.settingsButtonActive,

            /**
             * Tool's classes
             */
            wrapperBlock: 'basic-3d',
            codeDiv: "basic-3d-code",
            codeDivMax: "basic-3d-code-max",
            codeResult: "basic-3d-play",
            codeResultMin: "basic-3d-play-min",
            hidden: "basic-3d-hidden"
        };


        this.init = 0;
        // this.canvasId = "b3d_" + (new Date()).getTime();
        this.defaultCode = `new Zdog.Ellipse({
            addTo: this.illo,
            diameter: 80,
            translate: { z: -40 },
            stroke: 20,
            color: '#636',
        });

        // triangle
        new Zdog.Shape({
            addTo: this.illo,
            path: [
                { x: 0, y: -32 },
                { x: 32, y: 32 },
                { x: -32, y: 32 },
            ],
            translate: { z: 40 },
            color: '#E62',
            stroke: 12,
            fill: true,
        });`;
        // console.log('init', this)
    }

    render() {
        // console.log("render")
        if (this.data && this.data.code) {
            if (!this.data.id) {
                this.data.id = this._getCodeId(this.data.code);
            };
        };

        // console.log(this.data)
        this.wrapper.block = document.createElement('div');
        this.wrapper.block.classList.add(this.CSS.wrapperBlock);
        this.wrapper.block.classList.add(this.CSS.loading);

        this.codeDiv = document.createElement("div");
        this.codeDiv.setAttribute("contentEditable", true);
        this.codeDiv.classList.add(this.CSS.codeDiv);
        this.codeDiv.classList.add(this.CSS.hidden);

        this.codeResult = document.createElement("canvas");
        this.codeResult.classList.add(this.CSS.codeResult);
        this.codeResult.height = 300;

        this.wrapper.block.appendChild(this.codeDiv);
        this.wrapper.block.appendChild(this.codeResult);

        if (this.init == 0) {
            this._codeResultInit(this.codeResult);
            this.init = 1;
        };

        this.wrapper.block.classList.toggle(this.CSS.loading);

        return this.wrapper.block;
    }

    rendered() {
        if (this.data && this.data.code && this.illo && this.init == 1) {
            eval(this.data.code);
        } else if (this.illo && this.init == 1) {
            // circle
            new Zdog.Ellipse({
                addTo: this.illo,
                diameter: 80,
                translate: { z: -40 },
                stroke: 20,
                color: '#636',
            });

            // triangle
            new Zdog.Shape({
                addTo: this.illo,
                path: [
                    { x: 0, y: -32 },
                    { x: 32, y: 32 },
                    { x: -32, y: 32 },
                ],
                translate: { z: 40 },
                color: '#E62',
                stroke: 12,
                fill: true,
            });

        }
        this.init = 2;
    };

    renderSettings() {
        console.log(this)
        this.wrapper.renderSettings = document.createElement('div');

        this.settings.forEach(tune => {
            let button = document.createElement('div');
            button.classList.add(this.api.styles.settingsButton);
            // button.classList.add(this.api.styles.disabledBtn);
            button.innerHTML = tune.icon;
            this.wrapper.renderSettings.appendChild(button);
            button.addEventListener('click', (e) => {
                tune.event(e);
            });
        });

        return this.wrapper.renderSettings;
    }

    /**
     * Automatic sanitize config
     */
    // static get sanitize(){
    //   return {
    //     url: false, // disallow HTML
    //     caption: {} // only tags from Inline Toolbar 
    //   }
    // }

    save(blockContent) {

        let data = {};
        // let imgs = blockContent.querySelectorAll("." + this.CSS.imagesContainer + " img");

        return this.data
    }

    validate(savedData) {
        if (!savedData.success) {
            return false;
        }

        return true;
    }

    _getCodeId(code) {
        code = code.replace(/\s/ig, "");
        let id = md5(code);
        // console.log(id)
        return id;
    }

    _codeResultInit(el) {
        let isSpinning = true;
        let illo = new Zdog.Illustration({
            element: el,
            dragRotate: true,
            onPrerender: function(ctx) {
                // render axis lines
                ctx.fillStyle = '#EA0';
                // with centered enabled, 0,0 is center of canvas
                ctx.fillRect(-1, -120, 2, 240);
                ctx.fillRect(-120, -1, 240, 2);
            },
            onDragStart: function() {
                isSpinning = false;
            },
        });

        function animate() {
            if (isSpinning) {
                illo.rotate.y += 0.03;
            };
            illo.updateRenderGraph();
            requestAnimationFrame(animate);
        }

        animate();

        this.illo = illo;
    }

    _updatePlay(currentCode) {

        // for (let index = 0; index < this.illo.children.length; index++) {
        //     let c = this.illo.children[index];
        //     c.remove();
        //     this.illo.removeChild(c);
        //     this.illo.update();
        // };
        this.illo.children = [];
        this.illo.update();
        console.log(this.illo.children.length);
        try {
            // console.log(this.illo)
            eval(currentCode);
        } catch (error) {
            console.log(error);
            eval(this.data.code);
            this.illo.update();
        } finally {
            // eval(currentCode);
            this.illo.update();
            this.data.code = currentCode;
            this.data.id = this._getCodeId(currentCode);
            this.data.success = true;
        }

    }




}

module.exports = Basic3d;