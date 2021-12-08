$(() => {

    "use strict";

    $("#search").on("keypress", function (event) {
        const elem = $(this);
        elem.removeClass("is-invalid");
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            let code = elem.val().toUpperCase();
            let icaoRegEx = new RegExp("^[A-Z0-9-]{3,}$");

            if (icaoRegEx.test(code)) {
                let icaoData;
                for (let i = 0; i < ICAO.length; i++) {
                    let check = ICAO[i];
                    if (check.icao === code) {
                        icaoData = check;
                        break;
                    }
                }

                if (icaoData) {
                    map.flyTo([icaoData.lat, icaoData.long], 10);
                    showData(icaoData.icao);

                    return;
                }

            }

            table.html("");
            elem.addClass("is-invalid");
        }
    });


    const map = L.map(
        "map",
        {
            "center": [
                59.734253447591364,
                -149.04052734375003
            ],
            "zoom": 6
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

    let template = $("#template").html(),
        table = $("#result"),
        ICAO,
        airports;
    Mustache.parse(template);

    function showData(code) {
        airports.some(airport => {
            if (code === airport.icao) {
                table.html("");
                airport.list.forEach(data => {
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

            ICAO.forEach(markerData => {

                    L.marker(
                        [
                            markerData.lat,
                            markerData.long
                        ],
                        {
                            "title": markerData.icao
                        }
                    ).addTo(map).on(
                        "click",
                        function () {
                            $("#search").val(this.options.title);
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
