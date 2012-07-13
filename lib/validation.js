/*
    This file is part of Calculadora-CdE

    Calculadora-CdE is free software: you can redistribute it and/or modify
    it under the terms of the Affero GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    Calculadora-CdE is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    Affero GNU General Public License for more details.

    You should have received a copy of the Affero GNU General Public License
    along with Calculadora-CdE.  If not, see <http://www.gnu.org/licenses/>.
   
    1.0 23 April 2012

    © Copyright 2012
    Eduard Gamonal <eduard.gamonal at est.fib.upc dot edu>
    Jordi Nonell <jordi.nopa at gmail dot com>
*/
    
$(document).ready(function(){   
    /*
        Un conjunt de fils / ben trenat / és una corda
            [Mot d'ordre - Miquel Martí i Pol]
            
        FIB i CFIS
    */
    
    /* uns quants àlies per comoditat */
	var form = $("#calculadoraForm");  
    var carrera = $("#carreresInput");  
    var carreraInfo = $("#carreraInfo");  

	var credits1 = $("#credits1");  
	var credits2 = $("#credits2");  
	var credits3 = $("#credits3");  
	var credits4 = $("#credits4");  

	var credits1Info = $("#credits1Info");  
	var credits2Info = $("#credits2Info");  
	var credits3Info = $("#credits3Info");  
	var credits4Info = $("#credits4Info");
    
    
    /*
     * variables de configuració
     * 
     * taxes és import esperat per aquest any de les taxes pròpies de les universitats
     * 
     * incr és el coeficient respecte el preu inicial del crèdit en 
     * la primera i successives matrícules. 
     * el càlcul es fa en funció del discurs (fals) del govern:
     *  l'estudiant paga el 15% del cost total dels estudis (fruit de la 
     *  divisió trivial pressupostUniversitats/totalEstudiants
     *  i se li augmentarà el preu perquè pagui entre el 15 i el 25% 
     *  en els crèdits de primera vegada. 15/15 = 1; 25/15 = 1.667
     * 
     * l'ipc és anual i extret de http://www.ine.es/
     * 
     */ 
    /*var ministerio = {min: 1, max: 4};
    var generalitat = {min: 1, max: 4};*/
    var taxes = {quadri: (51.8+35), anual: (66.3+70)}; // en euros. despeses de gestió + taxes pròpies aproximades per totes les unis.
    var incr = [{min: 1,    max:1.667}, 
                {min: 2,    max:2.667}, 
                {min: 4.333,max:5    }, 
                {min: 6,    max:6.667}];
    var ipc = 1.019;
    var maxCredits = 375.0; // els plans antics tenen fins a 375 crèdits
    
    var errMissatge = "S'esperava un número real n, &le; n &le; " + maxCredits;

    /* handlers */
	credits1.blur(validateCredits1);
	credits2.blur(validateCredits2);
	credits3.blur(validateCredits3);
	credits4.blur(validateCredits4);
    
	credits1.keyup(validateCredits1);
	credits2.keyup(validateCredits2);
	credits3.keyup(validateCredits3);
	credits4.keyup(validateCredits4);
    	
    function validateCarrera() {
        if (getCarreraIndex() == -1) {
            carreraInfo.addClass("error");  
			carreraInfo.text("El nom de la carrera no és cap dels suggerits.");
            clearResults();
            return false;
        } else {
            carreraInfo.text(""); 
            carreraInfo.removeClass("error");

			return true; 
        }
    }

	function validateCredits1() {
        var a = credits1.val();
        // cas extrem: 300.0 ECTS
		if (a != "" && (!($.isNumeric(a)) || a.length > 5 || a > maxCredits || a < 0.0)) {
			credits1Info.addClass("error");  
			credits1Info.html(errMissatge);
            clearResults();
			return false;
		} else {
			credits1Info.html(""); 
            credits1Info.removeClass("error");

			return true; 
		}
	} 
    
    function validateCredits2() {
        var a = credits2.val();
        
		if (a != "" && (!($.isNumeric(a)) || a.length > 5 || a > maxCredits || a < 0.0)) {
			credits2Info.addClass("error");  
			credits2Info.html(errMissatge);
            clearResults();
			return false;
		} else {
			credits2Info.html("");  
			credits2Info.removeClass("error");
			return true; 
		}
	} 
    
    function validateCredits3() {
        var a = credits3.val();
        
		if (a != "" && (!($.isNumeric(a)) || a.length > 5 || a > maxCredits || a < 0.0)) {
			credits3Info.addClass("error");  
			credits3Info.html(errMissatge);
            clearResults();
			return false;
		} else {
			credits3Info.html("");  
			credits3Info.removeClass("error");
			return true; 
		}
	} 
    
    function validateCredits4() {
        var a = credits4.val();
        
		if (a != "" && (!($.isNumeric(a)) || a.length > 5 || a > maxCredits || a < 0.0)) {
			credits4Info.addClass("error");  
			credits4Info.html(errMissatge);
			clearResults();
			return false;
		} else {
			credits4Info.html("");  
			credits4Info.removeClass("error");
			return true; 
		}
	}
    
    function computeCost() {
        var i = getCarreraIndex();
        var c = carreres[i];
                
        var credits = Array();
        credits[0] = credits1.val() == "" ? 0:credits1.val();
        credits[1] = credits2.val() == "" ? 0:credits2.val();
        credits[2] = credits3.val() == "" ? 0:credits3.val();
        credits[3] = credits4.val() == "" ? 0:credits4.val();
        
		var costTaxes = 0;
		if ($('#tipusMatricula').val() === "quadrimestral" || $('#tipusMatricula').val() === "semestral") costTaxes = taxes.quadri;
		else costTaxes = taxes.anual;
        
        var creditsTotal = parseFloat(credits[0]) + parseFloat(credits[1]) + parseFloat(credits[2]) + parseFloat(credits[3]);
        var quadris = Math.ceil(creditsTotal/30); // num aproximat de quadris amb jornada completa
       // console.log(creditsTotal + " ; "  + quadris);
        var cost = {
            min: {total: 0, 
                  convocatoria: 
                    [credits[0] * incr[0].min * c.preu,
                     credits[1] * incr[1].min * c.preu,
                     credits[2] * incr[2].min * c.preu,
                     credits[3] * incr[3].min * c.preu]
                  },
            max: {total: 0, 
                  convocatoria: 
                    [credits[0] * incr[0].max * c.preu,
                     credits[1] * incr[1].max * c.preu,
                     credits[2] * incr[2].max * c.preu,
                     credits[3] * incr[3].max * c.preu]
                  }
            };
        cost.min.total = (cost.min.convocatoria[0] 
                       + cost.min.convocatoria[1]
                       + cost.min.convocatoria[2]
                       + cost.min.convocatoria[3]
                       + costTaxes) * ipc;
                       
        cost.max.total = (cost.max.convocatoria[0]
                       + cost.max.convocatoria[1]
                       + cost.max.convocatoria[2]
                       + cost.max.convocatoria[3]
                       + costTaxes)*ipc;
        
        var r = {carrera: {nom: c.label, preu: c.preu, quadris: $('#tipusMatricula').val(), taxes: costTaxes, credits: credits}, cost: cost};
        
        return r;
    }
    
    function printCost(c) {
        //console.log(c);
        $("#resultat-carrera").text(c.carrera.nom);
        $("#resultat-preu-credit").text(c.carrera.preu + '€');
        
        $("#resultat-import-min").text(c.cost.min.total.toFixed(2) + '€');
        $("#resultat-import-max").text(c.cost.max.total.toFixed(2) + '€');
        
        $("#resultat-import-min-p").text(c.cost.min.total.toFixed(2) + '€');
        $("#resultat-import-max-p").text(c.cost.max.total.toFixed(2) + '€');
        
        $(".resultat-cr1").text(c.carrera.credits[0]);
        $(".resultat-cr2").text(c.carrera.credits[1]);
        $(".resultat-cr3").text(c.carrera.credits[2]);
        $(".resultat-cr4").text(c.carrera.credits[3]);
        
        $("#resultat-min-cr1-import").text(c.cost.min.convocatoria[0].toFixed(2) + '€');
        $("#resultat-min-cr2-import").text(c.cost.min.convocatoria[1].toFixed(2) + '€');
        $("#resultat-min-cr3-import").text(c.cost.min.convocatoria[2].toFixed(2) + '€');
        $("#resultat-min-cr4-import").text(c.cost.min.convocatoria[3].toFixed(2) + '€');
        
        /*$("#resultat-max-cr1").text("carrera");
        $("#resultat-max-cr2").text("carrera");
        $("#resultat-max-cr3").text("carrera");
        $("#resultat-max-cr4").text("carrera");*/
        
        $("#resultat-max-cr1-import").text(c.cost.max.convocatoria[0].toFixed(2) + '€');
        $("#resultat-max-cr2-import").text(c.cost.max.convocatoria[1].toFixed(2) + '€');
        $("#resultat-max-cr3-import").text(c.cost.max.convocatoria[2].toFixed(2) + '€');
        $("#resultat-max-cr4-import").text(c.cost.max.convocatoria[3].toFixed(2) + '€');
        
        $(".resultat-quadris").text(c.carrera.quadris);
        $(".resultat-taxes").text(c.carrera.taxes + '€');
        //$("#resultat-min-taxestotals").text(c.carrera.quadris*taxes.min + '€');
        //$("#resultat-max-taxes").text(c.taxes + '€');
        //$("#resultat-max-taxestotals").text(c.carrera.quadris*taxes.max + '€');
        
        //console.log('element printcost: ' + r);
    } 

    function clearResults() {
    var cost = {
            min: {total: 0, convocatoria: [0, 0, 0, 0]},
            max: {total: 0, convocatoria: [0,0,0,0]}
            };

        var r = {carrera: {nom: "", preu: "", quadris: "", credits: ""}, cost: cost};
        printCost(r);
    }

	$("#botoCalc").click(function(){  
		//console.log("soc en submit");
        
		if(validateCarrera() && validateCredits1() && validateCredits2() &&validateCredits3() &&validateCredits4())  {
            //console.log('You selected a string with index '+getCarreraIndex());
		    //console.log('i amb preu '+carreres[getCarreraIndex()].preu);
            var cost = computeCost();
            printCost(cost);
            return true;
		} else
			return false;  
	});  

	/*var carreres = [
		{label:"Enginyeria de camins canals i ports", preu:"15.50"},
		{label:"enginyeria informàtica",preu:"15.50"},
		{label:"filologia",preu:"15.50"},
		{label:"filosofia",preu:"15.50"},
		{label:"magisteri",preu:"15.50"},
		{label:"educació social",preu:"15.50"},
		{label:"enginyeria aeronàutica",preu:"15.50"},
		{label:"enginyeria de telecomunicacions",preu:"15.50"},
		{label:"arquitectura",preu:"17.50"}
	];*/
    
	/* les carreres són en carreres.js 
     * llista extreta d'algun BOE. l'hem processat amb perl i ara és
     * una declaració literal d'un vector
     * */
	$("input#carreresInput").autocomplete({
		source: carreres
	});
	
	function getCarreraIndex() {
		/* i la fantàstica cerca per trobar l'index i fer càlculs */
		var i = -1;
		$.each(carreres, function(index, value) {  
            if (carreres[index].label == $("input#carreresInput").val()) { 
               i = index; 
               return i;
            }
        });
		return i;
		
	}
});
