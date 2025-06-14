import React from "react";
import { Layout } from "antd";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import GlobalHeader from "../../components/layout/GlobalHeader";
import GlobalFooter from "../../components/layout/GlobalFooter";
import { useDispatch, useSelector } from "react-redux";
import { showLoginModal } from "../../store/slices/exhibitorAuthSlice";
import { RootState } from "../../store/store";
import Hero from './components/HeroSection';
import About from './components/AboutSection';
import FeaturedExhibitions from './components/FeaturedExhibitions';
import Features from './components/FeaturesSection';
import CTA from './components/CTASection';

const { Content } = Layout;

// Styled components
const StyledContent = styled(Content)`
  padding-top: 64px;
`;

interface HomeProps {
  exhibitorLoginMode?: boolean;
}

const Home: React.FC<HomeProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.exhibitorAuth);

  // Function to handle registration/login action
  const handleRegisterClick = () => {
    if (isAuthenticated) {
      // If user is already logged in, redirect to exhibitor dashboard
      navigate('/exhibitor/dashboard');
    } else {
      // If not logged in, show login modal which has registration option
      dispatch(showLoginModal(undefined));
    }
  };

  return (
    <Layout>
      <GlobalHeader />
      <StyledContent>
        {/* Hero Section */}
        <Hero onRegisterClick={handleRegisterClick} isAuthenticated={isAuthenticated} />
        
        {/* About Us Section */}
        <About />
        
        {/* Featured Exhibitions */}
        <FeaturedExhibitions />
        
        {/* Features Section */}
        <Features />
        
        {/* Call to Action */}
        <CTA onRegisterClick={handleRegisterClick} isAuthenticated={isAuthenticated} />
      </StyledContent>
      <GlobalFooter />
    </Layout>
  );
};

export default Home; 