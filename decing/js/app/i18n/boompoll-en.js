boompoll.regional = {
	region: 'en',
	get: function(tag) {
		return this[this.region][tag];
	},
	'en': {
		httpCodes: {
			200: "OK!",
			400: "Input parameter contains invalid data. See response for additional information",
			401: "Key for this poll expected",
			403: "The poll with specified key not found",
			405: "Unknown method specified",
			409: "Data was not specified",
			410: "The poll is already closed for voting",
			500: "An internal error occured",
			"default": "An unknown HTTP error occured."
		},		
		createValidation: {
			"subject.empty": [1, "Subject cannot be empty"],
			"subject.size": [1, "Subject cannot have more than 500 characters"],
			"participants.amount": [3, "Number of participants should be at least 2 and not more then 50"],
			"participants.weight.nonpositive": [3, "Only positive weights are allowed"],
			"participants.name.size": [3, "Name of a participant should have between 1 and 50 characters"],
			"participants.name.duplicates": [3, "There are duplicating participant names"],
			"gemsCount.value": [4, "'Gems Count' value should be between 1 and 9999"],
			"options.areVoters": [2, "Options should not be specified if 'Options are voters' is set"],
			"options.amount": [2, "Number of options should be at least 2 and not more then 50"],
			"options.duplicate": [2, "There are duplicating option names"],
			"options.size": [2, "Option should have between 1 and 50 characters"]
		},
		voteValidation: {
			'voted': 'You already voted in this poll',
			'options': 'You provided not expected amount of options for this poll',
			'sum': 'Sum of your votes should be equal gemsCount for this poll',
			'none':	'Please select an option',
			'negative': 'Selections cannot be negative',
			'himself': 'It is not possible for a participant to vote for himself'
		}
	}
};