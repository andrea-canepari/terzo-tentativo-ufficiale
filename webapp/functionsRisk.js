//Funzioni relative agli indici di rischio

		function gmaFunction() {
			var table = $('#patientsTable').DataTable();
            gma = true;
            lace = false;
            charlson = false;
            barthel = false;
            asa = false;
            for (let i = 0; i < p.length; i++) {
                if (p[i].riskindexes.gma > 0 && p[i].riskindexes.gma < 3) {
                    p[i].iconTemporaryColour = greenColour;
                    changeIcon(greenColour, i);
                }
                if (p[i].riskindexes.gma == 3) {
                    p[i].iconTemporaryColour = orangeColour;
                    changeIcon(orangeColour, i);
                }
                if (p[i].riskindexes.gma == 4) {
                    p[i].iconTemporaryColour = redColour;
                    changeIcon(redColour, i);
                }
            }
            
            //Agisco sulla visibilit� delle colonne
	        
	        table.column( 5 ).visible( true );
	        table.column( 4 ).visible( false );
	        table.column( 3 ).visible( false );
	        table.column( 6 ).visible( false );
	        table.column( 7 ).visible( false ); 
         
	  }    
            
      function laceFunction() {
    	    var table = $('#patientsTable').DataTable();
            gma = false;
            lace = true;
            charlson = false;
            barthel = false;
            asa = false;
            let i;
            const laceVal = [];
            const laceValUnique = [];
            for (i = 0; i < p.length; i++) {
                laceVal.push(p[i].riskindexes.lace);
                laceValUnique.push(p[i].riskindexes.lace);
            }
            laceVal.sort(function (a, b) {
                return a - b;
            });
            $.unique(laceValUnique);
            laceValUnique.sort(function (a, b) {
                return a - b;
            });
            let absoluteFreq = {};
            for (i = 0; i < laceValUnique.length; i++) {
                let cnt = 0;
                for (let j = 0; j < laceVal.length; j++) {
                    if (laceValUnique[i] === laceVal[j]) { // (NO, apparently) could be buggy because of === instead of ==?
                        cnt++;
                    }
                }
                absoluteFreq[laceValUnique[i].toString()] = cnt; // (FIXED) could be buggy because laceVal and laceValUnique are no longer strings?
            }
            let comulatedFreq = {};
            let com = Number(0);
            let max;
            for (let k in absoluteFreq) { // iterates fields of object as strings
                com += Number(absoluteFreq[k]); // (NO, apparently)  could be buggy because already a number?
                comulatedFreq[k] = Number(com); // (NO, apparently)  could be buggy because already a number?
                max = Number(comulatedFreq[k]);
            }
            for (let k in comulatedFreq) {
                for (i = 0; i < p.length; i++) {
                    if (k === p[i].riskindexes.lace.toString()) { // (FIXED) could be buggy because .lace is no longer string?
                        if (comulatedFreq[k] <= (max / 3)) {
                            p[i].iconTemporaryColour = greenColour;
                            changeIcon(greenColour, i)
                        }
                        if (comulatedFreq[k] > (max / 3) && comulatedFreq[k] <= 2 * (max / 3)) {
                            p[i].iconTemporaryColour = orangeColour;
                            changeIcon(orangeColour, i)
                        }
                        if (comulatedFreq[k] > 2 * (max / 3) && comulatedFreq[k] <= max) {
                            p[i].iconTemporaryColour = redColour;
                            changeIcon(redColour, i)
                        }
                    }
                }
            }
	        //Agisco sulla visibilità delle colonne
	        
	        table.column( 3 ).visible( true );
	        table.column( 4 ).visible( false );
	        table.column( 5 ).visible( false );
	        table.column( 6 ).visible( false );
	        table.column( 7 ).visible( false );
	           
        }

        function charlsonFunction() {
        	var table = $('#patientsTable').DataTable();
            gma = false;
            lace = false;
            charlson = true;
            barthel = false;
            asa = false;
            let i;
            let charlsonVal = [];
            let charlsonValUnique = [];
            for (i = 0; i < p.length; i++) {
                charlsonVal.push(p[i].charlson);
                charlsonValUnique.push(p[i].riskindexes.charlson);
            }
            charlsonVal.sort(function (a, b) {
                return a - b;
            });
            $.unique(charlsonValUnique);
            charlsonValUnique.sort(function (a, b) {
                return a - b;
            });
            let absoluteFreq = {};
            for (i = 0; i < charlsonValUnique.length; i++) {
                let cnt = 0;
                for (let j = 0; j < charlsonVal.length; j++) {
                    if (charlsonValUnique[i] === charlsonVal[j]) {
                        cnt++;
                    }
                }
                absoluteFreq[charlsonValUnique[i].toString()] = cnt;
            }
            let comulatedFreq = {};
            let com = Number(0);
            let max;
            for (let k in absoluteFreq) {
                com += Number(absoluteFreq[k]);
                comulatedFreq[k] = Number(com);
                max = Number(comulatedFreq[k]);
            }
            for (let k in comulatedFreq) {
                for (i = 0; i < p.length; i++) {
                    if (k === p[i].riskindexes.charlson.toString() && p[i].riskindexes.charlson >= 3) {
                        if (comulatedFreq[k] <= (max / 3)) {
                            p[i].iconTemporaryColour = greenColour;
                            changeIcon(greenColour, i);
                        }
                        if (comulatedFreq[k] > (max / 3) && comulatedFreq[k] <= 2 * (max / 3)) {
                            p[i].iconTemporaryColour = orangeColour;
                            changeIcon(orangeColour, i);
                        }
                        if (comulatedFreq[k] > 2 * (max / 3) && comulatedFreq[k] <= max) {
                            p[i].iconTemporaryColour = redColour;
                            changeIcon(redColour, i);
                        }
                    }
                    if (p[i].riskindexes.charlson < 3) {
                        p[i].iconTemporaryColour = baseColour;
                        changeIcon(baseColour, i);
                    }
                }
            }


		
				table.column( 4 ).visible( true );
	            table.column( 3 ).visible( false );
	            table.column( 5 ).visible( false );
	            table.column( 6 ).visible( false );
	            table.column( 7 ).visible( false );
	            


        }

        function barthelFunction() {
        	var table = $('#patientsTable').DataTable();
            gma = false;
            lace = false;
            charlson = false;
            barthel = true;
            asa = false;
            for (let i = 0; i < p.length; i++) {
                if (p[i].riskindexes.barthel <= 60) {
                    p[i].iconTemporaryColour = redColour;
                    changeIcon(redColour, i);
                }
                if (p[i].riskindexes.barthel >= 61 && p[i].riskindexes.barthel <= 90) {
                    p[i].iconTemporaryColour = orangeColour;
                    changeIcon(orangeColour, i);
                }
                if (p[i].riskindexes.barthel >= 91 && p[i].riskindexes.barthel <= 99) {
                    p[i].iconTemporaryColour = greenColour;
                    changeIcon(greenColour, i);
                }
            }
            
            
            //Agisco sulla visibilità delle colonne
	            
	            table.column( 6 ).visible( true );
	            table.column( 4 ).visible( false );
	            table.column( 5 ).visible( false );
	            table.column( 3 ).visible( false );
	            table.column( 7 ).visible( false );
	              
            
            
        }

        function asaFunction() {
        	var table = $('#patientsTable').DataTable();
            gma = false;
            lace = false;
            charlson = false;
            barthel = false;
            asa = true;
            for (let i = 0; i < p.length; i++) {
                if (p[i].riskindexes.asa === "II") {
                    p[i].iconTemporaryColour = greenColour;
                    changeIcon(greenColour, i);
                } else if (p[i].riskindexes.asa === "III") {
                    p[i].iconTemporaryColour = redColour;
                    changeIcon(redColour, i);
                } else {
                    p[i].iconTemporaryColour = baseColour;
                    changeIcon(baseColour, i);
                }
            }
            
            
            //Agisco sulla visibilità delle colonne
	            table.column( 7 ).visible( true );
	            table.column( 4 ).visible( false );
	            table.column( 5 ).visible( false );
	            table.column( 6 ).visible( false );
	            table.column( 3 ).visible( false );
	          
            
            
        }
        
        

 	