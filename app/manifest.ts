import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saurabh Dixit - The Systems Blueprint",
    short_name: "Saurabh Dixit",
    description:
      "Portfolio of Saurabh Dixit: VP of Engineering and Full-Stack Systems Engineer.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0D10",
    theme_color: "#FF6A2B",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
