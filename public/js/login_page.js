

function populateAvatarSelector(){
	var selectElement = $("<select>").attr({
		"id": "avatar-picker",
		"class": "image-picker",
		"name" : "avatar"
	});
	// selectElement.append()

	$.get("/avatars", function(data){
		// console.log(data);
		for (var key in data){
			// console.log(key);
			selectElement.append($("<option>").attr({
				"data-img-src": getBaseURL() +"/avatars/"+ key,
				"value": key
			}));
		}

		selectElement.appendTo($("#avatar-picker-container"));
		$("select").imagepicker()
	});
	
	// selectElement.imagepicker({
	// 	hide_select : true,
	// 	show_label  : false
	// });

	// $("#avatar-picker").append(selectElement);
	
	// $("#avatar-picker").imagepicker()
	
	// console.log(window.location.hostname)
}


function bindLoginButton(){
	var postData = {
		// name = 
	}
	$("#enter-btn").click(function() {
		$.post('/api/login', function(data){
			console.log(data)
		})
	});
}

function bindLoginFormSubmit(){
	// console.log("thefuck");
	$('#create-form').on('submit', function(event){
		event.preventDefault();
		var form = $(this);
		$.ajax({
			type: form.attr('method'),
			url: form.attr('action'),
			data: form.serialize()
		}).done(function(data){
			// console.log(data);
			location.reload();
		}).fail(function(data){

		})
	})
}

$(document).ready(function(){
	populateAvatarSelector();
	// bindLoginButton();
	bindLoginFormSubmit();
});