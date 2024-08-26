// Interfaz Strategy para aplicar descuentos
interface DiscountStrategy {
    applyDiscount(price: number): number;
}

// Contexto que utiliza una estrategia de descuento
class ShoppingCart {
    private discountStrategy: DiscountStrategy;

    constructor(discountStrategy: DiscountStrategy) {
        this.discountStrategy = discountStrategy;
    }

    public setDiscountStrategy(discountStrategy: DiscountStrategy) {
        this.discountStrategy = discountStrategy;
    }

    public calculateFinalPrice(originalPrice: number): void {
        const finalPrice = this.discountStrategy.applyDiscount(originalPrice);
        console.log(`Precio final después del descuento: $${finalPrice.toFixed(2)}`);
    }
}

// Estrategias de descuento concretas
class PercentageDiscount implements DiscountStrategy {
    private percentage: number;

    constructor(percentage: number) {
        this.percentage = percentage;
    }

    public applyDiscount(price: number): number {
        return price * (1 - this.percentage / 100);
    }
}

class FixedAmountDiscount implements DiscountStrategy {
    private discountAmount: number;

    constructor(discountAmount: number) {
        this.discountAmount = discountAmount;
    }

    public applyDiscount(price: number): number {
        return price - this.discountAmount;
    }
}

class NoDiscount implements DiscountStrategy {
    public applyDiscount(price: number): number {
        return price; // Sin descuento
    }
}

// Cliente
const cart = new ShoppingCart(new PercentageDiscount(10));
console.log('Cliente: Aplicando un descuento del 10%.');
cart.calculateFinalPrice(100);


console.log('Cliente: Cambiando a un descuento de cantidad fija de $15.');
cart.setDiscountStrategy(new FixedAmountDiscount(15));
cart.calculateFinalPrice(100);


console.log('Cliente: Sin descuento.');
cart.setDiscountStrategy(new NoDiscount());
cart.calculateFinalPrice(100);
