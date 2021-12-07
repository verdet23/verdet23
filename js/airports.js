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

    let ICAO,
        airports;

    var addMarkers = function (markersData) {

        $.each(
            markersData,
            (key, markerData) => {

                L.marker(
                    [
                        markerData.lat,
                        markerData.long
                    ],
                    {"title": markerData.icao}
                ).addTo(map).on(
                    "click",
                    onMarkerClick
                );

            }
        );

    }

    function onMarkerClick() {

        const code = this.options.title;

        console.log(code);

    }

    $.getJSON(
        "../data/icao.json",
        (data) => {

            ICAO = data;

            addMarkers(ICAO);

        }
    );

    $.getJSON(
        "../data/airports.json",
        (data) => {

            airports = data;

        }
    );

});