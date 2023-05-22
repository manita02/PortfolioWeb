export class Habilidades {
    id?: number; 
    nombreH: string; 
    porcentaje: number; 
    img: string; 

    constructor(nombreH: string, porcentaje: number, img: string){
        this.nombreH = nombreH; 
        this.porcentaje = porcentaje; 
        this.img = img;
    }

}
