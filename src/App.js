import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, ShoppingCart, Calendar, Send } from 'lucide-react';
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
          {['소개', '음악', '공연일정', '음반구매', '섭외 및 문의'].map((item) => (
            <motion.li key={item} whileHover={{ scale: 1.1 }}>
              <a href={`#${item}`} className="hover:text-gray-300 transition duration-300 font-wanted-sans text-lg">
                {item}
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
    className="bg-gray-800 p-8 rounded-lg shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex flex-col items-center text-center">
      <motion.img 
        src={album.coverUrl} 
        alt={album.title} 
        className="w-full max-w-md h-auto object-cover rounded mb-6 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => window.open(album.purchaseUrl, '_blank')}
      />
      <h3 className="text-3xl font-bold mb-4 text-gray-200 font-santokki">{album.title}</h3>
      <p className="text-xl mb-4 font-wanted-sans text-gray-300">{album.price}</p>
      <p className="text-gray-400 mb-6 font-wanted-sans max-w-2xl">{album.description}</p>
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
    emailjs.send('service_id', 'template_id', formData)
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
      <h3 className="text-2xl font-bold mb-6 text-gray-200 font-santokki">공연 문의</h3>
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
    { title: "예정 없음", date: "2024년 X월 X일", location: "미정", ticketUrl: "https://www.instagram.com/podopodopo/" },
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
        <Section title="소개" id="소개">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <motion.img
              src="https://ifh.cc/g/oXQWJ3.jpg"
              alt="황경하"
              className="w-full md:w-1/3 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="w-full md:w-2/3">
              <p className="text-lg text-gray-300 leading-relaxed">
                황경하는 한국의 음악가, 사운드 엔지니어, 프로듀서, 그리고 연대자입니다. 
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mt-4">
                현장에서 글, 음악, 사진 등의 예술이 힘을 갖는 순간에 주목하여 여러 분야에서 오랫 동안 활동해왔습니다. 세상의 소외된 이들이 필요로 하는 순간 예술을 통해 힘을 보태고자 합니다.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mt-4">
                그의 작업은 사회에 대한 날카로운 시선과 따뜻한 연대의 메시지를 담고 있습니다. 음악 활동 외에도 황경하는 다양한 투쟁에 참여하며, 음악을 통한 사회 변화를 추구하고 있습니다. 
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mt-4">
                명성과 부를 좇기보다 시대의 아픔에 공감하고 약자와 연대하는 예술, 세상의 부조리에 저항하고 변화의 메시지를 전하는 예술의 길을 개척하고 있습니다. 비록 험난한 여정이겠지만 노래하는 자의 가녀린 어깨가 세상을 변화시키리라 믿습니다.
              </p>
            </div>
          </div>
        </Section>

        <Section title="발매작" id="음악">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MusicCard 
              title="젠트리피케이션 (2016)" 
              description="도시 재개발과 강제 퇴거 당하는 사람들의 이야기를 다룬 음반입니다."
              coverUrl="https://koreanmusicawards.com/wp-content/uploads/2021/01/2017_gentrification.jpg"
              musicUrl="https://www.melon.com/album/music.htm?albumId=10003221"
            />
            <MusicCard 
              title="새 민중음악 선곡집 3 (2017)" 
              description="부동산 투기꾼에게 손가락이 잘리고 가게에서 쫓겨난 궁중족발 가족의 이야기를 담고 있습니다."
              coverUrl="http://archivenew.vop.co.kr/images/05670d4ecb375286541262cf7e14b0aa/2018-01/24032527_8.jpg"
              musicUrl="https://www.melon.com/album/music.htm?albumId=10129121"
            />
            <MusicCard 
              title="볼찌어다 내가 세상 끝날까지 너희와 항상 함께 있으리라 (2018)" 
              description="세민과 함께 발표한 EP로, 사회적 약자들과의 연대를 노래합니다."
              coverUrl="https://poclanos.com/drmvsn/wp-content/uploads/2018/10/1011-12-02.jpg"
              musicUrl="https://www.melon.com/album/detail.htm?albumId=10210636"
            />
            <MusicCard 
              title="몸의 중심 (2019)" 
              description="고 김용균 노동자를 추모하기 위해 만들어진 음반입니다."
              coverUrl="https://image.bugsm.co.kr/album/images/1000/202450/20245051.jpg"
              musicUrl="https://www.melon.com/album/detail.htm?albumId=10272293"
            />
            <MusicCard 
              title="혼약의 기도 (2020)" 
              description="세민과 함께 발표한 싱글로, 삶의 방향과 세상과의 약속에 대한 메시지를 담고 있습니다."
              coverUrl="https://ifh.cc/g/2yDdbc.jpg"
              musicUrl="https://www.youtube.com/watch?v=EsFqpkUfxxE"
            />
            <MusicCard 
              title="눈녹듯 (2024)" 
              description="국가와 자본의 폭력으로 자식을 잃은 어머니의 마음을 담은 곡입니다."
              coverUrl="https://ifh.cc/g/wNvjFr.jpg"
              musicUrl="https://soundcloud.com/mangharm/mgtc9mf7xy41https://soundcloud.com/mangharm/olouv3eueop3?si=0bbda99bc42d419d86c513939968f3f4&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
            />
          </div>
        </Section>

        <Section title="공연일정" id="공연일정">
          <ConcertSlider concerts={concerts} />
        </Section>

        <Section title="음반구매" id="음반구매">
          <AlbumPurchase album={album} />
        </Section>

        <Section title="섭외 및 문의" id="섭외 및 문의">
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
                content="hwangtab@gmail.com" 
                link="mailto:hwangtab@gmail.com"
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