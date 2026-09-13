"use client";




import React, { useState } from 'react';

// Calorie dataset as a constant
const calorieData = [
    { foodItem: 'Idli', calories: 100 },
    { foodItem: 'Dosa', calories: 250 },
    { foodItem: 'Dal makhani', calories: 300 },
    { foodItem: 'Roti', calories: 120 },
    { foodItem: 'Raita', calories: 100 },
    { foodItem: 'Chicken tikka masala', calories: 400 },
    { foodItem: 'Naan', calories: 250 },
    { foodItem: 'Lassi', calories: 150 },
    { foodItem: 'Samosa', calories: 250 },

    { foodItem: 'Jalebi', calories: 350 },
    { foodItem: 'Imarti', calories: 100 },
    { foodItem: 'Upma', calories: 200 },
    { foodItem: 'Poha', calories: 100 },
    { foodItem: 'Uttapam', calories: 200},
    { foodItem: 'Makki di roti', calories: 280 },
    { foodItem: 'Missi Roti', calories: 200 },
    { foodItem: 'Rumali Roti', calories: 180 },
    { foodItem: 'Aloo Paratha', calories: 350 },

    { foodItem: 'Dal Paratha', calories: 250 },
    { foodItem: 'Coconut Rice', calories: 300 },
    { foodItem: 'Biryani', calories: 450 },
    { foodItem: 'Paneer Tikka Masala', calories: 350 },
    { foodItem: 'Onion Salad', calories: 50},
    { foodItem: 'Raita', calories: 100},
    { foodItem: 'Pickle', calories: 100 },
    { foodItem: 'Egg Curry', calories:300  },
    { foodItem: 'Boiled Egg ', calories: 70 },

    { foodItem: 'Dal Paratha', calories: 250 },
    { foodItem: 'Bhindi Masala', calories: 250 },
    { foodItem: 'Aloo Matar', calories: 250 },
    { foodItem: 'Kadhi Pakoda', calories:  250},
    { foodItem: 'Mix Veg', calories: 200 },
    { foodItem: 'Dal Tadka', calories: 200 },
    { foodItem: 'Masoor Dal', calories: 150},
    { foodItem: 'Sambar', calories: 100 },
    { foodItem: 'Samosa', calories: 250 },


    { foodItem: 'Jeera Rice', calories: 250 },
    { foodItem: 'Pav Bhaji', calories: 350  },
    { foodItem: 'Pani Puri ', calories: 200 },
    { foodItem: 'Dahi Vada', calories: 250},
    { foodItem: 'Kachori', calories: 300  },
    { foodItem: 'Rajma Masala', calories:300 },
    { foodItem: 'Palak Paneer', calories: 250 },
    { foodItem: 'Sarso ka saag', calories: 200 },
    { foodItem: 'Arhar Dal', calories: 180 },
];

const CalorieTracker = () => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [breakfast, setBreakfast] = useState('');
    const [lunch, setLunch] = useState('');
    const [dinner, setDinner] = useState('');
    const [snacks, setSnacks] = useState('');
    const [results, setResults] = useState(null);

    const getCalories = (foodItem) => {
        const trimmedItem = foodItem.toLowerCase().trim();
        const match = calorieData.find(item => item.foodItem.toLowerCase() === trimmedItem);
        return match ? match.calories : 0;
    };

    const calculateCalories = () => {
        const calculateMealCalories = (mealItems) => {
            return mealItems
                .split(',')
                .map(item => getCalories(item.trim()))
                .reduce((a, b) => a + b, 0);
        };

        const breakfastCalories = calculateMealCalories(breakfast);
        const lunchCalories = calculateMealCalories(lunch);
        const dinnerCalories = calculateMealCalories(dinner);
        const snackCalories = calculateMealCalories(snacks);

        const totalCalories = breakfastCalories + lunchCalories + dinnerCalories + snackCalories;

        let bmr = 0;
        const parsedAge = parseInt(age);
        if (gender === 'Male') {
            bmr = 10 * 70 + 6.25 * 170 - 5 * parsedAge + 5;
        } else {
            bmr = 10 * 60 + 6.25 * 160 - 5 * parsedAge - 161;
        }

        setResults({
            totalCalories,
            bmr,
            netCalories: totalCalories - bmr,
            breakdown: {
                breakfast: breakfastCalories,
                lunch: lunchCalories,
                dinner: dinnerCalories,
                snacks: snackCalories,
            },
        });
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Indian Food Calorie Tracker</h2>
                <div style={{ marginBottom: '15px' }}>
                    <label>Age</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter your age"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
                    <div style={{ marginBottom: '15px' }} key={meal}>
                        <label>{meal}</label>
                        <input
                            placeholder={`Enter items for ${meal.toLowerCase()}`}
                            onChange={(e) =>
                                meal === 'Breakfast' ? setBreakfast(e.target.value) :
                                meal === 'Lunch' ? setLunch(e.target.value) :
                                meal === 'Dinner' ? setDinner(e.target.value) :
                                setSnacks(e.target.value)
                            }
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                ))}
                <button
                    onClick={calculateCalories}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Calculate Calories
                </button>
                {results && (
                    <div style={{ marginTop: '20px' }}>
                        <h3>Calorie Analysis</h3>
                        <p>Total Calories Consumed: {results.totalCalories} calories</p>
                        <p>Estimated BMR: {results.bmr.toFixed(0)} calories</p>
                        <p>Net Calorie Intake: {results.netCalories.toFixed(0)} calories</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalorieTracker;



