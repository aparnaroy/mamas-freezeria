class Cup {
    constructor() {
        this.iceCream = []
        this.ingredient = [];
        this.syrup = []
        this.hasWhippedCream = [false];
        this.blended = false;
        this.blending = false;
    }

    hasIceCream() {
        return this.iceCream.length > 0; // or true if ice cream is present
    }

    setIceCream(iceCream) {
        this.iceCream.push(iceCream);
    }

    addIngredient(ingredient) {
        this.ingredient.push(ingredient);
    }

    setSyrup(syrup) {
        this.syrup.push(syrup);
    }

    setWhippedCream(hasWhippedCream) {
        if (!this.hasWhippedCream[0]) {
            this.hasWhippedCream = [true];
        } else {
            this.hasWhippedCream.push(true);
        }
    }

    setBlended() {
        this.blended = true;
        this.blending = false;
    }

    startBlending() {
        this.blending = true;
    }

    getBlendedImg() {
        if (this.hasIceCream()) {
            if (this.iceCream.includes("VanillaIceCream") && this.iceCream.includes("ChocolateIceCream")) {
                return './img/ingredients/BlendedVanAndChoc.png';
            } else if (this.iceCream[0] == "VanillaIceCream") {
                return './img/ingredients/BlendedVanilla.png'; 
            } else if (this.iceCream[0] == "ChocolateIceCream") {
                return './img/ingredients/BlendedChocolate.png'; 
            }
        }
    }
}

export default Cup;
