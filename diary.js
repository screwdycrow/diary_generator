const fs = require('fs');
const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');
const moment = require('moment');
const utils = require('./utils');
const events = require('./dates')
const facts = require('./facts').facts;


class DiaryGen {
    constructor(specialEvents, options) {
        this.headSize = options.headSize;
        this.subHeadSize = options.subHeadSize;
        this.textSize = options.textSize;
        this.endOfLine = options.endOfLine;
        this.leftMargin = options.leftMargin;
        this.daySpace = options.daySpace;
        this.font = options.font;
        this.color = options.color;
        this.specialEvents = specialEvents;
        this.factNumber = 0;
    }

    createDiary(dates) {
        this.doc = new PDFDocument({
            size: [1748, 2480]
        });
        this.doc.pipe(fs.createWriteStream('diary/diary.pdf')); // write to PDF

        dates.forEach(month => {
            this.createMonth(month)
        })


    }

    end(){
        this.doc.end()
    }
    createMonth(month) {
        month.weeks.forEach(week => {
            this.createWeek(week)
            this.createNotepad(week)
        })

    }

    createNotepad(days) {
        let month = moment(days[0]).format('MMMM')
        this.doc.addPage();
        this.doc.image('templates/diary2.png', 0, 0, {});
        this.addHeader(month);
    }
    createWeek(days) {
        let month = moment(days[0]).format('MMMM')
        this.doc.addPage();
        this.doc.image('templates/diary.png', 0, 0, {});
        this.doc.image('images/'+moment(days[0]).month()+'.png', 1340, 35,{scale:0.6})
        this.addHeader(month);
        let position = 280;
        days.forEach(day => {
            this.addDay(day, position);
            position += this.daySpace;
        })
        this.addWeeklyFact(2290,facts[this.factNumber]);
        this.factNumber++;
    }


    static getWeeklyFact() {
        return fetch('https://catfact.ninja/fact?max_length=150')
            .then(resp => resp.json())
    }

    addWeeklyFact(position, fact) {
       this.doc.text(fact, this.leftMargin+50, position);
    }

    getSpecialEvents(date) {
        return this.specialEvents[date] || []
    }

    addHeader(month) {
        this.doc.font(this.font + '-Bold');
        this.doc.fill('white');
        this.doc.fontSize(70);
        this.doc.text(month.toUpperCase(), 100, 100);
    }

    addDay(day, position) {
        this.doc.fill(this.color);
        //day
        this.doc.font(this.font);
        this.doc.fontSize(this.subHeadSize);
        this.doc.text(`${moment(day).format("dddd D MMMM YYYY")}`, this.leftMargin, position + 50);
        //stroke
        this.addStroke(position);
        //specialEvents

        this.addEvents(position, this.getSpecialEvents(moment(day).format("DD/MM/YY")));
    }

    addStroke(position) {
        this.doc.moveTo(100, position + 40)
            .lineTo(this.endOfLine, position + 40)
            .stroke();
    }

    addEvents(position, events) {
        this.doc.font(this.font);
        this.doc.fontSize(this.textSize);
        this.doc.fill(this.color);
        this.doc.list(events, this.endOfLine + 100, position + 70);
    }
    addExtraPages(number, options){

        for(let i = 0;  i<number; i++){
            this.doc.addPage();
            this.doc.image(options.background, 0, 0, {});
            if(options.header){
                this.addHeader(options.header)
            }
        }
    }

}


let dates = utils.getDates('2019-12-01', '2021-01-01');


let diaryGen = new DiaryGen(events, {
    headSize: 50,
    subHeadSize: 30,
    textSize: 25,
    endOfLine: 1200,
    daySpace: 270,
    leftMargin: 150,
    color: "grey",
    font: "Helvetica",
})


diaryGen.createDiary(dates);
diaryGen.addExtraPages(20, {
    header:"Notes",
    background: "templates/diary2.png",
})

diaryGen.addExtraPages(1, {
    background: "images/p2.png",
})
diaryGen.addExtraPages(1, {
    background: "images/p3.png",
})
diaryGen.addExtraPages(1, {
    background: "images/p4.png",
})
diaryGen.addExtraPages(1, {
    background: "images/p5.png",
})
diaryGen.addExtraPages(1, {
    background: "images/p1.png",
})

diaryGen.end();

