import Hero from "@/components/home/Hero";
import Statistics from "@/components/home/Statistics";
import WhyUs from "@/components/home/WhyUs";
import Reviews from "@/components/home/Reviews";
import MediaScrolls from "@/components/home/MediaScrolls";
import Tutorials from "@/components/home/Tutorials";
import QuickAccess from "@/components/home/QuickAccess";
import NavigationTutorial from "@/components/home/NavigationTutorial";
import Sponsors from "@/components/home/Sponsors";
import BottomCTA from "@/components/home/BottomCTA";
import WelcomeModal from "@/components/home/WelcomeModal";

const Index = () => {
  return (
    <>
      <WelcomeModal />
      <Hero />
      <Statistics />
      <QuickAccess />
      <WhyUs />
      <Reviews />
      <MediaScrolls />
      <Tutorials />
      <NavigationTutorial />
      <Sponsors />
      <BottomCTA />
    </>
  );
};

export default Index;
