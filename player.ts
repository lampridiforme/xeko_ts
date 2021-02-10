class Deck {
}

export class Player {
    // maybe pull this out into a PlayerData?
    private name: string;
    private age: number; // needed for zodiac card and play order
    // simply store an array of ids for card data lookup
    private deck: Array<number>;
    // an array of function/card lookup ids for sunrise effects
    private sunriseEffects: Set<number>;

    public addSunriseEffect(id: number): void {
        this.sunriseEffects.add(id);
    }

    public get Name(): string {
        return this.name;
    }

    public get Age(): number {
        return this.age;
    }
}