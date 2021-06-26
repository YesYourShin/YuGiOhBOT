const fs = require('fs');

function makeDictionary(path) {
    const content = fs.readFileSync(path).toString(); // 파일을 불러와서 스트링 변환시켜 변수에 저장
    const sentences = content.split(/\r?\n/); // 변수에 저장된 문자열을 줄바꿈을 기준으로 끊어서 배열로 저장(각각의 문장을 배열로 저장)
    const dictionary = {}; // 빈 사전
    sentences.unshift('<START>'); // '<START>'를 배열의 맨 앞에 추가함
    

    for(let i in sentences) { // 기본 for 문에 대응됨
        const words = sentences[i].split(' '); 
        // sentences에 저장된 문장들을 하나씩 가져와서(위 for문) 공백을 기준으로 끊어서 (단어를) 배열로 보관
        
        for (let j = 0; j < words.length-1; j++) { // next 변수 때문에 마지막에서 두번째까지만 반복해야 됨
            const now = words[j]; 
            const next = words[j+1];
            // 연속으로 나온 단어를 쌍으로 가져옴
            
            if(!dictionary[now]) { // dictionary에 now에 저장된 단어가 존재하지 않을 경우
                
                dictionary[now] = []; 
            }
            dictionary[now].push(next); 
    
        }
    }
    
    return dictionary;
}

module.exports = {makeDictionary}; // 파일 외부로 노출
// module.exports = {makeDictionary: makeDictionary}; 와 같음