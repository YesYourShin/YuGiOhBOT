require('dotenv').config();
const token  = process.env.TOKEN;
const dictionary = require('./dictionary');
const anyWords = require('./anywords');
const discord = require('discord.js'); // discord.js를 import 해줍니다.
const app = new discord.Client(); // discord.Client 인스턴스 생성

const cardNameDict = dictionary.makeDictionary('dict/card-name.txt');
const cardDescDict = dictionary.makeDictionary('dict/card-desc.txt');

app.on('ready', () => { // 여기서 사용되는 Arrow Function은 콜백함수입니다.
    console.log(`I am Ready ${app.user.tag}`); // Bot이 준비가 되면 실행할 콜백함수입니다.
});

app.on('message', msg => {
    if(msg.author.bot) { // 메세지를 보낸 사용자가 봇일 경우 중단
        return;
    }

    if(msg.content.startsWith('랜덤카드')) {// 메세지가 '랜덤카드'로 시작하는지 검사
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
        const text = `[${name}]\n\n${description}`; // 카드 이름 줄바꿈 줄바꿈 효과 를 저장
        
        msg.channel.send(text); // 저장한 카드 이름고 효과를 메세지로 보냄
    }

    // 채팅에서 메세지가 들어왔을 때 실행할 콜백함수입니다.
    // indexOf('') !== -1을 이용해서 메세지 속에 단어가 있는지 확인

});

app.login(token); 