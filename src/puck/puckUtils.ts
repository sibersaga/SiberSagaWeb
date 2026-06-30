/**
 * puckUtils.ts
 * Utility to build a Puck-compatible layout (content + root + nested zones) from AdminContext data.
 * This ensures the visual editor starts pre-populated with real website content structured in containers and grids.
 */

import type { SiteContent } from "../context/AdminContext";

/**
 * Builds a complete Puck page data object from AdminContext's siteContent.
 * The resulting object can be passed directly to <Puck data={...}> or <Render data={...}/>.
 */
export function buildDynamicLayout(
  siteContent: SiteContent,
  programs: any[],
  teachers: any[],
  stats: any[],
  achievements: any[],
  innovations: any[],
  news: any[]
) {
  const { hero, topbar, header, footer, welcome, ticker, sectionOrder, hiddenSections } = siteContent;

  // Helper: skip hidden sections
  const isVisible = (id: string) => !hiddenSections.includes(id);

  // Initialize child zones mapping
  const zones: Record<string, any[]> = {};

  // 1. Convert HERO to Grid & Flex Container model
  const heroGridId = "hero_grid";
  const heroLeftFlexId = "hero_left_flex";
  const heroBtnFlexId = "hero_btn_flex";

  zones[`${heroGridId}:col-0`] = [
    {
      type: "FlexContainer",
      props: {
        id: heroLeftFlexId,
        layoutType: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        alignItems: "flex-start",
        padding: "0"
      }
    }
  ];

  zones[`${heroGridId}:col-1`] = [
    {
      type: "BasicImage",
      props: {
        id: "hero_img",
        url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000",
        alt: "Gedung Sekolah",
        borderRadius: "1.5rem",
        width: "100%",
        height: "400px",
        objectFit: "cover"
      }
    }
  ];

  zones[`${heroLeftFlexId}:content`] = [
    {
      type: "BasicText",
      props: {
        id: "hero_badge_text",
        tag: "span",
        text: hero.badge || "Penerimaan Peserta Didik Baru",
        color: "#2563eb",
        fontSize: "0.875rem",
        fontWeight: "700"
      }
    },
    {
      type: "BasicText",
      props: {
        id: "hero_title_text",
        tag: "h1",
        text: `${hero.titlePrimary} ${hero.titleSecondary}`,
        color: "#0f172a",
        fontSize: "3rem",
        fontWeight: "800"
      }
    },
    {
      type: "BasicText",
      props: {
        id: "hero_desc_text",
        tag: "p",
        text: hero.description,
        color: "#475569",
        fontSize: "1.125rem",
        fontWeight: "400"
      }
    },
    {
      type: "FlexContainer",
      props: {
        id: heroBtnFlexId,
        layoutType: "flex",
        flexDirection: "row",
        gap: "1rem",
        padding: "0"
      }
    }
  ];

  zones[`${heroBtnFlexId}:content`] = [
    {
      type: "BasicButton",
      props: {
        id: "hero_btn_primary",
        label: hero.primaryButton || "Daftar Sekarang",
        variant: "primary",
        size: "lg"
      }
    },
    {
      type: "BasicButton",
      props: {
        id: "hero_btn_secondary",
        label: hero.secondaryButton || "Profil Sekolah",
        variant: "secondary",
        size: "lg"
      }
    }
  ];

  // 2. Convert STATS to Grid & Flex Container model
  const statsGridId = "stats_grid";
  stats.forEach((stat, idx) => {
    const statFlexId = `stat_flex_${idx}`;
    zones[`${statsGridId}:col-${idx}`] = [
      {
        type: "FlexContainer",
        props: {
          id: statFlexId,
          layoutType: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          padding: "1rem"
        }
      }
    ];

    zones[`${statFlexId}:content`] = [
      {
        type: "BasicText",
        props: {
          id: `stat_val_${idx}`,
          tag: "span",
          text: stat.value,
          color: "#38bdf8",
          fontSize: "2.5rem",
          fontWeight: "800"
        }
      },
      {
        type: "BasicText",
        props: {
          id: `stat_lbl_${idx}`,
          tag: "p",
          text: stat.label,
          color: "#94a3b8",
          fontSize: "0.875rem",
          fontWeight: "600",
          textAlign: "center"
        }
      }
    ];
  });

  // 3. Convert WELCOME to Grid & Flex Container model
  const welcomeContainerId = "welcome_container";
  const welcomeGridId = "welcome_grid";
  const welcomeLeftFlexId = "welcome_left_flex";
  const welcomeRightFlexId = "welcome_right_flex";

  zones[`${welcomeContainerId}:content`] = [
    {
      type: "BasicText",
      props: {
        id: "welcome_eyebrow",
        tag: "span",
        text: welcome.eyebrow || "KATA SAMBUTAN",
        color: "#2563eb",
        fontSize: "0.875rem",
        fontWeight: "700"
      }
    },
    {
      type: "BasicText",
      props: {
        id: "welcome_title",
        tag: "h2",
        text: welcome.title || "Sambutan Kepala Sekolah",
        color: "#0f172a",
        fontSize: "2.25rem",
        fontWeight: "800"
      }
    },
    {
      type: "BasicText",
      props: {
        id: "welcome_desc",
        tag: "p",
        text: welcome.description || "Selamat datang di website resmi kami.",
        color: "#475569",
        fontSize: "1.125rem",
        fontWeight: "400"
      }
    },
    {
      type: "GridColumns",
      props: {
        id: welcomeGridId,
        columns: 2,
        gap: "2.5rem",
        padding: "1rem 0"
      }
    }
  ];

  zones[`${welcomeGridId}:col-0`] = [
    {
      type: "FlexContainer",
      props: {
        id: welcomeLeftFlexId,
        layoutType: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "0"
      }
    }
  ];

  zones[`${welcomeLeftFlexId}:content`] = [
    {
      type: "BasicText",
      props: {
        id: "welcome_quote",
        tag: "span",
        text: `"${welcome.tabs.sambutan.quote}"`,
        color: "#1e293b",
        fontSize: "1.125rem",
        fontWeight: "600"
      }
    },
    ...welcome.tabs.sambutan.paragraphs.map((pText: string, idx: number) => ({
      type: "BasicText",
      props: {
        id: `welcome_p_${idx}`,
        tag: "p",
        text: pText,
        color: "#475569",
        fontSize: "1rem"
      }
    })),
    {
      type: "BasicText",
      props: {
        id: "welcome_closing",
        tag: "p",
        text: welcome.tabs.sambutan.closing,
        color: "#0f172a",
        fontWeight: "700",
        margin: "1rem 0 0 0"
      }
    }
  ];

  zones[`${welcomeGridId}:col-1`] = [
    {
      type: "FlexContainer",
      props: {
        id: welcomeRightFlexId,
        layoutType: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "0"
      }
    }
  ];

  zones[`${welcomeRightFlexId}:content`] = [
    {
      type: "BasicText",
      props: {
        id: "visi_title",
        tag: "h3",
        text: welcome.tabs.visi.title || "Visi Sekolah",
        color: "#0f172a",
        fontSize: "1.5rem",
        fontWeight: "700"
      }
    },
    {
      type: "BasicText",
      props: {
        id: "visi_desc",
        tag: "p",
        text: welcome.tabs.visi.description,
        color: "#475569"
      }
    },
    {
      type: "BasicText",
      props: {
        id: "misi_title",
        tag: "h3",
        text: welcome.tabs.misi.title || "Misi Sekolah",
        color: "#0f172a",
        fontSize: "1.5rem",
        fontWeight: "700",
        margin: "1rem 0 0 0"
      }
    },
    ...welcome.tabs.misi.items.map((item: string, idx: number) => ({
      type: "BasicText",
      props: {
        id: `misi_item_${idx}`,
        tag: "p",
        text: `${idx + 1}. ${item}`,
        color: "#475569"
      }
    }))
  ];


  // Build section maps
  const sectionMap: Record<string, any> = {
    hero: {
      type: "GridColumns",
      props: {
        id: heroGridId,
        columns: 2,
        gap: "2rem",
        padding: "5rem 2rem",
        alignItems: "center",
        backgroundColor: "#f8fafc"
      },
    },
    stats: {
      type: "GridColumns",
      props: {
        id: statsGridId,
        columns: stats.length || 4,
        gap: "2rem",
        padding: "3rem 2rem",
        backgroundColor: "#1e293b"
      },
    },
    welcome: {
      type: "FlexContainer",
      props: {
        id: welcomeContainerId,
        layoutType: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        padding: "5rem 2rem"
      },
    },
    teachers: {
      type: "Teachers",
      props: {
        id: "teachers",
        teachers: teachers,
      },
    },
    conditions: {
      type: "SchoolConditions",
      props: {
        id: "conditions",
      },
    },
    programs: {
      type: "Programs",
      props: {
        id: "programs",
        programs: programs,
      },
    },
    achievements: {
      type: "Achievements",
      props: {
        id: "achievements",
        achievements: achievements,
      },
    },
    innovations: {
      type: "Innovations",
      props: {
        id: "innovations",
        innovations: innovations,
      },
    },
    news: {
      type: "News",
      props: {
        id: "news",
        news: news,
      },
    },
    gallery: {
      type: "Gallery",
      props: {
        id: "gallery",
      },
    },
    services: {
      type: "SpmbFaq",
      props: {
        id: "services",
      },
    },
    testimonials: {
      type: "Testimonials",
      props: {
        id: "testimonials",
      },
    },
    videomap: {
      type: "VideoMap",
      props: {
        id: "videomap",
      },
    },
    spmb: {
      type: "SpmbFaq",
      props: {
        id: "spmb",
      },
    },
  };

  // Always add Topbar, Header at the top
  const headerBlocks = [
    {
      type: "Topbar",
      props: {
        id: "topbar",
        contactEmail: topbar.contactEmail,
        announcement: ticker.items[0] ?? "",
        socialUrls: {
          instagram: topbar.instagramUrl,
          youtube: topbar.youtubeUrl,
        },
      },
    },
    {
      type: "Header",
      props: {
        id: "header",
        brandTitle: header.brandTitle,
        tagline: header.tagline,
      },
    },
    {
      type: "AnnouncementsTicker",
      props: {
        id: "ticker",
      },
    },
  ];

  // Build ordered section blocks, respecting sectionOrder and hiddenSections
  const orderedBlocks = sectionOrder
    .filter((id) => isVisible(id) && sectionMap[id])
    .map((id) => sectionMap[id]);

  // Always add Footer at the bottom
  const footerBlock = {
    type: "Footer",
    props: {
      id: "footer",
      brandTitle: footer.brandTitle,
      tagline: footer.tagline,
      description: footer.description,
      address: footer.address,
      phone: footer.phone,
      email: footer.email,
      quickLinksTitle: footer.quickLinksTitle,
      socialTitle: footer.mediaTitle,
      bottomText: footer.copyright,
    },
  };

  return {
    content: [...headerBlocks, ...orderedBlocks, footerBlock],
    zones: zones,
    root: {},
  };
}
