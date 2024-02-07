//main.js
// routing for MMDB

function getSplash() {
    $(".hideAll").hide();
    // call movie XHR
    let getSplash = $.ajax({
        url: "./services/splash.php",
        type: "POST",
        dataType: "json"
    });

    getSplash.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getSplash)" +
            textStatus);
    });

    getSplash.done(function (data) { 
        // console.log(data);
        let content = `<div class="large-12 cell gray-1">
        SPLASH PAGE
        </div>`;
        
        $.each(data.seasons, function (i, item) { 
            let season_number = item.number;
            let season_name = item.name;
           
            content += `<div class="large-12 cell blue">
            SEASON ${season_number}: ${season_name}</div>`;

            $.each(item.episodes, function (j, itemj) { 
                let movie_id = itemj.movie_id;
                let episode_name = itemj.name;
                let season = itemj.season;
                let episode = itemj.episode;
                let cover_id = itemj.cover_id;
                let cover_name = itemj.cover_name;
                content += `<div class="large-3 cell red movie" data-id="${movie_id}">
                <img src="./images/${cover_id}/${cover_name}" alt="${episode_name}">
                <p>${episode_name}</p>
                </div>`;
            });

            //${name}
        } );
        $(".ajax-splash").html(content);
    });

    // Populate splash div
    $(".splash-page").show();
}

function getMovie(id) {
    $(".hideAll").hide();

    let getMovie = $.ajax({
        url: "./services/movie.php",
        data: {movie_id:id},
        type: "POST",
        dataType: "json"
    });

    getMovie.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getMovie)" +
            textStatus);
    });

    getMovie.done(function (data) { 
        // console.log(data);
        // let content = ``;
        // $.each(data, function (i, item) { 
        //     let movie_id = item.movie_id;
        //     let name = item.movie_name;
        //     content += `<div class="large-3 small-6 cell gray-2 movie" data-id="${movie_id}">
        //     ${name}
        //     </div>`;
        // } );
        let movie_name = data.movie_name;
        let movie_rating = data.movie_rating;
        let category = data.category;

        $(".movie-name").html(movie_name);
        $(".rating").html(movie_rating);
        $(".category").html(category);
    });
    
    $(".movie-name").html(id);
    
    $(".movie-page").show();
}

function getPerson() {
    $(".hideAll").hide();
    // call people XHR
    // Populate people div
    
    $(".person-page").show();

}

$(window).on("load", function () {
    
    // SAMMY ROUTING
    // Controller in MVC

    $(document).on('click', 'body .splash', function () {
        location.href = "#/splash/";
    });


    $(document).on('click', 'body .person', function () {
        let person_id = $(this).attr("data-id");
        $(".person-name").html(person_id);
        location.href = "#/people/";
    });

    $(document).on('click', 'body .movie', function () {
        let movie_id = $(this).attr("data-id");
        location.href = `#/movie/${movie_id}`;
    });


    var app = $.sammy(function () {

        this.get('#/splash/', function () {
            getSplash();
        });

        this.get('#/movie/:id', function () {
            let id = this.params["id"];
            getMovie(id);
        });

        this.get('#/people/', function () {
            getPerson();
        });

    });

	// default when page first loads
    $(function () {
        app.run('#/splash/');
    });
});





