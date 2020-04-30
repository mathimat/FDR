

let body = document.getElementsByName('body');
let csvFileButtonDoc = document.getElementById('csvFileButton');

let loader = document.getElementById('loader');
loader.hidden=true;

csvFileButtonDoc.addEventListener('change',fileHandler,false);


function fileHandler() {
    //start loader animation:
    loader.hidden=false;

    const fileList = this.files;
    //allow multidrop
    for(let i=0;i<fileList.length;i++){
        const reader = new FileReader();


        reader.readAsText(fileList[i]);
        fileList[i].text().then(text=>{
            const obj = csvToObject(text);
            let ready = false;
            
            //change emty field to 0;
            obj.forEach((el,index)=>{
                for(const prop in el){
                    if(el[prop]==''){
                        obj[index][prop]=0;
                    }
                }
            });

            //remove datapoints without position:
            for(let j=0;j<obj.length;j++){
                if(obj[j]['Latitude'] == '0'){
                    obj.splice(j,1);
                }
            }
            const startDate = dateFromG1000(obj[0]['Lcl Date'],obj[0]['Lcl Time']);
            const fileName = fileList[i].name.split('.')[0];

            //FDR syntax:
            let header = [
                'COMM:flight data from G1000',
                'ACFT:Aircraft/Laminar Research/Cessna 172/c172.acf',
                'TAIL:LN-PFA',
                'DATE:'+xPlaneDate(startDate),
                'TIME:'+xPlaneTime(startDate),
                'PRESS:'+obj[1000]['BaroA'],
                'TEMP:'+cToF(obj[1000]['OAT']),
                //'WIND: '+obj[1000]['WndDr']+','+obj[1000]['WndSpd'],
            ];
            
            let printFile='';
            header.forEach((el)=>{
                printFile+=el+'\n';
            });
            obj.forEach((el)=>{
                let tmpStr = 'DATA:';
                //time since start
                tmpStr+=timeSinceStart(startDate,dateFromG1000(el['Lcl Date'],el['Lcl Time']))+',';
                //oat in c
                tmpStr+=el['OAT']+',';
                //lon deg
                tmpStr+=el['Longitude']+',';
                //lat deg
                tmpStr+=el['Latitude']+',';
                //h amsl ft
                tmpStr+=el['AltGPS']+',';
                //radio alt
                tmpStr+='0,';
                //rad alt
                tmpStr+='0,';
                //aileron ratio
                tmpStr+='0,';
                //elevator ratio
                tmpStr+='0,';
                //rudder ratio
                tmpStr+='0,';
                //pitch degrees
                tmpStr+=el['Pitch']+',';
                //roll degrees
                tmpStr+=el['Roll']+',';
                //heading degrees TRUE
                tmpStr+=el['HDG']+',';
                //KIAS
                tmpStr+=el['IAS']+',';
                //VVI ftmin
                tmpStr+=el['VSpd']+',';
                //slipdegrees
                tmpStr+='0,';
                //turn slip indicator
                tmpStr+='0,';
                //machNumb
                tmpStr+=machNumb(el['TAS'],el['OAT']);
                //AoA
                tmpStr+='0,';
                //stallWarn
                tmpStr+='0,';
                //flaps request
                tmpStr+='0,';
                //falp actual
                tmpStr+='0,';
                //slats 
                tmpStr+='0,';
                //speedbrakes
                tmpStr+='0,';
                //gearHandle
                tmpStr+='0,';
                //Ngear
                tmpStr+='0,';
                //Lgear
                tmpStr+='0,';
                //Rgear
                tmpStr+='0,';
                //elevTrim
                tmpStr+='0,';
                //nav1 freq:
                tmpStr+=frequencyConv(el['NAV1'])+',';
                //nav2 freq:
                tmpStr+=frequencyConv(el['NAV2'])+',';
                //nav 1 type 3=vor:
                tmpStr+='3,';
                //nav 2 type 3=vor:
                tmpStr+='3,';
                //obs1
                tmpStr+=el['CRS']+',';
                //obs2
                tmpStr+=el['CRS']+',';
                //dme1
                tmpStr+='0,';
                //dme2
                tmpStr+='0,';
                //nav1 hdef
                tmpStr+=el['HCDI']+',';
                //nav2 hdef
                tmpStr+=el['HCDI']+',';
                //nav1 tofrom
                tmpStr+='0,';
                //nav2 to from
                tmpStr+='0,';
                //nav1 v-def:
                tmpStr+=el['VCDI']+',';
                //nav2 v-def:
                tmpStr+=el['VCDI']+',';
                //om:
                tmpStr+='0,';
                //mm:
                tmpStr+='0,';
                //im:
                tmpStr+='0,';
                //flight director on/off:
                tmpStr+='0,';
                //fdir pitch:
                tmpStr+='0,';
                //fdir roll:
                tmpStr+='0,';
                //ap kts/mach kts=0:
                tmpStr+='0,';
                //ap hdg mode (hdg=1):
                tmpStr+='1,';
                //ap alt mode:
                tmpStr+='0,';
                //ap hnav:
                tmpStr+='0,';
                //ap vnav:
                tmpStr+='0,';
                //ap glideslope:
                tmpStr+='0,';
                //ap backcourse:
                tmpStr+='0,';
                //ap speed sel kts/mach:
                tmpStr+='0,';
                //ap hdg sel:
                tmpStr+='0,';
                //ap vvi sel:
                tmpStr+='0,';
                //ap alt sel:
                tmpStr+='0,';
                //baro setting inhg:
                tmpStr+=el['BaroA']+',';
                //DH
                tmpStr+='0,';
                //master caution
                tmpStr+='0,';
                //master warning
                tmpStr+='0,';
                //GPWS
                tmpStr+='0,';
                //MAP MODE
                tmpStr+='0,';
                //MAP range
                tmpStr+='0,';
                //Throttle ratio
                tmpStr+=el['E1 %Pwr']+',';
                //prop commanded RPM
                tmpStr+=el['E1 RPM']+',';
                //actual RPM
                tmpStr+=el['E1 RPM']+',';
                //actual prop pitch
                tmpStr+='0,';
                //N1
                tmpStr+=el['E1 %Pwr']+',';
                //N2
                tmpStr+=el['E1 %Pwr']+',';
                //MPR
                tmpStr+='0,';
                //EPR
                tmpStr+='0,';
                //torque
                tmpStr+='0,';
                //fuel flow (lbs/hr)
                tmpStr+=usgToLb(el['E1 FFlow'])+',';
                //ITT
                tmpStr+='0,';
                //EGT
                tmpStr+='0,';
                //CHT
                tmpStr+=el['E1 OilT']+',';

                //tmpStr+=el['']+',';
                printFile+=tmpStr+'\n';
            });
            download(fileName,printFile);
            //kill loader animation:
            loader.hidden=true;
        });
    }
}



function csvToObject(csv){
    const lines = csv.split("\n");
    let returnObject = [];
    
    //const headerLineOne = lines[1].split(",");
    //const headerLineTwo = lines[2].split(",");
    //let header = headerLineOne.concat(headerLineTwo);


    //trim spaces in header
    const header = lines[2].split(",");
    for(let i=0;i<header.length;i++){
        header[i]=header[i].trim();
    }
    //first dataline is line 3
    for(let i=3;i<lines.length;i++){
        const lineRaw = lines[i];
        const lineArr = lineRaw.split(",");
        let obj = {}
        //fix undefined data
        for(let j=0;j<header.length;j++){
            if(lineArr[j]== undefined){
                lineArr[j]='';
            }
            obj[header[j]] = lineArr[j].trim();
            if(lineArr[j]==''){
                lineArr[j]='0';
            }
        }
        returnObject.push(obj);
    }
    return returnObject;
}


function cToF(c){
    return c*1.8+32;
}

function hPaToINHG(hPa){
    return hPa*0.030;
} 

function xPlaneDate(date){
    return pad(date.getDate())+'/'
        +pad(date.getMonth())+'/'
        +date.getFullYear();
}
function xPlaneTime(date){
    return pad(date.getHours())+':'
        +pad(date.getMinutes())+':'
        +pad(date.getSeconds());
}

function dateFromG1000(date,time){
    return new Date(date+' '+time+' UTC');
}


function timeSinceStart(start,now){
    const sec = (now.getTime()-start.getTime())/1000;
    return round(sec,1);
}

function seaLevelTemp(temp,alt){
    return temp + 1.94*alt/1000;
}


function pad(n){
    //add leading zero
    return n<10 ? '0'+n : n;
}

function round(numb,decimals){
    const mult = Math.pow(10,decimals || 0);
    return Math.round(numb*mult)/mult;
}

function download(fileName,content){
    let el = document.createElement('a');
    el.setAttribute('href','data:text/plain;charset=utf-8,'+
        encodeURIComponent(content));
    el.setAttribute('download',fileName+'.fdr');
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
}


function machNumb(tas,oat){
    const speedOfSound = Math.sqrt(
        (1.4*8.314*(parseFloat(oat)+273.15))/(28.95)
    );
    return round(parseFloat(tas)/speedOfSound,5);
}


function frequencyConv(gFreq){
    return gFreq.replace('.','');
}

function usgToLb(usg){
    //jet a-1
    return usg*6.7;
}


class Average{
    constructor(){
        this.sum=0;
        this.n=0;
        this.runAv=0;
        this.numbs=[];
    }
    add(value){
        this.n++;
        this.sum+=value;
        this.runAv = this.sum/this.n;
        this.numbs.push(val);
        return this.runAv;
    }
    get average(){
        return this.runAv;
    }
    reset(){
        this.constructor();
    }
}


const fdrHeader = [
    'time secon',
    'temp deg C',
    'lon degree',
    'lat degree',
    'h msl ft',
    'h rad ft',
    'ailn ratio',
    'elev ratio',
    'rudd ratio',
    'ptch deg',
    'roll deg',
    'hdng TRUE',
    'speed KIAS',
    'VVI ft/mn',
    'slip deg',
    'turn deg',
    'mach #',
    'AOA deg',
    'stall warn',
    'flap rqst',
    'flap actul',
    'slat ratio',
    'sbrk ratio',
    'gear handl',
    'Ngear down',
    'Lgear down',
    'Rgear down',
    'elev trim',
    'NAV-1 frq',
    'NAV-2 frq',
    'NAV-1 type',
    'NAV-2 type',
    'OBS-1 deg',
    'OBS-2 deg',
    'DME-1 nm',
    'DME-2 nm',
    'NAV-1 h-def',
    'NAV-2 h-def',
    'NAV-1 v-def',
    'NAV-2 v-def',
    'OM over',
    'MM over',
    'IM over',
    'f-dir 0/1',
    'f-dir ptch',
    'f-dir roll',
    'ktmac 0/1',
    'throt mode',
    'hdg mode',
    'alt-mode',
    'hnav mode',
    'glslp mode',
    'back mode',
    'speed selec',
    'hdg selec',
    'vvi selec',
    'alt selec',
    'baro in hg',
    'DH ft',
    'Mcaut 0/1',
    'Mwarn 0/1',
    'GPWS 0/1',
    'Mmode 0-4',
    'Mrang 0-6',
    'throt ratio',
    'prop cntrl',
    'prop rpm',
    'prop deg',
    'N1 %',
    'N2 %',
    'MPR inch',
    'EPR ind',
    'torq ft*lb',
    'FF lb/hr',
    'ITT deg C',
    'EGT deg C',
    'CHT deg C',
];

