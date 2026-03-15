'use client';

import HeroMain from './HeroMain';
import StatsSection from './StatsSection';
import TopOrganizations from './TopOrganizations';
import CategoriesSection from './CategoriesSection';
import EventsSection from './EventsSection';
import ReviewsSection from './ReviewsSection';
import ContactUs from './ContactUs';

export default function Hero() {
  return (
    <div>
      <HeroMain />
      <StatsSection />
      <TopOrganizations />
      <CategoriesSection />
      <EventsSection />
      <ReviewsSection />
      <ContactUs />
    </div>
  );
}