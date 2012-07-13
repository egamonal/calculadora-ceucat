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
    
/*
 * Coeficients d'increment per repetir
 * http://premsa.gencat.cat/pres_fsvp/docs/2012/06/29/14/15/b08792ab-3392-4dcf-86d9-43b616f8af83.pdf
 * 
 */    

var incr = [1, 1.2, 2.6, 3.6]; // Extret del dossier
var taxes = {anterior: 
                {quadri: (51.8+35), anual: (66.3+70)}, 
             actual:
                {quadri: (52.99+35), anual: (67.82+70)}
             }; // en euros. despeses de gestió + taxes pròpies aproximades per totes les unis.
             
var llindars = [0, 0.83333, 1, 1.1667, 1.333, 1.5, 1.667]; // % del "cost real" calculat pel govern en el llindar i+1
/*
 * llindar   1: 7.5%
 *           2: 15%
 *           3: 17.5%
 *           4: 19.5%
 *           5: 22.5%
 *           6: 25%
 */ 

/* 
 * 
 * @param i index de la carrera per consultar el model de dades
 */
function computeCost(indexCarrera, credits, tipusMatricula, llindar) {
    //var i = getCarreraIndex();
    var c = carreres[indexCarrera];
            
    var costTaxes = {anterior: 0, actual: 0};
    if (tipusMatricula === "quadrimestral" || tipusMatricula === "semestral") costTaxes = {anterior: taxes.anterior.quadri, actual: taxes.actual.quadri};
    else costTaxes = {anterior: taxes.anterior.anual, actual: taxes.actual.anual};

    var creditsTotal = parseFloat(credits[0]) + parseFloat(credits[1]) + parseFloat(credits[2]) + parseFloat(credits[3]);
    var quadris = Math.ceil(creditsTotal/30); // num aproximat de quadris amb jornada completa

    var cbc = c.preu; // cost base del crèdit
    // alerta que el llindar  aquí no existeix però les dades no s'utilitzen enlloc
    var cost = {
        anterior: {
            total: 0, 
            convocatoria: 
                [credits[0] * incr[0] * cbc,
                 credits[1] * 1.5 * cbc,
                 credits[2] * 3 * cbc,
                 credits[3] * 3 * cbc]
        },
        actual: {
            total: [0,0,0,0,0,0,0], 
            convocatoria: 
                [credits[0] * incr[0] * cbc * llindars[llindar],
                 credits[1] * incr[1] * cbc * llindars[6],
                 credits[2] * incr[2] * cbc * llindars[6],
                 credits[3] * incr[3] * cbc * llindars[6]]
        }
    };
    
    // calcula el cost de la matrícula per tots els llindars
    // llindar 0 inclòs perquè les taxes es paguen igualment.
    for (var i = 0; i <= 6; i++) { 
        var cl = credits[0] * incr[0] * cbc * llindars[i] +
                 credits[1] * incr[1] * cbc * llindars[6] +
                 credits[2] * incr[2] * cbc * llindars[6] +
                 credits[3] * incr[3] * cbc * llindars[6];
        cost.actual.total[i] = cl + costTaxes.actual;
    }
    cost.anterior.total = (cost.anterior.convocatoria[0] 
                   + cost.anterior.convocatoria[1]
                   + cost.anterior.convocatoria[2]
                   + cost.anterior.convocatoria[3]
                   + costTaxes.anterior);

    var r = {carrera: {nom: c.label, preu: c.preu, quadris: tipusMatricula, taxes: costTaxes, credits: credits}, cost: cost, llindar:llindar};
    
    return r;
}
