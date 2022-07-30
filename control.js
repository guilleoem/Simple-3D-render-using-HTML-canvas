var inc; //guarda el cambio en los controles (incremento o decremento)

//traslate
var sldtx=document.getElementById("sldtx");
var sldty=document.getElementById("sldty");
var sldtz=document.getElementById("sldtz");
var sldF=document.getElementById("sldF");

var txttx=document.getElementById("txttx");
var txtty=document.getElementById("txtty");
var txttz=document.getElementById("txttz");
var txtF=document.getElementById("ZoomF");

sldtx.oninput=function(){
    inc=parseFloat(sldtx.value)-parseFloat(txttx.value);
    txttx.value=sldtx.value;
    translate(inc,0,0);
    render();
}
txttx.onchange= function(){
    inc=parseFloat(txttx.value)-parseFloat(sldtx.value);
    sldtx.value = txttx.value;
    txttx.blur();
    translate(inc,0,0);
    render();
}
sldty.oninput=function(){
    inc=parseFloat(sldty.value)-parseFloat(txtty.value);
    txtty.value=sldty.value;
    translate(0,inc,0);
    render(objects, dx, dy);
}
txtty.onchange= function(){
    inc=parseFloat(txtty.value)-parseFloat(sldty.value);
    sldty.value = txtty.value;
    txtty.blur();
    translate(0,inc,0);
    render();
}
sldtz.oninput=function(){
    inc=parseFloat(sldtz.value)-parseFloat(txttz.value);
    txttz.value=sldtz.value;
    translate(0,0,inc);
    render(objects, dx, dy);
}
txttz.onchange= function(){
    inc=parseFloat(txttz.value)-parseFloat(sldtz.value);
    sldtz.value = txttz.value;
    txttz.blur();
    translate(0,0,inc);
    render();
}
sldF.oninput=function(){
    txtF.value=sldF.value;
    render(objects, dx, dy);
}
txtF.onchange= function(){
    sldF.value = txtF.value;
    txtF.blur();
    render();
}

//rotate
var sldrx=document.getElementById("sldrx");
var sldry=document.getElementById("sldry");
var sldrz=document.getElementById("sldrz");

var txtrx=document.getElementById("txtrx");
var txtry=document.getElementById("txtry");
var txtrz=document.getElementById("txtrz");

sldrx.oninput=function(){
    inc=parseFloat(sldrx.value)-parseFloat(txtrx.value);
    txtrx.value=sldrx.value;
    rotateX(inc);
    render();
}
txtrx.onchange= function(){
    inc=parseFloat(txtrx.value)-parseFloat(sldrx.value);
    sldrx.value = txtrx.value;
    rotateX(inc);
    txtrx.blur();
    render();
}
sldry.oninput=function(){
    inc=parseFloat(sldry.value)-parseFloat(txtry.value);
    txtry.value=sldry.value;
    rotateY(inc);
    render();
}
txtry.onchange= function(){
    inc=parseFloat(txtry.value)-parseFloat(sldry.value);
    sldry.value = txtry.value;
    rotateY(inc);
    txtry.blur();
    render();
}
sldrz.oninput=function(){
    inc=parseFloat(sldrz.value)-parseFloat(txtrz.value);
    txtrz.value=sldrz.value;
    rotateZ(inc);
    render();
}
txtrz.onchange= function(){
    inc=parseFloat(txtrz.value)-parseFloat(sldrz.value);
    sldrz.value = txtrz.value;
    rotateZ(inc);
    txtrz.blur();
    render();
}

//rotate cam
var sldrcx=document.getElementById("sldrcx");
var sldrcy=document.getElementById("sldrcy");
var sldrcz=document.getElementById("sldrcz");

var txtrcx=document.getElementById("txtrcx");
var txtrcy=document.getElementById("txtrcy");
var txtrcz=document.getElementById("txtrcz");

sldrcx.oninput=function(){
    inc=parseFloat(sldrcx.value)-parseFloat(txtrcx.value);
    txtrcx.value=sldrcx.value;
    rotate_camX(inc);
    render();
}
txtrcx.onchange= function(){
    inc=parseFloat(txtrcx.value)-parseFloat(sldrcx.value);
    sldrcx.value = txtrcx.value;
    txtrcx.blur();
    rotate_camX(inc);
    render();
}
sldrcy.oninput=function(){
    inc=parseFloat(sldrcy.value)-parseFloat(txtrcy.value);
    txtrcy.value=sldrcy.value;
    rotate_camY(inc);
    render();
}
txtrcy.onchange= function(){
    inc=parseFloat(txtrcy.value)-parseFloat(sldrcy.value);
    sldrcy.value = txtrcy.value;
    txtrcy.blur();
    rotate_camY(inc);
    render();
}
sldrcz.oninput=function(){
    inc=parseFloat(sldrcz.value)-parseFloat(txtrcz.value);
    txtrcz.value=sldrcz.value;
    rotate_camZ(inc);
    render();
}
txtrcz.onchange= function(){
    inc=parseFloat(txtrczy.value)-parseFloat(sldrcz.value);
    sldrcz.value = txtrcz.value;
    txtrcz.blur();
    rotate_camZ(inc);
    render();
}

//options
var rdbCube = document.getElementById("rdbCube");
var rdbSphere = document.getElementById("rdbSphere");
var sldCantSphereVerts = document.getElementById("sldSphereVerts");
var txtSphereVerts = document.getElementById("txtSphereVerts");

rdbCube.onclick = function(){
    reset();
    rdbSphere.checked = false;
    document.getElementById("CantSphereVertsContainer").style.display = "none";
    objects[0]=cube;
    render();
}

rdbSphere.onclick = function(){
    reset();
    rdbCube.checked = false;
    document.getElementById("CantSphereVertsContainer").style.display = "block";
    objects[0]=new Sphere(sphere_center,30,parseInt(sldCantSphereVerts.value));;
    render();
}

sldCantSphereVerts.oninput = function(){

    objects[0]=new Sphere(sphere_center,30,parseInt(sldCantSphereVerts.value));
    txtSphereVerts.value = objects[0].vertices.length;
    render();

}