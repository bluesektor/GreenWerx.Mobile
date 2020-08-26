
export class Measure {
    public name: string;
    public start: number;
    public end: number;
    public total: number;
    public index: number;
}

export class Timer {

    constructor() {}
    public static times  = [];

  //  readonly start = performance.now();

    public static start(name: string): number {
        const t = new Measure();
        t.name = name;
        t.start = performance.now();
        Timer.times.push(t);
        t.index = Timer.times.length - 1;
        Timer.times[t.index].index = t.index;
        return t.index;
    }


    public static stop(index: number) {
        const end = performance.now();
        if (index < 0 || index > Timer.times.length) {
            return;
        }

        Timer.times[index].end = end;
        const time = end - Timer.times[index].start;
        Timer.times[index].total = time;
        console.log('Timer:', Timer.times[index].name, 'finished in', Math.round(time), 'ms');

       // for(let i = 0; i < Timer.times.length; i++ ){
           // if(Timer.times[i].name === name) {

         //   }
       // }

    }

   // stop() {
  //      const time = performance.now() - this.start;
  //      console.log('Timer:', this.name, 'finished in', Math.round(time), 'ms');
  //  }
}
