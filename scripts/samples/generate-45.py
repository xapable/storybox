import json
import random

# ----- Data pools for variation -----
names = {
    "English": ["Emma", "Leo", "Mia", "Tom", "Zoe", "Sam", "Lily", "Max", "Ava", "Ben"],
    "Indonesian": ["Rina", "Budi", "Dewi", "Ani", "Sari", "Ahmad", "Lina", "Bayu", "Cinta", "Eko"],
    "Chinese": ["小美", "小刚", "小丽", "小明", "小芳", "小华", "小静", "小强", "小娜", "小伟"]
}

# Topic-specific templates (story and quiz Q&A)
topics = {
    "Stock": {
        "story_templates": {
            "English": [
                "{name} gave ${amount} to {friend} for a {business}. In return, {friend} shared {profit}% of profits. {name} learned that a stock means owning a small piece of a company. Over time, the {business} grew, and {name}'s ${amount} became ${final}. Patience and research make investing rewarding."
            ],
            "Indonesian": [
                "{name} memberikan Rp{amount} kepada {friend} untuk {business}. Sebagai imbalan, {friend} berbagi {profit}% keuntungan. {name} belajar bahwa saham berarti memiliki sebagian kecil perusahaan. Seiring waktu, {business} berkembang, dan Rp{amount} {name} menjadi Rp{final}. Kesabaran dan riset membuat investasi bermanfaat."
            ],
            "Chinese": [
                "{name}给了{friend}{amount}元做{business}生意。作为回报，{friend}分享{profit}%的利润。{name}学到股票就是拥有公司的一小部分。随着时间的推移，{business}发展了，{name}的{amount}元变成了{final}元。耐心和研究让投资有价值。"
            ]
        },
        "quiz_base": {
            "English": [
                ("What does owning a stock mean?", ["Owning a small part of a company", "Lending money to a company", "Getting free products"], 0, "Owning a stock makes you a partial owner."),
                ("If the company does well, your stock value usually...", ["Stays the same", "Goes up", "Goes down"], 1, "A successful company tends to increase your stock's worth."),
                ("What is a wise approach to stock investing?", ["Sell immediately after buying", "Hold for years with patience", "Only buy very cheap stocks"], 1, "Patience and long-term thinking are key."),
                ("What does 'diversify' mean in stocks?", ["Put all money in one stock", "Spread money across different companies", "Never buy stocks"], 1, "Diversification reduces risk."),
                ("What helped {name}'s investment grow?", ["The business became more successful", "Luck alone", "Selling on the first day"], 0, "Business growth drives stock value.")
            ],
            "Indonesian": [
                ("Apa arti memiliki saham?", ["Memiliki sebagian kecil perusahaan", "Meminjamkan uang ke perusahaan", "Mendapat produk gratis"], 0, "Saham membuatmu menjadi pemilik kecil."),
                ("Jika perusahaan maju, nilai saham biasanya...", ["Tetap sama", "Naik", "Turun"], 1, "Perusahaan sukses menaikkan nilai saham."),
                ("Pendekatan bijak untuk investasi saham?", ["Jual segera setelah beli", "Tahan bertahun-tahun dengan sabar", "Hanya beli saham murah"], 1, "Kesabaran dan jangka panjang itu penting."),
                ("Apa itu 'diversifikasi' dalam saham?", ["Semua uang di satu saham", "Sebar uang ke berbagai perusahaan", "Tidak pernah beli saham"], 1, "Diversifikasi mengurangi risiko."),
                ("Apa yang membuat investasi {name} tumbuh?", ["Bisnis menjadi lebih sukses", "Keberuntungan saja", "Jual di hari pertama"], 0, "Pertumbuhan bisnis mendorong nilai saham.")
            ],
            "Chinese": [
                ("拥有股票意味着什么？", ["拥有公司的一小部分", "借钱给公司", "获得免费产品"], 0, "股票让你成为小老板。"),
                ("如果公司发展得好，你的股票价值通常会...", ["保持不变", "上涨", "下跌"], 1, "成功的公司会增加你的股票价值。"),
                ("什么是股票投资的明智方法？", ["买完立刻卖出", "耐心持有多年", "只买非常便宜的股票"], 1, "耐心和长期思考是关键。"),
                ("股票中的'分散投资'是什么意思？", ["把所有钱投在一只股票上", "把钱分散到不同公司", "从不买股票"], 1, "分散投资降低风险。"),
                ("是什么让{name}的投资增长了？", ["生意变得更成功", "只有运气", "第一天就卖出"], 0, "生意增长推动股票价值。")
            ]
        }
    },
    "Fake": {
        "story_templates": {
            "English": [
                "{name} saw an ad for a {product} at half price. The website looked real but had a typo. {name} remembered: 'If it's too good to be true, it probably is.' {name} checked the official store and reported the fake site. Later, {friend} bought the cheap {product} and got a {bad_item}. {name} learned to always verify before buying."
            ],
            "Indonesian": [
                "{name} melihat iklan {product} setengah harga. Situsnya mirip asli tapi ada salah ketik. {name} ingat: 'Jika terlalu bagus untuk menjadi kenyataan, mungkin palsu.' {name} cek toko resmi dan melaporkan situs palsu. Kemudian {friend} membeli {product} murah dan mendapat {bad_item}. {name} belajar selalu verifikasi sebelum beli."
            ],
            "Chinese": [
                "{name}看到广告说{product}半价。网站看起来是真的，但网址有拼写错误。{name}想起："如果好得不像真的，那很可能就是假的。"{name}查了官方商店并举报了假网站。后来{friend}买了便宜的{product}，结果收到了{bad_item}。{name}学会了买之前一定要核实。"
            ]
        },
        "quiz_base": {
            "English": [
                ("What is a sign of a fake website?", ["Professional design", "URL typos or strange addresses", "High prices"], 1, "Typos in the URL are a big warning."),
                ("If a deal seems 'too good to be true', you should...", ["Buy it immediately", "Verify with official sources", "Tell all your friends"], 1, "Always check before buying."),
                ("What positive action can you take against fake products?", ["Ignore it", "Report to a trusted adult", "Buy it and complain later"], 1, "Reporting helps protect others."),
                ("What can happen if you buy a fake product?", ["It lasts forever", "It may break quickly or be unsafe", "It's always as good as the real one"], 1, "Fakes are often poor quality."),
                ("What did {name} do to stay safe?", ["Bought the cheap item anyway", "Asked an adult and verified", "Kept it a secret"], 1, "Verification and communication keep you safe.")
            ],
            "Indonesian": [
                ("Tanda situs palsu?", ["Desain profesional", "Salah ketik di URL", "Harga mahal"], 1, "Salah ketik di URL peringatan besar."),
                ("Jika tawaran 'terlalu bagus untuk menjadi kenyataan', Anda harus...", ["Segera beli", "Verifikasi dengan sumber resmi", "Beri tahu semua teman"], 1, "Selalu cek sebelum beli."),
                ("Tindakan positif melawan produk palsu?", ["Abaikan", "Lapor ke orang dewasa terpercaya", "Beli dan komplain nanti"], 1, "Melapor melindungi orang lain."),
                ("Apa bisa terjadi jika beli produk palsu?", ["Tahan lama", "Cepat rusak atau tidak aman", "Sama bagusnya dengan asli"], 1, "Barang palsu sering berkualitas rendah."),
                ("Apa yang {name} lakukan agar aman?", ["Tetap beli yang murah", "Tanya orang dewasa dan verifikasi", "Rahasiakan"], 1, "Verifikasi dan komunikasi menjaga keamanan.")
            ],
            "Chinese": [
                ("假网站的迹象是什么？", ["专业设计", "网址有拼写错误", "高价格"], 1, "网址里的拼写错误是很大的警示。"),
                ("如果一个优惠'好得不像真的'，你应该...", ["立刻买", "用官方渠道核实", "告诉所有朋友"], 1, "买之前一定要核实。"),
                ("你可以采取什么积极行动来对抗假货？", ["忽略它", "报告给信任的成年人", "买下来再抱怨"], 1, "举报有助于保护他人。"),
                ("如果你买了假货可能会发生什么？", ["永远耐用", "很快坏掉或不安全", "和真品一样好"], 1, "假货通常质量差。"),
                ("{name}做了什么来保证安全？", ["还是买了便宜的", "询问大人并核实", "保密"], 1, "核实和沟通保护你的安全。")
            ]
        }
    },
    "Suicide Prevention": {
        "story_templates": {
            "English": [
                "{name} noticed {friend} seemed sad for weeks, stopped playing, and said '{hopeless_phrase}'. {name} remembered: 'If worried about a friend, tell a trusted adult.' {name} told {adult}. {adult} talked gently with {friend} and got help. {friend} started counseling and learned to feel better. {friend} later said, 'Talking saved my life. I'm glad {name} spoke up.' {name} learned that asking for help is brave."
            ],
            "Indonesian": [
                "{name} melihat {friend} tampak sedih berhari-hari, berhenti bermain, dan berkata '{hopeless_phrase}'. {name} ingat: 'Jika khawatir tentang teman, ceritakan pada orang dewasa terpercaya.' {name} memberi tahu {adult}. {adult} berbicara lembut dengan {friend} dan mendapat bantuan. {friend} mulai konseling dan belajar merasa lebih baik. {friend} berkata, 'Berbicara menyelamatkan hidupku. Aku bersyukur {name} bicara.' {name} belajar bahwa meminta pertolongan itu berani."
            ],
            "Chinese": [
                "{name}注意到{friend}几周来都很悲伤，不再玩耍，还说'{hopeless_phrase}'。{name}想起："如果担心朋友，要告诉信任的成年人。"{name}告诉了{adult}。{adult}温和地与{friend}交谈并获得了帮助。{friend}开始心理咨询，学会了感觉更好。{friend}后来说："说出来救了我的命。我很高兴{name}开口了。"{name}学到了寻求帮助是勇敢的。"
            ]
        },
        "quiz_base": {
            "English": [
                ("If a friend seems very sad for a long time, you should...", ["Ignore it", "Tell a trusted adult", "Promise to keep it a secret"], 1, "Telling an adult is the best way to help."),
                ("What should you NEVER promise a friend who is struggling?", ["To listen", "To keep a suicide secret", "To be there for them"], 1, "Safety comes first \u2013 never promise secrecy about suicide."),
                ("What can counseling or therapy provide?", ["Instant happiness", "Tools to cope and hope for recovery", "Only medication"], 1, "Counseling teaches skills and provides support."),
                ("What positive message does seeking help send?", ["You are weak", "You are brave and strong", "You should handle everything alone"], 1, "Asking for help is a sign of strength."),
                ("Why did {friend} say talking saved their life?", ["Because talking fixed everything instantly", "Because sharing feelings with a professional gave hope", "Because they talked to strangers online"], 1, "Professional support can be life-saving.")
            ],
            "Indonesian": [
                ("Jika sahabat tampak sangat sedih lama, Anda harus...", ["Abaikan", "Beri tahu orang dewasa terpercaya", "Berjanji merahasiakan"], 1, "Memberi tahu orang dewasa cara terbaik menolong."),
                ("Apa yang tidak boleh dijanjikan ke teman yang sedang berjuang?", ["Mendengarkan", "Merahasiakan keinginan bunuh diri", "Ada untuk mereka"], 1, "Keselamatan utama \u2013 jangan janji rahasia soal bunuh diri."),
                ("Apa yang bisa diberikan konseling?", ["Kebahagiaan instan", "Alat untuk mengatasi dan harapan pemulihan", "Hanya obat"], 1, "Konseling mengajarkan keterampilan dan memberi dukungan."),
                ("Pesan positif dari mencari pertolongan?", ["Kamu lemah", "Kamu berani dan kuat", "Kamu harus selesaikan sendiri"], 1, "Minta tolong tanda kekuatan."),
                ("Kenapa {friend} bilang bicara menyelamatkan hidupnya?", ["Karena bicara langsung selesaikan semua", "Karena berbagi perasaan dengan profesional memberi harapan", "Karena bicara dengan orang asing online"], 1, "Dukungan profesional bisa selamatkan hidup.")
            ],
            "Chinese": [
                ("如果朋友长时间非常悲伤，你应该...", ["忽略它", "告诉信任的成年人", "承诺保密"], 1, "告诉成年人是帮助的最佳方式。"),
                ("你永远不应该对正在挣扎的朋友承诺什么？", ["倾听", "对自杀想法保密", "陪伴他们"], 1, "安全第一 \u2013 永远不要承诺对自杀保密。"),
                ("心理咨询能提供什么？", ["瞬间的快乐", "应对的工具和康复的希望", "只有药物"], 1, "心理咨询教授技能并提供支持。"),
                ("寻求帮助传递了什么积极信息？", ["你很软弱", "你勇敢且坚强", "你应该独自处理一切"], 1, "寻求帮助是力量的表现。"),
                ("为什么{friend}说说出来救了他们的命？", ["因为说话立刻解决了所有问题", "因为向专业人士分享感受带来了希望", "因为他们和网上陌生人聊天"], 1, "专业支持可以救命。")
            ]
        }
    }
}

# Helper to generate one sample
def generate_sample(topic, lang, idx):
    name = random.choice(names[lang])
    friend = random.choice([n for n in names[lang] if n != name])
    adult = random.choice(["mom", "dad", "teacher", "counselor"] if lang == "English" else (["Ibu", "Ayah", "guru", "konselor"] if lang == "Indonesian" else ["妈妈", "爸爸", "老师", "辅导员"]))

    t = topics[topic]

    if topic == "Stock":
        amount = random.choice([50, 100, 200, 500])
        profit = random.choice([10, 20, 30, 50])
        final = int(amount * (1 + profit/100))
        business = random.choice(["lemonade stand", "bakery", "juice shop", "craft store"]) if lang=="English" else (["kedai jus", "toko kue", "warung makan", "toko kerajinan"] if lang=="Indonesian" else ["柠檬水摊", "面包店", "果汁店", "手工艺品店"])
        story = t["story_templates"][lang][0].format(name=name, amount=amount, friend=friend, profit=profit, business=business, final=final)
        q_pool = t["quiz_base"][lang]
        selected = random.sample(q_pool, 3)
    elif topic == "Fake":
        product = random.choice(["video game", "smartwatch", "sneakers", "headphones"]) if lang=="English" else (["gim video", "jam pintar", "sepatu", "headphone"] if lang=="Indonesian" else ["游戏机", "智能手表", "运动鞋", "耳机"])
        bad_item = random.choice(["broken CD", "empty box", "brick", "fake copy"]) if lang=="English" else (["CD rusak", "kardus kosong", "batu bata", "tiruan jelek"] if lang=="Indonesian" else ["坏光盘", "空盒子", "砖头", "劣质仿品"])
        story = t["story_templates"][lang][0].format(name=name, product=product, friend=friend, bad_item=bad_item)
        q_pool = t["quiz_base"][lang]
        selected = random.sample(q_pool, 3)
    else:  # Suicide Prevention
        hopeless_phrase = random.choice(["nothing matters", "I don't care anymore", "what's the point", "I want to give up"]) if lang=="English" else (["tidak ada yang berarti", "aku tidak peduli lagi", "apa gunanya", "aku ingin menyerah"] if lang=="Indonesian" else ["什么都不重要了", "我不在乎了", "有什么意义", "我想放弃"])
        story = t["story_templates"][lang][0].format(name=name, friend=friend, hopeless_phrase=hopeless_phrase, adult=adult)
        q_pool = t["quiz_base"][lang]
        selected = random.sample(q_pool, 3)

    topic_key = topic.replace(" ", "-").lower()
    story_id = f"{topic_key}-{lang.lower()}-{idx:03d}"

    # Build quiz content
    quiz_entries = []
    for qi, (q_text, opts, correct_idx, feedback) in enumerate(selected, 1):
        opts_str = "\n".join([f"{j+1}) {opt}" for j, opt in enumerate(opts)])
        q_text_filled = q_text.format(name=name, friend=friend)
        feedback_filled = feedback.format(name=name, friend=friend)
        q_full = f"? {q_text_filled}\n{opts_str}\n= {correct_idx+1}\n\n> {name}: {feedback_filled}"
        quiz_entries.append(q_full)

    # Include a simple intro line from the character
    intro = f"> {name}: "
    if lang == "English": intro += "Let's learn something important today!\n\n"
    elif lang == "Indonesian": intro += "Mari belajar hal penting hari ini!\n\n"
    else: intro += "今天我们来学习重要的事情！\n\n"

    t2q_content = intro + "\n".join(quiz_entries)

    # Category
    if topic == "Stock": cat = "Financial Literacy"
    elif topic == "Fake": cat = "Life Skills"
    else: cat = "Mental Health"

    story_obj = {
        "id": story_id,
        "title": f"{topic} Story - {name}" if lang=="English" else f"Cerita {topic} - {name}" if lang=="Indonesian" else f"{topic}故事 - {name}",
        "description": f"Learn about {topic.lower()}" if lang=="English" else f"Belajar tentang {topic.lower()}" if lang=="Indonesian" else f"学习关于{topic}",
        "category": cat,
        "appType": "story",
        "storyContent": story,
        "createdBy": "PositiveLearning",
        "creatorAvatar": "🌟",
        "tags": [topic.lower(), "positive", "education"]
    }

    quizzes = []
    for qi in range(3):
        quiz_id = f"quiz-{topic_key}-{lang.lower()}-{idx:03d}-{qi+1}"
        # Pick a single question for each quiz
        q = selected[qi]
        q_text_filled = q[0].format(name=name, friend=friend)
        opts_str = "\n".join([f"{j+1}) {opt}" for j, opt in enumerate(q[1])])
        feedback_filled = q[3].format(name=name, friend=friend)
        single_q = f"? {q_text_filled}\n{opts_str}\n= {q[2]+1}\n\n> {name}: {feedback_filled}"
        q_intro = f"> {name}: "
        if lang == "English": q_intro += "Let's learn!\n\n"
        elif lang == "Indonesian": q_intro += "Ayo belajar!\n\n"
        else: q_intro += "一起学习吧！\n\n"

        quizzes.append({
            "id": quiz_id,
            "title": f"{topic} Quiz {qi+1} - {name}" if lang=="English" else f"Kuis {topic} {qi+1} - {name}" if lang=="Indonesian" else f"{topic}测验{qi+1} - {name}",
            "description": f"Test your knowledge about {topic.lower()}" if lang=="English" else f"Uji pengetahuan tentang {topic.lower()}" if lang=="Indonesian" else f"测试关于{topic}的知识",
            "category": cat,
            "appType": "t2q_quiz",
            "t2qContent": q_intro + single_q,
            "createdBy": "PositiveLearning",
            "creatorAvatar": "🌟"
        })

    return {
        "id": story_id,
        "language": lang,
        "topic": topic,
        "story": story_obj,
        "quizzes": quizzes
    }

# Generate 5 samples per topic per language = 45 total
samples = []
idx = 1
for topic in ["Stock", "Fake", "Suicide Prevention"]:
    for lang in ["English", "Indonesian", "Chinese"]:
        for _ in range(5):
            samples.append(generate_sample(topic, lang, idx))
            idx += 1

# Save to JSON
with open("c:/dev/storybox/scripts/samples/full-45-samples.json", "w", encoding="utf-8") as f:
    json.dump(samples, f, ensure_ascii=False, indent=2)

print("Done! Created full-45-samples.json with", len(samples), "samples")
