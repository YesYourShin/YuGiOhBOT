require('dotenv').config();
const token  = process.env.TOKEN;
const dictionary = require('./dictionary');
const anyWords = require('./anywords');
const discord = require('discord.js'); // discord.js를 import 해줍니다.
const app = new discord.Client(); // discord.Client 인스턴스 생성

const cardNameDict = dictionary.makeDictionary('dict/card-name.txt');
const cardDescDict = dictionary.makeDictionary('dict/card-desc.txt');

const fs = require('fs');
const {generateCard} = require('./ygo-card');

app.on('ready', () => { // 여기서 사용되는 Arrow Function은 콜백함수입니다.
    console.log(`I am Ready ${app.user.tag}`); // Bot이 준비가 되면 실행할 콜백함수입니다.
});

app.on('message', msg => {
    if(msg.author.bot) { // 메세지를 보낸 사용자가 봇일 경우 중단
        return;
    }

    if(msg.content.startsWith('랜덤카드')) {// 메세지가 '랜덤카드'로 시작하는지 검사
 
        
//////////////////////////////////////////////////////////////////////////////////////////

        // 카드 종류
        // const cardTypeList = ['몬스터', '마법', '함정'];
        const cardTypeList = ['몬스터'];
        const cardType = rd(cardTypeList);

//////////////////////////////////////////////////////////////////////////////////////////


    // 몬스터 카드 종류
    // const monsterCardTypeList = ['일반', '효과', '의식', '융합', '싱크로', '엑시즈', '툰', '스피릿', '유니온', '듀얼', '튜너', '리버스', '펜듈럼', '링크']
    // const monsterCardType = (cardType == '몬스터') ? rd(monsterCardTypeList) : "";

    // const monsterCardTypes = monsterCardType(cardType);
    // for(let i = 0; i < monsterCardTypes.length; i++) {
    //     if(monsterCardTypeArr[i] != '') {
    //         monsterCardTypeArr[i] = monsterCardTypes[i];
    //     }else {
    //         break;
    //     }
    // }
    // console.log(monsterCardTypes);
        // if (cardType == '몬스터') {
        //     const monsterCardType1List = ['효과', ''];
        //     const monsterCardType1 = rd(monsterCardType1List);
        //     const monsterCardType2List = (monsterCardType1List == '효과')  ? ['툰', '스피릿', '유니온', '듀얼', '튜너', '리버스', '펜듈럼'] :
        //                                 (monsterCardType1List == '') ? ['일반', '효과', '툰', '스피릿', '유니온', '듀얼', '튜너', '리버스', '펜듈럼', ''] : '';
        //     const monsterCardType2 = rd(monsterCardType2List);
        //     const monsterCardType3List = (monsterCardType2List == '일반') ? ['툰', '스피릿', '유니온', '듀얼', '튜너', '리버스'] :
        //                                 (monsterCardType2List == '효과') ? ['툰', '스피릿', '유니온', '듀얼', '튜너', '리버스', '특수소환', '의식', '융합', '싱크로', '엑시즈', '펜듈럼', '링크'] : 
        //                                 (monsterCardType2List == ('툰' || '스피릿' || '튜너'))? '특수소환' : ['일반', '효과', '의식', '융합', '싱크로', '엑시즈', '펜듈럼', '링크'];
        //     const monsterCardType3 = rd(monsterCardType2List);
        //     return result = [monsterCardType3, monsterCardType2, monsterCardType1];
        // }

        // 몬스터 카드 종류
        const monsterCardTypes = getMonsterCardType(cardType);

//////////////////////////////////////////////////////////////////////////////////////////

        // 카드 속성
        const attribute = getAttribute(cardType);

//////////////////////////////////////////////////////////////////////////////////////////

        // 몬스터 종족
        const monsterType = getMonsterType(cardType);

//////////////////////////////////////////////////////////////////////////////////////////

        // 레벨, 랭크 수
        const stars = getStars(cardType);

//////////////////////////////////////////////////////////////////////////////////////////
        
        // 마법 종류
        const spellType = getSpellType(cardType);

//////////////////////////////////////////////////////////////////////////////////////////

        // 함정 카드 종류
        const trapType = getTrapType(cardType);

//////////////////////////////////////////////////////////////////////////////////////////

        // 스케일
        const pendulumScale = getPendulumScale(monsterCardTypes);
        const pendulumScaleMin = pendulumScale[0];
        const pendulumScaleMax = pendulumScale[1];
        
//////////////////////////////////////////////////////////////////////////////////////////

        // 링크
        const link = getLinkArrows(cardType, monsterCardTypes);
        const linkArrows = link[0];
        const linkNumber = link[1];
        console.log('링크 ' + linkArrows +' '+ linkNumber);

//////////////////////////////////////////////////////////////////////////////////////////
        
        // 텍스트 생성
        const name = anyWords.cardName(cardNameDict, 2, 5); // 카드이름 파일 위치, 최소 길이, 랜덤 길이를 지정해서 랜덤으로 뽑힌 이름을 저장
        // .replace()에 정규식을 사용할 수 있다.
        // 정규 표현식이란 문자 검색과 교체에 사용되는 패턴
        // 슬래시 "/"는 정규표현식을 생성한다는 것을 의미
        // str.replace(regexp, replacement)를 사용하면 문자열 중 regexp에 일치하는 부분 문자열을 replacement로 교체 가능한데
        // 정규 표현식에 플래그 g가 붙으면 패턴과 일치하는 모든 부분 문자열이 교체됨
        // 데이베이스에서 문자를 가져와서 화면에 랜더링 해줄 때는 개행 처리를 해주어야 한다.
        // 엔터로 개행한 것은 \n으로 들어간다.
        // 백슬래시를 그대로 표현하려면 '\\'를 입력하면 된다.

        // anyWords에 generate 함수에 (카드 파일 위치, 키워드, 최소 길이, 랜덤 길이) 입력
        // .replace()로 더미 줄바꿈 \n을 검색해서 줄바꿈으로 바꾼 다음 
        // 나온 배열을 descrption 변수에 저장
        const description = anyWords.generate(cardDescDict, '<START>', 10, 100).replace(/\\n/g, '\n');


        // const text = `[${name}]\n\n${description}`; // 카드 이름 줄바꿈 줄바꿈 효과 를 저장
        // const text = new discord.MessageEmbed()
        //     .setColor('#0099ff')
        //     .setTitle(name+'          '+attribute)
        //     .setDescription('레벨: '+stars+`[${monsterCardTypes}]\n`+description);

////////////////////////////////////////////////////////////////

        // const broly = {
        //     name: name,
        //     nameStyle: 'white',
        //     text: description,
        //     artPath: 'broly.jpg',
        //     type: 'standard',
        //     monsterType: monsterType + ' / ' + monsterCardTypes,
        //     attribute: attribute,
        //     level: stars,
        // }
        
        // generateCard(broly).then((buffer) => {msg.channel.send(buffer)})

////////////////////////////////////////////////////////////////

        // msg.channel.send({files: ['./out.png']}); // 저장한 카드 이름과 효과를 코드 블럭 메세지로 보냄
    }

    // 채팅에서 메세지가 들어왔을 때 실행할 콜백함수입니다.
    // indexOf('') !== -1을 이용해서 메세지 속에 단어가 있는지 확인

});

function rd(value) {
    const random = Math.floor(Math.random() * value.length);
    return value[random];
}

function getMonsterCardType(cardType) {
    const monsterCardTypes = ['특수소환', '링크', '효과'];
    // let monsterCardTypes = '';
    // if (cardType == '몬스터') {
    //     const monsterCardType1List = ['효과', ''];
    //     const monsterCardType1 = rd(monsterCardType1List);
    //     const monsterCardType2List = (monsterCardType1 == '효과') ? ['툰', '스피릿', '튜너', '리버스', '펜듈럼'] :
    //                                 (monsterCardType1 == '') ? ['일반', '효과'] : '';
    //     const monsterCardType2 = rd(monsterCardType2List);
    //     const monsterCardType3List = (monsterCardType2 == '일반') ? ['튜너', '펜듈럼'] :
    //                                 (monsterCardType2 == '효과') ? ['툰', '스피릿', '유니온', '듀얼', '튜너', '리버스', '특수소환', '의식', '융합', '싱크로', '엑시즈', '펜듈럼', '링크'] : 
    //                                 (monsterCardType2 == '툰' || monsterCardType2 == '스피릿') ? ['특수소환'] : 
    //                                 (monsterCardType2 == '튜너') ? ['유니온', '특수소환', '융합'] : 
    //                                 (monsterCardType2 == '리버스') ? ['펜듈럼'] : 
    //                                 (monsterCardType2 == '펜듈럼') ? ['특수소환', '융합', '싱크로', '엑시즈'] : ['일반', '효과', '의식', '융합', '싱크로', '엑시즈', '펜듈럼', '링크'];
                                    
    //     const monsterCardType3 = rd(monsterCardType3List);
    //     const result = [monsterCardType3, monsterCardType2, monsterCardType1];
    //     for(let i = 0; i < result.length; i++) {
    //         if(result[i] != '') {
    //             monsterCardTypes = monsterCardTypes+result[i];
    //             monsterCardTypes = monsterCardTypes + ' / ';
    //             if (i == 2) {
    //                 monsterCardTypes = monsterCardTypes.slice(0, -2);
    //             }
    //         }else if (result[i] == ''){
    //             monsterCardTypes = monsterCardTypes.slice(0, -2);
    //             break;
    //         }
    //     } 
    // }

    return monsterCardTypes;
}

function getAttribute(cardType) {
    const attributeList = ['어둠', '빛', '땅', '물', '화염', '바람', '신'];
    const attribute = (cardType == '몬스터') ? rd(attributeList) : 
                        (cardType == '마법') ? '마법' : 
                        (cardType == '함정') ? '함정' : '' ;

    return attribute;
}

function getMonsterType(cardType) {
    const monsterTypeList = ['곤충족', '공룡족', '기계족', '드래곤족', '마법사족', '물족', '번개족', '비행야수족', '사이버스족', '사이킥족', '식물족' ,'악마족' ,'암석족', '야수족', '야수전사족', '어류족', '언데드족', '전사족', '천사족', '파충류족', '해룡족', '화염족', '환룡족', '환신야수족', '창조신족']
    const monsterType = (cardType == '몬스터') ? rd(monsterTypeList) : "";

    return monsterType;
}

function getStars(cardType) {
    const stars = (cardType == '몬스터') ? Math.floor(Math.random() * 12)+1 : "";

    return stars;
}

function getSpellType(cardType) {
    const spellTypeList = ['일반', '지속', '장착', '속공', '필드', '의식'];
    const spellType = (cardType == '마법') ? rd(spellTypeList) : "";

    return spellType;
}

function getTrapType(cardType) {
    const trapTypeList = ['일반', '지속', '카운터'];
    const trapType = (cardType == '함정') ? rd(trapTypeList) : "";

    return trapType;
}

function getPendulumScale(monsterCardTypes) {
    let min = 0;
    let max = 0;

    if (monsterCardTypes.includes('펜듈럼')) {
        function RandomScale() {
            return Math.floor(Math.random() * 14)
        };

        min = RandomScale();
        max = RandomScale();

        if (min > max) {
            let num = min;
            min = max;
            max = mum;
            
        }

        // for (let i = 0; i < 2; i++) {
        //     let pendulumScale = Math.floor(Math.random() * 14);
        //     if (i == 0) {
        //         pendulumScaleA = pendulumScale;
        //     }else if(i == 1) {
        //         pendulumScaleB = pendulumScale;
        //         if(pendulumScaleA > pendulumScaleB) {
        //             pendulumScale = pendulumScaleA;
        //             pendulumScaleA = pendulumScaleB;
        //             pendulumScaleB = pendulumScale;
        //         }
        //     }
        // }
        // return [pendulumScaleMix, pendulumScaleMax];
        
    }

    return [min, max];
}

function getLinkArrows(cardType, monsterCardTypes) {
    // 링크마커 방향 리스트
    const linkArrowsList = ['↖', '↑', '↗', '←', '→', '↙', '↓', '↘'];
                    
    // 링크 수
    const linkNumber = (cardType == '몬스터') ? Math.floor(((Math.random()+1) * (linkArrowsList.length-1))) : "";

    // 마커 방향
    const linkArrows = [];

    if(monsterCardTypes.includes('링크')) {            
        // 링크 마커 방향 중복 제거해서 링크 수만큼 넣기
        for (let i = 0; i < linkNumber; i++) {
            let Arrows;
            do{
                Arrows = rd(linkArrowsList);
                // console.log(Arrows);
            } while(linkArrows.includes(Arrows))
                
            linkArrows.push(Arrows);
        }

            // console.log(linkNumber, linkArrow);
    }
        // console.log(monsterCardTypes, linkNumber, linkArrow);

    return [linkArrows, linkNumber];
}

// function monsterCardType(cardType) {
//     // 몬스터 카드 종류
//     // const monsterCardTypeList = ['일반', '효과', '의식', '융합', '싱크로', '엑시즈', '툰', '스피릿', '유니온', '듀얼', '튜너', '리버스', '펜듈럼', '링크']
//     // const monsterCardType = (cardType == '몬스터') ? rd(monsterCardTypeList) : "";
//     let monsterCardTypes = ' ';
//     if (cardType == '몬스터') {
//         const monsterCardType1List = ['효과', ''];
//         const monsterCardType1 = rd(monsterCardType1List);
//         const monsterCardType2List = (monsterCardType1 == '효과') ? ['툰', '스피릿', '튜너', '리버스', '펜듈럼'] :
//                                     (monsterCardType1 == '') ? ['일반', '효과'] : '';
//         const monsterCardType2 = rd(monsterCardType2List);
//         const monsterCardType3List = (monsterCardType2 == '일반') ? ['튜너', '펜듈럼'] :
//                                     (monsterCardType2 == '효과') ? ['툰', '스피릿', '유니온', '듀얼', '튜너', '리버스', '특수소환', '의식', '융합', '싱크로', '엑시즈', '펜듈럼', '링크'] : 
//                                     (monsterCardType2 == '툰' || monsterCardType2 == '스피릿') ? ['특수소환'] : 
//                                     (monsterCardType2 == '튜너') ? ['유니온', '특수소환', '융합'] : 
//                                     (monsterCardType2 == '리버스') ? ['펜듈럼'] : 
//                                     (monsterCardType2 == '펜듈럼') ? ['특수소환', '융합', '싱크로', '엑시즈'] : ['일반', '효과', '의식', '융합', '싱크로', '엑시즈', '펜듈럼', '링크'];
                                    
//         const monsterCardType3 = rd(monsterCardType3List);
//         const result = [monsterCardType3, monsterCardType2, monsterCardType1];
//         for(let i = 0; i < result.length; i++) {
//             if(result[i] != '') {
//                 monsterCardTypes = monsterCardTypes+result[i];
//                 monsterCardTypes = monsterCardTypes + ' / ';
//             }else if (result[i] == ''){
//                 break;
//             }
            
            
//         }return monsterCardTypes = monsterCardTypes.slice(0, -2);
        
//     }
// }

app.login(token); 