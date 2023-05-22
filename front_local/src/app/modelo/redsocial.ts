export class Redsocial {
    id?: number;
    nombreRedS: string;
    img: string;
    link: string;  
    
    constructor(nombreRedS: string, img: string, link: string) {
        this.nombreRedS = nombreRedS;
        this.img = img; 
        this.link = link;
    }
}
