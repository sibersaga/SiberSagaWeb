/**
 * puckUtils.ts
 * Utility to build a Puck-compatible layout (content + root) from AdminContext data.
 * This ensures the visual editor starts pre-populated with real website content.
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

  // Build sections based on sectionOrder
  const sectionMap: Record<string, any> = {
    hero: {
      type: "Hero",
      props: {
        id: "hero",
        badge: hero.badge,
        schoolName: hero.schoolName,
        titlePrimary: hero.titlePrimary,
        titleSecondary: hero.titleSecondary,
        description: hero.description,
        primaryButton: hero.primaryButton,
        secondaryButton: hero.secondaryButton,
      },
    },
    stats: {
      type: "Stats",
      props: {
        id: "stats",
        stats: stats,
      },
    },
    welcome: {
      type: "Welcome",
      props: {
        id: "welcome",
        title: welcome.title,
        subtitle: welcome.description,
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
    root: {},
  };
}
