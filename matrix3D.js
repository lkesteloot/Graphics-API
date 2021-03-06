define(["vector3D"], function(Vector3D){
    function Matrix3D() { //can take array of vectors, in addition, it can be set to a rotation matrix by passing 'rx' 'ry' or 'rx' as the first argument, and the angle to be rotated as the second
        this.matrixArray = [];
        this.w;
        this.h;
        this.theta = 0;
        this.type  = null;
        if (arguments[0] instanceof Array){
            this.matrixArray = arguments[0];
            this.w = this.matrixArray[0].getLength();
            this.h = this.matrixArray.length;
        } else if (arguments[0] == 'rx'){
            this.rotationX(arguments[1]);
            this.type = 'rx';
        } else if (arguments[0] == 'ry'){
            this.rotationY(arguments[1]);
            this.type = 'ry';
        } else if (arguments[0] == 'rz'){
            this.rotationZ(arguments[1]);
            this.type = 'rz';
        } else {
    
            this.w = arguments[0].getLength();
            this.h = arguments.length;
            for (var i = 0; i < arguments.length; i++){
                if (!(arguments[i] instanceof Vector3D)){ 
                    throw 'Error: Matrix objects take vectors or a single array with vectors as elements.';
                }
                if (arguments[i].getLength() != this.w && this.w){ throw 'Error: All arguments must be the same length.';}
                this.matrixArray.push(arguments[i]);
    
            }
        }
        
    }
    
    Matrix3D.prototype.at = function(a, b){
        this.matrixArray[a].at(b);
    };
    Matrix3D.prototype.column = function(a){
        var vector = new Vector3D();
        for (var i = 0; i < this.matrixArray.length; i++){
            vector.setAt(i, this.matrixArray[i].at(a));
        }
        return vector;
    };
    Matrix3D.prototype.row = function(a){
        return this.matrixArray[a];
    };
    Matrix3D.prototype.getHeight = function(){
        return this.h;
    };
    Matrix3D.prototype.getWidth = function(){
        return this.w;
    };
    Matrix3D.prototype.setRow = function(r, v){
        if (v.getLength != this.h) {
            throw "Error: Argument not the right size. Cannot change height or width of matrix.";
        }
        if (!(v instanceof Vector)){
            throw 'Error: Rows can only be set to vectors.';
        }
        this.matrixArray[r] = v;
    };
    Matrix3D.prototype.setAt = function(a, b, v){
        this.matrixArray[a].setAt(b, v); 
    };
    Matrix3D.prototype.getMatrixAsArray = function(){
        return this.matrixArray;
    };
    Matrix3D.prototype.setMatrix = function(){ //Overrides instance completely
        
        this.matrixArray = [];
        if (arguments[0] instanceof Array){
            this.matrixArray = arguments[0];
            this.w = this.matrixArray[0].getLength();
            this.h = this.matrixArray.length;
        } else {
            this.w      = arguments[0].getLength();
            this.h      = arguments.length;
            for (var i = 0; i < arguments.length; i++){
                if (!(arguments[i] instanceof Vector3D)){
                    throw 'Error: Matrix objects take vectors or a single array with vectors as elements.';
                }
                if (arguments[i].getLength() != this.w && this.w){
                    throw 'Error: All arguments must be the same length.';
                }
                this.matrixArray.push(arguments[i]);
            }   
        }
    };
    
    Matrix3D.prototype.multiplyVector = function(v) {
        if (v.getLength() != this.getWidth()){
            throw "Error: Cannot multiply. Incompatible sizes.";
        }
        var vector = new Vector3D();
        for (var i = 0; i < this.getHeight(); i++){
            vector.setAt(i, this.row(i).dot(v));
        }
        return vector;
    };
    
    Matrix3D.prototype.multiplyMatrix = function(m) {
        
        if (m.getHeight() != this.getWidth()){
            throw "Error: Cannot multiply matrices. Incompatible sizes.";
        }
        var matrixA = [];
        var i; 
        for (i = 0; i < this.getWidth(); i++){
            matrixA.push(new Vector3D());
        }
        for (i = 0; i < this.getWidth(); i++){
            for (var j = 0; j < this.getWidth(); j++){
                matrixA[i].setAt(j, this.row(i).dot(m.column(j)));
            }
        }
    
        var matrix = new Matrix3D(matrixA);
        return matrix;
    
    };
    
    Matrix3D.prototype.multiply = function(s) {
        for (var i = 0; i < this.getHeight(); i++){
            this.setRow(i, this.row(i).multiply(s));
        }
    };
    Matrix3D.prototype.setTheta = function(theta) {
        if (this.type == 'rx'){
            this.setMatrix(new Vector3D(1, 0, 0),
                       new Vector3D(0, Math.cos(theta), -Math.sin(theta)),
                       new Vector3D(0, Math.sin(theta), Math.cos(theta)));  
        } else if (this.type == 'ry'){
            this.setMatrix(new Vector3D(Math.cos(theta), 0, Math.sin(theta)),
                   new Vector3D(0, 1, 0),
                   new Vector3D(-Math.sin(theta), 0, Math.cos(theta)));     
        } else if (this.type == 'rz'){
            this.setMatrix(new Vector3D(Math.cos(theta), -Math.sin(theta), 0),
                   new Vector3D(Math.sin(theta), Math.cos(theta), 0),
                   new Vector3D(0, 0, 1));      
        } else {
            throw "Error: Matrix is not a rotation matrix";
        }
    };
    Matrix3D.prototype.rotationX = function(theta) { //Makes this matrix the rotation matrix about the x axis for theta degrees
        this.setMatrix(new Vector3D(1, 0, 0),
                       new Vector3D(0, Math.cos(theta), -Math.sin(theta)),
                       new Vector3D(0, Math.sin(theta), Math.cos(theta)));
        
    };
    
    Matrix3D.prototype.rotationY = function(theta) { //Makes this matrix the rotation matrix about the y axis for theta degrees
        this.setMatrix(new Vector3D(Math.cos(theta), 0, Math.sin(theta)),
                       new Vector3D(0, 1, 0),
                       new Vector3D(-Math.sin(theta), 0, Math.cos(theta)));
    };
    
    Matrix3D.prototype.rotationZ = function(theta) { //Makes this matrix the rotation matrix about the z axis for theta degrees
        this.setMatrix(new Vector3D(Math.cos(theta), -Math.sin(theta), 0),
                       new Vector3D(Math.sin(theta), Math.cos(theta), 0),
                       new Vector3D(0, 0, 1));
    };
    return Matrix3D;
});
