"use client";

// import React from 'react';
// import './dietcards.css'; 
// import '@fortawesome/fontawesome-free/css/all.min.css';

// const CustomPatterns = () => {
//   return (
//     <section className="section-plans" id="section-plans">

//       <div className="row">
        
        

//         <div className="col-1-of-4">
//           <div className="card2">
//             <div className="card2__side card2__side--front-2">
//               <div className="card2__title card2__title--2">
//                 {/* <i className="fas fa-plane"></i> */}
//                 <h4 className="card2__heading">Chocolate</h4>
//               </div>
//               <div className="card2__details">
//                 <ul>
//                   <li>Why load up on sugar and fats from chocolate when you’ve just burned it off in that spin class?</li>
//                 </ul>
//               </div>
//             </div>
//             <div className="card2__side card2__side--back card2__side--back-2">
//               <div className="card2__cta">
//               <div className="card2__details">
//                 <ul>
//                   <li>Chikki, made from jaggery and nuts, offers a natural sweetness with protein and minerals, keeping you satisfied without the sugar crash.</li>
//                 </ul>
//               </div>
//                 <a href="#popup" className="btn btn--white">Add to Diet</a>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-1-of-4">
//           <div className="card2">
//             <div className="card2__side card2__side--front-3">
//               <div className="card2__title card2__title--3">
//                 {/* <i className="fas fa-plane"></i> */}
//                 <h4 className="card2__heading">Chips</h4>
//               </div>
//               <div className="card2__details">
//                 <ul>
//                   <li>Crunching on chips? That’s hundreds of empty calories! Your 15,000 steps shouldn’t just go towards fueling unhealthy cravings.</li>
//                 </ul>
//               </div>
//             </div>
//             <div className="card2__side card2__side--back card2__side--back-3">
//               <div className="card2__cta">
//               <div className="card2__details">
//                 <ul>
//                   <li>Makhana is low-calorie, rich in antioxidants, and provides a guilt-free crunch that actually benefits your health.</li>
//                 </ul>
//               </div>
//                 <a href="#popup" className="btn btn--white">Add to Diet</a>
//               </div>
//             </div>
//           </div>
//         </div>

        
//       </div>
//       <div className="row">
        
        

//         <div className="col-1-of-4">
//           <div className="card2">
//             <div className="card2__side card2__side--front-4">
//               <div className="card2__title card2__title--4">
//                 {/* <i className="fas fa-rocket"></i> */}
//                 <h4 className="card2__heading">Momos</h4>
//               </div>
//               <div className="card2__details">
//                 <ul>
//                   <li>Ditch those deep-fried momos! You didn’t do those 20 squats just to munch on extra calories.</li>
//                 </ul>
//               </div>
//             </div>
//             <div className="card2__side card2__side--back card2__side--back-4">
//               <div className="card2__cta">
//               <div className="card2__details">
//                 <ul>
//                   <li>Paniyaram is steamed and made from fermented batter, offering probiotics and less oil compared to fried momos.</li>
//                 </ul>
//               </div>
//                 <a href="#popup" className="btn btn--white">Add to Diet</a>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-1-of-4">
//           <div className="card2">
//             <div className="card2__side card2__side--front-6">
//               <div className="card2__title card2__title--6">
//                 {/* <i className="fas fa-plane"></i> */}
//                 <h4 className="card2__heading">Pastries</h4>
//               </div>
//               <div className="card2__details">
//                 <ul>
//                   <li>You deserve a treat, but do you really want that sugary pastry to undo all your hard work at the gym?</li>
//                 </ul>
//               </div>
//             </div>
//             <div className="card2__side card2__side--back card2__side--back-6">
//               <div className="card2__cta">
//               <div className="card2__details">
//                 <ul>
//                   <li>Ragi cake is fiber-rich, with calcium and iron, making it a much healthier, less sugary dessert choice.</li>
//                 </ul>
//               </div>
//                 <a href="#popup" className="btn btn--white">Add to Diet</a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row">
//       <div className="col-1-of-4">
//           <div className="card2">
//             <div className="card2__side card2__side--front-7">
//               <div className="card2__title card2__title--7">
//                 {/* <i className="fas fa-plane"></i> */}
//                 <h4 className="card2__heading">Omelette</h4>
//               </div>
//               <div className="card2__details">
//                 <ul>
//                   <li>One omelette won’t undo the hour you spent on the treadmill, but is it giving you the nutrition you deserve?</li>
//                 </ul>
//               </div>
//             </div>
//             <div className="card2__side card2__side--back card2__side--back-7">
//               <div className="card2__cta">
//               <div className="card2__details">
//                 <ul>
//                   <li>Moong dal cheela is protein-packed, low-fat, and a great plant-based alternative that keeps you fuller for longer.</li>
//                 </ul>
//               </div>
//                 <a href="#popup" className="btn btn--white">Add to Diet</a>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-1-of-4">
//           <div className="card2">
//             <div className="card2__side card2__side--front-8">
//               <div className="card2__title card2__title--8">
//                 {/* <i className="fas fa-rocket"></i> */}
//                 <h4 className="card2__heading">Nachos</h4>
//               </div>
//               <div className="card2__details">
//                 <ul>
//                   <li>Nachos and cheese? That’s 200 extra calories you’ll regret later! Why not treat your body to something that works with your efforts?</li>
//                 </ul>
//               </div>
//             </div>
//             <div className="card2__side card2__side--back card2__side--back-8">
//               <div className="card2__cta">
//               <div className="card2__details">
//                 <ul>
//                   <li>Khakra is a roasted, whole grain snack that provides a crunchy and healthier alternative with less oil and more fiber.</li>
//                 </ul>
//               </div>
//                 <a href="#popup" className="btn btn--white">Add to Diet</a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="row">
        
//         <div className="col-1-of-4">
//           <div className="card2">
//             <div className="card2__side card2__side--front-5">
//               <div className="card2__title card2__title--5">
//                 {/* <i className="fas fa-paper-plane"></i> */}
//                 <h4 className="card2__heading">SubWay</h4>
//               </div>
//               <div className="card2__details">
//                 <ul>
//                   <li>Subway may sound healthy, but with all that processed bread and sauces, you’re undoing all your fitness progress.</li>
//                 </ul>
//               </div>
//             </div>
//             <div className="card2__side card2__side--back card2__side--back-5">
//               <div className="card2__cta">
//               <div className="card2__details">
//                 <ul>
//                   <li>Paneer rolls with whole wheat roti are a cleaner, fresher, and more balanced meal that provides protein without excess calories or additives.</li>
//                 </ul>
//               </div>
//                 <a href="#popup" className="btn btn--white">Add to Diet</a>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-1-of-4">
//           <div className="card2">
//             <div className="card2__side card2__side--front-1">
//               <div className="card2__title card2__title--1">
//                 {/* <i className="fas fa-paper-plane"></i> */}
//                 <h4 className="card2__heading">Maggi</h4>
//               </div>
//               <div className="card2__details">
//                 <ul>
//                   <li>Is that quick Maggi fix really worth sabotaging your long-term health goals? Why let your 30-minute yoga session go to waste?</li>
//                 </ul>
//               </div>
//             </div>
//             <div className="card2__side card2__side--back card2__side--back-1">
//               <div className="card2__cta">
//               <div className="card2__details">
//                 <ul>
//                   <li>Vermicelli upma is a lighter, less processed option, with added veggies that offer more fiber and nutrients.</li>
//                 </ul>
//               </div>
//                 <a href="#popup" className="btn btn--white">Add to Diet</a>
//               </div>
//             </div>
//           </div>
//         </div>

        
//       </div>
      
//     </section>
//   );
// };

// export default CustomPatterns;

import React from 'react';
import { useTranslation } from 'react-i18next';
import './dietcards.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css';

const CustomPatterns = () => {
  const { t } = useTranslation();

  return (
    <section className="section-plans" id="section-plans">
      <div className="row">
        {/* Chocolate Card */}
        <div className="col-1-of-4">
          <div className="card2">
            <div className="card2__side card2__side--front-2">
              <div className="card2__title card2__title--2">
                <h4 className="card2__heading">{t('chocolate')}</h4>
              </div>
              <div className="card2__details">
                <ul>
                  <li>{t('chocolateDescription')}</li>
                </ul>
              </div>
            </div>
            <div className="card2__side card2__side--back card2__side--back-2">
              <div className="card2__cta">
                <div className="card2__details">
                  <ul>
                    <li>{t('chikkiDescription')}</li>
                  </ul>
                </div>
                <a href="#popup" className="btn btn--white">{t('addToDiet')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Chips Card */}
        <div className="col-1-of-4">
          <div className="card2">
            <div className="card2__side card2__side--front-3">
              <div className="card2__title card2__title--3">
                <h4 className="card2__heading">{t('chips')}</h4>
              </div>
              <div className="card2__details">
                <ul>
                  <li>{t('chipsDescription')}</li>
                </ul>
              </div>
            </div>
            <div className="card2__side card2__side--back card2__side--back-3">
              <div className="card2__cta">
                <div className="card2__details">
                  <ul>
                    <li>{t('makhanaDescription')}</li>
                  </ul>
                </div>
                <a href="#popup" className="btn btn--white">{t('addToDiet')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Momos Card */}
        <div className="col-1-of-4">
          <div className="card2">
            <div className="card2__side card2__side--front-4">
              <div className="card2__title card2__title--4">
                <h4 className="card2__heading">{t('momos')}</h4>
              </div>
              <div className="card2__details">
                <ul>
                  <li>{t('momosDescription')}</li>
                </ul>
              </div>
            </div>
            <div className="card2__side card2__side--back card2__side--back-4">
              <div className="card2__cta">
                <div className="card2__details">
                  <ul>
                    <li>{t('paniyaramDescription')}</li>
                  </ul>
                </div>
                <a href="#popup" className="btn btn--white">{t('addToDiet')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Pastries Card */}
        <div className="col-1-of-4">
          <div className="card2">
            <div className="card2__side card2__side--front-6">
              <div className="card2__title card2__title--6">
                <h4 className="card2__heading">{t('pastries')}</h4>
              </div>
              <div className="card2__details">
                <ul>
                  <li>{t('pastriesDescription')}</li>
                </ul>
              </div>
            </div>
            <div className="card2__side card2__side--back card2__side--back-6">
              <div className="card2__cta">
                <div className="card2__details">
                  <ul>
                    <li>{t('ragiCakeDescription')}</li>
                  </ul>
                </div>
                <a href="#popup" className="btn btn--white">{t('addToDiet')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Omelette Card */}
        <div className="col-1-of-4">
          <div className="card2">
            <div className="card2__side card2__side--front-7">
              <div className="card2__title card2__title--7">
                <h4 className="card2__heading">{t('omelette')}</h4>
              </div>
              <div className="card2__details">
                <ul>
                  <li>{t('omeletteDescription')}</li>
                </ul>
              </div>
            </div>
            <div className="card2__side card2__side--back card2__side--back-7">
              <div className="card2__cta">
                <div className="card2__details">
                  <ul>
                    <li>{t('moongDalCheelaDescription')}</li>
                  </ul>
                </div>
                <a href="#popup" className="btn btn--white">{t('addToDiet')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Nachos Card */}
        <div className="col-1-of-4">
          <div className="card2">
            <div className="card2__side card2__side--front-8">
              <div className="card2__title card2__title--8">
                <h4 className="card2__heading">{t('nachos')}</h4>
              </div>
              <div className="card2__details">
                <ul>
                  <li>{t('nachosDescription')}</li>
                </ul>
              </div>
            </div>
            <div className="card2__side card2__side--back card2__side--back-8">
              <div className="card2__cta">
                <div className="card2__details">
                  <ul>
                    <li>{t('khakraDescription')}</li>
                  </ul>
                </div>
                <a href="#popup" className="btn btn--white">{t('addToDiet')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Subway Card */}
        <div className="col-1-of-4">
          <div className="card2">
            <div className="card2__side card2__side--front-5">
              <div className="card2__title card2__title--5">
                <h4 className="card2__heading">{t('subway')}</h4>
              </div>
              <div className="card2__details">
                <ul>
                  <li>{t('subwayDescription')}</li>
                </ul>
              </div>
            </div>
            <div className="card2__side card2__side--back card2__side--back-5">
              <div className="card2__cta">
                <div className="card2__details">
                  <ul>
                    <li>{t('paneerRollDescription')}</li>
                  </ul>
                </div>
                <a href="#popup" className="btn btn--white">{t('addToDiet')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Subway Card */}
        <div className="col-1-of-4">
          <div className="card2">
            <div className="card2__side card2__side--front-1">
              <div className="card2__title card2__title--1">
                <h4 className="card2__heading">{t('maggi')}</h4>
              </div>
              <div className="card2__details">
                <ul>
                  <li>{t('maggiDescription')}</li>
                </ul>
              </div>
            </div>
            <div className="card2__side card2__side--back card2__side--back-1">
              <div className="card2__cta">
                <div className="card2__details">
                  <ul>
                    <li>{t('vermicelliUpmaDescription')}</li>
                  </ul>
                </div>
                <a href="#popup" className="btn btn--white">{t('addToDiet')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Maggi Card
        <div className="col-1-of-4">
          <div className="card2">
            <div className="card2__side card2__side--front-9">
              <div className="card2__title card2__title--9">
                <h4 className="card2__heading">{t('maggi')}</h4>
              </div>
              <div className="card2__details">
                <ul>
                  <li>{t('maggiDescription')}</li>
                  </ul>
              </div>
            </div>
            <div className="card2__side card2__side--back card2__side--back-9">
              <div className="card2__cta">
                <div className="card2__details">
                  <ul>
                    <li>{t('vermicelliUpmaDescription')}</li>
                  </ul>
                </div>
                <a href="#popup" className="btn btn--white">{t('addToDiet')}</a>
              </div>
            </div>
          </div>
        </div> */}
               
        </div>
      
          </section>
         );
       };
      
   export default CustomPatterns;

