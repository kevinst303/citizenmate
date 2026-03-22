import type { StudyTopic } from "@/lib/types";

// ===== CitizenMate Study Content =====
// Structured content from "Our Common Bond" — the official study resource.
// Each topic contains sections with bilingual content (EN + Simplified Chinese).

export const studyTopics: StudyTopic[] = [
  // ─────────────────────────────────────────────────
  // TOPIC 1: Australia and Its People
  // ─────────────────────────────────────────────────
  {
    id: "australia-people",
    title: "Australia and Its People",
    titleZh: "澳大利亚及其人民",
    description:
      "Learn about Australia's geography, Indigenous heritage, national symbols, immigration history, and key dates.",
    descriptionZh:
      "了解澳大利亚的地理、原住民遗产、国家象征、移民历史和重要日期。",
    sections: [
      {
        id: "ap-s1",
        title: "Indigenous Heritage",
        titleZh: "原住民遗产",
        content:
          "Aboriginal and Torres Strait Islander peoples are the original inhabitants of Australia. They have lived on this continent for over 65,000 years, making their cultures among the oldest continuous cultures in the world.\n\nAboriginal peoples have a deep spiritual connection to the land through the Dreamtime (or Dreaming), which describes the creation period when ancestral spirits formed the natural world. These stories are passed down through generations via oral traditions, art, song, and dance.\n\nTorres Strait Islander peoples come from the islands between the northern tip of Queensland and Papua New Guinea. They have their own distinct cultures, languages, and traditions.\n\nNAIDOC Week, held in the first week of July each year, celebrates the history, culture, and achievements of Aboriginal and Torres Strait Islander peoples. It is an important time for all Australians to recognise and celebrate Indigenous cultures.",
        contentZh:
          "澳大利亚原住民和托雷斯海峡岛民是澳大利亚的原始居民。他们在这片大陆上生活了超过65,000年，使他们的文化成为世界上最古老的连续文化之一。\n\n原住民通过「梦幻时代」（或「梦境」）与土地有着深厚的精神联系，它描述了祖先灵魂创造自然世界的创世时期。这些故事通过口述传统、艺术、歌曲和舞蹈代代相传。\n\n托雷斯海峡岛民来自昆士兰北端和巴布亚新几内亚之间的岛屿。他们拥有自己独特的文化、语言和传统。\n\nNAIDOC周在每年七月的第一周举行，庆祝原住民和托雷斯海峡岛民的历史、文化和成就。这是所有澳大利亚人认识和庆祝原住民文化的重要时期。",
        keyFacts: [
          "Aboriginal and Torres Strait Islander peoples have lived in Australia for over 65,000 years",
          "The Dreamtime describes the creation of the natural world by ancestral spirits",
          "Torres Strait Islander peoples are from the islands between Queensland and Papua New Guinea",
          "NAIDOC Week is held in the first week of July each year",
        ],
        keyFactsZh: [
          "原住民和托雷斯海峡岛民在澳大利亚生活了超过65,000年",
          "梦幻时代描述了祖先灵魂创造自然世界的过程",
          "托雷斯海峡岛民来自昆士兰和巴布亚新几内亚之间的岛屿",
          "NAIDOC周在每年七月的第一周举行",
        ],
        relatedQuestionIds: ["ap-02", "ap-13", "ap-19", "ap-20"],
      },
      {
        id: "ap-s2",
        title: "National Symbols & Identity",
        titleZh: "国家象征与身份",
        content:
          "Australia has many national symbols that represent its identity and heritage.\n\nThe Australian flag features three elements: the Union Jack (representing historical links to Britain), the Commonwealth Star (a seven-pointed star where six points represent the six states and the seventh represents the territories), and the Southern Cross constellation (visible from the Southern Hemisphere).\n\nAustralia's national colours are green and gold, inspired by the golden wattle (Acacia pycnantha), the national flower. The national anthem is \"Advance Australia Fair,\" officially adopted in 1984.\n\nThe coat of arms features a kangaroo and an emu — two animals that cannot easily walk backwards, symbolising a nation always moving forward.",
        contentZh:
          "澳大利亚有许多代表其身份和遗产的国家象征。\n\n澳大利亚国旗有三个元素：联合杰克（代表与英国的历史联系）、联邦之星（七角星，六个角代表六个州，第七个角代表领地）和南十字星座（在南半球可见）。\n\n澳大利亚的国家颜色是绿色和金色，灵感来自金合欢（金合欢），即国花。国歌是《前进，美丽的澳大利亚》，于1984年正式采用。\n\n国徽上有袋鼠和鸸鹋——两种不容易向后行走的动物，象征着一个不断前进的国家。",
        keyFacts: [
          "The Commonwealth Star has 7 points: 6 for the states, 1 for the territories",
          "National colours are green and gold",
          "The golden wattle is the national flower",
          "\"Advance Australia Fair\" became the national anthem in 1984",
        ],
        keyFactsZh: [
          "联邦之星有7个角：6个代表各州，1个代表领地",
          "国家颜色是绿色和金色",
          "金合欢是国花",
          "《前进，美丽的澳大利亚》于1984年成为国歌",
        ],
        relatedQuestionIds: [
          "ap-04",
          "ap-07",
          "ap-08",
          "ap-09",
          "ap-10",
          "ap-12",
        ],
      },
      {
        id: "ap-s3",
        title: "Key Historical Events",
        titleZh: "重要历史事件",
        content:
          "Several key events have shaped modern Australia.\n\nOn 1 January 1901, the six British colonies federated to form the Commonwealth of Australia. Sir Edmund Barton became the first Prime Minister.\n\nIn 1915, Australian and New Zealand Army Corps (ANZAC) soldiers landed at Gallipoli in Turkey during World War I. Their bravery and sacrifice are commemorated each year on Anzac Day (25 April).\n\nAustralia Day is celebrated on 26 January, marking the arrival of the First Fleet at Sydney Cove in 1788.\n\nRemembrance Day (11 November) marks the end of World War I in 1918, and Australians observe a minute of silence at 11 am.",
        contentZh:
          "几个关键事件塑造了现代澳大利亚。\n\n1901年1月1日，六个英国殖民地联合组成了澳大利亚联邦。埃德蒙·巴顿爵士成为第一任总理。\n\n1915年，澳大利亚和新西兰军团（ANZAC）士兵在第一次世界大战期间登陆土耳其的加里波利。他们的勇敢和牺牲每年在澳新军团日（4月25日）纪念。\n\n澳大利亚日在1月26日庆祝，纪念1788年第一舰队抵达悉尼湾。\n\n阵亡将士纪念日（11月11日）标志着1918年第一次世界大战的结束，澳大利亚人在上午11点默哀一分钟。",
        keyFacts: [
          "Federation occurred on 1 January 1901",
          "Sir Edmund Barton was the first Prime Minister",
          "Anzac Day (25 April) commemorates the Gallipoli landing in 1915",
          "Australia Day is celebrated on 26 January",
          "Remembrance Day is observed on 11 November",
        ],
        keyFactsZh: [
          "联邦于1901年1月1日成立",
          "埃德蒙·巴顿爵士是第一任总理",
          "澳新军团日（4月25日）纪念1915年加里波利登陆",
          "澳大利亚日在1月26日庆祝",
          "阵亡将士纪念日在11月11日纪念",
        ],
        relatedQuestionIds: [
          "ap-03",
          "ap-05",
          "ap-06",
          "ap-14",
          "ap-15",
          "ap-18",
        ],
      },
      {
        id: "ap-s4",
        title: "Geography & States",
        titleZh: "地理与州",
        content:
          "Australia is the world's sixth largest country and the only country that is also a continent. The capital city is Canberra, chosen as a compromise between the rival cities of Sydney and Melbourne.\n\nAustralia has six states: New South Wales, Victoria, Queensland, South Australia, Western Australia, and Tasmania. It also has two mainland territories: the Australian Capital Territory (ACT) and the Northern Territory.\n\nWestern Australia is the largest state by area, covering about one-third of the continent. Australia's population is approximately 26 million people, with most living along the eastern and southeastern coasts.\n\nAustralia is one of the most multicultural nations in the world, with people from over 200 countries calling it home.",
        contentZh:
          "澳大利亚是世界第六大国家，也是唯一一个同时也是大陆的国家。首都是堪培拉，作为悉尼和墨尔本两个竞争城市之间的折中选择。\n\n澳大利亚有六个州：新南威尔士州、维多利亚州、昆士兰州、南澳大利亚州、西澳大利亚州和塔斯马尼亚州。它还有两个大陆领地：澳大利亚首都领地（ACT）和北领地。\n\n西澳大利亚州是面积最大的州，占大陆的约三分之一。澳大利亚的人口约为2600万，大多数居住在东部和东南部海岸。\n\n澳大利亚是世界上最多元文化的国家之一，来自200多个国家的人们称之为家。",
        keyFacts: [
          "Canberra is the capital city of Australia",
          "Australia has 6 states and 2 mainland territories",
          "Western Australia is the largest state by area",
          "Population is approximately 26 million",
        ],
        keyFactsZh: [
          "堪培拉是澳大利亚的首都",
          "澳大利亚有6个州和2个大陆领地",
          "西澳大利亚州是面积最大的州",
          "人口约为2600万",
        ],
        relatedQuestionIds: ["ap-01", "ap-11", "ap-16", "ap-17"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // TOPIC 2: Democratic Beliefs, Rights & Liberties
  // ─────────────────────────────────────────────────────────────
  {
    id: "democratic-beliefs",
    title: "Democratic Beliefs, Rights & Liberties",
    titleZh: "民主信念、权利与自由",
    description:
      "Understand Australia's democratic system, fundamental freedoms, the rule of law, and citizens' rights and responsibilities.",
    descriptionZh:
      "了解澳大利亚的民主制度、基本自由、法治以及公民的权利和责任。",
    sections: [
      {
        id: "db-s1",
        title: "Parliamentary Democracy",
        titleZh: "议会民主",
        content:
          "Australia is a parliamentary democracy. This means the power of the government comes from the Australian people, who elect representatives to make decisions on their behalf.\n\nVoting in federal and state elections is compulsory for Australian citizens aged 18 years and over. This ensures that all citizens have a say in how their country is governed.\n\nAustralia uses a system called preferential voting, where voters number candidates in order of preference. This helps ensure that the elected representative is supported by a majority of voters.\n\nThe separation of powers divides government into three branches: legislative (Parliament makes laws), executive (government ministers and departments implement laws), and judicial (courts interpret and apply laws). This prevents any one group from having all the power.",
        contentZh:
          "澳大利亚是一个议会民主国家。这意味着政府的权力来自澳大利亚人民，他们选举代表代替他们做出决定。\n\n联邦和州选举中，18岁及以上的澳大利亚公民必须投票。这确保所有公民对国家的治理有发言权。\n\n澳大利亚使用一种叫做优先投票的制度，选民按偏好顺序为候选人编号。这有助于确保当选代表得到大多数选民的支持。\n\n权力分立将政府分为三个分支：立法（议会制定法律）、行政（政府部长和部门执行法律）和司法（法院解释和适用法律）。这防止任何一个群体拥有所有权力。",
        keyFacts: [
          "Australia is a parliamentary democracy",
          "Voting is compulsory for citizens aged 18 and over",
          "Australia uses preferential voting",
          "Three branches: legislative, executive, judicial",
        ],
        keyFactsZh: [
          "澳大利亚是一个议会民主国家",
          "18岁及以上公民必须投票",
          "澳大利亚使用优先投票制",
          "三个分支：立法、行政、司法",
        ],
        relatedQuestionIds: ["db-01", "db-05", "db-06"],
      },
      {
        id: "db-s2",
        title: "Fundamental Freedoms",
        titleZh: "基本自由",
        content:
          "Australians enjoy several fundamental freedoms protected by law.\n\nFreedom of speech means Australians are free to say and write what they think, and to discuss ideas with others. However, there are laws against defamation, racial vilification, and inciting violence.\n\nFreedom of religion means people are free to follow any religion or no religion at all. Australian law separates religious practices from the laws of the country.\n\nFreedom of association means people can join or leave any lawful organisation, club, or group. Nobody can be forced to belong to an organisation.\n\nFreedom of movement means Australians are free to travel within Australia and to leave and re-enter the country. There are no internal border restrictions between states.",
        contentZh:
          "澳大利亚人享有法律保护的几项基本自由。\n\n言论自由意味着澳大利亚人可以自由地说和写他们的想法，并与他人讨论观点。但是，有针对诽谤、种族歧视和煽动暴力的法律。\n\n宗教自由意味着人们可以自由地信仰任何宗教或不信仰任何宗教。澳大利亚法律将宗教活动与国家法律分开。\n\n结社自由意味着人们可以参加或离开任何合法的组织、俱乐部或团体。任何人不得被强迫加入某个组织。\n\n迁徙自由意味着澳大利亚人可以在澳大利亚境内自由旅行，并且可以离开和重新进入国家。各州之间没有内部边境限制。",
        keyFacts: [
          "Freedom of speech — but laws exist against defamation and racial vilification",
          "Freedom of religion — any religion or no religion",
          "Freedom of association — join or leave any lawful group",
          "Freedom of movement — travel freely within Australia",
        ],
        keyFactsZh: [
          "言论自由——但有针对诽谤和种族歧视的法律",
          "宗教自由——任何宗教或不信教",
          "结社自由——加入或离开任何合法团体",
          "迁徙自由——在澳大利亚境内自由旅行",
        ],
        relatedQuestionIds: ["db-03", "db-04", "db-09", "db-12"],
      },
      {
        id: "db-s3",
        title: "Rule of Law & Equality",
        titleZh: "法治与平等",
        content:
          "The rule of law is a fundamental principle in Australia. It means that all people are subject to the law, and nobody is above it — including politicians and law enforcement.\n\nEquality before the law means all people are treated equally regardless of their position, wealth, or background. Men and women have equal rights under Australian law, enshrined in legislation such as the Sex Discrimination Act 1984.\n\nA fair trial means a person is presumed innocent until proven guilty. Trials are usually held in open court, and the accused has the right to legal representation.\n\nPeacefulness means Australians resolve differences through discussion, debate, and the democratic process — not through violence or intimidation.",
        contentZh:
          "法治是澳大利亚的基本原则。它意味着所有人都受法律约束，没有人凌驾于法律之上——包括政治家和执法人员。\n\n法律面前人人平等意味着所有人无论其地位、财富或背景如何，都受到平等对待。澳大利亚法律规定男性和女性享有平等权利，并在1984年《性别歧视法》等立法中得到体现。\n\n公正审判意味着一个人在被证明有罪之前被推定为无罪。审判通常在公开法庭进行，被告有权获得法律代理。\n\n和平解决意味着澳大利亚人通过讨论、辩论和民主程序解决分歧——而不是通过暴力或恐吓。",
        keyFacts: [
          "The rule of law means nobody is above the law",
          "Men and women have equal rights under Australian law",
          "A person is presumed innocent until proven guilty",
          "Differences should be resolved peacefully, not through violence",
        ],
        keyFactsZh: [
          "法治意味着没有人凌驾于法律之上",
          "澳大利亚法律规定男性和女性享有平等权利",
          "一个人在被证明有罪之前被推定为无罪",
          "分歧应该和平解决，而不是通过暴力",
        ],
        relatedQuestionIds: ["db-02", "db-07", "db-10", "db-11", "db-13", "db-15"],
      },
      {
        id: "db-s4",
        title: "Rights & Responsibilities",
        titleZh: "权利与责任",
        content:
          "Australian citizens have both rights and responsibilities.\n\nRights include the right to vote, freedom of speech, freedom of religion, protection under the law, and access to government services.\n\nResponsibilities include obeying the law, voting in elections, serving on a jury if called, and defending Australia should the need arise.\n\nThe government can limit some rights, but only through laws passed by Parliament that are consistent with the Australian Constitution. The courts protect individuals from unjust laws.\n\nEquality of opportunity means that what someone achieves in life should be a result of their talents, work, and effort — rather than their birth or background.",
        contentZh:
          "澳大利亚公民既有权利也有责任。\n\n权利包括投票权、言论自由、宗教自由、法律保护以及获得政府服务的权利。\n\n责任包括遵守法律、在选举中投票、如被征召则担任陪审员，以及在需要时保卫澳大利亚。\n\n政府可以限制某些权利，但只能通过议会通过的、符合澳大利亚宪法的法律来实现。法院保护个人免受不公正法律的侵害。\n\n机会平等意味着一个人在生活中取得的成就应该是其才能、工作和努力的结果——而不是其出身或背景。",
        keyFacts: [
          "Citizens must vote, obey the law, and serve on a jury if called",
          "Rights include voting, freedom of speech, and freedom of religion",
          "The government can only limit rights through laws consistent with the Constitution",
          "Equality of opportunity — success based on effort, not background",
        ],
        keyFactsZh: [
          "公民必须投票、遵守法律，并在被征召时担任陪审员",
          "权利包括投票权、言论自由和宗教自由",
          "政府只能通过符合宪法的法律来限制权利",
          "机会平等——成功基于努力，而非背景",
        ],
        relatedQuestionIds: ["db-08", "db-14"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // TOPIC 3: Government and the Law
  // ─────────────────────────────────────────────────────────────
  {
    id: "government-law",
    title: "Government and the Law",
    titleZh: "政府与法律",
    description:
      "Learn about Australia's three levels of government, the Constitution, Parliament, and the court system.",
    descriptionZh:
      "了解澳大利亚的三级政府、宪法、议会和法院制度。",
    sections: [
      {
        id: "gl-s1",
        title: "Three Levels of Government",
        titleZh: "三级政府",
        content:
          "Australia has three levels of government, each with different responsibilities.\n\nThe federal (national) government is responsible for matters that affect the whole country, including defence, immigration, trade, foreign affairs, currency, and telecommunications.\n\nState and territory governments manage services within their jurisdiction, such as schools, hospitals, public transport, police, and roads.\n\nLocal governments (councils) handle services within their local area, including waste collection, local roads, libraries, parks, and town planning.\n\nThe Australian Capital Territory (ACT) is where the national capital, Canberra, is located. The Northern Territory is the other mainland territory.",
        contentZh:
          "澳大利亚有三级政府，各有不同的职责。\n\n联邦（国家）政府负责影响整个国家的事务，包括国防、移民、贸易、外交事务、货币和电信。\n\n州和领地政府管理其管辖范围内的服务，如学校、医院、公共交通、警察和道路。\n\n地方政府（议会）处理其辖区内的服务，包括垃圾收集、地方道路、图书馆、公园和城镇规划。\n\n澳大利亚首都领地（ACT）是国家首都堪培拉的所在地。北领地是另一个大陆领地。",
        keyFacts: [
          "Federal: defence, immigration, trade, foreign affairs",
          "State/territory: schools, hospitals, public transport, police",
          "Local: waste, local roads, libraries, parks",
          "Australia has 6 states and 2 mainland territories",
        ],
        keyFactsZh: [
          "联邦：国防、移民、贸易、外交",
          "州/领地：学校、医院、公共交通、警察",
          "地方：垃圾、地方道路、图书馆、公园",
          "澳大利亚有6个州和2个大陆领地",
        ],
        relatedQuestionIds: ["gl-01", "gl-11", "gl-13", "gl-14"],
      },
      {
        id: "gl-s2",
        title: "The Constitution",
        titleZh: "宪法",
        content:
          "The Australian Constitution is the set of rules by which Australia is governed. It came into effect on 1 January 1901 when the six colonies federated.\n\nThe Constitution defines the powers of the federal government, the structure of Parliament, and the relationship between the states and the Commonwealth.\n\nThe Constitution can only be changed through a referendum — a vote by the Australian people. For a change to succeed, it requires a double majority: a majority of voters nationally AND a majority of voters in a majority of states (at least 4 out of 6).\n\nThe High Court of Australia is the final interpreter of the Constitution. It ensures that laws made by Parliament are consistent with the Constitution.",
        contentZh:
          "澳大利亚宪法是治理澳大利亚的一套规则。它于1901年1月1日六个殖民地联合时生效。\n\n宪法定义了联邦政府的权力、议会的结构以及各州与联邦之间的关系。\n\n宪法只能通过公民投票——即澳大利亚人民的投票来修改。要使修改成功，需要双重多数：全国多数选民同意，并且在多数州（至少6个中的4个）中多数选民同意。\n\n澳大利亚高等法院是宪法的最终解释者。它确保议会制定的法律符合宪法。",
        keyFacts: [
          "The Constitution came into effect on 1 January 1901",
          "It can only be changed through a referendum (vote by the people)",
          "A referendum requires a double majority to succeed",
          "The High Court is the final interpreter of the Constitution",
        ],
        keyFactsZh: [
          "宪法于1901年1月1日生效",
          "只能通过公民投票（人民投票）来修改",
          "公民投票需要双重多数才能通过",
          "高等法院是宪法的最终解释者",
        ],
        relatedQuestionIds: ["gl-02", "gl-09", "gl-10"],
      },
      {
        id: "gl-s3",
        title: "Federal Parliament",
        titleZh: "联邦议会",
        content:
          "The Australian federal Parliament has two houses: the Senate (Upper House) and the House of Representatives (Lower House).\n\nThe House of Representatives is sometimes called 'the people's house.' Members represent individual electorates and are elected based on population. The party or coalition with the majority of seats in the House forms the government, and its leader becomes the Prime Minister.\n\nThe Senate reviews and amends legislation proposed by the House of Representatives. It is sometimes called the 'house of review' and ensures that states' interests are represented. Each state has 12 senators, and each territory has 2.\n\nThe minimum voting age is 18. Australian citizens must enrol and vote in federal and state elections.",
        contentZh:
          "澳大利亚联邦议会有两个院：参议院（上议院）和众议院（下议院）。\n\n众议院有时被称为「人民之院」。议员代表各个选区，根据人口选举产生。在众议院拥有多数席位的政党或联盟组成政府，其领导人成为总理。\n\n参议院审查和修改众议院提出的立法。它有时被称为「审查之院」，确保各州的利益得到代表。每个州有12名参议员，每个领地有2名。\n\n最低投票年龄为18岁。澳大利亚公民必须登记并在联邦和州选举中投票。",
        keyFacts: [
          "Two houses: Senate (Upper) and House of Representatives (Lower)",
          "The House of Representatives is 'the people's house'",
          "The Senate is 'the house of review'",
          "The Prime Minister leads the party with majority in the House",
          "Minimum voting age is 18",
        ],
        keyFactsZh: [
          "两个院：参议院（上议院）和众议院（下议院）",
          "众议院被称为「人民之院」",
          "参议院被称为「审查之院」",
          "总理领导在众议院拥有多数的政党",
          "最低投票年龄为18岁",
        ],
        relatedQuestionIds: ["gl-04", "gl-05", "gl-07", "gl-08", "gl-12"],
      },
      {
        id: "gl-s4",
        title: "Head of State & Governor-General",
        titleZh: "国家元首与总督",
        content:
          "Australia's Head of State is the King of Australia (currently King Charles III). The King is represented in Australia by the Governor-General at the federal level, and by Governors in each state.\n\nThe Governor-General's duties include giving Royal Assent to laws passed by Parliament, opening and closing Parliament, and acting on the advice of government ministers.\n\nThe Prime Minister is the head of the Australian Government — the leader of the political party or coalition with the majority of seats in the House of Representatives. The Prime Minister is not directly elected by the people; they are chosen by their party.\n\nAustralia is both a constitutional monarchy and a parliamentary democracy.",
        contentZh:
          "澳大利亚的国家元首是澳大利亚国王（目前是查尔斯三世国王）。国王在澳大利亚由总督在联邦层面代表，由各州州长代表。\n\n总督的职责包括对议会通过的法律给予皇室同意、开闭议会，以及按照政府部长的建议行事。\n\n总理是澳大利亚政府的首脑——在众议院拥有多数席位的政党或联盟的领导人。总理不是由人民直接选举产生的；他们由其政党选定。\n\n澳大利亚既是君主立宪制国家，又是议会民主制国家。",
        keyFacts: [
          "The King of Australia is the Head of State, represented by the Governor-General",
          "The Governor-General gives Royal Assent to laws",
          "The Prime Minister is the head of the government",
          "Australia is a constitutional monarchy and parliamentary democracy",
        ],
        keyFactsZh: [
          "澳大利亚国王是国家元首，由总督代表",
          "总督对法律给予皇室同意",
          "总理是政府首脑",
          "澳大利亚是君主立宪制和议会民主制国家",
        ],
        relatedQuestionIds: ["gl-03", "gl-06"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // TOPIC 4: Australian Values
  // ─────────────────────────────────────────────────────────────
  {
    id: "australian-values",
    title: "Australian Values",
    titleZh: "澳大利亚价值观",
    description:
      "Master the Australian values — all 5 values questions must be answered correctly to pass the citizenship test.",
    descriptionZh:
      "掌握澳大利亚价值观——所有5个价值观问题必须全部答对才能通过公民考试。",
    sections: [
      {
        id: "av-s1",
        title: "Respect & Equality",
        titleZh: "尊重与平等",
        content:
          "Respect and mutual regard are core Australian values. Australians treat each other with dignity and consideration, regardless of background, gender, sexual orientation, age, disability, or religion.\n\nRespect extends to understanding and appreciating Australia's Indigenous heritage, the cultures of all Australians, and the institutions that govern the country.\n\nEquality between men and women is a fundamental value. Women have the same rights as men in all aspects of life — in the workplace, in education, and in family life. Discrimination based on gender is against the law.\n\nAustralians value diversity and believe that people from different backgrounds strengthen the nation.",
        contentZh:
          "尊重和相互关怀是澳大利亚的核心价值观。澳大利亚人以尊严和体贴对待彼此，无论背景、性别、性取向、年龄、残疾或宗教如何。\n\n尊重延伸到理解和欣赏澳大利亚的原住民遗产、所有澳大利亚人的文化以及治理国家的制度。\n\n男女平等是一项基本价值观。女性在生活的各个方面都享有与男性相同的权利——在工作场所、教育和家庭生活中。基于性别的歧视是违法的。\n\n澳大利亚人重视多样性，相信来自不同背景的人增强了国家的力量。",
        keyFacts: [
          "Respect means treating all people with dignity regardless of background",
          "Men and women have equal rights — gender discrimination is illegal",
          "Respect includes understanding Indigenous heritage",
          "Diversity strengthens the nation",
        ],
        keyFactsZh: [
          "尊重意味着以尊严对待所有人，无论其背景如何",
          "男女享有平等权利——性别歧视是违法的",
          "尊重包括理解原住民遗产",
          "多样性增强了国家的力量",
        ],
        relatedQuestionIds: ["av-01", "av-02", "av-05", "av-06", "av-10", "av-14"],
      },
      {
        id: "av-s2",
        title: "Fair Go & Mateship",
        titleZh: "公平机会与伙伴情谊",
        content:
          "The concept of a 'fair go' is deeply embedded in Australian culture. It means that everyone deserves an equal chance to succeed, regardless of their starting point in life.\n\nA fair go encompasses equality of opportunity — what you achieve should be based on your talents and hard work, not your birth or social status.\n\nMateship is a uniquely Australian value that emphasises loyalty, equality, and support for friends and community. It means looking out for others and supporting those in need.\n\nMateship was forged during moments of hardship, especially during wartime (such as Gallipoli), and continues to define how Australians rally together in times of crisis, natural disaster, and everyday life.",
        contentZh:
          "\"公平机会\"的概念深深植根于澳大利亚文化中。它意味着每个人都应该有平等的成功机会，无论他们的起点如何。\n\n公平机会包含机会平等——你的成就应该基于你的才能和勤奋，而不是你的出身或社会地位。\n\n伙伴情谊是一种独特的澳大利亚价值观，强调对朋友和社区的忠诚、平等和支持。它意味着关心他人并支持那些需要帮助的人。\n\n伙伴情谊是在艰难时刻——特别是战时（如加里波利）锻造出来的，并继续定义着澳大利亚人在危机、自然灾害和日常生活中如何团结一致。",
        keyFacts: [
          "'Fair go' means everyone deserves an equal chance to succeed",
          "Success should be based on talents and effort, not birth",
          "Mateship means loyalty, equality, and looking out for others",
          "Mateship was forged through hardship and defines Australian unity",
        ],
        keyFactsZh: [
          "「公平机会」意味着每个人都应该有平等的成功机会",
          "成功应该基于才能和努力，而不是出身",
          "伙伴情谊意味着忠诚、平等和关心他人",
          "伙伴情谊是通过艰难时刻锻造的，定义了澳大利亚的团结",
        ],
        relatedQuestionIds: ["av-03", "av-04", "av-07", "av-11", "av-15"],
      },
      {
        id: "av-s3",
        title: "Freedom & Dignity",
        titleZh: "自由与尊严",
        content:
          "Individual freedom and dignity are core Australian values. Australians believe every person has inherent worth that must be respected.\n\nFreedom of thought, conscience, and belief means people can hold their own views and make their own choices about how to live their lives, as long as they respect the law and the rights of others.\n\nAustralians strongly oppose any form of bullying, intimidation, or harassment. Using violence to resolve disputes is unacceptable in Australian society.\n\nWhile Australians celebrate diversity of thought and belief, all people living in Australia are expected to respect and obey Australian laws, regardless of their personal, cultural, or religious beliefs.",
        contentZh:
          "个人自由和尊严是澳大利亚的核心价值观。澳大利亚人相信每个人都有必须得到尊重的固有价值。\n\n思想、良心和信仰自由意味着人们可以持有自己的观点，可以自主选择如何生活，只要他们尊重法律和他人的权利。\n\n澳大利亚人强烈反对任何形式的欺凌、恐吓或骚扰。在澳大利亚社会中，使用暴力解决矛盾是不可接受的。\n\n虽然澳大利亚人庆祝思想和信仰的多样性，但生活在澳大利亚的所有人都应该尊重和遵守澳大利亚法律，无论他们个人、文化或宗教信仰如何。",
        keyFacts: [
          "Every person has inherent worth and dignity",
          "Freedom of thought and belief — but you must respect the law",
          "Violence, bullying, and intimidation are unacceptable",
          "Everyone must respect and obey Australian laws",
        ],
        keyFactsZh: [
          "每个人都有固有的价值和尊严",
          "思想和信仰自由——但必须尊重法律",
          "暴力、欺凌和恐吓是不可接受的",
          "每个人都必须尊重和遵守澳大利亚法律",
        ],
        relatedQuestionIds: ["av-08", "av-09", "av-12", "av-13"],
      },
      {
        id: "av-s4",
        title: "Compassion & Peacefulness",
        titleZh: "同情心与和平",
        content:
          "Compassion is a valued trait in Australian society. Australians believe in helping those in need, both within the community and around the world.\n\nAustralia has a strong tradition of volunteering and community service. Many Australians donate their time and resources to support charities, community organisations, and neighbours in need.\n\nPeacefulness is fundamental to Australian life. Australians believe that differences of opinion should be resolved through peaceful discussion, debate, and the democratic process — not through violence, threats, or intimidation.\n\nAustralians are expected to resolve personal and community disputes through legal channels and civil dialogue. Violent behaviour, domestic abuse, and forced marriage are serious crimes in Australia.",
        contentZh:
          "同情心是澳大利亚社会中受到重视的品质。澳大利亚人相信帮助有需要的人，无论是在社区内还是世界各地。\n\n澳大利亚有着悠久的志愿服务和社区服务传统。许多澳大利亚人捐出时间和资源来支持慈善机构、社区组织和需要帮助的邻居。\n\n和平是澳大利亚生活的基本原则。澳大利亚人相信意见分歧应该通过和平讨论、辩论和民主程序来解决——而不是通过暴力、威胁或恐吓。\n\n澳大利亚人应通过法律渠道和文明对话解决个人和社区纠纷。暴力行为、家庭虐待和强迫婚姻在澳大利亚是严重的犯罪行为。",
        keyFacts: [
          "Compassion means helping those in need",
          "Volunteering and community service are valued traditions",
          "Differences should be resolved peacefully through democratic processes",
          "Domestic violence, forced marriage, and intimidation are serious crimes",
        ],
        keyFactsZh: [
          "同情心意味着帮助有需要的人",
          "志愿服务和社区服务是受重视的传统",
          "分歧应通过民主程序和平解决",
          "家庭暴力、强迫婚姻和恐吓是严重的犯罪行为",
        ],
        relatedQuestionIds: ["av-16", "av-17", "av-18", "av-19", "av-20"],
      },
    ],
  },
];
