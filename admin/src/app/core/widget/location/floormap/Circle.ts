
interface iShape {
    draw(any): void;
    getLocation(): any;
    setLocation(width: number, height: number): any;
    x: number;
    y: number;
    color: string;
    lineWidth: number;
}

export class cCircle implements iShape {
    public x: number = 0;
    public text: string;
    public y: number = 0;
    public radius: number = 10;
    public lineWidth: number = 2;
    public color: string = "red";
    constructor(x: number, y: number, radius: number, color: string = 'red', line_width: number = 2, text = "kaushal") {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.lineWidth = line_width;
        this.text = text;
    }
    public draw = (ctx): void => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        ctx.restore();
        // Move it down by half the text height and left by half the text width
        let font = "bold 20px serif";
        ctx.font = font;
        //var width = ctx.measureText(this.text).width;
        //var height = ctx.measureText("w").width; // this is a GUESS of height
       // ctx.fillText(this.text, 200 - (width / 2), 200 + (height / 2));
        ctx.fillText(this.text, this.x - 30, this.y + 10);
    }
    public getLocation = (): any => {
        return this.x + ' and ' + this.y;
    }
    public setLocation = (x, y): any => {
        this.x = x;
        this.y = y;
    }
    public setRadius = (radius): any => {
        this.radius = radius;
    }
    public addText(text) {
        this.text = text;
    }
}