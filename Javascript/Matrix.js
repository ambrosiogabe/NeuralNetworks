class Matrix {

    /**
   * Creates a matrix objecet with every element initialized to 0.
   * @constructor
   * @param {Number} rows - The number of rows for the new matrix object.
   * @param {Number} cols - The number of columns for the new matrix object.
   */
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];

    for (let i=0; i < this.rows; i++) {
      this.data[i] = [];
      for (let j=0; j < this.cols; j++) {
        this.data[i][j] = 0;
      }
    }
  }


  /**
  * Randomizes the data in the matrix object using
  * Javascript's built in Math.random() function between -1 and 1.
  */
  randomize() {
    for (let i=0; i < this.rows; i++) {
      for (let j=0; j < this.cols; j++) {
        this.data[i][j] = Math.random() * 2 - 1;
      }
    }
  }


  /**
  * Returns a transposed version of the matrix passed in.
  * @static
  * @param {Matrix} m : A Matrix object to be transposed
  */
  static transpose(m) {
    let res = new Matrix(m.cols, m.rows);

    for (let i=0; i < m.rows; i++) {
      for (let j=0; j < m.cols; j++) {
        res.data[j][i] = m.data[i][j];
      }
    }
    return res;
  }

  /**
  * Returns the two matrices, a and b, multiplied together. Throws an error if a and b cannot be multiplied.
  * @static
  * @param {Matrix} a : The multiplier matrix
  * @param {Matrx} b : The multiplicand matrix
  */
  static multiply(a, b) {
    if (!(a instanceof Matrix) || !(b instanceof Matrix)) throw "Matrix.multiply(a, b) expects a and b to be Matrix objects.";
    if (a.cols != b.rows) throw "Matrix.multiply(a, b) expects a.cols to equal b.rows";

    let res = new Matrix(a.rows, b.cols);
    for (let i=0; i < a.rows; i++) {
      for (let j=0; j < b.cols; j++) {
        let tmp = 0;
        for (let k=0; k < a.cols; k++) {
          tmp += (a.data[i][k] * b.data[k][j]);
        }
        res.data[i][j] = tmp;
      }
    }

    return res;
  }


  /**
  * Performs scalar multiplication of a constant to the matrix object
  * @param {Number} n : The scalar to be multiplied to the matrix
  */
  multiply(n) {
    if (!isNaN(n)) {
      for (let i=0; i < this.rows; i++) {
        for (let j=0; j < this.cols; j++) {
          this.data[i][j] *= n;
        }
      }
    } else {
      throw "Matrix.multiply(n) expects n to be a Number object.";
    }
  }


  /**
  * Applies a function to every element of the matrix.
  * For example if fn = function(a) {return a + 2;}, then
  * doing map(fn) would add 2 to every element of the array.
  * @param {fn} function : A function to apply to every element of the matrix.
  */
  map(fn) {
    for (let i=0; i < this.rows; i++) {
      for (let j=0; j < this.cols; j++) {
        this.data[i][j] = fn(this.data[i][j]);
      }
    }
  }


  /**
  * Adds two matrices together in an elementwise fashion
  * @param {n} Number : A matrix to add to the matrix
  */
  add(n) {
    if (!(n instanceof Matrix)) throw "Matrix.add(n) expects n to be a Matrix object.";
    if (n.cols != this.cols || n.rows != this.rows) throw "Matrix.add(n) must use two matrices of the same depth and width.";

    for (let i=0; i < this.rows; i++) {
      for (let j=0; j < this.cols; j++) {
        this.data[i][j] += n.data[i][j];
      }
    }
  }


  /**
  * Converts a Matrix object to an Array object
  */
  toArray() {
    let res = []
    for (let i=0; i < this.rows; i++) {
      res[i] = [];
      for (let j=0; j < this.cols; j++) {
        res[i][j] = this.data[i][j];
      }
    }

    return res;
  }


  /**
  * Converts a 2D array object to a Matrix object.
  * @static
  * @param {Array} a : A 2D array to be converted to a Matrix
  */
  static toMatrix(a) {
    let m = new Matrix(a.length, 1);

    for (let i=0; i < m.rows; i++) {
      m.data[i][0] = a[i];
    }

    return m;
  }


  /**
  * Copies and returns a new Matrix object.
  */
  copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i=0; i < this.rows; i++) {
      for (let j=0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }


  /**
  * Prints the array in a tabular format in the console.
  */
  print() {
    console.table(this.data);
  }
}
