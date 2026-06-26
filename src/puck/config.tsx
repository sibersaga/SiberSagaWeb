import type { Config } from "@puckeditor/core";
import React from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import Programs from "../components/Programs";
import Testimonials from "../components/Testimonials";
import SchoolFacilities from "../components/SchoolFacilities";
import Teachers from "../components/Teachers";
import News from "../components/News";
import Gallery from "../components/Gallery";
import Topbar from "../components/Topbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnnouncementsTicker from "../components/AnnouncementsTicker";
import Achievements from "../components/Achievements";
import Innovations from "../components/Innovations";
import SpmbFaq from "../components/SpmbFaq";
import Stats from "../components/Stats";
import VideoMap from "../components/VideoMap";
import Welcome from "../components/Welcome";
import SchoolConditions from "../components/SchoolConditions";
import { FlexContainerConfig, GridColumnsConfig, BasicTextConfig, BasicImageConfig, BasicButtonConfig } from "./blocks/LayoutBlocks";
import { IconBlockConfig, DividerBlockConfig, SpacerBlockConfig } from "./blocks/ContentBlocks";
import { GalleryBlockConfig, VideoBlockConfig, AudioBlockConfig, LottieBlockConfig, PdfViewerBlockConfig } from "./blocks/MediaBlocks";
import { CounterBlockConfig, ProgressBarBlockConfig, StarRatingBlockConfig, TestimonialBlockConfig, ReviewBlockConfig } from "./blocks/DataBlocks";
import { SocialIconsBlockConfig, ShareButtonBlockConfig, FollowButtonBlockConfig } from "./blocks/SocialBlocks";
import { PricingTableBlockConfig, PricingListBlockConfig, CallToActionBlockConfig, AccordionBlockConfig, CountdownTimerBlockConfig, AlertBoxBlockConfig, TabsBlockConfig } from "./blocks/BusinessBlocks";
import { FormWrapperBlockConfig, InputTextBlockConfig, TextareaBlockConfig, CheckboxBlockConfig, RadioBlockConfig, SelectBlockConfig, DatePickerBlockConfig, FileUploadBlockConfig } from "./blocks/FormBlocks";
import { GlobalTemplateBlockConfig } from "./blocks/TemplateBlocks";
import { PopupModalBlockConfig, PopupSlideInBlockConfig } from "./blocks/PopupBlocks";
import { DynamicTextBlockConfig, DynamicImageBlockConfig, UserDataBlockConfig, DatabaseDataBlockConfig, ApiDataBlockConfig } from "./blocks/DynamicBlocks";
import { advancedFields, AdvancedWrapper } from "./blocks/AdvancedFields";


type Props = {
  HeadingBlock: { title: string };
  Text: { content: string };
  Hero: {
    titlePrimary: string;
    titleSecondary: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    badge: string;
    schoolName: string;
  };
  Programs: {};
  Testimonials: {};
  Fasilitas: {};
  Teachers: {};
  News: {};
  Gallery: {};
  Topbar: {};
  Header: {};
  Footer: {};
  AnnouncementsTicker: {};
  Achievements: {};
  Innovations: {};
  SpmbFaq: {};
  Stats: {};
  VideoMap: {};
  Welcome: {};
  SchoolConditions: {};
  FlexContainer: any;
  GridColumns: any;
  BasicText: any;
  BasicImage: any;
  BasicButton: any;
  // Content & Media
  Icon: any;
  Divider: any;
  Spacer: any;
  GalleryWidget: any;
  Video: any;
  Audio: any;
  Lottie: any;
  PdfViewer: any;
  // Data & Social
  Counter: any;
  ProgressBar: any;
  StarRating: any;
  Testimonial: any;
  Review: any;
  SocialIcons: any;
  ShareButton: any;
  FollowButton: any;
  // Business
  PricingTable: any;
  PricingList: any;
  CallToAction: any;
  Accordion: any;
  CountdownTimer: any;
  AlertBox: any;
  Tabs: any;
  // Forms
  FormWrapper: any;
  InputText: any;
  Textarea: any;
  Checkbox: any;
  Radio: any;
  Select: any;
  DatePicker: any;
  FileUpload: any;
  GlobalTemplate: any;
  // Popup
  PopupModal: any;
  PopupSlideIn: any;
  // Dynamic Content
  DynamicText: any;
  DynamicImage: any;
  UserData: any;
  DatabaseData: any;
  ApiData: any;
};

const rawConfig: Config<Props> = {
  categories: {
    layout: {
      components: ["FlexContainer", "GridColumns"],
      title: "1. Layout & Grid",
    },
    content: {
      components: ["BasicText", "BasicImage", "BasicButton", "Icon", "Divider", "Spacer"],
      title: "2. Content Elements",
    },
    media: {
      components: ["GalleryWidget", "Video", "Audio", "Lottie", "PdfViewer"],
      title: "3. Media Widgets",
    },
    data: {
      components: ["Counter", "ProgressBar", "StarRating", "Testimonial", "Review"],
      title: "4. Data & Reviews",
    },
    social: {
      components: ["SocialIcons", "ShareButton", "FollowButton"],
      title: "5. Social Widgets",
    },
    business: {
      components: ["PricingTable", "PricingList", "CallToAction", "Accordion", "Tabs", "CountdownTimer", "AlertBox"],
      title: "6. Business Widgets",
    },
    forms: {
      components: ["FormWrapper", "InputText", "Textarea", "Checkbox", "Radio", "Select", "DatePicker", "FileUpload"],
      title: "7. Form Builder",
    },
    template: {
      components: ["Topbar", "Header", "Hero", "Stats", "Welcome", "Teachers", "SchoolConditions", "Programs", "Achievements", "Innovations", "News", "VideoMap", "SpmbFaq", "AnnouncementsTicker", "Footer"],
      title: "SiberSaga Template Blocks",
    },
    templateSystem: {
      components: ["GlobalTemplate"],
      title: "8. Template System",
    },
    popup: {
      components: ["PopupModal", "PopupSlideIn"],
      title: "9. Popup Builder",
    },
    dynamic: {
      components: ["DynamicText", "DynamicImage", "UserData", "DatabaseData", "ApiData"],
      title: "10. Dynamic Content",
    },
  },
  components: {
    FlexContainer: FlexContainerConfig as any,
    GridColumns: GridColumnsConfig as any,
    BasicText: BasicTextConfig as any,
    BasicImage: BasicImageConfig as any,
    BasicButton: BasicButtonConfig as any,
    
    // Content Blocks
    Icon: IconBlockConfig as any,
    Divider: DividerBlockConfig as any,
    Spacer: SpacerBlockConfig as any,
    
    // Media Blocks
    GalleryWidget: GalleryBlockConfig as any,
    Video: VideoBlockConfig as any,
    Audio: AudioBlockConfig as any,
    Lottie: LottieBlockConfig as any,
    PdfViewer: PdfViewerBlockConfig as any,

    // Data Blocks
    Counter: CounterBlockConfig as any,
    ProgressBar: ProgressBarBlockConfig as any,
    StarRating: StarRatingBlockConfig as any,
    Testimonial: TestimonialBlockConfig as any,
    Review: ReviewBlockConfig as any,

    // Social Blocks
    SocialIcons: SocialIconsBlockConfig as any,
    ShareButton: ShareButtonBlockConfig as any,
    FollowButton: FollowButtonBlockConfig as any,

    // Business Blocks
    PricingTable: PricingTableBlockConfig as any,
    PricingList: PricingListBlockConfig as any,
    CallToAction: CallToActionBlockConfig as any,
    Accordion: AccordionBlockConfig as any,
    Tabs: TabsBlockConfig as any,
    CountdownTimer: CountdownTimerBlockConfig as any,
    AlertBox: AlertBoxBlockConfig as any,

    // Form Blocks
    FormWrapper: FormWrapperBlockConfig as any,
    InputText: InputTextBlockConfig as any,
    Textarea: TextareaBlockConfig as any,
    Checkbox: CheckboxBlockConfig as any,
    Radio: RadioBlockConfig as any,
    Select: SelectBlockConfig as any,
    DatePicker: DatePickerBlockConfig as any,
    FileUpload: FileUploadBlockConfig as any,
    GlobalTemplate: GlobalTemplateBlockConfig as any,

    // Popup Blocks
    PopupModal: PopupModalBlockConfig as any,
    PopupSlideIn: PopupSlideInBlockConfig as any,

    // Dynamic Content Blocks
    DynamicText: DynamicTextBlockConfig as any,
    DynamicImage: DynamicImageBlockConfig as any,
    UserData: UserDataBlockConfig as any,
    DatabaseData: DatabaseDataBlockConfig as any,
    ApiData: ApiDataBlockConfig as any,

    HeadingBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "Heading",
      },
      render: ({ title }) => (
        <div className="p-8 text-center">
          <h2 className="text-3xl font-bold text-brand-navy">{title}</h2>
        </div>
      ),
    },
    Text: {
      fields: {
        content: { type: "textarea" },
      },
      defaultProps: {
        content: "Enter text here...",
      },
      render: ({ content }) => (
        <div className="px-8 py-4 max-w-4xl mx-auto">
          <p className="text-[#64748B] leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      ),
    },
    Hero: {
      fields: {
        schoolName: { type: "text" },
        badge: { type: "text" },
        titlePrimary: { type: "text" },
        titleSecondary: { type: "text" },
        description: { type: "textarea" },
        primaryButton: { type: "text" },
        secondaryButton: { type: "text" },
      },
      defaultProps: {
        schoolName: "SIBER SAGA",
        badge: "SEKOLAH TERBAIK",
        titlePrimary: "Masa Depan Cerah",
        titleSecondary: "Dimulai di Sini",
        description: "Tempat terbaik untuk belajar dan berkembang.",
        primaryButton: "Daftar Sekarang",
        secondaryButton: "Pelajari Lebih Lanjut",
      },
      render: ({
        schoolName,
        badge,
        titlePrimary,
        titleSecondary,
        description,
        primaryButton,
        secondaryButton,
      }) => (
        <section className="bg-white py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 relative p-8 md:p-12 lg:p-14 flex flex-col lg:flex-row gap-8 items-center">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-sky/5 to-transparent pointer-events-none"></div>
              
              {/* Left Content Area */}
              <div className="flex-1 min-w-0 z-10">
                <span className="inline-flex items-center gap-1.5 bg-brand-sky/10 text-brand-sky px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-5">
                  <BookOpen size={13} />
                  <span>{badge}</span>
                </span>
                <span className="block text-[#64748B] font-bold text-[11px] uppercase tracking-[0.2em] mb-2 pl-0.5">
                  {schoolName}
                </span>
                <h1 className="text-brand-navy text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5 flex flex-wrap gap-x-2">
                  <span>{titlePrimary}</span> 
                  <span className="text-brand-sky w-full mt-2">
                    {titleSecondary}
                  </span>
                </h1>
                <p className="text-[#64748B] text-sm md:text-base leading-relaxed max-w-xl mb-8 font-normal whitespace-pre-wrap">
                  {description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <button className="bg-brand-sky hover:bg-brand-sky/95 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-brand-sky/20 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer opacity-100">
                    <span>{primaryButton}</span>
                    <ArrowRight size={15} />
                  </button>
                  <button className="border-2 border-brand-light text-brand-navy hover:bg-brand-light px-8 py-3.5 rounded-2xl font-bold text-sm bg-white transition-all transform active:scale-95 cursor-pointer">
                    <span>{secondaryButton}</span>
                  </button>
                </div>
              </div>

              {/* Right Placeholder Visual */}
              <div className="w-full lg:w-[440px] xl:w-[500px] shrink-0 z-10">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-brand-light border border-slate-100 shadow-md flex items-center justify-center text-slate-400">
                  <p>Visual Area / 3D Graphics</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ),
    },
    Programs: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        badge: { type: "text" },
        programs: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            title: { type: "text" },
            description: { type: "text" },
            iconName: { type: "text" },
            delay: { type: "number" },
          }
        }
      },
      render: (props) => <Programs {...props} />,
    },
    Testimonials: {
      fields: {
        badge: { type: "text" },
        title: { type: "text" },
        subtitle: { type: "text" },
      },
      render: (props) => <Testimonials {...props} />,
    },
    Fasilitas: {
      render: () => <SchoolFacilities />,
    },
    Teachers: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        teachers: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            name: { type: "text" },
            role: { type: "text" },
            image: { type: "text" },
          }
        }
      },
      render: (props) => <Teachers {...props} />,
    },
    News: {
      fields: {
        badge: { type: "text" },
        title: { type: "text" },
        subtitle: { type: "text" },
        news: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            title: { type: "text" },
            excerpt: { type: "text" },
            date: { type: "text" },
            author: { type: "text" },
            category: { type: "text" },
            readTime: { type: "text" },
            image: { type: "text" },
            content: { type: "textarea" },
          }
        }
      },
      render: (props) => <News {...props} />,
    },
    Gallery: {
      fields: {
        badge: { type: "text" },
        title: { type: "text" },
        subtitle: { type: "text" },
      },
      render: (props) => <Gallery {...props} />,
    },
    Topbar: {
      fields: {
        contactEmail: { type: "text" },
        announcement: { type: "text" },
        socialUrls: {
          type: "object",
          objectFields: {
            instagram: { type: "text" },
            youtube: { type: "text" }
          }
        }
      },
      render: (props) => <Topbar {...props} />,
    },
    Header: {
      fields: {
        brandTitle: { type: "text" },
        tagline: { type: "text" },
      },
      render: (props) => <Header {...props} />,
    },
    Footer: {
      fields: {
        brandTitle: { type: "text" },
        tagline: { type: "text" },
        description: { type: "textarea" },
        address: { type: "textarea" },
        email: { type: "text" },
        phone: { type: "text" },
        quickLinksTitle: { type: "text" },
        socialTitle: { type: "text" },
        bottomText: { type: "textarea" }
      },
      render: (props) => <Footer {...props} />,
    },
    AnnouncementsTicker: {
      render: () => <AnnouncementsTicker />,
    },
    Achievements: {
      fields: {
        badge: { type: "text" },
        title: { type: "text" },
        subtitle: { type: "text" },
        achievements: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            title: { type: "text" },
            winner: { type: "text" },
            level: { type: "text" },
            year: { type: "text" },
            image: { type: "text" },
            category: { type: "text" },
          }
        }
      },
      render: (props) => <Achievements {...props} />,
    },
    Innovations: {
      fields: {
        badge: { type: "text" },
        title: { type: "text" },
        subtitle: { type: "text" },
        innovations: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            title: { type: "text" },
            description: { type: "textarea" },
            image: { type: "text" },
            category: { type: "text" },
            year: { type: "text" },
            impact: { type: "text" },
          }
        }
      },
      render: (props) => <Innovations {...props} />,
    },
    SpmbFaq: {
      render: () => <SpmbFaq />,
    },
    Stats: {
      fields: {
        stats: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            value: { type: "text" },
            label: { type: "text" },
            iconName: { type: "text" },
            color: { type: "text" },
          }
        }
      },
      render: (props) => <Stats {...props} />,
    },
    VideoMap: {
      fields: {
        badge: { type: "text" },
        title: { type: "text" },
        subtitle: { type: "text" },
        mapUrl: { type: "text" },
      },
      render: (props) => <VideoMap {...props} />,
    },
    Welcome: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        features: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            title: { type: "text" },
            description: { type: "text" },
            iconName: { type: "text" },
            color: { type: "text" }
          }
        }
      },
      render: (props) => <Welcome {...props} />,
    },
    SchoolConditions: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        images: {
          type: "array",
          arrayFields: {
            url: { type: "text" },
            caption: { type: "text" }
          }
        }
      },
      render: (props) => <SchoolConditions {...props} />,
    }
  },
};

const enhancedComponents = { ...rawConfig.components };

for (const [key, compConfig] of Object.entries(enhancedComponents)) {
  const component = compConfig as any;
  if (!component) continue;

  component.fields = {
    ...(component.fields || {}),
    ...advancedFields,
  };

  const OriginalRender = component.render;
  if (OriginalRender) {
    component.render = function EnhancedRender(props: any) {
      return (
        <AdvancedWrapper props={props}>
          <OriginalRender {...props} />
        </AdvancedWrapper>
      );
    };
  }
}

export const config = {
  ...rawConfig,
  components: enhancedComponents,
} as Config<Props>;
