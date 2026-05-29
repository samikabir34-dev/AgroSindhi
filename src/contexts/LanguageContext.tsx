import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Language type
export type Language = 'en' | 'sd' | 'ur';

// Translation type
export interface Translations {
  [key: string]: string | Translations;
}

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  languageName: string;
}

// Translation files
const translations: Record<Language, Translations> = {
  en: {
    // Common
    common: {
      appName: 'SindhAgro',
      home: 'Home',
      map: 'Map',
      dashboard: 'Dashboard',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      search: 'Search',
      searchLocation: 'Search location...',
      previous: 'Previous',
      current: 'Current',
      language: 'Language',
    },

    // Navbar
    navbar: {
      draw: 'Draw',
      reset: 'Reset',
      analyze: 'Analyze',
      scanning: 'Scanning...',
    },

    // Index/Home Page
    home: {
      badge: 'Precision Agriculture Made Simple',
      title: 'SindhAgro',
      subtitle1: 'Transform Your Farming with',
      subtitle2: 'Satellite Intelligence',
      description: 'Harness the power of Sentinel-2 satellite imagery and AI to gain actionable insights about your fields. Make data-driven decisions that increase yields and optimize resources.',
      sentinel2: 'Sentinel-2 satellite imagery',
      ai: 'AI',
      launchApp: 'Launch App',

      // Stats section
      trustedByFarmers: 'Trusted by Farmers Worldwide',
      fieldsAnalyzed: 'Fields Analyzed',
      activeUsers: 'Active Users',
      accuracyRate: 'Accuracy Rate',
      monitoring: 'Monitoring',

      // Features section
      powerfulFeatures: 'Powerful Features',
      featuresSubtitle: 'Everything you need to make informed agricultural decisions',

      ndviAnalysisTitle: 'NDVI Analysis',
      ndviAnalysisDesc: 'Monitor plant health and biomass density across your entire field using satellite-derived vegetation indices.',

      ndreInsightsTitle: 'NDRE Insights',
      ndreInsightsDesc: 'Assess nitrogen levels and photosynthetic activity for optimal fertilization timing and application.',

      ndwiMonitoringTitle: 'NDWI Monitoring',
      ndwiMonitoringDesc: 'Detect water content variations to optimize irrigation schedules and prevent crop water stress.',

      // How it works section
      howItWorks: 'How It Works',
      howItWorksSubtitle: 'Three simple steps to unlock powerful insights',

      step1Title: 'Draw Your Field',
      step1Desc: 'Use our interactive map to outline the boundaries of your agricultural field.',

      step2Title: 'Analyze Data',
      step2Desc: 'Our AI processes satellite imagery to calculate NDVI, NDRE, and NDWI indices.',

      step3Title: 'Get Insights',
      step3Desc: 'Receive actionable recommendations and visualizations for better decision-making.',

      // Benefits section
      whyChoose: 'Why Choose SindhAgro?',
      benefit1: 'Real-time satellite data from Sentinel-2',
      benefit2: 'AI-powered insights and recommendations',
      benefit3: 'Year-over-year field comparison',
      benefit4: 'Easy-to-understand visualizations',
      benefit5: 'Export and share reports',
      benefit6: 'Mobile-friendly dashboard',

      // CTA section
      readyToTransform: 'Ready to Transform Your Farm?',
      ctaDescription: 'Join thousands of farmers worldwide who are leveraging satellite technology to increase yields and optimize resources.',
      thousandsOfFarmers: 'thousands of farmers worldwide',
      getStartedNow: 'Get Started Now',

      // Footer
      poweredBy: 'Powered by Sentinel-2 Satellite Imagery',
      copyright: '© 2024 SindhAgro. All rights reserved.',
    },
 
    // Services
    services: {
      fieldAnalysis: 'Field Analysis',
      waterAnalysis: 'Water Analysis',
      marketAnalysis: 'Market Analysis',
      weatherAnalysis: 'Weather Analysis',
      savedFields: 'Saved Fields',
    },
 
    // Water Page
    waterPage: {
      title: 'Water Status',
      subtitle: 'IRSA Reservoir & Barrage Statistics',
      tarbela: 'Tarbela',
      mangla: 'Mangla',
      chashma: 'Chashma',
      reservoirLevel: 'Reservoir Level',
      inflow: 'Inflow',
      outflow: 'Outflow',
      discharge: 'Discharge',
      barrages: 'Barrages',
      dailyReport: 'Daily Water Report',
      reservoirStatus: 'Reservoir Levels & Storage',
      liveData: 'LIVE DATA',
      upstream: 'Upstream',
      downstream: 'Downstream',
      provincialAllocations: 'Provincial Allocations',
      today: 'TODAY',
      vsLastYear: 'vs Last Year',
      rimStationSummary: 'Rim Station Inflow Summary',
      transparencyTitle: 'IRSA Data Transparency',
      transparencyDesc: 'Our system uses automated scraper hooks to ingest data from the official Indus River System Authority (IRSA) website. While we aim for 100% accuracy, users should verify critical values against the official PDF reports.',
    },
 
    // Market Page
    marketPage: {
      title: 'Market Prices',
      subtitle: 'Current Rates for Crops, Fruits & Vegetables',
      crop: 'Crop',
      price: 'Price',
      unit: 'Unit',
      market: 'Market',
      lastUpdate: 'Last Update',
    },
 
    // Weather Page
    weatherPage: {
      title: 'Weather Forecast',
      subtitle: 'Real-time Meteorological Data',
      temperature: 'Temperature',
      humidity: 'Humidity',
      uvIndex: 'UV Index',
      searchPlace: 'Search city or area...',
      useMyLocation: 'Use My Location',
      pressure: 'Pressure',
      apparentTemp: 'Apparent Temp',
      yourLocation: 'Your Location',
      weatherStatusDetail: 'Here is the weather status of this place or district. If your GPS location is active, this reflects your current spot.',
      seasonTitle: 'Spring',
      seasonDesc: 'Greenery and lushness: Time for flowers and new buds to bloom.',
      historicalWeather: 'Historical Weather',
      visibility: 'Visibility',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      dewPoint: 'Dew Point',
      calendar: 'Weather Calendar',
      highRisk: 'High Risk',
      moderate: 'Moderate',
      clearVisibility: 'Clear horizontal visibility',
      stablePressure: 'Stable pressure detected',
      condensation: 'Condensation threshold',
      precipChance: 'Precipitation Chance',
      day: 'Day',
    },

    // Map Page
    mapPage: {
      drawAreaFirst: 'Please draw an area on the map first',
      fetchingSatellite: 'Fetching satellite imagery from Sentinel-2...',
      usingDemoData: 'Using demo data - backend service unavailable',
      connectionFailed: 'Using demo data - connection failed',
      analysisComplete: 'Analysis complete!',

      saveField: 'Save Field Boundary',
      saveFieldDesc: "You've drawn a new field. Give it a name to track its health and metrics over time.",
      fieldNamePlaceholder: 'e.g., North Corn Field, Block A...',
      analyzeFieldBtn: 'Analyze Field',

      // Quick Guide
      step1: 'Search location',
      step2: 'Draw field boundary',
      step3: 'Analyze health',
    },

    // Dashboard
    dashboard: {
      fieldAnalysis: 'Field Analysis',
      aiPoweredInsights: 'AI-Powered Satellite Insights',
      history: 'History',

      // Stats
      date: 'Date',
      ndvi: 'NDVI',
      ndre: 'NDRE',
      ndwi: 'NDWI',
      cloud: 'Cloud',
      notAvailable: 'N/A',
    },

    // ChatBot
    chatbot: {
      title: 'SindhAgro AI',
      subtitle: 'Your farm advisor 🌾',
      welcomeMessage: "Hey there! 👋 I'm SindhAgro AI, your farm advisor. Ask me anything about your field data!",
      placeholder: 'Ask about your field...',
      connectionError: "I'm having trouble connecting right now 🌾",
      apiKeyMissing: '⚠️ API key is missing! Please configure VITE_GEMINI_API_KEY in your .env file and restart the server.',
      authFailed: '🔑 Authentication failed! Your API key might be invalid. Please check VITE_GEMINI_API_KEY in your .env file.',
      rateLimited: "⏱️ We've hit the rate limit. Please wait a moment and try again!",
      serviceUnavailable: '⚠️ The AI service is temporarily down. Please try again in a few moments!',
    },

    // Summary Panel
    summary: {
      aiInsights: 'AI Insights',
      smartFieldAnalysis: 'Smart Field Analysis',
      fieldHealthOverview: 'Field Health Overview',
      overallHealth: 'Overall Health',
      healthScore: 'Health Score',
      aiAnalysisSummary: 'AI Analysis Summary',
      analyzingData: 'Analyzing field data...',
      whatStatsMean: 'What Stats Mean',
      whatIsProblem: 'What is the Problem',
      whatIsSolution: 'What is the Solution',
      noDataAvailable: 'No analysis data available',
      selectFieldForInsights: 'Select a field to see AI insights',

      // Health statuses
      excellent: 'Excellent',
      good: 'Good',
      moderate: 'Moderate',
      poor: 'Poor',
    },

    // Comparison Graph
    graph: {
      analysisComparison: 'Analysis Comparison',
      currentValuesOnly: 'Current values only',
      noHistoricalData: 'No Historical Data',
      previousYear: 'Previous Year',
      noAnalysisData: 'No Analysis Data',
      drawFieldToAnalyze: 'Draw a field on the map to analyze',
    },

    // Network Error
    networkError: {
      checkNetwork: 'Check Your Network :(',
    },

    // Not Found
    notFound: {
      title: '404',
      message: 'Oops! Page not found',
      returnHome: 'Return to Home',
    },
  },

  // Sindhi translations (RTL)
  sd: {
    // Common
    common: {
      appName: 'سنڌاڳڙو',
      home: 'گهر',
      map: 'نقشو',
      dashboard: 'ڊيش بورڊ',
      loading: 'لوڊ ٿي رهيو آهي...',
      error: 'غلطي',
      success: 'ڪامياب',
      cancel: 'رد ڪريو',
      save: 'محفوظ ڪريو',
      delete: 'ختم ڪريو',
      edit: 'ترميم ڪريو',
      close: 'بند ڪريو',
      search: 'ڳولهو',
      searchLocation: 'جڳھ ڳولهو...',
      previous: 'پوئين',
      current: 'موجوده',
      language: 'ٻولي',
    },

    // Navbar
    navbar: {
      draw: 'ٺاهيو',
      reset: 'ٻيهر سيٽ ڪريو',
      analyze: 'تجزيو ڪريو',
      scanning: 'اسڪين ٿي رهيو آهي...',
    },

    // Index/Home Page
    home: {
      badge: 'آبادگارن جو سچو ساٿي',
      title: 'سنڌاڳڙو',
      subtitle1: 'ٻنيءَ جي مڪمل نگراني ۽',
      subtitle2: 'هارين لاءِ هر معلومات هڪ جاءِ تي',
      description: 'هي ايپ توهان جي ٻنيءَ جو خيال رکڻ ۾ مدد ڪري ٿي. هاڻي توهان گهر ويٺي فصلن جي حالت، پاڻيءَ جي موجودگي، ميون ۽ ڀاڄين جا مارڪيٽ اگهه ۽ موسم جي تازي ڄاڻ حاصل ڪري سگهو ٿا، ته جيئن توهان جي محنت رنگ آڻي.',
      sentinel2: 'ٻنيءَ جي نگراني جو نظام',
      ai: 'سمارٽ سسٽم',
      launchApp: 'ايپ شروع ڪريو',
      footerDesc: 'آبادگارن لاءِ هڪ سولي ۽ مددگار ايپ، جيڪا فصلن جي صحت، مارڪيٽ اگهه ۽ موسم جي معلومات فراهم ڪري ٿي.',

      // Stats section
      trustedByFarmers: 'سڄي دنيا جي هارين جو اعتماد',
      fieldsAnalyzed: 'فيلڊ تجزيا ڪيا',
      activeUsers: 'فعال استعمال ڪندڙ',
      accuracyRate: 'درستگي جي شرح',
      monitoring: 'نگراني',

      // Features section
      powerfulFeatures: 'طاقتور خصوصيتون',
      featuresSubtitle: 'سڀ ڪجهه جيڪو توهان کي زرعي فيصلا ڪرڻ لاءِ گھرجي',

      ndviAnalysisTitle: 'NDVI تجزيو',
      ndviAnalysisDesc: 'سيٽلائيٽ مان حاصل ڪيل ويجيٽيشن انڊيڪس استعمال ڪندي پوري فيلڊ ۾ ٻوٽن جي صحت ۽ بائيوماس جي کثافت جي نگراني ڪريو.',

      ndreInsightsTitle: 'NDRE بصيرتون',
      ndreInsightsDesc: 'بھترين کاد جي وقت ۽ استعمال لاءِ نائٽروجن جي سطح ۽ روشني سنشليشڻ سرگرمي جو جائزو وٺو.',

      ndwiMonitoringTitle: 'NDWI نگراني',
      ndwiMonitoringDesc: 'آبپاشي جي شيڊول کي بھتر بڻائڻ ۽ فصلن جي پاڻي جي دٻاءَ کان بچڻ لاءِ پاڻي جي مقدار ۾ تبديلين کي ڳوليو.',

      // How it works section
      howItWorks: 'اهو ڪيئن ڪم ڪري ٿو',
      howItWorksSubtitle: 'طاقتور بصيرت حاصل ڪرڻ لاءِ ٽي آسان قدم',

      step1Title: 'پنھنجي فيلڊ ٺاهيو',
      step1Desc: 'پنھنجي زرعي فيلڊ جون حدون بيان ڪرڻ لاءِ اسان جو انٽرايڪٽو نقشو استعمال ڪريو.',

      step2Title: 'ڊيٽا جو تجزيو ڪريو',
      step2Desc: 'اسان جي مصنوعي ذهانت سيٽلائيٽ تصويرن کي پروسيس ڪري NDVI، NDRE ۽ NDWI انڊيڪس ڳڻي ٿي.',

      step3Title: 'بصيرتون حاصل ڪريو',
      step3Desc: 'بھتر فيصلا ڪرڻ لاءِ عملي سفارشون ۽ تصورات حاصل ڪريو.',

      // Benefits section
      whyChoose: 'سنڌاڳڙو ڇو چونڊيو؟',
      benefit1: 'سينٽينل-2 کان حقيقي وقت ۾ سيٽلائيٽ ڊيٽا',
      benefit2: 'مصنوعي ذهانت سان ھلندڙ بصيرتون ۽ سفارشون',
      benefit3: 'سال بہ سال فيلڊ جو مقابلو',
      benefit4: 'سمجھڻ ۾ آسان تصورات',
      benefit5: 'رپورٽون برآمد ۽ شيئر ڪريو',
      benefit6: 'موبائل دوست ڊيش بورڊ',

      // CTA section
      readyToTransform: 'پنھنجي فارم کي تبديل ڪرڻ لاءِ تيار آھيو؟',
      ctaDescription: 'سڄي دنيا ۾ ھزارين هارين سان شامل ٿيو جيڪي پيداوار وڌائڻ ۽ وسيلا بھتر بڻائڻ لاءِ سيٽلائيٽ ٽيڪنالاجي استعمال ڪري رھيا آھن.',
      thousandsOfFarmers: 'سڄي دنيا ۾ ھزارين ھاري',
      getStartedNow: 'ھاڻي شروع ڪريو',

      // Footer
      poweredBy: 'آبادگارن جي خوشحالي لاءِ',
      copyright: '© 2024 سنڌاڳڙو. سڀ حق محفوظ آھن.',
    },
 
    // Services
    services: {
      fieldAnalysis: 'ٻنيءَ جو جائزو',
      waterAnalysis: 'پاڻيءَ جو جائزو',
      marketAnalysis: 'مارڪيٽ جو جائزو',
      weatherAnalysis: 'موسم جو جائزو',
      savedFields: 'محفوظ ٿيل ٻنيون',
    },
 
    // Water Page
    waterPage: {
      title: 'پاڻيءَ جي صورتحال',
      subtitle: 'انڊس ريوزروائر سسٽم اٿارٽي (IRSA) جا انگ اکر',
      tarbela: 'تربيلا',
      mangla: 'منگلا',
      chashma: 'چشما',
      reservoirLevel: 'پاڻي جي سطح',
      inflow: 'آمد (Inflow)',
      outflow: 'نيڪال (Outflow)',
      discharge: 'ڊسچارج',
      barrages: 'بئراج',
      dailyReport: 'روزاني پاڻي جي رپورٽ',
      reservoirStatus: 'ريزروار جي سطح ۽ ذخيرو',
      liveData: 'لائيو ڊيٽا',
      upstream: 'اپ اسٽريم',
      downstream: 'ڊائون اسٽريم',
      provincialAllocations: 'صوبائي ورهاست',
      today: 'اڄ',
      vsLastYear: 'گذريل سال جي ڀيٽ ۾',
      rimStationSummary: 'رم اسٽيشن آمد جو خلاصو',
      transparencyTitle: 'IRSA ڊيٽا شفافيت',
      transparencyDesc: 'اسان جو سسٽم IRSA جي سرڪاري ويب سائيٽ تان خودڪار طريقي سان ڊيٽا گڏ ڪري ٿو. اسان درستگي جي ڪوشش ڪيون ٿا، پر صارفين کي سرڪاري رپورٽن سان تصديق ڪرڻ گھرجي.',
    },
 
    // Market Page
    marketPage: {
      title: 'مارڪيٽ جا اگهه',
      subtitle: 'فصلن، ميون ۽ ڀاڄين جا تازا اگهه',
      crop: 'فصل/جنس',
      price: 'اگهه',
      unit: 'يونٽ',
      market: 'مارڪيٽ',
      lastUpdate: 'آخري اپڊيٽ',
    },
 
    // Weather Page
    weatherPage: {
      title: 'موسم جي صورتحال',
      subtitle: 'تازي موسم جي ڄاڻ',
      temperature: 'درجه حرارت',
      humidity: 'گهم (Humidity)',
      uvIndex: 'UV انڊيڪس',
      searchPlace: 'شهر يا علائقو ڳولهيو...',
      useMyLocation: 'منهنجي جڳهه استعمال ڪريو',
      pressure: 'هوا جو دٻاءُ',
      apparentTemp: 'تپش',
      yourLocation: 'اوهان جو ماڳ',
      weatherStatusDetail: 'هتي ان ماڳ يا ضلعي جي موسم جو حال احوال ڏنل آهي. جيڪڏهن اوهان پنهنجي مشين مان جي پي ايس (لوڪيشن) کولي آهي ته اوهان جي ماڳ جو احوال آهي.',
      seasonTitle: 'بهار',
      seasonDesc: 'ساوڪ ۽ سرسبزي: گل ڦلن ۽ نون گئونچن نسرڻ جو وقت.',
      historicalWeather: 'تاريخي موسم',
      visibility: 'نظر جي حد',
      sunrise: 'سج اڀرڻ',
      sunset: 'سج لهڻ',
      dewPoint: 'ماڪ جو نقطو',
      calendar: 'موسم جو ڪيلينڊر',
      highRisk: 'وڌيڪ خطرو',
      moderate: 'عام حالت',
      clearVisibility: 'صاف نظارو',
      stablePressure: 'دٻاءُ مستحڪم آهي',
      condensation: 'ماڪ جو امڪان',
      precipChance: 'برسات جو امڪان',
      day: 'ڏينهن',
    },

    // Map Page
    mapPage: {
      drawAreaFirst: 'مھرباني ڪري پھريان نقشي تي ھڪڙو علائقو ٺاهيو',
      fetchingSatellite: 'سينٽينل-2 کان سيٽلائيٽ تصويرون آڻي رھيا آھيون...',
      usingDemoData: 'ڊيمو ڊيٽا استعمال ڪري رھيا آھيون - بيڪ اينڊ سروس دستياب ناھي',
      connectionFailed: 'ڊيمو ڊيٽا استعمال ڪري رھيا آھيون - ڪنيڪشن ناڪام',
      analysisComplete: 'تجزيو مڪمل!',

      saveField: 'ٻنيءَ جي حد محفوظ ڪريو',
      saveFieldDesc: 'توهان هڪ نئين ٻني جي حد ٺاهي ورتي آهي، هاڻي ان کي ڪو نالو ڏيو ته جيئن ان جي صحت جو جائزو ورتو وڃي.',
      fieldNamePlaceholder: 'مثال طور: اتر وارو ٻني، بلاڪ اي...',
      analyzeFieldBtn: 'ٻنيءَ جو تجزيو ڪريو',

      // Quick Guide
      step1: 'جڳھ ڳولھيو',
      step2: 'فيلڊ جي حد ٺاھيو',
      step3: 'صحت جو تجزيو ڪريو',
    },

    // Dashboard
    dashboard: {
      fieldAnalysis: 'فيلڊ جو تجزيو',
      aiPoweredInsights: 'مصنوعي ذهانت سان ھلندڙ سيٽلائيٽ بصيرتون',
      history: 'تاريخ',

      // Stats
      date: 'تاريخ',
      ndvi: 'فصل جي حالت',
      ndre: 'ڀاڻ',
      ndwi: 'پاڻي جي حالت',
      cloud: 'بادل',
      notAvailable: 'دستياب ناھي',
    },

    // ChatBot
    chatbot: {
      title: 'سنڌاڳڙو AI',
      subtitle: 'توھان جو فارم مشير 🌾',
      welcomeMessage: 'ھيلو! 👋 مان سنڌاڳڙو AI آھيان، توھان جو فارم مشير. پنھنجي فيلڊ ڊيٽا بابت ڪجھ به پڇو!',
      placeholder: 'پنھنجي فيلڊ بابت پڇو...',
      connectionError: 'مون کي ھاڻي ڪنيڪٽ ٿيڻ ۾ مشڪل ٿي رھي آھي 🌾',
      apiKeyMissing: '⚠️ API ڪيچي غائب آھي! مھرباني ڪري پنھنجي .env فائل ۾ VITE_GEMINI_API_KEY ترتيب ڏيو ۽ سرور ٻيھر شروع ڪريو.',
      authFailed: '🔑 تصديق ناڪام! توھان جي API ڪيچي غلط ھجي سگھي ٿي. مھرباني ڪري پنھنجي .env فائل ۾ VITE_GEMINI_API_KEY چيڪ ڪريو.',
      rateLimited: '⏱️ اسان جي حد ختم ٿي وئي آھي. مھرباني ڪري ٿوري دير انتظار ڪريو ۽ ٻيھر ڪوشش ڪريو!',
      serviceUnavailable: '⚠️ AI سروس ھن وقت بند آھي. مھرباني ڪري ڪجھ لمحن بعد ٻيھر ڪوشش ڪريو!',
    },

    // Summary Panel
    summary: {
      aiInsights: 'AI بصيرتون',
      smartFieldAnalysis: 'سمارٽ فيلڊ تجزيو',
      fieldHealthOverview: 'فيلڊ صحت جو جائزو',
      overallHealth: 'مجموعي صحت',
      healthScore: 'صحت جو اسڪور',
      aiAnalysisSummary: 'AI تجزيي جو خلاصو',
      analyzingData: 'فيلڊ ڊيٽا جو تجزيو ڪري رھيا آھيون...',
      whatStatsMean: 'انگ اکر جو مطلب ڇا آھي',
      whatIsProblem: 'مسئلو ڇا آھي',
      whatIsSolution: 'حل ڇا آھي',
      noDataAvailable: 'ڪو به تجزياتي ڊيٽا دستياب ناھي',
      selectFieldForInsights: 'AI بصيرتون ڏسڻ لاءِ فيلڊ چونڊيو',

      // Health statuses
      excellent: 'بھترين',
      good: 'سٺو',
      moderate: 'معتدل',
      poor: 'خراب',
    },

    // Comparison Graph
    graph: {
      analysisComparison: 'تجزيي جو مقابلو',
      currentValuesOnly: 'صرف موجوده قدر',
      noHistoricalData: 'ڪو به تاريخي ڊيٽا ناھي',
      previousYear: 'گذريل سال',
      noAnalysisData: 'ڪو به تجزياتي ڊيٽا ناھي',
      drawFieldToAnalyze: 'تجزيو ڪرڻ لاءِ نقشي تي فيلڊ ٺاھيو',
    },

    // Network Error
    networkError: {
      checkNetwork: 'پنھنجو نيٽورڪ چيڪ ڪريو :(',
    },

    // Not Found
    notFound: {
      title: '404',
      message: 'اوھو! صفحو نه مليو',
      returnHome: 'گھر ڏانھن واپس وڃو',
    },
  },

  // Urdu translations (RTL)
  ur: {
    // Common
    common: {
      appName: 'سندھ ایگرو',
      home: 'ہوم',
      map: 'نقشہ',
      dashboard: 'ڈیش بورڈ',
      loading: 'لوڈ ہو رہا ہے...',
      error: 'غلطی',
      success: 'کامیاب',
      cancel: 'منسوخ کریں',
      save: 'محفوظ کریں',
      delete: 'حذف کریں',
      edit: 'ترمیم کریں',
      close: 'بند کریں',
      search: 'تلاش کریں',
      searchLocation: 'مقام تلاش کریں...',
      previous: 'پچھلا',
      current: 'موجودہ',
      language: 'زبان',
    },

    // Navbar
    navbar: {
      draw: 'بنائیں',
      reset: 'ری سیٹ',
      analyze: 'تجزیہ کریں',
      scanning: 'اسکین ہو رہا ہے...',
    },

    // Index/Home Page
    home: {
      badge: 'درست زراعت آسان بنائیں',
      title: 'سندھ ایگرو',
      subtitle1: 'اپنی کھیتی کو تبدیل کریں',
      subtitle2: 'سیٹلائٹ ذہانت کے ساتھ',
      description: 'Sentinel-2 سیٹلائٹ تصاویر اور مصنوعی ذہانت کی طاقت استعمال کرکے اپنے کھیتوں کے بارے میں عملی بصیرت حاصل کریں۔ ڈیٹا پر مبنی فیصلے کریں جو پیداوار بڑھائیں اور وسائل کو بہتر بنائیں۔',
      sentinel2: 'Sentinel-2 سیٹلائٹ تصاویر',
      ai: 'مصنوعی ذہانت',
      launchApp: 'ایپ شروع کریں',

      // Stats section
      trustedByFarmers: 'دنیا بھر کے کسانوں کا اعتماد',
      fieldsAnalyzed: 'کھیتوں کا تجزیہ',
      activeUsers: 'فعال صارفین',
      accuracyRate: 'درستگی کی شرح',
      monitoring: 'نگرانی',

      // Features section
      powerfulFeatures: 'طاقتور خصوصیات',
      featuresSubtitle: 'زرعی فیصلے کرنے کے لیے سب کچھ جو آپ کو درکار ہے',

      ndviAnalysisTitle: 'NDVI تجزیہ',
      ndviAnalysisDesc: 'سیٹلائٹ سے حاصل کردہ ویجیٹیشن انڈیکس استعمال کرکے پورے کھیت میں پودوں کی صحت اور بائیوماس کی کثافت کی نگرانی کریں۔',

      ndreInsightsTitle: 'NDRE بصیرت',
      ndreInsightsDesc: 'بہترین کھاد کے وقت اور استعمال کے لیے نائٹروجن کی سطح اور روشنی سنشلیشن سرگرمی کا جائزہ لیں۔',

      ndwiMonitoringTitle: 'NDWI نگرانی',
      ndwiMonitoringDesc: 'آبپاشی کے شیڈول کو بہتر بنانے اور فصلوں میں پانی کے تناؤ کو روکنے کے لیے پانی کی مقدار میں تبدیلیوں کا پتہ لگائیں۔',

      // How it works section
      howItWorks: 'یہ کیسے کام کرتا ہے',
      howItWorksSubtitle: 'طاقتور بصیرت حاصل کرنے کے لیے تین آسان قدم',

      step1Title: 'اپنا کھیت بنائیں',
      step1Desc: 'اپنے زرعی کھیت کی حدود کا خاکہ بنانے کے لیے ہمارا انٹرایکٹو نقشہ استعمال کریں۔',

      step2Title: 'ڈیٹا کا تجزیہ کریں',
      step2Desc: 'ہماری مصنوعی ذہانت سیٹلائٹ تصاویر کو پروسیس کرکے NDVI، NDRE اور NDWI انڈیکس کا حساب لگاتی ہے۔',

      step3Title: 'بصیرت حاصل کریں',
      step3Desc: 'بہتر فیصلہ سازی کے لیے عملی سفارشات اور تصورات حاصل کریں۔',

      // Benefits section
      whyChoose: 'سندھ ایگرو کیوں چنیں؟',
      benefit1: 'Sentinel-2 سے حقیقی وقت میں سیٹلائٹ ڈیٹا',
      benefit2: 'مصنوعی ذہانت سے چلنے والی بصیرت اور سفارشات',
      benefit3: 'سال بہ سال کھیت کا موازنہ',
      benefit4: 'سمجھنے میں آسان تصورات',
      benefit5: 'رپورٹیں برآمد اور شیئر کریں',
      benefit6: 'موبائل دوست ڈیش بورڈ',

      // CTA section
      readyToTransform: 'اپنے فارم کو تبدیل کرنے کے لیے تیار ہیں؟',
      ctaDescription: 'دنیا بھر کے ہزاروں کسانوں میں شامل ہوں جو پیداوار بڑھانے اور وسائل کو بہتر بنانے کے لیے سیٹلائٹ ٹیکنالوجی کا فائدہ اٹھا رہے ہیں۔',
      thousandsOfFarmers: 'دنیا بھر کے ہزاروں کسان',
      getStartedNow: 'ابھی شروع کریں',

      // Footer
      poweredBy: 'Sentinel-2 سیٹلائٹ تصاویر سے طاقتور',
      copyright: '© 2024 سندھ ایگرو۔ جملہ حقوق محفوظ ہیں۔',
    },
 
    // Services
    services: {
      fieldAnalysis: 'کھیت کا تجزیہ',
      waterAnalysis: 'پانی کا تجزیہ',
      marketAnalysis: 'مارکیٹ کا تجزیہ',
      weatherAnalysis: 'موسم کا تجزیہ',
      savedFields: 'محفوظ شدہ کھیت',
    },
 
    // Water Page
    waterPage: {
      title: 'پانی کی صورتحال',
      subtitle: 'ارسا (IRSA) کے اعداد و شمار',
      tarbela: 'تربیلا',
      mangla: 'منگلا',
      chashma: 'چشمہ',
      reservoirLevel: 'پانی کی سطح',
      inflow: 'آمد',
      outflow: 'اخراج',
      discharge: 'ڈسچارج',
      barrages: 'بیراج',
      dailyReport: 'روزانہ پانی کی رپورٹ',
      reservoirStatus: 'ریزروائر کی سطح اور ذخیرہ',
      liveData: 'لائیو ڈیٹا',
      upstream: 'اپ اسٹریم',
      downstream: 'ڈاؤن اسٹریم',
      provincialAllocations: 'صوبائی تقسیم',
      today: 'آج',
      vsLastYear: 'گزشتہ سال کے مقابلے میں',
      rimStationSummary: 'رم اسٹیشن آمد کا خلاصہ',
      transparencyTitle: 'ارسا ڈیٹا شفافیت',
      transparencyDesc: 'ہمارا سسٹم ارسا کی سرکاری ویب سائٹ سے خودکار طریقے سے ڈیٹا حاصل کرتا ہے۔ ہم درستگی کی کوشش کرتے ہیں، لیکن صارفین کو سرکاری رپورٹوں سے تصدیق کرنی چاہیے۔',
    },
 
    // Market Page
    marketPage: {
      title: 'مارکیٹ کے نرخ',
      subtitle: 'فصلوں، پھلوں اور سبزیوں کے تازہ ترین ریٹ',
      crop: 'جنس',
      price: 'نرخ',
      unit: 'یونٹ',
      market: 'مارکیٹ',
      lastUpdate: 'آخری اپ ڈیٹ',
    },
 
    // Weather Page
    weatherPage: {
      title: 'موسم کی صورتحال',
      subtitle: 'موسم کی تازہ ترین معلومات',
      temperature: 'درجہ حرارت',
      humidity: 'نمی',
      uvIndex: 'یو وی انڈیکس',
      searchPlace: 'شہر یا علاقہ تلاش کریں...',
      useMyLocation: 'میری لوکیشن استعمال کریں',
      pressure: 'ہوا کا دباؤ',
      apparentTemp: 'محسوس تپش',
      yourLocation: 'آپ کا مقام',
      weatherStatusDetail: 'یہاں اس مقام یا ضلع کے موسم کی صورتحال دی گئی ہے۔ اگر آپ کی لوکیشن آن ہے تو یہ آپ کے موجودہ مقام کی معلومات ہے۔',
      seasonTitle: 'بہار',
      seasonDesc: 'ہریالی اور شادابی: پھولوں اور نئی کونپلوں کے کھلنے کا وقت۔',
      historicalWeather: 'تاریخی موسم',
      visibility: 'نظر کی حد',
      sunrise: 'طلوع آفتاب',
      sunset: 'غروب آفتاب',
      dewPoint: 'شبنم کا نقطہ',
      calendar: 'موسم کا کیلنڈر',
      highRisk: 'زیادہ خطرہ',
      moderate: 'معتدل',
      clearVisibility: 'صاف بصارت',
      stablePressure: 'دباؤ مستحکم ہے',
      condensation: 'شبنم کا امکان',
      precipChance: 'بارش کا امکان',
      day: 'دن',
    },

    // Map Page
    mapPage: {
      drawAreaFirst: 'براہ کرم پہلے نقشے پر ایک علاقہ بنائیں',
      fetchingSatellite: 'Sentinel-2 سے سیٹلائٹ تصاویر لا رہے ہیں...',
      usingDemoData: 'ڈیمو ڈیٹا استعمال ہو رہا ہے - بیک اینڈ سروس دستیاب نہیں',
      connectionFailed: 'ڈیمو ڈیٹا استعمال ہو رہا ہے - کنکشن ناکام',
      analysisComplete: 'تجزیہ مکمل!',

      saveField: 'کیت کی حد محفوظ کریں',
      saveFieldDesc: 'آپ نے ایک نئے کیت کی حد بنا لی ہے، اب اسے کوئی نام دیں تاکہ اس کی صحت کا جائزہ لیا جا سکے۔',
      fieldNamePlaceholder: 'مثال کے طور پر: شمالی کیت، بلاک اے...',
      analyzeFieldBtn: 'کیت کا تجزیہ کریں',

      // Quick Guide
      step1: 'مقام تلاش کریں',
      step2: 'کھیت کی حد بنائیں',
      step3: 'صحت کا تجزیہ کریں',
    },

    // Dashboard
    dashboard: {
      fieldAnalysis: 'کھیت کا تجزیہ',
      aiPoweredInsights: 'مصنوعی ذہانت سے چلنے والی سیٹلائٹ بصیرت',
      history: 'تاریخ',

      // Stats
      date: 'تاریخ',
      ndvi: 'فصل کی حالت',
      ndre: 'کھاد',
      ndwi: 'پانی کی صورتحال',
      cloud: 'بادل',
      notAvailable: 'دستیاب نہیں',
    },

    // ChatBot
    chatbot: {
      title: 'سندھ ایگرو AI',
      subtitle: 'آپ کا فارم مشیر 🌾',
      welcomeMessage: 'ہیلو! 👋 میں سندھ ایگرو AI ہوں، آپ کا فارم مشیر۔ اپنے کھیت کے ڈیٹا کے بارے میں کچھ بھی پوچھیں!',
      placeholder: 'اپنے کھیت کے بارے میں پوچھیں...',
      connectionError: 'مجھے ابھی کنیکٹ ہونے میں مشکل ہو رہی ہے 🌾',
      apiKeyMissing: '⚠️ API کلید غائب ہے! براہ کرم اپنی .env فائل میں VITE_GEMINI_API_KEY ترتیب دیں اور سرور دوبارہ شروع کریں۔',
      authFailed: '🔑 تصدیق ناکام! آپ کی API کلید غلط ہو سکتی ہے۔ براہ کرم اپنی .env فائل میں VITE_GEMINI_API_KEY چیک کریں۔',
      rateLimited: '⏱️ ہماری حد ختم ہو گئی ہے۔ براہ کرم تھوڑی دیر انتظار کریں اور دوبارہ کوشش کریں!',
      serviceUnavailable: '⚠️ AI سروس ابھی بند ہے۔ براہ کرم کچھ لمحات بعد دوبارہ کوشش کریں!',
    },

    // Summary Panel
    summary: {
      aiInsights: 'AI بصیرت',
      smartFieldAnalysis: 'سمارٹ کھیت تجزیہ',
      fieldHealthOverview: 'کھیت کی صحت کا جائزہ',
      overallHealth: 'مجموعی صحت',
      healthScore: 'صحت کا اسکور',
      aiAnalysisSummary: 'AI تجزیے کا خلاصہ',
      analyzingData: 'کھیت کے ڈیٹا کا تجزیہ ہو رہا ہے...',
      whatStatsMean: 'اعداد و شمار کا مطلب کیا ہے',
      whatIsProblem: 'مسئلہ کیا ہے',
      whatIsSolution: 'حل کیا ہے',
      noDataAvailable: 'کوئی تجزیاتی ڈیٹا دستیاب نہیں',
      selectFieldForInsights: 'AI بصیرت دیکھنے کے لیے کھیت چنیں',

      // Health statuses
      excellent: 'بہترین',
      good: 'اچھا',
      moderate: 'معتدل',
      poor: 'خراب',
    },

    // Comparison Graph
    graph: {
      analysisComparison: 'تجزیے کا موازنہ',
      currentValuesOnly: 'صرف موجودہ قدریں',
      noHistoricalData: 'کوئی تاریخی ڈیٹا نہیں',
      previousYear: 'گزشتہ سال',
      noAnalysisData: 'کوئی تجزیاتی ڈیٹا نہیں',
      drawFieldToAnalyze: 'تجزیہ کرنے کے لیے نقشے پر کھیت بنائیں',
    },

    // Network Error
    networkError: {
      checkNetwork: 'اپنا نیٹ ورک چیک کریں :(',
    },

    // Not Found
    notFound: {
      title: '404',
      message: 'افوہ! صفحہ نہیں ملا',
      returnHome: 'ہوم پر واپس جائیں',
    },
  },
};

// Language names for display
const languageNames: Record<Language, string> = {
  en: 'English',
  sd: 'سنڌي',
  ur: 'اردو',
};

// RTL languages
const rtlLanguages: Language[] = ['sd', 'ur'];

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested translation
const getNestedTranslation = (obj: Translations, path: string): string => {
  const keys = path.split('.');
  let result: any = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return the key if translation not found
    }
  }

  return typeof result === 'string' ? result : path;
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('sd');

  const isRTL = rtlLanguages.includes(language);
  const languageName = languageNames[language];

  // Translation function
  const t = (key: string): string => {
    return getNestedTranslation(translations[language], key);
  };

  // Set language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('terrasight_language', lang);
  };

  // Apply RTL and language-specific classes to document
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Remove previous language classes
    body.classList.remove('lang-en', 'lang-sd', 'lang-ur', 'rtl');

    // Add current language class
    body.classList.add(`lang-${language}`);

    if (isRTL) {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', language);
      body.classList.add('rtl');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', language);
    }
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, languageName }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Export language names for language switcher
export { languageNames, rtlLanguages };
