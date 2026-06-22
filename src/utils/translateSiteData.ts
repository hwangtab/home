type Language = 'ko' | 'en';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export const KO_TO_EN: Record<string, string> = {
  '황경하': 'Hwang Gyeongha',
  '황경하는 한국의 음악가, 사운드 엔지니어, 프로듀서, 그리고 연대자입니다.': 'Hwang Gyeongha is a Korean musician, sound engineer, producer, and solidarity activist.',
  '현장에서 글, 음악, 사진 등의 예술이 힘을 갖는 순간에 주목하여 여러 분야에서 오랫 동안 활동해왔습니다. 세상의 소외된 이들이 필요로 하는 순간 예술을 통해 힘을 보태고자 합니다.': 'He has worked across disciplines, focusing on moments when writing, music, and photography gain power in real-world spaces. He seeks to support marginalized people through art when they need it most.',
  '글, 음악, 사진 같은 예술이 현장에서 힘을 얻는 순간을 오래 지켜보며 여러 분야에서 활동해 왔습니다. 세상의 소외된 이들이 예술을 필요로 하는 순간, 그 곁에 힘을 보태고자 합니다.': 'He has worked across disciplines, paying close attention to moments when writing, music, and photography gain power in real-world spaces. He seeks to stand beside marginalized people when they need art most.',
  '서울특별시 은평구 대조동 84-3 3층 스튜디오 놀': '3F Studio Nol, 84-3 Daejo-dong, Eunpyeong-gu, Seoul, South Korea',
  '젠트리피케이션': 'Gentrification',
  '새 민중음악 선곡집 vol.3': 'New Minjung Music Collection Vol.3',
  '볼찌어다 내가 세상 끝날까지 너희와 항상 함께 있으리라': 'Behold, I Am with You Always, to the End of the Age',
  '몸의 중심': 'Center of the Body',
  '혼약의 기도': 'Prayer of Covenant',
  '물고기는 물이 없으면 죽어요': 'Fish Die Without Water',
  '눈녹듯': 'Like Melting Snow',
  '어디에서 희망을 찾을 것인가': 'Where Should We Find Hope?',
  '아현포차 요리책': 'Ahyeon Pocha Cookbook',
  '테이크아웃드로잉 <대망명>': 'Takeout Drawing <Great Exile>',
  '우장창창 강제집행 저지 투쟁': 'Ujangchangchang Forced Eviction Resistance',
  '새 싱글 \'눈녹듯\' 발매': 'New Single "Like Melting Snow" Released',
  '예정 없음': 'No Scheduled Events',
  '2024년 모월 모일': 'TBD, 2024',
  '미정': 'To be announced',
  '사진': 'Photography',
  '칼럼': 'Column',
  '르포': 'Reportage',
  '투쟁': 'Struggle',
  '황해문화 2025년 봄호': 'Hwanghae Review, Spring 2025',
  '식소사번': 'Siksosabeon',
  '기획 및 예술연대 조직': 'Planning and organizing artistic solidarity',
  '연대 활동': 'Solidarity activity',
  '음악 듣기': 'Listen',
  '구매하기': 'Buy',
  '원문 보기': 'Read Original',
  '도서 보기': 'View Book',
  '정보': 'Info',
  '옥바라지골목, 요기가갤러리, 통영생선구이, 뽀빠이화원, 나무그늘, 경의선공유지, 테이크아웃드로잉 등 강제로 쫓겨나 사라질 위기에 처한 소중한 공간들과 마주하여 음악가들과 그 곳의 이야기를 담아 음악을 연주하고 기록했습니다.': 'This album records stories of precious places pushed out by forced eviction and disappearance, including Okbaraji Alley, Yogiga Gallery, Tongyeong Grilled Fish, Poppai Flower Shop, Tree Shade, Gyeongui Line Shared Space, and Takeout Drawing.',
  '젠트리피케이션으로 사라져가는 소중한 공간들의 이야기를 담은 음반': 'An album documenting precious spaces disappearing due to gentrification.',
  '젠트리피케이션으로 사라져 가는 소중한 공간들의 이야기를 담은 음반': 'An album documenting precious spaces disappearing due to gentrification.',
  '3번째 새 민중음악 선곡집은 최근 무리한 강제집행으로 인해 가게주인이 손가락을 부분절단 당한 서촌의 가게 궁중족발을 위해 만들어졌습니다. 우리는 이 음반을 통해 고통받는 사람들을 위로하고 시대의 야만을 기록하기를 바랍니다.': 'The 3rd New Minjung Music Collection was made for Gungjung Jokbal in Seochon, where the owner was severely injured during a forced eviction. Through this album, we hope to comfort those in pain and document the brutality of our time.',
  '3번째 새 민중음악 선곡집은 무리한 강제집행으로 가게주인이 손가락을 부분절단 당한 서촌의 가게 궁중족발을 위해 만들었습니다. 우리는 이 음반이 고통받는 사람들을 위로하고 시대의 야만을 기록하기를 바랍니다.': 'The 3rd New Minjung Music Collection was made for Gungjung Jokbal in Seochon, where the owner was severely injured during a forced eviction. We hope this album comforts those in pain and documents the brutality of our time.',
  '고통받는 사람들을 위로하고 시대의 야만을 기록하는 새 민중음악 선곡집': 'A New Minjung Music collection that comforts people in pain and records social brutality.',
  '재개발 철거피해자 조한정 씨가 폭력적인 강제집행에 저항해 높은 교회 철탑에 매달려 계시는 아래에는 [볼찌어다 내가 세상 끝날까지 너희와 항상 함께 있으리라]가 적힌 현판이 붙어 있었습니다.': 'Below a high church tower where redevelopment victim Jo Han-jeong resisted violent forced eviction, there was a sign that read, "Behold, I am with you always, to the end of the age."',
  '재개발 철거에 저항하는 이들과 함께하는 연대와 희망의 음반': 'An album of solidarity and hope with those resisting redevelopment eviction.',
  '이 젊은 비정규직 노동자의 죽음이 잊혀지지 않도록, 많은 이들이 오래도록 기억하고 추모하여 결국에는 세상을 위해 움직일 수 있도록 예술가들이 힘을 합쳤습니다. 모든 힘을 다해서 이러한 일을 막을 것입니다.': 'Artists joined forces so the death of a young non-regular worker would not be forgotten, and so people could remember, mourn, and ultimately move for social change.',
  '비정규직 노동자의 죽음을 추모하며 세상의 변화를 꿈꾸는 음반': 'An album mourning a non-regular worker and envisioning social change.',
  '세민과의 결혼식을 앞두고 만들었던 곡입니다. 앞으로 함께 살아갈 인생의 방향과 세상과의 약속에 대한 메시지를 담고 있습니다.': 'A song created before marriage, carrying a message about the life path ahead and a promise to the world.',
  '결혼을 앞두고 만든 인생의 방향과 세상과의 약속에 관한 곡': 'A song about life direction and promise made before marriage.',
  '쫓겨난 옛 노량진수산시장 상인들에게 연대하는 음악가들이 힘을 합쳐 만든 음반입니다.': 'An album made by musicians in solidarity with displaced merchants of the old Noryangjin Fish Market.',
  '노량진수산시장 상인들과 연대하는 음악가들의 합작 음반': 'A collaborative album by musicians in solidarity with Noryangjin Fish Market merchants.',
  '한 어머니의 사랑과 고통을 담은 음악입니다. 눈처럼 켜켜이 쌓여가는 슬픔, 그 속에서 다른 사람들은 이런 고통을 겪지않게 하고자 나아가고 있는 한 강인한 어머니의 마음을 느껴보시기 바랍니다.': 'Music carrying a mother’s love and pain. It traces layered grief like snow, and the resilient heart of a mother moving forward so others do not suffer the same pain.',
  '한 어머니의 사랑과 고통을 담은 음악입니다. 눈처럼 켜켜이 쌓이는 슬픔 속에서도 다른 사람들이 같은 고통을 겪지 않기를 바라며 나아가는 강인한 마음을 느껴보시기 바랍니다.': 'Music carrying a mother’s love and pain. It traces layered grief like snow, and the resilient heart of a mother moving forward so others do not suffer the same pain.',
  '자식을 잃은 어머니의 사랑과 고통을 담은 간절한 음악': 'A heartfelt piece about the love and pain of a mother who lost her child.',
  '계엄과 탄핵, 그 이후의 저항에 대해 논하는 글': 'A piece discussing martial law, impeachment, and the resistance that followed.',
  '계엄과 탄핵, 그 이후의 저항을 다룬 글': 'A piece about martial law, impeachment, and the resistance that followed.',
  '계엄과 탄핵 이후의 저항과 희망에 대한 성찰': 'A reflection on resistance and hope after martial law and impeachment.',
  '계엄과 탄핵 이후, 저항과 희망을 돌아보는 성찰': 'A reflection on resistance and hope after martial law and impeachment.',
  '진정한 예술은 시대의 아픔에 공감하고, 약자와 연대하며, 세상의 부조리에 저항하는 데에서 나온다...': 'True art emerges from empathizing with pain, standing with the vulnerable, and resisting injustice...',
  '진정한 예술은 시대의 아픔에 공감하고, 약자와 연대하며, 세상의 부조리에 저항하는 데서 나온다...': 'True art emerges from empathizing with pain, standing with the vulnerable, and resisting injustice...',
  '쫓겨난 아현포차 노점상 할머니들의 삶과 요리에 대한 철학을 담은 글': 'A writing piece on the lives and culinary philosophy of displaced Ahyeon Pocha street vendors.',
  '쫓겨난 아현포차 노점상 할머니들의 삶과 요리 철학을 담은 글': 'A writing piece on the lives and culinary philosophy of displaced Ahyeon Pocha street vendors.',
  '아현포차 할머니들의 삶과 요리 철학을 담은 르포': 'A reportage on the lives and culinary philosophy of Ahyeon Pocha grandmothers.',
  '할머니들의 먹는 이들에 대한 사랑과 긍정, 요리에 대한 자부심들이 자본주의가 설계한 강력한 계산식을 무력화시키는 순간들을 만날 수 있다.': 'You encounter moments where their love for diners, optimism, and pride in cooking disarm the rigid equations of capitalism.',
  '건물주 싸이(PSY)와의 명도소송 분쟁으로 강제집행 위기에 처한 복합문화공간 \'테이크아웃드로잉\'을 지키기 위해 예술가들이 자발적으로 모여 기획한 연대 전시 프로젝트. \'대망명\'은 자본의 논리에 밀려 삶의 터전에서 쫓겨나는 예술가들과 철거민들의 상황을 역설적으로 표현한 것이다.': 'A solidarity exhibition project voluntarily organized by artists to protect the cultural space "Takeout Drawing" from forced eviction amid a legal dispute with the landlord PSY. "Great Exile" paradoxically depicts artists and residents displaced by capital logic.',
  '테이크아웃드로잉 강제집행 저지 및 예술가 연대 프로젝트': 'Takeout Drawing forced eviction resistance and artists’ solidarity project.',
  '가로수길 곱창집 \'우장창창\'과 건물주 리쌍 간의 임대차 분쟁 사건. \'맘편히장사하고픈상인모임(맘상모)\'과 함께 강제집행을 저지하고, 불합리한 상가건물 임대차보호법의 문제점을 사회적으로 공론화하여 법 개정을 이끌어낸 상징적인 투쟁이다.': 'A lease dispute between the Garosu-gil restaurant "Ujangchangchang" and landlord Leessang. Together with a merchants’ coalition, activists resisted forced eviction and helped drive legal reform by publicizing flaws in commercial lease protection law.',
  '리쌍 건물 강제집행 저지 및 상가법 개정 운동': 'Leessang building eviction resistance and commercial lease law reform movement.',
  '자식을 잃은 어머니의 가슴 저미는 아픔을 담은 새 싱글 \'눈녹듯\'을 발매했습니다.': 'A new single, "Like Melting Snow," has been released, capturing the deep pain of a mother who lost her child.'
  ,
  '무대와 연대의 순간들': 'Moments of Stage and Solidarity',
  '황경하가 야외와 현장에서 노래하는 장면들을 담은 공연 사진 모음입니다.': 'A collection of performance photographs capturing Hwang Gyeongha singing in outdoor and on-site spaces.',
  '현장 공연과 연대의 장면을 담은 사진 모음': 'A photo series of live performance and solidarity scenes',
  '인물과 침묵의 초상': 'Portraits in Stillness',
  '흑백과 저채도의 프레임으로 황경하의 얼굴과 시선을 기록한 인물 사진 연작입니다.': 'A portrait series recording Hwang Gyeongha’s face and gaze through black-and-white and low-saturation frames.',
  '얼굴과 시선을 중심으로 한 인물 사진 연작': 'A portrait series centered on face and gaze',
  '작업실과 생활의 장면': 'Studio and Everyday Scenes',
  '카메라를 들고 현장을 바라보거나 실내에서 준비하는 순간 등 작업 전후의 시간을 담은 사진들입니다.': 'Photographs of time before and after the work, including moments of looking at the field with a camera and preparing indoors.',
  '작업 전후의 준비와 생활 장면을 담은 사진 기록': 'A photographic record of preparation and everyday moments around the work',
  '2011-2016년 기획 프로젝트': 'A project planned from 2011 to 2016',
  '2011년부터 2016년까지 기획한 프로젝트. 레코드와 폐허를 연결하는 문화 프로젝트.': 'A cultural project planned from 2011 to 2016, connecting records with ruins.',
  '2012-2015년 기획 페스티벌': 'A festival planned from 2012 to 2015',
  '2012년부터 2015년까지 기획한 페스티벌.': 'A festival planned from 2012 to 2015.',
  '2015년 기획한 자립심 페스티벌.': 'The Jaripsim Festival, planned in 2015.',
  '2023-2026년 공동기획 평화 음악 캠프': 'A peace music camp co-planned from 2023 to 2026',
  '2023년 공동기획 축제': 'A festival co-planned in 2023',
  '2023년 공동기획한 축제.': 'A festival co-planned in 2023.',
  '2023년부터 2026년까지 공동기획한 강정 평화 음악 캠프.': 'The Gangjeong Peace Music Camp, co-planned from 2023 to 2026.',
  '51플러스 페스티벌': '51 Plus Festival',
  '강제집행 위기의 족발집 \'궁중족발\'에서 결성된 황경하·세민의 2인조 포크 듀오 \'경하와 세민\'의 EP. 궁중족발, 장재7구역, 콜트콜텍 등 투쟁 현장에서 만든 6곡을 담았습니다.': 'An EP by Gyeongha and Semin, a folk duo formed at Gungjung Jokbal while the restaurant faced forced eviction. It contains six songs made at sites of struggle including Gungjung Jokbal, Jangjae District 7, and Cort-Cortek.',
  '강호중': 'Kang Hojung',
  '강호중 앨범 프로듀싱': 'Album production for Kang Hojung',
  '강호중의 앨범. 프로듀서로 참여.': 'An album by Kang Hojung, with Hwang Gyeongha participating as producer.',
  '궁중족발에서 결성된 포크 듀오 \'경하와 세민\'의 EP': 'An EP by Gyeongha and Semin, a folk duo formed at Gungjung Jokbal.',
  '김용균 노동자의 죽음을 추모하는 음반. 이 젊은 비정규직 노동자의 죽음이 잊혀지지 않도록, 많은 이들이 오래도록 기억하고 추모하여 결국에는 세상을 위해 움직일 수 있도록 예술가들이 힘을 합쳤습니다. 2019 레드어워드 주목할만한 연대부문 수상.': 'An album mourning the death of worker Kim Yong-gyun. Artists joined forces so the death of this young non-regular worker would not be forgotten, and so people could remember, mourn, and ultimately act for the world. It received a notable solidarity award at the 2019 Red Awards.',
  '김용균 노동자의 죽음을 추모하는 음반. 이 젊은 비정규직 노동자의 죽음이 잊히지 않도록, 많은 이들이 오래 기억하고 추모하며 세상이 달라지는 쪽으로 움직이기를 바라며 예술가들이 힘을 모았습니다. 2019 레드어워드 주목할만한 연대부문 수상.': 'An album mourning the death of worker Kim Yong-gyun. Artists joined forces so the death of this young non-regular worker would not be forgotten, and so people could remember, mourn, and move toward social change. It received a notable solidarity award at the 2019 Red Awards.',
  '노량진 관련 전시 기획': 'Planning an exhibition related to Noryangjin',
  '노량진수산시장 관련 전시 기획 및 제작.': 'Planning and production for an exhibition related to Noryangjin Fish Market.',
  '노량진수산시장을 다룬 전시 기획 및 제작.': 'Planning and production for an exhibition about Noryangjin Fish Market.',
  '노량진수산시장 상인 연대 공연': 'Solidarity performances with Noryangjin Fish Market merchants',
  '노량진수산시장 상인들과 함께한 매주 연대 공연 (2019~2024)': 'Weekly solidarity performances with Noryangjin Fish Market merchants (2019-2024)',
  '레드어워드 수상작 — 옴니버스 앨범': 'Red Awards-winning omnibus album',
  '레코드폐허': 'Record Ruins',
  '볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라': 'Behold, I Am with You Always, to the End of the Age',
  '사드 배치로 고통받는 성주 소성리에 직접 레코딩 스튜디오를 차리고 녹음한 두 번째 새 민중음악 선곡집 \'연대의 노래\'. 김동산, 오재환, 예람, 이형주, 정진석, 쓰다와 함께 현장의 고통을 기록했습니다.': 'The second New Minjung Music Collection, "Songs of Solidarity," recorded in a temporary studio set up in Soseong-ri, Seongju, where residents were suffering from the THAAD deployment. It documents pain on the ground together with Kim Dongsan, Oh Jaehwan, Yeram, Lee Hyeongju, Jung Jinseok, and Sseuda.',
  '사드 배치에 맞선 성주 소성리 주민들과 만든 새 민중음악 선곡집 1집': 'The first New Minjung Music Collection, made with residents of Soseong-ri, Seongju resisting the THAAD deployment.',
  '사드 배치에 반대하는 성주 소성리 주민들과 5박 6일간 함께 머물며 만든 첫 번째 새 민중음악 선곡집 \'소성리의 노래들\'. 고립된 채 눈물짓는 주민들의 사연을 음악의 힘으로 알리고 위로하고자 했습니다.': 'The first New Minjung Music Collection, "Songs of Soseong-ri," made while staying for five nights and six days with residents of Soseong-ri, Seongju resisting the THAAD deployment. It sought to share and comfort the stories of residents left isolated and grieving through the power of music.',
  '사드 배치에 반대하는 성주 소성리 주민들과 5박 6일간 함께 머물며 만든 첫 번째 새 민중음악 선곡집 \'소성리의 노래들\'. 고립된 채 눈물짓는 주민들의 사연을 음악으로 알리고 위로하려 했습니다.': 'The first New Minjung Music Collection, "Songs of Soseong-ri," made while staying for five nights and six days with residents of Soseong-ri, Seongju resisting the THAAD deployment. It sought to share and comfort the stories of residents left isolated and grieving through music.',
  '새 민중음악 선곡집 vol.1': 'New Minjung Music Collection Vol.1',
  '새 민중음악 선곡집 vol.2': 'New Minjung Music Collection Vol.2',
  '성주 소성리 현장에서 녹음한 새 민중음악 선곡집 2집 \'연대의 노래\'': 'The second New Minjung Music Collection, "Songs of Solidarity," recorded on site in Soseong-ri, Seongju.',
  '세민의 싱글 앨범 기획 및 제작': 'Planning and production for Semin\'s single album',
  '세민의 싱글 앨범. 기획 및 제작.': 'A single album by Semin, planned and produced by Hwang Gyeongha.',
  '엉아들': 'Eongadeul',
  '엉아들 앨범 프로듀싱': 'Album production for Eongadeul',
  '엉아들의 앨범. 프로듀서로 참여.': 'An album by Eongadeul, with Hwang Gyeongha participating as producer.',
  '여린잎 (세민)': 'Tender Leaf (Semin)',
  '옛 노량진수산시장': 'Old Noryangjin Fish Market',
  '옥바라지골목, 요기가갤러리, 통영생선구이, 뽀빠이화원, 나무그늘, 경의선공유지, 테이크아웃드로잉 등 강제로 쫓겨나 사라질 위기에 처한 소중한 공간들과 마주하여 음악가들과 그 곳의 이야기를 담아 음악을 연주하고 기록했습니다. 2017 한국대중음악상 선정위원 특별상 수상.': 'Musicians met precious places threatened by forced eviction and disappearance, including Okbaraji Alley, Yogiga Gallery, Tongyeong Grilled Fish, Poppai Flower Shop, Tree Shade, Gyeongui Line Shared Space, and Takeout Drawing, then performed and recorded music carrying their stories. It received the Selection Committee Special Award at the 2017 Korean Music Awards.',
  '옥바라지골목, 요기가갤러리, 통영생선구이, 뽀빠이화원, 나무그늘, 경의선공유지, 테이크아웃드로잉 등 강제로 쫓겨나 사라질 위기에 놓인 소중한 공간들을 찾아가 음악가들과 함께 그곳의 이야기를 연주하고 기록했습니다. 2017 한국대중음악상 선정위원 특별상 수상.': 'Musicians visited precious places threatened by forced eviction and disappearance, including Okbaraji Alley, Yogiga Gallery, Tongyeong Grilled Fish, Poppai Flower Shop, Tree Shade, Gyeongui Line Shared Space, and Takeout Drawing, then performed and recorded music carrying their stories. It received the Selection Committee Special Award at the 2017 Korean Music Awards.',
  '옴니버스 앨범. 2024 레드어워드 주목할만한 연대부문 수상.': 'An omnibus album that received a notable solidarity award at the 2024 Red Awards.',
  '이름을 모르는 먼 곳의 그대에게': 'To You in a Faraway Place Whose Name I Do Not Know',
  '이태원 갤러리 테이크아웃드로잉 철거를 막기 위해 기획·제작한 옴니버스 앨범. 2015 레드어워드 주목할만한 연대부문 수상.': 'An omnibus album planned and produced to resist the eviction of Takeout Drawing gallery in Itaewon. It received a notable solidarity award at the 2015 Red Awards.',
  '이태원 갤러리 테이크아웃드로잉 철거를 막으려 기획·제작한 옴니버스 앨범. 2015 레드어워드 주목할만한 연대부문 수상.': 'An omnibus album planned and produced to resist the eviction of Takeout Drawing gallery in Itaewon. It received a notable solidarity award at the 2015 Red Awards.',
  '이태원 테이크아웃드로잉 철거 반대 연대 옴니버스 앨범': 'A solidarity omnibus album opposing the eviction of Takeout Drawing in Itaewon',
  '재개발 철거피해자 조한정 씨가 폭력적인 강제집행에 저항해 높은 교회 철탑에 매달려 계시는 아래에는 [볼찌어다 내가 세상 끝날까지 너희와 항상 함께 있으리라]가 적힌 현판이 붙어 있었습니다. 경하와 세민 공동 작업.': 'Below a high church tower where redevelopment eviction victim Jo Han-jeong resisted violent enforcement, there was a sign that read, "Behold, I am with you always, to the end of the age." A collaborative work by Gyeongha and Semin.',
  '재개발 철거피해자 조한정 씨가 폭력적인 강제집행에 저항해 높은 교회 철탑에 매달렸을 때, 그 아래에는 [볼찌어다 내가 세상 끝날까지 너희와 항상 함께 있으리라]가 적힌 현판이 붙어 있었습니다. 경하와 세민 공동 작업.': 'When redevelopment eviction victim Jo Han-jeong resisted violent enforcement by hanging from a high church tower, there was a sign below that read, "Behold, I am with you always, to the end of the age." A collaborative work by Gyeongha and Semin.',
  '전시 <노량진 - 터, 도시, 사람>': 'Exhibition: Noryangjin - Site, City, People',
  '쫓겨난 옛 노량진수산시장 상인들과 함께한 연대 공연입니다. 2019년 10월부터 2024년 8월까지 매주 진행되었습니다.': 'Solidarity performances held with displaced merchants from the old Noryangjin Fish Market every week from October 2019 to August 2024.',
  '쫓겨난 옛 노량진수산시장 상인들과 함께한 연대 공연입니다. 2019년 10월부터 2024년 8월까지 매주 열렸습니다.': 'Solidarity performances held with displaced merchants from the old Noryangjin Fish Market every week from October 2019 to August 2024.',
  '축제 <강정피스앤뮤직캠프>': 'Festival: Gangjeong Peace and Music Camp',
  '축제 <씨앗페>': 'Festival: Seed Festival',
  '콜트·콜텍 해고노동자 밴드의 10주년 기념 투쟁 음반': 'A struggle album marking the 10th anniversary of the band formed by dismissed Cort-Cortek workers.',
  '콜트·콜텍에서 기타를 만들다 부당 해고당한 노동자들의 밴드 음반. 10년 넘는 시간 동안 복직투쟁 중인 노동자들과 함께. 2017 레드어워드 현장부문 수상.': 'An album by a band of workers unfairly dismissed after making guitars at Cort-Cortek. Made together with workers who continued their reinstatement struggle for more than ten years. It received a field award at the 2017 Red Awards.',
  '콜트콜텍 투쟁 10주년 기념음반': 'Cort-Cortek Struggle 10th Anniversary Album',
  '테이크아웃드로잉': 'Takeout Drawing',
  '펑크 밴드 노컨트롤의 데뷔 앨범, 다음뮤직 이달의 음반 수상': 'The debut album by punk band No Control, selected as Daum Music Album of the Month.',
  '펑크 밴드 노컨트롤의 앨범. 다음뮤직 이달의 음반 수상.': 'An album by punk band No Control, selected as Daum Music Album of the Month.',
  '한남동 자립심 페스티벌': 'Hannam-dong Jaripsim Festival',
  '한남동 자립심 페스티벌 기획': 'Planning the Hannam-dong Jaripsim Festival',
  '황경하는 음악 제작자이자 예술 기획자, 현장 기반 문화 프로젝트를 운영하는 실무자다. 노컨트롤 기타리스트로 펑크·얼터너티브 록을 시작해, 이후 포크 음악으로 방향을 전환해 서정성과 친밀감을 살린 곡들을 선보여 왔다. 자립음악생산조합과 예술해방전선 활동을 통해 음악인들의 자립·연대와 상업주의에 맞서는 대안적 음악 생태계 구축을 모색해 왔다. 재개발·젠트리피케이션으로 삶의 터전을 잃은 이들과 연대하고, 노량진수산시장·사드 반대·노동자 투쟁 등 현장의 이야기를 음악·전시·축제로 기록하고 전달한다. 2012 다음뮤직 이달의 음반, 2015·2019·2024 레드어워드, 2017 한국대중음악상 선정위원 특별상 수상. 현재 스스로를 \'기획자 50% 활동가 50%\'로 규정하며 활동 중.': 'Hwang Gyeongha is a music producer, art planner, and field-based cultural project practitioner. He began in punk and alternative rock as the guitarist of No Control, then shifted toward folk music and released songs marked by lyricism and intimacy. Through Jarip Music Cooperative and the Art Liberation Front, he has explored independent and solidaristic music practices and alternative music ecosystems against commercialism. He stands with people displaced by redevelopment and gentrification, and records and shares stories from sites such as Noryangjin Fish Market, the anti-THAAD struggle, and labor struggles through music, exhibitions, and festivals. His recognitions include Daum Music Album of the Month in 2012, Red Awards in 2015, 2019, and 2024, and the Selection Committee Special Award at the 2017 Korean Music Awards. He currently describes his work as "50% planner, 50% activist."',
  '황경하는 음악 제작자이자 예술 기획자이며, 현장 기반 문화 프로젝트를 꾸리는 실무자다. 노컨트롤 기타리스트로 펑크·얼터너티브 록을 시작했고, 이후 포크 음악으로 방향을 옮겨 서정성과 친밀감이 살아 있는 곡들을 발표해 왔다. 자립음악생산조합과 예술해방전선에서는 음악인들의 자립·연대, 상업주의에 맞서는 대안적 음악 생태계를 고민해 왔다. 재개발·젠트리피케이션으로 삶의 터전을 잃은 이들과 연대하며 노량진수산시장·사드 반대·노동자 투쟁 등 현장의 이야기를 음악·전시·축제로 기록하고 전한다. 2012 다음뮤직 이달의 음반, 2015·2019·2024 레드어워드, 2017 한국대중음악상 선정위원 특별상 수상. 현재 스스로를 \'기획자 50% 활동가 50%\'로 규정하며 활동 중.': 'Hwang Gyeongha is a music producer, art planner, and field-based cultural project practitioner. He began in punk and alternative rock as the guitarist of No Control, then shifted toward folk music and released songs marked by lyricism and intimacy. Through Jarip Music Cooperative and the Art Liberation Front, he has explored independent and solidaristic music practices and alternative music ecosystems against commercialism. He stands with people displaced by redevelopment and gentrification, and records and shares stories from sites such as Noryangjin Fish Market, the anti-THAAD struggle, and labor struggles through music, exhibitions, and festivals. His recognitions include Daum Music Album of the Month in 2012, Red Awards in 2015, 2019, and 2024, and the Selection Committee Special Award at the 2017 Korean Music Awards. He currently describes his work as "50% planner, 50% activist."',
  '다음뮤직 이달의 음반': 'Daum Music Album of the Month',
  '다음뮤직': 'Daum Music',
  '레드어워드 주목할만한 연대': 'Red Awards - Notable Solidarity',
  '레드어워드 현장': 'Red Awards - Field Award',
  '레드어워드': 'Red Awards',
  '한국대중음악상 선정위원 특별상': 'Korean Music Awards Selection Committee Special Award',
  '한국대중음악상': 'Korean Music Awards'
};

const translateValue = (value: JsonValue): JsonValue => {
  if (typeof value === 'string') {
    return KO_TO_EN[value] ?? value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => translateValue(item));
  }

  if (value && typeof value === 'object') {
    const translatedEntries = Object.entries(value).map(([key, val]) => [key, translateValue(val)] as const);
    return Object.fromEntries(translatedEntries);
  }

  return value;
};

/**
 * Get list of untranslated strings for debugging
 */
export const getUntranslatedStrings = (): string[] => {
  return Object.keys(KO_TO_EN).filter(str => !KO_TO_EN[str]);
};

export const translateSiteData = <T>(data: T, language: Language): T => {
  if (language !== 'en') {
    return data;
  }

  return translateValue(data as JsonValue) as T;
};
