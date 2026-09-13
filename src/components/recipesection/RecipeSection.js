"use client";

import React, { useState } from 'react';
import './RecipeSection.css';
import { useTranslation } from 'react-i18next';


const RecipeSection = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [currentLikes, setCurrentLikes] = useState(0);
  const [currentDescription, setCurrentDescription] = useState('');
  const [currentComments, setCurrentComments] = useState([]);
  const [isYouTube, setIsYouTube] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Expanded video data with regional categories
  const videos = [
    // North Indian Recipes
    { 
      title: 'Moong Dal Cheela With Stuffed Paneer ', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321243/north1_lbpza8.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733321824/north1_c3i9nt.mp4", 
      likes: 560, 
      description: 'A healthy and protein-rich savory pancake made from ground moong dal batter, lightly spiced, and cooked to golden perfection. The cheela is stuffed with a flavorful paneer filling, making it a wholesome and delicious dish, often enjoyed with chutney or yogurt. Perfect for breakfast or a light meal!', 
      comments: [
        "Loved this recipe!",
        "Great job, will definitely try this!"
      ],
      region: 'north',
      isYouTube: false
    },
    { 
      title: 'Kabuli Chana Salad', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321255/north2_bmx54z.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733321874/north2_p1l74l.mp4", 
      likes: 680, 
      description: 'A nutritious and refreshing salad made with boiled chickpeas (Kabuli Chana), fresh vegetables, and zesty spices. It’s a perfect blend of crunch and flavor, ideal for a light snack or side dish.', 
      comments: [
        "This salad is so refreshing and healthy! The spices add just the right kick to the chickpeas.",
        "Tried it for lunch, and it was light yet filling. Perfect for summer days!"
      ],
      region: 'north',
      isYouTube: false
    },
    { 
      title: 'Aloo Simla Mirch Ki Sabzi', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321256/north3_ajlfag.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733321932/north3_d9vyam.mp4", 
      likes: 450, 
      description: 'A simple yet flavorful dry curry made with potatoes and capsicum stir-fried in aromatic Indian spices. This dish pairs wonderfully with parathas or chapatis for a wholesome meal.', 
      comments: [
        "A classic dish with minimal ingredients but packed with flavor. Loved it with parathas!",
        "The capsicum adds a great crunch to the soft potatoes. Simple and delicious!"
      ],
      region: 'north',
      isYouTube: false
    },
    { 
      title: 'Suji Ki Kheer', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321257/north4_mcdlhy.jpg",
      videoLink:  "https://res.cloudinary.com/db5hrms2s/video/upload/v1733322143/north4_cktjm4.mp4", 
      likes: 575, 
      description: 'A creamy and rich dessert made with semolina (suji), milk, and sugar, flavored with cardamom and garnished with nuts. This quick and easy kheer is a delightful treat for any occasion.', 
      comments: [
        "Such a quick dessert to make! It was creamy and perfectly sweet.",
        "The addition of nuts and cardamom made it so flavorful. My kids loved it!"
      ],
      region: 'north',
      isYouTube: false
    },
    { 
      title: 'Beetroot Paratha', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321270/north5_tjnnm3.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733318815/north5_unktrd.mp4", 
      likes: 390, 
      description: 'A vibrant, nutritious paratha made with grated beetroot kneaded into whole wheat flour, spiced with Indian flavors. It’s a healthy and delicious option for breakfast or lunch, served with curd or pickle.', 
      comments: [
        "The color and taste of these parathas are amazing! A great way to add veggies to my diet.",
        "Served it with curd and pickle, and it was a hit with the family!"
      ],
      region: 'north',
      isYouTube: false
    },
    { 
      title: 'Lauki Channa Dal', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321271/north6_gjtl43.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733318901/north6_wyyrwy.mp4", 
      likes: 420, 
      description: 'A wholesome curry made with bottle gourd (lauki) and split Bengal gram (channa dal), cooked in a mildly spiced gravy. This dish is both nutritious and comforting, perfect with steamed rice or rotis.', 
      comments: [
        "A wholesome dish that’s so comforting! Goes perfectly with rice.",
        "Even my kids who dislike lauki enjoyed it. Highly recommended!"
      ],
      region: 'north',
      isYouTube: false
    },
    { 
      title: 'Sarson ka Saag with Makki di Roti', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321279/north7_lyg8en.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733318890/north7_bbdu1w.mp4", 
      likes: 650, 
      description: 'A classic Punjabi dish made with mustard greens (sarson) and other leafy greens, slow-cooked with spices and served with makki di roti, a flatbread made from cornmeal. This winter delicacy is a celebration of rustic flavors.', 
      comments: [
        "The ultimate winter comfort food! Topped it with white butter, and it was heavenly.",
        "Took some effort, but the authentic flavors were worth it. A true Punjabi delight!"
      ],
      region: 'north',
      isYouTube: false
    },
    { 
      title: 'Sprout Salad with Millets', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321281/north8_sy3mtv.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733318884/north8_jifzam.mp4", 
      likes: 620, 
      description: 'A power-packed salad combining sprouted legumes with nutrient-rich millets, tossed with tangy lemon juice and spices. It’s a healthy and tasty choice for a light meal or snack.', 
      comments: [
        "So healthy and filling! The millet added a nice texture to the salad.",
        "A perfect snack for post-workout. Loved the lemony tang in it!"
      ],
      region: 'north',
      isYouTube: false
    },
    { 
      title: 'Masala Khichdi', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321283/north9_sswqgb.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733318881/north9_oi4wab.mp4", 
      likes: 480, 
      description: 'A comforting one-pot meal made with rice, lentils, vegetables, and a blend of spices. This spiced-up version of the classic khichdi is both nourishing and satisfying.', 
      comments: [
        "This spiced version of khichdi is my new favorite comfort food. So flavorful!",
        "Easy to make and very nutritious. A great one-pot meal for busy days."
      ],
      region: 'north',
      isYouTube: false
    },
    { 
      title: 'Mix Veg Paratha', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321285/north10_xutel1.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733318915/north10_povrrt.mp4", 
      likes: 350, 
      description: 'A hearty and flavorful stuffed paratha filled with a mix of finely chopped or grated vegetables and spices. Served hot with butter, yogurt, or pickle, it’s a versatile dish for any time of the day.', 
      comments: [
        "These parathas are packed with flavor and nutrition. Loved the mix of veggies!",
        "Great breakfast option. Served it with butter and achar for an authentic taste."
      ],
      region: 'north',
      isYouTube: false
    },
    
    // South Indian Recipes
    { 
      title: 'High Protein Soya Chunks Nutri Dosa', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321142/south1_n76n3t.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733319305/south1_jruixk.mp4", 
      likes: 700, 
      description: 'A nutritious twist on the classic dosa, this high-protein version is made by incorporating soya chunks into the batter. The result is a crispy dosa packed with plant-based protein, making it an excellent breakfast option for muscle repair and energy. Pair it with chutneys for a balanced meal.', 
      comments: [
        "This dosa is not only delicious but also so filling! The soya chunks add a great texture and boost of protein.",
        "Love how this recipe gives the traditional dosa a healthy upgrade. Perfect for breakfast or a light dinner."
      ],
      region: 'south',
      isYouTube: false
    },
    { 
      title: 'Beetroot Pachadi', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321142/south2_swsa79.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733319255/south2_hpvtil.mp4", 
      likes: 550, 
      description: 'A vibrant and refreshing yogurt-based dish made with grated beetroot, tempered with mustard seeds and curry leaves. Rich in antioxidants and fiber, beetroot pachadi is an ideal accompaniment to your meal, promoting digestion and improving skin health.', 
      comments: [
        "The earthy sweetness of beetroot combined with yogurt is a great match. So healthy and tasty!",
        "This beetroot pachadi is a perfect way to incorporate veggies into your diet. It’s creamy and refreshing!"
      ],
      region: 'south',
      isYouTube: false
    },
    { 
      title: 'Millet Idli', 
      thumbnail:  "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321142/south3_dfbisq.jpg",
      videoLink:  "https://res.cloudinary.com/db5hrms2s/video/upload/v1733319331/south3_nqr3gp.mp4", 
      likes: 635, 
      description: 'Millet idli is a healthy, gluten-free alternative to the traditional rice idli. Made with millet flour, these soft and spongy idlis are rich in fiber, vitamins, and minerals, providing a nutritious start to the day. Pair with sambar or chutney for a complete meal.', 
      comments: [
        "These millet idlis are light yet filling. I love how they taste just like the traditional ones but with a healthier twist!",
        "A great gluten-free alternative! My family loved the soft texture and the added health benefits."
      ],
      region: 'south',
      isYouTube: false
    },
    { 
      title: 'Chickpea Sundal', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321142/south4_lkosil.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733319333/south4_lkzzlb.mp4", 
      likes: 440, 
      description: 'Chickpea sundal is a nutritious snack made with boiled chickpeas, tempered with mustard seeds, coconut, and curry leaves. It’s high in protein and fiber, making it a perfect post-workout snack or light meal that supports muscle building and digestion.', 
      comments: [
        "This chickpea sundal is super healthy and full of flavor. A great snack for anytime!",
        "Such a simple and nutritious dish. I love how it’s packed with protein and perfect for a quick meal."
      ],
      region: 'south',
      isYouTube: false
    },
    { 
      title: 'Vegetable Upma', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321142/south5_ti9qvt.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733319321/south5_nwmkwu.mp4", 
      likes: 520, 
      description: 'It is a Classic South Indian delight made from semolina, packed with colourful vegetables like carrots, peas and beans . To accentuate the taste and flavour , add a tadka of mustard seeds, curry leaves and red chilies to give it a spicy touch', 
      comments: [
        "This vegetable upma is the perfect healthy breakfast. I love how easy it is to make and so filling!",
        "A great way to start the day with veggies! Full of flavor and so nutritious."
      ],
      region: 'south',
      isYouTube: false
    },
    { 
      title: 'Curd rice with Pickles', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733321143/south6_oam5hk.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733319305/south6_jk6vex.mp4", 
      likes: 660, 
      description: 'A comforting dish made by mixing cooked rice with curd, which is further topped with a tadka of mustard seeds, red chilies and curry leaves.Pair it with a small serving of homemade pickles for a tangy kick, making it an easy,refreshing option.', 
      comments: [
        "Curd rice is my go-to comfort food. It’s so cooling and soothing for the stomach.",
        "Such a light yet satisfying dish! The pickles give it the perfect zesty kick."
      ],
      region: 'south',
      isYouTube: false
    },

    // East Indian Recipes
    { 
      title: 'Bengali Mishti Doi', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733320475/east1_zdpcsc.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733316626/east1_uiasdk.mp4", 
      likes: 560, 
      description: 'A delicious Bengali dessert made from sweetened yogurt, Mishti Doi is rich in probiotics, calcium, and protein. The slow fermentation process gives it a smooth, creamy texture and a subtle sweetness, making it a perfect way to aid digestion and improve gut health.', 
      comments: [
        "This Mishti Doi is the perfect balance of sweetness and creaminess. A delightful end to any meal!",
        "Love how smooth and flavorful it is. A true Bengali treat, and so healthy with all the probiotics!"
      ],
      region: 'east',
      isYouTube: false
    },
    { 
      title: 'Odia Chenna Poda', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733320476/east2_tryu0h.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733316966/east2_l4ircn.mp4", 
      likes: 470, 
      description: 'A baked dessert made from fresh chhena (Indian cottage cheese), sugar, and cardamom. This traditional Odia dish is high in protein, calcium, and low in fat, making it a healthier indulgence that satisfies your sweet tooth while offering nutritional benefits.', 
      comments: [
        "Chenna Poda is such a unique dessert! It’s so delicious and feels lighter than other sweets.",
        "The perfect combination of sweet and savory with a soft texture. This is a healthier dessert option I’ll definitely make again!"
      ],
      region: 'east',
      isYouTube: false
    },
    { 
      title: 'Vegetable Thukpa', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733320476/east3_sxquip.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733322121/east3_d729be.mp4", 
      likes: 550, 
      description: 'A flavorful noodle soup made with mixed vegetables, thukpa is a popular East Indian dish that’s both filling and healthy. Packed with nutrients from vegetables and light broth, it’s a great option for boosting immunity and digestion.', 
      comments: [
        "This vegetable thukpa is light yet filling! A great option when you're craving something wholesome.",
        "So comforting and nutritious! Perfect for a cold day, and the vegetables add such a fresh flavor."
      ],
      region: 'east',
      isYouTube: false
    },
    { 
      title: 'Aamat', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733320476/east4_dg22fm.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733317065/east4_noomus.mp4", 
      likes: 390, 
      description: 'A tangy and spicy stew made from a mix of vegetables and tamarind, Aamat is a traditional Odisha dish. Rich in antioxidants and vitamin C from the tamarind and vegetables, it’s great for digestion and boosting immunity.', 
      comments: [
        "Aamat is so flavorful with the right amount of tanginess! Perfectly complements rice.",
        "Love how the tamarind adds that refreshing sour note to the vegetables. A must-try!"
      ],
      region: 'east',
      isYouTube: false
    },
    { 
      title: 'Dalma (Mixed Vegetable Lentil Stew)', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733320476/east5_bebdly.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733317084/east5_mys4py.mp4", 
      likes: 480, 
      description: 'A hearty, nutritious stew made with a mix of lentils and vegetables like pumpkin, eggplant, and potatoes. It’s rich in protein and fiber, promoting good digestion and making it a wholesome meal for overall health.', 
      comments: [
        "Dalma is comfort food at its best! Packed with nutrients and full of flavors.",
        "A simple, nutritious dish that pairs perfectly with rice. Love how wholesome and filling it is."
      ],
      region: 'east',
      isYouTube: false
    },
    { 
      title: 'Sattu Paratha', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733320476/east6_iw3f2q.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733317080/east6_wgudso.mp4", 
      likes: 520, 
      description: 'Made with roasted gram flour (sattu) and spices, this paratha is rich in protein and fiber. It’s an excellent source of energy, helping to keep you full longer. Perfect for breakfast or lunch, served with yogurt or chutney for a healthy, satisfying meal.', 
      comments: [
        "Sattu paratha is my new favorite! It's filling and so nutritious with all the fiber.",
        "Great for breakfast! It keeps me full all morning, and the flavors are fantastic!"
      ],
      region: 'east',
      isYouTube: false
    },
    
    // West Indian Recipes
    { 
      title: 'Gujarati Ragi Dhokla', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733320835/west1_ouwr5z.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733318544/west1_vdtfon.mp4", 
      likes: 720, 
      description: 'A healthy twist on the traditional dhokla, this recipe uses ragi (finger millet), which is rich in calcium, iron, and fiber. It’s a great source of energy and helps in improving bone health and digestion. The spongy texture and light spices make it a perfect snack or breakfast.', 
      comments: [
        "The ragi dhokla is soft, fluffy, and full of nutrients. A great snack to keep you energized throughout the day!",
        "I love how light and healthy this is. Perfect for a guilt-free breakfast or snack!"
      ],
      region: 'west',
      isYouTube: false
    },
    { 
      title: 'Maharashtrian Zunka Bhakar', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733320836/west2_l6hidx.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733318575/west2_yldqfi.mp4", 
      likes: 590, 
      description: 'A traditional Maharashtrian dish, Zunka is made with chickpea flour (besan) and is paired with Bhakar, a type of flatbread made from millet or wheat. It’s a wholesome, protein-packed meal with a good amount of fiber, making it great for digestion and energy.', 
      comments: [
        "Zunka bhakar is so satisfying and full of flavor! It’s perfect for a hearty meal that’s also healthy.",
        "A great way to enjoy chickpea flour in a savory dish. It’s simple but delicious and keeps you full for longer."
      ],
      region: 'west',
      isYouTube: false
    },
    { 
      title: 'Bajre ki Roti with Dal', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733320836/west3_ywes6u.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733318564/west3_cgocta.mp4", 
      likes: 540, 
      description: 'Bajra (pearl millet) roti, paired with a nutritious dal, is a traditional combination from Rajasthan and Gujarat. Bajra is rich in iron, fiber, and antioxidants, while dal provides protein, making it a wholesome meal that aids digestion and strengthens immunity.', 
      comments: [
        "Bajra roti with dal is such a healthy and comforting meal. The combination is perfect, especially during the winter!",
        "Millet roti is so filling and nutritious. Paired with dal, it’s a great option for lunch or dinner."
      ],
      region: 'west',
      isYouTube: false
    },
    { 
      title: 'Gujarati Methi Thepla', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733320836/west4_pl9bmd.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733318536/west4_hijyfk.mp4", 
      likes: 660, 
      description: 'Methi thepla is a flavorful flatbread made with fenugreek leaves, whole wheat flour, and spices. Rich in iron and fiber, it’s perfect for improving digestion, boosting immunity, and providing sustained energy. It’s often enjoyed with yogurt or pickles.', 
      comments: [
        "Methi thepla is my go-to breakfast. It’s packed with nutrients and tastes so good with a side of yogurt!",
        "The bitterness of methi balances perfectly with the spices. A delicious and healthy way to start the day!"
      ],
      region: 'west',
      isYouTube: false
    },
    { 
      title: 'Gatte ki Sabzi', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733320836/west5_ggtoom.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733318598/west5_pzf0un.mp4", 
      likes: 450, 
      description: 'A traditional Rajasthani dish, Gatte ki Sabzi is made with gram flour dumplings cooked in a spicy yogurt-based gravy. High in protein and rich in flavor, it’s a great vegetarian option that’s both filling and nutritious.', 
      comments: [
        "Gatte ki sabzi is flavorful and unique! The gram flour dumplings are so soft and perfect with rice.",
        "I love how hearty and satisfying this dish is. It’s a great source of protein and tastes amazing with roti!"
      ],
      region: 'west',
      isYouTube: false
    },
    { 
      title: 'Poha', 
      thumbnail: "https://res.cloudinary.com/db5hrms2s/image/upload/v1733320837/west6_wgwoie.jpg",
      videoLink: "https://res.cloudinary.com/db5hrms2s/video/upload/v1733318571/west6_xfgqlv.mp4", 
      likes: 510, 
      description: 'Poha is a popular breakfast dish made with flattened rice, mustard seeds, turmeric, and vegetables. It’s light, easily digestible, and a great source of carbohydrates, fiber, and vitamins, making it a great start to your day while promoting digestive health.', 
      comments: [
        "Poha is my favorite quick breakfast. It’s so light but keeps me full until lunch!",
        "Such a healthy and colorful dish! The veggies add crunch, and the turmeric makes it so aromatic."
      ],
      region: 'west',
      isYouTube: false
    }
  ];

  const openModal = (videoLink, likes, description, comments, isYouTube) => {
    setCurrentVideo(videoLink);
    setIsYouTube(isYouTube);
    setCurrentLikes(likes);
    setCurrentDescription(description);
    setCurrentComments(comments);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentVideo('');
  };

  // Filter videos based on selected region
  const filteredVideos = selectedRegion === 'all' 
    ? videos 
    : videos.filter(video => video.region === selectedRegion);
    return (
      <div className="recipe-section">
      <h2>{t('recipeSection.title')}</h2>
      <div className="region-selector">
        {['all', 'north', 'south', 'east', 'west'].map(region => (
          <button 
            key={region}
            className={selectedRegion === region ? 'active' : ''}
            onClick={() => setSelectedRegion(region)}
          >
            {t(`recipeSection.region.${region}`)}
          </button>
        ))}
      </div>
      <div className="recipe-thumbnails">
          {filteredVideos.map((video, index) => (
            <div 
              key={index} 
              className="recipe-thumbnail" 
              onClick={() => openModal(
                video.videoLink, 
                video.likes, 
                video.description, 
                video.comments, 
                video.isYouTube
              )}
            >
              <img src={video.thumbnail} alt={video.title} />
              <h4>{video.title}</h4>
              <p>Likes: {video.likes}</p>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              {isYouTube ? (
                <iframe
                  width="100%"
                  height="400px"
                  src={currentVideo}
                  title="Recipe Video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  width="100%"
                  height="400px"
                  controls
                  src={currentVideo}
                >
                  Your browser does not support the video tag.
                </video>
              )}
  
              <div className="video-info">
                <h4>Likes: {currentLikes}</h4>
                <p>{currentDescription}</p>
                <h5>Comments</h5>
                <ul>
                  {currentComments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default RecipeSection;
