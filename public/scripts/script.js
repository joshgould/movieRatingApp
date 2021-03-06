$(document).ready(function(){  
	$avgRatings = $('#avgRatings');
	$allRatings = $('#allRatings');
	$movie = $('#movie');
	$stars = $('#stars');
	$comment = $('#comment');
	$button = $('#button');
	$uniques = null;
	
	function displayAll() {
		Parse.Cloud.run('getRatings', {}, {
			success: function(ratings) {
				$allRatings.empty()
				for (var i=0; i<ratings.length; ++i) {
				  $allRatings.append("<p>" + ratings[i].get("movie") + ": " + ratings[i].get("stars") + " stars</p>");
		        }			
			},
			error: function(error) {
				console.log("displayAll error " + error);
			}
		});
	}
	
	
	function getUniques() {
		Parse.Cloud.run('getUniques', {}, {
			success: function(uniques) {
				console.log("uniques-> " + uniques);
				$uniques=uniques;
			},
			error: function(error) {
					console.log("getUniques error " + error);
			}
		}).then(function() {
				$avgRatings.empty();
				for (var i=0; i<$uniques.length; ++i) {
					displayAvg($uniques[i]);
				}
		});
	}

	
	function displayAvg(moviename) {
		Parse.Cloud.run('averageStars', { movie: moviename }, {
			success: function(ratings) {
				$avgRatings.append("<p>" + moviename + " avg rating: "+ (Math.round(ratings * 10) / 10).toFixed(1) + " stars.</p>");			
			},
			error: function(error) {
				console.log("displayAvg error " + error);
			}
		});
	}
	
	
	
	function setReview() {
		var Review = Parse.Object.extend("Review");
		var review = new Review();
		
		review.save({
		  movie: $movie.val(),
		  stars: Number($stars.val()),
		  comment: $comment.val()
		}, {
		  		success: function(review) {
		    		console.log("setReview saved:" + review);
				},
		  		error: function(review, error) {
		 			console.log("setReview error not saved" + review + error);
				}
			});
		}
		
	
  	$button.click(function() {
    	setReview();
		getUniques();
		displayAll();
  	});
		


	// Initialize Parse with your Parse application javascript keys
	Parse.initialize("2vIm0wWoXnxZGlNnqJebItgZLLcXoZUM4jVeFXJ6",
                 "L8Cg8wYmhaKasGOc5QQ1HNx5uE8PR03mgCPb5Ihd");

	getUniques();
	displayAll();
	
});
