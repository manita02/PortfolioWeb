export class Proyecto {

    id?: number;
    nombreE: string;
    descripcionE: string;
    link: string; 
    img: string; 
    anocomienzo: number;

    constructor(nombreE: string, descripcionE: string, link: string, img: string, anocomienzo: number) {
        this.nombreE = nombreE;
        this.descripcionE = descripcionE;
        this.link = link;
        this.img = img; 
        this.anocomienzo = anocomienzo; 
    }


}
