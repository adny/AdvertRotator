(function () {
    AdvertRotator.Networks.bing = WinJS.Class.mix(WinJS.Class.define(
        function bing(parentElement, id, size, args) {
            this._parentElement = parentElement;
            this._id = id;
            this._size = size;
            this._args = args;
            this._ele = document.createElement("div");
            this._ele.className = "bingAdvert";
            this._ele.style.width = "100%";
            this._ele.style.height = "100%";
            this._parentElement.appendChild(this._ele);
            this.control = new MicrosoftNSJS.Advertising.AdControl(this._ele,
                {
                    applicationId: this._id,
                    adUnitId: this._size
                });
            this.control.onErrorOccurred = this._errorOccured.bind(this);
            this.control.onAdRefreshed = this._adRefreshed.bind(this);
            this.control.isAutoRefreshEnabled = false;
        },
        {
            getAdvert: function () {
                this.control.refresh();
                this.control.isAutoRefreshEnabled = true;
            },
            resized: function () {

            },
            dispose: function () {
                this.control.onErrorOccurred = null;
                this.control.onAdRefreshed = null;
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