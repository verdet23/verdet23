$(() => {

    "use strict";

    const map = L.map(
        "map",
        {
            "center": [
                57.75,
                -152.49
            ],
            "zoom": 13
        }
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            "attribution": "&copy; <a href=\"https://openstreetmap.org/copyright\">OpenStreetMap contributors</a>",
            "maxZoom": 15,
            "minZoom": 3
        }
    ).addTo(map);

    let template = $('#template').html();
    Mustache.parse(template);

    let table = $('#result');

    let ICAO,
        airports;

    function showData(code) {
        airports.some(airport => {
            if (code === airport.icao) {
                table.html("");
                airport.list.forEach( data => {
                    console.log(data);
                    let rendered = Mustache.render(template, data);
                    table.append(rendered);
                });
                return true;
            }
        });
    }

    $.getJSON(
        "../data/icao.json",
        (data) => {
            ICAO = data;

            $.each(
                ICAO,
                (key, markerData) => {

                    L.marker(
                        [
                            markerData.lat,
                            markerData.long
                        ],
                        {"title": markerData.icao}
                    ).addTo(map).on(
                        "click",
                        function () {
                            showData(this.options.title);
                        }
                    );

                }
            );
        }
    );

    $.getJSON(
        "../data/airports.json",
        (data) => {

            airports = data;

        }
    );

});