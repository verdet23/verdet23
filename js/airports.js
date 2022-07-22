$( () => {

    "use strict";

    $( "#search" ).on( "keypress", function( event ) {
        const elem = $( this );
        elem.removeClass( "is-invalid" );
        let keycode = ( event.keyCode ? event.keyCode : event.which );
        if ( keycode === 13 ) {
            let code = elem.val().toUpperCase();
            let icaoRegEx = new RegExp( "^[A-Z0-9]{3,4}|[A-Z]{2}-[0-9]{2,4}$" );

            if ( icaoRegEx.test( code ) ) {
                if ( appData[ code ] ) {
                    map.flyTo( [ appData[ code ].lat, appData[ code ].long ], 10 );
                    showData( code );

                    return;
                }
            }

            table.html( "" );
            elem.addClass( "is-invalid" );
        }
    } );

    $( "#simulator" ).on( "change", function() {
        loadData( $( this ).val() );

        return true;
    } );

    const map = L.map(
        "map",
        {
            "center": [
                51.48,
                0
            ],
            "zoom": 6,
            "preferCanvas": true,
            "updateWhenZooming": false
        }
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            "attribution": "&copy; <a href=\"https://openstreetmap.org/copyright\">OpenStreetMap contributors</a>",
            "maxZoom": 15,
            "minZoom": 3
        }
    ).addTo( map );

    let layerGroup = L.layerGroup().addTo( map );

    let template = $( "#template" ).html(),
        table = $( "#result" ),
        appData
    ;
    Mustache.parse( template );

    let showData = function( code ) {
        if ( Object.prototype.hasOwnProperty.call( appData, code ) ) {
            table.html( "" );
            appData[ code ].sceneries.forEach( data => {
                let rendered = Mustache.render( template, data );
                table.append( rendered );
            } );
        }
    };

    let showAirports = function() {
        layerGroup.clearLayers();
        for ( let item in appData ) {
            let markerData = appData[ item ];
            L.circleMarker(
                [
                    markerData.lat,
                    markerData.long
                ],
                {
                    "title": markerData.icao
                }
            ).bindTooltip( markerData.icao, { direction: "top" } ).addTo( map ).on(
                "click",
                function() {
                    $( "#search" ).val( this.options.title );
                    showData( this.options.title );
                }
            ).addTo( layerGroup );
        }
    };

    let loadData = function( fileName ) {
        let path = "../data/" + fileName + ".json";
        $.getJSON(
            path,
            ( data ) => {
                appData = data;
                showAirports();
            }
        );
    };

    loadData( $( "#simulator" ).val() );
} );
