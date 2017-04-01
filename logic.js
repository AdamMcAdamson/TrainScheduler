var config = {
	apiKey: "AIzaSyAZN-LvJ82z3FLsr3_SOltXhZvpxBLUZV0",
	authDomain: "train-scheduler-6b20d.firebaseapp.com",
	databaseURL: "https://train-scheduler-6b20d.firebaseio.com",
	projectId: "train-scheduler-6b20d",
	storageBucket: "train-scheduler-6b20d.appspot.com",
	messagingSenderId: "365420297869"
};

firebase.initializeApp(config);

var trainRef = firebase.database().ref("/trains");

$("#submit-button").on("click", function(event){

	var name = $("#name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var firstTime = $("#first-time-input").val().trim();
	var frequency = $("#frequency-input").val().trim();

	trainRef.push({
		name: name,
		destination: destination,
		time: firstTime,
		frequency: frequency 
	});

});

trainRef.on("child_added", function(snapshot){

	var val = snapshot.val();

	var tr = $("<tr>");

	var nameTd = $("<td>");
	var destTd = $("<td>");
	var freqTd = $("<td>");
	var nextTd = $("<td>");
	var awayTd = $("<td>");

	nameTd.text(val.name);
	destTd.text(val.destination);
	freqTd.text(val.frequency);

	var out = timeStuff(val.time, val.frequency);

	nextTd.text(out[0]);
	awayTd.text(out[1]);

	tr.append(nameTd);
	tr.append(destTd);
	tr.append(freqTd);
	tr.append(nextTd);
	tr.append(awayTd);
	$("#train-table").append(tr);
});

function timeStuff(timeIn, freq){

	var time = timeIn;
	var frequency = freq;

	var now = moment()
	var startTime = moment(time, "HH:mm");

	var frequencyTime = moment.duration(frequency, "minutes");
	var difference = now.diff(startTime, "minutes");
	var next = startTime.add(Math.ceil(difference / frequency) * frequency, "minutes");
	
	var timeUntil = frequency - difference%frequency;
	if(timeUntil === frequency){
		timeUntil = 0;
	}

	var out1 = next.minutes();
	if(next.minutes() === 0){
		out1 += "0";
	}

	if(next.hours()/12 > 1){
		out1 = next.hours()%12 + ":" + out1 + " pm";
	} else if (next.hours() === 0){
		out1 = "00:" + out1 + " am"; 
	} else {
		out1 = next.hours() + ":" + out1 + " am";
	}

	return [out1, timeUntil];
}