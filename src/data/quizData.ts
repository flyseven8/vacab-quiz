export type QuizItem = {
    korean: string;
    partOfSpeech: string;
    meaning: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect?: boolean;
}

// 19과 80개 단어 전체 데이터 (1-80번)
export const quizResults22: QuizItem[] = [
    // 1-20: 첫 번째 세트
    { userAnswer: "", correctAnswer: "airplane", partOfSpeech: "n.", meaning: "a vehicle designed for air travel that has wings and one or more engines", korean: "비행기" },
    { userAnswer: "", correctAnswer: "ambulance", partOfSpeech: "n.", meaning: "a special vehicle used to take sick or injured people to hospital", korean: "구급차" },
    { userAnswer: "", correctAnswer: "ferry", partOfSpeech: "n.", meaning: "a boat or ship for taking passengers and often vehicles across an area of water, especially as a regular service", korean: "연락선" },
    { userAnswer: "", correctAnswer: "helicopter", partOfSpeech: "n.", meaning: "a type of aircraft without wings that has one or two sets of large blades that go round very fast on top", korean: "헬리콥터" },
    { userAnswer: "", correctAnswer: "motorcycle", partOfSpeech: "n.", meaning: "a vehicle with two wheels and an engine", korean: "오토바이" },
    { userAnswer: "", correctAnswer: "scooter", partOfSpeech: "n.", meaning: "a child's vehicle with two or three small wheels joined to the bottom of a narrow board and a long handle attached to the front wheel", korean: "스쿠터" },
    { userAnswer: "", correctAnswer: "train", partOfSpeech: "n.", meaning: "a railway engine connected to carriages for carrying people or to wheeled containers for carrying goods", korean: "기차" },
    { userAnswer: "", correctAnswer: "truck", partOfSpeech: "n.", meaning: "a large road vehicle that is used for transporting large amounts of goods", korean: "트럭" },
    { userAnswer: "", correctAnswer: "van", partOfSpeech: "n.", meaning: "a medium-sized road vehicle, used especially for carrying goods, that often has no windows in the sides at the back", korean: "밴" },
    { userAnswer: "", correctAnswer: "yacht", partOfSpeech: "n.", meaning: "a boat with sails and sometimes an engine, used for either racing or travelling on for pleasure", korean: "요트" },
    { userAnswer: "", correctAnswer: "bat", partOfSpeech: "n.", meaning: "a small animal like a mouse with wings that flies at night", korean: "박쥐" },
    { userAnswer: "", correctAnswer: "cheetah", partOfSpeech: "n.", meaning: "a wild animal of the cat family, with yellowish-brown fur and black spots, that can run faster than any other animal", korean: "치타" },
    { userAnswer: "", correctAnswer: "chimpanzee", partOfSpeech: "n.", meaning: "a small, very intelligent African ape with black or brown fur", korean: "침팬지" },
    { userAnswer: "", correctAnswer: "chipmunk", partOfSpeech: "n.", meaning: "a small North American animal with fur and dark stripes along its back", korean: "얼룩 다람쥐" },
    { userAnswer: "", correctAnswer: "hyena", partOfSpeech: "n.", meaning: "a wild animal from Africa and Asia that looks like a dog, hunts in groups, and makes a sound similar to a human laugh", korean: "하이에나" },
    { userAnswer: "", correctAnswer: "moose", partOfSpeech: "n.", meaning: "a type of large deer with large, flat horns and a long nose that lives in the forests of North America, northern Europe, and Asia", korean: "무스" },
    { userAnswer: "", correctAnswer: "orangutan", partOfSpeech: "n.", meaning: "a large ape with red-and-brown hair and long arms", korean: "오랑우탄" },
    { userAnswer: "", correctAnswer: "otter", partOfSpeech: "n.", meaning: "a mammal with four legs and short brown fur that swims well and eats fish", korean: "수달" },
    { userAnswer: "", correctAnswer: "panther", partOfSpeech: "n.", meaning: "a black leopard", korean: "검은표범" },
    { userAnswer: "", correctAnswer: "rhinoceros", partOfSpeech: "n.", meaning: "a very large, thick-skinned animal from Africa or Asia that has one or two horns on its nose", korean: "코뿔소" },

    // 21-40: 두 번째 세트
    { userAnswer: "", correctAnswer: "apartment", partOfSpeech: "n.", meaning: "a set of rooms for living in, especially on one floor of a building", korean: "아파트" },
    { userAnswer: "", correctAnswer: "classmate", partOfSpeech: "n.", meaning: "someone who is in the same class as you at school", korean: "반 친구" },
    { userAnswer: "", correctAnswer: "classroom", partOfSpeech: "n.", meaning: "a room in a school or college where groups of students are taught", korean: "교실" },
    { userAnswer: "", correctAnswer: "empty", partOfSpeech: "adj.", meaning: "not containing any things or people", korean: "텅 빈" },
    { userAnswer: "", correctAnswer: "fit", partOfSpeech: "adj.", meaning: "to be the right size or shape for someone or something", korean: "적합하다" },
    { userAnswer: "", correctAnswer: "hole", partOfSpeech: "n.", meaning: "an empty space in an object, usually with an opening to the object's surface, or an opening that goes completely through an object", korean: "구멍" },
    { userAnswer: "", correctAnswer: "sink", partOfSpeech: "v.", meaning: "to go down below the surface or to the bottom of a liquid or soft substance", korean: "가라앉다" },
    { userAnswer: "", correctAnswer: "spell", partOfSpeech: "v.", meaning: "to form a word or words with the letters in the correct order", korean: "철자를 말하다" },
    { userAnswer: "", correctAnswer: "thirsty", partOfSpeech: "adj.", meaning: "needing to drink", korean: "목이 마른" },
    { userAnswer: "", correctAnswer: "vegetable", partOfSpeech: "n.", meaning: "a plant, root, seed, or pod that is used as food, especially in dishes that are not sweet", korean: "야채" },
    { userAnswer: "", correctAnswer: "airport", partOfSpeech: "n.", meaning: "a place where aircraft regularly take off and land, with buildings for passengers to wait in", korean: "공항" },
    { userAnswer: "", correctAnswer: "aunt", partOfSpeech: "n.", meaning: "the sister of someone's father or mother, or the wife of someone's uncle or aunt", korean: "이모" },
    { userAnswer: "", correctAnswer: "cousin", partOfSpeech: "n.", meaning: "a child of a person's aunt or uncle, or, more generally, a distant relation", korean: "사촌" },
    { userAnswer: "", correctAnswer: "engine", partOfSpeech: "n.", meaning: "a machine that uses the energy from liquid fuel or steam to produce movement", korean: "엔진" },
    { userAnswer: "", correctAnswer: "hurry", partOfSpeech: "v.", meaning: "to move or do things more quickly than normal or to make someone do this", korean: "서두르다" },
    { userAnswer: "", correctAnswer: "land", partOfSpeech: "v.", meaning: "to arrive on the ground or other surface after moving down through the air", korean: "착륙하다" },
    { userAnswer: "", correctAnswer: "sail", partOfSpeech: "v.", meaning: "to travel on the water", korean: "항해하다" },
    { userAnswer: "", correctAnswer: "station", partOfSpeech: "n.", meaning: "a building and the surrounding area where buses or trains stop for people to get on or off", korean: "역" },
    { userAnswer: "", correctAnswer: "uncle", partOfSpeech: "n.", meaning: "the brother of someone's mother or father, or the husband of someone's aunt or uncle", korean: "삼촌" },
    { userAnswer: "", correctAnswer: "wheel", partOfSpeech: "n.", meaning: "a circular object connected at the centre to a bar, used for making vehicles or parts of machines move", korean: "바퀴" },

    // 41-60: 세 번째 세트
    { userAnswer: "", correctAnswer: "balloon", partOfSpeech: "n.", meaning: "a small, very thin rubber bag that you blow air into or fill with light gas until it is round in shape, used for decoration at parties or as a children's toy", korean: "풍선" },
    { userAnswer: "", correctAnswer: "carpet", partOfSpeech: "n.", meaning: "a shaped piece of thick material used for covering floors", korean: "카펫" },
    { userAnswer: "", correctAnswer: "face", partOfSpeech: "n.", meaning: "the front of the head, where the eyes, nose, and mouth are", korean: "얼굴" },
    { userAnswer: "", correctAnswer: "forehead", partOfSpeech: "n.", meaning: "the flat part of the face, above the eyes and below the hair", korean: "이마" },
    { userAnswer: "", correctAnswer: "jar", partOfSpeech: "n.", meaning: "a glass or clay container with a wide opening at the top and sometimes a fitted lid, usually used for storing food", korean: "병" },
    { userAnswer: "", correctAnswer: "nothing", partOfSpeech: "pron.", meaning: "not anything", korean: "아무것도" },
    { userAnswer: "", correctAnswer: "print", partOfSpeech: "v.", meaning: "to produce writing or images on paper or other material with a machine", korean: "인쇄하다" },
    { userAnswer: "", correctAnswer: "sharp", partOfSpeech: "adj.", meaning: "having a thin edge or point that can cut something or make a hole in something", korean: "날카로운" },
    { userAnswer: "", correctAnswer: "smoothie", partOfSpeech: "n.", meaning: "a thick, cold drink made from fruit and often yogurt or ice cream, mixed together until smooth", korean: "스무디" },
    { userAnswer: "", correctAnswer: "title", partOfSpeech: "n.", meaning: "the name of a film, book, painting, piece of music, etc.", korean: "제목" },
    { userAnswer: "", correctAnswer: "adventure", partOfSpeech: "n.", meaning: "an unusual, exciting, and possibly dangerous activity, such as a trip or experience, or the excitement produced by such an activity", korean: "모험" },
    { userAnswer: "", correctAnswer: "bridge", partOfSpeech: "n.", meaning: "a structure that is built over a river, road, or railway to allow people and vehicles to cross from one side to the other", korean: "다리" },
    { userAnswer: "", correctAnswer: "kite", partOfSpeech: "n.", meaning: "a frame covered with cloth or plastic and joined to a long string, that you fly in the air when the weather is windy", korean: "연" },
    { userAnswer: "", correctAnswer: "rope", partOfSpeech: "n.", meaning: "a strong, thick string made of long twisted threads", korean: "밧줄" },
    { userAnswer: "", correctAnswer: "screen", partOfSpeech: "n.", meaning: "a flat surface in a cinema, on a television, or as part of a computer, on which pictures or words are shown", korean: "화면" },
    { userAnswer: "", correctAnswer: "tank", partOfSpeech: "n.", meaning: "a container that holds liquid or gas", korean: "탱크" },
    { userAnswer: "", correctAnswer: "tent", partOfSpeech: "n.", meaning: "a shelter made of canvas or a similar material and supported by poles and ropes, that you can fold up and carry with you", korean: "텐트" },
    { userAnswer: "", correctAnswer: "tie", partOfSpeech: "v.", meaning: "to fasten together two ends of a piece of string or other long, thin material, or to hold together with a long, thin piece of string, material, etc.", korean: "묶다" },
    { userAnswer: "", correctAnswer: "wagon", partOfSpeech: "n.", meaning: "a vehicle with four wheels, usually pulled by horses or oxen, used for transporting heavy goods, especially in the past", korean: "짐마차" },
    { userAnswer: "", correctAnswer: "weekend", partOfSpeech: "n.", meaning: "Saturday and Sunday, or Friday evening until Sunday night; the part of the week in which many people living in the West do not go to work", korean: "주말" },

    // 61-80: 네 번째 세트
    { userAnswer: "", correctAnswer: "area", partOfSpeech: "n.", meaning: "a particular part of a place, piece of land, or country", korean: "공간" },
    { userAnswer: "", correctAnswer: "beef", partOfSpeech: "n.", meaning: "the flesh of cattle eaten as food", korean: "쇠고기" },
    { userAnswer: "", correctAnswer: "false", partOfSpeech: "adj.", meaning: "not real, but made to look or seem real", korean: "사실이 아닌" },
    { userAnswer: "", correctAnswer: "fat", partOfSpeech: "adj.", meaning: "having a lot of flesh on the body", korean: "살찐" },
    { userAnswer: "", correctAnswer: "healthy", partOfSpeech: "adj.", meaning: "strong and well", korean: "건강한" },
    { userAnswer: "", correctAnswer: "section", partOfSpeech: "n.", meaning: "one of the parts that something is divided into", korean: "구역" },
    { userAnswer: "", correctAnswer: "shy", partOfSpeech: "adj.", meaning: "nervous and uncomfortable with other people", korean: "부끄러워하는" },
    { userAnswer: "", correctAnswer: "steal", partOfSpeech: "v.", meaning: "to take something without the permission or knowledge of the owner and keep it", korean: "훔치다" },
    { userAnswer: "", correctAnswer: "wave", partOfSpeech: "n.", meaning: "a raised line of water that moves across the surface of an area of water, especially the sea", korean: "파도" },
    { userAnswer: "", correctAnswer: "wonderful", partOfSpeech: "adj.", meaning: "extremely good", korean: "신나는" },
    { userAnswer: "", correctAnswer: "accident", partOfSpeech: "n.", meaning: "something bad that happens that is not expected or intended and that often damages something or injures someone", korean: "사고" },
    { userAnswer: "", correctAnswer: "activity", partOfSpeech: "n.", meaning: "the situation in which a lot of things are happening or people are moving around", korean: "활동" },
    { userAnswer: "", correctAnswer: "fresh", partOfSpeech: "adj.", meaning: "new or different", korean: "신선한" },
    { userAnswer: "", correctAnswer: "nobody", partOfSpeech: "pron.", meaning: "not anyone", korean: "아무도 ~아닌" },
    { userAnswer: "", correctAnswer: "oil", partOfSpeech: "n.", meaning: "petroleum, the black oil obtained from under the earth's surface from which petrol comes", korean: "기름" },
    { userAnswer: "", correctAnswer: "pour", partOfSpeech: "v.", meaning: "to make a substance flow from a container, especially into another container, by raising just one side of the container that the substance is in", korean: "붓다" },
    { userAnswer: "", correctAnswer: "receive", partOfSpeech: "v.", meaning: "to get or be given something", korean: "받다" },
    { userAnswer: "", correctAnswer: "taste", partOfSpeech: "v.", meaning: "to put food or drink in your mouth to find out what flavour it has", korean: "맛 보다" },
    { userAnswer: "", correctAnswer: "weak", partOfSpeech: "adj.", meaning: "not physically strong", korean: "약한" },
    { userAnswer: "", correctAnswer: "weight", partOfSpeech: "n.", meaning: "the amount that something or someone weighs", korean: "중량" }
];

// 20개씩 4개 세트로 나누기
export const quiz22_1: QuizItem[] = quizResults22.slice(0, 20);
export const quiz22_2: QuizItem[] = quizResults22.slice(20, 40);
export const quiz22_3: QuizItem[] = quizResults22.slice(40, 60);
export const quiz22_4: QuizItem[] = quizResults22.slice(60, 80);
