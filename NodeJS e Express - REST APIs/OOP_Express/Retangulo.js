module.exports = class Retangulo {
    
    constructor() {
        //aqui são definidos todos os atributos da classe
        //observe que todos os atributos sempre começam com _
        //começa com _ e letra minuscula
        this._base = 0;
        this._altura = 0;
    }

    calcularArea() {
        return this._base * this._altura;
    }

    calcularPerimetro() {
        return 2 * (this._base * 1 + this._altura * 1);
    }

    calcularDiagonal() {
        return Math.sqrt(this._base ** 2 + this._altura ** 2);
    }

    set base(base) {
        this._base = base;
    }

    get base() {
        return this._base;
    }

    set altura(altura) {
        this._altura = altura;
    }
    
    get altura() {
        return this._altura;
    }
}