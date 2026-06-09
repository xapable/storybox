const { writeFileSync } = require('fs');
const path = require('path');

const names = {
  English: ["Emma", "Leo", "Mia", "Tom", "Zoe", "Sam", "Lily", "Max", "Ava", "Ben"],
  Indonesian: ["Rina", "Budi", "Dewi", "Ani", "Sari", "Ahmad", "Lina", "Bayu", "Cinta", "Eko"],
  Chinese: ["小美", "小刚", "小丽", "小明", "小芳", "小华", "小静", "小强", "小娜", "小伟"]
};

const topics = {
  Stock: {
    storyTemplates: {
      English: "{name} gave ${amount} to {friend} for a {business}. In return, {friend} shared {profit}% of profits. {name} learned that a stock means owning a small piece of a company. Over time, the {business} grew, and {name}'s ${amount} became ${final}. Patience and research make investing rewarding.",
      Indonesian: "{name} memberikan Rp{amount} kepada {friend} untuk {business}. Sebagai imbalan, {friend} berbagi {profit}% keuntungan. {name} belajar bahwa saham berarti memiliki sebagian kecil perusahaan. Seiring waktu, {business} berkembang, dan Rp{amount} {name} menjadi Rp{final}. Kesabaran dan riset membuat investasi bermanfaat.",
      Chinese: "{name}给了{friend}{amount}元做{business}生意。作为回报，{friend}分享{profit}%的利润。{name}学到股票就是拥有公司的一小部分。随着时间的推移，{business}发展了，{name}的{amount}元变成了{final}元。耐心和研究让投资有价值。"
    },
    quizBase: {
      English: [
        { q: "What does owning a stock mean?", o: ["Owning a small part of a company", "Lending money to a company", "Getting free products"], a: 0, f: "Owning a stock makes you a partial owner." },
        { q: "If the company does well, your stock value usually...", o: ["Stays the same", "Goes up", "Goes down"], a: 1, f: "A successful company tends to increase your stock's worth." },
        { q: "What is a wise approach to stock investing?", o: ["Sell immediately after buying", "Hold for years with patience", "Only buy very cheap stocks"], a: 1, f: "Patience and long-term thinking are key." },
        { q: "What does 'diversify' mean in stocks?", o: ["Put all money in one stock", "Spread money across different companies", "Never buy stocks"], a: 1, f: "Diversification reduces risk." },
        { q: "What helped {name}'s investment grow?", o: ["The business became more successful", "Luck alone", "Selling on the first day"], a: 0, f: "Business growth drives stock value." }
      ],
      Indonesian: [
        { q: "Apa arti memiliki saham?", o: ["Memiliki sebagian kecil perusahaan", "Meminjamkan uang ke perusahaan", "Mendapat produk gratis"], a: 0, f: "Saham membuatmu menjadi pemilik kecil." },
        { q: "Jika perusahaan maju, nilai saham biasanya...", o: ["Tetap sama", "Naik", "Turun"], a: 1, f: "Perusahaan sukses menaikkan nilai saham." },
        { q: "Pendekatan bijak untuk investasi saham?", o: ["Jual segera setelah beli", "Tahan bertahun-tahun dengan sabar", "Hanya beli saham murah"], a: 1, f: "Kesabaran dan jangka panjang itu penting." },
        { q: "Apa itu 'diversifikasi' dalam saham?", o: ["Semua uang di satu saham", "Sebar uang ke berbagai perusahaan", "Tidak pernah beli saham"], a: 1, f: "Diversifikasi mengurangi risiko." },
        { q: "Apa yang membuat investasi {name} tumbuh?", o: ["Bisnis menjadi lebih sukses", "Keberuntungan saja", "Jual di hari pertama"], a: 0, f: "Pertumbuhan bisnis mendorong nilai saham." }
      ],
      Chinese: [
        { q: "拥有股票意味着什么？", o: ["拥有公司的一小部分", "借钱给公司", "获得免费产品"], a: 0, f: "股票让你成为小老板。" },
        { q: "如果公司发展得好，你的股票价值通常会...", o: ["保持不变", "上涨", "下跌"], a: 1, f: "成功的公司会增加你的股票价值。" },
        { q: "什么是股票投资的明智方法？", o: ["买完立刻卖出", "耐心持有多年", "只买非常便宜的股票"], a: 1, f: "耐心和长期思考是关键。" },
        { q: "股票中的'分散投资'是什么意思？", o: ["把所有钱投在一只股票上", "把钱分散到不同公司", "从不买股票"], a: 1, f: "分散投资降低风险。" },
        { q: "是什么让{name}的投资增长了？", o: ["生意变得更成功", "只有运气", "第一天就卖出"], a: 0, f: "生意增长推动股票价值。" }
      ]
    },
    category: "Financial Literacy"
  },
  Fake: {
    storyTemplates: {
      English: "{name} saw an ad for a {product} at half price. The website looked real but had a typo. {name} remembered: 'If it's too good to be true, it probably is.' {name} checked the official store and reported the fake site. Later, {friend} bought the cheap {product} and got a {bad_item}. {name} learned to always verify before buying.",
      Indonesian: "{name} melihat iklan {product} setengah harga. Situsnya mirip asli tapi ada salah ketik. {name} ingat: 'Jika terlalu bagus untuk menjadi kenyataan, mungkin palsu.' {name} cek toko resmi dan melaporkan situs palsu. Kemudian {friend} membeli {product} murah dan mendapat {bad_item}. {name} belajar selalu verifikasi sebelum beli.",
      Chinese: "{name}看到广告说{product}半价。网站看起来是真的，但网址有拼写错误。{name}想起：'如果好得不像真的，那很可能就是假的。'{name}查了官方商店并举报了假网站。后来{friend}买了便宜的{product}，结果收到了{bad_item}。{name}学会了买之前一定要核实。"
    },
    quizBase: {
      English: [
        { q: "What is a sign of a fake website?", o: ["Professional design", "URL typos or strange addresses", "High prices"], a: 1, f: "Typos in the URL are a big warning." },
        { q: "If a deal seems 'too good to be true', you should...", o: ["Buy it immediately", "Verify with official sources", "Tell all your friends"], a: 1, f: "Always check before buying." },
        { q: "What positive action can you take against fake products?", o: ["Ignore it", "Report to a trusted adult", "Buy it and complain later"], a: 1, f: "Reporting helps protect others." },
        { q: "What can happen if you buy a fake product?", o: ["It lasts forever", "It may break quickly or be unsafe", "It's always as good as the real one"], a: 1, f: "Fakes are often poor quality." },
        { q: "What did {name} do to stay safe?", o: ["Bought the cheap item anyway", "Asked an adult and verified", "Kept it a secret"], a: 1, f: "Verification and communication keep you safe." }
      ],
      Indonesian: [
        { q: "Tanda situs palsu?", o: ["Desain profesional", "Salah ketik di URL", "Harga mahal"], a: 1, f: "Salah ketik di URL peringatan besar." },
        { q: "Jika tawaran 'terlalu bagus untuk menjadi kenyataan', Anda harus...", o: ["Segera beli", "Verifikasi dengan sumber resmi", "Beri tahu semua teman"], a: 1, f: "Selalu cek sebelum beli." },
        { q: "Tindakan positif melawan produk palsu?", o: ["Abaikan", "Lapor ke orang dewasa terpercaya", "Beli dan komplain nanti"], a: 1, f: "Melapor melindungi orang lain." },
        { q: "Apa bisa terjadi jika beli produk palsu?", o: ["Tahan lama", "Cepat rusak atau tidak aman", "Sama bagusnya dengan asli"], a: 1, f: "Barang palsu sering berkualitas rendah." },
        { q: "Apa yang {name} lakukan agar aman?", o: ["Tetap beli yang murah", "Tanya orang dewasa dan verifikasi", "Rahasiakan"], a: 1, f: "Verifikasi dan komunikasi menjaga keamanan." }
      ],
      Chinese: [
        { q: "假网站的迹象是什么？", o: ["专业设计", "网址有拼写错误", "高价格"], a: 1, f: "网址里的拼写错误是很大的警示。" },
        { q: "如果一个优惠'好得不像真的'，你应该...", o: ["立刻买", "用官方渠道核实", "告诉所有朋友"], a: 1, f: "买之前一定要核实。" },
        { q: "你可以采取什么积极行动来对抗假货？", o: ["忽略它", "报告给信任的成年人", "买下来再抱怨"], a: 1, f: "举报有助于保护他人。" },
        { q: "如果你买了假货可能会发生什么？", o: ["永远耐用", "很快坏掉或不安全", "和真品一样好"], a: 1, f: "假货通常质量差。" },
        { q: "{name}做了什么来保证安全？", o: ["还是买了便宜的", "询问大人并核实", "保密"], a: 1, f: "核实和沟通保护你的安全。" }
      ]
    },
    category: "Life Skills"
  },
  "Suicide Prevention": {
    storyTemplates: {
      English: "{name} noticed {friend} seemed sad for weeks, stopped playing, and said '{hopeless_phrase}'. {name} remembered: 'If worried about a friend, tell a trusted adult.' {name} told {adult}. {adult} talked gently with {friend} and got help. {friend} started counseling and learned to feel better. {friend} later said, 'Talking saved my life. I\\'m glad {name} spoke up.' {name} learned that asking for help is brave.",
      Indonesian: "{name} melihat {friend} tampak sedih berhari-hari, berhenti bermain, dan berkata '{hopeless_phrase}'. {name} ingat: 'Jika khawatir tentang teman, ceritakan pada orang dewasa terpercaya.' {name} memberi tahu {adult}. {adult} berbicara lembut dengan {friend} dan mendapat bantuan. {friend} mulai konseling dan belajar merasa lebih baik. {friend} berkata, 'Berbicara menyelamatkan hidupku. Aku bersyukur {name} bicara.' {name} belajar bahwa meminta pertolongan itu berani.",
      Chinese: "{name}注意到{friend}几周来都很悲伤，不再玩耍，还说'{hopeless_phrase}'。{name}想起：'如果担心朋友，要告诉信任的成年人。'{name}告诉了{adult}。{adult}温和地与{friend}交谈并获得了帮助。{friend}开始心理咨询，学会了感觉更好。{friend}后来说：'说出来救了我的命。我很高兴{name}开口了。'{name}学到了寻求帮助是勇敢的。"
    },
    quizBase: {
      English: [
        { q: "If a friend seems very sad for a long time, you should...", o: ["Ignore it", "Tell a trusted adult", "Promise to keep it a secret"], a: 1, f: "Telling an adult is the best way to help." },
        { q: "What should you NEVER promise a friend who is struggling?", o: ["To listen", "To keep a suicide secret", "To be there for them"], a: 1, f: "Safety comes first - never promise secrecy about suicide." },
        { q: "What can counseling or therapy provide?", o: ["Instant happiness", "Tools to cope and hope for recovery", "Only medication"], a: 1, f: "Counseling teaches skills and provides support." },
        { q: "What positive message does seeking help send?", o: ["You are weak", "You are brave and strong", "You should handle everything alone"], a: 1, f: "Asking for help is a sign of strength." },
        { q: "Why did {friend} say talking saved their life?", o: ["Because talking fixed everything instantly", "Because sharing feelings with a professional gave hope", "Because they talked to strangers online"], a: 1, f: "Professional support can be life-saving." }
      ],
      Indonesian: [
        { q: "Jika sahabat tampak sangat sedih lama, Anda harus...", o: ["Abaikan", "Beri tahu orang dewasa terpercaya", "Berjanji merahasiakan"], a: 1, f: "Memberi tahu orang dewasa cara terbaik menolong." },
        { q: "Apa yang tidak boleh dijanjikan ke teman yang sedang berjuang?", o: ["Mendengarkan", "Merahasiakan keinginan bunuh diri", "Ada untuk mereka"], a: 1, f: "Keselamatan utama - jangan janji rahasia soal bunuh diri." },
        { q: "Apa yang bisa diberikan konseling?", o: ["Kebahagiaan instan", "Alat untuk mengatasi dan harapan pemulihan", "Hanya obat"], a: 1, f: "Konseling mengajarkan keterampilan dan memberi dukungan." },
        { q: "Pesan positif dari mencari pertolongan?", o: ["Kamu lemah", "Kamu berani dan kuat", "Kamu harus selesaikan sendiri"], a: 1, f: "Minta tolong tanda kekuatan." },
        { q: "Kenapa {friend} bilang bicara menyelamatkan hidupnya?", o: ["Karena bicara langsung selesaikan semua", "Karena berbagi perasaan dengan profesional memberi harapan", "Karena bicara dengan orang asing online"], a: 1, f: "Dukungan profesional bisa selamatkan hidup." }
      ],
      Chinese: [
        { q: "如果朋友长时间非常悲伤，你应该...", o: ["忽略它", "告诉信任的成年人", "承诺保密"], a: 1, f: "告诉成年人是帮助的最佳方式。" },
        { q: "你永远不应该对正在挣扎的朋友承诺什么？", o: ["倾听", "对自杀想法保密", "陪伴他们"], a: 1, f: "安全第一 - 永远不要承诺对自杀保密。" },
        { q: "心理咨询能提供什么？", o: ["瞬间的快乐", "应对的工具和康复的希望", "只有药物"], a: 1, f: "心理咨询教授技能并提供支持。" },
        { q: "寻求帮助传递了什么积极信息？", o: ["你很软弱", "你勇敢且坚强", "你应该独自处理一切"], a: 1, f: "寻求帮助是力量的表现。" },
        { q: "为什么{friend}说说出来救了他们的命？", o: ["因为说话立刻解决了所有问题", "因为向专业人士分享感受带来了希望", "因为他们和网上陌生人聊天"], a: 1, f: "专业支持可以救命。" }
      ]
    },
    category: "Mental Health"
  }
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) { return shuffle(arr).slice(0, n); }

function fill(template, vars) {
  let s = template;
  for (const [k, v] of Object.entries(vars)) {
    s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), v);
  }
  return s;
}

function generateSample(topic, lang, idx) {
  const t = topics[topic];
  const name = pick(names[lang]);
  const friend = pick(names[lang].filter(n => n !== name));
  const adult = pick(lang === 'English' ? ["mom", "dad", "teacher", "counselor"]
    : lang === 'Indonesian' ? ["Ibu", "Ayah", "guru", "konselor"]
    : ["妈妈", "爸爸", "老师", "辅导员"]);

  let story, selected, product = '', bad_item = '', hopeless_phrase = '';

  if (topic === 'Stock') {
    const amount = pick([50, 100, 200, 500]);
    const profit = pick([10, 20, 30, 50]);
    const final = Math.round(amount * (1 + profit / 100));
    const business = pick(lang === 'English' ? ["lemonade stand", "bakery", "juice shop", "craft store"]
      : lang === 'Indonesian' ? ["kedai jus", "toko kue", "warung makan", "toko kerajinan"]
      : ["柠檬水摊", "面包店", "果汁店", "手工艺品店"]);
    story = fill(t.storyTemplates[lang], { name, amount, friend, profit, business, final });
    selected = pickN(t.quizBase[lang], 3);
  } else if (topic === 'Fake') {
    product = pick(lang === 'English' ? ["video game", "smartwatch", "sneakers", "headphones"]
      : lang === 'Indonesian' ? ["gim video", "jam pintar", "sepatu", "headphone"]
      : ["游戏机", "智能手表", "运动鞋", "耳机"]);
    bad_item = pick(lang === 'English' ? ["broken CD", "empty box", "brick", "fake copy"]
      : lang === 'Indonesian' ? ["CD rusak", "kardus kosong", "batu bata", "tiruan jelek"]
      : ["坏光盘", "空盒子", "砖头", "劣质仿品"]);
    story = fill(t.storyTemplates[lang], { name, product, friend, bad_item });
    selected = pickN(t.quizBase[lang], 3);
  } else {
    hopeless_phrase = pick(lang === 'English' ? ["nothing matters", "I don't care anymore", "what's the point", "I want to give up"]
      : lang === 'Indonesian' ? ["tidak ada yang berarti", "aku tidak peduli lagi", "apa gunanya", "aku ingin menyerah"]
      : ["什么都不重要了", "我不在乎了", "有什么意义", "我想放弃"]);
    story = fill(t.storyTemplates[lang], { name, friend, hopeless_phrase, adult });
    selected = pickN(t.quizBase[lang], 3);
  }

  const topicKey = topic.toLowerCase().replace(/\s+/g, '-');
  const storyId = `${topicKey}-${lang.toLowerCase()}-${String(idx).padStart(3, '0')}`;

  const cat = t.category;

  const storyObj = {
    id: storyId,
    title: lang === 'English' ? `${topic} Story - ${name}`
      : lang === 'Indonesian' ? `Cerita ${topic} - ${name}`
      : `${topic}故事 - ${name}`,
    description: lang === 'English' ? `Learn about ${topic.toLowerCase()}`
      : lang === 'Indonesian' ? `Belajar tentang ${topic.toLowerCase()}`
      : `学习关于${topic}`,
    category: cat,
    appType: 'story',
    storyContent: story,
    createdBy: 'PositiveLearning',
    creatorAvatar: '🌟',
    tags: [topic.toLowerCase(), 'positive', 'education']
  };

  const quizzes = selected.map((q, qi) => {
    const qText = fill(q.q, { name, friend });
    const optsStr = q.o.map((o, j) => `${j + 1}) ${o}`).join('\n');
    const feedback = fill(q.f, { name, friend });

    const intro = lang === 'English' ? "Let's learn!\n\n"
      : lang === 'Indonesian' ? "Ayo belajar!\n\n"
      : "一起学习吧！\n\n";

    return {
      id: `quiz-${topicKey}-${lang.toLowerCase()}-${String(idx).padStart(3, '0')}-${qi + 1}`,
      title: lang === 'English' ? `${topic} Quiz ${qi + 1} - ${name}`
        : lang === 'Indonesian' ? `Kuis ${topic} ${qi + 1} - ${name}`
        : `${topic}测验${qi + 1} - ${name}`,
      description: lang === 'English' ? `Test your knowledge about ${topic.toLowerCase()}`
        : lang === 'Indonesian' ? `Uji pengetahuan tentang ${topic.toLowerCase()}`
        : `测试关于${topic}的知识`,
      category: cat,
      appType: 't2q_quiz',
      t2qContent: `> ${name}: ${intro}? ${qText}\n${optsStr}\n= ${q.a + 1}\n\n> ${name}: ${feedback}`,
      createdBy: 'PositiveLearning',
      creatorAvatar: '🌟'
    };
  });

  return { id: storyId, language: lang, topic, story: storyObj, quizzes };
}

const samples = [];
let idx = 1;
for (const topic of ['Stock', 'Fake', 'Suicide Prevention']) {
  for (const lang of ['English', 'Indonesian', 'Chinese']) {
    for (let i = 0; i < 5; i++) {
      samples.push(generateSample(topic, lang, idx));
      idx++;
    }
  }
}

const outPath = path.resolve(__dirname, 'full-45-samples.json');
writeFileSync(outPath, JSON.stringify(samples, null, 2), 'utf-8');
console.log(`Done! Created ${outPath} with ${samples.length} samples`);
