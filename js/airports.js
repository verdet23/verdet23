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

    let template = $('#template').innerHTML;
    Mustache.parse(template);

    let table = $('result')

    let ICAO,
        airports;

    function showData(code) {
        for (let airport in airports) {
            if (code === airport.icao) {
                table.html("");
                for (let data in airport.list) {
                    let rendered = Mustache.render(template, data);
                    table.append(rendered);
                }
                break;
            }
        }
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