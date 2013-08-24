
	var data = [];

	$("#ctl00_uxContentPlaceHolder_uxMykiTxnHistory").each(function() {
		var thisRow = [];
		var data = $(this).find('td');
		if(data.length > 0){
			data.each(function(){
				thisRow.push($(this).text());
			})
			trArray.push(data);
		}
	});

	Console.log(data);
