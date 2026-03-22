import type { QuizQuestion } from "@/lib/types";

// ===== CitizenMate Question Bank =====
// Questions inspired by "Our Common Bond" — the official study resource
// for the Australian Citizenship Test.
//
// 4 testable sections:
// 1. Australia and its people
// 2. Australia's democratic beliefs, rights and liberties
// 3. Government and the law in Australia
// 4. Australian values

export const questionBank: QuizQuestion[] = [
  // ─────────────────────────────────────────────────
  // SECTION 1: Australia and Its People (20 questions)
  // ─────────────────────────────────────────────────

  {
    id: "ap-01",
    text: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctAnswer: 2,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Canberra is the capital city of Australia. It was chosen as a compromise between Sydney and Melbourne when the federation was formed in 1901.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-02",
    text: "Who are the original inhabitants of Australia?",
    options: [
      "The Maori people",
      "Aboriginal and Torres Strait Islander peoples",
      "The Polynesian people",
      "European settlers",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Aboriginal and Torres Strait Islander peoples are the original inhabitants of Australia. They have lived on this land for over 65,000 years, making them one of the world's oldest continuous cultures.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-03",
    text: "On what date is Australia Day celebrated?",
    options: [
      "1 January",
      "25 April",
      "26 January",
      "25 December",
    ],
    correctAnswer: 2,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Australia Day is celebrated on 26 January each year. It marks the anniversary of the arrival of the First Fleet at Sydney Cove in 1788.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-04",
    text: "What are the colours of the Australian flag?",
    options: [
      "Red, white, and green",
      "Blue, red, and white",
      "Blue, gold, and green",
      "Red, white, and blue with gold stars",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Australian flag features blue, red, and white. It includes the Union Jack, the Commonwealth Star, and the Southern Cross constellation.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-05",
    text: "What does Anzac Day commemorate?",
    options: [
      "The founding of Australia",
      "The landing of Australian and New Zealand soldiers at Gallipoli",
      "Australia becoming a federation",
      "The end of World War II",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Anzac Day (25 April) commemorates the landing of Australian and New Zealand Army Corps (ANZAC) soldiers at Gallipoli, Turkey, in 1915 during World War I. It is a day to remember all Australians who served and died in wars and conflicts.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-06",
    text: "In what year did the Australian colonies federate to form the Commonwealth of Australia?",
    options: ["1888", "1901", "1945", "1956"],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "On 1 January 1901, the six colonies federated to form the Commonwealth of Australia. This is known as Federation.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-07",
    text: "What is the name of the national anthem of Australia?",
    options: [
      "God Save the King",
      "Waltzing Matilda",
      "Advance Australia Fair",
      "The Star-Spangled Banner",
    ],
    correctAnswer: 2,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Australia's national anthem is 'Advance Australia Fair.' It was officially adopted as the national anthem in 1984.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-08",
    text: "What are Australia's national colours?",
    options: [
      "Red and blue",
      "Green and gold",
      "Blue and white",
      "Red and white",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Australia's national colours are green and gold. These colours are associated with native flora such as the golden wattle, Australia's national flower.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-09",
    text: "What is the Commonwealth Star on the Australian flag?",
    options: [
      "A six-pointed star representing the six states",
      "A seven-pointed star representing the six states and territories",
      "A five-pointed star representing the Southern Cross",
      "A star representing the United Kingdom",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Commonwealth Star (also called the Federation Star) is a seven-pointed star beneath the Union Jack on the Australian flag. Six points represent the six states and the seventh represents the territories.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-10",
    text: "What is the significance of the Southern Cross on the Australian flag?",
    options: [
      "It represents the British heritage",
      "It is a constellation visible from the Southern Hemisphere",
      "It represents the six colonies",
      "It honours Indigenous Australians",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Southern Cross is a constellation of five stars visible from the Southern Hemisphere. It has been used to represent Australia since the early days of British settlement.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-11",
    text: "What is the population of Australia approximately?",
    options: [
      "About 15 million",
      "About 20 million",
      "About 26 million",
      "About 35 million",
    ],
    correctAnswer: 2,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Australia's population is approximately 26 million people. Australia is one of the most multicultural nations in the world.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-12",
    text: "What is the national flower of Australia?",
    options: [
      "Rose",
      "Golden wattle",
      "Eucalyptus blossom",
      "Banksia",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The golden wattle (Acacia pycnantha) is the national flower of Australia. It is a symbol of unity and has been used as Australia's floral emblem since 1988.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-13",
    text: "Which of the following is an important day for Aboriginal and Torres Strait Islander peoples?",
    options: [
      "Boxing Day",
      "NAIDOC Week",
      "Melbourne Cup Day",
      "Easter Monday",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "NAIDOC Week celebrates the history, culture, and achievements of Aboriginal and Torres Strait Islander peoples. It is held in the first week of July each year.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-14",
    text: "What happened at Gallipoli in 1915?",
    options: [
      "Australia became independent",
      "Gold was discovered",
      "Australian and New Zealand forces landed during World War I",
      "The Australian Constitution was signed",
    ],
    correctAnswer: 2,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "In 1915, Australian and New Zealand soldiers (ANZACs) landed at Gallipoli in Turkey during World War I. The bravery and sacrifice of the ANZACs is remembered on Anzac Day each year.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-15",
    text: "Who was the first Prime Minister of Australia?",
    options: [
      "Sir Henry Parkes",
      "Sir Edmund Barton",
      "Sir Robert Menzies",
      "John Curtin",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Sir Edmund Barton was the first Prime Minister of Australia, serving from 1901 to 1903. He played a leading role in the federation movement.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-16",
    text: "How many states are there in Australia?",
    options: ["4", "5", "6", "8"],
    correctAnswer: 2,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Australia has six states: New South Wales, Victoria, Queensland, South Australia, Western Australia, and Tasmania. It also has two mainland territories: the Australian Capital Territory and the Northern Territory.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-17",
    text: "What is the largest state or territory in Australia by area?",
    options: [
      "Queensland",
      "New South Wales",
      "Western Australia",
      "Northern Territory",
    ],
    correctAnswer: 2,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Western Australia is the largest state, covering about one-third of the Australian continent.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-18",
    text: "What do we remember on Remembrance Day?",
    options: [
      "The founding of Australia",
      "The end of World War I",
      "The discovery of gold",
      "The arrival of the First Fleet",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Remembrance Day (11 November) marks the anniversary of the armistice that ended World War I in 1918. Australians observe a minute's silence at 11 am.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-19",
    text: "What is the Torres Strait?",
    options: [
      "A river in Queensland",
      "A body of water between Australia and Papua New Guinea",
      "A mountain range in Tasmania",
      "A desert in South Australia",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Torres Strait is a body of water that lies between the northern tip of Queensland and Papua New Guinea. The Torres Strait Islander peoples are the Indigenous peoples of this region.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-20",
    text: "What is the significance of the 'Dreamtime' or 'Dreaming' in Aboriginal culture?",
    options: [
      "It refers to the time Aboriginal people sleep",
      "It describes the creation period in Aboriginal spiritual beliefs",
      "It is a modern art movement",
      "It is a type of Aboriginal ceremony",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Dreamtime or Dreaming refers to Aboriginal spiritual beliefs about the creation of the world and all living things. It encompasses the past, present, and future, and includes stories of how the land, animals, and people came to be.",
    bookReference: "Our Common Bond — Australia and its people",
  },

  // ─────────────────────────────────────────────────────────────
  // SECTION 2: Democratic Beliefs, Rights & Liberties (15 questions)
  // ─────────────────────────────────────────────────────────────

  {
    id: "db-01",
    text: "What type of government does Australia have?",
    options: [
      "A monarchy",
      "A parliamentary democracy",
      "A dictatorship",
      "A republic",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Australia is a parliamentary democracy. This means the power of government comes from the Australian people, who elect representatives to the Parliament.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-02",
    text: "What is the rule of law?",
    options: [
      "The Prime Minister can make any law",
      "All people are equal under the law and nobody is above the law",
      "Police can do whatever they want",
      "Laws only apply to citizens",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "The rule of law means that all people are subject to the law, and no one is above it — including politicians and law enforcement. It is a fundamental principle of Australian democracy.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-03",
    text: "What is freedom of speech in Australia?",
    options: [
      "You can say anything without any consequences",
      "You can express your opinions freely but there are laws against racial vilification",
      "Only the government can express opinions",
      "Freedom of speech does not exist in Australia",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Freedom of speech means Australians are free to say and write what they think, and to discuss their ideas with others. However, this does not mean that people can say anything they want — there are laws to protect people from defamation and racial vilification.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-04",
    text: "What is freedom of religion in Australia?",
    options: [
      "Everyone must follow the same religion",
      "People are free to follow any religion or no religion at all",
      "Only Christianity is allowed",
      "Religion is not allowed in Australia",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Australia has freedom of religion. People are free to follow any religion or no religion at all. Australian law separates religious practices from the laws of the country.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-05",
    text: "Is voting compulsory in Australian federal elections?",
    options: [
      "No, voting is optional",
      "Yes, voting is compulsory for Australian citizens aged 18 and over",
      "Only men are required to vote",
      "Voting is only compulsory for state elections",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Voting in federal and state elections is compulsory for Australian citizens aged 18 years and over. This is part of Australia's democratic system.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-06",
    text: "What is the separation of powers in Australian government?",
    options: [
      "The states are separate from the territories",
      "The legislative, executive, and judicial powers are held by different bodies",
      "The army is separate from the police",
      "The Prime Minister holds all the power",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "The separation of powers means that the three arms of government — legislative (Parliament), executive (government ministries), and judicial (courts) — are separate. This prevents any one group from having all the power.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-07",
    text: "What does 'equality of opportunity' mean in Australia?",
    options: [
      "Everyone is guaranteed the same income",
      "People can achieve success through hard work regardless of their background",
      "Only men have equal opportunities",
      "Opportunities are only for Australian-born citizens",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Equality of opportunity means that what someone achieves in life should be a result of their talents, work, and effort rather than their birth or background.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-08",
    text: "What is a responsibility of Australian citizens?",
    options: [
      "To serve in the military",
      "To serve on a jury if called to do so",
      "To attend church every Sunday",
      "To own property",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Serving on a jury is a responsibility of Australian citizens. If called for jury service, citizens must attend unless they have a valid reason not to.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-09",
    text: "What does 'freedom of association' mean?",
    options: [
      "People must join a political party",
      "People can join or leave any lawful organisation, club, or group",
      "Associations are banned in Australia",
      "Only businesses can form associations",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Freedom of association means people are free to join or leave any lawful organisation, club, or group. Nobody can be forced to belong to an organisation.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-10",
    text: "What is 'equality before the law'?",
    options: [
      "Rich people get better treatment in court",
      "All people are treated equally by the law regardless of their background",
      "Only citizens are protected by the law",
      "The law doesn't apply to politicians",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Equality before the law means that all people are treated equally under the law. No one is above the law, regardless of their position, wealth, or background.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-11",
    text: "What is a 'fair trial' in Australia?",
    options: [
      "Only the judge decides if you are guilty",
      "A person is considered innocent until proven guilty, and trials are held in open court",
      "Trials are always held in secret",
      "You must prove your innocence yourself",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "In Australia, a person is presumed innocent until proven guilty. Trials are usually held in open court, and the accused has the right to legal representation.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-12",
    text: "What freedom allows Australians to travel freely within Australia?",
    options: [
      "Freedom of speech",
      "Freedom of movement",
      "Freedom of religion",
      "Freedom of trade",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Freedom of movement means Australians are free to travel within and to leave and re-enter Australia. There are no internal border restrictions between states.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-13",
    text: "Do men and women have equal rights in Australia?",
    options: [
      "No, men have more rights",
      "Yes, men and women have equal rights under Australian law",
      "Only in some states",
      "Only in the workplace",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "In Australia, men and women have equal rights. This is enshrined in Australian law through various legislation including the Sex Discrimination Act 1984.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-14",
    text: "Can the government limit the rights of Australians?",
    options: [
      "No, rights can never be limited",
      "Yes, but only through laws passed by Parliament and subject to the Constitution",
      "The Prime Minister alone can limit rights",
      "Only the police can limit rights",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "The government can limit some rights, but only through laws passed by Parliament and these must be consistent with the Australian Constitution. The courts protect individuals from unjust laws.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-15",
    text: "What is peacefulness in Australian society?",
    options: [
      "Australians never disagree with each other",
      "People resolve differences through discussion and legal processes, not violence",
      "Only the police maintain peace",
      "People are not allowed to protest",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Peacefulness means that differences of opinion in the community should be resolved through discussion, debate, and the democratic process — not through violence or intimidation. People have the right to peaceful protest.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },

  // ─────────────────────────────────────────────────────────────
  // SECTION 3: Government and the Law (15 questions)
  // ─────────────────────────────────────────────────────────────

  {
    id: "gl-01",
    text: "What are the three levels of government in Australia?",
    options: [
      "City, state, and territory",
      "Federal, state/territory, and local",
      "Parliament, Senate, and House",
      "Prime Minister, Premier, and Mayor",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Australia has three levels of government: federal (national), state and territory, and local (council). Each level has different responsibilities.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-02",
    text: "What is the Australian Constitution?",
    options: [
      "A list of all Australian laws",
      "The set of rules by which Australia is governed",
      "A document that only applies to politicians",
      "The Australian Bill of Rights",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The Australian Constitution is the set of rules by which Australia is governed. It came into effect on 1 January 1901 and sets out the powers of the federal government and the rights of states.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-03",
    text: "Who is the Head of State of Australia?",
    options: [
      "The Prime Minister",
      "The King of Australia, represented by the Governor-General",
      "The President",
      "The Chief Justice",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Australia's Head of State is the King of Australia (currently King Charles III), who is represented by the Governor-General at the federal level.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-04",
    text: "Who is the head of the Australian Government?",
    options: [
      "The King",
      "The Governor-General",
      "The Prime Minister",
      "The Chief Justice",
    ],
    correctAnswer: 2,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The Prime Minister is the head of the Australian Government. The Prime Minister is the leader of the political party or coalition with the majority of seats in the House of Representatives.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-05",
    text: "What are the two houses of the Australian federal Parliament?",
    options: [
      "House of Lords and House of Commons",
      "Senate and House of Representatives",
      "Upper House and Assembly",
      "Federal Court and High Court",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The Australian federal Parliament has two houses: the Senate (Upper House) and the House of Representatives (Lower House).",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-06",
    text: "What is the role of the Governor-General?",
    options: [
      "To lead the army",
      "To represent the King in Australia and perform constitutional duties",
      "To make all the laws",
      "To run the courts",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The Governor-General represents the King in Australia. Their duties include giving Royal Assent to laws, opening Parliament, and acting on the advice of ministers.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-07",
    text: "Which house of Parliament is sometimes called 'the people's house'?",
    options: [
      "The Senate",
      "The House of Representatives",
      "The High Court",
      "The Privy Council",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The House of Representatives is sometimes called 'the people's house' because members directly represent the Australian people in electorates.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-08",
    text: "What is the role of the Senate?",
    options: [
      "To lead the country",
      "To review and amend legislation proposed by the House of Representatives",
      "To declare war",
      "To manage local councils",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The Senate reviews and amends legislation (bills) proposed by the House of Representatives. It is sometimes called the 'house of review.' It also ensures that states' interests are represented.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-09",
    text: "How is the Australian Constitution changed?",
    options: [
      "By the Prime Minister",
      "Through a referendum — a vote by the Australian people",
      "By the Governor-General",
      "By a vote in Parliament only",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The Australian Constitution can only be changed through a referendum — a vote by the Australian people. A majority of voters nationally and a majority of voters in a majority of states must agree.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-10",
    text: "What is the role of the High Court of Australia?",
    options: [
      "To make new laws",
      "To interpret the Constitution and hear cases of national significance",
      "To elect the Prime Minister",
      "To manage state government affairs",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The High Court is the highest court in Australia. It interprets the Constitution and is the final court of appeal. It ensures laws are consistent with the Constitution.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-11",
    text: "What is the responsibility of local government (councils)?",
    options: [
      "National defence",
      "Local services such as waste collection, local roads, and libraries",
      "International trade",
      "Running the national economy",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Local councils are responsible for services within their local area, including waste collection, local roads, libraries, parks, and town planning.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-12",
    text: "What is the minimum voting age in Australia?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "In Australia, citizens aged 18 years and over are required to enrol and vote in federal and state elections.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-13",
    text: "What are some responsibilities of the federal government?",
    options: [
      "Local parks and libraries",
      "Defence, immigration, and trade",
      "Garbage collection and street lighting",
      "School buildings and local roads",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The federal government is responsible for national matters including defence, immigration, trade, foreign affairs, currency, postal services, and telecommunications.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-14",
    text: "What are some responsibilities of state and territory governments?",
    options: [
      "Defence and foreign affairs",
      "Schools, hospitals, public transport, and police",
      "Immigration and customs",
      "Printing money",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "State and territory governments are responsible for services such as schools, hospitals, roads, public transport, police, and emergency services.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-15",
    text: "What happens when a bill is passed by both houses of Parliament?",
    options: [
      "It automatically becomes law",
      "It must receive Royal Assent from the Governor-General to become law",
      "It must be approved by the Prime Minister",
      "It is sent to the United Nations",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "After a bill is passed by both the House of Representatives and the Senate, it must receive Royal Assent from the Governor-General before it becomes law (an Act of Parliament).",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },

  // ─────────────────────────────────────────────────────────
  // SECTION 4: Australian Values (20 questions)
  // All tagged isValuesQuestion: true
  // The real test has 5 values questions — all must be correct
  // ─────────────────────────────────────────────────────────

  {
    id: "av-01",
    text: "Which of the following is an Australian value?",
    options: [
      "Obedience to a single leader",
      "Respect for the freedom and dignity of the individual",
      "Only the rich should have opportunities",
      "People should not question the government",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Respect for the freedom and dignity of the individual is a core Australian value. Australians value the ability of every person to be treated with dignity and to make decisions about their own lives.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-02",
    text: "What does 'a fair go' mean?",
    options: [
      "A free ride on public transport",
      "Everyone deserves an equal chance to succeed",
      "Only certain people get opportunities",
      "Rich people get better treatment",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "'A fair go' means that what someone achieves should be a result of their talents, work, and effort. All people should have the opportunity to succeed regardless of their background.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-03",
    text: "Is mutual respect between all Australians important?",
    options: [
      "No, only respect for authority figures",
      "Yes, Australians are expected to treat all people with respect regardless of their background",
      "Only for people born in Australia",
      "Only within the same religion",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Mutual respect is an important Australian value. Australians treat all people with dignity and respect regardless of their background, gender, religion, or ethnicity.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-04",
    text: "What is the Australian value of 'mateship'?",
    options: [
      "Only being friends with people from your own country",
      "Looking out for each other and helping those in need",
      "A formal business partnership",
      "Only socializing with men",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Mateship means looking out for each other, helping those in need, and supporting one another through difficult times. It embodies equality, loyalty, and friendship.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-05",
    text: "Should people in Australia follow Australian laws?",
    options: [
      "Only if they agree with them",
      "Yes, everyone must obey the laws of Australia",
      "Only Australian-born citizens must follow the laws",
      "The laws are optional for permanent residents",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Everyone in Australia — citizens, permanent residents, and visitors — must obey the laws of Australia. This includes federal, state, and local laws.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-06",
    text: "What is the value of compassion in Australian society?",
    options: [
      "Only helping people you know",
      "Caring for those in need and treating others with kindness",
      "Ignoring people who are different",
      "Only the government should help people",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Compassion means caring for those in need. Australians value a compassionate society where people help one another and support those going through difficult times.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-07",
    text: "What does 'equality of men and women' mean in Australia?",
    options: [
      "Men have more rights than women",
      "Men and women have equal rights and opportunities in all areas of life",
      "Only women can work in the home",
      "Men and women must do the same jobs",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "In Australia, men and women have equal rights. They have equal access to education, employment, and legal protections. Gender discrimination is against the law.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-08",
    text: "Should Australians try to resolve differences peacefully?",
    options: [
      "No, violence is sometimes acceptable",
      "Yes, resolving differences through discussion and legal processes is an Australian value",
      "Only within families",
      "Only if the police are present",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Peacefulness is a core Australian value. Australians believe in resolving differences through discussion, debate, and the legal system — not through violence.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-09",
    text: "What is the Australian value regarding following the law?",
    options: [
      "Laws are suggestions, not rules",
      "All people must follow the law, and nobody is above it",
      "Rich people can choose which laws to follow",
      "Laws only apply in cities",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "The rule of law is a core Australian value. It means all people are subject to the law and must follow it. No person or group is above the law, regardless of their position.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-10",
    text: "What does freedom of religion mean as an Australian value?",
    options: [
      "Everyone must have a religion",
      "People are free to follow any religion or no religion, and should respect others' beliefs",
      "Only some religions are allowed",
      "Religion determines the law in Australia",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Freedom of religion is an important Australian value. People are free to follow any religion or no religion. Religious laws do not override Australian law, and people should respect the beliefs of others.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-11",
    text: "Is it important for Australians to participate in the democratic process?",
    options: [
      "No, democracy is optional",
      "Yes, participating in elections and community life is an important Australian value",
      "Only wealthy people should participate",
      "Only people born in Australia should vote",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Participating in the democratic process is an important Australian value. This includes voting in elections, respecting others' views, and engaging in civil debate.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-12",
    text: "What do Australians believe about people from diverse backgrounds?",
    options: [
      "People should only associate with their own culture",
      "Australia's strength lies in its diversity, and we should respect all cultures",
      "Only Australian culture matters",
      "New migrants should abandon their culture",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians believe that diversity is one of the country's greatest strengths. People of many cultures, languages, and religions live together harmoniously, and mutual respect is valued.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-13",
    text: "Is it acceptable to use violence in personal disputes in Australia?",
    options: [
      "Yes, if someone offends you",
      "No, using violence is against Australian values and the law",
      "Only if it is a family matter",
      "Only between adults",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Using violence is against both Australian values and the law. Domestic violence, assault, and intimidation are serious crimes. Disputes should be resolved through discussion or the legal system.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-14",
    text: "What is the Australian value about education?",
    options: [
      "Education is optional",
      "Education is important and should be accessible to everyone, regardless of background",
      "Only boys should be educated",
      "Education is only for wealthy families",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians value education for all. All children aged 6 to the school leaving age (varies by state) must attend school. Education is accessible to everyone regardless of background or gender.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-15",
    text: "What does 'having a go' mean in Australian values?",
    options: [
      "Being aggressive towards others",
      "Making an effort and trying your best to achieve your goals",
      "Gambling on horse races",
      "Taking risks without thinking",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "'Having a go' is an Australian value that means making an effort, being willing to try, and doing your best. It reflects the value of self-reliance and determination.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-16",
    text: "What is the Australian value regarding community service?",
    options: [
      "Community service is only for the unemployed",
      "Volunteering and helping the community are valued and encouraged",
      "Only the government should help the community",
      "Community service is punished",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Community service and volunteering are important in Australian society. Australia has one of the highest rates of volunteerism in the world, reflecting the values of mateship and looking out for one another.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-17",
    text: "Do Australians value an independent judiciary?",
    options: [
      "No, the government controls the courts",
      "Yes, courts operate independently from the government to ensure fairness",
      "Only some courts are independent",
      "Judges must follow the Prime Minister's orders",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "An independent judiciary is a core Australian value. Courts operate independently from the government so that everyone receives fair and impartial justice.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-18",
    text: "What is the role of tolerance in Australian values?",
    options: [
      "Tolerating only people like yourself",
      "Accepting and respecting differences in people's beliefs, practices, and way of life",
      "Ignoring differences between people",
      "Forcing everyone to be the same",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Tolerance means accepting and respecting the differences in people's beliefs, practices, and way of life. While people may not agree with others' views, they should be respectful and accept the right of others to hold different opinions.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-19",
    text: "What do Australians value about their environment?",
    options: [
      "Nothing, the environment is not important",
      "Australians value and protect their unique natural environment",
      "Only farmers care about the environment",
      "The environment is only important for tourism",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians value their unique natural environment and take responsibility for protecting it. Environmental conservation is an important part of Australian culture and values.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-20",
    text: "What commitment do new citizens make about Australian values?",
    options: [
      "They don't make any commitment",
      "They pledge to respect Australia's democratic beliefs, rights, and liberties, and uphold its laws",
      "They only promise to pay taxes",
      "They commit to speaking only English",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "In the Australian Citizenship Pledge, new citizens promise to be loyal to Australia and its people, share its democratic beliefs, respect its rights and liberties, and uphold and obey its laws.",
    bookReference: "Our Common Bond — Australian values",
  },

  // ─────────────────────────────────────────────────────────
  // SECTION 1 EXPANSION: Australia and Its People (ap-21 → ap-40)
  // ─────────────────────────────────────────────────────────

  {
    id: "ap-21",
    text: "What are the colours of the Australian Aboriginal flag?",
    options: [
      "Green, yellow, and red",
      "Black, red, and yellow",
      "Blue, white, and red",
      "Green, white, and black",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Australian Aboriginal flag has black (representing Aboriginal peoples), red (the earth and spiritual relationship to the land), and yellow (the sun, the giver of life).",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-22",
    text: "What are the colours of the Torres Strait Islander flag?",
    options: [
      "Blue, black, white, and green",
      "Green, black, white, and blue",
      "Red, white, and blue",
      "Yellow, green, and red",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Torres Strait Islander flag features blue (the sea), black (the people), white (peace), and green (the land). A white dhari (headdress) and five-pointed star are at its centre.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-23",
    text: "When did European settlement of Australia begin?",
    options: ["1770", "1788", "1801", "1851"],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "European settlement began on 26 January 1788, when the First Fleet arrived at Sydney Cove. Captain Arthur Phillip established the penal colony of New South Wales.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-24",
    text: "What was the significance of the gold rushes in the 1850s?",
    options: [
      "They led to the invention of mining equipment",
      "They brought a large wave of immigration and economic growth",
      "They caused Australia to become a republic",
      "They led to the end of Aboriginal culture",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The gold rushes of the 1850s attracted hundreds of thousands of migrants from around the world, leading to rapid population growth, economic development, and the expansion of democratic rights in the colonies.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-25",
    text: "What is the Snowy Mountains Scheme?",
    options: [
      "A tourist hiking trail network",
      "A major engineering project for hydro-electric power and irrigation",
      "A national park conservation plan",
      "An Aboriginal heritage protection program",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Snowy Mountains Scheme (1949–1974) is one of the world's largest engineering projects. It provides hydro-electric power and diverts water for irrigation. Thousands of migrants from over 30 countries helped build it.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-26",
    text: "What is Harmony Day?",
    options: [
      "A day to celebrate Australian music",
      "A day to celebrate Australia's cultural diversity and inclusiveness",
      "A day to remember fallen soldiers",
      "A day to celebrate Australian sports",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Harmony Day is celebrated on 21 March each year. It celebrates Australia's cultural diversity and promotes inclusiveness, respect, and a sense of belonging for everyone.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-27",
    text: "What is National Sorry Day?",
    options: [
      "A day to apologise for environmental damage",
      "A day to acknowledge the mistreatment of Aboriginal and Torres Strait Islander peoples, particularly the Stolen Generations",
      "A day to remember natural disasters",
      "A day to apologise for war crimes",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "National Sorry Day (26 May) acknowledges the mistreatment of Aboriginal and Torres Strait Islander peoples, particularly the Stolen Generations — children who were removed from their families under government policies.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-28",
    text: "What is the Great Barrier Reef?",
    options: [
      "A mountain range in Queensland",
      "The world's largest coral reef system, off the coast of Queensland",
      "A national park in the Northern Territory",
      "An island chain south of Tasmania",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Great Barrier Reef is the world's largest coral reef system, stretching over 2,300 kilometres off the coast of Queensland. It is a UNESCO World Heritage site and home to incredible marine biodiversity.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-29",
    text: "What is Uluru?",
    options: [
      "A major city in central Australia",
      "A large sacred rock formation in the Northern Territory, significant to Aboriginal peoples",
      "A river in South Australia",
      "A mountain range in Western Australia",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Uluru (also known as Ayers Rock) is a large sandstone rock formation in the Northern Territory. It is sacred to the Anangu people and is a UNESCO World Heritage site.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-30",
    text: "What happened on 13 February 2008 in Australian history?",
    options: [
      "Australia became a republic",
      "The Prime Minister made a formal apology to the Stolen Generations",
      "The Olympic Games were held in Sydney",
      "Australia signed a peace treaty",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "On 13 February 2008, Prime Minister Kevin Rudd made a formal apology to Australia's Indigenous peoples, particularly the Stolen Generations, for the laws and policies that caused profound suffering.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-31",
    text: "What is the significance of the Eureka Stockade?",
    options: [
      "It was Australia's first parliament",
      "It was a rebellion by gold miners in 1854 that contributed to democratic reform",
      "It was the first European settlement",
      "It was a famous military battle in World War I",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Eureka Stockade in Ballarat, Victoria (1854) was a rebellion by gold miners protesting unfair mining licence fees and lack of political representation. It is considered a significant event in the development of Australian democracy.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-32",
    text: "What is the role of the 'Digger' in Australian culture?",
    options: [
      "A farmer who digs fields",
      "A term for Australian soldiers, symbolising courage and mateship",
      "A gold miner from the 1850s exclusively",
      "A type of Australian tradesperson",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The term 'Digger' is used to describe Australian soldiers, particularly those who served in World War I. It symbolises the courage, endurance, mateship, and good humour of Australian service personnel.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-33",
    text: "When did Australia abolish the White Australia Policy?",
    options: [
      "1901",
      "1945",
      "1973",
      "1988",
    ],
    correctAnswer: 2,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The White Australia Policy, which restricted non-European immigration, was progressively dismantled from the 1960s and was formally abolished in 1973. This led to Australia becoming one of the most multicultural nations in the world.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-34",
    text: "What is the Murray-Darling Basin?",
    options: [
      "A coastal harbour in Sydney",
      "Australia's largest and most important river system for agriculture",
      "A desert region in Western Australia",
      "A mountain range in Victoria",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Murray-Darling Basin is Australia's largest and most important river system. It covers parts of Queensland, New South Wales, Victoria, and South Australia, and is vital for agriculture and water supply.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-35",
    text: "What is the significance of the 1967 referendum?",
    options: [
      "It made Australia a republic",
      "It allowed Aboriginal and Torres Strait Islander peoples to be counted in the census and the federal government to make laws for them",
      "It established compulsory voting",
      "It introduced the metric system",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The 1967 referendum resulted in over 90% support for amending the Constitution so Aboriginal and Torres Strait Islander peoples would be counted in the census and the federal government could make laws for them.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-36",
    text: "What sport is considered Australia's national summer sport?",
    options: [
      "Rugby league",
      "Cricket",
      "Soccer",
      "Tennis",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Cricket is considered Australia's national summer sport. It has been played in Australia since the early days of European settlement and is a major part of Australian culture.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-37",
    text: "In which year were the Olympic Games held in Sydney?",
    options: ["1996", "2000", "2004", "2008"],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Summer Olympic Games were held in Sydney in 2000. They are widely regarded as one of the most successful Olympics in history. Melbourne hosted the Olympics in 1956.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-38",
    text: "What is the 'Stolen Generations'?",
    options: [
      "A term for convicts sent to Australia",
      "Aboriginal and Torres Strait Islander children who were removed from their families by government policies",
      "A group of early European explorers",
      "Immigrants who left Australia during the gold rush",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Stolen Generations refers to Aboriginal and Torres Strait Islander children who were removed from their families under government policies between approximately 1910 and 1970. This caused enormous suffering and is acknowledged as a significant injustice.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-39",
    text: "What is the native title of Aboriginal and Torres Strait Islander peoples?",
    options: [
      "The right to own any property in Australia",
      "The recognition of their traditional rights and interests in land and waters",
      "A government grant for housing",
      "The right to vote in elections",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "Native title recognises the traditional rights and interests of Aboriginal and Torres Strait Islander peoples in land and waters, according to their traditional laws and customs. The landmark Mabo decision in 1992 recognised native title in Australian law.",
    bookReference: "Our Common Bond — Australia and its people",
  },
  {
    id: "ap-40",
    text: "What is the significance of the Kokoda Track?",
    options: [
      "It is a famous hiking trail for tourists",
      "It was the site of fierce fighting between Australian and Japanese forces in World War II",
      "It marks the boundary between two states",
      "It is where gold was first discovered",
    ],
    correctAnswer: 1,
    topic: "australia-people",
    isValuesQuestion: false,
    rationale:
      "The Kokoda Track in Papua New Guinea was the site of fierce fighting between Australian and Japanese forces during World War II (1942). The courage and endurance of Australian soldiers on the track is remembered as a defining moment in Australian military history.",
    bookReference: "Our Common Bond — Australia and its people",
  },

  // ─────────────────────────────────────────────────────────────
  // SECTION 2 EXPANSION: Democratic Beliefs, Rights & Liberties (db-16 → db-35)
  // ─────────────────────────────────────────────────────────────

  {
    id: "db-16",
    text: "What is the Australian Constitution?",
    options: [
      "A set of guidelines that are not legally binding",
      "The supreme law that sets out the rules for governing Australia",
      "A historical document with no current application",
      "A collection of court decisions",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "The Australian Constitution is the supreme law of Australia. It sets out the rules for governing the country, including the powers of the federal government, the rights of states, and the separation of powers.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-17",
    text: "What does secular government mean in Australia?",
    options: [
      "The government promotes one religion over others",
      "The government is separate from religious institutions and does not favour any religion",
      "Religion is banned in government buildings",
      "Government officials must not have any religion",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Australia has a secular government, meaning the government is separate from religious institutions. The Constitution prevents the government from establishing a state religion or imposing any religious observance.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-18",
    text: "What does 'presumption of innocence' mean?",
    options: [
      "A person must prove they are innocent",
      "A person is considered innocent until proven guilty in a court of law",
      "Judges decide guilt before the trial begins",
      "The police determine whether someone is guilty",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "The presumption of innocence means that a person accused of a crime is considered innocent until proven guilty in a court of law. The burden of proof lies with the prosecution.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-19",
    text: "What is the right to a fair trial in Australia?",
    options: [
      "Trials are held secretly",
      "An accused person has the right to a public hearing, legal representation, and an impartial judge",
      "Only citizens can have a fair trial",
      "The government decides the outcome of trials",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "In Australia, everyone has the right to a fair trial. This includes the right to a public hearing, legal representation, and an impartial judge or jury. Trials are generally held in open court.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-20",
    text: "What is the Racial Discrimination Act 1975?",
    options: [
      "A law that allows racial discrimination in some cases",
      "A law that makes it unlawful to discriminate against someone based on race, colour, descent, or national or ethnic origin",
      "A law that only protects Australian citizens from discrimination",
      "A law about immigration quotas",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "The Racial Discrimination Act 1975 makes it unlawful to discriminate against someone based on race, colour, descent, or national or ethnic origin. It reflects Australia's commitment to equality and fairness for all.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-21",
    text: "What rights do trade unions have in Australia?",
    options: [
      "Trade unions are illegal in Australia",
      "Workers are free to join or not join a trade union to protect their workplace rights",
      "Only government workers can join trade unions",
      "Trade unions can only operate with police permission",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "In Australia, workers have the right to join or not join a trade union. Trade unions represent workers' interests and negotiate for better pay and working conditions. This is part of freedom of association.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-22",
    text: "What is freedom of the press in Australia?",
    options: [
      "The government controls what newspapers can publish",
      "News media can report on issues freely without government censorship",
      "Only government-owned media exists in Australia",
      "Journalists need government approval before publishing articles",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Australia has freedom of the press, meaning news media can report on issues freely without government censorship. This helps ensure accountability and transparency in government.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-23",
    text: "What is the right to peaceful protest in Australia?",
    options: [
      "Protests are illegal in Australia",
      "People have the right to peacefully protest and express their views in public",
      "You need the Prime Minister's permission to protest",
      "Only political parties can organise protests",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Australians have the right to peaceful protest. People can gather in public to express their views and demonstrate for causes they believe in, provided they do so peacefully and within the law.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-24",
    text: "What does 'equality between men and women' mean under Australian law?",
    options: [
      "Men and women have different legal rights",
      "Men and women have equal rights and protections under Australian law, including in the workplace",
      "Equality only applies in marriage",
      "Only women are protected by equality laws",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Under Australian law, men and women have equal rights and protections. The Sex Discrimination Act 1984 makes it unlawful to discriminate against a person based on their sex, marital status, or pregnancy.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-25",
    text: "What is the responsibility of every Australian citizen regarding the law?",
    options: [
      "Only to follow laws they agree with",
      "To obey all Australian laws, including federal, state, and local laws",
      "To follow religious law instead of Australian law",
      "To obey laws only in their home state",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Every person in Australia, whether citizen, resident, or visitor, must obey all Australian laws — federal, state/territory, and local. No cultural, religious, or personal belief is above the law.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-26",
    text: "What happens if an Australian law conflicts with a person's cultural or religious practice?",
    options: [
      "The cultural practice overrides Australian law",
      "Australian law must be followed — no cultural or religious practice overrides the law",
      "The person can choose which to follow",
      "A religious court decides",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "In Australia, no cultural, religious, or traditional practice overrides Australian law. All people must follow the law regardless of their cultural or religious background. This is a fundamental principle of the rule of law.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-27",
    text: "What does the Australian Citizenship Pledge commit new citizens to?",
    options: [
      "Speaking only English",
      "Pledging loyalty to Australia, sharing its democratic beliefs, respecting rights and liberties, and upholding its laws",
      "Renouncing all other citizenships",
      "Joining the Australian military",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "The Australian Citizenship Pledge commits new citizens to pledging loyalty to Australia and its people, sharing its democratic beliefs, respecting its rights and liberties, and upholding and obeying its laws.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-28",
    text: "What is the right to own property in Australia?",
    options: [
      "Only Australian-born citizens can own property",
      "People can own property, including a home or business, and cannot have it taken without just compensation",
      "The government owns all property",
      "Property ownership is not a right in Australia",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "In Australia, people have the right to own property. Property cannot be taken by the government without just compensation. This right is protected by Section 51(xxxi) of the Australian Constitution.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-29",
    text: "Is domestic violence acceptable in Australia?",
    options: [
      "Yes, if it is a family matter",
      "No, domestic violence is a serious criminal offence",
      "Only if both parties agree",
      "It depends on cultural background",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Domestic violence is a serious criminal offence in Australia. It is against the law regardless of a person's cultural background. All states and territories have laws to protect people from domestic violence.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-30",
    text: "What is the role of an independent judiciary?",
    options: [
      "Judges must follow the Prime Minister's orders",
      "Courts operate independently from the government to ensure fair and impartial justice",
      "The judiciary advises Parliament on which laws to pass",
      "Judges are elected by the public",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "An independent judiciary means courts operate separately from the government. Judges make decisions based on the law and evidence, free from political influence, ensuring fair and impartial justice for everyone.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-31",
    text: "What is the significance of the Australian coat of arms?",
    options: [
      "It is only decorative",
      "It features the kangaroo and emu and symbolises a nation always moving forward",
      "It represents the British monarchy",
      "It was designed by Aboriginal elders",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "The Australian coat of arms features a kangaroo and an emu, two native animals that cannot walk backwards easily, symbolising a nation that is always moving forward. A shield displays the symbols of the six states.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-32",
    text: "Who can stand for election to the Australian Parliament?",
    options: [
      "Only people born in Australia",
      "Any Australian citizen aged 18 or over can stand for election",
      "Only people with a university degree",
      "Only members of a political party",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Any Australian citizen who is aged 18 or over and is entitled to vote can stand for election to Parliament. There is no requirement to be born in Australia or to belong to a political party.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-33",
    text: "What is the secret ballot?",
    options: [
      "A ballot that only certain people can access",
      "A voting system where no one can see how a person votes, ensuring freedom of choice",
      "A ballot for secret government operations",
      "A ballot used only in local elections",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "The secret ballot means that voting is done in private and no one can see how a person votes. Australia was one of the first countries to introduce the secret ballot, which is sometimes called the 'Australian ballot.'",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-34",
    text: "Are forced marriages legal in Australia?",
    options: [
      "Yes, if the family agrees",
      "No, forced marriages are illegal in Australia",
      "Only if both parties are over 18",
      "It depends on cultural tradition",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Forced marriages are illegal in Australia. Marriage must be a free and voluntary commitment between two people. The Marriage Act 1961 sets the legal age for marriage at 18, with limited exceptions.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },
  {
    id: "db-35",
    text: "What are children's rights in Australia?",
    options: [
      "Children have no specific rights",
      "Children have the right to be protected from harm, to receive an education, and to be cared for",
      "Only Australian-born children have rights",
      "Children's rights depend on their parents' citizenship status",
    ],
    correctAnswer: 1,
    topic: "democratic-beliefs",
    isValuesQuestion: false,
    rationale:
      "Children in Australia have the right to be protected from harm and abuse, to receive an education, and to be cared for. It is against the law to physically discipline children in a way that causes harm.",
    bookReference:
      "Our Common Bond — Australia's democratic beliefs, rights and liberties",
  },

  // ─────────────────────────────────────────────────────────────
  // SECTION 3 EXPANSION: Government and the Law (gl-16 → gl-35)
  // ─────────────────────────────────────────────────────────────

  {
    id: "gl-16",
    text: "How is the Prime Minister of Australia chosen?",
    options: [
      "By a direct vote of the Australian people",
      "The leader of the political party or coalition with the majority in the House of Representatives becomes Prime Minister",
      "By the Governor-General",
      "By the Senate",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The Prime Minister is not directly elected by the people. Instead, the leader of the political party or coalition that has the majority of seats in the House of Representatives becomes the Prime Minister.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-17",
    text: "What is preferential voting?",
    options: [
      "Voting for only one candidate",
      "A system where voters number candidates in order of preference",
      "A system where only preferred parties are allowed",
      "Voting by mail only",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Preferential voting (also called ranked-choice voting) is the system used in Australian elections. Voters number all candidates in order of preference, ensuring the elected candidate has broad support.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-18",
    text: "What is a double dissolution?",
    options: [
      "When the Prime Minister resigns twice",
      "When both houses of Parliament are dissolved and an election is called for all seats",
      "When two bills are rejected on the same day",
      "When two political parties merge",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "A double dissolution occurs when the Governor-General dissolves both the House of Representatives and the entire Senate, triggering an election for all seats. This typically happens when the Senate twice blocks a bill passed by the House.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-19",
    text: "What is the role of the Opposition in Parliament?",
    options: [
      "To always agree with the government",
      "To question the government, offer alternative policies, and hold the government accountable",
      "To manage the courts",
      "To represent foreign governments",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The Opposition in Parliament is led by the Leader of the Opposition. Its role is to question the government, scrutinise its policies and spending, offer alternative policies, and hold the government accountable.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-20",
    text: "What happens when federal and state laws conflict?",
    options: [
      "The state law always takes precedence",
      "The federal law prevails under Section 109 of the Constitution",
      "Both laws are abolished",
      "The Prime Minister decides which law applies",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Under Section 109 of the Australian Constitution, when a federal law and a state law conflict, the federal law prevails to the extent of the inconsistency. The state law becomes invalid in that area.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-21",
    text: "Who manages federal elections in Australia?",
    options: [
      "The Prime Minister's office",
      "The Australian Electoral Commission (AEC)",
      "The police",
      "The Governor-General",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The Australian Electoral Commission (AEC) is an independent statutory authority that manages federal elections, referendums, and maintains the electoral roll. It operates independently from the government.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-22",
    text: "How many senators represent each state in the Australian Senate?",
    options: ["6", "10", "12", "15"],
    correctAnswer: 2,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Each of the six states is represented by 12 senators. The Australian Capital Territory and the Northern Territory each have 2 senators, giving a total of 76 senators.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-23",
    text: "What is the role of a State Premier?",
    options: [
      "To represent Australia internationally",
      "To lead the state government and manage state affairs",
      "To command the national military",
      "To appoint federal judges",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "A State Premier is the head of a state government in Australia. Each state has its own parliament and premier who manages state affairs including education, health, transport, and police.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-24",
    text: "What is the Australian Parliament House?",
    options: [
      "The Governor-General's residence",
      "The building in Canberra where the federal Parliament meets to debate and pass laws",
      "A museum of Australian history",
      "The High Court building",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Parliament House in Canberra is where the two houses of the federal Parliament — the Senate and the House of Representatives — meet to debate and pass laws. The current building was opened in 1988.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-25",
    text: "What are electorate or electorates?",
    options: [
      "A type of Australian government department",
      "Geographic areas that each elect one member to the House of Representatives",
      "State government territories",
      "Areas managed by local councils only",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Australia is divided into electorates (also called divisions or seats). Each electorate elects one member to the House of Representatives. The number of electorates is roughly proportional to each state's population.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-26",
    text: "How often are federal elections held in Australia?",
    options: [
      "Every 2 years",
      "At least every 3 years",
      "Every 4 years",
      "Every 5 years",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Federal elections must be held at least every 3 years. The Prime Minister can call an election at any time within the three-year term. Members of the House of Representatives serve a maximum of three years.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-27",
    text: "What is a by-election?",
    options: [
      "An election held on a different day",
      "A special election held to fill a vacancy when a member of Parliament leaves office before their term ends",
      "An election for local council members only",
      "An election held only in territories",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "A by-election is a special election held to fill a vacancy in the House of Representatives when a member leaves office before their term ends, for example due to resignation or death.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-28",
    text: "What legal system does Australia use?",
    options: [
      "Religious law",
      "A common law system based on English law, supplemented by legislation",
      "A civil law system based on Roman law",
      "Customary law only",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Australia uses a common law system, which is based on English law. This means law is made both by Parliament (statute law) and by judges through court decisions (case law or precedent).",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-29",
    text: "What are the two mainland territories of Australia?",
    options: [
      "Victoria and Tasmania",
      "The Australian Capital Territory and the Northern Territory",
      "Queensland and Western Australia",
      "New South Wales and South Australia",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Australia's two mainland territories are the Australian Capital Territory (ACT), where Canberra is located, and the Northern Territory (NT). Unlike states, territories can have their laws overridden by the federal Parliament.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-30",
    text: "What powers does the Governor of a state have?",
    options: [
      "They run the state government directly",
      "They represent the King in the state and perform ceremonial and constitutional duties",
      "They command the state police",
      "They set state tax rates",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Each state has a Governor who represents the King at the state level. The Governor performs ceremonial duties such as opening Parliament and giving Royal Assent to state laws, acting on the advice of the state Premier.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-31",
    text: "What must you do when you turn 18 as an Australian citizen?",
    options: [
      "Join a political party",
      "Enrol to vote and vote in elections",
      "Apply for a passport",
      "Register with the military",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "When Australian citizens turn 18, they are legally required to enrol to vote with the Australian Electoral Commission and to vote in all federal, state, and local elections.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-32",
    text: "What is the Cabinet in Australian government?",
    options: [
      "A storage room in Parliament House",
      "A group of senior ministers chosen by the Prime Minister who make important policy decisions",
      "The opposition front bench",
      "A committee of judges",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The Cabinet is made up of senior government ministers chosen by the Prime Minister. The Cabinet makes important policy decisions and is the central decision-making body of the government.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-33",
    text: "What is the difference between the House of Representatives and the Senate?",
    options: [
      "They have the same role",
      "The House is based on population (proposing laws), while the Senate gives equal representation to states (reviewing laws)",
      "The House deals with finance and the Senate deals with foreign affairs",
      "The Senate is more powerful than the House",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "The House of Representatives has members proportional to each state's population and is where most laws begin. The Senate has equal representation for each state (12 senators each) and reviews and amends legislation.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-34",
    text: "What is compulsory enrolment?",
    options: [
      "All residents must join a political party",
      "All Australian citizens aged 18 and over must register on the electoral roll",
      "All children must enrol in school",
      "All businesses must register with the government",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "Compulsory enrolment means all Australian citizens aged 18 and over are required by law to enrol on the electoral roll. Failure to enrol can result in a fine.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },
  {
    id: "gl-35",
    text: "What is a Minister in the Australian government?",
    options: [
      "A religious leader",
      "A member of Parliament appointed to be responsible for a specific area of government, such as education or defence",
      "A judge in the High Court",
      "A local council member",
    ],
    correctAnswer: 1,
    topic: "government-law",
    isValuesQuestion: false,
    rationale:
      "A Minister is a member of Parliament who is chosen by the Prime Minister and appointed to be responsible for a specific area of government, such as health, education, defence, or foreign affairs.",
    bookReference: "Our Common Bond — Government and the law in Australia",
  },

  // ─────────────────────────────────────────────────────────
  // SECTION 4 EXPANSION: Australian Values (av-21 → av-40)
  // All tagged isValuesQuestion: true
  // ─────────────────────────────────────────────────────────

  {
    id: "av-21",
    text: "What does the Australian value of 'a fair go' mean for new migrants?",
    options: [
      "Migrants have fewer rights than Australian-born citizens",
      "Everyone, including migrants, deserves equal opportunities to succeed",
      "Migrants must wait 10 years to receive equal treatment",
      "Only skilled migrants deserve opportunities",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "'A fair go' means everyone, including new migrants, deserves equal opportunities regardless of their background. Australia values giving all people a chance to participate and succeed in society.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-22",
    text: "Is it acceptable to use intimidation or threats to settle disputes in Australia?",
    options: [
      "Yes, if the other person started the dispute",
      "No, intimidation and threats are against Australian values and the law",
      "Only in business disputes",
      "Only between neighbours",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Using intimidation, threats, or violence to settle disputes is against both Australian values and the law. Disagreements should be resolved peacefully through discussion, mediation, or the legal system.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-23",
    text: "What is the Australian value about looking after the environment?",
    options: [
      "Environmental protection is not important",
      "Australians have a responsibility to care for and protect the natural environment for future generations",
      "Only farmers should care about the environment",
      "The government alone is responsible for the environment",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians value their unique natural environment and believe everyone has a responsibility to protect it for future generations. This includes caring for national parks, reducing pollution, and conserving water.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-24",
    text: "Can parents use cultural traditions to justify harming their children in Australia?",
    options: [
      "Yes, cultural practices are always respected",
      "No, no cultural or religious practice justifies harming a child — Australian law protects all children",
      "Only if the child agrees",
      "It depends on the severity",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "No cultural or religious practice can justify harming a child. Australian law protects all children from abuse, neglect, and harmful practices regardless of cultural background.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-25",
    text: "What is the Australian value regarding English language?",
    options: [
      "Everyone must speak English at home",
      "English is the national language and is important for participating fully in Australian life, but people are free to speak their own languages too",
      "Only English can be spoken in public",
      "There is no common language in Australia",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "English is Australia's national language and is important for full participation in Australian life. However, people are free to speak their own languages at home and in public. Australia values its linguistic diversity.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-26",
    text: "What do Australians value about helping during emergencies?",
    options: [
      "Only emergency services should help",
      "Australians value volunteering and helping their communities during emergencies such as bushfires and floods",
      "People should only look after themselves",
      "Helping is only expected from rural communities",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians have a strong tradition of helping one another during emergencies such as bushfires, floods, and cyclones. Volunteering and community service during times of crisis reflect the values of mateship and compassion.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-27",
    text: "What is the Australian value about reconciliation with Indigenous peoples?",
    options: [
      "Reconciliation is not important",
      "Australians value building respectful relationships and understanding between Indigenous and non-Indigenous Australians",
      "Only Indigenous people care about reconciliation",
      "Reconciliation was completed with the apology in 2008",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Reconciliation involves building respectful relationships and mutual understanding between Indigenous and non-Indigenous Australians. It acknowledges past injustices and works towards equality and respect.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-28",
    text: "Is it an Australian value that people should contribute to their community?",
    options: [
      "No, people should only focus on themselves",
      "Yes, contributing to the community through work, volunteering, and civic participation is valued",
      "Only wealthy people are expected to contribute",
      "Contributing is only for retired people",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians value contributing to their community through work, volunteering, and civic participation. This includes voting, obeying the law, serving on a jury if called, and helping neighbours in need.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-29",
    text: "What does 'having a go' mean as an Australian value?",
    options: [
      "Taking unnecessary risks",
      "Being willing to try, work hard, and not give up easily",
      "Competing aggressively against others",
      "Only doing things you are already good at",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "'Having a go' means being willing to try your best, work hard, and not give up easily. It reflects the Australian values of self-reliance, determination, and resilience.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-30",
    text: "What is the Australian value regarding honesty and integrity?",
    options: [
      "Honesty is only important in business",
      "Australians value honesty and integrity in personal relationships, business, and public life",
      "Being honest is optional",
      "Only politicians need to be honest",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians value honesty and integrity in all aspects of life — personal relationships, business, and public service. Fair dealing and keeping one's word are important parts of Australian culture.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-31",
    text: "Do Australians value personal responsibility?",
    options: [
      "No, the government is responsible for everything",
      "Yes, Australians are expected to support themselves and their families and not depend solely on government assistance",
      "Only men are expected to be personally responsible",
      "Personal responsibility only applies to finances",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians value personal responsibility — supporting oneself and one's family. While Australia has a social safety net for those who need it, the value of self-reliance and hard work is central to Australian culture.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-32",
    text: "What is an Australian value about children's education?",
    options: [
      "Education is only for boys",
      "All children must attend school — education is both a right and a responsibility",
      "Parents can choose not to educate their children",
      "Education is only important for wealthy families",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "In Australia, education is both a right and a responsibility. All children of school age must attend school. Education is valued as the key to opportunity, and boys and girls have equal access.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-33",
    text: "What does 'standing up for the underdog' mean in Australian values?",
    options: [
      "Only supporting successful people",
      "Helping and supporting people who are at a disadvantage or being treated unfairly",
      "A dog training concept",
      "Complaining about the government",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Standing up for the underdog means helping and supporting those who are disadvantaged or treated unfairly. It reflects the Australian values of fairness, compassion, and not accepting bullying or injustice.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-34",
    text: "What is the Australian value regarding respecting other people's property?",
    options: [
      "It is acceptable to take things that are not yours",
      "Australians value respecting other people's property and understand that stealing is against the law",
      "Property rights only apply to homeowners",
      "Respecting property is optional",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians value respecting other people's property. Theft and property damage are against the law. Respect for property is part of the broader value of respecting the rights of others.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-35",
    text: "Do Australians value the right to choose who they marry?",
    options: [
      "No, families decide who a person marries",
      "Yes, marriage in Australia must be entered into freely and voluntarily by both parties",
      "Only men can choose their partners",
      "Marriage choices depend on cultural background",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians value the right of individuals to choose their own partner. Marriage must be entered into freely and voluntarily by both parties. Forced marriage is a criminal offence in Australia.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-36",
    text: "What is the Australian value about obeying the law even when you disagree with it?",
    options: [
      "People can ignore laws they disagree with",
      "Even if you disagree with a law, you must obey it and can work to change it through democratic processes",
      "Only some laws need to be followed",
      "Disagreeing with a law means you are exempt from it",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Even if you disagree with a law, you must obey it. However, you have the right to work peacefully to change laws through democratic processes such as voting, petitioning, and peaceful protest.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-37",
    text: "What do Australians value about civic duty?",
    options: [
      "Civic duty only applies to politicians",
      "Australians value voting, serving on a jury, and obeying the law as important civic duties",
      "Civic duties are voluntary and optional",
      "Only citizens born in Australia have civic duties",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians believe civic duties are essential for a functioning democracy. Key duties include voting in elections, serving on a jury when called, and obeying the laws of Australia.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-38",
    text: "What is the Australian value regarding fairness in the workplace?",
    options: [
      "Employers can pay whatever they want",
      "Workers have the right to fair pay and safe working conditions under Australian law",
      "Fairness only applies to full-time workers",
      "Only men are entitled to fair pay",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians value fairness in the workplace. Workers have the right to fair pay, safe working conditions, and freedom from discrimination. Workplace laws protect all workers regardless of their background.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-39",
    text: "What do Australians believe about people who are vulnerable or in need?",
    options: [
      "Vulnerable people should fend for themselves",
      "Australians believe in helping vulnerable people through community support and social safety nets",
      "Only charities should help vulnerable people",
      "Vulnerability is a personal weakness",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians value a compassionate society that looks after vulnerable and disadvantaged people. Australia has social safety nets including welfare, healthcare, and community services for those in need.",
    bookReference: "Our Common Bond — Australian values",
  },
  {
    id: "av-40",
    text: "What is the Australian value about respecting the law enforcement system?",
    options: [
      "Police should be feared and avoided",
      "Australians respect the role of police and the justice system in maintaining a safe and orderly society",
      "Only criminals need to interact with police",
      "People should take the law into their own hands",
    ],
    correctAnswer: 1,
    topic: "australian-values",
    isValuesQuestion: true,
    rationale:
      "Australians respect the role of police and the justice system in keeping society safe and orderly. Police are public servants who protect the community, and everyone should cooperate with law enforcement.",
    bookReference: "Our Common Bond — Australian values",
  },
];
