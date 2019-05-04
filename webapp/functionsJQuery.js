
//In questo file ho messo tutto ciò che riguarda JQuery e che quindi non può essere messo fuori dal document.ready 
$(document).ready(function () {
	//colori icone

            $('[data-toggle="popover"]').popover();

            $.ajax({
                url: "http://localhost:9006/listPatients",
                type: 'GET',
                dataType: 'json',
            }).then(function (data) {
            	
            	console.log(data);
            	
                loadPatients(data);
                
                $('#patientsTable').DataTable().clear();
                p.forEach(e => {
                
                    $('#patientsTable').DataTable().row.add(e).draw();
                })
            });


			//DATATABLE

             patientsTable = $('#patientsTable').DataTable({
                dom: 'Bfrtip',
        		buttons: [
        			{	extend: 'csvHtml5',
                		exportOptions: {
                    	columns: ':visible'}
                     }, 
            		 {	extend: 'excelHtml5',
                		exportOptions: {
                    	columns: ':visible'}
                     }, 
            		 {	extend: 'pdfHtml5',
                		exportOptions: {
                    	columns: ':visible'}
                     },  
            		 {	extend: 'print',
                		exportOptions: {
                    	columns: ':visible'}
                     }, 
            		 'colvis'
        		],

        		select: true,			//RENDO SELEZIONABILI LE RIGHE DELLA TABELLA 
        		
                data: p,
                
                columns: [ // should be 'ID' 'Name' 'Surname' 'Dweling address' 'Selected risk score' 'Selected barriers score'
                    {data: 'id', title: '#'},
                    {data: 'name', title: 'Name'},
                    {data: 'surname', title: 'Surname'},
                    {data: 'riskindexes.lace', title: 'LACE'},
                    {data: 'riskindexes.charlson', title: 'Charlson'},
                    {data: 'riskindexes.gma', title: 'GMA'},
                    {data: 'riskindexes.barthel', title: 'Barthel'},
                    {data: 'riskindexes.asa', title: 'ASA'},
                    {data: 'barriers.skills', title: 'Skills'},
                    {data: 'barriers.retrieval', title: 'Retrieval'},
					{data: 'barriers.selfcare', title: 'Selfcare'},
                    {data: 'barriers.dwelling', title: 'Dwelling'},
                    {data: 'barriers.carer', title: 'Carer'},
                    
                ]
 
            });

		  //Rendo invisibili le colonne relative alle barriere da subito (le farò poi comparire cliccando sui checkbox)
          patientsTable.column( 8 ).visible( false );
          patientsTable.column( 9 ).visible( false );
          patientsTable.column( 10 ).visible( false );
          patientsTable.column( 11 ).visible( false );
          patientsTable.column( 12 ).visible( false );

            // DO NOT FOLLOW ADVICE (importing makes map disappear!)
            mymap = L.map('mapid', {
                attributionControl: false,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                zoomControl: true,
                touchZoom: true,
                dragging: true,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mymap);
            mymap.setView([44.6979999,10.6298284], 12);       	
        	
        	//Possibilità di ricerca per indirizzo sulla mappa
        	var geocoder = L.Control.geocoder({
        		collapsed:false,
        	}).addTo(mymap);
        	

        	//Radio Button degli indici di rischio. Quando ci clicco sopra chiamo una funzione che è diversa per ogni indice
            $("#gma").click(function () {
                gmaFunction();
            });
            $("#barthel").click(function () {
                barthelFunction();
            });
            $("#asa").click(function () {
                asaFunction();
            });
            $("#lace").click(function () {
                laceFunction();
            });
            $("#charlson").click(function () {
                charlsonFunction();
            });
            
            
            //Checkbox dei vari hide/show dei markers. Si attiva la funzione di sincronizzazione con le colonne della tabella
            
            $("#greenDrop").on('change', function () {
                if (hideGreen) {
                    hideGreen = false;
                    syncMarkerAddRow();
                } else {
                    hideGreen = true;
                    syncMarkerRemoveRow(greenColour);
                }
                findFilter();
            });
            
            $("#orangeDrop").on('change', function () {
                if (hideOrange) {
                    hideOrange = false;
               		syncMarkerAddRow();         
                } else {
                    hideOrange = true;
                       syncMarkerRemoveRow(orangeColour);
   
                }
                findFilter();
            });
            
            $("#redDrop").on('change', function () {
                if (hideRed) {
                    hideRed = false;
                    syncMarkerAddRow();
                } else {
                    hideRed = true;
                          syncMarkerRemoveRow(redColour);
   
                }
                findFilter();
            });
            
            //tasto per attivare o disattivare il lampeggio dei markers
            $("#toggleBlink").click(function () {
                if (stopBlink) {
                    stopBlink = false;
                } else {
                    stopBlink = true;
                }
                findFilter();
            });
            
            
            $("#toggleRisk").click(function () {
               gma = false;
               lace = false;
               charlson = false;
               barthel = false;
               asa = false;
               
               for (let i = 0; i < p.length; i++) {
                       p[i].iconTemporaryColour = baseColour;
                       changeIcon(baseColour, i);
               }
               
                $('#gma')[0].checked = false;
                $('#barthel')[0].checked = false;
                $('#lace')[0].checked = false;
                $('#asa')[0].checked = false;
                $('#charlson')[0].checked = false;
               
               
               
                              
               var table = $('#patientsTable').DataTable();
               table.column( 3 ).visible( true );
   	           table.column( 4 ).visible( true );
   	           table.column( 5 ).visible( true );
   	           table.column( 6 ).visible( true );
   	           table.column( 7 ).visible( true );
            });
            
            
            //Checkbox delle barriere, sono sincronizzati con le colonne della tabella
            $('#skills').on('change', function () {
                if (skills) {
                    skills = false;
 					patientsTable.column( 8 ).visible( false );
                } else {
                    skills = true;
                    patientsTable.column( 8 ).visible( true );
                }
                findFilter();
            });
            
            
            $('#retrieval').on('change', function () {
                if (retrieval) {
                    retrieval = false;
 					patientsTable.column( 9 ).visible( false );
                } else {
                    retrieval = true;
                    patientsTable.column( 9 ).visible( true );
                }
                findFilter();
            });
            
            $('#selfcare').on('change', function () {
                if (selfcare) {
                    selfcare = false;
                    patientsTable.column( 10 ).visible( false );
                } else {
                    selfcare = true;
                    patientsTable.column( 10 ).visible( true );
                }
                findFilter();
            });
            
            $('#dwelling').on('change', function () {
                if (dwelling) {
                    dwelling = false;
                    patientsTable.column( 11 ).visible( false );
                } else {
                    dwelling = true;
                    patientsTable.column( 11 ).visible( true );
                }
                findFilter();
            });
            
            $('#carer').on('change', function () {
                if (carer) {
                    carer = false;
                    patientsTable.column( 12 ).visible( false );
                } else {
                    carer = true;
                    patientsTable.column( 12 ).visible( true );
                }
                findFilter();
            });
            
            $('#checkAll').change(function (e) {
                if (e.currentTarget.active) {
                    $('.checkbox-inline').find('input[type="checkbox"]').prop('checked', true).change();
                } else {
                    $('.checkbox-inline').find('input[type="checkbox"]').prop('checked', false).change();
                }
            });
            
            $("#checkAll").click(function () {
                if (checkAllBarriers) {
                    checkAllBarriers = false;
                } else {
                    checkAllBarriers = true;
                }
                $('.checkbox-inline').find('input[type="checkbox"]').prop('checked', checkAllBarriers).change();
            });
       
       
       
            
       //Questa funzione effettua la sincronizzazione tra la selezione/deselezione di una riga e la apparizione/chiusura del popup
       
       		 $('#patientsTable').find('tbody').on( 'click', 'tr', function () {
       		 //CONTO LE RIGHE SELEZIONATE
       		 var cont = 0;
       		 var rowClick = patientsTable.row(this).data();
       		 
       		 patientsTable.rows({ selected: true }).every( function () {
       		 	cont++;
       		 });

       		 var nmarkers = markers.length;
        	 for(var k = 0; k < nmarkers; k++){
					if(rowClick.Lat == markers[k].getLatLng().lat && rowClick.Lng==markers[k].getLatLng().lng){
						markers[k].openPopup();	
					}
			 }

       		 //QUI APRO IL POPUP QUANDO CLICCO SU UNA RIGA				
        	 for(var k = 0; k < nmarkers; k++){
					if(rowClick.Lat == markers[k].getLatLng().lat && rowClick.Lng == markers[k].getLatLng().lng){
						markers[k].openPopup();	
					}
			 }
        		
        		 //I POPUP SI CHIUDONO SOLO SE RICLICCO SULLA RIGA
        	 
        		 if ($(this).hasClass('selected') ) {
        		 if(cont == 1){
        			var nmarkers = markers.length;
            		for(var k = 0; k < nmarkers; k++){
									//console.log(markers[k]);
									if(rowClick.Lat== markers[k].getLatLng().lat && rowClick.Lng==markers[k].getLatLng().lng){
										markers[k].closePopup();	
									}
								}
				}
        		}

        		if(event.ctrlKey == false){
        		
        		patientsTable.rows().every( function () {
        						if(this.data().name != rowClick.name && this.data().surname != rowClick.surname){
        							var nmarkers = markers.length;
        							for(var k = 0; k < nmarkers; k++){
										if(this.data().Lat == markers[k].getLatLng().lat && this.data().Lng == markers[k].getLatLng().lng){
											markers[k].closePopup();	
										}
									}
								}
							});
        		}
        		
        		else{
        		
        			patientsTable.rows({ selected: false }).every( function () {
        						if(this.data().name != rowClick.name && this.data().surname != rowClick.surname){	
        							var nmarkers = markers.length;
        							for(var k = 0; k < nmarkers; k++){
										if(this.data().Lat== markers[k].getLatLng().lat && this.data().Lng==markers[k].getLatLng().lng){
											markers[k].closePopup();	
										}
									}
								}
							});
        		}
   			 } );
       


	//QUESTA FUNZIONE SI ATTIVA OGNI VOLTA CHE IL CENTRO DELLA MAPPA CAMBIA (SIA CON IL TRASCINAMENTO CHE CON LO ZOOM)
	mymap.on('moveend', function(e) {
			moveCenter();
	} );   
  
  
           
        
   //FUNZIONE CHE SI ATTIVA QUANDO CLICCO SUL PULSANTE "TROVA SULLA MAPPA"     
   $("#b").click(function(){
            findMarkerFromRow();
   });
        
 //FUNZIONE CHE SI ATTIVA QUANDO CLICCO SUL PULSANTE "TROVA SULLA MAPPA"     
   $("#bRouting").click(function(){
	   findRoute();
   });
  

 });      
