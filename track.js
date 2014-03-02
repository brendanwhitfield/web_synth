/*
 * Track.js
 *
 * Class file for an audio track. Each track has its own note grid (this.pattern), and oscillator nodes for each note.
 * This class handles its own UI, so generate your UI HMTL here. Only has one "public" function (beat()) which updates the sound/UI.
 *
 */


var Track = function()
{
	var _this = this; //needed because "this" in event handlers refers to the DOM element

	//sound stuff
	this.running = true;
	this.pattern; // = [][]
	this.oscillator_nodes = [];
	this.gain_node;
	this.compressor_node;

	//display stuff
	this.root;
	this.patternButtons = [];
	this.keySelect;
	this.octaveSelect;
	this.scaleSelect;
	this.toneSelect;

	//colors
	/*
	this.on;
	this.off;
	this.hoverOn;
	this.hoverOff;
	this.playOn;
	this.playOff;
	*/


	/*
	 * Public functions
	 */

	//plays the specified beat in the measure
	this.beat = function()
	{
		if(this.running)
		{

		}
		else
		{

		}
	};


	/*
	 * Event Handlers for UI elements
	 */


	//enables/disables playback of this track
	this.setEnabled = function(value) {
		if(value === true)
		{
			this.running = true;
		}
		else
		{
			this.running = false;
		}
	};

	this.matrixButtonClicked = function(e) {
		var element = e.target;
		var x = element.getAttribute("x");
		var y = element.getAttribute("y");

		_this.pattern[y][x] = !_this.pattern[y][x];

		if(_this.pattern[y][x])
		{
			element.className = "on";
		}
		else
		{
			element.className = "off";
		}

	};

	this.updateFrequencies = function(e) {
		//get new information from the select dropdowns
		var key = _this.keySelect.selectedIndex;
		var octave = octaves[_this.octaveSelect.selectedIndex].octave;
		var scale = _this.scaleSelect.selectedIndex;

		//update the oscillators with their new frequencies
		for(var y = 0; y < notes; y++)
		{
			                      //bottom = note 0
			_this.oscillator_nodes[(notes - 1) - y].frequency.value = getFrequency(y, key, octave, scale);
		}
	};

	this.updateTone = function(e) {

	};

	this.updateVolume = function(e) {

	};

	this.destruct = function(e) {
		//delete display objects
		document.querySelector("#tracks").removeChild(_this.root);
		//delete/disconnect audio objects

		//delete from tracks list
		deleteTrack();
	};



	//constructor----------------------------------------------------
		//build the sound nodes
		this.gain_node = audioCtx.createGain();

		for(var y = 0; y < notes; y++)
		{
			this.oscillator_nodes[y] = audioCtx.createOscillator();
			this.oscillator_nodes[y].connect(this.gain_node);
		}

		this.gain_node.connect(destination_node);

		//turn on a pleasent chord
		/*
		this.oscillator_nodes[0].start(0);
		this.oscillator_nodes[3].start(0);
		this.oscillator_nodes[5].start(0);
		this.oscillator_nodes[7].start(0);
		this.oscillator_nodes[10].start(0);
		*/
		

		//build the html
		this.root = document.createElement("section");

		//make lefthand option pane
		var options = document.createElement("div");
		this.root.appendChild(options);
		options.className = "options";
		options.innerHMTL = "Key - OCtave - Scale";

		this.keySelect = makeSelect(keys, 0);
		this.keySelect.addEventListener("change", this.updateFrequencies);
		options.appendChild(this.keySelect);

		this.octaveSelect = makeSelect(octaves, 2);
		this.octaveSelect.addEventListener("change", this.updateFrequencies);
		options.appendChild(this.octaveSelect);

		this.scaleSelect = makeSelect(scales, 1);
		this.scaleSelect.addEventListener("change", this.updateFrequencies);
		options.appendChild(this.scaleSelect);

		this.toneSelect = makeSelect(tones, 0);
		this.toneSelect.addEventListener("change", this.updateTone);
		options.appendChild(this.toneSelect);


		//make the sequencer matrix
		var table = document.createElement("table");
		this.root.appendChild(table);

		this.pattern = new Array();

		for(var y = 0; y < notes; y++)
		{
			var tr = document.createElement("tr");
			table.appendChild(tr);

			this.pattern[y] = new Array();

			for(var x = 0; x < beatsPerMeasure; x++)
			{
				var td = document.createElement("td");
				tr.appendChild(td);

				this.pattern[y][x] = false;

				var button = document.createElement("div");
				button.className = "off";
				button.setAttribute("x", x);
				button.setAttribute("y", y);
				button.addEventListener("click", this.matrixButtonClicked);
				td.appendChild(button);
			}
		}

		document.querySelector("#tracks").appendChild(this.root);

		this.updateFrequencies();

	//end constructor------------------------------------------------

	//return only public functions
	return {
		beat: this.beat
	};
};