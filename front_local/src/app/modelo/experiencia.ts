export class Experiencia {
    id? : number; 
    nombreE : string; 
    descripcionE : string; 
    img: string; 
    anocomienzo: number;

    constructor(nombreE: string, descripcionE: string, img: string, anocomienzo: number){
        this.nombreE = nombreE; 
        this.descripcionE = descripcionE;
        this.img = img; 
        this.anocomienzo = anocomienzo;  
    }

}
