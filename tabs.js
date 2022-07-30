
// Dadas la division que contiene todas las pestañas y la de la pestaña que se 
// quiere mostrar, la funcion oculta todas las pestañas a excepcion de esa.
function cambiarPestanna(pestanna) {
    
    lista=document.getElementById("lista");
    ipestaña=lista.getElementsByTagName('li');

    for (var i=1; i <= ipestaña.length; i++) {
        if (i==pestanna){
            document.getElementById("cpestana"+i).style.display="block";
            document.getElementById("pestana"+i).style.borderBottomColor = "white";
        } else {
            document.getElementById("cpestana"+i).style.display="none";
            document.getElementById("pestana"+i).style.borderBottomColor = "gray";
        }
    }



}