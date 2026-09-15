"use client";

import styled from 'styled-components';
import SwapCards from '../components/dietcards/dietcards';
import PlannerBanner from '../components/dietlink/card';
import RecipeSection from '../components/recipesection/RecipeSection';
import Navbar from '../components/Navbar/navbar';

// Split look, dietary page only: blue sidebar, white left panel with the
// purple banner + photo swap cards, regional recipes on the right canvas.
const Container = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background-color: #f2f5fa;
  font-family: 'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
`;

const Sidebar = styled.div`
  height: 100vh;
  position: sticky;
  top: 0;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 44%) minmax(0, 56%);
  gap: 26px;
  padding: 16px 22px;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 12px 10px;
  }
`;

const LeftPanel = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 16px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  box-sizing: border-box;
  min-width: 0;
  overflow: visible;
`;

const RightPanel = styled.div`
  min-width: 0;
  padding-top: 4px;
  padding-left: 20px;
  @media (max-width: 900px) {
    padding-left: 0;
  }
`;

export default function DietaryPage() {
  return (
    <Container>
      <Sidebar>
        <Navbar />
      </Sidebar>
      <Content>
        <LeftPanel>
          <PlannerBanner />
          <SwapCards />
        </LeftPanel>
        <RightPanel>
          <RecipeSection />
        </RightPanel>
      </Content>
    </Container>
  );
}
