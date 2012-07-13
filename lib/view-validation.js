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
    1.1 29 Juny  2012

    © Copyright 2012
    Eduard Gamonal <eduard.gamonal at est.fib.upc dot edu>
    Jordi Nonell <jordi.nopa at gmail dot com>
*/
    
$(document).ready(function() {
    /*
        Un conjunt de fils / ben trenat / és una corda
            [Mot d'ordre - Miquel Martí i Pol]
            
        FIB i CFIS
    */
    
    /* uns quants àlies per comoditat */
	var form = $("#calculadoraForm");  
    var carrera = $("#carreresInput");  
    var carreraInfo = $("#carreraInfo");  
    var tram = $("#llindar");

	var credits1 = $("#credits1");  
	var credits2 = $("#credits2");  
	var credits3 = $("#credits3");  
	var credits4 = $("#credits4");  

	var credits1Info = $("#credits1Info");  
	var credits2Info = $("#credits2Info");  
	var credits3Info = $("#credits3Info");  
	var credits4Info = $("#credits4Info");
   
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
    
    
    function printCost(c) {
        //console.log(c);
        $("#resultat-carrera").text(c.carrera.nom);
        $("#resultat-preu-credit").text(c.carrera.preu + '€');
        
        var costTotal = c.cost.actual.total[6];
        
        if ($.isNumeric(c.llindar)) {
            costTotal = c.cost.actual.total[c.llindar];
            
            $("#resultat-import").text(costTotal.toFixed(2) + '€');
            $("#resultat-import-p").text(costTotal.toFixed(2) + '€');
            $("#resultat-import-pta").text((166.386*costTotal).toFixed(0) + ' ptes');
            $("#resultat-import-dracma").text((340.75*costTotal).toFixed(0) + ' dracmes');
    
            $(".num-llindar").text(c.llindar);
            /*
             * activa un discurs o un altre en funció dels paràmetres
             * de l'usuari, p. ex. el tram
             */
             for(var i = 0; i <= 6; i++) {
                 $(".a-mida-llindar-" + i).css("display", "none");
             }
             $(".a-mida-llindar-" + c.llindar).css("display", "inline");
             
             for(var i = 1; i <= 8; i++) {
                 $('#imports-x-llindar tr>td:nth-child('+ i +')').css('background-color', 'white');
             }
             var col =  parseInt(c.llindar) + 2; // es compta diferent: enèssima començant per 1, més la primera columna d'etiquetes
             $('#imports-x-llindar tr>td:nth-child('+ col +')').css('background-color', '#557C95');
             
             $(".resultat-sense-llindar").css("display", "none");
             $(".import-multilinia").css("display", "inline");
             
        } else if (c.llindar == "NA") {
            $("#cost-sense-llindar").text('Entre ' + c.cost.actual.total[1].toFixed(2) + '€ i ' +  c.cost.actual.total[6].toFixed(2) + '€' );
            $("#resultat-import-p").text(c.cost.actual.total[6].toFixed(2) + '€');
            $(".resultat-sense-llindar").css("display", "inline");
            $(".import-multilinia").css("display", "none");
            $("#info-trams").show();
        }
        
        var dif = parseFloat(costTotal) - parseFloat(c.cost.anterior.total);
        $("#resultat-diferencia-preus").text(dif.toFixed(2) + '€');
            
        $(".resultat-import-anterior").text(c.cost.anterior.total.toFixed(2) + ' €');
                
        // num de crèdits
        $(".resultat-cr1").text(c.carrera.credits[0]);
        $(".resultat-cr2").text(c.carrera.credits[1]);
        $(".resultat-cr3").text(c.carrera.credits[2]);
        $(".resultat-cr4").text(c.carrera.credits[3]);
        
        // import de cada convocatòria
        $("#resultat-cr1-import").text(c.cost.actual.convocatoria[0].toFixed(2) + ' €');
        $("#resultat-cr2-import").text(c.cost.actual.convocatoria[1].toFixed(2) + ' €');
        $("#resultat-cr3-import").text(c.cost.actual.convocatoria[2].toFixed(2) + ' €');
        $("#resultat-cr4-import").text(c.cost.actual.convocatoria[3].toFixed(2) + ' €');
        
        // import total segons el llindar
        $("#resultat-import-llindar-0").text(c.cost.actual.total[0].toFixed(2) + '€');
        $("#resultat-import-llindar-1").text(c.cost.actual.total[1].toFixed(2) + '€');
        $("#resultat-import-llindar-2").text(c.cost.actual.total[2].toFixed(2) + '€');
        $("#resultat-import-llindar-3").text(c.cost.actual.total[3].toFixed(2) + '€');
        $("#resultat-import-llindar-4").text(c.cost.actual.total[4].toFixed(2) + '€');
        $("#resultat-import-llindar-5").text(c.cost.actual.total[5].toFixed(2) + '€');
        $("#resultat-import-llindar-6").text(c.cost.actual.total[6].toFixed(2) + '€');

        $(".resultat-quadris").text(c.carrera.quadris);
        $(".resultat-taxes").text(c.carrera.taxes.actual.toFixed(2) + '€');
        
        //$("#resultat-min-taxestotals").text(c.carrera.quadris*taxes.min + '€');
        //$("#resultat-max-taxes").text(c.taxes + '€');
        //$("#resultat-max-taxestotals").text(c.carrera.quadris*taxes.max + '€');

         // i mostra tot el que formi part del resultat
         $(".resultat").css("display", "inline");
  
    } 


    function clearResults() {
        var cost = {actual: {total: [0,0,0,0,0,0,0], convocatoria: [0, 0, 0, 0]}, anterior: {total: 0, convocatoria: [0, 0, 0, 0]}};
        var r = {carrera: {nom: "", preu: 0, quadris: 0, credits: 0, taxes: {anterior: 0, actual: 0}}, cost: cost, llindar:"NA"};
        
        for(var i = 1; i <= 8; i++) {
            $('#imports-x-llindar tr>td:nth-child('+ i +')').css('background-color', 'white');
        }
             
        printCost(r);
    }


	$("#botoCalc").click(function(){  
		//console.log("soc en submit");
        
		if(validateCarrera() && validateCredits1() && validateCredits2() &&validateCredits3() &&validateCredits4())  {

            var i = getCarreraIndex();
            var credits = Array();
                credits[0] = credits1.val() == "" ? 0:credits1.val();
                credits[1] = credits2.val() == "" ? 0:credits2.val();
                credits[2] = credits3.val() == "" ? 0:credits3.val();
                credits[3] = credits4.val() == "" ? 0:credits4.val();
            var tpm = $('#tipusMatricula').val();
           
           var tramVal = "NA";
            if (!$('#llindarcheckbox').is(':checked')) {
                tramVal = tram.val();
            }
           //console.log(tramVal);
            var cost = computeCost(i, credits, tpm, tramVal);
            printCost(cost);
            updateShareWidgets(cost);
            return true;
		} else
			return false;  
	});  

	/*var carreres = [
		{label:"Enginyeria de camins canals i ports", preu:"15.50"},
		{label:"enginyeria informàtica",preu:"15.50"},
		{label:"filologia",preu:"15.50"},
	];*/
    
    
	/* les carreres són en data.js 
     * llista extreta d'algun BOE. l'hem processat amb perl i ara és
     * una declaració literal d'un vector
     */
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
    
    
    $("#llindarcheckbox").click(function() {
        tram.attr("disabled", $(this).is(":checked"));
        clearResults();
        $(".resultat-amb-llindar").toggle('fast');
        
    });
    
    
    $("#commuta-llindars").click(function() {
        $("#info-trams").slideToggle('fast');
    });
    
    
    
    function updateShareWidgets(c) {
        console.log('removing share widget');
        console.log(c);
        var ct = c.cost.actual.total[6].toFixed(2); // infinit
        if ($.isNumeric(c.llindar)) ct = c.cost.actual.total[c.llindar].toFixed(2);
        
        var piulada = "Estudio "+ c.carrera.nom + ". Per la propera matrícula pagaré " + ct + "€. Exclusió i endeutament.";
        var etiquetes = "sensetaxes";
        $(".twitter-share-button").remove();
        $(".twitter-share-button-wrapper").append("<a href=\"https://twitter.com/share\" class=\"twitter-share-button\" data-url=\"http://ceucat.cat/calculadora\" data-lang=\"en\" data-text=\""+piulada+"\" data-hashtags=\""+etiquetes+"\">Tweet mmoood</a>");
        twttr.widgets.load();
    }
});
