class Vertex3D {
    constructor(x, y, z, w) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        this.z = parseFloat(z);
        this.w = parseFloat(w);
    }
}

class Vertex2D {
    constructor(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    }
}

var vertices = [];
var projectedVertices = [];
//-----------------------------------------------------------------------------
//-------------------------------Matrix---------------------------------
//-----------------------------------------------------------------------------



function matMul(A,B){
    var C = [];
    var nfil = A.length, ncol = B[0].length;
    for (var i = 0; i < nfil; i++){
        C[i] = new Array(4);
        for (var j = 0; j < ncol; j++){
            C[i][j] = 0;
            for (var k = 0; k < ncol; k++){
                C[i][j] = C[i][j] + (A[i][k] * B[k][j]);
            }
        }
    }
    return C;
}

//-----------------------------------------------------------------------------
//-------------------------------Objects constructors---------------------------------
//-----------------------------------------------------------------------------


class Cube {
    constructor(center, side, color) {
        var d = side / 2;
        this.side = side;
        this.color = color;
        this.center = center;
        this.vertices = [
            new Vertex3D(center.x - d, center.y - d, center.z + d,1),
            new Vertex3D(center.x - d, center.y - d, center.z - d,1),
            new Vertex3D(center.x + d, center.y - d, center.z - d,1),
            new Vertex3D(center.x + d, center.y - d, center.z + d,1),
            new Vertex3D(center.x + d, center.y + d, center.z + d,1),
            new Vertex3D(center.x + d, center.y + d, center.z - d,1),
            new Vertex3D(center.x - d, center.y + d, center.z - d,1),
            new Vertex3D(center.x - d, center.y + d, center.z + d,1)
        ];
        

        this.faces = [
            [this.vertices[0], this.vertices[1],this.vertices[2], this.vertices[3]],
            [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
            [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
            [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
            [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
            [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
        ];

        this.composTMatrix = [[1,0,0,0],
                                [0,1,0,0],
                                [0,0,1,0],
                                [0,0,0,1]
        ];
    }
}

class Sphere {
    constructor(center, radius, passes, color) {
        var items = passes + 1;
        var x, y, z;
        this.color = color;
        this.center = center;
        this.coords = [];
        this.faces = [];
        this.vertices = [];

        for (var i = 0; i <= 2 * passes; i++) {
            this.coords[i] = new Array(items);
            for (var j = 0; j <= passes; j++) {
                x = center.x + Math.sin(j * Math.PI / passes) * Math.cos(i * Math.PI / passes) * radius;
                z = center.z + Math.sin(j * Math.PI / passes) * Math.sin(i * Math.PI / passes) * radius;
                y = center.y + Math.cos(j * Math.PI / passes) * radius;
                this.vertices.push([new Vertex3D(x, y, z, 1)]);
                this.coords[i][j] = new Vertex3D(x, y, z, 1);
            }
        }
        var face = 0;
        for (var i = 0; i < 2 * passes; i++) {
            for (var j = 0; j < passes; j++) {
                this.faces[face] = [this.coords[i][j],
                this.coords[i][j + 1],
                this.coords[i + 1][j + 1],
                this.coords[i + 1][j]];
                face = face + 1;
            }
        }

        this.composTMatrix = [[1,0,0,0],
                                [0,1,0,0],
                                [0,0,1,0],
                                [0,0,0,1]];
    }
}

//-----------------------------------------------------------------------------
//-------------------------------Transformations---------------------------------
//-----------------------------------------------------------------------------
var transformation=[];

function transformPoint(P,M){
    var pvector =[[]];
    pvector[0]=[P.x,P.y,P.z,P.w];
    //console.log("vector punto: ");console.log(pvector);
    pvector = matMul(pvector,M);
    //console.log("vector punto multiplicado: ");console.log(pvector);
    return new Vertex3D(pvector[0][0],pvector[0][1],pvector[0][2],pvector[0][3]);
}   

function project(M) {
 
    //relación entre el tamaño del canvas y el tamaño del sensor
    //canvas 640x480, sensor 36x24(35 mm full frame) = 20
    var f=parseFloat(sldF.value)*20;

    var px,py;
    if (M.z<=0){
        px = f;
    } else {
        px = f/ M.z;
    }

    return new Vertex2D(px * M.x, px * M.y);
}

function translate(tx,ty,tz){
    transformation = [[1,0,0,0],
                        [0,1,0,0],
                        [0,0,1,0],
                        [tx,ty,tz,1]];
    objects[0].composTMatrix=matMul(objects[0].composTMatrix,transformation);
}
function translatSup(inc){
    var tx = parseFloat(sldtx.value), ty = parseFloat(sldty.value), tz = parseFloat(sldtz.value);
    //var rx = parseFloat(sldrx.value);
    C = objects[0].center;
    rx = rx * Math.PI/180;
    translate(-(tx+C.x),-(ty+C.y),-(tz+C.z));
    transformation = [[1,0,0,0],
                        [0,Math.cos(rx),-Math.sin(rx),0],
                        [0,Math.sin(rx),Math.cos(rx),0],
                        [0,0,0,1]];
    objects[0].composTMatrix=matMul(objects[0].composTMatrix,transformation);   
    translate((tx+C.x),(ty+C.y),(tz+C.z));
}
function rotate_camX(rcx){
    rcx = rcx * Math.PI/180;
    transformation = [[1,0,0,0],
                        [0,Math.cos(rcx),-Math.sin(rcx),0],
                        [0,Math.sin(rcx),Math.cos(rcx),0],
                        [0,0,0,1]];
    objects[0].composTMatrix=matMul(objects[0].composTMatrix,transformation);
}
function rotate_camY(rcy){
    rcy = rcy * Math.PI/180;
    transformation = [[Math.cos(rcy),0,Math.sin(rcy),0],
                        [0,1,0,0],
                        [-Math.sin(rcy),0,Math.cos(rcy),0],
                        [0,0,0,1]];
    objects[0].composTMatrix=matMul(objects[0].composTMatrix,transformation);
}
function rotate_camZ(rcz){
    rcz = rcz * Math.PI/180;
    transformation = [[Math.cos(rcz),-Math.sin(rcz),0,0],
                        [Math.sin(rcz),Math.cos(rcz),0,0],
                        [0,0,1,0],
                        [0,0,0,1]];
    objects[0].composTMatrix=matMul(objects[0].composTMatrix,transformation);
}

function rotateX(rx){
    var tx = parseFloat(sldtx.value), ty = parseFloat(sldty.value), tz = parseFloat(sldtz.value);
    //var rx = parseFloat(sldrx.value);
    C = objects[0].center;
    rx = rx * Math.PI/180;
    translate(-(tx+C.x),-(ty+C.y),-(tz+C.z));
    transformation = [[1,0,0,0],
                        [0,Math.cos(rx),-Math.sin(rx),0],
                        [0,Math.sin(rx),Math.cos(rx),0],
                        [0,0,0,1]];
    objects[0].composTMatrix=matMul(objects[0].composTMatrix,transformation);   
    translate((tx+C.x),(ty+C.y),(tz+C.z));
}
function rotateY(ry){
    var tx = parseFloat(sldtx.value), ty = parseFloat(sldty.value), tz = parseFloat(sldtz.value);
    //var rx = parseFloat(sldrx.value);
    C = objects[0].center;
    ry = ry * Math.PI/180
    translate(-(tx+C.x),-(ty+C.y),-(tz+C.z));
    transformation = [[Math.cos(ry),0,Math.sin(ry),0],
                        [0,1,0,0],
                        [-Math.sin(ry),0,Math.cos(ry),0],
                        [0,0,0,1]];
    objects[0].composTMatrix=matMul(objects[0].composTMatrix,transformation);   
    translate((tx+C.x),(ty+C.y),(tz+C.z));
}

function rotateZ(rz){
    var tx = parseFloat(sldtx.value), ty = parseFloat(sldty.value), tz = parseFloat(sldtz.value);
    //var rx = parseFloat(sldrx.value);
    C = objects[0].center;
    rz = rz * Math.PI/180
    translate(-(tx+C.x),-(ty+C.y),-(tz+C.z));
    transformation = [[Math.cos(rz),-Math.sin(rz),0,0],
                        [Math.sin(rz),Math.cos(rz),0,0],
                        [0,0,1,0],
                        [0,0,0,1]];
    objects[0].composTMatrix=matMul(objects[0].composTMatrix,transformation);   
    translate((tx+C.x),(ty+C.y),(tz+C.z));
}

//-----------------------------------------------------------------------------
//-------------------------------Reset button---------------------------------
//-----------------------------------------------------------------------------
function reset(){
    sldtx.value = 0; txttx.value = 0;
    sldty.value = 0; txtty.value = 0;
    sldtz.value = 0; txttz.value = 0;
    sldrx.value = 0; txtrx.value = 0;
    sldry.value = 0; txtry.value = 0;
    sldrz.value = 0; txtrz.value = 0;
    sldrcx.value = 0; txtrcx.value = 0;
    sldrcy.value = 0; txtrcy.value = 0;
    sldrcz.value = 0; txtrcz.value = 0;
    sldF.value = 24; txtF.value = 24;
    objects[0].composTMatrix = [[1,0,0,0],
                                [0,1,0,0],
                                [0,0,1,0],
                                [0,0,0,1]];
    render();

}

//-----------------------------------------------------------------------------
//-------------------------------Render engine---------------------------------
//-----------------------------------------------------------------------------
var V;
function render() {
    var P = [];
    vertices = [];
    projectedVertices = [];
    // Clear canvas
    ctx.clearRect(0, 0, 2*dx, 2*dy);
        
    //objects style
    ctx.strokeStyle = 'rgba(0, 0, 255,0.1)';
    ctx.fillStyle = 'rgba(0,255, 255,0.1)';
    
    // For each object
    for (var i = 0, n_obj = objects.length; i < n_obj; ++i) {
        
        //objects style
        ctx.strokeStyle = objects[i].strkeStyle;
        var faces = objects[i].faces;

        // For each face    
        for (var j = 0; j < faces.length; ++j) {    
            // Current face
            var face = faces[j];
            // Draw the first Vertex3D
            P = face[0];//console.log("Punto asignado:");console.log(P);
            P = transformPoint(P, objects[i].composTMatrix);//console.log("Punto transformado:");console.log(P);
            vertices[j] = new Vertex3D(P.x,P.y,P.z);
            P = project(P); //console.log("Punto proyectado:");console.log(P);
            projectedVertices[j] = new Vertex2D(P.x,P.y);  
            ctx.beginPath();
            ctx.moveTo(P.x + dx, -P.y + dy);
            
            // Draw the other vertices
            for (var k = 1, n_vertices = face.length; k < n_vertices; ++k) {

                P = face[k];

                
                //P = transform(P, objects[i].center);
                P = transformPoint(P, objects[i].composTMatrix);
                vertices[j+k] = new Vertex3D(P.x,P.y,P.z);
                P = project(P);
                projectedVertices[j+k] = new Vertex2D(P.x,P.y);
                ctx.lineTo(P.x + dx, -P.y + dy);
            }

            // Close the path and draw the face
            
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }
    //data
    
    
    ctx.clearRect(640,0,840,480);
    ctx.fillStyle = 'rgba(0,255, 255)';
    ctx.fillRect(640,0,840,480);

    ctx.fillStyle="black";
    ctx.fillText("vértices transformados",650,10);
    
    var line = 0;
    var tf = 2;
    for (var i=line; i < vertices.length; i++){
        P = vertices[i];
        ctx.fillText("x: " + P.x.toFixed(tf) + " , y: " + P.y.toFixed(tf) + " , z: " + P.z.toFixed(tf),650,(i+1)*10+10);
        line = i;
    }

    ctx.fillText("vértices proyectados",650,(line+5)*10);
    for (var i=0; i < projectedVertices.length; i++){
        P = projectedVertices[i];
        ctx.fillText("x: " + P.x.toFixed(tf) + " , y: " + P.y.toFixed(tf),650,(i+line+5)*10+10);
    }
    //ctx.fillText("inc: " + inc,650,250);
}

//-----------------------------------------------------------------------------
//-------------------------------Code---------------------------------
//-----------------------------------------------------------------------------
 var transformedVertices = [];
 var canvas = document.getElementById('graph');
 var dx = (canvas.width) / 2;
 var dy = canvas.height / 2;
 var constObjects=[];
 // Objects style
 var ctx = canvas.getContext('2d');
 
 
 // Create the objetcs
 var cube_center = new Vertex3D(0, 0, 500); 
 var cube = new Cube(cube_center,200);

 var cube_center2 = new Vertex3D(0, 0, 100); 
 var cube2 = new Cube(cube_center2, 2);

 var sphere_center=new Vertex3D(0,0,100)
 var sphere = new Sphere(sphere_center,30,parseInt(sldCantSphereVerts.value));


 var objects = [];
 //objects[0]=sphere;
 objects[0]=cube;

 // First render
 render();
 
 
