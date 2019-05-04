
console.log("ciao");
	
//Inizializzo le varibaili boolean connesse con le barriere e con le funzioni di hide/show
let skills = false;
let retrieval = false;
let selfcare = false;
let dwelling = false;
let carer = false;
let hideGreen = false;
let hideOrange = false;
let hideRed = false;
let stopBlink = false;
let checkAllBarriers = false;

//Inizializzo le varibaili boolean connesse con gli indici di rischio
let lace = false;
let charlson = false;
let gma = false;
let barthel = false;
let asa = false;

let cacheHit = false;
var markers = [];   //vettore dei marker
let mymap;			//mappa leaflet
let patientsTable;  //tabella datatable



//NON SO COSA SIA (se lo tolgo non vedo cambiamenti)
//google.charts.load('current', {'packages': ['corechart']});

var p = [];  //array dei pazienti
let selectedIcon = "";

/* FUNZIONE CHE CHIAMA OGNI 5 SECONDI PER AGGIORNARE I DATI DELLA TABELLA (PER ORA NON E' USATA)
setInterval(function () {
    if (cacheHit) {
        console.log("New data available!");
        cacheHit = false;
        $('#patientsTable').DataTable().clear();
        p.forEach(e => {
            $('#patientsTable').DataTable().row.add(e).draw();
        })
    } else {
        console.log("No new data to show");
    }
}, 5000);
*/

//colori icone
const baseColour = '#583470';
const redColour = '#E10000';
const orangeColour = '#FF6600';
const greenColour = '#00CC33';





//funzioni
        function getIcon(colour, message, alert, stopBlink) {
            const markerHtmlStyles = `
    	    	  background-color: ${colour};
    	    	  width: 3rem;
    	    	  height: 3rem;
    	    	  display: block;
    	    	  left: -1.5rem;
    	    	  top: -1.5rem;
    	    	  position: relative;
    	    	  border-radius: 3rem 3rem 0;
    	    	  transform: rotate(45deg);
    	    	  border: 1px solid #FFFFFF`;
            const iconBlinking = L.divIcon({
                className: "blinking",
                iconAnchor: [0, 24],
                labelAnchor: [-6, 0],
                popupAnchor: [0, -36],
                html: `<span style="${markerHtmlStyles}" />`
            });
            const icon = L.divIcon({
                className: "normal",
                iconAnchor: [0, 24],
                labelAnchor: [-6, 0],
                popupAnchor: [0, -36],
                html: `<span style="${markerHtmlStyles}" />`
            });
            if (!stopBlink) {
                if (alert || message) {
                    return iconBlinking;
                } else {
                    return icon;
                }
            } else {
                return icon;
            }
        }

        function findFilter() {
            if (lace) {
                laceFunction();
            } else if (gma) {
                gmaFunction();
            } else if (charlson) {
                charlsonFunction();
            } else if (barthel) {
                barthelFunction();
            } else if (asa) {
                asaFunction();
            }/* else if (hideGreen) {
                for (let i = 0; i < p.length; i++) {
                    mymap.removeLayer(this["marker" + i]);
                }
            }*/ else {
                //loadPatients();
            }
        }

        function findOpacity(i) {
            let out = 0;
            let x = Number(0);
            let val = Number(0);
            if (skills) {
                x += Number(3);
                val += Number(p[i].barriers.skills) + Number(1);
            }
            if (retrieval) {
                x += Number(2);
                if (p[i].barriers.retrieval === "YES") {
                    val += Number(1);
                }
                if (p[i].barriers.retrieval === "NO") {
                    val += Number(3);
                } 
            }
            
           
            
            if (selfcare) {
                x += Number(3);
                val += Number(p[i].barriers.selfcare) + Number(1);
            }
            if (dwelling) {
                x += Number(3);
                val += Number(p[i].barriers.dwelling) + Number(1);
            }
            if (carer) {
                x += Number(2);
                val += Number(p[i].barriers.carer) + Number(1);
            }
            if (x === 0) {
                out = 1;
            } else {
                const unit = (Number(1) / Number(x));
                out = unit * Number(val) - 0.2;
            }
            if (x === 7 || x === 8 || x === 9) {
                out = casesThree(x, val);
            }
            if (x === 11 || x === 12 || x === 13) {
                out = casesFour(x, val);
            }
            if (hideGreen) {
                if (p[i].iconTemporaryColour === baseColour || p[i].iconTemporaryColour === greenColour) {
                    out = 0;
                }
            }
            if (hideOrange) {
                if (p[i].iconTemporaryColour === orangeColour) {
                    out = 0;
                }
            }
            if (hideRed) {
                if (p[i].iconTemporaryColour === redColour) {
                    out = 0;
                }
            }
            return out;
        }

        function casesThree(tot, rel) {
            let out = 0;
            const wall = (Number(1) / Number(tot)) * Number(rel);
            if (wall > Number(0.8)) {
                out = 1;
            }
            if (wall > Number(0.4) && wall <= Number(0.8)) {
                out = 0.5;
            }
            if (wall <= Number(0.4)) {
                out = 0.1;
            }
            return out;
        }

        function casesFour(tot, rel) {
            let out = 0;
            if (Number(tot / rel) <= Number(1)) {
                out = 1;
            }
            if (Number(tot / rel) > Number(1) && Number(tot / rel) <= Number(1.5)) {
                out = 0.5;
            }
            if (Number(tot / rel) > Number(1.5) && Number(tot / rel) <= Number(3)) {
                out = 0.1;
            }
            return out;
        }

 

        function changeIcon(colour, i) {
            selectedIcon = getIcon(colour, p[i].checkMessage, p[i].checkAlert, stopBlink);
            const x = findOpacity(i);
            this["marker" + i].setIcon(selectedIcon);
            this["marker" + i].setOpacity(x);
        }

         	
        
       function findRoute(){
    	   console.log("ciao");
    	   var listaTappe=[];
    	   
    	   patientsTable.rows( '.selected' ).every( function () {
             //listaTappe.push(this.data());
             listaTappe.push(L.latLng(this.data().Lat, this.data().Lng));
             
   		   });
    	   
    	   listaTappe.push(listaTappe[0]);
    	   
    	   L.Routing.control({
    		   waypoints: listaTappe
    		 }).addTo(mymap);

       }