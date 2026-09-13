"use client";

import styled from 'styled-components';
import CustomPatterns from '../components/dietcards/dietcards';
import Navbar from '../components/Navbar/navbar';
import Card from '../components/dietlink/card';
import RecipeSection from '../components/recipesection/RecipeSection';

const Container = styled.div`
  display: grid;
  grid-template-columns: 13% 85%;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 54% 47%;
@media (max-width: 768px) {
    display: flex;
    flex-direction : column-reverse;
  }
`;

const Recipecss = styled.div`
border: 1px solid darkgrey;
border-radius: 1rem;
margin-top:20px;
background-color: #efefef;
`;

const Cards = () => (
  <Container>
    <Navbar />
    <Content>
    <Recipecss>
      <div>
        <Card />
        <CustomPatterns />
      </div>
      </Recipecss>
      <div>
        <RecipeSection />
      </div>
      
    </Content>
  </Container>
);

export default Cards;
