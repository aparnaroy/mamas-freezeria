class Ticket {
    constructor(ticketNum) {
        this.ticketNum = ticketNum;
        this.iceCreamOptions = ['VanillaIceCream', 'ChocolateIceCream'];
        this.ingredientOptions = ['Blueberry', 'Strawberry', 'Cherry', 'ChocChip', 'GummyWorm', 'Oreo', 'Peanut', 'Sprinkles'];
        this.toppingOptions = ['CaramelSyrup', 'ChocolateSyrup', 'StrawberrySyrup'];
        this.whippedCream = true;
        this.creationTime = Date.now(); // Store the creation time
        this.generateRandomTicket();
    }

    generateRandomTicket() {
        this.iceCream = this.iceCreamOptions[Math.floor(Math.random() * this.iceCreamOptions.length)];
        this.ingredient1 = this.ingredientOptions[Math.floor(Math.random() * this.ingredientOptions.length)];
        this.ingredient2 = this.ingredientOptions[Math.floor(Math.random() * this.ingredientOptions.length)];
        this.syrup = this.toppingOptions[Math.floor(Math.random() * this.toppingOptions.length)];
    }

    render() {
        return `
            <div id='ticket${this.ticketNum}' class='ticket ticket-slide-in'>
                <img class='clothespin' src='./img/clothespin.png'/>
                <div class='ticket-contents'>
                    <img id='iceCream${this.ticketNum}' class="iceCream-images" src="./img/ingredients/${this.iceCream}.png"/>
                    <img id='ingredient1${this.ticketNum}' class="ingredient1-images" src="./img/ingredients/${this.ingredient1}.png"/>
                    <img id="ticket${this.ticketNum}" class="ticket-images" alt="Ticket ${this.ticketNum}" aria-label="Ticket ${this.ticketNum}" src="./img/ticket.png"/>
                    <img id='ingredient2${this.ticketNum}' class="ingredient2-images" src="./img/ingredients/${this.ingredient2}.png"/>
                    <img id="'blendIcon${this.ticketNum}" class="blend-icon-images" src="./img/ingredients/BlendIcon2.png"/>
                    <img id='topping1${this.ticketNum}' class="topping1-images" src="./img/ingredients/WhippedCreamIcon.png"/>
                    <img id='topping2${this.ticketNum}' class="topping2-images" src="./img/ingredients/${this.syrup}Icon.png"/>
                    <div class="time-bar-shell">
                        <div class="time-bar"></div>
                    </div>
                    <div class="red-x">❌</div>
                </div>
            </div>
        `;
    }
}

export default Ticket;