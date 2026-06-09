const names = ["小明","小華","小美","小強","小麗","小安","小杰","小惠","小哲","小珊"];
const needs = ["米飯","麵包","水","保暖外套","書包","藥品","牙膏","肥皂","作業本","雨傘"];
const wants = ["機器人玩具","糖果","貼紙","電動","洋娃娃","模型車","卡通手錶","彈珠","拼圖","遙控車"];
const sources = ["生日紅包","壓歲錢","零用錢","好表現獎金","長輩給的獎勵"];
const amounts = [100,200,300,500,1000];
let samples = [];
for (let i = 1; i <= 500; i++) {
  let name = names[i % names.length];
  let amount = amounts[i % amounts.length];
  let source = sources[i % sources.length];
  let need = needs[i % needs.length];
  let want = wants[i % wants.length];
  let save = Math.floor(amount/2);
  let consume = Math.floor(amount/3);
  let share = amount - save - consume;
  let story = `${name}拿到了${amount}元${source}。\n${name}好開心，想立刻去買${want}。\n媽媽說：「我們先來想想什麼是需要，什麼是想要吧！」\n需要的東西是生活不可少的，例如${need}。\n想要的東西是有了會快樂，但不買也沒關係，例如${want}。\n${name}學會先把錢分成三份：儲蓄、消費、分享。\n${name}決定存${save}元，用${consume}元買${need}，剩下${share}元幫助別人。\n學會管理金錢，比擁有許多錢更重要！`;
  let quizzes = [];
  for (let q = 1; q <= 3; q++) {
    let qContent = `> ${name}: 來挑戰一下理財知識吧！\n\n? 「${need}」是哪一類東西？\n1) 需要的\n2) 想要的\n3) 昂貴的\n= 1\n\n> 理財小老師: 沒錯！${need}是生活必需的。\n\n? 故事中，金錢分成哪三份？\n1) 儲蓄、消費、分享\n2) 花掉、存起來、送人\n3) 買食物、買玩具、捐錢\n= 1\n\n> 理財小老師: 正確！儲蓄、消費、分享。\n\n? 把錢存起來最主要的好處是什麼？\n1) 可以變有錢人\n2) 永遠不要花\n3) 以後有急用或買更想要的東西\n= 3\n\n> 理財小老師: 對，存錢能應急或實現更大的願望。`;
    quizzes.push({
      id: `quiz-${String(i).padStart(3,'0')}-${q}`,
      title: `理財小挑戰 - ${name}的考驗 ${q}`,
      description: `測驗${name}故事中的金錢觀念`,
      category: "生活",
      appType: "t2q_quiz",
      t2qContent: qContent,
      createdBy: "生活教育",
      creatorAvatar: "💰"
    });
  }
  samples.push({
    story: {
      id: `story-${String(i).padStart(3,'0')}`,
      title: `小小理財家 - ${name}的${source}`,
      description: `${name}學會了分清楚需要和想要`,
      category: "生活",
      appType: "story",
      storyContent: story,
      createdBy: "生活教育",
      creatorAvatar: "💰",
      tags: ["理財", "儲蓄", "消費"]
    },
    quizzes: quizzes
  });
}
console.log(JSON.stringify(samples, null, 2));
