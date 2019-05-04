

function findMarkerFromRow(){
	//Creo un array che conterrà le coordinate dei punti selezionati in tabella
 	var arrayOfLatLngs = [];
 	var g = 0;
 	var latlng;
 	var bounds;
 	//COME PRIMA COSA CHIUDO TUTTI I POPUP
 	patientsTable.rows().every( function () {
 		 var nmarkers = markers.length;
 		for(var k = 0; k < nmarkers; k++){
 			if(this.data().Lat== markers[k].getLatLng().lat && this.data().Lng==markers[k].getLatLng().lng){
 				markers[k].closePopup();	
			}
		}
	});
   
    //CONTO LE RIGHE SELEZIONATE
    patientsTable.rows( '.selected' ).every( function () {
    	g++;
    });
    if(g > 0){
    	//ORA SCORRO LE RIGHE SELEZIONATE
    	patientsTable.rows( '.selected' ).every( function () {
    		latlng = L.latLng(this.data().Lat, this.data().Lng);
		    arrayOfLatLngs[arrayOfLatLngs.length] = latlng;
		    var nmarkers = markers.length;
		    for(var k = 0; k < nmarkers; k++ ){
		    	if(this.data().Lat == markers[k].getLatLng().lat && this.data().Lng == markers[k].getLatLng().lng){
		    		markers[k].openPopup();
				}
			}
		});
		bounds = new L.LatLngBounds(arrayOfLatLngs);
		mymap.fitBounds(bounds,{padding: [100,100]});		
	}		
}


//QUESTA FUNZIONE SI ATTIVA OGNI VOLTA CHE CLICCO SUL CHECKBOX
function myFunction() {
	var checkBox = document.getElementById("myCheck");

	// QUESTA FUNZIONE SI ATTIVA IN QUESTO CASO QUANDO CLICCO SUL CHECKBOX. PRIMA HO FATTO IN MODO CHE SI ATTIVASSE AD OGNI SPOSTAMENTO DELLA MAPPA
	if(checkBox.checked){
		var CentroMappa = L.latLng(mymap.getCenter());   //ACQUISISCO LE COORDINATE DEL CENTRO DELLA MAPPA
		var z = mymap.getBounds();   //ACQUISISCO I DUE VERTICI CHE DETERMINANO I LIMITI DELLA MAPPA
   		var latitudineNE = z._northEast.lat;     //QUESTA E' LA LATITUDINE MASSIMA
   		var longitudineNE = z._northEast.lng;	 //QUESTA E' LA LONGITUDINE MASSIMA
   		var latitudineSW = z._southWest.lat;	 //QUESTA E' LA LATITUDINE MINIMA
   		var longitudineSW = z._southWest.lng;	 //QUESTA E' LA LONGITUDINE MINIMA
   		
		for (var i = 0; i < p.length; i++) {
			var presente = false;				
			if (p[i].Lat <= latitudineNE && p[i].Lat >= latitudineSW && p[i].Lng <= longitudineNE && p[i].Lng >= longitudineSW ){  //MI CHIEDO SE IL MARKER E' VISUALIZZATO
				//scorro le righe della tabella e se la riga non è presente allora la aggiungo
				patientsTable.rows().every( function () {
					if(this.data()!=undefined){  //senza questo comando non funziona perchè cerca di accedere a una riga che potrebbe essere stata cancellata
								if(this.data().Lat == p[i].Lat && this.data().Lng == p[i].Lng){
 		 								presente = true;
 		 						}	
					}
				});
				if(presente == false){
					patientsTable.row.add(p[i]).draw();	 
				}
				
			}
			else  //SE IL MARKER NON E' NELLA TABELLA ALLORA TOLGO LA RIGA
				{		    
					patientsTable.rows().every( function () {
						if(this.data() != undefined){ //senza questo comando non funziona perchè cerca di accedere a una riga che potrebbe essere stata cancellata
   							if(this.data().Lat == p[i].Lat && this.data().Lng == p[i].Lng)
   								patientsTable.row(this).remove().draw();
 		 				}
					});
 				}
		}
	}
	//SE NON E' CHECKED
	else{
		mymap.setView([44.6979999,10.6298284], 12);
	}
} 
 
 
function syncMarkerAddRow() {
					//Voglio aggiungere le righe che non ci sono
					var checkBox = document.getElementById("myCheck");
					if(checkBox.checked){	
						var CentroMappa = L.latLng(mymap.getCenter());   //ACQUISISCO LE COORDINATE DEL CENTRO DELLA MAPPA
						var z = mymap.getBounds();   //ACQUISISCO I DUE VERTICI CHE DETERMINANO I LIMITI DELLA MAPPA
						var latitudineNE = z._northEast.lat;     //QUESTA E' LA LATITUDINE MASSIMA
						var longitudineNE = z._northEast.lng;	 //QUESTA E' LA LONGITUDINE MASSIMA
						var latitudineSW = z._southWest.lat;	 //QUESTA E' LA LATITUDINE MINIMA
						var longitudineSW = z._southWest.lng;	 //QUESTA E' LA LONGITUDINE MINIMA
						for(var i = 0; i < p.length; i++ ){
							var presente = false;
							if (p[i].lat <= latitudineNE && p[i].lat >= latitudineSW && p[i].lng <= longitudineNE && p[i].lng >= longitudineSW){  //MI CHIEDO SE IL MARKER E' VISUALIZZATO
								//scorro le righe della tabella e se la riga non è presente allora la aggiungo
								patientsTable.rows().every( function () {
									if(this.data()!=undefined) //senza questo comando non funziona perchè cerca di accedere a una riga che potrebbe essere stata cancellata
									if(this.data().lat == p[i].Lat && this.data().lng == p[i].Lng)
 		 								presente = true;
								});
				
								if(presente == false){
									patientsTable.row.add(p[i]).draw();
				 				 
								}
							}
						}
				}
}



function syncMarkerRemoveRow(colour){
					//Scorro le righe della tabella
					var checkBox = document.getElementById("myCheck");
					if(checkBox.checked){	
                    patientsTable.rows().every( function () {
                   		//Tolgo le righe della tabella corrispondenti ai marker verdi
                    	if(this.data() != undefined)
                    	if (this.data().iconTemporaryColour === baseColour || this.data().iconTemporaryColour === colour) {
                    		 var nmarkers = markers.length;
                    		 for(var k = 0; k < nmarkers; k++ ){
								if(this.data().lat == markers[k].getLatLng().lat && this.data().lng == markers[k].getLatLng().lng){
										markers[k].closePopup();	
								}
								
							}
                    		 patientsTable.row(this).remove().draw();
                    	}
                    });
                    
                 }
}
 	



function moveCenter(){
	//ACCEDO AL VALORE VERO O FALSO DEL CHECKBOX
	var checkBox=document.getElementById("myCheck");
	if(checkBox.checked){		//TUTTO QUELLO CHE LA FUNZIONE FA SI ATTIVA SOLO SE IL CHECKBOX E' CHECKED
		var CentroMappa = L.latLng(mymap.getCenter());   //ACQUISISCO LE COORDINATE DEL CENTRO DELLA MAPPA
		var z = mymap.getBounds();   //ACQUISISCO I DUE VERTICI CHE DETERMINANO I LIMITI DELLA MAPPA
		var latitudineNE = z._northEast.lat;     //QUESTA E' LA LATITUDINE MASSIMA
		var longitudineNE = z._northEast.lng;	 //QUESTA E' LA LONGITUDINE MASSIMA
		var latitudineSW = z._southWest.lat;	 //QUESTA E' LA LATITUDINE MINIMA
		var longitudineSW = z._southWest.lng;	 //QUESTA E' LA LONGITUDINE MINIMA
		for (var i = 0; i < p.length; i++) {
			var presente = false;			
			if (p[i].Lat <= latitudineNE && p[i].Lat >= latitudineSW && p[i].Lng <= longitudineNE && p[i].Lng >= longitudineSW ){  //MI CHIEDO SE IL MARKER E' VISUALIZZATO
				//scorro le righe della tabella e se la riga non è presente allora la aggiungo
				patientsTable.rows().every( function () {
					if(this.data() != undefined) { //senza questo comando non funziona perchè cerca di accedere a una riga che potrebbe essere stata cancellata
						if(p[i].Lat == this.data().Lat && p[i].Lng == this.data().Lng)
		 								presente = true;
					}
				});
				if(presente == false){
					patientsTable.row.add( p[i] ).draw();		 
				}
			}
		
			else
			{		
				patientsTable.rows().every( function () {
					if(this.data()!=undefined){ //senza questo comando non funziona perchè cerca di accedere a una riga che potrebbe essere stata cancellata
						if(p[i].Lat == this.data().Lat && p[i].Lng == this.data().Lng)
							patientsTable.row(this).remove().draw();
		 			}
				});
			}
		}

	}
}




 	