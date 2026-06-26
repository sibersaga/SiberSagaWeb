import React from "react";
import Lottie from "lottie-react";

export const GalleryBlockConfig = {
  fields: {
    images: {
      type: "array" as const,
      arrayFields: {
        url: { type: "text" as const },
        alt: { type: "text" as const },
      },
    },
    columns: { type: "number" as const },
    gap: { type: "text" as const },
  },
  defaultProps: {
    images: [
      { url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400", alt: "Gallery 1" },
      { url: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&q=80&w=400", alt: "Gallery 2" },
      { url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400", alt: "Gallery 3" },
    ],
    columns: 3,
    gap: "1rem",
  },
  render: ({ images, columns, gap }: any) => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: gap || "1rem",
          width: "100%",
        }}
      >
        {images.map((img: any, i: number) => (
          <img
            key={i}
            src={img.url}
            alt={img.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "0.5rem" }}
          />
        ))}
      </div>
    );
  },
};

export const VideoBlockConfig = {
  fields: {
    url: { type: "text" as const },
    width: { type: "text" as const },
    aspectRatio: {
      type: "select" as const,
      options: [
        { label: "16:9", value: "16 / 9" },
        { label: "4:3", value: "4 / 3" },
        { label: "1:1", value: "1 / 1" },
      ],
    },
  },
  defaultProps: {
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    width: "100%",
    aspectRatio: "16 / 9",
  },
  render: ({ url, width, aspectRatio }: any) => {
    return (
      <div style={{ width: width || "100%", aspectRatio: aspectRatio || "16 / 9" }}>
        <iframe
          src={url}
          style={{ width: "100%", height: "100%", border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  },
};

export const AudioBlockConfig = {
  fields: {
    url: { type: "text" as const },
    autoPlay: { type: "radio" as const, options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] },
    controls: { type: "radio" as const, options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] },
  },
  defaultProps: {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    autoPlay: "false",
    controls: "true",
  },
  render: ({ url, autoPlay, controls }: any) => {
    return (
      <audio
        src={url}
        autoPlay={autoPlay === "true"}
        controls={controls === "true"}
        style={{ width: "100%" }}
      />
    );
  },
};

export const LottieBlockConfig = {
  fields: {
    animationUrl: { type: "text" as const },
    width: { type: "text" as const },
    height: { type: "text" as const },
    loop: { type: "radio" as const, options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] },
    autoplay: { type: "radio" as const, options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] },
  },
  defaultProps: {
    animationUrl: "https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json",
    width: "200px",
    height: "200px",
    loop: "true",
    autoplay: "true",
  },
  render: ({ animationUrl, width, height, loop, autoplay }: any) => {
    // Note: Lottie-react requires animation data to be fetched and passed, or passed directly if it's an object.
    // However, if we just give it a URL, we need to fetch it first.
    // A simple workaround for Puck is using a state to fetch the Lottie JSON.
    const [animationData, setAnimationData] = React.useState<any>(null);

    React.useEffect(() => {
      if (animationUrl) {
        fetch(animationUrl)
          .then((res) => res.json())
          .then((data) => setAnimationData(data))
          .catch((err) => console.error("Lottie fetch error", err));
      }
    }, [animationUrl]);

    if (!animationData) {
      return <div style={{ width, height, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Lottie...</div>;
    }

    return (
      <div style={{ width: width || "200px", height: height || "200px" }}>
        <Lottie
          animationData={animationData}
          loop={loop === "true"}
          autoplay={autoplay === "true"}
        />
      </div>
    );
  },
};

export const PdfViewerBlockConfig = {
  fields: {
    pdfUrl: { type: "text" as const },
    width: { type: "text" as const },
    height: { type: "text" as const },
  },
  defaultProps: {
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    width: "100%",
    height: "500px",
  },
  render: ({ pdfUrl, width, height }: any) => {
    return (
      <div style={{ width: width || "100%", height: height || "500px", border: "1px solid #e5e7eb", borderRadius: "0.5rem", overflow: "hidden" }}>
        <iframe src={pdfUrl} width="100%" height="100%" style={{ border: "none" }} title="PDF Viewer" />
      </div>
    );
  },
};
