(function () {
    "use strict"
    WinJS.Binding.optimizeBindingReferences = true;

    function bindFunctionsTo(context, functions) {
        functions.forEach(function (key) {
            var fn = context[key];
            if (typeof fn === "function") {
                context[key] = fn.bind(context);
            } else {
                throw new Error(key + " is not of type function");
            }
        });
    }

    var Networks = {};

    var AdControl = WinJS.Class.define(
        function AdControl(el, options) {
            bindFunctionsTo(this, ["_onAdvert", "_onNoAdvert", "_getNextAdvert", "_onResize"]);
            this.el = el;
            this.el.winControl = this;
            this._nextNetworkIndex = 0;
            WinJS.Utilities.addClass(el, "win-disposable");
            WinJS.UI.setOptions(this, options);
            // Do some quick check to see if pub data is ok
            if (this.networks || this.networks.length > 0) {
                this.networks.forEach(function (network) {
                    if (!AdvertRotator.Networks[network.type]) {
                        throw "Invalid Publisher";
                    } else {
                        if (!network.id) {
                            throw "Missing Publisher id";
                        }
                        if (!network.size) {
                            throw "Missing Publisher size";
                        }
                    }
                });
            } else {
                throw "No publishers specified";
            }
            this._currentSize = 0;
            this.sizes.forEach(function (size,idx) {
                if (window.innerWidth > size.min && window.innerWidth <= size.max) {
                    this._currentSize = idx;
                }
            }, this)
            window.addEventListener("resize", this._onResize);
            this._immediate = setImmediate(this._getNextAdvert.bind(this));
        },
        {
            _getNextAdvert: function () {          
                if (this._nextNetworkIndex < this.networks.length) {
                    var nextNetwork = this.networks[this._nextNetworkIndex]
                    this._currentNetwork = new AdvertRotator.Networks[nextNetwork.type](this.el, nextNetwork.id, nextNetwork.size[this._currentSize], nextNetwork.args);
                    this._currentNetwork.addEventListener("noAdvert", this._onNoAdvert);
                    this._currentNetwork.addEventListener("advertRecieved", this._onAdvert);
                    this._nextNetworkIndex++;
                    this._currentNetwork.getAdvert();
                } else {
                    if (this.placeholder) {
                        this.placeholder.style.display = "";
                    }
                }
            },
            _onAdvert: function() {
                if (this.placeholder) {
                    this.placeholder.style.display = "none";
                }
            },
            _onNoAdvert: function () {
                this._currentNetwork.removeEventListener("noAdvert", this._onNoAdvert);
                this._currentNetwork.dispose();
                this._getNextAdvert();
            },
            _onResize: function () {
                this.sizes.forEach(function (size, idx) {
                    if (window.innerWidth > size.min && window.innerWidth <= size.max && this._currentSize !== idx) {
                        this._currentSize = idx;
                        this._currentNetwork.dispose();
                        this._nextNetworkIndex = 0;
                        this._getNextAdvert();
                    }
                }, this)
                this._currentNetwork.resized();
            },
            dispose: function () {
                if (this._immediate) {
                    clearImmediate(this._immediate);
                }
                if (this._currentNetwork) {
                    this._currentNetwork.removeEventListener("noAdvert", this._onNoAdvert);
                    this._currentNetwork.removeEventListener("advertRecieved", this._onAdvert);
                    this._currentNetwork.dispose();
                }
                
                window.removeEventListener("resize", this._onResize);
                this.el.parentNode.removeChild(this.el);
            }
        }
    );
    WinJS.Namespace.define("AdvertRotator", {
        Networks: Networks
    });

    WinJS.Namespace.define("AdvertRotator.Controls", {
        AdControl: AdControl
    });

})();