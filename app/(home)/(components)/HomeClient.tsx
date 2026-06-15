'use client'

import { useView } from '@/app/utils/context/ViewContext';
import SliderView from './SliderView';
import ListView from './ListView';

export default function HomeClient() {
  const { view } = useView();

  return (
    <div key={view} className="transition-opacity duration-300">
      {view === 'slider' ? <SliderView /> : <ListView />}
    </div>
  );
}