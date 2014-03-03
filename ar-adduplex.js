(function () {
    AdvertRotator.Networks.adduplex = WinJS.Class.mix(WinJS.Class.define(
        function adduplex(parentElement, id, size, args) {
            this._parentElement = parentElement;
            this._id = id;
            this._size = size;
            this._args = args;
            this._ele = document.createElement("div");
            this._ele.className = "adduplexAdvert";
            this._ele.style.width = "100%";
            this._ele.style.height = "100%";
            this._parentElement.appendChild(this._ele);
            this.control = new AdDuplexJs.Controls.AdControl(this._ele, { appId: this._id, size: this._size });
            this.control.onAdLoadingError = this._errorOccured.bind(this);
            this.control.onAdLoaded = this._adRefreshed.bind(this);
        },
        {
            getAdvert: function () {
                //Adverts are loaded on start
            },
            resized: function() {

            },
            dispose: function () {
                this.control.onAdLoadingError = null;
                this.control.onAdLoaded = null;
                this.control.dispose();
                this._parentElement.removeChild(this._ele);
            },
            _adRefreshed: function () {
                this.dispatchEvent("advertRecieved");
            },
            _errorOccured: function () {
                this.dispatchEvent("noAdvert");
            }
        }
       ), WinJS.Utilities.eventMixin);

})()
