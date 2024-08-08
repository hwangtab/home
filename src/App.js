import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, ShoppingCart, Calendar, Send, ExternalLink } from 'lucide-react';
import emailjs from 'emailjs-com';

emailjs.init('E5wHxyFgSkrjQhYVG');

const Header = () => (
  <motion.header 
    className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="container mx-auto flex justify-between items-center">
      <motion.h1 
        className="text-7xl font-bold font-bombaram"
        whileHover={{ scale: 1.1 }}
      >
        황경하
      </motion.h1>
      <nav>
        <ul className="flex space-x-6">
          {[
            {name: '소개', id: 'intro'},
            {name: '새 싱글', id: 'new-single'},
            {name: '음악', id: 'music'},
            {name: '공연일정', id: 'concert'},
            {name: '음반구매', id: 'album'},
            {name: '연락처 및 문의', id: 'contact'}
          ].map((item) => (
            <motion.li key={item.name} whileHover={{ scale: 1.1 }}>
              <a href={`#${item.id}`} className="hover:text-gray-300 transition duration-300 font-wanted-sans text-lg">
                {item.name}
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>
    </div>
  </motion.header>
);
const Section = ({ title, children, id }) => (
  <motion.section 
    id={id}
    className="mb-16"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-4xl font-bold mb-6 text-gray-200 font-santokki">{title}</h2>
    {children}
  </motion.section>
);

const MusicCard = ({ title, description, coverUrl, musicUrl }) => (
  <motion.div 
    className="bg-gray-800 p-6 rounded-lg shadow-lg"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <a href={musicUrl} target="_blank" rel="noopener noreferrer">
      <img src={coverUrl} alt={title} className="w-full h-48 object-cover mb-4 rounded" />
      <h3 className="text-2xl font-bold mb-3 text-gray-200 font-santokki">{title}</h3>
      <p className="text-gray-400 font-wanted-sans">{description}</p>
    </a>
  </motion.div>
);

const NewSingleSection = () => (
  <Section title="새 싱글음원 <눈녹듯> 듣기" id="new-single">
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
      <div className="flex flex-col items-center mb-8">
        <div className="w-full max-w-3xl aspect-video mb-8">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/WmI2EPjLr0c?si=LJEuW4BUpKdcL0bf"
            title="황경하 - 눈녹듯 (Official Lyric Video)"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: '멜론', url: 'https://www.melon.com/album/detail.htm?albumId=11558423', color: 'bg-green-500' },
            { name: '벅스', url: 'https://music.bugs.co.kr/album/20662057?wl_ref=list_tr_07_search', color: 'bg-orange-500' },
            { name: '지니', url: 'https://www.genie.co.kr/detail/albumInfo?axnm=85489737', color: 'bg-blue-500' },
            { name: '바이브', url: 'https://vibe.naver.com/track/86650383', color: 'bg-purple-500' },
          ].map((service) => (
            <motion.a
              key={service.name}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${service.color} text-white px-6 py-3 rounded-full font-wanted-sans hover:opacity-90 transition duration-300 flex items-center justify-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="mr-2" size={20} />
              {service.name}에서 듣기
            </motion.a>
          ))}
        </div>
      </div>
      <div className="mt-8 text-gray-300">
        <p className="mb-4">
          '눈녹듯'은 자식을 잃은 어머니의 가슴 저미는 아픔을 세상이 무너지는 듯한 무거운 록 사운드로 승화시킨 작품입니다. 칠흑 같은 어둠과 하얀 빛의 대비를 통해 상실의 고통과 희망의 끈을 절묘하게 표현해냅니다. 자식을 잃은 어머니의 절절한 그리움과 고통을 섬세하게 표현하며, 동시에 삶의 연속성과 희망에 대한 깊은 성찰을 담고 있습니다. 
        </p>
        <p className="mb-4">
          음악은 끝없이 내리는 눈처럼 청자의 마음을 하얗게 덮어갑니다. 차갑고 무거운 기타 리프와 처연한 보컬이 어우러져 상실의 아픔을 생생하게 전달합니다. 눈이 내리는 겨울 밤의 고요함 속에 녹지않고 쌓이는 슬픔을 노래하며, 사랑하는 이를 잃은 후의 공허함과 일상의 무의미함을 담담하게 그려냅니다. 
        </p>
        <p className="mb-4">
        가사는 자식의 존재가 어머니의 삶에 가져다 준 빛과 그 부재로 인한 어둠을 대비시키며 시작합니다. "네가 웃으면 날이 하얗게 밝아왔어"라는 구절은 자식의 존재가 주는 희망과 무한한 사랑을, "네가 없어도 날은 하얗게 밝아왔어"는 상실 후의 고통스러운 현실을 생생하게 전달합니다. 후렴구의 "밤이 새도록 내렸네 하얗게 내렸네, 지나면 눈녹듯 녹아 내릴까"는 끝없이 내리는 슬픔과 기약없는 이별의 아픔을 표현합니다. "다른 사람들이 우리처럼 삶이 파괴되는 것을 막고 싶단다"라는 고 김용균 노동자의 어머니, 김미숙 님의 처연한 목소리는 이러한 비극이 더 이상 반복되지 않기를 바라는 간절한 외침으로 다가옵니다.
        </p>
        <p className="mb-4">
          황경하는 작곡, 작사뿐만 아니라 편곡, 레코딩, 믹싱, 마스터링까지 모든 과정을 직접 수행하여 자신의 예술적 의도를 완벽하게 구현해냈습니다. 이는 아티스트의 진솔한 감정과 의도가 곡 전반에 깊이 스며들게 했습니다. 가슴아픈 이야기를 가장 정성스럽게 담아내기 위해 오랜 시간 섬세한 터치를 가했습니다.
        </p>
        <p>
          '눈녹듯'은 한 어머니의 사랑과 고통을 담은 음악입니다. 눈처럼 켜켜이 쌓여가는 슬픔, 그 속에서 다른 사람들은 이런 고통을 겪지않게 하고자 나아가고 있는 한 강인한 어머니의 마음을 느껴보시기 바랍니다. 그를 통해 정말 소중한 것이 무엇인지 되새겨보는 시간을 잠시 가지실 수 있기를 기원합니다.
        </p>
      </div>
    </div>
  </Section>
);

const ConcertSlider = ({ concerts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % concerts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [concerts.length]);

  return (
    <div className="relative h-64 overflow-hidden rounded-lg bg-gray-900">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0 flex items-center justify-center p-6"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
        >
          <motion.a
            href={concerts[currentIndex].ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-full flex flex-col items-center justify-center text-center bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3 className="text-2xl font-bold mb-2 font-santokki text-gray-200">{concerts[currentIndex].title}</h3>
            <p className="text-lg font-wanted-sans mb-1 text-gray-300">{concerts[currentIndex].date}</p>
            <p className="text-md font-wanted-sans mb-4 text-gray-400">{concerts[currentIndex].location}</p>
            <motion.span
              className="inline-flex items-center bg-gray-700 text-white px-4 py-2 rounded-full font-wanted-sans text-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Calendar className="mr-2" size={16} />
              공연정보
            </motion.span>
          </motion.a>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const AlbumPurchase = ({ album }) => (
  <motion.div 
    className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.img 
      src={album.coverUrl} 
      alt={album.title} 
      className="w-full md:w-1/2 h-auto object-cover rounded mb-6 md:mb-0 md:mr-8 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => window.open(album.purchaseUrl, '_blank')}
    />
    <div className="md:w-1/2">
      <h3 className="text-3xl font-bold mb-4 text-gray-200 font-santokki">{album.title}</h3>
      <p className="text-xl mb-4 font-wanted-sans text-gray-300">{album.price}</p>
      <p className="text-gray-400 mb-6 font-wanted-sans">{album.description}</p>
      <motion.button 
        className="bg-gray-700 text-white px-6 py-3 rounded-full font-wanted-sans hover:bg-gray-600 transition duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.open(album.purchaseUrl, '_blank')}
      >
        <ShoppingCart className="mr-2" size={20} />
        구매하기
      </motion.button>
    </div>
  </motion.div>
);

const ContactInfo = ({ icon: Icon, title, content, link }) => (
  <div className="flex items-center mb-8">
    <div className="bg-gray-700 p-4 rounded-full mr-4">
      <Icon className="text-gray-300" size={28} />
    </div>
    <div>
      <h4 className="font-bold text-gray-200 text-lg mb-1">{title}</h4>
      <a 
        href={link} 
        className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
        target={title === "주소" ? "_blank" : "_self"}
        rel={title === "주소" ? "noopener noreferrer" : ""}
      >
        {content}
      </a>
    </div>
  </div>
);

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.send('service_lop4659', 'template_wxwj093', formData)
      .then((result) => {
          console.log(result.text);
          alert('메시지가 성공적으로 전송되었습니다!');
      }, (error) => {
          console.log(error.text);
          alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
      });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <motion.div 
      className="bg-gray-800 p-8 rounded-lg shadow-lg"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold mb-6 text-gray-200 font-santokki">문의</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300">메시지</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
        <motion.button
          type="submit"
          className="w-full bg-gray-700 text-white px-6 py-3 rounded-full font-wanted-sans hover:bg-gray-600 transition duration-300 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="mr-2" size={20} />
          보내기
        </motion.button>
      </form>
    </motion.div>
  );
};

const App = () => {
  const concerts = [
    { title: "예정 없음", date: "2024년 모월 모일", location: "미정", ticketUrl: "https://www.instagram.com/podopodopo/" },
  ];

  const album = {
    title: "물고기는 물이 없으면 죽어요 (2023)",
    price: "15,000원",
    description: "쫓겨난 옛 노량진수산시장 상인들에게 연대하는 음악가들이 힘을 합쳐 만든 음반입니다.",
    coverUrl: "https://ifh.cc/g/g0pmcp.jpg",
    purchaseUrl: "https://smartstore.naver.com/koreasmartcoop/products/7868449444"
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen font-wanted-sans text-gray-200">
      <Header />
      
      <main className="container mx-auto mt-12 p-6">
      <Section title="소개" id="intro">
  <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
    <div className="flex flex-col md:flex-row items-stretch gap-8">
      <div className="w-full md:w-1/3 flex flex-col justify-center">
        <motion.img
          src="https://ifh.cc/g/oXQWJ3.jpg"
          alt="황경하"
          className="w-full h-auto rounded-lg shadow-lg object-cover"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="w-full md:w-2/3 flex flex-col justify-center">
        <p className="text-lg text-gray-300 leading-relaxed mb-4">
          황경하는 한국의 음악가, 사운드 엔지니어, 프로듀서, 그리고 연대자입니다.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed mb-4">
          현장에서 글, 음악, 사진 등의 예술이 힘을 갖는 순간에 주목하여 여러 분야에서 오랫 동안 활동해왔습니다. 세상의 소외된 이들이 필요로 하는 순간 예술을 통해 힘을 보태고자 합니다.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed mb-4">
          그의 작업은 사회에 대한 날카로운 시선과 따뜻한 연대의 메시지를 담고 있습니다. 음악 활동 외에도 황경하는 다양한 투쟁에 참여하며, 음악을 통한 사회 변화를 추구하고 있습니다.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed">
          명성과 부를 좇기보다 시대의 아픔에 공감하고 약자와 연대하는 예술, 세상의 부조리에 저항하고 변화의 메시지를 전하는 예술의 길을 개척하고 있습니다. 비록 험난한 여정이겠지만 노래하는 자의 가녀린 어깨가 세상을 변화시키리라 믿습니다.
        </p>
      </div>
    </div>
  </div>
</Section>

        <NewSingleSection />

        <Section title="발매작" id="music">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MusicCard 
              title="젠트리피케이션 (2016)" 
              description="옥바라지골목, 요기가갤러리, 통영생선구이, 뽀빠이화원, 나무그늘, 경의선공유지, 테이크아웃드로잉 등 강제로 쫓겨나 사라질 위기에 처한 소중한 공간들과 마주하여 음악가들과 그 곳의 이야기를 담아 음악을 연주하고 기록했습니다."
              coverUrl="https://koreanmusicawards.com/wp-content/uploads/2021/01/2017_gentrification.jpg"
              musicUrl="https://www.melon.com/album/music.htm?albumId=10003221"
            />
            <MusicCard 
              title="새 민중음악 선곡집 vol.3 (2017)" 
              description="3번째 새 민중음악 선곡집은 최근 무리한 강제집행으로 인해 가게주인이 손가락을 부분절단 당한 서촌의 가게 궁중족발을 위해 만들어졌습니다. 우리는 이 음반을 통해 고통받는 사람들을 위로하고 시대의 야만을 기록하기를 바랍니다. "
              coverUrl="http://archivenew.vop.co.kr/images/05670d4ecb375286541262cf7e14b0aa/2018-01/24032527_8.jpg"
              musicUrl="https://www.melon.com/album/music.htm?albumId=10129121"
            />
            <MusicCard 
              title="볼찌어다 내가 세상 끝날까지 너희와 항상 함께 있으리라 (2018)" 
              description="재개발 철거피해자 조한정 씨가 폭력적인 강제집행에 저항해 높은 교회 철탑에 매달려 계시는 아래에는 [볼찌어다 내가 세상 끝날까지 너희와 항상 함께 있으리라]가 적힌 현판이 붙어 있었습니다."
              coverUrl="https://poclanos.com/drmvsn/wp-content/uploads/2018/10/1011-12-02.jpg"
              musicUrl="https://www.melon.com/album/detail.htm?albumId=10210636"
            />
            <MusicCard 
              title="몸의 중심 (2019)" 
              description="이 젊은 비정규직 노동자의 죽음이 잊혀지지 않도록, 많은 이들이 오래도록 기억하고 추모하여 결국에는 세상을 위해 움직일 수 있도록 예술가들이 힘을 합쳤습니다. 모든 힘을 다해서 이러한 일을 막을 것입니다."
              coverUrl="https://image.bugsm.co.kr/album/images/1000/202450/20245051.jpg"
              musicUrl="https://www.melon.com/album/detail.htm?albumId=10272293"
            />
            <MusicCard 
              title="혼약의 기도 (2020)" 
              description="세민과의 결혼식을 앞두고 만들었던 곡입니다. 앞으로 함께 살아갈 인생의 방향과 세상과의 약속에 대한 메시지를 담고 있습니다."
              coverUrl="https://ifh.cc/g/2yDdbc.jpg"
              musicUrl="https://www.youtube.com/watch?v=EsFqpkUfxxE"
            />
            <MusicCard 
              title="눈녹듯 (2024)" 
              description="한 어머니의 사랑과 고통을 담은 음악입니다. 눈처럼 켜켜이 쌓여가는 슬픔, 그 속에서 다른 사람들은 이런 고통을 겪지않게 하고자 나아가고 있는 한 강인한 어머니의 마음을 느껴보시기 바랍니다. "
              coverUrl="https://ifh.cc/g/wNvjFr.jpg"
              musicUrl="https://youtu.be/cllJgXtVWmU?si=KGW6v01KH9yFY22a"
            />
          </div>
        </Section>

        <Section title="공연일정" id="concert">
          <ConcertSlider concerts={concerts} />
        </Section>

        <Section title="음반구매" id="album">
          <AlbumPurchase album={album} />
        </Section>

        <Section title="연락처 및 문의" id="contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-gray-800 p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-8 text-gray-200 font-santokki">연락처</h3>
              <ContactInfo 
                icon={Mail} 
                title="이메일" 
                content="contact@kosmart.org" 
                link="mailto:contact@kosmart.org"
              />
              <ContactInfo 
                icon={Phone} 
                title="전화" 
                content="02-764-3114" 
                link="tel:+8227643114"
              />
              <ContactInfo 
                icon={MapPin} 
                title="주소" 
                content="서울특별시 은평구 통일로 68길 4 302호 한국스마트협동조합" 
                link="https://www.google.com/maps/search/?api=1&query=서울특별시+은평구+통일로+68길+4+302호+한국스마트협동조합"
              />
            </motion.div>
            <ContactForm />
          </div>
        </Section>
      </main>

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-400 p-6 mt-12">
        <div className="container mx-auto text-center font-wanted-sans">
          <p>&copy; 2024 황경하. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;