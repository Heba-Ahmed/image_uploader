/**!
 * Google Drive File Picker Example
 * By Daniel Lo Nigro (http://dan.cx/)
 */
(function() {
	/**
	 * Initialise a Google Driver file picker
	 */
	var FilePicker = window.FilePicker = function(options) {
		var mySelf = this;
		// Config
		this.apiKey = options.apiKey;
		this.clientId = options.clientId;
		
		// Elements
		this.buttonEl = options.buttonEl;
		
		// Events
		this.onSelect = options.onSelect;
		//this.buttonEl.addEventListener('click', this.open.bind(this));
		this.buttonEl.addEventListener('click', function() { mySelf.open(); });		
	
		// Disable the button until the API loads, as it won't work properly until then.
		this.buttonEl.disabled = true;

		// Load the drive API
		gapi.client.setApiKey(this.apiKey);

		//gapi.client.load('drive', 'v2', this._driveApiLoaded.bind(this));
		gapi.client.load('drive', 'v2', function(){ mySelf._driveApiLoaded() });
		//google.load('picker', '1', { callback: this._pickerApiLoaded.bind(this) });
		google.load('picker', '1', { callback: function() {mySelf._pickerApiLoaded(); }});
	}

	FilePicker.prototype = {
		/**
		 * Open the file picker.
		 */
		open: function() {		
			// Check if the user has already authenticated
			$('#drive_images_thmbnails').html("");
			drive_images_names = [];
		    drive_images_download_links = {};
		    drive_images_thumbnail_links = [];

			var token = gapi.auth.getToken();
			var mySelf = this;
			if (token) {
				this._showPicker();
			} else {
				// The user has not yet authenticated with Google
				// We need to do the authentication before displaying the Drive picker.
				//this._doAuth(false, function() { this._showPicker(); }.bind(this));
				this._doAuth(false, function() { mySelf._showPicker(); });
			}
		},
		
		/**
		 * Show the file picker once authentication has been done.
		 * @private
		 */
		_showPicker: function() {
			accessToken = gapi.auth.getToken().access_token;
			var view = new google.picker.DocsView(google.picker.ViewId.DOCS);
			var origin = window.location.protocol + '//' + window.location.host;
			var mySelf = this;

        	view.setMimeTypes("image/png,image/jpeg,image/jpg");
        	view.setIncludeFolders(true);
        	view.setOwnedByMe(true);
        	view.setMode(google.picker.DocsViewMode.LIST);

			this.picker = new google.picker.PickerBuilder().
				enableFeature(google.picker.Feature.MULTISELECT_ENABLED).
				addView(view).
				setAppId(this.clientId).
				setOAuthToken(accessToken).
				setOrigin(origin).
				//setCallback(this._pickerCallback.bind(this)).
				setCallback(function(data){mySelf._pickerCallback(data); }).
				build().
				setVisible(true);


			$('.picker.modal-dialog-bg').css('z-index', 1101);
            $('.picker.modal-dialog.picker-dialog').css('z-index', 1102);
		},
		
		/**
		 * Called when a file has been selected in the Google Drive file picker.
		 * @private
		 */
		_pickerCallback: function(data) {

			// to stop loading thumbnails of images in background after pressing select or cancel
			if ((data[google.picker.Response.ACTION] == google.picker.Action.PICKED) ||  (data[google.picker.Response.ACTION] == google.picker.Action.CANCEL) ){
				window.stop();
			}

			if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {

				var mySelf = this;

				for(var i =0; i<data[google.picker.Response.DOCUMENTS].length; i++) {
					var file = data[google.picker.Response.DOCUMENTS][i],
						id = file[google.picker.Document.ID],
						request = gapi.client.drive.files.get({
							fileId: id
						});
					//request.execute(this._fileGetCallback.bind(this));
					request.execute(function(file){ mySelf._fileGetCallback(file);});
				}
				
				pickerDone(data[google.picker.Response.DOCUMENTS].length);
			}
		},
		/**
		 * Called when file details have been retrieved from Google Drive.
		 * @private
		 */
		_fileGetCallback: function(file) {
			if (this.onSelect) {
				this.onSelect(file);
			}
		},
		
		/**
		 * Called when the Google Drive file picker API has finished loading.
		 * @private
		 */
		_pickerApiLoaded: function() {
			this.buttonEl.disabled = false;
		},
		
		/**
		 * Called when the Google Drive API has finished loading.
		 * @private
		 */
		_driveApiLoaded: function() {
			this._doAuth(true);
		},
		
		/**
		 * Authenticate with Google Drive via the Google JavaScript API.
		 * @private
		 */
		_doAuth: function(immediate, callback) {	
			gapi.auth.authorize({
				client_id: this.clientId + '.apps.googleusercontent.com',
				scope: 'https://www.googleapis.com/auth/drive.readonly',
				immediate: immediate
			}, callback);
		}
	};
}());